import { Module } from '@nestjs/common';
import { CommunesService } from './communes.service';
import { CommunesController } from './communes.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CommunesController],
  providers: [CommunesService, PrismaService],
})
export class CommunesconfModule {}