export type Procedure = {
  id_proc: number;
  num_proc: string;
  societe: string;
  type_proc: string;
};

export type Seance = {
  id_seance: number;
  num_seance: string;
  date_seance: Date;
  membres: Membre[];
  procedures: Procedure[];
  statut: 'programmee' | 'terminee' | 'annulee';
};

export type Decision = {
  id_decision?: number;
  id_proc: number;
  decision: 'approuvee' | 'rejetee' | 'reportee' | 'en_attente';
  commentaires?: string;
  duree?: number;
  titre_minier?: string;
};

export type Membre = {
  id_membre: number;
  nom: string;
  prenom: string;
  fonction: string;
};

export type ComiteDecision = {
  id_decision: number;
  procedure: {
    num_proc: string;
    societe: string;
    type_proc: string;
  };
  seance: {
    num_seance: string;
  };
  decision: 'approuvee' | 'rejetee' | 'reportee';
  date_decision: string;
  titre_minier?: string;
};