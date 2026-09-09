import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(userId: string, createTaskDto: CreateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: string;
        contextId: string | null;
        projectId: string | null;
        dueDate: string | null;
        energyLevel: string | null;
        estimatedDuration: number | null;
    }>;
    findAll(userId: string, status?: string, contextId?: string, projectId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: string;
        contextId: string | null;
        projectId: string | null;
        dueDate: string | null;
        energyLevel: string | null;
        estimatedDuration: number | null;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: string;
        contextId: string | null;
        projectId: string | null;
        dueDate: string | null;
        energyLevel: string | null;
        estimatedDuration: number | null;
    }>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        description: string | null;
        status: string;
        contextId: string | null;
        projectId: string | null;
        dueDate: string | null;
        energyLevel: string | null;
        estimatedDuration: number | null;
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
