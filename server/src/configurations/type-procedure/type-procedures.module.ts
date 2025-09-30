import { Module } from '@nestjs/common';
import { TypeProceduresService } from './type-procedures.service';
import { TypeProceduresController } from './type-procedures.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TypeProceduresController],
  providers: [TypeProceduresService, PrismaService],
})
export class TypeProceduresconfModule {}