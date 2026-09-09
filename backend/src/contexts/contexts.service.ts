import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateContextDto } from './dto/create-context.dto.js';
import { UpdateContextDto } from './dto/update-context.dto.js';
import type { Context } from '@prisma/client';

@Injectable()
export class ContextsService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  private decryptContext(context: Context & { _count?: { tasks: number } }) {
    return {
      ...context,
      name: context.name ? this.encryptionService.decrypt(context.name) : context.name,
    };
  }

  async create(userId: string, dto: CreateContextDto) {
    const data: any = { userId };
    if (dto.name) data.name = this.encryptionService.encrypt(dto.name);

    const context = await this.prisma.context.create({ data });
    return this.decryptContext(context);
  }

  async findAllForUser(userId: string) {
    const contexts = await this.prisma.context.findMany({
      where: { userId },
      include: {
        _count: { select: { tasks: true } }
      }
    });
    return contexts.map(c => this.decryptContext(c));
  }

  async findOne(id: string, userId: string) {
    const context = await this.prisma.context.findUnique({
      where: { id },
      include: { _count: { select: { tasks: true } } }
    });
    if (!context || context.userId !== userId) {
      throw new NotFoundException('Context not found');
    }
    return this.decryptContext(context);
  }

  async update(id: string, userId: string, dto: UpdateContextDto) {
    const context = await this.prisma.context.findUnique({ where: { id } });
    if (!context || context.userId !== userId) {
      throw new NotFoundException('Context not found');
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name ? this.encryptionService.encrypt(dto.name) : null;

    const updatedContext = await this.prisma.context.update({
      where: { id },
      data,
    });
    return this.decryptContext(updatedContext);
  }

  async remove(id: string, userId: string) {
    const context = await this.prisma.context.findUnique({ where: { id } });
    if (!context || context.userId !== userId) {
      throw new NotFoundException('Context not found');
    }

    await this.prisma.context.delete({ where: { id } });
    return { success: true };
  }
}
