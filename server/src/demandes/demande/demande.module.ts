import { Module } from '@nestjs/common';
import { DemandesController } from './demande.controller';
import { DemandeService } from './demande.service';

@Module({
  controllers: [DemandesController],
  providers: [DemandeService]
})
export class DemandesModule {}
