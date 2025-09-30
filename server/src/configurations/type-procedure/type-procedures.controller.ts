import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TypeProceduresService } from './type-procedures.service';
import { CreateTypeProcedureDto, UpdateTypeProcedureDto } from './type-procedures.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('conf/type-procedures')
@Controller('conf/type-procedures')
export class TypeProceduresController {
  constructor(private readonly typeProceduresService: TypeProceduresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new procedure type' })
  @ApiResponse({ status: 201, description: 'Procedure type created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTypeProcedureDto: CreateTypeProcedureDto) {
    return this.typeProceduresService.create(createTypeProcedureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all procedure types' })
  @ApiResponse({ status: 200, description: 'List of procedure types' })
  findAll() {
    return this.typeProceduresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a procedure type by ID' })
  @ApiResponse({ status: 200, description: 'Procedure type details' })
  @ApiResponse({ status: 404, description: 'Procedure type not found' })
  findOne(@Param('id') id: string) {
    return this.typeProceduresService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a procedure type' })
  @ApiResponse({ status: 200, description: 'Procedure type updated successfully' })
  @ApiResponse({ status: 404, description: 'Procedure type not found' })
  update(
    @Param('id') id: string,
    @Body() updateTypeProcedureDto: UpdateTypeProcedureDto,
  ) {
    return this.typeProceduresService.update(+id, updateTypeProcedureDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a procedure type' })
  @ApiResponse({ status: 200, description: 'Procedure type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Procedure type not found' })
  remove(@Param('id') id: string) {
    return this.typeProceduresService.remove(+id);
  }
}