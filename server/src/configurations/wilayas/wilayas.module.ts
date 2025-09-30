import { Module } from '@nestjs/common';
import { WilayasService } from './wilayas.service';
import { WilayasController } from './wilayas.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [WilayasController],
  providers: [WilayasService, PrismaService],
})
export class WilayasconfModule {}