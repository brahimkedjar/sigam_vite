import { ApiProperty } from '@nestjs/swagger';

export class AuditLogInputDto {
  @ApiProperty()
  action: string;

  @ApiProperty()
  entityType: string;

  @ApiProperty({ required: false })
  entityId?: number;

  @ApiProperty({ required: false })
  userId?: number;

  @ApiProperty({ required: false })
  changes?: Record<string, { old?: any; new?: any }>;

  @ApiProperty({ enum: ['SUCCESS', 'FAILURE'], required: false })
  status?: 'SUCCESS' | 'FAILURE';

  @ApiProperty({ required: false })
  errorMessage?: string;

  @ApiProperty({ required: false })
  additionalData?: Record<string, any>;

  @ApiProperty({ required: false })
  previousState?: any;

  @ApiProperty({ required: false })
  contextId?: string;

  @ApiProperty({ required: false })
  sessionId?: string;
}