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
import { TypePermisService } from './types-permis.service';
import { CreateTypePermisDto, UpdateTypePermisDto } from './types-permis.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('conf/types-permis')
@Controller('conf/types-permis')
export class TypePermisController {
  constructor(private readonly typePermisService: TypePermisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mining title type' })
  @ApiResponse({ status: 201, description: 'Type created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTypePermisDto: CreateTypePermisDto) {
    return this.typePermisService.create(createTypePermisDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mining title types' })
  @ApiResponse({ status: 200, description: 'List of types' })
  findAll() {
    return this.typePermisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mining title type by ID' })
  @ApiResponse({ status: 200, description: 'Type details' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  findOne(@Param('id') id: string) {
    return this.typePermisService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a mining title type' })
  @ApiResponse({ status: 200, description: 'Type updated successfully' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  update(
    @Param('id') id: string,
    @Body() updateTypePermisDto: UpdateTypePermisDto,
  ) {
    return this.typePermisService.update(+id, updateTypePermisDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mining title type' })
  @ApiResponse({ status: 200, description: 'Type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  remove(@Param('id') id: string) {
    return this.typePermisService.remove(+id);
  }
  
}