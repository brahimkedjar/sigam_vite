import { Module } from '@nestjs/common';
import { BaremProduitDroitService } from './barem-produit-droit.service';
import { BaremProduitDroitController } from './barem-produit-droit.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BaremProduitDroitController],
  providers: [BaremProduitDroitService, PrismaService],
  exports: [BaremProduitDroitService], // Export if needed by other modules
})
export class BaremProduitDroitModule {}