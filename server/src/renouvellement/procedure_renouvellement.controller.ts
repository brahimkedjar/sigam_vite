import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, ValidationPipe } from '@nestjs/common';
import { ProcedureRenouvellementService } from './procedure_renouvellemnt.service';
import { CreateRenewalDto } from './create-renouvellement.dto';
import { PaymentService } from 'src/demandes/paiement/payment.service';
import { StatutProcedure } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('api/procedures')
export class ProcedureRenouvellementController {
  constructor(
    private readonly proceduresService: ProcedureRenouvellementService,
    private readonly paymentService: PaymentService,
    private readonly prisma: PrismaService,
  ) {}

  @Get(':id/renouvellement')
  async getRenewalData(@Param('id') id: string) {
    return this.proceduresService.getRenewalData(+id);
  }

  @Post(':id/renouvellement')
  async createOrUpdateRenewal(@Param('id') id: string, @Body() renewalData: any) {
    return this.proceduresService.createOrUpdateRenewal(+id, renewalData);
  }

  @Get('type/:id/permit-type-details')
  async getPermitTypeDetails(@Param('id') id: string) {
    return this.proceduresService.getPermitTypeDetails(+id);
  }

  @Get(':id/renewals')
  async getPermisRenewals(@Param('id') id: string) {
    return this.proceduresService.getPermisRenewals(+id);
  }

  @Get(':id')
  async getProcedure(@Param('id') id: string) {
    return this.proceduresService.getProcedureWithType(+id);
  }

  @Post('renouvellement/start')
  async startRenewal(@Body() dto: CreateRenewalDto) {
    return this.proceduresService.startRenewalWithOriginalData(dto.permisId, dto.date_demande, StatutProcedure.EN_COURS);
  }

  @Post('renouvellement/check-payments')
  async checkPayments(@Body() body: { permisId: number }) {
    const { isPaid, missing } = await this.paymentService.checkAllObligationsPaid(body.permisId);

    const permit = await this.prisma.permis.findUnique({
      where: { id: body.permisId },
      include: {
        typePermis: true,
        procedures: {
          include: {
            demandes: {
              include: {
                renouvellement: true,
              },
            },
          },
        },
      },
    });

    if (!permit) {
      throw new NotFoundException('Permis non trouvé');
    }

    const renewalCount = permit.procedures.reduce((count, procedure) => {
      return count + procedure.demandes.filter((demande) => demande.renouvellement).length;
    }, 0);

    if (renewalCount >= permit.typePermis.nbr_renouv_max!) {
      throw new BadRequestException(
        `Nombre maximum de renouvellements (${permit.typePermis.nbr_renouv_max}) atteint pour ce permis`,
      );
    }

    if (!isPaid) {
      const message = missing.map((m) => `- ${m.libelle}: ${m.montantRestant.toLocaleString()} DZD`).join('\n');
      throw new BadRequestException(`Renouvellement bloqué :\n${message}`);
    }

    return {
      ok: true,
      currentRenewals: renewalCount,
      maxRenewals: permit.typePermis.nbr_renouv_max,
    };
  }

  @Get(':id/permis')
  async getProcedurePermis(@Param('id') id: string) {
    return this.proceduresService.getPermisForProcedure(+id);
  }
}