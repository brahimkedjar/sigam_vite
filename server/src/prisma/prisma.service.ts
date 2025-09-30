import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private _substance: any;
    private _procedureRenouvellement: any;
  public get procedureRenouvellement(): any {
    return this._procedureRenouvellement;
  }
  public set procedureRenouvellement(value: any) {
    this._procedureRenouvellement = value;
  }
  public get substance(): any {
    return this._substance;
  }
  public set substance(value: any) {
    this._substance = value;
  }
  private _substanceAssocieeDemande: any;
  public get substanceAssocieeDemande(): any {
    return this._substanceAssocieeDemande;
  }
  public set substanceAssocieeDemande(value: any) {
    this._substanceAssocieeDemande = value;
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
