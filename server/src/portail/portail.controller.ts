import { Body, Controller, Get, Headers, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PortailService } from './portail.service';

@Controller('portail')
export class PortailController {
  constructor(private readonly service: PortailService) {}

  @Get('types')
  getTypes() {
    return this.service.getTypesPermis();
  }

  @Get('types/:id/documents')
  getTypeDocuments(@Param('id', ParseIntPipe) id: number) {
    return this.service.getDocumentsForType(id);
  }

  @Post('demandes')
  createDemande(@Body() body: any, @Headers('x-portal-token') token?: string) {
    return this.service.createPublicDemande(body, token);
  }

  @Post('demandes/:id/documents')
  submitDocuments(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { documents: { id_doc: number; status: 'present' | 'manquant'; file_url?: string }[]; remarques?: string },
    @Headers('x-portal-token') token?: string,
  ) {
    return this.service.saveDocuments(id, body.documents, body.remarques, token);
  }

  @Post('demandes/:id/coords')
  saveCoords(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Headers('x-portal-token') token?: string) {
    return this.service.saveCoords(id, body, token);
  }

  @Post('demandes/:id/paiement/intents')
  createPaymentIntent(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Headers('x-portal-token') token?: string) {
    return this.service.createPaymentIntent(id, body?.method ?? 'card', token);
  }

  @Get('demandes/:id')
  getApplication(@Param('id', ParseIntPipe) id: number, @Headers('x-portal-token') token?: string) {
    return this.service.getApplication(id, token);
  }

  @Post('demandes/:id/submit')
  submit(@Param('id', ParseIntPipe) id: number, @Headers('x-portal-token') token?: string) {
    return this.service.submitApplication(id, token);
  }

  @Post('demandes/:id/company')
  saveCompany(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Headers('x-portal-token') token?: string) {
    return this.service.saveCompany(id, body, token);
  }

  @Put('demandes/:id/representatives')
  saveRepresentatives(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { representatives: Array<{ fullName: string; function?: string; nationalId?: string; email?: string; phone?: string; powerDocUrl?: string }> },
    @Headers('x-portal-token') token?: string,
  ) {
    return this.service.saveRepresentatives(id, body.representatives || [], token);
  }

  @Put('demandes/:id/shareholders')
  saveShareholders(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { shareholders: Array<{ name: string; type: string; nif?: string; sharePct: number; nationality?: string }> },
    @Headers('x-portal-token') token?: string,
  ) {
    return this.service.saveShareholders(id, body.shareholders || [], token);
  }
}
