// daira.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DairaService } from './daira.service';
import { CreateDairaDto, UpdateDairaDto } from '../file.dto';

@Controller('api/dairas')
export class DairaController {
  constructor(private readonly dairaService: DairaService) {}

  @Get()
  findAll() {
    return this.dairaService.findAll();
  }

    @Get(':id/communes')
  findCommunesByDaira(@Param('id') id: string) {
    return this.dairaService.findCommunesByDaira(+id);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dairaService.findOne(+id);
  }

  /*@Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.dairaService.findByCode(code);
  }*/

  @Get('wilaya/:id')
  findByWilaya(@Param('id') id: string) {
    return this.dairaService.findByWilaya(+id);
  }

  @Post()
  create(@Body() createDairaDto: CreateDairaDto) {
    return this.dairaService.create(createDairaDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDairaDto: UpdateDairaDto) {
    return this.dairaService.update(+id, updateDairaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dairaService.remove(+id);
  }
}