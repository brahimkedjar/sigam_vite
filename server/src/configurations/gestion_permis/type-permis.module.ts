// src/type-permis/type-permis.module.ts
import { Module } from '@nestjs/common';
import { TypePermisService } from './type-permis.service';
import { TypePermisController } from './type-permis.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TypePermisController],
  providers: [TypePermisService],
})
export class TypePermis_confModule {}