import styles from './formcomponent.module.css'

type RepresentantLegalData = {
  nom: string
  prenom: string
  nom_ar: string
  prenom_ar: string
  tel: string
  email: string
  fax: string
  qualite: string
  nin: string
  taux_participation: string
  id_pays: number | null
  id_nationalite?: number | null
}

type Pays = {
  id_pays: number
  nom_pays: string
  nationalite: string
}

type RepresentantLegalProps = {
  data: RepresentantLegalData
  onChange: (data: RepresentantLegalData) => void
  disabled?: boolean
  paysOptions?: Pays[]
  nationalitesOptions?: { id_nationalite: number; libelle: string }[]
}

export default function RepresentantLegal({
  data,
  onChange,
  disabled = false,
  paysOptions = [],
  nationalitesOptions = [],
}: RepresentantLegalProps) {
  if (!data) return <p>Aucune donnée disponible pour le représentant légal.</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'id_pays' || name === 'id_nationalite') {
      onChange({ ...data, [name]: value ? parseInt(value, 10) : null } as any)
    } else {
      onChange({ ...data, [name]: value } as any)
    }
  }

  return (
    <div className={styles.formGrid}>
      <input name="nom" className={styles.inputField} value={data.nom} onChange={handleChange} placeholder="Nom (FR)" required disabled={disabled} />
      <input name="prenom" className={styles.inputField} value={data.prenom} onChange={handleChange} placeholder="Prénom (FR)" required disabled={disabled} />
      <input name="nom_ar" className={`${styles.inputField} ${styles.arabicInput}`} value={data.nom_ar} onChange={handleChange} placeholder="Nom (AR)" required disabled={disabled} />
      <input name="prenom_ar" className={`${styles.inputField} ${styles.arabicInput}`} value={data.prenom_ar} onChange={handleChange} placeholder="Prénom (AR)" required disabled={disabled} />
      <input name="tel" className={styles.inputField} value={data.tel} onChange={handleChange} placeholder="Téléphone" required disabled={disabled} />
      <input type="email" name="email" className={styles.inputField} value={data.email} onChange={handleChange} placeholder="Email" required disabled={disabled} />
      <input name="fax" className={styles.inputField} value={data.fax} onChange={handleChange} placeholder="Fax" disabled={disabled} />

      <select name="qualite" className={`${styles.inputField} ${styles.selectField}`} value={data.qualite} onChange={handleChange} required disabled={disabled}>
        <option value="">Qualité du représentant</option>
        <option value="Gérant">Gérant</option>
        <option value="Gérante">Gérante</option>
        <option value="DG">DG</option>
        <option value="PCA">PCA</option>
        <option value="PDG">PDG</option>
        <option value="Président">Président</option>
      </select>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Nationalité *</label>
        <select
          name="id_nationalite"
          className={`${styles.inputField} ${styles.selectField}`}
          value={data.id_nationalite ?? ''}
          onChange={handleChange}
          required
          disabled={disabled}
        >
          <option value="">Sélectionnez</option>
          {nationalitesOptions.map((n) => (
            <option key={n.id_nationalite} value={n.id_nationalite}>
              {n.libelle}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Pays *</label>
        <select
          name="id_pays"
          className={`${styles.inputField} ${styles.selectField}`}
          value={data.id_pays || ''}
          onChange={handleChange}
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
      </div>

      <input name="nin" className={styles.inputField} value={data.nin} onChange={handleChange} placeholder="Numéro NIN" required disabled={disabled} />
      <input name="taux_participation" type="number" className={styles.inputField} value={data.taux_participation} onChange={handleChange} placeholder="Taux de participation (%)" min="0" max="100" disabled={disabled} />
    </div>
  )
}

