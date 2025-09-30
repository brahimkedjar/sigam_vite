import React, { useMemo, useState } from 'react';
import styles from './Portail.module.css';
import Link from 'next/link';
import PortalStepper from '../../components/portal/PortalStepper';

export default function PortailInfos() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [societe, setSociete] = useState('');
  const [email, setEmail] = useState('');
  const [intitule, setIntitule] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${api}/portail/demandes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_demande: id, intitule_projet: intitule })
      });
      alert('Informations enregistrées');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Informations du demandeur</h1></div>
      <PortalStepper current="infos" steps={[
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
            <label>Raison sociale</label>
            <input className={styles.input} value={societe} onChange={(e)=>setSociete(e.target.value)} placeholder="Société" />
          </div>
          <div>
            <label>Email</label>
            <input className={styles.input} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email@exemple.dz" />
          </div>
        </div>
        <div style={{marginTop:12}}>
          <label>Intitulé du projet</label>
          <input className={styles.input} value={intitule} onChange={(e)=>setIntitule(e.target.value)} placeholder="Intitulé du projet" />
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={save} disabled={saving}>{saving?'Enregistrement…':'Enregistrer'}</button>
          <Link className={`${styles.btn} ${styles.primary}`} href={`/portail/localisation?id=${id}`}>Suivant</Link>
        </div>
      </div>
    </div>
  );
}
