import { StatutPermis as PrismaStatutPermis } from '@prisma/client';

export type StatutPermisCreateInput = {
  lib_statut: string;
  description?: string;
};

export type StatutPermisWhereUniqueInput = {
  id?: number;
  lib_statut?: string;
};
export enum StatutPermis {
  En_vigueur = 'En vigueur',
  INACTIF = 'INACTIF',
  EN_ATTENTE = 'EN_ATTENTE',
  EXPIRE = 'EXPIRE',
  REVOQUE = 'REVOQUE',
  RENOUVELLE = 'RENOUVELLE'
}