'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiSearch, FiCalendar, FiSave, FiTrash2, FiX, FiEdit2, FiPlus } from 'react-icons/fi';
import Select, { SingleValue } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles/CahierCharges.module.css'

interface Permis {
  id: number;
  code_permis: string;
  typePermis?: { lib_type: string };
  detenteur?: { nom_societeFR: string };
  statut?: { lib_statut: string };
  date_octroi?: string;
  date_expiration?: string;
  superficie?: number;
}

interface PermisOption {
  value: number;
  label: string;
  data: Permis;
}

type CahierDesCharges = {
  id: number;
  dateCreation: string;
  dateExercice: string;
  fuseau?: string;
  typeCoordonnees?: string;
  natureJuridique?: string;
  vocationTerrain?: string;
  nomGerant?: string;
  personneChargeTrxx?: string;
  qualification?: string;
  reservesGeologiques?: string;
  reservesExploitables?: string;
  volumeExtraction?: string;
  dureeExploitation?: string;
  methodeExploitation?: string;
  dureeTravaux?: string;
  dateDebutTravaux?: string;
  dateDebutProduction?: string;
  investissementDA?: string;
  investissementUSD?: string;
  capaciteInstallee?: string;
  commentaires?: string;
};

const defaultForm: CahierDesCharges = {
  id: 0,
  dateCreation: '',
  dateExercice: '',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CahierChargesDashboard() {
  const { control, handleSubmit, reset, setValue, watch, formState: { isDirty } } = useForm<CahierDesCharges>({
    defaultValues: defaultForm
  });
  
  const [permisList, setPermisList] = useState<Permis[]>([]);
  const [filteredPermis, setFilteredPermis] = useState<Permis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermisId, setSelectedPermisId] = useState<number | null>(null);
  const [cahiers, setCahiers] = useState<CahierDesCharges[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const permisOptions: PermisOption[] = filteredPermis.map((permis: Permis) => ({
    value: permis.id,
    label: `${permis.code_permis} | ${permis.detenteur?.nom_societeFR || 'N/A'} (${permis.typePermis?.lib_type || 'N/A'})`,
    data: permis
  }));

  useEffect(() => {
    const fetchPermisList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/Permisdashboard`, {
          params: { page: 1, limit: 100 }
        });
        const data = response.data.data || response.data;
        setPermisList(data);
        setFilteredPermis(data);
      } catch (err) {
        console.error('Error loading permits:', err);
        toast.error('Failed to load permits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermisList();
  }, []);

  useEffect(() => {
    setFilteredPermis(
      permisList.filter((permis: Permis) =>
        permis.code_permis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (permis.detenteur?.nom_societeFR?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (permis.typePermis?.lib_type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    ));
  }, [searchQuery, permisList]);

  const fetchCahiers = useCallback(async (permisId: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/demande/cahier/permis/${permisId}`);
      const data = await res.json();
      setCahiers(data);
    } catch (err) {
      console.error('Error loading cahiers:', err);
      toast.error('Failed to load cahiers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPermisId) {
      fetchCahiers(selectedPermisId);
    }
  }, [selectedPermisId, fetchCahiers]);

  const onSubmit = async (data: CahierDesCharges) => {
    if (!selectedPermisId) {
      toast.error('Please select a permit first');
      return;
    }

    try {
      setIsLoading(true);
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${API_URL}/api/demande/cahier/cahier/${data.id}`
        : `${API_URL}/api/demande/cahier/permis/${selectedPermisId}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dateCreation: data.dateCreation,
          dateExercice: data.dateExercice || data.dateCreation.substring(0, 4),
        }),
      });

      if (!response.ok) throw new Error('Save error');
      const result = await response.json();

      setCahiers(prev => {
        const exists = prev.some(c => c.id === result.id);
        return exists
          ? prev.map(c => c.id === result.id ? result : c)
          : [...prev, result];
      });

      reset(result);
      setIsEditing(true);
      toast.success('Saved successfully');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = watch('id');
    if (!selectedPermisId || !id) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/api/demande/cahier/cahier/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Delete error');

      setCahiers(cahiers.filter(c => c.id !== id));
      reset(defaultForm);
      setIsEditing(false);
      setShowDeleteConfirm(false);
      toast.success('Deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCahier = (cahier: CahierDesCharges) => {
    reset({
      ...cahier,
      dateCreation: cahier.dateCreation?.substring(0, 10) || '',
      dateExercice: cahier.dateExercice?.substring(0, 4) || '',
      dateDebutTravaux: cahier.dateDebutTravaux?.substring(0, 10) || '',
      dateDebutProduction: cahier.dateDebutProduction?.substring(0, 10) || '',
    });
    setIsEditing(true);
  };

  const createNewCahier = () => {
    reset({
      ...defaultForm,
      dateCreation: new Date().toISOString().split('T')[0],
      dateExercice: new Date().getFullYear().toString()
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Cahier des Charges Management</h1>
          <p className={styles.subtitle}>Create and manage technical specifications for mining permits</p>
        </div>

        {/* Search and Select Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchGrid}>
            <div>
              <label className={styles.selectLabel}>Search Permits</label>
              <div className={styles.searchGroup}>
                <div className={styles.searchIcon}>
                  <FiSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by permit code, holder or type..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={styles.selectLabel}>Select Permit</label>
              <Select
                options={permisOptions}
                isLoading={isLoading}
                onChange={(selected: SingleValue<PermisOption>) => 
                  setSelectedPermisId(selected?.value || null)
                }
                placeholder="Select a permit..."
                classNamePrefix="react-select"
                noOptionsMessage={() => "No permits found"}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {selectedPermisId ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Cahier Selection */}
              <div className={styles.cahierSelection}>
                <div className={styles.cahierSelectionHeader}>
                  <div>
                    <h3 className={styles.cahierSelectionTitle}>Existing Technical Specifications</h3>
                    <p className={styles.cahierSelectionSubtitle}>Select an existing one or create new</p>
                  </div>
                  
                  <div className={styles.cahierSelectionControls}>
                    <select
                      className={styles.cahierSelect}
                      onChange={(e) => {
                        const cahier = cahiers.find(c => c.id === Number(e.target.value));
                        if (cahier) loadCahier(cahier);
                      }}
                      value={watch('id') || ''}
                    >
                      <option value="">Select existing specification...</option>
                      {cahiers.map(cahier => (
                        <option key={cahier.id} value={cahier.id}>
                          {new Date(cahier.dateCreation).toLocaleDateString()} (Exercise: {cahier.dateExercice?.substring(0, 4)})
                        </option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={createNewCahier}
                      className={styles.newButton}
                    >
                      <FiPlus style={{ marginRight: '0.5rem' }} />
                      New Specification
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Tabs */}
              <div className={styles.tabs}>
                <nav className={styles.tabList}>
                  {['general', 'terrain', 'exploitation', 'investment', 'comments'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${styles.tabButton} ${
                        activeTab === tab ? styles.tabButtonActive : styles.tabButtonInactive
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* General Information */}
                {activeTab === 'general' && (
                  <div className={styles.formGrid}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Basic Information</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Creation Date</label>
                          <Controller
                            name="dateCreation"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'dateCreation'> }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                                className={styles.formInput}
                                dateFormat="yyyy-MM-dd"
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Exercise Year</label>
                          <Controller
                            name="dateExercice"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'dateExercice'> }) => (
                              <input
                                type="number"
                                {...field}
                                min="1900"
                                max="2100"
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Reserves Information</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Geological Reserves</label>
                          <Controller
                            name="reservesGeologiques"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'reservesGeologiques'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Exploitable Reserves</label>
                          <Controller
                            name="reservesExploitables"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'reservesExploitables'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terrain Information */}
                {activeTab === 'terrain' && (
                  <div className={styles.formGrid}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Terrain Details</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Time Zone</label>
                          <Controller
                            name="fuseau"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'fuseau'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Coordinates Type</label>
                          <Controller
                            name="typeCoordonnees"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'typeCoordonnees'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Legal Nature</label>
                          <Controller
                            name="natureJuridique"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'natureJuridique'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Personnel Information</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Terrain Vocation</label>
                          <Controller
                            name="vocationTerrain"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'vocationTerrain'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Manager Name</label>
                          <Controller
                            name="nomGerant"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'nomGerant'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Works Supervisor</label>
                          <Controller
                            name="personneChargeTrxx"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'personneChargeTrxx'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Qualification</label>
                          <Controller
                            name="qualification"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'qualification'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exploitation Information */}
                {activeTab === 'exploitation' && (
                  <div className={styles.formGrid}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Extraction Details</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Extraction Volume</label>
                          <Controller
                            name="volumeExtraction"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'volumeExtraction'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Exploitation Duration (years)</label>
                          <Controller
                            name="dureeExploitation"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'dureeExploitation'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Exploitation Method</label>
                          <Controller
                            name="methodeExploitation"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'methodeExploitation'> }) => (
                              <input
                                type="text"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Works Timeline</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Works Duration (months)</label>
                          <Controller
                            name="dureeTravaux"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'dureeTravaux'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Works Start Date</label>
                          <Controller
                            name="dateDebutTravaux"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'dateDebutTravaux'> }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                                className={styles.formInput}
                                dateFormat="yyyy-MM-dd"
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Production Start Date</label>
                          <Controller
                            name="dateDebutProduction"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'dateDebutProduction'> }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                                className={styles.formInput}
                                dateFormat="yyyy-MM-dd"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Investment Information */}
                {activeTab === 'investment' && (
                  <div className={styles.formGrid}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Investments</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Investment (DA)</label>
                          <Controller
                            name="investissementDA"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'investissementDA'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Investment (USD)</label>
                          <Controller
                            name="investissementUSD"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'investissementUSD'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Capacity</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Installed Capacity</label>
                          <Controller
                            name="capaciteInstallee"
                            control={control}
                            render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'capaciteInstallee'> }) => (
                              <input
                                type="number"
                                {...field}
                                className={styles.formInput}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {activeTab === 'comments' && (
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Comments</h3>
                    <div>
                      <Controller
                        name="commentaires"
                        control={control}
                        render={({ field }: { field: ControllerRenderProps<CahierDesCharges, 'commentaires'> }) => (
                          <textarea
                            {...field}
                            rows={4}
                            className={`${styles.formInput} ${styles.formTextarea}`}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className={styles.actions}>
                  <div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className={styles.deleteButton}
                      >
                        <FiTrash2 style={{ marginRight: '0.5rem' }} />
                        Delete
                      </button>
                    )}
                  </div>

                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isDirty && !confirm('Are you sure you want to discard changes?')) return;
                        reset(defaultForm);
                        setIsEditing(false);
                      }}
                      className={styles.cancelButton}
                    >
                      <FiX style={{ marginRight: '0.5rem' }} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${styles.saveButton} ${isLoading ? styles.saveButtonDisabled : ''}`}
                    >
                      {isLoading ? (
                        'Saving...'
                      ) : (
                        <>
                          <FiSave style={{ marginRight: '0.5rem' }} />
                          {isEditing ? 'Update' : 'Save'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <FiEdit2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={styles.emptyStateTitle}>No permit selected</h3>
              <p className={styles.emptyStateText}>Please select a permit from the dropdown above to manage its technical specifications.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div>
              <div className={styles.modalIcon}>
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className={styles.modalTitle}>
                <h3>Delete technical specification</h3>
                <div className={styles.modalText}>
                  <p>Are you sure you want to delete this technical specification? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={styles.modalDeleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}