// update-demande.dto.ts
export class UpdateDemandeDto {
  lieu_ditFR?: string;
  lieu_ditAR?: string;
  superficie?: number | null;
  statut_juridique_terrain?: string;
  occupant_terrain_legal?: string;
  description_travaux?: string;
  duree_travaux_estimee?: string | null;
  date_demarrage_prevue?: Date | null;
  destination?: string;
  budget_prevu?: number | null;
  id_wilaya?: number | null;
  id_daira?: number | null;
  id_commune?: number | null;
}