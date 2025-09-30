import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTypePermisDto {
  @ApiProperty({ description: 'Type label', example: 'Concession minière' })
  @IsString()
  @IsNotEmpty()
  lib_type: string;

  @ApiProperty({ description: 'Type code', example: 'CM' })
  @IsString()
  @IsNotEmpty()
  code_type: string;

  @ApiProperty({ description: 'Regime', example: 'mines' })
  @IsString()
  @IsNotEmpty()
  regime: string;

  @ApiProperty({ description: 'Initial duration in years', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  duree_initiale: number;

  @ApiProperty({ description: 'Maximum renewals', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  nbr_renouv_max: number;

  @ApiProperty({ description: 'Renewal duration in years', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  duree_renouv: number;

  @ApiProperty({ description: 'Renewal delay in days', example: 180 })
  @IsNumber()
  @IsNotEmpty()
  delai_renouv: number;

  @ApiProperty({ description: 'Maximum surface area', example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  superficie_max?: number;

    @IsNumber()
  @IsNotEmpty()
  id_droit: number;

  @IsNumber()
  @IsNotEmpty()
  id_taxe: number;
}

export class UpdateTypePermisDto {
  @ApiProperty({ description: 'Type label', example: 'Concession minière', required: false })
  @IsString()
  @IsOptional()
  lib_type?: string;

  @ApiProperty({ description: 'Type code', example: 'CM', required: false })
  @IsString()
  @IsOptional()
  code_type?: string;

  @ApiProperty({ description: 'Regime', example: 'mines', required: false })
  @IsString()
  @IsOptional()
  regime?: string;

  @ApiProperty({ description: 'Initial duration in years', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  duree_initiale?: number;

  @ApiProperty({ description: 'Maximum renewals', example: 3, required: false })
  @IsNumber()
  @IsOptional()
  nbr_renouv_max?: number;

  @ApiProperty({ description: 'Renewal duration in years', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  duree_renouv?: number;

  @ApiProperty({ description: 'Renewal delay in days', example: 180, required: false })
  @IsNumber()
  @IsOptional()
  delai_renouv?: number;

  @ApiProperty({ description: 'Maximum surface area', example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  superficie_max?: number;

  @IsNumber()
  @IsNotEmpty()
  id_taxe: number;
  
}