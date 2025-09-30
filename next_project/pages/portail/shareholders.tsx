import React, { useEffect, useMemo, useState } from 'react';
import styles from './Portail.module.css';
import PortalStepper from '../../components/portal/PortalStepper';

type Sh = { name: string; type: string; nif?: string; sharePct: number; nationality?: string };

export default function PortailShareholders() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [items, setItems] = useState<Sh[]>([{ name: '', type: 'person', sharePct: 0 }]);
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
        const list = data?.company?.shareholders || [];
        setItems(list.length ? list : [{ name: '', type: 'person', sharePct: 0 }]);
      } finally { setLoading(false); }
    })();
  }, [api, id]);

  const add = () => setItems((prev) => [...prev, { name: '', type: 'person', sharePct: 0 }]);
  const remove = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const set = (idx: number, k: keyof Sh, v: any) => setItems((prev) => prev.map((r, i) => i===idx? { ...r, [k]: v }: r));

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${api}/portail/demandes/${id}/shareholders`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token? {'x-portal-token': token}: {}) }, body: JSON.stringify({ shareholders: items })
      });
      alert('Actionnaires enregistrés');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Actionnaires</h1></div>
      <PortalStepper current="sh" steps={[
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
          {items.map((s, idx) => (
            <div className={styles.row} key={idx}>
              <div><label>Nom</label><input className={styles.input} value={s.name} onChange={(e)=>set(idx,'name',e.target.value)} /></div>
              <div><label>Type</label>
                <select className={styles.select} value={s.type} onChange={(e)=>set(idx,'type',e.target.value)}>
                  <option value="person">Personne physique</option>
                  <option value="company">Personne morale</option>
                </select>
              </div>
              <div><label>NIF</label><input className={styles.input} value={s.nif||''} onChange={(e)=>set(idx,'nif',e.target.value)} /></div>
              <div><label>Part (%)</label><input className={styles.input} value={s.sharePct} onChange={(e)=>set(idx,'sharePct',Number(e.target.value)||0)} /></div>
              <div><label>Nationalité</label><input className={styles.input} value={s.nationality||''} onChange={(e)=>set(idx,'nationality',e.target.value)} /></div>
              <div className={styles.actions}><button className={styles.btn} onClick={() => remove(idx)}>Supprimer</button></div>
            </div>
          ))}
          <div className={styles.actions}>
            <button className={styles.btn} onClick={add}>Ajouter</button>
            <button className={`${styles.btn} ${styles.primary}`} onClick={save} disabled={saving}>{saving?'Enregistrement…':'Enregistrer'}</button>
            <a className={styles.btn} href={`/portail/localisation?id=${id}`}>Suivant</a>
          </div>
        </div>
      )}
    </div>
  );
}
