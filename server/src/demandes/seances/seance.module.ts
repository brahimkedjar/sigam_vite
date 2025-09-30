// seances/seance.module.ts
import { Module } from '@nestjs/common';
import { SeanceService } from './seance.service';
import { SeanceController } from './seance.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SeanceController],
  providers: [SeanceService, PrismaService],
})
export class SeanceModule {}