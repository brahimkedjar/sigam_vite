// seances/dto/create-seance.dto.ts
export class CreateSeanceDto {
  num_seance: string;
  date_seance: Date;
  exercice: number; // Add this field
  membresIds: number[];
  proceduresIds: number[];
  statut: 'programmee' | 'terminee';
  remarques?: string; // Optional field from your model
}