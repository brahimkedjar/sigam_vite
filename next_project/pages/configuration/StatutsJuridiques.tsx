import React, { useState, useEffect } from 'react';
import styles from './StatutsJuridiques.module.css';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface StatutJuridique {
  id_statutJuridique: number;
  code_statut: string;
  statut_fr: string;
  statut_ar: string;
}

const StatutsJuridiques = () => {
  const [statuts, setStatuts] = useState<StatutJuridique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<StatutJuridique | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Form state
  const [formData, setFormData] = useState({
    code_statut: '',
    statut_fr: '',
    statut_ar: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiURL}/statuts-juridiques`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setStatuts(data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' 
        ? `${apiURL}/statuts-juridiques`
        : `${apiURL}/statuts-juridiques/${currentItem?.id_statutJuridique}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save statut juridique');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce statut juridique ?')) return;

    try {
      const response = await fetch(`${apiURL}/statuts-juridiques/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      fetchData();
    } catch (err) {
      setError('Failed to delete statut juridique');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentForm('create');
    setCurrentItem(null);
    setFormData({
      code_statut: '',
      statut_fr: '',
      statut_ar: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: StatutJuridique) => {
    setCurrentForm('edit');
    setCurrentItem(item);
    setFormData({
      code_statut: item.code_statut,
      statut_fr: item.statut_fr,
      statut_ar: item.statut_ar,
    });
    setIsModalOpen(true);
  };

  const filteredStatuts = statuts.filter(
    item =>
      item.code_statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.statut_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.statut_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Configuration des Statuts Juridiques</h2>
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

      <div className={styles.actions}>
        <button
          className={styles.addButton}
          onClick={openCreateModal}
        >
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.tableContainer}>
          {filteredStatuts.length === 0 ? (
            <div className={styles.noResults}>Aucun statut juridique trouvé</div>
          ) : (
            filteredStatuts.map((item) => (
              <div key={item.id_statutJuridique} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{item.statut_fr} ({item.code_statut})</h3>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(item)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(item.id_statutJuridique)}
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      className={styles.expandButton}
                      onClick={() => setExpandedItem(expandedItem === item.id_statutJuridique ? null : item.id_statutJuridique)}
                    >
                      {expandedItem === item.id_statutJuridique ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>
                {expandedItem === item.id_statutJuridique && (
                  <div className={styles.cardDetails}>
                    <div className={styles.detailRow}>
                      <span>Code:</span>
                      <span>{item.code_statut}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Statut (FR):</span>
                      <span>{item.statut_fr}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Statut (AR):</span>
                      <span>{item.statut_ar}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>
                {currentForm === 'create'
                  ? 'Ajouter un Statut Juridique'
                  : 'Modifier Statut Juridique'}
              </h3>
              <button
                className={styles.closeModal}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Code Statut</label>
                  <input
                    type="text"
                    value={formData.code_statut}
                    onChange={(e) =>
                      setFormData({ ...formData, code_statut: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Statut (Français)</label>
                  <input
                    type="text"
                    value={formData.statut_fr}
                    onChange={(e) =>
                      setFormData({ ...formData, statut_fr: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Statut (Arabe)</label>
                  <input
                    type="text"
                    value={formData.statut_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, statut_ar: e.target.value })
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatutsJuridiques;