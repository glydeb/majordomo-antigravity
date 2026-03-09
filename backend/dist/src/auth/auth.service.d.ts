import { WebAuthnService } from './webauthn.service';
export declare class AuthService {
    private webAuthnService;
    constructor(webAuthnService: WebAuthnService);
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
