// src/type-permis/type-permis.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TypePermisService } from './type_permis.service';
import { CreateTypePermisDto } from './type-permis.dto';
import { TypePermis } from '@prisma/client';

@Controller('type-permis')
export class TypePermisController {
  constructor(private readonly typePermisService: TypePermisService) {}

  @Post()
  create(@Body() createTypePermisDto: CreateTypePermisDto): Promise<TypePermis> {
    return this.typePermisService.createTypePermis(createTypePermisDto);
  }

  @Get()
  findAll(): Promise<TypePermis[]> {
    return this.typePermisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TypePermis | null> {
    return this.typePermisService.getPermisDetails(+id);
  }
}