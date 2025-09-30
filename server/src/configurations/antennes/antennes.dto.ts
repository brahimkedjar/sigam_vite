import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAntenneDto {
  @ApiProperty({ description: 'Antenne name', example: 'Antenne Nord' })
  @IsString()
  nom: string;

  @ApiProperty({ description: 'Antenne location', example: 'Alger', required: false })
  @IsString()
  @IsOptional()
  localisation?: string;
}

export class UpdateAntenneDto {
  @ApiProperty({ description: 'Antenne name', example: 'Antenne Nord', required: false })
  @IsString()
  @IsOptional()
  nom?: string;

  @ApiProperty({ description: 'Antenne location', example: 'Alger', required: false })
  @IsString()
  @IsOptional()
  localisation?: string;
}