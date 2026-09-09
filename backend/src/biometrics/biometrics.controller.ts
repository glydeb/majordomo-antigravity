import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BiometricsService } from './biometrics.service.js';
import { CreateBiometricDto } from './dto/create-biometric.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Controller('biometrics')
@UseGuards(AuthGuard)
export class BiometricsController {
  constructor(private readonly biometricsService: BiometricsService) {}

  @Post()
  create(@CurrentUser() userId: string, @Body() createBiometricDto: CreateBiometricDto) {
    return this.biometricsService.create(userId, createBiometricDto);
  }

  @Get()
  findAll(
    @CurrentUser() userId: string,
    @Query('metricType') metricType?: string,
    @Query('source') source?: string,
  ) {
    return this.biometricsService.findAllForUser(userId, { metricType, source });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.biometricsService.findOne(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.biometricsService.remove(id, userId);
  }
}
