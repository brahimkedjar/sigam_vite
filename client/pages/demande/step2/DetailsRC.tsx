import styles from './formcomponent.module.css'
type DetailsRCProps = {
  data: {
    numero_rc: string;
    date_enregistrement: string;
    capital_social: string;
    nis: string;
    adresse_legale: string;
    nif: string;
  };
  onChange: (data: DetailsRCProps['data']) => void;
  disabled?: boolean;
};

export default function DetailsRC({ data, onChange, disabled = false }: DetailsRCProps) {
  if (!data) return <p>Aucune donnée disponible pour les détails RC.</p>; // Or just return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className={styles.formGrid}>
  <input type="text" name="numero_rc" className={styles.inputField} placeholder="Numéro RC" value={data.numero_rc} onChange={handleChange} required disabled={disabled}/>
  <input type="date" name="date_enregistrement" className={`${styles.inputField} ${styles.dateInput}`} value={data.date_enregistrement} onChange={handleChange} required disabled={disabled}/>
  <input type="number" min="0" name="capital_social" className={`${styles.inputField} ${styles.numberInput}`} placeholder="Capital social (DA)" value={data.capital_social} onChange={handleChange} required disabled={disabled}/>
  <input type="text" name="nis" className={styles.inputField} placeholder="Numéro NIS" value={data.nis} onChange={handleChange} required disabled={disabled}/>
  <input type="text" name="adresse_legale" className={styles.inputField} placeholder="Adresse du siege" value={data.adresse_legale} onChange={handleChange} required disabled={disabled}/>
  <input type="text" name="nif" className={styles.inputField} placeholder="Numéro NIF" value={data.nif} onChange={handleChange} required disabled={disabled}/>
</div>
  );
}
