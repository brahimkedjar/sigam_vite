import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { TransfertService } from './transfert.service';
import { StartTransfertDto } from './start-transfert.dto';
import { CreateDetenteurDto } from './create-detenteur.dto';

@Controller('transfert')
export class TransfertController {
  constructor(private readonly svc: TransfertService) {}

  @Get('permis/:permisId/details')
  async getPermisDetails(@Param('permisId') permisId: string) {
    return this.svc.getPermisDetails(Number(permisId));
  }

  @Get('detenteur/:id')
  async getDetenteur(@Param('id') id: string) {
    return this.svc.getDetenteurFull(Number(id));
  }

  @Get('detenteurs')
  async searchDetenteurs(@Query('q') q?: string) {
    return this.svc.searchDetenteurs(q);
  }

  @Post('detenteur')
  async createDetenteur(@Body() body: CreateDetenteurDto) {
    return this.svc.createDetenteurFromDto(body);
  }

  @Post('start')
  async startTransfert(@Body() body: StartTransfertDto) {
    return this.svc.startTransfert(body);
  }

  @Get('permis/:permisId/history')
  async getHistory(@Param('permisId') id: string) {
    return this.svc.getHistoryByPermis(Number(id));
  }
}
