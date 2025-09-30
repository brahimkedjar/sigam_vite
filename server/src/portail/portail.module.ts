import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PortailController } from './portail.controller';
import { PortailService } from './portail.service';
import { DocumentsService } from 'src/demandes/documents/documents.service';

@Module({
  imports: [PrismaModule],
  controllers: [PortailController],
  providers: [PortailService, DocumentsService],
})
export class PortailModule {}

