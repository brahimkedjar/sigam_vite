import { Module } from '@nestjs/common';
import { DairaController } from './daira.controller';
import { DairaService } from './daira.service';
import { PrismaService } from '../../../prisma/prisma.service'; // adjust if using global Prisma module

@Module({
  controllers: [DairaController],
  providers: [DairaService, PrismaService],
})
export class DairaModule {}
