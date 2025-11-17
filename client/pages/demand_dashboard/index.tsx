import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './demandes.module.css';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import { useAuthReady } from '@/src/hooks/useAuthReady';
import { BarChart2, Clock, FileText, PlusSquare, Search } from 'lucide-react';
import router from '@/src/next-compat/router';

type Demande = {
  id_demande: number;
  code_demande: string | null;
  date_demande: string | null;
  statut_demande: string;
  intitule_projet: string | null;
  superficie: number | null;
  budget_prevu: number | null;
  montant_produit: string | null;
  wilaya?: { id_wilaya: number; nom_wilayaFR: string } | null;
  daira?: { id_daira: number; nom_dairaFR: string } | null;
  commune?: { id_commune: number; nom_communeFR: string } | null;
  detenteur?: {
    id_detenteur: number;
    nom_societeFR: string | null;
    nif: string | null;
    pays?: { id_pays: number; nom_pays: string } | null;
    nationaliteRef?: { id_nationalite: number; libelle: string } | null;
  } | null;
  expertMinier?: { id_expert: number; nom_expert: string | null; num_agrement: string | null } | null;
  typePermis?: { id: number; code: string | null; libelle: string | null } | null;
  typeProcedure?: { id: number; code: string | null; libelle: string | null } | null;
};

type ApiList = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
  items: Demande[];
};

type Stats = {
  total: number;
  last7: number;
  byStatut: { statut_demande: string | null; _count: { _all: number } }[];
  avgInstructionDays: number | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export default function DemandesPage() {
  const [data, setData] = useState<ApiList | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [statut, setStatut] = useState<string>('');
  const [wilayaId, setWilayaId] = useState<string>('');
  const [typePermisId, setTypePermisId] = useState<string>('');
  const [demandeId, setDemandeId] = useState<string>(''); // Changed from typeProcId to demandeId
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date_demande');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { currentView, navigateTo } = useViewNavigator('procedures');
  const isAuthReady = useAuthReady();

  // simple debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams = useMemo(() => {
    const p: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
      sortBy,
      sortOrder,
    };
    if (debounced) p.search = debounced;
    if (statut) p.statut = statut;
    if (wilayaId) p.wilayaId = wilayaId;
    if (typePermisId) p.typePermisId = typePermisId;
    if (demandeId) p.demandeId = demandeId; // Changed from typeProcId to demandeId
    if (fromDate) p.fromDate = fromDate;
    if (toDate) p.toDate = toDate;
    return p;
  }, [page, pageSize, sortBy, sortOrder, debounced, statut, wilayaId, typePermisId, demandeId, fromDate, toDate]);

  const fetchData = useCallback(async () => {
    if (!isAuthReady) {
      return;
    }

    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        axios.get<ApiList>(`${API_BASE}/demandes_dashboard`, { params: queryParams, withCredentials: true }),
        axios.get<Stats>(`${API_BASE}/demandes_dashboard/stats`, { params: queryParams, withCredentials: true }),
      ]);
      console.log("Data fetched:", listRes.data);
      setData(listRes.data);
      setStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  }, [isAuthReady, queryParams]);

  useEffect(() => { fetchData(); }, [fetchData]);
  // Also refetch on navigation changes to ensure fresh data on repeated clicks
  useEffect(() => { fetchData(); }, [router?.asPath]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const onExport = async () => {
    const url = new URL(`${API_BASE}/demandes_dashboard/export`);
    Object.entries(queryParams).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    window.location.href = url.toString();
  };

  return (
    <>
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
        
      <Head><title>Demandes — Dashboard</title></Head>

      <div className={styles.page}>
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <h1>Demandes</h1>
      <p className={styles.subtitle}>Gestion des demandes minières</p>
    </div>
    <div className={styles.headerActions}>
      <button className={styles.primaryBtn} onClick={onExport}>
        <FileText className={styles.btnIcon} size={18} />
        Exporter CSV
      </button>
    </div>
  </header>

  <section className={styles.kpis}>
    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon}><FileText size={28} /></div>
      <div className={styles.kpiContent}>
        <div className={styles.kpiTitle}>Total Demandes</div>
        <div className={styles.kpiValue}>{stats?.total ?? '—'}</div>
        <div className={styles.kpiHint}>Toutes les demandes</div>
      </div>
    </div>

    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon}><PlusSquare size={28} /></div>
      <div className={styles.kpiContent}>
        <div className={styles.kpiTitle}>7 derniers jours</div>
        <div className={styles.kpiValue}>{stats?.last7 ?? '—'}</div>
        <div className={styles.kpiHint}>Nouvelles demandes</div>
      </div>
    </div>

    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon}><Clock size={28} /></div>
      <div className={styles.kpiContent}>
        <div className={styles.kpiTitle}>Délai d'instruction</div>
        <div className={styles.kpiValue}>
          {stats?.avgInstructionDays != null ? `${stats.avgInstructionDays} j` : '—'}
        </div>
        <div className={styles.kpiHint}>Moyenne sur demandes terminées</div>
      </div>
    </div>

    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon}><BarChart2 size={28} /></div>
      <div className={styles.kpiContent}>
        <div className={styles.kpiTitle}>Répartition</div>
        <div className={styles.kpiPills}>
          {(stats?.byStatut ?? []).map(s => (
            <span key={s.statut_demande ?? 'NA'} className={styles.pill}>
              {(s.statut_demande ?? '—')} <b>{s._count._all}</b>
            </span>
          ))}
        </div>
        <div className={styles.kpiHint}>Par statut</div>
      </div>
    </div>
  </section>

  <section className={styles.toolbar}>
    <div className={styles.searchWrap}>
      <Search className={styles.searchIcon} size={18} />
      <input
        className={styles.searchInput}
        placeholder="Rechercher (code, projet, détenteur, expert, lieu...)"
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
      />
    </div>
          
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Statut</label>
              <select value={statut} onChange={e => { setPage(1); setStatut(e.target.value); }}>
                <option value="">Tous statuts</option>
                <option value="ACCEPTEE">Acceptée</option>
                <option value="rejetÃ©e">Rejetée</option>
                <option value="EN_COURS">En cours</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Wilaya ID</label>
              <input type="number" min={1} placeholder="ID Wilaya"
                value={wilayaId} onChange={e => { setPage(1); setWilayaId(e.target.value); }} />
            </div>
            
            <div className={styles.filterGroup}>
              <label>Type Permis</label>
              <input type="number" min={1} placeholder="ID Type Permis"
                value={typePermisId} onChange={e => { setPage(1); setTypePermisId(e.target.value); }} />
            </div>
            
            <div className={styles.filterGroup}>
              <label>ID Demande</label> {/* Changed from Type ProcÃ©dure to ID Demande */}
              <input type="number" min={1} placeholder="ID Demande"
                value={demandeId} onChange={e => { setPage(1); setDemandeId(e.target.value); }} />
            </div>
            
            <div className={styles.filterGroup}>
              <label>Date début</label>
              <input type="date" value={fromDate} onChange={e => { setPage(1); setFromDate(e.target.value); }} />
            </div>
            
            <div className={styles.filterGroup}>
              <label>Date fin</label>
              <input type="date" value={toDate} onChange={e => { setPage(1); setToDate(e.target.value); }} />
            </div>
          </div>
          
          <div className={styles.pageSize}>
            <label>Éléments par page</label>
            <select value={pageSize} onChange={e => { setPage(1); setPageSize(+e.target.value); }}>
              {[10,20,30,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2>Liste des demandes</h2>
            <div className={styles.tableInfo}>
              {data && <span>{data.total} résultats</span>}
            </div>
          </div>
          
          <div className={styles.tableWrap}>
            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id_demande')}>
                      ID {sortBy === 'id_demande' && (sortOrder === 'asc' ? 'â†‘' : 'â†“')}
                    </th>
                    <th onClick={() => handleSort('code_demande')}>
                      Code {sortBy === 'code_demande' && (sortOrder === 'asc' ? 'â†‘' : 'â†“')}
                    </th>
                    <th onClick={() => handleSort('date_demande')}>
                      Date {sortBy === 'date_demande' && (sortOrder === 'asc' ? 'â†‘' : 'â†“')}
                    </th>
                    <th onClick={() => handleSort('statut_demande')}>
                      Statut {sortBy === 'statut_demande' && (sortOrder === 'asc' ? 'â†‘' : 'â†“')}
                    </th>
                    <th>Projet</th>
                    <th>Localisation</th>
                    <th>Type</th>
                    <th>Détenteur</th>
                    <th>Expert</th>
                    <th onClick={() => handleSort('date_instruction')}>
                      Instr. {sortBy === 'date_instruction' && (sortOrder === 'asc' ? 'â†‘' : 'â†“')}
                    </th>
                    <th onClick={() => handleSort('date_fin_instruction')}>
                      Fin instr. {sortBy === 'date_fin_instruction' && (sortOrder === 'asc' ? 'â†‘' : 'â†“')}
                    </th>
                    <th>Budget</th>
                    <th>Superficie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={14} className={styles.loadingRow}>
                        <div className={styles.spinner}></div>
                        Chargement des données...
                      </td>
                    </tr>
                  )}
                  {!loading && (data?.items ?? []).length === 0 && (
                    <tr>
                      <td colSpan={14} className={styles.emptyRow}>
                        <div className={styles.emptyState}>
                          <div className={styles.emptyIcon}>ðŸ“­</div>
                          <h3>Aucune donnée trouvée</h3>
                          <p>Essayez de modifier vos filtres ou votre recherche</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {(data?.items ?? []).map(d => (
                    <tr key={d.id_demande}>
                      <td className={styles.idCell}>{d.id_demande}</td>
                      <td className={styles.mono}>{d.code_demande ?? '—'}</td>
                      <td>{d.date_demande ? new Date(d.date_demande).toLocaleDateString() : '—'}</td>
                      <td>
                        <span className={`${styles.badge} ${styles['status_' + (d.statut_demande || 'NA').toLowerCase()]}`}>
                          {d.statut_demande || '—'}
                        </span>
                      </td>
                      <td className={styles.clip} title={d.intitule_projet || ''}>{d.intitule_projet ?? '—'}</td>
                      <td className={styles.wrapCell}>
                        <div className={styles.stack}>
                          <span>{d.wilaya?.nom_wilayaFR ?? '—'}</span>
                          <span className={styles.dim}>{d.daira?.nom_dairaFR ?? '—'} / {d.commune?.nom_communeFR ?? '—'}</span>
                        </div>
                      </td>
                      <td className={styles.wrapCell}>
                        <div className={styles.stack}>
                          <span>{d.typePermis?.libelle ?? '—'}</span>
                          <span className={styles.dim}>{d.typeProcedure?.libelle ?? 'â€”'}</span>
                        </div>
                      </td>
                      <td className={styles.clip} title={d.detenteur?.nom_societeFR || ''}>{d.detenteur?.nom_societeFR ?? '—'}</td>
                      <td className={styles.clip} title={d.expertMinier?.nom_expert || ''}>{d.expertMinier?.nom_expert ?? '—'}</td>
                      <td>—</td>
                      <td>—</td>
                      <td className={styles.numberCell}>{d.budget_prevu ? `${d.budget_prevu.toLocaleString()} DA` : '—'}</td>
                      <td className={styles.numberCell}>{d.superficie ? `${d.superficie.toLocaleString()} ha` : '—'}</td>
                      <td>
                        <a className={styles.linkBtn} href={`/demand_dashboard/${d.id_demande}`}>
                          Voir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={(data?.page ?? 1) <= 1}
                className={styles.paginationBtn}
              >
                ← Précédent
              </button>
              <span className={styles.paginationInfo}>
                Page {data?.page ?? 1} sur {data?.pages ?? 1}
              </span>
              <button 
                onClick={() => setPage(p => (data?.pages ? Math.min(data.pages, p + 1) : p + 1))}
                disabled={(data?.page ?? 1) >= (data?.pages ?? 1)}
                className={styles.paginationBtn}
              >
                Suivant â†’
              </button>
            </div>
          </div>
        </section>
      </div>
      </main>
      </div>
      </div>
    </>
  );
}


