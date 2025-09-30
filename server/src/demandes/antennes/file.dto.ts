// wilaya/dto/create-wilaya.dto.ts
export class CreateWilayaDto {
  id_antenne: number;
  code_wilaya: string;
  nom_wilayaFR: string;
  nom_wilayaAR: string;
  zone: string
}

// wilaya/dto/update-wilaya.dto.ts
export class UpdateWilayaDto {
  id_antenne?: number;
  code_wilaya?: string;
  nom_wilayaFR?: string;
  nom_wilayaAR?: string;
  zone: string

}

// daira/dto/create-daira.dto.ts
export class CreateDairaDto {
  id_wilaya: number;
  code_daira: string;
  nom_dairaFR: string;
  nom_dairaAR: string;
}

// daira/dto/update-daira.dto.ts
export class UpdateDairaDto {
  id_wilaya?: number;
  code_daira?: string;
  nom_dairaFR: string;
  nom_dairaAR: string;
}

// commune/dto/create-commune.dto.ts
export class CreateCommuneDto {
  id_daira: number;
  code_commune: string;
  nom_communeFR: string;
  nom_communeAR: string;

}

// commune/dto/update-commune.dto.ts
export class UpdateCommuneDto {
  id_daira?: number;
  code_commune?: string;
  nom_communeFR?: string;
  nom_communeAR?: string;

}