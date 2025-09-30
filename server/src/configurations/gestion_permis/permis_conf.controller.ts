// src/permis/permis.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PermisService } from './permis_conf.service';
import { CreatePermisDto } from './create-permis.dto';
import { UpdatePermisDto } from './update-permis.dto';
import { FilterPermisDto } from './filter-permis.dto';

@Controller('permis_conf')
export class PermisController {
  constructor(private readonly permisService: PermisService) {}

  @Post()
  create(@Body() createPermisDto: CreatePermisDto) {
    return this.permisService.create(createPermisDto);
  }

  @Get()
  findAll(@Query() filters: FilterPermisDto) {
    return this.permisService.findAll(filters);
  }

  @Get('stats')
  getStats() {
    return this.permisService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permisService.findOne(id);
  }

  /*@Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.permisService.findByCode(code);
  }*/

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermisDto: UpdatePermisDto,
  ) {
    return this.permisService.update(id, updatePermisDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permisService.remove(id);
  }
}