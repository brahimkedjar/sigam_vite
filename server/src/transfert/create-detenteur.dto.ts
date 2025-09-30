import { IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRegistreCommerceDto {
  @IsOptional() @IsString() numero_rc?: string;
  @IsOptional() date_enregistrement?: string; // ISO
  @IsOptional() @IsNumber() capital_social?: number;
  @IsOptional() @IsString() nis?: string;
  @IsOptional() @IsString() nif?: string;
  @IsOptional() @IsString() adresse_legale?: string;
}

export class CreatePersonnePhysiqueDto {
  @IsString() nomFR: string;
  @IsString() prenomFR: string;
  @IsOptional() nomAR?: string;
  @IsOptional() prenomAR?: string;
  @IsOptional() date_naissance?: string;
  @IsOptional() lieu_naissance?: string;
  @IsOptional() nationalite?: string;
  @IsOptional() adresse_domicile?: string;
  @IsOptional() telephone?: string;
  @IsOptional() fax?: string;
  @IsOptional() email?: string;
  @IsOptional() qualification?: string;
  @IsOptional() num_carte_identite?: string;
  @IsOptional() lieu_juridique_soc?: string;
  @IsOptional() ref_professionnelles?: string;
  @IsOptional() id_pays?: number;
}

export class CreateFonctionDto {
  @IsNumber() id_personne: number;
  @IsString() type_fonction: string; // use EnumTypeFonction values
  @IsOptional() statut_personne?: string;
  @IsOptional() taux_participation?: number;
}

export class CreateDetenteurDto {
  @IsOptional() @IsString() nom_societeFR?: string;
  @IsOptional() @IsString() nom_societeAR?: string;
  @IsOptional() @IsNumber() id_statutJuridique?: number;
  @IsOptional() @IsNumber() id_pays?: number;
  @IsOptional() @IsString() adresse_siege?: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsString() fax?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() site_web?: string;

  @IsOptional() @ValidateNested() @Type(() => CreateRegistreCommerceDto) registreCommerce?: CreateRegistreCommerceDto;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreatePersonnePhysiqueDto) personnes?: CreatePersonnePhysiqueDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateFonctionDto) fonctions?: CreateFonctionDto[];
}
