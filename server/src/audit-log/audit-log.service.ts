import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditLogCreatedEvent } from './events/audit-log-created.event';
import { RevertAuditLogDto } from './dto/revert-audit-log.dto';
import { AuditLogVisualizationDto } from './dto/audit-log-visualization.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

export interface AuditLogData {
  action: string;
  entityType: string;
  entityId?: number | null;
  userId?: number | null;
  ipAddress?: string;
  userAgent?: string;
  changes?: Prisma.JsonValue | null;
  status?: 'SUCCESS' | 'FAILURE';
  errorMessage?: string | null;
  additionalData?: Prisma.JsonValue | null;
  previousState?: Prisma.JsonValue | null;
  contextId?: string | null;
  sessionId?: string | null;
}

interface GetLogsParams {
  where?: any;
  page: number;
  limit: number;
  orderBy?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class AuditLogService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async log(data: AuditLogData): Promise<{ id: number }> {
    try {
      // Ensure proper number conversion for entityId
      const entityId = data.entityId !== undefined && data.entityId !== null ? 
        Number(data.entityId) : 
        null;

      const logInput: Prisma.AuditLogCreateInput = {
        action: data.action,
        entityType: data.entityType,
        entityId,
        user: data.userId ? { connect: { id: Number(data.userId) } } : undefined,
        changes: data.changes ?? undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status || 'SUCCESS',
        errorMessage: data.errorMessage ?? undefined,
        additionalData: data.additionalData ?? undefined,
        previousState: data.previousState ?? undefined,
        contextId: data.contextId ?? undefined,
        sessionId: data.sessionId ?? undefined
      };

      const createdLog = await this.prisma.auditLog.create({
        data: logInput,
        include: { 
          user: { 
            select: { 
              id: true,
              username: true,
              email: true,
              role: true
            } 
          } 
        }
      });

      // Emit event
      this.eventEmitter.emit(
        'audit-log.created',
        new AuditLogCreatedEvent({
          id: createdLog.id,
          action: createdLog.action,
          entityType: createdLog.entityType,
          entityId: createdLog.entityId,
          userId: createdLog.userId,
          user: createdLog.user,
          timestamp: createdLog.timestamp,
        })
      );

      return { id: createdLog.id };
    } catch (error) {
      // console.log('Audit log creation failed:', error);
      throw error;
    }
  }

  async getLogs(params: GetLogsParams): Promise<PaginatedResult<any>> {
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: params.where,
        include: { 
          user: { 
            select: { 
              id: true,
              username: true, 
              email: true,
              role: true} 
          } 
        },
        orderBy: { timestamp: params.orderBy || 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.auditLog.count({ where: params.where }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async getLogById(id: number) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!log) {
      throw new NotFoundException('Audit log not found');
    }

    return log;
  }

 async revertLog(revertDto: RevertAuditLogDto) {
  // 1. Get the audit log being reverted
  const logToRevert = await this.prisma.auditLog.findUnique({
    where: { id: revertDto.logId },
    include: { user: true }
  });

  if (!logToRevert) throw new NotFoundException('Audit log not found');
  if (!logToRevert.previousState) {
    throw new BadRequestException('Cannot revert - previous state not available');
  }

  // 2. Get the Prisma model for the entity type
  const model = this.prisma[logToRevert.entityType.toLowerCase()];
  if (!model) {
    throw new BadRequestException(`Entity type ${logToRevert.entityType} not supported`);
  }

  // 3. Handle different action types
  if (logToRevert.action === 'DELETE') {
    // For DELETE actions, we need to recreate the entity
    return this.revertDeleteAction(model, logToRevert, revertDto);
  } else {
    // For other actions (UPDATE, CREATE), use standard revert logic
    return this.revertStandardAction(model, logToRevert, revertDto);
  }
}

private async revertDeleteAction(model: any, logToRevert: any, revertDto: RevertAuditLogDto) {
  // 1. Parse the previous state
  const previousState = logToRevert.previousState as Record<string, any>;
  
  // 2. Create the entity (don't include relationships in initial create)
  const { rolePermissions, ...entityData } = previousState;
  const recreatedEntity = await model.create({
    data: entityData
  });

  // 3. Restore relationships if they exist
  if (rolePermissions && Array.isArray(rolePermissions)) {
    await this.prisma.rolePermission.createMany({
      data: rolePermissions.map((rp: any) => ({
        roleId: recreatedEntity.id,
        permissionId: rp.permissionId,
        // include other rolePermission fields as needed
      })),
      skipDuplicates: true
    });
  }

  // 4. Create the audit log for the revert
  return this.prisma.auditLog.create({
    data: {
      action: 'REVERT',
      entityType: logToRevert.entityType,
      entityId: recreatedEntity.id,
      userId: revertDto.userId,
      changes: {
        action: 'RECREATED',
        originalLogId: logToRevert.id,
        originalAction: logToRevert.action
      },
      previousState: undefined, // No previous state since we're recreating
      ipAddress: revertDto.ipAddress,
      userAgent: revertDto.userAgent,
      additionalData: {
        reason: revertDto.reason,
        originalUser: logToRevert.user 
          ? { id: logToRevert.user.id, username: logToRevert.user.username }
          : null,
        originalTimestamp: logToRevert.timestamp,
        recreatedData: entityData
      },
      contextId: logToRevert.contextId,
      sessionId: revertDto.sessionId
    },
    include: { user: true }
  });
}

private async revertStandardAction(model: any, logToRevert: any, revertDto: RevertAuditLogDto) {
  // 1. Get current entity state
  const currentEntity = await model.findUnique({
    where: { id: logToRevert.entityId ?? undefined },
  });

  // 2. Perform the revert
  await model.update({
    where: { id: logToRevert.entityId ?? undefined },
    data: logToRevert.previousState as Prisma.InputJsonValue,
  });

  // 3. Create the audit log
  return this.prisma.auditLog.create({
    data: {
      action: 'REVERT',
      entityType: logToRevert.entityType,
      entityId: logToRevert.entityId,
      userId: revertDto.userId,
      changes: {
        revertedFrom: currentEntity,
        revertedTo: logToRevert.previousState,
        originalLogId: logToRevert.id,
        originalAction: logToRevert.action
      },
      previousState: currentEntity,
      ipAddress: revertDto.ipAddress,
      userAgent: revertDto.userAgent,
      additionalData: {
        reason: revertDto.reason,
        originalUser: logToRevert.user 
          ? { id: logToRevert.user.id, username: logToRevert.user.username }
          : null,
        originalTimestamp: logToRevert.timestamp
      },
      contextId: logToRevert.contextId,
      sessionId: revertDto.sessionId
    },
    include: { user: true }
  });
}
 async getVisualizationData(dto: AuditLogVisualizationDto) {
  // Convert entityId to number if it exists
  const entityId = dto.entityId ? Number(dto.entityId) : undefined;

  // Get logs for visualization
  const logs = await this.prisma.auditLog.findMany({
    where: {
      entityType: dto.entityType,
      entityId: entityId, // Now properly typed as number | undefined
      timestamp: {
        gte: dto.startDate,
        lte: dto.endDate,
      },
    },
    orderBy: { timestamp: 'asc' },
    include: { user: { select: { username: true, email: true } } },
  });

  // Process into timeline data
  const timeline = logs.map(log => ({
    id: log.id,
    date: log.timestamp,
    action: log.action,
    user: log.user?.username || 'System',
    changes: log.changes,
  }));

  // Calculate statistics
  const stats = {
    totalActions: logs.length,
    actionsByType: logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {}),
    users: [...new Set(logs.map(log => log.user?.username || 'System'))],
  };

  return { timeline, stats };
}

  async getUserActivity(userId: number, days = 30, limit = 100) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.prisma.auditLog.findMany({
      where: { 
        userId,
        timestamp: { gte: date } 
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { 
        user: { 
          select: { 
            username: true, 
            email: true 
          } 
        } 
      },
    });
  }

  async getEntityHistory(entityType: string, entityId: number) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { timestamp: 'desc' },
      include: { user: true },
    });
  }

  async getRecentActivity(limit = 20) {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { user: { select: { username: true, email: true } } },
    });
  }
}