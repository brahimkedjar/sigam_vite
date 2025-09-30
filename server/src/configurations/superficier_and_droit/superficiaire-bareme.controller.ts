import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SuperficiaireBaremeService } from './superficiaire-bareme.service';
import { CreateSuperficiaireBaremeDto, UpdateSuperficiaireBaremeDto } from './superficiaire-bareme.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('conf/superficiaire-bareme')
@Controller('conf/superficiaire-bareme')
export class SuperficiaireBaremeController {
  constructor(private readonly service: SuperficiaireBaremeService) {}

 // In your controller, before calling the service
@Post()
@ApiOperation({ summary: 'Create a new superficiaire bareme entry' })
@ApiResponse({ status: 201, description: 'Entry created successfully' })
@ApiResponse({ status: 400, description: 'Bad request' })
create(@Body() createDto: CreateSuperficiaireBaremeDto) {
  console.log('Received in controller:', JSON.stringify(createDto, null, 2));
  return this.service.create(createDto);
}

  @Get()
  @ApiOperation({ summary: 'Get all superficiaire bareme entries' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all entries',
    type: [CreateSuperficiaireBaremeDto]
  })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific superficiaire bareme entry' })
  @ApiResponse({
    status: 200,
    description: 'The requested entry',
    type: CreateSuperficiaireBaremeDto
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a superficiaire bareme entry' })
  @ApiResponse({ status: 200, description: 'Entry updated successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSuperficiaireBaremeDto,
  ) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a superficiaire bareme entry' })
  @ApiResponse({ status: 200, description: 'Entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}