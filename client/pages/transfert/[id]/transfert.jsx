import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import PermisCard from '../PermisCard';
import DetenteurCard from '../DetenteurCard';
import SelectDetenteurModal from '../SelectDetenteurModal';
import CreateDetenteurForm from '../CreateDetenteurForm';
import TransferSummary from '../TransferSummary';
import LoadingSpinner from '../LoadingSpinner';
import Notification from '../Notification';
import TransferHistory from '../TransferHistory';
import styles from '../transfert.module.css';
import { useAuthReady } from '@/src/hooks/useAuthReady';

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const STEP_LABELS = ['Details', 'Selection', 'Confirmation', 'Resultat'];

export default function TransfertPage() {
  const router = useRouter();
  const { id } = router.query;
  const isAuthReady = useAuthReady();

  const [loading, setLoading] = useState(true);
  const [permisDetails, setPermisDetails] = useState(null);
  const [currentDetenteur, setCurrentDetenteur] = useState(null);
  const [selectedDetenteur, setSelectedDetenteur] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [dateDemande, setDateDemande] = useState(() => new Date().toISOString().slice(0, 10));
  const [motif, setMotif] = useState('');
  const [observations, setObservations] = useState('');
  const [applyTransfer, setApplyTransfer] = useState(true);

  const [transferResult, setTransferResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const permisId = useMemo(() => (id ? Number(id) : NaN), [id]);

  const closeNotification = useCallback(() => setNotification(null), []);

  const fetchHistory = useCallback(
    async (controller) => {
      try {
        const response = await axios.get(`${apiURL}/transfert/permis/${permisId}/history`, {
          withCredentials: true,
          signal: controller?.signal,
        });
        setTransferHistory(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        console.error('Transfer history error:', err);
      }
    },
    [permisId],
  );

  const fetchPermisDetails = useCallback(
    async (controller) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiURL}/transfert/permis/${permisId}/details`, {
          withCredentials: true,
          signal: controller.signal,
        });

        setPermisDetails(response.data.permis);
        setCurrentDetenteur(response.data.permis?.detenteur ?? null);
        setStep(1);
        await fetchHistory(controller);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        console.error('Permis transfer fetch error:', err);
        setError('Impossible de charger les informations du permis');
        setNotification({
          type: 'error',
          message: 'Erreur lors du chargement des donnees du transfert',
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchHistory, permisId],
  );

  useEffect(() => {
    if (!permisId || Number.isNaN(permisId) || !isAuthReady) {
      return;
    }

    const controller = new AbortController();
    void fetchPermisDetails(controller);

    return () => {
      controller.abort();
    };
  }, [fetchPermisDetails, permisId, isAuthReady]);

  const handleOpenSelect = () => {
    setShowSelectModal(true);
    setShowCreateForm(false);
    setStep(2);
  };

  const handleOpenCreate = () => {
    setShowCreateForm(true);
    setShowSelectModal(false);
    setStep(2);
  };

  const closeSelectModal = () => {
    setShowSelectModal(false);
    setStep(selectedDetenteur ? 3 : 1);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setStep(selectedDetenteur ? 3 : 1);
  };

  const handleExistingSelect = (detenteur) => {
    setSelectedDetenteur(detenteur);
    setShowSelectModal(false);
    setShowCreateForm(false);
    setStep(3);
  };

  const handleCreateDetenteur = async (detenteurPayload) => {
    try {
      const response = await axios.post(`${apiURL}/transfert/detenteur`, detenteurPayload, {
        withCredentials: true,
      });

      setSelectedDetenteur(response.data);
      setShowCreateForm(false);
      setStep(3);
      setNotification({ type: 'success', message: 'Detenteur cree avec succes' });

      return response.data;
    } catch (err) {
      console.error('Create detenteur error:', err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Impossible de creer le detenteur';
      setNotification({ type: 'error', message });
      throw err;
    }
  };

  const handleTransfer = async () => {
    if (!selectedDetenteur) {
      setNotification({ type: 'warning', message: 'Selectionnez ou creez un detenteur cible' });
      return;
    }

    if (!motif.trim()) {
      setNotification({ type: 'warning', message: 'Indiquez le motif du transfert' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        permisId,
        date_demande: dateDemande,
        motif_transfert: motif.trim(),
        observations: observations.trim() || undefined,
        existingDetenteurId: Number(selectedDetenteur.id_detenteur),
        applyTransferToPermis: applyTransfer,
      };

      const response = await axios.post(`${apiURL}/transfert/start`, payload, {
        withCredentials: true,
      });

      setTransferResult(response.data);
      setStep(4);
      setNotification({ type: 'success', message: 'Transfert demarre avec succes' });
      await fetchHistory();
    } catch (err) {
      console.error('Transfer error:', err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Erreur lors du demarrage du transfert';
      setNotification({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedDetenteur(null);
    setTransferResult(null);
    setMotif('');
    setObservations('');
    setApplyTransfer(true);
    setDateDemande(new Date().toISOString().slice(0, 10));
    setStep(1);
  };

  const handleViewDetails = () => {
    if (transferResult?.newDemandeId) {
      router.push(`/demand_dashboard/${transferResult.newDemandeId}`);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const canSubmit = Boolean(selectedDetenteur && motif.trim() && !loading);

  if (loading && !permisDetails) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement du transfert..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {notification && <Notification {...notification} onClose={closeNotification} />}

      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <span onClick={() => router.push('/gestion_permis')}>Gestion des permis</span>
          <span className={styles.divider}>/</span>
          <span>Transfert du permis #{permisDetails?.code_permis ?? permisId}</span>
        </div>

        <div className={styles.headerMain}>
          <h1 className={styles.title}>Transfert de permis</h1>
          <button
            className={styles.historyButton}
            onClick={() => setShowHistory((prev) => !prev)}
            disabled={!transferHistory.length}
          >
            {showHistory ? 'Masquer' : 'Voir'} l'historique
          </button>
        </div>
        <p className={styles.subtitle}>
          Selectionnez un nouveau detenteur et validez le transfert du titre minier.
        </p>
      </div>

      {showHistory && <TransferHistory history={transferHistory} />}

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          {STEP_LABELS.map((label, index) => {
            const stepIndex = index + 1;
            const className = [styles.step];
            if (stepIndex === step) className.push(styles.active);
            if (stepIndex < step) className.push(styles.completed);
            return (
              <div key={label} className={className.join(' ')}>
                <div className={styles.stepNumber}>{stepIndex}</div>
                <div className={styles.stepLabel}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Permis</h2>
            </div>
            <div className={styles.cardBody}>
              <PermisCard permis={permisDetails} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Detenteur actuel</h2>
            </div>
            <div className={styles.cardBody}>
              {currentDetenteur ? (
                <DetenteurCard detenteur={currentDetenteur} />
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}></div>
                  <p>Aucun detenteur lie a ce permis</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Actions</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.actionList}>
                <button className={styles.secondaryButton} onClick={handleOpenSelect}>
                  <span className={styles.icon}></span>
                  Selectionner un detenteur existant
                </button>
                <button className={styles.secondaryButton} onClick={handleOpenCreate}>
                  <span className={styles.icon}>+</span>
                  Creer un nouveau detenteur
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Nouveau detenteur</h2>
            </div>
            <div className={styles.cardBody}>
              {selectedDetenteur ? (
                <DetenteurCard detenteur={selectedDetenteur} />
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}></div>
                  <p>Choisissez ou creez un detenteur pour poursuivre</p>
                </div>
              )}

              <div className={styles.formSection}>
                <h3>Details du transfert</h3>

                <div className={styles.formGroup}>
                  <label>Date de depot</label>
                  <input
                    type="date"
                    value={dateDemande}
                    onChange={(event) => setDateDemande(event.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Motif du transfert *</label>
                  <input
                    value={motif}
                    onChange={(event) => setMotif(event.target.value)}
                    placeholder="Motif du transfert"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Observations</label>
                  <textarea
                    value={observations}
                    onChange={(event) => setObservations(event.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={applyTransfer}
                      onChange={() => setApplyTransfer((prev) => !prev)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkmark}></span>
                    Appliquer immediatement le transfert sur le permis
                  </label>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.outlineButton} onClick={handleReset} disabled={loading}>
                  Reinitialiser
                </button>
                <button className={styles.primaryButton} onClick={handleTransfer} disabled={!canSubmit}>
                  {loading ? 'Traitement...' : 'Valider et demarrer la procedure'}
                </button>
              </div>

              {transferResult && (
                <div className={styles.resultSection}>
                  <TransferSummary
                    result={transferResult}
                    onViewDetails={handleViewDetails}
                    onPrint={handlePrintReceipt}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSelectModal && (
        <SelectDetenteurModal onClose={closeSelectModal} onSelect={handleExistingSelect} />
      )}

      {showCreateForm && (
        <div className={styles.modalOverlay}>
          <CreateDetenteurForm onCancel={closeCreateForm} onCreated={handleCreateDetenteur} />
        </div>
      )}
    </div>
  );
}
