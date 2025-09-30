import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PortailService {
  constructor(private prisma: PrismaService) {}

  async getTypesPermis() {
    return this.prisma.portalPermitType.findMany({
      select: { id: true, code: true, label: true, description: true, initialYears: true, regime: true }
    });
  }

  async getDocumentsForType(typePermisId: number) {
    const links = await this.prisma.portalTypeDocument.findMany({
      where: { permitTypeId: typePermisId },
      orderBy: { order: 'asc' },
      include: { document: true },
    });
    return links.map((l) => ({
      id_doc: l.documentId,
      nom_doc: l.document.name,
      is_obligatoire: l.document.required,
      format: l.document.format ?? '*',
      taille_doc: l.document.maxSizeMB ? `${l.document.maxSizeMB}MB` : '10MB',
    }));
  }

  private async ensureAccess(id_demande: number, token?: string) {
    const app = await this.prisma.portalApplication.findUnique({ where: { id: id_demande } });
    if (!app) throw new Error('Application not found');
    if (app.applicantToken && token && app.applicantToken === token) return true;
    if (app.applicantToken && !token) throw new Error('Unauthorized: missing portal token');
    return true;
  }

  async createPublicDemande(body: any, token?: string) {
    // Update existing application title if id provided (compat with old client)
    if (typeof body?.id_demande === 'number') {
      await this.ensureAccess(body.id_demande, token);
      const updated = await this.prisma.portalApplication.update({
        where: { id: body.id_demande },
        data: { title: body?.intitule_projet ?? undefined },
      });
      return { id_demande: updated.id };
    }

    // Ensure a valid permit type (avoid FK violations)
    let permitTypeId: number | null = Number.isFinite(Number(body?.id_typePermis))
      ? Number(body.id_typePermis)
      : null;

    if (permitTypeId != null) {
      const exists = await this.prisma.portalPermitType.findUnique({ where: { id: permitTypeId } });
      if (!exists) {
        // Auto-create a minimal type if the provided id doesn't exist
        const created = await this.prisma.portalPermitType.create({
          data: {
            code: String(body?.code_type ?? `TMP-${Date.now()}`),
            label: String(body?.lib_type ?? 'Type générique'),
            description: body?.description ?? null,
            initialYears: body?.initialYears ?? null,
            regime: body?.regime ?? null,
          },
        });
        permitTypeId = created.id;
      }
    } else {
      // No type provided: create a generic one once and reuse
      const genericCode = 'GENERIC';
      const generic = await this.prisma.portalPermitType.findFirst({ where: { code: genericCode } });
      if (generic) {
        permitTypeId = generic.id;
      } else {
        const created = await this.prisma.portalPermitType.create({
          data: { code: genericCode, label: 'Permis générique', description: 'Type par défaut (portail)', initialYears: 1, regime: 'mine' },
        });
        permitTypeId = created.id;
      }
    }

    const sessionToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const app = await this.prisma.portalApplication.create({
      data: {
        status: 'DRAFT',
        title: body?.intitule_projet ?? null,
        permitTypeId: permitTypeId!,
        code: body?.code_demande ?? null,
        applicantToken: sessionToken,
      },
    });
    return { id_demande: app.id, sessionToken };
  }

  async saveDocuments(id_demande: number, documents: { id_doc: number; status: 'present' | 'manquant'; file_url?: string }[], _remarques?: string, token?: string) {
    await this.ensureAccess(id_demande, token);
    for (const d of documents) {
      const existing = await this.prisma.portalApplicationDocument.findUnique({
        where: { applicationId_documentId: { applicationId: id_demande, documentId: d.id_doc } as any },
      }).catch(() => null);

      if (existing) {
        await this.prisma.portalApplicationDocument.update({
          where: { id: (existing as any).id },
          data: { status: d.status, fileUrl: d.file_url ?? null },
        });
      } else {
        await this.prisma.portalApplicationDocument.create({
          data: { applicationId: id_demande, documentId: d.id_doc, status: d.status, fileUrl: d.file_url ?? null },
        });
      }
    }
    return { ok: true };
  }

  async saveCoords(id_demande: number, body: any, token?: string) {
    await this.ensureAccess(id_demande, token);
    const updated = await this.prisma.portalApplication.update({
      where: { id: id_demande },
      data: {
        wilaya: body?.id_wilaya ? String(body.id_wilaya) : null,
        daira: body?.id_daira ? String(body.id_daira) : null,
        commune: body?.id_commune ? String(body.id_commune) : null,
        lieuDit: body?.lieu_dit ?? null,
        polygonGeo: body?.polygon ?? undefined,
      },
    });
    return { id_demande: updated.id };
  }

  async createPaymentIntent(id_demande: number, method: string, token?: string) {
    await this.ensureAccess(id_demande, token);
    const payment = await this.prisma.portalPayment.create({
      data: {
        applicationId: id_demande,
        provider: method,
        amount: 0,
        status: 'requires_payment_method',
        intentId: `pi_${id_demande}_${Date.now()}`,
      },
    });
    return {
      id: payment.intentId,
      method: payment.provider,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      clientSecret: `secret_${Math.random().toString(36).slice(2)}`,
    };
  }

  async getApplication(id: number, token?: string) {
    await this.ensureAccess(id, token);
    const app = await this.prisma.portalApplication.findUnique({
      where: { id },
      include: {
        permitType: true,
        company: { include: { reps: true, shareholders: true } },
        documents: { include: { document: true } },
        payments: true,
      },
    });
    if (!app) return null;
    return app;
  }

  async submitApplication(id: number, token?: string) {
    await this.ensureAccess(id, token);
    const updated = await this.prisma.portalApplication.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        code: {
          set: (await this.prisma.portalApplication.findUnique({ where: { id } }))?.code ?? `APP-${id}-${Date.now()}`,
        } as any,
      },
    });
    return { id_demande: updated.id, status: updated.status, code: updated.code };
  }

  private async ensureCompany(applicationId: number) {
    const app = await this.prisma.portalApplication.findUnique({ where: { id: applicationId } });
    if (app?.companyId) return app.companyId;
    const company = await this.prisma.portalCompany.create({ data: { legalName: 'Société sans nom' } });
    await this.prisma.portalApplication.update({ where: { id: applicationId }, data: { companyId: company.id } });
    return company.id;
  }

  async saveCompany(applicationId: number, body: any, token?: string) {
    await this.ensureAccess(applicationId, token);
    const companyId = await this.ensureCompany(applicationId);
    const data: any = {
      legalName: body?.legalName ?? undefined,
      legalForm: body?.legalForm ?? undefined,
      rcNumber: body?.rcNumber ?? undefined,
      rcDate: body?.rcDate ? new Date(body.rcDate) : undefined,
      nif: body?.nif ?? undefined,
      nis: body?.nis ?? undefined,
      capital: typeof body?.capital === 'number' ? body.capital : undefined,
      address: body?.address ?? undefined,
      email: body?.email ?? undefined,
      phone: body?.phone ?? undefined,
      website: body?.website ?? undefined,
      managerName: body?.managerName ?? undefined,
      registryFileUrl: body?.registryFileUrl ?? undefined,
    };
    const company = await this.prisma.portalCompany.update({ where: { id: companyId }, data });
    return { companyId: company.id };
  }

  async saveRepresentatives(applicationId: number, reps: Array<{ fullName: string; function?: string; nationalId?: string; email?: string; phone?: string; powerDocUrl?: string }>, token?: string) {
    await this.ensureAccess(applicationId, token);
    const companyId = await this.ensureCompany(applicationId);
    await this.prisma.portalRepresentative.deleteMany({ where: { companyId } });
    if (reps && reps.length) {
      await this.prisma.portalRepresentative.createMany({
        data: reps.map((r) => ({
          companyId,
          fullName: r.fullName,
          function: r.function ?? null,
          nationalId: r.nationalId ?? null,
          email: r.email ?? null,
          phone: r.phone ?? null,
          powerDocUrl: r.powerDocUrl ?? null,
        })),
      });
    }
    return { ok: true };
  }

  async saveShareholders(applicationId: number, shareholders: Array<{ name: string; type: string; nif?: string; sharePct: number; nationality?: string }>, token?: string) {
    await this.ensureAccess(applicationId, token);
    const companyId = await this.ensureCompany(applicationId);
    await this.prisma.portalShareholder.deleteMany({ where: { companyId } });
    if (shareholders && shareholders.length) {
      await this.prisma.portalShareholder.createMany({
        data: shareholders.map((s) => ({
          companyId,
          name: s.name,
          type: s.type,
          nif: s.nif ?? null,
          sharePct: s.sharePct,
          nationality: s.nationality ?? null,
        })),
      });
    }
    return { ok: true };
  }
}
