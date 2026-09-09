import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateContextDto } from './dto/create-context.dto.js';
import { UpdateContextDto } from './dto/update-context.dto.js';
export declare class ContextsService {
    private prisma;
    private encryptionService;
    constructor(prisma: PrismaService, encryptionService: EncryptionService);
    private decryptContext;
    create(userId: string, dto: CreateContextDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        _count?: {
            tasks: number;
        };
    }>;
    findAllForUser(userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        _count?: {
            tasks: number;
        };
    }[]>;
    findOne(id: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        _count?: {
            tasks: number;
        };
    }>;
    update(id: string, userId: string, dto: UpdateContextDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        _count?: {
            tasks: number;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
