import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './PermisManagementPanel.module.css';

interface Permis {
  id: number;
  id_typePermis: number;
  id_antenne?: number | null;
  id_detenteur?: number | null;
  id_statut?: number | null;
  code_permis: string;
  date_adjudication?: Date | null;
  date_octroi?: Date | null;
  date_expiration?: Date | null;
  date_annulation?: Date | null;
  date_renonciation?: Date | null;
  duree_validite: number;
  lieu_dit?: string | null;
  mode_attribution?: string | null;
  superficie?: number | null;
  utilisation?: string | null;
  statut_juridique_terrain?: string | null;
  duree_prevue_travaux?: number | null;
  date_demarrage_travaux?: Date | null;
  statut_activites?: string | null;
  nombre_renouvellements: number;
  commentaires?: string | null;
  typePermis?: TypePermis;
  antenne?: Antenne;
  detenteur?: DetenteurMorale;
  statut?: StatutPermis;
}

interface TypePermis {
  id: number;
  lib_type: string;
  code_type: string;
  regime: string;
  duree_initiale: number;
  nbr_renouv_max: number;
  duree_renouv: number;
  delai_renouv: number;
  superficie_max?: number | null;
}

interface Antenne {
  id_antenne: number;
  nom: string;
  localisation?: string | null;
}

interface DetenteurMorale {
  id_detenteur: number;
  nom_societeFR: string;
  nom_sociétéAR: string;
  nationalité: string;
}

interface StatutPermis {
  id: number;
  lib_statut: string;
  description: string;
}

// Create a default empty Permis object
const emptyPermis: Omit<Permis, 'id'> = {
  id_typePermis: 0,
  code_permis: '',
  duree_validite: 0,
  nombre_renouvellements: 0,
  // Initialize all optional fields with null or empty values
  id_antenne: null,
  id_detenteur: null,
  id_statut: null,
  date_adjudication: null,
  date_octroi: null,
  date_expiration: null,
  date_annulation: null,
  date_renonciation: null,
  lieu_dit: null,
  mode_attribution: null,
  superficie: null,
  utilisation: null,
  statut_juridique_terrain: null,
  duree_prevue_travaux: null,
  date_demarrage_travaux: null,
  statut_activites: null,
  commentaires: null,
};

const PermisManagementPanel: React.FC = () => {
  const [permisList, setPermisList] = useState<Permis[]>([]);
  const [filteredPermis, setFilteredPermis] = useState<Permis[]>([]);
  const [selectedPermis, setSelectedPermis] = useState<Permis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typePermisOptions, setTypePermisOptions] = useState<TypePermis[]>([]);
  const [statutPermisOptions, setStatutPermisOptions] = useState<StatutPermis[]>([]);
  const [antenneOptions, setAntenneOptions] = useState<Antenne[]>([]);
  const [detenteurOptions, setDetenteurOptions] = useState<DetenteurMorale[]>([]);
  
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  // Fetch all necessary data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          permisResponse,
          typePermisResponse,
          statutPermisResponse,
          antenneResponse,
          detenteurResponse
        ] = await Promise.all([
          fetch(`${apiURL}/permis_conf`),
          fetch(`${apiURL}/type-permis_conf`),
          fetch(`${apiURL}/statut-permis_conf`),
          fetch(`${apiURL}/antenne_conf`),
          fetch(`${apiURL}/detenteur-morale_conf`)
        ]);

        // Check all responses
        if (!permisResponse.ok) throw new Error('Failed to fetch permis data');
        if (!typePermisResponse.ok) throw new Error('Failed to fetch type permis data');
        if (!statutPermisResponse.ok) throw new Error('Failed to fetch statut permis data');
        if (!antenneResponse.ok) throw new Error('Failed to fetch antenne data');
        if (!detenteurResponse.ok) throw new Error('Failed to fetch detenteur data');

        // Parse all responses
        const permisData = await permisResponse.json();
        const typePermisData = await typePermisResponse.json();
        const statutPermisData = await statutPermisResponse.json();
        const antenneData = await antenneResponse.json();
        const detenteurData = await detenteurResponse.json();

        // Set states
        const permisArray = Array.isArray(permisData) ? permisData : permisData.data || [];
        setPermisList(permisArray);
        setFilteredPermis(permisArray);
        setTypePermisOptions(typePermisData);
        setStatutPermisOptions(statutPermisData);
        setAntenneOptions(antenneData);
        setDetenteurOptions(detenteurData);
        
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [apiURL]);

  // Filter permis based on search and filters
  useEffect(() => {
    let result = permisList;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(permis => 
        permis.code_permis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (permis.lieu_dit && permis.lieu_dit.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (permis.detenteur && permis.detenteur.nom_societeFR.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(permis => 
        permis.statut?.lib_statut === statusFilter
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(permis => 
        permis.typePermis?.lib_type === typeFilter
      );
    }

    setFilteredPermis(result);
  }, [searchTerm, statusFilter, typeFilter, permisList]);

  const handleCreate = async (permisData: Omit<Permis, 'id'>) => {
    try {
      const response = await fetch(`${apiURL}/permis_conf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permisData),
      });

      if (!response.ok) throw new Error('Failed to create permis');

      const newPermis = await response.json();
      setPermisList([...permisList, newPermis]);
      setIsCreating(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create permis');
      }
    }
  };

  const handleUpdate = async (id: number, permisData: Partial<Permis>) => {
    try {
      const response = await fetch(`${apiURL}/permis_conf/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permisData),
      });

      if (!response.ok) throw new Error('Failed to update permis');

      const updatedPermis = await response.json();
      setPermisList(permisList.map(p => p.id === id ? updatedPermis : p));
      setSelectedPermis(null);
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update permis');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this permis?')) return;

    try {
      const response = await fetch(`${apiURL}/permis_conf/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete permis');

      setPermisList(permisList.filter(p => p.id !== id));
      setSelectedPermis(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete permis');
      }
    }
  };

  const handleExport = () => {
    // Implementation for exporting data
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Code,Type,Detenteur,Status,Location\n"
      + filteredPermis.map(p => 
          `${p.code_permis},${p.typePermis?.lib_type || ''},${p.detenteur?.nom_societeFR || ''},${p.statut?.lib_statut || ''},${p.lieu_dit || ''}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "permis_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Permis Management Panel</h1>
        <div className={styles.actions}>
          <button 
            className={styles.primaryButton}
            onClick={() => setIsCreating(true)}
          >
            + New Permis
          </button>
          <button 
            className={styles.secondaryButton}
            onClick={handleExport}
          >
            Export Data
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by code, location, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            {statutPermisOptions.map(statut => (
              <option key={statut.id} value={statut.lib_statut}>
                {statut.lib_statut}
              </option>
            ))}
          </select>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            {typePermisOptions.map(type => (
              <option key={type.id} value={type.lib_type}>
                {type.lib_type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Permis</h3>
          <span className={styles.statNumber}>{permisList.length}</span>
        </div>
        <div className={styles.statCard}>
          <h3>Active</h3>
          <span className={styles.statNumber}>
            {permisList.filter(p => p.statut?.lib_statut === 'En vigueur').length}
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>Expiring Soon</h3>
          <span className={styles.statNumber}>
            {permisList.filter(p => {
              if (!p.date_expiration) return false;
              const expDate = new Date(p.date_expiration);
              const today = new Date();
              const diffTime = Math.abs(expDate.getTime() - today.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 30;
            }).length}
          </span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Detenteur</th>
              <th>Status</th>
              <th>Location</th>
              <th>Expiration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermis.map(permis => (
              <tr key={permis.id} className={styles.tableRow}>
                <td>{permis.code_permis}</td>
                <td>{permis.typePermis?.lib_type}</td>
                <td>{permis.detenteur?.nom_societeFR}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[permis.statut?.lib_statut || 'default']}`}>
                    {permis.statut?.lib_statut}
                  </span>
                </td>
                <td>{permis.lieu_dit}</td>
                <td>{permis.date_expiration ? new Date(permis.date_expiration).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.viewButton}
                      onClick={() => {
                        setSelectedPermis(permis);
                        setIsEditing(false);
                      }}
                    >
                      View
                    </button>
                    <button 
                      className={styles.editButton}
                      onClick={() => {
                        setSelectedPermis(permis);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(permis.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPermis.length === 0 && (
          <div className={styles.noResults}>
            <p>No permis found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Modal for viewing/editing/creating permis */}
      {(selectedPermis || isCreating) && (
        <PermisModal
          permis={selectedPermis}
          isEditing={isEditing}
          isCreating={isCreating}
          onSave={isCreating ? handleCreate : (data) => selectedPermis && handleUpdate(selectedPermis.id, data)}
          onClose={() => {
            setSelectedPermis(null);
            setIsEditing(false);
            setIsCreating(false);
          }}
          typePermisOptions={typePermisOptions}
          statutPermisOptions={statutPermisOptions}
          antenneOptions={antenneOptions}
          detenteurOptions={detenteurOptions}
        />
      )}
    </div>
  );
};

// Modal component for viewing/editing/creating permis
const PermisModal: React.FC<{
  permis: Permis | null;
  isEditing: boolean;
  isCreating: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
  typePermisOptions: TypePermis[];
  statutPermisOptions: StatutPermis[];
  antenneOptions: Antenne[];
  detenteurOptions: DetenteurMorale[];
}> = ({ permis, isEditing, isCreating, onSave, onClose, typePermisOptions, statutPermisOptions, antenneOptions, detenteurOptions }) => {
  // Initialize with emptyPermis or the provided permis
  const [formData, setFormData] = useState<Omit<Permis, 'id'> | Permis>(permis || emptyPermis);
  
  useEffect(() => {
    setFormData(permis || emptyPermis);
  }, [permis]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let processedValue: any = value;
    
    if (type === 'number') {
      processedValue = value === '' ? null : Number(value);
    } else if (type === 'date') {
      processedValue = value === '' ? null : new Date(value);
    } else if (name === 'id_typePermis' || name === 'id_statut' || name === 'id_antenne' || name === 'id_detenteur') {
      processedValue = value === '' ? null : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>
            {isCreating ? 'Create New Permis' : 
             isEditing ? 'Edit Permis' : 'Permis Details'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="code_permis">Code Permis</label>
              <input
                type="text"
                id="code_permis"
                name="code_permis"
                value={formData.code_permis || ''}
                onChange={handleChange}
                required
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="id_typePermis">Type</label>
              <select
                id="id_typePermis"
                name="id_typePermis"
                value={formData.id_typePermis || ''}
                onChange={handleChange}
                required
                disabled={!isEditing && !isCreating}
              >
                <option value="">Select a type</option>
                {typePermisOptions.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.lib_type} ({type.code_type})
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="id_antenne">Antenne</label>
              <select
                id="id_antenne"
                name="id_antenne"
                value={formData.id_antenne || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              >
                <option value="">Select an antenne</option>
                {antenneOptions.map(antenne => (
                  <option key={antenne.id_antenne} value={antenne.id_antenne}>
                    {antenne.nom}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="id_detenteur">Detenteur</label>
              <select
                id="id_detenteur"
                name="id_detenteur"
                value={formData.id_detenteur || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              >
                <option value="">Select a detenteur</option>
                {detenteurOptions.map(detenteur => (
                  <option key={detenteur.id_detenteur} value={detenteur.id_detenteur}>
                    {detenteur.nom_societeFR}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="id_statut">Status</label>
              <select
                id="id_statut"
                name="id_statut"
                value={formData.id_statut || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              >
                <option value="">Select a status</option>
                {statutPermisOptions.map(statut => (
                  <option key={statut.id} value={statut.id}>
                    {statut.lib_statut}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lieu_dit">Location</label>
              <input
                type="text"
                id="lieu_dit"
                name="lieu_dit"
                value={formData.lieu_dit || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="superficie">Area (ha)</label>
              <input
                type="number"
                id="superficie"
                name="superficie"
                value={formData.superficie || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
                step="0.01"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="date_adjudication">Adjudication Date</label>
              <input
                type="date"
                id="date_adjudication"
                name="date_adjudication"
                value={formData.date_adjudication ? new Date(formData.date_adjudication).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="date_octroi">Grant Date</label>
              <input
                type="date"
                id="date_octroi"
                name="date_octroi"
                value={formData.date_octroi ? new Date(formData.date_octroi).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="date_expiration">Expiration Date</label>
              <input
                type="date"
                id="date_expiration"
                name="date_expiration"
                value={formData.date_expiration ? new Date(formData.date_expiration).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="duree_validite">Validity Duration (years)</label>
              <input
                type="number"
                id="duree_validite"
                name="duree_validite"
                value={formData.duree_validite || ''}
                onChange={handleChange}
                required
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="nombre_renouvellements">Renewal Count</label>
              <input
                type="number"
                id="nombre_renouvellements"
                name="nombre_renouvellements"
                value={formData.nombre_renouvellements || ''}
                onChange={handleChange}
                required
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="mode_attribution">Attribution Mode</label>
              <input
                type="text"
                id="mode_attribution"
                name="mode_attribution"
                value={formData.mode_attribution || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="utilisation">Usage</label>
              <input
                type="text"
                id="utilisation"
                name="utilisation"
                value={formData.utilisation || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className={styles.formGroupFull}>
              <label htmlFor="commentaires">Comments</label>
              <textarea
                id="commentaires"
                name="commentaires"
                value={formData.commentaires || ''}
                onChange={handleChange}
                disabled={!isEditing && !isCreating}
                rows={3}
              />
            </div>
          </div>
          
          {(isEditing || isCreating) && (
            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                {isCreating ? 'Create' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PermisManagementPanel;