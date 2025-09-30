// src/audit-log/audit-log.module.ts
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { SessionModule } from '../session/session.module'; // ⬅️ AJOUTER CECI

@Module({
  imports: [
    PrismaModule,
    SessionModule, // ⬅️ AJOUTER CECI
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
  ],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
