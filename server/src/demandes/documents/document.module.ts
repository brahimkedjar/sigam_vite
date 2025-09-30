import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentsReminderService } from './documents.reminder.service';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentsReminderService],
})
export class DocumentsModule {}
