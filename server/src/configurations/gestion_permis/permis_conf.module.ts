// src/permis/permis.module.ts
import { Module } from '@nestjs/common';
import { PermisService } from './permis_conf.service';
import { PermisController } from './permis_conf.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PermisController],
  providers: [PermisService],
  exports: [PermisService],
})
export class Permis_confModule {}