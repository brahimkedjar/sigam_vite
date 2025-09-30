import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './DossiersDashboard.module.css';
import Link from 'next/link';

type DemandeLite = {
  id_demande: number;
  code_demande: string | null;
  statut_demande: string | null;
  date_demande: string | null;
  date_refus?: string | null;
  remarques?: string | null;
  detenteur?: { nom_societeFR?: string | null } | null;
  typePermis?: { lib_type?: string | null } | null;
  typeProcedure?: { libelle?: string | null } | null;
  procedure?: { id_proc: number; statut_proc: string | null } | null;
  wilaya?: { nom_wilayaFR?: string | null } | null;
  daira?: { nom_dairaFR?: string | null } | null;
  commune?: { nom_communeFR?: string | null } | null;
};

type DemandesResponse = {
  page: number;
  pageSize: number;
  total: number;
  pages: number;
  items: DemandeLite[];
};

type MissingSummary = {
  requiredMissing: Array<{ id_doc: number; nom_doc: string }>;
  blocking: Array<{ id_doc: number; nom_doc: string }>;
  blockingNext: Array<{ id_doc: number; nom_doc: string }>;
  warnings: Array<{ id_doc: number; nom_doc: string }>;
};

type DocumentsByDemande = {
  dossierFournis: any;
  missingSummary: MissingSummary;
  deadlines: { miseEnDemeure: string | null; instruction: string | null };
};

type Row = {
  demande: DemandeLite;
  docs?: DocumentsByDemande | null;
};

const fmtDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(+d)) return '';
  return d.toLocaleDateString('fr-DZ');
};

const msLeft = (iso?: string | null) => {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  const diff = t - Date.now();
  return diff < 0 ? 0 : diff;
};

function useTick(ms: number) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

function countdownText(ms: number | null) {
  if (ms == null) return '';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${d}j ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export default function DossiersDashboard() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const ctrlRef = useRef<AbortController | null>(null);

  useTick(1000); // smooth, live countdown

  useEffect(() => {
    const fetchPage = async () => {
      if (!apiURL) return;
      ctrlRef.current?.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      setLoading(true);
      try {
        const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (search.trim()) q.set('search', search.trim());
        const res = await fetch(`${apiURL}/demandes_dashboard?${q.toString()}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error('Failed to load demandes');
        const data: DemandesResponse = await res.json();

        // Fetch documents status per demande (parallel, but capped)
        const limited = data.items.slice(0, pageSize);
        const detail = await Promise.all(
          limited.map(async (d) => {
            try {
              const dr = await fetch(`${apiURL}/api/procedure/${d.id_demande}/documents`, { signal: ctrl.signal });
              if (!dr.ok) throw new Error('docs');
              const docs: DocumentsByDemande = await dr.json();
              return { demande: d, docs } as Row;
            } catch {
              return { demande: d, docs: null } as Row;
            }
          })
        );

        setRows(detail);
        setTotal(data.total);
        setPages(data.pages);
      } catch (e) {
        if ((e as any).name !== 'AbortError') {
          setRows([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
    return () => ctrlRef.current?.abort();
  }, [apiURL, page, pageSize, search]);

  const summary = useMemo(() => {
    let totalReq = 0,
      withMissing = 0,
      withBlockingNext = 0,
      withMiseDeadline = 0;
    rows.forEach((r) => {
      totalReq += 1;
      const doc = r.docs;
      if (!doc) return;
      if (doc.missingSummary.requiredMissing.length > 0) withMissing += 1;
      if (doc.missingSummary.blockingNext.length > 0) withBlockingNext += 1;
      if (doc.deadlines.miseEnDemeure) withMiseDeadline += 1;
    });
    return { totalReq, withMissing, withBlockingNext, withMiseDeadline };
  }, [rows]);

  const rejected = useMemo(() => {
    const list = rows.filter((r) => (r.demande.statut_demande || '').toUpperCase() === 'REJETEE');
    list.sort((a, b) => {
      const ta = a.demande.date_refus ? Date.parse(a.demande.date_refus) : 0;
      const tb = b.demande.date_refus ? Date.parse(b.demande.date_refus) : 0;
      return tb - ta;
    });
    return list.slice(0, 8);
  }, [rows]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tableau de bord des dossiers</h1>
        <div className={styles.controls}>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Rechercher par code, détenteur, projet…"
            className={styles.search}
          />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Statistiques</h3>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{total}</div>
              <div className={styles.statLabel}>Demandes (total)</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{summary.totalReq}</div>
              <div className={styles.statLabel}>Demandes (page)</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{summary.withMissing}</div>
              <div className={styles.statLabel}>Docs manquants</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{summary.withBlockingNext}</div>
              <div className={styles.statLabel}>Blocage phase suivante</div>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Journal des rejets</h3>
          {rejected.length === 0 ? (
            <div className={styles.empty}>Aucun rejet récent</div>
          ) : (
            <div className={styles.journalList}>
              {rejected.map((r) => (
                <div key={r.demande.id_demande} className={styles.journalItem}>
                  <div>
                    <div className={styles.journalTitle}>{r.demande.code_demande ?? `DEM-${r.demande.id_demande}`}</div>
                    <div className={styles.journalMeta}>{r.demande.remarques ?? 'Rejet'}</div>
                  </div>
                  <div className={styles.nowrap}>{fmtDate(r.demande.date_refus || null)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Dossiers et délais</h3>
          {rows.length === 0 && !loading ? (
            <div className={styles.empty}>Aucune donnée à afficher</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Détenteur</th>
                    <th>Type permis</th>
                    <th>Type procédure</th>
                    <th>Statut demande</th>
                    <th>Statut procédure</th>
                    <th>Docs manquants</th>
                    <th>Blocage</th>
                    <th>Échéance</th>
                    <th>Restant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const missingCount = r.docs?.missingSummary.requiredMissing.length ?? 0;
                    const missingPreview = (r.docs?.missingSummary.requiredMissing || [])
                      .slice(0, 3)
                      .map((d) => d.nom_doc)
                      .join(', ');
                    const blockingNext = (r.docs?.missingSummary.blockingNext.length ?? 0) > 0;
                    const deadline = r.docs?.deadlines.miseEnDemeure ?? null;
                    const left = msLeft(deadline);
                    const hasDeadline = left !== null;
                    const badgeClass = missingCount ? (blockingNext ? styles.error : styles.warn) : styles.ok;
                    return (
                      <tr key={r.demande.id_demande}>
                        <td className={`${styles.code} ${styles.nowrap}`}>{r.demande.code_demande ?? `DEM-${r.demande.id_demande}`}</td>
                        <td>
                          <div>{r.demande.detenteur?.nom_societeFR ?? '—'}</div>
                          <div className={styles.subtle}>
                            {r.demande.commune?.nom_communeFR ?? '—'}{r.demande.daira?.nom_dairaFR ? `, ${r.demande.daira?.nom_dairaFR}` : ''}
                            {r.demande.wilaya?.nom_wilayaFR ? `, ${r.demande.wilaya?.nom_wilayaFR}` : ''}
                          </div>
                        </td>
                        <td className={styles.nowrap}>{r.demande.typePermis?.lib_type ?? '—'}</td>
                        <td className={styles.nowrap}>{r.demande.typeProcedure?.libelle ?? '—'}</td>
                        <td><span className={styles.pill}>{r.demande.statut_demande ?? '—'}</span></td>
                        <td><span className={styles.pill}>{r.demande.procedure?.statut_proc ?? '—'}</span></td>
                        <td title={missingPreview || undefined}>
                          <span className={`${styles.badge} ${badgeClass}`}>{missingCount}</span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${blockingNext ? styles.error : styles.ok}`}>
                            {blockingNext ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className={styles.nowrap}>{deadline ? fmtDate(deadline) : '—'}</td>
                        <td className={styles.nowrap}>{hasDeadline ? countdownText(left) : '—'}</td>
                        <td>
                          <div className={styles.actions}>
                            <Link
                              className={`${styles.linkBtn} ${styles.linkBtnPrimary}`}
                              href={`/demande/step1/page1?id=${r.demande.procedure?.id_proc ?? r.demande.id_demande}`}
                            >
                              Ouvrir
                            </Link>
                            {hasDeadline && (
                              <a
                                className={styles.linkBtn}
                                href={`${apiURL}/api/demande/${r.demande.id_demande}/mise-en-demeure.pdf`}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                PDF
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} className={styles.linkBtn}>
              Précédent
            </button>
            <span className={styles.detenteur}>
              Page {page} / {pages}
            </span>
            <button disabled={page >= pages || loading} onClick={() => setPage((p) => Math.min(pages, p + 1))} className={styles.linkBtn}>
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
