// wilaya.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import  WilayaService  from './wilaya.service';
import { CreateWilayaDto, UpdateWilayaDto } from '../file.dto';

@Controller('api/wilayas')
export class WilayaController {
  constructor(private readonly wilayaService: WilayaService) {}

  @Get()
  findAll() {
    return this.wilayaService.findAll();
  }

  @Get('antenne/:id')
  findByAntenne(@Param('id') id: string) {
    return this.wilayaService.findByAntenne(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wilayaService.findOne(+id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.wilayaService.findByCode(code);
  }

  @Get(':id/dairas')
  findDairasByWilaya(@Param('id') id: string) {
    return this.wilayaService.findDairasByWilaya(+id);
  }

  @Post()
  create(@Body() createWilayaDto: CreateWilayaDto) {
    return this.wilayaService.create(createWilayaDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWilayaDto: UpdateWilayaDto) {
    return this.wilayaService.update(+id, updateWilayaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wilayaService.remove(+id);
  }
}