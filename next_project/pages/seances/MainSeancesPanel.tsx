'use client';

import { useState, useEffect, useMemo, useRef, Key } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  getSeances, 
  createSeance, 
  updateSeance, 
  deleteSeance,
  getMembers, 
  getProcedures, 
  getNextSeanceNumber,
Seance,  Member,
  Procedure,
} from '../../lib/api/seances_type'; // Fixed import path
import styles from './NewSeanceForm.module.css';
import Link from 'next/link';

// Remove the duplicate interfaces - they're already defined in the API file

export default function SeanceManager() {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSeance, setCurrentSeance] = useState<Seance | null>(null);
  const [loadingProcedures, setLoadingProcedures] = useState(false);

  const [formData, setFormData] = useState({
    date_seance: '',
    exercice: new Date().getFullYear(),
    selectedMembers: [] as number[],
    selectedProcedures: [] as number[],
    remarques: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const proceduresPerPage = 20;
  const procedureListRef = useRef<HTMLDivElement>(null);
  const [allProcedures, setAllProcedures] = useState<Procedure[]>([]);
  const [hasMoreProcedures, setHasMoreProcedures] = useState(true);

  const fetchMoreProcedures = async () => {
    if (loadingProcedures || !hasMoreProcedures) return;
    
    setLoadingProcedures(true);
    try {
      const nextPage = Math.ceil(allProcedures.length / 100) + 1;
      const newProcedures = await getProcedures(searchTerm, nextPage);
      
      if (newProcedures.length === 0) {
        setHasMoreProcedures(false);
      } else {
        setAllProcedures(prev => [...prev, ...newProcedures]);
        setProcedures(prev => [...prev, ...newProcedures]);
      }
    } catch (error) {
      console.error('Error fetching more procedures:', error);
    } finally {
      setLoadingProcedures(false);
    }
  };

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const newProcedures = await getProcedures(searchTerm, 1);
        setProcedures(newProcedures);
        setAllProcedures(newProcedures);
        setCurrentPage(1);
        setHasMoreProcedures(true);
      } catch (error) {
        console.error('Error searching procedures:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm !== '' || selectedType !== 'all') {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedType]);

  // Filter procedures based on search term and type
  const filteredProcedures = useMemo(() => {
    return allProcedures.filter(proc => {
      const matchesSearch = proc.num_proc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          proc.detenteur?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || proc.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [allProcedures, searchTerm, selectedType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProcedures.length / proceduresPerPage);
  const paginatedProcedures = useMemo(() => {
    const startIndex = (currentPage - 1) * proceduresPerPage;
    return filteredProcedures.slice(startIndex, startIndex + proceduresPerPage);
  }, [filteredProcedures, currentPage]);

  // Get unique procedure types for filter dropdown
  const procedureTypes = useMemo(() => {
    const types = new Set(procedures.map(p => p.type).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [procedures]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  // Scroll to top of list when page changes
  useEffect(() => {
    if (procedureListRef.current) {
      procedureListRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seancesData, membersData] = await Promise.all([
          getSeances(),
          getMembers()
        ]);
        setSeances(seancesData);
        setMembers(membersData);
        
        // Load initial procedures with pagination
        const initialProcedures = await getProcedures('', 1);
        setProcedures(initialProcedures);
        setAllProcedures(initialProcedures);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openCreateModal = async () => {
    const nextNumber = await getNextSeanceNumber();
    setCurrentSeance({
      id_seance: 0,
      detenteur: '',
      num_seance: nextNumber,
      date_seance: new Date(),
      exercice: new Date().getFullYear(),
      statut: 'programmee',
      membres: [],
      procedures: []
    });
    setFormData({
      date_seance: '',
      exercice: new Date().getFullYear(),
      selectedMembers: [],
      selectedProcedures: [],
      remarques: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (seance: Seance) => {
    setCurrentSeance(seance);
    setFormData({
      date_seance: format(seance.date_seance, "yyyy-MM-dd'T'HH:mm"),
      exercice: seance.exercice,
      selectedMembers: seance.membres.map((m: { id_membre: any; }) => m.id_membre),
      selectedProcedures: seance.procedures.map((p: { id_proc: any; }) => p.id_proc),
      remarques: seance.remarques || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const seanceData = {
        num_seance: currentSeance?.num_seance || '',
        date_seance: new Date(formData.date_seance),
        exercice: formData.exercice,
        membresIds: formData.selectedMembers,
        proceduresIds: formData.selectedProcedures,
        statut: currentSeance?.statut || 'programmee',
        remarques: formData.remarques
      };

      if (currentSeance?.id_seance) {
        const updated = await updateSeance(currentSeance.id_seance, seanceData);
        setSeances(seances.map(s => s.id_seance === updated.id_seance ? updated : s));
      } else {
        const created = await createSeance(seanceData);
        setSeances([created, ...seances]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving seance:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette séance?')) {
      try {
        await deleteSeance(id);
        setSeances(seances.filter(s => s.id_seance !== id));
      } catch (error) {
        console.error('Error deleting seance:', error);
      }
    }
  };

  const toggleMember = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(id)
        ? prev.selectedMembers.filter(memberId => memberId !== id)
        : [...prev.selectedMembers, id]
    }));
  };

  const toggleProcedure = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedProcedures: prev.selectedProcedures.includes(id)
        ? prev.selectedProcedures.filter(procId => procId !== id)
        : [...prev.selectedProcedures, id]
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Programmation des Séances de Comité</h1>
          <p className={styles.subtitle}>Créer et gérer les séances du comité de direction</p>
          <Link href="/seances/Dashboard_seances" className={styles.backButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Retour au menu
          </Link>
        </div>
        
        <button onClick={openCreateModal} className={styles.primaryButton}>
          <span>+</span> Nouvelle Séance
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.statsCard}>
          <h3>Séances Programmées</h3>
          <p className={styles.statValue}>{seances.length}</p>
        </div>

        {seances.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <CalendarIcon />
            </div>
            <h3>Aucune séance programmée</h3>
            <p>Cliquez sur "Nouvelle Séance" pour commencer</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Séance</th>
                  <th>Date & Heure</th>
                  <th>Participants</th>
                  <th>Procédures</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seances.map(seance => (
                  <tr key={seance.id_seance}>
                    <td>
                      <div className={styles.seanceNumber}>
                        {seance.num_seance}
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateTime}>
                        <span>{format(new Date(seance.date_seance), "dd MMM yyyy", { locale: fr })}</span>
                        <span>{format(new Date(seance.date_seance), "HH:mm", { locale: fr })}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.avatarGroup}>
                        {seance.membres.slice(0, 3).map((member: { id_membre: Key | null | undefined; prenom_membre: string; nom_membre: string; }) => (
                          <div key={member.id_membre} className={styles.avatar}>
                            {member.prenom_membre.charAt(0)}{member.nom_membre.charAt(0)}
                          </div>
                        ))}
                        {seance.membres.length > 3 && (
                          <div className={styles.avatarMore}>+{seance.membres.length - 3}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.procedures}>
                        {seance.procedures.length} procédure(s)
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${seance.statut === 'programmee' ? styles.statusActive : styles.statusCompleted}`}>
                        {seance.statut === 'programmee' ? 'Programmée' : 'Terminée'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button onClick={() => openEditModal(seance)} className={styles.editButton}>
                          <EditIcon />
                        </button>
                        <button onClick={() => handleDelete(seance.id_seance)} className={styles.deleteButton}>
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{currentSeance?.id_seance ? 'Modifier la Séance' : 'Nouvelle Séance'}</h2>
              <button onClick={() => setModalOpen(false)} className={styles.closeButton}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Numéro de séance</label>
                  <div className={styles.staticField}>{currentSeance?.num_seance}</div>
                </div>

                <div className={styles.formGroup}>
                  <label>Statut</label>
                  <div className={styles.staticField}>
                    {currentSeance?.statut === 'programmee' ? 'Programmée' : 'Terminée'}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="exercice">Exercice *</label>
                  <input
                    id="exercice"
                    type="number"
                    value={formData.exercice}
                    onChange={(e) => setFormData({...formData, exercice: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="date">Date et heure *</label>
                  <input
                    id="date"
                    type="datetime-local"
                    value={formData.date_seance}
                    onChange={(e) => setFormData({...formData, date_seance: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className={styles.section}>
                <h3>Membres du Comité *</h3>
                <div className={styles.memberGrid}>
                  {members.map(member => (
                    <div
                      key={member.id_membre}
                      onClick={() => toggleMember(member.id_membre)}
                      className={`${styles.memberCard} ${
                        formData.selectedMembers.includes(member.id_membre) ? styles.selected : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedMembers.includes(member.id_membre)}
                        onChange={() => {}}
                        className={styles.checkbox}
                      />
                      <div>
                        <div className={styles.memberName}>
                          {member.prenom_membre} {member.nom_membre}
                        </div>
                        <div className={styles.memberRole}>{member.fonction_membre}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
              <h3>Procédures à Examiner *</h3>
              
              {/* Search and Filter Controls */}
              <div className={styles.procedureControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Rechercher par numéro ou détenteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  <svg className={styles.searchIcon} viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                
                <div className={styles.typeFilter}>
                  <label htmlFor="procedureType">Filtrer par type:</label>
                  <select
                    id="procedureType"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={styles.typeSelect}
                  >
                    {procedureTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'Tous les types' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Procedures Counter */}
              <div className={styles.selectedInfo}>
                <span className={styles.selectedCount}>
                  {formData.selectedProcedures.length} sélectionné(s)
                </span>
                <span className={styles.totalCount}>
                  {filteredProcedures.length} procédure(s) trouvée(s)
                </span>
              </div>

              {/* Procedure List with CSS Scroll */}
              <div className={styles.procedureListContainer} ref={procedureListRef}
              onScroll={() => {
                if (procedureListRef.current && 
                    procedureListRef.current.scrollTop + procedureListRef.current.clientHeight >= 
                    procedureListRef.current.scrollHeight - 100) {
                  fetchMoreProcedures();
                }
              }}>
                {paginatedProcedures.length > 0 ? (
                  <div className={styles.procedureList}>
                    {paginatedProcedures.map(procedure => (
                      <div
                        key={procedure.id_proc}
                        onClick={() => toggleProcedure(procedure.id_proc)}
                        className={`${styles.procedureCard} ${
                          formData.selectedProcedures.includes(procedure.id_proc) ? styles.selected : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedProcedures.includes(procedure.id_proc)}
                          onChange={() => {}}
                          className={styles.checkbox}
                        />
                        <div className={styles.procedureInfo}>
                          <div className={styles.procedureNumber}>{procedure.num_proc}</div>
                          <div className={styles.procedureDetails}>
                            <span className={styles.procedureDetenteur}>
                              {procedure.detenteur || 'N/A'}
                            </span>
                            <span className={`${styles.procedureType} ${
                              procedure.type ? styles.typeActive : styles.typeInactive
                            }`}>
                              {procedure.type || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                     {loadingProcedures && <div className={styles.loadingMore}>Chargement...</div>}
                  </div>
                 
                ) : (
                  <div className={styles.noResults}>
                    Aucune procédure trouvée
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    &larr; Précédent
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`${styles.pageButton} ${
                            currentPage === pageNum ? styles.active : ''
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Suivant &rarr;
                  </button>
                </div>
              )}
            </div>

              <div className={styles.formGroup}>
                <label htmlFor="remarques">Remarques</label>
                <textarea
                  id="remarques"
                  value={formData.remarques}
                  onChange={(e) => setFormData({...formData, remarques: e.target.value})}
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={styles.secondaryButton}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!formData.date_seance || formData.selectedMembers.length === 0 || formData.selectedProcedures.length === 0}
                  className={styles.primaryButton}
                >
                  {currentSeance?.id_seance ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple icon components
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8 2v4m8-4v4m-11 3h14M5 10h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
  );
}