'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './demandes.module.css';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';

type MesDemandeItem = {
  id_demande: number;
  code_demande: string | null;
  date_demande: string | null;
  duree_instruction: number | null;
  statut_demande: string | null;
  dossier_recevable: boolean | null;
  date_instruction: string | null;
  date_refus: string | null;
  typePermis?: { code_type: string; lib_type: string | null };
};

type DeadlineInfo =
  | {
      mode: 'ongoing' | 'recevable' | 'rejetee';
      used: number;
      remaining: number;
      total: number;
      deadline: Date;
    }
  | null;

const apiURL = process.env.NEXT_PUBLIC_API_URL;

function computeDeadlineInfo(item: MesDemandeItem): DeadlineInfo {
  if (!item.duree_instruction || !item.date_demande) {
    return null;
  }

  const total = item.duree_instruction;
  const start = new Date(item.date_demande);
  start.setHours(0, 0, 0, 0);

  const addBusinessDays = (base: Date, businessDays: number) => {
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
  };

  const countBusinessDaysBetween = (from: Date, to: Date) => {
    const d1 = new Date(from);
    const d2 = new Date(to);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (d2 < d1) return 0;

    let days = 0;
    const cursor = new Date(d1);
    while (cursor <= d2) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        days += 1;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  };

  const deadline = addBusinessDays(start, total);

  if (item.dossier_recevable && item.date_instruction) {
    const closure = new Date(item.date_instruction);
    const used = countBusinessDaysBetween(start, closure);
    const remaining = Math.max(total - used, 0);
    return {
      mode: 'recevable',
      used,
      remaining,
      total,
      deadline,
    };
  }

  if (item.statut_demande === 'REJETEE' && item.date_refus) {
    const closure = new Date(item.date_refus);
    const used = countBusinessDaysBetween(start, closure);
    const remaining = Math.max(total - used, 0);
    return {
      mode: 'rejetee',
      used,
      remaining,
      total,
      deadline,
    };
  }

  const now = new Date();
  const nowFloor = new Date(now);
  nowFloor.setHours(0, 0, 0, 0);

  if (nowFloor >= deadline) {
    return {
      mode: 'ongoing',
      used: total,
      remaining: 0,
      total,
      deadline,
    };
  }

  const remaining = countBusinessDaysBetween(nowFloor, deadline);
  const used = Math.max(total - remaining, 0);

  return {
    mode: 'ongoing',
    used,
    remaining,
    total,
    deadline,
  };
}

export default function MesDemandes() {
  const { auth, isLoaded } = useAuthStore();
  const { currentView, navigateTo } = useViewNavigator('procedures');
  const [items, setItems] = useState<MesDemandeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!auth.username || !apiURL) {
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get<MesDemandeItem[]>(`${apiURL}/demandes_dashboard/mine`, {
        params: { responsable: auth.username },
        withCredentials: true,
        signal: controller.signal,
      })
      .then((response) => {
        setItems(response.data ?? []);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error('Erreur chargement de mes demandes', err);
        setError('Impossible de charger vos demandes.');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [auth.username, isLoaded]);

  const enriched = useMemo(
    () =>
      items
        .filter((item) => !item.dossier_recevable)
        .map((item) => ({
          item,
          info: computeDeadlineInfo(item),
        })),
    [items],
  );

  const expiringSoon = useMemo(
    () =>
      enriched.filter(
        ({ info }) => info && info.mode === 'ongoing' && info.remaining < 3,
      ),
    [enriched],
  );

  const totalInProgress = enriched.length;
  const totalExpiringSoon = expiringSoon.length;
  const totalRequests = items.length;

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          <div className={styles.page}>
            <header className={styles.header}>
              <div className={styles.headerLeft}>
                <h1>Mes demandes</h1>
                <p className={styles.subtitle}>
                  Suivi des demandes dont vous etes responsable
                </p>
              </div>
            </header>

            {!isLoaded && (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Chargement de la session...</p>
              </div>
            )}

            {isLoaded && !auth.username && (
              <div className={styles.emptyState}>
                <h3>Aucun utilisateur connecte</h3>
                <p>Veuillez vous authentifier pour consulter vos demandes.</p>
              </div>
            )}

            {error && (
              <div className={styles.emptyState}>
                <h3>Erreur de chargement</h3>
                <p>{error}</p>
              </div>
            )}

            {isLoaded && auth.username && !error && (
              <>
                <section className={styles.kpis}>
                  <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon}>
                      <span className={styles.mono}>EN</span>
                    </div>
                    <div className={styles.kpiContent}>
                      <div className={styles.kpiTitle}>En instruction</div>
                      <div className={styles.kpiValue}>{totalInProgress}</div>
                      <div className={styles.kpiHint}>
                        Dossiers encore en cours de traitement
                      </div>
                    </div>
                  </div>

                  <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon}>
                      <span className={styles.mono}>J-3</span>
                    </div>
                    <div className={styles.kpiContent}>
                      <div className={styles.kpiTitle}>Bientot a echeance</div>
                      <div className={styles.kpiValue}>{totalExpiringSoon}</div>
                      <div className={styles.kpiHint}>
                        Demandes avec moins de 3 jours ouvrables restants
                      </div>
                    </div>
                  </div>

                  <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon}>
                      <span className={styles.mono}>Sigma</span>
                    </div>
                    <div className={styles.kpiContent}>
                      <div className={styles.kpiTitle}>Total demandes</div>
                      <div className={styles.kpiValue}>{totalRequests}</div>
                      <div className={styles.kpiHint}>
                        Toutes les demandes dont vous etes responsable
                      </div>
                    </div>
                  </div>
                </section>

                <section className={styles.tableSection}>
                  <div className={styles.tableHeader}>
                    <h2>Demandes proches de l&apos;echeance</h2>
                    <div className={styles.tableInfo}>
                      {totalExpiringSoon > 0 ? (
                        <span>
                          {totalExpiringSoon} demande(s) a traiter rapidement
                        </span>
                      ) : (
                        <span>Aucune demande proche de l&apos;echeance</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.tableWrap}>
                    <div className={styles.tableScroller}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Code demande</th>
                            <th>Type permis</th>
                            <th>Date demande</th>
                            <th>Jours restants</th>
                            <th>Echeance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading && (
                            <tr>
                              <td colSpan={5} className={styles.loadingRow}>
                                <div className={styles.spinner} />
                                Chargement de vos demandes...
                              </td>
                            </tr>
                          )}

                          {!loading && totalExpiringSoon === 0 && (
                            <tr>
                              <td colSpan={5} className={styles.emptyRow}>
                                <div className={styles.emptyState}>
                                  <h3>Aucune demande proche de l&apos;echeance</h3>
                                  <p>
                                    Toutes vos demandes sont actuellement dans les
                                    delais.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}

                          {!loading &&
                            expiringSoon.map(({ item, info }) => (
                              <tr key={item.id_demande}>
                                <td>{item.code_demande ?? item.id_demande}</td>
                                <td>
                                  {item.typePermis
                                    ? `${item.typePermis.code_type} - ${
                                        item.typePermis.lib_type ?? ''
                                      }`
                                    : '-'}
                                </td>
                                <td>
                                  {item.date_demande
                                    ? new Date(
                                        item.date_demande,
                                      ).toLocaleDateString('fr-FR')
                                    : '-'}
                                </td>
                                <td>
                                  <strong>{info?.remaining}</strong> jour(s){' '}
                                  ouvrable(s)
                                </td>
                                <td>
                                  {info?.deadline.toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section className={styles.tableSection}>
                  <div className={styles.tableHeader}>
                    <h2>Mes demandes en instruction</h2>
                    <div className={styles.tableInfo}>
                      {totalInProgress > 0 && (
                        <span>{totalInProgress} demande(s) en cours</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.tableWrap}>
                    <div className={styles.tableScroller}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Code demande</th>
                            <th>Type permis</th>
                            <th>Date demande</th>
                            <th>Statut</th>
                            <th>Delai d&apos;instruction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading && (
                            <tr>
                              <td colSpan={5} className={styles.loadingRow}>
                                <div className={styles.spinner} />
                                Chargement de vos demandes...
                              </td>
                            </tr>
                          )}

                          {!loading && enriched.length === 0 && (
                            <tr>
                              <td colSpan={5} className={styles.emptyRow}>
                                <div className={styles.emptyState}>
                                  <h3>Aucune demande en instruction</h3>
                                  <p>
                                    Vous n&apos;avez actuellement aucune demande en
                                    cours d&apos;instruction.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}

                          {!loading &&
                            enriched.map(({ item, info }) => (
                              <tr key={item.id_demande}>
                                <td>{item.code_demande ?? '-'}</td>
                                <td>
                                  {item.typePermis
                                    ? `${item.typePermis.code_type} - ${
                                        item.typePermis.lib_type ?? ''
                                      }`
                                    : '-'}
                                </td>
                                <td>
                                  {item.date_demande
                                    ? new Date(
                                        item.date_demande,
                                      ).toLocaleDateString('fr-FR')
                                    : '-'}
                                </td>
                                <td>
                                  <span
                                    className={`${styles.badge} ${
                                      styles[
                                        `status_${(
                                          item.statut_demande || 'NA'
                                        ).toLowerCase()}`
                                      ] || styles.status_na
                                    }`}
                                  >
                                    {item.statut_demande ?? '-'}
                                  </span>
                                </td>
                                <td>
                                  {info ? (
                                    info.mode === 'ongoing' ? (
                                      <>
                                        Il reste{' '}
                                        <strong>{info.remaining}</strong> jour(s){' '}
                                        ouvrable(s) sur{' '}
                                        <strong>{info.total}</strong> (jusqu&apos;au{' '}
                                        {info.deadline.toLocaleDateString('fr-FR')}
                                        ).
                                      </>
                                    ) : info.mode === 'recevable' ? (
                                      <>
                                        Dossier marque recevable apres{' '}
                                        <strong>{info.used}</strong> jour(s){' '}
                                        ouvrable(s) sur{' '}
                                        <strong>{info.total}</strong>.
                                      </>
                                    ) : (
                                      <>
                                        Demande rejetee apres{' '}
                                        <strong>{info.used}</strong> jour(s){' '}
                                        ouvrable(s) sur{' '}
                                        <strong>{info.total}</strong>.
                                      </>
                                    )
                                  ) : (
                                    <>Non defini</>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

