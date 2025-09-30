// src/statut-permis/statut-permis.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatutPermisService } from './statut-permis.service';

@Controller('statut-permis_conf')
export class StatutPermisController {
  constructor(private readonly statutPermisService: StatutPermisService) {}

  @Get()
  findAll() {
    return this.statutPermisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statutPermisService.findOne(id);
  }
}