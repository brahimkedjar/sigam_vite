import React, { useState } from "react";

import { 
  FiX, 
  FiCheck, 
  FiFileText, 
  FiUser, 
  FiDollarSign, 
  FiTool, 
  FiLayers,
  FiChevronRight,
  FiClock,
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiHash
} from "react-icons/fi";
import styles from "./SummaryModal.module.css";
import { useStepGuard } from "@/src/hooks/StepGuardContext";
import router from 'next/router';

interface Document {
  nom_doc: string;
  description?: string;
}

interface DossierFournisDocument {
  status: "present" | "manquant";
  document: Document;
}

interface DossierFournis {
  documents: DossierFournisDocument[];
  statut_dossier: string;
  remarques?: string;
  date_depot: string;
}

interface Substance {
  id_assoc: number;
  substance: {
    nom_subFR: string;
  };
}

interface DossierDocument {
  document: Document;
}

interface RegistreCommerce {
  numero_rc: string;
  nif: string;
  adresse_legale: string;
}

interface Personne {
  nomFR: string;
  prenomFR: string;
}

interface Fonction {
  personne: Personne;
}

interface Detenteur {
  adresse_siege:string;
  nom_societeFR: string;
  telephone: string;
  registreCommerce?: RegistreCommerce[];
  fonctions: Fonction[];
}

interface TypePermis {
  lib_type: string;
  code_type: string;
  regime: string;
}

interface Procedure {
  SubstanceAssocieeDemande: Substance[];
  DossierAdministratif: DossierDocument[];
}

interface ExpertMinier {
  nom_expert: string;
  fonction: string;
  organisme: string;
}

interface Demande {
  id_demande: any;
  id_proc: number;
  code_demande: string;
  duree_travaux_estimee: string;
  budget_prevu: number;
  procedure: Procedure;
  expertMinier?: ExpertMinier;
  dossiersFournis?: DossierFournis[];
  detenteur?: Detenteur;
  detenteurdemande?: { detenteur: Detenteur }[];
  typePermis: TypePermis;
}

interface SummaryModalProps {
  data: Demande;
  onClose: () => void;
}

export default function SummaryModal({ data, onClose }: SummaryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!data) return null;

  const handleConfirm = () => {
    setIsLoading(true);
    router.push(`/demande/step5/page5?id=${data.id_proc}`)
  };

  const demande = data;
  const procedure = demande.procedure;
  const detenteur = demande.detenteur ?? demande.detenteurdemande?.[0]?.detenteur;
  const registre = detenteur?.registreCommerce![0];
  const expert = demande.expertMinier;
  const substances = procedure.SubstanceAssocieeDemande;
  
  // Get the latest dossier fournis and its documents
  const latestDossier = demande.dossiersFournis?.[0];
  const documentStatuts = latestDossier?.documents || [];

 return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>
            <FiFileText className={styles['modal-title-icon']} />
            Résumé de la Demande
          </h2>
          <button className={styles['modal-close']} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles['modal-content']}>
          {/* Type de permis */}
          <div className={styles['modal-section']}>
            <div className={styles['section-header']}>
              <FiLayers className={styles['section-icon']} />
              <h3 className={styles['section-title']}>Type de permis</h3>
            </div>
            <div className={styles['info-grid']}>
              <div className={styles['info-item']}>
                <span className={styles['info-label']}><FiHash /> Type</span>
                <span className={styles['info-value']}>{demande.typePermis?.lib_type ?? '—'}</span>
              </div>
              <div className={styles['info-item']}>
                <span className={styles['info-label']}><FiLayers /> Régime</span>
                <span className={styles['info-value']}>{demande.typePermis?.regime ?? '—'}</span>
              </div>
              <div className={styles['info-item']}>
                <span className={styles['info-label']}><FiHash /> Code</span>
                <span className={styles['info-value']}>{demande.typePermis?.code_type ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* Identification entité */}
          <div className={styles['modal-section']}>
            <div className={styles['section-header']}>
              <FiBriefcase className={styles['section-icon']} />
              <h3 className={styles['section-title']}>Identification de l`entité</h3>
            </div>
            
            {detenteur ? (
              <>
                <div className={styles['info-grid']}>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiBriefcase /> Nom</span>
                    <span className={styles['info-value']}>{detenteur.nom_societeFR}</span>
                  </div>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiHash /> RC</span>
                    <span className={styles['info-value']}>{registre?.numero_rc ?? '—'}</span>
                  </div>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiHash /> NIF</span>
                    <span className={styles['info-value']}>{registre?.nif ?? '—'}</span>
                  </div>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiMapPin /> Adresse</span>
                    <span className={styles['info-value']}>{detenteur?.adresse_siege ?? '—'}</span>
                  </div>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiPhone /> Téléphone</span>
                    <span className={styles['info-value']}>{detenteur.telephone}</span>
                  </div>
                </div>

                {detenteur.fonctions.length > 0 && (
                  <div className={styles['subsection']}>
                    <h4 className={styles['subsection-title']}>
                      <FiUser /> Personnes liées
                    </h4>
                    <div className={styles['people-list']}>
                      {detenteur.fonctions.map((f, i) => (
                        <div key={i} className={styles['person-item']}>
                          <FiUser className={styles['person-icon']} />
                          <span>{f.personne.prenomFR} {f.personne.nomFR}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles['error-message']}>
                <FiX /> Détenteur non trouvé
              </div>
            )}
          </div>

          {/* Capacités */}
          <div className={styles['modal-section']}>
            <div className={styles['section-header']}>
              <FiTool className={styles['section-icon']} />
              <h3 className={styles['section-title']}>Capacités techniques et financières</h3>
            </div>
            <div className={styles['info-grid']}>
              <div className={styles['info-item']}>
                <span className={styles['info-label']}><FiClock /> Durée estimée</span>
                <span className={styles['info-value']}>{demande.duree_travaux_estimee} mois</span>
              </div>
              <div className={styles['info-item']}>
                <span className={styles['info-label']}><FiDollarSign /> Budget prévisionnel</span>
                <span className={styles['info-value']}>{demande.budget_prevu?.toLocaleString()} DZD</span>
              </div>
              {expert && (
                <>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiUser /> Expert</span>
                    <span className={styles['info-value']}>{expert.nom_expert}</span>
                  </div>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiBriefcase /> Fonction</span>
                    <span className={styles['info-value']}>{expert.fonction}</span>
                  </div>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}><FiBriefcase /> Société</span>
                    <span className={styles['info-value']}>{expert.organisme}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Substances */}
          <div className={styles['modal-section']}>
            <div className={styles['section-header']}>
              <FiLayers className={styles['section-icon']} />
              <h3 className={styles['section-title']}>Substances</h3>
            </div>
            <div className={styles['substances-sumr-grid']}>
              {substances.map((s) => (
                <div key={s.id_assoc} className={styles['substance-item']}>
                  <FiLayers className={styles['substance-icon']} />
                  <span>{s.substance.nom_subFR}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier Status */}
          {latestDossier && (
            <div className={styles['modal-section']}>
              <div className={styles['section-header']}>
                <FiFileText className={styles['section-icon']} />
                <h3 className={styles['section-title']}>Statut du Dossier</h3>
              </div>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Statut</span>
                  <span className={styles['info-value']}>{latestDossier.statut_dossier}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Date de dépôt</span>
                  <span className={styles['info-value']}>
                    {new Date(latestDossier.date_depot).toLocaleDateString()}
                  </span>
                </div>
                {latestDossier.remarques && (
                  <div className={styles['info-item-full']}>
                    <span className={styles['info-label']}>Remarques</span>
                    <span className={styles['info-value']}>{latestDossier.remarques}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className={styles['modal-section']}>
            <div className={styles['section-header']}>
              <FiFileText className={styles['section-icon']} />
              <h3 className={styles['section-title']}>Documents fournis</h3>
            </div>
            <div className={styles['documents-list']}>
              {documentStatuts.length > 0 ? (
                documentStatuts.map((dd, index) => (
                  <div key={index} className={`${styles['document-item']} ${styles[dd.status]}`}>
                    <div className={styles['document-info']}>
                      <span className={styles['document-name']}>{dd.document.nom_doc}</span>
                      {dd.document.description && (
                        <span className={styles['document-description']}>{dd.document.description}</span>
                      )}
                    </div>
                    <div className={`${styles['document-status']} ${styles[dd.status]}`}>
                      {dd.status === "present" ? (
                        <FiCheck className={styles['status-icon']} />
                      ) : (
                        <FiX className={styles['status-icon']} />
                      )}
                      {dd.status === "present" ? "Présent" : "Manquant"}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles['no-documents']}>
                  Aucun document n'a été soumis avec ce dossier
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles['modal-footer']}>
          <button 
            className={`${styles['btn']} ${styles['btn-secondary']}`} 
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            className={`${styles['btn']} ${styles['btn-primary']}`} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles['btn-loading']}>
                <span className={styles['spinner']}></span>
                Redirection...
              </span>
            ) : (
              <>
                Confirmer & Continuer
                <FiChevronRight className={styles['btn-icon']} />
              </>
            )}
          </button>
        
        </div>
      </div>
    </div>
  );
}
