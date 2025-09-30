import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatutPermisDto {
  @ApiProperty({ 
    description: 'Status label', 
    example: 'En vigueur' 
  })
  @IsString()
  @IsNotEmpty()
  lib_statut: string;

  @ApiProperty({ 
    description: 'Status description', 
    example: 'The mining title is currently active'
  })
  @IsString()
  @IsNotEmpty()
  description: string; // Changed from optional to required
}

export class UpdateStatutPermisDto {
  @ApiProperty({ 
    description: 'Status label', 
    example: 'En vigueur',
    required: false
  })
  @IsString()
  @IsOptional()
  lib_statut?: string;

  @ApiProperty({ 
    description: 'Status description', 
    example: 'The mining title is currently active',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}