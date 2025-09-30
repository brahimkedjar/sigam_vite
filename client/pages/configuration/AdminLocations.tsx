import React, { useState, useEffect } from 'react';
import styles from './AdminLocations.module.css';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Antenne {
  id_antenne: number;
  nom: string;
  localisation?: string;
}

interface Wilaya {
  id_wilaya: number;
  id_antenne: number;
  code_wilaya: string;
  nom_wilayaFR: string;
  antenne: Antenne;
}

interface Daira {
  id_daira: number;
  id_wilaya: number;
  code_daira: string;
  nom_dairaFR: string;
  wilaya: {
    id_wilaya: number;
    id_antenne: number;
    code_wilaya: string;
    nom_wilayaFR: string;
    antenne: {
      id_antenne: number;
      nom: string;
      localisation?: string;
    };
  };
}

interface Commune {
  id_commune: number;
  id_daira: number;
  code_commune: string;
  nom_communeFR: string;
  daira: Daira;
}

const AdminLocations = () => {
  const [activeTab, setActiveTab] = useState<'antennes' | 'wilayas' | 'dairas' | 'communes'>('antennes');
  const [antennes, setAntennes] = useState<Antenne[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [dairas, setDairas] = useState<Daira[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [selectedAntenne, setSelectedAntenne] = useState<number | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<number | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Form states
  const [antenneForm, setAntenneForm] = useState({
    nom: '',
    localisation: '',
  });

  const [wilayaForm, setWilayaForm] = useState({
    id_antenne: 0,
    code_wilaya: '',
    nom_wilaya: '',
  });

  const [dairaForm, setDairaForm] = useState({
    id_wilaya: 0,
    code_daira: '',
    nom_daira: '',
  });

  const [communeForm, setCommuneForm] = useState({
    id_daira: 0,
    code_commune: '',
    nom_communeFR: '',
  });

  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAntenne) {
      fetchWilayasByAntenne(selectedAntenne);
    }
  }, [selectedAntenne]);

  useEffect(() => {
    if (selectedWilaya) {
      fetchDairasByWilaya(selectedWilaya);
    }
  }, [selectedWilaya]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [antennesRes, wilayasRes, dairasRes, communesRes] = await Promise.all([
        fetch(`${apiURL}/antennes`),
        fetch(`${apiURL}/wilayas`),
        fetch(`${apiURL}/dairas`),
        fetch(`${apiURL}/communes`),
      ]);

      const [antennesData, wilayasData, dairasData, communesData] = await Promise.all([
        antennesRes.json(),
        wilayasRes.json(),
        dairasRes.json(),
        communesRes.json(),
      ]);

      setAntennes(antennesData);
      setWilayas(wilayasData);
      setDairas(dairasData);
      setCommunes(communesData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWilayasByAntenne = async (id_antenne: number) => {
    try {
      const response = await fetch(`${apiURL}/wilayas?antenne=${id_antenne}`);
      const data = await response.json();
      setWilayas(data);
    } catch (err) {
      console.error('Failed to fetch wilayas by antenne', err);
    }
  };

  const fetchDairasByWilaya = async (id_wilaya: number) => {
  try {
    const response = await fetch(`${apiURL}/dairas?wilaya=${id_wilaya}`);
    const data = await response.json();
    console.log('Dairas data with wilaya and antenne:', data); // Debug log
    setDairas(data);
  } catch (err) {
    console.error('Failed to fetch dairas by wilaya', err);
  }
};

  const handleAntenneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/antennes` : `${apiURL}/antennes/${currentItem.id_antenne}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(antenneForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save antenne');
      console.error(err);
    }
  };

  const handleWilayaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/wilayas` : `${apiURL}/wilayas/${currentItem.id_wilaya}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wilayaForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save wilaya');
      console.error(err);
    }
  };

  const handleDairaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/dairas` : `${apiURL}/dairas/${currentItem.id_daira}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dairaForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save daira');
      console.error(err);
    }
  };

  const handleCommuneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentForm === 'create' ? 'POST' : 'PUT';
      const url = currentForm === 'create' ? `${apiURL}/communes` : `${apiURL}/communes/${currentItem.id_commune}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communeForm),
      });

      if (!response.ok) throw new Error('Operation failed');

      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save commune');
      console.error(err);
    }
  };

  const handleDelete = async (type: 'antenne' | 'wilaya' | 'daira' | 'commune', id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let endpoint = '';
      if (type === 'antenne') endpoint = `${apiURL}/antennes/${id}`;
      if (type === 'wilaya') endpoint = `${apiURL}/wilayas/${id}`;
      if (type === 'daira') endpoint = `${apiURL}/dairas/${id}`;
      if (type === 'commune') endpoint = `${apiURL}/communes/${id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      fetchData();
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  const openCreateModal = (tab: 'antennes' | 'wilayas' | 'dairas' | 'communes') => {
    setCurrentForm('create');
    setCurrentItem(null);
    setActiveTab(tab);
    setIsModalOpen(true);

    // Reset forms
    setAntenneForm({
      nom: '',
      localisation: '',
    });

    setWilayaForm({
      id_antenne: selectedAntenne || antennes[0]?.id_antenne || 0,
      code_wilaya: '',
      nom_wilaya: '',
    });

    setDairaForm({
      id_wilaya: selectedWilaya || wilayas[0]?.id_wilaya || 0,
      code_daira: '',
      nom_daira: '',
    });

    setCommuneForm({
      id_daira: dairas[0]?.id_daira || 0,
      code_commune: '',
      nom_communeFR: '',
    });
  };

  const openEditModal = (tab: 'antennes' | 'wilayas' | 'dairas' | 'communes', item: any) => {
    setCurrentForm('edit');
    setCurrentItem(item);
    setActiveTab(tab);
    setIsModalOpen(true);

    if (tab === 'antennes') {
      setAntenneForm({
        nom: item.nom,
        localisation: item.localisation || '',
      });
    } else if (tab === 'wilayas') {
      setWilayaForm({
        id_antenne: item.id_antenne,
        code_wilaya: item.code_wilaya,
        nom_wilaya: item.nom_wilaya,
      });
    } else if (tab === 'dairas') {
      setDairaForm({
        id_wilaya: item.id_wilaya,
        code_daira: item.code_daira,
        nom_daira: item.nom_daira,
      });
    } else if (tab === 'communes') {
      setCommuneForm({
        id_daira: item.id_daira,
        code_commune: item.code_commune,
        nom_communeFR: item.nom_communeFR,
      });
    }
  };

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'antennes') {
      return antennes.filter(item =>
        item.nom.toLowerCase().includes(term) ||
        (item.localisation && item.localisation.toLowerCase().includes(term)))
    } else if (activeTab === 'wilayas') {
      return wilayas.filter(item =>
        item.nom_wilayaFR?.toLowerCase().includes(term) ||
        item.code_wilaya?.toLowerCase().includes(term))
    } else if (activeTab === 'dairas') {
      return dairas.filter(item =>
        item.nom_dairaFR?.toLowerCase().includes(term) ||
        item.code_daira?.toLowerCase().includes(term))
    } else {
      return communes.filter(item =>
        item.nom_communeFR?.toLowerCase().includes(term) ||
        item.code_commune?.toLowerCase().includes(term))
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Configuration Administrative</h2>
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
          className={`${styles.tab} ${activeTab === 'antennes' ? styles.active : ''}`}
          onClick={() => setActiveTab('antennes')}
        >
          Antennes
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'wilayas' ? styles.active : ''}`}
          onClick={() => {
            setActiveTab('wilayas');
            setSelectedAntenne(null);
          }}
        >
          Wilayas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'dairas' ? styles.active : ''}`}
          onClick={() => {
            setActiveTab('dairas');
            setSelectedWilaya(null);
          }}
        >
          Dairas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'communes' ? styles.active : ''}`}
          onClick={() => setActiveTab('communes')}
        >
          Communes
        </button>
      </div>

      {activeTab === 'wilayas' && (
        <div className={styles.filterBar}>
          <label>Filtrer par Antenne:</label>
          <select
            value={selectedAntenne || ''}
            onChange={(e) => setSelectedAntenne(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Toutes les antennes</option>
            {antennes.map(antenne => (
              <option key={antenne.id_antenne} value={antenne.id_antenne}>
                {antenne.nom}
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTab === 'dairas' && (
        <div className={styles.filterBar}>
          <label>Filtrer par Wilaya:</label>
          <select
            value={selectedWilaya || ''}
            onChange={(e) => setSelectedWilaya(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Toutes les wilayas</option>
            {wilayas.map(wilaya => (
              <option key={wilaya.id_wilaya} value={wilaya.id_wilaya}>
                {wilaya.nom_wilayaFR}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.addButton}
          onClick={() => openCreateModal(activeTab)}
        >
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'antennes' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucune antenne trouvée</div>
            ) : (
              (filteredItems() as Antenne[]).map((item: Antenne) => (
                <div key={item.id_antenne} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.nom}</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('antennes', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('antenne', item.id_antenne)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id_antenne ? null : item.id_antenne)}
                      >
                        {expandedItem === item.id_antenne ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id_antenne && (
                    <div className={styles.cardDetails}>
                      {item.localisation && (
                        <div className={styles.detailRow}>
                          <span>Localisation:</span>
                          <span>{item.localisation}</span>
                        </div>
                      )}
                      <div className={styles.detailRow}>
                        <span>Nombre de Wilayas:</span>
                        <span>{wilayas.filter(w => w.id_antenne === item.id_antenne).length}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wilayas' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucune wilaya trouvée</div>
            ) : (
              (filteredItems() as Wilaya[]).map((item: Wilaya) => (
                <div key={item.id_wilaya} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.nom_wilayaFR} ({item.code_wilaya})</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('wilayas', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('wilaya', item.id_wilaya)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id_wilaya ? null : item.id_wilaya)}
                      >
                        {expandedItem === item.id_wilaya ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id_wilaya && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Antenne:</span>
                        <span>{item.antenne.nom}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Nombre de Dairas:</span>
                        <span>{dairas.filter(d => d.id_wilaya === item.id_wilaya).length}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'dairas' && (
  <div className={styles.tableContainer}>
    {filteredItems().length === 0 ? (
      <div className={styles.noResults}>Aucune daira trouvée</div>
    ) : (
      (filteredItems() as Daira[]).map((item: Daira) => (
        <div key={item.id_daira} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{item.nom_dairaFR} ({item.code_daira})</h3>
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={() => openEditModal('dairas', item)}
              >
                <FiEdit2 />
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete('daira', item.id_daira)}
              >
                <FiTrash2 />
              </button>
              <button
                className={styles.expandButton}
                onClick={() => setExpandedItem(expandedItem === item.id_daira ? null : item.id_daira)}
              >
                {expandedItem === item.id_daira ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
          {expandedItem === item.id_daira && (
            <div className={styles.cardDetails}>
              <div className={styles.detailRow}>
                <span>Wilaya:</span>
                <span>{item.wilaya.nom_wilayaFR}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Antenne:</span>
                <span>{item.wilaya.antenne?.nom || 'Non spécifiée'}</span>
              </div>
              {item.wilaya.antenne?.localisation && (
                <div className={styles.detailRow}>
                  <span>Localisation:</span>
                  <span>{item.wilaya.antenne.localisation}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span>Nombre de Communes:</span>
                <span>{communes.filter(c => c.id_daira === item.id_daira).length}</span>
              </div>
            </div>
          )}
        </div>
      ))
    )}
  </div>
)}

        {activeTab === 'communes' && (
          <div className={styles.tableContainer}>
            {filteredItems().length === 0 ? (
              <div className={styles.noResults}>Aucune commune trouvée</div>
            ) : (
              (filteredItems() as Commune[]).map((item: Commune) => (
                <div key={item.id_commune} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{item.nom_communeFR} ({item.code_commune})</h3>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal('communes', item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete('commune', item.id_commune)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={styles.expandButton}
                        onClick={() => setExpandedItem(expandedItem === item.id_commune ? null : item.id_commune)}
                      >
                        {expandedItem === item.id_commune ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>
                  {expandedItem === item.id_commune && (
                    <div className={styles.cardDetails}>
                      <div className={styles.detailRow}>
                        <span>Daira:</span>
                        <span>{item.daira.nom_dairaFR}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Wilaya:</span>
                        <span>{item.daira.wilaya.nom_wilayaFR}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Antenne:</span>
                        <span>{item.daira.wilaya.antenne.nom}</span>
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
                  ? `Ajouter ${activeTab === 'antennes' ? 'une Antenne' : activeTab === 'wilayas' ? 'une Wilaya' : activeTab === 'dairas' ? 'une Daira' : 'une Commune'}`
                  : `Modifier ${activeTab === 'antennes' ? 'l\'Antenne' : activeTab === 'wilayas' ? 'la Wilaya' : activeTab === 'dairas' ? 'la Daira' : 'la Commune'}`}
              </h3>
              <button
                className={styles.closeModal}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalContent}>
              {activeTab === 'antennes' && (
                <form onSubmit={handleAntenneSubmit}>
                  <div className={styles.formGroup}>
                    <label>Nom de l'Antenne</label>
                    <input
                      type="text"
                      value={antenneForm.nom}
                      onChange={(e) =>
                        setAntenneForm({ ...antenneForm, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Localisation</label>
                    <input
                      type="text"
                      value={antenneForm.localisation}
                      onChange={(e) =>
                        setAntenneForm({ ...antenneForm, localisation: e.target.value })
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

              {activeTab === 'wilayas' && (
                <form onSubmit={handleWilayaSubmit}>
                  <div className={styles.formGroup}>
                    <label>Antenne</label>
                    <select
                      value={wilayaForm.id_antenne}
                      onChange={(e) =>
                        setWilayaForm({ ...wilayaForm, id_antenne: Number(e.target.value) })
                      }
                      required
                    >
                      {antennes.map(antenne => (
                        <option key={antenne.id_antenne} value={antenne.id_antenne}>
                          {antenne.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Code Wilaya</label>
                    <input
                      type="text"
                      value={wilayaForm.code_wilaya}
                      onChange={(e) =>
                        setWilayaForm({ ...wilayaForm, code_wilaya: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nom Wilaya</label>
                    <input
                      type="text"
                      value={wilayaForm.nom_wilaya}
                      onChange={(e) =>
                        setWilayaForm({ ...wilayaForm, nom_wilaya: e.target.value })
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

              {activeTab === 'dairas' && (
                <form onSubmit={handleDairaSubmit}>
                  <div className={styles.formGroup}>
                    <label>Wilaya</label>
                    <select
                      value={dairaForm.id_wilaya}
                      onChange={(e) =>
                        setDairaForm({ ...dairaForm, id_wilaya: Number(e.target.value) })
                      }
                      required
                    >
                      {wilayas.map(wilaya => (
                        <option key={wilaya.id_wilaya} value={wilaya.id_wilaya}>
                          {wilaya.nom_wilayaFR}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Code Daira</label>
                    <input
                      type="text"
                      value={dairaForm.code_daira}
                      onChange={(e) =>
                        setDairaForm({ ...dairaForm, code_daira: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nom Daira</label>
                    <input
                      type="text"
                      value={dairaForm.nom_daira}
                      onChange={(e) =>
                        setDairaForm({ ...dairaForm, nom_daira: e.target.value })
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

              {activeTab === 'communes' && (
                <form onSubmit={handleCommuneSubmit}>
                  <div className={styles.formGroup}>
                    <label>Daira</label>
                    <select
                      value={communeForm.id_daira}
                      onChange={(e) =>
                        setCommuneForm({ ...communeForm, id_daira: Number(e.target.value) })
                      }
                      required
                    >
                      {dairas.map(daira => (
                        <option key={daira.id_daira} value={daira.id_daira}>
                          {daira.nom_dairaFR}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Code Commune</label>
                    <input
                      type="text"
                      value={communeForm.code_commune}
                      onChange={(e) =>
                        setCommuneForm({ ...communeForm, code_commune: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nom Commune</label>
                    <input
                      type="text"
                      value={communeForm.nom_communeFR}
                      onChange={(e) =>
                        setCommuneForm({ ...communeForm, nom_communeFR: e.target.value })
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocations;