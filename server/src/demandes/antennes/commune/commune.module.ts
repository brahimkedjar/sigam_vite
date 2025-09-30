import { Module } from '@nestjs/common';
import { CommuneController } from './commune.controller';
import { CommuneService } from './commune.service';
import { PrismaService } from '../../../prisma/prisma.service'; // adjust if using global Prisma module

@Module({
  controllers: [CommuneController],
  providers: [CommuneService, PrismaService],
})
export class CommuneModule {}
