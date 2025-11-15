import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FiCheck, FiPlay, FiArrowRight, FiX, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/router';
import styles from './ProgressStepper.module.css';
import { Phase, ProcedurePhase, EtapeProc } from '../src/types/procedure';
import axios from 'axios';

const MISSING_DOCS_STORAGE_KEY = 'sigam_missing_required_docs';

type MissingDocsPayload = {
  missing: string[];
  procedureId?: number | null;
  demandeId?: string | null;
  phase?: string;
  allowedPrefixes?: string[];
  updatedAt?: string;
};

interface Props {
  phases: Phase[];
  currentProcedureId: number | undefined;
  currentEtapeId?: number;
  procedurePhases?: ProcedurePhase[];
  procedureTypeId?: number;
}

const ProgressStepper: React.FC<Props> = ({
  phases,
  currentProcedureId,
  currentEtapeId,
  procedurePhases = [],
  procedureTypeId,
}) => {
  const router = useRouter();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [missingDocsPayload, setMissingDocsPayload] = useState<MissingDocsPayload | null>(null);


  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const phaseStatuses = useMemo(() => {
    const map = new Map<number, string>();
    (procedurePhases || []).forEach(phase => {
      map.set(phase.id_phase, phase.statut!);
    });
    return map;
  }, [procedurePhases]);

  const filteredPhases = useMemo(() => {
    if (!Array.isArray(phases) || phases.length === 0) {
      return [] as Phase[];
    }
    // Backend now determines which phases belong to the procedure via ProcedurePhase
    // so we simply sort the provided phases by ordre without client-side filtering.
    return [...phases].sort((a, b) => a.ordre - b.ordre);
  }, [phases]);
  const firstPhaseId = useMemo(() => (filteredPhases[0]?.id_phase ?? null), [filteredPhases]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!currentProcedureId) {
      setMissingDocsPayload(null);
      return;
    }

    const key = MISSING_DOCS_STORAGE_KEY;

    const matchesProcedure = (payload?: MissingDocsPayload | null) => {
      if (!payload || !Array.isArray(payload.missing) || payload.missing.length === 0) {
        return false;
      }
      if (payload.procedureId != null) {
        return Number(payload.procedureId) === currentProcedureId;
      }
      return false;
    };

    const readStorage = () => {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        setMissingDocsPayload(null);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as { procedures?: Record<string, MissingDocsPayload> } & MissingDocsPayload;
        const candidates: MissingDocsPayload[] = [];

        if (parsed && typeof parsed === 'object') {
          if (parsed.procedures && typeof parsed.procedures === 'object') {
            Object.values(parsed.procedures).forEach((value) => {
              if (value && typeof value === 'object') {
                candidates.push(value as MissingDocsPayload);
              }
            });
          } else if (Array.isArray(parsed.missing)) {
            candidates.push(parsed as MissingDocsPayload);
          }
        }

        const match = candidates.find(matchesProcedure) ?? null;
        setMissingDocsPayload(match);
      } catch (error) {
        setMissingDocsPayload(null);
      }
    };

    const handleCustom = (event: Event) => {
      const detail = (event as CustomEvent<MissingDocsPayload | null>).detail;
      if (!detail) {
        readStorage();
        return;
      }

      if (!matchesProcedure(detail)) {
        return;
      }

      setMissingDocsPayload(detail);
    };

    readStorage();

    window.addEventListener('sigam:missing-docs', handleCustom as EventListener);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        readStorage();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('sigam:missing-docs', handleCustom as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentProcedureId]);

  const missingDocsInfo = useMemo(() => {
    if (!currentProcedureId || !missingDocsPayload || missingDocsPayload.missing.length === 0) {
      return { lockPhase: false, lockSteps: false };
    }

    if (missingDocsPayload.procedureId != null && Number(missingDocsPayload.procedureId) !== currentProcedureId) {
      return { lockPhase: false, lockSteps: false };
    }

    const lockFirstPhase = (missingDocsPayload.phase ?? 'FIRST') === 'FIRST';

    return {
      lockPhase: lockFirstPhase,
      lockSteps: lockFirstPhase,
    };
  }, [missingDocsPayload, currentProcedureId]);




  const getPhaseStatus = useCallback(
    (phaseId: number): string => phaseStatuses.get(phaseId) ?? 'EN_ATTENTE',
    [phaseStatuses]
  );

  const getEtapeStatus = useCallback(
    (etape: EtapeProc): string => {
      const procedureEtape = etape.procedureEtapes?.find(
        et => et.id_proc === currentProcedureId
      ) ?? etape.procedureEtapes?.[0];

      return procedureEtape?.statut ?? 'EN_ATTENTE';
    },
    [currentProcedureId]
  );

  const isPhaseCompleted = useCallback(
    (phase: Phase): boolean => getPhaseStatus(phase.id_phase) === 'TERMINEE',
    [getPhaseStatus]
  );

  const isPhaseInProgress = useCallback(
    (phase: Phase): boolean => getPhaseStatus(phase.id_phase) === 'EN_COURS',
    [getPhaseStatus]
  );

  useEffect(() => {
    if (!filteredPhases.length) {
      setExpandedPhase(null);
      return;
    }

    setExpandedPhase(prev => {
      if (prev && filteredPhases.some(phase => phase.id_phase === prev)) {
        return prev;
      }

      const inProgress = filteredPhases.find(isPhaseInProgress);
      if (inProgress) {
        return inProgress.id_phase;
      }

      const completed = [...filteredPhases]
        .reverse()
        .find(isPhaseCompleted);

      if (completed) {
        return completed.id_phase;
      }

      return filteredPhases[0]?.id_phase ?? null;
    });
  }, [filteredPhases, isPhaseCompleted, isPhaseInProgress]);

  const canNavigateToPhase = useCallback(
    (phase: Phase): boolean => {
      if (!currentProcedureId || !filteredPhases.length) return false;

      // When required documents are missing, allow navigation only within the current phase
      if (missingDocsInfo.lockPhase) {
        const anyInProgress = filteredPhases.some(isPhaseInProgress);
        if (anyInProgress) {
          // Allow navigation within the current phase and back to any completed phases
          return isPhaseInProgress(phase) || isPhaseCompleted(phase);
        }
        // If nothing started yet, allow the very first phase only
        return firstPhaseId ? phase.id_phase === firstPhaseId : false;
      }

      if (isPhaseCompleted(phase) || isPhaseInProgress(phase)) return true;

      const targetIndex = filteredPhases.findIndex(p => p.id_phase === phase.id_phase);
      if (targetIndex === -1) return false;
      const previousPhases = filteredPhases.slice(0, targetIndex);
      return previousPhases.every(isPhaseCompleted);
    },
    [currentProcedureId, filteredPhases, firstPhaseId, isPhaseCompleted, isPhaseInProgress, missingDocsInfo]
  );

  const canNavigateToEtape = useCallback(
    (etape: EtapeProc, phase: Phase): boolean => {
      if (!currentProcedureId) return false;

      // If required docs lock navigation, still allow clicking steps
      // in the current allowed phase (even if phase not yet EN_COURS)
      if (missingDocsInfo.lockSteps) {
        return canNavigateToPhase(phase);
      }

      return canNavigateToPhase(phase);
    },
    [canNavigateToPhase, currentProcedureId, missingDocsInfo]
  );
  const canAdvanceToNextPhase = useCallback(
    (phase: Phase): boolean => {
      if (!currentProcedureId || !isPhaseInProgress(phase)) {
        return false;
      }

      return phase.etapes.every(etape => getEtapeStatus(etape) === 'TERMINEE');
    },
    [currentProcedureId, isPhaseInProgress, getEtapeStatus]
  );

  // Debounce function to limit rapid clicks
  const debounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  const handleEtapeClick = useCallback(
    debounce(async (etape: EtapeProc, phase: Phase) => {
      if (!currentProcedureId || !canNavigateToEtape(etape, phase) || isNavigating) return;

      setIsNavigating(true);
      setLoading(true);

      try {
        if (getEtapeStatus(etape) === 'EN_ATTENTE') {
          await axios.post(
            `${apiURL}/api/procedure-etape/start/${currentProcedureId}/${etape.id_etape}`
          );
        }
        router.push(`/demande/step${etape.id_etape}/page${etape.id_etape}?id=${currentProcedureId}`);
      } catch (error) {
        console.error('Error handling step navigation:', error);
      } finally {
        setLoading(false);
        setIsNavigating(false);
      }
    }, 300),
    [currentProcedureId, isNavigating, router, apiURL, getEtapeStatus, canNavigateToEtape, debounce]
  );

  const handleNextPhase = useCallback(
    debounce(async (currentPhaseId: number) => {
      if (!currentProcedureId || isNavigating) return;

      setIsNavigating(true);
      setLoading(true);

      try {
        await axios.post(`${apiURL}/api/procedure-etape/phase/${currentProcedureId}/next`, {
          currentPhaseId,
        });
       router.reload();
      } catch (error) {
        console.error('Error starting next phase:', error);
      } finally {
        setLoading(false);
        setIsNavigating(false);
      }
    }, 300),
    [currentProcedureId, router, apiURL, isNavigating, debounce]
  );

  const hasPhaseList = Array.isArray(phases) && phases.length > 0;
  const hasProcedureId = typeof currentProcedureId === 'number' && currentProcedureId > 0;
  const hasStatusData = Array.isArray(procedurePhases);
  const isLoadingData = !hasPhaseList || !hasProcedureId;

  if (isLoadingData) {
    return (
      <div className={styles.dataLoadingContainer}>
        <div className={styles.dataLoadingContent}>
          <FiRefreshCw className={styles.dataLoadingSpinner} />
          <div className={styles.dataLoadingText}>
            <h4>Chargement des données de progression...</h4>
            <div className={styles.dataReadinessStatus}>
              <span className={hasPhaseList ? styles.ready : styles.pending}>
                Phases: {hasPhaseList ? '✓' : '...'}
              </span>
              <span className={hasStatusData ? styles.ready : styles.pending}>
                Statuts: {hasStatusData ? '✓' : '...'}
              </span>
              <span className={hasProcedureId ? styles.ready : styles.pending}>
                Procédure: {hasProcedureId ? '✓' : '...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredPhases.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataContent}>
          <FiX className={styles.noDataIcon} />
          <h4>Aucune phase disponible</h4>
          <p>Les données de progression ne sont pas disponibles pour le moment.</p>
        </div>
      </div>
    );
  }


  // Auto-advance to next phase when all steps in the current phase are completed
  const autoAdvancedRef = useRef<number | null>(null);
  useEffect(() => {
    const hasLists = Array.isArray(filteredPhases) && filteredPhases.length > 0;
    if (!hasLists || typeof currentProcedureId !== "number" || currentProcedureId <= 0) return;
    if (isNavigating) return;

    const currentInProgress = filteredPhases.find(p => getPhaseStatus(p.id_phase) === "EN_COURS");
    if (!currentInProgress) return;

    const readyForNext = currentInProgress.etapes.every(e => getEtapeStatus(e) === "TERMINEE");
    if (readyForNext && autoAdvancedRef.current !== currentInProgress.id_phase) {
      // Prevent repeated auto-advance loops across reloads using sessionStorage
      const storageKey = `sigam:auto-advance:${currentProcedureId}:${currentInProgress.id_phase}`;
      try {
        if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
          return;
        }
      } catch {}

      autoAdvancedRef.current = currentInProgress.id_phase;
      const idx = filteredPhases.findIndex(p => p.id_phase === currentInProgress.id_phase);
      const next = filteredPhases[idx + 1];
      if (next) setExpandedPhase(next.id_phase);
      try { if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, '1'); } catch {}
      handleNextPhase(currentInProgress.id_phase);
    }
  }, [filteredPhases, currentProcedureId, isNavigating, getPhaseStatus, getEtapeStatus, handleNextPhase]);

                {loading ? 'Chargement...' : 'Phase suivante →'}
  return (
    <div className={styles.progressContainer}>
      {/* Horizontal Phases */}
      <div className={styles.horizontalPhases}>
        {filteredPhases.map((phase, phaseIndex) => {
          const phaseStatus = getPhaseStatus(phase.id_phase);
          const isCompleted = isPhaseCompleted(phase);
          const isInProgress = isPhaseInProgress(phase);
          const isExpanded = expandedPhase === phase.id_phase;
          const isNavigable = canNavigateToPhase(phase);
          const phaseStatusClass = styles[phaseStatus.toLowerCase?.() ?? ''] ?? '';

          return (
            <React.Fragment key={phase.id_phase}>
              {phaseIndex > 0 && (
                <div
                  className={`${styles.phaseConnector} ${
                    isCompleted || isInProgress ? styles.connectorActive : ''
                  }`}
                >
                  <FiArrowRight className={styles.connectorIcon} />
                </div>
              )}
              <div
                className={`${styles.phaseItem} ${
                  isCompleted ? styles.phaseCompleted : ''
                } ${isInProgress ? styles.phaseInProgress : ''} ${
                  isExpanded ? styles.phaseExpanded : ''
                } ${!isNavigable ? styles.phaseLocked : ''}`}
              >
                <div
                  className={styles.phaseContent}
                  onClick={() => isNavigable && setExpandedPhase(isExpanded ? null : phase.id_phase)}
                >
                  <div
                    className={`${styles.phaseCircle} ${isCompleted ? styles.completed : ''} ${
                      isInProgress ? styles.inProgress : ''
                    } ${!isNavigable ? styles.locked : ''}`}
                  >
                    {isCompleted ? (
                      <FiCheck className={styles.phaseIcon} />
                    ) : isInProgress ? (
                      <FiPlay className={styles.phaseIcon} />
                    ) : (
                      <span className={styles.phaseNumber}>{phaseIndex + 1}</span>
                    )}
                  </div>
                  <div className={styles.phaseInfo}>
                    <span className={styles.phaseTitle}>{phase.libelle}</span>
                    <span className={`${styles.phaseStatus} ${phaseStatusClass}`}>
                      {phaseStatus}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Steps for Expanded Phase */}
      {expandedPhase !== null && (
        <div className={styles.stepsSection}>
          <div className={styles.horizontalSteps}>
            {filteredPhases
              .find(p => p.id_phase === expandedPhase)
              ?.etapes.map((etape, etapeIndex) => {
                const phase = filteredPhases.find(p => p.id_phase === expandedPhase)!;
                const etapeStatus = getEtapeStatus(etape);
                const isEtapeCompleted = etapeStatus === 'TERMINEE';
                const isEtapeActive = etape.id_etape === currentEtapeId;
                const isEtapeNavigable = canNavigateToEtape(etape, phase);
                const etapeStatusClass = styles[etapeStatus.toLowerCase?.() ?? ''] ?? '';

                return (
                  <React.Fragment key={etape.id_etape}>
                    {etapeIndex > 0 && (
                      <div
                        className={`${styles.stepConnector} ${
                          isEtapeCompleted || isEtapeActive ? styles.connectorActive : ''
                        }`}
                      />
                    )}
                    <div
                      className={`${styles.stepItem} ${
                        isEtapeCompleted ? styles.stepCompleted : ''
                      } ${isEtapeActive ? styles.stepActive : ''} ${
                        !isEtapeNavigable ? styles.stepLocked : ''
                      }`}
                      onMouseEnter={() => isEtapeNavigable && setHoveredStep(etape.id_etape)}
                      onMouseLeave={() => setHoveredStep(null)}
                      onClick={() => isEtapeNavigable && handleEtapeClick(etape, phase)}
                    >
                      <div
                        className={`${styles.stepCircle} ${isEtapeCompleted ? styles.completed : ''} ${
                          isEtapeActive ? styles.active : ''
                        }`}
                      >
                        {isEtapeCompleted ? (
                          <FiCheck className={styles.stepIcon} />
                        ) : (
                          <span className={styles.stepNumber}>{etapeIndex + 1}</span>
                        )}
                      </div>
                      {(hoveredStep === etape.id_etape || isEtapeActive) && (
                        <div className={styles.stepTooltip}>
                          <span className={styles.stepName}>{etape.lib_etape}</span>
                          <span className={`${styles.stepStatus} ${etapeStatusClass}`}>
                            {etapeStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
          {filteredPhases.find(p => p.id_phase === expandedPhase) &&
            canAdvanceToNextPhase(filteredPhases.find(p => p.id_phase === expandedPhase)!) && (
              <button
                className={styles.nextPhaseButton}
                onClick={() => handleNextPhase(expandedPhase)}
                disabled={loading || isNavigating}
              >
                {loading ? 'Chargement...' : 'Phase suivante ?'}
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default ProgressStepper;











