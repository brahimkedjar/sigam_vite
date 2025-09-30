import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetenteurDto } from './create-detenteur.dto';

export class StartTransfertDto {
  @IsNumber() permisId: number;
  @IsOptional() date_demande?: string;
  @IsOptional() @IsString() motif_transfert?: string;
  @IsOptional() @IsString() observations?: string;

  // either existingDetenteurId OR newDetenteur provided:
  @IsOptional() @IsNumber() existingDetenteurId?: number;
  @IsOptional() @ValidateNested() @Type(() => CreateDetenteurDto) newDetenteur?: CreateDetenteurDto;

  @IsOptional() @IsBoolean() applyTransferToPermis?: boolean; // if true, update permis.id_detenteur -> new detenteur
}
