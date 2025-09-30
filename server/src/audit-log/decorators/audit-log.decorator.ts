// audit-log.decorator.ts
import { SetMetadata } from '@nestjs/common';

export interface AuditLogMetadata {
  entityType: string;
  readAction?: string;  // Make it optional since it's only needed for read operations
  skip?: boolean;       // Optional flag to skip audit logging
}

export const AuditLog = (metadata: AuditLogMetadata) => 
  SetMetadata('audit-log', metadata);