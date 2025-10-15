'use client';

import { useEffect, useMemo, useState } from 'react';
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

  const effectivePermis = useMemo(() => {
    if (selectedPermis) {
      return selectedPermis;
    }

    if (selectedPermisId === '') {
      return null;
    }

    return permisOptions.find((option) => option.id === selectedPermisId) ?? null;
  }, [permisOptions, selectedPermis, selectedPermisId]);

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
    } catch (error) {
      console.error('Failed to load permit details', error);
      setSelectedPermis(null);
      toast.error('Impossible de charger les details du type de permis.');
    } finally {
      setDetailsLoading(false);
    }
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

      const response = await axios.post(
        `${apiBase}/demandes`,
        {
          id_typepermis: permis.id,
          objet_demande: 'Instruction initialisee',
          date_demande: dateSoumission.toISOString(),
          date_instruction: new Date().toISOString(),
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
          </div>
        </main>
      </div>
    </div>
  );
}
