import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import styles from './demandes.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export default function DemandeDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  // Fallback for React Router dynamic segment
  const derivedId = (() => {
    try {
      const parts = (window.location.pathname || '').split('/').filter(Boolean);
      return parts[parts.length - 1];
    } catch { return undefined; }
  })();
  const effectiveId = id || derivedId;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveId) return;
    
    setLoading(true);
    setError(null);
    
    axios.get(`${API_BASE}/demandes_dashboard/${effectiveId}`)
      .then(r => {
        console.log("Fetched item:", r.data);
        setItem(r.data);
      })
      .catch(err => {
        console.error('Error fetching demande:', err);
        setError('Erreur lors du chargement des données');
      })
      .finally(() => setLoading(false));
      console.log("Loading state:", item);
  }, [effectiveId]);

  if (loading) return (
    <div className={styles.detailPage}>
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Chargement des détails de la demande...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.detailPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>❌</div>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <Link href="/demand_dashboard" className={styles.primaryBtn}>
          Retour à la liste
        </Link>
      </div>
    </div>
  );

  if (!item) return (
    <div className={styles.detailPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <h3>Demande non trouvée</h3>
        <p>La demande #{id} n'existe pas ou n'a pas pu être chargée.</p>
        <Link href="/demand_dashboard" className={styles.primaryBtn}>
          Retour à la liste
        </Link>
      </div>
    </div>
  );

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  // Helper function to format numbers
  const formatNumber = (value: number | null | undefined, suffix: string = '') => {
    if (value === null || value === undefined) return '—';
    return `${value.toLocaleString()}${suffix}`;
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <div className={styles.headerLeft}>
          <Link href="/demand_dashboard" className={styles.backButton}>
            ← Retour
          </Link>
          <h1>Demande #{item.id_demande}</h1>
          <p className={styles.subtitle}>{item.code_demande || 'Sans code'}</p>
        </div>
        <span className={`${styles.badge} ${styles['status_' + (item.statut_demande || 'NA').toLowerCase()]}`}>
          {item.statut_demande || '—'}
        </span>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <h3>Infos principales</h3>
          <div className={styles.kv}><label>Code</label><span className={styles.mono}>{item.code_demande ?? '—'}</span></div>
          <div className={styles.kv}><label>Date de demande</label><span>{formatDate(item.date_demande)}</span></div>
          <div className={styles.kv}><label>Date d'instruction</label><span>{formatDate(item.date_instruction)}</span></div>
          <div className={styles.kv}><label>Date fin instruction</label><span>{formatDate(item.date_fin_instruction)}</span></div>
          <div className={styles.kv}><label>Date de refus</label><span>{formatDate(item.date_refus)}</span></div>
          <div className={styles.kv}><label>Projet</label><span>{item.intitule_projet ?? '—'}</span></div>
          <div className={styles.kv}><label>Description des travaux</label><span>{item.description_travaux ?? '—'}</span></div>
        </div>

        <div className={styles.detailCard}>
          <h3>Localisation</h3>
          <div className={styles.kv}><label>Wilaya</label><span>{item.wilaya?.nom_wilayaFR ?? '—'}</span></div>
          <div className={styles.kv}><label>Daira</label><span>{item.daira?.nom_dairaFR ?? '—'}</span></div>
          <div className={styles.kv}><label>Commune</label><span>{item.commune?.nom_communeFR ?? '—'}</span></div>
          <div className={styles.kv}><label>Lieu-dit (FR)</label><span>{item.lieu_ditFR ?? '—'}</span></div>
          <div className={styles.kv}><label>Lieu-dit (AR)</label><span>{item.lieu_dit_ar ?? '—'}</span></div>
          <div className={styles.kv}><label>Point d'origine</label><span>{item.locPointOrigine ?? '—'}</span></div>
        </div>

        <div className={styles.detailCard}>
          <h3>Typologie</h3>
          <div className={styles.kv}><label>Type Permis</label><span>{item.typePermis?.libelle ?? '—'}</span></div>
          <div className={styles.kv}><label>Type Procédure</label><span>{item.typeProcedure?.libelle ?? '—'}</span></div>
          <div className={styles.kv}><label>Statut juridique terrain</label><span>{item.statut_juridique_terrain ?? '—'}</span></div>
          <div className={styles.kv}><label>Occupant terrain légal</label><span>{item.occupant_terrain_legal ?? '—'}</span></div>
          <div className={styles.kv}><label>Destination</label><span>{item.destination ?? '—'}</span></div>
        </div>

        <div className={styles.detailCard}>
          <h3>Détenteur & Expert</h3>
          <div className={styles.kv}><label>Détenteur</label><span>{item.detenteur?.nom_societeFR ?? '—'}</span></div>
          <div className={styles.kv}><label>NIF</label><span className={styles.mono}>{item.detenteur?.nif ?? '—'}</span></div>
          <div className={styles.kv}><label>Adresse</label><span>{item.detenteur?.adresse_siege ?? '—'}</span></div>
          <div className={styles.kv}><label>Téléphone</label><span>{item.detenteur?.telephone ?? '—'}</span></div>
          <div className={styles.kv}><label>Fax</label><span>{item.detenteur?.fax ?? '—'}</span></div>
          <div className={styles.kv}><label>Expert minier</label><span>{item.expertMinier?.nom_expert ?? '—'}</span></div>
          <div className={styles.kv}><label>Numéro agrément</label><span className={styles.mono}>{item.expertMinier?.num_agrement ?? '—'}</span></div>
        </div>

        <div className={styles.detailCard}>
          <h3>Caractéristiques techniques</h3>
          <div className={styles.kv}><label>Superficie</label><span>{formatNumber(item.superficie, ' ha')}</span></div>
          <div className={styles.kv}><label>Superficie catégorie</label><span>{formatNumber(item.AreaCat, ' ha')}</span></div>
          <div className={styles.kv}><label>Volume prévu</label><span>{item.volume_prevu ?? '—'}</span></div>
          <div className={styles.kv}><label>Budget prévu</label><span>{formatNumber(item.budget_prevu, ' DA')}</span></div>
          <div className={styles.kv}><label>Capital social disponible</label><span>{formatNumber(item.capital_social_disponible, ' DA')}</span></div>
          <div className={styles.kv}><label>Montant produit</label><span>{item.montant_produit ?? '—'}</span></div>
        </div>

        <div className={styles.detailCard}>
          <h3>Planning</h3>
          <div className={styles.kv}><label>Durée travaux estimée</label><span>{item.duree_travaux_estimee ?? '—'}</span></div>
          <div className={styles.kv}><label>Date démarrage prévue</label><span>{formatDate(item.date_demarrage_prevue)}</span></div>
          <div className={styles.kv}><label>Date fin ramassage</label><span>{formatDate(item.date_fin_ramassage)}</span></div>
          <div className={styles.kv}><label>Sources de financement</label><span>{item.sources_financement ?? '—'}</span></div>
          <div className={styles.kv}><label>Qualité signataire</label><span>{item.qualite_signataire ?? '—'}</span></div>
        </div>

        <div className={styles.detailCard}>
          <h3>Documents et observations</h3>
          <div className={styles.kv}><label>Numéro d'enregistrement</label><span>{item.num_enregist ?? '—'}</span></div>
          <div className={styles.kv}><label>Conclusion res. géo</label><span>{item.con_res_geo ?? '—'}</span></div>
          <div className={styles.kv}><label>Conclusion res. exp</label><span>{item.con_res_exp ?? '—'}</span></div>
          <div className={styles.kv}><label>Remarques</label><span>{item.remarques ?? '—'}</span></div>
        </div>

        {item.procedure && item.procedure.ProcedureEtape && item.procedure.ProcedureEtape.length > 0 && (
          <div className={styles.detailCard}>
            <h3>Étapes de la procédure</h3>
            <div className={styles.procedureSteps}>
              {item.procedure.ProcedureEtape.map((etape: any, index: number) => (
                <div key={index} className={styles.procedureStep}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber}>{index + 1}</span>
                    <span className={styles.stepName}>{etape.etape.lib_etape}</span>
                    <span className={`${styles.stepStatus} ${styles['status_' + (etape.statut || 'NA').toLowerCase()]}`}>
                      {etape.statut || '—'}
                    </span>
                  </div>
                  <div className={styles.stepDetails}>
                    <div>Durée: {etape.etape.duree_etape || '—'} jours</div>
                    <div>Début: {formatDate(etape.date_debut)}</div>
                    <div>Fin: {formatDate(etape.date_fin)}</div>
                    {etape.link && (
                      <div>
                        <a href={etape.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                          Lien associé
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
