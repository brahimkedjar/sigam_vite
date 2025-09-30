export class CreateDemandeDto {
  id_typeproc: number;
  objet_demande: string;
  id_expert?: number;  // ✅ optionnel
  detenteur?: any;
  personnes?: any;
  code_demande?: any;
}