import React, { useEffect, useMemo, useState } from 'react';
import styles from './Portail.module.css';
import PortalStepper from '../../components/portal/PortalStepper';

export default function PortailReview() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const [data, setData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!api || !id) return;
      const res = await fetch(`${api}/portail/demandes/${id}`);
      setData(await res.json());
    })();
  }, [api, id]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${api}/portail/demandes/${id}/submit`, { method: 'POST' });
      const r = await res.json();
      alert(`Demande soumise: ${r.code}`);
    } finally { setSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Revue & Soumission</h1></div>
      <PortalStepper current="review" steps={[
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

      {data && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Résumé</h3>
          <div className={styles.muted}>Code: {data.code || '—'} · Statut: {data.status}</div>
          <div className={styles.muted}>Type: {data.permitType?.label} ({data.permitType?.code})</div>
          <div style={{marginTop:12}}>
            <h4>Documents</h4>
            <table className={styles.table}><thead><tr><th>Nom</th><th>Statut</th><th>Fichier</th></tr></thead>
              <tbody>
                {(data.documents||[]).map((d: any) => (
                  <tr key={d.id}><td>{d.document?.name}</td><td>{d.status}</td><td><a href={d.fileUrl} target="_blank" rel="noreferrer">{d.fileUrl? 'Voir' : '—'}</a></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:12}}>
            <h4>Société</h4>
            <div className={styles.muted}>{data.company?.legalName} · {data.company?.legalForm} · NIF: {data.company?.nif}</div>
            <div className={styles.muted}>RC: {data.company?.rcNumber} ({data.company?.rcDate ? String(data.company.rcDate).slice(0,10):'—'})</div>
          </div>
          <div style={{marginTop:12}}>
            <h4>Représentants</h4>
            <ul>
              {(data.company?.reps||[]).map((r: any, idx: number) => (<li key={idx}>{r.fullName} — {r.function}</li>))}
            </ul>
          </div>
          <div style={{marginTop:12}}>
            <h4>Actionnaires</h4>
            <ul>
              {(data.company?.shareholders||[]).map((s: any, idx: number) => (<li key={idx}>{s.name} — {s.sharePct}%</li>))}
            </ul>
          </div>
          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.primary}`} onClick={submit} disabled={submitting}>{submitting?'Soumission…':'Soumettre la demande'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

