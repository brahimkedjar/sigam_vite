import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AuditLogVisualizationDto {
  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  entityId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endDate?: string;
}