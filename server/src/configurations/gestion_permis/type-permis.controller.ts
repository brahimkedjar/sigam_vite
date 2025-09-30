// src/type-permis/type-permis.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TypePermisService } from './type-permis.service';

@Controller('type-permis_conf')
export class TypePermisController {
  constructor(private readonly typePermisService: TypePermisService) {}

  @Get()
  findAll() {
    return this.typePermisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typePermisService.findOne(id);
  }
}