import { IsNumber, IsOptional, IsString } from "class-validator";

export class RevertAuditLogDto {
  @IsNumber()
  logId: number;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}