import React, { useEffect, useMemo, useState } from 'react';
import styles from './Portail.module.css';
import Link from 'next/link';
import PortalStepper from '../../components/portal/PortalStepper';

type Doc = { id_doc: number; nom_doc: string; is_obligatoire: boolean; format?: string; taille_doc?: string };

export default function PortailDocuments() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);
  const type = useMemo(() => Number(params.get('type') || 0), [params]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploads, setUploads] = useState<Record<number, { file?: File; url?: string; status: 'present'|'manquant' }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!api || !type) return;
    (async () => {
      const res = await fetch(`${api}/portail/types/${type}/documents`);
      const data = await res.json();
      setDocs(data);
    })();
  }, [api, type]);

  const onFile = (d: Doc, f?: File) => {
    setUploads((prev) => ({ ...prev, [d.id_doc]: { file: f, status: f ? 'present' : 'manquant' } }));
  };

  const save = async () => {
    setSaving(true);
    try {
      // Here we assume files are already uploaded externally and we store URLs.
      // You can replace with a real upload and fill url.
      const payload = docs.map((d) => ({ id_doc: d.id_doc, status: uploads[d.id_doc]?.status || (d.is_obligatoire ? 'manquant' : 'present'), file_url: uploads[d.id_doc]?.url || null }));
      await fetch(`${api}/portail/demandes/${id}/documents`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documents: payload })
      });
      alert('Documents sauvegardés');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Documents requis</h1></div>
      <PortalStepper
        current="documents"
        steps={[
          { key:'type', label:'Type', href:'/portail/type' },
          { key:'documents', label:'Documents', href:`/portail/documents?id=${id}&type=${type}` },
          { key:'infos', label:'Infos', href:`/portail/infos?id=${id}` },
          { key:'company', label:'Société', href:`/portail/company?id=${id}` },
          { key:'reps', label:'Représentants', href:`/portail/representatives?id=${id}` },
          { key:'sh', label:'Actionnaires', href:`/portail/shareholders?id=${id}` },
          { key:'loc', label:'Localisation', href:`/portail/localisation?id=${id}` },
          { key:'perim', label:'Périmètre', href:`/portail/perimetre?id=${id}` },
          { key:'pay', label:'Paiement', href:`/portail/paiement?id=${id}` },
          { key:'review', label:'Soumission', href:`/portail/review?id=${id}` },
        ]}
      />
      <table className={styles.table}>
        <thead>
          <tr><th>Document</th><th>Obligatoire</th><th>Format / Taille</th><th>Pièce</th></tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id_doc}>
              <td>{d.nom_doc}</td>
              <td>{d.is_obligatoire ? <span className={`${styles.badge} ${styles.badgeReq}`}>Obligatoire</span> : <span className={`${styles.badge} ${styles.badgeOk}`}>Facultatif</span>}</td>
              <td className={styles.hint}>{d.format || '*'} / {d.taille_doc || '10MB'}</td>
              <td>
                <input className={styles.file} type="file" onChange={(e) => onFile(d, e.target.files?.[0])} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={save} disabled={saving}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</button>
        <Link className={`${styles.btn} ${styles.primary}`} href={`/portail/infos?id=${id}`}>Suivant</Link>
      </div>
    </div>
  );
}
