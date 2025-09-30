// interaction-wali.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InteractionWaliService } from './interaction-wali.service';
import { CreateInteractionDto } from '../dto/create-interaction.dto';

@Controller('interactions-wali')
export class InteractionWaliController {
  constructor(private readonly service: InteractionWaliService) {}

  @Post()
  create(@Body() dto: CreateInteractionDto) {
    return this.service.create(dto);
  }

  @Get(':id_procedure')
  getByProcedure(@Param('id_procedure') id: string) {
    return this.service.findByProcedure(Number(id));
  }
}