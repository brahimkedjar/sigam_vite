import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDairaDto {
  @ApiProperty({ description: 'Wilaya ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_wilaya: number;

  @ApiProperty({ description: 'Daira code', example: '1601' })
  @IsString()
  @IsNotEmpty()
  code_daira: string;

  @ApiProperty({ description: 'Daira name', example: 'Sidi M\'Hamed' })
  @IsString()
  @IsNotEmpty()
  nom_dairaFR: string;

  @ApiProperty({ description: 'Daira name', example: 'سي' })
  @IsString()
  @IsNotEmpty()
  nom_dairaAR: string;
}

export class UpdateDairaDto {
  @ApiProperty({ description: 'Wilaya ID', example: 1, required: false })
  @IsNumber()
  @IsNotEmpty()
  id_wilaya?: number;

  @ApiProperty({ description: 'Daira code', example: '1601', required: false })
  @IsString()
  @IsNotEmpty()
  code_daira?: string;

  @ApiProperty({ description: 'Daira name', example: 'Sidi M\'Hamed', required: false })
  @IsString()
  @IsNotEmpty()
  nom_daira?: string;
}