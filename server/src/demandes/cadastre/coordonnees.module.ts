import { Module } from '@nestjs/common';
import { CoordonneesController } from './coordonee.controller';
import { CoordonneesService } from './coordonnees.service';
import { PrismaService } from '../../prisma/prisma.service'; // adjust if using global Prisma module

@Module({
  controllers: [CoordonneesController],
  providers: [CoordonneesService, PrismaService],
})
export class CoordonneesModule {}
