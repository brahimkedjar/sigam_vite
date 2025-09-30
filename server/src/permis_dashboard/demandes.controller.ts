import { Controller, Get } from '@nestjs/common';
import { DemandesDashboardService } from './demandes.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Demandesdashboard')
@Controller('Demandesdashboard')
export class DemandesDashboardController {
  constructor(private readonly demandesService: DemandesDashboardService) {}

  @Get('en-cours')
  @ApiOperation({ summary: 'Get pending demandes' })
  @ApiResponse({ status: 200, description: 'Pending demandes retrieved successfully' })
  async getPendingDemandes() {
    return this.demandesService.findPending();
  }
}