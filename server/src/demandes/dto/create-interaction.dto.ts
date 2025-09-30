// create-interaction.dto.ts
export class CreateInteractionDto {
  id_procedure: number;
  id_wilaya: number;
  type_interaction: 'envoi' | 'reponse';
  date_interaction: string; // This will be used for either date_envoi or date_reponse
  avis_wali?: 'favorable' | 'defavorable';
  remarques?: string;
  contenu?: string;
  nom_responsable_reception?: string;
  is_relance?: boolean;
}