export interface AuditLogUser {
  id: number;
  username: string;
  email: string;
}

export class AuditLogCreatedEvent {
  constructor(
    public readonly auditLog: {
      id: number;
      action: string | null;
      entityType?: string;
      entityId?: number | null;
      userId?: number | null;
      user?: AuditLogUser | null; // Allow null here
      timestamp: Date;
    }
  ) {}
}