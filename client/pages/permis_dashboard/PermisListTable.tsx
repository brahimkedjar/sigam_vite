// components/PermisListTable.tsx
'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  FiSearch, 
  FiDownload, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiEye,
  FiEdit,
  FiTrash2,
  FiAlertTriangle,
  FiChevronDown,
  FiRefreshCw,
  FiFilter,
  FiSliders,
  FiGrid,
  FiList,
  FiPlus,
  FiMap
} from 'react-icons/fi';
import { format, differenceInDays, isBefore, isAfter, addMonths, formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './PermisListTable.module.css';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAuthReady } from '@/src/hooks/useAuthReady';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';


type Demande = {
  id_demande: number;
  code_demande: string;
  date_demande: string;
  statut_juridique_terrain: string;
  procedure: {
    num_proc: string;
    statut_proc: string;
  };
  detenteur?: {
    nom_societeFR: string;
  };
};


type Permis = {
  id: number;
  code_permis: string;
  date_octroi: string;
  date_expiration: string;
  superficie?: number;
  typePermis: {
    code_type: string;
    lib_type: string;
  };
  detenteur?: {
    nom_societeFR: string;
  };
  statut?: {
    lib_statut: string;
  };
  commune?: {
    nom_communeFR: string;
    daira?: {
      wilaya?: {
        nom_wilayaFR: string;
        nom_wilayaAR: string;
      };
    };
  };
  procedures?: {
    SubstanceAssocieeDemande: {
      substance: {
        nom_subFR: string;
      };
    }[];
  }[];
};

interface PermisListTableProps {
  permisList: Permis[];
  loading: boolean;
  onRefresh: () => void;
}

export default function PermisListTable({ }: PermisListTableProps) {
  const router = useRouter();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const { auth } = useAuthStore();
  const isAuthReady = useAuthReady();
  const { currentView, navigateTo } = useViewNavigator('Permis');
  const [exporting, setExporting] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [expirationFilter, setExpirationFilter] = useState<string>('all');
  const [surfaceFilter, setSurfaceFilter] = useState<{min: number | null, max: number | null}>({min: null, max: null});
  const [substanceFilter, setSubstanceFilter] = useState<string>('all');
  const [substancesList, setSubstancesList] = useState<string[]>([]);
  const [selectedWilayas, setSelectedWilayas] = useState<string[]>([]);
  const [wilayaDropdownOpen, setWilayaDropdownOpen] = useState<boolean>(false);
  const [wilayaSearch, setWilayaSearch] = useState<string>('');
  const [wilayaList, setWilayaList] = useState<string[]>([]);
  const [totalPermisCount, setTotalPermisCount] = useState(0);
  const [isLoadingPermis, setIsLoadingPermis] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [permisTypes, setPermisTypes] = useState<string[]>([]);
  const [currentPermisPage, setCurrentPermisPage] = useState(1);
  const [permisPerPage, setPermisPerPage] = useState(50);
  const [permisList, setPermisList] = useState<Permis[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [loading, setLoading] = useState(true);
 const [isDataReady, setIsDataReady] = useState(false);
  const isFetching = useRef(false);

  // Fetch data directly in this component
const fetchPermisList = useCallback(async (page: number = 1) => {
    if (isFetching.current || !isAuthReady) {
      return;
    }

    if (!apiURL) {
      console.warn('NEXT_PUBLIC_API_URL is not configured; skipping permis fetch');
      return;
    }

    isFetching.current = true;
    setIsLoadingPermis(true);
    setIsDataReady(false);

    try {
      const response = await axios.get(`${apiURL}/Permisdashboard`, {
        params: {
          page: Number(page),
          limit: Number(permisPerPage)
        },
        withCredentials: true
      });

      const fetchedData = response.data?.data ?? response.data ?? [];
      const permisData: Permis[] = Array.isArray(fetchedData) ? (fetchedData as Permis[]) : [];

      console.log('Fetched permis data:', permisData);
      setPermisList(permisData);
      setTotalPermisCount(response.data?.totalCount ?? permisData.length);
      
      // Extract unique types for filter
      const types = [...new Set(permisData.map((p) => p.typePermis?.code_type).filter(Boolean))] as string[];
      setPermisTypes(types);
      setIsDataReady(true);
    } catch (error) {
      console.error('Error fetching permis list:', error);
      setIsDataReady(false);
    } finally {
      isFetching.current = false;
      setIsLoadingPermis(false);
    }
  }, [apiURL, isAuthReady, permisPerPage]);

  // Initial data fetch once auth and router are ready
  useEffect(() => {
    if (!isAuthReady || !router.isReady) {
      return;
    }
    fetchPermisList();
  }, [isAuthReady, router.isReady, router.asPath, fetchPermisList]);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (dateFilter.start || dateFilter.end) count++;
    if (expirationFilter !== 'all') count++;
    if (surfaceFilter.min !== null || surfaceFilter.max !== null) count++;
    if (substanceFilter !== 'all') count++;
    if (selectedWilayas.length > 0) count++;
    if (searchQuery) count++;
    
    setActiveFiltersCount(count);
  }, [statusFilter, typeFilter, dateFilter, expirationFilter, surfaceFilter, substanceFilter, selectedWilayas, searchQuery]);

  // Get substances for a permis
  const getSubstancesForPermis = useCallback((permis: Permis) => {
    if (!permis.procedures) return [];
    const substances = new Set<string>();
    
    permis.procedures.forEach(procedure => {
      procedure.SubstanceAssocieeDemande?.forEach(assoc => {
        substances.add(assoc.substance.nom_subFR);
      });
    });
    
    return Array.from(substances);
  }, []);

  const getWilayaName = useCallback((permis: Permis): string => {
    return permis.commune?.daira?.wilaya?.nom_wilayaFR || 'N/A';
  }, []);

  useEffect(() => {
    const substances = new Set<string>();
    permisList.forEach(permis => {
      getSubstancesForPermis(permis).forEach(sub => substances.add(sub));
    });
    setSubstancesList(Array.from(substances).sort());
  }, [permisList, getSubstancesForPermis]);

  const filteredPermis = useMemo(() => {
    return permisList.filter((permis) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        permis.code_permis.toLowerCase().includes(query) ||
        (permis.typePermis?.lib_type?.toLowerCase().includes(query) || false) ||
        (permis.detenteur?.nom_societeFR?.toLowerCase().includes(query) || false);
      
      const now = new Date();
      const isExpired = !!permis.date_expiration && new Date(permis.date_expiration) < now;
      const isActive = permis.statut?.lib_statut === 'En vigueur';
      
      let matchesStatus: boolean = true;
      if (statusFilter === 'active') matchesStatus = !!isActive;
      else if (statusFilter === 'expired') matchesStatus = !!isExpired;
      else if (statusFilter === 'pending') matchesStatus = permis.statut?.lib_statut === 'En attente';
      else if (statusFilter === 'suspended') matchesStatus = permis.statut?.lib_statut === 'Suspendu';
      
      let matchesType: boolean = true;
      if (typeFilter !== 'all') {
        matchesType = permis.typePermis?.code_type === typeFilter;
      }
      
      let matchesDate: boolean = true;
      if (dateFilter.start && permis.date_octroi) {
        const octroiDate = new Date(permis.date_octroi);
        matchesDate = isAfter(octroiDate, dateFilter.start) || isEqualDate(octroiDate, dateFilter.start);
      }
      if (dateFilter.end && permis.date_octroi) {
        const octroiDate = new Date(permis.date_octroi);
        matchesDate = matchesDate && (isBefore(octroiDate, dateFilter.end) || isEqualDate(octroiDate, dateFilter.end));
      }
      
      let matchesExpiration = true;
      if (expirationFilter !== 'all') {
        const now = new Date();
        const expDate = permis.date_expiration ? new Date(permis.date_expiration) : null;
        const sixMonthsLater = addMonths(now, 6);
        
        if (expirationFilter === 'expiring_soon') {
          matchesExpiration = expDate ? (expDate > now && expDate <= sixMonthsLater) : false;
        } else if (expirationFilter === 'expired') {
          matchesExpiration = expDate ? expDate < now : false;
        } else if (expirationFilter === 'valid') {
          matchesExpiration = expDate ? expDate > now : false;
        }
      }
      
      let matchesSurface = true;
      if (surfaceFilter.min !== null && permis.superficie) {
        matchesSurface = permis.superficie >= surfaceFilter.min;
      }
      if (surfaceFilter.max !== null && permis.superficie) {
        matchesSurface = matchesSurface && permis.superficie <= surfaceFilter.max;
      }
      
      let matchesSubstance = true;
      if (substanceFilter !== 'all') {
        const substances = getSubstancesForPermis(permis);
        matchesSubstance = substances.includes(substanceFilter);
      }
      
      let matchesWilaya = true;
      if (selectedWilayas.length > 0) {
        const wilayaName = getWilayaName(permis);
        matchesWilaya = selectedWilayas.includes(wilayaName);
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate && 
             matchesExpiration && matchesSurface && matchesSubstance && matchesWilaya;
    });
  }, [permisList, searchQuery, statusFilter, typeFilter, dateFilter, 
      expirationFilter, surfaceFilter, substanceFilter, selectedWilayas, getWilayaName, getSubstancesForPermis]);

  const handleEditPermis = useCallback((permisId: number) => {
    router.push(`/permis_dashboard/edit/${permisId}`);
  }, [router]);
type ExportFormat = 'csv' | 'excel';


  const handleDeletePermis = useCallback(async (permisId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce permis?')) return;
    
    try {
      await axios.delete(`${apiURL}/Permisdashboard/${permisId}`);
      setPermisList(prev => prev.filter(p => p.id !== permisId));
      alert('Permis supprimé avec succès');
    } catch (error) {
      console.error('Error deleting permis:', error);
      alert('Erreur lors de la suppression du permis');
    }
  }, [apiURL]);

  // Export data to CSV
  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Handle nested objects
        const value = header.includes('.') 
          ? header.split('.').reduce((obj, key) => obj && obj[key], item)
          : item[header];
        
        // Format the value for CSV (escape quotes and wrap in quotes if needed)
        const formattedValue = String(value || '').replace(/"/g, '""');
        return `"${formattedValue}"`;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Export data to Excel (using CSV as fallback)
  const exportToExcel = useCallback((data: any[], filename: string) => {
    // For frontend-only solution, we'll use CSV as Excel can open CSV files
    // In a real implementation, you might use a library like xlsx
    exportToCSV(data, filename);
  }, [exportToCSV]);
  const [permisData, setPermisData] = useState<Permis[]>([]);
  const [activePermisData, setActivePermisData] = useState<Permis[]>([]);
  const [expiredPermisData, setExpiredPermisData] = useState<Permis[]>([]);
  const [demandesData, setDemandesData] = useState<Demande[]>([]);
  const [expiringSoonPermis, setExpiringSoonPermis] = useState<Permis[]>([]);
  const [currentDataType, setCurrentDataType] = useState<'total' | 'En vigueur' | 'enCours' | 'expires' | 'expiringSoon'>('total');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);


 const handleExportData = useCallback(async (format: ExportFormat, dataType: 'permis' | 'demandes' = 'permis') => {
    if (!isDataReady) {
      alert('Les données ne sont pas encore disponibles. Veuillez patienter.');
      return;
    }
    
    try {
      setExporting(true);
        
        // Determine which data to export based on current context
        let dataToExport: any[] = [];
        let filename = '';
        
        if (modalOpen) {
          // Export modal data
          switch (currentDataType) {
            case 'total':
              dataToExport = permisData;
              filename = 'tous_les_permis';
              break;
            case 'En vigueur':
              dataToExport = activePermisData;
              filename = 'permis_En_vigueur';
              break;
            case 'expires':
              dataToExport = expiredPermisData;
              filename = 'permis_expires';
              break;
            case 'expiringSoon':
              dataToExport = expiringSoonPermis;
              filename = 'permis_expirant_bientot';
              break;
            case 'enCours':
              dataToExport = demandesData;
              filename = 'demandes_en_cours';
              dataType = 'demandes';
              break;
          }
        } else {
          // Export main table data
          dataToExport = filteredPermis;
          filename = 'liste_des_permis';
        }
        
        // Flatten the data for export
        const flattenedData = dataToExport.map(item => {
          if (dataType === 'permis') {
            const permis = item as Permis;
            return {
              'Code Permis': permis.code_permis,
              'Type': permis.typePermis?.lib_type || 'N/A',
              'Titulaire': permis.detenteur?.nom_societeFR || 'N/A',
              'Statut': permis.statut?.lib_statut || 'N/A',
  'Date Octroi': permis.date_octroi
    ? formatDate(new Date(permis.date_octroi), 'dd/MM/yyyy', { locale: fr })
    : 'N/A',
  
  'Date Expiration': permis.date_expiration
    ? formatDate(new Date(permis.date_expiration), 'dd/MM/yyyy', { locale: fr })
    : 'N/A',
  
              'Surface (HA)': permis.superficie?.toFixed(2) || 'N/A',
              'Substances': getSubstancesForPermis(permis).join(', ')
            };
          } else {
            const demande = item as Demande;
            return {
              'Code Demande': demande.code_demande,
              'Titulaire': demande.detenteur?.nom_societeFR || 'N/A',
              'Date Demande': formatDate(new Date(demande.date_demande), 'dd/MM/yyyy', { locale: fr }),
              'Statut Terrain': demande.statut_juridique_terrain || 'N/A',
              'Statut Procédure': demande.procedure.statut_proc
            };
          }
        });
        
        // Export based on format
        if (format === 'csv') {
          exportToCSV(flattenedData, filename);
        } else if (format === 'excel') {
          exportToExcel(flattenedData, filename);
        }
        
      } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'exportation des données');
    } finally {
      setExporting(false);
    }
  }, [isDataReady,
      modalOpen, currentDataType, permisData, activePermisData, 
      expiredPermisData, expiringSoonPermis, demandesData, 
      filteredPermis, exportToCSV, exportToExcel, getSubstancesForPermis
    ]);

  const handleViewPermis = useCallback((permisId: number) => {
    router.push(`/permis_dashboard/view/permisdetails?id=${permisId}`);
  }, [router]);
  
  const handleWilayaFilterChange = useCallback((wilaya: string, isChecked: boolean) => {
    setSelectedWilayas(prev => 
      isChecked 
        ? [...prev, wilaya] 
        : prev.filter(w => w !== wilaya)
    );
  }, []);
  
  useEffect(() => {
    const wilayas = new Set<string>();
    permisList.forEach(permis => {
      const wilayaName = permis.commune?.daira?.wilaya?.nom_wilayaFR;
      if (wilayaName) {
        wilayas.add(wilayaName);
      }
    });
    setWilayaList(Array.from(wilayas).sort());
  }, [permisList]);
  
  const filteredWilayas = useMemo(() => {
    return wilayaList.filter(wilaya => 
      wilaya.toLowerCase().includes(wilayaSearch.toLowerCase())
    );
  }, [wilayaList, wilayaSearch]);

  const isEqualDate = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  // Render grid view item
  const renderPermisCard = (permis: Permis) => {
    const expDate = permis.date_expiration ? new Date(permis.date_expiration) : null;
    const daysUntilExpiry = expDate ? differenceInDays(expDate, new Date()) : null;
    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 180;
    const isExpired = expDate && expDate < new Date();
    const wilayaName = permis.commune?.daira?.wilaya?.nom_wilayaFR || 'N/A';
    const communeName = permis.commune?.nom_communeFR || 'N/A';
    const substances = getSubstancesForPermis(permis);
if (!isDataReady && isLoadingPermis) {
    return (
      <div className={styles.appContainer}>
        <Navbar />
        <div className={styles.appContent}>
          <Sidebar currentView={currentView} navigateTo={navigateTo} />
          <main className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <FiRefreshCw className={styles.spinner} size={32} />
              <h3>Chargement des données...</h3>
              <p>Veuillez patienter pendant que nous récupérons les permis.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
    return (
      <div key={permis.id} className={styles.permisCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardCode}>{permis.code_permis}</div>
          <div className={`${styles.statusBadge} ${
            permis.statut?.lib_statut === 'En vigueur' ? styles.statusActive : 
            isExpired ? styles.statusExpired : styles.statusOther
          }`}>
            {permis.statut?.lib_statut || 'N/A'}
            {isExpiringSoon && <FiAlertTriangle className={styles.warningIcon} />}
          </div>
        </div>
        
        <div className={styles.cardBody}>
          <div className={styles.cardField}>
            <label>Type:</label>
            <span>{permis.typePermis?.lib_type || 'N/A'}</span>
          </div>
          
          <div className={styles.cardField}>
            <label>Titulaire:</label>
            <span className={styles.truncateText}>{permis.detenteur?.nom_societeFR || 'N/A'}</span>
          </div>
          
          <div className={styles.cardField}>
            <label>Localisation:</label>
            <span>{wilayaName}, {communeName}</span>
          </div>
          
          <div className={styles.cardDates}>
            <div className={styles.dateItem}>
              <label>Octroi:</label>
              <span>{permis.date_octroi ? format(new Date(permis.date_octroi), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</span>
            </div>
            <div className={styles.dateItem}>
              <label>Expiration:</label>
              <span className={isExpiringSoon ? styles.expiringDate : ''}>
                {expDate ? format(expDate, 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                {isExpiringSoon && ` (${daysUntilExpiry}j)`}
              </span>
            </div>
          </div>
          
          <div className={styles.cardField}>
            <label>Surface:</label>
            <span>{permis.superficie?.toFixed(2) || 'N/A'} HA</span>
          </div>
          
          {substances.length > 0 && (
            <div className={styles.substancesContainer}>
              <label>Substances:</label>
              <div className={styles.substanceBadges}>
                {substances.slice(0, 3).map((substance, index) => (
                  <span key={index} className={styles.substanceBadge}>
                    {substance}
                  </span>
                ))}
                {substances.length > 3 && (
                  <span className={styles.moreBadge}>+{substances.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.cardActions}>
          <button 
            className={styles.viewButton}
            onClick={() => handleViewPermis(permis.id)}
            title="Voir détails"
          >
            <FiEye />
          </button>
          <button 
            className={styles.editButton}
            onClick={() => handleEditPermis(permis.id)}
            title="Modifier"
          >
            <FiEdit />
          </button>
          {auth.role === 'admin' && (
            <button 
              className={styles.deleteButton}
              onClick={() => handleDeletePermis(permis.id)}
              title="Supprimer"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
    );
  };
if (!isDataReady && isLoadingPermis) {
    return (
      <div className={styles.appContainer}>
        <Navbar />
        <div className={styles.appContent}>
          <Sidebar currentView={currentView} navigateTo={navigateTo} />
          <main className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <FiRefreshCw className={styles.spinner} size={32} />
              <h3>Chargement des données...</h3>
              <p>Veuillez patienter pendant que nous récupérons les permis.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return (
    
    <div className={styles.appContainer}>
        <Navbar />
        <div className={styles.appContent}>
          <Sidebar currentView={currentView} navigateTo={navigateTo} />
          <main className={styles.mainContent}>
                                <div className={styles.contentWrapper}></div>
    <div className={styles.permisTableSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerTitle}>
          <h2>Gestion des Permis</h2>
          <span className={styles.resultCount}>{filteredPermis.length} permis trouvés</span>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <FiList />
            </button>
            <button 
              className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <FiGrid />
            </button>
          </div>
          
          <button 
          disabled
            className={styles.addButton}
            onClick={() => router.push('/permis_dashboard/create')}
          >
            <FiPlus /> Nouveau Permis
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={styles.searchFilterBar}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher par code, titulaire, type..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.filterActions}>
          <button 
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiSliders />
            Filtres
            {activeFiltersCount > 0 && (
              <span className={styles.filterCount}>{activeFiltersCount}</span>
            )}
          </button>
          
          <button 
            className={styles.exportButton}
            onClick={() => handleExportData('csv')}
            disabled={exporting}
          >
            <FiDownload />
            Exporter
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label>Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">En vigueur</option>
                <option value="expired">Expirés</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendus</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                {permisTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Expiration</label>
              <select
                value={expirationFilter}
                onChange={(e) => setExpirationFilter(e.target.value)}
              >
                <option value="all">Tous</option>
                <option value="expiring_soon">Expire bientôt (&lt;6 mois)</option>
                <option value="expired">Déjà expirés</option>
                <option value="valid">Valides</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Substance</label>
              <select
                value={substanceFilter}
                onChange={(e) => setSubstanceFilter(e.target.value)}
              >
                <option value="all">Toutes substances</option>
                {substancesList.map(substance => (
                  <option key={substance} value={substance}>{substance}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Wilaya</label>
              <div className={styles.dropdownContainer}>
                <button 
                  className={styles.dropdownToggle}
                  onClick={() => setWilayaDropdownOpen(!wilayaDropdownOpen)}
                >
                  <span>{selectedWilayas.length > 0 ? `${selectedWilayas.length} sélectionnées` : 'Toutes'}</span>
                  <FiChevronDown className={wilayaDropdownOpen ? styles.rotate180 : ''} />
                </button>
                
                {wilayaDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <input
                        type="text"
                        placeholder="Rechercher wilaya..."
                        value={wilayaSearch}
                        onChange={(e) => setWilayaSearch(e.target.value)}
                        className={styles.dropdownSearch}
                      />
                    </div>
                    <div className={styles.dropdownItems}>
                      {filteredWilayas.map(wilaya => (
                        <label key={wilaya} className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            checked={selectedWilayas.includes(wilaya)}
                            onChange={(e) => handleWilayaFilterChange(wilaya, e.target.checked)}
                            className={styles.checkboxInput}
                          />
                          <span className={styles.checkboxLabel}>{wilaya}</span>
                        </label>
                      ))}
                      {filteredWilayas.length === 0 && (
                        <div className={styles.noResults}>Aucune wilaya trouvée</div>
                      )}
                    </div>
                    {selectedWilayas.length > 0 && (
                      <div className={styles.dropdownFooter}>
                        <button 
                          className={styles.clearSelectionButton}
                          onClick={() => setSelectedWilayas([])}
                        >
                          Tout désélectionner
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Surface (HA)</label>
              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={surfaceFilter.min || ''}
                  onChange={(e) => setSurfaceFilter({...surfaceFilter, min: e.target.value ? Number(e.target.value) : null})}
                  className={styles.rangeInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={surfaceFilter.max || ''}
                  onChange={(e) => setSurfaceFilter({...surfaceFilter, max: e.target.value ? Number(e.target.value) : null})}
                  className={styles.rangeInput}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Date d'octroi</label>
              <div className={styles.dateInputs}>
                <input
                  type="date"
                  value={dateFilter.start ? format(dateFilter.start, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDateFilter({...dateFilter, start: e.target.value ? new Date(e.target.value) : null})}
                  className={styles.dateInput}
                />
                <span>à</span>
                <input
                  type="date"
                  value={dateFilter.end ? format(dateFilter.end, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDateFilter({...dateFilter, end: e.target.value ? new Date(e.target.value) : null})}
                  className={styles.dateInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button 
              className={styles.clearFiltersButton}
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
                setDateFilter({start: null, end: null});
                setExpirationFilter('all');
                setSurfaceFilter({min: null, max: null});
                setSubstanceFilter('all');
                setSelectedWilayas([]);
              }}
            >
              <FiX /> Effacer tous les filtres
            </button>
          </div>
        </div>
      )}

      {isLoadingPermis ? (
        <div className={styles.loading}>
          <FiRefreshCw className={styles.spinner} size={24} />
          <span>Chargement des permis...</span>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className={styles.permisGrid}>
              {filteredPermis
                .slice((currentPermisPage - 1) * permisPerPage, currentPermisPage * permisPerPage)
                .map(renderPermisCard)}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className={styles.tableResponsive}>
              <table className={styles.permisTable}>
                <thead>
                  <tr>
                    <th>Code Permis</th>
                    <th>Type</th>
                    <th>Titulaire</th>
                    <th>Wilaya</th>
                    {/* <th>Commune</th> */}
                    <th>Statut</th>
                    <th>Date Octroi</th>
                    <th>Date Expiration</th>
                    <th>Surface (HA)</th>
                    <th>Substances</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermis
                    .slice((currentPermisPage - 1) * permisPerPage, currentPermisPage * permisPerPage)
                    .map((permis) => {
                      const expDate = permis.date_expiration ? new Date(permis.date_expiration) : null;
                      const daysUntilExpiry = expDate ? differenceInDays(expDate, new Date()) : null;
                      const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 180;
                      const wilayaName = permis.commune?.daira?.wilaya?.nom_wilayaFR || 'N/A';
                      const communeName = permis.commune?.nom_communeFR || 'N/A';
                      
                      return (
                        <tr key={permis.id} className={isExpiringSoon ? styles.expiringRow : ''}>
                          <td>{permis.code_permis}</td>
                          <td>{permis.typePermis?.lib_type || 'N/A'}</td>
                          <td>{permis.detenteur?.nom_societeFR || 'N/A'}</td>
                          <td>{wilayaName}</td>
                          {/* <td>{communeName}</td> */}
                          <td>
                            <span className={`${styles.statusBadge} ${
                              permis.statut?.lib_statut === 'En vigueur' ? styles.statusActive : 
                              expDate && expDate < new Date() ? styles.statusExpired : styles.statusOther
                            }`}>
                              {permis.statut?.lib_statut || 'N/A'}
                              {isExpiringSoon && <FiAlertTriangle className={styles.warningIcon} />}
                            </span>
                          </td>
                          <td>{permis.date_octroi ? format(new Date(permis.date_octroi), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</td>
                          <td>
                            {expDate ? (
                              <span className={isExpiringSoon ? styles.expiringDate : ''}>
                                {format(expDate, 'dd/MM/yyyy', { locale: fr })}
                                {isExpiringSoon && ` (${daysUntilExpiry}j)`}
                              </span>
                            ) : 'N/A'}
                          </td>
                          <td>
  {permis.superficie != null ? `${permis.superficie.toFixed(2)} HA` : 'N/A'}
</td>

                          <td>
                            <div className={styles.substances}>
                              {getSubstancesForPermis(permis).slice(0, 2).join(', ')}
                              {getSubstancesForPermis(permis).length > 2 && (
                                <span className={styles.moreSubstances}>
                                  +{getSubstancesForPermis(permis).length - 2} plus
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button 
                                className={styles.viewButton}
                                onClick={() => handleViewPermis(permis.id)}
                                title="Voir détails"
                              >
                                <FiEye />
                              </button>
                              <button 
                                className={styles.editButton}
                                onClick={() => handleEditPermis(permis.id)}
                                title="Modifier"
                              >
                                <FiEdit />
                              </button>
                              {auth.role == 'admin' && (
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => handleDeletePermis(permis.id)}
                                  title="Supprimer"
                                >
                                  <FiTrash2 />
                                </button>
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

          {filteredPermis.length === 0 && !isLoadingPermis && (
            <div className={styles.noData}>
              <FiMap size={48} />
              <h3>Aucun permis trouvé</h3>
              <p>Aucun permis ne correspond à vos critères de recherche.</p>
              <button 
                className={styles.clearAllButton}
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setDateFilter({start: null, end: null});
                  setExpirationFilter('all');
                  setSurfaceFilter({min: null, max: null});
                  setSubstanceFilter('all');
                  setSelectedWilayas([]);
                }}
              >
                Effacer tous les filtres
              </button>
            </div>
          )}

          {filteredPermis.length > permisPerPage && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Affichage de {((currentPermisPage - 1) * permisPerPage) + 1} à {Math.min(currentPermisPage * permisPerPage, filteredPermis.length)} sur {filteredPermis.length} permis
              </div>
              
              <div className={styles.paginationControls}>
                <button
                  className={styles.paginationButton}
                  disabled={currentPermisPage === 1}
                  onClick={() => setCurrentPermisPage(currentPermisPage - 1)}
                >
                  <FiChevronLeft />
                </button>
                
                {(() => {
                  const totalPages = Math.ceil(filteredPermis.length / permisPerPage);
                  const pages = [];
                  
                  // Always show first page
                  pages.push(
                    <button
                      key={1}
                      className={`${styles.paginationButton} ${currentPermisPage === 1 ? styles.active : ''}`}
                      onClick={() => setCurrentPermisPage(1)}
                    >
                      1
                    </button>
                  );
                  
                  // Show ellipsis if needed
                  if (currentPermisPage > 3) {
                    pages.push(<span key="ellipsis1" className={styles.paginationEllipsis}>...</span>);
                  }
                  
                  // Show current page and neighbors
                  for (let i = Math.max(2, currentPermisPage - 1); i <= Math.min(totalPages - 1, currentPermisPage + 1); i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`${styles.paginationButton} ${currentPermisPage === i ? styles.active : ''}`}
                        onClick={() => setCurrentPermisPage(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Show ellipsis if needed
                  if (currentPermisPage < totalPages - 2) {
                    pages.push(<span key="ellipsis2" className={styles.paginationEllipsis}>...</span>);
                  }
                  
                  // Always show last page if there is more than one page
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        className={`${styles.paginationButton} ${currentPermisPage === totalPages ? styles.active : ''}`}
                        onClick={() => setCurrentPermisPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
                
                <button
                  className={styles.paginationButton}
                  disabled={currentPermisPage === Math.ceil(filteredPermis.length / permisPerPage)}
                  onClick={() => setCurrentPermisPage(currentPermisPage + 1)}
                >
                  <FiChevronRight />
                </button>
              </div>
              
              <div className={styles.pageSizeSelector}>
                <span>Afficher :</span>
                <select 
                  value={permisPerPage} 
                  onChange={(e) => {
                    setPermisPerPage(Number(e.target.value));
                    setCurrentPermisPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>par page</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </main>
    </div>
    </div>
  );
}
