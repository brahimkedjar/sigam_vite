import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('permis')
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get(':id/templates')
  async listByPermisId(@Param('id') id: string) {
    return this.templates.listByPermisId(id);
  }

  @Get('templates')
  async listByPermisCode(@Query('permisId') code?: string) {
    if (!code) return [];
    return this.templates.listByPermisCode(code);
  }

  @Patch('templates/:templateId')
  async rename(@Param('templateId') templateId: string, @Body() body: any) {
    const { name } = body || {};
    await this.templates.updateTemplateMeta(Number(templateId), { name });
    return { ok: true };
  }

  @Delete('templates/:templateId')
  async remove(@Param('templateId') templateId: string) {
    await this.templates.deleteTemplate(Number(templateId));
    return { ok: true };
  }
}

