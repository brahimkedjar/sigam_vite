// decisions/dto/create-decision.dto.ts
export class CreateDecisionDto {
  id_comite: number;
  decision_cd: 'favorable' | 'defavorable';
  duree_decision?: number;
  commentaires?: string;
  numero_decision: string;
}