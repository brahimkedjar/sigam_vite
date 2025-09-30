// commune.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommuneService } from './commune.service';
import { CreateCommuneDto, UpdateCommuneDto } from '../file.dto';

@Controller('api/communes')
export class CommuneController {
  constructor(private readonly communeService: CommuneService) {}

  @Get()
  findAll() {
    return this.communeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communeService.findOne(+id);
  }

  /*@Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.communeService.findByCode(code);
  }*/

  @Get('daira/:id')
  findByDaira(@Param('id') id: string) {
    return this.communeService.findByDaira(+id);
  }

  @Post()
  create(@Body() createCommuneDto: CreateCommuneDto) {
    return this.communeService.create(createCommuneDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommuneDto: UpdateCommuneDto) {
    return this.communeService.update(+id, updateCommuneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communeService.remove(+id);
  }
}