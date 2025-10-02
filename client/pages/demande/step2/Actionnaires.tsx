import { useEffect } from 'react';
import styles from './formcomponent.module.css';

type Actionnaire = {
  nom: string;
  prenom: string;
  lieu_naissance: string;
  qualification: string;
  numero_carte: string;
  taux_participation: string;
  id_pays: number | null; // Pays de résidence
  id_nationalite?: number | null; // Nationalité (séparée du pays)
};

type Pays = {
  id_pays: number;
  nom_pays: string;
  nationalite: string;
};

type ActionnairesProps = {
  data: Actionnaire[];
  onChange: (data: Actionnaire[]) => void;
  disabled?: boolean;
  paysOptions?: Pays[];
};

export default function Actionnaires({
  data,
  onChange,
  disabled = false,
  paysOptions = []
}: ActionnairesProps) {

  const handleChange = (index: number, field: keyof Actionnaire, value: string) => {
    const updated = [...data];

    if ((field === 'id_pays' || field === 'id_nationalite') && value !== undefined) {
      updated[index] = { ...updated[index], [field]: value ? parseInt(value, 10) : null } as any;
    } else {
      updated[index] = { ...updated[index], [field]: value as any };
    }

    onChange(updated);
  };

  const addActionnaire = () => {
    onChange([
      ...data,
      {
        nom: '',
        prenom: '',
        lieu_naissance: '',
        qualification: '',
        numero_carte: '',
        taux_participation: '',
        id_pays: null,
        id_nationalite: null,
      },
    ]);
  };

  const removeActionnaire = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  useEffect(() => {
    // no-op; keep to follow original structure
  }, [data, paysOptions]);

  return (
    <div>
      {data.map((actionnaire, idx) => (
        <div key={idx} className={styles.actionnaireSection}>
          {!disabled && (
            <button
              onClick={() => removeActionnaire(idx)}
              className={styles.removeButton}
              type="button"
            >
              ×
            </button>
          )}

          <div className={styles.formGrid}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Nom"
              value={actionnaire.nom}
              onChange={(e) => handleChange(idx, 'nom', e.target.value)}
              required
              disabled={disabled}
            />
            <input
              type="text"
              className={styles.inputField}
              placeholder="Prénom"
              value={actionnaire.prenom}
              onChange={(e) => handleChange(idx, 'prenom', e.target.value)}
              required
              disabled={disabled}
            />
            <input
              type="text"
              className={styles.inputField}
              placeholder="Lieu de naissance"
              value={actionnaire.lieu_naissance}
              onChange={(e) => handleChange(idx, 'lieu_naissance', e.target.value)}
              required
              disabled={disabled}
            />

            {/* Nationalité */}
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Nationalité *</label>
              <select
                name="id_nationalite"
                className={`${styles.inputField} ${styles.selectField}`}
                value={actionnaire.id_nationalite ?? ''}
                onChange={(e) => {
                  handleChange(idx, 'id_nationalite', e.target.value);
                }}
                required
                disabled={disabled}
              >
                <option value="">Sélectionnez</option>
                {paysOptions.map((pays) => (
                  <option key={pays.id_pays} value={pays.id_pays}>
                    {pays.nationalite}
                  </option>
                ))}
              </select>
              {!actionnaire.id_nationalite && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                  Veuillez sélectionner une nationalité
                </div>
              )}
            </div>

            <input
              type="text"
              className={styles.inputField}
              placeholder="Qualification"
              value={actionnaire.qualification}
              onChange={(e) => handleChange(idx, 'qualification', e.target.value)}
              required
              disabled={disabled}
            />
            <input
              type="text"
              className={styles.inputField}
              placeholder="Numéro d'identité"
              value={actionnaire.numero_carte}
              onChange={(e) => handleChange(idx, 'numero_carte', e.target.value)}
              required
              disabled={disabled}
            />
            <input
              type="number"
              className={`${styles.inputField} ${styles.numberInput}`}
              min="0"
              max="100"
              placeholder="Taux de participation (%)"
              value={actionnaire.taux_participation}
              onChange={(e) => handleChange(idx, 'taux_participation', e.target.value)}
              required
              disabled={disabled}
            />

            {/* Pays */}
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Pays *</label>
              <select
                name="id_pays"
                className={`${styles.inputField} ${styles.selectField}`}
                value={actionnaire.id_pays || ''}
                onChange={(e) => {
                  handleChange(idx, 'id_pays', e.target.value);
                }}
                required
                disabled={disabled}
              >
                <option value="">Sélectionnez un pays</option>
                {paysOptions.map((pays) => (
                  <option key={pays.id_pays} value={pays.id_pays}>
                    {pays.nom_pays}
                  </option>
                ))}
              </select>
              {!actionnaire.id_pays && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                  Veuillez sélectionner un pays
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={styles.addButton}
        onClick={addActionnaire}
        disabled={disabled}
      >
        + Ajouter un actionnaire
      </button>
    </div>
  );
}

