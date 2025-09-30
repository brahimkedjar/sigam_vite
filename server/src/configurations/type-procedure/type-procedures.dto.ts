import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTypeProcedureDto {
  @ApiProperty({ description: 'Procedure type label', example: 'Demande' })
  @IsString()
  libelle: string;

  @ApiProperty({ 
    description: 'Procedure type description', 
    example: 'Initial application for mining title',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTypeProcedureDto {
  @ApiProperty({ 
    description: 'Procedure type label', 
    example: 'Demande',
    required: false 
  })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiProperty({ 
    description: 'Procedure type description', 
    example: 'Initial application for mining title',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;
}