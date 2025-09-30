// pages/permis_dashboard/view/page.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from './PermisView.module.css';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Map,
  FileText, 
  Building2, 
  RefreshCw, 
  Edit2, 
  FileSearch, 
  XCircle, 
  ChevronRight, 
  Download,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  ChevronDown,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Copy,
  Filter,
  X,
  CreditCard,
  ChevronLeft
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import axios from 'axios';
import NotificationBanner from '../../../components/NotificationBanner';
import router from 'next/router';
import { toast } from 'react-toastify';
import Navbar from '@/pages/navbar/Navbar';
import Sidebar from '@/pages/sidebar/Sidebar';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import { useAuthReady } from '@/src/hooks/useAuthReady';

interface DocumentCardProps {
  document: any;
  onView: (document: any) => void;
  onDownload: (document: any) => void;
}

interface ObligationFilters {
  status: string;
  type: string;
  year: string;
  minAmount: string;
  maxAmount: string;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface RenewalInfo {
  id: number;
  num_decision: string;
  date_decision: Date | null;
  date_debut_validite: Date | null;
  date_fin_validite: Date | null;
  duree_renouvellement: number;
  commentaire: string;
  nombre_renouvellements?: number;
}

interface PermisDetails {
  id: number;
  code_permis: string;
  date_octroi: Date | null;
  date_expiration: Date | null;
  date_annulation: Date | null;
  date_renonciation: Date | null;
  superficie: number | null;
  nombre_renouvellements: number | null;
  statut: {
    lib_statut: string;
    color_code?: string;
  } | null;
  typePermis: {
    lib_type: string;
    code_type: string;
    duree_renouv: number;
    nbr_renouv_max: number;
  };
  detenteur: {
    nom_societeFR: string;
    id_detenteur: number;
  } | null;
  procedures: Procedure[];
  renewals: RenewalInfo[];
  documents: Document[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Document {
  id: number;
  nom: string;
  description: string;
  type: string;
  date_upload: Date | string;
  url: string;
  taille: number;
  status?: string;
  category?: string;
}

export interface ProcedureDocuments {
  id_proc: number;
  num_proc: string;
  statut_proc: string;
  documents: Document[];
  documentCount: number;
}


export interface AllDocuments {
  procedures: ProcedureDocuments[];
  totalCount: number;
}

interface Procedure {
  id_proc: number;
  num_proc: string;
  date_debut_proc: Date;
  date_fin_proc: Date | null;
  statut_proc: string;
  demandes: {
    typeProcedure: {
      libelle: string;
      code: string;
    };
  }[];
  SubstanceAssocieeDemande: {
    priorite: string;
    substance: {
      id_sub: number;
      nom_subFR: string;
      nom_subAR: string;
      categorie_sub: string;
    };
  }[];
  ProcedureEtape: {
    id_etape: number;
    statut: string;
    date_debut: Date;
    date_fin: Date | null;
    etape: {
      lib_etape: string;
      ordre_etape: number;
    };
  }[];
  // Add coordinates to Procedure interface
  coordonnees: {
    id_procedureCoord: number;
    statut_coord: string;
    coordonnee: {
      id_coordonnees: number;
      point: string;
      x: number;
      y: number;
      z: number;
    };
  }[];
}

interface Obligation {
  id: number;
  typePaiement: {
    id: number;
    libelle: string;
    frequence: string;
  };
  amount: number;
  fiscalYear: number;
  dueDate: string;
  status: string;
  payments: Payment[];
  tsPaiements?: TsPaiement[];
  details_calcul?: string;
}

interface Payment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  status: string;
  proofUrl: string | null;
  currency: string;
}

interface TsPaiement {
  id_tsPaiement: number;
  datePerDebut: string;
  datePerFin: string;
  surfaceMin: number;
  surfaceMax: number;
}

interface PermisDetails {
  id: number;
  code_permis: string;
  date_octroi: Date | null;
  date_expiration: Date | null;
  date_annulation: Date | null;
  date_renonciation: Date | null;
  superficie: number | null;
  nombre_renouvellements: number | null;
  statut: {
    lib_statut: string;
    color_code?: string;
  } | null;
  typePermis: {
    lib_type: string;
    code_type: string;
    duree_renouv: number;
    nbr_renouv_max: number;
  };
  detenteur: {
    nom_societeFR: string;
    id_detenteur: number;
  } | null;
  procedures: Procedure[];
  renewals: RenewalInfo[];
  documents: Document[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface CoordinatesDisplayProps {
  coordinates: {
    id_coordonnees: number;
    point: string;
    x: number;
    y: number;
    z: number;
  }[];
  procedureNumber: string;
}

interface StatsData {
  totalProcedures: number;
  completedProcedures: number;
  activeProcedures: number;
  renewalCount: number;
  daysUntilExpiry: number;
  validityStatus: string;
}

interface TransferDetenteur {
  role: 'CEDANT' | 'CESSIONNAIRE' | string;
  type_detenteur: 'ANCIEN' | 'NOUVEAU' | string;
  detenteur?: {
    id_detenteur: number;
    nom_societeFR?: string;
  } | null;
}

interface TransferEntry {
  id_transfert: number;
  date_transfert?: string | Date | null;
  motif_transfert?: string | null;
  transfertDetenteur?: TransferDetenteur[];
}

interface Props {
  permis: PermisDetails;
  latestTransfer?: TransferEntry | null;
  error?: string;
}


function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-"; // or whatever placeholder you want
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

// Document Viewer Component
const DocumentViewer: React.FC<{ 
  document: Document; 
  onClose: () => void; 
  onDownload: () => void;
}> = ({ document, onClose, onDownload }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{document.nom}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <XCircle size={20} />
          </button>
        </div>
        <div className={styles.documentViewerContent}>
          <div className={styles.documentPreview}>
            <FileText size={64} className={styles.documentIconLarge} />
            <p>Prévisualisation non disponible</p>
            <p className={styles.documentInfo}>Type: {document.type} • Taille: {formatFileSize(document.taille)}</p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.modalSecondaryButton}>
            Fermer
          </button>
          <button onClick={onDownload} className={styles.modalPrimaryButton}>
            <Download size={16} />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({ 
  coordinates, 
  procedureNumber 
}) => {
  const handleCopyCoordinates = useCallback((coord: any) => {
    const coordinatesText = `X: ${coord.x ?? 'N/A'}, Y: ${coord.y ?? 'N/A'}, Z: ${coord.z ?? 'N/A'}`;
    
    navigator.clipboard.writeText(coordinatesText)
      .then(() => {
        toast.success('Coordonnées copiées avec succés');
      })
      .catch((err) => {
        console.error('Erreur lors de la copie:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = coordinatesText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Coordonnées copiées avec succés');
      });
  }, []);

  const handleViewOnMap = useCallback((coord: any) => {
    if (coord.x === null || coord.y === null) {
      toast.error('Coordonnées X et Y sont requises pour afficher sur la carte');
      return;
    }

    // Open coordinates in OpenStreetMap
    const mapUrl = `https://www.openstreetmap.org/?mlat=${coord.y}&mlon=${coord.x}#map=15/${coord.y}/${coord.x}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const handleExport = useCallback(() => {
    if (coordinates.length === 0) {
      toast.error('Aucune coordonnée à exporter');
      return;
    }

    // Create CSV content
    const headers = ['X', 'Y', 'Z'];
    const csvContent = [
      headers.join(','),
      ...coordinates.map(coord => 
        [coord.x ?? '', coord.y ?? '', coord.z ?? ''].join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `coordonnees_procedure_${procedureNumber}_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success('Coordonnées exportées avec succés');
  }, [coordinates, procedureNumber]);
  
  if (!coordinates || coordinates.length === 0) {
    return (
      <div className={styles.emptyState}>
        <MapPin size={24} />
        <p>Aucune coordonnée disponible pour cette procédure</p>
      </div>
    );
  }

    return (
  <div className={styles.coordinatesContainer}>
    <div className={styles.coordinatesHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerTitle}>
          <MapPin size={20} className={styles.headerIcon} />
          <h3>Coordonnées de la procédure #{procedureNumber}</h3>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportButton} onClick={handleExport}>
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>
      <p className={styles.coordinatesCount}>{coordinates.length} ensembles de coordonnées</p>
    </div>
    
    {coordinates.length === 0 ? (
      <div className={styles.emptyCoordinates}>
        <MapPin size={48} className={styles.emptyIcon} />
        <h4>Aucune coordonnée disponible</h4>
        <p>Aucune donnée de coordonnées pour cette procédure.</p>
      </div>
    ) : (
      <div className={styles.coordinatesTableWrap}>
        <table className={styles.coordinatesTable}>
          <thead>
            <tr>
              <th className={styles.columnX}>Coordonnée X</th>
              <th className={styles.columnY}>Coordonnée Y</th>
              <th className={styles.columnZ}>Coordonnée Z</th>
              <th className={styles.columnActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coordinates.map((coord) => (
              <tr key={coord.id_coordonnees} className={styles.coordinateRow}>
                <td className={styles.coordinateCell}>
                  <span className={styles.coordinateValue}>{coord.x ?? '—'}</span>
                </td>
                <td className={styles.coordinateCell}>
                  <span className={styles.coordinateValue}>{coord.y ?? '—'}</span>
                </td>
                <td className={styles.coordinateCell}>
                  <span className={styles.coordinateValue}>{coord.z ?? '—'}</span>
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actionButtons1}>
                    <button 
                      className={styles.actionButton1}
                      onClick={() => handleViewOnMap(coord)}
                      title="Voir sur la carte"
                    >
                      <Map size={16} />
                    </button>
                    <button 
                      className={styles.actionButton1}
                      onClick={() => handleCopyCoordinates(coord)}
                      title="Copier les coordonnées"
                    >
                      <Copy size={16} />
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
);
}
// Statistic Card Component
const StatisticCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral' | 'warning';
  subtitle: string;
}> = ({ title, value, icon, trend, subtitle }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.statCardHeader}>
        <div className={styles.statCardIcon} style={{ backgroundColor: `${getTrendColor()}20`, color: getTrendColor() }}>
          {icon}
        </div>
        <span className={styles.statCardTitle}>{title}</span>
      </div>
      <div className={styles.statCardValue}>{value}</div>
      <div className={styles.statCardSubtitle} style={{ color: getTrendColor() }}>
        {subtitle}
      </div>
    </div>
  );
};

// Timeline Chart Component
const TimelineChart: React.FC<{ 
  procedures: Procedure[]; 
  renewals: RenewalInfo[];
  dateOctroi: Date | null;
  dateExpiration: Date | null;
}> = ({ procedures, renewals, dateOctroi, dateExpiration }) => {
  // Simplified timeline visualization
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timeline}>
        {dateOctroi && (
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} style={{ backgroundColor: '#10b981' }}></div>
            <div className={styles.timelineContent}>
              <span className={styles.timelineDate}>{formatDate(dateOctroi)}</span>
              <span className={styles.timelineTitle}>Octroi du permis</span>
            </div>
          </div>
        )}
        
        {renewals.filter(r => r.date_decision).map((renewal, index) => (
          <div key={renewal.id} className={styles.timelineItem}>
            <div className={styles.timelineDot} style={{ backgroundColor: '#3b82f6' }}></div>
            <div className={styles.timelineContent}>
              <span className={styles.timelineDate}>{formatDate(renewal.date_decision)}</span>
              <span className={styles.timelineTitle}>Renouvellement #{index + 1}</span>
              <span className={styles.timelineDesc}>Décision: {renewal.num_decision}</span>
            </div>
          </div>
        ))}
        
        {dateExpiration && (
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} style={{ backgroundColor: '#ef4444' }}></div>
            <div className={styles.timelineContent}>
              <span className={styles.timelineDate}>{formatDate(dateExpiration)}</span>
              <span className={styles.timelineTitle}>Date d'expiration</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Substance Table Component
const SubstanceTable: React.FC<{ substances: any[] }> = ({ substances }) => {
  return (
    <div className={styles.substanceTable}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom (FR)</th>
            <th>Nom (AR)</th>
            <th>Catégorie</th>
            <th>Priorité</th> 
          </tr>
        </thead>
        <tbody>
          {substances.map((substance) => (
            <tr key={substance.id_sub}>
              <td>{substance.nom_subFR}</td>
              <td>{substance.nom_subAR}</td>
              <td>
                <span className={styles.categoryBadge}>{substance.categorie_sub}</span>
              </td>
              <td>
                <span className={`${styles.priorityBadge} ${
                  substance.priorite === 'principale' 
                    ? styles.primaryPriority 
                    : styles.secondaryPriority
                }`}>
                  {substance.priorite === 'principale' ? 'principale' : 'secondaire'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Action Confirmation Modal Component
const ActionConfirmationModal: React.FC<{
  actionType: string;
  onConfirm: () => void;
  onCancel: () => void;
  permisDetails: {
    code: string;
    type: string;
    titulaire: string;
  };
}> = ({ actionType, onConfirm, onCancel, permisDetails }) => {
  const getActionTitle = () => {
    switch (actionType) {
      case 'renouvellement': return 'Demande de renouvellement';
      case 'modification': return 'Demande de modification';
      case 'transfert': return 'Demande de transfert';
      case 'renonciation': return 'Demande de renonciation';
      default: return 'Confirmation';
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case 'renouvellement': 
        return 'Êtes-vous sûr de vouloir demander un renouvellement pour ce permis?';
      case 'modification': 
        return 'Êtes-vous sûr de vouloir demander une modification pour ce permis?';
      case 'transfert': 
        return 'Êtes-vous sûr de vouloir demander une transfert pour ce permis?';
      case 'renonciation': 
        return 'Êtes-vous sûr de vouloir demander une renonciation pour ce permis? Cette action est irréversible.';
      default: return 'Confirmez-vous cette action?';
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{getActionTitle()}</h2>
          <button onClick={onCancel} className={styles.modalCloseButton}>
            <XCircle size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.confirmationInfo}>
            <p>{getActionDescription()}</p>
            <div className={styles.permisDetails}>
              <h4>Détails du permis:</h4>
              <ul>
                <li><strong>Code:</strong> {permisDetails.code}</li>
                <li><strong>Type:</strong> {permisDetails.type}</li>
                <li><strong>Titulaire:</strong> {permisDetails.titulaire}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onCancel} className={styles.modalSecondaryButton}>
            Annuler
          </button>
          <button onClick={onConfirm} className={styles.modalPrimaryButton}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

// pages/permis_dashboard/view/page.tsx (or your page)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const id = context.query.id;

  try {
    // Fetch permit data
    const res = await fetch(`${apiURL}/Permisdashboard/${id}`);
    if (!res.ok) throw new Error('Failed to fetch permit');
    
    const permis = await res.json();
    
    // Fetch documents from API
    const documentsRes = await fetch(`${apiURL}/permis/${id}/documents`);
    const documentsData = documentsRes.ok ? await documentsRes.json() : [];
    // Fetch transfer history and take the latest if available
    let latestTransfer: TransferEntry | null = null;
    try {
      const transferRes = await fetch(`${apiURL}/transfert/permis/${id}/history`);
      if (transferRes.ok) {
        const history = await transferRes.json();
        if (Array.isArray(history) && history.length > 0) {
          latestTransfer = history[0];
        }
      }
    } catch (_) {
      // ignore transfer fetch errors; keep latestTransfer as null
    }
     const renewalsRes = await fetch(`${apiURL}/api/procedures/${id}/renewals`);
    const renewalsData = renewalsRes.ok ? await renewalsRes.json() : [];
    const formattedRenewals = renewalsData.map((proc: any) => {
      if (!proc.renouvellement) return null;
      
      return {
        id: proc.id_proc,
        num_decision: proc.renouvellement.num_decision || 'N/A',
        date_decision: proc.renouvellement.date_decision ? new Date(proc.renouvellement.date_decision).toISOString() : null,
        date_debut_validite: proc.renouvellement.date_debut_validite ? new Date(proc.renouvellement.date_debut_validite).toISOString() : null,
        date_fin_validite: proc.renouvellement.date_fin_validite ? new Date(proc.renouvellement.date_fin_validite).toISOString() : null,
        duree_renouvellement: proc.renouvellement.nombre_renouvellements || 0,
        commentaire: proc.renouvellement.commentaire || '',
      };
    }).filter(Boolean);
    
    // Convert all date fields in the main permis object to ISO strings
    const serializablePermis = {
  ...permis,
  date_octroi: permis.date_octroi ? new Date(permis.date_octroi).toISOString() : null,
  date_expiration: permis.date_expiration ? new Date(permis.date_expiration).toISOString() : null,
  date_annulation: permis.date_annulation ? new Date(permis.date_annulation).toISOString() : null,
  date_renonciation: permis.date_renonciation ? new Date(permis.date_renonciation).toISOString() : null,
  renewals: formattedRenewals,
  documents: documentsData.data || [], 
  procedures: permis.procedures ? permis.procedures.map((proc: any) => ({
    ...proc,
    date_debut_proc: proc.date_debut_proc ? new Date(proc.date_debut_proc).toISOString() : null,
    date_fin_proc: proc.date_fin_proc ? new Date(proc.date_fin_proc).toISOString() : null,
    ProcedureEtape: proc.ProcedureEtape ? proc.ProcedureEtape.map((step: any) => ({
      ...step,
      date_debut: step.date_debut ? new Date(step.date_debut).toISOString() : null,
      date_fin: step.date_fin ? new Date(step.date_fin).toISOString() : null,
    })) : [],
    coordonnees: proc.coordonnees || []
  })) : []
};
    
    return {
      props: {
        permis: serializablePermis,
        latestTransfer: latestTransfer || null,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { 
      props: { 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } 
    };
  }
};

const PermisViewPage: React.FC<Props> = ({ permis, latestTransfer, error }) => {
  const searchParams = useSearchParams();
  const idPermis = searchParams!.get('id');
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const [notif, setNotif] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [pendingPermisId, setPendingPermisId] = useState<number | null>(null);
  const [showMaxRenewalModal, setShowMaxRenewalModal] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'procedures' | 'documents' | 'history' | 'obligations'>('overview');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{type: string, callback: () => void} | null>(null);
  let daysUntilExpiry: number | null = null;
const [documentsData, setDocumentsData] = useState<AllDocuments | null>(null);
const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
const [expandedProcedures, setExpandedProcedures] = useState<number[]>([]);
  const { currentView, navigateTo } = useViewNavigator('dashboard');
  const isAuthReady = useAuthReady();
const [obligations, setObligations] = useState<Obligation[]>([]);
const [filteredObligations, setFilteredObligations] = useState<Obligation[]>([]);
const [isLoadingObligations, setIsLoadingObligations] = useState(false);
const [expandedObligations, setExpandedObligations] = useState<number[]>([]);
const [filters, setFilters] = useState<ObligationFilters>({
  status: 'all',
  type: 'all',
  year: 'all',
  minAmount: '',
  maxAmount: ''
});
const [pagination, setPagination] = useState<PaginationState>({
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0
});
const [showFilters, setShowFilters] = useState(false);
// Add these helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'DZD'
  }).format(amount);
};

// Add to your useEffect section
const applyFilters = useCallback(() => {
  let filtered = obligations;

  // Apply status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter(ob => ob.status === filters.status);
  }

  // Apply type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter(ob => ob.typePaiement.libelle === filters.type);
  }

  // Apply year filter
  if (filters.year !== 'all') {
    filtered = filtered.filter(ob => ob.fiscalYear.toString() === filters.year);
  }

  // Apply amount filters
  if (filters.minAmount) {
    const min = parseFloat(filters.minAmount);
    filtered = filtered.filter(ob => ob.amount >= min);
  }

  if (filters.maxAmount) {
    const max = parseFloat(filters.maxAmount);
    filtered = filtered.filter(ob => ob.amount <= max);
  }

  // Update pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
  
  setPagination(prev => ({
    ...prev,
    totalItems,
    totalPages
  }));

  // Apply pagination
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + pagination.itemsPerPage);
  
  setFilteredObligations(paginated);
}, [filters, obligations, pagination.currentPage, pagination.itemsPerPage]);

useEffect(() => {
  if (obligations.length > 0) {
    applyFilters();
  }
}, [applyFilters]);

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
// Add to your useEffect section
const loadObligations = useCallback(async () => {
  if (!permis.id || !isAuthReady) {
    return;
  }

  setIsLoadingObligations(true);
  try {
    const response = await axios.get(`${apiURL}/payments/obligations/${permis.id}`, {
      withCredentials: true,
    });
    setObligations(response.data);
  } catch (error) {
    console.error('Error loading obligations:', error);
    toast.error('Erreur lors du chargement des obligations fiscales');
  } finally {
    setIsLoadingObligations(false);
  }
}, [apiURL, isAuthReady, permis.id]);

useEffect(() => {
  if (activeTab === 'obligations') {
    void loadObligations();
  }
}, [activeTab, loadObligations]);

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onView, onDownload }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className={styles.documentCard}>
      <div className={styles.documentIcon}>
        <FileText size={24} />
      </div>
      <div className={styles.documentInfo}>
        <h4 className={styles.documentName}>{document.nom}</h4>
        <p className={styles.documentType}>{document.type}</p>
        {document.description && (
          <p className={styles.documentDescription}>{document.description}</p>
        )}
        <p className={styles.documentMeta}>
          Ajouté le {formatDate(document.date_upload)} • {formatFileSize(document.taille)}
          {document.status && (
            <span className={`${styles.documentStatus} ${styles[`status${document.status}`]}`}>
              {document.status}
            </span>
          )}
        </p>
      </div>
      <div className={styles.documentActions}>
        {document.url ? (
          <>
            <button 
              className={styles.iconButton}
              onClick={() => onView(document)}
              title="Voir le document"
            >
              <Eye size={16} />
            </button>
            <button 
              className={styles.iconButton}
              onClick={() => onDownload(document)}
              title="Télécharger"
            >
              <Download size={16} />
            </button>
          </>
        ) : (
          <span className={styles.documentUnavailable}>
            NO URL FOUND!
          </span>
        )}
      </div>
    </div>
  );
};

  const loadDocuments = useCallback(async () => {
    if (!permis.id || !isAuthReady) {
      return;
    }

    setIsLoadingDocuments(true);
    try {
      const response = await axios.get(`${apiURL}/Permisdashboard/${permis.id}/documents`, {
        withCredentials: true,
      });
      const payload = response.data?.data || null;
      setDocumentsData(payload);
      if (payload?.procedures) {
        setExpandedProcedures(payload.procedures.map((proc: { id_proc: number }) => proc.id_proc));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [apiURL, isAuthReady, permis.id]);

  useEffect(() => {
    if (!permis.id || !isAuthReady || documentsData) {
      return;
    }

    void loadDocuments();
  }, [documentsData, isAuthReady, loadDocuments, permis.id]);

const toggleProcedure = (procedureId: number) => {
  setExpandedProcedures(prev =>
    prev.includes(procedureId)
      ? prev.filter(id => id !== procedureId)
      : [...prev, procedureId]
  );
};


if (permis.date_expiration) {
  const expiryDate =
    typeof permis.date_expiration === "string"
      ? new Date(permis.date_expiration)
      : permis.date_expiration;

  const today = new Date();

  if (expiryDate instanceof Date && !isNaN(expiryDate.getTime())) {
    daysUntilExpiry = differenceInDays(expiryDate, today);
  }
}

  // Calculate statistics on component mount
  useEffect(() => {
    if (permis) {
      const totalProcedures = permis.procedures.length;
      const completedProcedures = permis.procedures.filter(p => 
        p.statut_proc === 'TERMINEE').length;
      const activeProcedures = permis.procedures.filter(p => 
        p.statut_proc === 'EN_COURS').length;
      const renewalCount = permis.renewals?.length || 0;
      
      let daysUntilExpiry = 0;
      let validityStatus = 'Inconnu';
      
      if (permis.date_expiration) {
      const expiryDate = typeof permis.date_expiration === 'string' 
        ? new Date(permis.date_expiration) 
        : permis.date_expiration;
      const today = new Date();
      daysUntilExpiry = differenceInDays(expiryDate, today);
        
        if (daysUntilExpiry < 0) {
          validityStatus = 'Expirée';
        } else if (daysUntilExpiry < 30) {
          validityStatus = 'Expire bientôt';
        } else {
          validityStatus = 'Valide';
        }
      }
      
      setStatsData({
        totalProcedures,
        completedProcedures,
        activeProcedures,
        renewalCount,
        daysUntilExpiry,
        validityStatus
      });
    }
  }, [permis]);

  // Handle initial error
  useEffect(() => {
    if (error) {
      setNotif({ message: `Erreur: ${error}`, type: 'error' });
    }
  }, [error]);

  const formatDate = (date: Date | string | null) => {
  if (!date) return 'Non définie';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPP', { locale: fr });
};

  const getProcedureType = (procedure: Procedure): string => {
    return procedure.demandes[0]?.typeProcedure?.libelle || 'N/A';
  };

  const procedureTypes = Array.from(
    new Set(permis.procedures.map(p => getProcedureType(p)))
  );

  const calculateValidityStatus = (expiryDate: Date | string | null) => {
  if (!expiryDate) return 'Inconnu';

  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expirée';
  if (diffDays < 30) return 'Expire bientôt';
  return 'Valide';
};

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en_cours':
        return styles.badgePrimary;
      case 'terminee':
        return styles.badgeSuccess;
      case 'en_attente':
        return styles.badgeWarning;
      case 'rejetee':
      case 'annulee':
        return styles.badgeDanger;
      default:
        return styles.badgeNeutral;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en_cours':
        return <Clock size={14} />;
      case 'terminee':
        return <CheckCircle size={14} />;
      case 'en_attente':
        return <AlertTriangle size={14} />;
      case 'rejetee':
      case 'annulee':
        return <XCircle size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  const getProcedureBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'EN_COURS': return '#6366f1';
      case 'TERMINEE': return '#10b981';
      case 'EN_ATTENTE': return '#f59e0b';
      case 'REJETEE': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  // Function to get all unique substances from all procedures
const getAllSubstances = () => {
  const allSubstances: {
    id_sub: number;
    nom_subFR: string;
    nom_subAR: string;
    categorie_sub: string;
    priorite: string;
  }[] = [];

  permis.procedures.forEach(procedure => {
    procedure.SubstanceAssocieeDemande.forEach(sub => {
      if (!allSubstances.some(s => s.id_sub === sub.substance.id_sub)) {
        allSubstances.push({
          ...sub.substance,
          priorite: sub.priorite   // ✅ garder la priorité
        });
        console.log("xxxxxxxxxxx", procedure.SubstanceAssocieeDemande);
      }
    });
  });

  return allSubstances;
};


  const handleViewProcedure = (procedure: Procedure) => {
    const procedureType = getProcedureType(procedure);
    const isRenewal = procedureType.toLowerCase() === 'renouvellement';
    const isCession = procedureType.toLowerCase() === 'cession';
    const isFusion = procedureType.toLowerCase() === 'fusion';
    const currentStep = procedure.ProcedureEtape.find(step => step.statut === 'EN_COURS');

    let url: string;

    if (isRenewal) {
        // Find the original procedure (non-renouvellement)
        const original = permis.procedures.find(p =>
            getProcedureType(p).toLowerCase() === 'demande'
        );

        const originalDemandeId = original?.ProcedureEtape?.[0]?.id_etape || null;
        const originalProcId = original?.id_proc || null;

        if (currentStep) {
            url = `/renouvellement/step${currentStep.etape.ordre_etape}/page${currentStep.etape.ordre_etape}?id=${procedure.id_proc}`;
        } else {
            url = `/renouvellement/step1/page1?id=${procedure.id_proc}`;
        }

        // Add original params if found
        if (originalDemandeId && originalProcId) {
            url += `&originalDemandeId=${originalDemandeId}&original_proc_id=${originalProcId}`;
        }

    } else if (isCession) {
        // Cession procedure handling
        if (currentStep) {
            url = `/cession/step${currentStep.etape.ordre_etape}/page${currentStep.etape.ordre_etape}?id=${procedure.id_proc}`;
        } else {
            url = `/cession/step1/page1?id=${procedure.id_proc}`;
        }

    } else if (isFusion) {
        // Fusion procedure handling
        if (currentStep) {
            url = `/fusion/step${currentStep.etape.ordre_etape}/page${currentStep.etape.ordre_etape}?id=${procedure.id_proc}`;
        } else {
            url = `/fusion/step1/page1?id=${procedure.id_proc}`;
        }

    } else {
        // Default procedure (demande)
        if (currentStep) {
            url = `/demande/step${currentStep.etape.ordre_etape}/page${currentStep.etape.ordre_etape}?id=${procedure.id_proc}`;
        } else {
            url = `/demande/step1/page1?id=${procedure.id_proc}`;
        }
    }

    window.open(url, '_blank');
};

  const handleRenewalClick = async (permisId: number) => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    // First check if max renewals reached
    if ((permis.renewals?.length || 0) >= permis.typePermis.nbr_renouv_max) {
      setShowMaxRenewalModal(true);
      return;
    }

    // try {
    //   const response = await axios.post(`${apiURL}/api/procedures/renouvellement/check-payments`, {
    //     permisId,
    //   });

      setPendingPermisId(permisId);
      setShowDateModal(true);

    // } catch (error: any) {
    //   let errorMessage = "Erreur inconnue";

    //   if (error.response) {
    //     errorMessage = error.response.data.message || error.response.statusText;
    //   } else if (error.request) {
    //     errorMessage = "Pas de réponse du serveur";
    //   } else {
    //     errorMessage = error.message;
    //   }

    //   setNotif({
    //     message: `⚔ ${errorMessage}`,
    //     type: 'error'
    //   });
    // }
  };

  const handletransfertClick = async (permisId: number) => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;    

  try {
    const response = await axios.post(
      `${apiURL}/api/procedures/renouvellement/check-payments`,
      {
        permisId,
      },
      { withCredentials: true }
    );

    // Assuming the response indicates payment is complete
    // if (response.data.paymentCompleted) {
      // Redirect to transfer page
      window.location.href = `/transfert/${permisId}/transfert`;
    // } else {
    //   setPendingPermisId(permisId);
    //   setShowDateModal(true);
    // }

  } catch (error: any) {
    let errorMessage = "Erreur inconnue";

    if (error.response) {
      errorMessage = error.response.data.message || error.response.statusText;
    } else if (error.request) {
      errorMessage = "Pas de réponse du serveur";
    } else {
      errorMessage = error.message;
    }

    setNotif({
      message: `⚔ ${errorMessage}`,
      type: 'error'
    });
  }
};
  const handleNotificationClose = () => {
    setNotif(null);
  };

  const handleSubmitDate = async () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    if (!selectedDate || !pendingPermisId) return;

    try {
      const res = await axios.post(
        `${apiURL}/api/procedures/renouvellement/start`,
        {
        permisId: pendingPermisId,
        date_demande: selectedDate.toISOString().split('T')[0],
      },
        { withCredentials: true }
      );

      const { original_demande_id, original_proc_id, new_proc_id } = res.data;

      router.push(
        `/renouvellement/step1/page1?id=${new_proc_id}&originalDemandeId=${original_demande_id}&original_proc_id=${original_proc_id}`
      );
    } catch (error: any) {
      setNotif({ message: 'Erreur lors du renouvellement.', type: 'error' });
    } finally {
      setShowDateModal(false);
      setPendingPermisId(null);
      setSelectedDate(null);
    }
  };

  const handleProcedureTypeClick = (type: string) => {
    const matchingProcedures = permis.procedures.filter(p => getProcedureType(p) === type);
    if (matchingProcedures.length > 0) {
      setSelectedProcedures(matchingProcedures);
      setSelectedProcedure(matchingProcedures[0]);
      setIsModalOpen(true);
    }
  };

  const handleDocumentView = (document: Document) => {
  if (!document.url) {
    toast.error(
     'Ce document n\'est pas disponible en téléchargement'
    );
    return;
  }
  
  setSelectedDocument(document);
  setShowDocumentViewer(true);
};

 const handleDocumentDownload = async (doc: Document) => {
  if (!doc.url) {
    toast.error('Ce document n\'est pas disponible en téléchargement');
    return;
  }
  
  try {
    // Show loading notification
    setNotif({ message: `Téléchargement de ${doc.nom} en cours...`, type: 'info' });
    
    // Create a hidden anchor element for download
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.nom || `document-${doc.id}`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Revoke the object URL after some time
    if (doc.url.startsWith('blob:')) {
      setTimeout(() => {
        URL.revokeObjectURL(doc.url);
      }, 1000);
    }
    
    // Success notification
    setNotif({ message: `${doc.nom} téléchargé avec succés`, type: 'success' });
    
  } catch (error) {
    console.error('Download error:', error);
    setNotif({ message: 'Erreur lors du téléchargement', type: 'error' });
  }
};

  const handleActionWithConfirmation = (actionType: string, callback: () => void) => {
    setPendingAction({ type: actionType, callback });
    setShowConfirmationModal(true);
  };

  const confirmAction = () => {
    if (pendingAction) {
      pendingAction.callback();
    }
    setShowConfirmationModal(false);
    setPendingAction(null);
  };

  const cancelAction = () => {
    setShowConfirmationModal(false);
    setPendingAction(null);
  };

  const substances = getAllSubstances();

  if (error && !permis) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button 
            className={styles.primaryButton}
            onClick={() => router.push('/permis_dashboard')}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (!permis) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Chargement des données...</p>
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
    <div className={styles.container}>
      {notif && (
        <NotificationBanner
          message={notif.message}
          type={notif.type}
          onClose={handleNotificationClose}
        />
      )}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>Détails du Permis</h1>
            <p className={styles.headerSubtitle}>
              Informations complétes sur le permis {permis.code_permis}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.secondaryButton}
              onClick={() => router.push('/permis_dashboard/PermisDashboard')}
            >
              Retour
            </button>
            <button 
              className={styles.primaryButton}
              onClick={() => window.print()}
            >
              Imprimer
            </button>
          </div>
        </div>
        
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FileText size={16} />
            Aperçu
          </button>

          <button 
            className={`${styles.tab} ${activeTab === 'procedures' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('procedures')}
          >
            <Clock size={16} />
            Procédures ({permis.procedures.length})
          </button>
          <button 
  className={`${styles.tab} ${activeTab === 'documents' ? styles.tabActive : ''}`}
  onClick={() => setActiveTab('documents')}
>
  <FileSearch size={16} />
  Documents ({documentsData?.totalCount || permis.documents?.length || 0})
</button>
          <button 
            className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <BarChart3 size={16} />
            Historique
          </button>
          <button 
    className={`${styles.tab} ${activeTab === 'obligations' ? styles.tabActive : ''}`}
    onClick={() => setActiveTab('obligations')}
  >
    <FileText size={16} />
    Obligations fiscales
  </button>
        </div>
      </div>
{activeTab === 'obligations' && (
  <div className={styles.tabContent}>
    <div className={`${styles.card} ${styles.animateIn}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderIcon}>
          <FileText size={20} />
        </div>
        <h2 className={styles.cardTitle}>Obligations Fiscales</h2>
        <div className={styles.headerActions}>
          <span className={styles.badge}>{pagination.totalItems} obligations</span>
          <button
            className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtres
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Statut</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="all">Tous les statuts</option>
                <option value="Payé">Payé</option>
                <option value="A payer">À payer</option>
                <option value="En retard">En retard</option>
                <option value="Partiellement payé">Partiellement payé</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="all">Tous les types</option>
                {Array.from(new Set(obligations.map(ob => ob.typePaiement.libelle))).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Année</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="all">Toutes les années</option>
                {Array.from(new Set(obligations.map(ob => ob.fiscalYear)))
                  .sort((a, b) => b - a)
                  .map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Montant min (DZD)</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                className={styles.filterInput}
                placeholder="0"
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Montant max (DZD)</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                className={styles.filterInput}
                placeholder="âˆž"
              />
            </div>

            <div className={styles.filterActions}>
              <button
                onClick={() => setFilters({
                  status: 'all',
                  type: 'all',
                  year: 'all',
                  minAmount: '',
                  maxAmount: ''
                })}
                className={styles.resetButton}
              >
                <X size={16} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContent}>
        {isLoadingObligations ? (
          <div className={styles.loading}>
            <RefreshCw size={32} className={styles.spinner} />
            <p>Chargement des obligations...</p>
          </div>
        ) : filteredObligations.length > 0 ? (
          <div className={styles.obligationsContainer}>
            {/* Summary Stats */}
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total</span>
                <span className={styles.statValue}>
                  {obligations.reduce((sum, ob) => sum + ob.amount, 0).toLocaleString('fr-FR')} DZD
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Payé</span>
                <span className={styles.statValue}>
                  {obligations
                    .filter(ob => ob.status === 'Payé')
                    .reduce((sum, ob) => sum + ob.amount, 0)
                    .toLocaleString('fr-FR')} DZD
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>En attente</span>
                <span className={styles.statValue}>
                  {obligations
                    .filter(ob => ob.status !== 'Payé')
                    .reduce((sum, ob) => sum + ob.amount, 0)
                    .toLocaleString('fr-FR')} DZD
                </span>
              </div>
            </div>

            {/* Obligations List */}
            <div className={styles.obligationsList}>
              {filteredObligations.map(obligation => (
                <div key={obligation.id} className={styles.obligationItem}>
                  <div 
                    className={styles.obligationHeader}
                    onClick={() => setExpandedObligations(prev =>
                      prev.includes(obligation.id)
                        ? prev.filter(id => id !== obligation.id)
                        : [...prev, obligation.id]
                    )}
                  >
                    <div className={styles.obligationInfo}>
                      <h3 className={styles.obligationTitle}>
                        {obligation.typePaiement.libelle}
                      </h3>
                      <div className={styles.obligationMeta}>
                        <span className={styles.obligationYear}>Année {obligation.fiscalYear}</span>
                        <span className={styles.obligationFrequency}>• {obligation.typePaiement.frequence}</span>
                        <span className={styles.obligationDue}>
                          • Échéance: {new Date(obligation.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.obligationStatus}>
                      <span className={`${styles.statusBadge} ${
                        obligation.status === 'Payé' ? styles.statusPaid :
                        obligation.status === 'En retard' ? styles.statusOverdue :
                        obligation.status === 'Partiellement payé' ? styles.statusPartial :
                        styles.statusPending
                      }`}>
                        {obligation.status}
                      </span>
                      <span className={styles.obligationAmount}>
                        {obligation.amount.toLocaleString('fr-FR')} DZD
                      </span>
                    </div>
                    
                    <ChevronDown 
                      size={20} 
                      className={`${styles.expandIcon} ${
                        expandedObligations.includes(obligation.id) ? styles.expanded : ''
                      }`}
                    />
                  </div>

                  {expandedObligations.includes(obligation.id) && (
                    <div className={styles.obligationDetails}>
                      {/* Payment Period Information */}
                      {obligation.tsPaiements && obligation.tsPaiements.length > 0 && (
                        <div className={styles.detailSection}>
                          <h4>Période de paiement</h4>
                          <div className={styles.periodGrid}>
                            {obligation.tsPaiements.map(ts => (
                              <div key={ts.id_tsPaiement} className={styles.periodItem}>
                                <Calendar size={16} />
                                <span>
                                  {new Date(ts.datePerDebut).toLocaleDateString('fr-FR')} - {new Date(ts.datePerFin).toLocaleDateString('fr-FR')}
                                </span>
                                <span className={styles.surfaceInfo}>
                                  Surface: {ts.surfaceMin} - {ts.surfaceMax} ha
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment History */}
                      <div className={styles.detailSection}>
                        <h4>Historique des paiements</h4>
                        {obligation.payments.length > 0 ? (
                          <div className={styles.paymentsTable}>
                            <div className={styles.tableHeader}>
                              <span>Date</span>
                              <span>Méthode</span>
                              <span>Quittance</span>
                              <span>Montant</span>
                            </div>
                            {obligation.payments.map(payment => (
                              <div key={payment.id} className={styles.tableRow}>
                                <span>{new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
                                <span className={styles.paymentMethod}>{payment.paymentMethod}</span>
                                <span className={styles.receiptNumber}>{payment.receiptNumber || 'N/A'}</span>
                                <span className={styles.paymentAmount}>
                                  {payment.amount.toLocaleString('fr-FR')} {payment.currency}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={styles.noData}>Aucun paiement effectué</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className={styles.actionsSection}>
                        <button className={styles.actionBtn}>
                          <Download size={16} />
                          Télécharger le reçu
                        </button>
                        <button className={styles.actionBtn}>
                          <Eye size={16} />
                          Voir justificatif
                        </button>
                        {obligation.status !== 'Payé' && (
                          <button className={styles.payBtn}>
                            <CreditCard size={16} />
                            Payer maintenant
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className={styles.paginationButton}
                >
                  <ChevronLeft size={16} />
                  Précédent
                </button>

                <div className={styles.paginationPages}>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(
                      pagination.currentPage - 2,
                      pagination.totalPages - 4
                    )) + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                        className={`${styles.pageButton} ${pagination.currentPage === page ? styles.pageButtonActive : ''}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={styles.paginationButton}
                >
                  Suivant
                  <ChevronRight size={16} />
                </button>

                <select
                  value={pagination.itemsPerPage}
                  onChange={(e) => setPagination(prev => ({
                    ...prev,
                    itemsPerPage: parseInt(e.target.value),
                    currentPage: 1
                  }))}
                  className={styles.pageSizeSelect}
                >
                  <option value="5">5 par page</option>
                  <option value="10">10 par page</option>
                  <option value="20">20 par page</option>
                  <option value="50">50 par page</option>
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyStateIcon} />
            <p>Aucune obligation ne correspond aux filtres</p>
            <button 
              className={styles.primaryButton}
              onClick={() => setFilters({
                status: 'all',
                type: 'all',
                year: 'all',
                minAmount: '',
                maxAmount: ''
              })}
            >
              <Filter size={16} />
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      {activeTab === 'overview' && (
        <div className={styles.tabContent}>
          <div className={styles.statsGrid}>
            <StatisticCard
  title="Statut du permis"
  value={permis.statut?.lib_statut || "Inconnu"}
  icon={<FileText size={20} />}
  trend={
    statsData?.validityStatus === "Valide"
      ? "positive"
      : statsData?.validityStatus === "Expire bientôt"
      ? "warning"
      : "negative"
  }
  subtitle={
    statsData?.validityStatus ||
    (daysUntilExpiry !== null ? `${daysUntilExpiry} jours restants` : "Non défini")
  }
/>

            <StatisticCard
  title="Jours avant expiration"
  value={statsData?.daysUntilExpiry?.toString() ?? 'N/A'}
  icon={<Calendar size={20} />}
  trend={
    statsData?.daysUntilExpiry && statsData.daysUntilExpiry > 30
      ? 'positive'
      : statsData?.daysUntilExpiry && statsData.daysUntilExpiry > 0
      ? 'warning'
      : 'negative'
  }
  subtitle={statsData?.validityStatus ?? 'N/A'}   // ✅ safer
/>

            <StatisticCard
              title="Procédures actives"
              value={statsData?.activeProcedures.toString() || '0'}
              icon={<Clock size={20} />}
              trend="neutral"
              subtitle={`Sur ${statsData?.totalProcedures} au total`}
            />
            <StatisticCard
              title="Renouvellements"
              value={(permis.nombre_renouvellements || 0).toString()}
              icon={<RefreshCw size={20} />}
              trend={(permis.nombre_renouvellements || 0) < permis.typePermis.nbr_renouv_max ? 'positive' : 'negative'}
              subtitle={`Max: ${permis.typePermis.nbr_renouv_max}`}
            />
          </div>

          <div className={styles.gridLayout}>
            {/* Main Content */}
            <div className="space-y-6">
              {/* General Info Card */}
              <div className={`${styles.card} ${styles.animateIn}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderIcon}>
                    <FileText size={20} />
                  </div>
                  <h2 className={styles.cardTitle}>Informations générales</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Code Permis</span>
                      <span className={styles.infoValue}>{permis.code_permis}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Type de Permis</span>
                      <span className={styles.infoValue}>
                        {permis.typePermis.lib_type} ({permis.typePermis.code_type})
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Statut</span>
                      <span className={`${styles.badge} ${getStatusColor(permis.statut?.lib_statut || '')}`}>
                        {permis.statut?.lib_statut || 'Inconnu'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Superficie</span>
                      <span className={styles.infoValue}>
                        {permis.superficie ? `${permis.superficie} Ha` : 'Non définie'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Titulaire</span>
                      <span className={styles.infoValue}>
                        {permis.detenteur?.nom_societeFR || 'Non défini'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Substances</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {substances.length > 0 ? (
                          substances.map((substance) => (
                            <span key={substance.id_sub} className={`${styles.badge} ${styles.badgePrimary}`}>
                              {substance.nom_subFR}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Non spécifiées</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Card */}
              <div className={`${styles.card} ${styles.animateIn} ${styles.delay1}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderIcon}>
                    <Calendar size={20} />
                  </div>
                  <h2 className={styles.cardTitle}>Dates importantes</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Date d'octroi</span>
                      <span className={styles.infoValue}>{formatDate(permis.date_octroi)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Date d'expiration</span>
                      <span className={styles.infoValue}>{formatDate(permis.date_expiration)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Date d'annulation</span>
                      <span className={styles.infoValue}>{formatDate(permis.date_annulation)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Date de renonciation</span>
                      <span className={styles.infoValue}>{formatDate(permis.date_renonciation)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Substances Card */}
              {substances.length > 0 && (
                <div className={`${styles.card} ${styles.animateIn} ${styles.delay2}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderIcon}>
                      <MapPin size={20} />
                    </div>
                    <h2 className={styles.cardTitle}>Substances</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <SubstanceTable substances={substances} />
                  </div>
                </div>
              )}

              {substances.length > 0 && (
  <div className={`${styles.card} ${styles.animateIn} ${styles.delay2}`}>
    <div className={styles.cardHeader}>
      <div className={styles.cardHeaderIcon}>
        <MapPin size={20} />
      </div>
      <h2 className={styles.cardTitle}>Coordonnées</h2>
    </div>
    <div className={styles.cardContent}>
      {permis.procedures.length > 0 ? (
        <div className={styles.coordinatesOverview}>
          {permis.procedures.map(procedure => (
            procedure.coordonnees?.length > 0 && (
              <div key={procedure.id_proc} className={styles.procedureCoordinates}>
                <h4>Procédure {procedure.num_proc}</h4>
                <CoordinatesDisplay 
                  coordinates={procedure.coordonnees.map(c => c.coordonnee)}
                  procedureNumber={procedure.num_proc}
                />
              </div>
            )
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <MapPin size={24} />
          <p>Aucune coordonnée disponible</p>
        </div>
      )}
    </div>
  </div>
)}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Latest Transfer Card */}
              {latestTransfer && (
                <div className={`${styles.card} ${styles.animateIn} ${styles.delay1}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderIcon}>
                      <ArrowRight size={20} />
                    </div>
                    <h2 className={styles.cardTitle}>Dernier transfert</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>De</span>
                        <span className={styles.infoValue}>
                          {latestTransfer.transfertDetenteur?.find(d => d.role === 'CEDANT' || d.type_detenteur === 'ANCIEN')?.detenteur?.nom_societeFR || '-'}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Vers</span>
                        <span className={styles.infoValue}>
                          {latestTransfer.transfertDetenteur?.find(d => d.role === 'CESSIONNAIRE' || d.type_detenteur === 'NOUVEAU')?.detenteur?.nom_societeFR || '-'}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Date</span>
                        <span className={styles.infoValue}>{formatDate(latestTransfer.date_transfert as any)}</span>
                      </div>
                      {latestTransfer.motif_transfert && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Motif</span>
                          <span className={styles.infoValue}>{latestTransfer.motif_transfert}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Quick Actions Card */}
              <div className={`${styles.card} ${styles.animateIn} ${styles.delay1}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderIcon}>
                    <Building2 size={20} />
                  </div>
                  <h2 className={styles.cardTitle}>Actions rapides</h2>
                </div>
                <div className={styles.cardContent}>
                  <button
                    className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                    onClick={() => {
                      if ((permis.renewals?.length || 0) >= permis.typePermis.nbr_renouv_max) {
                        setShowMaxRenewalModal(true);
                      } else {
                        handleActionWithConfirmation(
                          'renouvellement',
                          () => handleRenewalClick(permis.id)
                        );
                      }
                    }}
                    style={{
                      position: 'relative',
                      opacity: (
                        (permis.renewals?.length || 0) >= permis.typePermis.nbr_renouv_max) ? 0.7 : 1,
                      cursor: (
                        (permis.renewals?.length || 0) >= permis.typePermis.nbr_renouv_max) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <RefreshCw size={18} />
                    Demander un renouvellement
                    {(permis.nombre_renouvellements || 0) >= permis.typePermis.nbr_renouv_max && (
                      <span className={styles.tooltip}>
                        Maximum de {permis.typePermis.nbr_renouv_max} renouvellements atteint
                      </span>
                    )}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
                    onClick={() => handleActionWithConfirmation('modification', () => {
                      // Handle modification request
                      setNotif({ message: 'Demande de modification initiée', type: 'info' });
                    })}
                  >
                    <Edit2 size={18} />
                    Demander une modification
                  </button>
                   <button
                    className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                    onClick={() => { {
                        handleActionWithConfirmation(
                          'transfert',
                          () => handletransfertClick(permis.id)
                        );
                      }
                    }}
                  >
                    <RefreshCw size={18} />
                    Demander un transfert
                    
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.actionButtonWarning}`}
                    onClick={() => setActiveTab('documents')}
                  >
                    <FileSearch size={18} />
                    Consulter les documents
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                    onClick={() => handleActionWithConfirmation('renonciation', () => {
                      // Handle renunciation request
                      setNotif({ message: 'Demande de renonciation initiée', type: 'info' });
                    })}
                  >
                    <XCircle size={18} />
                    Demander une renonciation
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className={`${styles.card} ${styles.animateIn} ${styles.delay2}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderIcon}>
                    <BarChart3 size={20} />
                  </div>
                  <h2 className={styles.cardTitle}>Historique des statuts</h2>
                </div>
                <div className={styles.cardContent}>
                  <TimelineChart 
                    procedures={permis.procedures} 
                    renewals={permis.renewals}
                    dateOctroi={permis.date_octroi}
                    dateExpiration={permis.date_expiration}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'procedures' && (
        <div className={styles.tabContent}>
          <div className={`${styles.card} ${styles.animateIn}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <Clock size={20} />
              </div>
              <h2 className={styles.cardTitle}>Procédures associées</h2>
              <span className={styles.badge}>{permis.procedures.length} procédures</span>
            </div>
            <div className={styles.cardContent}>
              {/* Procedure Types Section */}
              <div className={styles.procedureTypes}>
                <h3 className={styles.procedureTypesTitle}>Types de procédures</h3>
                <div className={styles.procedureTypesList}>
                  {procedureTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleProcedureTypeClick(type)}
                      className={styles.procedureTypeBadge}
                    >
                      {type} ({permis.procedures.filter(p => getProcedureType(p) === type).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Procedures List */}
              <div className={styles.proceduresList}>
                <h3 className={styles.proceduresListTitle}>Toutes les procédures</h3>
                {permis.procedures.length > 0 ? (
                  <div className={styles.procedureItems}>
                    {permis.procedures.map(procedure => (
                      <div 
                        key={procedure.id_proc} 
                        className={styles.procedureItem}
                        style={{ borderLeftColor: getProcedureBorderColor(procedure.statut_proc) }}
                        onClick={() => {
                          setSelectedProcedure(procedure);
                          setIsModalOpen(true);
                        }}
                      >
                        <div className={styles.procedureItemHeader}>
                          <span className={styles.procedureNumber}>{procedure.num_proc}</span>
                          <span className={`${styles.badge} ${getStatusColor(procedure.statut_proc)}`}>
                            {getStatusIcon(procedure.statut_proc)}
                            {procedure.statut_proc}
                          </span>
                        </div>
                        <div className={styles.procedureItemBody}>
                          <span className={styles.procedureType}>{getProcedureType(procedure)}</span>
                          <span className={styles.procedureDates}>
                            {formatDate(procedure.date_debut_proc)} - {formatDate(procedure.date_fin_proc)}
                          </span>
                        </div>
                        <div className={styles.procedureItemFooter}>
                          <span className={styles.procedureSteps}>
                            {procedure.ProcedureEtape.length} étape(s)
                          </span>
                          <ChevronRight size={16} className={styles.chevronIcon} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <FileText size={48} className={styles.emptyStateIcon} />
                    <p>Aucune procédure associée à ce permis</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
  <div className={styles.tabContent}>
    <div className={`${styles.card} ${styles.animateIn}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderIcon}>
          <FileSearch size={20} />
        </div>
        <h2 className={styles.cardTitle}>Documents associés</h2>
        <span className={styles.badge}>{documentsData?.totalCount || 0} documents</span>
      </div>
      <div className={styles.cardContent}>
        {isLoadingDocuments ? (
          <div className={styles.loading}>
            <RefreshCw size={32} className={styles.spinner} />
            <p>Chargement des documents...</p>
          </div>
        ) : documentsData ? (
          <div className={styles.documentsContainer}>
            
            
            {/* Procedure Documents */}
            {documentsData.procedures.map(procedure => (
              <div key={procedure.id_proc} className={styles.documentCategory}>
                <div 
                  className={styles.documentCategoryHeader}
                  onClick={() => toggleProcedure(procedure.id_proc)}
                >
                  <h3 className={styles.documentCategoryTitle}>
                    Procédure: {procedure.num_proc} :  
                    <span className={styles.procedureStatus}>
                      { procedure.statut_proc}
                    </span>
                  </h3>
                  <div className={styles.documentCategoryInfo}>
                    <span className={styles.documentCount}>
                      {procedure.documentCount} document(s)
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`${styles.expandIcon} ${
                        expandedProcedures.includes(procedure.id_proc) ? styles.expanded : ''
                      }`}
                    />
                  </div>
                </div>
                
                {expandedProcedures.includes(procedure.id_proc) && (
                  <div className={styles.documentsGrid}>
                    {procedure.documents.map(document => (
                      <DocumentCard 
                        key={document.id} 
                        document={document} 
                        onView={handleDocumentView}
                        onDownload={handleDocumentDownload}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {documentsData.totalCount === 0 && (
              <div className={styles.emptyState}>
                <FileText size={48} className={styles.emptyStateIcon} />
                <p>Aucun document associé à ce permis</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyStateIcon} />
            <p>Aucun document associé à ce permis</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      {activeTab === 'history' && (
        <div className={styles.tabContent}>
          <div className={`${styles.card} ${styles.animateIn}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <RefreshCw size={20} />
              </div>
              <h2 className={styles.cardTitle}>Historique des Renouvellements</h2>
            </div>
            <div className={styles.cardContent}>
              {permis.renewals && permis.renewals.some(r => r.num_decision && r.num_decision !== 'N/A') ? (
                <div className={styles.renewalTimeline}>
                  {permis.renewals
                    .filter(r => r.num_decision && r.num_decision !== 'N/A')
                    .map((renewal, index) => (
                      <div key={renewal.id} className={styles.renewalItem}>
                        <div className={styles.renewalMarker}>
                          <div className={styles.renewalNumber}>{index + 1}</div>
                          <div className={styles.renewalConnector}></div>
                        </div>
                        <div className={styles.renewalDetails}>
                          <div className={styles.renewalHeader}>
                            <span className={styles.renewalDecision}>Décision: {renewal.num_decision}</span>
                            <span className={styles.renewalDate}>
                              {formatDate(renewal.date_decision)}
                            </span>
                          </div>
                          <div className={styles.renewalPeriod}>
                            <span>Période: {formatDate(renewal.date_debut_validite)} - {formatDate(renewal.date_fin_validite)}</span>
                            <span className={styles.renewalDuration}>
                              ({permis.typePermis.duree_renouv} {permis.typePermis.duree_renouv > 1 ? 'ans' : 'an'})
                            </span>
                          </div>
                          {renewal.commentaire && (
                            <div className={styles.renewalComment}>
                              <strong>Commentaire:</strong> {renewal.commentaire}
                            </div>
                          )}
                          <div
                            className={styles.renewalLimitWarning}
                            onClick={() => {
                              if (permis.nombre_renouvellements! >= permis.typePermis.nbr_renouv_max) {
                                setShowMaxRenewalModal(true);
                              }
                            }}
                            style={{
                              cursor: permis.nombre_renouvellements! >= permis.typePermis.nbr_renouv_max ? 'pointer' : 'default'
                            }}
                          >
                            {permis.nombre_renouvellements && permis.typePermis.nbr_renouv_max && (
                              <>
                                <div className={styles.renewalProgress}>
                                  <div
                                    className={styles.renewalProgressBar}
                                    style={{
                                      width: `${Math.min(100, (permis.nombre_renouvellements / permis.typePermis.nbr_renouv_max) * 100)}%`
                                    }}
                                  ></div>
                                </div>
                                <div className={styles.renewalLimitText}>
                                  {permis.nombre_renouvellements} / {permis.typePermis.nbr_renouv_max} renouvellements utilisés
                                </div>
                                {permis.nombre_renouvellements >= permis.typePermis.nbr_renouv_max && (
                                  <div className={styles.renewalMaxReached}>
                                    <XCircle size={16} />
                                    <span>Maximum de renouvellements atteint</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  <div className={styles.currentStatus}>
                    <div className={styles.statusLabel}>Statut actuel:</div>
                    <div className={`${styles.statusValue} ${calculateValidityStatus(permis.date_expiration) === 'Valide' ? styles.statusValid :
                        calculateValidityStatus(permis.date_expiration) === 'Expire bientôt' ? styles.statusWarning :
                          styles.statusExpired
                      }`}>
                      {calculateValidityStatus(permis.date_expiration)}
                      {permis.date_expiration && (
                        <span className={styles.statusDate}>
                          (jusqu'au {formatDate(permis.date_expiration)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noRenewals}>
                  <RefreshCw size={48} className={styles.emptyStateIcon} />
                  <p>Ce permis n'a pas encore été renouvelé.</p>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => handleRenewalClick(permis.id)}
                    disabled={(permis.renewals?.length || 0) >= permis.typePermis.nbr_renouv_max}
                  >
                    <Plus size={16} />
                    Demander un premier renouvellement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Procedure Modal */}
      {isModalOpen && selectedProcedure && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={styles.modalCloseButton}
            >
              <XCircle size={20} />
            </button>

            <h2 className={styles.modalTitle}>
              {getProcedureType(selectedProcedure)} - {selectedProcedure.num_proc}
            </h2>

            <div className={styles.modalBody}>
              <div className={styles.modalProcedureInfo}>
                <div className={styles.modalProcedureDates}>
                  <span>Début: {formatDate(selectedProcedure.date_debut_proc)}</span>
                  <span> - </span>
                  <span>Fin: {formatDate(selectedProcedure.date_fin_proc)}</span>
                </div>
                <div className={`${styles.badge} ${getStatusColor(selectedProcedure.statut_proc)}`}>
                  {getStatusIcon(selectedProcedure.statut_proc)}
                  {selectedProcedure.statut_proc}
                </div>
              </div>

              {selectedProcedures.length > 1 && (
                <div className={styles.procedureSelector}>
                  <label className={styles.procedureSelectorLabel}>Choisir une procédure :</label>
                  <select
                    className={styles.procedureSelectorDropdown}
                    value={selectedProcedure?.id_proc}
                    onChange={(e) => {
                      const freshProc = permis.procedures.find(p => p.id_proc === Number(e.target.value));
                      if (freshProc) setSelectedProcedure(freshProc);
                    }}
                  >
                    {selectedProcedures.map(p => (
                      <option key={p.id_proc} value={p.id_proc}>
                        {p.num_proc} - {formatDate(p.date_debut_proc)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.modalStepsContainer}>
                <h3 className={styles.modalStepsTitle}>Étapes de la procédure</h3>
                {selectedProcedure.ProcedureEtape.map((step) => (
                  <div key={step.id_etape} className={styles.stepItem}>
                    <div
                      className={styles.stepIndicator}
                      style={{
                        backgroundColor: step.statut === 'TERMINEE' ? '#10b981' :
                          step.statut === 'EN_COURS' ? '#6366f1' : 
                          step.statut === 'EN_ATTENTE' ? '#f59e0b' : '#e2e8f0',
                        color: step.statut === 'EN_ATTENTE' ? '#64748b' : 'white'
                      }}
                    >
                      {step.etape.ordre_etape}
                    </div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{step.etape.lib_etape}</h4>
                      <div className={styles.stepDates}>
                        {formatDate(step.date_debut)} - {formatDate(step.date_fin)}
                      </div>
                      <span className={`${styles.badge} ${getStatusColor(step.statut)}`}>
                        {getStatusIcon(step.statut)}
                        {step.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProcedure.SubstanceAssocieeDemande.length > 0 && (
                <div className={styles.modalSubstances}>
                  <h3 className={styles.modalSubstancesTitle}>Substances concernées</h3>
                  <div className={styles.substancesList}>
                    {selectedProcedure.SubstanceAssocieeDemande.map((sub, index) => (
                      <span key={index} className={styles.substanceBadge}>
                        {sub.substance.nom_subFR}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.modalSecondaryButton}
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  handleViewProcedure(selectedProcedure);
                }}
                className={styles.modalPrimaryButton}
              >
                Voir la procédure
              </button>
            </div>
          </div>
        </div>
      )}

      {showDateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Demande de renouvellement</h2>

            <div className={styles.modalInfoText}>
              <p>Renouvellements restants: {permis.typePermis.nbr_renouv_max - (permis.nombre_renouvellements || 0)}/{permis.typePermis.nbr_renouv_max}</p>
              <p>Vous pouvez effectuer {permis.typePermis.nbr_renouv_max - (permis.nombre_renouvellements || 0)} renouvellement(s) supplémentaire(s)</p>
            </div>

            <h3 className={styles.modalSubtitle}>Choisir une date de demande</h3>

            <input
              type="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className={styles.modalDateInput}
              min={formatDate(new Date())}
            />

            <div className={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowDateModal(false);
                  setSelectedDate(null);
                }}
                className={styles.modalSecondaryButton}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitDate}
                disabled={!selectedDate}
                className={styles.modalPrimaryButton}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {showMaxRenewalModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setShowMaxRenewalModal(false)}
              className={styles.modalCloseButton}
            >
              <XCircle size={20} />
            </button>

            <div className={styles.modalIconWarning}>
              <XCircle size={48} className={styles.warningIcon} />
            </div>

            <h2 className={styles.modalTitle}>Limite de renouvellements atteinte</h2>

            <div className={styles.modalBody}>
              <p>
                <strong>Type de permis:</strong> {permis.typePermis.lib_type} ({permis.typePermis.code_type})
              </p>
              <p>
                <strong>Renouvellements effectués:</strong> {permis.nombre_renouvellements || 0} / {permis.typePermis.nbr_renouv_max}
              </p>
              <div className={styles.modalWarningText}>
                Ce permis a atteint le nombre maximum de renouvellements autorisés.
                Vous ne pouvez pas effectuer de nouveaux renouvellements pour ce permis.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowMaxRenewalModal(false)}
                className={styles.modalPrimaryButton}
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      {showDocumentViewer && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setShowDocumentViewer(false)}
          onDownload={() => handleDocumentDownload(selectedDocument)}
        />
      )}

      {showConfirmationModal && pendingAction && (
        <ActionConfirmationModal
          actionType={pendingAction.type}
          onConfirm={confirmAction}
          onCancel={cancelAction}
          permisDetails={{
            code: permis.code_permis,
            type: permis.typePermis.lib_type,
            titulaire: permis.detenteur?.nom_societeFR || 'Inconnu'
          }}
        />
      )}
</div>
</main>
    </div>
    </div>
    
  );
}

export default PermisViewPage;
