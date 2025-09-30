// comites/comite.controller.ts
import { Controller, Post, Put, Param, Body } from '@nestjs/common';
import { ComiteService } from './comite.service';
import { CreateComiteDto, CreateComiteWithProcedureDto } from '../dto/create-comite.dto';

@Controller('api/comites')
export class ComiteController {
  constructor(private readonly comiteService: ComiteService) {}

  @Post()
  async createComite(@Body() createComiteDto: CreateComiteWithProcedureDto) {
    return this.comiteService.createComite(createComiteDto);
  }

  @Put(':id')
  async updateComite(
    @Param('id') id: string,
    @Body() updateComiteDto: CreateComiteDto
  ) {
    return this.comiteService.updateComite(+id, updateComiteDto);
  }

  @Post('by-procedure')
  async getComiteByProcedure(
    @Body() body: { seanceId: number; procedureId: number }
  ) {
    return this.comiteService.getComiteBySeanceAndProcedure(
      body.seanceId,
      body.procedureId
    );
  }
}