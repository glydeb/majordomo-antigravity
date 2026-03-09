import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class WebAuthnService {
    private prisma;
    private configService;
    private rpName;
    private rpID;
    private origin;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateRegistration(email: string): Promise<{
        options: import("@simplewebauthn/server").PublicKeyCredentialCreationOptionsJSON;
        user: {
            id: string;
            email: string;
            passwordHash: string;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            passkeyCredentials: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyRegistration(user: any, response: any, expectedChallenge: string): Promise<boolean>;
    generateAuthentication(email: string): Promise<{
        options: import("@simplewebauthn/server").PublicKeyCredentialRequestOptionsJSON;
        user: {
            id: string;
            email: string;
            passwordHash: string;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            passkeyCredentials: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyAuthentication(user: any, response: any, expectedChallenge: string): Promise<boolean>;
}
