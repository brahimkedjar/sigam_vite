// src/antenne/antenne.module.ts
import { Module } from '@nestjs/common';
import { AntenneService } from './antenne.service';
import { AntenneController } from './antenne.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AntenneController],
  providers: [AntenneService],
})
export class Antenne_confModule {}