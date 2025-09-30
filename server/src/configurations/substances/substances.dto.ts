import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubstanceDto {
  @ApiProperty({ description: 'French name of the substance', example: 'Or' })
  @IsString()
  @IsNotEmpty()
  nom_subFR!: string;

  @ApiProperty({ description: 'Arabic name of the substance', example: 'ذهب' })
  @IsString()
  @IsNotEmpty()
  nom_subAR!: string;

  @ApiProperty({ description: 'Substance category', example: 'Métal précieux' })
  @IsString()
  @IsNotEmpty()
  categorie_sub!: string;

  @ApiProperty({ description: 'Associated royalty rate ID', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_redevance?: number;
}

export class UpdateSubstanceDto {
  @ApiProperty({ description: 'French name of the substance', example: 'Or', required: false })
  @IsString()
  @IsOptional()
  nom_subFR?: string;

  @ApiProperty({ description: 'Arabic name of the substance', example: 'ذهب', required: false })
  @IsString()
  @IsOptional()
  nom_subAR?: string;

  @ApiProperty({ description: 'Substance category', example: 'Métal précieux', required: false })
  @IsString()
  @IsOptional()
  categorie_sub?: string;

  @ApiProperty({ description: 'Associated royalty rate ID', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_redevance?: number;
}