// decision-tracking/decision-tracking.module.ts
import { Module } from '@nestjs/common';
import { DecisionTrackingController } from './decision-tracking.controller';
import { DecisionTrackingService } from './decision-tracking.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DecisionTrackingController],
  providers: [DecisionTrackingService, PrismaService]
})
export class DecisionTrackingModule {}