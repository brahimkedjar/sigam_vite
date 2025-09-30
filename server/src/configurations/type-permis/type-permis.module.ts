import { Module } from '@nestjs/common';
import { TypePermisService } from './types-permis.service';
import { TypePermisController } from './types-permis.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TypePermisController],
  providers: [TypePermisService, PrismaService],
})
export class TypePermisconfModule {}