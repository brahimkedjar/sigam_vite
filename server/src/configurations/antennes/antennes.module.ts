import { Module } from '@nestjs/common';
import { AntennesService } from './antennes.service';
import { AntennesController } from './antennes.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AntennesController],
  providers: [AntennesService, PrismaService],
})
export class AntennesconfModule {}