import React, { useState, useEffect } from 'react';
import styles from './substances.module.css';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Substance {
  id_sub: number;
  nom_subFR: string;
  nom_subAR: string;
  categorie_sub: string;
  redevance?: RedevanceBareme;
}

interface RedevanceBareme {
  id_redevance: number;
  taux_redevance: number;
  valeur_marchande: number;
  unite: string;
  devise: string;
  description: string;
}

const Substances = () => {
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [redevances, setRedevances] = useState<RedevanceBareme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'substances' | 'redevances'>('substances');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Form states
  const [substanceForm, setSubstanceForm] = useState({
    nom_subFR: '',
    nom_subAR: '',
    categorie_sub: '',
    id_redevance: '',
  });

  const [redevanceForm, setRedevanceForm] = useState({
    taux_redevance: 0,
    valeur_marchande: 0,
    unite: '',
    devise: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch substances with their redevance
      const substancesRes = await fetch(`${apiURL}/substances?include=redevance`);
      const substancesData = await substancesRes.json();

      // Fetch all redevances separately
      const redevancesRes = await fetch(`${apiURL}/redevances`);
      const redevancesData = await redevancesRes.json();

      setSubstances(substancesData);
      setRedevances(redevancesData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubstanceSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const method = currentForm === 'create' ? 'POST' : 'PUT';
    const url = currentForm === 'create' ? `${apiURL}/substances` : `${apiURL}/substances/${currentItem.id_sub}`;

    const payload = {
      ...substanceForm,
      id_redevance: substanceForm.id_redevance ? parseInt(substanceForm.id_redevance) : null,
    };

    console.log('Sending payload:', payload); // Debug log

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json(); // Get the actual error message
    
    if (!response.ok) {
      throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    toast.success('Substance saved successfully!');
    fetchData();
    setIsModalOpen(false);
    
  } catch (err) {
    const errorMessage = (err as Error).message;
    setError('Failed to save substance: ' + errorMessage);
    toast.error(`Failed to save substance: ${errorMessage}`);
    console.error('Submission error:', err);
  }
};

  const handleRedevanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/redevances` : `${apiURL}/redevances/${currentItem.id_redevance}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(redevanceForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save royalty rate');
      console.error(err);
    }
  };

  const handleDelete = async (type: 'substance' | 'redevance', id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoint = type === 'substance' ? `${apiURL}/substances/${id}` : `${apiURL}/redevances/${id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      fetchData();
    } catch (err) {
      setError(`Failed to delete ${type}`);
      console.error(err);
    }
  };

  const openCreateModal = (tab: 'substances' | 'redevances') => {
    setCurrentForm('create');
    setCurrentItem(null);
    setActiveTab(tab);
    setIsModalOpen(true);

    // Reset forms
    if (tab === 'substances') {
      setSubstanceForm({
        nom_subFR: '',
        nom_subAR: '',
        categorie_sub: '',
        id_redevance: '',
      });
    } else {
      setRedevanceForm({
        taux_redevance: 0,
        valeur_marchande: 0,
        unite: '',
        devise: '',
        description: '',
      });
    }
  };

  const openEditModal = (tab: 'substances' | 'redevances', item: any) => {
    setCurrentForm('edit');
    setCurrentItem(item);
    setActiveTab(tab);
    setIsModalOpen(true);

    if (tab === 'substances') {
      setSubstanceForm({
        nom_subFR: item.nom_subFR,
        nom_subAR: item.nom_subAR,
        categorie_sub: item.categorie_sub,
        id_redevance: item.redevance?.id_redevance?.toString() || '',
      });
    } else {
      setRedevanceForm({
        taux_redevance: item.taux_redevance,
        valeur_marchande: item.valeur_marchande,
        unite: item.unite,
        devise: item.devise,
        description: item.description,
      });
    }
  };

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'substances') {
      return substances.filter(
        item =>
          item.nom_subFR.toLowerCase().includes(term) ||
          item.nom_subAR.toLowerCase().includes(term) ||
          item.categorie_sub.toLowerCase().includes(term)
      );
    } else {
      return redevances.filter(item =>
        item.description.toLowerCase().includes(term) ||
        item.unite.toLowerCase().includes(term)
      );
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Configuration des Substances</h2>
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
          className={`${styles.tab} ${activeTab === 'substances' ? styles.active : ''}`}
          onClick={() => setActiveTab('substances')}
        >
          Substances
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'redevances' ? styles.active : ''}`}
          onClick={() => setActiveTab('redevances')}
        >
          Taux de Redevance
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
        {activeTab === 'substances' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucune substance trouvée</div>
            ) : (
              (filteredItems() as Substance[]).map((item) => (
                <div key={item.id_sub} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.nom_subFR} / {item.nom_subAR}</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('substances', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('substance', item.id_sub)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id_sub ? null : item.id_sub)}
                      >
                        {expandedItem === item.id_sub ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id_sub && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Nom (FR):</span>
                        <span>{item.nom_subFR}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Nom (AR):</span>
                        <span>{item.nom_subAR}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Catégorie:</span>
                        <span>{item.categorie_sub}</span>
                      </div>
                      {item.redevance && (
                        <>
                          <div className={styles.detailRow}>
                            <span>Taux de Redevance:</span>
                            <span>{item.redevance.taux_redevance}%</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span>Valeur Marchande:</span>
                            <span>{item.redevance.valeur_marchande} {item.redevance.devise}/{item.redevance.unite}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'redevances' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucun taux de redevance trouvé</div>
            ) : (
              (filteredItems() as RedevanceBareme[]).map((item) => (
                <div key={item.id_redevance} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.description}</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('redevances', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('redevance', item.id_redevance)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id_redevance ? null : item.id_redevance)}
                      >
                        {expandedItem === item.id_redevance ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id_redevance && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Taux:</span>
                        <span>{item.taux_redevance}%</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Valeur Marchande:</span>
                        <span>{item.valeur_marchande} {item.devise}/{item.unite}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Unité:</span>
                        <span>{item.unite}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Devise:</span>
                        <span>{item.devise}</span>
                      </div>
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
                  ? `Ajouter ${activeTab === 'substances' ? 'une Substance' : 'un Taux de Redevance'}`
                  : `Modifier ${activeTab === 'substances' ? 'la Substance' : 'le Taux de Redevance'}`}
              </h3>
              <button
                className={styles.closeModal}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalContent}>
              {activeTab === 'substances' && (
                <form onSubmit={handleSubstanceSubmit}>
                  <div className={styles.formGroup}>
                    <label>Nom (Français)</label>
                    <input
                      type="text"
                      value={substanceForm.nom_subFR}
                      onChange={(e) =>
                        setSubstanceForm({ ...substanceForm, nom_subFR: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nom (Arabe)</label>
                    <input
                      type="text"
                      value={substanceForm.nom_subAR}
                      onChange={(e) =>
                        setSubstanceForm({ ...substanceForm, nom_subAR: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Catégorie</label>
                    <input
                      type="text"
                      value={substanceForm.categorie_sub}
                      onChange={(e) =>
                        setSubstanceForm({ ...substanceForm, categorie_sub: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Taux de Redevance Associé</label>
                    <select
                      value={substanceForm.id_redevance}
                      onChange={(e) =>
                        setSubstanceForm({ ...substanceForm, id_redevance: e.target.value })
                      }
                    >
                      <option value="">Sélectionner un taux</option>
                      {redevances.map(redevance => (
                        <option key={redevance.id_redevance} value={redevance.id_redevance}>
                          {redevance.description} ({redevance.taux_redevance}%)
                        </option>
                      ))}
                    </select>
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

              {activeTab === 'redevances' && (
                <form onSubmit={handleRedevanceSubmit}>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <input
                      type="text"
                      value={redevanceForm.description}
                      onChange={(e) =>
                        setRedevanceForm({ ...redevanceForm, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Taux de Redevance (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={redevanceForm.taux_redevance}
                        onChange={(e) =>
                          setRedevanceForm({ ...redevanceForm, taux_redevance: parseFloat(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Valeur Marchande</label>
                      <input
                        type="number"
                        step="0.01"
                        value={redevanceForm.valeur_marchande}
                        onChange={(e) =>
                          setRedevanceForm({ ...redevanceForm, valeur_marchande: parseFloat(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Unité</label>
                      <input
                        type="text"
                        value={redevanceForm.unite}
                        onChange={(e) =>
                          setRedevanceForm({ ...redevanceForm, unite: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Devise</label>
                      <input
                        type="text"
                        value={redevanceForm.devise}
                        onChange={(e) =>
                          setRedevanceForm({ ...redevanceForm, devise: e.target.value })
                        }
                        required
                      />
                    </div>
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

export default Substances;