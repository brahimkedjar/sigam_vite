// src/permis/dto/create-permis.dto.ts
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePermisDto {
  @IsNumber()
  id_typePermis!: number | undefined;

  @IsOptional()
  @IsNumber()
  id_antenne?: number;

  @IsOptional()
  @IsNumber()
  id_detenteur?: number ;

  @IsOptional()
  @IsNumber()
  id_statut?: number;

  @IsString()
  code_permis: string;

  @IsOptional()
  @IsDateString()
  date_adjudication?: Date;

  @IsOptional()
  @IsDateString()
  date_octroi?: Date;

  @IsOptional()
  @IsDateString()
  date_expiration?: Date;

  @IsOptional()
  @IsDateString()
  date_annulation?: Date;

  @IsOptional()
  @IsDateString()
  date_renonciation?: Date;

  @IsNumber()
  duree_validite: number;

  @IsOptional()
  @IsString()
  lieu_dit?: string;

  @IsOptional()
  @IsString()
  mode_attribution?: string;

  @IsOptional()
  @IsNumber()
  superficie?: number;

  @IsOptional()
  @IsString()
  utilisation?: string;

  @IsOptional()
  @IsString()
  statut_juridique_terrain?: string;

  @IsOptional()
  @IsNumber()
  duree_prevue_travaux?: number;

  @IsOptional()
  @IsDateString()
  date_demarrage_travaux?: Date;

  @IsOptional()
  @IsString()
  statut_activites?: string;

  @IsNumber()
  nombre_renouvellements: number;

  @IsOptional()
  @IsString()
  commentaires?: string;
}