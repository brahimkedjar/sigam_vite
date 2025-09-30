import React, { useEffect, useState } from 'react';
import styles from './Portail.module.css';
import Link from 'next/link';
import PortalStepper from '../../components/portal/PortalStepper';

type TypePermis = { id: number; code: string; label: string; initialYears?: number | null; description?: string | null };

export default function SelectType() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [types, setTypes] = useState<TypePermis[]>([]);
  const [selected, setSelected] = useState<TypePermis | null>(null);
  const [creating, setCreating] = useState(false);
  const [demandeId, setDemandeId] = useState<number | null>(null);

 useEffect(() => {
  (async () => {
    const res = await fetch(`${api}/portail/types`);
    const json = await res.json();

    // If backend returns { data: [...] }
    const array = Array.isArray(json) ? json : json.data;
    setTypes(array || []);
  })();
}, [api]);


  const createDemande = async () => {
    if (!selected) return;
    setCreating(true);
    try {
      const res = await fetch(`${api}/portail/demandes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_typePermis: selected.id }),
      });
      const d = await res.json();
      if (d?.id_demande) {
        setDemandeId(d.id_demande);
        try { localStorage.setItem('portal_session', JSON.stringify({ id: d.id_demande, token: d.sessionToken })); } catch {}
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Sélection du type de permis</h1></div>
      <PortalStepper
        current="type"
        steps={[
          { key: 'type', label: 'Type', href: '/portail/type' },
          { key: 'documents', label: 'Documents', href: demandeId ? `/portail/documents?id=${demandeId}&type=${selected?.id ?? ''}` : '#' },
          { key: 'infos', label: 'Infos', href: demandeId ? `/portail/infos?id=${demandeId}` : '#' },
          { key: 'company', label: 'Société', href: demandeId ? `/portail/company?id=${demandeId}` : '#' },
          { key: 'reps', label: 'Représentants', href: demandeId ? `/portail/representatives?id=${demandeId}` : '#' },
          { key: 'sh', label: 'Actionnaires', href: demandeId ? `/portail/shareholders?id=${demandeId}` : '#' },
          { key: 'loc', label: 'Localisation', href: demandeId ? `/portail/localisation?id=${demandeId}` : '#' },
          { key: 'perim', label: 'Périmètre', href: demandeId ? `/portail/perimetre?id=${demandeId}` : '#' },
          { key: 'pay', label: 'Paiement', href: demandeId ? `/portail/paiement?id=${demandeId}` : '#' },
          { key: 'review', label: 'Soumission', href: demandeId ? `/portail/review?id=${demandeId}` : '#' },
        ]}
      />
      <div className={styles.cardGrid}>
        {types.map((t) => (
          <button key={t.id} className={styles.card} onClick={() => setSelected(t)}>
            <h3 className={styles.cardTitle}>{t.label}</h3>
            <p className={styles.muted}>Code: {t.code} · Durée initiale: {t.initialYears ?? '—'} ans</p>
            {t.description && <p className={styles.hint}>{t.description}</p>}
          </button>
        ))}
      </div>
      {selected && (
        <div className={styles.card} style={{ marginTop: 16 }}>
          <h3 className={styles.cardTitle}>Détails sélectionnés</h3>
          <p className={styles.muted}>{selected.label} · {selected.code}</p>
          <div className={styles.actions}>
            {!demandeId ? (
              <button className={`${styles.btn} ${styles.primary}`} onClick={createDemande} disabled={creating}>
                {creating ? 'Création…' : 'Démarrer la demande'}
              </button>
            ) : (
              <>
                <Link className={`${styles.btn} ${styles.primary}`} href={`/portail/documents?id=${demandeId}&type=${selected.id}`}>Documents</Link>
                <Link className={styles.btn} href={`/portail/infos?id=${demandeId}`}>Informations</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
