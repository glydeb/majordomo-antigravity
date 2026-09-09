import { ContextsService } from './contexts.service.js';
import { CreateContextDto } from './dto/create-context.dto.js';
import { UpdateContextDto } from './dto/update-context.dto.js';
export declare class ContextsController {
    private readonly contextsService;
    constructor(contextsService: ContextsService);
    create(userId: string, createContextDto: CreateContextDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        _count?: {
            tasks: number;
        };
    }>;
    findAll(userId: string): Promise<{
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
    update(id: string, userId: string, updateContextDto: UpdateContextDto): Promise<{
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
