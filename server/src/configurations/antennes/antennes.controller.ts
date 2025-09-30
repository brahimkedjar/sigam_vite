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
import { AntennesService } from './antennes.service';
import { CreateAntenneDto, UpdateAntenneDto } from './antennes.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('antennes')
@Controller('antennes')
export class AntennesController {
  constructor(private readonly antennesService: AntennesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new antenne' })
  @ApiResponse({ status: 201, description: 'Antenne created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAntenneDto: CreateAntenneDto) {
    return this.antennesService.create(createAntenneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all antennes' })
  @ApiResponse({ status: 200, description: 'List of antennes' })
  findAll() {
    return this.antennesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an antenne by ID' })
  @ApiResponse({ status: 200, description: 'Antenne details' })
  @ApiResponse({ status: 404, description: 'Antenne not found' })
  findOne(@Param('id') id: string) {
    return this.antennesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an antenne' })
  @ApiResponse({ status: 200, description: 'Antenne updated successfully' })
  @ApiResponse({ status: 404, description: 'Antenne not found' })
  update(
    @Param('id') id: string,
    @Body() updateAntenneDto: UpdateAntenneDto,
  ) {
    return this.antennesService.update(+id, updateAntenneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an antenne' })
  @ApiResponse({ status: 200, description: 'Antenne deleted successfully' })
  @ApiResponse({ status: 404, description: 'Antenne not found' })
  remove(@Param('id') id: string) {
    return this.antennesService.remove(+id);
  }
}