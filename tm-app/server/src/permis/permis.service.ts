import { Injectable } from '@nestjs/common';
import { AccessService } from './access.service';

// Adjust these defaults to match your Access schema
const DEFAULT_TABLES = {
  permis: process.env.ACCESS_TABLE_PERMIS || 'Titres',
  coordinates: process.env.ACCESS_TABLE_COORDINATES || 'coordonees',
  types: process.env.ACCESS_TABLE_TYPES || 'TypesTitres'
};

// Map Access column names to API fields expected by the client
const DEFAULT_COLUMNS = {
  permis: {
    id: process.env.ACCESS_COL_PERMIS_ID || 'id',
    typePermis: process.env.ACCESS_COL_TYPE || 'idType',
    codeDemande: process.env.ACCESS_COL_CODE || 'Code',
    detenteur: process.env.ACCESS_COL_DETENTEUR || 'idDetenteur',
    superficie: process.env.ACCESS_COL_SUPERFICIE || 'Superficie',
    duree: process.env.ACCESS_COL_DUREE || '',
    localisation: process.env.ACCESS_COL_LOCALISATION || 'LieuDit',
    dateCreation: process.env.ACCESS_COL_DATE || 'DateDemande'
  },
  coordinates: {
    permisId: process.env.ACCESS_COL_COORD_PERMIS_ID || 'idTitre',
    x: process.env.ACCESS_COL_COORD_X || 'x',
    y: process.env.ACCESS_COL_COORD_Y || 'y',
    order: process.env.ACCESS_COL_COORD_ORDER || 'h'
  },
  types: {
    id: process.env.ACCESS_COL_TYPES_ID || 'id',
    nom: process.env.ACCESS_COL_TYPES_NOM || 'Nom',
    code: process.env.ACCESS_COL_TYPES_CODE || 'Code',
    validiteMaximale: process.env.ACCESS_COL_TYPES_VALIDITE_MAX || 'ValiditeMaximale',
    renouvellementsPossibles: process.env.ACCESS_COL_TYPES_RENOUV_POSS || 'RenouvellementsPossibles',
    validiteRenouvellement: process.env.ACCESS_COL_TYPES_VALIDITE_RENOUV || 'ValiditeRenouvellement',
    delaiMaximalDemandeRenouvellement: process.env.ACCESS_COL_TYPES_DELAI_RENOUV || 'DelaiMaximalDemandeRenouvellement',
    validiteMaximaleTotale: process.env.ACCESS_COL_TYPES_VALIDITE_TOTALE || 'ValiditeMaximaleTotale',
    surfaceMaximale: process.env.ACCESS_COL_TYPES_SURFACE_MAX || 'SurfaceMaximale'
  }
};

@Injectable()
export class PermisService {
  constructor(private readonly access: AccessService) {}

  async getPermisById(id: string) {
    const t = DEFAULT_TABLES.permis;
    const c = DEFAULT_COLUMNS.permis;
    const isNumericId = /^\d+$/.test(id);
    const sql = `SELECT * FROM ${t} WHERE ${c.id} = ${isNumericId ? id : this.access.escapeValue(id)}`;
    const rows = await this.access.query(sql);
    if (!rows.length) return null;
    const r = rows[0] as Record<string, any>;
    const toStr = (v: any) => (v == null ? '' : String(v));
    const toNum = (v: any) => (v == null || v === '' ? null : Number(v));
    // fetch type details from TypesTitres
    const typeId = r[c.typePermis];
    const typeData = await this.getTypeById(typeId).catch(() => null);

    const val: any = {
      id: r[c.id],
      typePermis: typeData || toStr(r[c.typePermis]),
      codeDemande: toStr(r[c.codeDemande]),
      detenteur: toStr(r[c.detenteur]),
      superficie: toNum(r[c.superficie]),
      duree: c.duree ? toStr(r[c.duree]) : '',
      localisation: toStr(r[c.localisation]),
      dateCreation: r[c.dateCreation] ? new Date(r[c.dateCreation]).toISOString() : null,
      coordinates: await this.getCoordinatesByPermisId(String(r[c.id])).catch(() => [])
    };
    // Add compatibility fields expected by designer
    val.code_demande = val.codeDemande;
    val.id_demande = val.id;
    if (!val.typePermis || typeof val.typePermis === 'string') {
      val.typePermis = { lib_type: String(r[c.typePermis] ?? ''), duree_initiale: null };
    } else {
      val.typePermis.lib_type = String(val.typePermis.nom ?? val.typePermis.Nom ?? '');
      val.typePermis.duree_initiale = Number(val.typePermis.validiteMaximale ?? val.typePermis.ValiditeMaximale ?? 0) || null;
    }
    return val;
  }

  async getCoordinatesByPermisId(id: string) {
    const t = DEFAULT_TABLES.coordinates;
    const c = DEFAULT_COLUMNS.coordinates;
    const isNumericId = /^\d+$/.test(id);
    const sql = `SELECT ${c.x} AS x, ${c.y} AS y, ${c.order} AS pt_order FROM ${t} WHERE ${c.permisId} = ${isNumericId ? id : this.access.escapeValue(id)} ORDER BY ${c.order}`;
    let rows: any[] = [];
    try {
      rows = await this.access.query(sql);
    } catch {
      return [];
    }
    const parseFr = (val: any): number => {
      if (typeof val === 'number') return val;
      const s = String(val || '').replace(/\s+/g, '').replace('\u00A0', '').replace(',', '.');
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };
    return rows.map((r: any) => ({ x: parseFr(r.x), y: parseFr(r.y), order: Number(r.pt_order || 0) }));
  }

  async runRaw(sql: string) {
    const rows = await this.access.query(sql);
    return { rows };
  }

  async findPermisByProcedure(procedureId: string) {
    const t = DEFAULT_TABLES.permis;
    const c = DEFAULT_COLUMNS.permis;
    const isNumericId = /^\d+$/.test(procedureId);
    const sql = `SELECT ${c.id} as id, ${c.codeDemande} as code FROM ${t} WHERE ${c.id} = ${isNumericId ? procedureId : this.access.escapeValue(procedureId)}`;
    const rows = await this.access.query(sql);
    if (!rows.length) return { exists: false };
    const r = rows[0] as any;
    return { exists: true, permisId: Number(r.id), permisCode: String(r.code) };
  }

  private async getTypeById(typeId: any) {
    if (typeId == null || typeId === '') return null;
    const t = DEFAULT_TABLES.types;
    const c = DEFAULT_COLUMNS.types as any;
    const isNumeric = /^\d+$/.test(String(typeId));
    const sql = `SELECT * FROM ${t} WHERE ${c.id} = ${isNumeric ? typeId : this.access.escapeValue(String(typeId))}`;
    const rows = await this.access.query(sql);
    if (!rows.length) return null;
    const r = rows[0] as any;
    return {
      id: r[c.id],
      nom: r[c.nom],
      code: r[c.code],
      validiteMaximale: r[c.validiteMaximale],
      renouvellementsPossibles: r[c.renouvellementsPossibles],
      validiteRenouvellement: r[c.validiteRenouvellement],
      delaiMaximalDemandeRenouvellement: r[c.delaiMaximalDemandeRenouvellement],
      validiteMaximaleTotale: r[c.validiteMaximaleTotale],
      surfaceMaximale: r[c.surfaceMaximale]
    };
  }
}

