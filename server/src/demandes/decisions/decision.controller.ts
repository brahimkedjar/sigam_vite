// decisions/decision.controller.ts
import { Controller, Post, Put, Param, Body } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { CreateDecisionDto } from '../dto/create-decision.dto';

@Controller('api/decisions')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Post()
  async createDecision(@Body() createDecisionDto: CreateDecisionDto) {
    return this.decisionService.createDecision(createDecisionDto);
  }

  @Put(':id')
  async updateDecision(
    @Param('id') id: string,
    @Body() updateDecisionDto: CreateDecisionDto
  ) {
    return this.decisionService.updateDecision(+id, updateDecisionDto);
  }
}