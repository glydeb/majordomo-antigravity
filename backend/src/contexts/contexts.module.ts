import { Module } from '@nestjs/common';
import { ContextsService } from './contexts.service.js';
import { ContextsController } from './contexts.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContextsController],
  providers: [ContextsService],
})
export class ContextsModule {}
