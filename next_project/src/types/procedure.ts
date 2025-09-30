// types/procedure.ts
export interface EtapeProc {
  id_etape: number;
  lib_etape: string;
  duree_etape: number | null;
  ordre_etape: number;
  id_phase: number;
  procedureEtapes: ProcedureEtape[];
  typeProcedures?: TypeProcedure[]; // Add this to link etapes to procedure types
}

export interface Phase {
  id_phase: number;
  libelle: string;
  ordre: number;
  description: string | null;
  dureeEstimee: number | null;
  etapes: EtapeProc[];
  typeProcedures?: TypeProcedure[]; // Add this to link phases to procedure types
  typeProcedureId?: number | null; // Temporary field to help with filtering
}

export interface TypeProcedure {
  id: number;
  libelle: string;
  description: string | null;
  phases?: Phase[];
  etapes?: EtapeProc[];
}

// Add this interface to track which phases/etapes belong to which procedure types
export interface TypeProcedurePhase {
  id_type_procedure: number;
  id_phase: number;
  ordre: number;
  typeProcedure: TypeProcedure;
  phase: Phase;
}

export interface TypeProcedureEtape {
  id_type_procedure: number;
  id_etape: number;
  ordre: number;
  typeProcedure: TypeProcedure;
  etape: EtapeProc;
}

export interface ProcedurePhase {
  id_proc: number;
  id_phase: number;
  ordre: number;
  statut: StatutProcedure | null;
  procedure: Procedure;
  phase: Phase;
}

export interface ProcedureEtape {
  id_proc: number;
  id_etape: number;
  statut: StatutProcedure;
  date_debut: Date;
  date_fin: Date | null;
  link: string | null;
  etape: EtapeProc;
}

export interface Procedure {
  id_proc: number;
  id_seance: number | null;
  num_proc: string;
  date_debut_proc: string;
  date_fin_proc: string | null;
  statut_proc: string;
  resultat: string | null;
  observations: string | null;
  ProcedurePhase: ProcedurePhase[];
  ProcedureEtape: ProcedureEtape[];
  demandes: any[]; 
}

export enum StatutProcedure {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}
