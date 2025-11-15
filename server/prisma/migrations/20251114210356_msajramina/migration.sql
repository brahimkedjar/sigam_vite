-- CreateEnum
CREATE TYPE "MissingAction" AS ENUM ('BLOCK_NEXT', 'REJECT', 'WARNING');

-- CreateEnum
CREATE TYPE "StatutProcedure" AS ENUM ('EN_COURS', 'TERMINEE', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('ACCEPTEE', 'EN_COURS', 'REJETEE');

-- CreateEnum
CREATE TYPE "EnumTypeDetenteur" AS ENUM ('ANCIEN', 'NOUVEAU');

-- CreateEnum
CREATE TYPE "EnumTypeFonction" AS ENUM ('Representant', 'Actionnaire', 'Representant_Actionnaire');

-- CreateEnum
CREATE TYPE "EnumTypeInteraction" AS ENUM ('envoi', 'relance', 'reponse');

-- CreateEnum
CREATE TYPE "EnumAvisWali" AS ENUM ('favorable', 'defavorable');

-- CreateEnum
CREATE TYPE "Enumpriorite" AS ENUM ('principale', 'secondaire');

-- CreateEnum
CREATE TYPE "EnumStatutSeance" AS ENUM ('programmee', 'terminee');

-- CreateEnum
CREATE TYPE "EnumDecisionComite" AS ENUM ('favorable', 'defavorable', 'autre');

-- CreateEnum
CREATE TYPE "StatutCoord" AS ENUM ('DEMANDE_INITIALE', 'NOUVEAU', 'ANCIENNE');

-- CreateEnum
CREATE TYPE "EnumStatutPaiement" AS ENUM ('A_payer', 'Paye', 'En_retard', 'Annule', 'Partiellement_paye');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "userId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT DEFAULT 'SUCCESS',
    "errorMessage" TEXT,
    "additionalData" JSONB,
    "previousState" JSONB,
    "contextId" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "GroupPermission" (
    "groupId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "GroupPermission_pkey" PRIMARY KEY ("groupId","permissionId")
);

-- CreateTable
CREATE TABLE "Antenne" (
    "id_antenne" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "localisation" TEXT,
    "Email" TEXT,
    "Telephone" TEXT,
    "Responsable" TEXT,

    CONSTRAINT "Antenne_pkey" PRIMARY KEY ("id_antenne")
);

-- CreateTable
CREATE TABLE "Wilaya" (
    "id_wilaya" SERIAL NOT NULL,
    "id_antenne" INTEGER NOT NULL,
    "code_wilaya" TEXT NOT NULL,
    "nom_wilayaFR" TEXT NOT NULL,
    "nom_wilayaAR" TEXT NOT NULL,
    "zone" TEXT NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id_wilaya")
);

-- CreateTable
CREATE TABLE "Daira" (
    "id_daira" SERIAL NOT NULL,
    "id_wilaya" INTEGER NOT NULL,
    "nom_dairaFR" TEXT NOT NULL,
    "nom_dairaAR" TEXT NOT NULL,

    CONSTRAINT "Daira_pkey" PRIMARY KEY ("id_daira")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id_commune" SERIAL NOT NULL,
    "id_daira" INTEGER,
    "nom_communeFR" TEXT NOT NULL,
    "nom_communeAR" TEXT NOT NULL,
    "nature" TEXT,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id_commune")
);

-- CreateTable
CREATE TABLE "DossierAdministratif" (
    "id_dossier" SERIAL NOT NULL,
    "id_typeproc" INTEGER NOT NULL,
    "id_typePermis" INTEGER NOT NULL,
    "nombre_doc" INTEGER NOT NULL,
    "remarques" TEXT,

    CONSTRAINT "DossierAdministratif_pkey" PRIMARY KEY ("id_dossier")
);

-- CreateTable
CREATE TABLE "Document" (
    "id_doc" SERIAL NOT NULL,
    "nom_doc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "taille_doc" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id_doc")
);

-- CreateTable
CREATE TABLE "DossierDocument" (
    "id_dossier" INTEGER NOT NULL,
    "id_doc" INTEGER NOT NULL,
    "is_obligatoire" BOOLEAN NOT NULL DEFAULT false,
    "missing_action" "MissingAction" NOT NULL DEFAULT 'BLOCK_NEXT',
    "reject_message" TEXT,

    CONSTRAINT "DossierDocument_pkey" PRIMARY KEY ("id_dossier","id_doc")
);

-- CreateTable
CREATE TABLE "dossier_fournis" (
    "id_dossierFournis" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "date_depot" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recevabilite_doss" BOOLEAN,
    "statut_dossier" TEXT NOT NULL,
    "remarques" TEXT,
    "numero_accuse" TEXT,
    "date_accuse" TIMESTAMP(3),
    "numero_recepisse" TEXT,
    "date_recepisse" TIMESTAMP(3),
    "mise_en_demeure_envoyee" BOOLEAN NOT NULL DEFAULT false,
    "date_mise_en_demeure" TIMESTAMP(3),
    "pieces_manquantes" JSONB,
    "verification_phase" TEXT,
    "date_preannotation" TIMESTAMP(3),

    CONSTRAINT "dossier_fournis_pkey" PRIMARY KEY ("id_dossierFournis")
);

-- CreateTable
CREATE TABLE "PortalPermitType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "regime" TEXT,
    "initialYears" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalPermitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalDocumentDefinition" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "format" TEXT,
    "maxSizeMB" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "missingAction" "MissingAction" NOT NULL DEFAULT 'BLOCK_NEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalDocumentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalTypeDocument" (
    "id" SERIAL NOT NULL,
    "permitTypeId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "order" INTEGER,
    "notes" TEXT,

    CONSTRAINT "PortalTypeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalCompany" (
    "id" SERIAL NOT NULL,
    "legalName" TEXT NOT NULL,
    "legalForm" TEXT,
    "rcNumber" TEXT,
    "rcDate" TIMESTAMP(3),
    "nif" TEXT,
    "nis" TEXT,
    "capital" DOUBLE PRECISION,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "managerName" TEXT,
    "registryFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalRepresentative" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "function" TEXT,
    "nationalId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "powerDocUrl" TEXT,

    CONSTRAINT "PortalRepresentative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalShareholder" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nif" TEXT,
    "sharePct" DOUBLE PRECISION NOT NULL,
    "nationality" TEXT,

    CONSTRAINT "PortalShareholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalApplication" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "status" TEXT NOT NULL,
    "title" TEXT,
    "permitTypeId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "wilaya" TEXT,
    "daira" TEXT,
    "commune" TEXT,
    "lieuDit" TEXT,
    "polygonGeo" JSONB,
    "applicantToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalApplicationDocument" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "fileUrl" TEXT,
    "uploadedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalApplicationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalPayment" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "status" TEXT NOT NULL,
    "intentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dossier_fournis_document" (
    "id_dossierFournis" INTEGER NOT NULL,
    "id_doc" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dossier_fournis_document_pkey" PRIMARY KEY ("id_dossierFournis","id_doc")
);

-- CreateTable
CREATE TABLE "StatutPermis" (
    "id" SERIAL NOT NULL,
    "lib_statut" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "StatutPermis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepermis" (
    "id" SERIAL NOT NULL,
    "id_taxe" INTEGER,
    "lib_type" TEXT,
    "code_type" TEXT,
    "regime" TEXT,
    "duree_initiale" DOUBLE PRECISION,
    "nbr_renouv_max" INTEGER,
    "duree_renouv" DOUBLE PRECISION,
    "delai_renouv" INTEGER,
    "superficie_max" DOUBLE PRECISION,
    "ref_legales" TEXT,

    CONSTRAINT "typepermis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permis_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "elements" JSONB NOT NULL,
    "typePermisId" INTEGER NOT NULL,
    "permisId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "permis_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeprocedure" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT,
    "description" TEXT,

    CONSTRAINT "typeprocedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permis" (
    "id" SERIAL NOT NULL,
    "id_typePermis" INTEGER NOT NULL,
    "id_commune" INTEGER,
    "id_detenteur" INTEGER,
    "id_statut" INTEGER,
    "code_permis" TEXT,
    "date_adjudication" TIMESTAMP(3),
    "date_octroi" TIMESTAMP(3),
    "date_expiration" TIMESTAMP(3),
    "date_annulation" TIMESTAMP(3),
    "date_renonciation" TIMESTAMP(3),
    "duree_validite" INTEGER NOT NULL,
    "lieu_ditFR" TEXT,
    "lieu_ditAR" TEXT,
    "mode_attribution" TEXT,
    "superficie" DOUBLE PRECISION,
    "utilisation" TEXT,
    "invest_prevu" TEXT,
    "invest_real" TEXT,
    "montant_offre" TEXT,
    "statut_juridique_terrain" TEXT,
    "duree_prevue_travaux" TEXT,
    "date_demarrage_travaux" TIMESTAMP(3),
    "statut_activites" TEXT,
    "nombre_renouvellements" INTEGER NOT NULL,
    "hypothec" TEXT,
    "nom_projet" TEXT,
    "volume_prevu" TEXT,
    "date_conversion_permis" TIMESTAMP(3),
    "commentaires" TEXT,

    CONSTRAINT "permis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codeAssimilation" (
    "id_code" SERIAL NOT NULL,
    "id_ancienType" INTEGER NOT NULL,
    "id_permis" INTEGER NOT NULL,
    "ancien_code" TEXT NOT NULL,

    CONSTRAINT "codeAssimilation_pkey" PRIMARY KEY ("id_code")
);

-- CreateTable
CREATE TABLE "AncienTypePermis" (
    "id_ancienType" SERIAL NOT NULL,
    "lib_type" TEXT NOT NULL,
    "code_type" TEXT NOT NULL,

    CONSTRAINT "AncienTypePermis_pkey" PRIMARY KEY ("id_ancienType")
);

-- CreateTable
CREATE TABLE "etape_proc" (
    "id_etape" SERIAL NOT NULL,
    "lib_etape" TEXT NOT NULL,
    "duree_etape" INTEGER,
    "ordre_etape" INTEGER NOT NULL,
    "id_phase" INTEGER NOT NULL,

    CONSTRAINT "etape_proc_pkey" PRIMARY KEY ("id_etape")
);

-- CreateTable
CREATE TABLE "phase" (
    "id_phase" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "phase_pkey" PRIMARY KEY ("id_phase")
);

-- CreateTable
CREATE TABLE "relation_phase_typeprocedure" (
    "id_relation" SERIAL NOT NULL,
    "id_phase" INTEGER NOT NULL,
    "id_typeProcedure" INTEGER NOT NULL,
    "dureeEstimee" INTEGER,

    CONSTRAINT "relation_phase_typeprocedure_pkey" PRIMARY KEY ("id_relation")
);

-- CreateTable
CREATE TABLE "procedure_phase" (
    "id_proc" INTEGER NOT NULL,
    "id_phase" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL,
    "statut" "StatutProcedure",

    CONSTRAINT "procedure_phase_pkey" PRIMARY KEY ("id_proc","id_phase")
);

-- CreateTable
CREATE TABLE "procedure_etape" (
    "id_proc" INTEGER NOT NULL,
    "id_etape" INTEGER NOT NULL,
    "statut" "StatutProcedure" NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3),
    "link" TEXT,

    CONSTRAINT "procedure_etape_pkey" PRIMARY KEY ("id_proc","id_etape")
);

-- CreateTable
CREATE TABLE "procedure" (
    "id_proc" SERIAL NOT NULL,
    "id_seance" INTEGER,
    "num_proc" TEXT NOT NULL,
    "date_debut_proc" TIMESTAMP(3) NOT NULL,
    "date_fin_proc" TIMESTAMP(3),
    "statut_proc" "StatutProcedure" NOT NULL,
    "resultat" TEXT,
    "observations" TEXT,
    "typeProcedureId" INTEGER,

    CONSTRAINT "procedure_pkey" PRIMARY KEY ("id_proc")
);

-- CreateTable
CREATE TABLE "demande" (
    "id_demande" SERIAL NOT NULL,
    "id_proc" INTEGER,
    "id_detenteur" INTEGER,
    "id_wilaya" INTEGER,
    "id_daira" INTEGER,
    "id_commune" INTEGER,
    "id_typeProc" INTEGER,
    "id_typePermis" INTEGER,
    "id_expert" INTEGER,
    "code_demande" TEXT,
    "date_demande" TIMESTAMP(3),
    "date_instruction" TIMESTAMP(3),
    "intitule_projet" TEXT,
    "date_fin_instruction" TIMESTAMP(3),
    "date_refus" TIMESTAMP(3),
    "lieu_ditFR" TEXT,
    "lieu_dit_ar" TEXT,
    "superficie" DOUBLE PRECISION,
    "statut_juridique_terrain" TEXT,
    "occupant_terrain_legal" TEXT,
    "destination" TEXT,
    "locPointOrigine" TEXT,
    "duree_travaux_estimee" TEXT,
    "date_demarrage_prevue" TIMESTAMP(3),
    "LocPointOrigine" TEXT,
    "qualite_signataire" TEXT,
    "montant_produit" TEXT,
    "con_res_geo" TEXT,
    "con_res_exp" TEXT,
    "volume_prevu" TEXT,
    "capital_social_disponible" DOUBLE PRECISION,
    "budget_prevu" DOUBLE PRECISION,
    "description_travaux" TEXT,
    "sources_financement" TEXT,
    "remarques" TEXT,
    "date_fin_ramassage" TIMESTAMP(3),
    "num_enregist" TEXT,
    "AreaCat" DOUBLE PRECISION,
    "Nom_Prenom_Resp_Enregist" TEXT,
    "statut_demande" TEXT NOT NULL,
    "PP" BOOLEAN,

    CONSTRAINT "demande_pkey" PRIMARY KEY ("id_demande")
);

-- CreateTable
CREATE TABLE "ProcedureRenouvellement" (
    "id_renouvellement" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "duree_trvx" INTEGER,
    "qualite_signataire" TEXT,
    "date_demarrage_prevue" TIMESTAMP(3),
    "dossier_recevable" BOOLEAN,
    "dossier_complet" BOOLEAN,
    "rec_enquete_date" TIMESTAMP(3),
    "rec_enquete_nomRespon" TEXT,
    "obs_attestation" TEXT,
    "ConResGeo" DOUBLE PRECISION,
    "ConResExp" DOUBLE PRECISION,
    "VolumePrevu" DOUBLE PRECISION,
    "obs_sit_geo" TEXT,
    "obs_empiet" TEXT,
    "obs_emplacement" TEXT,
    "obs_geom" TEXT,
    "obs_superficie" TEXT,
    "inscripProv" BOOLEAN,
    "num_decision" TEXT,
    "date_decision" TIMESTAMP(3),
    "date_debut_validite" TIMESTAMP(3),
    "date_fin_validite" TIMESTAMP(3),
    "commentaire" TEXT,

    CONSTRAINT "ProcedureRenouvellement_pkey" PRIMARY KEY ("id_renouvellement")
);

-- CreateTable
CREATE TABLE "demInitial" (
    "id_demInitial" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "duree_trvx" INTEGER,
    "qualite_signataire" TEXT,
    "date_demarrage_prevue" TIMESTAMP(3),
    "dossier_recevable" BOOLEAN,
    "dossier_complet" BOOLEAN,
    "rec_enquete_date" TIMESTAMP(3),
    "rec_enquete_nomRespon" TEXT,
    "obs_attestation" TEXT,
    "ConResGeo" DOUBLE PRECISION,
    "ConResExp" DOUBLE PRECISION,
    "VolumePrevu" DOUBLE PRECISION,
    "obs_sit_geo" TEXT,
    "obs_empiet" TEXT,
    "obs_emplacement" TEXT,
    "obs_geom" TEXT,
    "obs_superficie" TEXT,
    "inscripProv" BOOLEAN,
    "intitule_projet" TEXT,
    "montant_produit" DOUBLE PRECISION,

    CONSTRAINT "demInitial_pkey" PRIMARY KEY ("id_demInitial")
);

-- CreateTable
CREATE TABLE "demFermeture" (
    "id_fermeture" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "num_decision" TEXT,
    "date_constat" TIMESTAMP(3),
    "rapport" TEXT,

    CONSTRAINT "demFermeture_pkey" PRIMARY KEY ("id_fermeture")
);

-- CreateTable
CREATE TABLE "demAnnulation" (
    "id_annulation" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "origin_cadastre" BOOLEAN,
    "verif_doc" TEXT,
    "permis_annule" BOOLEAN,
    "date_vigueur" TIMESTAMP(3),
    "DatePrepDocAnnulation" TIMESTAMP(3),
    "statut_annulation" TEXT,

    CONSTRAINT "demAnnulation_pkey" PRIMARY KEY ("id_annulation")
);

-- CreateTable
CREATE TABLE "demSubstitution" (
    "id_substitution" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "num_decision" TEXT,
    "date_decision" TIMESTAMP(3),
    "motif_substitution" TEXT,
    "commentaires" TEXT,

    CONSTRAINT "demSubstitution_pkey" PRIMARY KEY ("id_substitution")
);

-- CreateTable
CREATE TABLE "demModification" (
    "id_modification" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "duree_trvx" INTEGER,
    "qualite_signataire" TEXT,
    "date_demarrage_prevue" TIMESTAMP(3),
    "dossier_recevable" BOOLEAN,
    "dossier_complet" BOOLEAN,
    "rec_enquete_date" TIMESTAMP(3),
    "rec_enquete_nomRespon" TEXT,
    "obs_attestation" TEXT,
    "ConResGeo" DOUBLE PRECISION,
    "ConResExp" DOUBLE PRECISION,
    "VolumePrevu" DOUBLE PRECISION,
    "obs_sit_geo" TEXT,
    "obs_empiet" TEXT,
    "obs_emplacement" TEXT,
    "obs_geom" TEXT,
    "obs_superficie" TEXT,
    "inscripProv" BOOLEAN,
    "intitule_projet" TEXT,
    "montant_produit" DOUBLE PRECISION,
    "type_modification" TEXT,
    "idDivisionEnCurso" INTEGER,

    CONSTRAINT "demModification_pkey" PRIMARY KEY ("id_modification")
);

-- CreateTable
CREATE TABLE "demCession" (
    "id_cession" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "id_ancienCessionnaire" INTEGER NOT NULL,
    "id_nouveauCessionnaire" INTEGER NOT NULL,
    "motif_cession" TEXT,
    "nature_cession" TEXT,
    "taux_cession" DOUBLE PRECISION,
    "date_validation" TIMESTAMP(3),

    CONSTRAINT "demCession_pkey" PRIMARY KEY ("id_cession")
);

-- CreateTable
CREATE TABLE "demRenonciation" (
    "id_renonciation" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "RenonOct" BOOLEAN,

    CONSTRAINT "demRenonciation_pkey" PRIMARY KEY ("id_renonciation")
);

-- CreateTable
CREATE TABLE "demFusion" (
    "id_fusion" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "id_permisResultant" INTEGER NOT NULL,
    "date_fusion" TIMESTAMP(3) NOT NULL,
    "motif_fusion" TEXT,
    "statut_fusion" TEXT,

    CONSTRAINT "demFusion_pkey" PRIMARY KEY ("id_fusion")
);

-- CreateTable
CREATE TABLE "fusionPermisSource" (
    "id_permis" INTEGER NOT NULL,
    "id_fusion" INTEGER NOT NULL,

    CONSTRAINT "fusionPermisSource_pkey" PRIMARY KEY ("id_permis","id_fusion")
);

-- CreateTable
CREATE TABLE "demTransfert" (
    "id_transfert" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "motif_transfert" TEXT,
    "observations" TEXT,
    "dossier_octroyable" BOOLEAN,
    "transfer_obtenu" BOOLEAN,
    "date_transfert" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demTransfert_pkey" PRIMARY KEY ("id_transfert")
);

-- CreateTable
CREATE TABLE "transfert_detenteur" (
    "id" SERIAL NOT NULL,
    "id_transfert" INTEGER NOT NULL,
    "id_detenteur" INTEGER,
    "type_detenteur" "EnumTypeDetenteur" NOT NULL,
    "role" TEXT,
    "date_enregistrement" TIMESTAMP(3),

    CONSTRAINT "transfert_detenteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demandeVerificationGeo" (
    "id_demVerif" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "sit_geo_ok" BOOLEAN,
    "empiet_ok" BOOLEAN,
    "superf_ok" BOOLEAN,
    "geom_ok" BOOLEAN,
    "verification_cadastrale_ok" BOOLEAN,
    "superficie_cadastrale" DOUBLE PRECISION,

    CONSTRAINT "demandeVerificationGeo_pkey" PRIMARY KEY ("id_demVerif")
);

-- CreateTable
CREATE TABLE "demandeMin" (
    "id_demMin" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "min_label" TEXT,
    "min_teneur" DOUBLE PRECISION,
    "ordre_mineral" INTEGER,

    CONSTRAINT "demandeMin_pkey" PRIMARY KEY ("id_demMin")
);

-- CreateTable
CREATE TABLE "expertminier" (
    "id_expert" SERIAL NOT NULL,
    "nom_expert" TEXT NOT NULL,
    "num_agrement" TEXT,
    "date_agrement" TIMESTAMP(3),
    "etat_agrement" TEXT,
    "adresse" TEXT,
    "email" TEXT,
    "tel_expert" TEXT,
    "fax_expert" TEXT,
    "specialisation" TEXT,

    CONSTRAINT "expertminier_pkey" PRIMARY KEY ("id_expert")
);

-- CreateTable
CREATE TABLE "statutjuridique" (
    "id_statutJuridique" SERIAL NOT NULL,
    "code_statut" TEXT NOT NULL,
    "statut_fr" TEXT NOT NULL,
    "statut_ar" TEXT NOT NULL,

    CONSTRAINT "statutjuridique_pkey" PRIMARY KEY ("id_statutJuridique")
);

-- CreateTable
CREATE TABLE "detenteurmorale" (
    "id_detenteur" SERIAL NOT NULL,
    "id_statutJuridique" INTEGER,
    "id_pays" INTEGER,
    "id_nationalite" INTEGER,
    "nom_societeFR" TEXT,
    "nom_societeAR" TEXT,
    "adresse_siege" TEXT,
    "telephone" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "site_web" TEXT,

    CONSTRAINT "detenteurmorale_pkey" PRIMARY KEY ("id_detenteur")
);

-- CreateTable
CREATE TABLE "pays" (
    "id_pays" SERIAL NOT NULL,
    "code_pays" TEXT NOT NULL,
    "nom_pays" TEXT NOT NULL,

    CONSTRAINT "pays_pkey" PRIMARY KEY ("id_pays")
);

-- CreateTable
CREATE TABLE "nationalite" (
    "id_nationalite" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "nationalite_pkey" PRIMARY KEY ("id_nationalite")
);

-- CreateTable
CREATE TABLE "registrecommerce" (
    "id" SERIAL NOT NULL,
    "id_detenteur" INTEGER,
    "numero_rc" TEXT,
    "date_enregistrement" TIMESTAMP(3),
    "capital_social" DOUBLE PRECISION,
    "nis" TEXT,
    "nif" TEXT,
    "adresse_legale" TEXT,

    CONSTRAINT "registrecommerce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnephysique" (
    "id_personne" SERIAL NOT NULL,
    "id_pays" INTEGER NOT NULL,
    "id_nationalite" INTEGER,
    "nomFR" TEXT NOT NULL,
    "nomAR" TEXT NOT NULL,
    "prenomFR" TEXT NOT NULL,
    "prenomAR" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "lieu_naissance" TEXT NOT NULL,
    "nationalite" TEXT NOT NULL,
    "adresse_domicile" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "num_carte_identite" TEXT NOT NULL,
    "lieu_juridique_soc" TEXT NOT NULL,
    "ref_professionnelles" TEXT NOT NULL,

    CONSTRAINT "personnephysique_pkey" PRIMARY KEY ("id_personne")
);

-- CreateTable
CREATE TABLE "fonctionpersonnemoral" (
    "id_detenteur" INTEGER NOT NULL,
    "id_personne" INTEGER NOT NULL,
    "type_fonction" "EnumTypeFonction" NOT NULL,
    "statut_personne" TEXT NOT NULL,
    "taux_participation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fonctionpersonnemoral_pkey" PRIMARY KEY ("id_detenteur","id_personne")
);

-- CreateTable
CREATE TABLE "InteractionWali" (
    "id_interaction" SERIAL NOT NULL,
    "id_procedure" INTEGER NOT NULL,
    "id_wilaya" INTEGER NOT NULL,
    "type_interaction" "EnumTypeInteraction",
    "avis_wali" "EnumAvisWali",
    "date_envoi" TIMESTAMP(3),
    "date_reponse" TIMESTAMP(3),
    "delai_depasse" BOOLEAN,
    "nom_responsable_reception" TEXT,
    "commentaires" TEXT,
    "contenu" TEXT,
    "is_relance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InteractionWali_pkey" PRIMARY KEY ("id_interaction")
);

-- CreateTable
CREATE TABLE "substances" (
    "id_sub" SERIAL NOT NULL,
    "nom_subFR" TEXT,
    "nom_subAR" TEXT,
    "categorie_sub" TEXT,
    "id_redevance" INTEGER,

    CONSTRAINT "substances_pkey" PRIMARY KEY ("id_sub")
);

-- CreateTable
CREATE TABLE "substance_associee_demande" (
    "id_assoc" SERIAL NOT NULL,
    "id_proc" INTEGER NOT NULL,
    "id_substance" INTEGER NOT NULL,
    "priorite" "Enumpriorite" NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "substance_associee_demande_pkey" PRIMARY KEY ("id_assoc")
);

-- CreateTable
CREATE TABLE "redevance_bareme" (
    "id_redevance" SERIAL NOT NULL,
    "taux_redevance" DOUBLE PRECISION NOT NULL,
    "valeur_marchande" DOUBLE PRECISION NOT NULL,
    "unite" TEXT NOT NULL,
    "devise" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "redevance_bareme_pkey" PRIMARY KEY ("id_redevance")
);

-- CreateTable
CREATE TABLE "SeanceCDPrevue" (
    "id_seance" SERIAL NOT NULL,
    "num_seance" TEXT NOT NULL,
    "date_seance" TIMESTAMP(3) NOT NULL,
    "exercice" INTEGER NOT NULL,
    "remarques" TEXT,
    "statut" "EnumStatutSeance" NOT NULL,

    CONSTRAINT "SeanceCDPrevue_pkey" PRIMARY KEY ("id_seance")
);

-- CreateTable
CREATE TABLE "ComiteDirection" (
    "id_comite" SERIAL NOT NULL,
    "id_seance" INTEGER NOT NULL,
    "date_comite" TIMESTAMP(3) NOT NULL,
    "resume_reunion" TEXT NOT NULL,
    "fiche_technique" TEXT,
    "carte_projettee" TEXT,
    "rapport_police" TEXT,

    CONSTRAINT "ComiteDirection_pkey" PRIMARY KEY ("id_comite")
);

-- CreateTable
CREATE TABLE "DecisionCD" (
    "id_decision" SERIAL NOT NULL,
    "id_comite" INTEGER NOT NULL,
    "numero_decision" TEXT NOT NULL,
    "duree_decision" INTEGER,
    "commentaires" TEXT,
    "decision_cd" "EnumDecisionComite" NOT NULL,

    CONSTRAINT "DecisionCD_pkey" PRIMARY KEY ("id_decision")
);

-- CreateTable
CREATE TABLE "MembresComite" (
    "id_membre" SERIAL NOT NULL,
    "nom_membre" TEXT NOT NULL,
    "prenom_membre" TEXT NOT NULL,
    "fonction_membre" TEXT NOT NULL,
    "email_membre" TEXT NOT NULL,

    CONSTRAINT "MembresComite_pkey" PRIMARY KEY ("id_membre")
);

-- CreateTable
CREATE TABLE "MembreSeance" (
    "id_seance" INTEGER NOT NULL,
    "id_membre" INTEGER NOT NULL,

    CONSTRAINT "MembreSeance_pkey" PRIMARY KEY ("id_seance","id_membre")
);

-- CreateTable
CREATE TABLE "ProcedureCoord" (
    "id_procedureCoord" SERIAL NOT NULL,
    "id_proc" INTEGER NOT NULL,
    "id_coordonnees" INTEGER NOT NULL,
    "statut_coord" "StatutCoord" NOT NULL,

    CONSTRAINT "ProcedureCoord_pkey" PRIMARY KEY ("id_procedureCoord")
);

-- CreateTable
CREATE TABLE "coordonnee" (
    "id_coordonnees" SERIAL NOT NULL,
    "id_zone_interdite" INTEGER,
    "point" TEXT,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "system" TEXT DEFAULT 'WGS84',
    "zone" INTEGER,
    "hemisphere" TEXT,

    CONSTRAINT "coordonnee_pkey" PRIMARY KEY ("id_coordonnees")
);

-- CreateTable
CREATE TABLE "inscription_provisoire" (
    "id" SERIAL NOT NULL,
    "id_proc" INTEGER NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "points" JSONB NOT NULL,
    "system" TEXT,
    "zone" INTEGER,
    "hemisphere" TEXT,
    "superficie_declaree" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscription_provisoire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cahiercharge" (
    "id" SERIAL NOT NULL,
    "permisId" INTEGER,
    "demandeId" INTEGER,
    "num_cdc" TEXT NOT NULL,
    "date_etablissement" TIMESTAMP(3) NOT NULL,
    "dateExercice" TIMESTAMP(3) NOT NULL,
    "lieu_signature" TEXT NOT NULL,
    "signataire_administration" TEXT NOT NULL,
    "fuseau" TEXT,
    "typeCoordonnees" TEXT,
    "version" TEXT,
    "natureJuridique" TEXT,
    "vocationTerrain" TEXT,
    "nomGerant" TEXT,
    "personneChargeTrxx" TEXT,
    "qualification" TEXT,
    "reservesGeologiques" DOUBLE PRECISION,
    "reservesExploitables" DOUBLE PRECISION,
    "volumeExtraction" DOUBLE PRECISION,
    "dureeExploitation" INTEGER,
    "methodeExploitation" TEXT,
    "dureeTravaux" INTEGER,
    "dateDebutTravaux" TIMESTAMP(3),
    "dateDebutProduction" TIMESTAMP(3),
    "investissementDA" DOUBLE PRECISION,
    "investissementUSD" DOUBLE PRECISION,
    "capaciteInstallee" DOUBLE PRECISION,
    "commentaires" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cahiercharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepaiement" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "frequence" TEXT NOT NULL,
    "details_calcul" TEXT,

    CONSTRAINT "typepaiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligationfiscale" (
    "id" SERIAL NOT NULL,
    "id_typePaiement" INTEGER NOT NULL,
    "id_permis" INTEGER NOT NULL,
    "annee_fiscale" INTEGER NOT NULL,
    "montant_attendu" DOUBLE PRECISION NOT NULL,
    "date_echeance" TIMESTAMP(3) NOT NULL,
    "statut" "EnumStatutPaiement" NOT NULL,
    "details_calcul" TEXT,

    CONSTRAINT "obligationfiscale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiement" (
    "id" SERIAL NOT NULL,
    "id_obligation" INTEGER NOT NULL,
    "montant_paye" DOUBLE PRECISION NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'DZD',
    "date_paiement" TIMESTAMP(3) NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "num_quittance" TEXT,
    "etat_paiement" TEXT NOT NULL,
    "justificatif_url" TEXT,
    "num_perc" TEXT,
    "date_remisOp" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TsPaiement" (
    "id_tsPaiement" SERIAL NOT NULL,
    "id_obligation" INTEGER NOT NULL,
    "datePerDebut" TIMESTAMP(3) NOT NULL,
    "datePerFin" TIMESTAMP(3) NOT NULL,
    "surfaceMin" DOUBLE PRECISION NOT NULL,
    "surfaceMax" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TsPaiement_pkey" PRIMARY KEY ("id_tsPaiement")
);

-- CreateTable
CREATE TABLE "barem_produit_droit" (
    "id" SERIAL NOT NULL,
    "montant_droit_etab" DOUBLE PRECISION NOT NULL,
    "produit_attribution" DOUBLE PRECISION NOT NULL,
    "typePermisId" INTEGER NOT NULL,
    "typeProcedureId" INTEGER NOT NULL,

    CONSTRAINT "barem_produit_droit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "superficiaire_bareme" (
    "id" SERIAL NOT NULL,
    "droit_fixe" DOUBLE PRECISION NOT NULL,
    "periode_initiale" DOUBLE PRECISION NOT NULL,
    "premier_renouv" DOUBLE PRECISION NOT NULL,
    "autre_renouv" DOUBLE PRECISION NOT NULL,
    "devise" TEXT NOT NULL,

    CONSTRAINT "superficiaire_bareme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rapport_activite" (
    "id_rapport" SERIAL NOT NULL,
    "id_permis" INTEGER NOT NULL,
    "date_remise_reelle" TIMESTAMP(3) NOT NULL,
    "etat_activite" TEXT NOT NULL,
    "leve_topo_3112" TEXT,
    "leve_topo_3006" TEXT,
    "plan_exploitation" TEXT,
    "date_debut_travaux" TIMESTAMP(3),
    "vente_exportation" TEXT,
    "importation" TEXT,
    "valeur_equipement_acquis" DOUBLE PRECISION,
    "pros_expl_entamee" TEXT,
    "avancee_travaux" TEXT,
    "travaux_realises" TEXT,
    "nbr_ouvrages" INTEGER,
    "volume" DOUBLE PRECISION,
    "resume_activites" TEXT,
    "investissements_realises" DOUBLE PRECISION,
    "qte_explosifs" DOUBLE PRECISION,
    "qte_explosifs_DIM" DOUBLE PRECISION,
    "detonateurs" INTEGER,
    "dmr" INTEGER,
    "cordeau_detonant" INTEGER,
    "meche_lente" INTEGER,
    "relais" INTEGER,
    "DEI" INTEGER,
    "effectif_cadre" INTEGER,
    "effectif_maitrise" INTEGER,
    "effectif_execution" INTEGER,
    "production_toutvenant" DOUBLE PRECISION,
    "production_marchande" DOUBLE PRECISION,
    "production_vendue" DOUBLE PRECISION,
    "production_stocke" DOUBLE PRECISION,
    "stock_T_V" DOUBLE PRECISION,
    "stock_produit_marchand" DOUBLE PRECISION,
    "production_sable" DOUBLE PRECISION,
    "poussieres" DOUBLE PRECISION,
    "rejets_laverie" DOUBLE PRECISION,
    "fumee_gaz" DOUBLE PRECISION,
    "autres_effluents" DOUBLE PRECISION,
    "nbr_accidents" INTEGER,
    "accidents_mortels" INTEGER,
    "accidents_non_mortels" INTEGER,
    "nbrs_jours_perdues" INTEGER,
    "taux_frequence" DOUBLE PRECISION,
    "taux_gravite" DOUBLE PRECISION,
    "nbrs_incidents" INTEGER,
    "nbrs_malades_pro" INTEGER,
    "remise_etat_realisee" TEXT,
    "cout_remise_etat" DOUBLE PRECISION,
    "commentaires_generaux" TEXT,
    "rapport_url" TEXT,

    CONSTRAINT "rapport_activite_pkey" PRIMARY KEY ("id_rapport")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedEntityId" INTEGER,
    "relatedEntityType" TEXT,
    "expertId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT NOT NULL DEFAULT 'info',

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "conversationId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermisProcedure" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PermisProcedure_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SeanceMembres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SeanceMembres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_contextId_idx" ON "AuditLog"("contextId");

-- CreateIndex
CREATE INDEX "AuditLog_sessionId_idx" ON "AuditLog"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wilaya_code_wilaya_key" ON "Wilaya"("code_wilaya");

-- CreateIndex
CREATE UNIQUE INDEX "DossierAdministratif_id_typePermis_id_typeproc_key" ON "DossierAdministratif"("id_typePermis", "id_typeproc");

-- CreateIndex
CREATE UNIQUE INDEX "PortalPermitType_code_key" ON "PortalPermitType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PortalDocumentDefinition_code_key" ON "PortalDocumentDefinition"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PortalTypeDocument_permitTypeId_documentId_key" ON "PortalTypeDocument"("permitTypeId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "PortalApplication_code_key" ON "PortalApplication"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PortalApplicationDocument_applicationId_documentId_key" ON "PortalApplicationDocument"("applicationId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "StatutPermis_lib_statut_key" ON "StatutPermis"("lib_statut");

-- CreateIndex
CREATE UNIQUE INDEX "typepermis_lib_type_key" ON "typepermis"("lib_type");

-- CreateIndex
CREATE UNIQUE INDEX "typepermis_code_type_key" ON "typepermis"("code_type");

-- CreateIndex
CREATE INDEX "permis_templates_typePermisId_idx" ON "permis_templates"("typePermisId");

-- CreateIndex
CREATE INDEX "permis_templates_permisId_idx" ON "permis_templates"("permisId");

-- CreateIndex
CREATE UNIQUE INDEX "procedure_num_proc_key" ON "procedure"("num_proc");

-- CreateIndex
CREATE UNIQUE INDEX "demande_code_demande_key" ON "demande"("code_demande");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureRenouvellement_id_demande_key" ON "ProcedureRenouvellement"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demInitial_id_demande_key" ON "demInitial"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demFermeture_id_demande_key" ON "demFermeture"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demAnnulation_id_demande_key" ON "demAnnulation"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demSubstitution_id_demande_key" ON "demSubstitution"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demModification_id_demande_key" ON "demModification"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demCession_id_demande_key" ON "demCession"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demRenonciation_id_demande_key" ON "demRenonciation"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demFusion_id_demande_key" ON "demFusion"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demFusion_id_permisResultant_key" ON "demFusion"("id_permisResultant");

-- CreateIndex
CREATE UNIQUE INDEX "demTransfert_id_demande_key" ON "demTransfert"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demandeVerificationGeo_id_demande_key" ON "demandeVerificationGeo"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "demandeMin_id_demande_key" ON "demandeMin"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "statutjuridique_code_statut_key" ON "statutjuridique"("code_statut");

-- CreateIndex
CREATE UNIQUE INDEX "pays_code_pays_key" ON "pays"("code_pays");

-- CreateIndex
CREATE UNIQUE INDEX "nationalite_libelle_key" ON "nationalite"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "personnephysique_num_carte_identite_key" ON "personnephysique"("num_carte_identite");

-- CreateIndex
CREATE UNIQUE INDEX "substance_associee_demande_id_proc_id_substance_key" ON "substance_associee_demande"("id_proc", "id_substance");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureCoord_id_proc_id_coordonnees_key" ON "ProcedureCoord"("id_proc", "id_coordonnees");

-- CreateIndex
CREATE UNIQUE INDEX "inscription_provisoire_id_proc_key" ON "inscription_provisoire"("id_proc");

-- CreateIndex
CREATE UNIQUE INDEX "inscription_provisoire_id_demande_key" ON "inscription_provisoire"("id_demande");

-- CreateIndex
CREATE UNIQUE INDEX "typepaiement_libelle_key" ON "typepaiement"("libelle");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "Conversation_user1Id_idx" ON "Conversation"("user1Id");

-- CreateIndex
CREATE INDEX "Conversation_user2Id_idx" ON "Conversation"("user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_key" ON "Conversation"("user1Id", "user2Id");

-- CreateIndex
CREATE INDEX "_PermisProcedure_B_index" ON "_PermisProcedure"("B");

-- CreateIndex
CREATE INDEX "_SeanceMembres_B_index" ON "_SeanceMembres"("B");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wilaya" ADD CONSTRAINT "Wilaya_id_antenne_fkey" FOREIGN KEY ("id_antenne") REFERENCES "Antenne"("id_antenne") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daira" ADD CONSTRAINT "Daira_id_wilaya_fkey" FOREIGN KEY ("id_wilaya") REFERENCES "Wilaya"("id_wilaya") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_id_daira_fkey" FOREIGN KEY ("id_daira") REFERENCES "Daira"("id_daira") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierAdministratif" ADD CONSTRAINT "DossierAdministratif_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES "typepermis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierAdministratif" ADD CONSTRAINT "DossierAdministratif_id_typeproc_fkey" FOREIGN KEY ("id_typeproc") REFERENCES "typeprocedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierDocument" ADD CONSTRAINT "DossierDocument_id_doc_fkey" FOREIGN KEY ("id_doc") REFERENCES "Document"("id_doc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierDocument" ADD CONSTRAINT "DossierDocument_id_dossier_fkey" FOREIGN KEY ("id_dossier") REFERENCES "DossierAdministratif"("id_dossier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossier_fournis" ADD CONSTRAINT "dossier_fournis_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalTypeDocument" ADD CONSTRAINT "PortalTypeDocument_permitTypeId_fkey" FOREIGN KEY ("permitTypeId") REFERENCES "PortalPermitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalTypeDocument" ADD CONSTRAINT "PortalTypeDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PortalDocumentDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalRepresentative" ADD CONSTRAINT "PortalRepresentative_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "PortalCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalShareholder" ADD CONSTRAINT "PortalShareholder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "PortalCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplication" ADD CONSTRAINT "PortalApplication_permitTypeId_fkey" FOREIGN KEY ("permitTypeId") REFERENCES "PortalPermitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplication" ADD CONSTRAINT "PortalApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "PortalCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplicationDocument" ADD CONSTRAINT "PortalApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PortalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplicationDocument" ADD CONSTRAINT "PortalApplicationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PortalDocumentDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalPayment" ADD CONSTRAINT "PortalPayment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PortalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossier_fournis_document" ADD CONSTRAINT "dossier_fournis_document_id_dossierFournis_fkey" FOREIGN KEY ("id_dossierFournis") REFERENCES "dossier_fournis"("id_dossierFournis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossier_fournis_document" ADD CONSTRAINT "dossier_fournis_document_id_doc_fkey" FOREIGN KEY ("id_doc") REFERENCES "Document"("id_doc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepermis" ADD CONSTRAINT "typepermis_id_taxe_fkey" FOREIGN KEY ("id_taxe") REFERENCES "superficiaire_bareme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis_templates" ADD CONSTRAINT "permis_templates_permisId_fkey" FOREIGN KEY ("permisId") REFERENCES "permis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis_templates" ADD CONSTRAINT "permis_templates_typePermisId_fkey" FOREIGN KEY ("typePermisId") REFERENCES "typepermis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis" ADD CONSTRAINT "permis_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES "typepermis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis" ADD CONSTRAINT "permis_id_commune_fkey" FOREIGN KEY ("id_commune") REFERENCES "Commune"("id_commune") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis" ADD CONSTRAINT "permis_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis" ADD CONSTRAINT "permis_id_statut_fkey" FOREIGN KEY ("id_statut") REFERENCES "StatutPermis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codeAssimilation" ADD CONSTRAINT "codeAssimilation_id_ancienType_fkey" FOREIGN KEY ("id_ancienType") REFERENCES "AncienTypePermis"("id_ancienType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codeAssimilation" ADD CONSTRAINT "codeAssimilation_id_permis_fkey" FOREIGN KEY ("id_permis") REFERENCES "permis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etape_proc" ADD CONSTRAINT "etape_proc_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phase"("id_phase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relation_phase_typeprocedure" ADD CONSTRAINT "relation_phase_typeprocedure_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phase"("id_phase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relation_phase_typeprocedure" ADD CONSTRAINT "relation_phase_typeprocedure_id_typeProcedure_fkey" FOREIGN KEY ("id_typeProcedure") REFERENCES "typeprocedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_phase" ADD CONSTRAINT "procedure_phase_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_phase" ADD CONSTRAINT "procedure_phase_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phase"("id_phase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_etape" ADD CONSTRAINT "procedure_etape_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_etape" ADD CONSTRAINT "procedure_etape_id_etape_fkey" FOREIGN KEY ("id_etape") REFERENCES "etape_proc"("id_etape") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_id_seance_fkey" FOREIGN KEY ("id_seance") REFERENCES "SeanceCDPrevue"("id_seance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_wilaya_fkey" FOREIGN KEY ("id_wilaya") REFERENCES "Wilaya"("id_wilaya") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_daira_fkey" FOREIGN KEY ("id_daira") REFERENCES "Daira"("id_daira") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_commune_fkey" FOREIGN KEY ("id_commune") REFERENCES "Commune"("id_commune") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_expert_fkey" FOREIGN KEY ("id_expert") REFERENCES "expertminier"("id_expert") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES "typepermis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_typeProc_fkey" FOREIGN KEY ("id_typeProc") REFERENCES "typeprocedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureRenouvellement" ADD CONSTRAINT "ProcedureRenouvellement_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demInitial" ADD CONSTRAINT "demInitial_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demFermeture" ADD CONSTRAINT "demFermeture_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demAnnulation" ADD CONSTRAINT "demAnnulation_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demSubstitution" ADD CONSTRAINT "demSubstitution_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demModification" ADD CONSTRAINT "demModification_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demCession" ADD CONSTRAINT "demCession_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demCession" ADD CONSTRAINT "demCession_id_ancienCessionnaire_fkey" FOREIGN KEY ("id_ancienCessionnaire") REFERENCES "personnephysique"("id_personne") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demCession" ADD CONSTRAINT "demCession_id_nouveauCessionnaire_fkey" FOREIGN KEY ("id_nouveauCessionnaire") REFERENCES "personnephysique"("id_personne") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demRenonciation" ADD CONSTRAINT "demRenonciation_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demFusion" ADD CONSTRAINT "demFusion_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demFusion" ADD CONSTRAINT "demFusion_id_permisResultant_fkey" FOREIGN KEY ("id_permisResultant") REFERENCES "permis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fusionPermisSource" ADD CONSTRAINT "fusionPermisSource_id_permis_fkey" FOREIGN KEY ("id_permis") REFERENCES "permis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fusionPermisSource" ADD CONSTRAINT "fusionPermisSource_id_fusion_fkey" FOREIGN KEY ("id_fusion") REFERENCES "demFusion"("id_fusion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demTransfert" ADD CONSTRAINT "demTransfert_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfert_detenteur" ADD CONSTRAINT "transfert_detenteur_id_transfert_fkey" FOREIGN KEY ("id_transfert") REFERENCES "demTransfert"("id_transfert") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfert_detenteur" ADD CONSTRAINT "transfert_detenteur_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandeVerificationGeo" ADD CONSTRAINT "demandeVerificationGeo_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandeMin" ADD CONSTRAINT "demandeMin_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detenteurmorale" ADD CONSTRAINT "detenteurmorale_id_statutJuridique_fkey" FOREIGN KEY ("id_statutJuridique") REFERENCES "statutjuridique"("id_statutJuridique") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detenteurmorale" ADD CONSTRAINT "detenteurmorale_id_pays_fkey" FOREIGN KEY ("id_pays") REFERENCES "pays"("id_pays") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detenteurmorale" ADD CONSTRAINT "detenteurmorale_id_nationalite_fkey" FOREIGN KEY ("id_nationalite") REFERENCES "nationalite"("id_nationalite") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrecommerce" ADD CONSTRAINT "registrecommerce_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnephysique" ADD CONSTRAINT "personnephysique_id_pays_fkey" FOREIGN KEY ("id_pays") REFERENCES "pays"("id_pays") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnephysique" ADD CONSTRAINT "personnephysique_id_nationalite_fkey" FOREIGN KEY ("id_nationalite") REFERENCES "nationalite"("id_nationalite") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fonctionpersonnemoral" ADD CONSTRAINT "fonctionpersonnemoral_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fonctionpersonnemoral" ADD CONSTRAINT "fonctionpersonnemoral_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "personnephysique"("id_personne") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionWali" ADD CONSTRAINT "InteractionWali_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionWali" ADD CONSTRAINT "InteractionWali_id_wilaya_fkey" FOREIGN KEY ("id_wilaya") REFERENCES "Wilaya"("id_wilaya") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substances" ADD CONSTRAINT "substances_id_redevance_fkey" FOREIGN KEY ("id_redevance") REFERENCES "redevance_bareme"("id_redevance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substance_associee_demande" ADD CONSTRAINT "substance_associee_demande_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substance_associee_demande" ADD CONSTRAINT "substance_associee_demande_id_substance_fkey" FOREIGN KEY ("id_substance") REFERENCES "substances"("id_sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComiteDirection" ADD CONSTRAINT "ComiteDirection_id_seance_fkey" FOREIGN KEY ("id_seance") REFERENCES "SeanceCDPrevue"("id_seance") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionCD" ADD CONSTRAINT "DecisionCD_id_comite_fkey" FOREIGN KEY ("id_comite") REFERENCES "ComiteDirection"("id_comite") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreSeance" ADD CONSTRAINT "MembreSeance_id_seance_fkey" FOREIGN KEY ("id_seance") REFERENCES "SeanceCDPrevue"("id_seance") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreSeance" ADD CONSTRAINT "MembreSeance_id_membre_fkey" FOREIGN KEY ("id_membre") REFERENCES "MembresComite"("id_membre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureCoord" ADD CONSTRAINT "ProcedureCoord_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureCoord" ADD CONSTRAINT "ProcedureCoord_id_coordonnees_fkey" FOREIGN KEY ("id_coordonnees") REFERENCES "coordonnee"("id_coordonnees") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscription_provisoire" ADD CONSTRAINT "inscription_provisoire_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscription_provisoire" ADD CONSTRAINT "inscription_provisoire_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cahiercharge" ADD CONSTRAINT "cahiercharge_permisId_fkey" FOREIGN KEY ("permisId") REFERENCES "permis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cahiercharge" ADD CONSTRAINT "cahiercharge_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "demande"("id_demande") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligationfiscale" ADD CONSTRAINT "obligationfiscale_id_permis_fkey" FOREIGN KEY ("id_permis") REFERENCES "permis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligationfiscale" ADD CONSTRAINT "obligationfiscale_id_typePaiement_fkey" FOREIGN KEY ("id_typePaiement") REFERENCES "typepaiement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_id_obligation_fkey" FOREIGN KEY ("id_obligation") REFERENCES "obligationfiscale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TsPaiement" ADD CONSTRAINT "TsPaiement_id_obligation_fkey" FOREIGN KEY ("id_obligation") REFERENCES "obligationfiscale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barem_produit_droit" ADD CONSTRAINT "barem_produit_droit_typePermisId_fkey" FOREIGN KEY ("typePermisId") REFERENCES "typepermis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barem_produit_droit" ADD CONSTRAINT "barem_produit_droit_typeProcedureId_fkey" FOREIGN KEY ("typeProcedureId") REFERENCES "typeprocedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapport_activite" ADD CONSTRAINT "rapport_activite_id_permis_fkey" FOREIGN KEY ("id_permis") REFERENCES "permis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expertminier"("id_expert") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermisProcedure" ADD CONSTRAINT "_PermisProcedure_A_fkey" FOREIGN KEY ("A") REFERENCES "permis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermisProcedure" ADD CONSTRAINT "_PermisProcedure_B_fkey" FOREIGN KEY ("B") REFERENCES "procedure"("id_proc") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeanceMembres" ADD CONSTRAINT "_SeanceMembres_A_fkey" FOREIGN KEY ("A") REFERENCES "MembresComite"("id_membre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeanceMembres" ADD CONSTRAINT "_SeanceMembres_B_fkey" FOREIGN KEY ("B") REFERENCES "SeanceCDPrevue"("id_seance") ON DELETE CASCADE ON UPDATE CASCADE;
