// seances/seance.module.ts
import { Module } from '@nestjs/common';
import { ComiteService } from './comite.service';
import { ComiteController } from './comite.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ComiteController],
  providers: [ComiteService, PrismaService],
})
export class ComitenModule {}