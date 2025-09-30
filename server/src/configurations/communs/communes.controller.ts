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
import { CommunesService } from './communes.service';
import { CreateCommuneDto, UpdateCommuneDto } from './communes.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('communes')
@Controller('communes')
export class CommunesController {
  constructor(private readonly communesService: CommunesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new commune' })
  @ApiResponse({ status: 201, description: 'Commune created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCommuneDto: CreateCommuneDto) {
    return this.communesService.create(createCommuneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all communes' })
  @ApiResponse({ status: 200, description: 'List of communes' })
  findAll(@Query('daira') dairaId?: string) {
    return this.communesService.findAll(dairaId ? +dairaId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a commune by ID' })
  @ApiResponse({ status: 200, description: 'Commune details' })
  @ApiResponse({ status: 404, description: 'Commune not found' })
  findOne(@Param('id') id: string) {
    return this.communesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a commune' })
  @ApiResponse({ status: 200, description: 'Commune updated successfully' })
  @ApiResponse({ status: 404, description: 'Commune not found' })
  update(
    @Param('id') id: string,
    @Body() updateCommuneDto: UpdateCommuneDto,
  ) {
    return this.communesService.update(+id, updateCommuneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a commune' })
  @ApiResponse({ status: 200, description: 'Commune deleted successfully' })
  @ApiResponse({ status: 404, description: 'Commune not found' })
  remove(@Param('id') id: string) {
    return this.communesService.remove(+id);
  }
}