import React, { useState, useEffect } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TitresMiniers.module.css';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface TypePermis {
  id: number;
  lib_type: string;
  code_type: string;
  regime: string;
  duree_initiale: number;
  nbr_renouv_max: number;
  duree_renouv: number;
  delai_renouv: number;
  superficie_max?: number;
  barems: DroitOption[]; 
  taxe: TaxeOption; 
}

interface StatutPermis {
  id: number;
  lib_statut: string;
  description: string;
}

interface TypeProcedure {
  id: number;
  libelle: string;
  description?: string;
}

interface DroitOption {
  id: number;
  montant_droit_etab: number;
  produit_attribution: number; // Changed from string to number
}

// Update the TaxeOption interface
interface TaxeOption {
  id: number;
  droit_fixe: number;
  periode_initiale: number;
  premier_renouv: number;
  autre_renouv: number;
  devise: string;
}

const TitresMiniers = () => {
  const [typesPermis, setTypesPermis] = useState<TypePermis[]>([]);
  const [statutsPermis, setStatutsPermis] = useState<StatutPermis[]>([]);
  const [typeProcedures, setTypeProcedures] = useState<TypeProcedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'types' | 'statuts' | 'procedures'>('types');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Form states
  const [typePermisForm, setTypePermisForm] = useState({
  lib_type: '',
  code_type: '',
  regime: '',
  duree_initiale: 0,
  nbr_renouv_max: 0,
  duree_renouv: 0,
  delai_renouv: 0,
  superficie_max: 0,
  id_taxe: 0, // Keep only taxe, remove id_droit
});

  const [droitsOptions, setDroitsOptions] = useState<DroitOption[]>([]);
  const [taxesOptions, setTaxesOptions] = useState<TaxeOption[]>([]);

  const [statutPermisForm, setStatutPermisForm] = useState({
    lib_statut: '',
    description: '',
  });

  const [typeProcedureForm, setTypeProcedureForm] = useState({
    libelle: '',
    description: '',
  });

  useEffect(() => {
  const fetchOptions = async () => {
    try {
      const [droitsRes, taxesRes] = await Promise.all([
        fetch(`${apiURL}/conf/barem-produit-droit`),
        fetch(`${apiURL}/conf/superficiaire-bareme`)
      ]);
      
      const [droitsData, taxesData] = await Promise.all([
        droitsRes.json(),
        taxesRes.json()
      ]);
      
      setDroitsOptions(droitsData);
      setTaxesOptions(taxesData);
    } catch (err) {
      toast.error('Erreur lors du chargement des options de droits et taxes');
      console.error('Failed to fetch options:', err);
    }
  };
  
  fetchOptions();
}, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [typesRes, statutsRes, proceduresRes] = await Promise.all([
        fetch(`${apiURL}/conf/types-permis`),
        fetch(`${apiURL}/conf/statuts-permis`),
        fetch(`${apiURL}/conf/type-procedures`),
      ]);

      const [typesData, statutsData, proceduresData] = await Promise.all([
        typesRes.json(),
        statutsRes.json(),
        proceduresRes.json(),
      ]);

      setTypesPermis(typesData);
      setStatutsPermis(statutsData);
      setTypeProcedures(proceduresData);
    } catch (err) {
      setError('Échec du chargement des données');
      toast.error('Échec du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypePermisSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const method = currentForm === 'create' ? 'POST' : 'PUT';
    const url = currentForm === 'create' ? `${apiURL}/conf/types-permis` : `${apiURL}/conf/types-permis/${currentItem.id}`;

    // Prepare data without the barems (droit) field
    const requestData = {
      ...typePermisForm,
      // Remove id_droit from the request
    };

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    fetchData();
    setIsModalOpen(false);
    toast.success(currentForm === 'create' ? 'Type de titre créé avec succès' : 'Type de titre modifié avec succès');
  } catch (err: unknown) {
    let message = 'Erreur inconnue';
    if (err instanceof Error) {
      message = err.message;
    }
    setError('Échec de l\'enregistrement du type de permis');
    toast.error(`Échec de l'enregistrement du type de permis: ${message}`);
    console.error('Detailed error:', err);
  }
};

  const handleStatutPermisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/conf/statuts-permis` : `${apiURL}/conf/statuts-permis/${currentItem.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statutPermisForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
      toast.success(currentForm === 'create' ? 'Statut créé avec succès' : 'Statut modifié avec succès');
    } catch (err: unknown) {
  let message = 'Erreur inconnue';
  if (err instanceof Error) {
    message = err.message;
  }

  setError('Échec de l\'enregistrement du statut de permis');
  toast.error(`Échec de l'enregistrement du statut de permis: ${message}`);
  console.error(err);
}

  };

  const handleTypeProcedureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/conf/type-procedures` : `${apiURL}/conf/type-procedures/${currentItem.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typeProcedureForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
      toast.success(currentForm === 'create' ? 'Type de procédure créé avec succès' : 'Type de procédure modifié avec succès');
    } catch (err) {
  setError("Échec de l'enregistrement du type de procédure");

  if (err instanceof Error) {
    toast.error(`Échec de l'enregistrement du type de procédure: ${err.message}`);
    console.error(err);
  } else {
    toast.error("Échec de l'enregistrement du type de procédure: erreur inconnue");
    console.error(err);
  }
}

  };

  const handleDelete = async (type: 'type' | 'statut' | 'procedure', id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      let endpoint = '';
      if (type === 'type') endpoint = `${apiURL}/conf/types-permis/${id}`;
      if (type === 'statut') endpoint = `${apiURL}/conf/statuts-permis/${id}`;
      if (type === 'procedure') endpoint = `${apiURL}/conf/type-procedures/${id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      fetchData();
      toast.success('Élément supprimé avec succès');
    } catch (err) {
  setError("Échec de la suppression de l'élément");

  if (err instanceof Error) {
    toast.error(`Échec de la suppression de l'élément: ${err.message}`);
    console.error(err);
  } else {
    toast.error("Échec de la suppression de l'élément: Erreur inconnue");
    console.error(err);
  }
}

  };

  const openCreateModal = (tab: 'types' | 'statuts' | 'procedures') => {
    setCurrentForm('create');
    setCurrentItem(null);
    setActiveTab(tab);
    setIsModalOpen(true);

    // Reset forms
    setTypePermisForm({
      id_taxe: 0,
      lib_type: '',
      code_type: '',
      regime: '',
      duree_initiale: 0,
      nbr_renouv_max: 0,
      duree_renouv: 0,
      delai_renouv: 0,
      superficie_max: 0,
    });

    setStatutPermisForm({
      lib_statut: '',
      description: '',
    });

    setTypeProcedureForm({
      libelle: '',
      description: '',
    });
  };

  const openEditModal = (tab: 'types' | 'statuts' | 'procedures', item: any) => {
    setCurrentForm('edit');
    setCurrentItem(item);
    setActiveTab(tab);
    setIsModalOpen(true);

    if (tab === 'types') {
      setTypePermisForm({
        id_taxe: item.id_taxe,
        lib_type: item.lib_type,
        code_type: item.code_type,
        regime: item.regime,
        duree_initiale: item.duree_initiale,
        nbr_renouv_max: item.nbr_renouv_max,
        duree_renouv: item.duree_renouv,
        delai_renouv: item.delai_renouv,
        superficie_max: item.superficie_max || 0,
      });
    } else if (tab === 'statuts') {
      setStatutPermisForm({
        lib_statut: item.lib_statut,
        description: item.description,
      });
    } else if (tab === 'procedures') {
      setTypeProcedureForm({
        libelle: item.libelle,
        description: item.description || '',
      });
    }
  };

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'types') {
      return typesPermis.filter(
        item =>
          item.lib_type.toLowerCase().includes(term) ||
          item.code_type.toLowerCase().includes(term)
      );
    } else if (activeTab === 'statuts') {
      return statutsPermis.filter(item =>
        item.lib_statut.toLowerCase().includes(term)
      );
    } else {
      return typeProcedures.filter(item =>
        item.libelle.toLowerCase().includes(term)
      );
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h2>Configuration des Titres Miniers</h2>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'types' ? styles.active : ''}`}
          onClick={() => setActiveTab('types')}
        >
          Types de Titres
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'statuts' ? styles.active : ''}`}
          onClick={() => setActiveTab('statuts')}
        >
          Statuts
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'procedures' ? styles.active : ''}`}
          onClick={() => setActiveTab('procedures')}
        >
          Types de Procédures
        </button>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.addButton}
          onClick={() => openCreateModal(activeTab)}
        >
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'types' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucun type de titre trouvé</div>
            ) : (
              (filteredItems() as TypePermis[]).map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.lib_type} ({item.code_type})</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('types', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('type', item.id)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      >
                        {expandedItem === item.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Régime:</span>
                        <span>{item.regime}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Durée Initiale:</span>
                        <span>{item.duree_initiale} ans</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Renouvellements Max:</span>
                        <span>{item.nbr_renouv_max}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Durée Renouvellement:</span>
                        <span>{item.duree_renouv} ans</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Délai Renouvellement:</span>
                        <span>{item.delai_renouv} jours</span>
                      </div>
                      {item.superficie_max && (
                        <div className={styles.detailRow}>
                          <span>Superficie Max:</span>
                          <span>{item.superficie_max} Ha</span>
                        </div>
                      )}
                      <div className={styles.detailRow}>
      <span>Taxe Annuelle:</span>
      <span>{item.taxe ? `${item.taxe.droit_fixe} ${item.taxe.devise}` : 'Non définie'}</span>
    </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'statuts' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucun statut trouvé</div>
            ) : (
              (filteredItems() as StatutPermis[]).map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.lib_statut}</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('statuts', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('statut', item.id)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      >
                        {expandedItem === item.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Description:</span>
                        <span>{item.description}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'procedures' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucune procédure trouvée</div>
            ) : (
              (filteredItems() as TypeProcedure[]).map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.libelle}</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('procedures', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('procedure', item.id)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      >
                        {expandedItem === item.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id && item.description && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Description:</span>
                        <span>{item.description}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>
                {currentForm === 'create'
                  ? `Ajouter un ${activeTab === 'types' ? 'Type de Titre' : activeTab === 'statuts' ? 'Statut' : 'Type de Procédure'}`
                  : `Modifier ${activeTab === 'types' ? 'Type de Titre' : activeTab === 'statuts' ? 'Statut' : 'Type de Procédure'}`}
              </h3>
              <button
                className={styles.closeModal}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalContent}>
              {activeTab === 'types' && (
                <form onSubmit={handleTypePermisSubmit}>
                  
                  <div className={styles.formGroup}>
                    <label>Droit fixe Annuelle</label>
                    <select
                      value={typePermisForm.id_taxe}
                      onChange={(e) =>
                        setTypePermisForm({ ...typePermisForm, id_taxe: Number(e.target.value) })
                      }
                      required
                    >
                      <option value="">Sélectionner une taxe</option>
                      {taxesOptions.map((taxe) => (
                        <option key={taxe.id} value={taxe.id}>
                          {`${taxe.droit_fixe} ${taxe.devise}, initiale: ${taxe.periode_initiale}, 1er Renv:${taxe.premier_renouv}, 2eme Renv:${taxe.autre_renouv} `}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Libellé du Type</label>
                    <input
                      type="text"
                      value={typePermisForm.lib_type}
                      onChange={(e) =>
                        setTypePermisForm({ ...typePermisForm, lib_type: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Code du Type</label>
                    <input
                      type="text"
                      value={typePermisForm.code_type}
                      onChange={(e) =>
                        setTypePermisForm({ ...typePermisForm, code_type: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Régime</label>
                    <select
                      value={typePermisForm.regime}
                      onChange={(e) =>
                        setTypePermisForm({ ...typePermisForm, regime: e.target.value })
                      }
                      required
                    >
                      <option value="">Sélectionner un régime</option>
                      <option value="mines">Mines</option>
                      <option value="carriere">Carrière</option>
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Durée Initiale (ans)</label>
                      <input
                        type="number"
                        value={typePermisForm.duree_initiale}
                        onChange={(e) =>
                          setTypePermisForm({ ...typePermisForm, duree_initiale: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Renouvellements Max</label>
                      <input
                        type="number"
                        value={typePermisForm.nbr_renouv_max}
                        onChange={(e) =>
                          setTypePermisForm({ ...typePermisForm, nbr_renouv_max: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Durée Renouvellement (ans)</label>
                      <input
                        type="number"
                        value={typePermisForm.duree_renouv}
                        onChange={(e) =>
                          setTypePermisForm({ ...typePermisForm, duree_renouv: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Délai Renouvellement (jours)</label>
                      <input
                        type="number"
                        value={typePermisForm.delai_renouv}
                        onChange={(e) =>
                          setTypePermisForm({ ...typePermisForm, delai_renouv: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Superficie Max (Ha)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={typePermisForm.superficie_max}
                      onChange={(e) =>
                        setTypePermisForm({ ...typePermisForm, superficie_max: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </button>
                    <button type="submit" className={styles.saveButton}>
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'statuts' && (
                <form onSubmit={handleStatutPermisSubmit}>
                  <div className={styles.formGroup}>
                    <label>Libellé du Statut</label>
                    <input
                      type="text"
                      value={statutPermisForm.lib_statut}
                      onChange={(e) =>
                        setStatutPermisForm({ ...statutPermisForm, lib_statut: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={statutPermisForm.description}
                      onChange={(e) =>
                        setStatutPermisForm({ ...statutPermisForm, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </button>
                    <button type="submit" className={styles.saveButton}>
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'procedures' && (
                <form onSubmit={handleTypeProcedureSubmit}>
                  <div className={styles.formGroup}>
                    <label>Libellé de la Procédure</label>
                    <input
                      type="text"
                      value={typeProcedureForm.libelle}
                      onChange={(e) =>
                        setTypeProcedureForm({ ...typeProcedureForm, libelle: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={typeProcedureForm.description}
                      onChange={(e) =>
                        setTypeProcedureForm({ ...typeProcedureForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </button>
                    <button type="submit" className={styles.saveButton}>
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitresMiniers;