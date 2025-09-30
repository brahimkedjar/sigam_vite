import { Controller, Get } from '@nestjs/common';
import { TypeDocService } from './type-doc.service';

@Controller('type-docs')
export class TypeDocController {
  constructor(private readonly typeDocService: TypeDocService) {}

  @Get()
  findAll() {
    return this.typeDocService.findAll();
  }
}
