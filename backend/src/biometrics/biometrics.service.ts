import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';
import { CreateBiometricDto } from './dto/create-biometric.dto.js';
import type { BiometricLog } from '@prisma/client';

@Injectable()
export class BiometricsService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  private decryptLog(log: BiometricLog): BiometricLog {
    return {
      ...log,
      source: log.source ? this.encryptionService.decrypt(log.source) : log.source,
      metricType: log.metricType ? this.encryptionService.decrypt(log.metricType) : log.metricType,
      value: log.value ? this.encryptionService.decrypt(log.value) : log.value,
    };
  }

  async create(userId: string, dto: CreateBiometricDto) {
    const data: any = { 
      userId,
      timestamp: new Date(dto.timestamp)
    };
    if (dto.source) data.source = this.encryptionService.encrypt(dto.source);
    if (dto.metricType) data.metricType = this.encryptionService.encrypt(dto.metricType);
    if (dto.value) data.value = this.encryptionService.encrypt(dto.value);

    const log = await this.prisma.biometricLog.create({ data });
    return this.decryptLog(log);
  }

  async findAllForUser(userId: string, filters?: { metricType?: string; source?: string }) {
    const logs = await this.prisma.biometricLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });
    let decryptedLogs = logs.map(l => this.decryptLog(l));
    
    if (filters?.metricType) {
      decryptedLogs = decryptedLogs.filter(l => l.metricType === filters.metricType);
    }
    if (filters?.source) {
      decryptedLogs = decryptedLogs.filter(l => l.source === filters.source);
    }
    return decryptedLogs;
  }

  async findOne(id: string, userId: string) {
    const log = await this.prisma.biometricLog.findUnique({
      where: { id }
    });
    if (!log || log.userId !== userId) {
      throw new NotFoundException('Biometric log not found');
    }
    return this.decryptLog(log);
  }

  async remove(id: string, userId: string) {
    const log = await this.prisma.biometricLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) {
      throw new NotFoundException('Biometric log not found');
    }

    await this.prisma.biometricLog.delete({ where: { id } });
    return { success: true };
  }
}
