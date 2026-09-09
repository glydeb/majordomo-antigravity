import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(userId: string, createProjectDto: CreateProjectDto): Promise<{
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
    findAll(userId: string): Promise<{
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
    update(id: string, userId: string, updateProjectDto: UpdateProjectDto): Promise<{
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
