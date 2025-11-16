import { Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Permisdashboard2Service } from './permis.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Permisdashboard')
@Controller('Permisdashboard')
export class PermisDashboard2Controller {
  constructor(private readonly permisService: Permisdashboard2Service) {}


  @Get()
@ApiOperation({ summary: 'Get all permis with pagination' })
async getAllPermis1(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
) {
  return this.permisService.findAll1({
    skip: (page - 1) * limit,
    take: limit
  });
}

  @Get()
  @ApiOperation({ summary: 'Get all permis' })
  @ApiResponse({ status: 200, description: 'All permis retrieved successfully' })
  async getAllPermis() {
    return this.permisService.findAll();
  }

  @Get('actifs')
  @ApiOperation({ summary: 'Get active permis' })
  @ApiResponse({ status: 200, description: 'Active permis retrieved successfully' })
  async getActivePermis() {
    return this.permisService.findActive();
  }

  @Get('expires')
  @ApiOperation({ summary: 'Get expired permis' })
  @ApiResponse({ status: 200, description: 'Expired permis retrieved successfully' })
  async getExpiredPermis() {
    return this.permisService.findExpired();
  }

@Get('current')
@ApiOperation({ summary: 'Get current active permis with pagination' })
async getCurrentPermis(
  @Query('page', ParseIntPipe) page: number = 1,
  @Query('limit', ParseIntPipe) limit: number = 10
) {
  return this.permisService.findCurrent({
    skip: (page - 1) * limit,
    take: limit
  });
}

@Delete(':id')
@ApiOperation({ summary: 'Delete a permis' })
async deletePermis(@Param('id') id: string) {
  return this.permisService.delete(+id);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  return this.permisService.findOneWithDetails(+id);
}

@Get(':id/historique')
async getHistorique(@Param('id') id: string) {
  return this.permisService.getHistoriqueByPermisId(+id);
}

@Get(':id/documents')
@ApiOperation({ summary: 'Get all documents for a permis organized by procedure' })
@ApiResponse({ status: 200, description: 'Documents organized by procedure' })
@ApiResponse({ status: 404, description: 'Permis not found' })
async getDocumentsForPermis(@Param('id') id: string) {
  const documents = await this.permisService.getAllDocumentsForPermis(parseInt(id));
  return { data: documents };
}

}
