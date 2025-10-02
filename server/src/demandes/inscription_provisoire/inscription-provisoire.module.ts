import { Module } from '@nestjs/common';
import { InscriptionProvisoireController } from './inscription-provisoire.controller';
import { InscriptionProvisoireService } from './inscription-provisoire.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CoordonneesService } from '../cadastre/coordonnees.service';

@Module({
  controllers: [InscriptionProvisoireController],
  providers: [InscriptionProvisoireService, PrismaService, CoordonneesService],
})
export class InscriptionProvisoireModule {}
