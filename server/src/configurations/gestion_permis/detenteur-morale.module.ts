// src/detenteur-morale/detenteur-morale.module.ts
import { Module } from '@nestjs/common';
import { DetenteurMoraleService } from './detenteur-morale.service';
import { DetenteurMoraleController } from './detenteur-morale.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetenteurMoraleController],
  providers: [DetenteurMoraleService],
})
export class DetenteurMorale_confModule {}