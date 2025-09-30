import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import styles from './Portail.module.css';
import Link from 'next/link';
import PortalStepper from '../../components/portal/PortalStepper';

const ArcGISMap = dynamic(() => import('../../components/map/ArcGISMap'), { ssr: false });

export default function PortailPerimetre() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = useMemo(() => Number(params.get('id') || 0), [params]);

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Périmètre — Visualisation</h1></div>
      <PortalStepper current="perim" steps={[
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
      <div className={styles.mapBox}>
        <ArcGISMap />
      </div>
      <div className={styles.actions}>
        <Link className={`${styles.btn} ${styles.primary}`} href={`/portail/paiement?id=${id}`}>Procéder au paiement</Link>
      </div>
    </div>
  );
}
