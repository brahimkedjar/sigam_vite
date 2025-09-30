import { Module } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { DemandesController } from './demandes.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DemandesController],
  providers: [DemandesService, PrismaService],
})
export class DemandesDashboardModule {}
