'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

import styles from './demande.module.css';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import { cleanLocalStorageForNewDemande } from '../../../utils/cleanLocalStorage';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import { useAuthReady } from '../../../src/hooks/useAuthReady';
import { useLoading } from '@/components/globalspinner/LoadingContext';

import 'react-datepicker/dist/react-datepicker.css';

interface TypePermis {
  id: number;
  lib_type: string;
  code_type: string;
  regime: string;
  duree_initiale: number;
  nbr_renouv_max: number;
  duree_renouv: number;
  delai_renouv: number;
  superficie_max?: number | null;
}

interface PriorTitre {
  id: number;
  code_permis: string;
  type_code: string | null;
  type_lib: string | null;
  detenteur: { id_detenteur: number; nom: string | null } | null;
  communeId: number | null;
  codeNumber: string | null;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function DemandeStart() {
  const router = useRouter();
  const isAuthReady = useAuthReady();
  const { currentView, navigateTo } = useViewNavigator('nouvelle-demande');
  const { resetLoading } = useLoading();

  const [permisOptions, setPermisOptions] = useState<TypePermis[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [selectedPermisId, setSelectedPermisId] = useState<number | ''>('');
  const [selectedPermis, setSelectedPermis] = useState<TypePermis | null>(null);

  const [codeDemande, setCodeDemande] = useState('');
  const [heureDemarrage, setHeureDemarrage] = useState('');
  const [dateSoumission, setDateSoumission] = useState<Date | null>(new Date());
  const [submitting, setSubmitting] = useState(false);

  // Prior titres modal (for exploitation types)
  const [showPriorModal, setShowPriorModal] = useState(false);
  const [priorLoading, setPriorLoading] = useState(false);
  const [priorError, setPriorError] = useState<string | null>(null);
  const [priorTitres, setPriorTitres] = useState<PriorTitre[]>([]);
  const [selectedPrior, setSelectedPrior] = useState<PriorTitre | null>(null); // exploration (TEM/TEC)
  const [apmTitres, setApmTitres] = useState<PriorTitre[]>([]);
  const [selectedApm, setSelectedApm] = useState<PriorTitre | null>(null);
  const [priorSearch, setPriorSearch] = useState('');
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const [listScrollTop, setListScrollTop] = useState(0);
  const [listHeight, setListHeight] = useState(420);
  const effectivePermis = useMemo(() => {
    if (selectedPermis) {
      return selectedPermis;
    }

    if (selectedPermisId === '') {
      return null;
    }

    return permisOptions.find((option) => option.id === selectedPermisId) ?? null;
  }, [permisOptions, selectedPermis, selectedPermisId]);

  const displayPriorTitres = useMemo(() => {
    const code = (effectivePermis?.code_type || '').toUpperCase();
    if (code.startsWith('TX')) {
      // Show only exploration titles TEM/TEC when exploitation is selected
      return priorTitres.filter((t) => {
        const ty = (t.type_code || '').toUpperCase();
        return ty === 'TEM' || ty === 'TEC';
      });
    }
    return priorTitres;
  }, [priorTitres, effectivePermis]);

  const filteredPriorTitres = useMemo(() => {
    const q = priorSearch.trim().toLowerCase();
    if (!q) return displayPriorTitres;
    return displayPriorTitres.filter((t) => {
      const det = (t.detenteur?.nom || '').toLowerCase();
      const code = (t.code_permis || '').toLowerCase();
      const type = (t.type_code || '').toLowerCase();
      const number = (t.codeNumber || '').toLowerCase();
      return det.includes(q) || code.includes(q) || type.includes(q) || number.includes(q);
    });
  }, [displayPriorTitres, priorSearch]);

  const PAGE_SIZE = 50;
  const [pageCount, setPageCount] = useState(1);
  const visiblePriorTitres = useMemo(() => {
    return filteredPriorTitres.slice(0, PAGE_SIZE * pageCount);
  }, [filteredPriorTitres, pageCount]);

  useEffect(() => {
    // Reset pagination when opening modal or changing search
    setPageCount(1);
  }, [priorSearch, showPriorModal]);

  // APM listing (optional)
  const [apmPageCount, setApmPageCount] = useState(1);
  const apmFiltered = useMemo(() => {
    const q = priorSearch.trim().toLowerCase();
    if (!q) return apmTitres;
    return apmTitres.filter((t) => {
      const det = (t.detenteur?.nom || '').toLowerCase();
      const code = (t.code_permis || '').toLowerCase();
      const type = (t.type_code || '').toLowerCase();
      const number = (t.codeNumber || '').toLowerCase();
      return det.includes(q) || code.includes(q) || type.includes(q) || number.includes(q);
    });
  }, [apmTitres, priorSearch]);
  const apmVisible = useMemo(() => {
    return apmFiltered.slice(0, PAGE_SIZE * apmPageCount);
  }, [apmFiltered, apmPageCount]);
  useEffect(() => {
    setApmPageCount(1);
  }, [priorSearch, showPriorModal]);



  const ITEM_HEIGHT = 64; // px
  const totalItems = filteredPriorTitres.length;
  const totalHeight = totalItems * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(listScrollTop / ITEM_HEIGHT) - 8);
  const visibleCount = Math.ceil(listHeight / ITEM_HEIGHT) + 16;
  const endIndex = Math.min(totalItems, startIndex + visibleCount);
  const visibleItems = filteredPriorTitres.slice(startIndex, endIndex);

  // Ensure global route spinner is cleared when landing on this page
  useEffect(() => {
    try { resetLoading(); } catch {}
  }, [resetLoading]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!apiBase) {
      console.error('Missing NEXT_PUBLIC_API_URL environment variable.');
      setPageError('Configuration API manquante.');
      return;
    }

    const controller = new AbortController();
    setOptionsLoading(true);
    setPageError(null);

    axios
      .get<TypePermis[]>(`${apiBase}/type-permis`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((response) => {
        setPermisOptions(response.data ?? []);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        console.error('Failed to load permit types', error);
        setPageError('Impossible de charger la liste des types de permis.');
      })
      .finally(() => {
        setOptionsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [isAuthReady]);


  const handlePermisChange = async (value: string) => {
    setCodeDemande('');
    setHeureDemarrage('');

    if (!value) {
      setSelectedPermisId('');
      setSelectedPermis(null);
      return;
    }

    const permisId = Number(value);
    if (Number.isNaN(permisId)) {
      setSelectedPermisId('');
      setSelectedPermis(null);
      toast.error('Identifiant de permis invalide.');
      return;
    }

    setSelectedPermisId(permisId);
    setSelectedPermis(null);

    if (!isAuthReady) {
      return;
    }

    if (!apiBase) {
      toast.error('Configuration API manquante.');
      return;
    }

    setDetailsLoading(true);

    try {
      const response = await axios.get<TypePermis>(`${apiBase}/type-permis/${permisId}`, {
        withCredentials: true,
      });
      setSelectedPermis(response.data ?? null);
      // If exploitation (TXM/TXC), prompt to pick prior titre
      const code = (response.data?.code_type || '').toUpperCase();
      if (code.startsWith('TX')) {
        await openPriorTitresModal();
      }
    } catch (error) {
      console.error('Failed to load permit details', error);
      setSelectedPermis(null);
      toast.error('Impossible de charger les details du type de permis.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const openPriorTitresModal = async () => {
    if (!apiBase) {
      toast.error('Configuration API manquante.');
      return;
    }
    setPriorError(null);
    setPriorTitres([]);
    setSelectedPrior(null);
    setApmTitres([]);
    setSelectedApm(null);
    setShowPriorModal(true);
    setPriorLoading(true);
    try {
      const { data } = await axios.get<PriorTitre[]>(`${apiBase}/api/permis/prior-titres`, {
        withCredentials: true,
      });
      const list = data || [];
      setPriorTitres(list);
      const apms = list.filter((t) => (t.type_code || '').toUpperCase() === 'APM');
      setApmTitres(apms);
    } catch (err) {
      console.error('Erreur chargement titres antérieurs', err);
      setPriorError("Impossible de charger les titres de prospection / exploration.");
    } finally {
      setPriorLoading(false);
    }
  };

  const persistPriorSelection = (prior: PriorTitre) => {
    try {
      localStorage.setItem('prior_permis_id', String(prior.id));
      localStorage.setItem('prior_code_permis', prior.code_permis || '');
      if (prior.codeNumber) localStorage.setItem('prior_code_number', prior.codeNumber);
      if (prior.type_code) localStorage.setItem('prior_type_code', prior.type_code);
      if (prior.detenteur?.id_detenteur)
        localStorage.setItem('prior_detenteur_id', String(prior.detenteur.id_detenteur));
      if (prior.communeId != null)
        localStorage.setItem('prior_commune_id', String(prior.communeId));
    } catch {}
  };

  const persistApmSelection = (apm: PriorTitre) => {
    try {
      localStorage.setItem('apm_permis_id', String(apm.id));
      localStorage.setItem('apm_code_permis', apm.code_permis || '');
      if (apm.codeNumber) localStorage.setItem('apm_code_number', apm.codeNumber);
      if (apm.type_code) localStorage.setItem('apm_type_code', apm.type_code);
      if (apm.detenteur?.id_detenteur)
        localStorage.setItem('apm_detenteur_id', String(apm.detenteur.id_detenteur));
      if (apm.communeId != null)
        localStorage.setItem('apm_commune_id', String(apm.communeId));
    } catch {}
  };

  const handleStartProcedure = async () => {
    const permis = effectivePermis;

    if (!permis || !dateSoumission) {
      toast.warning('Selectionnez un type de permis et une date de soumission.');
      return;
    }

    if (!apiBase) {
      toast.error('Configuration API manquante.');
      return;
    }

    setSubmitting(true);

    try {
      cleanLocalStorageForNewDemande();

      const isExploitation = (permis.code_type || '').toUpperCase().startsWith('TX');
      let id_detenteur: number | undefined = undefined;
      if (isExploitation) {
        // Ensure prior titre has been chosen
        let detIdStr = localStorage.getItem('prior_detenteur_id');
        if (!detIdStr && selectedPrior?.detenteur?.id_detenteur) {
          detIdStr = String(selectedPrior.detenteur.id_detenteur);
        }
        if (!detIdStr) {
          toast.warning('Veuillez sélectionner le titre antérieur (APM/TEM/TEC).');
          setSubmitting(false);
          // re-open modal to force selection
          await openPriorTitresModal();
          return;
        }
        id_detenteur = Number(detIdStr);
        if (selectedPrior) persistPriorSelection(selectedPrior);
      }

      // Pre-resolve exploitation lineage if needed
      let id_sourceProc: number | undefined = undefined;
      let designation_number: string | undefined = undefined;
      if (isExploitation) {
        try {
          designation_number = selectedPrior?.codeNumber || (localStorage.getItem('prior_code_permis') || '').trim().match(/(\d+)$/)?.[1] || undefined;
        } catch {}
        // Try cached source first
        try {
          const src = localStorage.getItem('prior_source_proc_id');
          if (src) {
            const n = parseInt(src, 10);
            if (!isNaN(n)) id_sourceProc = n;
          }
        } catch {}
        // Resolve from prior permis if not cached
        if (!id_sourceProc) {
          const priorId = selectedPrior?.id || Number(localStorage.getItem('prior_permis_id'));
          if (priorId) {
            try {
              const pr = await axios.get(`${apiBase}/Permisdashboard/${priorId}`, { withCredentials: true });
              const procedures = pr.data?.procedures || [];
              let source = procedures
                .filter((p: any) => (p.coordonnees?.length ?? 0) > 0)
                .sort((a: any, b: any) => (b.coordonnees?.length ?? 0) - (a.coordonnees?.length ?? 0))[0];
              const preferred = procedures.find((p: any) =>
                (p.coordonnees?.length ?? 0) > 0 &&
                (p.demandes?.[0]?.typeProcedure?.libelle || '').toLowerCase() === 'demande'
              );
              if (preferred) source = preferred;
              if (source?.id_proc) {
                id_sourceProc = source.id_proc;
                try { localStorage.setItem('prior_source_proc_id', String(id_sourceProc)); } catch {}
              }
            } catch {}
          }
        }
      }

      const response = await axios.post(
        `${apiBase}/demandes`,
        {
          id_typepermis: permis.id,
          objet_demande: 'Instruction initialisee',
          date_demande: dateSoumission.toISOString(),
          date_instruction: new Date().toISOString(),
          ...(id_detenteur ? { id_detenteur } : {}),
          ...(id_sourceProc ? { id_sourceProc } : {}),
          ...(designation_number ? { designation_number } : {}),
        },
        { withCredentials: true },
      );

      const { procedure, code_demande: demandeCode, id_demande } = response.data ?? {};

      setCodeDemande(demandeCode ?? '');
      setHeureDemarrage(new Date().toLocaleString('fr-FR'));

      if (id_demande) {
        localStorage.setItem('id_demande', String(id_demande));
      }
      if (procedure?.id_proc) {
        localStorage.setItem('id_proc', String(procedure.id_proc));
      }
      localStorage.setItem('code_demande', demandeCode ?? '');
      localStorage.setItem('selected_permis', JSON.stringify(permis));
      localStorage.setItem(
        'permis_details',
        JSON.stringify({
          duree_initiale: permis.duree_initiale,
          nbr_renouv_max: permis.nbr_renouv_max,
          superficie_max: permis.superficie_max ?? null,
          duree_renouv: permis.duree_renouv,
        }),
      );

      // If exploitation, ensure prior code number is persisted to be reused at step 8
      if ((permis.code_type || '').toUpperCase().startsWith('TX')) {
        const priorCodeNum = localStorage.getItem('prior_code_number');
        if (!priorCodeNum && selectedPrior?.codeNumber) {
          localStorage.setItem('prior_code_number', selectedPrior.codeNumber);
        }

        // Try to align location (commune) with prior titre when available
        if (id_demande && (selectedPrior?.communeId != null)) {
          try {
            await axios.put(
              `${apiBase}/demandes/${id_demande}`,
              { id_commune: selectedPrior.communeId },
              { withCredentials: true },
            );
          } catch (e) {
            console.warn('Mise à jour de la commune échouée', e);
          }
        }

        // Copy perimeter polygon from selected prior titre into the new procedure (server-side duplication)
        if (procedure?.id_proc) {
          try {
            let sourceProcId: number | null = null;
            // Use cached source if available
            try {
              const src = localStorage.getItem('prior_source_proc_id');
              if (src) {
                const n = parseInt(src, 10);
                if (!isNaN(n)) sourceProcId = n;
              }
            } catch {}

            // Resolve source procedure id from prior permis if not cached
            if (!sourceProcId) {
              const priorId = selectedPrior?.id || Number(localStorage.getItem('prior_permis_id'));
              if (priorId) {
                const pr = await axios.get(`${apiBase}/Permisdashboard/${priorId}`, { withCredentials: true });
                const procedures = pr.data?.procedures || [];
                let source = procedures
                  .filter((p: any) => (p.coordonnees?.length ?? 0) > 0)
                  .sort((a: any, b: any) => (b.coordonnees?.length ?? 0) - (a.coordonnees?.length ?? 0))[0];
                const preferred = procedures.find((p: any) =>
                  (p.coordonnees?.length ?? 0) > 0 &&
                  (p.demandes?.[0]?.typeProcedure?.libelle || '').toLowerCase() === 'demande'
                );
                if (preferred) source = preferred;
                if (source?.id_proc) {
                  sourceProcId = source.id_proc;
                  try { localStorage.setItem('prior_source_proc_id', String(sourceProcId)); } catch {}
                }
              }
            }

            if (sourceProcId) {
              await axios.post(`${apiBase}/coordinates/copy`, {
                source_proc: sourceProcId,
                target_proc: procedure.id_proc,
                mode: 'duplicate',
              }, { withCredentials: true });
            }
          } catch (err) {
            console.warn('Copie du périmètre échouée', err);
          }
        }
      }

      if (procedure?.id_proc) {
        await router.push(`/demande/step1/page1?id=${procedure.id_proc}`);
      } else {
        toast.info('Demande creee, mais identifiant de procedure indisponible.');
      }
    } catch (error) {
      console.error('Failed to create demande', error);
      toast.error('Erreur lors de la creation de la demande.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          <div className={styles.breadcrumb}>
            <span>SIGAM</span>
            <FiChevronRight className={styles.breadcrumbArrow} />
            <span>Type de permis</span>
          </div>

          <div className={styles.demandeContainer}>
            {pageError && <div className={styles.errorBox}>{pageError}</div>}

            <label className={styles.label}>
              Categorie de permis <span className={styles.requiredMark}>*</span>
            </label>
            <select
              className={styles.select}
              onChange={(event) => handlePermisChange(event.target.value)}
              value={selectedPermisId === '' ? '' : String(selectedPermisId)}
              disabled={optionsLoading}
            >
              <option value="">-- Selectionnez --</option>
              {permisOptions.map((permis) => (
                <option key={permis.id} value={permis.id}>
                  {permis.lib_type} ({permis.code_type}) - {permis.regime}
                </option>
              ))}
            </select>

            {detailsLoading && (
              <div className={styles.loadingHint}>Chargement des details du permis...</div>
            )}

            {effectivePermis && !detailsLoading && (
              <div className={styles.permisDetails}>
                <h4>Details du permis selectionne</h4>
                <ul>
                  <li>Duree initiale: {effectivePermis.duree_initiale} ans</li>
                  <li>Renouvellements maximum: {effectivePermis.nbr_renouv_max}</li>
                  <li>Duree du renouvellement: {effectivePermis.duree_renouv} ans</li>
                  <li>Superficie maximale: {effectivePermis.superficie_max ?? 'Non specifie'} ha</li>
                  <li>Delai de renouvellement: {effectivePermis.delai_renouv} jours avant expiration</li>
                </ul>
              </div>
            )}

            {codeDemande && (
              <div className={styles.infoBox}>
                <div className={styles.infoTitle}>Informations systeme</div>
                <p className={styles.infoText}>
                  <strong>Code demande genere:</strong> <span>{codeDemande}</span>
                </p>
                <p className={styles.infoText}>
                  <strong>Heure de demarrage:</strong> {heureDemarrage}
                </p>
                <p className={styles.infoNote}>
                  Un dossier administratif a ete initialise. Vous pouvez poursuivre l'instruction.
                </p>
              </div>
            )}

            <label className={styles.label}>
              Date de soumission de la demande <span className={styles.requiredMark}>*</span>
            </label>
            <div className={styles['datepicker-wrapper']}>
              <DatePicker
                selected={dateSoumission}
                onChange={(date: Date | null) => setDateSoumission(date)}
                dateFormat="dd/MM/yyyy"
                className={styles.select}
                placeholderText="Choisissez une date"
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={`${styles.button} ${styles.start}`}
                disabled={submitting || !effectivePermis}
                onClick={handleStartProcedure}
              >
                {submitting ? 'Creation...' : 'Demarrer la procedure'}
              </button>
            </div>

            {showPriorModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h3>Sélectionnez le titre antérieur</h3>
                    <button className={styles.modalClose} onClick={() => setShowPriorModal(false)}>
                      ×
                    </button>
                  </div>
                  <div className={styles.modalBody}>
                    {priorLoading && <div>Chargement...</div>}
                    {priorError && <div className={styles.errorBox}>{priorError}</div>}
                    {!priorLoading && !priorError && (
                      <><div className={styles.modalToolbar}>
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="Rechercher par code, detenteur, type, numero..."
                          value={priorSearch}
                          onChange={(e) => setPriorSearch(e.target.value)} />
                      </div><div className={styles.titreList}>
                          {filteredPriorTitres.length === 0 && (
                            <div>Aucun titre de prospection/exploration trouvé.</div>
                          )}
                          {visiblePriorTitres.map((t) => (
                            <label key={t.id} className={styles.titreItem}>
                              <input
                                type="radio"
                                name="prior_titre"
                                value={t.id}
                                checked={selectedPrior?.id === t.id}
                                onChange={() => setSelectedPrior(t)} />
                              <div className={styles.titreInfo}>
                                <div>
                                  <strong>{t.code_permis}</strong> {t.type_code ? `(${t.type_code})` : ''}
                                </div>
                                <div className={styles.titreDetenteur}>
                                  Détenteur: {t.detenteur?.nom || '—'}
                                </div>
                              </div>
                            </label>
                          ))}
                          {filteredPriorTitres.length > visiblePriorTitres.length && (
                            <div className={styles.loadMoreRow}>
                              <button className={styles.loadMoreBtn} onClick={() => setPageCount((p) => p + 1)}>
                                Afficher plus...
                              </button>
                            </div>
                          )}
                        </div>
                        {selectedPrior?.type_code && (selectedPrior.type_code.toUpperCase() === 'TEM') && (
                          <>
                            <div style={{ marginTop: 12, fontWeight: 600 }}>Titres APM (optionnel)</div>
                            <div className={styles.titreList}>
                              {apmVisible.map((t) => (
                                <label key={t.id} className={styles.titreItem}>
                                  <input
                                    type="radio"
                                    name="prior_titre_apm"
                                    value={t.id}
                                    checked={selectedApm?.id === t.id}
                                    onChange={() => setSelectedApm(t)} />
                                  <div className={styles.titreInfo}>
                                    <div>
                                      <strong>{t.code_permis}</strong> {t.type_code ? `(${t.type_code})` : ''}
                                    </div>
                                    <div className={styles.titreDetenteur}>
                                      Détenteur: {t.detenteur?.nom || 'N/A'} {t.codeNumber ? `• ${t.codeNumber}` : ''}
                                    </div>
                                  </div>
                                </label>
                              ))}
                              {apmFiltered.length > apmVisible.length && (
                                <div className={styles.loadMoreRow}>
                                  <button className={styles.loadMoreBtn} onClick={() => setApmPageCount((p) => p + 1)}>
                                    Afficher plus APM...
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        </>
                    )}
                  </div>
                  <div className={styles.modalFooter}>
                    <button
                      className={`${styles.button} ${styles.start}`}
                      disabled={!selectedPrior}
                      onClick={() => {
                        if (selectedPrior) {
                          persistPriorSelection(selectedPrior);
                          if (selectedApm) { persistApmSelection(selectedApm); }
                          setShowPriorModal(false);
                          toast.success('Titre antérieur sélectionné.');
                        }
                      }}
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
