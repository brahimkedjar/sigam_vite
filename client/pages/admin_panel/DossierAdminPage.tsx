import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiX, FiFileText, FiFolder, FiCheck, FiSearch, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './DossierManager.module.css'
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { useViewNavigator } from '../../src/hooks/useViewNavigator';

// Types
interface TypePermis {
  id: number;
  lib_type: string;
  code_type: string;
}

interface TypeProcedure {
  id: number;
  libelle: string;
}

interface Document {
  id_doc: number;
  nom_doc: string;
  description: string;
  format: string;
  taille_doc: string;
  createdAt?: string;
}

interface DossierDocument {
  document: Document;
}

interface Dossier {
  id_dossier: number;
  id_typeproc: number;
  id_typePermis: number;
  remarques?: string;
  typePermis: TypePermis;
  typeProcedure: TypeProcedure;
  dossierDocuments: DossierDocument[];
  createdAt?: string;
}

export default function DossierManager() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [typePermis, setTypePermis] = useState<TypePermis[]>([]);
  const [typeProcedures, setTypeProcedures] = useState<TypeProcedure[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dossiers');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentView, navigateTo } = useViewNavigator('manage_documents');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const DocumentBadge = ({ doc, dossierId, onRemove }: {
    doc: Document,
    dossierId: number,
    onRemove: (dossierId: number, docId: number) => void
  }) => (
    <div className={styles.tooltip}>
      <span className={styles.documentBadge}>
        {doc.nom_doc}
        <button onClick={() => onRemove(dossierId, doc.id_doc)}>
          <FiX size={12} />
        </button>
      </span>
      <div className={styles.tooltipText}>
        <p><strong>Format:</strong> {doc.format}</p>
        <p><strong>Taille:</strong> {doc.taille_doc}</p>
        <p><strong>Description:</strong> {doc.description}</p>
      </div>
    </div>
  );
  // Form states
  const [newDocument, setNewDocument] = useState({
    nom_doc: '',
    description: '',
    format: 'PDF',
    taille_doc: ''
  });

  const [newDossier, setNewDossier] = useState({
    id_typeproc: '',
    id_typePermis: '',
    remarques: ''
  });

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [dossiersRes, docsRes, permisRes, procsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dossiers`),
        axios.get(`${API_URL}/admin/dossiers/documents`),
        axios.get(`${API_URL}/type-permis`),
        axios.get(`${API_URL}/type-procedures`)
      ]);
      setDossiers(dossiersRes.data);
      setDocuments(docsRes.data);
      setTypePermis(permisRes.data);
      setTypeProcedures(procsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dossier operations
  const handleCreateDossier = async () => {
    try {
      await axios.post(`${API_URL}/admin/dossiers`, {
        id_typeproc: Number(newDossier.id_typeproc),
        id_typePermis: Number(newDossier.id_typePermis),
        remarques: newDossier.remarques
      });
      toast.success('Dossier créé avec succès');
      fetchAllData();
      setNewDossier({
        id_typeproc: '',
        id_typePermis: '',
        remarques: ''
      });
    } catch (error) {
      toast.error('Erreur lors de la création du dossier');
      console.error('Error creating dossier:', error);
    }
  };

  const handleUpdateDossier = async () => {
    if (!selectedDossier) return;

    try {
      await axios.put(`${API_URL}/admin/dossiers/${selectedDossier.id_dossier}`, {
        remarques: selectedDossier.remarques
      });
      toast.success('Dossier mis à jour avec succès');
      fetchAllData();
      setSelectedDossier(null);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du dossier');
      console.error('Error updating dossier:', error);
    }
  };

  const handleDeleteDossier = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier?')) {
      try {
        await axios.delete(`${API_URL}/admin/dossiers/${id}`);
        toast.success('Dossier supprimé avec succès');
        fetchAllData();
      } catch (error) {
        toast.error('Erreur lors de la suppression du dossier');
        console.error('Error deleting dossier:', error);
      }
    }
  };

  // Document operations
  const handleAddDocumentToDossier = async (dossierId: number, docId: string) => {
    try {
      await axios.post(`${API_URL}/admin/dossiers/${dossierId}/documents`, {
        id_doc: Number(docId)
      });
      toast.success('Document ajouté au dossier');
      fetchAllData();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du document');
      console.error('Error adding document:', error);
    }
  };

  const handleRemoveDocumentFromDossier = async (dossierId: number, docId: number) => {
    try {
      await axios.delete(`${API_URL}/admin/dossiers/${dossierId}/documents/${docId}`);
      toast.success('Document retiré du dossier');
      fetchAllData();
    } catch (error) {
      toast.error('Erreur lors du retrait du document');
      console.error('Error removing document:', error);
    }
  };

  const handleCreateDocument = async () => {
    try {
      await axios.post(`${API_URL}/admin/dossiers/documents`, newDocument);
      toast.success('Document créé avec succès');
      fetchAllData();
      setNewDocument({
        nom_doc: '',
        description: '',
        format: 'PDF',
        taille_doc: ''
      });
    } catch (error) {
      toast.error('Erreur lors de la création du document');
      console.error('Error creating document:', error);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      try {
        await axios.delete(`${API_URL}/admin/dossiers/documents/${id}`);
        toast.success('Document supprimé avec succès');
        fetchAllData();
      } catch (error) {
        toast.error('Erreur lors de la suppression du document');
        console.error('Error deleting document:', error);
      }
    }
  };

  // Filter functions
  const filteredDossiers = dossiers.filter(dossier =>
    dossier.typePermis.lib_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.typeProcedure.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.id_dossier.toString().includes(searchTerm)
  );

  const filteredDocuments = documents.filter(doc =>
    doc.nom_doc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.id_doc.toString().includes(searchTerm)
  );

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          <div className={styles.breadcrumb}>
            <span>SIGAM</span>
            <FiChevronRight className={styles.breadcrumbArrow} />
            <span>Manage Documents</span>
          </div>

          <div className={styles.container}>
            <div className={styles.contentWrapper}>
              {/* Enhanced Header */}
              <header className={styles.header}>
                <div>
                  <h1 className={styles.headerTitle}>
                    <FiFolder className={styles.headerIcon} />
                    Gestion des Dossiers
                  </h1>
                  <p className={styles.headerSubtitle}>
                    Administration centralisée des dossiers et documents
                  </p>
                </div>

                <div className={styles.searchContainer}>
                  <div className={`${styles.flex} ${styles.itemsCenter}`}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Rechercher un dossier ou document..."
                      className={styles.searchInput}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className={styles.searchClear}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              </header>

              {/* Premium Tabs */}
              <div className={styles.tabsContainer}>
                <button
                  className={`${styles.tab} ${activeTab === 'dossiers' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('dossiers')}
                >
                  <FiFolder className={styles.ml1} />
                  Dossiers
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'documents' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('documents')}
                >
                  <FiFileText className={styles.ml1} />
                  Documents
                </button>
              </div>

              {/* Main Content */}
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                </div>
              ) : (
                <>
                  {/* Creation Card */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>
                        {activeTab === 'dossiers' ? (
                          <>
                            <FiPlus className={styles.ml1} />
                            Créer un nouveau dossier
                          </>
                        ) : (
                          <>
                            <FiFileText className={styles.ml1} />
                            Ajouter un document
                          </>
                        )}
                      </h2>
                    </div>

                    <div className={styles.cardBody}>
                      {/* Creation Card - Glass Morphism Effect */}
                      

                        <div className={styles.cardBody}>
                          {activeTab === 'dossiers' ? (
                            <div className={styles.formGrid}>
                              <div>
                                <label className={styles.formLabel}>Type Permis</label>
                                <select
                                  className={`${styles.formControl} ${styles.formSelect}`}
                                  value={newDossier.id_typePermis}
                                  onChange={(e) => setNewDossier({ ...newDossier, id_typePermis: e.target.value })}
                                >
                                  <option value="">Sélectionner...</option>
                                  {typePermis.map((permis) => (
                                    <option key={`permis-${permis.id}`} value={permis.id}>
                                      {permis.lib_type} ({permis.code_type})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className={styles.formLabel}>Type Procédure</label>
                                <select
                                  className={`${styles.formControl} ${styles.formSelect}`}
                                  value={newDossier.id_typeproc}
                                  onChange={(e) => setNewDossier({ ...newDossier, id_typeproc: e.target.value })}
                                >
                                  <option value="">Sélectionner...</option>
                                  {typeProcedures.map((proc) => (
                                    <option key={`proc-${proc.id}`} value={proc.id}>
                                      {proc.libelle}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className={`${styles.formGrid} md:col-span-2`}>
                                <label className={styles.formLabel}>Remarques</label>
                                <input
                                  type="text"
                                  className={styles.formControl}
                                  placeholder="Ajouter des remarques..."
                                  value={newDossier.remarques}
                                  onChange={(e) => setNewDossier({ ...newDossier, remarques: e.target.value })}
                                />
                              </div>

                              <div className={`${styles.flex} ${styles.justifyEnd} ${styles.mt1}`}>
                                <button
                                  className={`${styles.actionButton} ${styles.addButton} ${styles.withText}`}
                                  onClick={handleCreateDossier}
                                >
                                  <FiPlus className={styles.buttonIcon} />
                                  <span>Créer Dossier</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className={`${styles.formGrid} md:grid-cols-2`}>
                              <div>
                                <label className={styles.formLabel}>Nom du document</label>
                                <input
                                  type="text"
                                  className={styles.formControl}
                                  placeholder="Nom du document"
                                  value={newDocument.nom_doc}
                                  onChange={(e) => setNewDocument({ ...newDocument, nom_doc: e.target.value })}
                                />
                              </div>

                              <div>
                                <label className={styles.formLabel}>Format</label>
                                <select
                                  className={`${styles.formControl} ${styles.formSelect}`}
                                  value={newDocument.format}
                                  onChange={(e) => setNewDocument({ ...newDocument, format: e.target.value })}
                                >
                                  <option value="PDF">PDF</option>
                                  <option value="DOCX">DOCX</option>
                                  <option value="XLSX">XLSX</option>
                                  <option value="JPG">JPG</option>
                                  <option value="PNG">PNG</option>
                                </select>
                              </div>

                              <div className="md:col-span-2">
                                <label className={styles.formLabel}>Description</label>
                                <textarea
                                  className={styles.formControl}
                                  placeholder="Description du document"
                                  rows={3}
                                  value={newDocument.description}
                                  onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                                />
                              </div>

                              <div>
                                <label className={styles.formLabel}>Taille</label>
                                <input
                                  type="text"
                                  className={styles.formControl}
                                  placeholder="Taille (ex: 2MB)"
                                  value={newDocument.taille_doc}
                                  onChange={(e) => setNewDocument({ ...newDocument, taille_doc: e.target.value })}
                                />
                              </div>

                              <div className={`${styles.flex} ${styles.justifyEnd} ${styles.itemsCenter} md:col-span-2`}>
                                <button
                                  className={styles.button + ' ' + styles.buttonSuccess}
                                  onClick={handleCreateDocument}
                                >
                                  <FiPlus className={styles.ml1} />
                                  Créer Document
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  

                  {/* Data Tables */}
                  {activeTab === 'dossiers' ? (
                    <div className={styles.tableContainer}>
                      <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>
                          <FiFolder className={styles.ml1} />
                          Liste des Dossiers
                        </h2>
                        <span className={styles.tableCount}>
                          {filteredDossiers.length} {filteredDossiers.length === 1 ? 'dossier' : 'dossiers'}
                        </span>
                      </div>

                      <div className={styles.responsiveTableWrapper}>
                        <table className={styles.table}>
                          <thead className={styles.tableHead}>
                            <tr>
                              <th className={styles.th}>ID</th>
                              <th className={styles.th}>Type Permis</th>
                              <th className={styles.th}>Type Procédure</th>
                              <th className={styles.th}>Documents</th>
                              <th className={styles.th}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDossiers.length > 0 ? (
                              filteredDossiers.map((dossier) => (
                                <tr key={`dossier-${dossier.id_dossier}`} className={styles.tr}>
                                  <td className={`${styles.td} ${styles.tdPrimary}`}>
                                    #{dossier.id_dossier}
                                  </td>
                                  <td className={styles.td}>
                                    <span className="font-medium">{dossier.typePermis?.lib_type}</span>
                                    <span className="text-gray-400 ml-1">({dossier.typePermis?.code_type})</span>
                                  </td>
                                  <td className={styles.td}>
                                    {dossier.typeProcedure?.libelle}
                                  </td>
                                  <td className={styles.td}>
                                    <div className={styles.documentList}>
                                      {dossier.dossierDocuments?.map(({ document }) => (
                                        <DocumentBadge
                                          key={`doc-${document.id_doc}`}
                                          doc={document}
                                          dossierId={dossier.id_dossier}
                                          onRemove={handleRemoveDocumentFromDossier}
                                        />
                                      ))}
                                    </div>
                                    <div className={styles.mt1}>
                                      <select
                                        className={styles.formControl}
                                        onChange={(e) => handleAddDocumentToDossier(dossier.id_dossier, e.target.value)}
                                        defaultValue=""
                                      >
                                        <option value="" disabled>Ajouter document...</option>
                                        {documents
                                          .filter(doc => !dossier.dossierDocuments?.some(d => d.document.id_doc === doc.id_doc))
                                          .map((doc) => (
                                            <option key={`docopt-${doc.id_doc}`} value={doc.id_doc}>
                                              {doc.nom_doc}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </td>

                                  <td className={styles.td}>
                                    <div className={styles.actionsContainer}>
                                      <button
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                        onClick={() => setSelectedDossier(dossier)}
                                        title="Edit"
                                      >
                                        <FiEdit className={styles.buttonIcon} />
                                      </button>

                                      <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDeleteDossier(dossier.id_dossier)}
                                        title="Delete"
                                      >
                                        <FiTrash2 className={styles.buttonIcon} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className={`${styles.td} text-center`}>
                                  Aucun dossier trouvé
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.tableContainer}>
                      <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>
                          <FiFileText className={styles.ml1} />
                          Liste des Documents
                        </h2>
                        <span className={styles.tableCount}>
                          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
                        </span>
                      </div>

                      <div className={styles.responsiveTableWrapper}>
                        <table className={styles.table}>
                          <thead className={styles.tableHead}>
                            <tr>
                              <th className={styles.th}>ID</th>
                              <th className={styles.th}>Nom</th>
                              <th className={styles.th}>Description</th>
                              <th className={styles.th}>Format</th>
                              <th className={styles.th}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDocuments.length > 0 ? (
                              filteredDocuments.map((doc) => (
                                <tr key={`doc-${doc.id_doc}`} className={styles.tr}>
                                  <td className={`${styles.td} ${styles.tdPrimary}`}>
                                    #{doc.id_doc}
                                  </td>
                                  <td className={`${styles.td} ${styles.tdPrimary}`}>
                                    {doc.nom_doc}
                                  </td>
                                  <td className={styles.td}>
                                    <div className={styles.tooltip}>
                                      <div className={styles.lineClamp2}>
                                        {doc.description || 'Aucune description'}
                                      </div>
                                      {doc.description && doc.description.length > 50 && (
                                        <div className={styles.tooltipText}>
                                          {doc.description}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className={styles.td}>
                                    <span className={`${styles.badge} ${doc.format === 'PDF' ? styles.badgeRed :
                                        doc.format === 'DOCX' ? styles.badgeBlue :
                                          doc.format === 'XLSX' ? styles.badgeGreen :
                                            styles.badgeGray
                                      }`}>
                                      {doc.format}
                                    </span>
                                  </td>

                                  <td className={styles.td}>
                                    <button
                                      onClick={() => handleDeleteDocument(doc.id_doc)}
                                      className={`${styles.actionButton} ${styles.deleteButton}`}
                                      title="Supprimer"
                                    >
                                      <FiTrash2 size={18} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className={`${styles.td} text-center`}>
                                  Aucun document trouvé
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Enhanced Modal */}
              {selectedDossier && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                      <h3 className={styles.modalTitle}>Modifier Dossier</h3>
                      <button
                        className={styles.modalClose}
                        onClick={() => setSelectedDossier(null)}
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className={styles.modalBody}>
                      <div className="space-y-4">
                        <div>
                          <label className={styles.formLabel}>Type Permis</label>
                          <p className="mt-1 text-gray-900 font-medium">
                            {selectedDossier.typePermis.lib_type} ({selectedDossier.typePermis.code_type})
                          </p>
                        </div>

                        <div>
                          <label className={styles.formLabel}>Type Procédure</label>
                          <p className="mt-1 text-gray-900 font-medium">
                            {selectedDossier.typeProcedure.libelle}
                          </p>
                        </div>

                        <div>
                          <label className={styles.formLabel}>Remarques</label>
                          <textarea
                            className={styles.formControl}
                            rows={3}
                            value={selectedDossier.remarques || ''}
                            onChange={(e) => setSelectedDossier({
                              ...selectedDossier,
                              remarques: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.modalFooter}>
                      <button
                        type="button"
                        className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                        onClick={() => setSelectedDossier(null)}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
                        onClick={handleUpdateDossier}
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}