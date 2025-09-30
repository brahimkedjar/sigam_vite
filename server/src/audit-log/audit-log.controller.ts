import { Controller, Get, Post, Body, Query, Param, UseInterceptors, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user-role.enum';
import { AuditLogInputDto } from './dto/audit-log-input.dto';
import { RevertAuditLogDto } from './dto/revert-audit-log.dto';
import { AuditLogVisualizationDto } from './dto/audit-log-visualization.dto';
import { AuditLogStatsDto } from './dto/audit-log-stats.dto';
import { AuditLogData, AuditLogService } from './audit-log.service';
import { SessionService } from 'src/session/session.service';
import { Request } from 'express';
import { AuditLogInterceptor } from './audit-log.interceptor';
@ApiTags('Audit Logs')
@Controller('audit-logs')
export class AuditLogController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('log')
  async logAction(
    @Body() data: AuditLogInputDto,
    @Req() req: Request
  ): Promise<{ id: number }> {
    const token = req.cookies?.auth_token;
    let userId: number | null = null; // Explicitly type as number | null

    if (token) {
      const session = await this.sessionService.validateSession(token);
      userId = session?.userId ?? null;
    }

    const logData: AuditLogData = {
      ...data,
      userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      additionalData: {
        ...(data.additionalData || {}),
        isAuthenticated: !!userId,
        sessionId: token
      }
    };

    return this.auditLogService.log(logData);
  }
  

  @Get()
  @ApiOperation({ summary: 'Get paginated audit logs' })
  @ApiResponse({ status: 200, description: 'Returns paginated logs' })
  async getAuditLogs(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: number,
    @Query('userId') userId?: number,
    @Query('action') action?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
  ) {
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = Number(entityId);
    if (userId) where.userId = Number(userId);
    if (action) where.action = action;

    return this.auditLogService.getLogs({
      where,
      page: Number(page),
      limit: Number(limit),
      orderBy,
    });
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiResponse({ status: 200, description: 'Returns recent logs' })
  async getRecentActivity(@Query('limit') limit = 20) {
    return this.auditLogService.getRecentActivity(Number(limit));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user activity' })
  @ApiResponse({ status: 200, description: 'Returns user activity logs' })
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  async getUserActivity(
    @Param('userId') userId: number,
    @Query('days') days = 30,
    @Query('limit') limit = 100,
  ) {
    return this.auditLogService.getUserActivity(
      Number(userId),
      Number(days),
      Number(limit),
    );
  }

@Post('revert')
@ApiOperation({ summary: 'Revert an audit log action' })
@ApiResponse({ status: 200, description: 'Action reverted successfully' })
@ApiResponse({ status: 400, description: 'Invalid revert request' })
@Roles(UserRole.ADMIN)
async revertAction(@Body() revertDto: RevertAuditLogDto) {
  try {
    // Validate the request
    if (!revertDto.logId || !revertDto.userId) {
      throw new HttpException(
        'Missing required fields: logId and userId',
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.auditLogService.revertLog(revertDto);
  } catch (error) {
    throw new HttpException(
      error.message,
      HttpStatus.BAD_REQUEST
    );
  }
}

  @Get('visualize')
  @ApiOperation({ summary: 'Get visualization data for audit logs' })
  @ApiResponse({ status: 200, description: 'Returns visualization data' })
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  async getVisualizationData(@Query() dto: AuditLogVisualizationDto) {
    return this.auditLogService.getVisualizationData(dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audit log statistics' })
  @ApiResponse({ status: 200, description: 'Returns statistics', type: AuditLogStatsDto })
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  async getStats(@Query('days') days = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const [totalActions, actionsByType, activeUsers] = await Promise.all([
      this.auditLogService['prisma'].auditLog.count({
        where: { timestamp: { gte: date } },
      }),
      this.auditLogService['prisma'].auditLog.groupBy({
        by: ['action'],
        _count: { _all: true },
        where: { timestamp: { gte: date } },
      }),
      this.auditLogService['prisma'].auditLog.groupBy({
        by: ['userId'],
        _count: { _all: true },
        where: { timestamp: { gte: date } },
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalActions,
      actionsByType: actionsByType.reduce((acc, item) => {
        acc[item.action] = item._count._all;
        return acc;
      }, {}),
      topUsers: activeUsers.map(user => ({
        userId: user.userId,
        actionCount: user._count._all,
      })),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({ status: 200, description: 'Returns the audit log' })
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  async getLogById(@Param('id') id: number) {
    return this.auditLogService.getLogById(Number(id));
  }
}