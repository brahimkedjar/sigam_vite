// src/cahier/cahier.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CahierService } from './cahier-charge.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/demande/cahier')
export class CahierController {
  constructor(private cahierService: CahierService, private prisma: PrismaService) {}

  @Get(':id_demande')
  async getOne(@Param('id_demande', ParseIntPipe) id: number) {
    return this.cahierService.findOneByDemande(id);
  }

  @Post(':id_demande')
  async create(
    @Param('id_demande', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.cahierService.createOrUpdate(id, dto, false);
  }

  @Put(':id_demande')
  async update(
    @Param('id_demande', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.cahierService.createOrUpdate(id, dto, true);
  }

  @Delete(':id_demande')
  async remove(@Param('id_demande', ParseIntPipe) id: number) {
    return this.cahierService.delete(id);
  }

  @Get('/permis/:permisId')
async getByPermisId(@Param('permisId', ParseIntPipe) permisId: number) {
  return this.cahierService.findManyByPermis(permisId);
}

@Delete('/cahier/:id')
async deleteOne(@Param('id', ParseIntPipe) id: number) {
  return this.prisma.cahierCharge.delete({ where: { id } });
}

@Post('/permis/:permisId')
  async createByPermis(
    @Param('permisId', ParseIntPipe) permisId: number,
    @Body() dto: any,
  ) {
    return this.cahierService.createOrUpdateByPermis(permisId, dto, false);
  }

  @Put('/permis/:permisId')
  async updateByPermis(
    @Param('permisId', ParseIntPipe) permisId: number,
    @Body() dto: any,
  ) {
    return this.cahierService.createOrUpdateByPermis(permisId, dto, true);
  }

}
