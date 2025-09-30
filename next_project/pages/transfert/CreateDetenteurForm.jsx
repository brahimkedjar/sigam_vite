// CreateDetenteurForm.jsx
import { useState, useEffect } from 'react';
import styles from './CreateDetenteurForm.module.css';
import InfosGenerales from '../../pages/demande/step2/InfosGenerales';
import DetailsRC from '../../pages/demande/step2/DetailsRC';
import RepresentantLegal from '../../pages/demande/step2/RepresentantLegal';
import Actionnaires from '../../pages/demande/step2/Actionnaires';
import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const initialData = {
  infos: {
    nom_fr: '',
    nom_ar: '',
    statut_id: 0,
    tel: '',
    email: '',
    fax: '',
    adresse: '',
    id_pays: null,
  },
  repLegal: {
    nom: '',
    prenom: '',
    nom_ar: '',
    prenom_ar: '',
    tel: '',
    email: '',
    fax: '',
    qualite: '',
    nin: '',
    taux_participation: '',
    id_pays: null,
  },
  rcDetails: {
    numero_rc: '',
    date_enregistrement: '',
    capital_social: '',
    nis: '',
    adresse_legale: '',
    nif: '',
  },
  actionnaires: [],
  site_web: '',
};

export default function CreateDetenteurForm({ onCancel, onCreated, initialData: propInitialData = null }) {
  const [detenteur, setDetenteur] = useState(initialData);
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(false);
  const [statutsJuridiques, setStatutsJuridiques] = useState([]);
  const [paysOptions, setPaysOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const statutsRes = await axios.get(`${apiURL}/statuts-juridiques`, { withCredentials: true });
        setStatutsJuridiques(statutsRes.data);
        const paysRes = await axios.get(`${apiURL}/statuts-juridiques/pays`, { withCredentials: true });
        setPaysOptions(paysRes.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (propInitialData) {
      if (propInitialData.nom_societeFR) { // Assuming API format if this field exists
        const mapped = {
          ...initialData,
          infos: {
            nom_fr: propInitialData.nom_societeFR || '',
            nom_ar: propInitialData.nom_societeAR || '',
            statut_id: propInitialData.id_statutJuridique || 0,
            tel: propInitialData.telephone || '',
            email: propInitialData.email || '',
            fax: propInitialData.fax || '',
            adresse: propInitialData.adresse_siege || '',
            id_pays: propInitialData.id_pays || null,
          },
          rcDetails: propInitialData.registreCommerce?.[0] || initialData.rcDetails,
          repLegal: initialData.repLegal,
          actionnaires: [],
          site_web: propInitialData.site_web || '',
        };

        // Map fonctions to repLegal and actionnaires
        propInitialData.fonctions?.forEach(f => {
          const p = f.personne;
          if (!p) return;
        if (f.type_fonction.includes('Representant')) {
            mapped.repLegal = {
              nom: p.nomFR || '',
              prenom: p.prenomFR || '',
              nom_ar: p.nomAR || '',
              prenom_ar: p.prenomAR || '',
              tel: p.telephone || '',
              email: p.email || '',
              fax: p.fax || '',
              qualite: f.statut_personne || p.qualification || '',
              nin: p.num_carte_identite || '',
              taux_participation: f.taux_participation || '',
              id_pays: p.id_pays || null,
            };
          } else if (f.type_fonction === 'Actionnaire') {
            mapped.actionnaires.push({
              nom: p.nomFR || '',
              prenom: p.prenomFR || '',
              lieu_naissance: p.lieu_naissance || '',
              qualification: p.qualification || '',
              numero_carte: p.num_carte_identite || '',
              taux_participation: f.taux_participation || '',
              id_pays: p.id_pays || null,
            });
          }
        });

        setDetenteur(mapped);
      } else {
        setDetenteur(propInitialData);
      }
    }
  }, [propInitialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Construct backend-compatible data
    const backendData = {
      nom_societeFR: detenteur.infos.nom_fr,
      nom_societeAR: detenteur.infos.nom_ar,
      id_statutJuridique: detenteur.infos.statut_id,
      id_pays: detenteur.infos.id_pays,
      adresse_siege: detenteur.infos.adresse,
      telephone: detenteur.infos.tel,
      fax: detenteur.infos.fax,
      email: detenteur.infos.email,
      site_web: detenteur.site_web || '',
      registreCommerce: detenteur.rcDetails,
      personnes: [],
      fonctions: [],
    };

    let tempId = Date.now();

    // Add representant legal as a personne if filled
    if (detenteur.repLegal.nom) {
      const repPersonne = {
        nomFR: detenteur.repLegal.nom,
        prenomFR: detenteur.repLegal.prenom,
        nomAR: detenteur.repLegal.nom_ar,
        prenomAR: detenteur.repLegal.prenom_ar,
        date_naissance: '',
        lieu_naissance: '',
        nationalite: '',
        adresse_domicile: '',
        telephone: detenteur.repLegal.tel,
        fax: detenteur.repLegal.fax,
        email: detenteur.repLegal.email,
        qualification: detenteur.repLegal.qualite,
        num_carte_identite: detenteur.repLegal.nin,
        lieu_juridique_soc: '',
        ref_professionnelles: '',
        id_pays: detenteur.repLegal.id_pays,
        _temp: tempId++,
      };
      backendData.personnes.push(repPersonne);

      const typeF = parseFloat(detenteur.repLegal.taux_participation) > 0 ? 'Representant_Actionnaire' : 'Representant';
      const repFonc = {
        type_fonction: typeF,
        statut_personne: detenteur.repLegal.qualite,
        taux_participation: detenteur.repLegal.taux_participation,
        id_personne_temp: repPersonne._temp,
      };
      backendData.fonctions.push(repFonc);
    }

    // Add actionnaires as personnes
    detenteur.actionnaires.forEach((act) => {
      const actPersonne = {
        nomFR: act.nom,
        prenomFR: act.prenom,
        nomAR: '',
        prenomAR: '',
        date_naissance: '',
        lieu_naissance: act.lieu_naissance,
        nationalite: '',
        adresse_domicile: '',
        telephone: '',
        fax: '',
        email: '',
        qualification: act.qualification,
        num_carte_identite: act.numero_carte,
        lieu_juridique_soc: '',
        ref_professionnelles: '',
        id_pays: act.id_pays,
        _temp: tempId++,
      };
      backendData.personnes.push(actPersonne);

      const actFonc = {
        type_fonction: 'Actionnaire',
        statut_personne: '',
        taux_participation: act.taux_participation,
        id_personne_temp: actPersonne._temp,
      };
      backendData.fonctions.push(actFonc);
    });

    try {
      await onCreated(backendData);
    } catch (error) {
      console.error('Error creating detenteur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Creer un nouveau detenteur</h2>
        <button className={styles.closeButton} onClick={onCancel}>x</button>
      </div>
      <div className={styles.formTabs}>
        <button 
          className={`${styles.tab} ${activeSection === 'general' ? styles.active : ''}`}
          onClick={() => setActiveSection('general')}
        >
          Informations Generales
        </button>
        <button 
          className={`${styles.tab} ${activeSection === 'registre' ? styles.active : ''}`}
          onClick={() => setActiveSection('registre')}
        >
          Registre de Commerce
        </button>
        <button 
          className={`${styles.tab} ${activeSection === 'representant' ? styles.active : ''}`}
          onClick={() => setActiveSection('representant')}
        >
          Representant Legal
        </button>
        <button 
          className={`${styles.tab} ${activeSection === 'actionnaires' ? styles.active : ''}`}
          onClick={() => setActiveSection('actionnaires')}
        >
          Actionnaires
        </button>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {activeSection === 'general' && (
          <div className={styles.formSection}>
            <InfosGenerales
              data={detenteur.infos}
              onChange={(newData) => setDetenteur((prev) => ({ ...prev, infos: newData }))}
              disabled={false}
              statutsJuridiques={statutsJuridiques}
              paysOptions={paysOptions}
              loading={false}
            />
            <div className={styles.formGroup}>
              <label>Site web</label>
              <input
                type="text"
                name="site_web"
                placeholder="Site web"
                value={detenteur.site_web || ''}
                onChange={(e) => setDetenteur((prev) => ({ ...prev, site_web: e.target.value }))}
              />
            </div>
          </div>
        )}
        {activeSection === 'registre' && (
          <div className={styles.formSection}>
            <DetailsRC
              data={detenteur.rcDetails}
              onChange={(newData) => setDetenteur((prev) => ({ ...prev, rcDetails: newData }))}
              disabled={false}
            />
          </div>
        )}
        {activeSection === 'representant' && (
          <div className={styles.formSection}>
            <RepresentantLegal
              data={detenteur.repLegal}
              onChange={(newData) => setDetenteur((prev) => ({ ...prev, repLegal: newData }))}
              disabled={false}
              paysOptions={paysOptions}
            />
          </div>
        )}
        {activeSection === 'actionnaires' && (
          <div className={styles.formSection}>
            <Actionnaires
              data={detenteur.actionnaires}
              onChange={(newData) => setDetenteur((prev) => ({ ...prev, actionnaires: newData }))}
              disabled={false}
              paysOptions={paysOptions}
            />
          </div>
        )}
        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Annuler
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creation en cours...' : 'Enregistrer detenteur'}
          </button>
        </div>
      </form>
    </div>
  );
}
