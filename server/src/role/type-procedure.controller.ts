import { Controller, Get } from '@nestjs/common';
import { TypeProcedureService } from './type-procedure.service';

@Controller('type-procedures')
export class TypeProcedureController {
  constructor(private readonly typeProcedureService: TypeProcedureService) {}

  @Get()
  findAll() {
    return this.typeProcedureService.findAll();
  }
}
