import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BaremProduitDroitService } from './barem-produit-droit.service';
import { CreateBaremProduitDroitDto, UpdateBaremProduitDroitDto } from './barem-produit-droit.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('conf/barem-produit-droit')
@Controller('conf/barem-produit-droit')
export class BaremProduitDroitController {
  constructor(private readonly service: BaremProduitDroitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new barem produit droit entry' })
  @ApiResponse({ status: 201, description: 'Entry created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'TypePermis or TypeProcedure not found' })
  create(@Body() createDto: CreateBaremProduitDroitDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all barem produit droit entries' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all entries',
  })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific barem produit droit entry' })
  @ApiResponse({
    status: 200,
    description: 'The requested entry',
  })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a barem produit droit entry' })
  @ApiResponse({ status: 200, description: 'Entry updated successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBaremProduitDroitDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a barem produit droit entry' })
  @ApiResponse({ status: 200, description: 'Entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
  
}