export class AuditLogStatsDto {
  totalActions: number;
  actionsByType: Record<string, number>;
  topUsers: Array<{
    userId?: number;
    actionCount: number;
  }>;
}