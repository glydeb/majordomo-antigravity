import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
export declare class ProjectsService {
    private prisma;
    private encryptionService;
    constructor(prisma: PrismaService, encryptionService: EncryptionService);
    private decryptProject;
    create(userId: string, dto: CreateProjectDto): Promise<{
        name: string;
        description: string | null;
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
        description: string | null;
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
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        _count?: {
            tasks: number;
        };
    }>;
    update(id: string, userId: string, dto: UpdateProjectDto): Promise<{
        name: string;
        description: string | null;
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
