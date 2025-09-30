// seances/seance.module.ts
import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DecisionController],
  providers: [DecisionService, PrismaService],
})
export class DecisionModule {}