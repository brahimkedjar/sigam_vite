import React, { useEffect, useMemo, useState } from 'react';
import styles from './Portail.module.css';
import PortalStepper from '../../components/portal/PortalStepper';

type Rep = { fullName: string; function?: string; nationalId?: string; email?: string; phone?: string; powerDocUrl?: string };

export default function PortailRepresentatives() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [reps, setReps] = useState<Rep[]>([{ fullName: '' }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = (() => { try { const v = localStorage.getItem('portal_session'); return v ? JSON.parse(v).token : undefined; } catch { return undefined; }})();

  useEffect(() => {
    (async () => {
      if (!api || !id) return;
      setLoading(true);
      try {
        const res = await fetch(`${api}/portail/demandes/${id}`, { headers: token ? { 'x-portal-token': token } : undefined });
        const data = await res.json();
        const list = data?.company?.reps || [];
        setReps(list.length ? list : [{ fullName: '' }]);
      } finally { setLoading(false); }
    })();
  }, [api, id]);

  const add = () => setReps((prev) => [...prev, { fullName: '' }]);
  const remove = (idx: number) => setReps((prev) => prev.filter((_, i) => i !== idx));
  const set = (idx: number, k: keyof Rep, v: any) => setReps((prev) => prev.map((r, i) => i===idx? { ...r, [k]: v }: r));

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${api}/portail/demandes/${id}/representatives`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token? {'x-portal-token': token}: {}) }, body: JSON.stringify({ representatives: reps })
      });
      alert('Représentants enregistrés');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Représentants</h1></div>
      <PortalStepper current="reps" steps={[
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

      {!loading && (
        <div className={styles.card}>
          {reps.map((r, idx) => (
            <div className={styles.row} key={idx}>
              <div><label>Nom complet</label><input className={styles.input} value={r.fullName} onChange={(e)=>set(idx,'fullName',e.target.value)} /></div>
              <div><label>Fonction</label><input className={styles.input} value={r.function||''} onChange={(e)=>set(idx,'function',e.target.value)} /></div>
              <div><label>Numéro d'identité</label><input className={styles.input} value={r.nationalId||''} onChange={(e)=>set(idx,'nationalId',e.target.value)} /></div>
              <div><label>Email</label><input className={styles.input} value={r.email||''} onChange={(e)=>set(idx,'email',e.target.value)} /></div>
              <div><label>Téléphone</label><input className={styles.input} value={r.phone||''} onChange={(e)=>set(idx,'phone',e.target.value)} /></div>
              <div><label>Mandat (URL)</label><input className={styles.input} value={r.powerDocUrl||''} onChange={(e)=>set(idx,'powerDocUrl',e.target.value)} /></div>
              <div className={styles.actions}><button className={styles.btn} onClick={() => remove(idx)}>Supprimer</button></div>
            </div>
          ))}
          <div className={styles.actions}>
            <button className={styles.btn} onClick={add}>Ajouter</button>
            <button className={`${styles.btn} ${styles.primary}`} onClick={save} disabled={saving}>{saving?'Enregistrement…':'Enregistrer'}</button>
            <a className={styles.btn} href={`/portail/shareholders?id=${id}`}>Suivant</a>
          </div>
        </div>
      )}
    </div>
  );
}
