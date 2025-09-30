// src/procedure/procedure.module.ts
import { Module } from '@nestjs/common';
import { PermisDashboardController } from './permis-dashboard.controller';
import { PermisDashboardService } from './permis-dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemandesDashboardService } from './demandes.service';
import { DemandesDashboardController } from './demandes.controller';
import { Permisdashboard2Service } from './permis.service';
import { PermisDashboard2Controller } from './permis.controller';

@Module({
  controllers: [PermisDashboardController,DemandesDashboardController,PermisDashboard2Controller],
  providers: [ PermisDashboardService,Permisdashboard2Service,DemandesDashboardService, PrismaService],
})
export class PermisDashboardfModule {}
