import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { CdService } from './cd.service';
import { 
  CreateSeanceDto, 
  UpdateSeanceDto,
  CreateComiteDto,
  UpdateComiteDto,
  CreateDecisionDto,
  CreateMembreDto,
  UpdateMembreDto
} from '../dto/cd.dto';

@Controller('cd')
export class CdController {
  constructor(private readonly cdService: CdService) {}

  // Seance Endpoints
  @Post('seances')
  async createSeance(@Body() createSeanceDto: CreateSeanceDto) {
    try {
      return await this.cdService.createSeance(createSeanceDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Une séance avec ce numéro existe déjà');
      }
      throw error;
    }
  }

  @Get('seances')
  async getAllSeances(@Query('statut') statut?: 'programmee' | 'terminee') {
    return this.cdService.getSeances(statut);
  }

  @Get('seances/:id')
  async getSeanceById(@Param('id') id: string) {
    const seance = await this.cdService.getSeanceById(parseInt(id));
    if (!seance) {
      throw new NotFoundException('Séance non trouvée');
    }
    return seance;
  }

  @Put('seances/:id')
  async updateSeance(
    @Param('id') id: string,
    @Body() updateSeanceDto: UpdateSeanceDto
  ) {
    try {
      return await this.cdService.updateSeance(parseInt(id), updateSeanceDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Séance non trouvée');
      }
      throw error;
    }
  }

  @Delete('seances/:id')
  async deleteSeance(@Param('id') id: string) {
    try {
      return await this.cdService.deleteSeance(parseInt(id));
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Séance non trouvée');
      }
      throw error;
    }
  }

  // Comite Endpoints
  @Post('comites')
  async createComite(@Body() createComiteDto: CreateComiteDto) {
    try {
      return await this.cdService.createComite(createComiteDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un comité avec ce numéro existe déjà');
      }
      throw error;
    }
  }

  @Get('comites')
  async getAllComites() {
    return this.cdService.getComites();
  }

  @Get('comites/:id')
  async getComiteById(@Param('id') id: string) {
    const comite = await this.cdService.getComiteById(parseInt(id));
    if (!comite) {
      throw new NotFoundException('Comité non trouvé');
    }
    return comite;
  }

  @Put('comites/:id')
  async updateComite(
    @Param('id') id: string,
    @Body() updateComiteDto: UpdateComiteDto
  ) {
    try {
      return await this.cdService.updateComite(parseInt(id), updateComiteDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Comité non trouvé');
      }
      throw error;
    }
  }

  @Delete('comites/:id')
  async deleteComite(@Param('id') id: string) {
    try {
      return await this.cdService.deleteComite(parseInt(id));
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Comité non trouvé');
      }
      throw error;
    }
  }

  // Decision Endpoints
  @Post('decisions')
  async createDecision(@Body() createDecisionDto: CreateDecisionDto) {
    return this.cdService.createDecision(createDecisionDto);
  }

  @Get('decisions')
  async getDecisionsByComite(@Query('comiteId') comiteId: string) {
    return this.cdService.getDecisionsByComite(parseInt(comiteId));
  }

  // Members Endpoints
  @Post('membres')
  async createMembre(@Body() createMembreDto: CreateMembreDto) {
    return this.cdService.createMembre(createMembreDto);
  }

  @Get('membres')
  async getAllMembres() {
    return this.cdService.getMembres();
  }

  @Get('membres/:id')
  async getMembreById(@Param('id') id: string) {
    return this.cdService.getMembreById(parseInt(id));
  }

  @Put('membres/:id')
  async updateMembre(
    @Param('id') id: string,
    @Body() updateMembreDto: UpdateMembreDto
  ) {
    return this.cdService.updateMembre(parseInt(id), updateMembreDto);
  }

  @Delete('membres/:id')
  async deleteMembre(@Param('id') id: string) {
    return this.cdService.deleteMembre(parseInt(id));
  }

  // Procedure-Seance Relationship
  @Post('seances/:seanceId/procedures/:procedureId')
  async addProcedureToSeance(
    @Param('seanceId') seanceId: string,
    @Param('procedureId') procedureId: string
  ) {
    return this.cdService.addProcedureToSeance(
      parseInt(seanceId),
      parseInt(procedureId)
    );
  }

  @Delete('seances/:seanceId/procedures/:procedureId')
  async removeProcedureFromSeance(
    @Param('seanceId') seanceId: string,
    @Param('procedureId') procedureId: string
  ) {
    return this.cdService.removeProcedureFromSeance(
      parseInt(seanceId),
      parseInt(procedureId)
    );
  }

  
}