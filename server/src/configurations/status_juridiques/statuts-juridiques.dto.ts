// src/statuts-juridiques/dto/statuts-juridiques.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatutJuridiqueDto {
  @ApiProperty({ description: 'Status code', example: 'SARL' })
  @IsString()
  @IsNotEmpty()
  code_statut: string;

  @ApiProperty({ description: 'Status in French', example: 'Société à responsabilité limitée' })
  @IsString()
  @IsNotEmpty()
  statut_fr: string;

  @ApiProperty({ description: 'Status in Arabic', example: 'شركة ذات مسؤولية محدودة' })
  @IsString()
  @IsNotEmpty()
  statut_ar: string;
}

export class UpdateStatutJuridiqueDto {
  @ApiProperty({ description: 'Status code', example: 'SARL', required: false })
  @IsString()
  @IsOptional()
  code_statut?: string;

  @ApiProperty({ description: 'Status in French', example: 'Société à responsabilité limitée', required: false })
  @IsString()
  @IsOptional()
  statut_fr?: string;

  @ApiProperty({ description: 'Status in Arabic', example: 'شركة ذات مسؤولية محدودة', required: false })
  @IsString()
  @IsOptional()
  statut_ar?: string;
}