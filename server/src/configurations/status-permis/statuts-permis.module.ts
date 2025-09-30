import { Module } from '@nestjs/common';
import { StatutPermisService } from './statuts-permis.service';
import { StatutPermisController } from './statuts-permis.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [StatutPermisController],
  providers: [StatutPermisService, PrismaService],
})
export class StatutPermisconfModule {}