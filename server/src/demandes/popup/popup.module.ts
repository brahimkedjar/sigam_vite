import { Module } from '@nestjs/common';
import { DemandeSummaryController } from './popup.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemandeSummaryController],
})
export class DemandeSummaryControllerModule {}
