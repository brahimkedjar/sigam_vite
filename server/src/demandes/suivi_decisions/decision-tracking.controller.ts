// decision-tracking/decision-tracking.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { DecisionTrackingService } from './decision-tracking.service';

@Controller('api/decision-tracking')
export class DecisionTrackingController {
  constructor(private readonly decisionTrackingService: DecisionTrackingService) {}

  @Get()
  async getDecisionTracking() {
    const decisions = await this.decisionTrackingService.getDecisionTrackingData();
    const stats = await this.decisionTrackingService.getDecisionStats();
    return { decisions, stats };
  }

  @Get(':id')
  async getDecisionDetails(@Param('id') id: string) {
    return this.decisionTrackingService.getProcedureDetails(parseInt(id));
  }
}