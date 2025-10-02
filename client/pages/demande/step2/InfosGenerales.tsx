import styles from './formcomponent.module.css';
import { useState, useEffect } from 'react';

// Define types for better type safety
type StatutJuridique = {
  id_statutJuridique: number;
  code_statut: string;
  statut_fr: string;
  statut_ar: string;
};

type Pays = {
  id_pays: number;
  nom_pays: string;
  nationalite: string;
};

type InfosGeneralesData = {
  nom_fr: string;
  nom_ar: string;
  statut_id: number;
  tel: string;
  email: string;
  fax: string;
  adresse: string;
  //nationalite: string;
  id_pays: number | null;
  id_nationalite?: number | null;
};

type InfosGeneralesProps = {
  data: InfosGeneralesData;
  onChange: (data: InfosGeneralesData) => void;
  disabled?: boolean;
  statutsJuridiques?: StatutJuridique[];
  paysOptions?: Pays[];
  loading?: boolean;
};

export default function InfosGenerales({ 
  data, 
  onChange, 
  disabled = false,
  statutsJuridiques = [],
  paysOptions = [],
  loading = false 
}: InfosGeneralesProps) {
  const [showManualCountryInput, setShowManualCountryInput] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === "manual") {
      setShowManualCountryInput(true);
      onChange({ ...data, id_pays: null });
    } else {
      setShowManualCountryInput(false);
      const selectedPays = paysOptions.find(p => p.id_pays.toString() === value);
      onChange({ 
        ...data, 
        id_pays: value ? parseInt(value, 10) : null,
      });
    }
  };

  // Show skeleton loading if data is loading
  if (loading) {
    return (
      <div className={styles.formGrid}>
        {[...Array(9)].map((_, index) => (
          <div key={index} className={styles.inputSkeleton}></div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.formGrid}>
      {/* Company Name (French) */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Nom société (FR)</label>
        <input
          name="nom_fr"
          className={styles.inputField}
          value={data.nom_fr}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>

      {/* Company Name (Arabic) */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>اسم الشركة (AR)</label>
        <input
          name="nom_ar"
          className={`${styles.inputField} ${styles.arabicInput}`}
          value={data.nom_ar}
          onChange={handleChange}
          required
          disabled={disabled}
          dir="rtl"
        />
      </div>

      {/* Legal Status */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Statut juridique</label>
        <select
          name="statut_id"
          className={`${styles.inputField} ${styles.selectField}`}
          value={data.statut_id}
          onChange={handleChange}
          required
          disabled={disabled}
        >
          <option value="">Sélectionnez un statut</option>
          {statutsJuridiques.map(statut => (
            <option key={statut.id_statutJuridique} value={statut.id_statutJuridique}>
              {statut.code_statut} - {statut.statut_fr}
            </option>
          ))}
        </select>
      </div>

      {/* Country Dropdown */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Pays</label>
        <select
          name="id_pays"
          className={`${styles.inputField} ${styles.selectField}`}
          value={data.id_pays || ''}
          onChange={handleCountryChange}
          required
          disabled={disabled}
        >
          <option value="">Sélectionnez un pays</option>
          {paysOptions.map(pays => (
            <option key={pays.id_pays} value={pays.id_pays}>
              {pays.nom_pays}
            </option>
          ))}
          <option value="manual">Autre (saisir manuellement)</option>
        </select>
      </div>

      

      {/* Phone */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Téléphone</label>
        <input
          name="tel"
          type="tel"
          className={styles.inputField}
          value={data.tel}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Email</label>
        <input
          name="email"
          type="email"
          className={styles.inputField}
          value={data.email}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>

      {/* Fax */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Numero Fax</label>
        <input
          name="fax"
          className={styles.inputField}
          value={data.fax}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      {/* Address */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Adresse complète</label>
        <input
          name="adresse"
          className={styles.inputField}
          value={data.adresse}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>

      {/* Nationality */}
      <div className={styles.formGroup}>
  <label className={styles.inputLabel}>Nationalité *</label>
  <select
    name="id_nationalite"
    className={`${styles.inputField} ${styles.selectField}`}
    value={data.id_nationalite ?? ''}
    onChange={(e) => onChange({ ...data, id_nationalite: parseInt(e.target.value) })}
    required
    disabled={disabled}
  >
    <option value="">Sélectionnez</option>
    {paysOptions.map(pays => (
      <option key={pays.id_pays} value={pays.id_pays}>
        {pays.nationalite}
      </option>
    ))}
  </select>
</div>
    </div>
  );
}
