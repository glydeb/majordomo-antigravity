"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const server_1 = require("@simplewebauthn/server");
const config_1 = require("@nestjs/config");
let WebAuthnService = class WebAuthnService {
    prisma;
    configService;
    rpName = 'LifeOS';
    rpID;
    origin;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.rpID = this.configService.get('RP_ID') || 'localhost';
        this.origin = this.configService.get('ORIGIN') || 'http://localhost:5173';
    }
    async generateRegistration(email) {
        let user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: { email, passwordHash: '' },
            });
        }
        const credentials = user.passkeyCredentials || [];
        const options = await (0, server_1.generateRegistrationOptions)({
            rpName: this.rpName,
            rpID: this.rpID,
            userName: user.email,
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
    async verifyRegistration(user, response, expectedChallenge) {
        let verification;
        try {
            verification = await (0, server_1.verifyRegistrationResponse)({
                response,
                expectedChallenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
        const { verified, registrationInfo } = verification;
        if (verified && registrationInfo) {
            const existingCredentials = user.passkeyCredentials || [];
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
    async generateAuthentication(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const credentials = user.passkeyCredentials || [];
        const options = await (0, server_1.generateAuthenticationOptions)({
            rpID: this.rpID,
            allowCredentials: credentials.map((cred) => ({
                id: cred.credentialID,
                type: 'public-key',
            })),
            userVerification: 'preferred',
        });
        return { options, user };
    }
    async verifyAuthentication(user, response, expectedChallenge) {
        const credentials = user.passkeyCredentials || [];
        const credential = credentials.find((c) => c.credentialID === response.id);
        if (!credential) {
            throw new common_1.BadRequestException('Authenticator is not registered with this site');
        }
        let verification;
        try {
            verification = await (0, server_1.verifyAuthenticationResponse)({
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
        const { verified, authenticationInfo } = verification;
        if (verified) {
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
};
exports.WebAuthnService = WebAuthnService;
exports.WebAuthnService = WebAuthnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], WebAuthnService);
//# sourceMappingURL=webauthn.service.js.map