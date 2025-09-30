import { Module } from '@nestjs/common';
import { DairasService } from './dairas.service';
import { DairasController } from './dairas.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DairasController],
  providers: [DairasService, PrismaService],
})
export class DairasconfModule {}