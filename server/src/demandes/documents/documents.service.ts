import { Injectable } from '@nestjs/common';
import { MissingAction, Prisma, StatutProcedure } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

type DocStatus = 'present' | 'manquant' | 'attente';

type MissingSummaryEntry = {
  id_doc: number;
  nom_doc: string;
  missing_action?: MissingAction;
  reject_message?: string | null;
};

type MissingSummary = {
  requiredMissing: MissingSummaryEntry[];
  blocking: MissingSummaryEntry[];
  blockingNext: MissingSummaryEntry[];
  warnings: MissingSummaryEntry[];
};

type DeadlinePayload = {
  miseEnDemeure: string | null;
  instruction: string | null;
};

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  private addBusinessDays(base: Date, businessDays: number) {
    const result = new Date(base);
    let added = 0;

    while (added < businessDays) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        added += 1;
      }
    }

    return result;
  }

  private addDays(base: Date, days: number) {
    const result = new Date(base);
    result.setDate(result.getDate() + days);
    return result;
  }

  private generateReference(prefix: string) {
    const uniquePart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${uniquePart}-${Date.now()}`;
  }

  private summariseMissing(
    definitions: Array<{
      id_doc: number;
      nom_doc: string;
      is_required: boolean;
      missing_action: MissingAction;
      reject_message: string | null;
    }>,
    statuses: Array<{ id_doc: number; status: string }>
  ) {
    const missingRequired = definitions.filter((def) => {
      if (!def.is_required) {
        return false;
      }
      const match = statuses.find((s) => s.id_doc === def.id_doc);
      return !match || match.status !== 'present';
    });

    const blocking = missingRequired.filter((def) => def.missing_action === MissingAction.REJECT);
    const blockingNext = missingRequired.filter((def) => def.missing_action === MissingAction.BLOCK_NEXT);
    const warnings = missingRequired.filter((def) => def.missing_action === MissingAction.WARNING);

    const summary: MissingSummary = {
      requiredMissing: missingRequired.map((def) => ({
        id_doc: def.id_doc,
        nom_doc: def.nom_doc,
        missing_action: def.missing_action,
        reject_message: def.reject_message,
      })),
      blocking: blocking.map((def) => ({
        id_doc: def.id_doc,
        nom_doc: def.nom_doc,
        reject_message: def.reject_message,
      })),
      blockingNext: blockingNext.map((def) => ({
        id_doc: def.id_doc,
        nom_doc: def.nom_doc,
      })),
      warnings: warnings.map((def) => ({
        id_doc: def.id_doc,
        nom_doc: def.nom_doc,
      })),
    };

    const allPresent = definitions.every((def) => {
      if (!def.is_required) {
        return true;
      }
      const match = statuses.find((s) => s.id_doc === def.id_doc);
      return Boolean(match) && match!.status === 'present';
    });

    let dossierStatus: 'complet' | 'incomplet' | 'reserve' | 'rejete';
    if (blocking.length > 0) {
      dossierStatus = 'rejete';
    } else if (blockingNext.length > 0) {
      dossierStatus = 'incomplet';
    } else if (warnings.length > 0) {
      dossierStatus = 'reserve';
    } else {
      dossierStatus = allPresent ? 'complet' : 'incomplet';
    }

    return { summary, dossierStatus };
  }

  private computeDeadlines(
    summary: MissingSummary,
    options: {
      dateDepot?: Date | null;
      dateMiseEnDemeure?: Date | null;
      dateRecepisse?: Date | null;
    }
  ): DeadlinePayload {
    const depot = options.dateDepot ? new Date(options.dateDepot) : null;
    const miseBase = options.dateMiseEnDemeure ? new Date(options.dateMiseEnDemeure) : depot;
    const recepisseBase = options.dateRecepisse ? new Date(options.dateRecepisse) : depot;

    // 30 jours calendaires (pas jours ouvrables)
    const miseEnDemeureDeadline =
      summary.blockingNext.length > 0 && miseBase
        ? this.addDays(miseBase, 30).toISOString()
        : null;

    const instructionDeadline =
      summary.blocking.length === 0 && summary.blockingNext.length === 0 && recepisseBase
        ? this.addBusinessDays(recepisseBase, 10).toISOString()
        : null;

    return {
      miseEnDemeure: miseEnDemeureDeadline,
      instruction: instructionDeadline,
    };
  }

  async getDocumentsByDemande(id_demande: number) {
    const demande = await this.prisma.demande.findUnique({
      where: { id_demande },
      include: {
        procedure: true,
        typePermis: true,
        typeProcedure: true,
        dossiersFournis: {
          include: {
            documents: {
              include: {
                document: true,
              },
            },
          },
          orderBy: { date_depot: 'desc' },
          take: 1,
        },
      },
    });

    if (!demande?.id_typeProc || !demande?.id_typePermis) {
      throw new Error('Type procedure or type permis data is missing.');
    }

    const dossier = await this.prisma.dossierAdministratif.findFirst({
      where: {
        id_typeproc: demande.id_typeProc,
        id_typePermis: demande.id_typePermis,
      },
      include: {
        dossierDocuments: {
          include: {
            document: true,
          },
        },
      },
    });

    if (!dossier) {
      throw new Error('No dossier administratif configured for this procedure/permis.');
    }

    const docDefinitions = dossier.dossierDocuments.map((dd) => ({
      id_doc: dd.document.id_doc,
      nom_doc: dd.document.nom_doc,
      document: dd.document,
      is_required: dd.is_obligatoire ?? false,
      missing_action: dd.missing_action ?? MissingAction.BLOCK_NEXT,
      reject_message: dd.reject_message ?? null,
    }));

    const latestDossierFournis = demande.dossiersFournis[0];
    const existingStatuses =
      latestDossierFournis?.documents?.map((doc) => ({
        id_doc: doc.id_doc,
        status: doc.status as DocStatus,
        file_url: doc.file_url ?? null,
      })) ?? [];

    const { summary, dossierStatus } = this.summariseMissing(
      docDefinitions.map(({ id_doc, nom_doc, is_required, missing_action, reject_message }) => ({
        id_doc,
        nom_doc,
        is_required,
        missing_action,
        reject_message,
      })),
      existingStatuses
    );

    const documents = docDefinitions.map((def) => {
      const status = existingStatuses.find((s) => s.id_doc === def.id_doc);
      const statut = status?.status ?? 'manquant';
      return {
        id_doc: def.id_doc,
        nom_doc: def.document.nom_doc,
        description: def.document.description,
        format: def.document.format,
        taille_doc: def.document.taille_doc,
        statut,
        file_url: status?.file_url ?? null,
        is_required: def.is_required,
        missing_action: def.missing_action,
        reject_message: def.reject_message,
      };
    });

    const deadlines = this.computeDeadlines(summary, {
      dateDepot: latestDossierFournis?.date_depot ?? null,
      dateMiseEnDemeure: latestDossierFournis?.date_mise_en_demeure ?? null,
      dateRecepisse: latestDossierFournis?.date_recepisse ?? null,
    });

    return {
      documents,
      dossierFournis: latestDossierFournis
        ? {
            id_dossierFournis: latestDossierFournis.id_dossierFournis,
            statut_dossier: dossierStatus,
            remarques: latestDossierFournis.remarques,
            date_depot: latestDossierFournis.date_depot,
            numero_accuse: latestDossierFournis.numero_accuse,
            date_accuse: latestDossierFournis.date_accuse,
            numero_recepisse: latestDossierFournis.numero_recepisse,
            date_recepisse: latestDossierFournis.date_recepisse,
            mise_en_demeure_envoyee: latestDossierFournis.mise_en_demeure_envoyee,
            date_mise_en_demeure: latestDossierFournis.date_mise_en_demeure,
            pieces_manquantes: latestDossierFournis.pieces_manquantes,
            verification_phase: latestDossierFournis.verification_phase,
            date_preannotation: latestDossierFournis.date_preannotation,
          }
        : null,
      missingSummary: summary,
      deadlines,
    };
  }

  async createOrUpdateDossierFournis(
    id_demande: number,
    documents: { id_doc: number; status: DocStatus; file_url?: string | null }[],
    remarques?: string
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const demande = await prisma.demande.findUnique({
        where: { id_demande },
        include: {
          procedure: true,
        },
      });

      if (!demande?.id_typeProc || !demande?.id_typePermis) {
        throw new Error('Type procedure or type permis data is missing.');
      }

      const dossierDefinition = await prisma.dossierAdministratif.findFirst({
        where: {
          id_typeproc: demande.id_typeProc,
          id_typePermis: demande.id_typePermis,
        },
        include: {
          dossierDocuments: {
            include: {
              document: true,
            },
          },
        },
      });

      if (!dossierDefinition) {
        throw new Error('No dossier administratif configured for this procedure/permis.');
      }

      const definitionMap = new Map<
        number,
        {
          nom_doc: string;
          is_required: boolean;
          missing_action: MissingAction;
          reject_message: string | null;
        }
      >();

      dossierDefinition.dossierDocuments.forEach((def) => {
        definitionMap.set(def.document.id_doc, {
          nom_doc: def.document.nom_doc,
          is_required: def.is_obligatoire ?? false,
          missing_action: def.missing_action ?? MissingAction.BLOCK_NEXT,
          reject_message: def.reject_message ?? null,
        });
      });

      const statusEntries = documents.map((doc) => ({
        id_doc: doc.id_doc,
        status: doc.status,
        file_url: doc.file_url ?? null,
      }));

      const summarySource = statusEntries.map((entry) => ({
        id_doc: entry.id_doc,
        status: entry.status === 'present' ? 'present' : 'manquant',
      }));

      const { summary, dossierStatus } = this.summariseMissing(
        Array.from(definitionMap.entries()).map(([id_doc, meta]) => ({
          id_doc,
          nom_doc: meta.nom_doc,
          is_required: meta.is_required,
          missing_action: meta.missing_action,
          reject_message: meta.reject_message,
        })),
        summarySource
      );

      const now = new Date();

      const existingDossier = await prisma.dossierFournis.findFirst({
        where: { id_demande },
        include: { documents: true },
      });

      const piecesManquantes: MissingSummaryEntry[] = summary.requiredMissing.map((item) => ({
        id_doc: item.id_doc,
        nom_doc: item.nom_doc,
        missing_action: item.missing_action,
        reject_message: item.reject_message,
      }));

      // 30 jours calendaires (pas jours ouvrables)
      const miseEnDemeureDeadlineDate = summary.blockingNext.length > 0 ? this.addDays(now, 30) : null;

      const piecesManquantesValue: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
        piecesManquantes.length > 0
          ? ({
              generated_at: now.toISOString(),
              deadline: miseEnDemeureDeadlineDate?.toISOString() ?? null,
              deadlines: {
                mise_en_demeure: miseEnDemeureDeadlineDate?.toISOString() ?? null,
                instruction: null,
              },
              items: piecesManquantes,
            } as Prisma.InputJsonValue)
          : Prisma.NullableJsonNullValueInput.JsonNull;

      const verificationPhase = summary.blocking.length > 0
        ? 'REJET'
        : summary.blockingNext.length > 0
        ? 'MISE_EN_DEMEURE'
        : 'RECEVABILITE';

      const commonData: {
        statut_dossier: string;
        remarques: string | null | undefined;
        date_depot: Date;
        verification_phase: string;
        mise_en_demeure_envoyee: boolean;
        date_mise_en_demeure: Date | null;
        pieces_manquantes: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
      } = {
        statut_dossier: dossierStatus,
        remarques,
        date_depot: now,
        verification_phase: verificationPhase,
        mise_en_demeure_envoyee: summary.blockingNext.length > 0,
        date_mise_en_demeure: summary.blockingNext.length > 0 ? now : null,
        pieces_manquantes: piecesManquantesValue,
      };

      const createDocumentsPayload = statusEntries.map((item) => ({
        id_doc: item.id_doc,
        status: item.status,
        file_url: item.file_url,
      }));

      let dossierResult;
      if (existingDossier) {
        await prisma.dossierFournisDocument.deleteMany({
          where: { id_dossierFournis: existingDossier.id_dossierFournis },
        });

        dossierResult = await prisma.dossierFournis.update({
          where: { id_dossierFournis: existingDossier.id_dossierFournis },
          data: {
            ...commonData,
            numero_accuse: existingDossier.numero_accuse ?? this.generateReference('ACC'),
            date_accuse: existingDossier.date_accuse ?? now,
            numero_recepisse:
              piecesManquantes.length === 0
                ? existingDossier.numero_recepisse ?? this.generateReference('REC')
                : existingDossier.numero_recepisse,
            date_recepisse:
              piecesManquantes.length === 0
                ? existingDossier.date_recepisse ?? now
                : existingDossier.date_recepisse,
            date_preannotation:
              piecesManquantes.length === 0
                ? existingDossier.date_preannotation ?? now
                : existingDossier.date_preannotation,
            documents: {
              createMany: {
                data: createDocumentsPayload,
              },
            },
          },
          include: { documents: true },
        });
      } else {
        dossierResult = await prisma.dossierFournis.create({
          data: {
            id_demande,
            ...commonData,
            numero_accuse: this.generateReference('ACC'),
            date_accuse: now,
            numero_recepisse: piecesManquantes.length === 0 ? this.generateReference('REC') : null,
            date_recepisse: piecesManquantes.length === 0 ? now : null,
            date_preannotation: piecesManquantes.length === 0 ? now : null,
            documents: {
              createMany: {
                data: createDocumentsPayload,
              },
            },
          },
          include: { documents: true },
        });
      }

      if (piecesManquantes.length === 0) {
        dossierResult = await prisma.dossierFournis.update({
          where: { id_dossierFournis: dossierResult.id_dossierFournis },
          data: {
            mise_en_demeure_envoyee: false,
            date_mise_en_demeure: null,
            pieces_manquantes: Prisma.NullableJsonNullValueInput.JsonNull,
          },
          include: { documents: true },
        });
      }

      if (summary.blocking.length > 0) {
        const reason = summary.blocking
          .map((item) => item.reject_message || 'Document obligatoire manquant')
          .join(', ');

        await prisma.demande.update({
          where: { id_demande },
          data: {
            statut_demande: 'REJETEE',
            remarques: reason,
            date_refus: now,
          },
        });

        // Do not auto-close the whole procedure when saving documents
        // Saving an étape should only update the step's status, not the procedure's.
        // If a rejection needs to close the procedure, call the explicit
        // procedure termination endpoint or updateDemandeStatus instead.
        // Keeping the procedure open here avoids premature TERMINEE status.
        // if (demande.id_proc) {
        //   await prisma.procedure.update({
        //     where: { id_proc: demande.id_proc },
        //     data: {
        //       statut_proc: StatutProcedure.TERMINEE,
        //       date_fin_proc: now,
        //     },
        //   });
        // }
      }

      const deadlines = this.computeDeadlines(summary, {
        dateDepot: dossierResult.date_depot,
        dateMiseEnDemeure: dossierResult.date_mise_en_demeure,
        dateRecepisse: dossierResult.date_recepisse,
      });

      return {
        message: 'Dossier fournis enregistre',
        dossierFournis: dossierResult,
        missingSummary: summary,
        deadlines,
      };
    });
  }

  async updateDemandeStatus(
    id_demande: number,
    statut_demande: 'ACCEPTEE' | 'REJETEE',
    rejectionReason?: string
  ) {
    // Update demande with correct fields present in schema
    const now = new Date();
    const updatedDemande = await this.prisma.demande.update({
      where: { id_demande },
      data: {
        statut_demande,
        ...(statut_demande === 'ACCEPTEE'
          ? {
              date_demande: now,
              remarques: null,
              num_enregist: this.generateReference('ENR'),
            }
          : {}),
        ...(statut_demande === 'REJETEE'
          ? {
              date_refus: now,
              remarques: rejectionReason || 'Reason not specified',
            }
          : {}),
      },
      include: { procedure: true },
    });

    // Do not auto-close the procedure here on rejection.
    // Keep procedure open until an explicit finalization endpoint is called.
    // if (statut_demande === 'REJETEE' && updatedDemande.id_proc) {
    //   await this.prisma.procedure.update({
    //     where: { id_proc: updatedDemande.id_proc! },
    //     data: {
    //       statut_proc: StatutProcedure.TERMINEE,
    //       date_fin_proc: now,
    //     },
    //   });
    // }

    return updatedDemande;
  }

  async generateLetters(id_demande: number) {
    const data = await this.getDocumentsByDemande(id_demande);
    const demande = await this.prisma.demande.findUnique({
      where: { id_demande },
      include: {
        detenteurdemande: { include: { detenteur: true } },
        procedure: true,
      },
    });

    if (!demande) {
      throw new Error('Demande not found');
    }

    const now = new Date();
    const detenteurName =
      demande.detenteurdemande?.[0]?.detenteur?.nom_societeFR || 'Le demandeur';
    const dossier = data.dossierFournis;

    const missingList = data.missingSummary.requiredMissing.map((m: any) => `- ${m.nom_doc}`).join('\n');
    const blockingNext = data.missingSummary.blockingNext.length > 0;
    const blocking = data.missingSummary.blocking.length > 0;
    const isComplete = data.missingSummary.requiredMissing.length === 0;

    const miseEnDemeure = blockingNext
      ? {
          type: 'MISE_EN_DEMEURE' as const,
          createdAt: now.toISOString(),
          deadline: data.deadlines.miseEnDemeure,
          content: `Objet: Mise en demeure de compléter le dossier\n\n` +
            `${detenteurName},\n\n` +
            `Suite au dépôt de votre dossier (ACC: ${dossier?.numero_accuse ?? 'N/A'}), ` +
            `nous constatons l'absence des pièces suivantes:\n\n${missingList}\n\n` +
            `Conformément aux procédures en vigueur, vous disposez d'un délai maximum de 30 jours ` +
            `à compter de la date de cette notification pour compléter votre dossier. ` +
            `Passé ce délai, votre demande sera rejetée.\n\n` +
            `Date: ${now.toLocaleDateString()}\n` +
            (data.deadlines.miseEnDemeure ? `Date limite: ${new Date(data.deadlines.miseEnDemeure).toLocaleDateString()}\n` : ''),
          items: data.missingSummary.requiredMissing,
        }
      : null;

    const rejet = blocking
      ? {
          type: 'REJET' as const,
          createdAt: now.toISOString(),
          content: `Objet: Notification de rejet de la demande\n\n` +
            `${detenteurName},\n\n` +
            `Votre demande a été rejetée en raison des manquements suivants:\n\n${missingList}\n\n` +
            `Vous pouvez déposer une nouvelle demande après correction.\n\nDate: ${now.toLocaleDateString()}`,
          items: data.missingSummary.blocking,
        }
      : null;

    const recepisse = isComplete
      ? {
          type: 'RECEPISSE' as const,
          createdAt: now.toISOString(),
          numero_recepisse: dossier?.numero_recepisse ?? this.generateReference('REC'),
          content: `Objet: Récépissé de recevabilité\n\n` +
            `${detenteurName},\n\n` +
            `Nous accusons réception d'un dossier complet et recevable pour instruction. ` +
            `Le délai d'instruction démarre à compter de ce jour.\n\n` +
            `Numéro de récépissé: ${dossier?.numero_recepisse ?? 'A attribuer'}\n` +
            `Date: ${now.toLocaleDateString()}`,
        }
      : null;

    return {
      demande: { id_demande, code_demande: demande.code_demande, num_enregist: demande.num_enregist },
      dossierFournis: dossier,
      letters: { miseEnDemeure, rejet, recepisse },
    };
  }

  async generateRecepissePdf(id_demande: number): Promise<{ buffer: Buffer; filename: string }> {
    const data = await this.getDocumentsByDemande(id_demande);
    const demande = await this.prisma.demande.findUnique({
      where: { id_demande },
      include: {
        typePermis: true,
        detenteurdemande: { include: { detenteur: true } },
        wilaya: true,
        daira: true,
        commune: true,
      },
    });

    if (!demande) throw new Error('Demande not found');

    const dossier = data.dossierFournis;
    if (!dossier || data.missingSummary.requiredMissing.length > 0) {
      throw new Error('Recepisse is only available for complete dossiers');
    }

    // PDF layout helpers (margins, wrapping, pagination)
    const pdf = await PDFDocument.create();
    // A4 size in points
    const PAGE = { w: 595, h: 842 };
    // Slightly larger margins to keep text inside a clear border
    const MARGIN = { l: 60, r: 60, t: 70, b: 70 };
    const maxWidth = PAGE.w - MARGIN.l - MARGIN.r;

    const fontPath = path.resolve(__dirname, '../permis_generation/Amiri-Regular.ttf');
    let font = null as any;
    try {
      const fontBytes = fs.readFileSync(fontPath);
      font = await pdf.embedFont(fontBytes);
    } catch {
      font = await pdf.embedFont(StandardFonts.Helvetica);
    }

    let page = pdf.addPage([PAGE.w, PAGE.h]);
    let cursorY = PAGE.h - MARGIN.t;
    const lineGap = 6;
    // Draw a subtle border on the page to keep content visually contained
    const drawPageBorder = () => {
      page.drawRectangle({
        x: MARGIN.l - 10,
        y: MARGIN.b - 10,
        width: PAGE.w - (MARGIN.l + MARGIN.r) + 20,
        height: PAGE.h - (MARGIN.t + MARGIN.b) + 20,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
    };
    drawPageBorder();

    const measure = (text: string, size: number) => font.widthOfTextAtSize(text, size);

    const wrapLines = (text: string, size: number): string[] => {
      const words = (text || '').split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let current = '';
      for (const w of words) {
        const test = current ? `${current} ${w}` : w;
        if (measure(test, size) <= maxWidth) {
          current = test;
        } else {
          if (current) lines.push(current);
          // If single word exceeds width, hard split
          if (measure(w, size) > maxWidth) {
            let acc = '';
            for (const ch of w) {
              const testCh = acc + ch;
              if (measure(testCh, size) > maxWidth) {
                if (acc) lines.push(acc);
                acc = ch;
              } else {
                acc = testCh;
              }
            }
            current = acc;
          } else {
            current = w;
          }
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    const ensureSpace = (heightNeeded: number) => {
      if (cursorY - heightNeeded < MARGIN.b) {
        page = pdf.addPage([PAGE.w, PAGE.h]);
        cursorY = PAGE.h - MARGIN.t;
        drawPageBorder();
      }
    };

    const drawParagraph = (text: string, size = 12) => {
      const lh = size + lineGap;
      const lines = wrapLines(text, size);
      ensureSpace(lh * lines.length);
      for (const line of lines) {
        if (line === '') {
          cursorY -= lh; // paragraph spacing
        } else {
          page.drawText(line, { x: MARGIN.l, y: cursorY, size, font, color: rgb(0, 0, 0) });
          cursorY -= lh;
        }
      }
    };

    const drawTitle = (text: string, size = 16) => {
      const width = measure(text, size);
      const x = MARGIN.l + Math.max(0, (maxWidth - width) / 2);
      ensureSpace(size + 10);
      page.drawText(text, { x, y: cursorY, size, font, color: rgb(0, 0, 0) });
      cursorY -= size + 10;
    };

    // Header
    drawParagraph('République Algérienne Démocratique et Populaire', 11);
    drawParagraph('Ministère de l’Énergie et des Mines', 11);
    cursorY -= 8;
    drawTitle('RÉCÉPISSÉ DE RECEVABILITÉ', 14);

    // Body
    const num = dossier.numero_recepisse || '—';
    const dateStr = (dossier.date_recepisse ? new Date(dossier.date_recepisse) : new Date()).toLocaleDateString('fr-DZ');
    const demandeCode = demande.code_demande || String(id_demande);
    const detenteur =
      demande.detenteurdemande?.[0]?.detenteur?.nom_societeFR || 'Le demandeur';
    const typePermis = demande.typePermis?.lib_type || '—';

    drawParagraph(`Numéro de récépissé: ${num}`, 12);
    drawParagraph(`Date: ${dateStr}`, 12);
    drawParagraph(`Code de la demande: ${demandeCode}`, 12);
    drawParagraph(`Détenteur: ${detenteur}`, 12);
    drawParagraph(`Type de permis: ${typePermis}`, 12);
    cursorY -= 6;
    drawParagraph(`Nous accusons réception d'un dossier complet et recevable pour instruction.`, 12);
    cursorY -= 12;
    drawParagraph('Ce récépissé marque le départ des délais d’instruction.', 10);

    const buffer = Buffer.from(await pdf.save());
    const filename = `recepisse-${demandeCode}.pdf`;
    return { buffer, filename };
  }

  async generateMiseEnDemeurePdf(id_demande: number): Promise<{ buffer: Buffer; filename: string }> {
    const data = await this.getDocumentsByDemande(id_demande);
    const demande = await this.prisma.demande.findUnique({
      where: { id_demande },
      include: {
        detenteurdemande: { include: { detenteur: true } },
        typePermis: true,
      },
    });

    if (!demande) throw new Error('Demande not found');
    if (!data || !data.missingSummary || data.missingSummary.requiredMissing.length === 0) {
      throw new Error('Mise en demeure disponible uniquement pour dossier incomplet');
    }

    // PDF layout helpers
    const pdf = await PDFDocument.create();
    const PAGE = { w: 595, h: 842 };
    const MARGIN = { l: 60, r: 60, t: 70, b: 70 };
    const maxWidth = PAGE.w - MARGIN.l - MARGIN.r;

    const fontPath = path.resolve(__dirname, '../permis_generation/Amiri-Regular.ttf');
    let font = null as any;
    try {
      const fontBytes = fs.readFileSync(fontPath);
      font = await pdf.embedFont(fontBytes);
    } catch {
      font = await pdf.embedFont(StandardFonts.Helvetica);
    }

    let page = pdf.addPage([PAGE.w, PAGE.h]);
    let cursorY = PAGE.h - MARGIN.t;
    const lineGap = 6;

    const measure = (text: string, size: number) => font.widthOfTextAtSize(text, size);
    // Draw a subtle border on the page to keep content visually contained
    const drawPageBorder = () => {
      page.drawRectangle({
        x: MARGIN.l - 10,
        y: MARGIN.b - 10,
        width: PAGE.w - (MARGIN.l + MARGIN.r) + 20,
        height: PAGE.h - (MARGIN.t + MARGIN.b) + 20,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
    };
    drawPageBorder();
    const wrapLines = (text: string, size: number): string[] => {
      // Respect explicit newlines as paragraph breaks and hard wrap long tokens
      const paragraphs = (text ?? '').split(/\r?\n/);
      const lines: string[] = [];
      for (const para of paragraphs) {
        const words = (para || '').split(/\s+/).filter(Boolean);
        let current = '';
        for (const w of words) {
          const test = current ? `${current} ${w}` : w;
          if (measure(test, size) <= maxWidth) {
            current = test;
          } else {
            if (current) lines.push(current);
            if (measure(w, size) > maxWidth) {
              let acc = '';
              for (const ch of w) {
                const testCh = acc + ch;
                if (measure(testCh, size) > maxWidth) {
                  if (acc) lines.push(acc);
                  acc = ch;
                } else {
                  acc = testCh;
                }
              }
              current = acc;
            } else {
              current = w;
            }
          }
        }
        if (current) lines.push(current);
        if (para !== paragraphs[paragraphs.length - 1]) {
          lines.push('');
        }
      }
      return lines;
    };
    const ensureSpace = (heightNeeded: number) => {
      if (cursorY - heightNeeded < MARGIN.b) {
        page = pdf.addPage([PAGE.w, PAGE.h]);
        cursorY = PAGE.h - MARGIN.t;
        drawPageBorder();
      }
    };
    const drawParagraph = (text: string, size = 12) => {
      const lh = size + lineGap;
      const lines = wrapLines(text, size);
      ensureSpace(lh * lines.length);
      for (const line of lines) {
        page.drawText(line, { x: MARGIN.l, y: cursorY, size, font, color: rgb(0, 0, 0) });
        cursorY -= lh;
      }
    };
    const drawTitle = (text: string, size = 16) => {
      const width = measure(text, size);
      const x = MARGIN.l + Math.max(0, (maxWidth - width) / 2);
      ensureSpace(size + 10);
      page.drawText(text, { x, y: cursorY, size, font, color: rgb(0, 0, 0) });
      cursorY -= size + 10;
    };
    // Improved bullets with indentation and wrapping
    const drawBulletsWrapped = (items: string[], size = 12) => {
      const lh = size + lineGap;
      const bullet = '•';
      const bulletIndent = measure(`${bullet} `, size);
      for (const raw of items) {
        const firstLine = `${bullet} ${raw}`;
        const wrapped = wrapLines(firstLine, size);
        ensureSpace(lh * wrapped.length);
        wrapped.forEach((line, idx) => {
          const x = MARGIN.l + (idx === 0 ? 0 : bulletIndent);
          const text = idx === 0 ? line : line.trimStart();
          page.drawText(text, { x, y: cursorY, size, font, color: rgb(0, 0, 0) });
          cursorY -= lh;
        });
      }
    };
    const drawBullets = (items: string[], size = 12) => {
      const lh = size + lineGap;
      for (const it of items) {
        const bullet = '• ';
        const lines = wrapLines(bullet + it, size);
        ensureSpace(lh * lines.length);
        for (let idx = 0; idx < lines.length; idx++) {
          page.drawText(lines[idx], { x: MARGIN.l, y: cursorY, size, font, color: rgb(0, 0, 0) });
          cursorY -= lh;
        }
      }
    };

    // Header & title
    drawParagraph('République Algérienne Démocratique et Populaire', 11);
    drawParagraph('Ministère de l’Énergie et des Mines', 11);
    cursorY -= 8;
    drawTitle('MISE EN DEMEURE', 16);

    // Meta
    const detenteur =
      demande.detenteurdemande?.[0]?.detenteur?.nom_societeFR || 'Le demandeur';
    const codeDemande = demande.code_demande || String(id_demande);
    const deadlineStr = data.deadlines?.miseEnDemeure
      ? new Date(data.deadlines.miseEnDemeure).toLocaleDateString('fr-DZ')
      : '—';
    drawParagraph(`Destinataire : ${detenteur}`, 12);
    drawParagraph(`Référence dossier : ${codeDemande}`, 12);
    if (deadlineStr) drawParagraph(`Date limite : ${deadlineStr}`, 12);
    cursorY -= 8;

    // Body
    drawParagraph(`Suite au dépôt de votre dossier, nous constatons l'absence des pièces suivantes:`, 12);
    const items: Array<{ nom_doc: string }> = data.missingSummary.requiredMissing;
    drawBulletsWrapped(items.map((i) => i.nom_doc), 12);
    cursorY -= 8;
    // Clarify instruction delay with clean typography
    drawParagraph("Conformément aux procédures en vigueur, vous disposez d'un délai maximum de 30 jours à compter de la date de cette notification pour compléter votre dossier.", 12);
    drawParagraph(`Vous disposez d'un délai maximum de 30 jours à compter de la date de cette notification pour compléter votre dossier.`, 12);
    drawParagraph(`Date limite: ${deadlineStr}`, 12);

    const buffer = Buffer.from(await pdf.save());
    const filename = `mise-en-demeure-${codeDemande}.pdf`;
    return { buffer, filename };
  }
}
