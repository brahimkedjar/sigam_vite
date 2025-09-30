// src/type-permis/dto/type-permis.dto.ts
export class CreateTypePermisDto {
  id_droit:number;
  id_taxe:number;
  lib_type: string;
  code_type: string;
  regime: string;
  duree_initiale: number;
  nbr_renouv_max: number;
  duree_renouv: number;
  delai_renouv: number;
  superficie_max?: number;
}

export class UpdateTypePermisDto {
  lib_type?: string;
  code_type?: string;
  regime?: string;
  duree_initiale?: number;
  nbr_renouv_max?: number;
  duree_renouv?: number;
  delai_renouv?: number;
  superficie_max?: number;
}

export class TypePermisResponseDto {
  id: number;
  lib_type: string;
  code_type: string;
  regime: string;
  duree_initiale: number;
  nbr_renouv_max: number;
  duree_renouv: number;
  delai_renouv: number;
  superficie_max?: number;
  createdAt: Date;
  updatedAt: Date;
}