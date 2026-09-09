import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import type { Task } from '@prisma/client';
export declare class TasksService {
    private prisma;
    private encryptionService;
    constructor(prisma: PrismaService, encryptionService: EncryptionService);
    private decryptTask;
    create(userId: string, dto: CreateTaskDto): Promise<Task>;
    findAllForUser(userId: string, filters?: {
        status?: string;
        contextId?: string;
        projectId?: string;
    }): Promise<Task[]>;
    findOne(id: string, userId: string): Promise<Task>;
    update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
