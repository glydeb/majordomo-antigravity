import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import type { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  private decryptProject(project: Project & { _count?: { tasks: number } }) {
    return {
      ...project,
      name: project.name ? this.encryptionService.decrypt(project.name) : project.name,
      description: project.description ? this.encryptionService.decrypt(project.description) : project.description,
    };
  }

  async create(userId: string, dto: CreateProjectDto) {
    const data: any = { userId };
    if (dto.name) data.name = this.encryptionService.encrypt(dto.name);
    if (dto.description) data.description = this.encryptionService.encrypt(dto.description);

    const project = await this.prisma.project.create({ data });
    return this.decryptProject(project);
  }

  async findAllForUser(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: { select: { tasks: true } }
      }
    });
    return projects.map(p => this.decryptProject(p));
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { _count: { select: { tasks: true } } }
    });
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }
    return this.decryptProject(project);
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name ? this.encryptionService.encrypt(dto.name) : null;
    if (dto.description !== undefined) data.description = dto.description ? this.encryptionService.encrypt(dto.description) : null;

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data,
    });
    return this.decryptProject(updatedProject);
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
