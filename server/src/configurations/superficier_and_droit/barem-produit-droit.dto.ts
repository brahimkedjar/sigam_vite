import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsUUID, IsPositive } from 'class-validator';

export class BaremProduitDroitDto {
  @ApiProperty()
  @IsNumber()
  montant_droit_etab: number;

  @ApiProperty()
  @IsNumber()
  produit_attribution: number;

  @ApiProperty()
  @IsUUID()
  id_type_permis: string;

  @ApiProperty()
  @IsUUID()
  id_type_procedure: string;
}

export class CreateBaremProduitDroitDto {
  @ApiProperty({ description: 'Montant du droit établissement' })
  @IsNumber()
  @IsPositive()
  montant_droit_etab: number;

  @ApiProperty({ description: 'Produit attribution' })
  @IsNumber()
  @IsPositive()
  produit_attribution: number;

  @ApiProperty({ description: 'ID du type de permis' })
  @IsNumber()
  typePermisId: number;

  @ApiProperty({ description: 'ID du type de procédure' })
  @IsNumber()
  typeProcedureId: number;
}

export class UpdateBaremProduitDroitDto {
  @ApiProperty({ description: 'Montant du droit établissement', required: false })
  @IsNumber()
  @IsPositive()
  montant_droit_etab?: number;

  @ApiProperty({ description: 'Produit attribution', required: false })
  @IsNumber()
  @IsPositive()
  produit_attribution?: number;

  @ApiProperty({ description: 'ID du type de permis', required: false })
  @IsNumber()
  typePermisId?: number;

  @ApiProperty({ description: 'ID du type de procédure', required: false })
  @IsNumber()
  typeProcedureId?: number;
}
