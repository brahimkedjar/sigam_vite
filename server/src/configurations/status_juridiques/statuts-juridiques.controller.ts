import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StatutsJuridiquesService } from './statuts-juridiques.service';
import { CreateStatutJuridiqueDto, UpdateStatutJuridiqueDto } from './statuts-juridiques.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('statuts-juridiques')
@Controller('statuts-juridiques')
export class StatutsJuridiquesController {
  constructor(private readonly statutsJuridiquesService: StatutsJuridiquesService ,private prisma: PrismaService) {}

  // In your backend controller
@Get('pays')
async getPays() {
  return this.prisma.pays.findMany({
    orderBy: { nom_pays: 'asc' }
  });
}

  @Post()
  @ApiOperation({ summary: 'Create a new legal status' })
  @ApiResponse({ status: 201, description: 'Legal status created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createStatutJuridiqueDto: CreateStatutJuridiqueDto) {
    return this.statutsJuridiquesService.create(createStatutJuridiqueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all legal statuses' })
  @ApiResponse({ status: 200, description: 'List of legal statuses' })
  findAll() {
    return this.statutsJuridiquesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a legal status by ID' })
  @ApiResponse({ status: 200, description: 'Legal status details' })
  @ApiResponse({ status: 404, description: 'Legal status not found' })
  findOne(@Param('id') id: string) {
    return this.statutsJuridiquesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a legal status' })
  @ApiResponse({ status: 200, description: 'Legal status updated successfully' })
  @ApiResponse({ status: 404, description: 'Legal status not found' })
  update(
    @Param('id') id: string,
    @Body() updateStatutJuridiqueDto: UpdateStatutJuridiqueDto,
  ) {
    return this.statutsJuridiquesService.update(+id, updateStatutJuridiqueDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a legal status' })
  @ApiResponse({ status: 200, description: 'Legal status deleted successfully' })
  @ApiResponse({ status: 404, description: 'Legal status not found' })
  remove(@Param('id') id: string) {
    return this.statutsJuridiquesService.remove(+id);
  }
}