import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { SubstancesService } from './substances.service';
import { CreateSubstanceDto, UpdateSubstanceDto } from './substances.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('substances')
@Controller('substances')
export class SubstancesController {
  constructor(private readonly substancesService: SubstancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new substance' })
  @ApiResponse({ status: 201, description: 'Substance created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createSubstanceDto: CreateSubstanceDto) {
    return this.substancesService.create(createSubstanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all substances' })
  @ApiResponse({ status: 200, description: 'List of substances' })
  findAll(@Query('include') include?: string) {
    return this.substancesService.findAll(include);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a substance by ID' })
  @ApiResponse({ status: 200, description: 'Substance details' })
  @ApiResponse({ status: 404, description: 'Substance not found' })
  findOne(@Param('id') id: string) {
    return this.substancesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a substance' })
  @ApiResponse({ status: 200, description: 'Substance updated successfully' })
  @ApiResponse({ status: 404, description: 'Substance not found' })
  update(
    @Param('id') id: string,
    @Body() updateSubstanceDto: UpdateSubstanceDto,
  ) {
    return this.substancesService.update(+id, updateSubstanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a substance' })
  @ApiResponse({ status: 200, description: 'Substance deleted successfully' })
  @ApiResponse({ status: 404, description: 'Substance not found' })
  remove(@Param('id') id: string) {
    return this.substancesService.remove(+id);
  }
}