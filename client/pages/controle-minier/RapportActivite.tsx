// components/mining/ModernMiningForm.tsx
import { useState, useEffect } from 'react';
import styles from './styles/RapportActivite.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faEuroSign, 
  faWeightHanging, 
  faUsers, 
  faBomb, 
  faClipboardCheck,
  faFileContract,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faFileSignature,
  faMapMarkedAlt,
  faChartLine,
  faWeight,
  faHardHat,
  faLayerGroup,
  faSmog,
  faTools
} from '@fortawesome/free-solid-svg-icons';
type EtatActivite = 'actif' | 'inactif' | 'suspendu';
type Semestre = 'S1' | 'S2';

interface Effectif {
  cadres: number | null;
  maitrise: number | null;
  execution: number | null;
  total: number | null;
}

interface Explosif {
  quantiteExplosifs: number | null;
  quantiteExplosifsDIM: number | null;
  detonateurs: number | null;
  dmr: number | null;
  cordeauDetonant: number | null;
  mecheLente: number | null;
  relais: number | null;
  dei: number | null;
}

interface Effluent {
  poussieres: number | null;
  rejetsLaverie: number | null;
  fumeeGaz: number | null;
  autres: string | null;
}

interface Production {
  substanceProduit: string;
  utilisation: string;
  toutVenant: number | null;
  marchande: number | null;
  vendue: number | null;
  stockee: number | null;
  stockTV: number | null;
  stockProduitMarchand: number | null;
  sable: number | null;
}

interface Exploration {
  prospectionEntamee: boolean;
  travauxRealises: string;
  nombreOuvrages: number | null;
  volume: number | null;
}

interface FormData {
  // General Information
  exercice: string;
  semestre: Semestre;
  dateRemise: string;
  etatActivite: EtatActivite;
  signature: string;
  editions: string;
  fonds: string;
  
  // Financial
  ventesExportationHT: number | null;
  chiffreAffairesTotalHT: number | null;
  importations: number | null;
  valeurEquipementsAcquis: number | null;
  
  // Physical
  production: Production;
  
  // Exploration
  exploration: Exploration;
  
  // Categories
  categories: {
    fond: number | null;
    jour: number | null;
    ceelOuvert: number | null;
    total: number | null;
  };
  
  // Effectifs
  effectifs: Effectif;
  
  // Explosifs
  explosifs: Explosif;
  
  // Effluents
  effluents: Effluent;
  
  // Remise RA
  remiseRA: {
    exercice: string;
    semestre: Semestre;
    remise: boolean;
  };
  
  // Technical
  leveTopo3112: boolean;
  leveTopo3006: boolean;
  planExploitation: string;
  dateDebutTravaux: string;
  travauxRealises: string;
  nbrOuvrages: number | null;
  volume: number | null;
  remiseEtatRealisee: boolean;
  coutRemiseEtat: number | null;
}

const initialFormData: FormData = {
  exercice: '',
  semestre: 'S1',
  dateRemise: '',
  etatActivite: 'actif',
  signature: '',
  editions: '',
  fonds: '',
  
  ventesExportationHT: null,
  chiffreAffairesTotalHT: null,
  importations: null,
  valeurEquipementsAcquis: null,
  
  production: {
    substanceProduit: '',
    utilisation: '',
    toutVenant: null,
    marchande: null,
    vendue: null,
    stockee: null,
    stockTV: null,
    stockProduitMarchand: null,
    sable: null,
  },
  
  exploration: {
    prospectionEntamee: false,
    travauxRealises: '',
    nombreOuvrages: null,
    volume: null,
  },
  
  categories: {
    fond: null,
    jour: null,
    ceelOuvert: null,
    total: null,
  },
  
  effectifs: {
    cadres: null,
    maitrise: null,
    execution: null,
    total: null,
  },
  
  explosifs: {
    quantiteExplosifs: null,
    quantiteExplosifsDIM: null,
    detonateurs: null,
    dmr: null,
    cordeauDetonant: null,
    mecheLente: null,
    relais: null,
    dei: null,
  },
  
  effluents: {
    poussieres: null,
    rejetsLaverie: null,
    fumeeGaz: null,
    autres: null,
  },
  
  remiseRA: {
    exercice: '',
    semestre: 'S1',
    remise: false,
  },
  
  leveTopo3112: false,
  leveTopo3006: false,
  planExploitation: '',
  dateDebutTravaux: '',
  travauxRealises: '',
  nbrOuvrages: null,
  volume: null,
  remiseEtatRealisee: false,
  coutRemiseEtat: null,
};

const ModernMiningForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate totals automatically
  useEffect(() => {
    // Calculate effectifs total
    const effectifsTotal = [formData.effectifs.cadres, formData.effectifs.maitrise, formData.effectifs.execution]
      .reduce((sum, val) => sum! + (val || 0), 0) || null;
    
    // Calculate categories total
    const categoriesTotal = [formData.categories.fond, formData.categories.jour, formData.categories.ceelOuvert]
      .reduce((sum, val) => sum! + (val || 0), 0) || null;

    setFormData(prev => ({
      ...prev,
      effectifs: {
        ...prev.effectifs,
        total: effectifsTotal,
      },
      categories: {
        ...prev.categories,
        total: categoriesTotal,
      }
    }));
  }, [
    formData.effectifs.cadres, 
    formData.effectifs.maitrise, 
    formData.effectifs.execution,
    formData.categories.fond,
    formData.categories.jour,
    formData.categories.ceelOuvert
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    let processedValue: string | number | boolean | null = value;
    
    if (type === 'number') {
      processedValue = value === '' ? null : Number(value);
    } else if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'radio') {
      processedValue = value as Semestre;
    }

    // Handle nested objects
    if (name.includes('.')) {
  const [parent, child] = name.split('.');

  const parentValue = formData[parent as keyof FormData];

  if (typeof parentValue === 'object' && parentValue !== null) {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof FormData] as Record<string, any>),
        [child]: processedValue,
      },
    }));
  }
}

  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!formData.exercice || !formData.dateRemise) {
        throw new Error('Les champs obligatoires doivent être remplis');
      }
      setSuccessMessage('Rapport enregistré avec succès!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving form:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer ce rapport?')) {
      setFormData(initialFormData);
      setIsEditing(false);
      setSuccessMessage('Rapport supprimé avec succès');
    }
  };

  const renderGeneralTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-info-circle`}></i>
          Informations Générales
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Exercice</label>
            <input
              type="text"
              name="exercice"
              value={formData.exercice}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="2023"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Semestre</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="semestre"
                  value="S1"
                  checked={formData.semestre === 'S1'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                S1
              </label>
              <label>
                <input
                  type="radio"
                  name="semestre"
                  value="S2"
                  checked={formData.semestre === 'S2'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                S2
              </label>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Date de remise</label>
            <input
              type="date"
              name="dateRemise"
              value={formData.dateRemise}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>État de l'activité</label>
            <select
              name="etatActivite"
              value={formData.etatActivite}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-file-signature`}></i>
          Signature et Éditions
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Signature</label>
            <input
              type="text"
              name="signature"
              value={formData.signature}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Nom du signataire"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Éditions</label>
            <input
              type="text"
              name="editions"
              value={formData.editions}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Version du document"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Fonds</label>
            <input
              type="text"
              name="fonds"
              value={formData.fonds}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Référence des fonds"
            />
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-map-marked-alt`}></i>
          Données Techniques
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="leveTopo3112"
                checked={formData.leveTopo3112}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <span className={styles.checkmark}></span>
              Levé topo au 31/12
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="leveTopo3006"
                checked={formData.leveTopo3006}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <span className={styles.checkmark}></span>
              Levé topo au 30/06
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>Plan d'exploitation</label>
            <input
              type="text"
              name="planExploitation"
              value={formData.planExploitation}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Référence du plan"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Date début des travaux</label>
            <input
              type="date"
              name="dateDebutTravaux"
              value={formData.dateDebutTravaux}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-chart-line`}></i>
          Agrégats Financiers
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Ventes à l'exportation (HT)</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="ventesExportationHT"
                value={formData.ventesExportationHT || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
              <span className={styles.unit}>€</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Chiffre d'affaires total (HT)</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="chiffreAffairesTotalHT"
                value={formData.chiffreAffairesTotalHT || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
              <span className={styles.unit}>€</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Importations</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="importations"
                value={formData.importations || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
              <span className={styles.unit}>€</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Valeur des équipements acquis</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="valeurEquipementsAcquis"
                value={formData.valeurEquipementsAcquis || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
              <span className={styles.unit}>€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhysicalTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-weight`}></i>
          Agrégats Physiques
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Substance - Produit</label>
            <input
              type="text"
              name="production.substanceProduit"
              value={formData.production.substanceProduit}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Ex: Or, Cuivre..."
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Utilisation</label>
            <input
              type="text"
              name="production.utilisation"
              value={formData.production.utilisation}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Utilisation prévue"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Production tout-venant</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.toutVenant"
                value={formData.production.toutVenant || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Production marchande</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.marchande"
                value={formData.production.marchande || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Production vendue</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.vendue"
                value={formData.production.vendue || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Production stockée</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.stockee"
                value={formData.production.stockee || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Stock T.V au 31/12</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.stockTV"
                value={formData.production.stockTV || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Stock produit marchand au 31/12</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.stockProduitMarchand"
                value={formData.production.stockProduitMarchand || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Production sable</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="production.sable"
                value={formData.production.sable || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>t</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-hard-hat`}></i>
          Exploration
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="exploration.prospectionEntamee"
                checked={formData.exploration.prospectionEntamee}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <span className={styles.checkmark}></span>
              Prospection/exploration entamée
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>Travaux réalisés (PP/PE)</label>
            <textarea
              name="exploration.travauxRealises"
              value={formData.exploration.travauxRealises}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Nombre d'ouvrages</label>
            <input
              type="number"
              name="exploration.nombreOuvrages"
              value={formData.exploration.nombreOuvrages || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Volume</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="exploration.volume"
                value={formData.exploration.volume || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkforceTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-users`}></i>
          Effectifs
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Cadres</label>
            <input
              type="number"
              name="effectifs.cadres"
              value={formData.effectifs.cadres || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Maîtrise</label>
            <input
              type="number"
              name="effectifs.maitrise"
              value={formData.effectifs.maitrise || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Exécution</label>
            <input
              type="number"
              name="effectifs.execution"
              value={formData.effectifs.execution || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Total</label>
            <input
              type="number"
              name="effectifs.total"
              value={formData.effectifs.total || ''}
              onChange={handleInputChange}
              disabled
              className={styles.disabledInput}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-layer-group`}></i>
          Catégories
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>FOND</label>
            <input
              type="number"
              name="categories.fond"
              value={formData.categories.fond || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>JOUR</label>
            <input
              type="number"
              name="categories.jour"
              value={formData.categories.jour || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>CEEL OUVERT</label>
            <input
              type="number"
              name="categories.ceelOuvert"
              value={formData.categories.ceelOuvert || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>TOTAL</label>
            <input
              type="number"
              name="categories.total"
              value={formData.categories.total || ''}
              onChange={handleInputChange}
              disabled
              className={styles.disabledInput}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderExplosivesTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-bomb`}></i>
          Explosifs
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Quantité explosifs</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="explosifs.quantiteExplosifs"
                value={formData.explosifs.quantiteExplosifs || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>kg</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Qté explosifs (DIM)</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="explosifs.quantiteExplosifsDIM"
                value={formData.explosifs.quantiteExplosifsDIM || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>kg</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Détonateurs</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="explosifs.detonateurs"
                value={formData.explosifs.detonateurs || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>U</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>DMR</label>
            <input
              type="number"
              name="explosifs.dmr"
              value={formData.explosifs.dmr || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Cordeau détonant</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="explosifs.cordeauDetonant"
                value={formData.explosifs.cordeauDetonant || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>m</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Mèche lente</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="explosifs.mecheLente"
                value={formData.explosifs.mecheLente || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>m</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Relais</label>
            <input
              type="number"
              name="explosifs.relais"
              value={formData.explosifs.relais || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>DEI</label>
            <input
              type="number"
              name="explosifs.dei"
              value={formData.explosifs.dei || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-smog`}></i>
          Effluents
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Poussières</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="effluents.poussieres"
                value={formData.effluents.poussieres || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>kg</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Rejets laverie</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="effluents.rejetsLaverie"
                value={formData.effluents.rejetsLaverie || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>m³</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Fumée/Gaz</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="effluents.fumeeGaz"
                value={formData.effluents.fumeeGaz || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>kg</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Autres (préciser)</label>
            <input
              type="text"
              name="effluents.autres"
              value={formData.effluents.autres || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderRemiseTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-clipboard-check`}></i>
          Situation de remise du RA
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Exercice</label>
            <input
              type="text"
              name="remiseRA.exercice"
              value={formData.remiseRA.exercice}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Semestre</label>
            <select
              name="remiseRA.semestre"
              value={formData.remiseRA.semestre}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="remiseRA.remise"
                checked={formData.remiseRA.remise}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <span className={styles.checkmark}></span>
              Remise
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-tools`}></i>
          Remise en état
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="remiseEtatRealisee"
                checked={formData.remiseEtatRealisee}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <span className={styles.checkmark}></span>
              Remise en état réalisée
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>Coût remise en état</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="coutRemiseEtat"
                value={formData.coutRemiseEtat || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
              <span className={styles.unit}>€</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Travaux réalisés</label>
            <textarea
              name="travauxRealises"
              value={formData.travauxRealises}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Nombre d'ouvrages</label>
            <input
              type="number"
              name="nbrOuvrages"
              value={formData.nbrOuvrages || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Volume</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="volume"
                value={formData.volume || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
              />
              <span className={styles.unit}>m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

   return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FontAwesomeIcon icon={faFileContract} className={styles.titleIcon} />
          Rapport d'Activité Minière
        </h1>
        
        {!isEditing && (
          <button 
            onClick={handleEdit}
            className={`${styles.actionButton} ${styles.editButton}`}
          >
            <FontAwesomeIcon icon={faEdit} className={styles.buttonIcon} /> Modifier
          </button>
        )}
      </div>
      
      {/* Status Messages */}
      {successMessage && (
        <div className={styles.statusMessage}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.statusIcon} /> {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className={styles.statusIcon} /> {errorMessage}
        </div>
      )}
      
      {/* Tabs Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'general' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <FontAwesomeIcon icon={faInfoCircle} className={styles.tabButtonIcon} /> Général
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'financial' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <FontAwesomeIcon icon={faEuroSign} className={styles.tabButtonIcon} /> Financier
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'physical' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('physical')}
        >
          <FontAwesomeIcon icon={faWeightHanging} className={styles.tabButtonIcon} /> Physique
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'workforce' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('workforce')}
        >
          <FontAwesomeIcon icon={faUsers} className={styles.tabButtonIcon} /> Effectifs
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'explosives' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('explosives')}
        >
          <FontAwesomeIcon icon={faBomb} className={styles.tabButtonIcon} /> Explosifs
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'remise' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('remise')}
        >
          <FontAwesomeIcon icon={faClipboardCheck} className={styles.tabButtonIcon} /> Remise
        </button>
      </div>
      
      {/* Tab Content */}
      <div className={styles.tabContainer}>
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'financial' && renderFinancialTab()}
        {activeTab === 'physical' && renderPhysicalTab()}
        {activeTab === 'workforce' && renderWorkforceTab()}
        {activeTab === 'explosives' && renderExplosivesTab()}
        {activeTab === 'remise' && renderRemiseTab()}
      </div>
      
      {/* Form Actions */}
      {(isEditing || isLoading) && (
        <div className={styles.formActions}>
          <button
            onClick={handleSave}
            className={`${styles.actionButton} ${styles.saveButton}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className={styles.spinAnimation} /> Enregistrement...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className={styles.buttonIcon} /> Enregistrer
              </>
            )}
          </button>
          
          <button
            onClick={handleCancel}
            className={`${styles.actionButton} ${styles.cancelButton}`}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} className={styles.buttonIcon} /> Annuler
          </button>
          
          <button
            onClick={handleDelete}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTrash} className={styles.buttonIcon} /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default ModernMiningForm;