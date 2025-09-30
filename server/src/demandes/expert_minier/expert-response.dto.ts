export class ExpertResponseDto {
  id_expert: number;
  nom_expert: string;
  num_agrement: string;
  date_agrement: Date;
  etat_agrement: string;
  adresse?: string;
  email?: string;
  tel_expert?: string;
  fax_expert?: string;
  specialisation?: string;
}