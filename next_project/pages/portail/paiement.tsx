import React, { useMemo, useState } from 'react';
import styles from './Portail.module.css';
import PortalStepper from '../../components/portal/PortalStepper';

export default function PortailPaiement() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [method, setMethod] = useState('card');
  const [creating, setCreating] = useState(false);
  const [intent, setIntent] = useState<any>(null);

  const token = (() => { try { const v = localStorage.getItem('portal_session'); return v ? JSON.parse(v).token : undefined; } catch { return undefined; }})();

  const createIntent = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${api}/portail/demandes/${id}/paiement/intents`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? {'x-portal-token': token}: {}) }, body: JSON.stringify({ method })
      });
      const data = await res.json();
      setIntent(data);
    } finally { setCreating(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Paiement</h1></div>
      <PortalStepper current="pay" steps={[
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
        <label>Méthode</label>
        <select className={styles.select} value={method} onChange={(e)=>setMethod(e.target.value)}>
          <option value="card">Carte (Visa / MasterCard)</option>
          <option value="eccp">ECCP</option>
        </select>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={createIntent} disabled={creating}>
            {creating ? 'Initialisation…' : 'Initialiser le paiement'}
          </button>
        </div>
        {intent && (
          <div style={{marginTop:12}}>
            <div className={styles.muted}>Identifiant: {intent.id}</div>
            <div className={styles.muted}>Statut: {intent.status}</div>
            <div className={styles.hint}>Simulation d’intention. Intégrez votre PSP ici.</div>
          </div>
        )}
        <div className={styles.actions}>
          <a className={styles.btn} href={`/portail/review?id=${id}`}>Étape suivante</a>
        </div>
      </div>
    </div>
  );
}
