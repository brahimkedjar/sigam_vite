// src/configurations/superficier_and_droit/dto/superficiaire-bareme.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SuperficiaireBaremeDto {
  @ApiProperty()
  @IsNumber()
  droit_fixe: number;

  @ApiProperty()
  @IsNumber()
  periode_initiale: number;

  @ApiProperty()
  @IsNumber()
  premier_renouv: number;

  @ApiProperty()
  @IsNumber()
  autre_renouv: number;

  @ApiProperty()
  @IsString()
  devise: string;
}

export class CreateSuperficiaireBaremeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  droit_fixe: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periode_initiale: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  premier_renouv: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  autre_renouv: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  devise: string;
}

export class UpdateSuperficiaireBaremeDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  droit_fixe?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  periode_initiale?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  premier_renouv?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  autre_renouv?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  devise?: string;
}