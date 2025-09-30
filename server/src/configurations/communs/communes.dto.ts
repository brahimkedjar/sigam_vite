import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommuneDto {
  @ApiProperty({ description: 'Daira ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_daira: number;

  @ApiProperty({ description: 'Commune code', example: '16001' })
  @IsString()
  @IsNotEmpty()
  code_commune: string;

  @ApiProperty({ description: 'Commune name', example: 'Sidi M\'Hamed' })
  @IsString()
  @IsNotEmpty()
  nom_communeFR: string;

  @ApiProperty({ description: 'اسم البلدية', example: 'سيدي محمد' })
  @IsString()
  @IsNotEmpty()
  nom_communeAR: string;
}

export class UpdateCommuneDto {
  @ApiProperty({ description: 'Daira ID', example: 1, required: false })
  @IsNumber()
  @IsNotEmpty()
  id_daira?: number;

  @ApiProperty({ description: 'Commune code', example: '16001', required: false })
  @IsString()
  @IsNotEmpty()
  code_commune?: string;

  @ApiProperty({ description: 'Commune name', example: 'Sidi M\'Hamed' })
  @IsString()
  @IsNotEmpty()
  nom_communeFR: string;

  @ApiProperty({ description: 'اسم البلدية', example: 'سيدي محمد' })
  @IsString()
  @IsNotEmpty()
  nom_communeAR: string;
}