'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './DecisionEntry.module.css';

// Updated Types

interface Detenteur {
  nom_societeFR: string;
}

interface TypeProcedure {
  libelle: string;
}

interface Demande {
  id_demande: number;
  detenteur: Detenteur | null;
  typeProcedure: TypeProcedure | null; // 🔑 Now typeProcedure is on demande
}

interface Permis {
  procedures: Array<{
    demandes: Demande[];
  }>;
}

interface Procedure {
  id_proc: number;
  num_proc: string;
  demandes: Demande[]; // 🔑 typeProcedure is now in demande objects
  permis: Permis[];
}

interface Decision {
  numero_decision: string;
  id_decision: number;
  decision_cd: 'favorable' | 'defavorable' | null;
  duree_decision: number | null;
  commentaires: string | null;
  id_comite: number;
}

interface ComiteDirection {
  id_comite: number;
  date_comite: string;
  objet_deliberation: string;
  resume_reunion: string;
  fiche_technique: string | null;
  carte_projettee: string | null;
  rapport_police: string | null;
  decisionCDs: Decision[];
}

interface SeanceWithDecisions {
  id_seance: number;
  num_seance: string;
  date_seance: string;
  comites: ComiteDirection[];
  procedures: Procedure[];
}

// Constants
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;

export default function DecisionEntry() {
  const [seances, setSeances] = useState<SeanceWithDecisions[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeance, setSelectedSeance] = useState<SeanceWithDecisions | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [currentProcedure, setCurrentProcedure] = useState<Procedure | null>(null);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [currentComite, setCurrentComite] = useState<ComiteDirection | null>(null);
  const [comiteFormData, setComiteFormData] = useState({
    date_comite: '',
    numero_decision: '',
    objet_deliberation: '',
    resume_reunion: '',
    fiche_technique: '',
    carte_projettee: '',
    rapport_police: '',
  });
  const [formData, setFormData] = useState({
    id_comite: 0,
    decision_cd: '',
    duree_decision: '',
    commentaires: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSeances, setExpandedSeances] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiURL = process.env.NEXT_PUBLIC_API_URL || '';

  // Get the company name - tries current demande first, then original demande from permis
  const getSocieteName = (proc: Procedure): string => {
    // Try current demande first
    const currentDetenteur = proc.demandes[0]?.detenteur?.nom_societeFR;
    if (currentDetenteur) return currentDetenteur;
    
    // For procedures linked to permis, get the original demande
    if (proc.permis.length > 0) {
      const originalProcedure = proc.permis[0].procedures[0];
      return originalProcedure?.demandes[0]?.detenteur?.nom_societeFR || 'N/A';
    }
    
    return 'N/A';
  };

  // Get the procedure type from the demande
  const getProcedureType = (proc: Procedure): string => {
    // Try current demande first
    const currentType = proc.demandes[0]?.typeProcedure?.libelle;
    if (currentType) return currentType;
    
    // For procedures linked to permis, get the original demande type
    if (proc.permis.length > 0) {
      const originalProcedure = proc.permis[0].procedures[0];
      return originalProcedure?.demandes[0]?.typeProcedure?.libelle || 'N/A';
    }
    
    return 'N/A';
  };

  // Fetch seances with error handling and abort controller
  const fetchSeances = useCallback(async () => {
    if (!apiURL) {
      setError('API URL is not configured');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiURL}/api/seances/with-decisions`, {
        signal,
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData}`);
      }

      const { data } = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      // Transform the data to ensure proper structure
      const transformedData = data.map(seance => ({
        ...seance,
        comites: Array.isArray(seance.comites) ? seance.comites : [],
        procedures: Array.isArray(seance.procedures) ? seance.procedures : []
      }));
     console.log("uuuuuuuuuuuuuuu",transformedData)
      setSeances(transformedData);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching seances:', error.message);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [apiURL]);

  // Initial data fetch
  useEffect(() => {
    fetchSeances();
  }, [fetchSeances]);

  // Memoized filtered seances
  const filteredSeances = useMemo(() => {
    if (!Array.isArray(seances)) return [];
    if (!searchTerm) return seances;

    return seances.filter(
      (seance) =>
        seance.num_seance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.date_seance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.procedures.some(
          (proc) =>
            proc.num_proc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (proc.demandes?.[0]?.detenteur?.nom_societeFR?.toLowerCase() || '').includes(
              searchTerm.toLowerCase()
            ) ||
            (proc.demandes?.[0]?.typeProcedure?.libelle?.toLowerCase() || '').includes(
              searchTerm.toLowerCase()
            )
        )
    );
  }, [seances, searchTerm]);

  // Pagination logic
  const paginatedSeances = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSeances.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSeances, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredSeances.length / ITEMS_PER_PAGE),
    [filteredSeances.length]
  );

  // Toggle seance expansion
  const toggleSeanceExpansion = (seanceId: number) => {
    setExpandedSeances((prev) => ({
      ...prev,
      [seanceId]: !prev[seanceId],
    }));
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Open decision modal
  const openDecisionModal = (seance: SeanceWithDecisions, procedure: Procedure) => {
    setSelectedSeance(seance);
    setCurrentProcedure(procedure);
    
    // Find comité for this procedure
  
const decision = seance.comites
  .flatMap(comite => comite.decisionCDs)
  .find(dec => dec.numero_decision?.endsWith(`-${procedure.id_proc}`)) || null;

    const procedureComite = decision
  ? seance.comites.find(c => c.id_comite === decision.id_comite) || null
  : null;
  

    setCurrentComite(procedureComite || null);
    setCurrentDecision(decision || null);

    setComiteFormData({
      date_comite: procedureComite?.date_comite
        ? format(new Date(procedureComite.date_comite), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    numero_decision: decision?.numero_decision || `DEC-${format(new Date(), 'yyyyMMdd-HHmm')}-${procedure.id_proc}`,
      objet_deliberation: procedureComite?.objet_deliberation || `Décision pour ${procedure.num_proc}`,
      resume_reunion: procedureComite?.resume_reunion || '',
      fiche_technique: procedureComite?.fiche_technique || '',
      carte_projettee: procedureComite?.carte_projettee || '',
      rapport_police: procedureComite?.rapport_police || '',
    });

    setFormData({
      id_comite: procedureComite?.id_comite || 0,
      decision_cd: decision?.decision_cd || '',
      duree_decision: decision?.duree_decision?.toString() || '',
      commentaires: decision?.commentaires || ''
    });
    
    setDecisionModalOpen(true);
  };

  // Handle form submission
  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedSeance || !currentProcedure) {
        throw new Error('Missing required data');
      }

      // 1. Check for existing comité for this procedure
      let comiteId: number | null = null;
      let decisionId: number | null = null;

      try {
        const comiteResponse = await fetch(`${apiURL}/api/comites/by-procedure`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seanceId: selectedSeance.id_seance,
            procedureId: currentProcedure.id_proc
          })
        });

        if (comiteResponse.ok) {
          const existingComite = await comiteResponse.json();
          if (existingComite && existingComite.id_comite) {
            comiteId = existingComite.id_comite;
            decisionId = existingComite.decisionCDs?.[0]?.id_decision || null;
            
            // Update existing comité
            const updateResponse = await fetch(`${apiURL}/api/comites/${comiteId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...comiteFormData,
                date_comite: new Date(comiteFormData.date_comite).toISOString()
              })
            });

            if (!updateResponse.ok) {
              throw new Error('Failed to update comité');
            }
          }
        }
      } catch (error) {
        console.warn('Error checking for existing comité:', error);
        // Continue with creating new comité
      }

      // 2. Create new comité if none exists
      if (!comiteId) {
        const newComiteResponse = await fetch(`${apiURL}/api/comites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...comiteFormData,
            id_seance: selectedSeance.id_seance,
            id_proc: currentProcedure.id_proc,
            date_comite: new Date(comiteFormData.date_comite).toISOString(),
            numero_decision: comiteFormData.numero_decision || `DEC-${format(new Date(), 'yyyyMMdd-HHmm')}-${currentProcedure.id_proc}`,
            objet_deliberation: comiteFormData.objet_deliberation || `Décision pour ${currentProcedure.num_proc}`
          })
        });

        if (!newComiteResponse.ok) {
          const errorText = await newComiteResponse.text();
          throw new Error(`Failed to create comité: ${errorText}`);
        }

        const newComite = await newComiteResponse.json();
        comiteId = newComite.id_comite;
        decisionId = newComite.decisionCDs?.[0]?.id_decision || null;
      }

      if (!comiteId) {
        throw new Error('No comité ID available');
      }

      // 3. Save decision
      const decisionData = {
        decision_cd: formData.decision_cd as 'favorable' | 'defavorable',
        duree_decision: formData.duree_decision ? parseInt(formData.duree_decision) : null,
        commentaires: formData.commentaires || null
      };

      const decisionUrl = decisionId 
        ? `${apiURL}/api/decisions/${decisionId}`
        : `${apiURL}/api/decisions`;
      const method = decisionId ? 'PUT' : 'POST';

      const decisionResponse = await fetch(decisionUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...decisionData,
          id_comite: comiteId
        })
      });

      if (!decisionResponse.ok) {
        const errorText = await decisionResponse.text();
        throw new Error(`Failed to save decision: ${errorText}`);
      }

      // Refresh data
      await fetchSeances();
      setDecisionModalOpen(false);

    } catch (error) {
      console.error('Error in handleSubmitDecision:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle comité form changes
  const handleComiteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setComiteFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement des séances...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Saisie des Décisions du Comité</h1>
        <p className={styles.subtitle}>Enregistrer les décisions prises lors des séances du comité</p>

        <div className={styles.controls}>
          <Link href="/seances/Dashboard_seances" className={styles.backButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Retour au menu
          </Link>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Rechercher par séance, procédure ou société..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={fetchSeances} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      )}

      {filteredSeances.length === 0 ? (
        <div className={styles.noResults}>
          {searchTerm ? 'Aucune séance ne correspond à votre recherche' : 'Aucune séance disponible'}
        </div>
      ) : (
        <>
          <div className={styles.seanceList}>
            {paginatedSeances.map((seance) => (
              <div key={seance.id_seance} className={styles.seanceCard}>
                <div
                  className={styles.seanceHeader}
                  onClick={() => toggleSeanceExpansion(seance.id_seance)}
                >
                  <div className={styles.seanceHeaderContent}>
                    <h2 className={styles.seanceTitle}>Séance {seance.num_seance}</h2>
                    <div className={styles.seanceDate}>
                      {format(new Date(seance.date_seance), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </div>
                    <div className={styles.seanceStats}>
                      {seance.comites.filter(comite => 
                        comite.decisionCDs?.[0]?.decision_cd
                      ).length} / {seance.procedures.length} décisions
                    </div>
                  </div>
                  <div className={styles.expandIcon}>{expandedSeances[seance.id_seance] ? '−' : '+'}</div>
                </div>

                {expandedSeances[seance.id_seance] && (
                  <div className={styles.seanceContent}>
                    <div className={styles.tableContainer}>
                      {seance.procedures.length === 0 ? (
                        <div className={styles.noResults}>Aucune procédure associée</div>
                      ) : (
                        <table className={styles.decisionTable}>
                          <thead>
                            <tr>
                              <th>Procédure</th>
                              <th>Société</th>
                              <th>Type</th>
                              <th>Décision</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
  {seance.procedures.map((procedure) => {
    const decision = seance.comites
      .flatMap(comite => comite.decisionCDs) // all decisions
      .find(dec => dec.numero_decision?.endsWith(`-${procedure.id_proc}`));

    return (
      <tr key={`${seance.id_seance}-${procedure.id_proc}`}>
        <td>{procedure.num_proc}</td>
        <td>{getSocieteName(procedure)}</td>
        <td>{getProcedureType(procedure)}</td>
        <td>
          {decision?.decision_cd ? (
            <span
              className={`${styles.decisionBadge} ${
                decision.decision_cd === 'favorable'
                  ? styles.approved
                  : styles.rejected
              }`}
            >
              {decision.decision_cd === 'favorable' ? 'Approuvée' : 'Rejetée'}
            </span>
          ) : (
            <span className={styles.pendingBadge}>En attente</span>
          )}
        </td>
        <td>
          <button
            onClick={() => openDecisionModal(seance, procedure)}
            className={decision ? styles.editButton : styles.primaryButton}
          >
            {decision ? 'Modifier' : 'Saisir'}
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

                        </table>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              <div className={styles.pageInfo}>
                Page {currentPage} sur {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}

      {/* Decision Modal */}
      {decisionModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>
                {currentDecision ? 'Modifier la décision' : 'Saisir une décision'}
                <br />
                <small>{currentProcedure?.num_proc}</small>
              </h2>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className={styles.closeButton}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitDecision} className={styles.modalForm}>
              <div className={styles.sectionTitle}>Informations du Comité</div>
              <div className={styles.formGroup}>
                <label htmlFor="date_comite">Date du comité *</label>
                <input
                  type="datetime-local"
                  id="date_comite"
                  name="date_comite"
                  value={comiteFormData.date_comite}
                  onChange={handleComiteFormChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numero_decision">Numéro de décision *</label>
                <input
                  type="text"
                  id="numero_decision"
                  name="numero_decision"
                  value={comiteFormData.numero_decision}
                  onChange={handleComiteFormChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="objet_deliberation">Objet de délibération *</label>
                <input
                  type="text"
                  id="objet_deliberation"
                  name="objet_deliberation"
                  value={comiteFormData.objet_deliberation}
                  onChange={handleComiteFormChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="resume_reunion">Résumé de la réunion</label>
                <textarea
                  id="resume_reunion"
                  name="resume_reunion"
                  rows={3}
                  value={comiteFormData.resume_reunion}
                  onChange={handleComiteFormChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className={styles.sectionTitle}>Décision</div>
              <div className={styles.formGroup}>
                <label>Société</label>
                <div className={styles.staticField}>
                  {currentProcedure ? getSocieteName(currentProcedure) : 'N/A'}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Type de procédure</label>
                <div className={styles.staticField}>
                  {currentProcedure ? getProcedureType(currentProcedure) : 'N/A'} {/* 🔑 Updated to use new function */}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="decision_cd">Décision *</label>
                <select
                  id="decision_cd"
                  value={formData.decision_cd}
                  onChange={(e) => setFormData({ ...formData, decision_cd: e.target.value })}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner</option>
                  <option value="favorable">Favorable</option>
                  <option value="defavorable">Défavorable</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="duree_decision">Durée (années)</label>
                <input
                  type="number"
                  id="duree_decision"
                  min="1"
                  value={formData.duree_decision}
                  onChange={(e) => setFormData({ ...formData, duree_decision: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="commentaires">Commentaires</label>
                <textarea
                  id="commentaires"
                  rows={3}
                  value={formData.commentaires}
                  onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className={styles.secondaryButton}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                  {isSubmitting ? <span className={styles.spinner}></span> : currentDecision ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}