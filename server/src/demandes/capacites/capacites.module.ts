import { Module } from '@nestjs/common';
import { CapacitesController } from './capacites.controller';
import { CapacitesService } from './capacites.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CapacitesController],
  providers: [CapacitesService],
})
export class CapacitesModule {}
