"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const encryption_service_js_1 = require("../auth/encryption.service.js");
let ProjectsService = class ProjectsService {
    prisma;
    encryptionService;
    constructor(prisma, encryptionService) {
        this.prisma = prisma;
        this.encryptionService = encryptionService;
    }
    decryptProject(project) {
        return {
            ...project,
            name: project.name ? this.encryptionService.decrypt(project.name) : project.name,
            description: project.description ? this.encryptionService.decrypt(project.description) : project.description,
        };
    }
    async create(userId, dto) {
        const data = { userId };
        if (dto.name)
            data.name = this.encryptionService.encrypt(dto.name);
        if (dto.description)
            data.description = this.encryptionService.encrypt(dto.description);
        const project = await this.prisma.project.create({ data });
        return this.decryptProject(project);
    }
    async findAllForUser(userId) {
        const projects = await this.prisma.project.findMany({
            where: { userId },
            include: {
                _count: { select: { tasks: true } }
            }
        });
        return projects.map(p => this.decryptProject(p));
    }
    async findOne(id, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { _count: { select: { tasks: true } } }
        });
        if (!project || project.userId !== userId) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.decryptProject(project);
    }
    async update(id, userId, dto) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project || project.userId !== userId) {
            throw new common_1.NotFoundException('Project not found');
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name ? this.encryptionService.encrypt(dto.name) : null;
        if (dto.description !== undefined)
            data.description = dto.description ? this.encryptionService.encrypt(dto.description) : null;
        const updatedProject = await this.prisma.project.update({
            where: { id },
            data,
        });
        return this.decryptProject(updatedProject);
    }
    async remove(id, userId) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project || project.userId !== userId) {
            throw new common_1.NotFoundException('Project not found');
        }
        await this.prisma.project.delete({ where: { id } });
        return { success: true };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        encryption_service_js_1.EncryptionService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map