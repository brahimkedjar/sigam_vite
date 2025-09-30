'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiUser, FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiX, FiFilter, FiRefreshCw, FiDownload, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './experts.module.css';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import Sidebar from '@/pages/sidebar/Sidebar';
import Navbar from '@/pages/navbar/Navbar';

type ExpertMinier = {
  id_expert: number;
  nom_expert: string;
  num_agrement: string;
  date_agrement: string;
  etat_agrement: string;
  adresse: string | null;
  email: string | null;
  tel_expert: string | null;
  fax_expert: string | null;
  specialisation: string | null;
};

type SortConfig = {
  key: keyof ExpertMinier;
  direction: 'ascending' | 'descending';
};

type FilterConfig = {
  key: keyof ExpertMinier;
  value: string;
};

type PaginationConfig = {
  currentPage: number;
  itemsPerPage: number;
};

export default function ExpertsAdminPage() {
  const [experts, setExperts] = useState<ExpertMinier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { currentView, navigateTo } = useViewNavigator('gestion_experts');
  const [currentExpert, setCurrentExpert] = useState<ExpertMinier | null>(null);
  const [formData, setFormData] = useState({
    nom_expert: '',
    num_agrement: '',
    date_agrement: '',
    etat_agrement: '',
    adresse: '',
    email: '',
    tel_expert: '',
    fax_expert: '',
    specialisation: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'nom_expert',
    direction: 'ascending'
  });
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    currentPage: 1,
    itemsPerPage: 10
  });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/experts`);
      setExperts(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des experts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.nom_expert.trim()) {
      errors.nom_expert = 'Le nom est requis';
    }
    
    if (!formData.num_agrement.trim()) {
      errors.num_agrement = 'Le numero d\'agrement est requis';
    }
    
    if (!formData.date_agrement.trim()) {
      errors.date_agrement = 'La date d\'agrement est requise';
    }
    
    if (!formData.etat_agrement.trim()) {
      errors.etat_agrement = 'L\'etat d\'agrement est requis';
    }
    
    if (!formData.specialisation.trim()) {
      errors.specialisation = 'La specialisation est requise';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const formattedData = {
        ...formData,
        adresse: formData.adresse || null,
        email: formData.email || null,
        tel_expert: formData.tel_expert || null,
        fax_expert: formData.fax_expert || null,
        specialisation: formData.specialisation || null
      };

      if (currentExpert) {
        await axios.put(`${apiUrl}/api/experts/${currentExpert.id_expert}`, formattedData);
        toast.success('Expert mis à jour avec succès');
      } else {
        await axios.post(`${apiUrl}/api/experts`, formattedData);
        toast.success('Expert cree avec succès');
      }
      fetchExperts();
      closeModal();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleEditClick = (expert: ExpertMinier) => (e: React.MouseEvent) => {
    e.preventDefault();
    openEditModal(expert);
  };
  
  const openCreateModal = () => {
    setCurrentExpert(null);
    setFormData({
      nom_expert: '',
      num_agrement: '',
      date_agrement: '',
      etat_agrement: '',
      adresse: '',
      email: '',
      tel_expert: '',
      fax_expert: '',
      specialisation: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (expert: ExpertMinier) => {
    setCurrentExpert(expert);
    setFormData({
      nom_expert: expert?.nom_expert,
      num_agrement: expert?.num_agrement,
      date_agrement: expert?.date_agrement?.split('T')[0],
      etat_agrement: expert?.etat_agrement,
      adresse: expert.adresse || '',
      email: expert.email || '',
      tel_expert: expert.tel_expert || '',
      fax_expert: expert.fax_expert || '',
      specialisation: expert.specialisation || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    deleteExpert(id);
  };

  const deleteExpert = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet expert ?')) {
      try {
        await axios.delete(`${apiUrl}/api/experts/${id}`);
        toast.success('Expert supprime avec succès');
        fetchExperts();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error(error);
      }
    }
  };

  const handleSort = (key: keyof ExpertMinier) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (key: keyof ExpertMinier, value: string) => {
    const newFilters = filters.filter(filter => filter.key !== key);
    if (value) {
      newFilters.push({ key, value });
    }
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/experts/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `experts_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export reussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
      console.error(error);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!importFile) {
      toast.error('Veuillez selectionner un fichier');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', importFile);
    
    try {
      setIsSubmitting(true);
      await axios.post(`${apiUrl}/api/experts/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Import reussi');
      setIsImportOpen(false);
      setImportFile(null);
      fetchExperts();
    } catch (error) {
      toast.error('Erreur lors de l\'import');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = 
      expert.nom_expert?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.num_agrement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.etat_agrement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.specialisation && expert.specialisation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAllFilters = filters.every(filter => {
      const expertValue = String(expert[filter.key] || '').toLowerCase();
      return expertValue.includes(filter.value.toLowerCase());
    });
    
    return matchesSearch && matchesAllFilters;
  });

  const sortedExperts = [...filteredExperts].sort((a, b) => {
    if (a[sortConfig.key] === null) return 1;
    if (b[sortConfig.key] === null) return -1;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue! < bValue!) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue! > bValue!) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedExperts.length / pagination.itemsPerPage);
  const paginatedExperts = sortedExperts.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                <FiUser className={styles.titleIcon} />
                Gestion des Experts Miniers
              </h1>
              <div className={styles.headerActions}>
                <button onClick={handleExport} className={styles.exportButton}>
                  <FiDownload /> Exporter
                </button>
                <button onClick={() => setIsImportOpen(true)} className={styles.importButton}>
                  <FiUpload /> Importer
                </button>
                <button onClick={openCreateModal} className={styles.addButton}>
                  <FiPlus /> Ajouter un expert
                </button>
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.searchBar}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Rechercher un expert..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.controlButtons}>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className={`${styles.filterButton} ${isFilterOpen ? styles.active : ''}`}
                >
                  <FiFilter /> Filtres {filters.length > 0 && `(${filters.length})`}
                </button>
                <button onClick={fetchExperts} className={styles.refreshButton}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>

            {isFilterOpen && (
              <div className={styles.filterPanel}>
                <div className={styles.filterGroup}>
                  <label>Nom</label>
                  <input
                    type="text"
                    placeholder="Filtrer par nom..."
                    onChange={(e) => handleFilter('nom_expert', e.target.value)}
                    className={styles.filterInput}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>Numero d'agrement</label>
                  <input
                    type="text"
                    placeholder="Filtrer par numero d'agrement..."
                    onChange={(e) => handleFilter('num_agrement', e.target.value)}
                    className={styles.filterInput}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>etat d'agrement</label>
                  <input
                    type="text"
                    placeholder="Filtrer par etat d'agrement..."
                    onChange={(e) => handleFilter('etat_agrement', e.target.value)}
                    className={styles.filterInput}
                  />
                </div>
                {filters.length > 0 && (
                  <button onClick={clearFilters} className={styles.clearFiltersButton}>
                    Effacer tous les filtres
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement des experts...</p>
              </div>
            ) : (
              <>
                <div className={styles.tableContainer}>
                  <div className={styles.expertTable}>
                    <div className={styles.tableHeader}>
                      <div 
                        className={`${styles.headerCell} ${sortConfig.key === 'nom_expert' ? styles.sorted : ''}`}
                        onClick={() => handleSort('nom_expert')}
                      >
                        Nom complet
                        {sortConfig.key === 'nom_expert' && (
                          <FiChevronDown className={`${styles.sortIcon} ${sortConfig.direction === 'descending' ? styles.descending : ''}`} />
                        )}
                      </div>
                      <div 
                        className={`${styles.headerCell} ${sortConfig.key === 'num_agrement' ? styles.sorted : ''}`}
                        onClick={() => handleSort('num_agrement')}
                      >
                        Numero agrement
                        {sortConfig.key === 'num_agrement' && (
                          <FiChevronDown className={`${styles.sortIcon} ${sortConfig.direction === 'descending' ? styles.descending : ''}`} />
                        )}
                      </div>
                      <div 
                        className={`${styles.headerCell} ${sortConfig.key === 'date_agrement' ? styles.sorted : ''}`}
                        onClick={() => handleSort('date_agrement')}
                      >
                        Date agrement
                        {sortConfig.key === 'date_agrement' && (
                          <FiChevronDown className={`${styles.sortIcon} ${sortConfig.direction === 'descending' ? styles.descending : ''}`} />
                        )}
                      </div>
                      <div 
                        className={`${styles.headerCell} ${sortConfig.key === 'etat_agrement' ? styles.sorted : ''}`}
                        onClick={() => handleSort('etat_agrement')}
                      >
                        etat agrement
                        {sortConfig.key === 'etat_agrement' && (
                          <FiChevronDown className={`${styles.sortIcon} ${sortConfig.direction === 'descending' ? styles.descending : ''}`} />
                        )}
                      </div>
                      <div 
                        className={`${styles.headerCell} ${sortConfig.key === 'specialisation' ? styles.sorted : ''}`}
                        onClick={() => handleSort('specialisation')}
                      >
                        Specialisation
                        {sortConfig.key === 'specialisation' && (
                          <FiChevronDown className={`${styles.sortIcon} ${sortConfig.direction === 'descending' ? styles.descending : ''}`} />
                        )}
                      </div>
                      <div className={styles.headerCell}>Actions</div>
                    </div>

                    {paginatedExperts.map(expert => (
                      <div key={expert.id_expert} className={styles.tableRow}>
                        <div className={styles.tableCell}>{expert.nom_expert}</div>
                        <div className={styles.tableCell}>{expert.num_agrement}</div>
                        <div className={styles.tableCell}>
                          {new Date(expert.date_agrement).toLocaleDateString()}
                        </div>
                        <div className={styles.tableCell}>{expert.etat_agrement}</div>
                        <div className={styles.tableCell}>{expert.specialisation || '-'}</div>
                        <div className={styles.actionsCell}>
                          <button
                            onClick={handleEditClick(expert)}
                            className={styles.editButton}
                            title="Modifier"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={handleDeleteClick(expert.id_expert)}
                            className={styles.deleteButton}
                            title="Supprimer"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={styles.paginationButton}
                    >
                      Precedent
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`${styles.paginationButton} ${pagination.currentPage === page ? styles.active : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === totalPages}
                      className={styles.paginationButton}
                    >
                      Suivant
                    </button>
                    
                    <div className={styles.paginationInfo}>
                      {sortedExperts.length} expert(s) - Page {pagination.currentPage} sur {totalPages}
                    </div>
                    
                    <select
                      value={pagination.itemsPerPage}
                      onChange={(e) => setPagination({ currentPage: 1, itemsPerPage: Number(e.target.value) })}
                      className={styles.pageSizeSelect}
                    >
                      <option value="5">5 par page</option>
                      <option value="10">10 par page</option>
                      <option value="20">20 par page</option>
                      <option value="50">50 par page</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {isModalOpen && (
              <div className={styles.modalOverlay} onClick={closeModal}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h2>{currentExpert ? `Modifier expert ${currentExpert.nom_expert}` : 'Ajouter un expert'}</h2>
                    <button onClick={closeModal} className={styles.closeButton}>
                      <FiX />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                      <label>Nom complet *</label>
                      <input
                        type="text"
                        name="nom_expert"
                        value={formData.nom_expert}
                        onChange={handleInputChange}
                        className={formErrors.nom_expert ? styles.errorInput : ''}
                      />
                      {formErrors.nom_expert && <span className={styles.errorText}>{formErrors.nom_expert}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Numero d'agrement *</label>
                      <input
                        type="text"
                        name="num_agrement"
                        value={formData.num_agrement}
                        onChange={handleInputChange}
                        className={formErrors.num_agrement ? styles.errorInput : ''}
                      />
                      {formErrors.num_agrement && <span className={styles.errorText}>{formErrors.num_agrement}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Date d'agrement *</label>
                      <input
                        type="date"
                        name="date_agrement"
                        value={formData.date_agrement}
                        onChange={handleInputChange}
                        className={formErrors.date_agrement ? styles.errorInput : ''}
                      />
                      {formErrors.date_agrement && <span className={styles.errorText}>{formErrors.date_agrement}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>etat d'agrement *</label>
                      <select
                        name="etat_agrement"
                        value={formData.etat_agrement}
                        onChange={handleInputChange}
                        className={formErrors.etat_agrement ? styles.errorInput : ''}
                      >
                        <option value="">Selectionner un etat</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                        <option value="Suspendu">Suspendu</option>
                        <option value="Expire">Expire</option>
                      </select>
                      {formErrors.etat_agrement && <span className={styles.errorText}>{formErrors.etat_agrement}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Specialisation *</label>
                      <input
                        type="text"
                        name="specialisation"
                        value={formData.specialisation}
                        onChange={handleInputChange}
                        className={formErrors.specialisation ? styles.errorInput : ''}
                      />
                      {formErrors.specialisation && <span className={styles.errorText}>{formErrors.specialisation}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Adresse</label>
                      <textarea
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Telephone</label>
                      <input
                        type="tel"
                        name="tel_expert"
                        value={formData.tel_expert}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Fax</label>
                      <input
                        type="text"
                        name="fax_expert"
                        value={formData.fax_expert}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className={styles.modalActions}>
                      <button type="button" onClick={closeModal} className={styles.cancelButton}>
                        Annuler
                      </button>
                      <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Traitement...' : currentExpert ? 'Mettre à jour' : 'Creer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isImportOpen && (
              <div className={styles.modalOverlay} onClick={() => setIsImportOpen(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h2>Importer des experts</h2>
                    <button onClick={() => setIsImportOpen(false)} className={styles.closeButton}>
                      <FiX />
                    </button>
                  </div>
                  <form onSubmit={handleImport} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                      <label>Selectionner un fichier CSV</label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className={styles.fileInput}
                      />
                      <div className={styles.helpText}>
                        Le fichier CSV doit contenir les colonnes: nom_expert, num_agrement, date_agrement, etat_agrement, specialisation, adresse, email, tel_expert, fax_expert
                      </div>
                    </div>
                    <div className={styles.modalActions}>
                      <button type="button" onClick={() => setIsImportOpen(false)} className={styles.cancelButton}>
                        Annuler
                      </button>
                      <button type="submit" className={styles.saveButton} disabled={isSubmitting || !importFile}>
                        {isSubmitting ? 'Import en cours...' : 'Importer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}