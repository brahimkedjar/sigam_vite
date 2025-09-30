// src/permis/dto/filter-permis.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterPermisDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  type?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}