export class CreateSeanceDto {
  date_seance: string;
  exercice: number;
  remarques?: string;
  membre_ids: number[];
}

export class UpdateSeanceDto {
  date_seance?: string;
  exercice?: number;
  remarques?: string;
  membre_ids?: number[];
}

export class CreateComiteDto {
  id_seance: number;
  date_comite: string;
  objet_deliberation: string;
  resume_reunion: string;
  fiche_technique?: string;
  carte_projettee?: string;
  rapport_police?: string;
  decisions?: CreateDecisionDto[];
  numero_decision: string;
}

export class UpdateComiteDto {
  date_comite?: string;
  numero_decision?: string;
  objet_deliberation?: string;
  resume_reunion?: string;
  fiche_technique?: string;
  carte_projettee?: string;
  rapport_police?: string;
  decisions?: CreateDecisionDto[];

}

export class CreateDecisionDto {
  id_comite: number;
  decision_cd: 'favorable' | 'defavorable';
  duree_decision?: number;
  commentaires?: string;
  numero_decision: string;
}

export class CreateMembreDto {
  nom_membre: string;
  prenom_membre: string;
  fonction_membre: string;
  email_membre: string;
}

export class UpdateMembreDto {
  nom_membre?: string;
  prenom_membre?: string;
  fonction_membre?: string;
  email_membre?: string;
}