import { Module } from '@nestjs/common';
import { SocieteController } from './societe.controller';
import { SocieteService } from './societe.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SocieteController],
  providers: [SocieteService, PrismaService],
})
export class SocieteModule {}
