export class CreateDossierDto {
  id_typeProc: number;
  id_typePermis: number;
  nombre_doc: number;
  remarques?: string;
  documents: {
    nom_doc: string;
    description: string;
    format: string;
    taille_doc: string;
  }[];
}

export class UpdateDossierDto {
  id_typeProc?: number;
  id_typePermis?: number;
  nombre_doc?: number;
  remarques?: string;
  documents?: {
    id_doc?: number;
    nom_doc?: string;
    description?: string;
    format?: string;
    taille_doc?: string;
    action?: 'create' | 'update' | 'delete';
  }[];
}