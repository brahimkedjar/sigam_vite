// src/antenne/antenne.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AntenneService } from './antenne.service';

@Controller('antenne_conf')
export class AntenneController {
  constructor(private readonly antenneService: AntenneService) {}

  @Get()
  findAll() {
    return this.antenneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.antenneService.findOne(id);
  }
}