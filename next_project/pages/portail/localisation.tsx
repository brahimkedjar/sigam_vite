import React, { useMemo, useState } from 'react';
import styles from './Portail.module.css';
import Link from 'next/link';
import PortalStepper from '../../components/portal/PortalStepper';

export default function PortailLocalisation() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [wilaya, setWilaya] = useState<number | ''>('');
  const [daira, setDaira] = useState<number | ''>('');
  const [commune, setCommune] = useState<number | ''>('');
  const [lieu, setLieu] = useState('');
  const [saving, setSaving] = useState(false);

  const token = (() => { try { const v = localStorage.getItem('portal_session'); return v ? JSON.parse(v).token : undefined; } catch { return undefined; }})();

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${api}/portail/demandes/${id}/coords`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? {'x-portal-token': token}: {}) },
        body: JSON.stringify({ id_wilaya: wilaya || null, id_daira: daira || null, id_commune: commune || null, lieu_dit: lieu })
      });
      alert('Localisation sauvegardée');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Localisation administrative</h1></div>
      <PortalStepper current="loc" steps={[
        { key:'type', label:'Type', href:`/portail/type`},
        { key:'documents', label:'Documents', href:`/portail/documents?id=${id}`},
        { key:'infos', label:'Infos', href:`/portail/infos?id=${id}`},
        { key:'company', label:'Société', href:`/portail/company?id=${id}`},
        { key:'reps', label:'Représentants', href:`/portail/representatives?id=${id}`},
        { key:'sh', label:'Actionnaires', href:`/portail/shareholders?id=${id}`},
        { key:'loc', label:'Localisation', href:`/portail/localisation?id=${id}`},
        { key:'perim', label:'Périmètre', href:`/portail/perimetre?id=${id}`},
        { key:'pay', label:'Paiement', href:`/portail/paiement?id=${id}`},
        { key:'review', label:'Soumission', href:`/portail/review?id=${id}`},
      ]} />
      <div className={styles.card}>
        <div className={styles.row}>
          <div>
            <label>Wilaya</label>
            <input className={styles.input} value={wilaya as any} onChange={(e)=>setWilaya(Number(e.target.value)||'')} placeholder="ID wilaya" />
          </div>
          <div>
            <label>Daira</label>
            <input className={styles.input} value={daira as any} onChange={(e)=>setDaira(Number(e.target.value)||'')} placeholder="ID daira" />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <label>Commune</label>
            <input className={styles.input} value={commune as any} onChange={(e)=>setCommune(Number(e.target.value)||'')} placeholder="ID commune" />
          </div>
          <div>
            <label>Lieu-dit</label>
            <input className={styles.input} value={lieu} onChange={(e)=>setLieu(e.target.value)} placeholder="Lieu-dit" />
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={save} disabled={saving}>{saving?'Sauvegarde…':'Sauvegarder'}</button>
          <Link className={`${styles.btn} ${styles.primary}`} href={`/portail/perimetre?id=${id}`}>Suivant</Link>
        </div>
      </div>
    </div>
  );
}
