// src/statut-permis/statut-permis.module.ts
import { Module } from '@nestjs/common';
import { StatutPermisService } from './statut-permis.service';
import { StatutPermisController } from './statut-permis.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StatutPermisController],
  providers: [StatutPermisService],
})
export class StatutPermis_confModule {}