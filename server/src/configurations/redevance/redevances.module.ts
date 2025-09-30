import { Module } from '@nestjs/common';
import { RedevancesService } from './redevances.service';
import { RedevancesController } from './redevances.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RedevancesController],
  providers: [RedevancesService, PrismaService],
})
export class RedevancesconfModule {}