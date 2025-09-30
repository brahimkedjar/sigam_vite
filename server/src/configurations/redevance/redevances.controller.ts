import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RedevancesService } from './redevances.service';
import { CreateRedevanceDto, UpdateRedevanceDto } from './redevances.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('redevances')
@Controller('redevances')
export class RedevancesController {
  constructor(private readonly redevancesService: RedevancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new royalty rate' })
  @ApiResponse({ status: 201, description: 'Royalty rate created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createRedevanceDto: CreateRedevanceDto) {
    return this.redevancesService.create(createRedevanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all royalty rates' })
  @ApiResponse({ status: 200, description: 'List of royalty rates' })
  findAll() {
    return this.redevancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a royalty rate by ID' })
  @ApiResponse({ status: 200, description: 'Royalty rate details' })
  @ApiResponse({ status: 404, description: 'Royalty rate not found' })
  findOne(@Param('id') id: string) {
    return this.redevancesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a royalty rate' })
  @ApiResponse({ status: 200, description: 'Royalty rate updated successfully' })
  @ApiResponse({ status: 404, description: 'Royalty rate not found' })
  update(
    @Param('id') id: string,
    @Body() updateRedevanceDto: UpdateRedevanceDto,
  ) {
    return this.redevancesService.update(+id, updateRedevanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a royalty rate' })
  @ApiResponse({ status: 200, description: 'Royalty rate deleted successfully' })
  @ApiResponse({ status: 404, description: 'Royalty rate not found' })
  remove(@Param('id') id: string) {
    return this.redevancesService.remove(+id);
  }
}