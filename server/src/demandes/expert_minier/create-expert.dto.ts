import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateExpertDto {
  @IsString()
  @IsNotEmpty()
  nom_expert: string;

  @IsString()
  @IsNotEmpty()
  num_agrement: string;
  
@IsDateString()
@IsNotEmpty()
date_agrement: string;


  @IsString()
  @IsNotEmpty()
  etat_agrement: string;

  @IsString()
  @IsOptional()
  adresse?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  tel_expert?: string;

  @IsString()
  @IsOptional()
  fax_expert?: string;

  @IsString()
  @IsOptional()
  specialisation?: string;
}