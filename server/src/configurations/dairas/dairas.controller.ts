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
import { DairasService } from './dairas.service';
import { CreateDairaDto, UpdateDairaDto } from './dairas.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('dairas')
@Controller('dairas')
export class DairasController {
  constructor(private readonly dairasService: DairasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new daira' })
  @ApiResponse({ status: 201, description: 'Daira created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDairaDto: CreateDairaDto) {
    return this.dairasService.create(createDairaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dairas' })
  @ApiResponse({ status: 200, description: 'List of dairas' })
  findAll(@Query('wilaya') wilayaId?: string) {
    return this.dairasService.findAll(wilayaId ? +wilayaId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a daira by ID' })
  @ApiResponse({ status: 200, description: 'Daira details' })
  @ApiResponse({ status: 404, description: 'Daira not found' })
  findOne(@Param('id') id: string) {
    return this.dairasService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a daira' })
  @ApiResponse({ status: 200, description: 'Daira updated successfully' })
  @ApiResponse({ status: 404, description: 'Daira not found' })
  update(
    @Param('id') id: string,
    @Body() updateDairaDto: UpdateDairaDto,
  ) {
    return this.dairasService.update(+id, updateDairaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a daira' })
  @ApiResponse({ status: 200, description: 'Daira deleted successfully' })
  @ApiResponse({ status: 404, description: 'Daira not found' })
  remove(@Param('id') id: string) {
    return this.dairasService.remove(+id);
  }
}