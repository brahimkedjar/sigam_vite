import { Module } from '@nestjs/common';
import { SuperficiaireBaremeService } from './superficiaire-bareme.service';
import { SuperficiaireBaremeController } from './superficiaire-bareme.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SuperficiaireBaremeController],
  providers: [SuperficiaireBaremeService, PrismaService],
  exports: [SuperficiaireBaremeService], // Export if needed by other modules
})
export class SuperficiaireBaremeModule {}