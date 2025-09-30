import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './TaxeSuperficiaireDroit.module.css';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface SuperficiaireBareme {
  id: number;
  droit_fixe: number;
  periode_initiale: number;
  premier_renouv: number;
  autre_renouv: number;
  devise: string;
}

interface TypePermis {
  id: number;
  lib_type: string;
  code_type: string;
  regime: string;
}

interface TypeProcedure {
  id: number;
  libelle: string;
  description: string;
}

interface BaremProduitDroit {
  id: number;
  montant_droit_etab: number;
  produit_attribution: number;
  typePermisId: number;
  typeProcedureId: number;
  typePermis?: TypePermis;
  typeProcedure?: TypeProcedure;
}

const TaxeSuperficiaireDroit = () => {
  const [superficiaireBaremes, setSuperficiaireBaremes] = useState<SuperficiaireBareme[]>([]);
  const [baremProduitDroits, setBaremProduitDroits] = useState<BaremProduitDroit[]>([]);
  const [typePermisList, setTypePermisList] = useState<TypePermis[]>([]);
  const [typeProcedureList, setTypeProcedureList] = useState<TypeProcedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'taxe' | 'droit'>('taxe');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Form states
  const [superficiaireForm, setSuperficiaireForm] = useState({
    droit_fixe: 0,
    periode_initiale: 0,
    premier_renouv: 0,
    autre_renouv: 0,
    devise: 'DZD',
  });

  const [baremProduitForm, setBaremProduitForm] = useState({
    montant_droit_etab: 0,
    produit_attribution: 0,
    typePermisId: 0,
    typeProcedureId: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [taxeRes, droitRes, permisRes, procedureRes] = await Promise.all([
        fetch(`${apiURL}/conf/superficiaire-bareme`),
        fetch(`${apiURL}/conf/barem-produit-droit`),
        fetch(`${apiURL}/conf/types-permis`),
        fetch(`${apiURL}/conf/type-procedures`),
      ]);

      const [taxeData, droitData, permisData, procedureData] = await Promise.all([
        taxeRes.json(),
        droitRes.json(),
        permisRes.json(),
        procedureRes.json(),
      ]);

      setSuperficiaireBaremes(taxeData);
      setBaremProduitDroits(droitData);
      setTypePermisList(permisData);
      setTypeProcedureList(procedureData);
    } catch (err) {
      setError('Échec du chargement des données');
      toast.error('Échec du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuperficiaireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' 
        ? `${apiURL}/conf/superficiaire-bareme`
        : `${apiURL}/conf/superficiaire-bareme/${currentItem.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(superficiaireForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'Operation failed');
      }

      fetchData();
      setIsModalOpen(false);
      toast.success(currentForm === 'create' ? 'Taxe superficiaire créée avec succès' : 'Taxe superficiaire modifiée avec succès');
    } catch (err) {
      setError('Échec de l\'enregistrement de la taxe superficiaire');
      toast.error(`Échec de l'enregistrement de la taxe superficiaire: ${(err as Error).message}`);
      console.error(err);
    }
  };

  const handleBaremProduitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' 
        ? `${apiURL}/conf/barem-produit-droit`
        : `${apiURL}/conf/barem-produit-droit/${currentItem.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baremProduitForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'Operation failed');
      }

      fetchData();
      setIsModalOpen(false);
      toast.success(currentForm === 'create' ? 'Barem produit droit créé avec succès' : 'Barem produit droit modifié avec succès');
    } catch (err) {
      setError('Échec de l\'enregistrement du barem produit droit');
      toast.error(`Échec de l'enregistrement du barem produit droit: ${(err as Error).message}`);
      console.error(err);
    }
  };

  const handleDelete = async (type: 'taxe' | 'droit', id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const endpoint = type === 'taxe' 
        ? `${apiURL}/conf/superficiaire-bareme/${id}` 
        : `${apiURL}/conf/barem-produit-droit/${id}`;

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

  const openCreateModal = (tab: 'taxe' | 'droit') => {
    setCurrentForm('create');
    setCurrentItem(null);
    setActiveTab(tab);
    setIsModalOpen(true);

    // Reset forms
    if (tab === 'taxe') {
      setSuperficiaireForm({
        droit_fixe: 0,
        periode_initiale: 0,
        premier_renouv: 0,
        autre_renouv: 0,
        devise: 'DZD',
      });
    } else {
      setBaremProduitForm({
        montant_droit_etab: 0,
        produit_attribution: 0,
        typePermisId: typePermisList[0]?.id || 0,
        typeProcedureId: typeProcedureList[0]?.id || 0,
      });
    }
  };

  const openEditModal = (tab: 'taxe' | 'droit', item: any) => {
    setCurrentForm('edit');
    setCurrentItem(item);
    setActiveTab(tab);
    setIsModalOpen(true);

    if (tab === 'taxe') {
      setSuperficiaireForm({
        droit_fixe: item.droit_fixe,
        periode_initiale: item.periode_initiale,
        premier_renouv: item.premier_renouv,
        autre_renouv: item.autre_renouv,
        devise: item.devise,
      });
    } else {
      setBaremProduitForm({
        montant_droit_etab: item.montant_droit_etab,
        produit_attribution: item.produit_attribution,
        typePermisId: item.typePermisId,
        typeProcedureId: item.typeProcedureId,
      });
    }
  };



  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'taxe') {
      return superficiaireBaremes.filter(item =>
        item.devise.toLowerCase().includes(term) ||
        item.droit_fixe.toString().includes(term)
      );
    } else {
      return baremProduitDroits.filter(item =>
        item.montant_droit_etab.toString().includes(term) ||
        item.produit_attribution.toString().includes(term) ||
        (item.typePermis?.lib_type && item.typePermis.lib_type.toLowerCase().includes(term)) ||
        (item.typeProcedure?.libelle && item.typeProcedure.libelle.toLowerCase().includes(term))
      );
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Configuration des Taxes et Droits</h2>
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
          className={`${styles.tab} ${activeTab === 'taxe' ? styles.active : ''}`}
          onClick={() => setActiveTab('taxe')}
        >
          Taxe Superficiaire
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'droit' ? styles.active : ''}`}
          onClick={() => setActiveTab('droit')}
        >
          Barem Produit Droit
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
        {activeTab === 'taxe' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucune taxe superficiaire trouvée</div>
            ) : (
              (filteredItems() as SuperficiaireBareme[]).map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Taxe: {item.droit_fixe} {item.devise}</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('taxe', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('taxe', item.id)}
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
                        <span>Période Initiale:</span>
                        <span>{item.periode_initiale} DZD</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>1er Renouvellement:</span>
                        <span>{item.premier_renouv} DZD</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Autres Renouvellements:</span>
                        <span>{item.autre_renouv} DZD</span>
                      </div>

                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'droit' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucun barem produit droit trouvé</div>
            ) : (
              (filteredItems() as BaremProduitDroit[]).map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Droit: {item.montant_droit_etab} DZD</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('droit', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('droit', item.id)}
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
                        <span>Produit Attribution:</span>
                        <span>{item.produit_attribution}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Type Permis:</span>
                        <span>{item.typePermis?.lib_type || 'N/A'}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Type Procédure:</span>
                        <span>{item.typeProcedure?.libelle || 'N/A'}</span>
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
                  ? `Ajouter ${activeTab === 'taxe' ? 'une Taxe Superficiaire' : 'un Barem Produit Droit'}`
                  : `Modifier ${activeTab === 'taxe' ? 'la Taxe Superficiaire' : 'le Barem Produit Droit'}`}
              </h3>
              <button
                className={styles.closeModal}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalContent}>
              {activeTab === 'taxe' && (
                <form onSubmit={handleSuperficiaireSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Droit Fixe</label>
                      <input
                        type="number"
                        step="0.01"
                        value={superficiaireForm.droit_fixe}
                        onChange={(e) =>
                          setSuperficiaireForm({ ...superficiaireForm, droit_fixe: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Devise</label>
                      <select
                        value={superficiaireForm.devise}
                        onChange={(e) =>
                          setSuperficiaireForm({ ...superficiaireForm, devise: e.target.value })
                        }
                        required
                      >
                        <option value="DZD">DZD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Période Initiale</label>
                      <input
                        type="number"
                        step="0.01"
                        value={superficiaireForm.periode_initiale}
                        onChange={(e) =>
                          setSuperficiaireForm({ ...superficiaireForm, periode_initiale: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Premier Renouvellement</label>
                      <input
                        type="number"
                        step="0.01"
                        value={superficiaireForm.premier_renouv}
                        onChange={(e) =>
                          setSuperficiaireForm({ ...superficiaireForm, premier_renouv: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Autres Renouvellements</label>
                    <input
                      type="number"
                      step="0.01"
                      value={superficiaireForm.autre_renouv}
                      onChange={(e) =>
                        setSuperficiaireForm({ ...superficiaireForm, autre_renouv: Number(e.target.value) })
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

              {activeTab === 'droit' && (
                <form onSubmit={handleBaremProduitSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Montant Droit Établissement</label>
                      <input
                        type="number"
                        step="0.01"
                        value={baremProduitForm.montant_droit_etab}
                        onChange={(e) =>
                          setBaremProduitForm({ ...baremProduitForm, montant_droit_etab: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Produit Attribution</label>
                      <input
                        type="number"
                        step="0.01"
                        value={baremProduitForm.produit_attribution}
                        onChange={(e) =>
                          setBaremProduitForm({ ...baremProduitForm, produit_attribution: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Type Permis</label>
                      <select
                        value={baremProduitForm.typePermisId}
                        onChange={(e) =>
                          setBaremProduitForm({ ...baremProduitForm, typePermisId: Number(e.target.value) })
                        }
                        required
                      >
                        <option value="">Sélectionner un type de permis</option>
                        {typePermisList.map((permis) => (
                          <option key={permis.id} value={permis.id}>
                            {permis.lib_type} ({permis.code_type})({permis.regime})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Type Procédure</label>
                      <select
                        value={baremProduitForm.typeProcedureId}
                        onChange={(e) =>
                          setBaremProduitForm({ ...baremProduitForm, typeProcedureId: Number(e.target.value) })
                        }
                        required
                      >
                        <option value="">Sélectionner un type de procédure</option>
                        {typeProcedureList.map((procedure) => (
                          <option key={procedure.id} value={procedure.id}>
                            {procedure.libelle}
                          </option>
                        ))}
                      </select>
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

export default TaxeSuperficiaireDroit;