import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRedevanceDto {
  @ApiProperty({ description: 'Royalty rate percentage', example: 5.5 })
  @IsNumber()
  @IsNotEmpty()
  taux_redevance: number;

  @ApiProperty({ description: 'Market value', example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  valeur_marchande: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'tonne' })
  @IsString()
  @IsNotEmpty()
  unite: string;

  @ApiProperty({ description: 'Currency', example: 'DZD' })
  @IsString()
  @IsNotEmpty()
  devise: string;

  @ApiProperty({ description: 'Description', example: 'Taux pour les métaux précieux' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateRedevanceDto {
  @ApiProperty({ description: 'Royalty rate percentage', example: 5.5, required: false })
  @IsNumber()
  @IsOptional()
  taux_redevance?: number;

  @ApiProperty({ description: 'Market value', example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  valeur_marchande?: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'tonne', required: false })
  @IsString()
  @IsOptional()
  unite?: string;

  @ApiProperty({ description: 'Currency', example: 'DZD', required: false })
  @IsString()
  @IsOptional()
  devise?: string;

  @ApiProperty({ description: 'Description', example: 'Taux pour les métaux précieux', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}