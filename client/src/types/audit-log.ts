export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId?: number;
  userId?: number;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  timestamp: string;
  changes?: AuditLogChange;
  ipAddress?: string;
  userAgent?: string;
  status?: string;
  errorMessage?: string;
  additionalData?: Record<string, any>;
  previousState?: any;
  contextId?: string;
  sessionId?: string;
}

export type AuditLogChange = Record<string, {
  old?: any;
  new?: any;
}>;

export interface PaginatedAuditLogs {
  data: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditLogInput {
  action: string;
  entityType: string;
  entityId?: number;
  userId?: number | null;
  changes?: Record<string, { old?: any; new?: any }>;
  status?: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
  additionalData?: Record<string, any>;
  previousState?: any;
  contextId?: string;
  sessionId?: string;
}

export interface RevertAuditLogDto {
  logId: number;
  userId: number;
  reason: string;
}

export interface AuditLogVisualizationDto {
  entityType: string;
  entityId?: number;
  startDate?: Date;
  endDate?: Date;
}