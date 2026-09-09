import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateBiometricDto } from './dto/create-biometric.dto.js';
export declare class BiometricsService {
    private prisma;
    private encryptionService;
    constructor(prisma: PrismaService, encryptionService: EncryptionService);
    private decryptLog;
    create(userId: string, dto: CreateBiometricDto): Promise<{
        id: string;
        userId: string;
        source: string;
        metricType: string;
        value: string;
        timestamp: Date;
    }>;
    findAllForUser(userId: string, filters?: {
        metricType?: string;
        source?: string;
    }): Promise<{
        id: string;
        userId: string;
        source: string;
        metricType: string;
        value: string;
        timestamp: Date;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        source: string;
        metricType: string;
        value: string;
        timestamp: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
