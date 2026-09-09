import { BiometricsService } from './biometrics.service.js';
import { CreateBiometricDto } from './dto/create-biometric.dto.js';
export declare class BiometricsController {
    private readonly biometricsService;
    constructor(biometricsService: BiometricsService);
    create(userId: string, createBiometricDto: CreateBiometricDto): Promise<{
        id: string;
        userId: string;
        source: string;
        metricType: string;
        value: string;
        timestamp: Date;
    }>;
    findAll(userId: string, metricType?: string, source?: string): Promise<{
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
