import { IsDateString, IsInt, IsISO8601 } from 'class-validator';

export class CreateRenewalDto {
  @IsInt()
  permisId: number;

  @IsISO8601()
  date_demande: string;
}
