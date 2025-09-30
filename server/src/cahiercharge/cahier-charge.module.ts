// src/cahier-charge/cahier-charge.module.ts
import { Module } from '@nestjs/common';
import { CahierService } from './cahier-charge.service';
import { CahierController } from './cahier-charge.controller';

@Module({
  providers: [CahierService],
  controllers: [CahierController],
})
export class CahierChargeModule {}
