import { Controller, Get } from '@nestjs/common';
import { TypePermisService } from './type-permis.service';

@Controller('type-permis')
export class TypePermisController {
  constructor(private readonly typePermisService: TypePermisService) {}

  @Get()
  findAll() {
    return this.typePermisService.findAll();
  }
}
