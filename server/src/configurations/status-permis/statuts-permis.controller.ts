import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StatutPermisService } from './statuts-permis.service';
import { CreateStatutPermisDto, UpdateStatutPermisDto } from './statuts-permis.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('conf/statuts-permis')
@Controller('conf/statuts-permis')
export class StatutPermisController {
  constructor(private readonly statutPermisService: StatutPermisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mining title status' })
  @ApiResponse({ status: 201, description: 'Status created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createStatutPermisDto: CreateStatutPermisDto) {
    return this.statutPermisService.create(createStatutPermisDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mining title statuses' })
  @ApiResponse({ status: 200, description: 'List of statuses' })
  findAll() {
    return this.statutPermisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mining title status by ID' })
  @ApiResponse({ status: 200, description: 'Status details' })
  @ApiResponse({ status: 404, description: 'Status not found' })
  findOne(@Param('id') id: string) {
    return this.statutPermisService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a mining title status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Status not found' })
  update(
    @Param('id') id: string,
    @Body() updateStatutPermisDto: UpdateStatutPermisDto,
  ) {
    return this.statutPermisService.update(+id, updateStatutPermisDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mining title status' })
  @ApiResponse({ status: 200, description: 'Status deleted successfully' })
  @ApiResponse({ status: 404, description: 'Status not found' })
  remove(@Param('id') id: string) {
    return this.statutPermisService.remove(+id);
  }
}