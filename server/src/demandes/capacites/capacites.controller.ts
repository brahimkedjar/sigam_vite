import { Body, Controller, Post, Put } from '@nestjs/common';
import { CapacitesService } from './capacites.service';

@Controller('api')
export class CapacitesController {
  constructor(private readonly service: CapacitesService) {}

  @Put('capacites')
  saveCapacites(@Body() data: any) {
    return this.service.saveCapacites(data); // ✅ Fixed this line
  }
}

