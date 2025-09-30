// dto/create-comite.dto.ts
export class CreateComiteDto {
  id_seance: number;
  date_comite: Date;
  numero_decision: string;
  objet_deliberation: string;
  resume_reunion: string;
  fiche_technique?: string;
  carte_projettee?: string;
  rapport_police?: string;
  id_proc?: number; // Make it optional for backward compatibility
}

export class CreateComiteWithProcedureDto extends CreateComiteDto {
  declare id_proc: number; // Required for procedure-specific comités
}