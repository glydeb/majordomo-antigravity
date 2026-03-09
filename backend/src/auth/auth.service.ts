import { Injectable } from '@nestjs/common';
import { WebAuthnService } from './webauthn.service';

@Injectable()
export class AuthService {
  constructor(private webAuthnService: WebAuthnService) {}

  generateRegistration(email: string) {
    return this.webAuthnService.generateRegistration(email);
  }

  verifyRegistration(user: any, response: any, expectedChallenge: string) {
    return this.webAuthnService.verifyRegistration(user, response, expectedChallenge);
  }

  generateAuthentication(email: string) {
    return this.webAuthnService.generateAuthentication(email);
  }

  verifyAuthentication(user: any, response: any, expectedChallenge: string) {
    return this.webAuthnService.verifyAuthentication(user, response, expectedChallenge);
  }
}
