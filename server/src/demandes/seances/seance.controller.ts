// seances/seance.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { SeanceService } from './seance.service';
import { CreateSeanceDto } from './create-seance.dto';

@Controller('api/seances')
export class SeanceController {
  constructor(private readonly seanceService: SeanceService) {}

  @Get()
  async findAll() {
    return this.seanceService.findAll();
  }

  @Get('next-number')
  async getNextSeanceNumber() {
    return {
      nextSeanceNumber: await this.seanceService.getNextSeanceNumber(),
    };
  }

  @Post()
  async create(@Body() createSeanceDto: CreateSeanceDto) {
    return this.seanceService.create(createSeanceDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSeanceDto: CreateSeanceDto) {
    return this.seanceService.update(+id, updateSeanceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.seanceService.remove(+id);
  }

  @Get('membres-comite')
  async findAllMembers() {
    return this.seanceService.findAllmembers();
  }
@Get('procedures')
async getAllProcedures(
  @Query('search') search?: string,
  @Query('page') page = 1,
  @Query('pageSize') pageSize = 100
) {
  const result = await this.seanceService.getAllProcedures(search, +page, +pageSize);
  return result.data; // Return just the array
}

@Get('member/:memberId')
async getSeancesForMember(@Param('memberId') memberId: string) {
  return this.seanceService.getSeancesForMember(+memberId);
}

@Get('with-decisions')
async getSeancesWithDecisions() {
  try {
    const seances = await this.seanceService.getSeancesWithDecisions();
    return {
      success: true,
      data: seances,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getSeancesWithDecisions:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch seances with decisions',
      timestamp: new Date().toISOString()
    };
  }
}
}