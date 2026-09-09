import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContextsService } from './contexts.service.js';
import { CreateContextDto } from './dto/create-context.dto.js';
import { UpdateContextDto } from './dto/update-context.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Controller('contexts')
@UseGuards(AuthGuard)
export class ContextsController {
  constructor(private readonly contextsService: ContextsService) {}

  @Post()
  create(@CurrentUser() userId: string, @Body() createContextDto: CreateContextDto) {
    return this.contextsService.create(userId, createContextDto);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.contextsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.contextsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() updateContextDto: UpdateContextDto,
  ) {
    return this.contextsService.update(id, userId, updateContextDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.contextsService.remove(id, userId);
  }
}
