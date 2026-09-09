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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const encryption_service_js_1 = require("../auth/encryption.service.js");
let TasksService = class TasksService {
    prisma;
    encryptionService;
    constructor(prisma, encryptionService) {
        this.prisma = prisma;
        this.encryptionService = encryptionService;
    }
    decryptTask(task) {
        return {
            ...task,
            title: task.title ? this.encryptionService.decrypt(task.title) : task.title,
            description: task.description ? this.encryptionService.decrypt(task.description) : task.description,
            dueDate: task.dueDate ? this.encryptionService.decrypt(task.dueDate) : task.dueDate,
        };
    }
    async create(userId, dto) {
        const data = {
            ...dto,
            userId,
            status: dto.status || 'Inbox',
        };
        if (dto.title)
            data.title = this.encryptionService.encrypt(dto.title);
        if (dto.description)
            data.description = this.encryptionService.encrypt(dto.description);
        if (dto.dueDate)
            data.dueDate = this.encryptionService.encrypt(dto.dueDate);
        const task = await this.prisma.task.create({ data });
        return this.decryptTask(task);
    }
    async findAllForUser(userId, filters) {
        const where = { userId };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.contextId)
            where.contextId = filters.contextId;
        if (filters?.projectId)
            where.projectId = filters.projectId;
        const tasks = await this.prisma.task.findMany({ where });
        return tasks.map(task => this.decryptTask(task));
    }
    async findOne(id, userId) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            throw new common_1.NotFoundException('Task not found');
        }
        return this.decryptTask(task);
    }
    async update(id, userId, dto) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            throw new common_1.NotFoundException('Task not found');
        }
        const data = { ...dto };
        if (dto.title !== undefined)
            data.title = dto.title ? this.encryptionService.encrypt(dto.title) : null;
        if (dto.description !== undefined)
            data.description = dto.description ? this.encryptionService.encrypt(dto.description) : null;
        if (dto.dueDate !== undefined)
            data.dueDate = dto.dueDate ? this.encryptionService.encrypt(dto.dueDate) : null;
        const updatedTask = await this.prisma.task.update({
            where: { id },
            data,
        });
        return this.decryptTask(updatedTask);
    }
    async remove(id, userId) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.prisma.task.delete({ where: { id } });
        return { success: true };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        encryption_service_js_1.EncryptionService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map