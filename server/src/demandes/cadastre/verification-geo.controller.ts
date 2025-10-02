import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VerificationGeoService } from './verification-geo.service';

@Controller('verification-geo')
export class VerificationGeoController {
  constructor(private readonly service: VerificationGeoService) {}

  @Get('/demande/:id')
  async get(@Param('id') id: string) {
    const id_demande = Number(id);
    return this.service.getByDemande(id_demande);
  }

  @Post('/demande/:id')
  async upsert(
    @Param('id') id: string,
    @Body()
    body: {
      sit_geo_ok?: boolean;
      empiet_ok?: boolean;
      superf_ok?: boolean;
      geom_ok?: boolean;
      verification_cadastrale_ok?: boolean;
      superficie_cadastrale?: number;
    },
  ) {
    const id_demande = Number(id);
    return this.service.upsertByDemande(id_demande, body);
  }
}

