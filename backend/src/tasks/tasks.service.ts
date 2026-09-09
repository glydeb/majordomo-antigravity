import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import type { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  private decryptTask(task: Task): Task {
    return {
      ...task,
      title: task.title ? this.encryptionService.decrypt(task.title) : task.title,
      description: task.description ? this.encryptionService.decrypt(task.description) : task.description,
      dueDate: task.dueDate ? this.encryptionService.decrypt(task.dueDate) : task.dueDate,
    };
  }

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const data: any = {
      ...dto,
      userId,
      status: dto.status || 'Inbox',
    };

    if (dto.title) data.title = this.encryptionService.encrypt(dto.title);
    if (dto.description) data.description = this.encryptionService.encrypt(dto.description);
    if (dto.dueDate) data.dueDate = this.encryptionService.encrypt(dto.dueDate);

    const task = await this.prisma.task.create({ data });
    return this.decryptTask(task);
  }

  async findAllForUser(userId: string, filters?: { status?: string; contextId?: string; projectId?: string }): Promise<Task[]> {
    const where: any = { userId };
    
    if (filters?.status) where.status = filters.status;
    if (filters?.contextId) where.contextId = filters.contextId;
    if (filters?.projectId) where.projectId = filters.projectId;

    const tasks = await this.prisma.task.findMany({ where });
    return tasks.map(task => this.decryptTask(task));
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }
    return this.decryptTask(task);
  }

  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    const data: any = { ...dto };
    if (dto.title !== undefined) data.title = dto.title ? this.encryptionService.encrypt(dto.title) : null;
    if (dto.description !== undefined) data.description = dto.description ? this.encryptionService.encrypt(dto.description) : null;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate ? this.encryptionService.encrypt(dto.dueDate) : null;

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
    });
    return this.decryptTask(updatedTask);
  }

  async remove(id: string, userId: string): Promise<{ success: boolean }> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }
}
