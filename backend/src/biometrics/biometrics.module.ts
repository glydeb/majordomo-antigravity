import { Module } from '@nestjs/common';
import { BiometricsService } from './biometrics.service.js';
import { BiometricsController } from './biometrics.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BiometricsController],
  providers: [BiometricsService],
})
export class BiometricsModule {}
