import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PhasesEtapesService } from './phases-etapes.service';
import {
  CreateEtapeDto,
  CreatePhaseDto,
  CreateRelationPhaseTypeProcDto,
  CreateCombinaisonPermisProcDto,
  UpdateEtapeDto,
  UpdatePhaseDto,
  UpdateRelationPhaseTypeProcDto,
  UpdateCombinaisonPermisProcDto,
} from './phases-etapes.dto';

@ApiTags('phases-etapes')
@Controller('phases-etapes')
export class PhasesEtapesController {
  constructor(private readonly phasesEtapesService: PhasesEtapesService) {}

  // Phases
  @Get('phases')
  findAllPhases() {
    return this.phasesEtapesService.findAllPhasesWithDetails();
  }

  @Post('phases')
  createPhase(@Body() dto: CreatePhaseDto) {
    return this.phasesEtapesService.createPhase(dto);
  }

  @Put('phases/:id')
  updatePhase(@Param('id') id: string, @Body() dto: UpdatePhaseDto) {
    return this.phasesEtapesService.updatePhase(Number(id), dto);
  }

  @Delete('phases/:id')
  deletePhase(@Param('id') id: string) {
    return this.phasesEtapesService.deletePhase(Number(id));
  }

  // Étapes
  @Get('etapes')
  findAllEtapes() {
    return this.phasesEtapesService.findAllEtapes();
  }

  @Get('etapes/by-phase/:id_phase')
  findEtapesByPhase(@Param('id_phase') id_phase: string) {
    return this.phasesEtapesService.findEtapesByPhase(Number(id_phase));
  }

  @Post('etapes')
  createEtape(@Body() dto: CreateEtapeDto) {
    return this.phasesEtapesService.createEtape(dto);
  }

  @Put('etapes/:id')
  updateEtape(@Param('id') id: string, @Body() dto: UpdateEtapeDto) {
    return this.phasesEtapesService.updateEtape(Number(id), dto);
  }

  @Delete('etapes/:id')
  deleteEtape(@Param('id') id: string) {
    return this.phasesEtapesService.deleteEtape(Number(id));
  }

  // Combinaisons et relations
  @Get('combinaisons')
  findAllCombinaisons() {
    return this.phasesEtapesService.findAllCombinaisons();
  }

  @Post('combinaisons')
  createCombinaison(@Body() dto: CreateCombinaisonPermisProcDto) {
    return this.phasesEtapesService.createCombinaison(dto);
  }

  @Put('combinaisons/:id_combinaison')
  updateCombinaison(
    @Param('id_combinaison') id_combinaison: string,
    @Body() dto: UpdateCombinaisonPermisProcDto,
  ) {
    return this.phasesEtapesService.updateCombinaison(
      Number(id_combinaison),
      dto,
    );
  }

  @Delete('combinaisons/:id_combinaison')
  deleteCombinaison(@Param('id_combinaison') id_combinaison: string) {
    return this.phasesEtapesService.deleteCombinaison(Number(id_combinaison));
  }

  @Get('relations/:id_combinaison')
  findRelationsByCombinaison(@Param('id_combinaison') id_combinaison: string) {
    return this.phasesEtapesService.findRelationsByCombinaison(
      Number(id_combinaison),
    );
  }

  @Post('relations')
  createRelation(@Body() dto: CreateRelationPhaseTypeProcDto) {
    return this.phasesEtapesService.createRelation(dto);
  }

  @Put('relations/:id_relation')
  updateRelation(
    @Param('id_relation') id_relation: string,
    @Body() dto: UpdateRelationPhaseTypeProcDto,
  ) {
    return this.phasesEtapesService.updateRelation(Number(id_relation), dto);
  }

  @Delete('relations/:id_relation')
  deleteRelation(@Param('id_relation') id_relation: string) {
    return this.phasesEtapesService.deleteRelation(Number(id_relation));
  }
}
