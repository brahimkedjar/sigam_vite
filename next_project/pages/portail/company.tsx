import React, { useEffect, useMemo, useState } from 'react';
import styles from './Portail.module.css';
import PortalStepper from '../../components/portal/PortalStepper';

export default function PortailCompany() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = (() => {
    try { const v = localStorage.getItem('portal_session'); return v ? JSON.parse(v).token : undefined; } catch { return undefined; }
  })();

  useEffect(() => {
    (async () => {
      if (!api || !id) return;
      setLoading(true);
      try {
        const res = await fetch(`${api}/portail/demandes/${id}`, { headers: token ? { 'x-portal-token': token } : undefined });
        const data = await res.json();
        const c = data?.company || {};
        setForm({
          legalName: c.legalName || '',
          legalForm: c.legalForm || '',
          rcNumber: c.rcNumber || '',
          rcDate: c.rcDate ? String(c.rcDate).slice(0, 10) : '',
          nif: c.nif || '',
          nis: c.nis || '',
          capital: c.capital || '',
          address: c.address || '',
          email: c.email || '',
          phone: c.phone || '',
          website: c.website || '',
          managerName: c.managerName || '',
          registryFileUrl: c.registryFileUrl || '',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [api, id]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${api}/portail/demandes/${id}/company`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? {'x-portal-token': token}: {}) }, body: JSON.stringify(form) });
      alert('Société enregistrée');
    } finally { setSaving(false); }
  };

  const set = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }));

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Informations de la société</h1></div>
      <PortalStepper current="company" steps={[
        { key: 'type', label: 'Type', href: `/portail/type` },
        { key: 'documents', label: 'Documents', href: `/portail/documents?id=${id}` },
        { key: 'infos', label: 'Infos', href: `/portail/infos?id=${id}` },
        { key: 'company', label: 'Société', href: `/portail/company?id=${id}` },
        { key: 'reps', label: 'Représentants', href: `/portail/representatives?id=${id}` },
        { key: 'sh', label: 'Actionnaires', href: `/portail/shareholders?id=${id}` },
        { key: 'loc', label: 'Localisation', href: `/portail/localisation?id=${id}` },
        { key: 'perim', label: 'Périmètre', href: `/portail/perimetre?id=${id}` },
        { key: 'pay', label: 'Paiement', href: `/portail/paiement?id=${id}` },
        { key: 'review', label: 'Soumission', href: `/portail/review?id=${id}` },
      ]} />

      {!loading && (
        <div className={styles.card}>
          <div className={styles.row}>
            <div><label>Raison sociale</label><input className={styles.input} value={form.legalName} onChange={(e)=>set('legalName', e.target.value)} /></div>
            <div><label>Forme juridique</label><input className={styles.input} value={form.legalForm} onChange={(e)=>set('legalForm', e.target.value)} /></div>
          </div>
          <div className={styles.row}>
            <div><label>RC (numéro)</label><input className={styles.input} value={form.rcNumber} onChange={(e)=>set('rcNumber', e.target.value)} /></div>
            <div><label>RC (date)</label><input type="date" className={styles.input} value={form.rcDate} onChange={(e)=>set('rcDate', e.target.value)} /></div>
          </div>
          <div className={styles.row}>
            <div><label>NIF</label><input className={styles.input} value={form.nif} onChange={(e)=>set('nif', e.target.value)} /></div>
            <div><label>NIS</label><input className={styles.input} value={form.nis} onChange={(e)=>set('nis', e.target.value)} /></div>
          </div>
          <div className={styles.row}>
            <div><label>Capital social</label><input className={styles.input} value={form.capital} onChange={(e)=>set('capital', Number(e.target.value)||'')} /></div>
            <div><label>Directeur/Gérant</label><input className={styles.input} value={form.managerName} onChange={(e)=>set('managerName', e.target.value)} /></div>
          </div>
          <div className={styles.row}>
            <div><label>Email</label><input className={styles.input} value={form.email} onChange={(e)=>set('email', e.target.value)} /></div>
            <div><label>Téléphone</label><input className={styles.input} value={form.phone} onChange={(e)=>set('phone', e.target.value)} /></div>
          </div>
          <div className={styles.row}>
            <div><label>Adresse</label><input className={styles.input} value={form.address} onChange={(e)=>set('address', e.target.value)} /></div>
            <div><label>Site web</label><input className={styles.input} value={form.website} onChange={(e)=>set('website', e.target.value)} /></div>
          </div>
          <div><label>Registre (URL)</label><input className={styles.input} value={form.registryFileUrl} onChange={(e)=>set('registryFileUrl', e.target.value)} /></div>
          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.primary}`} onClick={save} disabled={saving}>{saving?'Enregistrement…':'Enregistrer'}</button>
            <a className={styles.btn} href={`/portail/representatives?id=${id}`}>Suivant</a>
          </div>
        </div>
      )}
    </div>
  );
}
