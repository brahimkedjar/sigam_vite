import { Module } from '@nestjs/common';

import { DemandesModule } from './demandes/demande/demande.module';
import { DemandesController } from './demandes/demande/demande.controller';
import { DemandeService } from './demandes/demande/demande.service';
import { SocieteModule } from './demandes/societe/societe.module';
import { PrismaModule } from './prisma/prisma.module';
import { CapacitesModule } from './demandes/capacites/capacites.module';
import { SubstancesModule } from './demandes/substances/substances.module';
import { DocumentsModule } from './demandes/documents/document.module';
import { DemandeSummaryControllerModule } from './demandes/popup/popup.module';
import { InteractionWaliModule } from './demandes/avis_wali/interaction-wali.module';
import { ComiteDirectionModule } from './demandes/cd/cd.module';
import { ProcedureModule } from './dashboard/procedure.module';
import { ProcedureEtapeModule } from './procedure_etape/procedure-etape.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './role/admin.module';
import { TypePermisModule } from './demandes/type permis/type_permis.module';
import { AdminDossierModule } from './role/admin_dossier_administratif.module';
import { CoordonneesModule } from './demandes/cadastre/coordonnees.module';
import { VerificationGeoModule } from './demandes/cadastre/verification-geo.module';
import { CommuneModule } from './demandes/antennes/commune/commune.module';
import { WilayaModule } from './demandes/antennes/wilaya/wilaya.module';
import { DairaModule } from './demandes/antennes/daira/daira.module';
import { GeneratePermisModule } from './demandes/permis_generation/permis.module';
import { GeneratePdfModule } from './demandes/permis_generation/generate_permis_pdf.module';
import { PermisDashboardfModule } from './permis_dashboard/permis-dashboard.module';
import { CahierChargeModule } from './cahiercharge/cahier-charge.module';
import { PaymentModule } from './demandes/paiement/payement.module';
import { ProcedureRenouvellementModule } from './renouvellement/procedure_renouvellement.module';
import { ConfigModule } from '@nestjs/config';
import { TimelineModule } from './demandes/timeline of procedure/timeline.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SessionModule } from './session/session.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './audit-log/audit-log.interceptor';
import { ExpertMinierModule } from './demandes/expert_minier/expert-minier.module';
import { SeanceModule } from './demandes/seances/seance.module';
import { DecisionModule } from './demandes/decisions/decision.module';
import { ComitenModule } from './demandes/comites/comite.module';
import { DecisionTrackingModule } from './demandes/suivi_decisions/decision-tracking.module';
import { TypePermisconfModule } from './configurations/type-permis/type-permis.module';
import { StatutPermisconfModule } from './configurations/status-permis/statuts-permis.module';
import { TypeProceduresconfModule } from './configurations/type-procedure/type-procedures.module';
import { SuperficiaireBaremeModule } from './configurations/superficier_and_droit/superficiaire-bareme.module';
import { BaremProduitDroitModule } from './configurations/superficier_and_droit/barem-produit-droit.module';
import { RedevancesconfModule } from './configurations/redevance/redevances.module';
import { SubstancesconfModule } from './configurations/substances/substances.module';
import { StatutsJuridiquesconfconfModule } from './configurations/status_juridiques/status-juridiques.module';
import { WilayasconfModule } from './configurations/wilayas/wilayas.module';
import { DairasconfModule } from './configurations/dairas/dairas.module';
import { CommunesconfModule } from './configurations/communs/communes.module';
import { AntennesconfModule } from './configurations/antennes/antennes.module';
import { DetenteurMorale_confModule } from './configurations/gestion_permis/detenteur-morale.module';
import { Antenne_confModule } from './configurations/gestion_permis/antenne.module';
import { Permis_confModule } from './configurations/gestion_permis/permis_conf.module';
import { StatutPermis_confModule } from './configurations/gestion_permis/statut-permis.module';
import { TypePermis_confModule } from './configurations/gestion_permis/type-permis.module';
import { DemandesDashboardModule } from './demande_dashboard/demandes.module';
import { TransfertModule } from './transfert/transfert.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expert } from './notifications/expertminier';
import { Notification } from './notifications/notification.entity';
import { ChatModule } from './chat/chat.module';
// import { ProceduretechniqueModule } from './fichetechnique/fichtechnique.module';
import { PortailModule } from './portail/portail.module';
import { ArticleSetsModule } from './article_sets/article-sets.module';
import { InscriptionProvisoireModule } from './demandes/inscription_provisoire/inscription-provisoire.module';
import { PhasesEtapesConfigModule } from './configurations/phases-etapes/phases-etapes.module';


@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST || process.env.PGHOST || 'localhost',
      port: parseInt(process.env.TYPEORM_PORT || process.env.PGPORT || '5432', 10),
      username: process.env.TYPEORM_USERNAME || process.env.PGUSER || 'postgres',
      password: process.env.TYPEORM_PASSWORD || process.env.PGPASSWORD || 'crb12345',
      database: process.env.TYPEORM_DATABASE || process.env.PGDATABASE || 'sigam',
      entities: [Notification, Expert],
      synchronize: false,
    }),DemandesModule,PaymentModule,ConfigModule.forRoot({
      isGlobal: true,
    }),ProcedureRenouvellementModule,BaremProduitDroitModule,SuperficiaireBaremeModule,TypeProceduresconfModule,
    RedevancesconfModule,StatutPermisconfModule,TypePermisconfModule,DecisionTrackingModule,ComitenModule,DecisionModule,
    SeanceModule,ExpertMinierModule,SessionModule,AuditLogModule,PermisDashboardfModule,TimelineModule,CahierChargeModule,
    GeneratePdfModule,GeneratePermisModule,WilayaModule,DairaModule,CommuneModule,AdminDossierModule,CoordonneesModule,VerificationGeoModule,
    TypePermisModule,AuthModule,AdminModule,PrismaModule,ProcedureEtapeModule,ProcedureModule,ComiteDirectionModule,SocieteModule,
    InteractionWaliModule,CapacitesModule,SubstancesModule,DocumentsModule,DemandeSummaryControllerModule,SubstancesconfModule,
    StatutsJuridiquesconfconfModule,WilayasconfModule,DairasconfModule,CommunesconfModule,AntennesconfModule,DetenteurMorale_confModule,
    TypePermis_confModule,StatutPermis_confModule,Permis_confModule,Antenne_confModule,DemandesDashboardModule,TransfertModule,
    NotificationsModule,ChatModule,PortailModule,ArticleSetsModule,InscriptionProvisoireModule,PhasesEtapesConfigModule],
  controllers: [DemandesController],
  providers: [DemandeService,
    //{
    //  provide: APP_INTERCEPTOR,
     // useClass: AuditLogInterceptor,
   // }
  ],

})
export class AppModule {}
