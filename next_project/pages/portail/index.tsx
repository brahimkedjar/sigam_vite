import Link from 'next/link';
import styles from './Portail.module.css';

export default function PortailHome() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Portail Demandeur — Titres Miniers</h1>
          <div className={styles.subTitle}>Lancez une nouvelle demande et suivez les étapes de constitution du dossier.</div>
        </div>
      </div>
      <div className={styles.hero}>
        <p className={styles.muted}>Pour des raisons de confidentialité, ce portail n’affiche pas les procédures internes. Veuillez initier votre demande et compléter les étapes requises.</p>
      </div>
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Nouvelle Demande</h3>
          <p className={styles.muted}>Sélection du type de permis et démarrage</p>
          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.primary}`} href="/portail/type">Commencer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
