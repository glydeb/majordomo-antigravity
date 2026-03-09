import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebAuthnService {
  private rpName = 'LifeOS';
  private rpID: string;
  private origin: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.rpID = this.configService.get<string>('RP_ID') || 'localhost';
    this.origin = this.configService.get<string>('ORIGIN') || 'http://localhost:5173';
  }

  async generateRegistration(email: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, passwordHash: '' }, // No password hash for passkey only
      });
    }

    const credentials = (user.passkeyCredentials as any[]) || [];

    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpID,
      userName: user.email,
      // Don't prompt users for their authenticator if they already registered it
      excludeCredentials: credentials.map((cred) => ({
        id: cred.credentialID,
        type: 'public-key',
      })),
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    return { options, user };
  }

  async verifyRegistration(user: any, response: any, expectedChallenge: string) {
    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge,
        expectedOrigin: this.origin,
        expectedRPID: this.rpID,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const existingCredentials = (user.passkeyCredentials as any[]) || [];
      const newCredential = {
        credentialID: registrationInfo.credential.id,
        credentialPublicKey: registrationInfo.credential.publicKey,
        counter: registrationInfo.credential.counter,
      };

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passkeyCredentials: [...existingCredentials, newCredential],
        },
      });
    }

    return verified;
  }

  async generateAuthentication(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const credentials = (user.passkeyCredentials as any[]) || [];

    const options = await generateAuthenticationOptions({
      rpID: this.rpID,
      allowCredentials: credentials.map((cred) => ({
        id: cred.credentialID,
        type: 'public-key',
      })),
      userVerification: 'preferred',
    });

    return { options, user };
  }

  async verifyAuthentication(user: any, response: any, expectedChallenge: string) {
    const credentials = (user.passkeyCredentials as any[]) || [];
    const credential = credentials.find((c) => c.credentialID === response.id);

    if (!credential) {
      throw new BadRequestException('Authenticator is not registered with this site');
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin: this.origin,
        expectedRPID: this.rpID,
        credential: {
          id: credential.credentialID,
          publicKey: credential.credentialPublicKey,
          counter: credential.counter,
        },
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }

    const { verified, authenticationInfo } = verification;

    if (verified) {
      // Update counter
      credential.counter = authenticationInfo.newCounter;
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passkeyCredentials: credentials,
        },
      });
    }

    return verified;
  }
}
