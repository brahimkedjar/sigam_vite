import styles from './DetenteurCard.module.css';

export default function DetenteurCard({ detenteur }) {
  if (!detenteur) return null;

  const registreList = Array.isArray(detenteur.registreCommerce)
    ? detenteur.registreCommerce
    : detenteur.registreCommerce
    ? [detenteur.registreCommerce]
    : [];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{detenteur.nom_societeFR || 'Detenteur'}</h3>
        {detenteur.nom_societeAR && <p className={styles.subtitle}>{detenteur.nom_societeAR}</p>}
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.icon}>*</span>
          <span className={styles.text}>{detenteur.adresse_siege || 'Adresse non specifiee'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}>T</span>
          <span className={styles.text}>{detenteur.telephone || 'Non specifie'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}>F</span>
          <span className={styles.text}>{detenteur.fax || 'Non specifie'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}>@</span>
          <span className={styles.text}>{detenteur.email || 'Non specifie'}</span>
        </div>
        {detenteur.site_web && (
          <div className={styles.detailItem}>
            <span className={styles.icon}>www</span>
            <span className={styles.text}>{detenteur.site_web}</span>
          </div>
        )}
      </div>

      {registreList.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Registre de commerce</h4>
          {registreList.map((rc) => (
            <div key={rc.id ?? rc.numero_rc} className={styles.registreItem}>
              <div className={styles.registreDetail}>
                <span className={styles.label}>RC:</span>
                <span className={styles.value}>{rc.numero_rc || '-'}</span>
              </div>
              <div className={styles.registreDetail}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>
                  {rc.date_enregistrement
                    ? new Date(rc.date_enregistrement).toLocaleDateString()
                    : '-'}
                </span>
              </div>
              <div className={styles.registreDetail}>
                <span className={styles.label}>Capital:</span>
                <span className={styles.value}>
                  {rc.capital_social != null ? `${rc.capital_social} DZD` : '-'}
                </span>
              </div>
              <div className={styles.registreDetail}>
                <span className={styles.label}>NIS:</span>
                <span className={styles.value}>{rc.nis || '-'}</span>
              </div>
              <div className={styles.registreDetail}>
                <span className={styles.label}>Adresse legale:</span>
                <span className={styles.value}>{rc.adresse_legale || '-'}</span>
              </div>
              <div className={styles.registreDetail}>
                <span className={styles.label}>NIF:</span>
                <span className={styles.value}>{rc.nif || '-'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {detenteur.fonctions && detenteur.fonctions.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Representants et actionnaires</h4>
          {detenteur.fonctions.map((fonction) => (
            <div key={`${fonction.id_detenteur}-${fonction.id_personne}`} className={styles.personItem}>
              <div className={styles.personHeader}>
                <span className={styles.personName}>
                  {fonction.personne?.nomFR} {fonction.personne?.prenomFR}
                </span>
                <span className={styles.personRole}>{fonction.type_fonction}</span>
              </div>
              <div className={styles.personDetails}>
                {fonction.personne?.telephone && (
                  <span className={styles.personDetail}>{fonction.personne.telephone}</span>
                )}
                {fonction.personne?.email && (
                  <span className={styles.personDetail}>{fonction.personne.email}</span>
                )}
                {fonction.taux_participation != null && (
                  <span className={styles.participation}>
                    Taux: {fonction.taux_participation}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
