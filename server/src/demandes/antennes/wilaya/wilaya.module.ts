import { Module } from '@nestjs/common';
import  WilayaService  from './wilaya.service';
import { PrismaService } from '../../../prisma/prisma.service'; // adjust if using global Prisma module
import  {WilayaController} from './wilaya.controller';

@Module({
  controllers: [WilayaController],
  providers: [WilayaService, PrismaService],
})
export class WilayaModule {}
