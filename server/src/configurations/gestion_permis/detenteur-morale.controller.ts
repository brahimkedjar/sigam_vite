// src/detenteur-morale/detenteur-morale.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DetenteurMoraleService } from './detenteur-morale.service';

@Controller('detenteur-morale_conf')
export class DetenteurMoraleController {
  constructor(private readonly detenteurMoraleService: DetenteurMoraleService) {}

  @Get()
  findAll() {
    return this.detenteurMoraleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detenteurMoraleService.findOne(id);
  }
}