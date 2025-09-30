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
import { WilayasService } from './wilayas.service';
import { CreateWilayaDto, UpdateWilayaDto } from './wilayas.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('wilayas')
@Controller('wilayas')
export class WilayasController {
  constructor(private readonly wilayasService: WilayasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wilaya' })
  @ApiResponse({ status: 201, description: 'Wilaya created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createWilayaDto: CreateWilayaDto) {
    return this.wilayasService.create(createWilayaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wilayas' })
  @ApiResponse({ status: 200, description: 'List of wilayas' })
  findAll(@Query('antenne') antenneId?: string) {
    return this.wilayasService.findAll(antenneId ? +antenneId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a wilaya by ID' })
  @ApiResponse({ status: 200, description: 'Wilaya details' })
  @ApiResponse({ status: 404, description: 'Wilaya not found' })
  findOne(@Param('id') id: string) {
    return this.wilayasService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a wilaya' })
  @ApiResponse({ status: 200, description: 'Wilaya updated successfully' })
  @ApiResponse({ status: 404, description: 'Wilaya not found' })
  update(
    @Param('id') id: string,
    @Body() updateWilayaDto: UpdateWilayaDto,
  ) {
    return this.wilayasService.update(+id, updateWilayaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wilaya' })
  @ApiResponse({ status: 200, description: 'Wilaya deleted successfully' })
  @ApiResponse({ status: 404, description: 'Wilaya not found' })
  remove(@Param('id') id: string) {
    return this.wilayasService.remove(+id);
  }
}