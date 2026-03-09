import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private configService;
    private readonly algorithm;
    private readonly secretKey;
    constructor(configService: ConfigService);
    encrypt(text: string): string;
    decrypt(encryptedData: string): string;
}
