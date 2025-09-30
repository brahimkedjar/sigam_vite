// src/procedure-etape/procedure-etape.controller.ts
import { Controller, Param, Post, Get, Body, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProcedureEtapeService } from './procedure-etape.service';
import { StatutProcedure } from '@prisma/client';

@Controller('api/procedure-etape')
export class ProcedureEtapeController {
  constructor(private service: ProcedureEtapeService) {}

  @Post('start/:id_proc/:id_etape')
  async startStep(
    @Param('id_proc') id_proc: string,
    @Param('id_etape') id_etape: string,
    @Body('link') link?: string
  ) {
    try {
      return await this.service.setStepStatus(+id_proc, +id_etape, StatutProcedure.EN_COURS, link);
    } catch (error) {
      console.error('Error starting step:', error);
      throw new InternalServerErrorException('Failed to start step');
    }
  }

  @Post('finish/:id_proc/:id_etape')
  async finishStep(
    @Param('id_proc') id_proc: string,
    @Param('id_etape') id_etape: string
  ) {
    try {
      return await this.service.setStepStatus(+id_proc, +id_etape, StatutProcedure.TERMINEE);
    } catch (error) {
      console.error('Error finishing step:', error);
      throw new InternalServerErrorException('Failed to finish step');
    }
  }

  @Get('procedure/:id_proc')
  async getProcedureWithPhases(@Param('id_proc') id_proc: string) {
    try {
      const procedure = await this.service.getProcedureWithPhases(+id_proc);
      
      if (!procedure) {
        throw new NotFoundException(`Procedure with ID ${id_proc} not found`);
      }
      
      return procedure;
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw new InternalServerErrorException('Failed to fetch procedure data');
    }
  }

  @Post('phase/:id_proc/next')
  async startNextPhase(
    @Param('id_proc') id_proc: string,
    @Body('currentPhaseId') currentPhaseId: number
  ) {
    try {
      return await this.service.startNextPhase(+id_proc, currentPhaseId);
    } catch (error) {
      console.error('Error starting next phase:', error);
      throw new InternalServerErrorException('Failed to start next phase');
    }
  }

  @Get('current/:id_proc')
  async getCurrentEtape(@Param('id_proc') id_proc: string) {
    try {
      return await this.service.getCurrentEtape(+id_proc);
    } catch (error) {
      console.error('Error getting current etape:', error);
      throw new InternalServerErrorException('Failed to get current etape');
    }
  }
}