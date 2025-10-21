--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: EnumAvisWali; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumAvisWali" AS ENUM (
    'favorable',
    'defavorable'
);


ALTER TYPE public."EnumAvisWali" OWNER TO postgres;

--
-- Name: EnumDecisionComite; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumDecisionComite" AS ENUM (
    'favorable',
    'defavorable',
    'autre'
);


ALTER TYPE public."EnumDecisionComite" OWNER TO postgres;

--
-- Name: EnumStatutPaiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumStatutPaiement" AS ENUM (
    'A_payer',
    'Paye',
    'En_retard',
    'Annule',
    'Partiellement_paye'
);


ALTER TYPE public."EnumStatutPaiement" OWNER TO postgres;

--
-- Name: EnumStatutSeance; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumStatutSeance" AS ENUM (
    'programmee',
    'terminee'
);


ALTER TYPE public."EnumStatutSeance" OWNER TO postgres;

--
-- Name: EnumTypeDetenteur; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumTypeDetenteur" AS ENUM (
    'ANCIEN',
    'NOUVEAU'
);


ALTER TYPE public."EnumTypeDetenteur" OWNER TO postgres;

--
-- Name: EnumTypeFonction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumTypeFonction" AS ENUM (
    'Representant',
    'Actionnaire',
    'Representant_Actionnaire'
);


ALTER TYPE public."EnumTypeFonction" OWNER TO postgres;

--
-- Name: EnumTypeInteraction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumTypeInteraction" AS ENUM (
    'envoi',
    'relance',
    'reponse'
);


ALTER TYPE public."EnumTypeInteraction" OWNER TO postgres;

--
-- Name: Enumpriorite; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Enumpriorite" AS ENUM (
    'principale',
    'secondaire'
);


ALTER TYPE public."Enumpriorite" OWNER TO postgres;

--
-- Name: MissingAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MissingAction" AS ENUM (
    'BLOCK_NEXT',
    'REJECT',
    'WARNING'
);


ALTER TYPE public."MissingAction" OWNER TO postgres;

--
-- Name: StatutCoord; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutCoord" AS ENUM (
    'DEMANDE_INITIALE',
    'NOUVEAU',
    'ANCIENNE'
);


ALTER TYPE public."StatutCoord" OWNER TO postgres;

--
-- Name: StatutDemande; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutDemande" AS ENUM (
    'ACCEPTEE',
    'EN_COURS',
    'REJETEE'
);


ALTER TYPE public."StatutDemande" OWNER TO postgres;

--
-- Name: StatutProcedure; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutProcedure" AS ENUM (
    'EN_COURS',
    'TERMINEE',
    'EN_ATTENTE'
);


ALTER TYPE public."StatutProcedure" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AncienTypePermis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AncienTypePermis" (
    "id_ancienType" integer NOT NULL,
    lib_type text NOT NULL,
    code_type text NOT NULL
);


ALTER TABLE public."AncienTypePermis" OWNER TO postgres;

--
-- Name: AncienTypePermis_id_ancienType_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AncienTypePermis_id_ancienType_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AncienTypePermis_id_ancienType_seq" OWNER TO postgres;

--
-- Name: AncienTypePermis_id_ancienType_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AncienTypePermis_id_ancienType_seq" OWNED BY public."AncienTypePermis"."id_ancienType";


--
-- Name: Antenne; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Antenne" (
    id_antenne integer NOT NULL,
    nom text NOT NULL,
    localisation text
);


ALTER TABLE public."Antenne" OWNER TO postgres;

--
-- Name: Antenne_id_antenne_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Antenne_id_antenne_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Antenne_id_antenne_seq" OWNER TO postgres;

--
-- Name: Antenne_id_antenne_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Antenne_id_antenne_seq" OWNED BY public."Antenne".id_antenne;


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id integer NOT NULL,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" integer,
    "userId" integer,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    changes jsonb,
    "ipAddress" text,
    "userAgent" text,
    status text DEFAULT 'SUCCESS'::text,
    "errorMessage" text,
    "additionalData" jsonb,
    "previousState" jsonb,
    "contextId" text,
    "sessionId" text
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuditLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuditLog_id_seq" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuditLog_id_seq" OWNED BY public."AuditLog".id;


--
-- Name: ComiteDirection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ComiteDirection" (
    id_comite integer NOT NULL,
    id_seance integer NOT NULL,
    date_comite timestamp(3) without time zone NOT NULL,
    resume_reunion text NOT NULL,
    fiche_technique text,
    carte_projettee text,
    rapport_police text
);


ALTER TABLE public."ComiteDirection" OWNER TO postgres;

--
-- Name: ComiteDirection_id_comite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ComiteDirection_id_comite_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ComiteDirection_id_comite_seq" OWNER TO postgres;

--
-- Name: ComiteDirection_id_comite_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ComiteDirection_id_comite_seq" OWNED BY public."ComiteDirection".id_comite;


--
-- Name: Commune; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Commune" (
    id_commune integer NOT NULL,
    id_daira integer,
    "nom_communeFR" text NOT NULL,
    "nom_communeAR" text NOT NULL,
    nature text
);


ALTER TABLE public."Commune" OWNER TO postgres;

--
-- Name: Commune_id_commune_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Commune_id_commune_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Commune_id_commune_seq" OWNER TO postgres;

--
-- Name: Commune_id_commune_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Commune_id_commune_seq" OWNED BY public."Commune".id_commune;


--
-- Name: Conversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Conversation" (
    id integer NOT NULL,
    "user1Id" integer NOT NULL,
    "user2Id" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Conversation" OWNER TO postgres;

--
-- Name: Conversation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Conversation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Conversation_id_seq" OWNER TO postgres;

--
-- Name: Conversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Conversation_id_seq" OWNED BY public."Conversation".id;


--
-- Name: Daira; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Daira" (
    id_daira integer NOT NULL,
    id_wilaya integer NOT NULL,
    "nom_dairaFR" text NOT NULL,
    "nom_dairaAR" text NOT NULL
);


ALTER TABLE public."Daira" OWNER TO postgres;

--
-- Name: Daira_id_daira_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Daira_id_daira_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Daira_id_daira_seq" OWNER TO postgres;

--
-- Name: Daira_id_daira_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Daira_id_daira_seq" OWNED BY public."Daira".id_daira;


--
-- Name: DecisionCD; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DecisionCD" (
    id_decision integer NOT NULL,
    id_comite integer NOT NULL,
    numero_decision text NOT NULL,
    duree_decision integer,
    commentaires text,
    decision_cd public."EnumDecisionComite" NOT NULL
);


ALTER TABLE public."DecisionCD" OWNER TO postgres;

--
-- Name: DecisionCD_id_decision_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DecisionCD_id_decision_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DecisionCD_id_decision_seq" OWNER TO postgres;

--
-- Name: DecisionCD_id_decision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DecisionCD_id_decision_seq" OWNED BY public."DecisionCD".id_decision;


--
-- Name: Document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Document" (
    id_doc integer NOT NULL,
    nom_doc text NOT NULL,
    description text NOT NULL,
    format text NOT NULL,
    taille_doc text NOT NULL
);


ALTER TABLE public."Document" OWNER TO postgres;

--
-- Name: Document_id_doc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Document_id_doc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Document_id_doc_seq" OWNER TO postgres;

--
-- Name: Document_id_doc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Document_id_doc_seq" OWNED BY public."Document".id_doc;


--
-- Name: DossierAdministratif; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DossierAdministratif" (
    id_dossier integer NOT NULL,
    id_typeproc integer NOT NULL,
    "id_typePermis" integer NOT NULL,
    nombre_doc integer NOT NULL,
    remarques text
);


ALTER TABLE public."DossierAdministratif" OWNER TO postgres;

--
-- Name: DossierAdministratif_id_dossier_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DossierAdministratif_id_dossier_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DossierAdministratif_id_dossier_seq" OWNER TO postgres;

--
-- Name: DossierAdministratif_id_dossier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DossierAdministratif_id_dossier_seq" OWNED BY public."DossierAdministratif".id_dossier;


--
-- Name: DossierDocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DossierDocument" (
    id_dossier integer NOT NULL,
    id_doc integer NOT NULL,
    is_obligatoire boolean DEFAULT false NOT NULL,
    missing_action public."MissingAction" DEFAULT 'BLOCK_NEXT'::public."MissingAction" NOT NULL,
    reject_message text
);


ALTER TABLE public."DossierDocument" OWNER TO postgres;

--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: GroupPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupPermission" (
    "groupId" integer NOT NULL,
    "permissionId" integer NOT NULL
);


ALTER TABLE public."GroupPermission" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Group_id_seq" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Group_id_seq" OWNED BY public."Group".id;


--
-- Name: InteractionWali; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InteractionWali" (
    id_interaction integer NOT NULL,
    id_procedure integer NOT NULL,
    id_wilaya integer NOT NULL,
    type_interaction public."EnumTypeInteraction",
    avis_wali public."EnumAvisWali",
    date_envoi timestamp(3) without time zone,
    date_reponse timestamp(3) without time zone,
    delai_depasse boolean,
    nom_responsable_reception text,
    commentaires text,
    contenu text,
    is_relance boolean DEFAULT false NOT NULL
);


ALTER TABLE public."InteractionWali" OWNER TO postgres;

--
-- Name: InteractionWali_id_interaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."InteractionWali_id_interaction_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."InteractionWali_id_interaction_seq" OWNER TO postgres;

--
-- Name: InteractionWali_id_interaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."InteractionWali_id_interaction_seq" OWNED BY public."InteractionWali".id_interaction;


--
-- Name: MembreSeance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MembreSeance" (
    id_seance integer NOT NULL,
    id_membre integer NOT NULL
);


ALTER TABLE public."MembreSeance" OWNER TO postgres;

--
-- Name: MembresComite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MembresComite" (
    id_membre integer NOT NULL,
    nom_membre text NOT NULL,
    prenom_membre text NOT NULL,
    fonction_membre text NOT NULL,
    email_membre text NOT NULL
);


ALTER TABLE public."MembresComite" OWNER TO postgres;

--
-- Name: MembresComite_id_membre_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MembresComite_id_membre_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MembresComite_id_membre_seq" OWNER TO postgres;

--
-- Name: MembresComite_id_membre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MembresComite_id_membre_seq" OWNED BY public."MembresComite".id_membre;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    content text NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    "conversationId" integer,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Permission_id_seq" OWNER TO postgres;

--
-- Name: Permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Permission_id_seq" OWNED BY public."Permission".id;


--
-- Name: PortalApplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalApplication" (
    id integer NOT NULL,
    code text,
    status text NOT NULL,
    title text,
    "permitTypeId" integer NOT NULL,
    "companyId" integer,
    wilaya text,
    daira text,
    commune text,
    "lieuDit" text,
    "polygonGeo" jsonb,
    "applicantToken" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PortalApplication" OWNER TO postgres;

--
-- Name: PortalApplicationDocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalApplicationDocument" (
    id integer NOT NULL,
    "applicationId" integer NOT NULL,
    "documentId" integer NOT NULL,
    status text NOT NULL,
    "fileUrl" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."PortalApplicationDocument" OWNER TO postgres;

--
-- Name: PortalApplicationDocument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalApplicationDocument_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalApplicationDocument_id_seq" OWNER TO postgres;

--
-- Name: PortalApplicationDocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalApplicationDocument_id_seq" OWNED BY public."PortalApplicationDocument".id;


--
-- Name: PortalApplication_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalApplication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalApplication_id_seq" OWNER TO postgres;

--
-- Name: PortalApplication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalApplication_id_seq" OWNED BY public."PortalApplication".id;


--
-- Name: PortalCompany; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalCompany" (
    id integer NOT NULL,
    "legalName" text NOT NULL,
    "legalForm" text,
    "rcNumber" text,
    "rcDate" timestamp(3) without time zone,
    nif text,
    nis text,
    capital double precision,
    address text,
    email text,
    phone text,
    website text,
    "managerName" text,
    "registryFileUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PortalCompany" OWNER TO postgres;

--
-- Name: PortalCompany_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalCompany_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalCompany_id_seq" OWNER TO postgres;

--
-- Name: PortalCompany_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalCompany_id_seq" OWNED BY public."PortalCompany".id;


--
-- Name: PortalDocumentDefinition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalDocumentDefinition" (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    format text,
    "maxSizeMB" integer,
    required boolean DEFAULT true NOT NULL,
    "missingAction" public."MissingAction" DEFAULT 'BLOCK_NEXT'::public."MissingAction" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PortalDocumentDefinition" OWNER TO postgres;

--
-- Name: PortalDocumentDefinition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalDocumentDefinition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalDocumentDefinition_id_seq" OWNER TO postgres;

--
-- Name: PortalDocumentDefinition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalDocumentDefinition_id_seq" OWNED BY public."PortalDocumentDefinition".id;


--
-- Name: PortalPayment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalPayment" (
    id integer NOT NULL,
    "applicationId" integer NOT NULL,
    provider text NOT NULL,
    amount integer NOT NULL,
    currency text DEFAULT 'DZD'::text NOT NULL,
    status text NOT NULL,
    "intentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PortalPayment" OWNER TO postgres;

--
-- Name: PortalPayment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalPayment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalPayment_id_seq" OWNER TO postgres;

--
-- Name: PortalPayment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalPayment_id_seq" OWNED BY public."PortalPayment".id;


--
-- Name: PortalPermitType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalPermitType" (
    id integer NOT NULL,
    code text NOT NULL,
    label text NOT NULL,
    description text,
    regime text,
    "initialYears" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PortalPermitType" OWNER TO postgres;

--
-- Name: PortalPermitType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalPermitType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalPermitType_id_seq" OWNER TO postgres;

--
-- Name: PortalPermitType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalPermitType_id_seq" OWNED BY public."PortalPermitType".id;


--
-- Name: PortalRepresentative; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalRepresentative" (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "fullName" text NOT NULL,
    function text,
    "nationalId" text,
    email text,
    phone text,
    "powerDocUrl" text
);


ALTER TABLE public."PortalRepresentative" OWNER TO postgres;

--
-- Name: PortalRepresentative_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalRepresentative_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalRepresentative_id_seq" OWNER TO postgres;

--
-- Name: PortalRepresentative_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalRepresentative_id_seq" OWNED BY public."PortalRepresentative".id;


--
-- Name: PortalShareholder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalShareholder" (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    nif text,
    "sharePct" double precision NOT NULL,
    nationality text
);


ALTER TABLE public."PortalShareholder" OWNER TO postgres;

--
-- Name: PortalShareholder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalShareholder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalShareholder_id_seq" OWNER TO postgres;

--
-- Name: PortalShareholder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalShareholder_id_seq" OWNED BY public."PortalShareholder".id;


--
-- Name: PortalTypeDocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortalTypeDocument" (
    id integer NOT NULL,
    "permitTypeId" integer NOT NULL,
    "documentId" integer NOT NULL,
    "order" integer,
    notes text
);


ALTER TABLE public."PortalTypeDocument" OWNER TO postgres;

--
-- Name: PortalTypeDocument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PortalTypeDocument_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PortalTypeDocument_id_seq" OWNER TO postgres;

--
-- Name: PortalTypeDocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PortalTypeDocument_id_seq" OWNED BY public."PortalTypeDocument".id;


--
-- Name: ProcedureCoord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProcedureCoord" (
    "id_procedureCoord" integer NOT NULL,
    id_proc integer NOT NULL,
    id_coordonnees integer NOT NULL,
    statut_coord public."StatutCoord" NOT NULL
);


ALTER TABLE public."ProcedureCoord" OWNER TO postgres;

--
-- Name: ProcedureCoord_id_procedureCoord_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProcedureCoord_id_procedureCoord_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProcedureCoord_id_procedureCoord_seq" OWNER TO postgres;

--
-- Name: ProcedureCoord_id_procedureCoord_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProcedureCoord_id_procedureCoord_seq" OWNED BY public."ProcedureCoord"."id_procedureCoord";


--
-- Name: ProcedureRenouvellement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProcedureRenouvellement" (
    id_renouvellement integer NOT NULL,
    id_demande integer NOT NULL,
    num_decision text,
    date_decision timestamp(3) without time zone,
    date_debut_validite timestamp(3) without time zone,
    date_fin_validite timestamp(3) without time zone,
    commentaire text
);


ALTER TABLE public."ProcedureRenouvellement" OWNER TO postgres;

--
-- Name: ProcedureRenouvellement_id_renouvellement_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProcedureRenouvellement_id_renouvellement_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProcedureRenouvellement_id_renouvellement_seq" OWNER TO postgres;

--
-- Name: ProcedureRenouvellement_id_renouvellement_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProcedureRenouvellement_id_renouvellement_seq" OWNED BY public."ProcedureRenouvellement".id_renouvellement;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    "roleId" integer NOT NULL,
    "permissionId" integer NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: SeanceCDPrevue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SeanceCDPrevue" (
    id_seance integer NOT NULL,
    num_seance text NOT NULL,
    date_seance timestamp(3) without time zone NOT NULL,
    exercice integer NOT NULL,
    remarques text,
    statut public."EnumStatutSeance" NOT NULL
);


ALTER TABLE public."SeanceCDPrevue" OWNER TO postgres;

--
-- Name: SeanceCDPrevue_id_seance_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SeanceCDPrevue_id_seance_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SeanceCDPrevue_id_seance_seq" OWNER TO postgres;

--
-- Name: SeanceCDPrevue_id_seance_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SeanceCDPrevue_id_seance_seq" OWNED BY public."SeanceCDPrevue".id_seance;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id integer NOT NULL,
    token character varying(64) NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_id_seq" OWNER TO postgres;

--
-- Name: Session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Session".id;


--
-- Name: StatutPermis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StatutPermis" (
    id integer NOT NULL,
    lib_statut text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public."StatutPermis" OWNER TO postgres;

--
-- Name: StatutPermis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."StatutPermis_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."StatutPermis_id_seq" OWNER TO postgres;

--
-- Name: StatutPermis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."StatutPermis_id_seq" OWNED BY public."StatutPermis".id;


--
-- Name: TsPaiement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TsPaiement" (
    "id_tsPaiement" integer NOT NULL,
    id_obligation integer NOT NULL,
    "datePerDebut" timestamp(3) without time zone NOT NULL,
    "datePerFin" timestamp(3) without time zone NOT NULL,
    "surfaceMin" double precision NOT NULL,
    "surfaceMax" double precision NOT NULL
);


ALTER TABLE public."TsPaiement" OWNER TO postgres;

--
-- Name: TsPaiement_id_tsPaiement_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TsPaiement_id_tsPaiement_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TsPaiement_id_tsPaiement_seq" OWNER TO postgres;

--
-- Name: TsPaiement_id_tsPaiement_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TsPaiement_id_tsPaiement_seq" OWNED BY public."TsPaiement"."id_tsPaiement";


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    nom text NOT NULL,
    "Prenom" text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "roleId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserGroup" (
    "userId" integer NOT NULL,
    "groupId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserGroup" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Wilaya; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wilaya" (
    id_wilaya integer NOT NULL,
    id_antenne integer NOT NULL,
    code_wilaya text NOT NULL,
    "nom_wilayaFR" text NOT NULL,
    "nom_wilayaAR" text NOT NULL,
    zone text NOT NULL
);


ALTER TABLE public."Wilaya" OWNER TO postgres;

--
-- Name: Wilaya_id_wilaya_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Wilaya_id_wilaya_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Wilaya_id_wilaya_seq" OWNER TO postgres;

--
-- Name: Wilaya_id_wilaya_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Wilaya_id_wilaya_seq" OWNED BY public."Wilaya".id_wilaya;


--
-- Name: _PermisProcedure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_PermisProcedure" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_PermisProcedure" OWNER TO postgres;

--
-- Name: _SeanceMembres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_SeanceMembres" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_SeanceMembres" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: barem_produit_droit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.barem_produit_droit (
    id integer NOT NULL,
    montant_droit_etab double precision NOT NULL,
    produit_attribution double precision NOT NULL,
    "typePermisId" integer NOT NULL,
    "typeProcedureId" integer NOT NULL
);


ALTER TABLE public.barem_produit_droit OWNER TO postgres;

--
-- Name: barem_produit_droit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.barem_produit_droit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.barem_produit_droit_id_seq OWNER TO postgres;

--
-- Name: barem_produit_droit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.barem_produit_droit_id_seq OWNED BY public.barem_produit_droit.id;


--
-- Name: cahiercharge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cahiercharge (
    id integer NOT NULL,
    "permisId" integer,
    "demandeId" integer,
    num_cdc text NOT NULL,
    date_etablissement timestamp(3) without time zone NOT NULL,
    "dateExercice" timestamp(3) without time zone NOT NULL,
    lieu_signature text NOT NULL,
    signataire_administration text NOT NULL,
    fuseau text,
    "typeCoordonnees" text,
    version text,
    "natureJuridique" text,
    "vocationTerrain" text,
    "nomGerant" text,
    "personneChargeTrxx" text,
    qualification text,
    "reservesGeologiques" double precision,
    "reservesExploitables" double precision,
    "volumeExtraction" double precision,
    "dureeExploitation" integer,
    "methodeExploitation" text,
    "dureeTravaux" integer,
    "dateDebutTravaux" timestamp(3) without time zone,
    "dateDebutProduction" timestamp(3) without time zone,
    "investissementDA" double precision,
    "investissementUSD" double precision,
    "capaciteInstallee" double precision,
    commentaires text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cahiercharge OWNER TO postgres;

--
-- Name: cahiercharge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cahiercharge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cahiercharge_id_seq OWNER TO postgres;

--
-- Name: cahiercharge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cahiercharge_id_seq OWNED BY public.cahiercharge.id;


--
-- Name: codeAssimilation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."codeAssimilation" (
    id_code integer NOT NULL,
    "id_ancienType" integer NOT NULL,
    id_permis integer NOT NULL,
    ancien_code text NOT NULL
);


ALTER TABLE public."codeAssimilation" OWNER TO postgres;

--
-- Name: codeAssimilation_id_code_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."codeAssimilation_id_code_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."codeAssimilation_id_code_seq" OWNER TO postgres;

--
-- Name: codeAssimilation_id_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."codeAssimilation_id_code_seq" OWNED BY public."codeAssimilation".id_code;


--
-- Name: coordonnee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coordonnee (
    id_coordonnees integer NOT NULL,
    id_zone_interdite integer,
    point text,
    x double precision NOT NULL,
    y double precision NOT NULL,
    z double precision NOT NULL,
    system text DEFAULT 'WGS84'::text,
    zone integer,
    hemisphere text
);


ALTER TABLE public.coordonnee OWNER TO postgres;

--
-- Name: coordonnee_id_coordonnees_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coordonnee_id_coordonnees_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coordonnee_id_coordonnees_seq OWNER TO postgres;

--
-- Name: coordonnee_id_coordonnees_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coordonnee_id_coordonnees_seq OWNED BY public.coordonnee.id_coordonnees;


--
-- Name: demAnnulation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demAnnulation" (
    id_annulation integer NOT NULL,
    id_demande integer NOT NULL,
    num_decision text,
    date_constat timestamp(3) without time zone,
    date_annulation timestamp(3) without time zone,
    cause_annulation text,
    statut_annulation text
);


ALTER TABLE public."demAnnulation" OWNER TO postgres;

--
-- Name: demAnnulation_id_annulation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demAnnulation_id_annulation_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demAnnulation_id_annulation_seq" OWNER TO postgres;

--
-- Name: demAnnulation_id_annulation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demAnnulation_id_annulation_seq" OWNED BY public."demAnnulation".id_annulation;


--
-- Name: demCession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demCession" (
    id_cession integer NOT NULL,
    id_demande integer NOT NULL,
    "id_ancienCessionnaire" integer NOT NULL,
    "id_nouveauCessionnaire" integer NOT NULL,
    motif_cession text,
    nature_cession text,
    taux_cession double precision,
    date_validation timestamp(3) without time zone
);


ALTER TABLE public."demCession" OWNER TO postgres;

--
-- Name: demCession_id_cession_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demCession_id_cession_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demCession_id_cession_seq" OWNER TO postgres;

--
-- Name: demCession_id_cession_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demCession_id_cession_seq" OWNED BY public."demCession".id_cession;


--
-- Name: demFermeture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demFermeture" (
    id_fermeture integer NOT NULL,
    id_demande integer NOT NULL,
    num_decision text,
    date_constat timestamp(3) without time zone,
    rapport text
);


ALTER TABLE public."demFermeture" OWNER TO postgres;

--
-- Name: demFermeture_id_fermeture_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demFermeture_id_fermeture_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demFermeture_id_fermeture_seq" OWNER TO postgres;

--
-- Name: demFermeture_id_fermeture_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demFermeture_id_fermeture_seq" OWNED BY public."demFermeture".id_fermeture;


--
-- Name: demFusion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demFusion" (
    id_fusion integer NOT NULL,
    id_demande integer NOT NULL,
    "id_permisResultant" integer NOT NULL,
    date_fusion timestamp(3) without time zone NOT NULL,
    motif_fusion text,
    statut_fusion text
);


ALTER TABLE public."demFusion" OWNER TO postgres;

--
-- Name: demFusion_id_fusion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demFusion_id_fusion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demFusion_id_fusion_seq" OWNER TO postgres;

--
-- Name: demFusion_id_fusion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demFusion_id_fusion_seq" OWNED BY public."demFusion".id_fusion;


--
-- Name: demModification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demModification" (
    id_modification integer NOT NULL,
    id_demande integer NOT NULL,
    type_modif text,
    statut_modification text
);


ALTER TABLE public."demModification" OWNER TO postgres;

--
-- Name: demModification_id_modification_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demModification_id_modification_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demModification_id_modification_seq" OWNER TO postgres;

--
-- Name: demModification_id_modification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demModification_id_modification_seq" OWNED BY public."demModification".id_modification;


--
-- Name: demRenonciation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demRenonciation" (
    id_renonciation integer NOT NULL,
    id_demande integer NOT NULL,
    motif_renonciation text,
    rapport_technique text
);


ALTER TABLE public."demRenonciation" OWNER TO postgres;

--
-- Name: demRenonciation_id_renonciation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demRenonciation_id_renonciation_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demRenonciation_id_renonciation_seq" OWNER TO postgres;

--
-- Name: demRenonciation_id_renonciation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demRenonciation_id_renonciation_seq" OWNED BY public."demRenonciation".id_renonciation;


--
-- Name: demSubstitution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demSubstitution" (
    id_substitution integer NOT NULL,
    id_demande integer NOT NULL,
    num_decision text,
    date_decision timestamp(3) without time zone,
    motif_substitution text,
    commentaires text
);


ALTER TABLE public."demSubstitution" OWNER TO postgres;

--
-- Name: demSubstitution_id_substitution_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demSubstitution_id_substitution_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demSubstitution_id_substitution_seq" OWNER TO postgres;

--
-- Name: demSubstitution_id_substitution_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demSubstitution_id_substitution_seq" OWNED BY public."demSubstitution".id_substitution;


--
-- Name: demTransfert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demTransfert" (
    id_transfert integer NOT NULL,
    id_demande integer NOT NULL,
    motif_transfert text,
    observations text,
    date_transfert timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."demTransfert" OWNER TO postgres;

--
-- Name: demTransfert_id_transfert_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demTransfert_id_transfert_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demTransfert_id_transfert_seq" OWNER TO postgres;

--
-- Name: demTransfert_id_transfert_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demTransfert_id_transfert_seq" OWNED BY public."demTransfert".id_transfert;


--
-- Name: demande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demande (
    id_demande integer NOT NULL,
    id_proc integer,
    id_detenteur integer,
    id_wilaya integer,
    id_daira integer,
    id_commune integer,
    "id_typeProc" integer,
    "id_typePermis" integer,
    id_expert integer,
    code_demande text,
    date_demande timestamp(3) without time zone,
    date_instruction timestamp(3) without time zone,
    intitule_projet text,
    date_fin_instruction timestamp(3) without time zone,
    date_refus timestamp(3) without time zone,
    "lieu_ditFR" text,
    lieu_dit_ar text,
    superficie double precision,
    statut_juridique_terrain text,
    occupant_terrain_legal text,
    destination text,
    "locPointOrigine" text,
    duree_travaux_estimee text,
    date_demarrage_prevue timestamp(3) without time zone,
    qualite_signataire text,
    montant_produit text,
    con_res_geo text,
    con_res_exp text,
    volume_prevu text,
    capital_social_disponible double precision,
    budget_prevu double precision,
    description_travaux text,
    sources_financement text,
    remarques text,
    date_fin_ramassage timestamp(3) without time zone,
    num_enregist text,
    "AreaCat" double precision,
    statut_demande text NOT NULL
);


ALTER TABLE public.demande OWNER TO postgres;

--
-- Name: demandeMin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demandeMin" (
    "id_demMin" integer NOT NULL,
    id_demande integer NOT NULL,
    min_label text,
    min_teneur double precision,
    ordre_mineral text
);


ALTER TABLE public."demandeMin" OWNER TO postgres;

--
-- Name: demandeMin_id_demMin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demandeMin_id_demMin_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demandeMin_id_demMin_seq" OWNER TO postgres;

--
-- Name: demandeMin_id_demMin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demandeMin_id_demMin_seq" OWNED BY public."demandeMin"."id_demMin";


--
-- Name: demandeObs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demandeObs" (
    "id_demandeObs" integer NOT NULL,
    id_demande integer NOT NULL,
    obs_situation_geo text,
    obs_empietement text,
    obs_emplacement text,
    obs_geom text,
    obs_superficie text
);


ALTER TABLE public."demandeObs" OWNER TO postgres;

--
-- Name: demandeObs_id_demandeObs_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demandeObs_id_demandeObs_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demandeObs_id_demandeObs_seq" OWNER TO postgres;

--
-- Name: demandeObs_id_demandeObs_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demandeObs_id_demandeObs_seq" OWNED BY public."demandeObs"."id_demandeObs";


--
-- Name: demandeVerificationGeo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."demandeVerificationGeo" (
    "id_demVerif" integer NOT NULL,
    id_demande integer NOT NULL,
    sit_geo_ok boolean,
    empiet_ok boolean,
    superf_ok boolean,
    geom_ok boolean,
    verification_cadastrale_ok boolean,
    superficie_cadastrale double precision
);


ALTER TABLE public."demandeVerificationGeo" OWNER TO postgres;

--
-- Name: demandeVerificationGeo_id_demVerif_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demandeVerificationGeo_id_demVerif_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demandeVerificationGeo_id_demVerif_seq" OWNER TO postgres;

--
-- Name: demandeVerificationGeo_id_demVerif_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demandeVerificationGeo_id_demVerif_seq" OWNED BY public."demandeVerificationGeo"."id_demVerif";


--
-- Name: demande_id_demande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demande_id_demande_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demande_id_demande_seq OWNER TO postgres;

--
-- Name: demande_id_demande_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demande_id_demande_seq OWNED BY public.demande.id_demande;


--
-- Name: detenteurmorale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detenteurmorale (
    id_detenteur integer NOT NULL,
    "id_statutJuridique" integer,
    id_pays integer,
    id_nationalite integer,
    "nom_societeFR" text,
    "nom_societeAR" text,
    adresse_siege text,
    telephone text,
    fax text,
    email text,
    site_web text
);


ALTER TABLE public.detenteurmorale OWNER TO postgres;

--
-- Name: detenteurmorale_id_detenteur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detenteurmorale_id_detenteur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detenteurmorale_id_detenteur_seq OWNER TO postgres;

--
-- Name: detenteurmorale_id_detenteur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detenteurmorale_id_detenteur_seq OWNED BY public.detenteurmorale.id_detenteur;


--
-- Name: dossier_fournis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dossier_fournis (
    "id_dossierFournis" integer NOT NULL,
    id_demande integer NOT NULL,
    date_depot timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    recevabilite_doss boolean,
    statut_dossier text NOT NULL,
    remarques text,
    numero_accuse text,
    date_accuse timestamp(3) without time zone,
    numero_recepisse text,
    date_recepisse timestamp(3) without time zone,
    mise_en_demeure_envoyee boolean DEFAULT false NOT NULL,
    date_mise_en_demeure timestamp(3) without time zone,
    pieces_manquantes jsonb,
    verification_phase text,
    date_preannotation timestamp(3) without time zone
);


ALTER TABLE public.dossier_fournis OWNER TO postgres;

--
-- Name: dossier_fournis_document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dossier_fournis_document (
    "id_dossierFournis" integer NOT NULL,
    id_doc integer NOT NULL,
    status text NOT NULL,
    file_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.dossier_fournis_document OWNER TO postgres;

--
-- Name: dossier_fournis_id_dossierFournis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."dossier_fournis_id_dossierFournis_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."dossier_fournis_id_dossierFournis_seq" OWNER TO postgres;

--
-- Name: dossier_fournis_id_dossierFournis_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."dossier_fournis_id_dossierFournis_seq" OWNED BY public.dossier_fournis."id_dossierFournis";


--
-- Name: etape_proc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etape_proc (
    id_etape integer NOT NULL,
    lib_etape text NOT NULL,
    duree_etape integer,
    ordre_etape integer NOT NULL,
    id_phase integer NOT NULL
);


ALTER TABLE public.etape_proc OWNER TO postgres;

--
-- Name: etape_proc_id_etape_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etape_proc_id_etape_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etape_proc_id_etape_seq OWNER TO postgres;

--
-- Name: etape_proc_id_etape_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etape_proc_id_etape_seq OWNED BY public.etape_proc.id_etape;


--
-- Name: expertminier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expertminier (
    id_expert integer NOT NULL,
    nom_expert text NOT NULL,
    num_agrement text,
    date_agrement timestamp(3) without time zone,
    etat_agrement text,
    adresse text,
    email text,
    tel_expert text,
    fax_expert text,
    specialisation text
);


ALTER TABLE public.expertminier OWNER TO postgres;

--
-- Name: expertminier_id_expert_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expertminier_id_expert_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expertminier_id_expert_seq OWNER TO postgres;

--
-- Name: expertminier_id_expert_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expertminier_id_expert_seq OWNED BY public.expertminier.id_expert;


--
-- Name: fonctionpersonnemoral; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fonctionpersonnemoral (
    id_detenteur integer NOT NULL,
    id_personne integer NOT NULL,
    type_fonction public."EnumTypeFonction" NOT NULL,
    statut_personne text NOT NULL,
    taux_participation double precision NOT NULL
);


ALTER TABLE public.fonctionpersonnemoral OWNER TO postgres;

--
-- Name: fusionPermisSource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."fusionPermisSource" (
    id_permis integer NOT NULL,
    id_fusion integer NOT NULL
);


ALTER TABLE public."fusionPermisSource" OWNER TO postgres;

--
-- Name: inscription_provisoire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscription_provisoire (
    id integer NOT NULL,
    id_proc integer NOT NULL,
    id_demande integer NOT NULL,
    points jsonb NOT NULL,
    system text,
    zone integer,
    hemisphere text,
    superficie_declaree double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.inscription_provisoire OWNER TO postgres;

--
-- Name: inscription_provisoire_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscription_provisoire_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscription_provisoire_id_seq OWNER TO postgres;

--
-- Name: inscription_provisoire_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscription_provisoire_id_seq OWNED BY public.inscription_provisoire.id;


--
-- Name: nationalite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nationalite (
    id_nationalite integer NOT NULL,
    libelle text NOT NULL
);


ALTER TABLE public.nationalite OWNER TO postgres;

--
-- Name: nationalite_id_nationalite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nationalite_id_nationalite_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nationalite_id_nationalite_seq OWNER TO postgres;

--
-- Name: nationalite_id_nationalite_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nationalite_id_nationalite_seq OWNED BY public.nationalite.id_nationalite;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "relatedEntityId" integer,
    "relatedEntityType" text,
    "expertId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    priority text DEFAULT 'info'::text NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: obligationfiscale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.obligationfiscale (
    id integer NOT NULL,
    "id_typePaiement" integer NOT NULL,
    id_permis integer NOT NULL,
    annee_fiscale integer NOT NULL,
    montant_attendu double precision NOT NULL,
    date_echeance timestamp(3) without time zone NOT NULL,
    statut public."EnumStatutPaiement" NOT NULL,
    details_calcul text
);


ALTER TABLE public.obligationfiscale OWNER TO postgres;

--
-- Name: obligationfiscale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.obligationfiscale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.obligationfiscale_id_seq OWNER TO postgres;

--
-- Name: obligationfiscale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.obligationfiscale_id_seq OWNED BY public.obligationfiscale.id;


--
-- Name: paiement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiement (
    id integer NOT NULL,
    id_obligation integer NOT NULL,
    montant_paye double precision NOT NULL,
    devise text DEFAULT 'DZD'::text NOT NULL,
    date_paiement timestamp(3) without time zone NOT NULL,
    mode_paiement text NOT NULL,
    num_quittance text,
    etat_paiement text NOT NULL,
    justificatif_url text,
    num_perc text,
    "date_remisOp" timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.paiement OWNER TO postgres;

--
-- Name: paiement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paiement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paiement_id_seq OWNER TO postgres;

--
-- Name: paiement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paiement_id_seq OWNED BY public.paiement.id;


--
-- Name: pays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pays (
    id_pays integer NOT NULL,
    code_pays text NOT NULL,
    nom_pays text NOT NULL
);


ALTER TABLE public.pays OWNER TO postgres;

--
-- Name: pays_id_pays_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pays_id_pays_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pays_id_pays_seq OWNER TO postgres;

--
-- Name: pays_id_pays_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pays_id_pays_seq OWNED BY public.pays.id_pays;


--
-- Name: permis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permis (
    id integer NOT NULL,
    "id_typePermis" integer NOT NULL,
    id_commune integer,
    id_detenteur integer,
    id_statut integer,
    code_permis text,
    date_adjudication timestamp(3) without time zone,
    date_octroi timestamp(3) without time zone,
    date_expiration timestamp(3) without time zone,
    date_annulation timestamp(3) without time zone,
    date_renonciation timestamp(3) without time zone,
    duree_validite integer NOT NULL,
    "lieu_ditFR" text,
    "lieu_ditAR" text,
    mode_attribution text,
    superficie double precision,
    utilisation text,
    invest_prevu text,
    invest_real text,
    montant_offre text,
    statut_juridique_terrain text,
    duree_prevue_travaux text,
    date_demarrage_travaux timestamp(3) without time zone,
    statut_activites text,
    nombre_renouvellements integer NOT NULL,
    hypothec text,
    nom_projet text,
    volume_prevu text,
    date_conversion_permis timestamp(3) without time zone,
    commentaires text
);


ALTER TABLE public.permis OWNER TO postgres;

--
-- Name: permis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permis_id_seq OWNER TO postgres;

--
-- Name: permis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permis_id_seq OWNED BY public.permis.id;


--
-- Name: permis_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permis_templates (
    id integer NOT NULL,
    name text NOT NULL,
    elements jsonb NOT NULL,
    "typePermisId" integer NOT NULL,
    "permisId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.permis_templates OWNER TO postgres;

--
-- Name: permis_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permis_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permis_templates_id_seq OWNER TO postgres;

--
-- Name: permis_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permis_templates_id_seq OWNED BY public.permis_templates.id;


--
-- Name: personnephysique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personnephysique (
    id_personne integer NOT NULL,
    id_pays integer NOT NULL,
    id_nationalite integer,
    "nomFR" text NOT NULL,
    "nomAR" text NOT NULL,
    "prenomFR" text NOT NULL,
    "prenomAR" text NOT NULL,
    date_naissance timestamp(3) without time zone,
    lieu_naissance text NOT NULL,
    nationalite text NOT NULL,
    adresse_domicile text NOT NULL,
    telephone text NOT NULL,
    fax text NOT NULL,
    email text NOT NULL,
    qualification text NOT NULL,
    num_carte_identite text NOT NULL,
    lieu_juridique_soc text NOT NULL,
    ref_professionnelles text NOT NULL
);


ALTER TABLE public.personnephysique OWNER TO postgres;

--
-- Name: personnephysique_id_personne_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personnephysique_id_personne_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personnephysique_id_personne_seq OWNER TO postgres;

--
-- Name: personnephysique_id_personne_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personnephysique_id_personne_seq OWNED BY public.personnephysique.id_personne;


--
-- Name: phase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phase (
    id_phase integer NOT NULL,
    libelle text NOT NULL,
    ordre integer NOT NULL,
    description text,
    "dureeEstimee" integer,
    "typeProcedureId" integer
);


ALTER TABLE public.phase OWNER TO postgres;

--
-- Name: phase_id_phase_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.phase_id_phase_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.phase_id_phase_seq OWNER TO postgres;

--
-- Name: phase_id_phase_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.phase_id_phase_seq OWNED BY public.phase.id_phase;


--
-- Name: procedure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedure (
    id_proc integer NOT NULL,
    id_seance integer,
    num_proc text NOT NULL,
    date_debut_proc timestamp(3) without time zone NOT NULL,
    date_fin_proc timestamp(3) without time zone,
    statut_proc public."StatutProcedure" NOT NULL,
    resultat text,
    observations text,
    "typeProcedureId" integer
);


ALTER TABLE public.procedure OWNER TO postgres;

--
-- Name: procedure_etape; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedure_etape (
    id_proc integer NOT NULL,
    id_etape integer NOT NULL,
    statut public."StatutProcedure" NOT NULL,
    date_debut timestamp(3) without time zone NOT NULL,
    date_fin timestamp(3) without time zone,
    link text
);


ALTER TABLE public.procedure_etape OWNER TO postgres;

--
-- Name: procedure_id_proc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procedure_id_proc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procedure_id_proc_seq OWNER TO postgres;

--
-- Name: procedure_id_proc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procedure_id_proc_seq OWNED BY public.procedure.id_proc;


--
-- Name: procedure_phase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedure_phase (
    id_proc integer NOT NULL,
    id_phase integer NOT NULL,
    ordre integer NOT NULL,
    statut public."StatutProcedure"
);


ALTER TABLE public.procedure_phase OWNER TO postgres;

--
-- Name: rapport_activite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rapport_activite (
    id_rapport integer NOT NULL,
    id_permis integer NOT NULL,
    date_remise_reelle timestamp(3) without time zone NOT NULL,
    etat_activite text NOT NULL,
    leve_topo_3112 text,
    leve_topo_3006 text,
    plan_exploitation text,
    date_debut_travaux timestamp(3) without time zone,
    vente_exportation text,
    importation text,
    valeur_equipement_acquis double precision,
    pros_expl_entamee text,
    avancee_travaux text,
    travaux_realises text,
    nbr_ouvrages integer,
    volume double precision,
    resume_activites text,
    investissements_realises double precision,
    qte_explosifs double precision,
    "qte_explosifs_DIM" double precision,
    detonateurs integer,
    dmr integer,
    cordeau_detonant integer,
    meche_lente integer,
    relais integer,
    "DEI" integer,
    effectif_cadre integer,
    effectif_maitrise integer,
    effectif_execution integer,
    production_toutvenant double precision,
    production_marchande double precision,
    production_vendue double precision,
    production_stocke double precision,
    "stock_T_V" double precision,
    stock_produit_marchand double precision,
    production_sable double precision,
    poussieres double precision,
    rejets_laverie double precision,
    fumee_gaz double precision,
    autres_effluents double precision,
    nbr_accidents integer,
    accidents_mortels integer,
    accidents_non_mortels integer,
    nbrs_jours_perdues integer,
    taux_frequence double precision,
    taux_gravite double precision,
    nbrs_incidents integer,
    nbrs_malades_pro integer,
    remise_etat_realisee text,
    cout_remise_etat double precision,
    commentaires_generaux text,
    rapport_url text
);


ALTER TABLE public.rapport_activite OWNER TO postgres;

--
-- Name: rapport_activite_id_rapport_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rapport_activite_id_rapport_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rapport_activite_id_rapport_seq OWNER TO postgres;

--
-- Name: rapport_activite_id_rapport_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rapport_activite_id_rapport_seq OWNED BY public.rapport_activite.id_rapport;


--
-- Name: redevance_bareme; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.redevance_bareme (
    id_redevance integer NOT NULL,
    taux_redevance double precision NOT NULL,
    valeur_marchande double precision NOT NULL,
    unite text NOT NULL,
    devise text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.redevance_bareme OWNER TO postgres;

--
-- Name: redevance_bareme_id_redevance_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.redevance_bareme_id_redevance_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.redevance_bareme_id_redevance_seq OWNER TO postgres;

--
-- Name: redevance_bareme_id_redevance_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.redevance_bareme_id_redevance_seq OWNED BY public.redevance_bareme.id_redevance;


--
-- Name: registrecommerce; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrecommerce (
    id integer NOT NULL,
    id_detenteur integer,
    numero_rc text,
    date_enregistrement timestamp(3) without time zone,
    capital_social double precision,
    nis text,
    nif text,
    adresse_legale text
);


ALTER TABLE public.registrecommerce OWNER TO postgres;

--
-- Name: registrecommerce_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrecommerce_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrecommerce_id_seq OWNER TO postgres;

--
-- Name: registrecommerce_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrecommerce_id_seq OWNED BY public.registrecommerce.id;


--
-- Name: statutjuridique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statutjuridique (
    "id_statutJuridique" integer NOT NULL,
    code_statut text NOT NULL,
    statut_fr text NOT NULL,
    statut_ar text NOT NULL
);


ALTER TABLE public.statutjuridique OWNER TO postgres;

--
-- Name: statutjuridique_id_statutJuridique_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."statutjuridique_id_statutJuridique_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."statutjuridique_id_statutJuridique_seq" OWNER TO postgres;

--
-- Name: statutjuridique_id_statutJuridique_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."statutjuridique_id_statutJuridique_seq" OWNED BY public.statutjuridique."id_statutJuridique";


--
-- Name: substance_associee_demande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.substance_associee_demande (
    id_assoc integer NOT NULL,
    id_proc integer NOT NULL,
    id_substance integer NOT NULL,
    priorite public."Enumpriorite" NOT NULL,
    date_ajout timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.substance_associee_demande OWNER TO postgres;

--
-- Name: substance_associee_demande_id_assoc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.substance_associee_demande_id_assoc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.substance_associee_demande_id_assoc_seq OWNER TO postgres;

--
-- Name: substance_associee_demande_id_assoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.substance_associee_demande_id_assoc_seq OWNED BY public.substance_associee_demande.id_assoc;


--
-- Name: substances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.substances (
    id_sub integer NOT NULL,
    "nom_subFR" text NOT NULL,
    "nom_subAR" text NOT NULL,
    categorie_sub text NOT NULL,
    famille_sub text NOT NULL,
    id_redevance integer NOT NULL
);


ALTER TABLE public.substances OWNER TO postgres;

--
-- Name: substances_id_sub_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.substances_id_sub_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.substances_id_sub_seq OWNER TO postgres;

--
-- Name: substances_id_sub_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.substances_id_sub_seq OWNED BY public.substances.id_sub;


--
-- Name: superficiaire_bareme; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.superficiaire_bareme (
    id integer NOT NULL,
    droit_fixe double precision NOT NULL,
    periode_initiale double precision NOT NULL,
    premier_renouv double precision NOT NULL,
    autre_renouv double precision NOT NULL,
    devise text NOT NULL
);


ALTER TABLE public.superficiaire_bareme OWNER TO postgres;

--
-- Name: superficiaire_bareme_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.superficiaire_bareme_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.superficiaire_bareme_id_seq OWNER TO postgres;

--
-- Name: superficiaire_bareme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.superficiaire_bareme_id_seq OWNED BY public.superficiaire_bareme.id;


--
-- Name: transfert_detenteur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfert_detenteur (
    id integer NOT NULL,
    id_transfert integer NOT NULL,
    id_detenteur integer,
    type_detenteur public."EnumTypeDetenteur" NOT NULL,
    role text,
    date_enregistrement timestamp(3) without time zone
);


ALTER TABLE public.transfert_detenteur OWNER TO postgres;

--
-- Name: transfert_detenteur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transfert_detenteur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transfert_detenteur_id_seq OWNER TO postgres;

--
-- Name: transfert_detenteur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transfert_detenteur_id_seq OWNED BY public.transfert_detenteur.id;


--
-- Name: typepaiement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typepaiement (
    id integer NOT NULL,
    libelle text NOT NULL,
    frequence text NOT NULL,
    details_calcul text
);


ALTER TABLE public.typepaiement OWNER TO postgres;

--
-- Name: typepaiement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.typepaiement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.typepaiement_id_seq OWNER TO postgres;

--
-- Name: typepaiement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.typepaiement_id_seq OWNED BY public.typepaiement.id;


--
-- Name: typepermis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typepermis (
    id integer NOT NULL,
    id_taxe integer NOT NULL,
    lib_type text NOT NULL,
    code_type text NOT NULL,
    regime text NOT NULL,
    duree_initiale double precision NOT NULL,
    nbr_renouv_max integer NOT NULL,
    duree_renouv double precision NOT NULL,
    delai_renouv integer NOT NULL,
    superficie_max double precision
);


ALTER TABLE public.typepermis OWNER TO postgres;

--
-- Name: typepermis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.typepermis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.typepermis_id_seq OWNER TO postgres;

--
-- Name: typepermis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.typepermis_id_seq OWNED BY public.typepermis.id;


--
-- Name: typeprocedure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeprocedure (
    id integer NOT NULL,
    libelle text,
    description text
);


ALTER TABLE public.typeprocedure OWNER TO postgres;

--
-- Name: typeprocedure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.typeprocedure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.typeprocedure_id_seq OWNER TO postgres;

--
-- Name: typeprocedure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.typeprocedure_id_seq OWNED BY public.typeprocedure.id;


--
-- Name: AncienTypePermis id_ancienType; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AncienTypePermis" ALTER COLUMN "id_ancienType" SET DEFAULT nextval('public."AncienTypePermis_id_ancienType_seq"'::regclass);


--
-- Name: Antenne id_antenne; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Antenne" ALTER COLUMN id_antenne SET DEFAULT nextval('public."Antenne_id_antenne_seq"'::regclass);


--
-- Name: AuditLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog" ALTER COLUMN id SET DEFAULT nextval('public."AuditLog_id_seq"'::regclass);


--
-- Name: ComiteDirection id_comite; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComiteDirection" ALTER COLUMN id_comite SET DEFAULT nextval('public."ComiteDirection_id_comite_seq"'::regclass);


--
-- Name: Commune id_commune; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Commune" ALTER COLUMN id_commune SET DEFAULT nextval('public."Commune_id_commune_seq"'::regclass);


--
-- Name: Conversation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation" ALTER COLUMN id SET DEFAULT nextval('public."Conversation_id_seq"'::regclass);


--
-- Name: Daira id_daira; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Daira" ALTER COLUMN id_daira SET DEFAULT nextval('public."Daira_id_daira_seq"'::regclass);


--
-- Name: DecisionCD id_decision; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DecisionCD" ALTER COLUMN id_decision SET DEFAULT nextval('public."DecisionCD_id_decision_seq"'::regclass);


--
-- Name: Document id_doc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document" ALTER COLUMN id_doc SET DEFAULT nextval('public."Document_id_doc_seq"'::regclass);


--
-- Name: DossierAdministratif id_dossier; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierAdministratif" ALTER COLUMN id_dossier SET DEFAULT nextval('public."DossierAdministratif_id_dossier_seq"'::regclass);


--
-- Name: Group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group" ALTER COLUMN id SET DEFAULT nextval('public."Group_id_seq"'::regclass);


--
-- Name: InteractionWali id_interaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionWali" ALTER COLUMN id_interaction SET DEFAULT nextval('public."InteractionWali_id_interaction_seq"'::regclass);


--
-- Name: MembresComite id_membre; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembresComite" ALTER COLUMN id_membre SET DEFAULT nextval('public."MembresComite_id_membre_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: Permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission" ALTER COLUMN id SET DEFAULT nextval('public."Permission_id_seq"'::regclass);


--
-- Name: PortalApplication id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplication" ALTER COLUMN id SET DEFAULT nextval('public."PortalApplication_id_seq"'::regclass);


--
-- Name: PortalApplicationDocument id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplicationDocument" ALTER COLUMN id SET DEFAULT nextval('public."PortalApplicationDocument_id_seq"'::regclass);


--
-- Name: PortalCompany id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalCompany" ALTER COLUMN id SET DEFAULT nextval('public."PortalCompany_id_seq"'::regclass);


--
-- Name: PortalDocumentDefinition id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalDocumentDefinition" ALTER COLUMN id SET DEFAULT nextval('public."PortalDocumentDefinition_id_seq"'::regclass);


--
-- Name: PortalPayment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalPayment" ALTER COLUMN id SET DEFAULT nextval('public."PortalPayment_id_seq"'::regclass);


--
-- Name: PortalPermitType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalPermitType" ALTER COLUMN id SET DEFAULT nextval('public."PortalPermitType_id_seq"'::regclass);


--
-- Name: PortalRepresentative id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalRepresentative" ALTER COLUMN id SET DEFAULT nextval('public."PortalRepresentative_id_seq"'::regclass);


--
-- Name: PortalShareholder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalShareholder" ALTER COLUMN id SET DEFAULT nextval('public."PortalShareholder_id_seq"'::regclass);


--
-- Name: PortalTypeDocument id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalTypeDocument" ALTER COLUMN id SET DEFAULT nextval('public."PortalTypeDocument_id_seq"'::regclass);


--
-- Name: ProcedureCoord id_procedureCoord; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureCoord" ALTER COLUMN "id_procedureCoord" SET DEFAULT nextval('public."ProcedureCoord_id_procedureCoord_seq"'::regclass);


--
-- Name: ProcedureRenouvellement id_renouvellement; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureRenouvellement" ALTER COLUMN id_renouvellement SET DEFAULT nextval('public."ProcedureRenouvellement_id_renouvellement_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: SeanceCDPrevue id_seance; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SeanceCDPrevue" ALTER COLUMN id_seance SET DEFAULT nextval('public."SeanceCDPrevue_id_seance_seq"'::regclass);


--
-- Name: Session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);


--
-- Name: StatutPermis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StatutPermis" ALTER COLUMN id SET DEFAULT nextval('public."StatutPermis_id_seq"'::regclass);


--
-- Name: TsPaiement id_tsPaiement; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TsPaiement" ALTER COLUMN "id_tsPaiement" SET DEFAULT nextval('public."TsPaiement_id_tsPaiement_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Wilaya id_wilaya; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilaya" ALTER COLUMN id_wilaya SET DEFAULT nextval('public."Wilaya_id_wilaya_seq"'::regclass);


--
-- Name: barem_produit_droit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barem_produit_droit ALTER COLUMN id SET DEFAULT nextval('public.barem_produit_droit_id_seq'::regclass);


--
-- Name: cahiercharge id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cahiercharge ALTER COLUMN id SET DEFAULT nextval('public.cahiercharge_id_seq'::regclass);


--
-- Name: codeAssimilation id_code; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."codeAssimilation" ALTER COLUMN id_code SET DEFAULT nextval('public."codeAssimilation_id_code_seq"'::regclass);


--
-- Name: coordonnee id_coordonnees; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordonnee ALTER COLUMN id_coordonnees SET DEFAULT nextval('public.coordonnee_id_coordonnees_seq'::regclass);


--
-- Name: demAnnulation id_annulation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demAnnulation" ALTER COLUMN id_annulation SET DEFAULT nextval('public."demAnnulation_id_annulation_seq"'::regclass);


--
-- Name: demCession id_cession; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demCession" ALTER COLUMN id_cession SET DEFAULT nextval('public."demCession_id_cession_seq"'::regclass);


--
-- Name: demFermeture id_fermeture; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFermeture" ALTER COLUMN id_fermeture SET DEFAULT nextval('public."demFermeture_id_fermeture_seq"'::regclass);


--
-- Name: demFusion id_fusion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFusion" ALTER COLUMN id_fusion SET DEFAULT nextval('public."demFusion_id_fusion_seq"'::regclass);


--
-- Name: demModification id_modification; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demModification" ALTER COLUMN id_modification SET DEFAULT nextval('public."demModification_id_modification_seq"'::regclass);


--
-- Name: demRenonciation id_renonciation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demRenonciation" ALTER COLUMN id_renonciation SET DEFAULT nextval('public."demRenonciation_id_renonciation_seq"'::regclass);


--
-- Name: demSubstitution id_substitution; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demSubstitution" ALTER COLUMN id_substitution SET DEFAULT nextval('public."demSubstitution_id_substitution_seq"'::regclass);


--
-- Name: demTransfert id_transfert; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demTransfert" ALTER COLUMN id_transfert SET DEFAULT nextval('public."demTransfert_id_transfert_seq"'::regclass);


--
-- Name: demande id_demande; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande ALTER COLUMN id_demande SET DEFAULT nextval('public.demande_id_demande_seq'::regclass);


--
-- Name: demandeMin id_demMin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeMin" ALTER COLUMN "id_demMin" SET DEFAULT nextval('public."demandeMin_id_demMin_seq"'::regclass);


--
-- Name: demandeObs id_demandeObs; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeObs" ALTER COLUMN "id_demandeObs" SET DEFAULT nextval('public."demandeObs_id_demandeObs_seq"'::regclass);


--
-- Name: demandeVerificationGeo id_demVerif; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeVerificationGeo" ALTER COLUMN "id_demVerif" SET DEFAULT nextval('public."demandeVerificationGeo_id_demVerif_seq"'::regclass);


--
-- Name: detenteurmorale id_detenteur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detenteurmorale ALTER COLUMN id_detenteur SET DEFAULT nextval('public.detenteurmorale_id_detenteur_seq'::regclass);


--
-- Name: dossier_fournis id_dossierFournis; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_fournis ALTER COLUMN "id_dossierFournis" SET DEFAULT nextval('public."dossier_fournis_id_dossierFournis_seq"'::regclass);


--
-- Name: etape_proc id_etape; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etape_proc ALTER COLUMN id_etape SET DEFAULT nextval('public.etape_proc_id_etape_seq'::regclass);


--
-- Name: expertminier id_expert; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expertminier ALTER COLUMN id_expert SET DEFAULT nextval('public.expertminier_id_expert_seq'::regclass);


--
-- Name: inscription_provisoire id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription_provisoire ALTER COLUMN id SET DEFAULT nextval('public.inscription_provisoire_id_seq'::regclass);


--
-- Name: nationalite id_nationalite; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nationalite ALTER COLUMN id_nationalite SET DEFAULT nextval('public.nationalite_id_nationalite_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: obligationfiscale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obligationfiscale ALTER COLUMN id SET DEFAULT nextval('public.obligationfiscale_id_seq'::regclass);


--
-- Name: paiement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement ALTER COLUMN id SET DEFAULT nextval('public.paiement_id_seq'::regclass);


--
-- Name: pays id_pays; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pays ALTER COLUMN id_pays SET DEFAULT nextval('public.pays_id_pays_seq'::regclass);


--
-- Name: permis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis ALTER COLUMN id SET DEFAULT nextval('public.permis_id_seq'::regclass);


--
-- Name: permis_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis_templates ALTER COLUMN id SET DEFAULT nextval('public.permis_templates_id_seq'::regclass);


--
-- Name: personnephysique id_personne; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnephysique ALTER COLUMN id_personne SET DEFAULT nextval('public.personnephysique_id_personne_seq'::regclass);


--
-- Name: phase id_phase; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phase ALTER COLUMN id_phase SET DEFAULT nextval('public.phase_id_phase_seq'::regclass);


--
-- Name: procedure id_proc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure ALTER COLUMN id_proc SET DEFAULT nextval('public.procedure_id_proc_seq'::regclass);


--
-- Name: rapport_activite id_rapport; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rapport_activite ALTER COLUMN id_rapport SET DEFAULT nextval('public.rapport_activite_id_rapport_seq'::regclass);


--
-- Name: redevance_bareme id_redevance; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redevance_bareme ALTER COLUMN id_redevance SET DEFAULT nextval('public.redevance_bareme_id_redevance_seq'::regclass);


--
-- Name: registrecommerce id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrecommerce ALTER COLUMN id SET DEFAULT nextval('public.registrecommerce_id_seq'::regclass);


--
-- Name: statutjuridique id_statutJuridique; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statutjuridique ALTER COLUMN "id_statutJuridique" SET DEFAULT nextval('public."statutjuridique_id_statutJuridique_seq"'::regclass);


--
-- Name: substance_associee_demande id_assoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substance_associee_demande ALTER COLUMN id_assoc SET DEFAULT nextval('public.substance_associee_demande_id_assoc_seq'::regclass);


--
-- Name: substances id_sub; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances ALTER COLUMN id_sub SET DEFAULT nextval('public.substances_id_sub_seq'::regclass);


--
-- Name: superficiaire_bareme id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superficiaire_bareme ALTER COLUMN id SET DEFAULT nextval('public.superficiaire_bareme_id_seq'::regclass);


--
-- Name: transfert_detenteur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfert_detenteur ALTER COLUMN id SET DEFAULT nextval('public.transfert_detenteur_id_seq'::regclass);


--
-- Name: typepaiement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typepaiement ALTER COLUMN id SET DEFAULT nextval('public.typepaiement_id_seq'::regclass);


--
-- Name: typepermis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typepermis ALTER COLUMN id SET DEFAULT nextval('public.typepermis_id_seq'::regclass);


--
-- Name: typeprocedure id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typeprocedure ALTER COLUMN id SET DEFAULT nextval('public.typeprocedure_id_seq'::regclass);


--
-- Data for Name: AncienTypePermis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AncienTypePermis" ("id_ancienType", lib_type, code_type) FROM stdin;
\.


--
-- Data for Name: Antenne; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Antenne" (id_antenne, nom, localisation) FROM stdin;
1	Antenne Batna	
2	Antenne Chlef	
3	Antenne Oran	
4	Antenne Setif	
5	Antenne Blida	
6	Antenne BBA	
7	Antenne Constantine	
8	Antenne Mila	
9	Antenne Boumerdes	
10	Antenne Djelfa	
11	Antenne Oum El Bouaghi	
12	Antenne Tiaret	
13	Antenne Djanet	
14	Antenne Guelma	
15	Antenne Saida	
16	Antenne Tebessa	
17	Antenne Bechar	
18	Antenne Ouargla	
19	Antenne Tlemcen	
20	Antenne Tamanrasset	
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, action, "entityType", "entityId", "userId", "timestamp", changes, "ipAddress", "userAgent", status, "errorMessage", "additionalData", "previousState", "contextId", "sessionId") FROM stdin;
\.


--
-- Data for Name: ComiteDirection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ComiteDirection" (id_comite, id_seance, date_comite, resume_reunion, fiche_technique, carte_projettee, rapport_police) FROM stdin;
\.


--
-- Data for Name: Commune; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Commune" (id_commune, id_daira, "nom_communeFR", "nom_communeAR", nature) FROM stdin;
1	1	KANOUA	قنواع	COMMUNE-COTIERE
2	2	CHERAIA	الشرايع	COMMUNE-COTIERE
3	\N	HAMADI KROUMA	حمادى كرومة	COMMUNE-COTIERE
4	3	CHETAIBI	شطايبى	ILE
5	3	CHETAIBI	شطايبى	ILE
6	3	CHETAIBI	شطايبى	COMMUNE-COTIERE
7	4	OULED ATTIA	اولاد عطية	COMMUNE-COTIERE
8	2	COLLO	القل	COMMUNE-COTIERE
9	5	OUED EL ANEB	وادى العنب	COMMUNE-COTIERE
10	\N	KHENG MAYOUM	خندق مايون	COMMUNE-COTIERE
11	1	ZITOUNA	الزيتونة	COMMUNE
12	7	SERAIDI	سرايدى	COMMUNE-COTIERE
13	5	TREAT	التريعات	COMMUNE
14	8	BEN AZZOUZ	بن عزوز	COMMUNE-COTIERE
15	\N	KERKERA	كركرة	COMMUNE-COTIERE
16	7	ANNABA	عنابة	CHEF-LIEU-WILAYA
17	2	BENI ZID	بنى زيد	COMMUNE
18	9	AIN ZOUIT	عين زويت	COMMUNE-COTIERE
19	10	TAMALOUS	تمالوس	ILE
20	4	OUED ZHOUR	وادى الزهور	COMMUNE-COTIERE
21	9	AIN ZOUIT	عين زويت	ILE
22	9	AIN ZOUIT	عين زويت	ILE
23	11	EL KALA	القالة	COMMUNE-COTIERE
24	10	TAMALOUS	تمالوس	COMMUNE-COTIERE
25	12	DJENDEL SAADI MOHAMED	جندل السعدى محمد	COMMUNE-COTIERE
26	11	SOUAREKH	السوارخ	COMMUNE-COTIERE
27	9	AIN ZOUIT	عين زويت	ILE
28	13	EL MILIA	الميلية	COMMUNE-COTIERE
29	14	DELLYS	دلس	COMMUNE-COTIERE
30	\N	FIL FILA	فلفلة	COMMUNE-COTIERE
31	15	SKIKDA	سكيكدة	CHEF-LIEU-WILAYA
32	16	SIDI DAOUD	سيدى داود	COMMUNE-COTIERE
33	17	BERRIHANE	بالريحان	COMMUNE-COTIERE
34	\N	KIMIR OUED ADJOUL	الكنار نوشفى	COMMUNE-COTIERE
35	14	AFIR	أعفير	COMMUNE-COTIERE
36	18	DJINET	جينات	COMMUNE-COTIERE
37	\N	BENI KSILA	بنى كسيلة	COMMUNE-COTIERE
38	19	AIN KECHRA	عين القشرة	COMMUNE
39	\N	BENI KSILA	بنى كسيلة	ILE
40	20	EL BOUNI	البونى	COMMUNE-COTIERE
41	\N	BIR EL OUIDEN	بين اليدان	COMMUNE
42	\N	BOUCHTATA	بوشطاطة	COMMUNE
43	21	TOUDJA	توجة	COMMUNE-COTIERE
44	\N	BERRAHEL	برحال	COMMUNE
45	\N	OULDJA BOULBELLOUT	ولجة بو البلوط	COMMUNE
46	14	BEN CHOUD	بن شود	COMMUNE
47	22	SIDI ABDELAZIZ	سيدى عبد العزيز	COMMUNE-COTIERE
48	23	EL MARSA	المرسى	COMMUNE
49	9	EL HADAIEK	الحدائق	COMMUNE
50	25	EL ANCER	العنصر	COMMUNE
51	11	EL AIOUN	العيون	COMMUNE
52	11	RAML SOUK	رمل السوق	COMMUNE
53	6	AIN EL ASSEL	عين العسل	COMMUNE
54	17	ECHATT	الشطية	COMMUNE-COTIERE
55	26	BOUTELDJA	بوثلجة	COMMUNE
56	\N	BEN MHIDI	بن مهيدى	COMMUNE-COTIERE
57	25	DJEMAA BENI HABIBI	جمعة بنى حبيبى	COMMUNE
58	16	BAGHLIA	بغلية	COMMUNE
59	27	OULED AISSA	أولاد عيسى	COMMUNE
60	22	EL KENNAR NOUCHFI	الكنار نوشفى	COMMUNE-COTIERE
61	\N	LAGHATA	لقاطة	COMMUNE-COTIERE
62	\N	BENI BACHIR	بنى بشير	COMMUNE
63	\N	SIDI AMER	سيدى عمار	COMMUNE
64	29	BEJAIA	بجاية	CHEF-LIEU-WILAYA
65	6	El TARF	الطارف	CHEF-LIEU-WILAYA
66	30	JIJEL	جيجل	CHEF-LIEU-WILAYA
67	12	AZZABA	عزابة	COMMUNE
68	31	TAHER	الطاهير	COMMUNE-COTIERE
69	32	EL HADJAR	الحجار	COMMUNE
70	22	CHEKFA	الشقفة	COMMUNE
71	29	BEJAIA	بجاية	ILE
72	18	ZEMMOURI	زمورى	COMMUNE-COTIERE
73	18	BORDJ MENAIEL	برج منايل	COMMUNE
74	16	TAOURGA	تورقة	COMMUNE
75	31	EMIR ABDELKADER	الامير عبد القادر	COMMUNE-COTIERE
76	26	LAC DES OISEAUX	بحيرة الطيور	COMMUNE
77	34	RAMDANE DJAMEL	رمضان جمال	COMMUNE
78	35	EL AOUANA	العوانة	COMMUNE-COTIERE
79	36	KAOUS	قاوس	COMMUNE
80	37	ADEKAR	أدكار	COMMUNE
81	\N	EULMA	العلمة	COMMUNE
82	38	THENIA	الثنية	COMMUNE-COTIERE
83	8	BEKKOUCHE LAKHDAR	بكوش الاخضر	COMMUNE
84	\N	BORDJ TAHER	برج الطهر	COMMUNE
85	\N	AIN CHERCHAR	عين شرشار	COMMUNE
86	39	CHEURFA	الشرفاء	COMMUNE
87	21	EL KSEUR	القصر	COMMUNE
88	40	SIDI MEZGHICHE	سيدى مزغيش	COMMUNE
89	27	NACIRIA	الناصرية	COMMUNE
90	\N	TAOURIRT IGHIL	تاوريرت ايغيل	COMMUNE
91	41	BESBES	البسباس	COMMUNE
92	43	BOUDOUAOU EL BAHRI	بودواو البحرى	COMMUNE-COTIERE
93	\N	CHBAITA MOKHTAR	شبايطة مختار	COMMUNE
94	44	BOUMERDES	بومرداس	CHEF-LIEU-WILAYA
95	\N	EMDJEZ EDCHICH	مجاز الدشيش	COMMUNE
96	45	OUM TOUB	الطوب	COMMUNE
97	44	CORSO	قورصو	COMMUNE-COTIERE
98	6	BOUGOUS	بوقوس	COMMUNE
99	46	SI MUSTAPHA	سى مصطفى	COMMUNE
100	44	TIDJELABINE	تيجلبين	COMMUNE
101	47	SETTARA	السطارة	COMMUNE
102	26	CHEFIA	الشافية	COMMUNE
103	41	ZERIZER	زريزر	COMMUNE
104	43	BOUDOUAOU	بودواو	COMMUNE
105	29	OUED GHIR	وادى غير	COMMUNE
106	36	TEXENNA	تاكسنة	COMMUNE
107	48	SALAH BOUCHAOUR	صالح بو الشعور	COMMUNE
108	25	BOURAOUI BELHADEF	بوراوى بلهادف	COMMUNE
109	\N	OULED YAHIA KHADROUCHE	اولاد يحى خدوش	COMMUNE
110	\N	AIN BERDA	العين الباردة	COMMUNE
111	31	OUDJANA	وجانة	COMMUNE
112	46	ISSER	يسر	COMMUNE
113	49	TALA HAMZA	ثالة حمزة	COMMUNE
114	1	ZITOUNA	الزيتونة	COMMUNE
115	\N	BOUSSIF OULED AKSEUR	بوسيف اولاد عسكر	COMMUNE
116	31	CHAHNA	الشحنة	COMMUNE
117	\N	OULED HADJADJ	اولاد هداج	COMMUNE
118	50	DREAN	الدرعان	COMMUNE
119	51	HAMMEDI	حمادى	COMMUNE
120	41	ASFOUR	عصفور	COMMUNE
121	51	OULED MOUSSA	أولاد موسى	COMMUNE
122	40	BENI OULBANE	بنى ولبان	COMMUNE
123	38	SOUK EL HAD	سوق الحد	COMMUNE
124	49	BOUKHELIFA	بوخليفة	COMMUNE-COTIERE
125	\N	ZIAMA MANSOURIA	زيامة منصورية	COMMUNE-COTIERE
126	51	KHEMIS EL KHECHNA	خميس الخشنة	COMMUNE
127	12	ES SEBT	السبت	COMMUNE
128	\N	SELMA BEN ZIADA	سلمى بن زيادة	COMMUNE
129	12	EL GHEDIR	الغدير	COMMUNE
130	\N	IFELAIN ILMATHEN	أفناين ألماتن	COMMUNE
131	53	DOUAOUDA	دواودة	COMMUNE-COTIERE
132	54	AKFADOU	أكفادو	COMMUNE
133	55	AMIZOUR	أميزور	COMMUNE
134	56	TIFRA	تيفرة	COMMUNE
135	43	BOUZEGZA KEDDARA	بوزقزة قدارة	COMMUNE
136	57	TIMEZRIT	تمزريت	COMMUNE
137	38	BENI AMRANE	بنى عمران	COMMUNE
138	50	CHIHANI	شيحانى	COMMUNE
139	\N	CHEBBALA MILAT	غبالة ميلاط	COMMUNE
140	46	CHABET EL AMEUR	شعبة العامر	COMMUNE
141	\N	ZIAMA MANSOURIA	زيامة منصورية	ILE
142	53	FOUKA	فوكة	COMMUNE-COTIERE
143	\N	SIDI MAAROUF	سيدى معروف	COMMUNE
144	\N	TICHI	تيشى	COMMUNE-COTIERE
145	\N	EL HARROUCH	الحروش	COMMUNE
146	58	NECHMAYA	نشماية	COMMUNE
147	43	EL KHARROUBA	الخروبة	COMMUNE
148	51	LARBATACHE	الاربعطاش	COMMUNE
149	59	BOU ISMAIL	بواسماعيل	COMMUNE-COTIERE
150	60	BOUATI MAHMOUD	بوعاطى محمود	COMMUNE
151	61	OULED RABAH	ولاد رابح	COMMUNE
152	62	AIN BEN BEIDA	عين بن بيضاء	COMMUNE
153	63	KOLEA	القليعة	COMMUNE
154	64	ROKNIA	الركنية	COMMUNE
155	65	MELBOU	ملبو	COMMUNE-COTIERE
156	40	AIN BOUZIANE	عين بوزيان	COMMUNE
157	56	TINEBDAR	تينبدار	COMMUNE
165	\N			
166	48	ZERDEZAS	زردازة	COMMUNE
167	\N	TIZI NBERBER	تيزى نبربر	COMMUNE
168	66	KHEMISTI	خميستى	COMMUNE-COTIERE
169	\N	CHERCHEL	شرشال	COMMUNE-COTIERE
170	\N	BOUHAROUN	بوهارون	COMMUNE-COTIERE
171	54	CHEMINI	الشمينى	COMMUNE
172	\N	BOUDRIA BENI YADJIS	بودريعة بنى يجيس	COMMUNE
173	54	TIBANE	تيبان	COMMUNE
174	67	AIN KERMA	عين الكرمة	COMMUNE
175	56	SIDI AYAD	سيدى عياد	COMMUNE
176	69	NADOR	الناظور	COMMUNE
177	\N	DJMILA	جيملة	COMMUNE
178	70	ZIGHOUD YOUCEF	زيغود يوسف	COMMUNE
179	71	HAMALA	حمالة	COMMUNE
180	54	SOUK OUFELLA	السوق أوفلة	COMMUNE
181	\N	ERRAGUENE	الراقن	COMMUNE
182	56	LEFLAYE	الفلاى	COMMUNE
183	72	BARBACHA	برباشة	COMMUNE
184	\N	TASSALA LEMTAI	تسالة لمطاعى	COMMUNE
185	73	CHERAGA	الشيقارة	COMMUNE
186	74	AMIRA ARRES	اعميرة اراس	COMMUNE
187	59	AIN TAGOURAIT	عين تاقورايت	COMMUNE-COTIERE
188	68	HAMMAM BENI SALAH	حمام بنى صالح	COMMUNE
189	\N	OUED FRAGHA	وادى الفراغة	COMMUNE
190	\N	HATTATBA	الحطاطبة	COMMUNE
191	65	TAMRIDJET	تامريجت	COMMUNE
192	\N	TERRAI BAINEM	ترعى باينان	COMMUNE
193	72	KENDIRA	كنديرة	COMMUNE
194	75	DARGUINA	درقينة	COMMUNE
195	\N	FERRAOUN	فرعون	COMMUNE
196	\N	SIDI SAID	سيدى السعيد	COMMUNE
197	76	BABOR	بابور	COMMUNE
198	77	SIDI GHILES	سيدى غيلاس	COMMUNE-COTIERE
199	60	HELIOPOLIS	هيليوبوليس	COMMUNE
200	75	TASKRIOUT	تاسكريوت	COMMUNE
201	55	BENI DJELLIL	بنى جليل	COMMUNE
202	78	OUZELLAGUEN	أوزلاقن	COMMUNE
203	79	SIDI AMAR	سيدي عمار	COMMUNE
204	68	BOUHADJAR	بوحجار	COMMUNE
205	\N	AIT SMAIL	آيت اسماعيل	COMMUNE
206	\N	BENI HAMIDENE	بنى حميدان	COMMUNE
207	69	MENACEUR	مناصر	COMMUNE
208	\N	GUELAAT BOUSBAA	قلعة بوصبع	COMMUNE
209	80	SIDI RACHED	سيدى راشد	COMMUNE
210	81	GOURAYA	قوراية	COMMUNE-COTIERE
211	\N	HADJERET ENNOUS	حجرة النص	COMMUNE-COTIERE
212	71	GRAREM GOUGA	القرارم قوقة	COMMUNE
213	82	SEDDOUK	صدوق	COMMUNE
214	\N	AIT TIZI	ايت تيزى	COMMUNE
215	\N	MZADA	ايت نوال مزادة	COMMUNE
216	83	LARHAT	لرهاط	COMMUNE-COTIERE
217	60	EL FEDJOUDJ	الفجوج	COMMUNE
218	81	MESSELMOUN	مسلمون	COMMUNE-COTIERE
219	84	TASSADANE HADDADA	تاسدان حدادة	COMMUNE
220	84	MINAR ZARZA	مينار زارزة	COMMUNE
221	\N	OULED HEBABA	اولاد حبابة	COMMUNE
222	85	HADJOUT	حجوط	COMMUNE
223	62	BOUCHEGOUF	بوشقوف	COMMUNE
224	83	DAMOUS	الداموس	COMMUNE-COTIERE
225	\N	AIN SEBT	عين السبت	COMMUNE
226	86	BENI HAOUA	بنى حواء	COMMUNE-COTIERE
227	58	DJEBALLAH KHEMISSI	جبالة الخميسى	COMMUNE
228	87	TENES	تنس	COMMUNE-COTIERE
229	\N	SERDJ EL GHOUL	سرج الغول	COMMUNE
230	80	AHMER EL AIN	أحمر العين	COMMUNE
231	\N	CHELATA	شلاطة	COMMUNE
232	\N	BENI MAOUCHE	بنى معوش	COMMUNE
233	\N	OUED GHOUSSINE	أولاد غوسين	COMMUNE-COTIERE
234	81	AGHBAL	اغبال	COMMUNE
235	80	BOURKIKA	بورقيقة	COMMUNE
236	88	SIDI MEROUANE	سيدى مروان	COMMUNE
237	77	SIDI SEMIANE	سيدى سميان	COMMUNE
238	89	OUED EL BARED	واد البارد	COMMUNE
239	\N	BENI MOUHLI	بنى موحلى	COMMUNE
240	58	BELKHEIR	بلخير	COMMUNE
241	90	BOUANDAS	بوعنداس	COMMUNE
242	64	HAMMAM DEBAGH	حمام دباغ	COMMUNE
243	91	KHERRATA	خراطة	COMMUNE
244	58	BENI MEZLINE	بنى مزلين	COMMUNE
245	92	MEDJEZ AMAR	مجاز عمار	COMMUNE
246	93	IGHRAM	ايغرم	COMMUNE
247	\N	BENI AZIZ	بنى عزيز	COMMUNE
248	90	BOUSSELAM	بوسلام	COMMUNE
249	\N	MEURAD	مراد	COMMUNE
250	\N	BOUHAMDANE	بوحمدان	COMMUNE
251	94	ZEGHAIA	زغاية	COMMUNE
252	95	ROUACHED	راشدى	COMMUNE
253	\N	DRAA EL KAID	دراع القايد	COMMUNE
254	87	SIDI ABDERRAHMANE	سيدى عبد الرحمان	COMMUNE-COTIERE
255	93	AKBOU	أقبو	COMMUNE
256	82	AMALOU	أمالو	COMMUNE
257	97	DIDOUCHE MOURAD	ديدوش مراد	COMMUNE
258	\N	DEUX BASSINS	الحوضان	COMMUNE
259	\N	MESAOUD BOUDJERIOU	مسعود بوجريو	COMMUNE
260	98	MILA	ميلة	CHEF-LIEU-WILAYA
261	62	MEDJEZ SFA	مجاز الصفاء	COMMUNE
262	86	BREIRA	بريره	COMMUNE
263	94	OUED ENDJA	وادى النجاء	COMMUNE
264	99	BENI CHEBANA	بنى شبانة	COMMUNE
265	100	AISSAOUIA	العيساوية	COMMUNE
266	68	OUED ZITOUN	وادى الزيتون	COMMUNE
267	\N	TALA IFACENE	تلة ايفاسن	COMMUNE
268	101	GUELMA	قالمة	CHEF-LIEU-WILAYA
269	87	SIDI AKKACHA	سيدى عكاشة	COMMUNE
270	102	EL AYADI BARBES	العياضى برباس	COMMUNE
271	\N	BENI MILLEUK	بنى مليك	COMMUNE
272	\N	BENI MELIKECH	بنى مليكش	COMMUNE
273	103	BORDJ SABATH	برج الصباط	COMMUNE
274	82	BOUHAMZA	بوحمزة	COMMUNE
275	\N	BENI OUARTILANE	بنى ورتيلان	COMMUNE
276	58	BOUMAHRA AHMED	بومهرة أحمد	COMMUNE
277	104	ZEBOUDJA	الزبوجة	COMMUNE
278	\N	TIZI NBECHAR	تيزى نبشار	COMMUNE
279	97	HAMMA BOUZIANE	حامة بوزيان	COMMUNE
280	100	TABLAT	تابلاط	COMMUNE
281	105	FERDJIOUA	فرجيوة	COMMUNE
282	\N	MECHROHA	المشروحة	COMMUNE
283	\N	ABOU EL HASSEN	أبو لحسن	COMMUNE
284	23	EL MARSA	المرسى	COMMUNE-COTIERE
285	\N	DRAA KEBILA	ذراع قبيلة	COMMUNE
286	106	AIN ZANA	عين الزانة	COMMUNE
287	107	TALASSA	تلاسة	COMMUNE
288	\N	HOUARI BOUMEDIENE	هوارى بومدين	COMMUNE
289	\N	AIN LAGRADJ	عين لقراج	COMMUNE
290	108	MIHOUB	ميهوب	COMMUNE
291	\N	TACHTA ZEGARRA	تاشة زوقاغة	COMMUNE
292	106	OULED DRISS	أولاد ادريس	COMMUNE
293	109	BEN BADIS	بن باديس	COMMUNE
294	98	AIN TINE	عين التين	COMMUNE
295	111	CONSTANTINE	قسنطينة	CHEF-LIEU-WILAYA
296	\N	BENDJERRAH	بن جراح	COMMUNE
297	112	ARIB	عريب	COMMUNE
298	\N	MAOUKLANE	ماوكلان	COMMUNE
299	108	MAGHRAOUA	مغراوة	COMMUNE
300	113	OULED MOUMEN	اولاد مومن	COMMUNE
301	114	MAAOUIA	معاوية	COMMUNE
302	104	BENAIRIA	بن عرية	COMMUNE
303	\N	AIN BOUYAHIA	عين بويحى	COMMUNE
304	115	DEHAMCHA	الدهامشة	COMMUNE
305	116	BAATA	بعطة	COMMUNE
306	102	AIN BEIDA HARRICHE	عين البيضاء أحريس	COMMUNE
307	95	TIBERGUENT	تيبرقنت	COMMUNE
308	89	AMOUCHA	عموشة	COMMUNE
309	\N	YAHIA BENI GUECHA	يحى بنى قشة	COMMUNE
310	117	BEN ALLAL	بن علال	COMMUNE
311	\N	EL AMRA	العامرة	COMMUNE
312	118	AIT R'ZINE	آيت رزين	COMMUNE
313	119	TAZMALT	تازمالت	COMMUNE
314	112	MEKHATRIA	المخاطرية	COMMUNE
315	93	TAMOKRA	تاموقرة	COMMUNE
316	120	IBN ZIAD	ابن زياد	COMMUNE
317	121	EL MAIN	الماين	COMMUNE
318	115	AIN EL KEBIRA	عين الكبيرة	COMMUNE
319	\N	HAMMAM RIGHA	حمام ريغة	COMMUNE
320	104	BOUZEGHAIA	بوزغاية	COMMUNE
321	122	DJEMILA	جميلة	COMMUNE
322	\N	HAMMAM NBAIL	حمام النبايل	COMMUNE
323	123	OUED CHEHAM	وادى الشحم	COMMUNE
324	\N	AHMED RACHDI	أحمد راشدى	COMMUNE
325	124	EL KHROUB	الخروب	COMMUNE
326	\N	AIN TORKI	عين التركى	COMMUNE
327	107	TADJENA	تاجنة	COMMUNE
328	125	BOUMEDFAA	بومدفع	COMMUNE
329	\N	SELIAOUA ANNOUNA	سلاوة عنونة	COMMUNE
330	92	RAS EL AGBA	رأس العقبة	COMMUNE
331	126	EL HAMDANIA	الحمدانية	COMMUNE
332	127	HAMMAM GUERGOUR	حمام قرقور	COMMUNE
333	\N	KHEZARA	خزارة	COMMUNE
334	23	MOUSSADEK	مصدق	COMMUNE
335	\N	AIN ROUA	عين الروى	COMMUNE
336	119	BOUDJELLIL	بوجليل	COMMUNE
337	128	HARBIL	حريبل	COMMUNE
338	129	AIN ABESSA	عين عباسة	COMMUNE
339	98	SIDI KHELIFA	سيدى خليفة	COMMUNE
340	\N	MEZRENNA	مزغنة	COMMUNE
341	130	BOUGAA	بوقاعة	COMMUNE
342	\N	GUENZET TASSAMEURT	قنزات	COMMUNE
343	116	EL OMARIA	العمارية	COMMUNE
344	131	BOUHATEM	بوحاتم	COMMUNE
345	132	TAMESGUIDA	تامسقيدة	COMMUNE
346	103	OUED ZENATI	وادى الزناتى	COMMUNE
347	123	DAHOUARA	الدهوارة	COMMUNE
348	73	AIN BENIAN	عين البنيان	COMMUNE
349	\N	TAOUGRITE	تاوغريت	COMMUNE
350	124	AIN SMARA	عين سمارة	COMMUNE
351	121	DJAAFRA	جعافرة	COMMUNE
352	\N	IGHIL ALI	ايغيل على	COMMUNE
353	115	OULED ADDOUANE	اولاد عدوان	COMMUNE
354	133	AIN LARBI	عين العربى	COMMUNE
355	\N	DERRADJI BOUSSELAH	دراجى بوصلاح	COMMUNE
356	134	DAHRA	البحرة	COMMUNE-COTIERE
357	110	AIN ABID	عين عبيد	COMMUNE
358	\N	AIN REGGADA	عين رقادة	COMMUNE
359	\N	OUED ATHMANIA	وادى العثمانية	COMMUNE
360	135	BENI RACHED	بنى راشد	COMMUNE
361	136	BOUCHRAHIL	بوشراحيل	COMMUNE
362	108	EL AZIZIA	العزيزية	COMMUNE
363	137	OUILLEN	ويلان	COMMUNE
364	113	KHEDARA	الخضارة	COMMUNE
365	117	MILIANA	مليانة	COMMUNE
366	136	SIDI NAAMANE	سيدى نعمان	COMMUNE
367	138	AIN MELLOUK	عين الملوك	COMMUNE
368	\N	EL HOCEINIA	الحسينية	COMMUNE
369	\N	BOUHACHANA	بوحشانة	COMMUNE
370	122	BENI FOUDA	بنى فودة	COMMUNE
371	132	MEDEA	المدية	CHEF-LIEU-WILAYA
372	\N	TAFREG	تفرق	COMMUNE
373	139	OULED BOUGHALEM	أولاد بوغالم	COMMUNE-COTIERE
374	\N	EL ABBADIA	العبادية	COMMUNE
375	140	OULED FARES	أولاد فارس	COMMUNE
376	\N	LABIODH MEDJADJA	العبيودة مجاجة	COMMUNE
377	129	EL OURICIA	اوريسيا	COMMUNE
378	141	AIN SANDEL	عين الصندل	COMMUNE
379	142	KHELIL	خليل	COMMUNE
380	133	AIN MAKHLOUF	عين مخلوف	COMMUNE
381	\N	TESMART	تسمرت	COMMUNE
382	143	SOUK AHRAS	سوق أهراس	CHEF-LIEU-WILAYA
383	126	OUZERA	وزرة	COMMUNE
384	144	EL GUELBELKEBIR	القلب الكبير	COMMUNE
385	\N	SIDI ERRABIA	سيدى الربيع	COMMUNE
386	145	HERENFA	الحرنفة	COMMUNE
387	139	ACHAACHA	عشعاشة	COMMUNE-COTIERE
388	146	OUAMRI	عوامرى	COMMUNE
389	\N	DRAA ESSMAR	ذراع السمار	COMMUNE
390	\N	BENI OUICINE	بنى وسين	COMMUNE
391	147	DJENDEL	جندل	COMMUNE
392	\N	HANANCHA	الحنانشة	COMMUNE
393	148	TACHOUDA	تاشودة	COMMUNE
394	\N	BORDJ ZEMOURA	برج زمورة	COMMUNE
395	\N	AIN DEFLA	عين الدفلى	CHEF-LIEU-WILAYA
396	148	BELLAA	بلاعة	COMMUNE
397	\N	SIDI LAKHDAR	سيدى الاخضر	COMMUNE
398	121	COLLA	القلة	COMMUNE
399	\N	KHEMIS MILIANA	خميس مليانة	COMMUNE
400	149	AIN SOLTANE	عين السلطان	COMMUNE
401	146	OUED HARBIL	حربيل	COMMUNE
402	139	KHADRA	خضرة	COMMUNE-COTIERE
403	\N	SEDRAIA	سدارية	COMMUNE
404	151	OULED SIDI BRAHIM	أولاد سيدى براهيم	COMMUNE
405	152	BENI SLIMANE	بنى سليمان	COMMUNE
406	153	OULED DAHMANE	أولاد دحمان	COMMUNE
407	154	BENYAHIA ABDERRAHMANE	بن يحى عبد الرحمن	COMMUNE
408	155	ROUINA	روينة	COMMUNE
409	156	ZAAROURIA	الزعرورية	COMMUNE
410	137	MERAHNA	المراهنة	COMMUNE
411	\N	THENIET EL ANSEUR	ثنية النصر	COMMUNE
412	124	OULED RAHMOUN	أولاد رحمون	COMMUNE
413	149	OULED BRAHIM	أولاد ابراهيم	COMMUNE
414	152	BOUSKENE	بوسكن	COMMUNE
415	113	HADDADA	الحدادة	COMMUNE
416	157	OUED SEGUEN	وادى سقان	COMMUNE
417	158	OUM DROU	أم الدرو	COMMUNE
418	\N	EL ATTAF	العطاف	COMMUNE
419	159	OULED SABOR	اولاد صابر	COMMUNE
420	\N	GUELTA ZERGA	القلة الزرقاء	COMMUNE
421	129	AIN ARNAT	عين ارنات	COMMUNE
422	160	DJELIDA	جليدة	COMMUNE
423	158	CHLEF	الشلف	CHEF-LIEU-WILAYA
424	161	SETIF	سطيف	CHEF-LIEU-WILAYA
425	135	OULED ABBES	أولاد عباس	COMMUNE
426	126	TIZI MAHDI	تيزى المهدى	COMMUNE
427	138	CHELGHOUM LAID	شلغوم العيد	COMMUNE
428	160	BOURACHED	بو راشد	COMMUNE
429	135	OUED FODDA	وادى الفداء	COMMUNE
430	126	BEN CHICAO	بن شكاو	COMMUNE
431	\N	SIDI LAKHDAR	سيدى الاخضر	COMMUNE-COTIERE
432	145	AIN MERANE	عين مران	COMMUNE
433	\N	BIR OULED KHELIFA	بئر ولد خليفة	COMMUNE
434	147	OUED CHORFA	وادى الشرفاء	COMMUNE
435	150	SEDRATA	سدراتة	COMMUNE
436	150	KHEMISSA	خميسة	COMMUNE
437	162	HARAZA	حرازة	COMMUNE
438	149	AIN SOLTANE	عين السلطان	COMMUNE
439	\N	BIR BEN ABED	بئر بن عابد 	COMMUNE
440	140	CHETTIA	الشطية	COMMUNE
441	163	MEDJANA	مجانة	COMMUNE
442	\N	SIDI MHAMED BEN ALI	سيدى محمد بن على	COMMUNE
443	139	NEKMARIA	نقمارية	COMMUNE
444	133	TAMLOUKA	تاملوكة	COMMUNE
445	164	TIFFECH	تيفاش	COMMUNE
446	163	HASNAOUA	حسناوة	COMMUNE
447	165	AIN TAGHROUT	عين تاغروت	COMMUNE
448	162	MANSOURA	منصورة	COMMUNE
449	146	HANNACHA	حناشة	COMMUNE
450	166	BERROUAGHIA	البرواقية	COMMUNE
451	167	BOUAICHOUNE	بوعيشون	COMMUNE
452	\N	SIDI EMBAREK	سيدى مبارك	COMMUNE
453	167	SI MAHDJOUB	سي المحجوب	COMMUNE
454	168	MEDIOUNA	مديونة	COMMUNE
455	154	TADJENANET	تاجنانت	COMMUNE
456	169	EL EULMA	العلمة	COMMUNE
457	\N	EL MHIR	المهير	COMMUNE
458	170	TIBERKANINE	تبركانين	COMMUNE
459	136	KHAMS DJOUAMAA	خمس جوامع	COMMUNE
460	\N	OULED DEIDE	أولاد دايد	COMMUNE
461	171	SIGUS	سيقوس	COMMUNE
462	156	TAOURA	تاورة	COMMUNE
463	155	ZEDDINE	زدين	COMMUNE
464	137	SIDI FREDJ	سيدى فرج	COMMUNE
465	172	TAZGAIT	تازغيت	COMMUNE
466	\N	AIN LECHIAKH	عين الاشياخ	COMMUNE
467	\N	RAGGOUBA	الرقوبة	COMMUNE
468	142	BIR KASDALI	بئر قصد على	COMMUNE
469	173	ZOUABI	الزوابى	COMMUNE
470	174	HADJADJ	حجاج	COMMUNE-COTIERE
471	\N	BIR EL ARCH	بئر العرش	COMMUNE
472	175	SOBHA	صبحة	COMMUNE
473	\N	BARBOUCHE	بربوش	COMMUNE
474	176	EL OUELDJA	الولجة	COMMUNE
475	\N	TELAGHMA	تلاغمة	COMMUNE
476	177	OULED HAMLA	أولاد حملة	COMMUNE
477	178	HARCHOUN	الحرشون	COMMUNE
478	179	SOUAGUI	السواقى	COMMUNE
479	129	MEZLOUG	مزلوق	COMMUNE
480	\N	BORDJ EMIR KHALED	برج الامير خالد	COMMUNE
481	179	DJOUAB	جواب	COMMUNE
482	178	EL KARIMIA	الكريمية	COMMUNE
483	180	MAZOUNA	مازونة	COMMUNE
484	156	DREA	درية	COMMUNE
485	159	GUIDJEL	قجال	COMMUNE
486	168	BENI ZENTIS	بنى زنطيس	COMMUNE
487	172	SIDI ALI	سيدى على	COMMUNE
488	171	EL AMIRIA	العامرية	COMMUNE
489	181	KSAR SBAHI	قصر الصبيحى	COMMUNE
490	167	OULED BOUACHRA	اولاد بو عشرة	COMMUNE
491	182	ZOUBIRIA	الزبيرية	COMMUNE
492	160	DJEMAA OULED CHEIKH	جمعة أولاد الشيخ	COMMUNE
493	\N	BAZER SAKRA	بازر سكرة	COMMUNE
494	175	OUED SLY	واد سلي	COMMUNE
495	158	SENDJAS	السنجاس	COMMUNE
496	183	OUED DJEMAA	وادى الجمعة	COMMUNE
497	\N	EL MAYENE	الماين	COMMUNE
498	\N	ABDELMALEK RAMDANE	عبد المالك رمضان	COMMUNE-COTIERE
499	163	EL ACHIR	اليشير	COMMUNE
500	\N	AIN MLILA	عين مليلة	COMMUNE
501	179	SIDI ZAHAR	سيدى زهار	COMMUNE
502	\N	BORDJ BOU ARRERIDJ	برج بوعريريج	CHEF-LIEU-WILAYA
503	\N	EL GUETTAR	القطار	COMMUNE
504	\N	MDAOUROUCHE	مداوروش	COMMUNE
505	\N	BIR BOU HAOUCH	بئر بوحوش	COMMUNE
506	184	BELAAS	بلعاص	COMMUNE
507	185	BENDAOUD	بن داود	COMMUNE
508	177	OULED GACEM	أولاد قاسم	COMMUNE
509	\N	OULED MAALAH	أولاد مع الله	COMMUNE
510	175	BOUKADIR	بوقادير	COMMUNE
511	\N	AIN TASSERA	عين تسرة	COMMUNE
512	186	OULED HELLAL	أولاد هلال	COMMUNE
513	\N	EL MCHIRA	مشيرة	COMMUNE
514	187	GUELLAL	قلال	COMMUNE
515	188	OUM EL ADHAIM	أم العظايم	COMMUNE
516	189	OUARIZANE	وارزان	COMMUNE
517	166	REBAIA	الربيعية	COMMUNE
518	\N	OULED KHELLOUF	اولاد خلوف	COMMUNE
519	190	AIN DISS	عين الديس	COMMUNE
520	165	TIXTER	تيكستار	COMMUNE
521	179	SIDI ZIANE	سيدى زيان	COMMUNE
522	\N	TARIK IBN ZIAD	طارق بن زياد	COMMUNE
523	\N	TLATET ED DOUAIR	ثلاثة الدواير	COMMUNE
524	191	OULED BEN ABDELKADER	أولاد بن عبد القادر	COMMUNE
525	\N	EL HAMRI	حمرى	COMMUNE
526	\N	EL ANSEUR	العناصر	COMMUNE
527	\N	EL HASSANIA	الحسنية	COMMUNE
528	\N	SIDI BELATTAR	سيدى بلعطار	COMMUNE
529	\N	OUED KEBERIT	وادى كباريت	COMMUNE
530	192	AIN LAHDJAR	عين الحجر	COMMUNE
531	186	OULED ANTAR	أولاد عنتر	COMMUNE
532	\N	BENI BOUATTAB	بنى بوعطاب	COMMUNE
533	173	SAFEL EL OUIDEN	سفل الويدان	COMMUNE
534	193	DJIDIOUIA	جديوية	COMMUNE
535	190	AIN BABOUCHE	عين ببوش	COMMUNE
536	191	EL HADJADJ	الحجاج	COMMUNE
537	\N	AIN FAKROUN	عين الفكرون	COMMUNE
538	182	SEGHOUANE	سغوان	COMMUNE
539	\N	HAMMAM SKHOUNA	حمام سخونة	COMMUNE
540	\N	EL HAMMADIA	الحمادية	COMMUNE
541	194	TAFRAOUT	طافراوت	COMMUNE
542	195	KSOUR	القصور	COMMUNE
543	\N	HAMMAM DHALAA	حمام الضلعة	COMMUNE
544	\N	MERDJET SIDI ABED	مرجة سيدى عابد	COMMUNE
545	\N	CHELLALAT EL ADHAOURA	شلالة العذاورة	COMMUNE
546	196	MOSTAGANEM	مستغانم	CHEF-LIEU-WILAYA
547	\N	BENI ILMENE	بنى يلمان	COMMUNE
548	194	CHENIGUEL	شنيقل	COMMUNE
549	197	LAZHARIA	الزهرية	COMMUNE
550	198	SOUK NAAMANE	سوق نعمان	COMMUNE
551	\N	OUED RHIOU	وادى رهيو	COMMUNE
552	199	BERRICHE	بريش	COMMUNE
553	\N	AIN BOUDINAR	عين بودينار	COMMUNE
554	200	SOUR	صور	COMMUNE
555	201	TELLA	التلة	COMMUNE
556	202	RAS EL OUED	رأس الوادى	COMMUNE
557	\N	AIN TEDLES	عين تادلس	COMMUNE
558	\N	KSAR EL ABTAL	قصر الأبطال	COMMUNE
559	201	TAYA	الطاية	COMMUNE
560	\N	OUENOUGHA	ونوغة	COMMUNE
561	203	HANCHIR TOUMGHANI	هنشير تومغنى	COMMUNE
562	204	BELIMOUR	بليمور	COMMUNE
563	192	BIR HADDADA	بئر حدادة	COMMUNE
564	186	BOGHAR	بوغار	COMMUNE
565	\N	MOUDJEBEUR	مجبر	COMMUNE
566	193	OULED SIDI MIHOUB	أولاد سيدى ميهوب	COMMUNE
567	\N	KHEIR EDDINE	خير الدين	COMMUNE
568	\N	EL OUENZA	الونزة	COMMUNE
569	188	TERRAGUELT	تارقالت	COMMUNE
570	\N	AIN OULMANE	عين اولمان	COMMUNE
571	195	EL EUCH	العش	COMMUNE
572	200	OUED EL KHEIR	واد الخير	COMMUNE
573	205	SAYADA	صيادة	COMMUNE
574	203	AIN KERCHA	عين كرشة	COMMUNE
575	206	AIN BOUCIF	عين بو سيف	COMMUNE
576	207	SIDI KHETTAB	سيدى خطاب	COMMUNE
577	176	EL OUELDJA	الولجة	COMMUNE
578	184	BATHIA	بطحية	COMMUNE
579	203	EL HARMILIA	الحرملية	COMMUNE
580	206	KEF LAKHDAR	الكاف الاخضر	COMMUNE
581	38	SOUK EL HAD	سوق الحد	COMMUNE
582	\N	EL AOUINET	العوينات	COMMUNE
583	208	THENIET EL HAD	ثنية الاحد	COMMUNE
584	198	BIR CHOUHADA	بئر الشهداء	COMMUNE
585	\N	OULED SIDI AHMED	اولاد سى احمد	COMMUNE
586	209	YOUSSOUFIA	يوسوفية	COMMUNE
587	210	OUM EL BOUAGHI	أم البواقى	CHEF-LIEU-WILAYA
588	195	RABTA	الرابطة	COMMUNE
589	\N	MFATHA	مفاتحة	COMMUNE
590	211	DERRAG	دراق	COMMUNE
591	212	LARBAA	الاربعاء	COMMUNE
592	198	OULED ZOUAI	أولاد الزاوى	COMMUNE
593	\N	BORDJ GHDIR	برج الغدير	COMMUNE
594	\N	EL HMADNA	الحمادنة	COMMUNE
595	202	OULED BRAHEM	أولاد براهم	COMMUNE
596	189	LAHLEF	لحلاف	COMMUNE
597	214	EL MERIDJ	المريج	COMMUNE
598	215	SIDI AISSA	سيدى عيسى	COMMUNE
599	197	BOUCAID	بوقائد	COMMUNE
600	216	OUED EL DJEMAA	وادى الجمعة	COMMUNE
601	52	RAMKA	الرمكة	COMMUNE
602	217	SAFSAF	صفصاف	COMMUNE
603	211	AZIZ	عزيز	COMMUNE
604	\N	OULED MAAREF	أولاد معارف	COMMUNE
605	209	BORDJ EL EMIR ABDELKADER	برج الامير عبد القادر	COMMUNE
606	218	KSAR EL BOUKHARI	قصر البخارى	COMMUNE
607	192	BEIDHA BORDJ	بيضاء برج	COMMUNE
608	219	AMMI MOUSSA	عمى موسى	COMMUNE
609	\N	OULED SELLAM	أولاد سلام (المسيل)	COMMUNE
610	\N	EL AOUINET	العوينات	COMMUNE
611	220	BENI CHAIB	بنى شعيب	COMMUNE
612	\N	MEZAGHRANE	مزاغران	COMMUNE-COTIERE
613	\N	HASSI MAAMECHE	حاس مماش	COMMUNE
614	221	ARZEW	أرزيو	COMMUNE-COTIERE
615	\N	AIN AZAL	عين ازال	COMMUNE
616	222	AIN DJASSER	عين جاسر	COMMUNE
617	223	SALAH BEY	صالح باى	COMMUNE
618	162	MANSOURAH	منصورة	COMMUNE
619	194	AIN OUKSIR	عين القصير	COMMUNE
620	225	LARDJEM	لرجام	COMMUNE
621	226	SIDI HADJERES	سيدى هجرس	COMMUNE
622	227	SIDI SLIMANE	سيدى سليمان	COMMUNE
623	217	SOUAFLIA	السوافلية	COMMUNE
624	\N	EL ZORG	الزرق	COMMUNE
625	229	BEHIR CHERGUI	بحير الشرقى	COMMUNE
626	\N	SIDI DAMED	سيدى دامد	COMMUNE
627	\N	SIDI BEN YABKA	سيدى بن يبقى	COMMUNE-COTIERE
628	224	MESRA	ماسرة	COMMUNE
629	220	BORDJ BOUNAAMA	برج بونعامة	COMMUNE
630	\N	ZANA EL BEIDA	زانة البيضاء	COMMUNE
631	\N	BELAASSEL BOUZEGZA	بلعسل بوزقزة	COMMUNE
632	230	TARMOUNT	تارمونت	COMMUNE
633	231	BOUKHADRA	بوخضرة	COMMUNE
634	218	SANEG	السانق	COMMUNE
635	\N	GHILASSA	غيلاسة	COMMUNE
636	210	AIN ZITOUN	عين الزيتون	COMMUNE
637	232	BENI DERGOUN	بنى درقن	COMMUNE
638	208	SIDI BOUTOUCHENT	سيدى بوتوثنت	COMMUNE
639	\N	OUM EL DJALIL	أم الجليل	COMMUNE
640	233	AIN YAGOUT	عين ياقوت	COMMUNE
641	234	MAADID	معاضيد	COMMUNE
642	235	OULED YAICH	أولاد يعيش	COMMUNE
643	221	ARZEW	أرزيو	ILE
644	236	LAZROU	لازرو	COMMUNE
645	237	M'SILA	المسيلة	CHEF-LIEU-WILAYA
646	221	ARZEW	أرزيو	ILE
647	\N	EL FEDJOUDJ BOUGHRARA SAOUDI	بوغرارة سعودى الفجوج	COMMUNE
648	238	GDYEL	قديل	COMMUNE-COTIERE
649	239	STIDIA	ستدية	COMMUNE-COTIERE
650	223	OULED TEBBEN	اولاد تبان	COMMUNE
651	223	ROSFA	الرصفة	COMMUNE
652	204	TAGLAIT	تاقلعيت	COMMUNE
653	232	ZEMMOURA	زمورة	COMMUNE
654	\N	AIN SIDI CHERIF	عين سيدى الشريف	COMMUNE
655	\N	TAMALAHT	تاملاحت	COMMUNE
656	215	BOUTI SAYEH	بوطى السائح	COMMUNE
657	\N	KHETTOUTI SED EL DJIR	خطوطى سد الجير	COMMUNE
658	\N	AIN TAREK	عين الطريق	COMMUNE
659	220	BENI LAHCENE	بنى لحسن	COMMUNE
660	224	TOUAHRIA	بلاد الطواهرية	COMMUNE
661	222	EL HASSI	الحاسى	COMMUNE
662	\N	AIN NOUISSI	عين النويسى	COMMUNE
663	217	BOUGUIRAT	بوقيراط	COMMUNE
664	240	BENHAR	بن هار	COMMUNE
665	199	AIN BEIDA	عين البيضاء	COMMUNE
666	\N	AIN  BIYA	عين بية	COMMUNE-COTIERE
667	242	BOUGHZOUL	بوقزول	COMMUNE
668	\N	AIN OUESSARA	عين وسارة 	COMMUNE
669	230	OULED MANSOUR	أولاد منصور	COMMUNE
670	240	BIRINE	البيرين	COMMUNE
671	\N	REHIA	الرحية	COMMUNE
672	243	BETHIOUA	بطيوة	COMMUNE-COTIERE
673	234	OULED ADDI GUEBALA	أولاد عدى القبالة	COMMUNE
674	238	HASSI MEFSOUKH	حاسى مفسوخ	COMMUNE
675	225	MELAAB	الملعب	COMMUNE
676	222	EL HASSI	الحاسى	COMMUNE
677	\N	MTARFA	المطارفة	COMMUNE
678	244	YELLEL	يلل	COMMUNE
679	66	KHEMISTI	خميستى	COMMUNE
680	243	MARSAT EL HADJADJ	مرسى الحجاج	COMMUNE-COTIERE
681	236	SERIANA	سريانة	COMMUNE
682	\N	KSAR BELEZMA	قصر بلزمة	COMMUNE
683	\N	BOULEHILET	بوالحيلات	COMMUNE
684	245	FKIRINA	فكيرينة	COMMUNE
685	246	FORNAKA	فرناكة	COMMUNE-COTIERE
686	185	RELIZANE	غليزان	CHEF-LIEU-WILAYA
687	\N	TALKHEMT	تلخمت	COMMUNE
688	66	LAYOUNE	العيون	COMMUNE
689	217	SIRAT	سيرات	COMMUNE
690	\N	EL HESSIANE	الحسيان	COMMUNE
691	247	GUIGBA	قيقبة	COMMUNE
692	248	DEHAHNA	دهاهنة	COMMUNE
693	249	SIDI ABED	سيدى عابد	COMMUNE
694	\N	MOCTADOUZ	مقطع الدوز	COMMUNE
695	233	BOUMIA	بومية	COMMUNE
696	250	HASSI BEN OKBA	حاسى بن عقبة	COMMUNE-COTIERE
697	247	RAHBAT	الرحبات	COMMUNE
698	250	BIR EL DJIR	بئر الجير	COMMUNE-COTIERE
699	\N	AIN  TURK	عين الترك	ILE
700	251	AIN TURK	عين الترك	COMMUNE-COTIERE
701	252	EL ANCOR	العنصر	ILE
702	229	EL BELALA	البلالة	COMMUNE
703	253	ORAN	وهران	CHEF-LIEU-WILAYA
704	252	BOUSFER	بوسفر	COMMUNE-COTIERE
705	234	OULED DERRADJ	أولاد دراج	COMMUNE
706	\N	MORSOT	مرسط	COMMUNE
707	247	GOSBAT	القصبات	COMMUNE
708	238	BEN FREHA	بن فريحة	COMMUNE
709	225	SIDI LANTRI	سيدى لالعنترى	COMMUNE
710	\N	EL MATMAR	المطمر	COMMUNE
711	242	BOUAICHE	بو عيش	COMMUNE
712	244	SIDI SAADA	سيدى سعادة	COMMUNE
713	254	OUED EL MA	وادى الماء	COMMUNE
714	\N	OULED BESSEM	أولاد بسام	COMMUNE
715	223	HAMMA	الحامة	COMMUNE
716	229	MESKIANA	مسكيانة	COMMUNE
717	\N	EL DJEZIA	الجازية	COMMUNE
718	255	EL GHOMRI	الغمرى	COMMUNE
719	255	SIDI ABDELMOUMENE	سيدى عبد المؤمن	COMMUNE
720	256	MENDES	منداس	COMMUNE
721	\N	HAD CHEKKALA	حد الشكالة	COMMUNE
722	252	MERS EL KEBIR	المرسى الكبير	COMMUNE-COTIERE
723	233	DJERMA	جرمة	COMMUNE
724	257	ALAIMIA	علايمية	COMMUNE
725	223	BOUTALEB	بوطالب	COMMUNE
726	226	AIN EL HADJEL	عين الحجل	COMMUNE
727	258	BOUZEDJAR	بوزجار	ILE
728	214	AIN ZERGA	عين الزرقاء	COMMUNE
729	162	BEN DAOUD	بن داود	COMMUNE
730	258	BOUZEDJAR	بوزجار	ILE
731	252	EL ANCOR	العنصر	COMMUNE-COTIERE
732	250	HASSI BOUNIF	حاسى بونيف	COMMUNE
733	248	MAGRA	مقرة	COMMUNE
734	\N	CHAHBOUNIA	الشهبونية	COMMUNE
735	\N	DAR BEN ABDELLAH	دار بن عبد الله	COMMUNE
736	244	AIN RAHMA	عين الرحمة	COMMUNE
737	247	RAS EL AIOUN	رأس العيون	COMMUNE
738	\N	MISSERGHIN	مسرغين	COMMUNE
739	259	SEBT	السبت	COMMUNE
740	260	BOUFATIS	بوفتيس	COMMUNE
741	248	BERHOUM	برهوم	COMMUNE
742	261	CHEMORA	شمرة	COMMUNE
743	254	MEROUANA	مروانة	COMMUNE
744	262	SIDI CHAMI	سيدى الشحمى	COMMUNE
745	233	EL MADHER	المعدر	COMMUNE
746	249	AMMARI	عمارى	COMMUNE
747	67	AIN KERMA	عين الكرمة	COMMUNE-COTIERE
748	249	MAACEM	المعاصم	COMMUNE
749	263	TIDDA	تيدة	COMMUNE
750	264	TISSEMSILT	تيسمسيلت	CHEF-LIEU-WILAYA
751	262	ES SENIA	السانية	COMMUNE
752	263	SIDI ALI MELLAL	سيدى على ملال	COMMUNE
753	257	RAS EL AIN AMIROUCHE	رأس عميروش	COMMUNE
754	67	BOUTLELIS	بوتليليس	COMMUNE
755	265	REMILA	الرميلة	COMMUNE
756	266	SOUMAA	السومع	COMMUNE
757	259	MEGHILA	مغيلة	COMMUNE
758	255	SEDJERARA	سجرارة	COMMUNE
759	\N	LEMCEN	لمسان	COMMUNE
760	256	SIDI LAZREG	سيدى الازرق	COMMUNE
761	\N	SIDI MHAMED BENAOUDA	سيدى محمد بن عودة	COMMUNE
762	267	OULED SI SLIMANE	أولاد سى سليمان	COMMUNE
763	244	KALAA	القلعة	COMMUNE
764	268	FESDIS	فسديس	COMMUNE
765	\N	EL KARMA	الكرمة	COMMUNE
766	245	OUED NINI	وادى نينى	COMMUNE
767	24	MOHAMMADIA	محمدية	COMMUNE
768	67	AIN KERMA	عين الكرمة	ILE
769	269	BIR DHEHEB	بئر الذهب	COMMUNE
770	270	OULED MADHI	أولاد ماضى	COMMUNE
771	248	BELAIBA	بلعايبة	COMMUNE
772	271	OULED FADEL	أولاد فاضل	COMMUNE
773	268	BATNA	باتنة	CHEF-LIEU-WILAYA
774	257	OGGAZ	عقاز	COMMUNE
775	260	EL BRAYA	البرية	COMMUNE
776	270	CHELLAL	شلال	COMMUNE
777	258	BOUZEDJAR	بوزجار	COMMUNE-COTIERE
778	256	OUED ESSALEM	وادى السلام	COMMUNE
779	272	RAHOUIA	الرحوية	COMMUNE
780	273	DJEZZAR	الجزار	COMMUNE
781	\N	MTOUSSA	متوسة	COMMUNE
782	254	HIDOUSSA	حيدوسة	COMMUNE
783	274	BOULHAF DYR	بوالحاف الدير	COMMUNE
784	248	AIN KHADRA	عين الخضراء	COMMUNE
785	267	TAXLENT	تاكسلانت	COMMUNE
786	\N	BOUHENNI	بوهنى	COMMUNE
787	271	TIMGAD	تيمقاد	COMMUNE
788	263	OUED LILLI	وادى ليلى	COMMUNE
789	259	SIDI HOSNI	سيدى حسنى	COMMUNE
790	275	OUYOUN EL ASSAFIR	عيون العصافر	COMMUNE
791	268	OUED CHAABA	وادى الشعبة	COMMUNE
792	260	OUED TLELAT	وادى تليلات	COMMUNE
793	258	EL AMRIA	العامرية	COMMUNE
794	276	BOUGARA	بوقرة	COMMUNE
795	255	FERRAGUIG	فراقيق	COMMUNE
796	151	BENZOUH	بن الزوخ	COMMUNE
797	\N	NGAOUS	نقاوس	COMMUNE
798	278	DHALAA	الضلعة	COMMUNE
799	279	BAGHAI	بغاى	COMMUNE
800	280	AIN FEKKA	عين فقة	COMMUNE
801	274	EL KOUIF	الكويف	COMMUNE
802	281	EL MENAOUER	المناور	COMMUNE
803	\N	GOURIGUEUR	قوريقر	COMMUNE
804	\N	EL MSAID	مساعيد	COMMUNE-COTIERE
805	282	SIG	سيق	COMMUNE
806	283	SEBAINE	السبعين	COMMUNE
807	284	ZAHANA	زهنة	COMMUNE
808	285	EL KHEMIS	الخميس	COMMUNE
809	286	AIN TOUILA	عين الطويلة	COMMUNE
810	265	KAIS	قايس	COMMUNE
811	279	EL HAMMA	الحامة	COMMUNE
812	\N	HASSI FDOUL	حاسى فدول	COMMUNE
813	281	EL BORDJ	البرج	COMMUNE
814	260	TAFRAOUI	طفراوى	COMMUNE
815	277	HAMADIA	حمادية	COMMUNE
816	275	TAZOULT	تازولت	COMMUNE
817	287	OULED AOUF	أولاد عوف	COMMUNE
818	288	HAMMAMET	الحمامات	COMMUNE
819	272	GUERTOUFA	قرطوفة	COMMUNE
820	\N	BOUMAGUER	بومقر	COMMUNE
821	289	AIN FARES	عين فارس	COMMUNE
822	291	DAHMOUNI	الدهمونى	COMMUNE
823	283	MAHDIA	مهدية	COMMUNE
824	\N	TAMZOUGHA	تامزوغة	COMMUNE
825	292	SIDI AMEUR	سيدى عامر	COMMUNE
826	\N	METKAOUAK	متكاوك	COMMUNE
827	293	HACINE	حسين	COMMUNE
828	280	HAD SAHARY	حد الصحارى 	COMMUNE
829	258	OULED BOUDJEMAA	أولاد بوجمعة	COMMUNE-COTIERE
830	294	OUED EL ABTAL	وادى الابطال	COMMUNE
831	285	SIDI LAADJEL	سيدى لعجال	COMMUNE
832	265	TAOUZIANAT	تاوزينات	COMMUNE
833	273	OULED AMMAR	أولاد عمار	COMMUNE
834	295	OUED SEBBAH	وادى الصباح	COMMUNE
835	290	EL MAMOUNIA	المأمونية	COMMUNE
836	\N	SIDI ABDELDJABAR	سيدى عبد الجبار	COMMUNE
837	296	SEHAILIA	السحايلية	COMMUNE
838	\N	BIR MOKADEM	بئر المقدم	COMMUNE
839	297	CHORFA	الشرفاء	COMMUNE
840	298	CHELIA	شلية	COMMUNE
841	284	EL GAADA	القعدة	COMMUNE
842	\N	HAMMAM BOUHADJAR	حمام بوحجر	COMMUNE
843	299	OUED TAGA	وادى الطاقة	COMMUNE
844	281	KHALOUIA	خلوية	COMMUNE
845	277	RECHAIGA	الرشايقة	COMMUNE
846	258	HASSI EL GHELLA	حاسى الغلة	COMMUNE
847	287	BENI FOUDHALA EL HAKANIA	بنى فضالة الحقانية	COMMUNE
848	279	ENSIGHA	أنسيغة	COMMUNE
849	279	TAMZA	طامزة	COMMUNE
850	300	TEBESSA	تبسة	CHEF-LIEU-WILAYA
851	301	SEFIANE	سفيان	COMMUNE
852	295	AIN EL ARBAA	عين الاربعاء	COMMUNE
853	302	BARIKA	بريكة	COMMUNE
854	303	DJILLALI BEN AMAR	جيلالى بن عمار	COMMUNE
855	\N	EL GUEITNA	القيطنة	COMMUNE
856	298	YABOUS	يابوس	COMMUNE
857	\N	MACHRAA SFA	مشرع الصفاء	COMMUNE
858	304	KHENCHELA	خنشلة	CHEF-LIEU-WILAYA
859	294	AIN FERAH	عين فراح	COMMUNE
860	296	TIGHENNIF	تيغنيف	COMMUNE
861	305	MAKEDRA	مكدرة	COMMUNE
862	287	AIN TOUTA	عين التوتة	COMMUNE
863	306	TERGA	تارقة	COMMUNE-COTIERE
864	\N	MCIF	مسيف	COMMUNE
865	270	MAARIF	المعاريف	COMMUNE
866	\N	EL MALAH	المالح	COMMUNE
867	307	EL MAHMAL	المحمل	COMMUNE
868	\N	TAGDEMT	تاقدمت	COMMUNE
869	151	OULED SIDI BRAHIM	أولاد سيدى ابراهيم	COMMUNE
870	308	FOUM TOUB	فم الطوب	COMMUNE
871	305	AIN EL BERD	عين البرد	COMMUNE
872	274	BEKKARIA	بكارية	COMMUNE
873	309	EL HACHEM	الحشم	COMMUNE
874	310	MAOUSSA	ماوسة	COMMUNE
875	311	MASCARA	معسكر	CHEF-LIEU-WILAYA
876	312	TILATOU	تيلاطو	COMMUNE
877	313	EL KEURT	الكرط	COMMUNE
878	312	SEGGANA	سقانة	COMMUNE
879	314	KHOUBANA	خبانة	COMMUNE
880	\N	AIN ZARIT	عين دزاريت	COMMUNE
881	315	TIARET	تيارت	CHEF-LIEU-WILAYA
882	316	ARRIS	أريس	COMMUNE
883	317	BEDJENE	بجن	COMMUNE
884	306	OULED KIHAL	أولاد الكيحل	COMMUNE-COTIERE
885	291	AIN BOUCHEKIF	عين بوشقيف	COMMUNE
886	212	LARBAA	لرباع	COMMUNE
887	313	TIZI	تيزى	COMMUNE
888	318	BOUDJEBAA EL BORDJ	بوجبهة البرج	COMMUNE
889	295	SIDI BOUMEDIENE	سيدى بومدين	COMMUNE
890	296	SIDI KADA	سيدى قادة	COMMUNE
891	283	NADORAH	الناظورة	COMMUNE
892	\N	EL MA LABIOD	الماء الابيض	COMMUNE
893	293	BOUHANIFIA	بوحنيفية	COMMUNE
894	\N	CHAABET EL HAM	شعبة اللحم	COMMUNE
895	319	BABAR	بابار	COMMUNE
896	\N	AIN ADDEN	عين آدن	COMMUNE
897	308	ICHEMOUL	اشمول	COMMUNE
898	320	SIDI BEN ADDA	سيدى بن عدة	COMMUNE-COTIERE
899	321	CHERIA	الشريعة	COMMUNE
900	322	AIN THRID	عين الثريد	COMMUNE
901	323	CHENTOUF	شنتوف	COMMUNE
902	\N	ZELMATA	الزرارقة	COMMUNE
903	\N	THENIET EL ABED	ثنية العابد	COMMUNE
904	305	SIDI HAMADOUCHE	سيدى حمادوش	COMMUNE
905	298	BOUHMAMA	بوحمامة	COMMUNE
906	33	SIDI SAFI	سيدى الصافى	COMMUNE-COTIERE
907	212	BOUZINA	بوزينة	COMMUNE
908	\N	EL MAZERAA	المزرعة	COMMUNE
909	\N	MATMORE	مطمور	COMMUNE
910	302	BITAM	بيطام	COMMUNE
911	292	TAMSA	تامسة	COMMUNE
912	287	MAAFA	معافة	COMMUNE
913	\N	EL HOUIDJBET	الحويجبات	COMMUNE
914	324	EL OGLA EL MALHA	العقلة المالحة	COMMUNE
915	322	TESSALA	تسالة	COMMUNE
916	307	OULED RECHACHE	أولاد رشاش	COMMUNE
917	313	FROHA	فروحة	COMMUNE
918	325	SERGHINE	سرقين	COMMUNE
919	280	BOUIRA LAHDAB	بويرة الاحداب	COMMUNE
920	326	SIDI BAKHTI	سيدى بختى	COMMUNE
921	33	BENI SAF	بنى صاف	COMMUNE-COTIERE
922	\N	OULHACA GHERRABA	ولهاصة الغرابة	ILE
923	\N	INOUGHISSENE	اينوغيسن	COMMUNE
924	\N	BOUSAADA	بوسعادة	COMMUNE
925	327	SOUGUEUR	السوقر	COMMUNE
926	320	AIN TEMOUCHENT	عين تموشنت	CHEF-LIEU-WILAYA
927	310	SIDI BOUSSAID	سيدى بو سعيد	COMMUNE
928	325	KSAR CHELLALA	قصر الشلالة	COMMUNE
929	\N	SIDI  ABDELGHANI	سي عبد الغنى	COMMUNE
930	317	EL OGLA	العقلة	COMMUNE
931	329	MENAA	منعة	COMMUNE
932	323	HASSASNA	الحساسنة	COMMUNE
933	\N	TAKHMARET	تخمارت	COMMUNE
934	\N	NESMOTH	نسموط	COMMUNE
935	331	AIN EL HADID	عين الحديد	COMMUNE
936	326	MELLAKOU	ملاكو	COMMUNE
937	332	ZEROUALA	زروالة	COMMUNE
938	333	GUERNINI	قرنينى	COMMUNE
939	\N	OULHACA GHERRABA	ولهاصة الغرابة	COMMUNE-COTIERE
940	318	SFISEF	سفيزف	COMMUNE
941	310	GHRISS	غريس	COMMUNE
942	334	AIN TOLBA	عين الطلبة	COMMUNE
943	\N	MSARA	امصارة	COMMUNE
944	326	MEDROUSSA	مدغوسة	COMMUNE
945	305	SIDI BRAHIM	سيدى براهيم	COMMUNE
946	335	EL KANTARA	القنطرة	COMMUNE
947	322	SEHALA THAOURA	السهالة الثورة	COMMUNE
948	314	EL HOUAMED	الحوامد	COMMUNE
949	334	AGHLAL	اغلال	COMMUNE
950	\N	OULHACA GHERRABA	ولهاصة الغرابة	ILE
951	\N	AIN KIHEL	عين الكيحل	COMMUNE
952	336	AIN FRASS	عين فرس	COMMUNE
953	\N	EL EMIR ABDELKADER	الامير عبد القادر	COMMUNE
954	299	CHIR	شير (النوادر)	COMMUNE
955	330	MEDJEDEL	مجدل	COMMUNE
956	336	AIN FEKAN	عين فكان	COMMUNE
957	335	AIN ZAATOUT	عين زعطوط	COMMUNE
958	337	SIDI LAHCENE	سيدى لحسن	COMMUNE
959	\N	SIDI BEL ABBES	سيدى بلعباس	CHEF-LIEU-WILAYA
960	316	TIGHANIMINE	تيغانمين	COMMUNE
961	\N	TKOUT	تكوت	COMMUNE
962	\N	MOSTEFA BEN BRAHIM	مصطفى بن براهيم	COMMUNE
963	338	KIMMEL	كيمل	COMMUNE
964	323	OUED BERKECHE	وادى برقش	COMMUNE
965	339	GUERDJOUM	قرجوم	COMMUNE
966	\N	MAKDA	ماقضة	COMMUNE
967	332	TILMOUNI	تلمونى	COMMUNE
968	340	BENI KHELLAD	بن خلاد	COMMUNE-COTIERE
969	\N	TADMAYA	تادمية	COMMUNE
970	329	MENAA	منعة	COMMUNE
971	340	BENI KHELLAD	بن خلاد	ILE
972	\N	ZMALET EMIR ABDELKADER	زمالة الامير عبد القادر	COMMUNE
973	341	OUM ALI	ام على	COMMUNE
974	342	REMCHI	الرمشى	COMMUNE
975	\N	THLIDJENE	ثليجان	COMMUNE
976	\N	MDOUKAL	مدوكال	COMMUNE
977	\N	SEBAA CHIOUKH	السبعة شيوخ	COMMUNE
978	343	GHARROUS	غروس	COMMUNE
979	343	AOUF	عوف	COMMUNE
980	\N	MCID	المسيد	COMMUNE
981	342	EL FEHOUL	الفحول	COMMUNE
982	\N	HONAINE	اهناى	COMMUNE-COTIERE
983	\N	OUGBELLIL	عقب الليل	COMMUNE
984	344	HASSI EL EUCH	حاسى العش	COMMUNE
985	\N	SIDI DAHO	سيدى دحو الزائر	COMMUNE
986	337	SIDI YACOUB	سيدى يعقوب	COMMUNE
987	329	TIGHARGHAR	تغرغار	COMMUNE
988	345	AIN KADA	عين قادة	COMMUNE
989	332	BELARBI	بلعربى	COMMUNE
990	327	TOUSNINA	توسنينة	COMMUNE
991	331	FRENDA	فرندة	COMMUNE
992	337	AMARNAS	العمارنة	COMMUNE
993	\N	EL HAMRI	الحمرى	COMMUNE
994	327	FAIDJA	فايجة	COMMUNE
995	176	KHIRANE	خيران	COMMUNE
996	346	SIDI BAIZID	سيدى بايزيد	COMMUNE
997	\N	OUED TAGHIA	وادى تاغية	COMMUNE
998	347	DJEMORAH	جمورة	COMMUNE
999	348	BENSEKRANE	بن سكران	COMMUNE
1000	\N	OULTENE	ولتام	COMMUNE
1001	\N	HASSI DAHO	حاسى دحو	COMMUNE
1002	79	HOUNET	هونت	COMMUNE
1003	317	STAH GUENTIS	سطح قنطيس	COMMUNE
1004	348	SIDI ABDELLI	سيدي العبدلى	COMMUNE
1005	342	BENI OUARSOUS	بنى ورسوس	COMMUNE
1006	343	BENIAN	بنيان	COMMUNE
1007	\N	DAR YAGHMOURASSENE	دار يغموراسن	COMMUNE-COTIERE
1008	349	NAIMA	النعيمة	COMMUNE
1009	350	EL OUTAYA	الوطاية	COMMUNE
1010	337	SIDI KHALED	سيدى خالد	COMMUNE
1011	\N	ZERZOUR	زرزور	COMMUNE
1012	338	GHASSIRA	غسيرة	COMMUNE
1013	345	SIDI ALI BOUSSIDI	سيدى على بوسيدى	COMMUNE
1014	344	HASSI BAHBAH	حاسى بحبح	COMMUNE
1015	\N	SAFSAF EL OUESRA	صفصاف الوسرة	COMMUNE
1016	342	AIN YOUCEF	عين يوسف	COMMUNE
1017	\N	CHERCHAR	ششار	COMMUNE
1018	351	OUED SEFIOUN	وادى سفيون	COMMUNE
1019	352	GHAZAOUET	الغزوات	COMMUNE-COTIERE
1020	149	OULED BRAHIM	أولاد ابراهيم	COMMUNE
1021	353	NEDROMA	ندرومة	COMMUNE
1022	\N	BOUKANEFIS	بوخنفيس	COMMUNE
1023	354	DJEBEL MESSAAD	جبل مساعد	COMMUNE
1024	345	LAMTAR	الامطار	COMMUNE
1025	\N	MERSA BEN MHIDI	مرسى بن مهيدى	COMMUNE-COTIERE
1026	79	SIDI BOUBEKEUR	سيدى بوبكر	COMMUNE
1027	355	TOLGA	طولقة	COMMUNE
1028	356	AIN NEHALA	عين النحالة	COMMUNE
1029	357	AIN KEBIRA	العين الكبيرة	COMMUNE
1030	352	SOUAHLIA	السواحلية	COMMUNE-COTIERE
1031	109	HASSI ZAHANA	حاسى زهانة	COMMUNE
1032	354	SLIM	سليم	COMMUNE
1033	351	TENIRA	تنيرة	COMMUNE
1034	\N	SOUK THLATA	سوق الثلاثاء	COMMUNE-COTIERE
1035	\N	M'ZIRAA	مزيرعة	COMMUNE
1036	358	AMIEUR	عمير	COMMUNE
1037	\N	MSIRDA FOUAGA	مسيردة الفواقة	COMMUNE-COTIERE
1038	359	BEN SROUR	بن سرور	COMMUNE
1039	149	AIN SOLTANE	عين السلطان	COMMUNE
1040	149	TIRCINE	ترسين	COMMUNE
1041	\N	TIENET	تيانت	COMMUNE
1042	79	SIDI AMAR	سيدى عمر	COMMUNE
1043	360	M'CHOUNECHE	مشونش	COMMUNE
1044	357	FELLAOUCENE	فيلاوسن	COMMUNE
1045	361	TABIA	الطابية	COMMUNE
1046	347	BRANIS	البرانيس	COMMUNE
1047	344	ZAAFRANE	زعفران	COMMUNE
1048	362	ZENATA	زناتة	COMMUNE
1049	349	AIN DEHEB	عين الذهب	COMMUNE
1050	359	OULED SLIMANE	أولاد سليمان	COMMUNE
1051	176	DJELLAL	جلال	COMMUNE
1052	109	BEDRABINE EL MOKRANI	بضرابين المقرانى	COMMUNE
1053	176	EL OUELDJA	الولجة	COMMUNE
1054	79	OULED KHALED	اولاد خالد	COMMUNE
1055	363	YOUB	يوب	COMMUNE
1056	96	MEDRISSA	مدريسة	COMMUNE
1057	351	BENACHIBA CHELIA	بن عشيبة الشلية	COMMUNE
1058	359	MOHAMED BOUDIAF	محمد بوضياف	COMMUNE
1059	353	DJEBALA	جبالة	COMMUNE
1060	364	BAB EL ASSA	باب العسة	COMMUNE
1061	357	AIN FETAH	عين فتاح	COMMUNE
1062	\N	HENAYA	الحناية	COMMUNE
1063	349	CHEHAIMA	شحيمة	COMMUNE
1064	\N	OULED RIAH	اولاد رياح	COMMUNE
1065	346	DAR CHIOUKH	دار الشيوخ	COMMUNE
1066	361	SIDI ALI BENYOUB	سيدى على بن يوب	COMMUNE
1067	109	BEN BADIS	بن باديس	COMMUNE
1068	96	AIN KERMES	عين كرمس	COMMUNE
1069	109	CHETOUANE BELAILA	شيطوان	COMMUNE
1070	365	HAMMAM BOUGHRARA	حمام بوغرارة	COMMUNE
1071	363	DOUI THABET	دوى ثابت	COMMUNE
1072	\N	AIN TALLOUT	عين تالوت	COMMUNE
1073	96	DJEBILET ROSFA	جبيلات الرصفة	COMMUNE
1074	364	SOUANI	السوانى	COMMUNE
1075	358	CHETOUANE	شتوان	COMMUNE
1076	366	TEGHALIMET	تغاليمت	COMMUNE
1077	\N	BIR EL ATER	بئر العاتر	COMMUNE
1078	344	AIN MAABED	عين معبد	COMMUNE
1079	367	OULED MIMOUN	اولاد ميمون	COMMUNE
1080	162	BENI MESTER	بنى مستر	COMMUNE
1081	358	AIN FEZZA	عين فزة	COMMUNE
1082	368	TLEMCEN	تلمسان	CHEF-LIEU-WILAYA
1083	369	SABRA	صبرة	COMMUNE
1084	\N	SIDI MHAMED	سيدى امحمد	COMMUNE
1085	370	CHETMA	شتمة	COMMUNE
1086	366	MEZAOUROU	مزاورو	COMMUNE
1087	371	MOULAY SLISSEN	مولاى سليسن	COMMUNE
1088	365	MAGHNIA	مغنية	COMMUNE
1089	372	BISKRA	بسكرة	CHEF-LIEU-WILAYA
1090	373	EL HASSASNA	الحساسنة	COMMUNE
1091	\N	BIR FODDA	بئر الفضة	COMMUNE
1092	\N	OUED CHOULY	وادى الشولى	COMMUNE
1093	289	AIN EL MELH	عين الملح	COMMUNE
1094	374	SAIDA	سعيدة	CHEF-LIEU-WILAYA
1095	162	MANSOURAH	المنصورة	COMMUNE
1096	\N	EL HADJEB	الحاجب	COMMUNE
1097	375	MERINE	مرين	COMMUNE
1098	\N	EL GUEDDID	القديد	COMMUNE
1099	366	TELAGH	تلاغ	COMMUNE
1100	376	MAAMORA	المعمورة	COMMUNE
1101	96	MADNA	مادنة	COMMUNE
1102	369	BOUHLOU	بوحلو	COMMUNE
1103	\N	BENI SEMIEL	بنى صميل	COMMUNE
1104	87	SIDI ABDERRAHMANE	سيدى عبد الرحمان	COMMUNE
1105	\N	MLILIHA	المليليحة	COMMUNE
1106	\N	TERNI BENI HEDIEL	تيرنى	COMMUNE
1107	\N	ECH CHAIBA	الشعيبة (أولاد رحمان)	COMMUNE
1108	370	SIDI OKBA	سيدى عقبة	COMMUNE
1109	\N	KHANGAT SIDI NADJI	خنقة سيدى ناجى	COMMUNE
1110	377	AIN EL HADJAR	عين الحجر	COMMUNE
1111	379	EL GHROUS	الغروس	COMMUNE
1112	289	AIN FARES	عين فارس	COMMUNE
1113	379	FOUGHALA	فوغالة	COMMUNE
1114	380	SIDI MEDJAHED	سيدى مجاهد	COMMUNE
1115	381	DJELFA	الجلفة	CHEF-LIEU-WILAYA
1116	162	AIN GHORABA	عين غرابة	COMMUNE
1117	382	ZERIBET EL OUED	زبيرة الوادى	COMMUNE
1118	\N	TAFISSOUR	تفسور	COMMUNE
1119	\N	BOUCHAGROUN	بوشقرون	COMMUNE
1120	371	EL HACAIBA	الحصيبة	COMMUNE
1121	355	LICHANA	ليشانة	COMMUNE
1122	383	OUMACHE	أوماش	COMMUNE
1123	370	AIN NAGA	عين الناقة	COMMUNE
1124	380	BENI BOUSSAID	بنى بوسعيد	COMMUNE
1125	355	BORDJ BEN AZZOUZ	برج بن عزوز	COMMUNE
1126	\N	AIN ERRICH	عين الريش	COMMUNE
1127	371	AIN TINDAMINE	عين تندامين	COMMUNE
1128	375	OUED TAOURIRA	وادى تاوريرة	COMMUNE
1129	\N	MOUADJEBAR	مجبرة	COMMUNE
1130	384	DOUCEN	الدوسن	COMMUNE
1131	385	BENI BAHDEL	بنى بحدل	COMMUNE
1132	385	BENI SNOUS	بنى سنوس	COMMUNE
1133	386	CHAREF	الشارف	COMMUNE
1134	378	SIDI AHMED	سيدى احمد	COMMUNE
1135	366	DHAYA	الضاية	COMMUNE
1136	378	MOULAY LARBI	مولاى العربى	COMMUNE
1137	387	SEBDOU	سبدو	COMMUNE
1138	\N	MLILI	مليلي	COMMUNE
1139	\N	AZAILS	العزايل	COMMUNE
1140	370	EL HAOUCH	الحوش	COMMUNE
1141	387	EL GOR	القور	COMMUNE
1142	382	EL FEIDH	الفيض	COMMUNE
1143	375	TAOUDMOUT	تاودموت	COMMUNE
1144	\N	OUGHLAL	أورلال	COMMUNE
1145	\N	BEIDHA	البيضاء	COMMUNE
1146	383	LIOUA	ليوة	COMMUNE
1147	388	FERKANE	فركان	COMMUNE
1148	383	MEKHADMA	مخادمة	COMMUNE
1149	41	BESBES	البسباس	COMMUNE
1150	\N	OUED SBAA	وادى السبع	COMMUNE
1151	389	SIDI CHAIB	سيدى شعيب	COMMUNE
1152	\N	AIN SKHOUNA	عين السخونة	COMMUNE
1153	\N	RAS EL MIAAD	رأس الميعاد (أولاد الساسى)	COMMUNE
1154	\N	FEIDH EL BOTMA	فابض البطمة	COMMUNE
1155	390	AIN EL IBEL	عين الابل	COMMUNE
1156	391	TADJEMOUT	تاجموت	COMMUNE
1157	\N	BIR EL HMAM	بئر الحمام	COMMUNE
1158	\N	ZAKKAR	زكار	COMMUNE
1159	392	SIDI DJILLALI	سيدى جلالى	COMMUNE
1160	389	MARHOUM	مرحوم	COMMUNE
1161	387	EL ARICHA	العريشة	COMMUNE
1162	\N	TADMIT	تاعضميت	COMMUNE
1163	393	RAS EL MA	رأس الماء	COMMUNE
1164	\N	BENI YAGOUB	بن يعقوب	COMMUNE
1165	388	NEGRINE	نقرين	COMMUNE
1166	394	EL IDRISSIA	الادريسية	COMMUNE
1167	384	OULED DJELLAL	أولاد جلال	COMMUNE
1168	\N	EL BOUIHI	البويهى	COMMUNE
1169	395	STILL	أسطيل	COMMUNE
1170	396	DELDOUL	دلدول	COMMUNE
1171	398	GUELTAT SIDI SAAD	قلتة سيدى سعد	COMMUNE
1172	337	SIDI KHALED	سيدى خالد	COMMUNE
1173	\N	REDJEM DEMMOUCHE	رجم دموش	COMMUNE
1174	395	OUM TOUYOUR	أم الطيور	COMMUNE
1175	\N	EL KHEITHER	الخيثر	COMMUNE
1176	\N	AMOURA	عمورة	COMMUNE
1177	399	ROGASSA	الرقاصة	COMMUNE
1178	400	SIDI BOUZID	سيدى بوزيد	COMMUNE
1179	401	HAMRAIA	الحمراية	COMMUNE
1180	394	DOUIS	الدويس	COMMUNE
1181	396	SELMANA	سلمانة	COMMUNE
1182	402	BEN GUECHA	بن قشة	COMMUNE
1183	403	OUED MORRA	وادى مرة	COMMUNE
1184	394	AIN CHOUHADA	عين الشهداء	COMMUNE
1185	\N	EL BIOD	البيوض	COMMUNE
1186	404	BOUGTOUB	بوقطب	COMMUNE
1187	405	SIDI MAKHLOUF	سيدى مخلوف	COMMUNE
1188	\N	MEKMEN BEN AMAR	مكمن بن عمار	COMMUNE
1189	406	KASDIR	القصدير	COMMUNE
1190	398	AIN SIDI ALI	عين سيدى على	COMMUNE
1191	400	AFLOU	أفلو	COMMUNE
1192	400	SEBGAG	سبقاق	COMMUNE
1193	396	MESSAAD	مسعد	COMMUNE
1194	399	CHEGUIG	الشقيق	COMMUNE
1195	\N	OUED MZI	وادى مزى	COMMUNE
1196	407	MAGRANE	المقرن	COMMUNE
1197	407	SIDI AOUN	سيدى عون	COMMUNE
1198	408	GUEMAR	قمار	COMMUNE
1199	409	BRIDA	بريدة	COMMUNE
1200	409	HADJ MECHRI	الحاج المشرى	COMMUNE
1201	410	OUM LAADHAM	ام العظام	COMMUNE
1202	411	EL GHICHA	الغيشة	COMMUNE
1203	\N	EL MEGAIER	المغير	CHEF-LIEU-WILAYA
1204	399	KEF EL AHMAR	كاف الاحمر	COMMUNE
1205	227	STITTEN	ستيتن	COMMUNE
1206	401	REGUIBA	الرقيبة	COMMUNE
1207	396	SED RAHAL	سد رحال	COMMUNE
1208	405	EL ASSAFIA	العسفية	COMMUNE
1209	292	SIDI AMEUR	سيدى عامر	COMMUNE
1210	412	LAGHOUAT	الأغواط	CHEF-LIEU-WILAYA
1211	413	TAIBET	الطيبات	COMMUNE
1212	\N	TAOUILA	تاويالة	COMMUNE
1213	\N	MNAGUER	النقر	COMMUNE
1214	402	TALEB LARBI	الطالب العربى	COMMUNE
1215	395	SIDI KHELIL	سيدى خليل 	COMMUNE
1216	\N	HASSI KHELIFA	حاسى خليفة	COMMUNE
1217	\N	SIDI TIFOUR	سيدى طيفور	COMMUNE
1218	391	AIN MADHI	عين ماضى	COMMUNE
1219	\N	HADJ MECHRI BOUALEM	بوعلام	COMMUNE
1220	227	SIDI SLIMANE	سيدى سليمان	COMMUNE
1221	414	KSAR EL HIRANE	قصر الحيران	COMMUNE
1222	\N	TENDLA	تندلة	COMMUNE
1223	\N	MEKHAREG	المخرق	COMMUNE
1224	391	KHENEG	الخنق	COMMUNE
1225	391	TADJROUNA	تاجرونة	COMMUNE
1226	\N	HASSI DHELAA	حاسى الدلاعة	COMMUNE
1227	415	EL BAYADH	البيض	CHEF-LIEU-WILAYA
1228	416	M'RARA	مرارة	COMMUNE
1229	396	GUETTARA	قطارة	COMMUNE
1230	404	TOUSMOULINE	توسمولين	COMMUNE
1231	391	EL HAOUAITA	الحويطة	COMMUNE
1232	417	EL MEHARA	المحرة	COMMUNE
1233	418	GHASSOUL	الغاسول	COMMUNE
1234	416	DJAMAA	جامعة	COMMUNE
1235	\N	MECHRIA	مشرية	COMMUNE
1236	418	KRAKDA	كراكدة	COMMUNE
1237	419	AIN BEN KHELIL	عين بن خليل	COMMUNE
1238	\N	DOUAR EL MA	دوار الماء	COMMUNE
1239	420	DEBILA	الدبيلة	COMMUNE
1240	421	AIN EL ORAK	عين العراك	COMMUNE
1241	422	TAGHZOUT	تاغزوت	COMMUNE
1242	\N	TRIFAOU	الطريفاوى	COMMUNE
1243	423	NAAMA	النعامة	CHEF-LIEU-WILAYA
1244	416	SIDI AMRANE	سيدى عمران	COMMUNE
1245	420	HASSANI ABDELKRIM	حسانى عبد الكريم	COMMUNE
1246	\N	EL ALLIA	العلية	COMMUNE
1247	\N	HASSI RMEL	حاسى الرمل	COMMUNE
1248	408	OURMES	ورماس	COMMUNE
1249	424	KOUININE	كوينين	COMMUNE
1250	\N	EL OUED	الوادى	CHEF-LIEU-WILAYA
1251	227	SIDI SLIMANE	سيدى سليمان	COMMUNE
1252	418	BREZINA	بريزينة	COMMUNE
1253	425	BAYADHA	البياضة	COMMUNE
1254	426	OUED EL ALENDA	وادى العلندة	COMMUNE
1255	328	NAKHLA	النخلة	COMMUNE
1256	421	ARBAOUAT	عربوات	COMMUNE
1257	\N	MIH OUENSA	اميه و نسة	COMMUNE
1258	328	ROBBAH	الرباح	COMMUNE
1259	317	EL OGLA	العقلة	COMMUNE
1260	228	MEGARINE	المقارين	COMMUNE
1261	413	BENACEUR	ابن ناصر	COMMUNE
1262	427	TOUGGOURT	توقرت	COMMUNE
1263	427	ZAOUIA EL ABIDIA	الزاوبة لعابدية	COMMUNE
1264	427	TEBESBEST	تبسبست	COMMUNE
1265	417	CHELLALA	الشلالة	COMMUNE
1266	428	ASLA	عسلة	COMMUNE
1267	427	NEZLA	النزلة	COMMUNE
1268	429	BERRIANE	بريان	COMMUNE
1269	430	SFISSIFA	سفيسيفة	COMMUNE
1270	\N	EL ABIODH SIDI CHEIKH	الابيض سيدى الشيخ	COMMUNE
1271	431	TIOUT	تيوت	COMMUNE
1272	\N	TAMACINE	تماسين	COMMUNE
1273	431	AIN SEFRA	عين الصفراء	COMMUNE
1274	432	EL GUERRARA	القرارة	COMMUNE
1275	\N	BALIDAT AMEUR	بلدة عمر	COMMUNE
1276	\N	EL HADJIRA	الحجيرة	COMMUNE
1277	433	BOUSSEMGHOUN	بوسمغون	COMMUNE
1278	434	DHAYET BENDHAHOUA	ضاية بن ضحوة	COMMUNE
1279	435	METLILI	متليلى	COMMUNE
1280	435	SEBSEB	سبسب	COMMUNE
1281	421	EL BNOUD	البنود	COMMUNE
1282	436	GHARDAIA	غرداية	CHEF-LIEU-WILAYA
1283	437	BOUNOURA	بنورة	COMMUNE
1284	438	MOGHRAR	مغرار	COMMUNE
1285	437	EL ATTEUF	العطف	COMMUNE
1286	241	HASSI BEN ABDELLAH	حاسى بن عبد الله	COMMUNE
1287	439	HASSI MESSAOUD	حاسى مسعود	COMMUNE
1288	\N	NGOUSSA	نقوسة	COMMUNE
1289	440	ZELFANA	زلفانة	COMMUNE
1290	\N	DJENIEN BOUREZG	جنين بوزرق	COMMUNE
1291	162	MANSOURA	المنصورة	COMMUNE
1292	441	OUARGLA	ورقلة	CHEF-LIEU-WILAYA
1293	\N	BENI OUNIF	بني ونيف 	COMMUNE
1294	\N	HASSI LEFHAL	حاسى لفحل	COMMUNE
1295	442	EL BORMA	البرمة	COMMUNE
1296	441	ROUISSAT	الرويسات	COMMUNE
1297	443	EL MENIAA	المنيعة	COMMUNE
1298	\N	MOUGHEUL	موغل	COMMUNE
1299	444	BOUKAIS	بوكايس	COMMUNE
1300	241	SIDI KHOUILED	سيدى خويلد	COMMUNE
1301	445	BECHAR	بشار	CHEF-LIEU-WILAYA
1302	199	AIN BEIDA	عين البيضاء	COMMUNE
1303	444	LAHMAR	الاحمر	COMMUNE
1304	446	KENADSA	القنادسة	COMMUNE
1305	446	MERIDJA	المريجة	COMMUNE
1306	447	TINERKOUK	تنركوك	COMMUNE
1307	448	TAGHIT	تاغيت	COMMUNE
1308	\N	ERG FERRADJ	عرق فراج	COMMUNE
1309	449	ABADLA	العبادلة 	COMMUNE
1310	447	KSAR KADDOUR	قصر قدور	COMMUNE
1311	\N	MECHRAA HOUARI BOUMEDIENE	مشروع هوارى بومدين	COMMUNE
1312	450	EL OUATA	الواتة	COMMUNE
1313	451	TAMTERT	تامترت	COMMUNE
1314	452	IGLI	ايقلى	COMMUNE
1315	\N	BENI ABBES	بني عباس 	COMMUNE
1316	453	KERZAZ	كرزاز	COMMUNE
1317	454	TABELBALA	تبلبالة	COMMUNE
1318	\N	HASSI EL GARA	حاسى القارة	COMMUNE
1319	455	DEBDEB	دبداب	COMMUNE
1320	456	TIMIMOUN	تيميمون	COMMUNE
1321	453	TIMOUDI	تيمودى	COMMUNE
1322	27	OULED AISSA	اولاد عيسى	COMMUNE
1323	455	BORDJ OMAR DRISS	برج عمر ادريس	COMMUNE
1324	\N	BENI IKHLEF	بني يخلف	COMMUNE
1325	\N	FOUGGARET EZZAOUIA	فقارة الزوى	COMMUNE
1326	28	TALMINE	طلمين	COMMUNE
1327	\N	OULED KHODEIR	اولاد خضير	COMMUNE
1328	28	CHAROUINE	شروين	COMMUNE
1329	457	OUM EL ASSEL	أم العسل	COMMUNE
1330	456	OULED SAID	أولاد السعيد	COMMUNE
1331	397	AOUGROUT	أوقروت	COMMUNE
1332	458	KSABI	الاقصابى	COMMUNE
1333	\N	IN SALAH	عين صالح	COMMUNE
1334	396	DELDOUL	دلدول	COMMUNE
1335	459	TSABIT	تسابيت	COMMUNE
1336	457	TINDOUF	تندوف	CHEF-LIEU-WILAYA
1337	455	IN AMENAS	ان اميناس	COMMUNE
1338	397	METARFA	المطارفة	COMMUNE
1339	\N	TIMOKTEN	تيمقطن	COMMUNE
1340	\N	IN GHAR	ان غار	COMMUNE
1341	459	SEBAA	أسبع	COMMUNE
1342	\N	TAMENTIT	تمنطيط	COMMUNE
1343	460	ADRAR	أدرار	CHEF-LIEU-WILAYA
1344	460	BOUDA	بوده	COMMUNE
1345	\N	OULED AHMED TIMI	أولاد أحمد تيمي	COMMUNE
1346	461	ILLIZI	ايليزى	CHEF-LIEU-WILAYA
1347	462	FENOUGHIL	فنوغيل	COMMUNE
1348	462	TAMEST	تامست	COMMUNE
1349	463	ZAOUIET KOUNTA	زاوية كنتة	COMMUNE
1350	464	IDLES	ادلس	COMMUNE
1351	465	TIT	تيط	COMMUNE
1352	\N	INZEGMIR	انجز مير	COMMUNE
1353	466	SALI	سالي	COMMUNE
1354	465	AOULEF	أولف	COMMUNE
1355	466	REGGANE	رقان	COMMUNE
1356	\N	AKABILI	أقبلي	COMMUNE
1357	\N	IN AMGUEL	ان امقل	COMMUNE
1358	\N	BORDJ EL HAOUES	برج الحواس	COMMUNE
1359	467	BORDJ BADJI MOKHTAR	برج باجي مختار	COMMUNE
1360	468	DJANET	جانت	COMMUNE
1361	464	TAZROUK	تاظروك	COMMUNE
1362	469	TAMANRASSET	تامنغست	CHEF-LIEU-WILAYA
1363	\N	ABALESSA	ابلسة	COMMUNE
1364	\N	TIN ZAOUATINE	تين ظواتين	COMMUNE
1365	467	TIMIAOUINE	تيمياوين	COMMUNE
1366	\N	IN GUEZZAM	ان قزام 	COMMUNE
1367	470	AZEFFOUN	ازفون	COMMUNE-COTIERE
1368	471	IFLISSEN	افليسن	ILE
1369	471	IFLISSEN	افليسن	COMMUNE-COTIERE
1370	471	MIZRANA	مزرانة	COMMUNE-COTIERE
1371	471	TIGZIRT	تيقزيرت	COMMUNE-COTIERE
1372	\N	AIT CHAFFAA	ايت شافع	COMMUNE-COTIERE
1373	\N	AGHRIB	اغريب	COMMUNE
1374	472	ZEKRI	زكرى	COMMUNE
1375	473	TIMIZART	تيميزارت	COMMUNE
1376	470	AKERROU	اقرو	COMMUNE
1377	474	BOUDJIMA	بوجيمة	COMMUNE
1378	474	MAKOUDA	ماكودة	COMMUNE
1379	475	RAIS HAMIDOU	الرئيس حميدو	COMMUNE-COTIERE
1380	472	FREHA	فريحة	COMMUNE
1381	23	EL MARSA	المرسى	COMMUNE-COTIERE
1382	\N	BAINS ROMAINS	الحمامات	COMMUNE-COTIERE
1383	\N	BOLOGHINE IBN ZIRI	بولوغين بن زيرى	COMMUNE-COTIERE
1384	476	BOUZAREAH	بوزريعة	COMMUNE
1385	136	SIDI NAAMANE	سيدي نعمان	COMMUNE
1386	73	AIN BENIAN	عين البنيان	COMMUNE-COTIERE
1387	24	AIN TAYA	عين طاية	COMMUNE-COTIERE
1388	24	BORDJ EL BAHRI	برج البحري	COMMUNE-COTIERE
1389	476	BENI MESSOUS	بنىى مسوس	COMMUNE
1390	475	BAB EL OUED	باب الوادى	COMMUNE-COTIERE
1391	472	AZAZGA	عزازقة	COMMUNE
1392	475	OUED KORICHE	واد قريش	COMMUNE
1393	473	OUAGUENOUN	واقنون	COMMUNE
1394	475	CASBAH	القصبة	COMMUNE-COTIERE
1395	\N	HARAOUA	الهراوة	COMMUNE-COTIERE
1396	477	REGHAIA	الرغاية	COMMUNE-COTIERE
1397	\N	YAKOUREN	ايعكورن	COMMUNE
1398	\N	ALGER	الجزائر	CHEF-LIEU-WILAYA
1399	73	CHERAGA	الشيقارة	COMMUNE-COTIERE
1400	\N	AIT AISSA MIMOUN	جبل عيسى ميمون	COMMUNE
1401	476	EL BIAR	الابيار	COMMUNE
1402	24	BORDJ EL KIFFAN	برج الكيفان	COMMUNE-COTIERE
1403	\N	ALGER	الجزائر	PORT
1404	477	ROUIBA	رويبة 	COMMUNE
1405	\N	DELY BRAHIM	دالى ابراهيم	COMMUNE
1406	478	TADMAIT	تادمايت	COMMUNE
1407	\N	SIDI MHAMED	سيدى امحمد	COMMUNE
1408	476	BEN AKNOUN	بن عكنون	COMMUNE
1409	479	STAOUELI	سطاوالى	COMMUNE-COTIERE
1410	480	EL MOURADIA	المرادية	COMMUNE
1411	481	HYDRA	حيدرة	COMMUNE
1412	\N	HAMMA ANASSERS	الحامة العناصر	COMMUNE-COTIERE
1413	\N	TIZI OUZOU	تيزى وزو	CHEF-LIEU-WILAYA
1414	\N	DRAA BEN KHEDDA	ذراع بن خدة	COMMUNE
1415	480	EL MADANIA	المدنية	COMMUNE
1416	482	EL ACHOUR	العشور	COMMUNE
1417	483	HUSSEIN DEY	حسين داى	COMMUNE-COTIERE
1418	73	OULED FAYET	أولاد فايت	COMMUNE
1419	24	MOHAMMADIA	المحمدية	COMMUNE-COTIERE
1420	483	KOUBA	القبة	COMMUNE
1421	484	MEKLA	مقلع	COMMUNE
1422	481	BIR MOURAD RAIS	بئر مراد رايس	COMMUNE
1423	\N	BEB EZZOUAR	باب الزوار	COMMUNE
1424	24	DAR EL BEIDA	الدار البيضاء	COMMUNE
1425	483	EL MAGHARIA	المقرية	COMMUNE
1426	479	SOUIDANIA	سويدانية	COMMUNE
1427	482	DRARIA	الدرارية	COMMUNE
1428	479	ZERALDA	زرالدة	COMMUNE-COTIERE
1429	\N	BIR KHADEM	بئر خادم	COMMUNE
1430	\N	BACH DJERRAH	باش جراح	COMMUNE
1431	234	SOUAMAA	الصوامع	COMMUNE
1432	485	EL HARRACH	الحراش	COMMUNE
1433	485	BOUROUBA	بوروبة	COMMUNE
1434	485	OUED SMAR	واد السمار	COMMUNE
1435	\N	AIT KHELILI	ايت خليلى	COMMUNE
1436	\N	SAOULA	السحاولة	COMMUNE
1437	486	IDJEUR	ايجر	COMMUNE
1438	\N	DJISR KSENTINA	جسر قسنطينة	COMMUNE
1439	\N	TIZI RACHED	تيزى راشد	COMMUNE
1440	\N	MAHELMA	المعالمة	COMMUNE
1441	482	BABA HASSEN	بابا حسن	COMMUNE
1442	\N	DOUERA	الدويرة	COMMUNE
1443	478	TIRMITINE	تيرمتين	COMMUNE
1444	487	BARAKI	براقى	COMMUNE
1445	479	RAHMANIA	الرحمانية	COMMUNE
1446	488	IRDJEN	ارجن	COMMUNE
1447	472	IFIGHA	ايفيغاء	COMMUNE
1448	487	LES EUCALYPTUS	الكاليتوس	COMMUNE
1449	482	KHRAISSIA	الخرايصية	COMMUNE
1450	\N	BENI AISSI	بنى عيسى	COMMUNE
1451	489	AIT YAHIA MOUSSA	آيت يحيى موسى	COMMUNE
1452	\N	AIT OUMALOU	ايت اومالو	COMMUNE
1453	\N	LARBA NAIT IRATHEN	الاربعاء نايت ايراثن	COMMUNE
1454	490	BENI ZMENZER	بنى زمنزر	COMMUNE
1455	491	MEFTAH	مفتاح	COMMUNE
1456	\N	BIRTOUTA	بئر توتة	COMMUNE
1457	\N	BENI DOUALA	بنى دوالة	COMMUNE
1458	\N	BOUZGUEN	بوزقان	COMMUNE
1459	\N	MKIRA	مقيرة	COMMUNE
1460	\N	TASSALA EL MERDJA	تسالة المرجة	COMMUNE
1461	488	AIT AGGOUACHA	ايت قواشة	COMMUNE
1462	212	LARBAA	لرباع	COMMUNE
1463	487	SIDI MOUSSA	سيدى موسى	COMMUNE
1464	\N	MAATKA	المعاتقة	COMMUNE
1465	65	SOUK EL TENINE	سوق الاثنين	COMMUNE
1466	\N	BEN KHELIL	بن خليل	COMMUNE
1467	\N	AIT YAHIA	ايت يحيى	COMMUNE
1468	\N	AIT MAHMOUD	ايت محمود	COMMUNE
1469	492	OULED CHEBEL	أولاد الشبل	COMMUNE
1470	\N	ILOULA OUMALOU	ايلولة اومالو	COMMUNE
1471	\N	AIN ZAOUIA	عين الزاوية	COMMUNE
1472	493	CHEBLI	الشبلى	COMMUNE
1473	\N	TIZI GHENIF	تيزى غنيف	COMMUNE
1474	491	DJEBABRA	الجبابرة	COMMUNE
1475	266	BOUFARIK	بوفاريك	COMMUNE
1476	494	BOUDERBALA	بودربالة	COMMUNE
1477	495	IMSOUHAL	امسوحال	COMMUNE
1478	\N	DRAA EL MIZAN	ذراع الميزان	COMMUNE
1479	\N	BENI YENNI	بنى ينى	COMMUNE
1480	494	LAKHDARIA	الاخضرية	COMMUNE
1481	\N	AIN EL HAMMAM	عين الحمام	COMMUNE
1482	496	OUED EL ALLEUG	وادى العلايق	COMMUNE
1483	276	OULED SLAMA	اولاد سلامة	COMMUNE
1484	\N	OUADHIA	واضية	COMMUNE
1485	276	BOUGARA	بوقرة	COMMUNE
1486	497	KADIRIA	القادرية	COMMUNE
1487	\N	TIZI NTHLETA	تيزى نالثلاثاء	COMMUNE
1488	\N	BENI ZIKI	بنى زيكى	COMMUNE
1489	498	MOUZAIA	موزاية	COMMUNE
1490	495	IFERHOUNENE	افرحونن	COMMUNE
1491	\N	MECHTRASS	مشتراس	COMMUNE
1492	499	BOGHNI	بوغنى	COMMUNE
1493	213	SOUHANE	سوحان	COMMUNE
1494	235	BENI MERED	بنى مراد	COMMUNE
1495	\N	BENI TAMOU	بنى تامو	COMMUNE
1496	\N	AIT TOUDERT	ايت تودرت	COMMUNE
1497	494	BOUKRAM	بوكرم	COMMUNE
1498	\N	ABI YOUCEF	ابى يوسف	COMMUNE
1499	\N	IBOUDRAREN	ايبودرارن	COMMUNE
1500	493	BOUINAN	بوعينان	COMMUNE
1501	500	OUACIF	واسيف	COMMUNE
1502	497	AOMAR	عمر	COMMUNE
1503	\N	YATAFEN	اعطافن	COMMUNE
1504	266	SOUMAA	الصومعة	COMMUNE
1505	266	GUERROUAOU	قرواو	COMMUNE
1506	501	AKBIL	اقبيل	COMMUNE
1507	494	MAALA	معلة	COMMUNE
1508	\N	AIT BOUADOU	ايت بوعدو	COMMUNE
1509	\N	AGHNI GOUGHRAN	أقنى قغران	COMMUNE
1510	495	ILLILTEN	ايليتن	COMMUNE
1511	\N	ASSI YOUCEF	اسى يوسف	COMMUNE
1512	489	FRIKAT	فريقات	COMMUNE
1513	494	GUERROUMA	قرومة	COMMUNE
1514	499	BOUNOUH	بو نوح	COMMUNE
1515	235	OULED YAICH	أولاد يعيش	COMMUNE
1516	\N	HAMMAM MELOUANE	حمام ملوان	COMMUNE
1517	502	BLIDA	البليدة	CHEF-LIEU-WILAYA
1518	\N	EL AFFROUN	العفرون	COMMUNE
1519	\N	ZBARBAR	زبربر	COMMUNE
1520	500	AIT BOUMAHDI	ايت بومهدى	COMMUNE
1521	498	CHIFFA	شفة	COMMUNE
1522	497	DJEBAHIA	جباحية	COMMUNE
1523	235	CHREA	الشريعة	COMMUNE
1524	297	SAHARIDJ	الصهاريج	COMMUNE
1525	297	AGHBALOU	اغبالو	COMMUNE
1526	\N	EL MOKRANI	المقرانى	COMMUNE
1527	251	AIT LAAZIZ	آيت لعزيز	COMMUNE
1528	\N	OUED DJER	واد جر	COMMUNE
1529	503	BECHLOUL	بشلول	COMMUNE
1530	502	BOUARFA	بوعرفة	COMMUNE
1531	422	HAIZER	حيزر	COMMUNE
1532	503	EL ASNAM	الاسنام	COMMUNE
1533	503	EL ADJIBA	العجيبة	COMMUNE
1534	422	TAGHZOUT	تاغزوت	COMMUNE
1535	251	AIN TURK	عين الترك	COMMUNE
1536	504	SOUK EL KHEMIS	سوق الخميس	COMMUNE
1537	498	AIN ROMANA	عين رمانة	COMMUNE
1538	\N	AIN BESSAM	عين بسام	COMMUNE
1539	251	BOUIRA	البويرة	CHEF-LIEU-WILAYA
1540	377	AIN EL HADJAR	عين الحجر	COMMUNE
1541	297	CHORFA	الشرفاء	COMMUNE
1542	\N	MCHEDALLAH	مشدالة	COMMUNE
1543	297	ATH MANSOUR	آث منصور	COMMUNE
1544	\N	AHNIF	احنيف	COMMUNE
1545	505	EL KHABOUZIA	الخبوزية	COMMUNE
1546	377	AIN LALOUI	عين العلوى	COMMUNE
1547	506	OUED EL BERDI	وادى البردى	COMMUNE
1548	506	EL HACHIMIA	الهاشمية	COMMUNE
1549	505	BIR GHBALOU	بئر غبالو	COMMUNE
1550	503	AHL EL KSAR	اهل القصر	COMMUNE
1551	503	OULED RACHED	اولاد راشد	COMMUNE
1552	505	RAOURAOUA	روراوة	COMMUNE
1553	376	SOUR EL GHOZLANE	سور الغزلان	COMMUNE
1554	376	DECHMIA	الدشمية	COMMUNE
1555	507	MEZDOUR	مزدور	COMMUNE
1556	\N	BORDJ OUKHRISS	برج اوخريص	COMMUNE
1557	\N	EL HAKIMIA	الحاكمية	COMMUNE
1558	376	RIDANE	ريدان	COMMUNE
1559	376	DIRAH	ديرة	COMMUNE
1560	376	MAAMORA	المعمورة	COMMUNE
1561	\N	TAGUEDIT	تاقديت	COMMUNE
1562	507	HADJERA ZERGA	الحجرة الزرقاء	COMMUNE
1563	38	AMMAL	عمال	COMMUNE-COTIERE
\.


--
-- Data for Name: Conversation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Conversation" (id, "user1Id", "user2Id", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Daira; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Daira" (id_daira, id_wilaya, "nom_dairaFR", "nom_dairaAR") FROM stdin;
1	39	Zitouna	الزيتونة
2	39	Collo	القل
3	5	Chetaibi	شطايبي
4	39	Ouled Attia	أولاد عطية
5	5	Berrahal	برحال
6	39	El Tarf	الطارف
7	5	Annaba	عنابة
8	39	Ben Azzouz	بن عزوز
9	39	El Hadaiek	الحدائق
10	39	Tamalous	تمالوس
11	19	El Kala	القالة
12	39	Azzaba	عزابة
13	23	El Milia	الميلية
14	13	Dellys	دلس
15	39	Skikda	سكيكدة
16	13	Baghlia	بغلية
17	19	Ben M'hidi	بن مهيدي
18	13	Bordj Menaiel	برج منايل
19	39	Ain Kechra	عين قشرة
20	5	El Bouni	البوني
21	8	El Kseur	القصر
22	23	Chekfa	الشقفة
23	39	El Marsa	المرسى
24	39	Dar El Beida	الدار البيضاء
25	23	El Ancer	العنصر
26	19	Bouteldja	بوثلجة
27	13	Naciria	الناصرية
28	13	Charouine	شروين
29	8	Bejaia	بجاية
30	23	Jijel	جيجل
31	23	Taher	الطاهير
32	5	El Hadjar	الحجار
33	23	Beni Saf	بني صاف
34	39	Ramdane Djamel	رمضان جمال
35	23	El Aouana	العوانة
36	23	Texenna	تاكسنة
37	8	Adekar	أدكار
38	13	Thenia	الثنية
39	5	Ain El Berda	عين الباردة
40	39	Sidi Mezghiche	سيدي مزغيش
41	19	Besbes	البسباس
42	19	Sidi Khaled	سيدي  خالد
43	13	Boudouaou	بودواو
44	13	Boumerdes	بومرداس
45	39	Oum Toub	أم الطوب
46	13	Isser	يسر
47	23	Settara	السطارة
48	39	El Harrouch	الحروش
49	8	Tichy	تيشي
50	19	Drean	الذرعان
51	13	Khemis El Khechna	خميس الخشنة
52	13	Ramka	الرمكة
53	45	Fouka	فوكة
54	8	Chemini	شميني
55	8	Amizour	أميزور
56	8	Sidi Aich	سيدي عيش
57	13	Timezrit	تيمزريت
58	21	Guelaat Bousbaa	قلعة بوصبع
59	45	Bou Ismail	بواسماعيل
60	21	Heliopolis	هيليوبوليس
61	23	Sidi Marouf	سيدي معروف
62	21	Bouchegouf	بوشقوف
63	45	Kolea	القليعة
64	21	Hammam Debagh	حمام دباغ
65	8	Souk El Tenine	سوق الإثنين
66	45	Khemisti	خميستي
67	19	Boutlelis	بوتليليس
68	19	Bouhadjar	بوحجار
69	45	Sidi Amar	سيدي أعمر
70	15	Zighoud Youcef	زيغود يوسف
71	28	Grarem Gouga	القرارم قوقة
72	8	Barbacha	برباشة
73	28	Cheraga	الشراقة
74	28	Terrai Bainen	ترعي باينان
75	8	Darguina	درقينة
76	37	Babor	بابور
77	45	Cherchell	شرشال
78	8	Ifri Ouzellaguene	إفري أوزلاقن
79	45	Sidi Boubekeur	سيدي بوبكر
80	45	Ahmar El Ain	أحمر العين
81	45	Gouraya	قوراية
82	8	Seddouk	صدوق
83	45	Damous	الداموس
84	28	Tassadane Haddada	تسدان حدادة
85	45	Hadjout	حجوط
86	14	Beni Haoua	بني حواء
87	14	Tenes	تنس
88	28	Sidi Merouane	سيدي مروان
89	37	Amoucha	عموشة
90	37	Bouandas	بوعنداس
91	8	Kherrata	خراطة
92	21	Ain Hessainia	عين حساينية
93	8	Akbou	أقبو
94	28	Oued Endja	وادي النجاء
95	28	Rouached	الرواشد
96	14	Ain Kermes	عين كرمس
97	15	Hamma Bouziane	حامة بوزيان
98	28	Mila	ميلة
99	37	Beni Ourtilane	بني ورتيلان
100	27	Tablat	تابلاط
101	21	Guelma	قالمة
102	28	Ain Beida Harriche	عين البيضاء أحريش
103	21	Oued Zenati	وادي الزناتي
104	14	Zeboudja	الزبوجة
105	28	Ferdjioua	فرجيوة
106	40	Ouled Driss	أولاد إدريس
107	14	Abou El Hassane	أبو الحسن
108	27	El Azizia	العزيزية
109	15	Ben Badis	بن باديس
110	15	Ain Abid	عين عبيد
111	15	Constantine	قسنطينة
112	2	El Amra	العامرة
113	40	Haddada	الحدادة
114	37	Beni Aziz	بني عزيز
115	37	Ain El Kebira	عين الكبيرة
116	27	El Omaria	العمارية
117	2	Miliana	مليانة
118	8	Ighil Ali	إغيل علي
119	8	Tazmalt	تازملت
120	15	Ibn Ziad	ابن زياد
121	11	Djaafra	جعافرة
122	37	Djemila	جميلة
123	21	Hammam N'bails	حمام النبايل
124	15	El Khroub	الخروب
125	2	Boumedfaa	بومدفع
126	27	Ouzera	وزرة
127	37	Hammam Guergour	حمام قرقور
128	37	Guenzet	قنزات
129	37	Ain Arnat	عين أرنات
130	37	Bougaa	بوقاعة
131	28	Bouhatem	بوحاتم
132	27	Medea	المدية
133	21	Ain Makhlouf	عين مخلوف
134	14	Taougrit	تاوقريت
135	14	Oued Fodda	وادي الفضة
136	27	Sidi Naamane	سيدي نعمان
137	40	Merahna	المراهنة
138	28	Chelghoum Laid	شلغوم العيد
139	29	Achaacha	عشعاشة
140	14	Ouled Fares	أولاد فارس
141	21	Khezaras	خزارة
142	11	Bir Kasdali	بئر قاصد علي
143	40	Souk Ahras	سوق أهراس
144	27	Guelb El Kebir	القلب الكبير
145	14	Ain Merane	عين مران
146	27	Ouamri	عوامري
147	2	Djendel	جندل
148	37	Bir El Arch	بئر العرش
149	2	Ouled Brahim	أولاد ابراهيم
150	2	Sedrata	سدراتة
151	11	Ouled Sidi Brahim	أولاد سيدي ابراهيم
152	27	Beni Slimane	بني سليمان
153	11	Bordj Zemmoura	برج زمورة
154	28	Tadjenanet	تاجنانت
155	2	Rouina	الروينة
156	40	Taoura	تاورة
157	28	Teleghma	التلاغمة
158	14	Chlef	الشلف
159	37	Guidjel	قجال
160	2	Djelida	جليدة
161	37	Setif	سطيف
162	11	Mansourah	منصورة
163	11	Medjana	مجانة
164	40	M'daourouche	مداوروش
165	11	Ain Taghrout	عين تاغروت
166	27	Berrouaghia	البرواقية
167	27	Si Mahdjoub	سي المحجوب
168	35	Sidi M'hamed Ben Ali	سيدي أمحمد بن علي
169	37	El Eulma	العلمة
170	2	El Attaf	العطاف
171	34	Sigus	سيقوس
172	29	Sidi Ali	سيدي علي
173	40	Bir Bouhouche	بئر بوحوش
174	29	Sidi Lakhdar	سيدي لخضر
175	14	Boukadir	بوقادير
176	37	Chechar	ششار
177	34	Ain M'lila	عين مليلة
178	14	El Karimia	الكريمية
179	27	Souaghi	السواقي
180	35	Mazouna	مازونة
181	34	Ksar Sbahi	قصر الصباحي
182	27	Seghouane	سغوان
183	2	Ain Lechiakh	عين الاشياخ
184	2	Bathia	بطحية
185	11	Relizane	غليزان
186	27	Ouled Antar	أولاد عنتر
187	37	Ain Oulmene	عين ولمان
188	40	Oum El Adhaim	أم العظايم
189	35	Oued Rhiou	وادي رهيو
190	34	Ain Babouche	عين ببوش
191	14	Ouled Ben Abdelkader	أولاد بن عبد القادر
192	37	Ain Azel	عين أزال
193	35	Djidiouia	جديوية
194	27	Chellalat El Adhaoura	شلالة العذاورة
195	11	El Hamadia	الحمادية
196	29	Mostaganem	مستغانم
197	46	Lazharia	الأزهرية
198	34	Souk Naamane	سوق نعمان
199	34	Ain Beida	عين البيضاء
200	29	Ain Tedeles	عين تادلس
201	37	Hammam Sokhna	حمام السخنة
202	11	Ras El Oued	رأس الوادي
203	34	Ain Kercha	عين كرشة
204	11	Bordj Ghedir	برج الغدير
205	29	Kheir Eddine	خير الدين
206	27	Ain Boucif	عين بوسيف
207	35	El Matmar	المطمر
208	46	Theniet El Had	ثنية الاحد
209	46	Bordj Emir Abdelkader	برج الأمير عبد القادر
210	34	Oum El Bouaghi	أم البواقي
211	27	Aziz	عزيز
212	46	Bouzina	بوزينة
213	46	Larbaa	الأربعاء
214	42	Ouenza	الونزة
215	30	Sidi Aissa	سيدي عيسى
216	35	El H'madna	الحمادنة
217	29	Bouguirat	بوقيراط
218	27	Ksar El Boukhari	قصر البخاري
219	35	Ammi Moussa	عمي موسى
220	46	Bordj Bounaama	برج بونعامة
221	32	Arzew	أرزيو
222	6	Ain Djasser	عين جاسر
223	37	Salah Bey	صالح باي
224	29	Mesra	ماسرة
225	46	Lardjem	لرجام
226	30	Ain El Hadjel	عين الحجل
227	46	Boualem	بوعلام
228	46	Megarine	المقارين
229	34	Meskiana	مسكيانة
230	30	Hammam Dalaa	حمام الضلعة
231	42	El Aouinet	العوينات
232	35	Zemmoura	زمورة
233	6	El Madher	المعذر
234	30	Ouled Derradj	أولاد دراج
235	35	Ouled Yaich	أولاد يعيش
236	6	Seriana	سريانة
237	30	M'sila	المسيلة
238	32	Gdyel	قديل
239	29	Hassi Mameche	حاسي ماماش
240	16	Birine	بيرين
241	34	Sidi Khouiled	سيدي خويلد
242	27	Chahbounia	الشهبونية
243	32	Bethioua	بطيوة
244	35	Yellel	يلل
245	34	F'kirina	فكيرينة
246	29	Ain Nouicy	عين نويسي
247	6	Ras El Aioun	رأس العيون
248	30	Magra	مقرة
249	46	Ammari	عماري
250	32	Bir El Djir	بئر الجير
251	32	Bouira	البويرة
252	32	Ain Turk	عين الترك
253	32	Oran	وهران
254	6	Merouana	مروانة
255	26	Mohammadia	المحمدية
256	35	Mendes	منداس
257	26	Oggaz	عقاز
258	3	El Amria	العامرية
259	43	Meghila	مغيلة
260	32	Oued Tlelat	وادي تليلات
261	6	Chemora	الشمرة
262	32	Es Senia	السانية
263	43	Oued Lili	وادي ليلي
264	46	Tissemsilt	تيسمسيلت
265	24	Kais	قايس
266	30	Boufarik	بوفاريك
267	6	Ouled Si Slimane	أولاد سي سليمان
268	6	Batna	باتنة
269	42	Morsott	مرسط
270	30	Chellal	شلال
271	6	Timgad	تيمقاد
272	43	Rahouia	رحوية
273	6	Djezzar	الجزار
274	42	El Kouif	الكويف
275	6	Tazoult	تازولت
276	43	Bougara	بوقرة
277	43	Hamadia	حمادية
278	34	Dhalaa	الضلعة
279	24	El Hamma	الحامة
280	16	Had Sahary	حد الصحاري
281	26	El Bordj	البرج
282	26	Sig	سيق
283	43	Mahdia	مهدية
284	26	Zahana	زهانة
285	16	Sidi Laadjel	سيدي لعجال
286	24	Ain Touila	عين الطويلة
287	6	Ain Touta	عين التوتة
288	42	Bir Mokadem	بئر مقدم
289	26	Ain El Melh	عين الملح
290	26	Ain Fares	عين فارس
291	43	Dahmouni	دحموني
292	30	Sidi Ameur	سيدي عامر
293	26	Bouhanifia	بوحنيفية
294	26	Oued El Abtal	وادي الأبطال
295	3	Ain Larbaa	عين الأربعاء
296	26	Tighennif	تيغنيف
297	26	M'chedallah	مشد الله
298	24	Bouhmama	بوحمامة
299	6	Theniet El Abed	ثنية العابد
300	42	Tebessa	تبسة
301	6	N'gaous	نقاوس
302	6	Barika	بريكة
303	43	Mechraa Sfa	مشرع الصفا
304	24	Khenchela	خنشلة
305	38	Ain El Berd	عين البرد
306	3	El Maleh	المالح
307	24	Ouled Rechache	أولاد رشاش
308	6	Ichemoul	إشمول
309	26	Hachem	الحشم
310	26	Ghriss	غريس
311	26	Mascara	معسكر
312	6	Seggana	سقانة
313	26	Tizi	تيزي
314	30	Khoubana	خبانة
315	43	Tiaret	تيارت
316	6	Arris	أريس
317	42	El Ogla	العقلة
318	38	Sfisef	سفيزف
319	24	Babar	بابار
320	3	Ain Temouchent	عين تموشنت
321	42	Cheria	الشريعة
322	38	Tessala	تسالة
323	3	Hammam Bou Hadjar	حمام بوحجر
324	42	Bir El Ater	بئر العاتر
325	43	Ksar Chellala	قصر الشلالة
326	43	Medroussa	مدروسة
327	43	Sougueur	السوقر
328	42	Robbah	الرباح
329	30	Menaa	منعة
330	30	Medjedel	امجدل
331	43	Frenda	فرندة
332	38	Mostefa  Ben Brahim	مصطفى بن ابراهيم
333	16	Ain Oussera	عين وسارة
334	3	Ain Kihel	عين الكيحل
335	9	El Kantara	القنطرة
336	26	Ain Fekan	عين فكان
337	38	Sidi Lahcene	سيدي لحسن
338	6	Tkout	تكوت
339	26	Oued Taria	وادي التاغية
340	48	Honnaine	هنين
341	42	Oum Ali	أم علي
342	48	Remchi	الرمشي
343	26	Aouf	عوف
344	16	Hassi Bahbah	حاسي بحبح
345	38	Sidi Ali Boussidi	سيدي علي بوسيدي
346	16	Dar Chioukh	دار الشيوخ
347	9	Djemorah	جمورة
348	48	Bensekrane	بن سكران
349	43	Ain Deheb	عين الذهب
350	9	El Outaya	الوطاية
351	38	Tenira	تنيرة
352	48	Ghazaouet	الغزوات
353	48	Nedroma	ندرومة
354	30	Djebel Messaad	جبل مساعد
355	9	Tolga	طولقة
356	48	Ain Tellout	عين تالوت
357	48	Fellaoucene	فلاوسن
358	48	Chetouane	شتوان
359	30	Ben Srour	بن سرور
360	9	Mechouneche	مشونش
361	38	Sidi Ali Ben Youb	سيدي علي بن يوب
362	48	Hennaya	الحناية
363	36	Youb	يوب
364	48	Bab El Assa	باب العسة
365	48	Maghnia	مغنية
366	38	Telagh	تلاغ
367	48	Ouled Mimoun	أولاد ميمون
368	48	Tlemcen	تلمسان
369	48	Sabra	صبرة
370	9	Sidi Okba	سيدي عقبة
371	38	Moulay Slissen	مولاي سليسن
372	9	Biskra	بسكرة
373	36	El Hassasna	الحساسنة
374	36	Saida	سعيدة
375	38	Merine	مرين
376	36	Sour El Ghozlane	سور الغزلان
377	36	Ain Bessem	عين بسام
378	36	Ain El Hadjar	عين الحجر
379	9	Foughala	فوغالة
380	48	Beni Boussaid	بني بوسعيد
381	16	Djelfa	الجلفة
382	9	Zeribet El Oued	زريبة الوادي
383	9	Ourlal	أورلال
384	51	Ouled Djellal	أولاد جلال
385	48	Beni Snous	بني سنوس
386	16	Charef	الشارف
387	48	Sebdou	سبدو
388	42	Negrine	نقرين
389	38	Marhoum	مرحوم
390	16	Ain El Ibel	عين الإبل
391	25	Ain Madhi	عين ماضي
392	48	Sidi Djillali	سيدي الجيلالي
393	38	Ras El Ma	راس الماء
394	16	El Idrissia	الادريسية
395	57	El Meghaier	المغير
396	16	Messaad	مسعد
397	16	Aougrout	أوقروت
398	25	Gueltat Sidi Saad	قتلة سيدي سعيد
399	17	Rogassa	رقاصة
400	25	Aflou	أفلو
401	18	Reguiba	الرقيبة
402	18	Taleb Larbi	الطالب العربي
403	25	Oued Morra	وادي مرة
404	17	Bougtoub	بوقطب
405	25	Sidi Makhlouf	سيدي مخلوف
406	31	Mekmen Ben Amar	مكمن بن عمار
407	18	Magrane	المقرن
408	18	Guemar	قمار
409	25	Brida	بريدة
410	16	Faidh El Botma	فيض البطمة
411	25	El Ghicha	الغيشة
412	25	Laghouat	الأغواط
413	55	Taibet	الطيبات
414	25	Ksar El Hirane	قصر الحيران
415	17	El Bayadh	البيض
416	57	Djamaa	جامعة
417	17	Chellala	شلالة
418	17	Brezina	بريزينة
419	31	Mecheria	المشرية
420	18	Debila	الدبيلة
421	17	Labiodh Sidi Cheikh	الأبيض سيدي الشيخ
422	18	Haizer	الحيزر
423	31	Naama	النعامة
424	18	El Oued	الوادي
425	18	Bayadha	البياضة
426	18	Mih Ouensa	اميه وانسة
427	55	Touggourt	تقرت
428	31	Asla	عسلة
429	20	Berriane	بريان
430	31	Sfissifa	سفيسيفة
431	31	Ain Sefra	عين الصفراء
432	20	El Guerrara	القرارة
433	17	Boussemghoun	بوسمغون
434	20	Dhayet Ben Dhahoua	ضاية بن ضحوة
435	20	Metlili	متليلي
436	20	Ghardaia	غرداية
437	20	Bounoura	بونورة
438	31	Moghrar	مغرار
439	33	Hassi Messaoud	حاسي مسعود
440	20	Zelfana	زلفانة
441	33	Ouargla	ورقلة
442	33	El Borma	البرمة
443	58	El Menia	المنيعة
444	7	Lahmar	لحمر
445	7	Bechar	بشار
446	7	Kenadsa	القنادسة
447	49	Tinerkouk	تنركوك
448	7	Taghit	تاغيت
449	7	Abadla	العبادلة
450	52	El Ouata	الواتة
451	52	Beni Abbes	بني عباس
452	52	Igli	إقلي
453	52	Kerzaz	كرزاز
454	52	Tabelbala	تبلبالة
455	22	In Amenas	إن أمناس
456	49	Timimoun	تيميمون
457	44	Tindouf	تندوف
458	52	Ouled Khodeir	أولاد خضير
459	1	Tsabit	تسابيت
460	1	Adrar	أدرار
461	22	Illizi	إيليزي
462	1	Fenoughil	فنوغيل
463	1	Zaouiat Kounta	زاوية كنتة
464	41	Tazrouk	تاظروك
465	1	Aoulef	أولف
466	1	Reggane	رقان
467	50	Bordj Badji Mokhtar	برج باجي مختار
468	56	Djanet	جانت
469	41	Tamanrasset	تمنراست
470	47	Azeffoun	أزفون
471	47	Tigzirt	تيقزيرت
472	47	Azazga	عزازقة
473	47	Ouaguenoun	واقنون
474	47	Makouda	ماكودة
475	4	Bab El Oued	باب الوادي
476	4	Bouzareah	بوزريعة
477	4	Rouiba	الرويبة
478	47	Draa Ben Khedda	ذراع بن خدة
479	4	Zeralda	زرالدة
480	4	Sidi M'hamed	سيدي امحمد
481	4	Bir Mourad Rais	بئر مراد رايس
482	4	Draria	الدرارية
483	4	Hussein Dey	حسين داي
484	47	Mekla	مقلع
485	4	El Harrach	الحراش
486	47	Bouzeguene	بوزقن
487	4	Baraki	براقي
488	47	Larbaa Nath Iraten	الأربعاء ناث إيراثن
489	47	Draa El Mizan	ذراع الميزان
490	47	Beni Douala	بني دوالة
491	10	Meftah	مفتاح
492	4	Birtouta	بئر توتة
493	10	Bouinan	بوعينان
494	12	Lakhdaria	الأخضرية
495	47	Iferhounene	إفرحونان
496	10	Oued El Alleug	وادي العلايق
497	12	Kadiria	القادرية
498	10	Mouzaia	موزاية
499	47	Boghni	بوغني
500	47	Ouacif	واسيف
501	47	Ain El Hammam	عين الحمام
502	10	Blida	البليدة
503	12	Bechloul	بشلول
504	12	Souk El Khemis	سوق الخميس
505	12	Bir Ghbalou	بئر غبالو
506	12	El Hachimia	الهاشمية
507	12	Bordj Okhriss	برج أوخريص
\.


--
-- Data for Name: DecisionCD; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DecisionCD" (id_decision, id_comite, numero_decision, duree_decision, commentaires, decision_cd) FROM stdin;
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Document" (id_doc, nom_doc, description, format, taille_doc) FROM stdin;
1	Demande sur imprime de l'agence nationale des activites minieres	Formulaire officiel de demande	PDF	A4
2	Copie des statuts de la societe	Statuts juridiques de la societe demandeuse	PDF	Variable
3	Copie du registre de commerce	Preuve d'enregistrement commercial	PDF	Variable
4	Justificatifs de capacites techniques	Competences en recherches minieres et moyens techniques	PDF	Variable
5	Justificatifs des capacites financieres	Bilans et comptes d'exploitation des 3 derniers exercices	PDF	Variable
6	Programme et planning des travaux	Detail des travaux prevus et methodes de prospection	PDF	Variable
7	Carte topographique INCT	Carte localisant le perimetre demande avec coordonnees UTM	PDF/Image	1/25.000 au 1/50.000 ou 1/200.000
8	Cahier des charges renseigne	Document contractuel dument complete et signe	PDF	Variable
9	Demande de renouvellement sur imprime de l'agence	Formulaire officiel de demande de prorogation	PDF	A4
10	Rapport sur les travaux effectues	Bilan des travaux realises pendant la periode precedente	PDF	Variable
11	Programme et planning des nouveaux travaux	Detail des travaux prevus pour la periode de renouvellement	PDF	Variable
12	Carte topographique INCT actualisee	Carte localisant le perimetre avec coordonnees UTM	PDF/Image	1/25.000 au 1/50.000 ou 1/200.000
13	Justificatifs de capacites techniques	Competences en exploration miniere et moyens techniques	PDF	Variable
14	Memoire sur les travaux realises	Rapport sur les resultats des explorations precedentes	PDF	Variable
15	Presentation de l'objectif et methodologie	Etude de mise en valeur du gisement	PDF	Variable
16	Programme de developpement des travaux	Couts, planning et methodes d'exploration	PDF	Variable
17	Encadrement technique et emploi	Plan de ressources humaines	PDF	Variable
18	Etude d'impact sur l'environnement	Analyse des impacts environnementaux	PDF	Variable
19	Carte topographique INCT	Carte localisant le perimetre demande	PDF/Image	1/25.000, 1/50.000 ou 1/200.000
20	Copie du permis de prospection miniere	Si applicable - permis en cours de validite	PDF	Variable
21	Rapport sur les travaux realises	Resultats obtenus par la prospection miniere	PDF	Variable
22	Copie du permis d'exploration en cours	Permis dont la prorogation est demandee	PDF	Variable
23	Carte topographique INCT actualisee	Localisation du perimetre minier	PDF/Image	1/25.000, 1/50.000 ou 1/200.000
24	Rapport geologique sur les travaux effectues	Illustre par des plans, croquis et coupes	PDF	Variable
25	Etat d'execution des engagements	Bilan des engagements souscrits	PDF	Variable
26	Programme et planning des travaux projetes	Avec estimation des depenses	PDF	Variable
27	Moyens humains et materiels a mettre en uvre	Plan de ressources pour la nouvelle periode	PDF	Variable
28	Etude d'impact sur l'environnement actualisee	Incluant mesures d'attenuation et remise en etat	PDF	Variable
29	Attestation de paiement des droits et taxes	Preuve que le demandeur est a jour	PDF	Variable
30	Cahier des charges actualise	Document contractuel mis a jour et signe	PDF	Variable
31	Justificatifs de capacites techniques	References dans l'exploitation miniere	PDF	Variable
32	Justificatifs des capacites financieres	Bilans des 3 derniers exercices	PDF	Variable
33	Copie du permis d'exploration miniere	Si applicable - permis en cours de validite	PDF	Variable
34	Rapport sur les travaux realises	Resultats des phases de recherche miniere	PDF	Variable
35	Copie de l'etude de faisabilite	Etude technique et economique detaillee	PDF	Variable
36	Etude d'impact sur l'environnement	Avec plan de gestion environnemental	PDF	Variable
37	Etude de dangers	Analyse des risques	PDF	Variable
38	Autorisation d'etablissement classe	Document d'autorisation	PDF	Variable
39	Programme de restauration	Plan de remise en etat des lieux	PDF	Variable
40	Demande de renouvellement sur imprime de l'agence	Formulaire officiel de demande	PDF	A4
41	Copie du permis d'exploitation en cours	Permis dont le renouvellement est demande	PDF	Variable
42	Rapport sur les travaux d'exploitation realises	Investissements, productions et protection environnementale	PDF	Variable
43	Rapport geologique actualise	Sur le ou les gisement(s) exploite(s)	PDF	Variable
44	Rapport sur les travaux d'exploration complementaire	Si applicable - travaux realises pendant la periode	PDF	Variable
45	Etude de faisabilite technique et economique actualisee	Nouveau plan de developpement et d'exploitation	PDF	Variable
46	Plan d'encadrement technique et emploi	Ressources humaines pour la nouvelle periode	PDF	Variable
47	Engagement de rapport geologique biennal	Engagement formel de fournir des rapports	PDF	Variable
48	Etude d'impact sur l'environnement actualisee	Avec plan de gestion environnemental	PDF	Variable
49	Etat de la remise en etat des lieux	Bilan des actions deja realisees	PDF	Variable
50	Demande sur imprime de la wilaya ou de l'agence	Formulaire officiel de demande	PDF	A4
51	Justificatifs de capacites techniques	Competences en recherche carriere	PDF	Variable
52	Programme et planning des travaux	Detail des travaux de recherche prevus	PDF	Variable
53	Carte topographique INCT	Localisation du perimetre demande	PDF/Image	1/25.000, 1/50.000 ou 1/200.000
54	Justificatifs de capacites techniques	References dans l'exploitation de carrieres	PDF	Variable
55	Copie du permis de recherche carriere	Si applicable - permis en cours de validite	PDF	Variable
56	Memoire sur les travaux realises	Resultats des phases de recherche	PDF	Variable
57	Caracteristiques du tout-venant	Pour les materiaux de construction	PDF	Variable
58	Schema de traitement valide	Procede retenu pour les materiaux	PDF	Variable
59	Demande sur imprime de l'agence	Formulaire officiel de demande	PDF	A4
60	Copie des statuts ou piece d'identite	Pour personnes morales ou physiques	PDF	Variable
61	Justificatifs des capacites techniques et financieres	Capacites a realiser le projet	PDF	Variable
62	Memoire technique	Methode retenue d'exploitation artisanale	PDF	Variable
63	Substances visees	Liste des substances a exploiter	PDF	Variable
64	Notice ou etude d'impact	Selon l'incidence sur l'environnement	PDF	Variable
65	Justificatifs des capacites techniques et financieres	Capacites a realiser l'activite de ramassage	PDF	Variable
66	Carte topographique INCT	Localisation de la zone de ramassage	PDF/Image	1/25.000, 1/50.000 ou 1/200.000
67	Memoire technique	Methode retenue de ramassage, collecte ou recolte	PDF	Variable
68	Substances visees	Liste des substances a ramasser	PDF	Variable
69	Notice d'impact sur l'environnement	Analyse des impacts environnementaux	PDF	Variable
\.


--
-- Data for Name: DossierAdministratif; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DossierAdministratif" (id_dossier, id_typeproc, "id_typePermis", nombre_doc, remarques) FROM stdin;
1	1	1	8	Dossier standard de demande de permis de prospection miniere
2	2	1	4	Dossier standard de demande de prorogation de permis de prospection miniere
3	1	2	14	Dossier standard de demande de permis d'exploration miniere
4	2	2	10	Dossier standard de prorogation de permis d'exploration miniere
5	1	3	13	Dossier standard de demande de permis d'exploitation de mines
6	2	3	12	Dossier standard de renouvellement de permis d'exploitation de mines
7	1	5	8	Dossier standard de demande de permis de recherche carriere
8	1	6	14	Dossier standard de demande de permis d'exploitation de carrieres
9	1	7	8	Dossier standard de demande d'autorisation artisanale miniere
10	1	9	7	Dossier standard de demande de permis de ramassage
\.


--
-- Data for Name: DossierDocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DossierDocument" (id_dossier, id_doc, is_obligatoire, missing_action, reject_message) FROM stdin;
1	1	f	WARNING	\N
1	2	t	REJECT	Piece essentielle manquante
1	3	t	REJECT	Piece essentielle manquante
1	4	t	REJECT	Piece essentielle manquante
1	5	t	REJECT	Piece essentielle manquante
1	6	t	BLOCK_NEXT	\N
1	7	t	BLOCK_NEXT	\N
1	8	t	BLOCK_NEXT	\N
2	9	f	WARNING	\N
2	10	t	WARNING	\N
2	11	t	BLOCK_NEXT	\N
2	12	t	BLOCK_NEXT	\N
3	1	f	WARNING	\N
3	2	t	REJECT	Piece essentielle manquante
3	3	t	REJECT	Piece essentielle manquante
3	13	t	REJECT	Piece essentielle manquante
3	5	t	REJECT	Piece essentielle manquante
3	14	t	WARNING	\N
3	15	f	WARNING	\N
3	16	t	BLOCK_NEXT	\N
3	17	f	WARNING	\N
3	18	f	WARNING	\N
3	19	t	BLOCK_NEXT	\N
3	8	t	BLOCK_NEXT	\N
3	20	f	WARNING	\N
3	21	t	WARNING	\N
4	9	f	WARNING	\N
4	22	f	WARNING	\N
4	23	t	BLOCK_NEXT	\N
4	24	t	WARNING	\N
4	25	f	WARNING	\N
4	26	t	BLOCK_NEXT	\N
4	27	f	WARNING	\N
4	28	f	WARNING	\N
4	29	t	REJECT	Piece essentielle manquante
4	30	t	BLOCK_NEXT	\N
5	1	f	WARNING	\N
5	2	t	REJECT	Piece essentielle manquante
5	3	t	REJECT	Piece essentielle manquante
5	31	t	REJECT	Piece essentielle manquante
5	32	t	REJECT	Piece essentielle manquante
5	33	f	WARNING	\N
5	34	t	WARNING	\N
5	35	f	WARNING	\N
5	19	t	BLOCK_NEXT	\N
5	36	f	WARNING	\N
5	37	f	WARNING	\N
5	38	f	WARNING	\N
5	39	t	BLOCK_NEXT	\N
6	40	f	WARNING	\N
6	41	f	WARNING	\N
6	42	t	WARNING	\N
6	43	t	WARNING	\N
6	44	t	WARNING	\N
6	45	f	WARNING	\N
6	46	t	BLOCK_NEXT	\N
6	47	t	WARNING	\N
6	29	t	REJECT	Piece essentielle manquante
6	48	f	WARNING	\N
6	49	f	WARNING	\N
6	30	t	BLOCK_NEXT	\N
7	50	f	WARNING	\N
7	2	t	REJECT	Piece essentielle manquante
7	3	t	REJECT	Piece essentielle manquante
7	51	t	REJECT	Piece essentielle manquante
7	32	t	REJECT	Piece essentielle manquante
7	52	t	BLOCK_NEXT	\N
7	53	t	BLOCK_NEXT	\N
7	8	t	BLOCK_NEXT	\N
8	50	f	WARNING	\N
8	2	t	REJECT	Piece essentielle manquante
8	3	t	REJECT	Piece essentielle manquante
8	54	t	REJECT	Piece essentielle manquante
8	32	t	REJECT	Piece essentielle manquante
8	55	f	WARNING	\N
8	56	t	WARNING	\N
8	35	f	WARNING	\N
8	57	f	WARNING	\N
8	58	f	WARNING	\N
8	53	t	BLOCK_NEXT	\N
8	36	f	WARNING	\N
8	37	f	WARNING	\N
8	39	t	BLOCK_NEXT	\N
9	59	f	WARNING	\N
9	60	t	REJECT	Piece essentielle manquante
9	61	t	REJECT	Piece essentielle manquante
9	53	t	BLOCK_NEXT	\N
9	62	t	WARNING	\N
9	63	f	WARNING	\N
9	64	t	WARNING	\N
9	8	t	BLOCK_NEXT	\N
10	59	f	WARNING	\N
10	60	t	REJECT	Piece essentielle manquante
10	65	t	REJECT	Piece essentielle manquante
10	66	t	BLOCK_NEXT	\N
10	67	t	WARNING	\N
10	68	f	WARNING	\N
10	69	t	WARNING	\N
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, name, description) FROM stdin;
\.


--
-- Data for Name: GroupPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupPermission" ("groupId", "permissionId") FROM stdin;
\.


--
-- Data for Name: InteractionWali; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InteractionWali" (id_interaction, id_procedure, id_wilaya, type_interaction, avis_wali, date_envoi, date_reponse, delai_depasse, nom_responsable_reception, commentaires, contenu, is_relance) FROM stdin;
\.


--
-- Data for Name: MembreSeance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MembreSeance" (id_seance, id_membre) FROM stdin;
\.


--
-- Data for Name: MembresComite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MembresComite" (id_membre, nom_membre, prenom_membre, fonction_membre, email_membre) FROM stdin;
1	Ali	Yahia	Président	ali@example.com
2	Sara	Bensalah	Membre	sara@example.com
3	Karim	Benali	Rapporteur	karim@example.com
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, content, "senderId", "receiverId", "conversationId", "isRead", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, name) FROM stdin;
1	view_dashboard
2	create_demande
3	manage_users
4	permis-dashboard
5	Admin-Panel
6	view_procedures
7	controle_minier
8	dashboard
9	Payments
10	manage_documents
11	Audit_Logs
\.


--
-- Data for Name: PortalApplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalApplication" (id, code, status, title, "permitTypeId", "companyId", wilaya, daira, commune, "lieuDit", "polygonGeo", "applicantToken", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PortalApplicationDocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalApplicationDocument" (id, "applicationId", "documentId", status, "fileUrl", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: PortalCompany; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalCompany" (id, "legalName", "legalForm", "rcNumber", "rcDate", nif, nis, capital, address, email, phone, website, "managerName", "registryFileUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PortalDocumentDefinition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalDocumentDefinition" (id, code, name, description, format, "maxSizeMB", required, "missingAction", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PortalPayment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalPayment" (id, "applicationId", provider, amount, currency, status, "intentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PortalPermitType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalPermitType" (id, code, label, description, regime, "initialYears", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PortalRepresentative; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalRepresentative" (id, "companyId", "fullName", function, "nationalId", email, phone, "powerDocUrl") FROM stdin;
\.


--
-- Data for Name: PortalShareholder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalShareholder" (id, "companyId", name, type, nif, "sharePct", nationality) FROM stdin;
\.


--
-- Data for Name: PortalTypeDocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortalTypeDocument" (id, "permitTypeId", "documentId", "order", notes) FROM stdin;
\.


--
-- Data for Name: ProcedureCoord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProcedureCoord" ("id_procedureCoord", id_proc, id_coordonnees, statut_coord) FROM stdin;
22	1	22	NOUVEAU
23	1	23	NOUVEAU
24	1	24	NOUVEAU
\.


--
-- Data for Name: ProcedureRenouvellement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProcedureRenouvellement" (id_renouvellement, id_demande, num_decision, date_decision, date_debut_validite, date_fin_validite, commentaire) FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name) FROM stdin;
1	admin
2	cadastre
3	controle
4	ddm
5	user
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" ("roleId", "permissionId") FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
1	10
1	11
5	1
\.


--
-- Data for Name: SeanceCDPrevue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SeanceCDPrevue" (id_seance, num_seance, date_seance, exercice, remarques, statut) FROM stdin;
1	CD-2025-001	2025-10-09 02:18:00	2025		programmee
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
1	5b62b3099c5399286d5c68cf195fa5d024b5761d8ded6f8a39964b595067a56a	1	2025-10-20 21:01:02.415	2025-10-19 21:01:02.417
\.


--
-- Data for Name: StatutPermis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StatutPermis" (id, lib_statut, description) FROM stdin;
1	En vigueur	Le permis est actuellement En vigueur
2	Suspendu	Le permis est temporairement suspendu
3	Annulé	Le permis a été annulé
4	Renoncé	Le titulaire a renoncé au permis
5	Expirée	Le permis est arrivé à son terme
\.


--
-- Data for Name: TsPaiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TsPaiement" ("id_tsPaiement", id_obligation, "datePerDebut", "datePerFin", "surfaceMin", "surfaceMax") FROM stdin;
1	3	2025-10-21 08:51:37.962	2025-12-31 23:59:59.999	61.63	61.63
2	4	2026-01-01 00:00:00	2026-12-31 23:59:59.999	61.63	61.63
3	30	2025-10-21 08:51:37.962	2025-12-31 23:59:59.999	61.63	61.63
4	5	2027-01-01 00:00:00	2027-12-31 23:59:59.999	61.63	61.63
5	31	2026-01-01 00:00:00	2026-12-31 23:59:59.999	61.63	61.63
6	6	2028-01-01 00:00:00	2028-12-31 23:59:59.999	61.63	61.63
7	32	2027-01-01 00:00:00	2027-12-31 23:59:59.999	61.63	61.63
8	7	2029-01-01 00:00:00	2029-12-31 23:59:59.999	61.63	61.63
9	33	2028-01-01 00:00:00	2028-12-31 23:59:59.999	61.63	61.63
10	8	2030-01-01 00:00:00	2030-12-31 23:59:59.999	61.63	61.63
11	34	2029-01-01 00:00:00	2029-12-31 23:59:59.999	61.63	61.63
12	9	2031-01-01 00:00:00	2031-12-31 23:59:59.999	61.63	61.63
13	35	2030-01-01 00:00:00	2030-12-31 23:59:59.999	61.63	61.63
14	10	2032-01-01 00:00:00	2032-12-31 23:59:59.999	61.63	61.63
15	36	2031-01-01 00:00:00	2031-12-31 23:59:59.999	61.63	61.63
16	11	2033-01-01 00:00:00	2033-12-31 23:59:59.999	61.63	61.63
17	37	2032-01-01 00:00:00	2032-12-31 23:59:59.999	61.63	61.63
18	12	2034-01-01 00:00:00	2034-12-31 23:59:59.999	61.63	61.63
19	38	2033-01-01 00:00:00	2033-12-31 23:59:59.999	61.63	61.63
20	13	2035-01-01 00:00:00	2035-12-31 23:59:59.999	61.63	61.63
21	39	2034-01-01 00:00:00	2034-12-31 23:59:59.999	61.63	61.63
22	14	2036-01-01 00:00:00	2036-12-31 23:59:59.999	61.63	61.63
23	40	2035-01-01 00:00:00	2035-12-31 23:59:59.999	61.63	61.63
24	15	2037-01-01 00:00:00	2037-12-31 23:59:59.999	61.63	61.63
25	41	2036-01-01 00:00:00	2036-12-31 23:59:59.999	61.63	61.63
26	16	2038-01-01 00:00:00	2038-12-31 23:59:59.999	61.63	61.63
27	42	2037-01-01 00:00:00	2037-12-31 23:59:59.999	61.63	61.63
28	17	2039-01-01 00:00:00	2039-12-31 23:59:59.999	61.63	61.63
29	43	2038-01-01 00:00:00	2038-12-31 23:59:59.999	61.63	61.63
30	18	2040-01-01 00:00:00	2040-12-31 23:59:59.999	61.63	61.63
31	44	2039-01-01 00:00:00	2039-12-31 23:59:59.999	61.63	61.63
32	19	2041-01-01 00:00:00	2041-12-31 23:59:59.999	61.63	61.63
33	45	2040-01-01 00:00:00	2040-12-31 23:59:59.999	61.63	61.63
34	20	2042-01-01 00:00:00	2042-12-31 23:59:59.999	61.63	61.63
35	46	2041-01-01 00:00:00	2041-12-31 23:59:59.999	61.63	61.63
36	21	2043-01-01 00:00:00	2043-12-31 23:59:59.999	61.63	61.63
37	47	2042-01-01 00:00:00	2042-12-31 23:59:59.999	61.63	61.63
38	22	2044-01-01 00:00:00	2044-12-31 23:59:59.999	61.63	61.63
39	48	2043-01-01 00:00:00	2043-12-31 23:59:59.999	61.63	61.63
40	23	2045-01-01 00:00:00	2045-12-31 23:59:59.999	61.63	61.63
41	49	2044-01-01 00:00:00	2044-12-31 23:59:59.999	61.63	61.63
42	24	2046-01-01 00:00:00	2046-12-31 23:59:59.999	61.63	61.63
43	50	2045-01-01 00:00:00	2045-12-31 23:59:59.999	61.63	61.63
44	25	2047-01-01 00:00:00	2047-12-31 23:59:59.999	61.63	61.63
45	51	2046-01-01 00:00:00	2046-12-31 23:59:59.999	61.63	61.63
46	26	2048-01-01 00:00:00	2048-12-31 23:59:59.999	61.63	61.63
47	52	2047-01-01 00:00:00	2047-12-31 23:59:59.999	61.63	61.63
48	27	2049-01-01 00:00:00	2050-10-20 23:59:59.999	61.63	61.63
49	53	2048-01-01 00:00:00	2048-12-31 23:59:59.999	61.63	61.63
50	54	2049-01-01 00:00:00	2050-10-20 23:59:59.999	61.63	61.63
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nom, "Prenom", username, email, password, "roleId", "createdAt") FROM stdin;
1	kedjar	brahim	jemskedjar	jemskedjar@gmail.com	$2b$10$wWfAOyMWmP67bZY7MEpgTOdKbgBSdW58FvAQAlCBb/bsB6CeK9RPK	1	2025-10-19 21:00:56.558
\.


--
-- Data for Name: UserGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserGroup" ("userId", "groupId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Wilaya; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wilaya" (id_wilaya, id_antenne, code_wilaya, "nom_wilayaFR", "nom_wilayaAR", zone) FROM stdin;
1	17	1	ADRAR	أدرار	C_Extrême sud
2	2	44	AIN DEFLA	عين الدفلى	A_Nord
3	3	46	AIN TEMOUCHENT	عين تموشنت	A_Nord
4	9	16	ALGER	الجزائر	A_Nord
5	14	23	ANNABA	عنابة	A_Nord
6	1	5	BATNA	باتنة	A_Nord
7	17	8	BECHAR	بشار	B_Sud et porximité
8	4	6	BEJAIA	بجاية	A_Nord
9	1	7	BISKRA	بسكرة	B_Sud et porximité
10	5	9	BLIDA	البليدة	A_Nord
11	6	34	BORDJ BOU ARRERIDJ	برج بوعريريج	A_Nord
12	6	10	BOUIRA	البويرة	A_Nord
13	9	35	BOUMERDES	بومرداس	A_Nord
14	2	2	CHLEF	الشلف	A_Nord
15	7	25	CONSTANTINE	قسنطينة	A_Nord
16	10	17	DJELFA	الجلفة	B_Sud et porximité
17	15	32	EL BAYADH	البيض	B_Sud et porximité
18	16	39	EL OUED	الوادى	B_Sud et porximité
19	14	36	EL TAREF	الطارف	A_Nord
20	18	47	GHARDAIA	غرداية	B_Sud et porximité
21	14	24	GUELMA	قالمة	A_Nord
22	13	33	ILLIZI	ايليزى	C_Extrême sud
23	8	18	JIJEL	جيجل	A_Nord
24	11	40	KHENCHELA	خنشلة	A_Nord
25	10	3	LAGHOUAT	الأغواط	B_Sud et porximité
26	15	29	MASCARA	معسكر	A_Nord
27	5	26	MEDEA	المدية	A_Nord
28	8	43	MILA	ميلة	A_Nord
29	3	27	MOSTAGANEM	مستغانم	A_Nord
30	10	28	M'SILA	المسيلة	A_Nord
31	19	45	NAAMA	النعامة	B_Sud et porximité
32	3	31	ORAN	وهران	A_Nord
33	18	30	OUARGLA	ورقلة	B_Sud et porximité
34	11	4	OUM EL BOUAGHI	أم البواقى	A_Nord
35	2	48	RELIZANE	غليزان	A_Nord
36	15	20	SAIDA	سعيدة	A_Nord
37	4	19	SETIF	سطيف	A_Nord
38	19	22	SIDI BEL ABBES	سيدى بلعباس	A_Nord
39	7	21	SKIKDA	سكيكدة	A_Nord
40	11	41	SOUK AHRAS	سوق أهراس	A_Nord
41	20	11	TAMANRASSET	تامنغست	C_Extrême sud
42	16	12	TEBESSA	تبسة	A_Nord
43	12	14	TIARET	تيارت	A_Nord
44	17	37	TINDOUF	تندوف	C_Extrême sud
45	5	42	TIPAZA	تيبازة	A_Nord
46	12	38	TISSEMSILT	تيسمسيلت	A_Nord
47	9	15	TIZI OUZOU	تيزى وزو	A_Nord
48	19	13	TLEMCEN	تلمسان	A_Nord
49	17	49	TIMIMOUN	تيميمون	
50	20	50	BORDJ BADJI MOKHTAR	برج باجى مختار	
51	1	51	OULED DJELLAL	أولاد جلال	
52	17	52	BENI ABBES	بني عباس	
53	20	53	IN SALAH	ان صالح	
54	20	54	IN GUEZZAM	إن ڨزام	
55	18	55	TOUGGOURT	تڨرت	
56	13	56	DJANET	جانت	
57	16	57	EL MEGAIER	المغير	
58	18	58	EL MENIAA	المنيعة	
\.


--
-- Data for Name: _PermisProcedure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_PermisProcedure" ("A", "B") FROM stdin;
1	1
\.


--
-- Data for Name: _SeanceMembres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_SeanceMembres" ("A", "B") FROM stdin;
1	1
2	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
16d9a68e-c2ce-4790-8e6f-619d1fd720db	e8c96e6bb6a5c304b2eaca4a13e978e39225e9072ebcff290faaa9b227a065e0	2025-10-19 22:56:44.562156+02	20251019205644_add	\N	\N	2025-10-19 22:56:44.177978+02	1
\.


--
-- Data for Name: barem_produit_droit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.barem_produit_droit (id, montant_droit_etab, produit_attribution, "typePermisId", "typeProcedureId") FROM stdin;
1	30000	0	1	1
2	50000	0	1	2
4	40000	1500000	1	1
5	100000	3000000	1	1
6	100000	3000000	1	1
7	40000	1500000	1	1
8	40000	3000000	1	1
9	30000	0	1	1
10	0	0	1	1
3	75000	1500000	3	1
\.


--
-- Data for Name: cahiercharge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cahiercharge (id, "permisId", "demandeId", num_cdc, date_etablissement, "dateExercice", lieu_signature, signataire_administration, fuseau, "typeCoordonnees", version, "natureJuridique", "vocationTerrain", "nomGerant", "personneChargeTrxx", qualification, "reservesGeologiques", "reservesExploitables", "volumeExtraction", "dureeExploitation", "methodeExploitation", "dureeTravaux", "dateDebutTravaux", "dateDebutProduction", "investissementDA", "investissementUSD", "capaciteInstallee", commentaires, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: codeAssimilation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."codeAssimilation" (id_code, "id_ancienType", id_permis, ancien_code) FROM stdin;
\.


--
-- Data for Name: coordonnee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coordonnee (id_coordonnees, id_zone_interdite, point, x, y, z, system, zone, hemisphere) FROM stdin;
22	\N	{"x":"500145","y":"400587","z":"0","system":"UTM","zone":31,"hemisphere":"N"}	500145	400587	0	UTM	31	N
23	\N	{"x":"500685","y":"401599","z":"0","system":"UTM","zone":31,"hemisphere":"N"}	500685	401599	0	UTM	31	N
24	\N	{"x":"501148","y":"400684","z":"0","system":"UTM","zone":31,"hemisphere":"N"}	501148	400684	0	UTM	31	N
\.


--
-- Data for Name: demAnnulation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demAnnulation" (id_annulation, id_demande, num_decision, date_constat, date_annulation, cause_annulation, statut_annulation) FROM stdin;
\.


--
-- Data for Name: demCession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demCession" (id_cession, id_demande, "id_ancienCessionnaire", "id_nouveauCessionnaire", motif_cession, nature_cession, taux_cession, date_validation) FROM stdin;
\.


--
-- Data for Name: demFermeture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demFermeture" (id_fermeture, id_demande, num_decision, date_constat, rapport) FROM stdin;
\.


--
-- Data for Name: demFusion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demFusion" (id_fusion, id_demande, "id_permisResultant", date_fusion, motif_fusion, statut_fusion) FROM stdin;
\.


--
-- Data for Name: demModification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demModification" (id_modification, id_demande, type_modif, statut_modification) FROM stdin;
\.


--
-- Data for Name: demRenonciation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demRenonciation" (id_renonciation, id_demande, motif_renonciation, rapport_technique) FROM stdin;
\.


--
-- Data for Name: demSubstitution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demSubstitution" (id_substitution, id_demande, num_decision, date_decision, motif_substitution, commentaires) FROM stdin;
\.


--
-- Data for Name: demTransfert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demTransfert" (id_transfert, id_demande, motif_transfert, observations, date_transfert) FROM stdin;
\.


--
-- Data for Name: demande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demande (id_demande, id_proc, id_detenteur, id_wilaya, id_daira, id_commune, "id_typeProc", "id_typePermis", id_expert, code_demande, date_demande, date_instruction, intitule_projet, date_fin_instruction, date_refus, "lieu_ditFR", lieu_dit_ar, superficie, statut_juridique_terrain, occupant_terrain_legal, destination, "locPointOrigine", duree_travaux_estimee, date_demarrage_prevue, qualite_signataire, montant_produit, con_res_geo, con_res_exp, volume_prevu, capital_social_disponible, budget_prevu, description_travaux, sources_financement, remarques, date_fin_ramassage, num_enregist, "AreaCat", statut_demande) FROM stdin;
1	1	394	42	324	914	1	3	3	PXM-2025-1	2025-10-19 21:02:07.84	2025-10-19 21:02:12.563	\N	\N	\N	uhiu	hiu	61.63	Domaine public	ihui	\N	\N	5	2025-10-10 00:00:00	\N	\N	\N	\N	\N	100	351654	uih	uihiuh	\N	\N	\N	\N	EN_COURS
\.


--
-- Data for Name: demandeMin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demandeMin" ("id_demMin", id_demande, min_label, min_teneur, ordre_mineral) FROM stdin;
\.


--
-- Data for Name: demandeObs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demandeObs" ("id_demandeObs", id_demande, obs_situation_geo, obs_empietement, obs_emplacement, obs_geom, obs_superficie) FROM stdin;
\.


--
-- Data for Name: demandeVerificationGeo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."demandeVerificationGeo" ("id_demVerif", id_demande, sit_geo_ok, empiet_ok, superf_ok, geom_ok, verification_cadastrale_ok, superficie_cadastrale) FROM stdin;
1	1	t	t	t	t	t	61.63
\.


--
-- Data for Name: detenteurmorale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detenteurmorale (id_detenteur, "id_statutJuridique", id_pays, id_nationalite, "nom_societeFR", "nom_societeAR", adresse_siege, telephone, fax, email, site_web) FROM stdin;
1394	3	4	\N	GUASMA	قـاسـمة	terrain boumediene N°03 W-Tiaret	0555 143 265			
2528	1	4	\N	SNGIES / SOCIETE NOUVELLE GENERALE IMPORT EXPORT & SERVICES	الشركة الجديدة العامة للاستيراد و التصدير و الخدمات	Zaatcha, Ben Boulaid RN 46 - El Hadjeb - W.Biskra	033 75 41 94	033 75 41 94		
190	3	4	\N	STATION DE CONCASSAGE BENDOUMA	محطة تكسير الحصى بن دومة	Rue Chikhaoui Mokhtar n°13 Frenda, Tiaret	07 72 55 74 83 - 07 91 22 91 17	046 40 69 16		
165	3	4	\N	STATION DE CONCASSAGE NESNISSA MAZI		n° 117, Rue des Martyres, Frenda ; Tiaret	046 40 72 68			
166	5	4	\N	ECTE / ENTREPRISE COMMUNALE DES TRAVAUX EL AFFROUN	مقاولة الاشغال لبلدية العفرون	Rue Sidi Nouihi El Affroun - Blida 	025 38 74 19	025 38 74 19		
167	\N	4	\N	ETP BOUDJAMAA MOHAMED		Zone d'activité BP 71 Illizi  33000	029 42 13 19	029 42 13 19		
1715	3	4	\N	MEZOUGHI MOHAMED	مزوغي محمد	DOUAR KRARMA TIZI .W.MASCARA	045 75 30 43/73 /67	045 75 30 78		
1828	2	4	\N	BOUHADJA NAGUIB & ABDELI AHMED & CIE - MEKAYDOU	بوحجة نقيب و عبيدلي أحمد و شركائهما - ميكايدو -	Telata -Azrail - W.Tlemcen	071 43 25 54			
561	1	4	\N	CARRIERE LEBRARA	محجرة لبرارة	02 Rue Elouchi Ismail Troisième plan, Commune de Ain Touta, w. BATNA	0661 34 51 52	036 84 60 52		
2661	1	4	\N	LOUAI GRAVIER & SABLE	لؤي للحصى و الرمل	RN n°10 - Sigus - W.Oum El Bouaghi	073 27 52 58	037 32 67 15		
1368	1	4	\N	AURES STONES		Coopérative Immobilière Les Orangés BP Doudou Mokhtar n°11-Ben Aknoun W.Alger	021 69 00 16 / \n061 51 59 88	021 69 99 16		
2864	14	44	\N	CGC / CHINA GEO-ENGINEERING CORPORATION		74, Cité Ben Achour – Chéraga, Alger.	021 37 90 86 / 021 37 44 41	021 37 44 41	cgcalgerie2008@yahoo.fr	
2482	\N	4	\N	MEHIRA		Cité El Nour - W.El Oued	071 28 58 76			
1920	1	4	\N	BMC / BOUSAADA MATERIAUX DE CONSTRUCTION	بوسعادة لمواد البناء	Cité des 64 Logts n°03/313 BP 56,  Bousaada - W.M'SILA	035 52 21 231	035 53 10 44		
1922	1	4	\N	CARRIERE TAB EL KHATER		Cité Ouled Attallah - Djelfa				
2317	3	4	\N	ADLANE DISTRIBUTION	شركة عدلان للتوزيع	Zone d'équipement W de Biskra	021 54 22 75 0661 55 40 03 0661 58 12 27	021 54 22 75		
2639	1	4	\N	AICHE PNEUS	عجلات عيش	Lotissement 540, 2 ème tranche N°4 Commune de Belaybba - W. M'sila	0550 74 65 99			
2641	1	4	\N	SOCIETE KERROUCHE	شركة كروش	ZONE D'ACTIVITE CHOTT LOT N° 025, ILOT N° 025, ILOT N°003 W. EL OUED	0555 37 41 76 / 0770 71 74 52	023 80 40 77		
854	3	4	\N	DJEBEL LABIOD D'EXPLOITATION DE SABLE	جبل لبيض لاستغلال الرمل	Café Saddam Houcine -Cheréa - W.Tebessa	037 42 31 38/072 02 32 79			
1812	3	4	\N	COGEMINES	كوجـيمين	Djebel Tiffech, Commune de Tiffech, w. Souk Ahras	0661 26 10 56 - 0552 44 38 01	038 42 76 54		
1814	1	4	\N	STATION DE CONCASSAGE MESSAOUDI		Rue des Martyrs - Chiffa - Blida	025 40 07 85			
2991	1	4	\N	BRIQUETERIE ENNADJAH OUEL AMEL	بريكوتري النجاح و الامل	05600 N'Gaous route de Taxlante Batna	0661 340 643 / 033 88 83 55	033 88 89 91		
39	3	4	\N	CARRIERE OUM LAADJOUL	محجرة أم العجول	43, Rue MansouriI El Khïer; Sétif	036 83 23 03 / 073 43 97 22	037 35 24 69		
2812	1	4	\N	BINAMA		05 Coopérative immobilière Jughurta, Bir Mourad Rais - ALGER	021 56 33 54	021 44 53 99		
1923	1	4	\N	NEDJMA EXPLOITATION DE GISEMENTS MINIERS		Centre Hessaina - Bouinane - Blida	021 55 30 39	021 55 30 39		
463	1	4	\N	COMPLEXE D'AGREGATS CHELLI & YESSAADI	مركب شلي و يسعدي للحصى	Rue Lachab Cherif, Ain Mellouk; Mila	031 52 91 08 - 061 30 59 58			
2444	3	4	\N	ECABEM	مؤسسة تفتيت الحصى و مجمع الاسمنت بالمشرية	BP 57 Mecheria Naama	049 78 79 48	049 78 76 98		
2445	1	4	\N	EL MOURABI AGRO ALIMENTAIRE	المربي أقرو التغذية	Cité Mahiedine n° 14, Eucalyptus, Cherarba - Alger.	07 72 73 93 30			
61	2	4	\N	AMEL BOUHZILA & CIE	امال بوهزيلة و شركائه	Lamzara, Communecde Guedjel; Sétif	061 35 09 32/073 12 38 27			
2694	1	4	\N	MINES DES BRAZES	مين دي براز	01 Sidi Daoud Theniet El Had, Tissemsilt	0770 849 0770 849 575 &0770 861 835&0661 351 893	046 58 50 63	sarlminesdesbrases@yahoo.fr	
2447	1	4	\N	SELSAL EL MOUMTAZ	الصلصال الممتاز	Centre Commercial "Les Sources" Corso Boumerdès	070 41 38 51			
630	1	4	\N	BOUGHABA CONSTRUCTION	بوغابة للبناء	14, Rue Chabbi El Mekki, Ouled Aissa - 18000 - W.Jijel	034 47 66 20/038 84 18 99	034 47 72 55/031 57 73 19		
2667	1	4	\N	BATIR ERRACHID TCE	باتير الرشيد تي سي أو	2, Rue Berrabah Hadj Moussa - W.Mascara\r\ncité Medber  N° 32   LSP Mascara	0560 932 790	021 249 619		
248	1	4	\N	CHERRAGUI & BOUHZILA CARRIERE DE GRANIT	شراقي و بوحزيلة محجرة القرانيت	BP 37 Benbadis Constantine	070 88 19 55			
250	5	4	\N	GILEP EL HAMMA		Gilep El Hamra  Khenchela 	032 33 13 73	032 33 14 12		
448	\N	4	\N	APC DJDIOUIA		Bd Allam Abderahmane	046 97 12 01	046 97 15 60		
1810	5	4	\N	ENAMARBRE	المؤسسة الوطنية للرخام	Zone Industrielle Port Safsaf  BP 228  W. Skikda	038 92 25 66	038 92 25 66		
940	1	4	\N	SABLONNEUSE	سابلونوز	Cité Nesrine n° 16 - Zabana - W.Blida				
1357	1	4	\N	SOMICA	صوميكا	Lotissement N° 3 Seddouk Centre 6500 - W. Béjaia	034 32 11 70			
2345	2	4	\N	DRISSI ABDELHAKIM & ASSOCIE	دريسي عبد الحكيم و شريكه	Diar Zerga - Tranche 01 n° 35 - Souk Ahras	061 39 09 46			
40	3	4	\N	CARRIERE OULED ADOUANE	محجرة أولاد عدوان	Cité 101 logts n°90 Ouled Adouan, Ain Kebira, Sétif	0661 350 529/0662 033 961			
1473	1	4	\N	SAKR EL DJADID MEKKAOUI & CIE TRAVAUX TOUT CORPS D'ETAT	صقر الجديد مكاوي و شركائه	20, Rue des frères Mekkaaoui Brezina W.El-Bayadh.	070 51 97 32	041 35 36 74		
1652	1	4	\N	BH GRANULATS	ب ح قرانولا	Cité des 130 Logts, Bt E n°123 - W. Bordj Bou Arreridj	0661 93 69 551	026 93 79 08		
2745	1	4	\N	GROUPE D'ENTREPRISE DE BATIMENT TOUNSI OMAR	مجموعة مقاولات للبناية تونسي عمر	N°03, Boulevard de la Soummam -  W.Sidi Bel Aabbès	048 55 56 68	048 55 58 71		
2746	1	4	\N	ETPH		BP 62 El Karimia - W.Chlef	070 32 57 62			
1169	3	4	\N	SABLIERE BOUCHEHIT		Batiment B6 N°52 Ain Smara - El Khroub - W.Constantine	031 97 13 06			
1911	2	4	\N	CARRIERE EL KHALIL DES FRERES AOUGUEB	محجرة الخليل الاخوة عقاب	Rue, Khlifi Ammar N° 4, Oued Athmania - W.Mila	031 52 96 66 / 0550 97 94 99	031 52 96 66	aouguebm@yahoo,fr	
2615	1	4	\N	META GRAIN	ميطاقران	72 lLogts LSP sevtion 10 bt 94 N° 06 A BAB EZZOUAR, ALGER	021 24 67 18	021 24 67 18		
2732	5	4	\N	BRC CONSTRUCTION	بي ار سي للبناء	BP N° 07 El Achour Alger	021 30 73 26	021 30 88 82		
2463	\N	4	\N	HARRABI Saaoudi		Oum Ethiour - El Meghair - El Oued 				
2464	\N	4	\N	TRAVAUX PUBLICS & VENTE D'AGREGATS RAMLA	الاشغال العمومية و بيع الحصى رملة	Sid Abdeldjebar, W, Mascara	027 63 80 27	027 03 92 45		
1345	5	4	\N	S.C.AEK / Société des Ciments de Ain El Kebira	شركة الاسمنت عين الكبيرة	Scaek Ouled Adouan W.Sétif	036 91 96 54 / \n036 89 54  / 52\n036 91 96 55	036 91 96 56	dgscaek@elhidhab.cerist.dz	
2372	3	4	\N	SOCIETE BRIQUETERIE NAZLA	شركة الأجر نزلة	RN n° 03 - Ain Sahara - Commune de Nezla - Touggourt - W.Ouargla	029 639 654/55/57 -0661 413 434	029 64 94 85		
1544	2	4	\N	HAMROUNI & CIE	حمروني و شركائه	29, Rue Samaï Hocine Cité Kouicem Abdelhak - W.Souk Ahras	061 39 00 44  /0540 46 70 00	037 71 60 56	hamrouni.redh@caramail.com	
298	1	4	\N	MAHDJARET EL DJOUDA	محجرة الجودة	Coop. Immobilière Ennasr, Cité Kaaboub Lot 7 groupe 72, W.Sétif	0661 78 72 12			
1606	3	4	\N	CARRIERE CONSTANTINOISE	المحجرة القسنطينية	15, Rue Sedira Lemataieche - Ain S'Mara - W.Constantine	0560 305 452	031  97 18 48		
1607	2	4	\N	CARRIERE FRERES BEDJAOUI		Cité Ouskourt Abdelkrim - Chelghoum Laid - W.Mila	031 52 78 79	031 52 78 79		
322	1	4	\N	SASD ROKNIA	شركة الحصي و الرمل دباغ - الركنية	Rue 20 Août 1955, Commune de Roknia – w. GUELMA	021 44 52 17 / 0661 66 49 13	021 44 52 18		
852	1	4	\N	SCES / SOCIETE CARRIERE D'EXTRACTION DE SABLE	شركة المقلع لاستخراج الرمل	El Mazraa Daira El ogla W.Tebessa	032 32 46 11	032 32 36 07		
2047	2	4	\N	 CARRIERE ROCHE BLUE KHANFER ET ASSOCIES	محجرة الحجرة الزرقاء خنفر و شركائه	Route Elksar, Merouana, wilaya de Batna	0550 18 08 10	036 74 30 48		
2016	1	4	\N	CARRIERE ECHALAALA		01, Rue de la Gare - Ain Touta - W.Batna	033 83 26 42 / \n033 83 42 48			
2533	1	4	\N	BOUMERDES BTP	بومرداس بي.تي.بي.	ZONE D'ACTIVITE N° 36, Frenda, W.Tiaret	046 40 60 05	046 40 60 05		
2436	1	4	\N	EMTRPAF	استخراج منيري للأشغال عمومية فلاحية غاباتية أو.أم.تي.باف	08, Rue Frères Belhadj  Nouvelle Ville Tizi Ouzou -  W. Tizi Ouzou	0771 53 25 96 / 0777 58 87 62			
1776	1	4	\N	CARRIERE AIN ARKO TAM	محجرة عين أركو تام	Zone Industrielle Ain Beida W.Guelma	061 37 84 77			
4147	1	4	\N	SZT	شركة الزيبان للاشغال بسكرة	Z, I N° 36, Biskra.	06 61 37 44 43	033 75 41 42		
3110	1	4	\N	EL ASSALA	الأصالة	Rue Maâdjoudj el Amir, Barika, wilaya de Batna	033 89 49 21/0782 13 00 06	033 89 96 24		
3014	5	\N	\N	EL ALAMIA FOR CEMENT AND BUILDING MATERIAL	الشركة العالمية للاسمنت و مواد البناء	Sheikh Fadel Bani Mazar Menya  Egypt	+20 2 2620 9715	+20 2 2620 9752		
2867	1	4	\N	ENTREPRISE DE CARRIERE EL BATHA	مؤسسة محجرة البطحة	Commune de Boucaid W/Tessemsilt				
2296	1	4	\N	HAUTS PLATEAUX	الهضاب العليا	Route de Nadhora Mehdia Tiaret				
2295	3	4	\N	CARRIERE BOURAHLI AGREGATS	محجرة بورحلي للحصى	Bd Houari Boumedienne N° 7 BBA	061 37 10 62			
1165	1	4	\N	SOPHYT	شركة الحفر و التهيئة الري الفلاحي و الهندسة المدنية توات	Rue Feghoul Aissa, local B, El Malah, Ain Témouchent	049 96 98 17			
1797	3	4	\N	EMTPT / ENTREPRISE MEDITERRANEENNE DES TRAVAUX PUBLICS TORCHI	أو.أم.تي.بي.تي متوسطة الأشغال العمومية طورشي	27 Rue Ahmed Kara - Bir Mourad Rais, wilaya d'Alger	031 45 26 41	031 45 26 41	eurl_emtp_torchi@yahoo.fr	
1802	3	4	\N	ENTREPRISE BOUFERRADJI MUSTAPHA	بوفراجي مصطفى	Chlef Centre Cité des Gazelles W.Chlef.\r\nCité des fonctionnaires BT C3 cage L N° 4 Chlef	027 77 03 24 /061 60 04 90/\n061 65 09 43	027 77 03 77		
2549	1	4	\N	OULED MAATALLAH GRANDS TRAVAUX	أولاد معطا الله للأشغال الكبرى	Route Sidi Damed       Ain Boucif      Medea	070 97 38 24	025 58 30 84		
2835	3	4	\N	EL ARICHA TRAVAUX PUBLICS	العريشة اشغال عمومية	Route de Chetouane Les Oliviers, W, Tlemcen	05 50 18 28 17	043 27 22 78		
1693	3	4	\N	CARRIERE LALA	محجرة لالة	Cité Salam Sakra, commune Rouissat. Wilaya de Ouargla	029 73 76 62	029 73 88 00		
1694	1	4	\N	YHS GRANULATS		Unité Ahl El Ksar W.Bouira	026 95 54 25	026 93 43 62	Challalyoucef@Caramail.Com	
1695	1	4	\N	IMO		Bloc B N° 23 Centre des Affaires Méditerranéen W/Annaba	061 32 08 73\n061 32 07 72	038 52 45 45		
3233	3	4	\N	EL WALIMA FRIGORIFIQUE	الوليمة للتبريد	Route Nationale,  N°3, W, Touggourt	0661 38 45 66 - 0664 11 54 50	029 68 43 32 - 032 28 70 62		
2040	1	4	\N	GROUPE KS UPC	مجمع كا أس أو بي سي	Rue Commandant Si Ahmed à Sfizef w,Sidi bel abéss,	0779 97 31 72			
1477	2	4	\N	GROUPE ALITI PRODUCTION D'AGREGATS	مجموعة عليطي لانتاج الحصى	Amoucha - W.SETIF\r\ncite chahid Kadir Mustapha  amoucha     setif	036 89 05 71 / 0560 80 25 55 /0550 28 05 24	036 89 05 70		
1557	2	4	\N	FRERES TAIHI DE CONCASSAGE DE ROCHES	الاخوة تايهي لتكسير و تفتيت الحجارة	Cité Hamdania - Médéa	025 58 05 11			
3028	1	4	\N	SBEMC	سعدودي للاجر و استغلال المناجم و البناء	Route nationale n° 02 El Malah w/Ain Temouchent	043 66 45 41	043 66 65 41		
482	3	4	\N	ALGERIAN SILICE	الجريان سيليس	55, Rue des Martyrs- Chlef	027 79 07 35	027 77 17 45		
673	5	4	\N	TARIC						
2539	14	37	\N	LANDMARK MINERALS INC		Cité Ennourn n° 1 A, Batiment 6, Beni Messous -Alger.	021 93 32 52	021 93 32 52		
946	3	4	\N	LOUCHI SABLE		Cité Des Frères Saker Batiments G Cage N° 8 W.Skikda				
1980	3	4	\N	AGREGATS ISSADI BOUANDAS		BP 66 El Fedjoudj W.Guelma	070 48 89 56			
549	1	4	\N	CARRIERE ALGERIA 2000	محجرة الجزائر 2000	Avenue Aissat Idir  W. Sidi Bel abbes	048 55 40 54			
383	1	4	\N	SINA		Cité Katit Salah, Nafir Abderahmane; Skikda	038 21 18 18			
316	1	4	\N	MAHDJARET LEMZARA	محجرة لمزارة	Cooperative Larbi Ben M'hidi n°01, Sétif	036 52 47 52 / 0661 35 30 30	036 52 41 83	hydro490@yahoo.fr	
3222	3	4	\N	SOCIETE DJEDEI ABDELKADER FABRICATION DE BRIQUES	شركة جديع عبد القادر لصناعة الاجور	Cité ERIMEL N°1,W,Touggourt	07 70 98 34 26	029 69 61 41		
2358	2	4	\N	HAMMAMA & ASSOCIES	حمامة و شركائه	40, Rue Ismail Mahdjoub -Sidi Mabrouk - W.Constantine	031 97 42 43	031 97 41 65		
3047	3	4	\N	BOULMANE TRAVAUX PUBLICS	بولمان مؤسسة للأشغال العمومية	139 Lot N° 124 hai Zeriguat  Bechar Djedid Bechar	0662 96 40 47	049 86 11 30		
1285	1	4	\N	SEDDIKI	صديقي	Tribunes du stade L N IW/Tizi Ouzou	026 26 29 12	026 26 10 78		
107	5	4	\N	EBTF	مؤسسة صنع الآجر و القرميد لفريحة	PB 61 Freha ; Tizi Ouzou	026 34 85 63	026 34 85 61		
2099	3	4	\N	UNITE DE PLATRE BOUCHENGA EL HADJ METLILI	وحدة الجبس بوشنقة الحاج متليلي	Zone Industrielle Metlili - Ghardaïa	021 55 30 39	021 55 30 39		
524	1	4	\N	BRIQUETERIE MAZARI	مصنع الاجر مزاري	BP 598 Tlemcen 	040 91 01 53-54	043 27 76 34		
1996	3	4	\N	MAHDANE CONCASSAGE	محدان لسحق الحجارة	Rue du 1er Novembre, Ain Dzarit - W.Tiaret	071 53 25 96			
851	2	4	\N	SOCIETE DOKKANE D'EXPLOITATION DE SABLE CHAABANE & CIE		El Ma Labiodh W.Tebessa	037 47 53 41			
2104	1	4	\N	MANDRA SOUTIRAGE & PREPARATION DE GYPSE	مندرا لاستخراج وتجهيز الجبس	BP 319 Bir El Ater 12 200  W.Tebessa	061 56 41 14	037 44 77 66 		
2337	1	4	\N	EL FAOUARES GRANDS TRAVAUX	الفوارس للأشغال الكبرى	Hoba - Reguiba - El Oued	032 27 62 33			
1871	1	4	\N	BRIQUETERIE SIDI BOUNOUAR	شركة الأجر سيدي بونوار	Birrouana Sud Ville 45 W.Tlemcen	043 26 23 49	043 27 11 06		
1246	5	4	\N	SPRO / SOCIETE DE PRODICTION BATNA	شركة إنتاج باتنة	02, Rue Chennef Amar - La Verdure - W.Batna 05000	033 86 97 41	033 86 97 41		
632	1	4	\N	SGT / SOCIETE GENERALE DES TRAVAUX KHEMGANI	الشركة العامة للأشغال	Zone Industrielle - BP N° 229 Mekhadma - wilaya d'Ouargla	029 71 48 92	029 71 28 79		
2327	1	4	\N	OULED TAIBI PRODUCTION INDUSTRIELLE		Rue Djeldjli Ahmed Relizane	071 57 46 43			
4149	1	4	\N	GROUPE ISLAM D'AGREGATS	مجمع اسلام للحصى	n° 91, Plan de Partage, Z, A, Commune de Oued Athmania, Mila	06 61 30 30 14	031 52 54 14		
941	3	4	\N	SABLIERE MAHMOUDI BOUALEM	مرملة محمودي بوعلام	Cité Frères Cherifi n° 249 - W.Ain Defla	027 60 17 58			
633	1	4	\N	HANKA & FRERES AGREGATS	شركة حنكة و اخوانه للحصى	BP 517 - Hassi Messaoud - Ouargla\r\nHaoud El Hamra, commune de Hassi Messaoud\r\nwilaya de Ouargle	061 37 43 29	029 73 35 35		
584	1	4	\N	SECAD		Illilten centre W/ Tizi Ouzou	061 66 04 35	026 22 83 84		
301	\N	4	\N	APC TARMOUNT		Commune Tarmount M'Sila				
522	3	4	\N	DIB EXTRACTION & PREPARATION DE SABLE		BP 92 M'Daourouch Souk Ahras	037 33 69 68	037 33 69 68		
2712	1	4	\N	CERAMIQUE EL HIDHAB	سيراميك الهضاب	05 Rue Abdelaziz Khaled, El Eulma - W/Setif	036 47 98 99 / 036 47 97 68	036 47 98 98	elhidab_dz@hotmail.com	
2753	1	4	\N	ES SAFA & EL MAROUA	الصفا و المروة	08, Avenue Fayceli Rabah 24000 Guelma				
2051	3	4	\N	MIE PIERRE	مي بيار	Boulevard du 1er Novembre 1954 - Souk Ahras	061 39 01 26	037 82 47 91		
1542	3	4	\N	SABLIERE EL ZAHIA	مرملة الزاهية	Zone Industrielle Boumaiza, Commune de Benazzouz, wilaya de Skikda	0661 32 68 98	038 73 02 34		
1387	1	4	\N	CARRIERES OUMSTATTE	محجرة أم سطاط	BP C 64, Djefel Amar, El Khroub - W.Constantine	0770 91 78 75	030 23 25 63	carriere_oumstatte@yahoo.fr	
313	1	4	\N	BRIQUETERIE MEZAOUROU	مصنع الاجر مزاورو	BP 23 Mezaourou Sidi Brahim, Ghazaouet 13421 ; Tlemcen	043 31 51 19\n043 31 33 51			
351	1	4	\N	SOCIETE TOUHAMI BTBH		Rue ANP BP 37 Tindouf	049 92 12 71	049 92 17 29		
2976	3	4	\N	ES SALEM CONCASSAGE	السلام لتكسير الحجارة	Cité des 500 Logts BT N°1 W, Tiaret	07 74 37 11 96			
2334	1	4	\N	GROUPE BENHAMADI ARGILOR	مجمع بن حمادي أرجيلور	Zone Industrielle de Bordj Bou Arreridj 34 000	035 87 31 87 – 0770 94 52 07	035 87 31 89		
232	5	4	\N	SOEXAC / SOCIETE D'EXPLOITATION ET COMMERCIALISATION PRODUITS AGREGATS DE CHLEF	شركة استخراج الحصى	Ouled Si Tahar Harchoune - Chlef	061 60 09 14			
1343	1	4	\N	CARRIERE BELIRI	محجرة البليري	BP 217 Ain Abid, Constantine	0771 983 731			
1289	1	4	\N	SFAPROMACO	سعدودي للإنتاج مـــواد الحمراء و البناء للغرب )س,ف,ا,ب,ر,و,م,ع(	Ilot 28, n°51, Zone Industrielle Hassi Ameur, wilaya d'Oran	041 52 46 12 / 0661 38 00 48	041 52 46 70		
2280	1	4	\N	NADJAH EL DJANOUB	نجاح الجنوب	Cité Mahdjoub, Timimoune - W.Adrar	050 024 415 / 061 38 70 83	021 87 82 29		
2963	1	4	\N	GMD LOGISTIQUE	المطاحن الكبرى دحماني لوجيستيك	Cit2 Mouilha Ouled Moussa w/Boumerdés		021 82 07 91		
292	1	4	\N	SOCIETE BENCHEROUDA DU COMMERCE	بن شرودة للتجارة	Bureau Centre Ville Ain Salah	029 36 25 99	029 36 25 99		
429	1	4	\N	AGREGATS KADRI	الحصى قادري	carrirere Sidi El Houari Ahmeur El Ain Bourkika -Tipaza	025 20 82 17/18	025 20 82 12		
1531	2	4	\N	SOCIETE NORD AFRICAINE	شركة الأشغال العمومية لبلدان الشمال الافريقي الخمس	1, Rue Abderrahmane W.Constantine	031 93 46 94	031 93 56 48		
626	1	4	\N	SOCIETE BRIQUETERIE EL AMEL	شركة الأمل للأجور	Route Ouled Anen Bouteldja W/El Tarf	038 60 98 18   030 88 21 16/17	38 66 16 00		
534	2	4	\N	AGGOUNE & ALITI	عقون و عليطي	Cité 103, Lotissement A - Amoucha - W.Sétif	036 89 03 55 / 030 96 35 46	037 32 45 26		
2449	1	4	\N	ETRHB HADDAD	مؤسسة الأشغال الطريقية ,هدروليكية و العمارات حداد	Zone d'Activité Dar El Beida - Alger	021 50 58 21\n021 50 58 90	021 50 89 69	contact@etrhb. Com	
1908	1	4	\N	SUD TIMMI ADRAR	جنوب تيمي أدرار	Zone Agrinage, Région Est Adrar, wilaya d’Adrar	0661 21 50 67	049 96 87 83		
68	\N	4	\N	APC EL GUETTAR		APC El Guettar, Mazouna ; Relizane	046 94 41 01	046 94 41 49		
2655	1	4	\N	CRUSHER OUEST	كروشير واست	BP N° 65 BADAOUI, MECHERIA WILAYA NAAMA	049 72 42 64	049 72 42 64 - 048 47 10 19		
2878	3	4	\N	ENTREPRISE MIFI MOURAD DES CARRIERES	مؤسسة معيفي مراد للمحاجر	Saf saf El Ousra, Oum Ali - W.Tebessa	061 36 68 92			
3033	1	4	\N	AHD EL DJADID EXTRACTION ET PREPARATION DU SABLE	العهد الجديد لاستخراج الحصى و الرمل	Douar Chair avenu AMRANI Mohamed Tahat, Commune Chémora w/Batna	0770 51 58 52			
2848	1	4	\N	CARRIERE BELKADA	محجرة بلقادة	1 Avenue du Consulat Bab El Oued pâtisserie la princesse W/Alger	050 81 17 89/ 071 61 57 51			
686	3	4	\N	SOTRABAL	SOTRABAL	Rue AF 14 Cité 5 Juillet Bordj Bou Arreridj	0661 370 892	035 68 32 88		
755	1	4	\N	FILAMARBRE		Cité des fréres Lezghed   FilFila   W. Skikda	038 76 08 75			
2978	3	4	\N	TOUATI TRAVAUX BATIMENT HYDRAULIQUE TTBH	تواتي للاشغال البناية الري	08,Rue de l'Hippodrome Batna	033 80 57 67	033 80 57 67		
1081	3	4	\N	BOUTEHLOULA EXPLOITATION DE SABLE		El Kouif  W.Tebessa				
2054	1	4	\N	CONCASSAGE TASSELGHA	تفتيت تسلغا	Cité Tasselgha  BP 333 - Timimoun - W.Adrar 	049 90 22 97 / \n061 27 51 17	049 90 22 97		
1161	1	4	\N	SOCIETE OULMI	شركة عولمي	BP 169 - Zone Industrielle Barika - W.Batna	033 89 18 26	033 89 26 35		
473	5	4	\N	HYDRO TRANSFERT	المؤسسة الوطنية لجر المياه و نقلها	BP 270 Route de Bouhadid - Annaba	038 51 29 98	038 51 11 95		
175	1	4	\N	SOCIETE BRIQUETERIE & PRODUITS ROUGES ERRIADE	مصنع الاجر الرياض	BP 117, Bendjerrah ; Guelma	037 20 67 31	037 20 67 39		
2537	1	4	\N	NEGOCE NORD SUD	نيقوس شمال جنوب	Ilot Bahi Ameur Lot N° 266 Es sénia  W, Oran	070 89 29 96 / 070 30 51 89			
2538	2	4	\N	CHACHOUA MEFTAH & CIE	شاشوة مفتاح و شركائه	Cité Essalem Coopérative Immoblière El Mouhandis - Mecheria - W.Naama.	049 77 61 06 / 076 26 84 14	049 77 61 06		
591	1	4	\N	SPST / SOCIETE DE PRODUCTION & DE SERVICES DE TEBESSA		Zone Industrielle W.Tebessa	037 49 20 71	037 49 06 28		
447	1	4	\N	TOUAT EL WASTA	توات الوسطى	Zone Industrielle BP 99154 - Adrar 	049 960 102	0550 501 162	sarl_tenout@hotmail.fr	
42	5	4	\N	CONSTRUB EST	شركة البناء و العمران للشرق	Cité 08 Mars, Plaine Ouest BP 72, Annaba	038 839983	038 833722	construbest2300@yahoo.fr	
2344	1	4	\N	EEMCC	أو.أو.أم.سي.سي	Cité 350 Logts N° 1 Boumerdès	061 65 00 22   0550 108 630	024 81 51 93	sarl,eemcc@gmail	
588	5	4	\N	SOMACOB / SOCIETE DES MATERIAUX DE CONSTRUCTION DE LA WILAYA DE BEJAIA	شركة مواد البناء لولاية بجاية - صوماكوب	Direction Générale : BP 159 Zone Industrielle (06000) W.Bejaia	034 21 28 59 / \n034 21 28 61	034 20 28 66	so.ma.co.b@wissal.dz	
507	1	4	\N	SBSU		Station de Carburant M'Toussa - Khenchela 	032 34 12 45 	032 34 12 45		
655	1	4	\N	PROMAG	بروماق	Chemin de wilaya n°32A, Hassi Ben Okba, Oran,	041 52 52 50/54	041 52 52 55		
191	3	4	\N	REBHI AGREGATS	ربحي للحصى	Cité du 16 Avril, Kasr Chellala, wilaya de Tiaret	0550 39 81 41			
2731	1	4	\N	ELLITE FOR INVESTEMENT	أوليت فور انفستيسمنت ال تي دي	Division Tahar Bouchitte n° 378 Birkhadem W/Alger	051 12 22 32		faowaze_ftc@hotmail.com	
721	3	4	\N	ENTREPRISE DE L'OUEST		21, Rue Mohamed Khemisti W.Oran	041 33 31 05	041 41 45 44		
2391	1	4	\N	E.GE.CO	مقاولة عامة للبناء	2 Route d’Ouled Fayet16320 Dély-Ibrahim – W.Alger	(213) 023 28 50 28	(213)023 28 50 01/02		
2392	3	4	\N	BAAZI AGREGATS & DERIVES	بــعزي للحـصى و مشتقاته	Bordj Bounaama - W.Tissessilt	046 49 46 21			
1267	2	4	\N	SABLIERE EL FOUTOUHAT BOUHALI & CIE		Lotissement N°221 Lot N°184 - Oued El Athmania - W.C onstantine				
355	5	4	\N	AGREBA		124, Av Aspirant Hamou Mokhtar \nBP 9914 El Mokrani ; Oran	041 45 24 45	041 45 24 45		
4107	3	4	\N	BOUANIKA REZKI DES TRAVAUX DES MINES	بوعنيقة رزقي لأشغال المناجم	Rue Boudjemaa Achour N° B 12   Oum Toub  Skikda	0550 50 29 01			
606	3	4	\N	AGREGATS & SABLE EL KASR	القصر للحصى و الرمل	Chorfi Med Lakhdar Kser Ssbihi Boughi W.Guelma	061 52 25 95			
2494	\N	4	\N	BOUZANA Abdelkader		Hai El Intissar Coopérative El Azhar N° 08 W. Relizane.	074 27 28 72	046 92 57 43		
1532	5	4	\N	SOPT Constantine	المؤسسة المتعددة الخدمات قسنطينة	Rue Belhoula El Makki, Belle Vue N° 20 Constantine	031 93 27 89 / 031 66 84 25	031 93 27 89 / 031 66 84 25		
612	5	4	\N	ENTREPRISE DE BATIMENT DE TIARET	مؤسسة المبانئ تيارت	Zone Industrielle Zaaroura BP 282 W.Tiaret.	046 42 64 94	046 42 11 82		
2536	1	4	\N	STGS / SOCIETE GRANDS TRAVAUX DU SUD	شركة الأشغال الكبرى للجنوب	Zone Industrielle Hassi Messaoud - Ouargla	029 73 47 95	029 73 47 96		
3101	1	4	\N	EFM	أو.أف.أم مؤسسة صناعة العتاد	CHATER BACH BP 68 A - AHMERE EL AIN   TIPAZA	0661 67 16 67	020 54 05 25		
2082	3	4	\N	CARRIERE CASAB SILI	محجرة كـساب سـيلي	Cité Sidi Boughoufalla - Ouargla	0660 941 045	029 76 78 87		
2146	3	4	\N	SBEMC	سعدودي للاجر و استغلال المناجم و البناء	RN 02 El Malah - Ain Temouchent	041 52 46 12	0 41 52 46 70		
221	1	4	\N	REMAILIA	الرمايلية	Remailia Bat 15 Commune Sidi Ali Benyoun, W.Sidi Bel Abbes	0542 61 77 20	041 54 12 48		
321	\N	4	\N	ETPB OUELLABI BOUBAKER		BP 67 Cedex II Kser El Fougani	061 38 51 63\n032 27 32 54	032 27 30 14		
737	1	4	\N	STRABATI PIM		Rue Commandant Si lakhdar - Ain Taya - W.Alger	021 86 85 02\n024 81 67 00	021 86 71 80\n024 81 67 65		
80	3	4	\N	CARRIERE BELHADI EL KHEIR	محجرة بلهادي الخير	Cité des jardins n° 02, Ain Azel - W. Sétif	036 87 56 55 / 061 35 03 30			
1514	3	4	\N	CARRIERE TIRECHE	محجرة طيرش	Commune Rechigua, Daira Hamadia - W. Tiaret	061 23 03 76/070 33 89 64			
2084	2	4	\N	FRERES CHERAITIA	الاخوين شريطية	Kef Lahmar, Guidjel - W.Sétif	036 51 32 65 – 0550 26 43 91	036 51 42 61		
3330	3	4	\N	ETTPMA	أو.تي.تي.بي.أم.أ	Hai Mectaa, Rue Ben Dahmane N°21, Oran, wilaya d’Oran.	0550 05 78 24	041 53 14 51		
2070	1	4	\N	SOCIETE AOUEN DE RAFFINAGE DE SEL	شركة عون لتصفية و تعليب و توضيب الملح	Commune de Hamraia, Daïra cde Reguiba - El Oued				
2072	3	4	\N	BENCHETTA CARRIERE	بن شطة محجرة	Commune de Guedjel - W.Setif				
1796	3	4	\N	ECHATT	الشط	Boulevard Ben Chekour Mohamed, Bougtoub -  W. El Bayadh				
1794	3	4	\N	MEKHALFI TAHAR	مخالفي الطاهر	Cité Administrative Ain Kibira W.Sétif	021 55 30 39	021 55 30 39		
1049	3	4	\N	FEROUANI CARRIERE		Chez Ben Senouci  BP 34  Beni Saf   W. Ain Temouchent	043 64 65 35			
590	1	4	\N	EL AMEL SABLE	الأمل للرمل	Commune de Oum Ali  W.Tebessa	037 41 31 38			
1510	1	4	\N	GHARDAIA PLATRE	غراية جبس	BP 66 Zone Industrielle de Bounoura Ghardaïa	029 87 31 23 / \n029 87 31 26	029 87 31 19		
1425	1	4	\N	GYPSE EL HASSI		Ouled Sidi Brahim  W. M'Sila	035 51 03 57			
53	3	4	\N	CARRIERE BENBELLAT AHMED	محجرة بن بلاط أحمد	Rue Lambarkia N° 47 , Route de Tazoult W. Batna	033 92 78 94 - 033 92 79 74	033 92 61 45		
2611	1	4	\N	TRAVAUX PUBLICS SALAH	الأشغال العمومية صالح	Route de Boufarik, Koléa - W.Tipaza	024 48 76 04	024 48 76 04		
2675	1	4	\N	ARLES	أرلس	Village Tazaghart, Commune Azeffoune - W.Tizi ouzou	0661 565 640			
215	\N	4	\N	ENTREPRISE DES TRAVAUX GALA SACI		BP 01 Bir El Djir Oran 	041 43 25 68			
2684	1	4	\N	BAZAR TAPIS	بزار للزرابي	Rue du Stade El-Hoggar Hydra Alger	0661 69 71 94	021 60 13 15		
341	1	4	\N	STATION DE CONCASSAGE LE CEDRE	محطة تكسير الحجارة الارز	Rue Bordj Emir Abdelkader, Theniet El Had - W.Tissemsilt.	046 48 45 97	021 50 19 03		
2299	3	4	\N	SACOA	ساكوا	Djebel Skhouna, Commune de Béni saf,W .Ain temouchent	043 60 73 98 / 0661 44 37 00	043 27 25 15		
2300	2	4	\N	BENISSAD MOULOUD & CIE	بن يسعد مولود و شركاؤه	Djebel Grouz, commune de Oued Athmania, W.Mila	05 53 86 46 13			
2301	1	4	\N	HERRAD SMAIL & FILS D'EXPLOITATION DE CARRIERES	حراد اسماعيل و أبنائه للاستغلال المحاجر	Commune de Beni Fodda - W.Setif	074 12 88 34			
2485	\N	4	\N	MERIAH Djamel		3,Rue Jean Kraft Miramar Oran	041 40 56 51	041 41 46 59		
2486	\N	4	\N	BELKHELLAFI Abed	بلخلافي عابد	Commune de Oued Lili - Tiaret	046 44 42 49			
2488	\N	4	\N	BENABDALLAH Brahim		Cité Ibn Khaldoune B6 - Tiaret				
2489	\N	4	\N	KACEM Mohamed		Cité karmane 216 Tiaret				
607	3	4	\N	CARRIERE CHEHAT	محجرة شحاط	10, Rue Debbabi Mohzmed W.Guelma\r\nZone Industrielle N° 01, Cité les Frères Rehabi, Avenue 202 - W.Guelma	0661 369 501	037 21 67 21		
462	3	4	\N	CARRIERE MARKRIA LILGHARB	محجرة مرقرية للغرب	Cité Dar El Beida, Bat F2 N°1, Oran, wilaya d’Oran	0661 20 11 29	041 40 64 89		
1625	1	4	\N	OUED EDDAHAB DE L'INVESTISSEMENT	شركة وادي الذهب للإستثمار	Cité Chouhada - El Oued	0658677695	032 12 69 32		
2718	11	4	\N	CMC - ENGOA EL AFFROUN HOCEINIA	كوبيراتيفا موراتوري و سيمونتيسيتي دي رافينا - المؤسسة الوطنية للمنشات الفنية الكبري العفرون حسينية	Lotissement El Feth N°09 Rimel El Hamra El Biar W.Alger	025 38 93 46	025 38 97 75		
2465	\N	4	\N	BENBEDRA Benaouda		Coopérative 1 Novembre Cité du 05 juillet W.Relizane	046  21 91 80			
3749	3	4	\N	ALTRAPCO	ألترابكو	13 villa individuelle, 10 Rue Remache Aissa Bordj Bou Arreridj	035 87 32 18	035 87 32 12		
3687	12	4	\N	COOPERATIVE ARTISANALE YOUNES LIL AMAL	التعاونية الحرفية يونس للأمل	Unité N° 03 W. M'sila	026 93 49 93    0550 991 363	026 93 03 80		
520	1	4	\N	MINERA	مينرا	18, Avenue Franklin Roosevelt - Alger 16000.	021 23 05 97 / 021 23 05 98	021 23 96 54		
437	3	4	\N	AGREGATS HAMIDI	حصى حميدي	Tabelbala centre ville n°12 W/Bechar	061 20 55 29/074 62 39 07			
3299	3	4	\N	GEDEN	جيدان	20 lot Bir Ouana El Chamalia -Elcherkia W-Telemcen	0661 44 65 66 / 043 275 000	043 27 37 14 / 043 275 000		
1388	3	4	\N	CARRIERES DE L'EST		49, Rue Benazzouz Belle Vue W.Constantine				
2690	1	4	\N	ETTU	مقاولة مسح الأراضي و الأشغال الريفية	Route de constantine, à coté mosquée errahmane, local N°05, Tébessa	06 61 34 74 19	029 73 20 85		
1939	1	4	\N	GB DIFFUSION	ج.ب.توزيع	Parc Poisson, villa n° 02 - El Biar - Alger				
4	3	4	\N	AMMARI GRAVIER & SABLE	مؤسسة عماري للحصى و الرمل	Chez Derradji Ramdane - Sigus - Oum El Bouaghi				
4209	1	\N	\N	BGO BRIQUETERIE	بي.جي.أو بريكيتري	Est RN 03 entre PK547 et PK548, Tamacine, TOUGOURT	029 67 03 08	029 67 03 08		
4211	\N	\N	\N							
2592	1	4	\N	REDLAND	رادلند	Zone Industrielle, commune de Hacine, Wilaya de Mascara	045 70 04 95	045 70 03 79		
2357	5	4	\N	FERPHOS	المؤسسة الوطنية للحديد و الفوسفاط	08, Rue Souahi Madani 23 000, wilaya d’Annaba	030 83 03 22	038 44 68 87	ferphos@ferphos.com	www.ferfos.com#http://www.ferfos.com#
2275	3	4	\N	EL BARAKA	البركة	Ouled Boughadou, Dahmouni - Tiaret.				
2354	1	4	\N	EL IKHLASSE EXTRACTION DE SABLE	الاخلاص لاستخراج الرمل	Cité Djebel Anoual, B 04/07, wilaya de Tébessa	0560 01 60 10.			
133	5	4	\N	SOPRESICAL		SOPRESICAL, Briqueterie - Ain Sefra - W.Naama	049 76 15 27	049 76 15 27		
723	1	4	\N	SBH		Zone Industrielle El Eulma W.Setif	036 87 69 69	036 87 65 65		
2133	3	4	\N	SOCIETE CIVILE IMMOBLIERE BELGHITH BRAHIM	المؤسسة العقارية بلغيث ابراهيم	Rue de la Mosquée El Kouif  W.Tebessa 	0772 63 56 30	021 39 24 02		
340	5	4	\N	SPGS	شركة إنتاج الحصى بسطيف	Route de l'abatoire déparmentale n° 71; BP 20 Sétif				
2544	1	4	\N	ECBRL / ENTREPRISE DE CONSTRUCTION, BATIMENT, ROUTES & LOCATION	مقاولة بناء العمارات و الطرق و التأجير	Zone d'activité BP 1251 - Laghouat.	0560062007	029 93 12 62		
2953	1	4	\N	SPRK / SOCIETE DES PRODUITS ROUGES KHEMIS MELIANA	شركة المواد الحمراء خميس مليانة	RN 4 Khemis Miliana	0772 35 03 77	027 64 75 67		
2982	1	4	\N	BRIQUETERIE NOUVELLE DU SERSOU	بريكوتري الجديدة سرسو	Rahouia - W.TIARET	0661 17 57 54	023 80 75 92		
3332	12	4	\N	COOPERATIVE ARTISANALE SIDI SAID		Commune de Oued Lilli W. Tiaret				
1713	1	4	\N	ETAHG		Logement n° 02 Bloc 400 - Sidi Abbaz - Bounoura - Ghardaïa	06 60 36 75 53	029 82 07 51		
670	2	4	\N	MEZLI & GHABACHE	مزلي وغباش	Cité 500 logements Bloc 13 N° 25   W. Sétif	036 93 72 00\n070 99 54 02	036 93 91 75		
287	1	4	\N	STIRA	سـتيرة	BP 304 Zone Industrielle - Mecheria	049 78 76 47	049 78 76 47		
3	3	4	\N	CARRIERE WASSIM ECHARK	محجرة وسيم الشرق	50, Avenue Rahmani Achour -W/ Constantine	061 30 63 50	031 96 55 99		
604	1	4	\N	AIN EL HADJAR	عين الحجر	N°331 Auto construction Chetouane.W - Tlemcen	0770 36 58 08 ou 0550 00 00 33	021 77 50 56		
2603	1	4	\N	TOUTRAM	توترام	19, Rue des martyres, Sidi M'hamed Benali - W.Relizane	046 94 15 39	046 94 15 40		
638	12	4	\N	COOPERATIVE KEF NASSER	التعاونية الحرفية كاف النسر	Hassi Diss Ouled Sidi Brahim  W.M'Sila	030 50 70 47 / 0770 12 06 88			
1944	1	4	\N	NATIONAL A+	ناسيونال أ+	Zone Industrielle de Oued Mazafran - Koléa - 42400 - W.Tipaza	024 48 68 31 / 024 48 31 99 / 070 91 24 37	024 48 49 92		
2602	3	4	\N	EL WAFA CARRIERES	الوفاء للمحاجر	Stade communal Boudjemaa Tahar, local 09 et 10, El Milia - Jijel.	0770 933370/ 034 42 61 53	034 42 71 92		
2793	3	4	\N	AGREGATS PROMOTION EL HASSAINIA	حصى الترقية الحساينية	Centre El Hsaïnia, Commune de Bouinane - W.Blida	025 39 45 01/ 0661 38 86 56	025 39 47 78		
2866	3	4	\N	SABCATRAP	مؤسسة الرمال المحاجر و الأشغال العمومية صابكتراب	Lotissement N°74 Lot n°110 Bordj Bounâama W.Tissemsilt	0550301786	046493712		
2836	1	4	\N	STGH	اس تي جي اش	Hay 1 er Mai Kseur Chellala w/Tiaret	061 63 45 43			
2724	3	4	\N	HAMIDA ABDELKADER TRAVAUX PUBLICS ET HYDRAULIQUES	حميدة عبد القادر لأشغال العمومية و الري	Rue Dellal Hocine, Oued El Djemaa - W.Relizane	070 54 34 16			
635	1	4	\N	EBTP TOUAT		Zone industrielle BP 98 - W.Adrar	049 96 95 90	049 96 95 90		
1482	1	4	\N	LOTOTRAS		Zone Industrielle Timimoune - W.Adrar	049 90 03 01	049 90 43 50		
1489	2	4	\N	CARRIERE EL ARAR GUENFOUD ET ASSOCIES	محجرة العرعار قنفود و شركائه	Tizghanit, commune de Beni Mester - W.Tlemcen	0550 53 83 80			
1221	2	4	\N	HEDNA & FILS	هدنة و أولاده	57, Rue Houari Boumediene -  W.Bordj Bou Arreridj.	0560 06 45 80	035 68 54 09		
2393	5	4	\N	ETC TEBESSA / ENTREPRISE DE CONSTRUCTION DE TEBESSA	مؤسسة الأشغال و البناء تبسة	BP 86 Z.I Tebessa	037 49 42 07	037 49 36 03		
589	3	4	\N	AZZI OMAR		56, Rue des Frères Kaidi W.Tiaret	046 41 37 01	046 41 37 01		
2038	1	4	\N	ETPS	مؤسسة الأشغال العمومية و النفق - أس.تي.بي.أس	Zone Industrielle de Sidi Bel Abbès - W.Sidi Bel Abbès	0661 43 43 40-0555 03 77 76	048 56 85 92		
87	1	4	\N	SOCIETE D'EXTRACTION D'AGREGATS M'ZARA	شركة استخراج الحصى مزارة	Cité du 20 Août 1955, n° 12 - Sétif	0771 881 953	030 60 40 40		
2880	1	4	\N	BRIQUETERIE SITIFIS	صناعة الاجر بريكترى ستيفيس	Zone Industrielle Lot N° 17 -  W. Sétif	036 83 19 63	036 91 63 70		
1745	1	4	\N	SOCIETE DE CONSTRUCTION TCE BOUZAD		42 Rue du stade de Baghlia  W. Boumerdès  BP 66B 	071 99 09 39\n061 65 09 43			
1883	1	4	\N	LES TUFS DE TINBDAR	لي توف دو تينبدار	Tazmalt 06270 W.Bejaia	034 22 16 10\n061 63 08 78	034 31 38 33	Rochverte@yahoo.fr	
209	1	4	\N	COTAPI HAYAT		659, Rue Saint Jean ,Cité Colonel Abbes ain Turk w/Oran	053 83 92 11			
210	3	4	\N	CARRIERE EL BIBANE	محجرة البيبان	N° 07 Lot Taïb Kheïra - BBA	061 37 04 54	035 68 81 02 / 036 84 16 24		
3248	1	4	\N	G.S.G ALGERIE	جي اس جي الجزائر	Zone Industrielle Oued Sly, W, Chlef	027 71 15 78	027 71 09 66		
1494	3	4	\N	CARRIERE KHETTAB ABDERAHMANE		2, Rue K, Mezawrou W. Sidi Bel abbes	048 58 75 87			
2350	3	4	\N	BENLABIOD MOHAMED	بن الأبيض محمد	Cité Guennani Bloc 183 n°03 ; Djelfa	027 87 41 09	027 87 41 09		
2351	1	4	\N	CHERIF DES SERVICES MINIERS & ENTREPRISES	شركة شريف للخدمات المنجمية و المقاولات	BP 102 - Reguiba - El Oued	032 27 36 36	032 28 03 01		
613	3	4	\N	THOUILILA	ثويليلة	19, Rue de la Révolution BP67 Oued Fadha W.Chlef	027 74 74 91\n027 74 74 32			
1315	1	4	\N	NOUADI AGREGATS & SABLE	نوادي للحصى و الرمل	Rue de 1er Novembre N°60 - Ain Fakroune - W.Oum El Bouaghi	032 40 33 38			
2383	1	4	\N	EL HASSA	الحصى	41, Rue Emir Abdelkader - Sour El-Ghozlane - W.Bouira	026 96 85 40	026 96 71 64		
2384	3	4	\N	ATTALA SMAIL		Oued El Alenda Mihouanssa  EL OUED	032 21 05 52			
2977	3	4	\N	ENTREPRISE ESSALAM AGREGATS	مؤسسة السلام للحصى	N° 237, cité des 290 logements,W, Tiaret	07 73 33 13 92			
3081	1	4	\N	ALLIANCE BRIQUETERIE	لا ليانس بريكاتري	Route de Ain Beida, Commune de Begai, W, Khenchela	06 61 74 45 10			
1409	1	4	\N	SECARA  GROUPE		Lot Maamoura Bouameur - Laghouat -	029 92 73 12\n070 89 19 13	029 92 73 12	secaradz@hotmail.com	
1412	1	4	\N	BLZ		42, Rue Aït Boudjemaa - Chéraga - Alger	021 36 67 36	021 36 63 31		
1200	3	4	\N	CARRIERE AMRANI SAID	محجرة عمراني سعيد	05, rue de l’indépendance-Oued Taghia, wilaya de Mascara.	045 85 15 09	045 85 15 09		
3152	1	4	\N	AGREGATS EL MOURAD	الـــحصى المــــراد	Rue Mustapha Ben Boulaid N°109, Chelghoum Laïd, wilaya de Mila	0551 71 44 83	036 74 30 48		
3154	3	4	\N	CARRIERE MERAH EL HADJ	محجرة مراح الحاج	Hay Nasr Zone 11   N° 124    Chlef	027 77 97 60	027 77 61 87		
3155	3	4	\N	AKADH IMPORT EXPORT	مؤسسة عكاظ للاستيراد و التصدير	Local N°2 Route nationale n°16  Bir El Ater W,Tebessa	0661 36 62 27	038 86 19 10		
3156	3	4	\N	TAHIR MOKHTAR EXPLOITATION CARRIERE D'AGREGATS	طاهير مخطار لاستغلال محجرة الحصى	 Route de Bouchekif N°11 - W.TIARET	0770 88 24 83	046 41 58 30		
3157	1	4	\N	ZIRAKAM SERVICES	زركام للخدمات	586/38 cite Didouche Mourad, Ain Oussara - Djelfa.\r\nAntenne: 19 cité des Bananiers Mohammadia Alger	021 46 15 69	021 46 15 66		
2196	3	4	\N	CARRIERE D’AGREGATS SOLIDES	مقلع الحصى الصلب	Cité El Harbi, Kebassa N° 725, wilaya de Tlemcen	0661 22 13 71	043 20 31 02		
497	1	4	\N	BT HARMLIA		Cne Harmlia Daira de Ain Kercha - OEB	021 682897-061 531800	2.16703e+007		
3306	1	4	\N	URBANISME B.H	للتعمير بي أش	Cité Belghzal, Bt 602, n°12 Groupe 135/280,W, Djelfa	0550 11 13 34 /0775 36 80 21	027 86 14 42		
3307	1	4	\N	SEL EL HAMRAIA	شركة أملاح الحمراية	Zone D'activité Hamraia, W, El Oued	032 21 76 60	032 28 31 49		
4498	1	\N	\N	IHANTDJOUK LI TANKIB	اهنتجوق للتنقيب					
3100	3	4	\N	FAST TRAILER	فاست تراير	BP 732 ZONE INDISTRIELLE HASSI MESSAOUD   OUARGLA	0795 01 64 95	029 73 16 40		
327	1	4	\N	AL MALLAHATE	الملاحات	BP n° 233 Chouhada Guemar 39403 - El Oued	032 10 14 80	032 10 18 81	contact@al-mallahate.com	www.al-mallahate.com#http://www.al-mallahate.com#
1729	3	4	\N	BRIQUETERIE NOUSSOUR		Commune de Taglait-  Daïra de Bordj Gh'dir - W.Bordj Bou Arreridj	035 65 92 62\n072 16 05 45	035 65 92 63		
1061	2	4	\N	BOUZEKRI ABDELAZIZ & FRERES		Tanefdour  18300 El Milia    W. Jijel	034 42 71 63\n061 30 07 16			
1465	5	4	\N	ERTT / ENTREPRISE DE REALISATION & DE TRAVAUX DE TAMANRASSET		Route de l'aéroport BP 230 RP - 11000 - Tamanrasset	029 34 25 84	029 34 25 84\n029 34 12 75		
2585	1	4	\N	ENTREPRISE DE CARRIERE BOUNAAMA	مؤسسة محجرة بونعامة	Ain Makhoukh, Route de Sidi Slimane - Bordj bounaama - W.Tissemsilt	046 49 31 83 / 061 28 02 89	046 49 38 85		
1381	2	4	\N	FRERES BOUZEKRI	الإخوة بوزكري	43, Route nationale, Milia - Jijel	061 33 55 25			
2114	1	4	\N	ALFA	ألفا	BP n° 10, Hassi Mefssoukh - Oran.	041 45 55 29 / 041 45 55 30 / 021 24 55 03	041 45 55 31 / 021 24 93 80	eramcdz@yahoo.fr	
498	3	4	\N	ROCHE EL HARIRI D'ALGERIE		BP n° 74 Cité Belle Vue ; 14000 Tiaret	046 42 73 77	046 42 29 14		
1981	2	4	\N	ENTREPRISE AGREGATS DE L'EST FRERES BEDDOUD	شركة حصى الشرق الاخوة بـدود	08, Boulevard Souidani Boudjemaa - W.Guelma	061 36 04 73 / \n037 20 04 52	037 21 54 50		
3382	2	4	\N	CARRIERE OULED ADDI LES DEUX FRERES BOURAS & Cie		Cité Benyounes El Hadj Bt N°01 2eme étage N°12.	0770 38 38 14			
3383	12	4	\N	COOPERATIVE ARTISANALE LES ARTISANTS SABLIERS			0661253939			
641	1	4	\N	EL KHANDAK EL KEBIR	الخندق الكبير	Tizghanit, Beni Mester, Daïra de Mansourah W.Tlemcen	092 24 85 66/ 071 80 87 67	043 27 15 21		
2663	1	4	\N	SMCM	شركة مواد البناء متليلي	Zone d'Activité Metlili - W.GHARDAIA	029 82 42 01	029 82 42 01		
173	1	4	\N	RIMEL DHAHABIA	الرمال الذهبية	04,Rue Younsi Ahmed Tahar Souk Ahras	061 39 01 96			
174	5	4	\N	ECPA / ENTREPRISE COMMUNALE DE PRODUCTION D'AGREGATS D'EL ADJIBA	المقاولة البلدية لإنتاج المجمعات بالعجيبة	RN N°5 10160 El Adjiba	026 95 47 01	026 95 57 99		
407	5	4	\N	ECP BOUGAA		01,Rue Chinoune Mohamed, Bougaa; Sétif	036 80 23 18	036 91 27 10		
2765	5	\N	\N	ORASCOM CONSTRUCTION & INDUSTRIE ALGERIA	اوراسكوم للانشاء و الصناعات الجزائر	03 bis, Rue Raoul Payen, Hydra - Alger	021 60 27 75 / 021 48 12 04	021 48 13 00	khaled.eldegwy@orascomci.com	www.orascomci.com#http://www.orascomci.com#
1924	1	4	\N	CARRIERE EL SAKHR EL ATIK	محجرة الصخر العتيق	Djebel Oum Settasse, Ain Abid Constantine	0550 506 347	031 94 07 54		
2958	1	4	\N	FAYMED MAZARI	فايماد مزاري	Zone Industrielle de Chetouane desserte n° 06\r\n BP 598 w.Tlemcen	043 27 74 26/56, 0661 22 15 18	043 27 76 34		
2251	1	4	\N	AGREME	أقريم	ZI Bordj  Bou Arreridj  Route de M'sila	035 68 01 59	035 68 42 03		
2868	1	4	\N	SNCTP / STE NOUVELLE CARRIERE ET TRAVAUX PUBLICS	شركة المحجرة الجديدة و الاشغال العمومية	Cité Bel Air Ain Beida w/O.E.B	061 59 86 92			
3209	3	4	\N	LBC	أل.بي.سي	Zone Industrielle Ouled Mendil, Douera, W, Alger	0661 51 58 21	021 40 03 22		
1791	3	4	\N	ETP CHERAB MEKKI	مؤسسة شراب مكي للأشغال العمومية	Citée des 700 logements - W. Khenchla	032 32 37 53 / \n061 34 80 07	032 31 79 17		
3314	1	4	\N	GRAVITOS	غرافيطوس	Cité El Bousténe N° 325, W, Batna	033 86 66 46	033 86 66 46		
3468	3	4	\N	SABLIERE LINA	مرملة لينا	01 Rue Hakim Saâdane Cité El Salam   W. Biskra	0770 42 60 06			
218	1	4	\N	CARRIERE MAZLA		Cité Draibina  Ain Abid  Constantine				
403	1	4	\N	AHCENE BRIQUE	احسن بريك	Hotel Tergui BP N° 498  BBA	035 65 10 02			
4148	2	4	\N	GOUICHICHE ET FILS EXPLOITATION DE CARRIERE	قويشيش  و ابناؤه لاستغلال المحاجر	Kef Lahmar, Commune de Guedjel, Sétif	036 96 34 42	036 96 34 42		
259	5	4	\N	EASK / ENTREPRISE D'AGREGATS & SABLE KNIF	مؤسسة الحصى و الرمل لكنيف	Cité Tamachit en face 1272 logts, wilaya de Batna	0555 08 00 05	033 28 63 31		
169	3	4	\N	CARRIERE AYADI DJENOUDI	محجرة عيادي جنودي	Rue Kanouni Tayeb  Ain Beida				
3350	3	4	\N	EZZOUHOUR	الزهور	Lotissement 26 Avril N°13, wilaya de Souk Ahras	0661 39 00 24	037 76 55 90		
3345	1	4	\N	MBA DJEDID	أم.بي.أ جديد	Rue Mansour Ahcene, n° 4 Medrissa - Tiaret	0771 21 19 91			
2748	5	4	\N	HOLDING SONATRACH ACTIVITES INDUSTRIELLES EXTERNES	هولدينق سوناطراك للنشطات الصناعية الخارجية	BP 74, Ain El Bia, 31230 - Bethioua - W. Oran	041 47 78 92	041 47 15 82		
3074	15	37	\N	SOCIETE EN COMMANDITE RESSOURCES TIREK. LP		1410, Rue Stanley, Suite 606, Montréal (Québec) - Canada H3A 1P8	(514) 849-3013	(514) 849-9181	khobzi@cancor.ca	
2937	2	4	\N	CARRIERE SADAOUI & ASSOCIES	محجرة سعداوي و شركائه	Commune de Guedjel - W.Sétif	071 55 29 15	036 84 60 52		
2938	8	4	\N	AGENCE DE WILAYA DE GESTION FONCIERE URBAINE D'EL OUED	الوكالة الولائية للتسيير و التنظيم العقاريين الحضريين بالوادي	Cité 17 Octobre  El Oued  W.El Oued	032 21 01 85	032 21 01 85		
2074	3	4	\N	HAMOUDI ECCPA	مؤسسة حمودي لاستغلال محجرة لتفتيت و انتاج الحصى	Ain Touila  W de Khenchela 	032 35 01 84 / 032 32 05 88	032 32 26 07 / 032 31 61 50		
1890	1	4	\N	ATRB / ALGERIE TRAVAUX ROUTIERS & BATIMENT	الجزائر أشغال الطرقات و البناء	5, Rue Chikh Amar Ain El Hammam W/ Tizi Ouzou	026 26 91 05	026 26 07 07		
1648	5	4	\N	STARR / SOCIETE DE TERRASSEMENT, D'AMENAGEMENT & DE REVETEMENT ROUTIER	شركة تسوية و تهيئة و تعبيد الطريق	BP 104, Abou Tachfine - W. Tlemcen	043 39 91 53/90-80	043 38 93 06/07	contact@starr-dz.com	
2646	3	4	\N	BENAMAR TRAVAUX PUBLICS	بن عمر للأشغال العمومية	Route de Touggourt - W. ElOued	061 38 51 60			
2368	3	4	\N	SBTMS	أس.بي.تي.أم.أس	Z.I de Touggourt - W. Touggourt	029 69 62 26	029 69 61 81		
926	3	4	\N	CARRIERE HALLIS SABLE & AGREGATS	محجرة حليس للرمل و الحصى	Cité El Nasr - Rue "G" n° 35 - Batna	033 86 50 73			
4566	1	\N	\N	ITMA NELKHIR	ايتما نلخير					
1916	5	4	\N	GROUPE EC OUEST	مجمع مؤسسة الخزف الصحي للغرب	Boulevard de la Soumam,  BP 216 Imama W/ Tlemcen	043 20 13 72\n043 20 64 42\n043 20 64 28	043 27 35 83\n043 27 88 41	ecotlm@yahoo.com	
1917	3	4	\N	CARRIERE RAMOUL MOHAMED	محجرة رمول محمد	Cité Merah Zerguine N° 03 - Nechmaya - W.Guelma	061 36 04 42	038 89 20 52		
1201	3	4	\N	BOUGHEFALA DES TRAVAUX PUBLICS		44, Rue Hai Moulay El Hachemi - Ain Sefra - W.Naama	061 26 00 67			
1125	3	4	\N	CARRIERE DE GRAVIERS RAMDANI ALI	محجرة الحصى رمضاني علي	N° 725, Kebassa W.Tlemcen	043 20 31 02	043 20 77 72		
2319	2	4	\N	CARRIERE FRERES GAGAA	الاخوين قعقاع محجرة	Cité Nadjma N° 46 - Ain Fakroun - W.Oum Bouaghi / BP 30 Ain Abid Constantine	032 40 13 52 / 0550 50 46 98	032 40 11 49		
2980	1	4	\N	BOUKHENOUFA MOURAD PRODUITS ROUGES	بوخنوفة مراد للمواد الحمراء	64 Cité Barek Afouradj,Boulevard Boukhlouf Mohamed El Hadi w.Batna	033 82 21 13	033 82 21 13		
2446	1	4	\N	EL KHALIL	الخليل	Rue Boussaid Amar -  Ain Fakroun - W.Oum El Bouaghi	0770 125 260			
2614	5	4	\N	SOALKA / SOCIETE DES KAOLINS D'ALGERIE	الشركة الجزائرية للكاولين	45, Rue de la Soummam  W. Jijel	034 47 79 56	034 47 34 43	soalkaolin@hotmail.com	
3327	1	4	\N	SOPROMIN	صوبرومين	Tabainet Commune de Bouinane , Wilaya de Blida	0698 41 02 70			
4145	5	4	\N	BABAHOUM	باباهم	Dar Arrousse, N° 02, Commune de Branis, Biskra	033 62 73 61	033 62 73 59	Hoggui-laid@yahoo.com	
171	3	4	\N	EL FAROUKIA CARRIERES	الفاروقية للمحاجر	Cité Kouicem A/Hak, Rue Djebar Ali n°07 W,Souk Ahras	061 39 02 60	037 35 24 69		
2467	\N	4	\N	ZERBIT		Cité 20 Août 1955 - Guemar - El Oued	032 24 06 06	032 24 06 06		
1535	3	4	\N	HIDJARAT EL ABASSIA	الحجارة العباسية	20, Cité Marhalat 03, Takhmaret, wilaya de Tiaret	0550 27 95 05			
1536	3	4	\N	OULD OUALI	ولد والي	Cité lardjen N° 04 - W.Saida	061 56 48 27 / \n048 50 42 64	048 51 35 44		
768	1	4	\N	HYDROMINE	هيدرومين	Cité El Yasmine  N° 25 A, Draria - W.Alger	021 35 53 81 / 072 22 19 80	021 35 53 81 / 072 22 19 80	hmalg@yahoo.fr	
1914	3	4	\N	GCTe		Zone Industrielle de Ain Defla  44000   BP 89  W. Ain Defla	070 91 24 37\n027 64 75 67			
1997	3	4	\N	MAC	ماك	Cité Boumédiène n°93 Wilaya de Tiaret	0550 32 56 67			
1977	3	4	\N	STATION INDUSTRIELLE DE CONCASSGE BENSALLOUA	محطة صناعية لتكسير الحجارة بن صلوة	Cité 17 Octobre, Rue S ,N°17  W. Bordj Bou Arreridj	0668 77 79 75	035 68 16 32		
163	3	4	\N	CARRIERE LA PETITE BLANCHE	محجرة لابوتيت بلانش	Djebel Bouakouz Commune Aïn El Beida Wilaya d’Oum El Bouaghi.	0550 95 64 25			
624	3	4	\N	SAECS	الشركة الجزائرية لاستغلال المحاجر و الرمال	Kabouba Oued Lili - W.Tiaret.	0661 51 04 67			
1269	5	4	\N	SOPRABA	شركة انتاج الحصى و قواليب البناء - صوبرابا	Base G.T.H - Zerizer - El Tarf	038 68 42 19	038 52 12 32		
1270	3	4	\N	EL HANA		Cité Kharoubiers Rue C N° 112 W.ANNABA	03884 75 38	038 84 75 38		
2235	1	4	\N	SABLIERE ECH CHAMES	شركة مقلعة الرمل الشمس	Cite 40 villas N° C 3 Ouargla	029 76 13 34	30 76 13 34		
401	3	4	\N	RAHMOUNE ABDELKADER	رحمون عبد القادر	Zone Industrielle Oued Sly - Chlef	027 71 09 57     027 70 09 98	027 71 09 66		
536	1	4	\N	DIBAT FILS TEBBAL AHMED	ديبات أولاد طبال أحمد	11 Rue Radjaa Abdelmadjid, Bel Air; Tlemcen	043 20 05 00	043 20 05 00		
1319	2	4	\N	CARRIERE ESSAKHRA EDAHABIA BOUSSAID & GAAGAA	محجرة الصخرة الذهبية بوسعيد و قعقاع	Cité Boussaid Amar - Ain Fakroun - W.Oum El Bouaghi	061 37 86 52 			
2220	5	4	\N	ENIR	المؤسسة الوطنية للعمل و التجديد	BP 44 Oum Drou  Chlef	027 71 83 11 	027 71 82 88		
229	2	4	\N	KEBBICHE & CIE	كبيش و شركائه	N° 592 Rue Ketfi Salah cité kaaboub, W-Sétif.	036 63 41 41 – 0550 46 51 12	036 63 41 42		
2243	3	4	\N	CARRIERE ARIS KHODJA	محجرة عريس خوجة	BP 14 Djebel Grouz, commune Ain Melouk, w MILA	030 26 60 28 / 0770 74 61 65 / 0770 74 61 66	031 53 62 62		
2244	5	4	\N	SOTRABA BATNA	شركة أشغال العمارات باتنة	Zone Industrielle - BP 354 - W.Batna	061 34 10 52			
1851	2	4	\N	AGREGATS GROUZ FRERES BENISAAD	حصى قروز الاخوة بني سعد	Djebel Grouz, commune Ain Melouk - W. Mila	031 52 85 33	031 52 85 33		
3007	3	4	\N	SEIF SIDI AHMED	مؤسسة سيف سيدي احمد	Rue Colonel Amirouche, Meniaa, w,Ghardaia	029 81 57 57	029 81 57 57		
3008	2	4	\N	ROBAT HATTOU ET CIE	روبات حتو و شركائه	Coopérative Essalam  N° 02   G 13   Kouba  W. Alger	020 31 42 31/070 94 29 06			
2483	\N	4	\N	BENHAMIDA						
1010	1	4	\N	SOPRAF	سوبراف	BP 51 - Carrière Cap Djinet - W. Boumerdès   	026 28 46 17\n061 65 06 19	026 28 46 17		
1012	1	4	\N	ETBHTR  SAHRAOUI	أو.تي.بي.أش.تي.أر صحراوي	Cité Houari Boumédienne Secteur 119  N° 6 Ain Oussera   W. Djelfa	027 82 20 28	027 82 20 27		
487	2	4	\N	SEN DRISSI MOHAMED & CIE	سن دريسي محمد و شريكه	35,Rue du 17 Octobre 41000 Souk Ahras	037 32 13 51 	037 32 13 51		
1893	1	4	\N	SOCIETE DES TRAVAUX PUBLICS ENNADJAH	شركة الأشغال العمومية النجــاح	26, Rue Zighoud Youcef - El- Hadjar - W.Annaba	070 53 35 36			
1498	2	4	\N	KOREIB REDA, EL GHAZI SMAIL & ASSOCIES - EL AMANA	كريب رضا و الغازي سماعين و شركئهما - الأمانة -	Terni, W. Tlemcen	040 90 96 50	040 90 96 51		
125	5	4	\N	STOSKI / SOCIETE DES TRAVAUX ROUTIERS DE SKIKDA	شركة أشغال الطرق سكيكدة - سوتسكى	Zone dépôt Hamrouche Hamoudi, BP 96 Skikda	038 92 49 55	038 93 14 57		
126	5	4	\N	EPTR EST		ALTRO petite zone undustrielle BP 99 ; Skikda	038 75 77 11	038 75 63 77		
2128	1	4	\N	CARRIERE EL BOSPHORE	محجرة البصفور	Cité 1er Novembre n°4 Ain Abid BP 269, Constantine	0661 585 110	031 81 60 36		
2231	1	4	\N	CARRIERE EL MAROUA	محجرة المروة	BP N° 67Ain Abid W.Constantine	061 30 60 39	031 97 32 90		
1318	3	4	\N	CARRIERE GHENAI ABDELMADJID		Djebel Kroun Chaabat Louz - Sigus - W.Oum El Bouaghi				
332	1	4	\N	BABAHOUN DAOUED		05, Rue Léon Dubois - Annaba 23000	038 86 05 61\n038 86 35 66	038 80 38 46	mgmdz@yahoo.fr	
660	1	4	\N	TPC OUEST	تي بي سي غرب	340 logts Bt25 B n°03, 1er étage Esseddikia, Oran	0550 285 370	041 42 52 82		
3301	1	4	\N	FCLP	أف سي أل بي	24, Chemin des crêtes - Bejaia	034 20 11 96			
484	2	4	\N	BBA MARBRE	برج بو عريريج رخام	Zone d’activité route de M’sila – Bordj Bou Arreridj	0661 78 84 71	035 87 62 21		
138	2	4	\N	KEBBICHE EXTRA PLATRE	كبيش EXTRA PLATRE	Commune de Guellal Wilaya de SETIF	036 63 24 04 et 0661 77 77 73	036 63 24 07		
2974	1	4	\N	SOGECAR	صوجيكار	Commune de Baba Ahcen w/Alger	062 63 76 57	037 32 67 15		
1178	5	103	\N	ARCELOR MITTAL ANNABA	ارسولور ميتال عنابة	Cité Complexe Sidérurgique d'El-Hadjar BP 2055 Sidi Amar -El-Hadjar- W.Annaba	038 87 18 19	038 87 65 85	siderdg@ist.cerist.dz	
2942	1	4	\N	TVHB / ENTREPRISE DE TRAVAUX PUBLICS ET HYDRAULIQUE	مقاولة أشغال العمومية و الري - تي.في.أش.بي					
1686	3	4	\N	GITEC	جيتاك	Zone Industrielle BP 32 - Cité Kechida - W.Batna	033 85 13 73 / \n061 34 09 57	033 92 13 23		
3177	3	4	\N	DJENNANE GRAVIER ET SABLE	جنان للحصى و الرمل	Djebel Mimel ,Ouled Ziad , Ain M'lila   W.Oum El Bouaghi	0770 97 79 05			
3178	2	4	\N	RABIA ET FRERES STATION DE SERVICES SAHEL	ربيع واخوانه محطة الخدمات ساحل	STATION LE SAHEL NAFTAL CW 42 ALLAGHAN COMMUNE TAZMALT W. BEJAIA	026 95 50 42	026 95 50 42		
3179	3	4	\N	ARGILEV	ارجيلاف	10, Rue Mont Froid , Birkhadem, W. Alger	021 552 178			
3087	3	4	\N	CHAHRI ALLEL EXPLOITATION DES CARRIERES & CONSTRUCTION	شهري علال لمقالع الحجر و البناء	Tagdoura Commune de Tireche  W . Saida	072 59 94 82/048 51 83 80			
496	5	4	\N	HOURIA IKRAM INDUSTRIE	حورية اكرام للصناعة	7, Impasse Djemila, Hydra - Alger	0661 55 25 30	021 60 88 24	houriaikram@taures.dz	
2452	\N	4	\N	AMARA KORBA Mohamed Aziz						
2453	\N	4	\N	IDIR Abderahmane						
2454	\N	4	\N	SEGHIR Abdelmadjid						
2644	3	4	\N	IMAGIS	ايماجيس	Cité Bachdjarah 2 Bt 37 n° 4, Bourouba - \r\nW. Alger	021 021 93 81	021 021 94 05		
3085	5	4	\N	CERAMIR REMCHI						
1008	3	4	\N	BENAOUN TRAVAUX PUBLICS	بن عون للأشغال العمومية	BP 94 - Sidi Boughoufala - Ouargla	029 71 15 53	029 71 50 80		
468	3	4	\N	CHEIKH		n° 30 Rue Lala Fatma; Sougueur; Tiaret				
1833	3	4	\N	DJERBIR DJILLALI		Cité Benama W . Relizane	046 91 30 22	046 92 45 58		
3357	2	4	\N	BOMACO BOUZID & CIE	بوماكو بوزيد و شركائه	8 cite Benadjel Boudouaou     BOUMERDES	0770 56 18 71	024 81 49 27		
1732	3	4	\N	HASNAOUI NOUREDDINE EXPLOITATION DES CARRIERES		Commune de Ain-M'Louk Chelghoum-Laid  W.Mila	061 59 78 24			
3351	1	4	\N	IMPORT EXPORT EL GOLEA	الاستيراد و التصدير القولية	zone d'activité      commune El Meniaa	029 81 38 61	029 81 47 67	elgolea@gmail,com	
5	5	4	\N	SOTRARBO / SOCIETE DE TRAVAUX ROUTIERS DE BOUIRA	مؤسسة أشغال الطرق بالبويرة	Zone des Parcs BP 64 - Bouira 	026 94 23 38	026 94 24 20		
6	5	4	\N	ETB / ENTREPRISE DE TRAVAUX DE BOUIRA	مؤسسة الأشغال لبويرة	Zone des Parcs BP 49 - Bouira 	026 93 44 81	026 93 05 50		
533	1	4	\N	BRIQUETERIE EL AFAK	بريكاتري الافاق	Zone Industrielle n°18 ; Sétif	036 91 75 26	036 91 63 70		
2226	1	4	\N	MOSTA SABLIERE		Aizeb W/Mostaganem	021 86 92 23	021 86 92 23		
1025	3	4	\N	EL KOUDIA	الكــديــة	25, Ain Hadjar W.Tlemcen				
333	1	4	\N	SOMAEST	شركة الرخام بااشرق	Zone Industrielle Route Ben Badis - Khroub W Constantine	0662 66 66 20	031 95 43 91		
3736	3	4	\N	AFRO QUARTZ	افرو كوارتز	Résidence Essahel Bt 9, 6eme étage - Rue 8 mai 1945 Bab Ezzoaur	0770 67 67 78	023 81 15 36		
1397	2	4	\N	EL WIAM BENAMARA & CHELGHOUM	الوئام بن عمارة و شلغوم	BP 99 Bouandas (19500) W.Setif	061 35 09 33			
2190	1	4	\N	STB / SOCIETE TIMACINE BRIQUES	تمــاسيـن آجـر	BP 38 - Temacine - Touggourt - Ouargla 30 230	029 63 43 53/54	029 63 42 00	temacinebrique@hotmail,com	
2191	5	4	\N	MEDITRAM	مديطرانيان للأشغال البحرية - مديترام	Voie C - Zone Industrielle BP 143, Reghaia - ALGER	023 86 40 35	023 86 40 30		
2192	2	4	\N	FRERES YAICHE EXPLOITATION & VENTE DE SABLE JAUNE	الإخوة يعيش لإستغلال و بيع الرمل الأصفر	Cité Brik Abdelkrim H. Bouziane W.Constantine	072 46 10 40			
1998	5	\N	\N	ORASCOM CONSTRUCTION & INDUSTRIE	أورسكوم للانشاء و الصناعة	160, Rue du 26 Juillet - Agouza- Le Caire, Boite Postale 1191, Egypte	202-302 69 30 	202-202 05 06		
2284	3	4	\N	MOKHNACHE PRODUCTION D'AGREGATS & MATERIAUX DE CONSTRUCTION	مخناش لانتاج الحصى و مواد البناء	Rue Fares Ain Baida	037 32 67 15			
1548	1	4	\N	LES INDUSTRIES CERAMIQUES		Zone Industrielle Didouche Mourad  W.Constantine	031 90 67 82\n031 90 51 82	031 90 51 83		
1546	1	4	\N	GIS CAR		Cité 111, Lot n° 55 b -Télaghma - W.Mila	061 50 76 67			
454	5	4	\N	NETRO / NOUVELLE ENTREPRISE DES TRAVAUX ROUTIERS	مؤسسة الجديدة لأشغال الطرقات	SPA NETRO Oum Drou - Chlef 	027 71 80 28	027 71 80 28		
1120	1	4	\N	HARHOUZ BRAHIM & FILS EXPLOITATION DE CARRIERES	حرحوز ابراهيم و أبنائه إستغلال المحجرة	FG Mebarki Said W.Guelma	037 26 56 80			
636	3	4	\N	CARRIERE KAID		Ochba ,Commune Ain- Fezza, Daïra Chetouane W.Tlemcen	043 27 41 00			
637	12	4	\N	ZOUBIRI ABDERAHMANE	زوبيري عبد الرحمان	BP N°  96 Eddis  28211 W. M'Sila	035 51 05 48\n072 44 82 66		Chara fr@yahoo.fr	
1007	5	4	\N	SCP / SOCIETE DE CONSTRUCTION ET DE PROMOTION	مــؤسسة البـــناء و التــرقية	Route de Sidi Moussa Baraki Alger	021 53 34 15	021 53 34 14		
2113	5	4	\N	ECM / ENTREPRISE DE CONSTRUCTION DE MASCARA	مؤسسة البناء لمعسكر	BP76 Route Sidi Ahmed Mascara	045 81 37 17	045 81 62 64		
2085	5	4	\N	ENTREPRISE EL GUENDOUZ & CIE	مؤسسة القندوز و شركائه	Centre Ali Bouhadja - Bir Touta - Alger	021 90 47 74 / 050 57 73 00	021 90 47 74		
510	3	4	\N	SOCIETE BAGHZOU MOHAMED D'EXPLOITATION DE CARRIERE & PRODUCTION D'AGREGATS & SABLES		Cité Belle Vue BP 2076; Khenchela 40000	061 34 71 52	032 32 37 19		
2087	3	4	\N	MESBAH	مصباح	26 Cité des 290 logements Hai ZAAROURA TIARET	0772 468 930			
2677	1	4	\N	ALLEM & FILS ETBHTS	علام و ابنائه أو.تي.بي.أش.تي.سي	Zone Industrielle - W. Ain Temouchent	061 22 70 11 / 043 60 23 53	043 60 22 53		
38	1	4	\N	EETPRH	مقاولة دراسات الأشغال العمومية و المنجزات الهيدرولية	13, Rue de CNRA ; Annaba 23000	06 61 32 11 76			
1772	2	4	\N	CARRIERES ARIS & CIE	محاجر عريس و شريكه	Cité Ben Boulaid, Chelghoum Laid - W.Mila	036 84 60 52	036 84 60 52		
957	2	4	\N	KERMEZLI TORKI  & FRERES	قرمزلي تركي إخوة	14, Quartier Mokeddem Benyoucef - W. Medéa	025 58 96 85	025 58 53 82	snc_kermezli@yahoo.fr	
3255	1	4	\N	CARRIERE ASCOM	محجرة اسكوم	26 Novembre1964, Bir El Arch W, Sétif	031 53 22 22 - 0661 33 87 26	031 53 24 24		
3361	3	4	\N	ESBM ENTREPRISES	أو,أس,بي,أم  للمقاولات	n°146/24 Hai El Badr, Bousaada, M'sila	0770 23 57 23 /0550 12 99 20	035 52 40 40		
4218	1	\N	\N	ASSILAT NADJAH	أسيلات النجاح	Rue Nakadi Bachir, Commune de Sabra, Tlemcen	043 4376 76 – 043 43 77 99	043 4376 76 – 043 43 77 99		
3917	1	4	\N	EDHAIA BRIQUETERIE	الـضياء لصـناعة الآجـور	Ilot 96, Rue de l'indépendance, Touggourt – W. Ouargla	021 75 37 50	021 75 37 50		
1847	3	4	\N	RAHMANI MATERIAUX DE CONSTRUCTION		Mnagueur - Ouargla	029 62 17 83			
3710	12	4	\N	COOPERATIVE ARTISANALE EL FETH EL MOUBINE DES SABLIERES	التعاونية الحرفية الفتح المبين للمرامل	04 , Cité des fonctionnaires , route de Djelfa , Bousaâda W. M'sila	0795 636 740			
4738	1	4	\N	CARRIERE F BAR	محجرة اف بي ا ار	Lotissement 203 N°171, RDC, Mchira, Mila	06 61 91 81 75			
2115	3	4	\N	ENTREPRISE CARRIERE ZOUABI	مؤسسة محجرة الزوابي	Cité 55 logements, Ouenza, wilaya de Tebessa	0561 61 99 45			
2891	1	4	\N	RAS EL KHAIMA AGREGATS	رأس الخيمة للحصى	Z.A.I n°161 Lot n°61 route de M'Sila W/ Bordj Bou Arréridj	0770 12 87 54	035 87 63 18		
1048	1	4	\N	SABLIERE OUED EZZOUHOUR	مرملة واد الزهور	Cité El Meridja, Commune de Milia - W.Jijel	061 33 54 50 / \n061 33 88 58			
4144	1	\N	\N	BASLIMAN CHAUX BERRIANE		Zone artisanale Soudane BP 3996-47100 Berriane, Ghardaia	029 84 37 66	029 84 37 45		
449	3	4	\N	CARRIERRE KHELAF YAMNA	محجرة خلاف يامنة	Cité Cherguia n° 118 - Zeralda	061 60 67 68 - 077 88 99 00			
2774	1	4	\N	SLIM ZEG GRANDS TRAVAUX ROUTES & AEORODROMES	سليمزاق الاشغال الكبرى	Djebel Youcef, Commune de Bir Hddada Sétif	036 93 55 57	036 93 55 57		
251	1	4	\N	ABNAA EL KHEIR	أبناء الخير	Djebel Timetlas, M'chira, W, Mila	07 70 24 36 84	031 52 50 71		
2285	1	4	\N	CARRIERE PLATRE BELAHCENE	محجرة بلحسن للجبس	Commune Ain Yagout - Batna 				
3206	1	4	\N	CARRIERE ARIDJ	محـــجرة أريــــج	Bloc 1B4 Imama \r\n W, Tlemcen	043 21 16 28	043 21 16 28		
1317	1	4	\N	DISTRIMETAL	شركة منتجات الحديد و غيره ديستري ميتال	Boulevard Zabana, appartement n°04, cité 200 logements, W. Sidi Bel abbes	048 55 73 64/0661 240 090/0550 33 70 97	048 55 73 64		
402	1	4	\N	SALAH STATION DE CONCASSAGE	مؤسسة صـالـح لتكسير الحجر	BP 12, Sidi Amar - 42 130 - W.Tipaza	024 47 81 22 / 024 44 43 14	024 47 99 76		
2749	1	4	\N	LA GRANDE SABLIERE DE BOUSAADA	المرملة الكبيرة لبوسعادة	Baniou Ramese BP 20809 Baniou ,Chellal Wilaya de M’Sila .	0772 637 172	035 57 32 03		
2557	5	4	\N	SOPLAF / SOCIETE DES PLATRES DE FLEURUS	شركة الجبس فلوريس - صوبلاف	BP n° 02 -Boufatis - W.Oran	041 52 10 50 / 041 52 14 51	041 52 14 62		
3356	1	4	\N	AGREGATS MODERNES DE L'EST	الحصى العصرية الشرق	Route Nationale N°26, AKBOU,BEJAIA	0770 93 53 38	034 35 98 41		
1663	2	4	\N	IMPRIMERIE DJOUAMAA & ASSOCIE		03, Rue Sidi Messaoud (41000)  W.Souk-Ahras	037 31 88 27	037 31 88 27		
2458	\N	4	\N	TOUATI Ahmed Nour Eddine		Zone Industrielle  Cité Chott BP 607 El Oued	032 21 09 39			
1433	1	4	\N	BABAHOUM	باباهم	Dar Arousse n° 02 - Branis - W.Biskra	033 72 73 59	033 72 73 61	Hoggui-laid@yahoo.com	
1435	3	4	\N	MADOR DES AGREGATS		25, Rue Abbas Laghrour 41220  M' daourouch  W. Souk -Ahras	037 323 61 15	037 38 91 70		
2184	1	4	\N	SEEM / SOCIETE D'EXPLORATION & D'EXPLOITATION DES MINES	شركة التنقيب و استغلال المناجم	Branchement, Local N° 31, El Bordj, Khanguet Sidi Nadj, wilaya de Biskra	021 28 92 68	021 28 92 68		
104	3	4	\N	BM / BELAHCENE MALEK		Rue Boulvard de l'Ouest N° 19  Zmala Batna				
1016	5	4	\N	SNTP	الشركة الوطنية للأشغال العمومية	Route Nationale n°5, El Hamiz, Bp°39, Bordj El Kiffan, wilaya d’Alger	021 86 93 25	021 86 93 30	Info.@sntp.dz	
3158	1	4	\N	KERFOUF	كرفوف	Hai Salem 01 N° 6 C W, Saida	0550 96 98 64	048 52 65 47		
3333	12	4	\N	COOPERATIVE ARTISANALE OUMIA SABLE DE FRENDA	التعاونية الحرفية امية رمال فرندة	06 Cité du 1 er Novembre, Frenda, W, Tiaret	07 72 55 74 83			
1731	2	4	\N	GROUZ ARIS & ASSOCIES		Commune Ain - M'Louk Chelghoum - Laid   W.Mila	031 52 85 26			
1969	5	4	\N	SOMIBAR	الشركة الجزائرية لمناجم الباريت	31, Rue Mohamed Hattab, Hacene Badi - El Harrach - W.Alger	023 82 71 92	023 82 71 91	directionsomibar@yahoo.fr	
2954	1	4	\N	ASTIMO	أستيمو	Cité 40 Villas, N° 27, Tibssbissa, Tougourt, w OUARGLA	0555 09 00 24	034 20 45 45		
2435	5	4	\N	SOCIETE CERAMIQUE IBN ZIAD		SCC Route de Mila, Commune Ibn Ziad - W.Constantine	031 65 52 85 / 031 65 52 86	031 65 52 67		
451	1	4	\N	ECR OUARGLA	مؤسسة بناء و طرق ورقلة	Centre Commercial n° 20 Ouargla	029 76 11 81 / \n029 81 67 00	029 81 67 00		
452	1	4	\N	ENTREPRISE SAHRAOUI		10 Rue Alexander Nobel Gambetta Oran	 041 53 44 53	041 53 29 04		
1266	5	4	\N	SHD / SOCIETE EL HADJAR EDAHABI		Zone Industrielle Kechida - BP 24 - Cité Annasr - W.Batna	033 86 26 91\n033 83 56 04			
373	5	4	\N	EGOB / ENTREPRISE GROS ŒUVRES DE BISKRA		BP 103 Star Melouk Biskra 	033 74 11 56\n033 74 18 78	033 74 03 72		
375	5	4	\N	ETOR		Rue des Martyres, Oued Rhiou ; Relizane		046 97 86 69		
328	5	4	\N	CAR EST		Cité des Peupliers, BP 136 ; Annaba	038 83 81 36	038 83 74 64		
1985	3	4	\N	CARRIERE MALKI ACHOUR	محجرة مالكي عاشور	Lemzara Commune de Guidjel W.Sétif				
377	2	4	\N	DEBBACHE TAMER EL ITIHAD	دباش ثامر الإتحاد	Djebel Grouz Ain Melouk -Mila	031 53 75 48 / 0555 07 33 34	036 74 30 48		
1312	2	4	\N	GAAGAA & GOURARI	قعقاع و قوراري	BP N° 30 Ain-Abid W.Constantine	061 60 62 53	032 40 11 49		
137	1	4	\N	DOUNIA		Lotissement Sud RN 6 Mecheria 				
2711	2	4	\N	FRERES  MESSAOUDI	الاخوة مسعودي	BP n° 5 El Eulma W.Setif	061 35 21 26			
2142	5	4	\N	TRANS CANAL OUEST	طرانس كنال غرب	02, Boulevard 1er Novembre 1954 - Chaabat El Lehem - W.Ain Temouchent	043 60 01 15	043 60 02 29		
2012	5	4	\N	SMCR / SOCIETE DES MATERIAUX DE CONSTRUCTION & REALISATION	اس.ام.سي.ار	Zone Industrielle, Kchida, BATNA	033 22 24 44	033 22 24 44		
2691	14	\N	\N	GP HIDROTEHNIKA - HIDROENERGETIKA A.D BELGRADE		Coopérative immoblière El Widad, RN du Stade Zerdani. Oum El Bouaghi	030 34 12 30	030 34 12 30		
654	3	4	\N	GRAINE EXPLOITATION DE CARRIERES		Cité les Castors  Sidi Abdelli   Daïra de Bensekrane  W. Tlemcen	0551 69 08 13 – 0661 22 64 64	043 25 52 60		
3467	1	4	\N	SOCIETE FRERES DAHOU	شركة الإخوة دحو	BP 067 Oued Fodda 2100 W.Chlef	027447677	027447677		
2305	3	4	\N	ENTREPRISE HAROUNI SALAH PRODUCTION D'AGREGATS	مؤسسة هاروني صالح لإنتاج الحصى	13 Rue Daoudi Amar Constantine	031 61 19 70/\n070 35 79 81			
289	5	4	\N	SETMACO	شركة الانتاج و تسويق المواد العازلة و مواد البناء - ساتماكو	Fedj El Ghorab, Ain Abid, W, Constantine	07 70 37 05 89			
2790	1	4	\N	STE SOLTANI CARRIERES						
2507	3	4	\N	BETAU 5A / BUREAU D'ETUDES TECHNIQUES D'ARCHITECTURE & D'URBANISME 5A	مكتب الدراسات التقنية للهندسة المعمارية و التعمير 5أ	Route de Bekkaria BP 662 RP\r\nTebessa 12000.	037 48 60 41	037 48 14 39		
2914	14	44	\N	SOCOM / GROUPE DE TRVAUX DE CONSTRUCTION DE L'EXPLOITATION GEOLOGIQUE ET MINIERE DU HEBEI		N° 8 Lot Souami, Birkhadem - Alger	021 40 54 95	021 40 54 96		
361	5	4	\N	NASR AGREG	الـنـصـر للـحـصى	Zone Industrielle Khessiba Mascara\r\nWilaya de Mascara	045 75 96 72	045 75 96 72	laidounihabib@yahoo.fr	
922	1	4	\N	SOCIETE CARRIERE EL HOURIA EL AITHA	شركة مقلع الحرية العيثة	Route de L'aéroport lot 836 N° 03 W.Tebessa	037 47 15 99	037 48 13 72		
3391	3	4	\N	RAOUF CONSTRUCTION TCE	رؤوف للبناء و كل هياكل الدولة	92 Cité 1650 logts, Bt L10 Ain Smara, Constantine	0555 127 300			
2199	1	4	\N	SABLES D'OR	الرمال الذهبية	Cité 8 Mai 45,  n° 34 El Khroub - Constantine				
2916	1	4	\N	CARRIERE EL FLOUGRAPH	محجرة الفلوجراف	Coop immobilière Al Falah n°25 Ain Naadja Cne Gué de Constantine W.Alger	074 51 43 23			
3077	5	4	\N	ENTREPRISE DES CARRIERES SIDI RACHED	مؤسسة محاجر سيدي راشد	Lot n° 08 Coop2ratif Essafina BP 381 Bousmail w/Tipaza	024 46 71 12	024 46 70 60		
2380	3	4	\N	EL MOSTAKBEL	المستقبل	Cité Aissat Idir, Adrar	049 95 26 17	036 96 34 42		
1575	1	4	\N	FRIOUA & BOUSSATLA		Zone Industrielle Ain El Bey W.Constantine	031 90 67 38\n061 30 23 11			
1958	1	4	\N	AEC / ALGERIAN EXPLORER COMPANY		121, Chehab Rabah - Staouali - Alger.\nHôtel Sheraton - Club des Pins - Alger.	021 37 66 11	021 37 66 12	www.slimani.fr	
1417	1	4	\N	BRIQUETERIE NOUVELLE	المصنع الجديد للأجور	04, Rue Okba Ibn Nafaa   W. Annaba	038 83 23 83	038 84 26 10		
1677	3	4	\N	GETRAMAT	جترامات	Pont de Biziou - Akbou - W.Bejaia	034 35 59 31	034 35 84 73		
1282	5	4	\N	EMAC CHELGHOUM EL AID	مؤسسة مواد البناء شلغوم العيد	Route de la Gare - Chelghoum Laid -  W.Mila	031 52 50 24	031 52 56 63		
2546	1	4	\N	SARA NOUR LES MINES	سارة نور للمناجم	Boulvard principal n° 06, Ouled Bessem - Tissemssilt.	0770 517 951	021 20 51 20		
2638	5	4	\N	EPTP BECHAR	المؤسسة العمومية للاشغال العمومية بشار	BP 163 ZI -  W.Béchar	049 81 64 05 / 049 81 61 27	049 81 13 40		
3006	3	4	\N	CARRIERE KHEZAR	محجرة خزار	Local N°01, logement n°04, Commune de Belayba W. M’SILA.	035 57 11 23	035 57 11 23		
2861	1	4	\N	MAYOUF ET SOLTANI CARRIERES	معيوف و سلطاني للمحاجر	Cité El Kahina, Bir El Ater, wilaya de Tébessa.	0667 11 46 15 / 0559 21 46 61	037 44 89 67		
2737	3	4	\N	EL HAMEL CONCASSAGE	مؤسسة الهامل لتفتيت الحجارة	Cité Bouzidi Abdelkader - W.Adrar	049 96 74 48	049 96 74 48		
1461	1	4	\N	CARRIERE TAOURIRA	محجرة تاوريرة	Route d'Oran prolongée BP 82  W. Sidi Bel abbes	048 57 90 01	048 57 81 47		sarlsodipa@gmail,com#http://sarlsodipa@gmail,com#
1766	1	4	\N	CIRTA AGREGATS & SABLES	سرتا للحصى و الرمل	Djebel Mazla, Commune de Ain Abid   W. Constantine	061 37 82 81			
4197	1	\N	\N	TRANTERAP	تـــرانتيــــــراب	ROUTE DE CONSTANTINE? EL HARROUCHE\r\nSKIKDA				
1933	3	4	\N	ETPB BENFREHA ABDELKADER	مؤسسة الاشغال العمومية و البناء بن فريحة عبد القادر	Route de Slatna BP 17  Sidi Mouffok  Mascara	045 81 26 48	045 81 15 72		
11	3	4	\N	ISFER GRAVIER & SABLE		ETP Carriére Bouzid - BP 324 Ain Beida 	0772 240 345	031 965 599		
758	2	4	\N	ALLIOUCHE & CIE	عليوش و شركائه	Carrière Oued Ziad, El Bouni, wilaya d’Annaba	0552 38 06 89			
2996	1	4	\N	KM TRAVAUX BATIMENT ET TCE	كا.أم  أشغال البناية و أشغال جميع هياكل الدولة	Cité 618 Logements bat 22 n° 06 Mohamadia d'Alger	0557 80 87 24	021 60 70 29		
992	5	4	\N	CARRIERE SI CHERIF	محجرة سي الشريف	Hammam Boutrig BP 36 - El Attaf - W.Ain Defla	027 62 51 08\n061 60 72 25			
2995	1	4	\N	ENTREPRISE DAR MAHIOU	مؤسسة دار محيو	Ach El Ogab; Dar Yaghmouracène - Ghazaouet - W.Tlemcen	0770 54 31 82			
2148	5	4	\N	SOTROB / SOCIETE DE TRAVAUX ROUTIERS OUM EL BOUAGHI	شركة اشغال الطرق ام البواقي	BP n° 4/A Zone Industrielle  W.Oum El Bouaghi 	032 42 18 70\n061 54 37 87	032 42 10 25		
2152	1	4	\N	LEMZARA DE PRODUCTION D'AGREGATS	لمزارة لانتاج الحصى	Cité Rouabeh Moussa Bat 6 n° 16 W.Setif				
1687	1	4	\N	SDTPH		Cité 120 Logements Bât.1 n°07 -Bethiouna- W.Oran	041 47 02 63\n045 26 68 77	041 47 02 63\n045 26 68 77		
933	1	4	\N	SABLIERE EL WAFFA		BP 634 - Ain Oussera - W.Djelfa	027 82 33  46			
934	1	4	\N	SEC CMC		Hai Annak Rabah - Ain Ouessara - Djelfa				
1220	3	4	\N	ENTREPRISE DJEBEL LANOUAL D'EXPLOITATION DE SABLE		Route de Telidjene Cheria W.Tebessa	037 42 30 48	037 42 30 48		
2382	3	4	\N	ENTREPRISE KEBBACHE CARRIERE	مؤسسة كباش محجرة	Commue M'Zira Daira Zribet El Oued	033 73 52 20/061 51 65 11	033 73 52 20		
1992	1	4	\N	BAFTRAP	بافتراب	Ouled  Fayet, cité Boudiaf n° 196 BP 46 - W.Alger	021 90 76 31/ 021 90 76 31/061 56 11 91	021 90 76 31/ 021 90 76 31		
143	1	4	\N	BALLAST DE LA CHIFFA	بالاست شفة	BP N° 35 El Ancor  Oran/ Route de Médéa Commune de Chiffa w/Médea	0661 58 17 95 / 0662 66 13 81	041 40 12 96 /027 82 37 79		
144	1	4	\N	CARRIERE ENNADJAH	محجرة النجاح	18, Rue Medjadji Kaddour, Tenès - W.Chlef	027 7188 04	027 71 88 04		
146	3	4	\N	BOUHADI	بوهادي	Douar Azaiza commune de  Amieur; Tlemcen	06122 63 63	043 27 06 27		
1934	1	4	\N	AGRETUF		Route NationleN° 01 Birtouta W. Alger				
1164	3	4	\N	ES SALAM	السلام	Cité des 152 logements Bt (D) n° 10, Route de Sougueur - W. Tiaret	0794 90 94 54			
3108	1	4	\N	URBAN WORKER	أوربان ووركر	Cité 303 Logements, Oued Terfa, Route d'El Achour, n°66 Draria - W.Alger	020 31 50 75	021 35 73 33		
1455	1	4	\N	SOCIETE IMAR PRODUCTION D'AGREGATS	اعمار لانتاج الحصى	16, Rue Khemisti en face Route Kanestel - W.Oran	06150 89 12/070 88 56 89			
2852	3	4	\N	BAHLOULI CARRIERE	بهلولي للمحجرة	Cité 80 logts participatifs, région Est Bt 04 n°03\r\nBordj Bou Arreridj	070 33 82 98	035 68 21 12		
2997	1	4	\N	SVIS		Route de ghardaia zone industrielle  BP 63 W, Ouargla	021 86 08 71	021 86 08 71		
2414	5	4	\N	COSIDER CARRIERES	كوسيدار المحاجر	Zone d’activité Dar El Beida, Bp N°65 F, wilaya d’Alger	023 83 31 79-75	023 83 31 83	cosider-carrieres@cosider-groupe.dz	
3219	3	4	\N	DJOUAMAA D' EXTRACTION D'AGREGATS	جوامع لاستخراج الحصى	3, Rue Sidi Messaoud,41 000, W, Souk ahras	0551 97 53 33	037 31 88 27		
3106	1	4	\N	DILFER IMPORTATION	دليفر استيراد	Briqueterie DILFER, Siafa commune d’Azzaba, wilaya de Skikda	037 20 02 18	037 20 02 18		
2461	\N	4	\N	OKACHA		Carrière de Tuf - Quartier Zougala - Miliana - W.Ain Defla	027 65 61 46			
424	1	4	\N	SKA / SIDI KHALFALLAH		Haï Castor, Route Aïn Dheb, Sougueur ; Tiaret				
1057	1	4	\N	CBTPH		01, Rue Aissat Idir  Sfisef    W. Sidi Bel Abbes	048 59 40 06			
2703	1	4	\N	SOUBOUL HODNA EL BARAKA	سبل حضنة البركة	Cité nouvelle urbaine n° 1BP n° 2232. W/M'sila	035 53 57 67	035 53 57 62 et 0661 57 27 56		
2832	1	4	\N	ETPBH RAHOUI ET FILS	أو تي بي بي أش - أبناء راحوي	ZI N° 04 - Tlemcen	070 60 71 64	043 27 68 43		
2312	1	4	\N	SOCIETE DES TRAVAUX DE L'EST	شركة أشغال الشرق		072 20 11 53			
1002	3	4	\N	CARRIERE ISSADI MUSTAPHA	محجرة إسعدي مصطفى	Takerkert, Commune de Bouandas W.Setif	036 87 79 92 / 0773 62 37 96 / 0661 35 07 00			
1233	5	4	\N	EAS / ENTREPRISE DES AGREGATS & SABLE	مؤسسة الحصى و الرمل لام البواقي	BP 22 Zone de dépôt et d'activité W.Oum El Bouaghi	032 42 18 77	032 42 18 71	eas_oes@yahoo.fr	
1442	3	4	\N	PROMOTION IMMOBILIERE TITERIE		19, Rue Cheikh Touhami - Médéa	025 58 16 20	025 58 17 73 		
1059	1	4	\N	ES SAFA	الصفا	BP N° 39 Ain Abid W.Constantine	061 30 60 39	031 97 32 90		
3360	1	4	\N	EOAT/PRHB	أو.أو.أ.تي/بي.أر.أش.بي	Cité nouvelle Zone Urbaine n° 1, local n° 24, BP° 2232, wilaya de  M'sila	035 53 57 68	035 53 57 67		
2695	1	4	\N	SABLIERE DJAMAA	مرملة جامعة	Place du marché, Nazla - Touggourt - Ouargla	070 94 38 95	024 81 35 68		
181	5	4	\N	SOTRAMEST	شركة الأشغال البحرية بالشرق	Boulevard Mohamed Sedik Benyahia BP166 Llaine Ouest Annaba	038 48 57 58	038 48 57 59		
1294	3	4	\N	CARRIERE KHEZZARI SACI	محجرة خزاري الساسي	Bt n° 02 - Cité Lambiridi - Commune de Oued Chaaba - W.Batna	0661 34 01 95	033 86 08 17		
1955	1	4	\N	GROUPE CHENNOUFI INDUSTRIE	مجموعة شنوفي للصناعة	Station service Bir Enâam Chaîba W/ Biskra	033 76 08 11	033 74 47 97		
1264	2	4	\N	KEBBICHE ABDELHALIM & CIE	كبيش عبد الحليم و شركائه	Commune de Bir Haddada - Daira de Ain Azel - W.Sétif - BP 592 W.Sétif	036 63 41 41 , 0550 465 055	036 63 41 42		
1904	2	4	\N	EL WIAM KOREIB BELKACEM & KOREIB SMAIL	الوئام كريب بلقاسم و كريب اسماعيل	Commune de Beni Mester Mansourah  W. Tlemcen				
413	5	4	\N	SO.R.EST	شركة الانجاز للشرق	Zone industrielle du 24 Février1956 W, Constantine	031 66 82 90	031 66 81 11		
1962	3	4	\N	ABDELAOUI EXPLOITATION DE CARRIERE	عبداللاوي لاستغلال محجرة	03, Rue des Frères Djemili - W.Sétif	036 84 46 74			
1963	3	4	\N	CARRIERE LAOUAR BELKACEM	محجرة لعور بلقاسم	Ouled Rahmoune W.Constantine				
320	1	4	\N	TERGUI SAHRAOUI	الترقي الصحراوي	Oulfene, Commune de Tamanrasset, Bp 5216 Ankouf, W, Tamanrasset	06 66 57 47 65			
2249	1	4	\N	CONCASSAGE ESSALAM	تفتيت الحصـى السـلام	Cité 120 Logements, n° 02 Beni Slimane - Médéa\r\nCité 24 Février - BP 550 - Médéa	025 52 89 49	025 58 57 58		
2946	5	4	\N	IRRIGOUT	إيريقوت	02, Rue Samssoume Djaloul Zone N° 07 w/Mascara\r\nOu\r\nZone industrielle Khsiba, Mascara.	045 753117	045 753 116	contact@irrigout-dz.com	
1987	1	4	\N	INDJAZ  	انجاز	Sebaa El Mokrane Moudjbara -W/Djelfa	036 89 46 00/\n061 59 51 06	036 87 46 98		
2613	1	4	\N	EXCAR LES FRERES GOUICHICHE	أكس كار الأخوة قويشيش	Carrière Ouled Hmida ,Bir Haddada wilaya Sétif	06 61 50 65 93	036 96 34 42		
1370	5	4	\N	EBA / ENTREPRISE DE BATIMENT D'ALGER		RN n° 01 - Bir Mourad Raïs - W.Alger	021 54 02 34	021 44 71 40		
2456	\N	4	\N	BALBAL Laid		BP 111 - In Amenas - W.Illizi	029 43 85 76\n071 57 79  98	029 43 85 77	Balgrmct@yahoo.fr	
2584	1	4	\N	EL FELLAH	الفـلاح	Cité El Kerma n° 03 - Bechar.	049 83 30 57 / 070 98 23 52			
2018	1	4	\N	SAT	شركة الحصى تارقة	Boulevard des 24 mètres Bp° 1083, wilaya de Tlemcen	043 27 39 39	043 27 37 14		
1159	1	4	\N	BMSD / BRIQUETERIE MODERNE DE SAIDA	مصنع الأجور العصري بسعيدة - بي.أم.أس.دي	16 Lotissement Bordj 2 Cité Daoudi Moussa  \r\nw/Saida	021 24 88 18	021 24 22 26	Sarlbmsddz@yahoo.fr	
1036	3	4	\N	EL AMANE		Cité El Feth - Ancienne route de Djelfa n° 07/ 946 Bou Sâada  W. M'sila	035 57 76 28	035 57 73 04		
1293	1	4	\N	BRIQUETERIE CHAABANE	مصنع الأجور شعبان	Bd Chabane, Commune de Tizi Ouzou W/Tizi Ouzou	026 22 21 41	026 22 33 29		
2932	5	4	\N	SPDG / SOCIETE DU PLATRE ET DERIVES GHARDAIA	شركة الجبس و مشتقاته غرداية	Noumérates commune de Metlili BP 63 Ghardaïa.	029 87 01 10	029 87 01 11 / 029 87 01 10		
2936	3	4	\N	BRIQUE BERBER	بريك بربر	BP 404 w/Tizi Ouzou	061 66 23 09	026 22 53 88		
1915	2	4	\N	MEZOUGHI & FILS	مزوغي و أولاده	Voie d'Evitement, Khessibia W.Mascara	045 75 30 01/05	045 75 30 02	mezoughi@voilà.fr	
1753	1	4	\N	EL WAFFA EXPLOITATION DE SABLIERES	الوفاء لاستغلال مقالع الرمال	Cntre ville, Wilaya de Tébessa	05 60 15 38 60			
3245	1	4	\N	EST GRAN	استقران استغلال منجم الكلس	Lotissement 246 Tadjenanet  wilaya Mila	031 52 24 32 0661338661	031 52 27 02	saib@sacom-dz.com	
2766	1	4	\N	MOUMEN EL GHALI & TOUATI HMED MAHMOUD DES CARRIERES	مومن الغالي و تواتي حمد محمود للمحاجر	RUE CHAAB BIR EL ATER -W- TEBESSA	0550385612 / 0660647296	0660647296		
4615	1	\N	\N	TIKHIAMIN LI ZAHAB	تيخيامين للذهب					
2013	1	4	\N	SORECA	شركة الانجاز و استغلال المحاجر	20, Rue AL-FG Abdelmoumene W.Bordj Bou Arreredj	036 95 02 39	036 95 02 39		
2015	5	4	\N	PLATRE SUD	شركة جبس الجنوب	BP 43 Zone Industrielle Bounnoura  Ghardaïa	035 44 65 50	035 44 65 02		
2141	1	4	\N	GRAVIER OULED YAGOUB	حصى اولاد يعقوب	BP 89 Ain Smara Constantine	061 37 43 29	031 97 32 90		
385	5	4	\N	EPRC - GIC / Entreprise des Produits Rouges du Centre - Groupe Industriel et Commercial -	مؤسسة المواد الحمراء للوسط - المجمع الصناعي و التجاري	Cité Ibn Khaldoune BP 73 - Boumerdès	024 81 11 31 / 024 81 81 45	024 81 91 11	giceprc@wissal.dz	
388	5	4	\N	S.TRA.ROUT	نجوم أشعال الطرق تيارت	Z.I BP 713, Cité Zaaroura; Tiaret	046 42 60 84	046 42 60 83		
1827	3	4	\N	ETPET BELHADI	الاشغال العمومية الري و استخراج الفليس بلهادي او تي بي او تي	Route Kouadria - Ouled Moussa - W.Boumerdès	024 87 15 87 / \n061 65 00 36	024 87 73 42		
3107	1	4	\N	COTRAPHYB	كترافيب	Hai Mezrea Sud, Ouled Moussa - BOUMERDES	021 53 03 91./0555 02 39 79	021 53 03 91		
225	5	4	\N	SOPROMAC	سوبروماك ميلة	Z.I. Sennaoua, Commune de Mila- W. Mila	031 57 53 53	031 57 94 54		
1113	3	4	\N	CARRIERE ZEGHBIB ALI		Sigus W.Oum El Bouaghi				
2246	3	4	\N	KEBBICHE LARBI DU GYPSE	كبيش العربي للجبس	Cooperative immobilière El Kheir, rue Fettache Amar N° 610 - Setif	036 91 70 76	036 91 91 93		
2634	3	4	\N	AUMAL AGREGATS	أومال أقريقا	Cité des 142 Logements, Sour El Ghozlane -  W. Bouira	072 70 07 34			
2762	3	4	\N	LAMRI ABDELBAKI IMPORT EXPORT	العمري عبد الباقي للاستيراد و التصدير	Coopératives immobiliere el ahlem N°06 comune d'ain mlila	0550 22 21 00	032 45 28 69		
2763	2	4	\N	CARRIERE EL BACHA DRISSI & CIE	محجرة الباشا دريسي و شركائه	Zone d'Activité Commerciale N° 50 W, Souk Ahras	071 41 09 68	037 32 13 51		
666	1	4	\N	PROGEC MAC	بروجاك ماك	Zaccar, W/ Djelfa	027 92 31 20	027 92 31 21		
1874	5	4	\N	ALGRAN / SOCIETE ALGERIENNE DES GRANULATS	الشركة الجزائرية للحــصى "ألقران"	31, Rue Mohamed Hattab - Belfort - El Harrach -W. Alger.	021 52 52 41	021 52 52 41		
667	1	4	\N	PRAG	البراق	Quartier Dibes Mokhtar Route de Djelfa - Djelfa	07 70 24 16 40			
586	2	4	\N	SAIDANI & FILS		Boudjellil centre , Daïra de Tazmalt 06260  W. Bejaia				
318	\N	4	\N	APC SIDI SLIMANE		APC De Sidi Slimane	029 68 19 53	029 68 19 53		
856	1	4	\N	GRAVIERS DES ZIBANS	حصى الزيبان	Megloub El Hadjeb W/ Biskra	021 37 43 29 / 0661 37 48 02	032 10 95 29		
859	1	4	\N	EN NOUR	النور	Djebel Grouz, Commune Ain Melouk, w.MILA	0770 44 71 93	031 52 48 19		
3311	2	4	\N	KAOUCHE ET ASSOCIES	كعوش و شركاؤه	Oued El Houl, Commune de Hama Bouziane, W, Constantine	05 50 61 63 14			
2750	5	4	\N	S.CI.S / Société des Ciments de Saida	مؤسسة الإسمنت بسعيدة	BP 95 - Commune Hassasna-Daira Hassasna-W.SAIDA	048 31 13 70/12	048 31 13 16		
2743	1	4	\N	HADJ HAMOU BITUME ET DERIVES	حاج حمو للزفت و مشتقاته	Zone Industrielle Fornaka W-Mostaganem	045 27 81 85 / 045 27 82 89	045 27 85 55		
2975	1	4	\N	SOPRAM	سوبرام	BP86 Abd RabouOued El Anneb W.Annaba	071 17 91 48	038 88 21 72		
3029	1	4	\N	PCMACS	بسيماكس	Route Mellouk Sougeur w/Tiaret		045 81 17 32		
2588	1	4	\N	ALPHA SERVICES	ALPHA SERVICES	39, Rue Larbi Ben M'Hidi - Alger.	021 73 75 10	021 69 19 66		
2589	5	4	\N	S.C.MI / Société des Ciments de la Mitidja	شركة الاسمنت للمتيجة	BP 24,  Meftah, W, Blida	(025) 45 53 50/51	(025) 45 58 86		
286	1	4	\N	SOCIETE ALGERIENNE D'EXTRACTION DE SEL INDUSTRIEL DU SUD EST		Commune de Hamraia  W.El Oued	032 28 92 34	032 28 92 34		
456	2	4	\N	MAMERI & KAOUCHE	معمري و كعوش	Serge Darrfoul Ain Melouk - Mila	031 53 14 85	031 53 14 85		
1918	1	4	\N	ENTREPRISE TAILLE DE PIERRE TAZBENT	مؤسسة تفصيل الحجارة و الرخام - تازبنت ولاية تبسة	Zone Industrielle W.Tebessa	037 49 18 44			
1736	2	4	\N	SFB / SOCIETE FRERES BOUSSELBA	شركة الاخوة بوسلبة	Rue Djouadi Mohamed N°08, wilaya de Guelma.	037 23 61 70	037 21 54 50		
244	3	4	\N	CARRIERE GUANA AISSA	محجرة قانة عيسى	n° 28, Cité Zaaroura; Tiret	046 41 32 39			
2678	1	4	\N	BRIQUETERIE EL MOUMTAZA BOUDOUAOU	مصنع الآجر الممتازة بودواو	Route de la Gare, BOUDOUAOU 35400\r\nWILAYA DE BOUMERDES	024844585 - 024844373	024843784		
2130	3	4	\N	BRIMATEC	بريماتك	El Djorf, Commune d’Ouled Derradj, wilaya de M’sila	035 39 84 28	035 39 84 30		
489	2	4	\N	ZAALANE & DRISSI ETRAMA	زعلان و دريسي ايتراما	Zac de Souk Ahras Lot N° 50-BP 1714- S.Ahra	037 32 99 43/\n037 32 13 51	037 32 13 51		
226	2	4	\N	ARIS & ASSOCIES SABLE D'OR	عريس و شركائه سابل دور	Djebel Grouz, Ain Melouk - W. Mila	0550 01 35 27 – 0660 36 68 41	036 51 42 61		
3079	1	4	\N	ITAL IRRIGATION						
1279	3	4	\N	LES CARRIERES EL REDDID		18, Rue Braktia Abderrhmane (41000) W.Souk -Ahras	037 35 04 98			
2578	1	4	\N	CARRIERE AINEL	محجرة أينال	116 Bd des 24 mètres - Tlemcen.	061 22 07 27	043 27 44 05		
88	2	4	\N	ZAHTANI & CIE	زحتاني	Bir Brinis, Ouled Arama, Daïrade Telaghma; Mila	031 63 24 20 / \n061 30 40 67	031 53 76 48		
2722	5	4	\N	ALCIB / ALGERIAN COMPANY INVEST & BUILDING	الجزائرية للاستثمار و البناء - ألسيب	Rue du 11 Décembre 1960 PB 926 W/Sétif	036 91 28 22/036 91 53 34	036 93 61 50	alcib_dz@yahoo,fr	
3537	1	4	\N	M.D.L GYPSE	أم دي أل جبس	Bordj Zada, Commune de Dehamcha, Wilaya de  Sétif	0661 57 39 15	036 63 74 59/036 68 61 21		
3656	12	4	\N	COOPERATIVE ARTISANALE ASSALLAM	التعاونية الحرفية السلام	RUE LA MACTA N°02 SIDI BEL ABBES	0661253939			
2676	3	4	\N	EGTRA.KA	الحاج قادري مؤسسة الأشغال الكبرى للطرقات و المطارات و الري	Route de L'abattoir, BP 111 RP - W. Batna	033 80 45 66	033 80 39 67		
400	5	4	\N	SORAM / SOCIETE DE REALISATION DE AIN M'LILA	شركة الانجاز لعين مليلة	BP 320 Ain M'Lila - W.Oum El Bouaghi	032 44 09 06			
357	5	4	\N	SPISME		Route de Mascara prolongée ; SBA	048 56 76 98	048 55 36 97		
2245	1	4	\N	EL WASL POUR LES TRAVAUX PUBLICS	الوصل للأشغال العمومية	Cité Chott , W/ El Oued	0558176768	032109529		
3430	3	4	\N	TARABAHT		Cité 05 juillet Chabat El Ameur  W, Boumerdès	0550 16 75 72			
219	5	4	\N	ECO EST		4ème Km Chaabt Eressas BP 330 Constantine	031 61 36 61	031 63 73 39		
904	1	4	\N	BENNAH		Cité de la rocade   W. M'sila	035 55 02 99\n061 35 70 52	035 55 02 99		
864	1	4	\N	ERRIDA DE PRODUCTION DE BRIQUE & DERIVES		Cité des 80 logements N° 05  Magra W. M'sila	035 59 22 37	035 59 27 82		
2853	3	4	\N	MINOTERIE EL HILEL	مطاحن الهلال	RN n°16 souk Ahras	037 31 74 45/061 39 04 69	037 31 00 77		
2854	11	\N	\N	ZAGOPE / ANDRADE GUTIERREZ ALGERIE	زاكوب أنرارد قوتياراز الجزائر	39, Bvd MAKLI, El Biar - Alger	030 48 26 01 / 030 48 26 49	030 48 26 49		
2477	\N	4	\N	HILOUF Miloud		06, Rue Emir Abdelkader  Relizane  W . Relizane	061 91 37 47			
944	1	4	\N	SOPRMED		Route El Kahira Bemasad - W.Djelfa				
1056	1	4	\N	ABC BOUSIABA	حصى عمارات و بنايات بوسيابة	Cité Boumaran  El Milia - W. Jijel	061 52 82 82			
339	1	4	\N	BRIQUETERIE GUERROUACHE	بريكاتري قرواش	Zone Industrielle. Medjana BBA	213 35 87 93 93/213 35 87 92 92	213 35 87 93 93	ARGIBORDJ@YAHOO.fr	
1929	5	4	\N	EL KADIRIA AGGLO	الـقاديـريــة أقــلو	Route de Saida  BP  39  W/Mascara	045 93 51 80	045 93 51 80		
1637	3	4	\N	EL DJABAS	الجباس	Cité El Badr N° 146/12, Boussâada, wilaya de M'sila	035 52 41 54	035 52 41 54		
243	5	4	\N	CONCASS ANTAR	محجرة عنتر	Boulevard des 84 logements - Mécheria, wilaya de Naama	0772 60 65 65 / 0550 77 03 13	049 78 99 51		
1760	2	4	\N	ACHOUCHE & FILS ENNASR ERRAKI	عشوش و إبنه النصر الرقي	Cité du 8 Mai 1945 n° 110 El Khroub - W.Constantine	0798 81 44 98 - 0776 08 50 07	031 96 22 81		
1761	1	4	\N	CARRIERE DJEBEL OUGUEB	محجرة جبل عقاب	BP 03,  Djebel Aougueb, Oued El Athmania - Mila				
1763	2	4	\N	BOUHAFS IDRISS & KHERBACHI HABACHE		Ain Saboun - Commune de Ain Sandel - W.Guelma				
2983	1	4	\N	LIOUA	ليوة	02 Rue Sehel Seddik Commune de LIOUA,W/ Biskra	0550 36 38 83 – 0559 93 30 34	023 77 96 59		
1273	1	4	\N	ETPC		Cité Chérif N° 57 W. Chelef	027 77 54 82\n061 60 04 66\n071 73 28 81	027 77 54 82		
230	2	4	\N	SBAAIA LEHBARAT & NAILI		Djebel Gustar, Hasbet Eddis, Aïn Lahdjar; Sétif				
478	2	4	\N	DRISSI AHMED & ASSOCIE TAKOUYET		35, Rue du 17 Octobre - Souk Ahras	037 318350 - 329943	037 32 13 51		
3160	1	4	\N	FRERES NASRI TRAVAUX PUBLICS HYDRAULIQUE ET CONSTRUCTION	الاخوة ناصري للاشغال العمومية و الري و البناء	214,  cité Daksi Abdeslem Programme 352  bt C   Bloc A      CONSTANTINE	031 61 32 14	031 61 32 14		
3090	1	4	\N	KOU.G.C	كو جي سي	41, Rue des Tourelles  Hydra  W. Alger	021 60 08 08	021 60 26 92 / 021 60 01 84	Azeddine.boufassa@kougc.dz	
3091	14	44	\N	POLY TECHNOLOGIES, INC.	بولي تكنولوجي	Sarl North Africain Mining Company\r\nVilla N° 119 Palm Beach -16101  Staoueli  \r\nW. Alger				
2553	1	4	\N	TGS / THOULATHIA GRAVIERS & SABLE	ثلاثية للحصى و الرمل	36,Boulvard Bouzerrad Hocine - Annaba	061 69 63 67/078 08 15 84	037 46 98 14		
2943	1	4	\N	CERB	سي او ار بي	Commune de Sidi M'Barek w,BBA	0550 95 18 02	035 83 12 02		
2019	3	4	\N	EPSTP	أو.بي.اس.تي.بي.	Cité 126 Logements Bâtiment 06 Cage 02 N°01 W. Bouira	026 94 20 84	026 94 20 84		
2020	3	4	\N	BOUTALEB CARRIERES	بوطالب للمحاجر	Local b el diss, Commune de ouled Sidi Brahim, w-M’Sila	0662 71 03 13	035 57 70 53/035 59 02 84		
1585	1	4	\N	ALTRAM / ALGERIE TRAVAUX MARITIMES	الجزائر الأشغال البحرية	BP 10, Bir El Djir - W.Oran	041 53 93 57	041 53 93 58		
2060	2	4	\N	FRERES SALHI	الاخوة صالحي	BP306 Commune  Amoucha. W-Sétif	036 74 30 48 / 06 61 35 38 99	036 74 30 48		
2101	1	4	\N	BOUSBIA EXPLOITATION DE SABLE	بوصبيعة لاستغلال الرمل	Cité Aissa Boukerma, Bt 2 - Skikda	070 66 75 47/038 92 11 95	038 73 33 53		
759	1	4	\N	LAOUTI & FRERES TRAVAUX GENERAUX & SERVICES	لعوطي و اخوانه للأشغال العامة و الخدمات	Cité 05 Juillet, BP 1615 - W. Laghouat	0661 304 990	029 14 53 49		
1555	5	4	\N	ERM / ENTREPRISE DE REALISATION DE MEDEA	مؤسسة الإنجاز بالمدية	BP 131 - Route d'El Khemis - Draa Smar - Médéa	025 61 01 62	025 61 01 76		
596	1	4	\N	AGREGATS MEHRIRA	الحصى محريرة	Kherrata, Centre Local N° 46, Com de Kherrata, w. BEJAIA.	034 24 57 43	034 24 51 64		
706	1	4	\N	FRERES LAOUAR		BP 063 Poste de Terrai - Bainen -   W. Mila	061 33 82 07 / \n033 55 33 23			
129	5	4	\N	EBS / ENTREPRISE DE BATIMENT DE SKIKDA	مؤسسة البناء سكيكدة	Zone Industrielle BP 71 ; Skikda	038 75 40 71	038 75 40 66		
1986	5	4	\N	BTM / BRIQUETERIE & TUILERIE DE MEDEA		Draa Smar -  Médéa	025 58 30 68	025 58 30 84		
365	1	4	\N	EL ARBAA ENTREPRISE DE BRIQUE & CARRELAGE		BP 290 Laghouat 	029 93 24 02	029 93 24 02		
2545	14	227	\N	CAMBRIDGE MINERAL RESSOURCES PLC		10 Fenchurch Ave, London EC3M 5BN.\r\nRoyaume-Uni.	+44 207 663 5618	+44 207 663 5959	candrew@iol.ie	
2297	1	4	\N	LES DEUX MARTYRS D'EXPLOITATION DE CARRIERES & DES TRAVAUX DE BATIMENTS	شركة الشهدين لاستغلال المحاجر و الأشغال الامة للبناء	Cité Djebar Tayeb, Bouchegouf - W.Guelma.	037 22 74 33	037 21 18 77		
1358	3	4	\N	MELILYA	مليلية	Larbi Ben M'Hidi - Hennaya - W.Tlemecen	043 27 97 49			
629	1	4	\N	SOCAR		8, Cité 19 Juin W.Guelma	037 20 66 41			
2820	3	4	\N	KRIBI DES TRAVAUX ROUTIERS & HYDRAULIQUE - ETRH	كريبي لاشغال الطرقات و الري	Cité 1 er Novembre Draa  El Bordj  Bouira	070 56 51 12			
1882	3	4	\N	STR DJELFA / SOCIETE DE TRAVAUX ROUTIERS DE DJELFA	شركة الأشغال الطرق الجلفة	Cite Bellaghazel - Construction 612 n° 34 - Djelfa	061 63 81 11			
1097	1	4	\N	STPRS	شركة الأشغال العمومية و الطرق	Cité In Cheih  Route de Charef   W. Djelfa	0774 46 44 50 / 0696 52 85 45	027 87 89 65		
4452	1	\N	\N	TAMAZROUT	تمزروت					
4311	1	\N	\N	SABLIERE ET CARRIERES TAHIR ET MAOUCHE	مرملة و محاجر طاهير و معوش	Cité Météo, Section 64, Ilots 23, El Bayadh	05 50 93 90 80	034 19 92 49		
238	3	4	\N	SIDI SAID	سيدي سعيد	Torriche, Cne Oued Lili; Tiaret				
1529	1	4	\N	AGRE BON		39, Rue Boukhtachi Boufarik W.Blida	025 47 77 06\n025 47 77 01\n025 50 49 30	025 47 18 02\n025 57 77 00\n025 47 41 69		
1476	1	4	\N	DJEGHEL MOHAMED	جغل محمد	Cité 630 logements, Tebesbest-Touggourt, wilaya d'Ouargla	0660 33 84 14	032 14 80 90		
939	5	4	\N	S.C.SEG / Société des Ciments de Sour El Ghozlane	شركة الأسمنت لسور الغزلان	BP n° 61 - Sour El Ghozlane - W.Bouira	026 96 64 51026 966 375/ 026 966 127	026 966 375/ 026 966 127	sc seg@wissal.dz	
2230	1	4	\N	TITERIE	تيتري	BP 18 - Guelb El-Kebir - W.Médea	026 96 85 40 	026 96 71 64		
1359	5	4	\N	EPTPO	المؤسسة العمومية للأشغال العمومية بوهران	Route de Misserghin (Face Stade Bouakeul) - W.Oran	041 34 29 11\n041 34 29 14\n041 34 29 16	041 35 12 09	sera@algériecom.com	
3335	12	4	\N	COOPERATIVE ARTISANALE MECHAAL ECHAHID		Cité Mohamed Djahlane Bt 20  Bloc B  N°06  W. Tiaret	0797035319			
3336	1	4	\N	SIDI OUADAH	سيدي واظح		0774 73 26 58			
3017	2	4	\N	FRERES ZOUAOUI INDUSTRIE	الاخوة زواوي للصناعة	Z,I  Bordj Bou Arreridj ,W, BBA	061 37 01 19	035 68 73 33		
3018	1	4	\N	SOR ALCOF	صور الكوف	N°27, Rue Ferhat Abdelkader, Staouali,  W.Alger	0550 46 36 54	023 37 11 94		
830	3	4	\N	ETP CARRIERE CHERIF		Chez Rouabeh Bachir Cts Bir El Ater (12200) W.Tébessa	021 44 31 64			
1907	3	4	\N	AICHOUR MONCEF BRITUILES	عيشور منصف "بريتويل"	RN n° 05 - Bt C n° 01 - Mohammadia - Alger	061 51 08 00			
2207	2	4	\N	SIDI BOULERBAH	سيدي بولرباح	Cité SAADA, 141/169, W. Djelfa	027 87 12 46	027 87 12 46		
241	5	4	\N	RESERBAT / REALISATION SERVICES BATIMENT	ريزيربات	Zone Industrielle  Khassia  W. Mascara\r\n16, Rue Saadoune Kaddour Zone 8 W.Mascara	045 81 16 05   0550 571 498	045 80 43 33		
242	1	4	\N	NADJAH	النجاح	Quartier Soummam, Ain Sefra - Naama	049 76 29 02	049 76 29 02		
505	1	4	\N	PSB / PLATRIERE DE SIDI BOUTOUCHENT	مصنع الجبس سيدي بوتوشنت	Douar Sidi Ghallem, Sidi Boutouchent - W. Tissemsilt	025 58 47 08 / \n061 51 78  08\n061 62 6 62			
1927	2	4	\N	TUILE GRAND SUD REZAZKI & CIE		Route N° 46 Lagrouss W/Biskra	070 30 09 04\n061 23 03 27	021 53 90 87		
92	1	4	\N	KEBDI		02, Rue des Frères Belhoucine ; TO	(021) 72 22 93			
3518	12	4	\N	COOPERATIVE ARTISANALE EL FETH	التعاونية الحرفية الفتح	06, Cité du Frigo   Bt 77  W. Tiaret	0773 245 281			
1671	5	4	\N	SOTHYOB	شركة أشغال الري أم البواقي	Commune Oum El Bouaghi W.Oum El Bouaghi\r\nBP 66 -A- Zone Industrielle Oum El Bouaghi				
3362	1	4	\N	COOPERATIVE ARTISANALE EL BARAKA EXPLOITATION DE CARRIERE	التعاونية الحرفية البركة لإستغلال المحجرة	El Ogla - Wilaya de Tebessa	037 42 03 14			
4181	3	\N	\N	IBCHENINENE ALI	إبشنينن علي	Rue Boussedjada Mostefa, Cité Kemouni, wilaya de Batna\r\nZ A C    Ain Sekhoune    Djerma      Batna	0661 12 97 04	033 22 36 45/37		
1738	3	4	\N	CARRIERE EL FETH	محجرة الفتح	Cité 11 Décembre N° 120 - El Fedjoudj - W.Guelma	061 36 04 42 /070 53 35 35			
421	1	4	\N	SOCIETE MELH EL DJANOUB	شركة ملح الجنوب	Reguiba - W.El Oued	032 27 32 54	032 27 40 12		
1610	1	4	\N	KJ PIERRE	كا.جي حجر	Rue Emir Abdelkader - W. Ain Defla	027 60 43 00	027 60 43 00		
3175	1	4	\N	STRLT / SOCIETE DE TRAVAUX PUBLICS & TRANSPORT& LOCATION D'ENGINS	شركة الأشغال العمومية و النقل و ايجار العتاد	Cité des jardins Ain Nouissy Mostaganem. W,Mostaganem	0661 24 70 50	045 37 42 18		
2433	5	4	\N	ENOF	المؤسسة الوطنية للمنتجات المنجمية غير الحديدية و المواد النافعة	31, Rue Mohamed Hattab - Belfort - El Harrach - Alger.	023 82 71 73	023 82 71 69		
148	1	4	\N	VERRALLEK		Zone Industrielle Kolea Tipaza	024 48 20 72	024 48 20 78		
2247	1	4	\N	STGS	أس.تي.جي.أس	126, Cité Colonel Lotfi, Dahmouni - Tiaret	070 86 13 34			
2779	3	4	\N	MAZOUZI TRAVAUX SUD	مؤسسة مزوزي لأشغال الجنوب	Rue Palestine BP 100 Timimoune w- Adrar	049 300 239	049 300 239		
1567	3	4	\N	CARRIERE GHAR BEN TAGA	محجرة غار بن طاقة	Cité Gouadjelia Rabah n° 242 - Ain M'Lila - W.Oum El Bouaghi	0553 33 34 57	032 45 20 46		
228	1	4	\N	LA ROCHE BLEUE	الصخرة الزرقاء	Béni Oussine, Daïra de Bougaa ; Sétif	07 75 11 29 23			
3729	5	103	\N	ARCELOR MITTAL TEBESSA	ارسلور ميتال تبسة	Cité Centrale Ouenza, W, Tébessa	037 45 71 05	037 45 71 05		
1571	2	4	\N	BOUHZILA ABDALLAH & SAID	شركة بوهزيلة عبد الله و السعيد	Ain Abid W.Constantine	061 35 20 29\n061 30 60 39	031 97 32 90		
3618	12	4	\N	COOPERATIVE ARTISANALE MORSELI	التعاونية الحرفية مرسلي	42, Cité des 60 logements   Frenda  W. Tiaret	0661 941 869			
576	1	4	\N	CERAL / CERAMIQUE ALGERIENNE	شركة الفخار الجزائري سيرال	99 Commune Hassi Ben Okba-Oran	040 22 90 52/53/54	040 23 35 85/86		
2185	1	4	\N	MLCS	شركة اامواد المحلية للبناء بالجنوب	BP 11 El Atteuf 47120  Ghardaia 	061 20 68 74			
2021	3	4	\N	CARRIERE OULED BENARBIA TAMOULGA	محجرة أولاد بن عربية بتمولقة	avenue de la révolution oued fodda W.Chlef. 	027 74 83 60	027 74 88 33		
4277	1	\N	\N	BRIQUETERIE KHADIDJA	مصنع الأجور خديجة	Cité 630 logememnbts Tebesbest Touggourt  W. Ouargla	0555 03 79 75			
2992	2	4	\N	CARRIERE FRERES MANAA	محجرة الاخوة منعة	Cité 24 logements promotionnels Kharrata Bejaia	061 63 99 18			
2921	2	4	\N	BOUCHENAK KHELLADI KARIM ET BOUCHENAK KHELLADI OTHMANE  & Cie - MEKAYDOU	بوشناق خالدي كريم و بوشناق خالدي عثمان و شركائهما - ميكايدو -	Tranche A et B Oudjlida Aboutachfine w,Tlemcen	043 28 60 88			
2534	1	4	\N	NUMIDIA PIERRE	نوميديا للأحجار	Zone d'Activité, Ain Smara - BP 154/B. W.Constantine	061 30 79 55	031 81 83 61		
1350	1	4	\N	TUF EXTRA	توف اكسترا	Cité France FanonBT17 N° 03 - BOUMERDES	0550 23 76 24			
705	1	4	\N	BOUSSOUFI	بوسوفي	Cité 136 Logements  Bt - AS - N° 01  - El Affroun -  W.  Blida	025 38 60 40	025 38 84 14		
1505	3	4	\N	SARA	صارة	Ouchba, Ain Fezza, Chétouane, Tlemcen	05 50 43 10 80	043 20 32 48		
159	1	4	\N	SAPAH / SOCIETE AURASIENNE DE PRODUCTION D'AGREGATS	الشركة الاوراسية لانتاج ورحي الحجر هنشيرة	Ain Djasser Route de sétif w/ Batna	0770 983 072	036 74 30 48		
1656	3	4	\N	ENTREPRISE TASSILI	مؤسسة الطاسيلي	Cité Caroubier N° 129 1er Etage W/Annaba	038 86 63 56 / 061 32 89 00			
1541	1	4	\N	EL M'HIR AGREGATS	المهير اقريقا	Cité 28, Logt LSP N°2, Lot 03/D, Bt 04/D, El M’hir, wilaya de Bordj Bou Arreridj	0770 93 53 38	034 19 61 40		
3210	3	4	\N	SYKAN TPH	سيكان تي بي أش	Cité Clément Ville N° 56/5 El Mohamadia W, Alger	021 82 18 83	021 82 97 67		
979	3	4	\N	CARRIERE TORCHANE		Bir El D'Heb W.Tebessa				
951	3	4	\N	ENTREPRISE D'AGREGATS CHERGUI MESSAOUD	مؤسسة الحصى شرقي مسعود	55, Rue Baarir Mohamed Larbi - Biskra.	033 53 02 94	033 53 02 94		
428	1	4	\N	SOCIETE GH CONDITIONNEMENT & TRANSFORMATION DU SEL		Cité 5 juillet BP 120 Guemar 39400 El Oued	032 23 11 28	032 20 13 40		
461	1	4	\N	CM GYPSO	سي ام جيبسو	Cité Bouaklane Bt n°3 M'Chedallah -Bouira	026 95 51 16	026 95 51 16	cm_gypso@yahoo.fr	
111	1	4	\N	SOCIETE MILIVIENNE DE CERAMIQUE		Zone Industrielle vielle ville   Mila	031 57 78 97	031 57 85 00		
1704	5	4	\N	ERCC - GIC / Entreprise des Ciments et Dérivés de Centre - Groupe Industriel et Commercial -	مؤسسة الاسمنت و مشتقاته للوسط - مجمع صناعي و تجاري	GIC - ERCC BP n° 38 Meftah W.Blida	025 45 55 34	025 45 54 19	Ercc.gic@wissal.dz	
2555	1	4	\N	ENDEBIREN	أنديبيرن	Cité Chelghoum El Aid, Djanet - Illizi.	074 93 50 16			
1982	5	4	\N	ECSB EL ACHOUR		BP 07 - El Achour - Alger	021 30 88 83\n021 30 87 63\n021 30 83 70	021 30 88 82		
1983	1	4	\N	ATTABI AGREGAT	عطابي للحصى	Rue Boubekri Tayeb - Tamlouka - W.Guelma	073 14 82 76	037 21 18 77		
2725	5	75	\N	SOGETRAP / SOCIETE GENERALE DE TRAVAUX ET PRESTATIONS	سوجيتراب	Cité des 1850 logements villa n° 05, Hassi Messaoud - W.Ouargla	029 73 40 27 / 029 73 40 28	029 73 11 28	sogetrap_algerie@yahoo.fr	
2726	1	4	\N	ABOUME CARRIERE	أبوم محجرة	Lotissement Marouani Hdj Tayeb N°4 W.Setif	036 93 51 85 /033 89 50 10 /033 89 52 52			
2727	1	4	\N	GETRAB		07,Cité des roses- Benihemdene - W. Constantine	041 91 23 58			
2728	3	4	\N	SIDI BRAHEM CARRIERES	سيدي براهم للمحاجر	51, Cité Gaid Youcef, Cherchell, wilaya de Tipaza	023 26 56 82	023 26 56 82		
297	1	4	\N	BRIQUETERIE EL RYM	مصنع الأجر الريم	 Complex toutistique Sabri-Annaba	038 80 64 37	038 80 64 37		
2438	3	4	\N	EMACAT	مؤسسة مواد البناء لعين تموشنت	RN n° 02 El Malah - W. Ain Temouchent	070 10 66 69			
3421	1	4	\N	KERMAT	كرمات	9 Bis   rue du Grand Bassin     Tlemcen	043 20 43 81	043 20 73 46		
48	5	4	\N	ETGR	شركة الاشغال و هندسة الطرق	Bp °227, Z.I Khessibia, wilaya de Mascara.	045 75 30 07-08-11	045 75 30 09-10		
2278	3	4	\N	EL KAOUAFEL POUR LA PRODUCTION DU SEL	القوافل لانتاج الملح	El Hamraia Reguiba  w/ 'El Oued	070 80 78 91/032 27 64 00	032 27 64 00		
192	5	4	\N	ENTREPRISE DE PLATRE & DERIVES OULED DJELLAL	مؤسسة الجبس و مشتقاته أولاد جلال	Feidh Chikh, route de Biskra, Ouled Djellal, w-Biskra	035 44 65 50	035 44 65 02		
2241	1	4	\N	MOHAMED BOUDHIAF	محمد بوضياف	SEDRATA - SOUK AHRAS	073 30 43 24			
4294	1	\N	\N	SZT	شركة الزيبان للأشغال بسكرة	Zone Industrielle n°36 Biskra	0661 374 443	0661 374 443		
2586	3	4	\N	CARRIERE EL ASPHOURE	محجرة العصفور	Cité urbaine nouvelle de Ouenza - W.Tebessa	061 54 89 58			
831	3	4	\N	GRANISKI	قرانيسكي	Lotissement de la commune N° 1 Collo W. Skikda	0550 50 95 96			
836	2	4	\N	CARRIERE SEDDIKI & CIE		22, Rue Halouane Mohamed - Thénia - W.Boumerdès	024 83 44 61			
837	1	4	\N	CARRIERE SIDI BRAHIM DU GYPSE	محجرة سيدي ابراهيم للجبس	N° 51 Boulevard Houari Boumediene  W.Bordj Bou Arreridj	035 68 99 67			
849	1	4	\N	BRIQUETERIE AIT ABDELKADER		Bab El Charref Bt 82 n° 13 - Djelfa	027 87 70 59	027 87 70 59		
253	1	4	\N	KEF ERRAND	كاف الرند	BP n° 68, Aïn Roua, Bougaa ; Sétif	036 80 21 06 / 0660 30 80 54	036 80 27 07		
390	1	4	\N	SIDI SLIMANE SERVICES	سيدي سليمان للخدمات	Touggourt - W.Ouargla	0661 34 23 73			
1869	3	4	\N	BOUZEKRI SABLE & MINE	بوزكري للرمل و المناجم	BP 351  18300 Milia W/Jijel	034 42 77 21			
453	1	4	\N	RIADAG	رياداق	Cité Derouiche Abdelkader n°143, Sougueur, wilaya de Tiaret	0550 92 31 08	046 41 31 67		
2720	1	4	\N	SABA BOUZGHAIA	الشركة الجزائرية للبطاريات الصناعية بوزغاية -صابا بوزغاية-	05, Rue Mohamed Salah Ben Abbès - W.BATNA	033 86 30 25	033 86 30 35		
3202	1	4	\N	TOP AGREGAT EL MALAH	تــوب أقـــريقـا المالح	09 Avenue Antar Benachir,Commune el Maleh, W, Ain Temouchent	0550 52 02 08	041 39 99 15		
2689	5	4	\N	COLPA / COSIDER LAFARGE PLATRE ALGERIE	كوسيدار لافارج جص الجزائر - COLPA	Site Usine de Plâtre, El-Adjiba-W. Bouira	026 93 74 64/ 0770 93 90 93	026 93 66 55	cosiderlafarge@yahoo.fr	
1259	2	4	\N	SOGMAC BAHLOUL & CIE		RN n° 01 Lot N° 02 - El Baoiagua - Médéa	025 41 19 96	025 41 19 69		
1262	3	4	\N	MAHMOUDI SMAIL CONSTRUCTION & TRAVAUX PUBLICS	محمودي اسماعيل للبناء و الأشغال العمومية	Cité El Taouba - El Oued 	032 21 94 93\n061 38 56 58			
862	1	4	\N	BRIQUETERIE HAOUES		23, Rue Bab Azzoune  Alger	021 71 47 11	021 71 47 43		
1173	3	4	\N	ARMIELIA	أرميلية	N° 12, Route Zeddigua - Amieur - W.Tlemcen	071 23 01 20\n061 22 09 70			
1175	2	4	\N	NORD SUD HALIMI & CIE	شمال جنوب حليمي و شركائه	Avenu HAKIM SAADANE N°15, commune de BISKRA, wilaya de BISKRA	0773 66 55 59/ 0778 12 69 87	033 53 14 36		
1728	2	4	\N	CARRIERE BOUCHAGOUR & GHRIS	محجرة بوشاقور و غريس	BIR BRINIS, OULED ARAMA COMMUNE DE OUED SEGUEN WILAYA DE MILA	0661302058 / 0660366809	031669524		
2612	3	4	\N	NEDJEMA / ETABLISSEMNT KOUIDER DE PRODUCTION DE SEMOULE	مؤسسة قويدر لانتاج الدقيق - النجمة -	Hassi Khalifa 39110 - W.El Oued	032 20 03 36	032 20 08 50		
2771	5	103	\N	MITTAL STEEL TEBESSA	ميتال ستيل تبسة	Cité Central  El Ouenza  W. Tebessa				
4261	\N	\N	\N							
3581	12	4	\N	COOPERATIVE ARTISANALE BOUCHRA	تعاونية حرفية بشرى	Lot N°924, Commune de Maarif, W, M'sila	07 91 05 19 24			
3584	1	4	\N	TUILDART	تويل دار	Zone industrielle Ouled Moussa  Boumerdes	0661 63 06 26	024 87 73 16		
2061	3	4	\N	MINEXA		Avenue 560, N° 15,  Nedrouma W. Tlemcen 				
134	3	4	\N	HOFANI ROSFA	حوفاني رصفة	Koudiet Bouchetit, route de Barika, Ain Touta, Batna	0550 38 04 30			
135	3	4	\N	GOUNEIBER TAYAB DES TRAVAUX PUBLICS	قنيبر طايب للأشغال العامة	Rue Bouarfa Abderahmane - Ain Sefra	049 76 23 53 	049 76 12 48 		
183	3	4	\N	CARRIERE FERCHANI	محجرة فرشاني	Commune de Dréa, W, Souk Ahras,	07 72 90 54 00	037 71 60 56		
3646	1	4	\N	HYDRONEUF	هيدروناف	132 A LOTS DALLAS - Tissemsilt	0770 94 54 50/066128 0012	046 49 76 77		
2818	1	4	\N	SABLIERE ATH ABBAS	مرملة اث عباس	Allaghene  Tazmalt	030 40 60 97	034 31 46 69		
2332	2	4	\N	ALITI & SALHI	عليطي و صالحي	Chez Aliti Messaoud - Amoucha - W.Sétif	070 31 66 41/ \n061 58 58 34	036 89 08 52		
2298	3	4	\N	SALAH SALAH ABDELHAK D'EXPLOITATION DE CARRIERE	صالح صالح عبد الحق لاستغلال محجرة	14, Rue Kherchiche Ammar - Guelma	074 38 29 38			
2654	1	4	\N	JASSEM CERAMIQUE	جاسم للخزف	Cité la Basilique, Ilot 166/10 - W.Tebessa	071 95 11 81			
2575	1	4	\N	BENMINE	بنمين	Lot 44 villa n° 01, BABA HACENE - Alger	021 35 55 45/071 41 19 43/061 41 40 56	021 35 55 45		
3205	1	4	\N	CARRIERE EL KOUDIA EL BEIDA	محجرة الكدية البيضاء	Lotissement El Boustane n° 133 A, Ain Abid - W.Constantine	0770 96 18 80			
547	2	4	\N	BIMAC						
2415	1	4	\N	AGREMAS	أقريماص	Zone industrielle N° 102 Khessibia, w- Mascara	045 73 74 62	045 73 72 05	sarlagremas@gmail,com	
369	1	4	\N	ELPMC EL AHD EL DJADID	المؤسسة المحلية لانتاج مواد البناء العهد الجديد	Zone d'activité n° 3 El Harrouch; Skikda	037 21 67 21	037 21 67 21		
1994	5	4	\N	TRACAPAG	تراكباك	Zone Industrielle BP 296 W. Bordj Bou Arreridj	030 59 52 64			
3783	5	4	\N	ETRHB CARRIERES	او,تي,ار,اش,بي محاجر	Zone D'activité n°182, lot n° 1, Dar El Beida, Alger	021 75 33 03	021 75 33 08		
2660	1	4	\N	BNB / BRIQUETERIE NOUVELLE DE BECHAR	مصنع الاجر الجديد لبشار	Debdaba - W.Bechar	040 84 06 41	049 83 85 94		
2830	3	4	\N	BOUDJERIHA HOCINE LES GRANDES CARRIERES	بوجريحة حسين للمحاجر الكبرى	Carrière Trab L ahmer, Roknia, Guelma	0550 505 331	034 44 66 00	hocine-boud23@gmail,com	
2881	3	4	\N	BENHMED MAHDI EXPLOITATION DES CARRIERES	مؤسسة بن احمد مهدي لاستغلال المحاجر	63, Bd des Martyrs, Oued Rihiou - Relizane	070 97 84 62			
1558	1	4	\N	SOCIETE ATAKOR	شـركة أتـاكور	Cité Tiksebte - El Oued - W.El Oued	032 10 33 59 – 0669 37 89 37	032 10 33 49		
3548	12	4	\N	COOPERATIVE ARTISANALE IBN ROUSTOM	التعاونية الحرفية ابن رستم	Aouissi Benaissa  Commune de Mellakou W. Tiaret	0779 872 563			
2989	2	4	\N	KHOBZI ET CIE GRANDS TRAVAUX ET PUBLICS	خبزي و شركائه للاشغال الكبرى و العمومية	47,Rue des Fréres Djezzar w/Biskra	070 98 13 98			
78	1	4	\N	SAMBA / SOCIETE ALGERIENNE DE MACONNERIE ET DE BETON ARME	المؤسسة الجزائرية للبناءات و الإسمنت المسلح	99, Bd Krim Belkacem -Alger	021 94 98 57	021 91 94 78	hnouali2@caramail.com	
1214	3	4	\N	CPAMC / CENTRE DE PRODUCTION D'AGREGATS ET MATERIAUX DE CONSTRUCTION.	مركز الانتاج لمواد الملاط و مواد البناء -سبام سي-	Commune d'El Ançor, AIN TORK  W.Oran	0560 053 322			
1215	3	4	\N	CARRIERE KHEZZARI AMMAR		BP 02 - Cité Lambridi - Oued Echaaba - W.Batna	033 80 11 76			
1219	1	4	\N	MEGHIAZE & CIE RECHERCHE & INSPECTION	مغياز و شركائه للبحث و التفتيش	Djeble Loussalit - Ain Fakroune - W.Oum El Bouaghi	032 40 32 76			
2189	1	4	\N	CCAH / CARRIERE CIRTA AGREGATS HAMMA	محجرة سيرتا للحصى و الرمل حامة	Cité Zouitna N°27 -Hamma Bouziane W.Constantine	031 90 15 14	031-84-16-14		
627	3	4	\N	MEGA AGREGATS	ميقا أقريقا	OUELD BRAHIM CENTRE,  Médéa	0659 444 445	025 78 26 99	Medéa-Agregats@Yahoo.Fr	
246	\N	4	\N	ENTREPRISE LAROUI EXPORT		Hôtel Aurassi, Niveau C, Bureau n°06; Alger	021 72 57 36	021 72 57 36		
2430	1	4	\N	SEB SEB COMMERCE MULTIPLE, TRAVAUX DE CONSTRUCTION, HYDRAULIQUE & TRANSPORT	سبسب للتجارة المتعددة و أشغال البناء و الري و النقل	Hai Enasser, Lot N°337, Tindouf, wilaya de Tindouf	040 89 07 01-0696 63 52 85	040 49 92 46-04		
2011	1	4	\N	EL HAMADIA AGREGATS	الحمادية أقريقا	Commune Ain Fakroune - W.Oum El Bouaghi	061 30 33 48/070 50 63 75			
508	1	4	\N	ENTREPRISE KHALFAOUI AGREGATS & SABLE	مؤسسة خلفاوي للحصى و الرمل	Rue Amir Abdelkader, BP 66 - W.Khenchela	032 32 17 86/0661 34 76 31	032 32 44 90		
1244	3	4	\N	CARRIERE TIMALTAS	محجرة تيمطلاس	20, Rue Smai  Hocine (cité Kouicem) 41 000 W. Souk Ahras				
2962	1	4	\N	TAOURAR SOCIETE GENERALE DES TRAVAUX PUBLICS ET BATIMENT	تاورار شركة العامة للاشغال العمومية	Cités des 564 lgts Bt 35 n°  63 Ain El Bai w/Constantine	031 69 01 01	031  69  02  80		
2740	2	4	\N	FRERES YAHIA & CIE	الاخوة يحي و شركائهم	Lotissement 105 Logements, Ferdjioua - W.Mila\r\nCité Benzerga, Dergana - W.Alger	021 21 16 08	021 21 17 86		
707	5	4	\N	BENTAL	الشركة الجزائرية للبانتونيت	31, Rue Mohamed Hattab - Hassan Badie\r\nEl Harrach - W.Alger	021 52 15 33	021 52 17 52		
1462	1	4	\N	SOCIETE D'AGREGATS EL MAHDI	شركة البلاط المهدي	Zone Industrielle de Sidi Bel Abbés W. Sidi Bel abbes	048 57 90 01	048 57 81 47		
120	3	4	\N	CARRIERE ASMA	محجرة اسماء	06 Zone 69 Hay Nasr - Chlef	061 20 36 64			
3284	1	4	\N	CH LUB / CHEBALLAH LUBRIFIANTS	سي.اش.لوب شبالة للزيوت	Route Nationale n° 5 Dahsset Zbida, Aomar - Bouira	026 90 83 64 / 026 90 82 79 /0770 94 30 00	026 90 84 52		
3040	2	4	\N	KHANCHOUCHE FRERES	خنشوش اخوة	05 Coopérative immobiliére Larbi Ben Mhidi  cité Bouroua      SETIF	0778 08 73 95			
455	3	4	\N	CARRIERE BENISAAD MOHAMED	محجرة بن يسعد محمد	BP n° 140, Chelghoum El Aid - Mila. 432000	07770 44 71 93	031 52 72 90		
1859	1	4	\N	GYPSE KADRI & FRERES	جبس قادري و اخوانه	Cité Bouira RN N°40- Magra - W.M'Sila	035 58 20 15 / \n061 27 80 57	035 57 00 54		
416	3	4	\N	PRODAGCO	بروداقكو	Azrou Kellal Cne Ath Mansour - Bouira	0661 62 01 16	026 93 43 62	prodagco@yahoo.fr	
418	5	4	\N	AGREGAN		ZI Pont Bouchet, El Hadjar ; Annaba	038 52 40 76	038 52 40 78		
2366	5	4	\N	ENGEURAR	مؤسسة الهندسة الحضرية و الاصلاحات الريفية سطيف	BP n° 04 El Hassi; Sétif	036 93 68 28	036 93 70 22		
2657	1	4	\N	SORIBLED	صوربيلاد	Oum Ali - W.Tebessa	061 38 62 25	032 21 02 52		
2080	3	4	\N	CGMSG	سي.جي.أم.أس.جي	Zone d'Activité Sour El Ghouzlane BP 61 Bouira	026 96 62 92/026 96 87 35	026 96 71 64		
2439	1	4	\N	MASCOS STATION DE CONCASSAGE	ماسكوس محطة تحجير	Cité 20 Août 1955  El Anasser   W.Bordj Bou Arreridj	072 94 06 64\n035 66 63 34	035 66 63 27		
1024	1	4	\N	CCM / CHLEF CERAMIQUE MODERNE		Zone Industrielle Oued Sly - W.Chlef	027 71 14 36	027 71 14 37		
1795	1	4	\N	AGREGATS CHREA	الحصى شريعة	Ighzer Amokran, Route de la Gare, Commune -Ouzlagene- W.Bejaia	034 35 12 34 / \n070 88 70 95			
1737	12	4	\N	EL AZHAR	الأزهار	Village Missiline - Bouguezoul - Médéa	025 63 51 54			
414	3	4	\N	CARRIERE AL MAHAROUN	محجرة الماهارون	Village Mesloub, Mekla, Tizi Ouzou	0770 44 32 90	026 30 23 19		
1199	1	4	\N	ALCODIMEX	الـكوديـماكس	BP01,EL ACHOUAT,TAHER-W.Jijel	034 54 22 09 / 0657 18 00 74	034 54 22 09		
3746	3	4	\N	BOULKHARFANE IMPORT EXPORT	بولخرفان للاستيراد و التصدير	Cité Essalam Ain fakroune, W, Oum el bouaghi	06 61 30 06 73			
3747	1	4	\N	EL GHAZI MUSTAPHA	الغازي مصطفى	Rezaik bp 191,Commune de souahlia, daira ghazaouet, W, Tlemcen	07 70 96 17 34	043 27 66 65		
4141	3	4	\N	D Z  MASTER OIL	دي زاد ماستر أويل	Zone d’investissement, lot n°36 Hassi Benabdellah, Ouargla	0770 55 84 50	023 40 11 52		
1683	5	4	\N	SOBAG / SOCIETE DES BETONS & AGREGATS	شركة الخرسانة و الحصى	Chemin vicinal  N°15, Zone Industrielle Benhoua - W.Mostaganem	045 26 32 48 / \n045 26 22 48	045 26 32 48		
3171	1	4	\N	SAESISE / SOCIETE ALGERIENNE EXTRACTION DE SEL INDUSTRIEL SUD EST	الشركة الجزائرية لاستخراج الملح الصناعي بالجنوب الشرقي	Hamraia, Reguiba - W. El Oued	032 28 32 66	032 28 32 66		
1841	3	4	\N	SABLIERE AMMI		Cité Bobillot Cage 01 - Sidi M'hamed - Alger	071 35 02 55			
112	3	4	\N	ETP ABROUS MOHAMED	أو.تي.بي عبروس محمد	Bd T n° 56 Hay Es Salem - Chlef	027 72 11 07	027 72 11 07		
732	3	4	\N	SMS / SAHARA MULTISERVICES	صحراء متعددة الخدمات	Route de l'aéroport  BP 1219  - Hassi Messaoud -   W. Ouargla	029 73 04 93 / \n029 73 04 95	029 73 05 19		
698	10	4	\N	2° G.R.T.I / D.R.I.M / 2° RM		BP 05 terre 02				
2122	1	4	\N	BNO /  BRIQUETERIE NOUVELLE DE L'OUEST	مصنع الأجر الجديد للغرب	El Guessiba, Sidi Ben Yebka - Oran	061 38 00 48			
1999	1	4	\N	AGREGATS DU TELL	حصى التل	Lotissement N° 117, Lot N° 101, Guedjel, wilaya de Sétif	0661 35 36 10 – 35 06 76	030 60 69 50		
2001	1	4	\N	KSAR EL ABTAL	قصر الابطال	BP 13 Ksar El Abtal Ain Oulmeme W.Sétif	061 35 00 22	036 96 34 42		
1480	1	4	\N	GBO / GRANDE BRIQUETERIE DES OASIS	مصنع الأجور الكبير الواحات	Zone Industrielle de Megarine - BP 92 - Touggourt 30200	029 68 15 35 / \n029 68 20  / 40\n061 38 04 96	029 68 27 96	SARLGBO@hotmail.com	
1238	11	219	\N	ENKA/KOU.G.C/GECET/NASTON	ENKA/KOU.G.C/GECET/NASTON	Cité DNC, Bloc, N°4 - Hydra - W.Alger	021 54 73 53	021 54 73 53		
1604	1	4	\N	SCAC / SOCIETE CONCASSAGE D'AGREGATS DU CENTRE	شركة التصفيف الحصى للوسط	RN n° 05  El Hamiz  Dar El Beida  W/Alger	026 21 30 70\n026 21 49 52	026 21 89 08		
753	1	4	\N	MOUMNI TECHNI SERVICES		19, Rue de Biskra   El Mohamadia -El Harrach-   W. Alger	021 53 07 43	021 53 07 43		
1332	1	4	\N	SOCIETE DJILALI BOUNAAMA BRIQUE	جيلالي بونعامة للأجر	04, Rue Si Allal - W. Chlef	027 77 15 79	027 77 59 59		
1299	1	4	\N	ECTA AZAGHAR		Cité Boumaza -El Eulma -  W.Stif	036 87 36 69	036 87 14 60		
3064	1	117	\N	SAOUD ABDOUELAZIZ  EL BABTAIN & FRERES	سعود عبد العزيز البابطين و اخوانه	Bt Al Babtain, Al Salhiya  BP 599 SAFAT 13006 \r\nKOWEIT	965 24 12730	965 24 09795		
293	1	4	\N	SOCIETE DES CERAMIQUES DE LA SOUMMAM	شركة الخزف الصومام	Z.I Ihadaden  Bejaia	034 21 22 46	034 21 27 68 		
295	3	4	\N	CARRIERE EL AMEL		BP 535 cité du 20 Août 55  Constantine	061 30 13 17			
7	1	4	\N	AGREGATS	أقــــــريــقـــا	commune de Ath Mansour daira de M'chedallah wilaya de Bouira	0561 222 370			
516	3	4	\N	STMB / SOCIETE DE TRANSFORMATION DE MARBRE BENCHERGUI		Zone Industrielle BP 315, Rouiba ; Alger	021 81 10 70\n021 81 13 53\n021 81 24 04	021 81 13 78		
4146	1	4	\N	CHERTVX	شيرتفيكس	Cité Colonel Amirouche, N°05, Hassi Messaoud, Ouargla	05 50 91 10 11	021 50 53 50		
4611	1	\N	\N	 AMESLADJ LITANKIB	 امسلاج للتنقيب					
4137	5	\N	\N	TOSYALI IRON STEEL INDUSTRY ALGERIE	توسيالي ارون ستيل أندستري الجزائر	LE POLE ECONOMIQUE COLINE GUERIRETE CN BETIOUA	041 793 131/041 793 132	041 793 131/041 793 132		
2905	1	4	\N	ARGILEX	ارجيلاكس	Coopérative Dar Echorti n° 11 D Bir Khadem Alger	061 51 64 20	017 06 00 02		
1149	3	4	\N	NARIMANE EXTRACTION DE SABLE		Qartier du 1er Nouvembre El Kouif  W.TEbessa				
3348	1	4	\N	PUBLITRAV BOUADJIL ET CIE		Rue Mostache Hocine    Bouandas    Setif	0661 35 31 61	036 93 54 64		
2381	1	4	\N	OULED FEGHOUL	أولاد فغول	RN N° 4 El Hmadna Relizane	046 97 33 07	046 97 33 91		
543	1	4	\N	EL MEKTOUB AGREGATS & SABLE	المكتوب للحصى و الرمل	14, Rue Cité du 5 juillet - Ain Beida - Oum El Bouaghi	032 49 16 08	0661 55 51 26		
1418	1	4	\N	EXPLOITATION CARRIERE MINAN	إستغلال محجرة مينان	10, Rue Emir Abdelkader - W.Bordj Bou Arreridj.	035 68 45 37 / \n061 37 01 75	035 68 45 37		
1722	1	4	\N	SGRA / SOCIETE DES GRANDES REALISATIONS & APPROVISIONNEMENT	شركة الإنجازات الكبرى و التموين	Rue Idel Salah n° 07 - W.Khenchela 	032 32 25 92 /0661 88 70 73/ 0557 52 11 10	032 32 25 92		
1047	3	4	\N	AKRAMINA EXTRACTION DE SABLE	اكرمينة لإستخراج الرمل	Rue Khenet Essadek, Collo - W. Skikda	038 71 83 70 / 038 71 80 91/ 0661 52 49 19	038 71 83 70		
1645	2	4	\N	SOCIETE AYACHI AMAR & FILS DES TRAVAUX PUBLICS & BATIMENT		El Magrene - El Oued				
102	3	4	\N	CARRIERE TAHDJOUT	محجرة تحجوط	Village Aït Mansour Ouhmed, Mekla ; TO	0770 54 07 15 / 0770 32 83 32			
2576	5	4	\N	CIBA / CIMENT BLANC ALGERIEN	شركة الأسمنت الأبيض الجزائري	02 (b) impasse Ahmed Kara, Hydra - W.Alger	021 54 99 69/70/71	021 54 99 66		
2478	\N	4	\N	SEGUINI		Cité Belle vue - Hamraia - El Oued	061 56 83 50	032 21 94 92		
3247	5	4	\N	SAMAMEDI	صمامدي	85, Ilot 381, Dely Brahim, W, Alger	021 64 13 55	021 64 13 55		
2340	1	4	\N	RB CONTRÔLE	أر.بي.كنترول	Rue Dakhli Mokhtar G2 Boucherka, Tahir, W-Jijel	0674 69 48 79 – 0556 57 37 47	 034 56 36 11		
149	3	4	\N	GRANULEX	قرانيلكس	BP 381 Zone Inustrielle BBA	035 68 48 71 - 061 62 67 68	035 68 55 47		
785	3	4	\N	SOREM / SOCIETE DE RECHERCHE & D'EXPLOITATION MINIERE	شركة البحث و الاستغلال المنجمي	Rue Bensmain Mohamed, n°39, Coopérative n°02, Section 111, Mostaganem	0770 44 44 44	045 26 80 87		
789	5	4	\N	LES CIMENTS BLANCS D'ALGERIE		N° 29 Cité Pavillonnaire Béni Saf  W. Ain Temouchent				
3386	1	4	\N	SOEM D'EXPLOITATION MINIERE	صوام للاستغلال المنجمي	200 LSP AIN MOUSSA, EL HIDHAB, SETIF EST N° 13, LOT N° 19 1IER ETAGE BT B1 SETIF	036 44 76 76 / 0661 35 18 09 / 0555 02 50 53	036 44 75 75		
2067	2	4	\N	MAHMOUDI IGHIL OUZEGAGHENE	محمودي - اغيل أوزقاغن -	Ighil Ouzegaghene, Ait Tizi,  Bouandas - Setif	070 50 70 46	036743048		
4016	1	4	\N	STG / SIDI MOUSSA TRAVAUX GENERAUX ET PROMOTION IMMOBLIERE	مؤسسة سيدي موسى للاشغال العامة و الترقية العقارية	BP 285, Zone Industriel, Adrar.	049 96 78 91	049 96 07 77		
4595	1	\N	\N	TEGHOURRFIT LI ZAHAB	تغورفيت  للذهب					
4274	1	\N	\N	MNTB		ZONE INDUSTRIELLE LOTS 10 ET 11, BORDJ BOU ARRERIDJ	0770 554 871			
4384	1	\N	\N	NOUR	النور	Cité 11 Décembre 1960 RDC   n° 40   Dely Brahim	0661 56 02 46	021 34 12 62		
3539	1	4	\N	SARADO TRAVAUX ROUTIERS ET HYDRAULIQUE	سرادو لأشغال الطرقات و الري	lotissement 10   lot n° 04    El Alia     Biskra	033 74 12 58	033 74 12 58		
4102	1	4	\N	GR.TR .S	ألاشغال الكبرى للجنوب	Cité 22 logts    N° 11    Ain Aménas     ILLIZI	0666 27 60 24			
3055	1	4	\N	ETP BELHANDOUZ	أو.تي.بي بلهندوز	12 Rue Alexandre Nobel, N° 03  GAMBETA - ORAN	041 53 21 20	041 53 29 79		
3953	1	\N	\N	EL HAMEL ENERGIES RENOUVELABLES ADRAR		BP 285 rue Bouzidi Abdelkader, Adrar	049 96 89 19	049 96 78 91		
3286	3	4	\N	DJERAF HODHNA ROUTE	جراف حضنة الطرق	BP 454 - M'sila\r\nRue colonnel  El Houes  n° 02   M'sila	035 55 07 68	035 54 81 45		
3723	1	4	\N	METAL GUM	ميطالقوم	116, Rue Med BOUDIAF (Ex. Rue de Mostaganem) w.Oran.	0770 26 06 00	041 28 28 72		
4654	1	\N	\N	TAZAIT LI ZAHAB	طزايت للذهب					
4050	1	4	\N	CARRIERE AKROUI AGREGATS ET SABLE	محجرة اكروي للحصي و الرمل	Lotissement Afak, 01 N° 16, Ain Fakroun, Oum El Bouaghi,	06 61 37 82 34			
3708	12	4	\N	COOPERATIVE ARTISANALE MOURAD	التعاونية الحرفية مراد	Douar Ain Nouicy  W. Mostaganem	0773 24 01 10			
3630	12	4	\N	COOPERATIVE ARTISANALE EL HAYET	التعاونية الحرفية الحياة	Coopérative Immobilière Concorde N°21, Commune d'Ouled Yaich, W.BLIDA	0550678104			
3372	1	4	\N	CREATION REKIMA	الابداع ركيمة	Cité des patrimoines n° 41 A Bellevue Constantine	0555 00 34 23	034 42 03 16		
1781	1	4	\N	ISHK / INDUSTRIE SUD HABA & KHELIFI		Ancienne Cité Oum Tiour - El Oued -	061 62 69 88			
184	1	4	\N	SEC	 ساك	Route de Chetouane , Commune de Sidi Ali Benyoub - W.Sidi Bel Abbès	0557 874 569			
150	3	4	\N	ISSAADI OUARI	اسعادي واري	Djebel Braou, Bazer Sakhra. El Eulma; Sétif  19675	072 23 63 61	036 84 66 64		
4130	\N	\N	\N	EL MADJADJIA DE CONSTRUCTION	المجاجية للبناء					
3289	1	4	\N	ENTREPRISE DE CONSTRUCTION AMEUR	مقاولة البناء عامر	Cooperative immobiliére GRANITEX, cité 1200 Bt 03, lgts 02 - Bab Ez Zouar - ALGER	021 24 95 96	021 24 95 95		
4453	1	\N	\N	TIN MERKIDEN LITANKIB	تين مركيدن للتنقيب					
3374	3	4	\N	RAGUEB EREMAL	راقب الرمال	18, Rue Emir Abdelkader - W.Sidi Bel Abbès	048 54 19 33	048 54 19 33		
3427	3	4	\N	ENTREPRISE TRAVAUX PUBLIC CHAREF	مؤسسة الأشغال العمومية شارف	Cité Ben Adjal  Boudouaou W. Boumerdes	0770 53 85 05			
3428	12	4	\N	COOPERATIVE ARTISANALE EL FORAT			0661 78 28 30			
3048	1	4	\N	CAT / CONSORTIUM ALGERIAN DES TRAVAUX MOKHTARI FRERES	كو نسورنتيوم ألجيريان للاشغال مختاري اخوة	09, Rue Frères ACHOURI - DAR EL BEIDA - ALGER	023 81 09 44	023 81 09 65		
349	3	4	\N	CARRIERE EL ARBI	محجرة العربي	Rue Président Wilson ; Souk Ahras				
2700	3	4	\N	CARRIERE LATRECHE	محجرة لطرش	Foubourg Mebarki Said - Guelma	073 84 29 56			
2294	1	4	\N	FAIENCERIES ALGERIENNES	خزفية الجزائر	Lot n° 7. Zone W.GUEDHIA, Zone Industrielle de Rouiba - W. Alger	023 86 22 30/31	023 86 22 34	contact@groupefa.com	www.groupefa.com#http://www.groupefa.com#
621	3	4	\N	CARRIERE SABLE & AGREGATS AMAMA		BP 115 Ain Beida W.Oum El Bouaghi	032 48 74 37			
623	5	4	\N	PCMACS		Cité La Cadat Complexe Riadh El Feth W.Tiaret.	046 45 18 12	046 45 18 12		
1995	3	4	\N	BRIQUETERIE EL OUARSENIS RAHMOUNE ABDELKADER		Zone Industrielle Oued Sly W.Chlef. 	027 71 09 98\n027 71 09 57\n027 71 15 78	027 71 09 66	briqueterieouarsenis@yahoo.fr	
2105	5	4	\N	SONATRO	الشركة الوطنية لكبريات أشغال الطرق	Zone Industrielle de Reghaia Bp n°26, Reghaia, Wilaya d’Alger.	023 96 56 72	023 96 51 85		
2107	2	4	\N	AISSAOUI BACHIR & CIE D'EXTRACTION DE SABLE		Ras El Ayoun El Kouif  W.Tebessa	0666 554 812			
2108	3	4	\N	SIDI BOURZINE	سيدي بورزين	Dar Mansour Souk Tleta Tlemcen	0771 301 883			
2111	1	4	\N	CARRERAS	كريراس	Promotion SOMACOB Bt A1 Boulevard Krim Belkacem - W.Bejaia				
1311	1	4	\N	CARRIERE EL DJOUSSOUR	محجرة الجسور	BP 219 Djebel Mazla Ain Abid, Constantine	0551 904 546			
1949	3	4	\N	MATEC TPH		Oued Tizi - Ain Torki - Daïra Hammaam Righa - W.Ain Defla	027 65 43 33 / \n027 66 38 99	027 66 55 18		
1209	3	4	\N	PLATRE RINES	جبس ريناس	Chaâba El Hamra El Euch W.Bordj Bou Arreridj.	0661 21 47 85	035 35 65 04		
308	\N	4	\N	GTS / ENTREPRISE DES GRANDS TRAVAUX DU SUD		GTS BP 83 Tamanrasset	029 34 49 44			
2647	1	4	\N	SACANPROMO	سكانبرومو	Rue, Mohamed Douid,  Beni Tamou - W. Blida	070 33 26 16 / 050 85 21 91			
645	5	4	\N	EDCO		7, Rue Ali Dziri -Haï Es-Seddikia - W.Oran 	041 42 11 52\n041 42 22 80	041 42 49 58 \n041 42 11 44		
2714	1	4	\N	CERAMIQUE AIN TEMOUCHENT	خزف عين تموشنت	RN n°02, El Malah, wilaya d’Ain Temouchent	041 52 46 12 / 0661 38 00 48	041 52 46 70	ahmed_smt@hotmail.com	
2493	\N	4	\N	BELHADJ Abdelkader		Route de Ammi Moussa Relizane				
2200	3	4	\N	GRAVITOS	غرافيطوس	Oued el Ma Commune de Merouana W, Batna	033 86 66 46	033 86 66 46		
37	5	4	\N	HYDRO AMENAGEMENT	المؤسسة الوطنية لتهيئة الري	Usine Béton Zone Industrielle Rouiba Boumerdès	021 81 16 90	021 8151 09		
2648	3	4	\N	ASHAB EL ACHRA DES AGREGATS	أصحاب العشرة للحصى	BP 07 REGOUBA SOUK AHRAS	061 39 09 71			
45	3	4	\N	ENTREPRISE DES CARRIERES DE SIG	مؤسسة إستغلال المحاجر بسيق	Cité Redouane BP 158 Sig Mascara	023 26 61 77	023 26 61 77		
47	\N	4	\N	APC HACHEM		APC Hachem Mascara	045 80 51 03	045 80 51 12		
704	3	4	\N	SOUFIMINE		300, Avenue Kebladj Hamid - El Hammamet -   W.alger	021 95 83 34	021 95 81 73	soufimine@yahoo.fr	
3657	12	4	\N	COOPERATIVE ARTISANALE DJEBEL MEHARGA	التعاونية الحرفية جبل محارقة		0661667928			
4793	1	\N	\N	SOCIETE OULED BOURAS ENTREPRISES GENERALES	أولاد بوراس للمقاولات العامة	Cité Rabia Tahar, BT A36, N° 02 Bab Ezzouar-Alger	0661 553 653	023 83 21 94		
2784	3	4	\N	CHAFI CARRIERE	شافي محجرة	14, Rue Mehor Mahieddine - W.Mascara	045 82 38 48 / 071 92 01 10			
2525	5	4	\N	ALSIMCO / ALGERIAN SERVICES & INDUSTRIAL MAINTENANCE COMPANY	الشركة الجزائرية للخدمات و الصيانة الصناعية "ألسيمكو"	56, Lotissement Sidi Aissa - Annaba	071 39 95 48	038 88 36 49 / 038 51 58 94		
2550	3	4	\N	ENTREPRISE SEGHOUANE AGREGATS	مؤسسة سغوان للحصى	Cité djeddi Abdelkader 1/47 Berrouaghia, W- Médéa	0550 58 60 75	 021 39 52 00		
302	1	4	\N	SOCIETE BENMALEK TAKOUBA SAKKA		BP 144 Tamanrasset	029 34 31 30	029 34 31 30		
304	5	4	\N	STCA	شركة الاشغال و البناء عنابة	Siège social Route Oued Eddahab ; Annaba	038 84 55 56	038 84 85 20		
1574	1	4	\N	SASO						
372	1	4	\N	EHPC / ENTREPRISE DES HAUTS PLATEAUX DE CERAMIQUE		Sidi Abed  W.Tissessilt				
1301	3	4	\N	OUARDET EDDIS D'EXPLOITATION DE GYPSE	ورداة الديس لإستغلال الجبس	Ouled Sidi Brahim, 28211- W. M'Sila	035 52 26 80	035 52 26 80	ourdateddis@yahoo.fr	
1303	3	4	\N	LAIB GRANDS TRAVAUX	العايب للأشغال الكبرى	Lot N° 11  Zone Industrielle. W. Illizi	033 88 36 09 / 061 34 35 45	033 88 87 60		
1426	3	4	\N	OUARI SABLES	مؤسسة واري للرمل	Souhla - Sidi Aoune - W.El Oued	072 30 30 80			
1599	5	4	\N	SPDE / Société des Produits Dérivés de l'Est	شركة المواد المشتقة للشرق	BP N° 65, Zone Industrielle Route de M'Sila - W.Bordj Bou Arreridj 34000	035 68 63 04	035 68 63 07		
1771	3	4	\N	FARES BRIQUETERIE	فـارس بريكاتري	64 Logements, Rue de 1er Novembre - El Eulma - (19600 )W.Sétif\r\nZone Industrielle El Eulma - Sétif.	036 87 68 38	036 87 68 38		
208	1	4	\N	CARRIERE EL HAOUDJA	محجرة الهوجاء	Ras El Ma Bouhachana W, Guelma	0777 22 65 84	037 21 67 21		
2761	3	4	\N	ENTREPRISE GUELLATI ABDELLAH IMPORT EXPORT	مؤسسة قلاتي عبد الله للاستيراد و التصدير	Cité Essaada n° 11, 4ème Tranche - Ain Kercha, W, Oum El Bouaghi	072 06 39 68	032 45 28 69		
2062	3	4	\N	ETBCP LEBLEDJ	مؤسسة للبناية و تكسير الحجارة لبلج	Cité Tekhmert, Commune et Daira de Tiaret - W.Tiaret	0555 77 99 87	045936500		
3545	3	4	\N	OULED KOCEIR SABLIERE	أولاد قصير مرملة	Rue Benbadis N° 237, w. CHLEF	0550 95 84 57			
718	5	4	\N	SOFEM		BP n° 13 Zone Industrielle W/Mila	031 57 89 86\n031 57 58 83	031 57 80 90\n031 57 96 14		
348	2	4	\N	BOUAZZA & FERRADJI		Cité Benrahmoune Corso Boumerdès	061 65 03 50			
2342	1	4	\N	SATEC	الشركة الجزائرية لأشغال المقولات و التجارة	Rue Colonel Slimani 09/05 - Hassi Bahbah - Djelfa	027 86 23 44\n061 63 75 36	027 86 23 44		
3622	12	4	\N	COOPERATIVE ARTISANALE ENNESR	التعاونية النسر	Cité 363 lots, division 33 groupement propriétaire N° 06 EL OURCIA   w, Sétif	0553693248	031965599		
774	3	4	\N	STATION DE CONCASSAGE GUECHICHE SMAIL		Rouissat    W.  Ouargla	029 72 14 78	029 72 14 78		
503	1	4	\N	BRIQUETERIE DE L'ATLAS	مصنع الأجر الأطلس	Zone Industrielle - BP 128 - Boussaada - W.M'Sila	035 44 65 50	035 52 10 23 / 035 44 65 02		
663	3	4	\N	CAR CHEL	كارشال	Bezdifa Commune de Amieur Daïra de Chetouane  W. Tlemcen				
2339	1	4	\N	FILALI FILM ALIMENTAIRE		Lot n° 30 Zone Industrielle (Extension) Oued Smar - Alger.	021 50 74 56\n021 50 53 17	021 50 52 70	sarlfilali@hotmail.com	
329	3	4	\N	BOUBEKEUR	بــوبكر	33 Rue Emir Abdelkader, commune de Souguer - W.TIARET	0661 81 50 65			
330	5	4	\N	CAAD	محجرة الحصى اسي يوسف جرجرة	Assi Youcef, BP 181, Boghni ; TO				
2609	1	4	\N	ETHP OULED AYAD	أو.تي.أش.بي أولاد عياد	132, Parcelle Dallas, Tissemsilt - W.Tissemsilt	061 28 04 78/090 86 97 57	046 47 88 59		
2437	3	4	\N	CARRIERE SLIGOS	محجرة سليقوس	02 CIT2 DES 48 Logts Pavillon 10/SAIDA	0771 41 77 23	046413167		
3346	3	4	\N	MLPSM	أم أل بي أس أم	Cité Kaber Assahbi, Bloc 153 n° 44, Messaad - Djelfa	0796 16 66 91	027 87 81 76		
2097	3	4	\N	AZRI EXPLOITATION DES MINES	عزري لاستغلال المناجم	Hai Massim Djamaa - El Oued	061 57 37 87	032 25 93 36		
3223	5	4	\N	GTH	المؤسسة الوطنية لانجاز العام لأشغال الري	Boulvard de l'Afrique Bp 1021 ANNABA	038 43 60 78	038 43 61 87	gth-dg@yahoo.fr	
432	1	4	\N	CONCABER	كنكبير	RN n° 1 Berriane - W.Ghardaia	029 84 65 41	029 84 65 41		
1459	1	4	\N	SABLIERE EL KHADRA	مرملة الخضرة	Cité Ain Allah Dely Brahim Batiment 301B W.Alger	021 37 21 59	021 60 17 97	bendiff@compuserve.com	
106	1	4	\N	FAPRO	اف أ  بي ار او	El Mohgoun, Commune d’Arzew, Daïra d’Arzew, wilaya d’Oran	0770 26 04 04/ (041) 59 71 20	041 59 71 20		
1275	2	4	\N	S.CON.SET FRERES ABDELLAOUI		03, Rue des Frères Djemili - W.Sétif	036 83 33 61	036 84 90 72		
1277	5	4	\N	BRC / BROWN & ROOT CONDOR		Buttes des deux bassins - Oued Roumene - Draria - Alger				
2462	\N	4	\N	BARDJOUH Lakhdar		Oum El Tiour - El Meghaïer - El Oued	072 30 30 80			
2419	5	4	\N	ERTP / ENTREPRISE DE REALISATION DES TRAVAUX PUBLICS	مؤسسة الانجاز و الأشغال العمومية	BP 116 Zone Industrielle - Tebessa	037 59 23 11	037 59 25 09		
3082	3	4	\N	BETEF						
642	1	4	\N	EL BEIDA EXTRACTION & PREPARATION DE PLATRE		Bir Seddique, Ouleed Sidi El -Arbi  W.M'Sila				
1099	3	4	\N	BORDJ MEGUIBRA	برج لمقيبرة	Cité Belle vue - Hamraia - El Oued	032 27 64 00			
1033	1	4	\N	BMAB / BRIQUETERIE MODERNE AMMOURI BISKRA	مصنع الاجور العصري عموري بسكرة - بي أم أ بي	Route de Batna El Hadjeb W/ Biskra	033 75 41 93	033 74 07 50		
1716	3	4	\N	KEDDACHE EXPLOITATION DES CARRIERES	قداش لمقالع الحجارة	Rue Ben Tabet Mohamed N°9\r\nWilaya : MASCARA	045 81 19 77	045 81 19 77		
236	1	4	\N	VOR	مصنع الزجاج وردة الرمال	BP 153 Ouled Yaiche; W. Blida	025 43 79 38	025 43 79 38		
1601	1	4	\N	SABLIERE SOUK EL HAD	مرملة سوق الحد	120, Boudjemaa Temimi - Draria - Alger	061 52 73 97			
404	3	4	\N	SARAMA	صرامة	Cité des 448 Logt D116 n°96 Tiaret	0551033 240	046 41 31 67		
886	1	4	\N	CARRIERE SAADA & TADBIRT	محجرة سعادة و تادبيرت	Oued Taga - W.Batna	074 23 50 21			
1984	1	4	\N	EST AGREGATS	حصى الشرق	Douar Ouled H’Rid, BP 60Bendjerrah Wilaya de Guelma	0661 32 39 29	038 69 43 83		
1552	1	4	\N	CARRIERE EL WIAM	محجرة الوئام	560 rue AB N°14 Bordj Bou Arreridj	0770 234 379	035 68 73 90		
315	5	4	\N	TRAVORT / SOCIETE DE TRANSPORT & TRAVAUX ROUTIERS		BP 205 Beni Meida W Tissemssilt	046 51 41 40			
955	5	4	\N	ERCE - GIC / Entreprise des Ciments et Dérivés de l'Est - Groupe Industriel et Commercial -	مؤسسة الاسمنت و مشتقاته للشرق - مجمع صناعي و تجاري	Zone Industrielle - Le Palma - BP 567 W.Constantine.	031 66 49 22 et 23	031 66 49 30	gic-erce@hotmail.com	
4454	1	\N	\N	SOCIETE KOUMARIS	شركة كوماريس					
205	1	4	\N	SUPER PLATRE	الجبس الممتاز	100 Foubourg de l'industrie; Sétif 19000	0773 601 406	036 83 12 98	superplatre@hotmail.com	
1342	1	4	\N	BARDJOUH LAKHDAR CARRIERES		Oum El Tiour - El Meghaïer - El Oued	072 30 30 80			
2645	5	4	\N	S.CI.Z / Société des Ciment de Zahana	مؤسسة الاسمنت لزهانة	RN 13 Djeniene Meskine - BP 56 Zehana - W. Mascara	045 83 11 48 /49	045 83 11 45	sciz@scizahana.com	
3565	12	4	\N	COOPERATIVE ARTISANALE AYOUB	التعاونية الحرفية أيوب	Cité des Freères Boutaiba, n° 58  Frenda - W. Tiaret	046 31 41 67			
2608	1	4	\N	CERAMIQUE TEB	CERAMIQUE TEB	Coopérative Immoblière Mohamed Boudiaf, n° 25 (Makam Chahid) - Setif	036 84 66 64	036 84 66 64		
4391	1	\N	\N	SARL REDSTONE PRODUCTION INDUSTRIELLE DE MARBRE	ردستون إنتاج صناعي للرخام	Zone Industrielle LARBATACHE,                     Commune LARBATACHE, Wilaya BOUMERDES	0560 02 56 84			
2413	1	4	\N	FRERES BOUKERT TRAVAUX PUBLICS	شركة الاخوة بوقرط للأشغال العمومية	165 Bd des martyrs Oued Rhiou  Relizane	046 97 95 35	046 97 95 35		
4684	5	4	\N	INDJAZMINES	إنجازمين	Zone industrielle Sidi bel Abbes Lot N° 144, rez de chaussée, Local N° 05	048 7031 90/0561646566	048703113	indjazmines@groupe-chial.com	
3139	1	4	\N	ZOUBIRIA AGREGATS	زوبيرية للحصى	Ain Kherba Commune de Zoubiria Daira de Seghouane W-Médéa	0550 90 10 22 / 0550 90 10 23			
3369	1	4	\N	ALGEROC	الجروك	Cité Lardjen N°4, W, Saida	06 61 56 48 27	048 50 40 40		
4612	1	\N	\N	AMENTAF LI ZAHAB	امنطاف للذهب					
4023	2	\N	\N	SOCIETE GORI ET CIE FABRICATION DE BRIQUES	شركة قعري و شركائه لصناعة الاجور	Routede cheria   Bir El Ater  ,  Tebessa	05 55 05 46 66	037 44 62 09		
4094	\N	\N	\N							
2514	5	4	\N	SDCIM / SOCIETE DE DEVELOPPEMENT INDUSTRIEL & COMMERCIAL DE LA MEDITERANNEE	شركة التطوير الصناعي و التجاري المتوسطي - أس.دي.سي.اي.أم	13, Rue Lakhdar Hafiz - Oran	041 41 32 49/ 041 41 32 19	041 41 32 49		
3527	1	4	\N	GTRHO / GRAND TRAVAUX ROUTES ET HYDRAULIQUE OUALI	الاشغال الكبرى للطرقات و الري والي	Nouvelle cité urbaine n°1BP n°03 M’Sila, Wilaya de Msila	035 345 103 / 035 535 768 et 035 535 121	035 345 116 / 035 535 767		
4782	1	\N	\N	TISLAMATINE	 تيسلماتين	TAZROUK TAMANRASSET ALGERIE				
3722	5	4	\N	GRANU - OUEST	قرانواست	BP 27 Route nationale n° 13, CP 29330 Zahana - Mascara	045 84 11 61/71	045 84 11 57	granu_ouest@yahoo.fr	
2472	\N	4	\N	BENBRAHIM Hocine		7 Rue Abane Ramdane Deles W.Boumerdes	026 22 27 62	026 22 27 62		
3268	12	4	\N	COOPERATIVE EL KHERBA POUR L'EXTRACTION DE PIERRE	التعاونية الحرفية لاستخراج الحجارة	Commune de Melakou, W, Tiaret	07 72 37 15 68			
2118	1	4	\N	CONCASSAB MAITAR	كونكساب مايتار	Cite 164/12 Hai El Badr, Wilaya de BOUSSAADA	0771 60 68 65	035 57 32 03		
3692	12	4	\N	COOPERATIVE ARTISANALE BAB EL BARAKA	التعاونية الحرفية باب البركة	Route de Braktia  Ouled Derradj  W. M'sila	0775 128 487			
3363	12	4	\N	COOPERATIVE ARTISANALE EL MAGROUNIATE POUR L'EXTRACTION ET CONCASSAGE DE PIERRES	التعاونية الحرفية المقرونيات لاستخراج و تفتيت الحجارة	Lotissement D 127, N°28, Cité Mohamed Djahlene, W, Tiaret,	07 72 93 17 50			
3550	12	4	\N	COOPERATIVE ARTISANALE RIADH	تعاونية حرفية رياض	Ain Larabaa, Rue Belahoual A,B,D, W, Ain Temouchent	07 74 96 32 25			
2034	1	4	\N	SOREAG	سورياق	Centre ville N'Gaous - Batna 	070 94 5160			
4772	3	4	\N	EL ASSAD DE GRAND TRAVAUX PUBLIC HYDROLIQUE ET SERVICES	مؤسسة الأسد للأشغال العمومية الكبرى و الري و الخدمات	 Cité 400 logements El Oued - W El Oued	0560 10 35 10 / 0662 74 22 77	032 14 02 68		
3218	3	4	\N	EL TAHADI EL DJADID TIDJARA MOUTAADIDA	التحدي الجديد لتجارة متعددة	Rue du premier novembre 1954 - W, souk ahras	0668 77 17 51 / 0775 14 02 35	037 74 30 82		
966	1	4	\N	ORCONSMAT	أوركونسمات	33 – Chemin Vinical d’El Kerma, Zone Industrielle d’Es Senia, Oran.	0661 212 460	045 82 00 65		
971	3	4	\N	SABLIERE DE M'SILINE LADJELATE AISSA		Boulevard de l'ALN - W.Médea		025 50 57 20		
3096	3	4	\N	El AHRASSIA DES GRANDS TRAVAUX ET CARRIERES	الأهراسية للأشغال الكبري و المحاجر	66 Rue ALI HADDAD N° 112 El Mouradia Alger	0554509867 0658048988	023620596		
2785	1	4	\N	BELHADJ SERVICES	الشر كة بلحاج خدمات	10, Hai Essalem  Zone Industrielle  W.Béchar\r\nRN  n° 6   Route de Ouakda  / BP 162   BECHAR	0770 60 54 10	049 80 09 25		
2165	3	4	\N	SIDI LAHCENE	سيدي لحسن	Dar Mansour Souk Tleta Tlemcen	0772 542 630 / 0770 132 643			
4196	1	\N	\N	GEBTO Immobilier et Investissement	جيبتو للعقارات و الإستثمار	Cité 320 logements SORECOR, Bt S 01, Sid Bel Abbès	0555 04 47 76	048 70 35 71		
2865	1	4	\N	CARRIERE OULED ZEKRI	كريار أولاد زكري	65 Chemin 01 Novembre 1954 Tergta El Maleh\r\nwilaya de Ain Temouchent	040 97 57 80	040 97 57 80		
2524	3	4	\N	ETPHW	"أو.تي.بي.أش.وي"	Cité EPLF 224 logements batiment n° 02, Ain Naadja - Alger.	021 55 65 81	021 55 65 81		
1830	1	4	\N	CARRIERE THADERMOUNT		Souk El Tenine Centre (06000) W.Bejaia				
132	3	4	\N	DIB MABROUK CARRIERE	ذيب مبروك محجرة	Djebel Mazela, Commune De Ouled Rahmoune, W, Constantine	07 76 35 13 60	037 21 67 21		
1508	1	4	\N	VITAO		Rue Benabrouk Hocine - Heliopolis - W.Guelma	061 36 00 88 / \n037 23 58 58	037 23 58 58		
1252	3	4	\N	DEKHINET CARRIERE		02, Rue Salah Laala - Ain Touta - W.Batna	033 83 53 77 / \n061 34 12 89			
1979	1	4	\N	MEDC / METAL EXPORT DEVELOPPEMENT CORPORATION		Lot Piéte n° 6,Le Paradou Hydra W/Alger	021 69 10 70\n071 28 89 38	021 69 10 70		
3566	12	4	\N	COOPERATIVE ARTISANALE BIL KERDADA	التعاونية الحرفية بيل كردادة	Cité Houari Boumedienne N° 554/09  Boussaâda W. M'sila	0550 450 544			
1925	1	4	\N	CARRIERE MOUHEB		Cité Chouhaada Dellys	061 32 84 14			
1587	1	4	\N	STATION D'AGREGATS AZROU	محطة الحصى أزرو	Kef Azrou El M'hir W, Bordj Bou Arreridj	07 93 58 64 46			
4456	1	\N	\N	ANGHLESS	انغلس					
4355	1	\N	\N	DJIRDJIRA TRAVAUX DE CONSTRUCTION	جرجرة للأشغال البناء	Centre Balloul, Ouled Brahim, Saida	07 70 61 10 40			
2205	3	4	\N	GUISTA 12	قسطا 12	Quartier Djebrane Mabrouk - W. Souk Ahras	073 32 44 26	031 66 80 76		
653	3	4	\N	CARRIERE MENOUAR SAID		Bir Haddada Djebel Youcef Mechta Ouled Hmida Daira de Ain Azel W.Setif	061 65 06 68\n073 74 37 04			
656	5	4	\N	ETR		Zone Industrielle - BP 339 - W.Djelfa	027 87 59 71	027 87 12 40		
2863	14	37	\N	MINES CANCOR INC	كنكور مناجم	1410, Rue stanley, Suite 606, Montréal Québec Canada H3A 1P8	(514) 849-3013	(514) 849-9181	khobzi@cancor.ca	
525	3	4	\N	BENDAHMANE PRODUCTION & VENTE D'AGREGATS	بن دحمان لانتاج و بيع الحصى	21, Rue Franz Fanon W, Souk Ahras	06 99 56 77 08	037 35 25 69		
490	1	4	\N	BRIQUETERIE SEYBOUSE						
480	1	4	\N	SOBAR	صوبار	10,Rue Si Djelloul Ben Miloud 42100 Cherchell	024 43 34 74			
3422	3	4	\N	ENTREPRISE WAEL	مؤسسة وائل	Bp 17 A Slmane Ould Derradj, M'sila	0550 542 899	035 57 70 53		
3180	14	\N	\N	DAEWOO E&C Co Ltd.		Base Vie Daewoo E et C Boughozoul Médea Alger	025 63 52 39	025 63 52 39		
2772	1	4	\N	CONCATAM	كونكتام	Rue Assekrem, Cité Sersouf, W Tamanrasset	021 54 08 87	021 54 08 87		
2023	1	4	\N	SIDAR	سـيدار	Coopérative Immobilière Parcelle n°141-Del Ibrahim- W.Alger	021 91 01 89 / \n070 92 97 79	021 91 01 74		
2617	\N	4	\N	TALBI MOHAMED	طالبي محمد	Zone d'Activité Ouled Fares - Chlef	027 72 00 76			
2579	3	4	\N	SACO / SOCIETE ALGERIENNE DE CONCASSAGE	الشركة الجزائرية للجـرش	Chemin des Crêtes, Mazagran 27120 - W.Mostaganem.	045 26 60 39	045 26 60 41		
2429	3	4	\N	BRIQUETERIE TIMADANINE	مصنع تيمادنين للياجور	Rue Bouzidi Abdelkader BP 285 Adrar 	049 96 60 80	049 96 87 30	grelhamel@yahoo.fr	
2197	1	4	\N	BRIQUETERIE DE LA TAFNA	مصنع الاجور التافنة	Sidi Boounouar BP 172 Remchi - Tlemcen 13500	043 43 71 98	043 43 71 83		
2307	5	\N	\N	Algerian Cement Company ACC		Centre Commercial de Bab-Ezzouar, Tour n°2, \t\t\t5ème et 6ème étages, Bab-Ezzouar, wilaya d’Alger	023 92 42 95-96	023 92 42 94		
950	1	4	\N	B2		Rue des Frères Laghrour  W/Khenchla 	061 34 71 23	032 32 27 05		
1519	3	4	\N	ENTREPRISE HACHEMI DES TRAVAUX DE BATIMENT TCE	مؤسسة هاشمي لأشغال البناء كل هياكل الدولة	Douar ouled Ali Commune  Ouled Ibrahim	048 371 094	048 371 094		
1520	1	4	\N	SAPNF		Route de Constantine (Parc Berahal) -El Harrouch - W.Skikda	038 79 07 13			
470	3	4	\N	BLEL ABDELMOUMEN	بلال عبد المومن	n°170, Cité Khaldaoui Abdelouahab ; Tiaret	072 82 29 48			
2064	1	4	\N	ENTREPRISE BOUKHROUFA & BOUSSAID		Commune de Ain Fakroun   W.Oum El Bouaghi 				
2069	2	4	\N	BEXCAR BENBRAHIM & ASSOCIES	بكسكار بن براهم و شركائه	Cité 1587 Lgt Bt 116 n°1152 Commune El Khroub-W. Constantine	031 95 43 32	031 95 43 27/29		
1223	1	4	\N	MERBRERIE DU CHELLIF		Zone Industrielle de Ain-Defla  BP  355  AIN-DEFLA	021 69 00 16\n061 51 59 88	021 69 99 16		
479	1	4	\N	EXPLOITATION DE SABLE RIGHIA		Lotissement "Zone 3" Commune d'Echatt Wilaya d'El Tarf 	:038 84 40 22	038 84 40 22		
2607	5	11	\N	WMZ / WESTERN MEDITERRANEAN ZINC	WMZ / WESTERN MEDITERRANEAN ZINC	31, Rue Mohamed Hattab, Hacène Badie, Belfort - Alger	021 52 17 48	021 52 17 48		
2277	5	4	\N	BOUGHEDOU AGREGATS	بوغدو للحصى	Commune Tizi - Mascara	045 85 82 45			
2671	1	4	\N	SAVI EST V	سافي است	Cité  Gasmia Mahmoud - RN 05, Tadjenanet - W.Mila	031 53 23 23/031 53 24 24			
2672	3	4	\N	CMR	الترقية العقارية ومقاولة أشغال البناء و كل هياكل الدولة س.م.ر شوشان محمد رضا	Plage Rizzi Amor, Bel Azur n° 4 - W.Souk Ahras	070 94 50 41			
652	3	4	\N	CARRIERE BENSALEM		Ain Bouchekif W.Tiaret	046 44 03 90			
162	1	4	\N	CMCA / COMPAGNIE MAGHREBINE DE CARRIERES D'AGREGATS	الشركة المغاربية للمحاجر و الحصى	BP 77 El Hachimia - Bouira	021 28 70 86	021 28 26 21		
2394	5	4	\N	EPBTP / ENTREPRISE PUBLIQUE DE BATIMENT & DE TRAVAUX PUBLICS OUM EL BOUAGHI	المؤسسة العمومية للبناء و الأشغال العمومية أم البواقي	Zone Industrielle - Route de Constantine, Ain Beida.	032 49 35 94	032 49 30 64		
1940	1	4	\N	EPGS		Cité 11 Décembre - Delly Brahim - Alger				
669	1	4	\N	SITIFIS AGREGATS		Cité Ouled Brahim n° 01 - Sétif	036 91 25 89			
1257	1	4	\N	SCBTB	أس.سي.بي.تي.بي	Route de Biskra, Barika, Batna	0660 303 355	033 89 32 92		
2426	1	4	\N	PRODAG 2000	بروداق 2000	N° 03 Zone Industrielle RN° 6, wilaya de Béchar.	0661 20 09 24 – 049 81 22 95	049 81 22 37		
2580	1	4	\N	BENBOUCHI EL HADJ & CIE	بن بوشي الحاج و اخرون	Ain Soltane n° 6, Baba Ali - W.Mascara	045 82 11 82	045 82 11 82		
2308	2	4	\N	BEDJAOUI & MAAMERI	بجاوي و معمري	N°1, Rue Kikaya Amar, Bp°39 RP, wilaya de Constantine	0772 101 602	031 52 92 90		
2642	1	4	\N	CARRIERE LA ROCHE MEZARA	محجرة لاروش مزارة	Rue Latoumi Belkheir n°14 (Ex. Dallas), Sétif	0560 58 89 22 / 0670 97 06 85			
2643	5	4	\N	MALEKITE SETIFIAN GRAVELPITS	المالكية للمحاجر السطايفية	Lemzara Djebel Youssef BP32, Guedjel, Sétif	035 68 93 62	035 68 93 62		
188	1	4	\N	BOUZAATAR	بوزعتر	15, Rue d'El Madjar W.Annaba	0770 92 94 74	037 49 27 62		
1196	1	4	\N	PROMACOCO	بروماكوكو	Bp 139, Tazdout, Gdyel, wilaya d’Oran.	0661 28 10 37	026 18 03 25		
2068	1	4	\N	SOCIETE GHOUILA LAKHDAR	شركة غويلة لخضر	Coop El Amel N° 1 Commune Belimour, W, Bordj Bou Arreridj,	0557 16 92 11	035 72 76 76		
703	1	4	\N	EREMNA		42, Hai Housn El Djiwar  - Bordj El Kiffan -   W.Alger	021 92 00 73	021 92 00 74	sarltitas@yahoo.fr	
3099	1	4	\N	AZRO AMENAGEMENT	أزرو للتهيئة	Rue Ali Seghir BT A Bordj El Kiffan W, Alger	0770 57 52 69	021 21 29 54		
2331	1	4	\N	BENBRAHIM EXTRACTION SABLE & GRAVIERS	بن ابراهيم لاستخراج الرمل و الحصى	Lotissement El M'Tal;Sidi El Medjini; Dellys; W.Boumerdes	029 70 06 96	029 70 63 66		
4103	3	4	\N	OULED SALEM DES TRAVAUX PUBLICS	آولاد سالم للأشغال العمومية	Abad Ezzine, Sect 123, Lottis 162, Commune de Cheria, wilaya de Tébessa	037 51 64 68 / 0550 07 77 13	037 51 64 68		
3740	5	4	\N	GRANU - EST	قرانو آست	Zone Industrielle le Palma, Bp° 88, cité Boussouf, Constantine	031 66 80 37	031 66 81 61	dggranuest@hotmail.fr	
3756	1	4	\N	BRIQUETERIE ZIBANE	مصنع الآجر للزيبان	Commune d’El Hadjeb, wilaya de Biskra	0550 61 41 12	032 22 38 07		
3920	1	4	\N	NEW MORTARS TECHNOLOGY	نيو مورتارس تكنولوجي	Village Ennakhla Labhayer, Hmmam Guergour, Sétif	05 60 17 77 66	036 80 45 57		
4036	1	4	\N	CHIBA CARRIERE	شيبة محجرة	N° 43 Route de Constantine, Commune Fesdis, Batna	05 50 45 94	033 80 80		
3625	12	4	\N	COOPERATIVE ARTISANALE EL KOUAMLIA	التعاونية الحرفية الكواملية	57, Rue de la Fontaine   W. Sidi Bel Abbes	048 59 15 34	048 59 15 34		
3855	5	4	\N	INFRARAIL		BP N°113 ZI BENI SAF - AIN TEMOUCHENT	021 85 46 10 / 021 85 64 00 / 021 85 50 93	021 85 44 65	dg@infrarail.dz	www.infrarail.dz#http://www.infrarail.dz#
4743	1	\N	\N	SARL ALGERIE ENVIRONNEMENT SERVICE AUX PUIT		Local N 1, Stade Communal N° 19, Hassi Messaoud	029783706	029783709		
4451	1	\N	\N	TINILAN LI ZAHAB	 تينيلان للذهب					
4792	\N	\N	\N	ROYAL CERAM		Ouled Zemmour, commune de Ouled Fadhel wilaya de Batna	033 22 22 22			
1298	1	4	\N	ENFA PLATRE	أونفا للجبس	Oum Ezzoubia - El Ouenas- (Dbadib)  W.Bouira	061 54 42 71			
1305	2	4	\N	KEBBICHE EXTRA PLATRE	EXTRA PLATRE كبيش	BP  N° 35 Guellal. W.Setif	0770 33 76 33 – 0661 77 77 73			
1853	3	4	\N	EL IDRISSIA EXTRACTION DE SABLE		48, Rue Patrice Lummba (41000) - W.Souk Ahras	071 61 12 66			
380	2	4	\N	CARRIERE BENISAAD & KERRICHE	محجرة بن يسعد و قريش	DjebelGrouz ,Commune de AIN MELOUK -MILA	0550 364 409			
381	1	4	\N	ZIKKI AGREGATS		BP 99 Bouzeguène centre ; TO				
1106	3	4	\N	AGGOUN EXTRACTION DE SABLE & GRAVIER	عقون لاستخراج الرمل و الحصى	BP n° 13 Sigus - Oum El Bouaghi				
1936	3	4	\N	SABLIERE EL KAOUTHAR	مرملة الكوثر	17, Rue Maammar Belkoudia - Oued Rhiou - W.Relizane	046 97 77 66			
1938	5	4	\N	SOEXAT / SOCIETE D'EXTRACTION D'AGREGATS		26, Rue El Djomhouria W.Chlef				
3246	1	4	\N	EL HENCHIR	الهنشير	Boulevard du 1er Novembre 54 Groupe Taghaste   W. Souk Ahras	0772 42 55 39	023 80 75 92		
2681	1	4	\N	SOCIETE SAHARA VENTE BRIQUE & TUILES		Lot Boushaki A n° 32 - Bab Ezzouar - W.Alger	021 74 45 32 / 070 89 48 59 / 070 44 28 21	021 74 45 32		
2682	1	4	\N	DISTRINET PHARMA	ديسترينت فارما	135, Cité bois des Cars, Dely Ibrahim - W.Alger	0661 68 72 38			
2683	1	4	\N	ALSKAN	السكان	Résidence Client A1-N°09 (Plaine Ouest), wilaya d'Annaba	0560 00 76 50 / 038 47 94 22	038 47 94 22		
231	5	4	\N	BATI OR	بناء وهران	N° 9 Route Djellat Habibi Es Sedikia - Oran	045 81 33 52	045 80 18 93		
2286	2	4	\N	RAMELIA BENFERHAT & ASSOCIES	الرميلية بن فرحات و شركائه	Dahmouni Centre Tiaret	046 44 26 32	046 44 20 54		
317	5	4	\N	SNVI / ENTREPRISE NATIONALE DES VEHICULES INDUSTRIELS	المؤسسة الوطنية للسـيارات الصناعية	SNVI - Division Fonderie : Voie "C" Zone Industrielle Rouiba / Reghaia BP 104, Rouiba - Alger.	021 81 27 77 / 021 81 27 82	021 81 20 91		
2527	1	4	\N	SOCIETE OULED BOURAS ENTREPRISES GENERALES	شركة أولاد بوراس للمقاولات العامة	Cité Rabia Taher Bloc A36 n°02 Bab Ezzouar, Alger	(213) 0550 802 996 / 0661 553 653	(213) 023 832 194		
2473	\N	4	\N	MAAMAR		Hai Echott W.El Oued	032 21 64 69	032 21 66 67		
1842	12	4	\N	OULED GHANEM	أولاد غانم	Boughzoul Centre - Médéa	025 63 51 95			
1844	2	4	\N	BENISAAD ABDELMADJID & ASSOCIE	بن يسعد عبد المجيد و شريكه	Cité Houari Boumedienne Chelghoum Laid - W.Mila	030 26 45 66 / 0770 42 65 60	031 52 48 19		
1706	2	4	\N	ALITI ACHOUR & ASSOCIES	عليطي عاشور و شركائه	Zone Industrielle - Amoucha - W.Sétif	0770 65 03 05			
160	3	4	\N	CARRIERE BOUCHAMI	محجرة بوشامي	Cité des 202 lots, 38 300 Mahdia, wilaya de Tiaret.	0554 94 86 62	040 73 16 53		
2674	1	4	\N	SAHEL	الساحل	Zone D'activité Ain Sfiha - W. Sétif	036 84 53 80 / 061 35 10 61	036 84 53 14		
2659	1	4	\N	EL DORSAF DES TRAVAUX PUBLICS	الدرصاف للاشغال العمومية	Rue Palestine - W. El Oued	070 55 30 55			
3666	1	4	\N	SOTRARBO / SOCIETE DE TRAVAUX ROUTIERS DE BOUIRA	سوتراربو	BP 64 Zone des parcs, W, Bouira	0661 69 30 20	026 93 49 93		
90	1	4	\N	ENTREPRISE DE FABRICATION & PRODUCTION DE TUILES ZEMMOURA	شركة الانتاج الصناعي لمنتجات الطين المقاوم زمورة	69, Route de Relizane, Zemmora  48155	046 96 22 07	046 96 34 93		
2556	1	4	\N	LOCA TERR	لوكاتر	BP 433 Zone industrielle - Hassi Messaoud - W.Ouarga.	029 73 04 81/82	029 75 04 83		
3312	1	4	\N	EL GHAITE POUR L'EXTRACTION D'AGREGATS ET DES MINERAUX ALLUVIONNAIRES	الغيث لاستخراج الحصى و المعادن الغرينية	Cité Tamenchit en Face 1272 Logts W, Batna	033 81 97 63	033 81 97 64		
1401	1	4	\N	DJEBEL EL BORDJ	جبل البرج	EL BELAILA-Chetouane W. Sidi Bel Abbès	0661 20 31 11	048 55 69 92		
2182	3	4	\N	CARRIERE DJEBEL BOUALEK	محجرة جبل بوعلاك	BP n° 405 - Souk Ahras	037 31 99 02	037 31 99 02		
2183	3	4	\N	CHERAITIA MABROUK	شرايطية مبروك	Ben Zeguib, Ouled Adouane - W.Setif				
2281	1	4	\N	TAOUAB	تـواب	Nouvelle route de Djelfa, Promotion Immobilière n°20, Bousaada, Wilaya de M'Sila	035 44 65 50	035 44 65 02		
2972	5	4	\N	ECDE / ENTREPRISE DES CIMENTS ET DERIVES D'ECH-CHELIFF	مؤسسة الاسمنت و مشتقاته بالشلف	Cité El Hamadia, BP 54, wilaya de Chlef  02000	027 77 84 08 /10	027 77 81 60	contact@ecde.dz	
3661	1	4	\N	CARRIERE MOSTEPHAOUI MUSTAPHA	محجرة مصطفاوي مصطفى	Cité Emir A,E,K N°20, Commune Daiera, W, Sétif	06 61 35 06 76			
3181	1	4	\N	EGEGRAN / ENTREPRISE GENERALE DE GRANULATS	المؤسسة العامة للملاط	Carriére EGECO, Sidi Zekri, Commune de Tiberkanine, Daira El Attaf, W, Ain Defla	021 36 32 69 / 0550 00 54 79	021 37 58 80		
4446	1	\N	\N	SANFAR TINCHI LITANKIB	سنفر تنشي للتنقيب					
3690	12	4	\N	COOPERATIVE ARTISANALE EL RAYANNE	التعاونية الحرفية الريان	Eriane , Commune de Sidi Ameur W. M'sila	0559 048 679	021 502 427		
2562	1	4	\N	CHIHANI MATERIAUX DE CONSTRUCTION	شيحاني لمواد البناء	Cité 17 Octobre, BP N° 15 - W. El Oued 39003	032 11 40 59/0661 38 50 55	032 11 40 61	contct@groupe-chihani.com	
1811	1	4	\N	HAUTS PLATEAUX AGREGATS	هو بلاطو اقريقي	18, Rue Emir Abdelkader - W.Sidi Bel Abbès	048 55 30 62/\n071 28 86 20	048 54 19 33		
3075	2	4	\N	ABDELAOUI ET CIE EXPLOITATION DE CARRIERE	شركة عبداللاوي و شركائه لاستغلال محجرة	Bir Labiod, Commune de Guidjel, wilaya de Sétif	0661 35 08 37	036 84 90 72		
3076	1	4	\N	MAHDJARET AMMARI ET ZAABAT	محجرة عماري و زعباط	Machtat Ain Zbira Commune de Ain Smara w/Constantine	061 30 09 54	037 21 67 21		
1295	3	4	\N	ETPBC OUMELLAL LOUNES	أو.تي.بي.بي.سي. اوملال الوناس	Village Ain Sebaou Baghlia W/Boumerdès	024 89 02 75\n071 14 12 04	024 89 01 73		
3045	1	4	\N	AURES AGREGATS	أوراس الحصى	Rue Safh El Djabel n° 10 - Tamechit - BATNA	066 61 19 50 / 0771 61 87 52	033 81 55 48		
1352	3	4	\N	LANFAD	لانفاد	Route Nationale 22C, Ouchba- Commune de Ain Fezza- Daïra de Chetouane - W.Tlemcen	043 28 57 39 / 061 22 11 49\n061 22 05 09			
1353	1	4	\N	CHAHRAOUI EXPLOITATION DES CARRIERES & CONSTRUCTION	شهراوي استغلال مقالع الحجر و البناء	Tagadoura, Tircine - Ouled Brahim, W.Saida	072 59 94 82	048 51 83 80		
2287	5	4	\N	EIT BOUGAA	مقاولة الأشغال ما بين البلديات بوقاعة	Rue du 11 Decembre 1960 BP 926 Setif	036 91 28 22	036 93 61 50		
1313	1	4	\N	CARRIERE EL FALAH	محجرة الفلاح	Djebel Mazela - Ain Abid - W.Constantine	032 40 24 77			
2925	1	4	\N	SAGREMAC	صاقريماك	Cité Souakria - BP n° 77 C - Meftah - W. Blida	025 45 63 23/0770 948 563	025 45 62 72		
3677	12	4	\N	COOPERATIVE ESSAKIA POUR L’EXPLOITATION DU SABLE	تعاونية الساقية لاستغلال الرمل	Coopérative Dar Echourti D11 Bir Khadem   W.Alger	0770 432 621			
4121	\N	\N	\N	KACEM EXPLOITATION DES CARRIERES		Centre ville bloc 05 n° 113 Messaad, Djelfa	0770 538 305			
4397	1	\N	\N	UNOSTONE ALGERIE	ا نو ستون الجزائر	Clos Sidi Yahia Chemin des Crêtes, Rue Hamdani Lahcen Bt (E) Hydra, wilaya d'Alger	023 82 20 13	023 82 20 13		
1272	3	4	\N	CARRIERE BELAHCENE SLIMANE	محجرة بلحسن سليمان	Les Lacs - W. Oum El Bouaghi	033 82 01 46	031 45 70 88		
2288	1	4	\N	SOCIETE EL HOURIA	شركة الحرية	Sidi Ali M’hamed, Commue de Harchoune,\r\nDaïra d’El Karimia, wilaya de Chlef	0550 31 95 96 / 0550 31 91 71	027 79 28 76		
362	3	4	\N	AGREGATS & SABLE DE L'EST	حصى رمال الشرق	114, Rue Meghlaoua, W,  Mila	061 33 85 72	031 57 56 98		
127	1	4	\N	SOB B		Omega Consult \r\n13Bis Route de Saint Charles Lot N° 52  Les Vergers  Bir Mourad Rais W. Alger				
3005	3	4	\N	BELHADI TUILERIE BRIQUETERIE BOUZEGZA	بلهادي للقرميد و صناعة الأجر بوزقزة	Rue des Frères Zenan Boudouaou - W.Boumerdès	024 84 30 07	024 84 37 37	btbbelhadi@yahoo.fr	
820	3	4	\N	CARRIERE LOUADI LAKHMISSI DE PRODUCTION D'AGREGATS & SABLE	محجرة العوادي خميسي لانتاج الحصى و الرمل	Boulevard Abattoir, Cité El Amel A - Ain Beida - W.Oum El Bouaghi				
822	1	4	\N	CARRIERE TUF TALAMALI	محجرة توف تلمالي	Cité EPLF Bt n° 05 App n° 07 - Tidjelabine - 35 490 - W.Boumerdès	024 82 14 60			
823	1	4	\N	CARRIERE LE MONT BLEU		04, Rue Bouakel Rabeh - Thénia - W.Boumerdès	061 53 77 41			
1714	1	4	\N	ETP BELLE VUE	مؤسسة الأشغال العمومية المنظر الجميل	N°37, Route de Chetouane Ain Defla  W. Tlemcen	043 28 61 71 / 061 22 08 07	043 28 64 82		
1160	1	4	\N	CARRIERE EL HOURIA BOUABSA & CIE	محجرة الحرية بوعبسة و شركائه	Cité Boulkharfane Ali - Ain Fakrouin - W.Oum El Bouaghi	0779 08 10 14	021 20 51 20		
2569	1	4	\N	SOCIETE EL HADJ MOUSSA IMPORT	شركة الحاج موسى للاستراد	BP N° 94 Magra - W.M'Sila	035 59 38 55	035 59 38 56		
2756	\N	4	\N	HOUARI						
443	1	4	\N	EL ISTIFTAH P.A.	الاســتفتـاح بـي.أ	Hai TAKBOU, MEDEA - WILAYA DE MEDEA	0666 10 42 20 – 0661 41 29 64	023 79 62 13		
4189	1	\N	\N	EL EKHWA AOUAICHIA MELANGE DE SABLE ET CIMENTS	شركة الإخوة عوايشية لخليط الرمل والإسمنت	Lotissement El Hayat n° 01, Commune d'Oum Ali, wilaya de Tébessa	0667 60 83 16			
1492	3	4	\N	ENTREPRISE TABARI		Lot 233 Cité 460 logements - W.Ouargla	032 20 15 41			
1894	1	4	\N	TRAVAUX PUBLICS & VENTE D'AGREGATS RAMLA	الأشغال العمومية و بيع الحصى رملة	Rue Principal Ibadia - W.Ain Dafla	027 63 92 45	027 63 80 27		
1402	5	4	\N	CAROSOL	CAROSOL	Zhun Us BP 4267 Ibn Rochd  W.Oran	041 42 96 31	041 42 96 32		
1403	12	4	\N	OULED RAHMOUNE	أولاد رحمون	Cité des 282 Logements N° 122   W.Tiaret 	046 42 97 86\n046 42 11 10	046 42 30 36		
1404	1	4	\N	BRIQUETERIE EL GHAZI	مصنع الاجر الغازي	BP 191 Rezaik- Commune Souahlia Ghazaouet  W. Tlemcen	043 26 46 31/\n043 32 05 61\n043 32 05 66	043 27 66 65		
983	1	4	\N	SETBD	للاشغال العمومية دحماني	Tazrout, Baghlia - W. Boumerdes	061 66 07 65	026 27 39 90		
567	1	4	\N	KOUDIET OUM ALI	كودية أم علي	Oum Ali  W.Tebessa	037 44 01 74 / 061 36 79 23			
1034	1	4	\N	LES FRERES AMMOURI	الاخوة عموري	Zone Industrielle n° 36 - BISKRA	033 75 41 40	033 75 41 42		
2065	3	4	\N	CARRIERE DJEBEL YOUCEF	محجرة جبل يوسف	LEMZARA SETIF	0661 359 519			
557	3	4	\N	EPCT	مؤسسة أشغال البناء	Rue Baoucha Boualem, Terga - W.Ain Temouchent	043.65.43.67	043.65.43.67		
438	3	4	\N	CARRIERE OULED LARBI BENBRAHIM HOCINE	محجرة أولاد العربي بن ابراهيم حسين	07, Rue Ramdani, Dellys - Boumerdès.	031 96 54 66	031 96 54 66		
3308	3	4	\N	AGREGATS HAMIDI	حصى حميدي	Cité Commandant Si Tarek N° 874, Ain Turk, W, Oran	07 74 62 39 07			
1849	5	4	\N	GE.CO / GENERALE ENTREPRISE DE CONSTANTINE	المؤسسة العامة بقسنطينة	Zone Industrielle Le Palma BP 437 - W.Constantine	031 66 83 30 / \n031 66 83  / 01\n031 66 83 06			
86	2	4	\N	FRERES LAKHDAR		Commune de Djerma-Daira El Madher  				
1247	5	4	\N	ETRS / ENTREPISE DES TRAVAUX ROUTIERS DE SOUK AHRAS	مؤسسة أشغال الطرقات سوق اهراس	Zone Industrielle Route de Annaba BP N° 335 (41000) W.Souk-Ahras	037 75 50 50	037 75 50 74		
1251	3	4	\N	ENTREPRISE NASR EXPLOITATION DES MINES	مؤسسة نصر لاستغلال المناجم	Ben Mabrouk Massaoud, Elhay Eldjadid Birelatter\r\nTebessa	037 44 70 05/ 062 07 88 81			
775	1	4	\N	CARRIERE OUED TASSA	محجرة واد تاسة	Oued Tassa - Commune de Ben Allel - Daira de Miliana - W. Ain Defla				
1139	1	4	\N	CORECTLOTO		Zone d'Activité BP 49 - Timimoun - W.Adrar	049 90 03 01\n061 27 52 20	049 90 43 50		
117	5	4	\N	EMIVAR / ENTREPRISE DE MISE EN VALEUR & D'AMENAGEMENT RURAL	مؤسسة الاستصلاح و التهيئة الريفية	EMIVAR -El Annasser, Ain Arnat - Sétif	036 84 55 12	03 84 53 55		
2056	12	4	\N	EL WAFFA	الوفــاء	Bouguezoul Centre - W.Médea	072 12 19 79			
430	1	4	\N	CARRIERE BOUKHLIFA	محجرة بوخليفة	Carrière Mariano, Ahmer El Ain, Tipaza	020 54 09 09	020 54 19 81		
235	5	4	\N	SOPLAT / SOCIETE DES PLATRES DE GRAREM GOUGA		Route de Mila BP 168 Grarem Gouga Mila	031 56 40 18	031 56 43 78		
3295	3	4	\N	EL FIRDAOUSSE	الفردوس	Cité El Othmania, Rue Géneral Nival, n° 69 - Oran\r\n69, Rue Hamamouche Abed, Oran	0771 392 077	046 41 31 67		
1046	2	4	\N	ESSAKIA	الساقية	Loled Mazouz, Collo - W. Skikda	038 71 71 82 / \n061 36 02 81	038 71 64 40		
2842	2	4	\N	STATION DE CONCASSAGE BAYZID AISSA & Cie	محطة تفتيت الحجرة بايزيد عيسى و شركائه	Cité des fonctionnaires, Route Djelfa-Bousaada. M'sila	0770 251 409 / 0666 370 259	035 52 52 42		
2843	1	4	\N	TRAVAUX AXE TCE	ترافوأكس تي.سي.أو	Coopérative imobiliére Iman Oued Tatarik Bt 6, n° 11 - BOUMERDES	050 96 17 59 / 090 19 16 40 / 061 41 50 78			
110	3	4	\N	SOCIETE BRIQUETERIE DE MILA	مؤسسة بريكاتري ميلة	BP N° 01 Mila	031 57 84 84	031 57 78 51		
3821	5	4	\N	SOMIFER	الشركة الجزائرية لمناجم الحديد	BP N° 122 rue amrani zone 02 tébessa	037 59 10 89 / 037 59 13 44	037 59 10 89 / 037 59 13 44		
3743	1	4	\N	CARRIERE BEN YAHIA AMMAR	محجرة بن يحي عمار	Cité El Boustene N° 325, wilaya de BATNA	033 86 66 46	033 86 66 46		
3560	12	4	\N	COOPERATIVE ARTISANALE BEN ALI	التعاونية الحرفية بن علي	Hai 800 Logements Bt 17,03  W. Boumerdes	0550 237 624			
3648	12	4	\N	COOPERATIVE ARTISANALE BIL KERDADA	التعاونية الحرفية بيل كردادة	Cité Houari Boumèdienne  N° 554/09 Bousaâda W. M'sila	0550 450 544			
2274	3	4	\N	GRABENOT	غرابينوت	Cité 154 logts / Sougueur/W- Tiaret.	0771 73 63 80	046 41 31 67		
3667	1	4	\N	EL HANIA D'AGREGATS	الهانية للحصى	Cité Filali Bt A n°16 - W. Constantine	05 50 44 75 27	036 84 60 52		
2590	1	4	\N	KANA AGREGATS	كانة للحصى	Cité Château entrée H, Zone 03 N°05, Medrissa, wilaya de Tiaret.	026 20 31 20			
172	3	4	\N	SOCIETE MANSOURI BRIQUE		03,Rue Boussahla Amor - Batna	033 86 20 60	033 86 20 60		
296	3	4	\N	EL FETH	الفتح	Commune d’Oued Lili, wilaya de Tiaret	0771 24 72 72	046 41 31 67		
1705	3	4	\N	BRIQUETERIE OULED NAIL	مصنع الأجور أولاد نايل	Kasem 81 Groupement Propriétaire N° 28, Commune El Outaya, w. BISKRA.	033 659 576	033 659 576	zianimed@wissal.dz/ bon_zm@yahoo,fr	
300	1	4	\N	GUELLAL PLATRE D'OR		Cité des 54 Logements Bt A3; Sétif 19000				
2479	\N	4	\N	BENBOUYA Mouloud		Cité Med Meziane n° 258 Bâtiment 2 Cage B W. Ain Temouchent.	043 60 44 53\n061 53 26 15	043 60 44 53		
1335	3	4	\N	CARRIERE SIDI ABDERAHMANE		Rue 20 Août - Djelida - BP 37 - W.Ain Defla	061 56 80 48	027 61 21 61		
1564	1	4	\N	SPMC / SOCIETE DE PRODUCTION DE MATERIAUX DE CONSTRUCTION	شركة انتاج مواد البناء	BP n° 05 - Temacine - Touggourt - Ouargla 30 230	029 63 31 40/41	029 63 40 20		
4472	1	\N	\N	TANINAIT TANKIB	تنينايت للتنقيب					
3540	1	4	\N	TBRHO FRERES ZERGOUNE	شركة الإخوة زرقون للبناء والآشغال العمومية	Zone d'activité el Makhazine, wilaya d’Ouargla	029 78 25 65 / 0661 50 84 75	029 78 25 66		
1643	1	4	\N	EL HIDAB	الهضاب	Djebel Grouz, Ain Melouk - W.Mila	0560 20 66 64	036 51 42 61		
2702	8	4	\N	ADE / ALGERIENNE DES EAUX	ا دي او - الجزائرية للمياه	03, Rue Cairo Kouba	021 28 31 14	021 28 19 64		
871	1	4	\N	CARRIERE OUHOUD	محجرة أحود	87 Cité Ezzouhour Villa Guerouache. Bordj Bou Arreridj, wilaya de Bordj Bou Arreridj.	0661 68 09 64	035 73 40 23	bourahlit@gmail,com	
874	1	4	\N	ENTREPRISE SALAH DE CONCASSAGE DE ROCHE		Bt B 12 - Sidi Amar - Tipaza	024 47 81 22	024 47 33 96		
875	3	4	\N	BRIQUETERIE ABDELKADER						
878	5	4	\N	SOFELD		31, Rue Mohamed Hattab Belfort El-Harrach W.Alger	021 52 52 43	021 52 52 43		
77	3	4	\N	CARRIERE MOSTEFAOUI SAID	محجرة مصطفاوي السعيد	Cité El Hadaik , Rue Keffi Azzouaoui  W. Sétif	036 84 31 33 / 075 99 77 65	036 84 60 52		
2242	5	4	\N	ENG / ENTREPRISE NATIONALE DES GRANULATS	المؤسسة الوطنية للحصى	Cité Administrative N° 135 Ouled Fayet - Alger	023 29 63 37-40	023 29 63 30-31		
2198	2	4	\N	CARRIERE MAZLA BENKAHOUL & CIE		Ain Melouk Chelghoum Laid W de Mila 				
2795	5	4	\N	STA / SOCIETE DES TRAVAUX DE ANNABA	شركةالاشغال بعنابة	Cité Safsaf 240 logements BP n° 132	038 51 77 13	038 51 79 12		
2441	1	4	\N	TECH.E.S.CO	شركة تقنيات الهندسة الحديثة و الخدمات	Cité 460 Logts BT A n° 4 - Ouargla	029 71 37 92			
2850	2	4	\N	GORI AHMED ET FRERES DES ENTREPRISES ET REALISATION	قعري أحمد و إخوانه للمقاولات و الإنجاز	Cite El Atike  Bir El Ater w/TEBESSA	037 44 69 60/061 36 80 23	037 44 62 09		
1020	3	4	\N	EL MOURAD AGREGATS	الحصى المراد	Cité du 20 Aout 1955 Lot N° 12  W.Setif\r\nRue, Mostapha Ben Boulaïd Chelghoum-laïd W.Mila	031 52 50 50 / 070 84 38 25	036 84 94 37		
1739	12	4	\N	FRERES BENAICHA	الاخوة بن عيشة	Boughzoul Centre - Médéa	025 63 52 05			
3463	3	4	\N	STTRH		08, Lotissemnt Ibn Toumert, Bir Khadem Alger	0552 34 65/ 0771 60 97 21			
1612	1	4	\N	SBZ / SOCIETE BRIQUETERIE LES ZIBAN	شركة الآجور للزيبان - أس.ب.ز	N° 02 M'Sid Vieux Biskra W/ Biskra	020 79 34 46	024 81 75 92		
1785	3	4	\N	GTDA	مجموعة نقل و توزيع الحصى	05,RUE LION DU BOIS - ANNABA	037 21 18 77/070 67 15 65	021388107		
2651	2	4	\N	HADJ KHELOUF & BEDJAOUI DES CARRIERES	حاج خلوف و بجاوي للمحاجر					
1821	3	4	\N	BENYAHIA CARRIERE	بن يحي محجرة	Cité Tamachit en face 1272 Logements, wilaya de Batna	0555 08 00 05 / 033 28 63 31	033 28 63 31		
1709	1	4	\N	GOLD AGREGATS		BP 210 Ouled Recheche 40332 W/Khenchela	032 33 88 13			
2597	1	4	\N	ARMIELIA	أرميلية	N° 12, Route Zeddigua - Amieur - W.Tlemcen	071 23 01 20 / 061 22 09 70			
466	1	4	\N	EL BARAKA AGREGATS		Cité le Camp Ain Touta Batna	033 83 77 76			
195	3	4	\N	CARRIERE CHETHOUNA AGREGATS		Rue N° 5 El Alia Nord Biskra	033 75 39 01	029 68 23 18		
469	3	4	\N	BOUARARA ABDELKADER	بوعرعارة عبد القادر	Lotissement Lardjene n° 06 - Saida	048 47 66 24	048 51 18 86		
2680	1	4	\N	GEBATRAP	GEBATRAP	BP A65 Ben Badis Ain Abid W.Constatntine	0770 63 29 11	031 41 01 80		
1451	1	4	\N	EL FOURAT EL MACHROUBAT		Bir El Djir , Lots 57 - Lotissement 83 - W.Oran	061 20 52 27\n041 39 01 12			
1452	1	4	\N	ROSA CERAM	روزا سيرام	43, ZI Ben Boulaid - Blida	025 39 28 69	025 39 28 69 / 025 31 13 22	rosaceram@yahoo.fr	
1382	3	4	\N	CARRIERE EL HANA	محجرة الهناء	Oued El Aneb -Berrahal-  W.Annaba	061 63 04 24	0550 553 615		
1140	3	4	\N	CARRIERE EZAKA BENAMEUR	محجرة إزاكا بن عامر	Cité 144 Logts "saada" Tolga W/ Biskra	033 78 75 56	033 78 75 56		
1210	1	4	\N	OULED RECHACHE DE PRODUCTION DE SABLE	اولاد رشاش لانتاج الرمل	Cité 414 Logements Bloc 19/4  W. Tebessa	037 49 17 61	037 49 17 61		
1573	1	4	\N	TITA MOHAMED HAFED & HABIB SID ALI NABIL						
442	1	4	\N	SPMCTG	أس.بي.أم.ستجي	60, Rue du 05 Juillet, Merad - W.Tipaza	0550 590 212	021 31 06 05		
3212	5	4	\N	BENLABIOD & CIE TRAVAUX	بن الابيض و شركائه للاشغال	Cité Guenani Bt 183 N° 03, W, Djelfa	0560 103 636 / 0676 706 969	027 91 41 91		
2915	1	4	\N	FILS AMOURI MOHAMED EL HADI TRAVAUX DE ROUTE	ابناء عموري محمد الهادي للاشغال الطرق	HAI MAKOUDI 01, LOT N°120, LOCAL D, OUED SEMAR, ALGER	023 75 72 35	032 21 76 09		
2029	3	4	\N	GRANITEMPLE TIFRIT	قرانيت أوميل تيفريت	73, Rue Belkacem El Ouzri BP 68 Cedex 01W.Blida	 0551 94 37 01	025 40 70 34		
2031	3	4	\N	LA GRANDE SABLIERE DE BOUSAADA	المرملة الكبيرة لبوسعادة	Baniou Commune El Maarif, Daïra El Chellal - W.M'Sila	070 50 14 57	035 57 32 03		
334	1	4	\N	AGREGATS DE L'EST	حصى الشرق	Djebel Grouz, commune de Chelgoum Laid w. Mila	0553 86 46 13			
519	1	4	\N	OUEST MINES	مناجم الغرب	Rue Benahmed Ali n° 7, Mouzaïa - BLIDA	025 44 52 56 / 0771 35 44 84	025 44 50 39		
2908	1	4	\N	COMPOSIUM SANIT	كمبوزيوم صانيت	Cité  Ennadjah Tour A n°34 Bir, Bp ° 360, Bir Mourad Rais, wilaya d'Alger	0770 93 02 31	021 54 02 94		
552	1	4	\N	CHILIA AGREGATS & SABLE	شيليا للحصى و الرمل	BP 01 Lambardi Oued Chaaba BATNA	0774 35 22 88	032 92 41 36		
3241	1	4	\N	HIBER ART DES MINES	حيبر لفن المناجم	05,Rue Smati Bachir 1 er Novembre 54 W.Sétif	06 61 35 09 57	036 93 90 02		
3173	3	4	\N	CARRIERE BOUHLAIS BOUBEKEUR	محجرة بوحلايس بوبكر	DJEBEL MEIMEL , AIN M'LILA , W:OUM EL BOUAGHI	0661 30 29 47			
465	1	4	\N	BOULMERKA NOUAR D'EXPLOITATION DE CARRIERE	بولمرقة نوار لاستغلال المحاجر	05, Rue Jerusalem Mila	031 57 36 06        0661 37 06 19	031 57 36 06		
28	3	4	\N	NOUIOUA KAMEL STATION DE CONCASSAGE	نويوة كمال محطة تحجير	Poste d'El Annasser BP N° 05 BBA 34000	035 68 51 71	035 68 51 71		
665	2	4	\N	REDDAF SMAIL & CIE	شركة انتاج الحصى رداف اسماعيل و شركائه	BP N° 173 El Eulma  W. Sétif	061 35 03 02			
3231	3	4	\N	SADOUDI HAYDAR - ETPLMR	 سعدودي حيدر للأشغال العمومية و الري و اشغال البناء وكراء معدات الطرق	Hai Essalem, Avenue Hakim Saadane - Biskra	0661 37 42 69	033 54 62 37		
2310	3	4	\N	ACHCHI TRAVAUX & SERVICES	عشي للأشغال و الخدمات	BP 366 - El Oued\r\nEzzekm ,Commune Hessani Abdelkrim - W.El Oued	070 81 32 20 / 032 26 31 19	032 26 19 31		
570	3	4	\N	EBAG	مؤسسة الخرسانة و الحصى	Route De Sidi M'Hamed Benaouda W.Relizane.	046 91 37 79			
227	5	4	\N	EPMC / ENTREPRISE DE PRODUCTION DES MATERIAUX DE CONSTRUCTION	مؤسسة انتاج مواد البناء لتمنراست	Guettara El Oued BP 1027, commune de Tamanrasset, W Tamanrasset	029 32 50 19	029 32 55 27	epmc.divindus@epmc.dz	
1110	1	4	\N	TRACE	طراس	Gdyel - Zone des carriéres - BP 83, W, Oran	040 20 82 62	040 20 81 17 /041 48 38 78		
2531	1	4	\N	EL AKHOUA	الأخوة	Route Hammam Melouane, Bougara - W.Blida\r\nCité les Bananiers, Batiment n° 33 - Blida	070 33 16 13			
194	5	4	\N	ENTREPRISE DE REALISATION DE BISKRA	مؤسسة الانجاز لبسكرة	BP 71 Star Melouk Biskra	033 74 06 56 / 071 98 61 83	033 74 06 56		
1609	1	4	\N	SABLIERE HAMED EXTRACTION DE SABLE	مرملة حامد لاستخراج الرمل	Agence Poste El houidjebet Daîra El Malabiad W.Tebessa	0663 585 334			
1326	1	4	\N	BOUAKAZ & CIE CARRIERE & ENTREPRISE DE TRAVAUX PUBLICS	بوعكاز و شركائه للمحجرة و مقاولة الأشغال العمومية	Cooperative immobilière -El Hana- Cité Benzid Ahmed lot 06 - W. Setif	061 55 07 87\n071 39 33 61	036 93 88 94		
1327	2	4	\N	CONCASSAGE DE ROCHE TAIHI MILOUD & ASSOCIE	تكسير الحجر تايهي ميلود و شريكه	Cité El Bousten - Cheffa - Blida	025 58 52 11 / 074 11 76 49			
1329	1	4	\N	CHULUS		7, Rue Mokhtar Adel -Hussein Dey- W.Alger				
1816	3	4	\N	EL MOURDJANE		Cité Bouhdid BP N° 2 W/Annaba				
2063	1	4	\N	EL AOUNE HYDRAULIQUE & CONSTRUCTION & TRAVAUX PUBLICS	العون للري و البناء و الأشغال العمومية	BP 03 Beni Thour Ouargla				
2157	1	4	\N	SOMALOC SUD	صومالوك جنوب	Touggourt W de Ouargla	029 69 67 56\n032 21 92 76	 032 21 76 09		
346	\N	4	\N	APC AIN EL KEBIRA		APC Aïn El Kebira; Fillaoucène; Tlemcen	043 22 65 36			
1406	1	4	\N	CARRIERE DE SABLE DRAA ESSAREG	مقلع الرمل دراع السارق	Commune D'oum Ali W.Tebessa	0699 21 06 43	037 44 01 58		
2406	3	4	\N	GHODBANE DES TRAVAUX ROUTIERS & AEROPORTS	شركة غضبان لاشغال الطرق و المطارات	2, Route Ain El Bey - Cité Kheznadar Abderrahmane - W.Constantine	0770 313 553	030 20 06 00		
2543	3	4	\N	CHOHRA LARAB PRODUCTION INDUSTRIELLE	شهرة لراب للانتاج الصناعي	Lotissement 49, Lot n° 44 Rebahia - W.Saida.\r\nBP 163 RP - W.Saida.	061 23 60 86 / 048 47 52 94	048 47 52 96		
500	1	4	\N	SIV / SOCIETE INDUSTRIELLE DU VERRE	الشركة الصناعية للزجاج	ZI Ain Oussera 17200; Djelfa	027 82 18 22\n027 82 62 00\n027 82 40 59\n027 63 80 8	027 82 18 22		
2123	3	4	\N	GUESMIA D'EXTRACTION & PREPARATION DE GYPSE	قسمية لاستخراج و تحضير الجبس	Anser Chougui Dehamcha, wilaya de Sétif	0770 95 29 99 – 0771 68 41 30			
2948	3	4	\N	BELGHAZI TP	بلغازي للاشغال العمومية	Hay Inara 200 Logements n° 89 w/Béchar	049 87 97 30	049 87 99 67		
2949	1	4	\N	EL IKHLAS REALISATION	الإخلاص إنجاز	Rue Taleb Mohamed, w,Bechar	0661 26 31 26 / 049 83 71 60	049 83 71 60		
766	3	4	\N	TABETI BOULENOUAR		Zediga Amieur    W.Tlemcen	0770 31 07 01	043 27 06 27		
1320	3	4	\N	CARRIERE BOUSSAID ABDELAZIZ	محجرة بوسعيد عبد العزيز	Djebel Loussait - Ain Fakroun - W.Oum El Bouaghi				
1142	1	4	\N	CARRIERE LES FRERES ZEHTANI		54, Avenue Harchi Slimane S.M.K  W.Constantine	061 30 14 16			
1839	2	4	\N	EL BARAKA AFIF & OUARTANI	البركة عفيف و ورتاني	6, Rue Ouarti Abderrahmane - W.Souk Ahras	037 31 83 03			
1759	1	4	\N	EST MC	است امسي	BP 177 Djebel Mazla Commune Aïn Abid w.Constantine	031 66 56 83\n031 66 55 31	031 66 56 83		
3782	1	4	\N	ASSIBAT	اسيبات	BP 5014, Ankouf - 11000 - Tamanrasset	0661 142 551	029 34 69 19		
3415	1	4	\N	EPR BEN RAHMOUNE	مؤسسة المواد الحمراء بن رحمون	Cité Benrahmoun , Corso  W. Boumerdes	024 84 02 46/48	024 84 02 47	epr.benrahmoune@hotmail.com	
4310	1	\N	\N	BATIROUTE REALISATION	باتي روت رياليزاسيون	Cité Kouba, Bt A N°11, Annaba	038 87 71 76	038 87 71 76		
1481	3	4	\N	BRIQUETERIE HADJ ALI	مصنع الاجر حاج علي	74 Rue des frères Djillali, Birkhadem, W, Alger	0559 44 64 20			
495	2	4	\N	MGCC						
1699	1	4	\N	GIPAR	جيبار	Zone Industrielle, Route M’sila, Bordj Bou Arreridj.	035 64 12 95	035 64 16 00		
2862	14	44	\N	CGC OVERSEAS CONSTRUCTION CO.LTD AND NORTH CHINA GEOLOGICAL EXPLORING BUREAU		Cité Krim Blekacem, ilot 28, n° 02 Dar El Beida - Alger.\r\n11/F, Tower A, SINOSTEEL PLAZA, 8 HAIDIAN DA JIE, HAIDIAN DISTRICT BEIJING CHINA 100080	021 50 54 65 / 078 24 25 80 / 010-82783266-136	021 50 59 05 / 010-82890667		
474	1	4	\N	CARRIERE LA PIERRE BLEUE	محجرة الحجرة الزرقاء	N°1, Coopérative El Rochd, Kouba, wilaya d’Alger	024 91 39 80			
1304	2	4	\N	KHELALFA & CIE		Ain Tinn - Commune de Foum Toub -  W. Batna				
2239	3	4	\N	ENTREPRISE EL HANCHIR	مؤسسة الهنشير	Rue 1er Novembre Souk Ahras	075 35 60 45			
152	5	4	\N	ENTHE / ENTREPRISE DE TRAVAUX HAOUED EL HAMRA	مؤسسة اشغال حوض البيض	PB 26 Hasnaoui Said El Bayadh	049 71 46 02	049 71 47 85		
901	1	4	\N	SECAY / SOCIETE D'EXTRACTION & CONCASSAGE YAZROU	شركة استخراج و تفتيت مواد الملاط ليازرو "سكاي"	Cité de la Mosquée Meurad - Tipaza	024 49 14 21	025 40 06 24		
331	1	4	\N	CARRIERE D'OR	المحجرة الذهبية	Djebel Oum Settas  Ben Badis  El Haria	061 35 11 79	031 66 81 48		
2738	2	4	\N	BOUHAMOU FRERES DES TRAVAUX	بوحمو اخوة للاشغال	Rue, Kadour Blitim - W.Adrar	0661 27 50 70 / 0661 275 066	049 96 95 44	touatbouhamou@yahoo.fr	
2739	3	4	\N	TRAVEM	ترافم	Cité Brahim Mazali N°9 Chlef	027 77 90 58	027 77 90 58		
3010	1	4	\N	CARRIERE ZIANE CHERIF ET FILS	محجرة زيان شريف و ابنائه	RN 26-Guendouza-Akbou-w,Béjaia	0770 37 89 60	034 31 33 07	carriere,ziane_bba@yahoo,com	
2811	3	4	\N	ETTR MONT BLEU	أو.تي.تي.أر مون بلو	Village Tala Moumen, commune de Béni Djelli -W.Béjaia	0790 54 27 14	023 26 61 77		
2204	3	4	\N	EXTRA TUF	اكستراتوف	Cité 800 logts BT 17 N° 3 - Boumerdès	070 18 33 67			
391	\N	4	\N	APC GHASSIRA	بلدية غسيرة	APC Ghassira Daira t'Kout Batna	033 86 92 74	033 86 92 74		
1887	1	4	\N	TRAVAUX 2000		N° 130 H - Zone Industrielle - W.Sidi Bel Abbès - 22002	048 57 80 52	043 60 66 25		
14	7	4	\N	ENITRO BBA	مؤسسة المنشأت و أشغال الطرق لولاية برج بوعريريج	Zone Industrielle BBA	035 68 80 78	035 68 84 57		
16	3	4	\N	ENTREPRISE SOUYAD ABDELKRIM	سويعد عبد الكريم	Djebel Cheikh Zouaoui, Ibn Ziad, Constantine				
17	5	4	\N	GROUPE ENAVA	المجمع الصناعي للزجاج و المواد الكاشطة	ENAVA , USTO BP 4062 ; Oran	041 42 96 12	041 42 96 17		
54	3	4	\N	CARRIERE ZEDIM	محجرة زديم	Rue 01 Novembre 54, Commune Ras El Oued, wilaya de Bordj Bou Arreridj	0558 62 15 51	036743048		
139	1	4	\N	ISSAADI ABDALLAH & FILS	اسعادي عبد الله و اولاده	Cité 500 Logts BT 07, BP n°75, SATIF	0550 845 446			
140	1	4	\N	SOCIETE BRIQUETERIE ADRAR		41, Rue Merzougui Gourichi - Adrar 	049 96 43 79	049 96 44 01		
34	3	4	\N	AFGHLAD EXPLOITATION DE CARRIERES DE PIERRE DE CONSTRUCTION						
197	3	4	\N	CARRIERE BOUHRAOUA	محجرة بوهراوة	Bir N'Has Commune El Attaf- Ain Defla	027 63 80 27	027 63 92 45		
1779	1	4	\N	GEMAG	جيماق	Zone Industrielle Ain Smara BP 154/B (25140) W.Constantine	031 81 83 61 / 0661 30 79 55	031 63 25 53		
445	5	4	\N	GEO PROM	مؤسسة الانجازات العامة و الترقية	26 Boulvard Adda Benaouda  Oran	041 40 11 76	041 40 83 03		
179	1	4	\N	BRIQUETERIE BEN AZZOUZ	مصنع الأجر بن عزوز	RN 44, Boumaïza; Ben Azzouz - Skikda	038 97 35 37	038 97 35 37		
1831	1	4	\N	AGREGAL	أقريقال	Promotion AFRITAM, entrée D-1, 1er 2tage, Ain abdellah, Boumerdes	024943295	024943294		
1213	2	4	\N	BENFADEL & AGGOUN	بن فاضل و عقون	Djebel Karkara - Ibn-Ziad - W.Constantine	031 66 56 83			
121	3	4	\N	CARRIERE BELARBI AOMAR	محجرة بلعربي أعمر	Carrière d'agrégats Tizi Ouchir - Ain Torqui - W.Ain Defla				
2474	\N	4	\N	GHORZI Boucif		32, Rue Larbi Ben M'Hidi Remchi W.Telmcen.	043 24 97 96\n061 20 06 19	041 50 41 23		
2475	\N	4	\N	BENMEZIANE Mohamed		Cité 800 logements Bloc n° 10 Porte n° 06 - Berouaghia - W.Médea	061 62 66 45			
2476	\N	4	\N	ZIDANE Chafik	زيدان شفيق	Village de Drablia, Commune Bouderbala, Daïra de Lakhdaria - W.Bouira				
3655	2	4	\N	CARRIERE EL AMANE RAYEH MOHAMED LAMINE ET CIE	محجرة الامان رايح محمد لمين و شركاؤه	Djebel Mezla Bounouara Commune de ouled Rahmoune, W, Constantine	07 70 88 87 40			
2952	3	4	\N	ENTREPRISE DE TRAVAUX ROUTIERS SAHARIENS	مؤسسة الاشغال الطرق الصحراوية	Hai Bounaâma Djillali W. Blida	0661 612 381	025 21 11 68		
605	3	4	\N	KACIRA		Commune de Taourirt W.Bouira				
234	3	4	\N	EL HAMRI		03,Rue des Puits Souk Ahras 	061 39 00 40			
1976	3	4	\N	CARRIERE MOSTEFAOUI MUSTAPHA	محجرة مصطفاوي مصطفي	Commune Ain Lahdjar W.Sétif				
1430	3	4	\N	CARRIERE SIDI ABDELLI	محجرة سيدى العبدلي	Zediga, Sidi Abdelli 13 000. W.Tlemcen	070 52 04 82			
433	1	4	\N	SABRAT	صبرات	Hai El Wiaam, lieu dit 49 pos, 592 logements sociaux, participatif N°3, Ilot E10, Bir El Djir, w- Oran	0558 45 17 02 – 041 53 44 53	040 22 08 21		
434	1	4	\N	SABTP / SOCIETE D'AGREGATS POUR BATIMENT & TRAVAUX PUBLICS	شركة الحصى للبناء و الاشغال العمومية	El Mohguéné Parcelle 128 Arzew Oran	0659 639 522/0542 084 433			
436	1	4	\N	SCAD / STATION DE CONCASSAGE DES AGREGATS DU DJURDJURA	محطة تفتيت الحصى لجرجرة	Village Souk Elhad Commune D’illilten. W. TIZI OUZOU	0550 281 855			
2894	1	4	\N	BEDJASTAR	بيجاستار	Mouilha bloc 2 lot N°202 Ouled Moussa ,BOUMERDES	0770 61 71 67	046 49 38 30		
3063	3	4	\N	MOPROS	مومن لا نتاج السميد	Sidi Khouiled Bp N° 10 W,OUARGLA	07 70 57 09 13	029 72 12 12		
2610	1	4	\N	DAFRI ADEL & ZINEDDINE IMPORT EXPORT	شركة ضافري عادل و زين الدين للاستراد و التصدير	Cité La garre, Ain El Fakroune - W.Oum El Bouaghi.	0550 45 10 88		ourkais@yahoo.fr	
902	1	4	\N	BRIQUETERIE TAMGOUT	مصنع الأجور تامقوط	Taourirt Daïra de Michedallah W.Bouira	026 95 47 70\n061 62 05 89	026 95 47 70	Tamgout@Caramail.Com	
962	1	4	\N	SABLIERE SANHADJA		Sité Mechtel El Khamamra Commune Ben Azouz W.Skikda	038 73 03 58\n070 52 31 71	038 73 03 58		
1583	1	4	\N	BRIQUETERIE EL OUARSENIS RAHMOUNE & FILS	رحمون و أبنائه مصنع الأجر الورسنيس	Zone Industrielle -Oued Sly- W.Chlef.	027 71 09 98 / \n027 71 09 57	027 71 09 66	briqueterieouarsenis@yahoo.com	
35	\N	4	\N	APC SIDI RACHED		Siege APC Sidi Rachid 	024 42 64 74	024 42 61 04		
378	3	4	\N	SIARI SAID CARRIERE	سياري السعيد للمحجرة	Rue Dhili Salah N° 49 Mila				
2356	1	4	\N	NAOUI DES TRAVAUX PUBLICS	نوي للأشغال العمومية	Cité Saadat Bloc 325 n° 55 - Djelfa	027 87 10 64	027 87 10 64		
1935	3	4	\N	CARRIERE RIYAH RAMDANE		11, Rue Merabet Khoudir Sidi Mabrouk W.Constantine	031 62 17 64\n070 88 87 40			
4278	1	\N	\N	SAHM EL DJANOUB	سهم الجنوب	Local N°02, Cité Moussani parcelle N°21, Proprièté N°24, commune et wilaya de Tindouf	0663 56 51 44		AMOULAY111@GMAIL.COM	
1700	1	4	\N	BRITEC	بريتك	Centre ali  Bouhadja, Daïra de Bir Touta - W.Alger	020 37 52 52	023 59 31 17		
444	1	4	\N	CSA / SIDI ARAB		BP 263  Didouche Mourad Constantine				
1786	3	4	\N	SABLIERE GHEDDADA SLIMANE		Cité des Orangers  Bt 4  Appt N° 7  Boufarik  W. Blida	025 47 18 80	025 47 18 42		
3159	2	4	\N	GRANDS TRAVAUX PUBLICS & HYDRAULIQUES ZOUAOUI LAMRI & ASSOCIES	الأشغال العمومية الكبري و الري زواوي العمري و شركائه	Cité Gaoua, Kaabouba , section 07 GP 393,Sétif.	036 84 56 57	0771 80 58 14		
1551	1	4	\N	IFKER STAR		BP 70 - Ain Fakroune - W.Oum El Bouaghi	061 37 89 42	032 40 11 49		
554	1	4	\N	CARRIERE DJEBEL EL MAIDA	محجرة جبل المايدة	Route Nationale N° 06 Sidi Boubkeur W. Saida	078 88 94 40			
1730	1	4	\N	BRIQUETERIE NAAMA	بريكتري النعمة	Local n°02, Zone d’activité  et de Stockage Ain Tesra, wilaya de Bordj Bou Arreridj	035 62 62 10 / 0561 63 74 48	035 62 61 53		
695	3	4	\N	ENTREPRISE PLATRE NADOR	مؤسسة جبس الناضور	Cité Kahli Mohamed Tahar N° 03 - Oued Zenati - W.Guelma	0552410030			
360	3	4	\N	ZIRAR	زرار	25 Cite Zedigua; Commune de Amieur; Tlemcen	0774 294 595			
113	3	4	\N	BOUNADJI CARRIERE	بوناجي للمحاجر	Rue Saâdeli Mohamed N° 07  Cité des Amandiers El Bayadh				
422	1	4	\N	BOUYAKHTHAN		Banque Centrale Algerienne -BCA- Khenchela	032 32 60 30			
3670	3	4	\N	LDM GUENADIZ	ل د م قناديز	Ao 3 Route de Ghazaouet chez hamzi bouzid à tounane souahlia, w, Tlemcen	06 61 24 33 63	024 87 18 51		
2860	1	4	\N	SOSIGEM	صوصيجام	11, Rue Larbi Ben M'hidi w/Souk Ahras	061 39 42 43			
2385	3	4	\N	CARRIERES BOUKHARI	محاجر بوخاري	Zone Indistrielle Blida / Ouzera Centre - W.Médea	070 33 91 32 / 061 62 62 05 / 025 59 71 60	025 42 70 26		
734	1	4	\N	SPECTRAL / SPECIAL TRANSPORT LAOUNI		Route de l'aéroport  BP 1219  - Hassi Messaoud -   W. Ouargla	029 73 04 93 / \n029 73 04 95	029 73 05 19		
1628	3	4	\N	EGREB	إغراب	Tizghanit N°21 Bat-B, commune de Beni Mester, Mansourah w.Tlemcen	05 56 14 91 83			
1817	1	4	\N	GRAVEM	قرافم	Douar Agredj Abdellah, Tizi Ouatou, Melbou - Souk El Tenine - W.Bejaia	0661 350 329	036 72 96 80		
3355	1	4	\N	SOCIETE G.A LILHASSA	شركة جي ,أ , للحصى	lotissement, 924 lot n°01 ,M'SILA	0664 90 71 21 / 0555 82 83 21 /0661 21 25 30	035 54 63 05		
2212	4	75	\N	TSO		28, Rue Timcad Hydra Alger 16035	021 69 14 74	021 69 14 76		
214	5	4	\N	SOPROMAT	شركة انتاج مواد الباء لولاية تيبازة	Route de Fouka Koléa w/Tipaza	024 48 40 03	024 48 35 95		
3043	1	4	\N	CERAMIQUE BOUMERDES	سيراميك بومرداس	BP 331 Zone industrielle ISSER ROUTE TIMEZRIT - BOUMERDES	024 88 18 30	024 81 51 93		
2757	3	4	\N	ENCOTRAB AKBOU	المؤسسة البلدية لأشغال العمارات - أقبو	Route du Piton, BP N° 75 A - Akbou - W.Bejaia	034 35 86 00 /  034 35 55 58	034 35 86 01		
2758	2	4	\N	VOLT DRIVING SAIGHI & CIE	فولت دريفينق سايغي و شركائه	Villa 79, Bd de l'indépendance - W.Boumerdes	061 34 73 26 / 061 22 44 04	024 81 47 91		
1676	1	4	\N	SO.CO.TRAGS / SOCIETE DE CONSTRUCTION & TRAVAUX DU GRAND SUD	شركة البناء و الأشغال للجنوب الكبير	Rue Larbi ben M'hidi  n° 16   - W.Adrar	049 96 08 39	049 96 48 12		
1789	3	4	\N	ENTREPRISE SOUKHOUR EL WAHAT EXPLOITATION DE MINES	مؤسسة صخور الواحات لإستغلال المناجم	03, Rue du 1er Novembre, Ouled Djellal - W. Biskra	033 76 22 04 / 077 03 46 28	035 54 76 52		
598	1	4	\N	SACTP	الشركة الجزائرية للمحاجر و الأشغال العمومية	4, Rue du Sergent Block El- Makkari W.Oran	041 48 26 43	041 48 26 43		
602	5	4	\N	EPRO - GIC / Entreprise des Produits Rouges de l'Ouest - Groupe Industriel et Commercial -	مؤسسة المواد الحمراء للغرب - المجمع الصناعي و التجاري	Zone Industrielle Siéges Us W.Oran.	041 34 58 33	041 33 94 91		
353	1	4	\N	SIDI BAKOU	سيدي بكو	El Mehir 34200 BBA	061 51 00 52			
725	1	4	\N	SBL		Oued Serrag de Djemila BP 135 - El Eulma - W.Setif	036 86 62 60\n036 86 47 07	036 86 42 48		
2723	3	4	\N	CARRIERE OULED BOUGHADOU	محجرة أولاد بوغدو	Cité Ibn Khaldoun, BP 6 - Tiaret				
136	2	4	\N	SOCIETE BOUAICHA MOHAMED & FILS DES TRAVAUX PUBLICS	شركة بوعائشة و ابناؤه للأشغال العمومية	Rue El Qods, Cité Boumreifeg - Ain Sefra - Wilaya de Naâma	049 76 13 46 / 049 76 58 39	049 76 58 39		
3001	1	4	\N	GROUP SWIFT INVESTEMENT	مجمع سويفت للاستثمار	Fraction 66 part n° 16 n°29 Oum El Drou Chlef	: 0551458537			
1820	1	4	\N	MACTELL	ماكتال	BP N°61 E Sour El-Ghozlane,	026 76 31 31 / 32 32	026 76 33 22		
3042	3	4	\N	UPR / UNITE DE PRODUITS ROUGES	أو.بي.ار	Fesdis El Madher - BATNA, 02, Rue Grine Belgacem - Batna	033 80 70 91 / 033 86 42 10	033 80 70 75 / 033 86 24 02		
3320	3	4	\N	ETRG / ENTREPRISE DES TRAVAUX ROUTIERS GUELMA	مؤسسة أشغال الطرق قالمة	Rue de Constantine, Bp 192 W, Guelma	037 21 67 21	037 21 67 21		
3323	1	4	\N	CONCAMAS	كونكماس	02, Rue Berahou Djillali W, Mascara	045 81 33 55	045 81 33 55		
1511	1	4	\N	AGS	ا جي السوق	Tounane -Souahlia, Daïra de Ghazaouet W.Tlemcen	043 32 01 45\n021 55 30 39			
1030	1	4	\N	SABLIERE ETOUMIAT		Rue Ben Ghars Ellah Commune et Daira de Skikda W.Skikda	038 79 82 26	038 73 14 57		
572	3	4	\N	SPAB	شركة إنتاج الحصى و الخرسانة	Route de Sidi Marouf -Bir Djir -W.Oran	040 22 97 31	040 22 96 69		
420	2	4	\N	YOUCEF ACHIRA & FILS	يوسف عشيرة و ابنائه	BP 62 El Karimia - Chlef	027 70 91 61			
539	1	4	\N	ECHARIFINE MATERIAUX DE CONSTRUCTION		42 Avenue Oued H'mimim Khroub	031 93 77 89			
542	1	4	\N	ESSEKHRA EZERKA MIMAL	الصخرة الزرقاء ميمال	45 Cité Communale Ain M'Lila Oum El Bouaghi	032 44 07 64			
3093	1	4	\N	RoCaAL	روكال الأحجار الطبيعية الجزائر	10,Rue de la Palastine ex Mogador Sidi Bel Abbes	048 54 98 98	048 54 98 98		
364	1	4	\N	INFRA ROUTES		BP 479 Hassi Messaoud	029 73 80 00	029 73 80 18		
1991	1	4	\N	BOUSTIL RABAH	بوسطيل رابـح	Oueld Mazouz - Collo - Skikda	0558 97 63 70 / 0550 43 86 13	038 71 64 40		
702	3	4	\N	YATHRIB	يثرب	Lchlak Houcine - Sigus -  W.Oum El Bouaghi	0662 16 23 93/0553 42 70 89			
2998	1	4	\N	S.V.I.S	شركة استيراد و بيع قطع غيار الشاحنات	Route de ghardaia zone industrielle  BP 63 W, Ouargla	0661 38 53 10	036 74 30 48		
3564	12	4	\N	COOPERATIVE ARTISANALE ESSIDK	التعاونية الحرفية الصدق	Commune de Madena W. Tiaret				
427	5	4	\N	ENASEL	المؤسسة الوطنية للملح	BP 69, Commune d’Oued El Djemaa, w - Relizane.	031 66 43 39	031 66 48 84 / 031 66 48 85		
1912	1	4	\N	SATRECH BENBRAHIM	ساتراك بن ابراهيم	30 Villas Sahariennes, Chetti El Ouaker, Bp° 430 Rp, wilaya d’Ouargla	029 70 06 96	029 70 63 66		
3701	1	4	\N	MINALEX	مينالكس	N° 07 Route de Ouled Belhadj, Villa 07/6305 Saoula, W, Alger	0661 68 72 38			
1109	3	4	\N	DJENANE ABDELAZIZ GRAVIER & SABLE		Cité Communal N° 2 - Ain M'Lila - W.Oum El Bouaghi	061 37 83 42			
1112	3	4	\N	LOUAI GRAVIER & SABLE	لؤي للحصى و الرمل	RN n°10 - Sigus - W.Oum El Bouaghi	073 27 52 58	037 32 67 15		
2349	14	37	\N	SAHARA RESOURCES INC						
1589	1	4	\N	SOCIETE DES SABLES D'OR D'EXPLOITATION DE SABLE		Cité El Bassatine 385/270 W.Tebessa				
2844	1	4	\N	EDEN CONSTRUCTION	ادن للبناء	Tighzert, commune de Beni Aissa, Beni Douala - Tizi Ouzou	029 75 50 84 / 061 66 13 24 / 070 92 93 42	024 81 51 17		
2353	3	4	\N	MINSOLHYD	مين صول هيد	Résidence SECOPI  L 91 BP N° 354 - Birkhadem - W.Alger	021 55 30 39 / \n061 52 13 63	021 55 30 39	minsolhyd@hotmail.com	
2338	1	4	\N	SECAB / SOCIETE D'EXPLOITATION DE CARRIERE DE BOUIRA	شركة استغلال المحاجر البويرة	lotissement cadat A N°01-section 30  W-Bouira	0552 682 189	026 936 460		
343	5	4	\N	SPDR / SOCIETE DE PLATRE & DERIVES REDJAS	شركة الجبس و مشتقاته برجاص	BP 59 Oued Endja Mila	031 452 641 / 0655 154 310	031 452 641		
344	2	4	\N	AOUYA & FILS		Z.I BP 125 03400 Aflou	029 96 76 58	029 96 82 20	aouya@wissal.dz	
1373	3	4	\N	GEBATRAP		Djebel Oum - Settas Ibn Badis  W. Constantine	061 30 09 82			
2666	3	4	\N	DIR MOSTAFA IMPORT EXPORT	دير مصطفى للاستيراد و التصدير	Djebel Douamis 02, Commune d'Ain Abid Wilaya Constantine.	0770 53 87 54			
1788	3	4	\N	DJEBLI	جبلي	Rue du 1er Novembre 54 -Bougtob -     W. El Bayadh	049 72 44 82			
4317	1	\N	\N	BRIQUETERIE TIMADANINE	مصنع تيمادنين للياجور	BP 285 rue Bouzidi Abdelkader, Adrar	 049 96 89 19	 049 96 89 19	grelhamel@yahoo.fr	
1545	3	4	\N	AIN MESK DES CARRIERES		Rue D'Alger N° 21(41000) W.Souk -Ahras 	037 35 13 50			
1268	1	4	\N	ETPH CARRIERE	ETPH CARRIERE	PB 11M, Zone Industrielle de Sidi Bel abbes W. Sidi Bel abbes	048 56 67 06\n048 53 11 33	048 56 82 22	ETPHDZ@yahoo.fr	
3259	3	4	\N	CARRIERE KARA BELKACEM	محجرة قارة بلقاسم	Bp 382 Berrouaghia	0770 68 81 22	025 57 83 59		
3296	3	4	\N	ENTREPRISE ESSAKHRA	محجرة الصخرة	Cité Essalam, N° 02, Commune de Chlef, W, Chlef	027 74 19 35	027 74 19 35		
1965	3	4	\N	EPR BOUDOUAOU		Route Nationale N°05 BP 01 Boudouaou - W.Boumerdes	024 84 35 25 / \n024 84 39 29	024 84 35 02		
3002	1	4	\N	ENTREPRISE MAAMARA SERVICES	معامرة للخدمات	Cité Enakil  W/El Oued	029 67 00 35	029 67 40 54		
1931	1	4	\N	CASIM / CARRIERES SIDI MAAMAR	مقالع الحجارة لسيدي معمر	Route de Béchar-Saida Route Nationale N°06 BP 93 W.Saida	040 49 05 17 – 0550 93 34 60	048 51 20 64		
1395	3	4	\N	BOUFERACHE BUILDING		Hai Stamboul, Bordj El Kiffan -  W.Alger	021 69 73 69			
2548	3	4	\N	BELHADI ABDESSALAM DES TRAVAUX PUBLICS & HYDRAULIQUE	بلهادي عبد السلام للأشغال العمومية و الري	Route Kouadria,  Ouled Moussa - Boumerdès	024 87 73 42	024 87 73 42		
4578	1	\N	\N	ASSASSOU	اساسو					
1870	1	4	\N	BRIQUETERIE EL MEGSMIA		59, Rue Ben Badis W.Annaba	061 32 12 24	038 86 22 88		
1975	1	4	\N	ZIDANE MARBRE	زيدان للرخام	14, Route de Delly Brahim Chéraga W.Alger	038 93 27 37	021 36 57 35		
3080	3	4	\N	CARRIERE BOUIRET LAHDAB		Cité Bab El Charef batiment n°82 numéro 03 commune de Djelfa.				
1688	3	4	\N	LAZREG TRAVAUX PUBLICS	لزرق للأشغال العمومية	Route de Sig Bethioua W.Oran	0770 52 92 83	045 26 12 72		
52	13	4	\N	ECES / ENTREPRISE COMMUNALE D'EXPLOITATION DE SEL HAMRAIA	المؤسسة العمومية الصناعية و التجارية البلدية لاستغلال الملح بالحمراية	BP : 37 Hamraia  El Oued 39440	032 28 31 07	032 28 32 42	eceshamraia@yahoo.fr	
1004	1	4	\N	SABLIERE DU NORD		Seddouk Centre W.Bejaia	061 30 29 04			
367	3	4	\N	CARRIERE SAMMOUDI MOHAMED	محجرة صمودي محمد	Cité du 08 Mai 45  N° 96 Ain El Larbi   W. Guelma	0668 217 912			
2232	1	4	\N	CARRIERE PIERRE UNIQUE	محجرة الحجرة الوحيدة	Ath Mansour 10125 Bouira	070 36 33 29			
1698	1	4	\N	COPMAC	مركب وارسنيس مواد البناء كوبماك	Projet 98/230 logements collectifs Batiment F N° C, AIN DEFLA	06 61 65 65 16	027 51 52 50		
1611	3	4	\N	SABLIERE MADANI	مرملة مداني	Cité 630 logements 05 - Tibesbeste - Touggourt - W.Ouargla	061 38 14 93			
658	5	4	\N	ETR BEJAIA		20, Zone Industrielle Ihaddaden BP 386 W.Bejaia	034 21 20 33	034 20 25 25		
661	1	4	\N	EL HAKIMIA	الحاكمية	03 Rue Kastor, Theniet El Had, wilaya de Tissemsilt.	025 47 46 10 / 0552 15 53 17			
2443	1	4	\N	PADEN	بــاذن	Cité Lycée Abdel Moumen N°89 Rouiba w.Alger	0770 92 84 45 / 036 44 22 09	036 44 22 09		
797	1	4	\N	CARRIERE HADJI NADJI & FRERES	محجرة حاجي ناجي و اخوانه	 Commune d' El Euch - W. Bordj Bou Arreridj	(213)0550 55 83 27/0661 69 47 19			
799	5	4	\N	GRANITEX MORTIER		BP 225 Bou SaadaW/ M'sila	035 52 26 01\n035 52 26 02	035 52 26 00		
808	1	4	\N	UCOGEBER / UNITE DE CONCASSAGE GENERAL BERRIANE	محطة تفتيت الحجر عام بريان	BP°869, Zone Industrielle Soudane Berriane, w. GHARDAIA	029 84 61 62	029 84 53 36		
809	3	4	\N	LABANE MUSTAPHA		Cité 800 logements BP 05  App n° 10 - W.Boumerdès				
815	1	4	\N	SABLIERE SDB		06, Rue d'El Biar - Alger	021 63 79 33			
1362	5	4	\N	SERA	مؤسسة انجاز الطرقات و المطارات	Route de Misserghin ( Face Stade Bouakeul ) W.Oran	041 25 55 90	041 25 55 90	sera@algériecom.com	
999	5	4	\N	ORGM	الديوان الوطني للبحث الجيولوجي و المنجمي	BP 102, Cité Ibn Khaldoun (35000)  W.Boumerdès	213 24 79 10 46	213 24 79 10 52	orgm@wissal.dz	
2879	3	4	\N	CARRIERE HAMEL	محجرة هامل	Cité Filali Bt J n° 02 - W.Constantine	031 92 55 42 / 061 30 13 32	031 92 55 42		
3859	1	4	\N	GROUPE SALMI TRAVAUX PUBLICS	مجمع سالمي للأشغال العمومية	Section 14, Ilot n° 134 OC n° 08 Cité Ksabi - Tindouf, Wilaya de Tindouf	0552 02 30 46  / 0660078855/0661440038	049381197	sarlgroupesalmi@yahoo.fr et etpbsalmi@yahoo.fr	
4520	1	\N	\N	TOUAGHNI LITANKIB AN ZAHAB	تواغني للتنقيب عن الذهب					
4407	1	4	\N	INNOVA CERAM	إنوفا سيرام	Coopérative Elbounat 19600 Lot N° 9 \r\nCommune El Eulma w,Sétif	0558 53 26 21 / 0560 00 62 46 / 036 62 53 53			
3946	5	75	\N	LCO / LAFARGE CIMENT OGGAZ	لافارج اسمنت عقاز	Centre Commercial de Bab Ezzouar, Tour N°02, 5 et 6 eme étage - Bab Ezzouar Alger	023 92 42 95/96	023 92 42 94		
4505	1	\N	\N	TIN AKACHKIER LI TANKIB	تين اكشكير للتنقيب					
2022	1	4	\N	LA MONTAGNE AGREGATS	الجبل للحصى	Cité Harkat W.Bouira				
1065	5	4	\N	EPTR CENTRE	المؤسسة العمومية لأشغال الطرق بالوسط	BP N°37, Ain Deheb w. Médéa	025 59 54 08/09 – 025 58 44 26	025 59 31 19	info@eptrc-dz.com	
3748	1	4	\N	LOMPI	لومبي	32 Allée Salah Nazzar, Batna	033 86 45 45	033 86 24 24		
3617	12	4	\N	COOPERATIVE ARTISANALE ESSABAH	التعاونية الحرفية الصباح	Cité Frères Bouteiba    N° 58   Route de Mascara    Frenda  W. Tiaret	0774 581 225			
4455	1	\N	\N	TINADINE AHMED LITANKIB AN ZAHEB	تيناضين أحمد للتنقيب عن الذهب					
3552	12	4	\N	COOPERATIVE ARTISANALE CARRIERE EL DJAZAIR	التعاونية الحرفية محجرة الجزائر	Centre de Sougueur, Cité des 2000 Logements  W. Tiaret	0553 005 547			
2078	3	4	\N	PROTIMGAD	بروتيمقاد	3 Lot d'habitation dit El Houria n°202  - Ain Touta - W.Batna 05500	033 24 11 95	033 24 11 96		
2079	12	4	\N	EL KADICIA	القادسية	Commune de Boughezoul - W.Médéa	072 70 82 50 			
4640	1	\N	\N	YOUF ASSOUAT LI ZAHAB	يوف اسواط للذهب					
4624	1	\N	\N	KATLAT LI ZAHAB	كاتلات للذهب		0661377136			
3365	3	4	\N	CARRIERE DJEBEL EL DEKHLA	محجرة جبل الدخلة	Commune de Ben Badis Daira de Ain Abid, W, Constantine	07 70 88 19 55			
3452	1	4	\N	AGREGATS DES HAUTS PLATEAUX	حصي الهضاب العليا	Koudiat Om Laadjoul, Bir Labiod, Sétif	0550 437 124	034 21 99 90		
2733	1	4	\N	SABLIERE SIDI DALLA	شركة مرملة سيدى دلة	12, Rue Ibn Rochd, Chlef	0554 563 354	027 64 75 67		
3126	2	4	\N	VOLT DRIVING BALLA & CIE	فولت دريفينق بلة و شركائه	11 Décembre 1960 Bt 60 N° 05 Boumerdès	024 91 35 36 - 0661 34 73 26	024 91 35 36		
2188	3	4	\N	BOUBAYA AGREGATS	بوبـعاية للحصى	Cité 55 logements bt 03 n°21 M'sila	035 35 72 97	035 35 72 97		
3955	5	\N	\N	ALBARYTE / SOCIETE NATIONALE DE BARYTE	الشركة الوطنية للبرايت/ البريت	Micro zone Industrielle n°27 Dar El Beida W.Alger.	023 74 85 78	023 74 85 78		
3078	5	4	\N	BPB BLACO						
2161	1	4	\N	CARRIERE TAYBA	محجرة الطيبة	5, Rue Badji Mokhtar - Souk Ahras	0662 12 98 65 / 037 34 09 79	037 34 09 79		
3619	12	4	\N	COOPERATIVE ARTISANALE ADAM	التعاونية الحرفية آدم	Cité 1406  Logements   Bt 24 N° 5   Boumerdes  W. Boumerdes	024 81 36 57 / 0550 108 630			
3663	1	4	\N	ENTREPRISE AMMARI GRAVIER ET SABLE	مؤسسة عماري للحصى و الرمل	Djebel Lekroune, Commune Sigha, W, Oum El Bouaghi.	0770 87 59 97			
2522	1	4	\N	BATICERAM	باتي سرام	Z.I N°27 A Sétif, W Sétif	036 62 52 85	036 62 51 48		
2166	3	4	\N	SIDI MANSOUR	سيدي منصور	El Akba Sidi Boudjenane Commune de Souani Tlemcen	0550 991 970			
1399	1	4	\N	CARRIERE LES PIERRES BLANCHES	محجرة الحجر الأبيض	105 Cité Didouche Mourad, Chelghoum Laid, wilaya de Mila	0779 50 07 05	031 52 44 77		
611	1	4	\N	SCOA		Route des Carrières -Eckmuhi- W.Oran	041 34 46 45\n041 32 44 22	041 35 20 28		
151	5	4	\N	ENCOTREB / ENTREPRISE COMMUNALE DES TRAVAUX EL BAYADH	المقاولة البلدية للاشغال البيض	BP, 34 Hasnaoui,W, El Bayadh	049 71 48 48	049 71 19 02		
314	1	4	\N	CARRIERE KHEZZAR & FILS	محجرة خزار و ابنائه	Draa Souamaa El Euch, W, Bordj Bou Arreridj	07 71 41 77 23			
406	2	4	\N	SOPIE MOSTEFAOUI FRERES & CIE	سوبي مصطفاوي اخوة و من معهم	Cité Makam Ech Chahid 1ère tranche, n° 44; Sétif 19000	036 84 27 65 / 070 94 17 82	036 84 27 65 / 036 84 60 52		
2518	3	4	\N	KACEM	قاسم	Cité KARAMAN n° 216 Tiaret.				
359	3	4	\N	GRAVCO		BP 2189 - Khenchela	032 32 52 69			
2686	1	4	\N	CARRIERE SEBAK AMAR & FILS	محجرة سباق عمار و أبنائه	Douar Ouled Arama, Oued Seguen - W. Mila				
1383	3	4	\N	CARRIERE BAROUR ABDERAHMANE	محجرة برور عبد الرحمان	Lotissement 203 N° 171 RDC Mchira - W.Mila	0661918175			
1297	3	4	\N	CARRIERE KARACHEF		Ain Kasma  W.Tiaret	061 53 80 31			
560	3	4	\N	BELKACEM DE GYPSE	بلقاسم للجبس	Rue des Frères Bouabdelli N° 06 Cité Annasr W.Batna	061 30 31 51			
1826	1	4	\N	DRAA MAGTOUA D'EXPLOITATION DE CARRIERE DE SABLE	ذراع المقطوعة لاستغلال مقلع الرمل	BP N°305 (12000 ) W.Tebessa	061 36 62 79\n037 42 31 74	037 42 34 47		
2922	1	4	\N	CARRIERE KAROUCHAT	محجرة كاروشات	Carrière Karouchat Terre Dekdak Zediga Commune Amieur W.Tlemcen				
1517	3	4	\N	PROCOMAT		BP 267 - Centre Commerciale Boudiaf - Djelfa	027 87 68 71	027 87 79 20		
3230	1	4	\N	FRERES KOUACHI DE TRANSPORT	الإخوة كواشي للنقل	AIN DJASSER    (Route nationale n° 5 ) SETIF	0770 98 30 73 /72	036 74 30 48		
1805	3	4	\N	CARRIERE EL OUANCHARIS	محجرة الونشريس	7, Rue Seddaki Abdelkader -Oued Fodda- W.Chlef.	027 74 74 35 / \n061 60 00 01	027 74 70 16		
2321	1	4	\N	ANEMONE	أنيـمون النعمان	Djebel Fouka, Commune de Sidi Boussaid, wilaya de Mascara	026 21 30 70	026 21 30 70		
271	3	4	\N	AZROU TRAVAUX DE BATIMENT & CONCASSAGE		Route de Mascara n° 355, Frenda ; Tiaret				
2596	1	4	\N	KETOUM PROMOTION IMMOBLIERE	كتوم للترقية العقارية	Local n° 01, Gare Routière Boudouaou - W.Boumerdès	071 05 48 50 / 075 22 63 36	024 84 35 78		
4051	1	4	\N	CARRIERE RAHEM ET CIE	محجرة راحم و شركاؤه	Coopérative 05 juillet, Ain Fekroun, Oum El Bouaghi.	06 61 37 82 34	023 80 75 92		
3682	12	4	\N	MARMALET BOUCHRA	مرملة بشرى	15, Rue Abderrahmane Lalla  EL Madania  W. Alger	0661 122 942			
4799	1	4	\N	BAHOUS EL HADJ	بحوص الحاج	Hai Khellaf, Section 16, propriété 114, commune de Brezina, El Bayadh.	06 62 52 50 67			
2582	3	4	\N	CARRIERE AOUADI ARRES DE PRODUCTION D'AGREGATS & SABLE	محجرة عوادي عراس لانتاج الحصى و الرمل	Boulevard Abattoir, Cité El Amel A - Ain Beida - W.Oum El Bouaghi				
3424	1	4	\N	NADJAH TLEMCEN	نجاح تلمسان	Hai Chahid Guermouche, Sebdou - Tlemcen	43 20 64 54/ 0776 33 01 25/0661 22 11 50	043 20 64 54		
4033	1	4	\N	AYADI ADEL ETRHB	عيادي عادل او تي ار اش بي	Rue 19 Juin 1965 Lot Sayhi, Biskra	05 50 51 20 32			
3567	12	4	\N	COOPERATIVE ARTISANALE FLECHE D'OR	التعاونية الحرفية السهم الذهبي	Commune de Magra  W. M'sila	0661 401 917			
3730	1	4	\N	ENTREPRISE D'AGREGATS CHERGUI MOHAMED	مؤسسة الحصى شرقي محمد	36 Avenue Zaatcha, W, Biskra	06 61 84 50 03	033 74 30 99		
3130	3	4	\N	E.T.T.R.H	او.تي.تي.ار.اش	08, LOTISSEMENT IBN TOUMERT   BIRKHADEM W.ALGER	0771 60 97 21			
3899	1	\N	\N	SOCIETE FRERES NECIR SERVICES	شركة الأخوة نصير للخدمات	Cité Soukra Rouissat, wilaya d’Ouargla	0660 03 52 04	029 73 16 01		
2621	5	4	\N	EGT OUEST	EGT OUEST	Route de Oued Tlelat, Gare d'Arbal - Oran	041.43.65.17	041.43.64.20		
4433	\N	\N	\N							
4312	1	\N	\N	CARRIERE SIDI M'HAMED BENYAGOUB	محجرة سيدي محمد بن يعقوب	23 Route Ain Dhab, Commune de Naima, Tiaret	05 51 00 75 37	036 74 30 48		
3441	3	4	\N	CARRIERE NASSRINE		Cité Kanddine Kharrouba Boumerdès	0550 23 76 24			
3442	3	4	\N	MARMALETTE EL MAARIF	مرملة معاريف	Banuoi local B commune d'El Marrif w. M'SILA	0772 63 71 27			
3865	1	\N	\N	C.P.R.A. / CERAMIQUE ET PRODUITS ROUGES D'ALGERIE	سيراميك و مواد الحمراء الجزائر – سي.بي.أر.أ	RN N° 3, Ain Sahara Nazla Touggourt Ouargla	0661 41 34 34			
4279	1	\N	\N	N.I GROUPE		Cité Tibesbest- Touggourte, Commune de Touggourte,Wilaya de Ouargla	0554 51 19 42 et 0661 50 86 19			
4280	1	\N	\N	S A M T P						
27	2	4	\N	KEBBICHE FRERES	الاخوة كبيش	Coopérative El Khïer, cité Kaaboub; Sétif	036 51 32 65	031 51 42 61		
4625	1	\N	\N	TIHERMOUINE LIZAHAB	تيهرموين للذهب		0666558787 / 0657957279			
783	3	4	\N	EBM BOUZGHAIA		Zone Industrielle Lot 79   Kechida W. Batna				
4471	1	\N	\N	AHSSA LITANKIB	اهسا للتنقيب					
1143	1	4	\N	STATION DE CONCASSAGE EL FATH		Rue, Emir Abdelkader El Menea  Ghardaïa	029 81 21 08	021 44 95 63		
464	3	4	\N	GE / GENERALE ENTREPRISE	المؤسسة العامة	Zone Industrielle Palma Constantine	031 66 82 24 			
1946	3	4	\N	ENTREPRISE DAR MAHIOU		BP 209 Ghazaouet 13400 W. Tlemcen	071 25 82 09			
185	3	4	\N	DAHMANE	دحمان لمواد الملاط	25, Rue Ahmed Fethi; Ras El Ma ; SBA	061 26 74 60			
186	3	4	\N	CARRIERE TAFOUGHALT	محجرة تافوغالت	Village Tafoughalt Commune Ait Yahia Moussa W, Tizi Ouzou	07 70 92 00 28			
187	1	4	\N	BENI CHOUGRANE TRAVAUX PUBLICS	بني شقران للأشعال العمومية	Boulevard des Martyres,  El Bordj - W. Mascara	0661 250 540			
563	3	4	\N	HASSA EL AURES		BP 39 Commune de Chir - Daïra de Theniet El Abed - W.Batna	033 97 61 36			
1900	5	4	\N	STHYB EL HACHEMI	شركة أشغال الري و البناء الهاشمي	BP 95 Benboulaid - Batna	061 51 11 18	033 86 30 25		
1878	3	4	\N	CARRIERE DYR	محجرة دير	Tarek Ibn Ziad W.Souk - Ahras	037 31 98 74			
708	2	4	\N	BRIQUETERIE FRERES HADI		250, Rue Sidi Barket  W. Biskra	33 75 96 28\n033 75 86 22	033 75 95 76\n033 75 86 21		
1873	1	4	\N	SABLIERE CONCRATES	مرملة كنكراتاس	Cité Oued Nagués (12000) W.Tebessa	037 42 13 73	037 42 38 10		
585	1	4	\N	NOUVELLE CARRIERE	المحجرة الجديدة	Chemin de Wilaya N° 42, Allaghan, Commune de Boudjellil, Daïra de Tazmalt - W.Bejaia	034 35 86 00	034 35 86 01		
643	1	4	\N	KOLEA EXTRACTION & PREPARATION DE PLATRE		Ouled Sidi Brahim   W.M'Sila				
3576	1	4	\N	GROUPEMENT LIOUA HYDROZED	مجمع ليوة هيدرو زاد	02, Rue Sahel Seddik Lioua - Biskra  \r\nHai Boukhozera, Bab El Oued - Alger	0550 54 29 53	033 74 92 03/021 36 94 52		
409	3	4	\N	STATION DE CONCASSAGE DJEDID BENAMEUR	محطة مقالع الحجارة جديد بن عامر	Ecole Mahane Tayeb, Medrissa 14250 - Tiaret	046 40 24 90 / 070 98 16 89			
410	3	4	\N	HADJAM LYAMINE DES AGREGATS & SABLE		Hammam Krif Baghai  W. Khenchela				
411	3	4	\N	ENTREPRISE BENOMAR PRODUCTION DE BRIQUE	مؤسسة بن عمر  لانتاج الأجر	Zone Industrielle Oum Ali - Tebessa	037 44 03 00	037 44 81 76		
25	3	4	\N	CARRIERE BACHOUCHE MOHAMED		19, Rue "F"Cité Bouakal  "3" Batna	033 85 30 58			
1592	1	4	\N	AGROCERRA		Cité Damna Route de Sig -Bethioua- W.Oran	041 37 06 90	041 37 01 16		
1598	1	4	\N	TIZI BRIQUE ZEMIRLI		Route de Beni Doula W/ Tizi Ouzou				
2201	1	4	\N	COTRAM	كوترام	Route de Tiaret Mascara	045 93 54 09 / 0661 29 62 88 / 0550 56 99 15	045 81 45 04 / 045 93 54 09		
2470	3	4	\N	CARRIERE HADDOU	محجرة حــدو	Cité des 124 Logts, Bloc F2 n° 14 - Tiaret				
1658	2	4	\N	BABA AHMED MOHAMED REDHA - CARRIERE HAOUIDGA -	بابا أحمد محمد رضا	457 Bis, Kiffane  W. Tlemcen	043 20 83 66 / 070 33 27 48 / 071 88 41 57	043 20 73 44	snchouidga@yahoo.fr	
1659	4	4	\N	GRTRS TO		Cité CNEP 20 Août W/ Tizi Ouzou	026 22 23 70\n026 21 06 03	026 22 29 64		
472	1	4	\N	BHTPPA	بي.أش.تي.بي.بي.أ	Avenue Amirouche, Telagh; SBA				
2293	1	4	\N	GUENOUNA GHOUILA	قنونة غويلة	Commune de Zakkar  Daira de Ain El Bell  W de Djelfa	021 55 30 39	021 55 30 39 		
3595	12	4	\N	COOPERATIVE ARTISANALE SABLIERE OULED BOUAMEUR	التعاونية الحرفية مرملة أولاد بوعمر	Commune de Sidi Abdelghani  W. Tiaret	0795 129 583			
3665	12	4	\N	COOPERATIVE ARTISANALE ESSAKHRA	التعاونية الحرفية الصخرة	Rue Rabah Arrif   Si Mustapha  W. Boumerdes	0550 558 327			
1723	1	4	\N	CONCASSAGE MOHAMMEDI & LAIDI		Medrissa W.Tiaret	046 40 24 91			
1726	3	4	\N	CARRIERE EL FATH	محجرة الفتح	102, Tizghanit Beni Mester W. Tlemcen 	061 22 04 25	043 20 32 48		
1330	2	4	\N	CARRIERE SAOUDI & ZEGHEDAR	محجرة سعودي و زغدار	Cité Haoua Nakai -Sigus - W.Oum El Bouaghi	032 40 82 25			
3568	3	4	\N	ALTEF	ألتف	Hai Ben Souila  Bouhnifia  W. Mascara / Cité Bel Air 12 rue  freres Hazati Athmane   Mascara	0775 978 648	045 80 44 75		
3841	1	4	\N	GROUPE AMOURI SERVICES	مجمع عموري للخدمات	Cité Taksebt,W. El Oued	0555 05 31 22	023 80 75 92		
2777	1	4	\N	M'ZI AGREGATS	مزى للحصى	01, Cité Oassis Nord - 03000 Laghouat	029 93 39 89			
3283	3	4	\N	EL MANAR	المنار	Rue El Gaada, Aflou, W.Lagouat	0661 47 31 37			
4313	1	\N	\N	CABEX ENGINEERING	كابكس للهندسة	Vill 148, Oued Forcha, Annaba	06 61 36 21 20	038 42 76 54		
2800	2	4	\N	SACOM -S-	سايب عبد الكريم و صحراوي الطاهر ساكوم -أس-	Cité 20 Aout 55, Bat D3 cage n° 1- Constantine	031 52 27 02	031 52 24 32		
1642	1	4	\N	SAGEM THEVEST		Route de Annaba I Lot 724 N°32 W.Tebessa	037 47 37 60			
220	1	4	\N	AGRIMAC	أ قريماك	Rue, Yousfi Hacène - Oum El Bouaghi	032 42 14 99			
1838	3	4	\N	ENTREPRISE BOUDRAA D'EXPLOITATION DE SABLE	مؤسسة بوذراع لاستغلال الرمل	Cité la Commune N°316/02 W.Tebessa	037 48 66 47	037 49 68 53		
2379	5	4	\N	GCB / SOCIETE NATIONALE DE GENIE CIVIL & BATIMENT	الشركة الوطنية للهندسة المدنية و البناء جي.سي.بي	Prolongement de l’ALN, BP 110 Boumerdes	024 797 692 / 024 81 89 99	024 797 719 / 024 81 38 80	gcb@wissal.dz	
266	1	4	\N	EATR		BP 23 Isser. Boumerdès				
268	2	4	\N	BRAHIM FRERES		Route Nationale N° 11  Ain Nouissy   W. Mostaganem				
2405	5	4	\N	ALTRO	الشركة الجزائرية لأشغال الطرق	Zone d’activité, Route Hamadi Krouma Bp°189, wilaya de Skikda	038 93 56 97	038 93 56 36	contact@altro-dz.com	
2007	1	4	\N	EL RHUMEL	الرمال	Cité Houari Boumediane N° 05	061 30 29 52			
2008	1	4	\N	FRERES BAHRI MULTI TRAVAUX		Cité 20 Août 1955 - Guemar - El Oued	032 20 17 59	032 20 21 41		
3331	3	4	\N	TPMM FIRST	تي. بي. ام. ام فرست	Cite Kennabe 720  Logts  Les Vergers Bt 38  N° 02  Bir mourad Rais  W. Alger	0550 587 451			
2355	2	4	\N	ES SAADA HAROUAL & ASSOSCIES	السعادة هروال و شركاؤه	Ouled Ben Adda APC Sebaine W.Tiaret	046 44 21 39			
2326	1	4	\N	TALA SILICE	تالة سيليس	36, Rue Mitiche Mohamed-Arab, Boghni - W.Tizi Ouzou	0771 98 22 40/ 0794 49 25 64	026 28 33 16		
1168	1	4	\N	CECB	مركب استخراج و تقطيع الحصى بشيري بجاوي س.أ.س.ب	BP 6 Ain Mellouk - W.Mila	031 52 72 90/  06133 85 77	031 52 90 90		
1325	3	4	\N	IFRANE GRAVIER & SABLE	إيفران للحصى و الرمل	Cité 120 Logements Batiment A N°7 - Ain M'Lila - W.Oum El Bouaghi	072 19 00 07			
776	1	4	\N	CARRIERE LAALA ET LAHBARAT	محجرة لعلى و لحبرات	SMARA Groupe N°137 Section 121 Rez de chaussé  Commune Guedjel-W- Sétif.	0661 35 09 10\n061 35 09 10	036 84 44 43		
4143	5	4	\N	SOCIETE NATIONALE DE GENIE CIVIL ET BATIMENT	الشركة الوطنية للهندسةالمدنية و البناء	Prolongement  Boulevard  de  l'ALN       BP 110    Boumerdes	024 79 77 88	024 79 76 75		
223	5	4	\N	SOTREMWIT	مؤسسة أشعال صيانة الطرق لولاية تلمسان - صوترامويت	BP 365, Abou Tachfine ; Tlemcen	043 27 60 60	043 27 17 80		
743	1	4	\N	HARKAT EL HADI		BP 08 - Ksar El Boukhari - W.Médea	027 87 63 86			
647	3	4	\N	ENTREPRISE HAOULIA CARRIERE		N° 02, Cité Mohamed Khemisti - Hennaya -  W. Tlemcen				
648	5	4	\N	ECAVA	مؤسسة المحاجر لمدينة الجزائر	BP 293 - Carrière de Bab El Oued - B.E.O - Alger	021 96 34 45 / \n021 96 34 54	021 96 48 80		
3244	1	4	\N	ENTREPRISE FERHAD EXPLOITATION CARRIERE D'AGREGATS	مؤسسة فرحاد لاستغلال محجرة الحص	R N°4 Bir Saf Saf Oued Fodda W, Chlef	027 44 91 51	027 44 91 51		
2046	1	4	\N	NOUVELLE BRIQUETERIE DE L'OUEST "NBO"	مصنع الاجر الجديد للغرب	N° 41, Commune Sidi Ben Yebka, wilaya d'Oran	041 76 47 55	041 76 47 50		
2845	3	4	\N	ALGEROCHE	الجزائر صخر	82 Lots 165 Trancge et Merdja w,Tissemsilt	0550 72 37 95	041 46 43 62		
2846	3	4	\N	DRIZI PRODUCTION FABRICATION PLATRE	دريزي للانتاج وصناعة الجبس	19 H C EXT  à DRARA ALGER	021 35 37 82			
2005	1	4	\N	SOCIETE FRERES REZZAG EXTRACTION & PREPARATION DE SABLE	الاخوة رزاق لاستخراج و تحضير الرمل	Lot 156 Djamaa - W.El Oued	071 42 21 35\n032 25 00 92	032 25 00 92		
735	1	4	\N	AFAK CONSTRUCTION	شركة آفاق للبناء	Zone d’activité d’El Ouenza, wilaya de Tébessa	0671 57 31 33  / 0550 01 12 21	037 46 94 27		
115	3	4	\N	STATION DE PRODUCTION DE SABLE & AGREGATS OUGHIDNI CHERIF	اوغدني الشريف	Z.I Ibn Badis BP 24 El Khroub	031 96 44 19	031 96 44 19		
189	5	4	\N	GENI SIDER		Route de Hasnaoua, Nouvelle vile ; TO	026 21 83 10	026 21 83 10		
1415	2	4	\N	SGGC / SOCIETE GENERALE DE GENIE CIVIL OUEZANE ABDELMALEK & FRERES	الشركة العامة للهندسة المدنية وزان عبد المالك و اخوانه	El Mardja - Route de Djelfa - Laghouat	0661 64 19 30 /0661 64 10 42 / 0770 34 10 59	029 92 98 60		
4768	3	4	\N	ITRAP	ايتراب	N° 122 du Plan 293 lots commune de Gdyel - w Oran	0554 77 11 20			
3991	1	\N	\N	BOUZEGZA TRAVAUX PUBLICS	بوزقزة الأشغال العمومية	Cité Boulzazene    Bouzegza  Keddara   Boumerdes	024 79 51 29/31	024 79 51 31		
1156	1	4	\N	STPR	شركة الاشغال العامة و الطرقات	Rue Bennabes, Bt 5 Bloc 142,W, Constantine	031 93 68 58	031 92 44 61		
3423	1	4	\N	MEKHALFI IMAD ET CIE TRAVAUX PUBLICS	مخالفي عماد و شركائه للأشغال المومية	Cité Administrative Ain El Kebira      SETIF	0661 85 37 36	036 89 45 25		
2605	1	4	\N	CARRIERE SAD BENI HAROUNE BOUZEKRI ABDELAZIZ & MEZIANI SAMIR	محجرة سد بني هارون بوزكري عبد العزيز و مزياني سمير	Tanefdour 8300 El Milia. W. Jijel	034 42 71 63			
3978	1	\N	\N	BRIQUETERIE REGGANE	شركة رقان للياجور	Rue Bouzidi Abdelkader, wilaya d'Adrar	049 96 89 19	049 96 78 91		
3979	\N	\N	\N							
4435	1	\N	\N	KELE ENGHER	كيل إنغر					
4537	3	\N	\N	LAIB GRANDS TRAVAUX	العايب للأشغال الكبرى	Lots n°11, Zone d'activité, wilaya d'Illizi	033 88 36 09 / 061 34 35 45	033 88 87 60		
4516	1	\N	\N	ROUAT ELLIL	روعاة الليل					
4592	1	\N	\N	TASSOUR LIZAHAB	طاسور للذهب		0672767557			
3930	1	4	\N	BRIQUETERIE FAIENCERIE NOUVELLE DU SAHEL	المصنع الجديد للاجر و الخزف الساحل	2, Route de Ouled Fayet, Dely Brahim, Alger	021 36 29 25	021 36 29 31		
311	1	4	\N	SOFAP/ SOCIETE DE FABRICATION DE PLATRE	سوفاب	CIA des Citronniers B2 - Chlef	027 77 43 83\n027 72 02 11	027 77 43 83	boussoura@yahoo.fr	
312	1	4	\N	IKHLASSE	الإخلاص	Siar Daira de Chechar 	032 32 16 03			
1389	1	4	\N	DJOUADI DJEMAA	جوادي جمعة	04, Rue Ouazene Mohamed  Bordj El Kiffan  W. Alger	021 20 28 68	021 20 41 66		
2311	2	4	\N	EL AHRAM HAMDI & CIE D'EXPLOITATION & COMMERCIALISATION DE L'AGREGATS & SABLE	الأهرام حـمدي و شركائه لاستغلال و بيع الحصى و الرمل	Cité El Hana - Ain Beida	032 49 15 93 - 061 55 51 29			
550	3	4	\N	CARRIERE BENAMARA		Village Larbaa Thahdimt, Commune de Boudjellil, Daïra de Tazmalt W.Bejaia				
3229	3	4	\N	ADJALFAOUENE GRANDS TRAVAUX	اجلفاون للاشغال الكبرى	OUED TAGGA, W, BATNA\r\nRue des fréres DEBABI   N° 27 bouakal  3\r\nBATNA	0665 16 36 83/ 0550 47 67 96		etphmallem@gmail,com	
1392	5	4	\N	SOMACOB / SOCIETE DES MATERIAUX DE CONSTRUCTION DE BOUHADJER	شركة مـواد البناء بـوحجار )سوماكوب(	Damouse BP 26 Bouhadjar W/El Tarf	038 62 62 15			
2032	1	4	\N	CERAMIQUE DU SUD	فخار الجنوب	Zone Industrielle Djemaa - W.El Oued	032 25 70 53 / 032 25 64 58	032 25 88 22		
3051	1	4	\N	TLP / TRANSPORT ET LOCATION PALMA	نقل و كراء بالما - تي أل بي	12 A,  Zone industrielle Palma - Constantine	031 66 80 80	031 66 80 38		
1354	2	4	\N	ZIANE & FILS	زيان و أبنائه	Beni-Mansour Gare, Commune de Boudjellil W.Bejaia	072 16 16 39 / 072 14 60 60	034 34 03 59		
4287	1	\N	\N	GANAT AGREGAT	غانت للحصى	Local N° 2   Tribune Du Stade   Larbaa Nath Irathen    Tizi Ouzou\r\nlot n 33   El Makam   Laghouat	0549 3838 58			
3685	12	4	\N	COOPERATIVE ARTISANALE OULED MIMOUN	التعاونية الحرفية أولاد ميمون	Route de Sidi Bel Abbes   Ouled Mimoun  W. Tlemcen	0661 222 254			
1650	3	4	\N	DAOUDI TPHYCS	داودي تي.بي.هي.سي.أس	Cité police n° 14 - Sfisef - W.Sidi Bel Abbès	048 59 54 39			
4004	1	4	\N	FIAS FABRICATION INDUSTRIELLE D'AGREGATS ET SABLE	فياص الانتاج الصناعي للحصى و الرمل	Coop immobilière Belle Vue, Cité 11 Décembre 1960, Bt c 117, Boumerdes.	06 61 66 08 67			
3707	2	4	\N	GUERAICHE BOUBAKEUR ET FRERES	قرعيش بوبكر و اخوانه	Cité 08 Mai 45, N°34 El Khroub, W, Constantine	06 61 30 67 41	031 96 75 14		
4460	1	\N	\N	IN AGHBIR LI TANKIB	إين اغبير للتنقيب					
4461	1	\N	\N	SOCIETE IN BACRANE	شركة ان بركان					
4462	1	\N	\N	TERHISSET LITANKIB	ترهيست للتنقيب					
3420	1	4	\N	HADJ ALI HYDRAULIQUE ET ROUTES	شركة حاج علي للري و الطرقات	Hai Enakhil   n° 01  Touggourt   OUARGLA	029 68 44 54	029 68 27 65		
1808	3	4	\N	SAHRAOUI INDUSTRIE	صحراوي للصناعة	Rue Ain El Bordj -  W. Tissemsilt	046 49 70 81	046 46 34 06		
4644	1	\N	\N	IMERDENE LI ZAHAB	ايمردان للذهب					
4574	1	\N	\N	SERGHAOUEN LITANKIB	سيرغاون للتنقيب					
4575	1	\N	\N	HIDOUSSI	حيدوسي					
2920	3	4	\N	MCIRDI TRAVAUX PUBLICS	مسيردي للاشغال العمومية	Rue el Maghrib Nedroma w/Tlemcen	071 20 58 55			
2735	1	4	\N	OULED REBAI TRAVAUX PUBLICS	أولاد ربيعي للأشغال العمومية	Cité Saada, Sedrata - W.Souk Ahras	037 37 76 27			
3418	3	4	\N	ETHTP DJAWAD	أو.تي.أش.تي.بي جواد	04, Rue Khaled Ibn Walid Mukkari - ORAN	041 45 44 61	041 45 44 61		
4087	\N	\N	\N							
4409	1	\N	\N	ESSADAKA CARRIERE	الــــصداقة كـــــــــاريار	Cne de Ouillen, Souk Ahras	05 50 70 11 60	037 74 30 82		
3804	5	4	\N	SAVIAL / SOCIETE ALGEROISE DE VIABILISATION ET DE LOCATION	الشركة الجزائرية للتهيئة و الايجار	 Route Nationale n°1, Birmourad Rais - Alger	023 755 061 / 023 755 062	023 755 466		
4417	1	\N	\N	S.K.A AGREGATS OUM STAS	أس ك أ أقريقا أم سطاس	Djebel Oum Stas , commune Ibn Badis, wilaya de Constantine.		0550 18 15 32		
4689	1	4	\N	E.T.M.B ENTREPRISE DE TRANSFORMATION DU MARBRE BENCHERGUI	او تي ام بي	02 RUE KADOUR RAHIM COMMUNE HUSSEIN DAY	0661512934			
4690	\N	\N	\N							
4619	1	\N	\N	SUD EST LITANKIB	الجنوبية الشرقية للتنقيب					
3586	12	4	\N	COOPERATIVE ARTISANALE BOUCHELAGHEM EXTRACTION DE TUF	تعاونية حرفية بوشلاغم لاستخراج التيف	Village Tizi Nali Slimane, Bordj Menail, W, Boumerdes	0551 834 258	024 81 51 93	abdoufree@hotmail.com	
3973	1	\N	\N	TIMADANINE BRIQUETERIE EL HAMEL	شركة الياجور تيمادنين الهامل	BP 285Rue BOUZIDI Abdelkader, ADRAR	049 96 89 19	049 96 78 91		
4058	1	\N	\N	SIDI EL ABED TIARET	سيدي العابد تيارت	62 Cité de 282 logements/Tiaret, W. Tiaret	0777 19 16 75			
3997	1	\N	\N	ARMANOS	أرمانوس	Sobha  centre   n° 1     Sobha   Bouladir      Chlef	025 52 15 55	025 52 15 16		
3041	3	4	\N	ENGENERING STUDY	انجينيرينق ستودي	05 Lotissement Saidoun Mohamed   Kouba	021 28 55 41    - 021 28 62 47	021 28 55 67		
3919	1	4	\N	SIAT	شركة الهندسة و التطبيقات التقنية	Cité Route de Annaba, Tébessa	0661 744 249 / 037 55 07 35	037 55 07 35		
3510	12	4	\N	COOPERATIVE ARTISANALE SABLIERE TAABCHA - MEDRISSA	تعاونية حرفية مرملة طعابشة مدريسة	166, Cité Errahma 3, W,Tiaret	07 70 37 38 06			
3511	12	4	\N	COOPERATIVE ARTISANALE SIDI SALEM	تعاونية حرفية سيدي سالم	Hammam 800 Logts, W, Boumerdes	05 50 23 57 62			
1186	3	4	\N	CARRIERE GADDA	محجرة قادة	17, Avenue de la République - W.Batna	0661 70 58 48 / 0550 51 40 30	036 84 60 52		
3036	5	4	\N	ETUHP MENANI	أو.تي.اي.أش.بي مناني	13, Rue Barakat Larafi, Hai Ben Yakoub - W. Biskra.	033 74 91 08	033 73 50 50		
3431	12	4	\N	COOPERATIVE ARTISANALE RAS EL AIN	التعاونية الحرفية راس العين	Rue Korichi Mohamed  Commune de Gueroufa W .Tiaret	0773 102 903			
3432	1	4	\N	IVB	إي في بي	Rue Youcfi Hassane Oul El Bouaghi	0770 43 71 18	032 42 44 42	hbenchar@yahoo.fr	
1504	1	4	\N	ROCK WELL	روك وال	Cité Frères Rahabi Z.I N°60 – W : GUELMA.	0770 06 14 00 – 0770 05 89 98	037 26 64 67		
3016	1	4	\N	LE MOULIN BLANC	المطحنة البيضاء	 Zone d'activité Bir El Djir, W, Oran	055 40 26 47			
4725	2	\N	\N	FLIBCO FRERES MERZOUK	فليبكو الاخوة مرزوق	Cité frères Boukadi Ain Fakroun, wilaya d'Oum El Bouaghi	0550 84 68 07			
4410	1	\N	\N	CHELIA INDJAZAT	شيــــليـا إنــجـازات	N°07, Cité Imam El Ghazali Khnechela	0661 70 81 39	032 70 81 39		
4305	1	\N	\N	BRIQUETERIE HADJ ALI	مصنع اللآجر الحاج علي	74 ; rue des Frères Djillali Birkadem ALGER	0559 44 64 20			
3127	5	4	\N	SONATRACH-Aval	سوناطراك	Djenane El Malik, Hydra Alger	021 54 62 42	021 54 66 18	afeghouli@avl.sonatrach.dz\r\nafeghouli@avl.sonatrach.dz	
4136	1	4	\N	TRANSPORT DE VOYAGEURS ,MARCHANDISES ET LOCATION DE VOITURES      EL ISRAA	نقل المسافرين و البضائع و كراء السيارات  الإسراء	Cité 150 logements, Bir El Ater, wilaya de Tébessa	037 44 79 40	037 44 92 77		
2664	1	75	\N	TDLMC / TERRASSEMENTS DEMOLITIONS LOCATIONS MATERIAUX	تي.دي.أل.أم.سي	10, Rue Djemila, Hydra - W.Alger	0795 14 90 61	021 28 11 13		
3406	1	4	\N	SOEX - MINES	سويكس مين	Coopérative  - Aamrine -  cite Oued  forcha 700\r\nlocal n° 9              Annaba	0560 57 49 52/0666 07 17 70	038 80 32 84		
3936	2	4	\N	ALITI KHEMISSI ET FRERES DES GRANULATS	عليطي خميسي واخوانه للحصى	Boulevard de l’A.L.N, Route Nationale N°09, Amoucha, wilaya de Sétif	036 89 05 71 – 0661 56 90 63-64	036 89 08 52		
1438	1	4	\N	CARRIERE EL KHERBA	محجرة الخربة	Commune de Dahmouni - W.Tiaret	061 23 11 95			
1440	1	4	\N	BELTER 3EM		Zone Industrielle lot N° 93 - Bou Ismail - W.Tipaza	027 64 99 76 / \n024 46 26 55	024 46 26 55 / \n027 64 94 78		
3440	3	4	\N	BAB EL SAADA EXTRACTION DE SABLES	باب السعادة لإستخراج الرمل	ANCIENNE ROUTE DE DJELFA BOUSAADA W. M'SILA	0551 68 94 15			
2709	1	4	\N	EL HADJ LARBI IMPORT ET EXPORT	الحاج العربي للاستيراد و التصدير	Rue Aissat Idir n° 54 Ain Mlila  W/Oum El Boughi,\r\nCité Communale, Ain M'Lila - Oum El Bouaghi	032 44 50 05 / 0661 54 43 57	032 44 90 09		
3046	1	4	\N	ETBH CHIHANI	أو تي بي أش شيحاني	Cité 17 Octobre BP N° 15- W, El Oued	032 11 40 59 / 0661 38 50 55	032 11 40 61		
4184	1	4	\N	SOUNDOUS SAFA PRODUITS  ROUGES	سندس صفاء للمواد الحمراء	Route Ain  Beida, Commue de Baghai,Wilaya     Khenchela	0661  47 71 52/0552 28 51 07		sarl.baghzou@hotmail.fr	
4186	3	4	\N	FC CERAM	أف سي سيرام	Hai Ain Sefiha, Lot 357, Ilot n°152, Commune de Sétif, wilaya de Sétif	0661 19 03 07	036 84 79 65		
4187	3	\N	\N	Granulats Grouz Frères Benissaad	حصى قروز الإخوة بن يسعد	Rue Haddad Slimane, Ain Melouk MILA	0661 33 88 35	031 52 78 66		
4188	\N	\N	\N							
2926	1	4	\N	SIDI MESSAOUD	سيدي مسعود	Z.I DE Souk-Ahras BP N° 354	0770 31 18 74	 037 71 60 56		
2767	1	4	\N	SMTRA	مستغانمية لأشغال الطرق و التهيئة - م أ ط ت	54, Rue Abane Ramdane - Mostaganem	054 26 40 85	045 26 78 80	smtrasarlkb@yahoo.fr	
2768	\N	4	\N	CHOHRA	شهرة علي	Cité 49, lot Rebbahia - Saida	048 47 52 94	048 47 52 96		
2951	1	4	\N	TRAP MAHMOUDI	تراب محمودي	Z.I N° 130 Bechar,W. Béchar.	049 81 83 84	049 81 81 81		
1777	1	4	\N	HEDNA BRAHIM & FILS	هدنة إبراهيم و أبنائه	BP N°2  RN n° 5 - Ain S'Mara - W.Constantine	031 97 41 59	031 97 18 91		
2919	1	4	\N	ARM TELECOM ELECTRICITE GENIE CIVILE HYDROCARBURES	ارم تلكوم الكهرباء جيني سيفيل هيدروكربور	Villa n° 325, Les Dunes, Cheraga - ALGER	0555 99 99 02/021 37 91 02	021 35 41 68/021 38 23 89		
553	3	4	\N	THENIA EL HAMRA D'EXTRACTION & PREPARATION DE SABLE		Cherora -W. Batna	033 82 61 11			
1947	2	4	\N	CARRIERE DIB & ASSOCIES	محجرة ذيب و شركائه	23, Cité de 8 Mai 1945 El Khroub W.Constantine	031 96 23 22			
275	1	4	\N	MACOTEB / MATERIAUX DU CONSTRUCTION DE TEBESSA	مواد البناء تبسة - ماكوتاب	Z.I W, Tebessa	07 70 96 26 31			
276	5	4	\N	AGREGATS & SABLE SELLAOUA ANNOUNA		Commune Sellaoua Announa ; Guelma				
277	1	4	\N	SOMC / SOCIETE DE MATERIAUX DE CONSTRUCTION	شركة مواد البناء - صو.أم.سي	Centre Milini Sidi Ali Ben Youb W. Sidi Bel  Abbes.	0660 37 31 26	048 57 54 15		
279	5	4	\N	SAAB	شركة الحصي و المواد الا سمنتية بو كبش	Rue du 17 Octobre 41000 w,Souk Ahras	037 32 26 05	037 35 24 69		
282	1	4	\N	AYADI GRAVIER & SABLE		Cité Nouvelle Ain Beida				
3050	1	4	\N	SEMOULE BASRA	دقيق البصرة	Ain Smara Centre n°07, Constantine - 25140	031 97 33 13	031 97 48 48		
3593	12	4	\N	COOPERATIVE ARTISANALE SIDI M'HAMED BENAOUDA	التعاونية الحرفية سيدي امحمد بن عودة	Cité des 700 Logements  N° 04  W. Tiaret	0770 490 897			
3660	3	4	\N	BOUGHEDOU AGREGATS	بوغدو للحصى	Djebel Boughedou, Commune de Tizi, W, Mascara	05 50 53 35 15	045 81 22 47		
3168	1	4	\N	RAHAPHARM	راحفارم	35 lot Aissat Idir Cheraga - ALGER	0661 28 18 36	021 37 22 22		
861	1	120	\N	GOLD ALGERIAN LIBANESE	قولد الجيريان ليبانيز	Hai Ibn Khaldoun - Boumerdès - Siège de l'ORGM\r\nBP 102 - Boumerdès	00 9611 499 057	00 9611 497 986	mail@zakhemelb.com	
1171	2	4	\N	HAOUAM & FRERES REALISATION DE ROUTES	هوام و إخوانه لإنجاز الطرقات	Route Nationale N°16, La Rocade, wilaya de Tébessa	0555 62 28 23			
3734	5	4	\N	SECH / SOCIETE D'EXPLOITATION DE CARRIERES HASNAOUI	شركة لإستغلال المحاجر حسناوي	BP° 11 M, Zone Industrielle, Sidi Bel Abbes	048 56 52 21	048 56 76 52	sech@groupe-hasnaoui.com	
83	2	4	\N	ALITI FRERES	عليطي اخوة	Cité Ouled Aïch, Ouled Adouane. Aïn Kebira - Sétif	061 35 05 29			
2653	1	4	\N	MATAL	مطال	Zone industrielle, Lot 93, Oued Smar - W.Alger	025395330	0770681437		
2687	1	4	\N	RAYEH DES TRAVAUX DE CARRIERES	رياح للأشغال المحاجر	11, Rue Merabet Khoudir Sidi Mabrouk W.Constantine	031 62 17 64			
1868	2	4	\N	KEBBICHE FILS		Cité Kaaboob Coopérative El Kheir (19000) W.Sétif	070 31 18 25\n071 11 77 51	036 91 91 93	khkebiche@caramail.com	
13	5	4	\N	ECBBA / ENTREPRISE DE CONSTRUCTION DE BORDJ BOU ARRERIDJ		Zone Industrielle Route De M'Sila BP N° 118 BBA	035 68 53 25	035 68 53 37		
204	5	4	\N	SORETI / SOCIETE DE REALISATION DE TISSEMSILT		Route Bougar  W.Tissessilt	046 47 96 05	046 47 92 97		
3262	1	4	\N	CARRIERE HERITIERS GHENAI ABDELMADJID	محجرة ورثة غناي عبد المجيد	Rue Belagoun Commune de Sigus W, Oum El Bouagi,	07 73 88 60 50			
3504	12	4	\N	COOPERATIVE ARTISANALE EL NADJAH	تعاونية حرفية النجاح	Hai Meziane N° 315  W. Ain Temouchent	0770 96 37 25			
3035	1	4	\N	ASSIBAT	أسيبات	 BP5104 Inkouf 11000 TAMANRASSET	0661 142 551/0666 574 765	029 346 919		
4719	1	4	\N	GALA CERAM	قالا سيرام	Zone d'activité Gullel-Kasr Al Abtal-Setif.	0661 70 91 12	036 44 91 69		
4217	1	\N	\N	BRIQUETERIE MODERNE AMOURI  LAGHOUAT	مصنع الأجر العصري عموري الأغواط	RN    Groupe de propriétè N° 7        Section 7\r\nBenaacer  Benchorba      Laghouat	029  11 21 04 / 056168 27 30	029 11 21 04		
3551	12	4	\N	COOPERATIVE ARTISANALE ENNAKHLA	التعاونية الحرفية النخلة	Commune de Dahmouni   W.Tiaret	0773 783 343			
4620	1	\N	\N	TIN AKENDOUKEN	تين اكندوكن للذهب					
4531	1	\N	\N	SOCIETE G.A LIL HASSA	 ج.ا للحصى	Lotissement 316logements - groupe de propriété 154 classe 069 local 12 commune de M'sila CP 28000 M'sila	0661 21 25 30	035 54 63 05		
4506	1	\N	\N	صحراء اسفاون للتنقيب	صحراء اسفاون للتنقيب					
4507	1	\N	\N	 TINTAYET LITANKIB	تينتاطايت للتنقيب					
4621	1	\N	\N	TIN BAKIZAH	تين باكيزاه					
4515	1	\N	\N	BOUTANI MOUHAMMED LITNKAB ANI ZAHAB	بوتاني محمد للتنقيب عن الذهب					
3637	3	4	\N	EPRM / ENTREPRISE DES PRODUITS ROUGES MOSTEFA	مؤسسة المواد الحمراء مصطفى	Route de Sfisef, Bp 16 - Mostefa Benbrahim - Sidi Bel Abbès	040 40 41 82	040 40 42 21		
212	2	4	\N	NEKOURI & HAMADOU	نكوري و حمادو	13 rue Aouane Rabah Ain Abid, BP 02 El Buostane, Constantine	0660 705 451	031 81 72 92		
3944	1	\N	\N	BRIQUETERIE SBMT	بريكوتري أس بي أم تي	TEMACINE WILAYA D'OUARGLA BP 05	0555 00 69 65	029 63 48 94		
4295	1	\N	\N	ENTREPRISE TASSILI	مؤسسة الطاسيلي	Commune de Chafia Wilaya de TARF	0550 55 53 80	030 87 59 98		
4105	1	4	\N	GROUPE BOUHTIB	مجمع بوحطيب	Boulevard des martyrs   N° 106   Frenda  Tiaret	0555 94 18 67/ 046 41 56 34	046  41 56 34		
4688	1	4	\N	FB PROMO	ف ب برومو	Cité Boushaki D Lot n°181, local B au R.D.C,  commune bab ezouar, w alge.	031-48-16-49	031-48-16-49	sarlfbpromo@gmail.com	
4745	\N	\N	\N	01						
4746	\N	\N	\N	02						
3705	1	4	\N	CARRIERE AGREGATS DE L'EST	محجرة الحصى و الشرق	Djebel Mazela, Ouled rahmoun, W, Constantine	05 50 52 42 66	037 21 67 21		
1390	1	4	\N	CARRIERE D'EXTRACTION DE SABLE		Commune d'el mezraâ , daira d'el Ogla  W. Tebessa,				
3697	12	4	\N	COOPERATIVE ARTISANALE  EL ATLAS EXTRACTION DE SABLE		Hai El Izza , Commune de Sobha  W. Chlef	 0661 775 904			
3523	1	4	\N	SOCOPE CARRIERE	سكوب كاريار	21 cité des 141 logements, Sfisef, Sidi Bel Abbes	043 27 39 39	043 27 39 39		
3931	1	4	\N	CARRIERE ADHRAR	محجرة أذرار	Z.I Ain Mlila, Oum El Bouaghi	06 61 37 70 68	037 11 73 46		
3613	12	4	\N	COOPERATIVE ARTISANALE AOURAB TLEMCEN	التعاونية الحرفية أوراب تلمسان	Route de Safsaf, n° 48, Local n° 2 - Sidi Djaber - W.Tlemcen	0771 445 053			
3597	12	4	\N	COOPERATIVE ARTISANALE ALI MAACHI	تعاونية حرفية علي معاشي	Cheraita, Commune de Dahmouni, W, Tiaret	07 71 99 85 67			
3686	12	4	\N	COOPERATIVE ARTISANALE OULED BEN CHAIB	التعاونية الحرفية اولاد بن شعيب	Temda , commune de Guertoufa  W. Tiaret	0662 056 773			
528	3	4	\N	EL M'RISS	المريس	Tranche Rue de Annaba El Mriss W, Souk Ahras	07 72 59 46 27			
4361	1	\N	\N	TEKNOBRIK	تيكنوبريك	26 Route Sidi Abed lot 02 Tessala El Merdja Alger.	0560 036 060	023 58 30 40	Teknobrik.tech@live.fr	
4275	1	\N	\N	BRIQUETERIE KHADIDJA		Cité 630 Logements Tebesbest Touggourt	0555 037 975		khadidjabriqueterie@gmail.com	
3948	1	4	\N	PLATRE OULED DJELLAL	جبس اولاد جلال	06 Route Meftah, Oued Smar Alger	021 82 23 26	021 51 68 06		
3822	2	4	\N	CHEMLI ABDELKRIM ET FRERES EXTRACTION ET PREPARATION DE SABLE	شملي عبد الكريم و اخوانه لاستخراج و تحضير الرمل	Rue Mohamed Saber n° 27, Groupe 136, Secteur 248, Sétif				
2213	3	4	\N	CARRIERE GUIDOUM	محجرة قيدوم	Torrich Oued Lili Tiaret	075 490245			
2178	1	4	\N	MATERIAUX DE CONSTRUCTION ET TRAVAUX ET CARRIERES AYADI	مؤسسة مواد البناء و الاشغال و مقالع الحجارة عيادي	Rue Kanouni Tayeb, Ain Beida, wilaya d’Oum El Bouaghi	0661 59 86 92	032 47 61 56		
2179	5	4	\N	EDIMCO OUM EL BOUAGHI	مؤسسة توزيع مواد البناء أم البواقي	Cité Himi El Meki, W.Oum El Bouaghi	061 37 87 95			
211	1	4	\N	SCMC	شركة مقالع الحجارة و مواد البناء	Carrière SEDDIKI, Honaine ; Tlemcen	041 32 42 52	041 32 42 52	samirazzouz2010@hotmail.com	
3291	1	4	\N	OUEST SABLE	أوواست صابل	n° 06, Ain Nedjar,W, Tlemcen	043 21 47 08  0661 220 188	043 21 47 08		
4276	1	4	\N	Briqueterie Khadidja		Cité 630 Logements tebesbest Touggourt W. Ouargla	0555 037 975			
3562	5	4	\N	GROUPE HASNAOUI	مجمع حسناوي					
3959	1	4	\N	Société de matériaux de construction sadjia	شركة مواد البناء ساجية	Mezaourou, commune de Souhlia, Ghazaouet, W. Tlemcen.	0561 61 61 03			
3849	1	4	\N	HADDAD CERAMIC	 حداد سيراميك	05, Rue Khaled Abdelaziz, El Eulma - Sétif	036 87 67 67/ 68 68/ 69 69	036 87 65 65	elhidab_dz@yahoo,fr	
4783	1	\N	\N	BOUGHASSA LITANKIB	بوغسا للتنقيب					
4784	1	\N	\N	TINMERKIDEN LITANKIB	تين مركيدن للتنقيب					
3742	2	4	\N	SOCIETE GORI ET CIE FABRICATION DE BRIQUES	شركة قعري و شركاؤه لصناعة الاجور	Route de Cheria, Bir El Ater - W.Tébessa	037 44 62 09 / 0555 05 46 66	037 48 42 12 / 037 44 62 09		
4324	1	\N	\N	BRIQUETERIE HADJA MAMA		KSSOUR MEGARINE W. OUARGLA	0560 37 10 19			
3235	3	4	\N	HB EXPLOITATION ZELLAL	أش بي للاستغلال زلال	Hay Fréres Abed N°23, W, Chlef	07 91 71 04 55			
3517	12	4	\N	COOPERATIVE ARTISANALE EL HILLAL	التعاونية الحرفية الهلال	Lotissement 380 logements N° 116  Kanastel W.Oran	0661 215 942			
3471	1	4	\N	SOCOPE	شركة تجارة قطع الغيار و التجهيزات	Boulevard des 24 Métres, Sidi Boushak W,  Tlemcen	043 27 50 00/ 27 81 29	043 27 37 14/27 81 29		
4300	5	\N	\N	UMABT		Lot N°48, Senia, Oran 31 000	041 41 29 21	041 40 31 83		
3879	1	4	\N	CARRIERE BKH	محجرة ب ك ح	Djebel Azrou, Commune d’El M’hir, w Bordj Bou Arreridj.	0661 650 382 – 0556 253 524	024 93 92 93		
2715	1	4	\N	MAGHREB CANALISATION POLY	مغرب قنوات بولي	Quartier Z'Mala, Berrouaghia - W/Medéa	025 57 94 65	025 57 50 70		
3866	1	4	\N	BRIQUETERIE EL IZDIHAR	مصنع الاجر الازدهار	Commune Oum Ali, wilaya de Tébessa	0661 44 70 78	037 44 02 22		
4572	1	\N	\N	AMZAD  LI ZAHAB	امزاده للذهب					
4573	1	\N	\N	ORGUE NADJER	اورغ ناجر					
3975	1	4	\N	SOCIETE AWRAB	شركة أوراب	N°48 Local n°2 saf Saf , Sidi Djaber\r\nwilaya de Tlemcen	0772 15 99 56	040 92 82 52		
4517	1	\N	\N	AOUDJAR LITANKIB	أوجار للتنقيب					
4518	1	\N	\N	SAHEB KASSA	سهب كاسا					
3827	1	4	\N	BRIQUETERIE DE TAMAZOURA	مصنع  الأجور تمازوغة	06, Rue Boukhatem Ben Ahmed, Sedikia, wilaya d’Oran	041 43 16 60/0550 72 99 06/0661 10 00 91	041 43 16 60	sarlarabelle@yahoo.fr	
4510	1	\N	\N	TIT NOUDAD LITANKIB AN EZAHAB	تيط نوداد للتنقيب عن الذهب					
3714	12	4	\N	COOEPRATIVE ARTISANALE FERH	التعاونية الحرفية فرح	Cité Oudjelida  Ard Bouchnak  N° 9  W. Tlemcen	0661 222 254			
202	5	4	\N	ETRG / ENTREPRISE DES TRAVAUX ROUTIERS GUELMA	مؤسسة أشغال الطرق قالمة	BP 192, Route de l'abattoir ; Guelma	037 20 36 08	037 21 67 21		
203	1	4	\N	EL FATH	الفتح	Djebel Grouz- Ain Melouk, Chelghoum Laid, W, Mila	07 70 42 65 60			
224	3	4	\N	TOUAHRI AGREGATS	طواهري للحصى	08 Rue Announa - Guelma	071 30 01 34	037 26 69 35		
2306	3	4	\N	CARRIERE KEBBICHE RACHID	محجرة كبيش رشيد		070 42 23 60			
2416	1	4	\N	AMROUNE MATERIAUX DE CONSTRUCTION	عـمرون مواد البناء	Route de l'Université, Cité Djama - W.Bejaia	034 20 40 01	034 20 40 02		
2417	1	4	\N	SMCMG	أس.أم.سي.مي.جي	Village Mesloube MEKLA - Tizi Ouzou	026 34 19 99			
2418	3	4	\N	LAID MOHAMED GYPSOR	العيد محمد جيبسور	23, Rue Bab Azzoun  W/ Alger	061 50 54 14	021 71 47 43		
2973	1	4	\N	THCE	تي أش سي أو	Cité des Frères Hadji Avenue A n 3 Blida.	0550 99 55 77	017 78 18 68		
2335	3	4	\N	FAC MACO	FAC MACO	BP 91 Zone Industrielle Bouchakir - Laghouat	029 92 80 86 / \n061 64 03 23	029 92 80 86		
2336	1	4	\N	LITTORAL AGREGATS	الساحل للحـصى	Tizi N'Berber -Aokas - W.Béjaia	0549 23 33 61 / 0668 94 81 91	037 11 72 27		
2325	13	4	\N	CARRIERES DE L'OUEST	محاجر الغرب	Rue Hagni Hamou, Sidi Lakhdar - W.Mostaganem	045 44 72 08	045 44 72 08		
2036	1	4	\N	ROCADA	روكادا	Cité 38 logements CNEP - Oasis Nord - Laghouat	029 93 23 90\n029 90 39 81	029 93 23 90 		
3344	1	4	\N	BOUSSADA BUILDING MATERIALS	بوسعدة بويلدينق ماتريال	Cité 20 Aout Bt 3, n° 82, Rouiba - Alger	021 85 49 54/0774 77 32 20			
1615	5	4	\N	SODEPAC	شركة المنتجات المشتقة للغرب	Route Nationale N°13 Zhana W.Mascara	045 84 11 71\n045 84 11 61	045 84 12 57	www.sodepac-dz.com	
3329	12	4	\N	COOPERATIVE ARTISANALE OULED CHERIF		Commune de Oued Lilli  W. Tiaret				
85	1	4	\N	SAPRO / SOCIETE ALGERIENNE DES PRODUITS ROUGES	الشركة الجزائرية للمواد الحمراء	Zone Industrielle Barika - W.Batna	033 89 13 85 / 033 89 15 69 / 033 80 70 81	033 80 70 75		
2160	5	4	\N	EPTP ALGER / ENTREPRISE DES TRAVAUX PUBLICS D'ALGER	المؤسسة العمومية للأشغال العمومية بالجزائر	19, Boulvard Ali Sghir, Bordj El Kifane - Alger	044 31 96 20 - 044 31 96 37	044319680	eptp_alger_dz@yahoo.fr	
3475	1	4	\N	NOUR EL BADR IMPORT EXPORT	نور البدر للإستيراد و التصدير	Zone d'équipement n°46    Biskra	033 71 18 20	033 71 10 12		
3477	1	4	\N	BOUCHETA DE GRANDS TRAVAUX	بوشتة للأشغال الكبرى	rue Adrari Abdelkader  n° 3  Debdaba \r\nBECHAR	0661 26 19 64	049 80 14 20		
919	2	4	\N	SABLIERE FRERES MAHMOUDI LARBI & ABDELKADER & MOUSSA	مرملة الاخوة محمودي العربي و عبد القادر و موسى	Rue Kouadri Belgacem - W.Ain Defla	027 60 21 63	027 60 44 00		
1824	1	4	\N	CARRIERE LES FRERES BOUHZILA	محجرة الاخوة بوهزيلة	Ain Abid W.Constantine	061 35 20 29\n061 30 60 39	031 97 32 90		
2796	1	4	\N	CG AGREGA	شوشان قواسمية اقريقا	Hai el louze lot n° K64	061 55 48 71/070 94 50 41			
1855	1	4	\N	BERKAT PLOMBAGE SANITAIRE & GAZ & CHAUFFAGE CENTRAL	بركات للترصيص الصحي و الغاز و التدفئة المركزية	Lottissement Communal, Rue El Hayat N°201 Oum Ali, Tébessa	06 67 11 46 15	021 30 65 38		
2164	1	4	\N	PLATRIERE D'OGGAZ	شركة صناعة الجبس بعقاز	Lotissement 21 lots, Zone d’activités économiques, Zahana, wilaya de Mascara.	040 45 05 76	045 84 12 40		
995	1	4	\N	ECAU		BP N°30 Arris (5200) W.BATNA				
352	5	4	\N	SOTPAP / SOCIETE DE TRAVAUX PUBLICS LES ACTIONNAIRES DU PROGRES		Zone industrielle Tindouf	049 92 37 65	049 92 37 65		
1333	3	4	\N	CARRIERE KEDDARA	محجرة كدارة	Cité Bobillot Cage 01 - Sidi M'hamed - Alger	071 35 02 55			
1098	3	4	\N	CARRIERE ATTIR		Reguiba - El Oued	032 27 62 32			
920	3	4	\N	HAMMI		Tour C3 Entrée n° 08 Patrice Lumumba W/Annaba	070 48 16 68\n038 86 08 22			
921	1	4	\N	ETB & SABLIERE SIOUMI		Theniet El Hadjar - Bloc 49 n°10 - BP 102 - W.Médea				
2075	1	4	\N	UNION MILOUDI	إتحاد ميلودي	45, Bd Mohamed V -   W.Tlemcen	043 38 23 05	043 38 23 05		
2090	1	4	\N	HASSA TADJENA	حصى تاجنة	Rue de la Mosquée, Tadjenant - Mila	036 84 11 87			
3015	1	4	\N	GRADOR	قرادور	57 Avenue Houari Boumediene w/Borj Bou Arreridj	0560 06 45 80	035 72 20 91		
1363	3	4	\N	SOCIETE OULED HADJ PRODUCTION DE PLATRE		Cité Amir Abdelkader - El Hadjira - Ouargla	029 61 24 99			
1366	1	4	\N	SOCIETE LES DUNES BLANCHES DE SEL STILE	الكثبان البيضاء للملح سطيل ك.ب.م.س	Stile  W. MEGHAIER	0555017587	032 28 21 88		
1243	1	4	\N	CMCD / COMPLEXE DE MATERIAUX DE CONSTRUCTION DAHRA	مركب مواد البناء للدهرة	Cité Al Amir Khaled - W.Ain Defla	027 60 29 03 / \n027 60 31 11	027 60 28 99		
2202	2	4	\N	IBARAR & ASSOCIES TRAVAUX PUBLICS	ابرار و شركائه للأشغال العمومية	6, Fréha Centre BP 132, Daira de Azzaga W de Tizi Ouzou				
2203	5	4	\N	BAMAC TIARET		ZI Zarourra Tiaret 				
2747	1	4	\N	EXPLOITATION DE SABLE HADJAB ET KADDOUR	شركة استغلال الرمل حجاب و قدور	Cité belle air Ain el Beida - Oum El Baoughi	061 36 74 31			
2859	1	4	\N	ALAMA TRAVAUX PUBLICS	علامة للاشغال العمومية	01 Cité Snouber, 40 Logts Promotionnel, bloc01, Guelma	037 16 55 96	037 21 15 49		
3425	1	4	\N	SOTRAMA	شركة اشغال الطرقات و نقل البضائع و المحروقات	Route de Constantine, à coté de la mosquée Errahmane, wilaya de Tébessa	06 61 30 21 17	023 80 75 92		
551	1	4	\N	BATIAT	بتيات	15, Rue Embarek Boucif - W. Ain Temouchent	0771 22 79 84			
2574	3	4	\N	SOCIETE BENSLIMANE FATIMA ZOHRA	شركة بن سليمان فاطمة زهرة	Cité des 40 logements CNEP, Bt 1 Entrée n° 5, Mecheria - W.Naama	0553 589 126			
2412	5	4	\N	EVSM	مؤسسة المرافق العامة لسيدي موسى	Route de Dar El Beida, BP N°13 - Sidi Moussa	023 90 01 18	023 90 01 47		
1468	1	4	\N	SOTRAC SUD	SOTRAC SUD	Cité Mosquée El Atik - Hassi Messaoud - W.Ouargla				
2892	1	4	\N	SALAMANI MATERIAUX DE CONTRUCTION	سلماني لمواد البناء	Rue Larbi Tebbessi n° 65/16 Bou Saada w/M'sila	061 68 88 22/061 69 97 67	035 52 27 21		
2780	1	4	\N	MAHDJARET IKDJANE	محجرة إقجان	Kef Haddada, Commune Beni Fouda, W, Sétif	0661 705 902	036 743 048		
1971	3	4	\N	EZZAOUIA	الزاوية	1, Rue Meziane -Dahmouni- W.Tiaret				
1608	1	4	\N	TPO		BP 76 - Place El Houria - Touggourt - Ouargla	029 68 17 44	029 68 12 15		
2658	2	4	\N	SAHLI & CIE	سهلي و شركائه	Cité Chiadi Kada, Aflou - W.Laghouat	029 92 95 25			
2333	1	4	\N	ENALER		145, Bd Krim Belkacem - Alger	021 51 50 03	021 51 62 76		
1569	1	4	\N	CARRIERE SID	محجرة صيد	Djebel Loussalit Ain Fakroun W.Oum El Bouaghi.	0771 02 18 01			
1680	1	4	\N	CPA / CENTRE DE PRODUCTION D'AGREGATS	مركز انتاج الملاط	Route de Targe commune de El Malah w/Ain Temouchent	061 20 19 53/041 53 70 41	041 53 70 42		
371	1	4	\N	UCPAC	شركة المحاجر وانتاج الحصى و توزيعها	Cité Oued El Aneb, Berrahal ; Annaba				
2729	1	4	\N	SOCIETE D'EXPLOITATION DE CARRIERES DE SABLE	شركة إستغلال محاجر الرمل	25, Rue Larbi Ben M'hidi, Arzew - W.Oran	041 47 65 66 / 072 26 82 96	041 47 65 66		
579	1	4	\N	UC YAZEROU	أو.سي يازرو	09, Rue Belaaziz M'Hamed -Sidi M"Hamed Benaouda- W.Relizane.	0772 52 39 57			
2369	3	4	\N	ENFOC	انفوك	Route Tikdjeda (face Protection Civile) -Commune de Bouira-  W. Bouira	0662 18 81 47 – 0661 62 75 22	026 83 83 94		
3534	3	4	\N	HANANCHA EXPLOITATION DE CARRIERE	حنانشة لاستغلال محجرة	Cité Oued Deheb BT K N°04 Korozou Annaba	038 84 04 82	038 84 04 82		
3629	12	4	\N	COOPERATIVE ARTISANALE SARA AGREGATS	التعاونية الحرفية سارة للحصى	N°58  Cité MesriMiloud   W. Tiaret	0770 373 806			
2010	1	4	\N	SOAB / SOCIETE OUM ALI BRIQUETERIE	شركة أم علي للأجور	Cité Oum Ali Batiment 7 n°13 Tebessa\r\nwilaya de Tebessa	0661 58 43 80	037 44 02 09		
1348	1	4	\N	CERAMIQUE BALAOUANE	خزف بلهوان	Route de Chaïba - Bou Smail - Tipaza 	024 46 46 74	024 46 48 42	cer-balaouan@hotmail.com	
2283	1	4	\N	CIRTA CERAMIQUE	خزف سيرتا	Zone Industrielle  BP n° 29 Didouche Mourad - W de Constantine	031 90 67 14	031 90 67 14		
2081	1	4	\N	TUFEAL	توفيال	Centre commercial Yennayer 94, Immeuble n° 16, Rue des frères Belhadj, Nouvelle ville -\r\n W.Tizi-Ouzou	026 41 13 31/070 98 16 56/061 66 11 02	026 41 13 31	sarltufeal@yahoo.fr	
2041	1	55	\N	INGRA ALGERIE	انقرا الجزائر	22, Rue Mohamed Ayache - Med Belouezdad - W.Alger	021 63 32 00\n061 56 20 34	021 63 32 00		
2228	5	4	\N	EPTP CONSTANTINE	المؤسسة العمومية للأشغال العمومية بقسنطينة	Zone Industrielle le Palma BP 197 - W.Constantine	021 81 75 36	031 66 80 63		
1619	3	4	\N	CARRIERE KHELILI MOHAMED	محجرة خليلي محمد	Oum El Tiour - El Meghaïer - El Oued	032 21 94 93	032 21 94 92		
2318	2	4	\N	MORSLI & FRERES	مرسلي و اخوته	Rue Rabah Sidhoum - Médea	025 58 63 42	025 58 29 32		
24	3	4	\N	ROUABEH CARRIERE	روابح محجرة	45 Rue Benflis Batna	033 81 79 80	033 85 31 59		
2847	3	4	\N	MAROUA SANABEL	مروة سنابل	Zone des Activité Commerciales n°18 sedrata	037 37 70 29/0661 39 03 32	037 37 76 07		
3326	2	4	\N	PROTECT ISOL GUEDRI ET CIE	بروتاكت إزول قدري و شركائها	Cité des 600 Logts EPLF BD Colonel Si Salah Bt E Local N° 33 W, Tizi Ouzou,	0771 55 28 50	026 21 18 60	imrirsen.fel@hotmail.fr	
2606	1	4	\N	ATH BOUBAKEUR CARRIERE	أث بوبكر للمحجرة	Mechtat Ouled H'mida, djebel Youcef\r\nBir Haddada Wilaya de Sétif	0771 50 69 98			
2572	2	4	\N	ETTRHB BENBRAHIM FRERES	أو.تي.تي.أر.أش.بي. بن براهيم اخوة	Route Derrich RN 24 - Boumerdès	070 54 93 16			
2573	1	4	\N	SOIREM	ســوارم	51, Rue Belbachir Mohamed Larbi, Mecheria - W.NAAMA	0776 28 78 98			
2043	1	4	\N	CARRIERE TD BB	محجرة تي دي بي بي	57 avenue Haouari Boumediene-wilaya de Bordj Bou Arreridj	0771 29 05 56	035 68 53 86		
2044	3	4	\N	CARRIERE LEMOUCHI	محجرة لموشي	Coop El Nahda N° 114 El Athmania W, Oran	07 71 45 93 92	043 65 83 43		
458	5	4	\N	SOTRAMO	شركة ذات أسهم الأشغال البحرية للغرب	Ilot 27 Zone USTO BP 1004 EL MENAOUER Oran	041 42 96 22/\n041 42 96 23	041 42 96 30	sotramo@elbahia ceriste.dz	
459	3	4	\N	CHABANI BATIMENT	شعباني للبناية	Résidence Chabani, Val d'Hydra - Alger	021 69 36 14	021 69 32 64		
2759	1	4	\N	SALMAT	سلمات	Salmane n° 03, commune de Ouled Derradj - W.M'Sila	0555 048 719/0671 121 616	035 398 444		
2760	1	224	\N	SERFI AL		03, Rue Bentouati Said - BP 65 Saint Cloud - Annaba	038 87 15 17 / 038 87 11 72		annaba@serfisas.com	
363	1	4	\N	ZAABAT CHEIKH PRODUCTION AGREGATS	زعباط الشيخ لانتاج الحصى	PB 231 Ouargla 30000	029 76 90 10/063 69 32 13			
2993	1	4	\N	ARAB TRADING HOUSE EST	مؤسسة البيت العربي للتجارة	Coopérative Asma, villa N°19 Birkhadem Alger.	021 55 02 14 / 021 55 20 28	021 55 01 79 / 021 55 00 92		
712	5	4	\N	KANGAZ		BP 69 - Gué de Constantine - Kouba - Alger	021 83 91 02	021 83 91 44\n021  83 91 49		
713	1	4	\N	KARA	قارة	BP 382 - Berouaguia - Médéa	025 62 66 30			
2764	1	4	\N	ZATI TRANSPORT DE MARCHANDISES	زتي لنقل البضائع	Cité Soualhia, Ain M'Lila - W.Mila	054 50 57 41			
1829	3	4	\N	SIBOUSSE		Cité El Bouni Bloc C 24 N° 375 W/Annaba				
3761	3	4	\N	LES MOULINS OULED MAALAH	مطاحين أولاد مع الله	Achasta Ammour, Section 04, ilot N°18, w. MOSTAGANEM.	045 20 00 75 – 0770 529 285	045 20 00 74.		
3680	12	4	\N	TABNA POUR LE SABLE	طبنة للرمال	Mechtat keraif  Commune de Betam  W. Batna	0661 638 790			
3532	3	4	\N	CARRIERE EL KHARBA	محجرة الخربة	Carriére Kherba, Zemoura - Relizane	0550 49 68 33	045 26 44 44		
284	3	4	\N	SIDI BELKACEM	سيدي بلقاسم	Route Ain Guesma, Commune De Tiaret W, Tiaret	07 73 24 00 80			
2685	3	4	\N	ENTREPRISE FERHAD EXPLOITATION CARRIERE D'AGREGATS	مؤسسة فرحاد استغلال محجرة الحص	RN 4, Bir Saf Saf - Oued Fodda - Chlef				
3227	3	4	\N	COPRODE	كوبرود	8 Avenue Zaabane,W,Constantine	0770 96 04 21	031 82 43 03		
81	3	4	\N	ENTREPRISE AIT IDIR BELGACEM	مؤسسة أيت ادير بلقاسم	Azro, village de Talmate, Beni Ouertilane, w-Sétif 19 701	0550 01 74 03	021 44 45 45		
82	5	4	\N	SNTF		Unité de Traverses Béton Armé, 15 Rue Colonel Amiorouche, Rouiba - Alger				
1457	3	4	\N	ASTRA AGREGATS		29 Rue de Keddara Lakhdaria  W. Bouira	071 58 28 48			
1458	5	4	\N	S.C.AL / Société des Ciments de l'Algérois	شركة إسمنت العاصمة	BP 62 - Raïs Hamidou - 16080 - Alger	021 70 93 22 – 70 98 87	 021 70 95 65		
975	1	4	\N	SMS / SOCIETE DE MARBRE DE SKIKDA	شركة الرخام سكيكدة - SMS	Zone D' activité les platanes, Filfila BP 95 - W.Skikda	038 70 78 26 / 038 70 25 05	038 70 77 02 / 038 70 39 09		
2177	5	4	\N	S.CI.B.S / Société des Ciments de Beni Saf	شركة الاسمنت لبني صاف	BP 22 - Sidi Sohbi - Beni Saf - W.Ain Temouchent	043 64 59 71/59 76	043 64 39 74	scibs2003@yahoo.fr	
1970	1	4	\N	BCF / BRIQUETERIE CONSORT FELLA	بريكوتوري فريق فلة	Bir  El Djir - W.Oran	041 56 45 72	041 56 43 38		
2730	3	4	\N	MCIRDI TRAVAUX PUBLICS	مسيردي للاشغال العمومية	83,Rue El Maghrib à Nédroma  w/Tlemcen	071 20 58 55			
744	3	4	\N	BOUROUIS HACENE		Cité Aissa Boukerma (21000) W.Skikda	038 70 47 10	038 70 35 04	bourouishacene@hotmail.com	
748	1	4	\N	EPSU		15, Rue IBN Khaldoun  W. Ain Temouchent				
2127	2	4	\N	AIBECHE & CIE	عيبش و شركائه	BP N° 4 Ain Smara W.Constantine	061 30 03 37	031 62 21 28		
1456	3	4	\N	KEF EL GHOULA		BP 08 - Ksar El Boukhari - W.Médea	027 87 63 86			
2320	2	4	\N	FRERES FERGATI	الاخوة فرقاطي	Djebel Aougueb, Oued Atmania - W. Mila	0550 500 715	036 74 30 48		
2986	5	4	\N	SERUB	المؤسسة العمومية الاقتصادية للكهرباء الريفية و الحضرية باتنة	Zone Industrielle Cité Kchida w/Batna	033 22 25 57	033 22 25 30		
1711	1	4	\N	SEMC / SOCIETE D'EXPLOITATION DES MINES & CARRIERES ZENATI	شركة إستغلال المناجم والمقالع زناتي	15, Chemin Parmentier - Hydra - W.Alger	021 60 40 28/\n071 22 98 58	021 60 40 28		
2883	5	4	\N	ASECCIMENT / ALGERIA CEMENT COMPANY	اسيك الجزائر للاسمنت "اسكسيمنت"	Coopérative El Bina, villa n°12, lotissement n° 03 - Dely brahim - Alger	021 91 83 33	021 91 95 91		
2885	1	4	\N	IGHIL ALI TRAVAUX DE CONSTRUCTION TCE	اغيل علي لاشغال البناء و تي سي او	Hai El Moustakbal Sedrata w/Souk Ahras	061 26 88 59/069 60 99 21			
614	5	4	\N	EPTRO		37, Avenue des Martyrs de Révolution -El Hamri- W.Oran	041 35 46 01\n041 35 18 78	041 35 47 83		
615	3	4	\N	ENTREPRISE D'AGREGATS CHERGUI MOHAMED		36, Avunue Zaâtcha 07000 W/ Biskra	033 73 22 29	033 73 75 35		
616	1	4	\N	EXPLOITATION D'AGREGATS	إستغلال منجمي	4, Rue Khaled Ibn Walid, Oran - W.Oran	0673 28 97 62 – 0661 20 77 79	040 22 70 44		
2741	3	4	\N	BOUSSID GADDA IMPORT - EXPORT	بوصيد قادة للاستيراد و التصدير	Cité El Fedjer N°122 Zmala - Batna	07 71 43 83 11	033 88 79 69		
288	5	4	\N	AGGLOS EST	أقلو س - أست	Agglo-Est RN n° 3  Village Zighoud Youcef	031 91 94 56			
2939	1	4	\N	AMOURI GRANDS TRAVAUX PUBLICS	عموري للاشغال العمومية الكبرى	ZI Boucheker w/Laghouat	029 92 82 35	029 92 82 35		
299	1	4	\N	ZEDIM		Poste de Ouled Mehala, Aïn Oulmene; Sétif				
1496	2	4	\N	CARRIERE OULED ARAMA DES FRERES BRAHIMI	محجرة أولاد عرامة الإخوة براهيمي	Cité Djebel Ouahch n° 535 W. Constantine	070 90 29 63			
4436	1	\N	\N	ELFAGH LITANKIB	ألفاغ للتنقيب					
4764	\N	\N	\N	20						
564	5	4	\N	CATOF / CARRIERE TEMOULGA OUED-FODDA	محجرة تمولقة وادي الفضة	Bir Saf  Saf  RN 4 BP N°1- Oued Fodda-  W.Chlef.	027 74 00 80	027 64 75 67		
4003	1	4	\N	SOCIETE GRAND TRAVAUX ET ROUTES EL DJAZIRA EL ARABIA	شركة الاشغال الكبرى و الطرقات الجزيرة العربية	 Lotissement 177 Lots, Rue Bezzazi Sebti n° 25, W, Guelma	037 26 04 25	037 26 04 25		
3060	1	4	\N	BILBAO	بيلباو	ZI, Lot n° 184 - Rouiba - Alger	021 81 29 16	021 81 28 95		
3343	3	4	\N	KS MINES	ك.س مين	Hai Zoubiri Ouled Belhadj     villa n° 24\r\nSaoula Alger	0776 22 17 97	021 23 21 07		
2688	2	4	\N	DISMAC / SOCIETE DES FRERES RAHMOUNE	شركة الاخوة رحمون ديسماك	RN ALGER - W.Chlef	027 71 09 98 / 027 71 09 57	027 71 09 66		
2601	1	4	\N	EL HAMED	الحامد	117, Route Neuve - Bouzareah - W.Alger.	021 90 91 37	021 90 45 95		
3022	3	4	\N	ENTREPRISE TRAVAUX PUBLICS BEDJAOUI DJAMEL	مؤسسة الأشغال العمومية بجاوي جمال	69, rue Ali Haddad  El Mouradia  W. Alger				
3023	3	4	\N	ENTREPRISE DES TRAVAUX PUBLICS ET ROUTES AISSANI GHANEM	مؤسسة الأشغال العمومية و الطرق عيساني غانم	Boulevard Houari Boumédienne  W. BBA				
3027	1	4	\N	LATINO CERAM	لاتينو سيرام	05 Rue Abdelaziz Khaled, Eulma W- Setif.	036 87 67 67 / 68 68 / 69 69	036 87 65 65		
1045	3	4	\N	SABLIERE EL BARAKA		62, rue Ali Abdenour W.Skikda	038 76 21 14\n06133 08 37	038 75 77 78		
3164	1	4	\N	BRIQUETERIE FRERES MOHAMEDI	بريكاتري الاخوة  محمدي	37 Rue Grine  Belkacem, W, BATNA	033 85 16 22	033 85 16 22		
3662	1	4	\N	BERKAT POUR PLOMBAGE SANITAIRE ET GAZ ET CHAUFFAGE CENTRAL	بركات للترصيص الصحي و الغاز والتدفئة المركزية	Lottissement Communal, Rue El Hayat N°201 Oum Ali, Tébessa				
2386	1	4	\N	POTERIE TRADITIONNELLE M'CHOUNECHE	فخار تقليدي مشونش	BP n°13 -07130 M'Chouneche -W.Biskra	033 72 11 66	033 72 11 66		
240	5	4	\N	BATIWIT		BP 61 AT  Abou Tachfine ; Tlemcen	043 20 64 57	043 20 32 03		
2635	3	4	\N	TOUATI AHMED MOHAMED NOUEDDINE TRAVAUX DE ROUTES & AEROPORTS	تواتي احمد محمد نور الدين لاشغال الطرقات و المطارات	Sahene 02 - W. El Oued	032 21 09 39			
1027	3	4	\N	HADIBI SABLE		Cité des allées du 20 Aout 1955 Batiment 22 N°06  W.Skikda	038 72 13 24\n038 72  20 36\n038 72 21 67			
1029	1	4	\N	GYPSE GUERGOUR	جبس قرقور	Boulevard Mohamed Chinoune - Bougaa - W.Setif. \r\nLebhaïr, Village En Nekhla, Hamam Guergour - W.Setif.	036 80 37 49 / 0774 70 20 31	036 80 45 57		
2692	1	4	\N	CARRIERE KEBBICHE RACHID	محجرة كبيش رشيد	Coop Immobilière El KHEIR, Cité Kaaboub Rue DaliMokhtar,  Setif	0661 14 20 40 / 0555 09 42 15			
1861	1	4	\N	SAPAM / SOCIETE ALGERIENNE DE PRODUCTION D'AGREGATS MAHOUNA	الجزائرية لانتاج الحصى و الرخام ماونة	13, Rue Zighout Youssef - W.Guelma	037 21 23 10	037 21 57 30		
325	1	4	\N	MODERN CERAMICS	شركة الخزف العصري	02, Route d'Ouled Fayet - Dely Brahim - Alger 	021 36 32 69	021 36 58 80		
3689	12	4	\N	COOPERATIVE ARTISANALE ERRIHANE ECHERGUI	التعاونية الحرفية الريحان الشرقي	Seguiet El Ouldja  Commune de Sidi Ameur  W. M'sila	0770 889 234			
4548	1	\N	\N	NOUR LITANKIB ANI ZAHAB	نور للتنقيب عن الذهب					
1880	1	4	\N	EL DJALOULIA EXTRACTION & PREPARATION DE SABLE & SUBSTANCES GRANIRIQUES	الجلولية استخراج و تحضير الرمل و المعادن الغرنيتية	ZI de Souk Ahras, BP 354	0770 311 874	037 71 60 56		
1340	1	4	\N	SOPEM		El Koudia - BP 1083 - W.Tlemcen	043 27 84 53 / \n043 27 21 61	043 27 25 92	dennouni@maildz.com	
892	3	4	\N	CARRIERE DE PLATRE BOUCHAREB HADDA	محجرة الجبس لبوشارب حدة	Commune Ain Yagout - Daïra de El Madher - W.Batna				
2048	3	4	\N	AKAGECO	اكاجيكو	Cité 05 juillet - Ain M'Lila -  W.Oum El Bouaghi	061/34 00 09	032 44 67 84		
261	5	4	\N	EPR AURES	مؤسسة المواد الحمراء الأوراس	EPRA Taouzient Daira de Kais Khenchela	032 36 82 19	032 36 11 04	epra.fais@gmail.com	
262	1	4	\N	NOUVELLE BRIQUETERIE DE LA SOUMMAM	مصنع الأجر الجديد للصومام	Z.I Ihadaden BP 133 TERR Bejaia	034 21 20 61			
3094	1	4	\N	ISSAADI.COM	اسعادي كوم	25,Rue Dhebi Mohamed w/Sétif	061 36 25 64	036 86 68 27		
1881	5	4	\N	EPTP GHARDAIA	المؤسسة العمومية للأشغال العمومية لغرداية	BP 10 - Zone Industrielle Bounoura - 47133 - W.Ghardaïa	029 87 34 82/029 87 31 28	029 87 34 82/029 87 31 28		
866	1	4	\N	CCB / CHLEF CERAMIC BRICKS		Zone Industrielle -Oued Sly- W.Chlef.	027 71 09 29	027 71 09 99		
3144	3	4	\N	M.D.M.I	أم.دي.أم.أي	Coopérative Immobiliére AMN el Hayet Bouaroua W / Setif	0661/35/45/45	036/83/22/29		
3602	12	4	\N	COOPERATIVE ARTISANALE SAADA	تعاونية حرفية السعادة	Route D'alger06/297 Bousaada, W, M'sila	07 70 23 57 23			
4350	2	\N	\N	CARRIERE KOREIB ET ASSOCIES	كاريار كريب و شركاؤه	Tizi Hadja, Terny, W, Tlemcen	043 43 76 76	043 43 76 76		
4666	1	\N	\N	TADJROURAS LITANKIB ANI ZAHAB	تجروراس للتنقيب عن الذهب					
4667	1	\N	\N	AFGHEGHATEN LI ZAHAB	افغغاتن للذهب					
3124	1	4	\N	ML CARRIERE	أم.أل محجرة	24 RUE DAOUD SALAH   AIN AUGLE   SETIF	0661 35 05 76	036 95 62 08		
4095	1	4	\N	GETRAMAT	جترامات	Route Du Piton BP N° 75 A -Akbou - W.Bejaia	034 36 30 65	034 36 30 64		
2313	3	75	\N	QUALITRACK	QUALITRACK	28, Rue Timgad, Hydra - Alger 16035	021 69 14 74	021 69 14 76		
2927	5	4	\N	ASCSP / AGREGAT SABLE DE CONCASSAGE SOCIETE DE PRODUCTION	أ أس سي أس بي - شركة انتاج الحصى رمل التكسير	Rue beau séjour villa n° 09 Bir Mourad Rais Alger	017 06 24 43	017 06 24 43	ascsp_dg@yahoo.fr	
3123	1	4	\N	CMVI	صناعة و تركيب السيارات الصناعية	Zone D'activité Route de Relizane W, Mostaganem	0770 44 44 44	045 21 84 01		
2143	1	4	\N	EL MANEL	المنال	16, Rue Zennine Larbi - Annaba	062 57 67 99			
3990	1	\N	\N	SOREM/ Sociétè de Recherche et d'Exploitation Miniére	شركة البحث والإستغلال المنجمي	21, Vallée des jardins, wilaya de Mostaganem	0770 44 44 44	045 26 10 02		
4387	7	\N	\N	DIVINDUS DMC	ديفندوس توزيع مواد البناء	Zone d'entrpôt et activité ZEA BP 02, Wilaya, Sétif	032 54 00 40			
4284	1	\N	\N	TILATOU PRODUITS ROUGES	تيلاطو للمواد الحمراء	Rue Colonel Amirouche    Barika    Batna	0665 11 26 27	038 42 76 54		
2365	5	4	\N	EPTR SUD - EST	المؤسسة العمومية لأشغال الطرق جنوب- شرق	BP 83 Benboulaid, Z I, W, Batna	(033)22 24 36- (033) 22 24 43	(033) 22 24 39		
3172	1	4	\N	ADIBA CARRIERE	اديبة محجرة	24, rue Harmel Slimane, Sidi Bel Abbes	0555 082 209	048 58 63 97		
2856	1	108	\N	NATIONAL SERVICE COMPANY WATERS SERVICES	ناسيونال سرفيس كومباني واتر سرفيس	17 Chemin de la Madeleine, Ben Aknoun, Alger	023 47 28 64	023 47 28 66		
2858	2	4	\N	BELHADI ABBES & CIE	بلهادي عباس و شركائه	Poste Remada, commune Ain Lahdjar  - W.Setif	061 35 32 39			
3877	1	4	\N	AGGLOMERES DE L'EST	مجمعة الشرق	Zone d'activité Taharacht, Commune Akbou - W. Béjaia	034 19 61 01	034 19 61 01		
3515	3	4	\N	ANABIB MOSTA	أنابيب موستا	28 , Vallée des jardins BP 427  Cité du 5 Juillet  W. Mostaganem	0770 592 283			
3556	12	4	\N	COOPERATIVE ARTISANALE OULED ZIAD	التعاونية الحرفية أولاد زياد	Route de Rogassa W. El Bayadh	0797 157 064			
3719	1	4	\N	TIARET AGREGATS	تيارت للحصى	47 Rue Brahim Mansour medrissa W. Tiaret	0556 209 233	026 20 04 35		
2985	1	4	\N	GRAVMEX / GRAVIER MATERIAUX EXTRACTION	قرافمكس قرافيي ماتريو اكستراكسيون	Bouchéne commune de Taskriout Daira de Derguina w/Bejaia	034 38 61 34/061 63 01 42	034 38 61 34		
4039	1	4	\N	EL BARAKA EL AOURASSIA	البركة الاوراسية	Dechera Ain Zina Bouzina, Batna	033 84 80 14	033 84 80 14		
2806	3	4	\N	BRIQUETERIE AMOURI TOUFIK	مصنع الاجر عموري توفيق	Route Ntaionale n°1 Cooperative n°06 Classe 71 Commune  Ben Nacer \r\nBen Chohra - W.Laghouat	029 11 18 18	029 11 18 18		
2595	3	4	\N	CARRIERE TOUKA	محجرة تـوكـة	Cité du Stade N° 1 - Tiaret				
3826	1	4	\N	CARRIERE FRERES GUEZLANE	محجرة الإخوة قزلان	Cité Goudjlia Rabah n° 15, Ain Mlila - Oum El Bouaghi	0550105879/0778357930		samir4387427@gmail,com	
4061	2	4	\N	CARRIERE DEBACHE ET MENASERI	محجرة دباش و مناصري	Lot 20 Logts, commune Ouled Mellouk, Mila	06 65 15 59 46			
3020	3	4	\N	ENTREPRISE DES TRAVAUX PUBLICS ET ROUTES OULED MAATALLAH	مؤسسة الأشغال العمومية و الطرق أولاد معطالله	route sidi demed  Ain Boucif   W. Médéa				
2752	1	4	\N	ADRER AZIZA	اذرار ازيزة	Ouled Hsasna Bp n°61, El Boustane, Commune d’Ain Abid, wilaya de Constantine.	0771 54 97 56			
3910	1	4	\N	BRIQUETERIE EL AMOURIA	مصنع الأجر العمورية	Zone Industrielle, RN°03, Djemaa, wilaya d’El Oued	032 25 70 53 - 25 64 58	032 25 88 22		
1769	1	4	\N	ADHRAR AMELLAL	أذرار أملال	BP 172 Ain Abid, Constantine	0661 352 029	031 97 32 90		
3766	5	4	\N	CILAS	سيلاس	Tour n° B, Centre Commercial Bab Ezzouar, 5ème étage Bureau 520 ,   Alger.	021 89 20 00	021 89 20 01		
4734	3	4	\N	ABATURAB	اباتراب	C,Hayat,Regency ilot 8, Porte 7, Commune de Sidi Chahmi, Daira Es-Sénia, W,Oran.	0674 92 53 86			
3929	1	4	\N	CORSO CERAM	قورصو سيرام	BP 62 Ben Rahmoune Corso w.Boumerdes	024 95 71 67-69	024 95 71 67		
3500	1	4	\N	MOUAADH	موعاذ	Hay Ain Naâdja Section  04/A Gué de Constantine   W. Alger	0779 06 31 69	025 44 52 66		
4416	\N	\N	\N	POLECERAM	بول سيرام	87 Cité Ezzouhour Villa Guerouache Bordj Bou Arreridj	0661 68 09 64	035 73 40 23		
4605	1	\N	\N	TAFASSASSET LITENKIB	تفساست للتنقيب					
3847	1	4	\N	DPR AXXAM	دي - بي - أر -أ - إكس -إكس- أم	Village Tissi Tizi, Commune Samaoune - Bejaia	0661 219 607 / 0770 939 394	034 219 607		
4201	5	\N	\N	MINES DE FER DE L'EST	شركة مناجم حديد الشرق	Mine de Boukhadra,  W. Tébéssa				
1860	3	4	\N	CARRIERE BELAZIZIA ZIDANE	محجرة بلعزيزية زيدان	Djebel Loussalit - Ain Fakroun - W.Oum El Bouaghi	0661 52 90 14			
1654	1	4	\N	SABRID	الشركة الجزائرية للاجر جلفة	Zone Industrielle - BP 618 - Djelfa 	027 87 17 68 / \n027 87 66 60	027 87 50 19		
2837	2	4	\N	STE INTERNATIONALE AHMED MESSAOUD & CIE	شركة الدولية احمد مسعود و شركائه	Avenu Amara Youcef Bt n° 89 W/Blida	070 97 59 66/070 04 25 03	025 42 42 56 /025 38 74 00	rachid_ctam@hotmail.com	
3679	3	4	\N	CARD TPH	كارد.تي.بي.اش	Akfilen ;Commune de Illiten ,Daira de Iferhounen  W. TiziOuzou	0061 660 434			
4747	\N	\N	\N	03						
2168	3	4	\N	ENZEM / ENTREPRISE ZERROUGUI D'EXPLOITATION DES MINES	مؤسسة زروقي لاستغلال المناجم	27, Rue Vector Hugo - Souk Ahras	070 42 13 41 			
2960	1	4	\N	ROAD WORKS COMPANY	رواد وورك كومباني	03 Rue Parc Andalousse Ben Aknoun w/Alger	061 55 78 09	021 91 61 71		
3843	1	4	\N	MEDJDOUB AUTO	مجدوب أوتو	Lot 209, n° 04, RDC, Ain Arnet, Sétif	0770 94 78 33	036 92 40 57		
3844	3	4	\N	ETP DJEFAL HOUCINE	مؤسسة الاشغال العمومية جفال حسين	Rue 24 avril, El Kala, El Tarf	038 66 01 70	038 66 19 44		
2950	3	4	\N	CARRIERE ABDENNACER	محجرة عبد الناصر	Route de Sidi Bel Abbés Ouled Mimoun w/Tlemcen	0663 97 88 27			
4732	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
4750	\N	\N	\N	06						
4390	1	\N	\N	GM MINE	جي أم مين	Khalfoune Ilot n° 08, Section 15, Commune de Mezloug, Sétif	036 74 30 48			
3681	12	4	\N	ZAHRET  EL KOUTBANE ERAMLIA	زهرة الكثبان الرملية	Mechtat Ouled Derradj  Commune Azil Abdelkader   W. Batna	0661 357 103			
3434	3	4	\N	SAIDAMINE	سايدمين	Coopérative EL NOUR cité Khemisti Bir El Djir ORAN./ 15, rue F Hassi Ameur Oran	0550 56 94 87/0770 17 43 12		peapland@yahoo.fr	
3522	12	4	\N	COOPERATIVE ARTISANALE SIDI ALLAL	التعاونية الحرفية سيدي علال	Medroussa W. Tiaret	078 661 192			
2559	1	4	\N	FRERES BENYOUCEF CONCASSAGE	الاخوة بن يوسف تفتيت الحجر	Cité 05 Juillet, Bt 87 D, Lot 2 N°1, Bab Ezzouar, wilaya d’Alger	0550 58 32 45	021 24 62 65		
2117	3	4	\N	UNI GRANULATS	أوني للحصى	 BP 9 Tlemcen /33, rue Mustapha W.Tlemcen	043 27 33 44 /45	043 27 22 70	ouched_mered@crima-dz.com	
3942	1	\N	\N	TEDJINI LAID	تجيني العيد		0555 00 69 65	029 63 48 94		
1689	3	4	\N	KRIBI MESSAOUD	كريبي مسعود	Section 20, Groupe 72, Delly Brahim, Wilaya d’Alger.	0661 62 14 47	023 72 91 52		
1690	3	4	\N	AGREGATS BOUAFFAD	أقريقا بوعفاد	70, Rue Frères Madadi - W.Alger	061 65 07 46			
1367	3	4	\N	CARRIERE & LOCATION D'ENGINS & TRAVAUX PUBLICS SILOUENE	محجرة و إيجار العتاد و الأشغال العمومية سلوان	Zedigua -Amieur -W.Tlemcen	070 94 59 07 / \n061 22 02 83			
3197	1	4	\N	CARDOMOS	كاردوموس	Djebel Essakakine, commune de Ain Lahdjar W, Sétif	0553 672 754			
4599	1	\N	\N	IHADANAREN LI ZAHAB	اهضانارن للذهب					
1899	1	4	\N	EL WAFFA	الوفــاء	Rue 24 Avril, El Kala W/El Tarf	038 66 01 70	038 65 07 28		
4000	1	4	\N	EL SALIHINE	الصالحين	Rue El Ahram, N° 07, W, Annaba.	: 05 57 20 19 86	021 20 51 20		
3713	12	4	\N	COOPERATIVE ARTISANALE KEDICHA	التعاونية الحرفية خديشة	Cité Coop Tourabia   924 N    235/12/  W. M'sila	0791 051 924			
1158	1	4	\N	SABLIERE EL FATH		Cité Ain  Beida 139 logements n° 80 Es Senia  W/Oran	021 68 89 22	021 68 89 22		
4798	1	4	\N	YETREB	يثرب	Cité 124 Logts, Lot Belle Air, Sigus, Oum El Bouaghi	06 68 29 19 66			
3417	1	4	\N	BNS / BRIQUETERIE NOUVELLE DU SAHEL	مصنع الأجر الجديد الساحل	02, Route d'Ouled Fayet, BP 83 - Dely Ibrahim - Alger	021 36 29 25 / 27	021 36 29 31/021 36 15 28		www.bns-dz.com#http://www.bns-dz.com#
3049	3	4	\N	GBS ROUTE	جي.بي.أس الطريق	Lotissement TEFAH 03, Route d'Alger-Tiaret	046 41  82 90	046 41 82 58		
2158	3	4	\N	STATION EL KARAOUI DE CONCASSAGE & DE PRODUCTION D'AGREGATS	محطة القروي لتفتيت و إنتاج الحصى	19 Rue des frères Taiane Commune Bordj Bounaama - Tissemssilt				
3628	12	4	\N	COOPERATIVE ARTISANALE IBN KHALDOUN		Boulevard des martyres  Frenda W. Tiaret	0555 615 155			
3364	1	4	\N	CARRIERE BACHIRI & CIE	محجرة بشيري و شركاؤه	Bir Brinis, Oued Seguin, W, Mila	0661 339 034			
2955	1	4	\N	ARPROINSA TRAVAUX PUBLICS ET PROMOTION	آربوينزا أشغال عمومية و ترقية	27, rue Ferhat Abdelkader, Staoueli, Alger	0770 47 80 43	027 51 53 66		
4457	1	\N	\N	TILGOUINE TANKIB	تيلقوين للتنقيب					
4458	1	\N	\N	SOCIETE OULED SALEM LIZAHAB	شركة ولد سالم للذهب					
2782	2	4	\N	BELARBI AHMED & CIE	بلعربي أحمد و شريكه	Cité Hachemi G 4 N° 46 W.Setif	035 68 65 02	035 60 21 57		
582	3	4	\N	CARRIERE AIN FLAMBO	محجرة عين فلمبو	21, Rue Salvadore Allende - W.Souk Ahras	037 32 81 13			
1089	1	4	\N	AMMOURI AMMOURI	عموري عموري	Dar Arousse, Branis - W.Biskra	033 70 68 54	033 70 68 09	Hoggui-laid@yahoo.com	
4423	\N	\N	\N							
1454	3	4	\N	EL AISSAOUI EXPLOITATION DES CARRIERES & CONSTRUCTION	العيساوي استغلال المحاجر و البناء	Cité 102 logements  N° 18   Erababhia    W. Saida	048 52 00 71			
3128	5	4	\N	LAZREG TRAVAUX PUBLICS	لزرق للأشغال العمومية	Route de Sig Bethioua W.Oran\r\nBerdi Amar Rue Ouafi Madani n° 05 w.Mostaganem	0770 52 92 83	045 26 12 72		
4320	2	\N	\N	FRERES KEBBICHE PLATRE	الإخوة كبيش للجبس	Timnaine, Commune de Ain Yagout, Batna	036 51 32 65	036 51 42 61		
4321	7	\N	\N	INFRAFER		15, Rue Colonel Amirouche, Rouiba \r\nWilaya d’Alger	023 89 41 02	023 89 41 06		
3591	12	4	\N	RIYA NAGHAM	رئية نغم	Ouled Ben Adda   Commune de Sebaine  W. Tiaret	0668 219 228			
4309	1	\N	\N	TEL EST BOVINE	تال آست بوفين	256 Lots, Cité des Amandiers, N° 63, Souk Ahras	06 61 32 07 49	037 72 21 02		
4254	3	\N	\N	EL KOUCHE TRAVAUX PUBLICS  ROUTES ET BATIMENT	الكوش للأشغال العمومية و الطرقات و البناء	Cité 40 logements, Local n°1, commune de M'sila, wilaya de M'sila	0550 30 48 84 / 0666 59 36 94	035 55 02 90		
4032	3	4	\N	DERKAM IMPORT EXPORT	دركام للاستيراد و التصدير	Hai Boussouf N° 337A, w.Constantine	0770 40 40 63			
3239	1	4	\N	CARRIERE HERITIERS ADJAL LAHCENE	محجرة ورثة عجال لحسن	Poste Ain Roua 19310, W, Sétif	036 51 32 65 / 0550 55 16 20	036 51 42 61		
3616	12	4	\N	COOPERATIVE ARTISANALE EL DJORF EL ABYAD PRODUCTION TRADITIONNELLE DU GYPSE	التعاونية الحرفية الجرف الأبيض لإنتاج الجبس التقليدية	El Hassi Commune de Ouled Sidi Brahim  W. M'sila	0795 158 189			
4018	1	4	\N	BRIQUETERIE TIMADANINE	مصنع تيمادنين للياجور	BP 285, rue BOUZIDI Abdelkaderl, Adrar.	049 96 89 19	049 96 78 91	grelhamel@yahoo.fr	
1070	1	4	\N	EL ISRAR SERVICES		Sahane II  W. El Oued	032 22 23 52			
1845	3	4	\N	SABLIERE EL MISK		Debabia Commune de Hamma Bou Ziane W.Constantine				
1989	1	4	\N	EN NEDJMA	النجمة	Djebel Oum Settas, Ben Badis - W.Constantine	031 62 99 78 / 061 30 13 08 / 070 44 56 98			
501	3	4	\N	ENTREPRISE BRIQUETERIE MANSOURI	مؤسسة منصوري للأجر	Commune de remila wilaya de Khenchela	06 62 30 57 40	033 86 20 60		
4488	1	\N	\N	DEHECTAM LITANKIB	ديهكتام للتنقيب					
2469	\N	4	\N	HESNAOUI		BP 11M, Zone industrielle de Sidi Bel abbes	048 56 67 06 	048 56 82 22	etph@lesentrepriseshasnaoui.com	
4769	1	4	\N	EKOSEL	أكوسل	Hassi Khelifa . Local n° 01 - Wilaya d'El Oued	0770 43 86 65	032 26 53 75		
1316	1	4	\N	CARRIERE KEF SEMAH	محجرة كاف الصماح	Commune de Béni Oussine W.Sétif	036 79 52 26 / \n073 27 26 74			
337	1	4	\N	CTM	محجرة ونقل البضائع	Avenue de la Gare Tadjenanet W, Mila	06 61 33 80 63 / 0773 76 58 45	031 53 52 45	rebbadj78@yahoo.fr	
23	3	4	\N	CARRIERE ISLY	محجرة اسلي	05, Rue Baatouche Moussa Ain Touta	033 83 47 37			
3003	1	4	\N	RESKOR APPROVISIONNEMENT ET SERVICE GENERAUX	رسكور للتموين و الخدمات العامة	06 cité 322 Logts Bt 22 El Alia Nord BISKRA	0666 83 68 68	033 73 72 91		
4392	\N	\N	\N	BRIQUETERIE AMOURI LAGHOUAT	شركة الاجر عموري الاغواط	M'Righa Route de Djelfa Laghouat	029111818	029111818		
3631	12	4	\N	COOPERATIVE ARTISANALE ECHOUROUK	التعاونية الحرفية الشروق	Cité Rousseau N°06 W. TIARET	0797346714			
1630	1	4	\N	SESC / SOCIETE D'EXPLOITATION DE SABLE & CARRIERES		N° 55 Cité Souk El Fellah - Douira - W.Alger				
3598	12	4	\N	COOPERATIVE ARTISANALE EL GAADA	تعاونية حرفية القعدة	Cité du Sud, Aflou, W, Laghouat	07 76 38 00 01			
2112	1	4	\N	BMOA / BRIQUETERIE MODERNE OUM ALI		Commune Oum Ali W.Tebessa	037 44 01 06	037 44 01 06		
1856	1	4	\N	FRERES REDDAH POUR LE PLATRE & LA CHAUX	الاخوة رداح للجبس و الجير	14, Rue Salah Laala - Ain Touta - W.Batna	061 25 69 89	033 83 47 39		
3084	3	4	\N	MEHCHEM DES TRAVAUX						
2233	5	4	\N	EPRE - GIC / Entreprise des Produits Rouges de l'Est - Groupe Industriel et Commercial -	مؤسسة المواد الحمراء للشرق - المجمع الصناعي و التجاري	BP n° 375 RP Zone Industrielle - BATNA	033 92 24 85	033 92 13 67		
3429	3	4	\N	BALAINE CARRIERE	بالان محجرة	Cité 800 logements BT 17 N° 03 Boumerdès,	0550 23 76 24			
3526	1	4	\N	TOUDJI TRAVAUX ROUTIERS TRAVAUX BATIMENT ET CARRIERE	توجي اشغال الطرق اشغال البناية و محجرة	Sidi Maamar Route de Bechar W,Saida	05 50 17 51 17			
2309	2	4	\N	SAEPAV	الشركة الجزائرية لإنتاج وبيع مواد الملاط	Carrière d'agrégats Hammama - Miliana - W.Ain Defla	027 64 78 69/ 0552 15 53 17			
2066	1	4	\N	EL MOUSTAKBEL	المستقبل	Lemzara - Guidjel - W.Sétif	061 35 04 30			
3664	12	4	\N	COOPERATIVE ARTISANALE CARRIERE CHABANI	التعاونية الحرفية محجرة شعباني	Cité Ghogache Khemis Khechna  W. Boumerdes	0550 237 624	021 77 81 41		
2495	\N	4	\N	FIDAH SMAIN		Rue du 1er Novzembre Sidi M'Hamed Ben Ali Relizane				
2804	5	4	\N	GESIBAT	جيسي بات	Oued Kouba 2 W.Annaba	038 88 34 23	038 88 44 56		
2563	1	4	\N	FMOK	أف.أم.أو.كا	Ilot 29, Zone Industrielle Hassi Ameur, Cne Hassi Bounif, Oran.	041 52 46 70	041 52 46 12		
3881	1	4	\N	CARRIERE TIZOURITE	محجرة تيزوريت	Cité, Frères Mohamedi - n° 70, commune de Bir Echouhada - Oum El Bouaghi.	0661 30 15 25	031 52 96 66		
3570	1	4	\N	SOCIETE BIG ROAD TRAVAUX PUBLICS, HYDRAULIQUES	شركة يغ راود للأشغال العمومية و الري	Cité Fréres Cherrouf, Barika - Batna	032 24 99 09/055047 15 89	032 24 99 09		
4647	1	\N	\N	AREKSSASEN LI ZAHAB	اركساسن للذهب					
4546	1	\N	\N	TIN GHIRIFANE LITANKIB						
4547	1	\N	\N	ZAHAB ELTASSILI	ذهب الطاسيلي					
4771	5	4	\N	GROUPE BOUROUAG CONSTRUCTION GBC	مجمع بورواق للبناء جي بي سي	Nouvelle Ville Ali Mendjeli Unité Voisine (UV 18) Cité 169 Logements Portail n°03 - El Kheroub - W Constantine	031 92 68 14	031 92 68 14		
2116	3	4	\N	STATION AMROUS DES CARRIERES	محطة عمروس للمقالع	Rue du 08 mai 1945 n°4 Lardjem, wilaya de Tissemsilt	0770 96 03 49	046 41 31 67		
4191	1	\N	\N	EL DJORF TRAVAUX PUBLICS	الجرف للأشغال العمومية	Route de Khenchela - Cheria, wilaya de Tebessa	0770 02 03 58	037 62 29 26		
4192	1	4	\N	SABLIERE  BAGHDAD EL FARISSI	مرملة بغداد الفارسي	Ouled Fares     Chlef	0771 86 30 37			
2594	1	4	\N	CARRIERE KERCHA	محجرة كرشة	Cité 282 Lgts - n° 275 - Tiaret				
4474	1	\N	\N	TINAROUINE	تيناريوين					
3409	5	4	\N	CHIALI SERVICES	شيالي خدمات	Voie A, zone industrielle - Sidi Bel Abbes	048 55 11 90/048 70 31 90	048 55 58 58/048 70 35 58		
4207	5	4	\N	SOPCAB - BARIKA -	صوبكاب  - بريكة -	Zone d’activité Route de Biskra, commune de Batna	0661 59 32 31 / 0799 25 27 03			
4240	1	\N	\N	BOUCHETTA DES GRANDS TRAVAUX	بوشتة للأشغال الكبرى	Rue Adrari Abdelkader N° 3 b 33, Debeb, Commune de Bechar	05 50 30 72 43			
3111	3	4	\N	DEMANE DEBIH MOUSSA	دمان ذبيح موسي	Commune de Boulhilet, Daira de Chemora, W.Batna	0770 89 42 74	033 81 61 39		
3513	1	4	\N	ETB EL FATIA	مؤسسة أشغال البناء الفتية	Zone industrielle Oued Sly BP n° 84 Chlef	027 71 09 98	027 71 09 66	girahmoune@yahoo.fr	
426	1	4	\N	SOCIETE KOUIDER SEL	مؤسسة قويدر للملح	Hamraia - Wilaya D'El Oued	0770 61 27 67	032 26 53 74		
4551	1	\N	\N	ADEL LILMAADEN ELTHAMINA	عادل للمعادن الثمينة					
4552	1	\N	\N	LILMENAOUALA ELMENDJAMIA	للمناولة المنجمية					
4553	1	\N	\N	TIHAOUDIN LITANKIB	تيهاودين  للتنقيب					
4554	1	\N	\N	BOUSSAID LITANKIB ANI ZAHAB	 بوسعيد  للتنقيب عن الذهب					
4555	1	\N	\N	KHOUDRI	خودري					
4763	\N	\N	\N	19						
3594	12	4	\N	COOPERATIVE ARTISANALE OULED BOUAMAMA	التعاونية الحرفية أولاد بوعمامة	13, Rue Chikhaoui Mokhtar  Frenda  W. Tiaret	0772 557 483			
4125	1	4	\N	MAHDJARET EL BARAKA FRERES DAHAMNI	محجرة البركة الاخوة دحامني	Carrière Zeccar 9, commune de Zeccar, Djelfa	07 70 29 46 32			
4418	1	\N	\N	PLATRE DJEBEL DORBANE	بــــلاطر جبل ضــربان	REDJAS COMMUNE DE OIUED ENDJA WILAYA DE MILA				
3204	2	4	\N	CARRIERE MEZLA BRAMKI ET CIE	محجرة مزلة برامكي و شركائه	Djebel Mezla Bounouara, Commune Ouled Rahmoune - W.Constantine	07 70 51 91 71	036 84 60 52		
4290	1	\N	\N	COMEP /COMPLEXE ECH CHLEF DES PRODUITS ROUGES	مركب الشلف للمواد الحمراء	Oued El Kerma, Section 03, Ilot 07, Shaoula, Bir Mourad Rais, Alger	027 79 23 16	027 79 88 66	girahmoune@yahoo,fr	
2929	5	4	\N	STRPS AKBOU	اس تي ار بي اس اقبو	RN 26, BP 72 B Akbou - W. Béjaia	034 35 91 01 / 034 35 90 75	034 35 91 41		
961	1	4	\N	MBO		Rue des Frères Laghrour  W/Khenchla 	061 34 71 23	032 32 27 05		
3506	3	4	\N	EL HABIRI KAMEL CARRIERE	الهبيري كمال محجرة	Cité Belghanem,W, Ghardaia	06 61 2282 42			
431	1	4	\N	CARRIERES HADJ YOUCEF	محاجر حاج يوسف	Hai Ouled Ali, Khemis El Khechna - Boumerdès\r\nCarrières Hadj Youcef, Ahmeur El Aïn - W.Tipaza	021 32 70 32/070 33 97 58	021 32 70 32		
3524	5	4	\N	KNAUF PLATRE FLEURUS	كناوف جبس فلوريس	BP N° 2 Boufatis W, Oran		041 52 14 62		
991	1	4	\N	SOCIETE D'EXTRACTION DES PRODUITS DE CARRIERE GROUZ	شركة إستخراج مواد المحاجر قروز	BP n° 70, Mechtasareg Derfoul  Commune de Ain Mlouk  -Chelghoum Laid - W. Mila	031 52 81 50 / \n036 84 96 81	036 84 96 81		
2055	2	4	\N	BOUADJIL EL HACENE & FRERES		Kef Errand - Ain Roua - Bougaa - W.Sétif	061 35 05 16			
3119	1	4	\N	NSC MAGHREB	ناسيونال سرفيس كومباني مغرب	17 CHEMIN DE LA MADELEINE   HYDRA   ALGER	021 69 21 60	021 69 26 15		
1127	3	4	\N	ECO ROUTES BOULABAIEZ BELKACEM	مقاولة أشغال الطرق و انتاج الحصى بولعبايز بلقاسم	BP 35M Collo W.Skikda 	038 71 86 66			
2512	3	4	\N	BEDJAOUI DJAMEL	بجاوي جمال	03, Rue Frères Bouaichoum, Larbaa - W.Blida	061 53 31 69/061 53 20 20/071 91 67 13			
4131	1	4	\N	EL MEDJADJIA DE CONSTRUCTION	المجاجية للبناء	Hai Essalem, Section n°107, GPR n° 235, Chlef, wilaya de Chlef	027 77 09 85	027 77 09 85		
491	1	4	\N	ITT						
493	2	4	\N	OUNAS SALAH						
4756	\N	\N	\N	12						
370	3	4	\N	ACHOURI KHLIFA		06 Rue Meriem Boutoura  Constantine	031 56 11 62	031 56 15 35		
2794	1	75	\N	AWE / ALGERIAN WATER ENTREPRISES	المؤسسة الجزائرية للمياه	Lot n°35 LA CADAT LES Sources Bir Mourad Rais 16 000 Alger	021 44 94 62	021 44 94 61	a.w.e@wissal.dz	
3945	1	4	\N	SOCIETE NOUVELLE GENERALE BRIQUETERIE AURES	الشركة الجديدة العامة مصنع الاجر الاوراس	Cité Ben flis, Route de Biskra	033 81 69 07	033 81 69 07		
3497	1	4	\N	CARRIERE SEKRINE	محجرة سكرين	24, Rue Douad Salah n° 1, Ain Azal - Setif	0661 35 05 76	036 95 62 08		
3207	1	4	\N	CARRIERE BOUARROUDJ	محــــجرة بوعــروج	Rue 1er Mai,Mila,Ancienne Commune de Mila \r\nW, Mila	0560 098 829	031 46 67 18		
4263	1	\N	\N	ALMINEX	المينكس	RELAIS DU SAHEL, AUTOROUTE SUD LOT 924, CHERAGA, ALGER.	0560 88 67 88 / 0560 88 20 88	0982 40 10 80		
4635	1	\N	\N	TAMDJOUK LIZAHAB	تامجوق للذهب					
4636	1	\N	\N	KENDOUKER LITANKIB	كندوكر للتنقيب					
2632	3	4	\N	HAMADI RACHID STATION DE CONCASSGE AGREGATS	حمادي رشيد محطة التفتيت الأحجار	Ain Kherba - Commune de Zoubiria - W.Medéa	075 05 78 76			
948	5	4	\N	CARRIERE METTAI		RN n° 4 - Dhaia - Ain Defla	027 60 56 10	027 60 49 03		
2144	2	4	\N	SATTA & FILS	ســاتـة و أبناؤه	R'Mada  Commune Ain Lahdjar    W.Sétif	0778 271 357			
4778	1	4	\N	EL HILAL COMMERCE ET INDUSTRIE	الهلال للتجارة والصناعة	Zone industriell, route de Meftah-Oued Smar-Batiment C, parcelle n°2, Lot 17, 3 éme étage-W.Alger,	021834205	021834372		
2803	11	44	\N	GROUPE CITIC & CRCC		121, Lot Cadat Villa 121, Les Sources - Bir Mourade Raïs - W.Alger	021 56 44 86 / 071 16 75 47	021 56 44 90		
4549	1	\N	\N	AFRA GOLD	افرا قولد					
4550	1	\N	\N	ZITOUNI LITANKIB ANI ZAHAB	زيتوني للتنقيب عن الذهب					
396	5	4	\N	EPTP BOUSAADA / ENTREPRISE PUBLIQUE DES TRAVAUX PUBLICS BOUSAADA	المؤسسة العمومية للأشغال العمومية لبوسعادة	Zone Industreille, Route de Maadher, Bousaada, W, M'sila	035 52 50 47	035 52 50 47		
3745	1	4	\N	CARRIERE BOUDJERAR	محجرة بوجرار	Ain tin, commune de foum toub, W, Batna	05 50 20 30 99			
4649	1	\N	\N	TIFERTASSINE LITENKIB AN ZAHAB	تيفارطاسين للتنقيب عن الذهب					
3621	12	4	\N	COOPERATIVE ARTISANALE LES MONTAGNES VERTES	التعاونية الحرفية الجبال الخضراء	commune de Belaia wilaya de M'sila	0661359200			
3588	12	4	\N	COOPERATIVE ARTISANALE EL MOULK	التعاونية الحرفية الملك	Cité Castors   Mahdia  W. Tiaret	0661 435 673			
2554	2	4	\N	SUPERTEX	سبرتكس	20, 22 Iben Khaldoune 47 000, wilaya de Ghardaïa.	0561 31 97 04	029 88 09 21	supertex-dz@caramail.com	
3186	1	44	\N	SHAOLIN MINES	مناجم شاولين	Lot N° 33, cité Dauphin, Draria-Alger, Algérie	021 41 67 36/ 0770 33 46 21	021 41 67 36	shaolinmines@163.com	
4296	\N	\N	\N							
4608	1	\N	\N	TKASOUARET LITANKIB ANI ZAHAB	تكاسوارت للتنقيب عن الذهب					
3858	1	\N	\N	FRERES BENABDALLAH INDUSTRIE ET COMMERCE	شركة الإخوة بن عبد الله للصناعة و التجارة	Village Zaatra, Bled Biar, commune de Zemmouri,   Boumerdes.	0660824194	023867607		
4426	1	\N	\N	NOUVELLE TUILERIE IZERKHEF AZAZGA		local n° 12 RDC azazga est sur route nationale n°71 Tizi Ouzou	026 413 394 /0550 679 248	026 413 400		
4326	3	\N	\N	BRIQUETERIE INDUSTRIELLE AMRAOUA		37, Rue Amara Rabah W. Tizi ouzou	0560 192 712 /0560 192 812	026 44 18 81		
3848	3	4	\N	SAT RPB	أس.أ.تي.أر.بي.بي	Hai El Moustakbel, n° 198, Ain Allah - Alger	0770 98 0089	021910298		
3234	3	4	\N	IMAD EDDINE SABLIERE	عماد الدين سابليار	61 Coopérative Deyar El Amel Bir El Djir W,Oran	0550 660 998    0770 941 747  041 42 13 22	041 42 13 22		
4428	1	\N	\N	TIZIRI CERAMICA	تيزيري سيراميكا	Zone d'activités Ibourassen Nord Ouest Commune de Oued Ghir.	0770 975 527			
3521	12	4	\N	COOPERATIVE ARTISANALE LEDJDAR	التعاونية الحرفية لجدار	Commune de Medroussa W. Tiaret	0771 337 681			
4607	1	\N	\N	TIBDJADJ LI ZAHAB	\r\nتيبجاج للذهب					
3104	1	120	\N	TASSOCO	طاسوكو	Baada , Rue Sebnai-Immeuble Oueidat Liban	+203 745	+ 203 531-203572		
981	1	4	\N	ABDELMALEK & FILS D'EXTRACTION & PREPARATION DES PRODUITS DE CARRIERES	عبد المالك و ابنائه لتحضير منتجات المقالع	Cité Oued Nagues, Ilot 575/11, wilaya de Tébessa.	0550 46 34 96	037 48 54 27		
3224	5	4	\N	BISKRIA CIMENT / SOCIETE DE FABRICATION INDUSTRIELLE DE CIMENT	شركة الانتاج الصناعي للاسمنت - البسكرية للاسمنت -	Djer Bel Lahreche, Branis, wilaya de BISKRA	0661 374 283	033 70 69 50	Hoggui-laid@yahoo.com	
4774	1	4	\N	IABOUDA SERVICES	إعبودة خدمات	Cité Sokra commune Rouissat - w Ouargla	029 72 11 11	029 72 11 11		
3125	1	4	\N	SABLIERE ET CARRIERE AOURAGH MERAD	مرملة و محجرة اوراغ مراد	19 RUE MOHAMED BEN MIMOUN	0555 40 28 47	041 45 67 35		
4329	1	\N	\N	EXPLOITATION MARBRE SAHARIE/EMS		Cité Gataa el oued commune de Tamanrasset	021 36 14 64	033 88 80 50		
4639	1	\N	\N	TADIKERT LITANKIB	تاديكرت للتنقيب					
3592	12	4	\N	COOPERATIVE ARTISANALE KHALDI CHAHRAIAR	التعاونية الحرفية خالدي شهرايار	Rue Emir Abdelkader  Sougueur  W. Tiaret	0770 598 752			
4449	1	\N	\N	AK MELLAL LITANKIB	أق أملال للتنقيب					
4085	\N	\N	\N							
2057	5	4	\N	INFRAFER	انفرافر	15 Rue Colonel Amirouche BP 208 Rouiba 16007 Alger	023 89 41 02	023 89 41 06		
3932	3	4	\N	BRIQUETERIE MANSOURI	شركة منصوري للأجر	Remila    Khenchela	033 86 20 60	033 86 20 60		
4576	1	\N	\N	OUAGHIGHENE LI ZAHAB	واغيغن للذهب					
3893	1	4	\N	CHAMAR GRAND TRAVAUX	شركة شمر للاشغال الكبرى	Cité 100 Logts, Adrar	06 61 27 74 21			
4349	3	\N	\N	DOUZE CHAHID	دوز شهيد	Rue Bendine N°08, Ain Kermes, Tiaret	06 69 01 56 06			
3607	12	4	\N	COOPERATIVE ARTISANALE EL FOURSENE	التعاونية الحرفية الفرسان		0770 664 849			
4664	\N	\N	\N	IDNAN LI ZAHAB	ايدنان للذهب					
1858	3	4	\N	BENDOUHA FROID		95, Boulevard Bouguerra - Khemis Miliana - W.Ain Defla	027 66 58 38	027 66 40 40		
1945	1	4	\N	SABLIERE BELATRECHE	مرملة بلطرش	17, Rue Ahmed Saadi - W.Ain Defla				
3709	1	4	\N	ACID OIL MED AEK	حامض زيتون ط أ ع ق	N°11 Niveau 1 Place Commandant Medjdoub - Centre Commercaile ( El Anik)  W. Oran	041 40 70 52	041 39 72 36		
4415	\N	\N	\N	POLECERAM		87 Cité Ezzohour Village GUEROUACHE Bordj Bouarreridj	0661 68 09 64	035 73 40 23		
3263	1	4	\N	CARRIERE RAMOUL	محجرة رامول	03, Rue Merh Zeguine Nechemaya, W, Guelma	037 23 64 21	037 23 64 21		
4742	1	\N	\N	INGASSARMAN TANKIB	ان قزرمن للتنقيب					
4581	1	\N	\N	TEFEK LITANKIB	تفك للتنقيب					
2050	1	4	\N	AMMARI ABDELAZIZ & YOUCEF	عماري عبد العزيز و يوسف	Cité Ouled Djehaiche - Sigus -  W.Oum El Bouaghi	031 61 05 47			
3675	12	4	\N	BAB EL KHERZA EXTRACTION DE SABLE	باب الخرزة لاستخراج الرمل	Cité 05 Juillet Sidi Ameur  Commune de Sidi Amaur  W. M'sila	0550 448 688			
4646	1	\N	\N	TALOUST LI ZAHAB	تلوست للذهب					
1968	3	4	\N	ENTREPRISE HANACHIA EXTRACTION DE SABLE	مؤسسة الحناشية استخراج و تحضير الرمل	30, Rue Président Wilson (41000) W.Souk Ahras	072 73 98 30			
3599	12	4	\N	COOPERATIVE ARTISANALE SISSOU	تعاونية حرفية سيسو	Cité des 1500 Logts, Bt 2 N°1339, W, Sidi Bel Abbes	07 78 60 28 05			
4090	\N	\N	\N							
4092	\N	\N	\N	BISKRIA CIMENT / SOCIETE DE FABRICATION INDUSTRIELLE DE CIMENT		Djer Bel Lahreche, Branis, wilaya de BISKRA	0661 374 283	033 70 69 50	Hoggui-laid@yahoo.com	
3916	5	\N	\N	BRIQUETERIE TAOURSIT	مصنع الاجور تاورسيت	ZONE INDUSTRIELLE ADRAR\r\nw, ADRAR	05 55 29 17 82			
4536	5	\N	\N	ENOF		31 Rue Mohammed Hattab Hassen Badi, El Harrach, Alger	023 82 71 73	023 82 71 69		
4648	1	\N	\N	ELGHALFIT LITANKIB ANI ZAHAB	الغالفيت للتنقيب عن الذهب					
100	3	4	\N	GRAVEX	قرافيكس	Lotissement CADAT BN°26Commune de  Bouira	0550 52 06 68 / 0555 04 72 78	026 95 83 16	gravex@wissal.dz	
2100	1	4	\N	CARRIERE TRANSPORT AGREGATS PONTS ROUTES L'ETERNEL EL DJADID		Rue de l'Aéroport - Quartier Es Sellem - Mechria - W.Naama	049 78 56 98	049 77 43 92		
2252	1	4	\N	BMO / BRIQUETERIE MODERNE DES OASIS	مصنع الأجر العصري بالوحات	Route de Biskra, Zone Industrielle BP25 - Tougourt - Ouargla	029 67 20 22	029 67 06 22 / 029 67 23 10		
900	3	4	\N	MARZA MEBAREK CARRIERE BERBAGA	مارزه مبارك للمحجرة	Commune Arris W.Batna	033 81 00 09	033 81 00 06		
2432	1	4	\N	AZZAZGA PROMOTION	عزازقة ترقية	Route de Ain El Hammam  Azzazga   W. Tizi Ouzou	026 21 44 33\n026 21 80 99\n070 96 15 80			
272	2	4	\N	ACHOUCHE FATEH & FRERES	عشوش فاتح و اخوانه	Cité du 8 Mai 1945 N° 110 El Khroub, W, Constantine	07 76 08 50 07	037 21 67 21		
4194	1	\N	\N	Société Briqueterie FESDIS	شركة أجر فسديس	Fesdis, wilaya de Batna	033 80 81 32 / 032 80 82 34  / 033 80 81 33	033 80 81 32 / 032 80 82 34  / 033 80 81 33		
4352	3	\N	\N	CALCINAL	كالسينال	N°03 HADDOUCHE SALAH AIN BINIAN ALGER	0770108987	023225725	eurlcalcinal@gmail.com	
180	1	4	\N	NOUVELLE CARRIERE DE L'EST		BP 61, Cne Benazzouz ; Skikda	038 84 22 25	038 83 18 08		
98	5	4	\N	ETB / ENTREPRISE DE TRAVAUX DE BATNA	مؤسسة الأشغال باتنة	Zone Industrielle Kechida, Bp°370 RP, wilaya de Batna	033 22 26 35	033 22 25 03		
4539	1	\N	\N	SOCOPE CARRIERE	سوكوب كاريار	Boulevard des 24 mètres, Sidi Boushak, Tlemcen.	043 27 37 14	043 27 39 39		
4540	3	\N	\N	BOUTALEB CARRIERES		Cité 924  Logts / B M'SILA	0662 71 03 13 / 0697 54 78 25	035 57 70 53/035 59 02 84		
4541	1	\N	\N	SOCIETE DES ZIBANS TRAVAUX		Zone Industriel N° 36, w,Biskra	0661 37 44 43	033 75 41 42 / 020 96 17 18		
4542	1	\N	\N	BEN AZOUZ LITANKIB ANI ZAHAB	 بن عزوز للتنقيب عن الذهب					
2227	1	4	\N	SCPFH	أس.سي.بي.أف.أش	47 Rue DEMBRI Tahar 3ème BOUAKAL- Batna	033 80 52 74	033 80 52 74		
2059	2	4	\N	NEZZAR & BOUAZIZ	نزار و بوعزيز	Cité Cheikh Laifa (ex. Farmatou), wila de Sétif	036 74 30 48 /  0556 01 00 59	036 74 30 48		
4665	1	\N	\N	AMENDJI LI ZAHAB	امنجي للذهب					
2673	1	4	\N	TAZZROUT AGREGAT	تازروت اقريقا	Village Amacine BP 253, Amizour - W.Bejaïa	061 63 04 58			
914	3	4	\N	CARRIERE EL KHALIDIA	محجرة الخالدية	BP N° 7  ou 11 Sigus  W.Oum El Bouaghi	032 40 84 87/ \n032 40 84 57			
3984	3	4	\N	ETPHW	او تي بي اش وي	Cité Saïd Hamdine, Lot 108 n° A1, wilaya d’Alger.	0770 88 46 46	021 83 71 11		
4467	1	\N	\N	TIN MANTA LITANKIB ANI ZAHAB	تين مانتا للتنقيب عن الذهب					
3009	1	4	\N	ISO GRANAL	ايزوقرنال	08, rue Blaise Pascal Alger	0770 95 13 31	024 81 75 92		
4429	2	\N	\N	FRERES BEDJAOUI FABRICATION DE CARRELAGE	الاخوة بجاوي لصناعة البلاط	N° 13 plan lots, Zone d’activités n°02 Teleghma, w.MILA.	0661 193 331	0213 31 481 663	hassan,bedjaoui@yahoo,fr	
4609	1	\N	\N	ISMEN LISTIKHRADJ EL ZAHAB	ايسمن لإستخراج الذهب					
4610	1	\N	\N	AMDID LITANKIB ANI ZAHAB	امديد للتنقيب عن الذهب		0697726111			
3574	3	4	\N	ETABLISSEMENT EL OUARCHENE DES ENTREPRISES	مؤسسة الورشان للمقاولات	El Merdja A n° 040, Lot 42, Cheria, wilaya de TEBESSA	0770 41 90 90	037 62 27 98		
3651	12	4	\N	COOPERATIVE ARTISANALE SABLIERE KERDADA	التعاونية الحرفية مرملة كردادة	Route d'Alger  Commune de Bousaâda   W. M'sila	0661 689 509     0550 146 950			
4212	1	\N	\N	GROUPE KSUPC	مجمع كا.أس.أو.بي.سي	Centre belarbi, belarbi, wilaya de Sidi Bel Abbes	0661 44 41 69			
4579	1	\N	\N	MESSOUDI LITNKIB ANI ZAHAB	مسعودي للتنقيب عن الذهب					
2276	1	4	\N	ZAATCHA AGREGATS	الزعاطشة للحصى	Sarl Zaatcha Agrégats, El Hadjeb- W.Biskra	0661 58 71 85			
3491	1	4	\N	CHLORAL	كلورال	12 Boulevard   Said Hamdine    16400 hydra \r\nAlger	021 60 69 82	021 60 69 82		
4282	1	4	\N	S.A.M.T.P	أس , أ , أم , تي , بي	Cité 5 juilletm Cube 01, BT 25, Bab Ezzouar, wilaya d'ALGER	0556 50 59 95			
3482	1	4	\N	MZ TRAVAUX PUBLICS ET HYDRAULIQUE	أم زاد للأشغال العمومية و الري	Rue Hamouda Ben Abderazak   Si El Houas \r\nn° 21      Biskra	033 73 15 55	033 73 15 68		
3711	12	4	\N	COOPERATIVE ARTISANALE FRERES KHELOUFI	التعاونية الحرفية الإخوة خلوفي	05 Rue Zaâmoum Salah  W. Bouira	0770 965 332			
4724	1	4	\N	EL IKHOUA BELBOUAB WA CHARIKIHOUM INTEDJ EL HASSA	الاخوة بلبواب وشريكهم انتاج الحصى	Lotissement Hachemi (rue kheninef aissa), section 134 ilot de propriété 147, N°18, Sétif	05 57 30 03 85			
44	5	4	\N	SITRWS / SOCIETE D'INFRASTRUCTURES & TRAVAUX ROUTIERS DE LA WILAYA DE SETIF	شركة المنشآت الأساسية و أشغال الطرق لولاية سطيف	Zone Industrièlle n° 12 BP n° 65, Sétif	036 91 00 44/\n036 91 00 45\n036 91 00 46	036 93 66 40		
2390	1	4	\N	TAB & ASSOCIE	طاب و شريكه	36,Quatrier du stade ancien, lot 48 EL Bayadh	070 45 64 92			
273	3	4	\N	CMM / CARRIERE MEGHZILI MOHAMED		Route de Hamala -Grarem Gouga				
2273	1	4	\N	EPCRR	مؤسسة مواد الحصى و انجاز الطرقات	113, Cité Sidi Khaled Tiaret	061 23 10 47			
1741	1	4	\N	AU BON AGREGAT	او بون اقريقا	Zone industrielle , lot n° 58, Chetouane  W. Tlemcen	043 27 54 44 / \n070 91 94 95\n043 20 69 05			
2138	1	209	\N	HOLCIM ALGERIE	هولسيم الجزائر	70, Chemin Larbi Allik - Hydra - W.Alger	021 54 99 87 / \n021 54 99 86	021 54 99 85		
2002	3	4	\N	LEMZARA AGREGATS		Lemzara Sidi Messoud - Guidjel - W.Sétif				
1755	3	4	\N	CARRIERE BARKAT LAGHRIBI	محجرة بركات لغريبي	Rue Fréres Bougadi - Ain Fakroune - W.Oum El Bouaghi	032 40 29 83			
3188	1	4	\N	CARRIERE KJ	محجرة كاجي	Azrou Kellal - Commune Taourirt - W. Bouira	0770 48 58 31	034 21 36 11		
1888	1	4	\N	CERAMIQUE HYPOCAMPE	خزف هيبوكومب	Route de Chaïba - Bou Smail - Tipaza 	024 46 46 74/024 46 10 12	024 46 48 42/024 46 28 86	cer_Hipp@hotmail.com	
4679	1	4	\N	ERTROB	أو أر تي  أر أو بي	Village Draâ Khelifa commune Sidi Naâmane \r\nDraâ Ben Khedda (wilaya de Tizi-Ouzou)\r\nCode postal: 15100	05 55 93 17 98			
4293	1	4	\N	SO.CO.TRAGS / SOCIETE DE CONSTRUCTION & TRAVAUX GRANDS SUD	شركة البناء والأشغال الجنوب الكبير	Rue Larbi Ben Mhidi, Adrar, wilaya d'Adrar	0661 24 50 13 / 049 96 08 39	049 96 48 12		
2775	3	4	\N	AFAF	عفاف	Rue d'Alger Stidia  - w/Mostaganem	0661 20 31 61			
1807	5	4	\N	CARRIERE ANNOUNA	محجرة عنونة	Sellaoua Announa W.Guelma	037 24 32 92			
124	2	4	\N	BOUROUIS FILS & CIE	ابناء بورويس و شركاؤه	Cité 20 Aout 1955, Wilaya de SKIKDA.	038 70 47 10	038 70 35 43		
2887	3	4	\N	GACEM EXPLOITATION DE CARRIERE	قاسم لاستغلال المقالع	RUE MANSSOUR Mabrouk Bab 05 Messaad	071 52 33 58	027 85 76 73		
2535	5	4	\N	SOPREC / SOCIETE DE PREFABRIQUES EN BOIS DU CHELLIF	شركة البناء الجاهز بالخشب الشلف	07, Rue Adjudant Azzoune - Chlef	027 77 80 09	027 77 87 95		
4450	1	\N	\N	AGHOUB LITANKIB AN ZAHAB	اغوب للتنقيب عن الذهب					
3781	15	37	\N	SOCIETE EN COMMANDITE EXPLORATION TCE		1410, Rue Stanley, Suite 606, Montréal (Québec) - Canada H3A 1P8	(514) 849-3013	(514) 849-9181	khobzi@cancor.ca	
2924	11	\N	\N	GROUPEMENT OHL S.A & INFRARAIL SPA	تجمع ا ش ل - انفراراي	17, Rue d'Egypte - W.ANNABA	038 80 40 88	038 86 73 49		
3410	1	4	\N	MINOTERIE OULED MOHAMED	مطحنة أولاد محمد	23 zone d'activité El Malah Ain Temouchent	043 65 72 56	043 65 72 61		
3623	12	4	\N	COOPERATIVE ARTISANALE SABLIERE EL KALAA	التعاونية الحرفية مرملة القلعة	SELMANE OULED DERADJ W, M'SILA	0774423896			
1163	1	4	\N	NUMIDIA CERAMIQUE	نوميديا سيراميك	Zone Industrielle Oued Seguin - W.Mila	031 56 01 84	031 56 01 81		
4412	1	\N	\N	T CONSTRUCTION	تي كـونستريكسيون	27, rue Amed KARA, Bir Mourad Rais  ALGER	031 45 26 41	031 45 26 41		
4413	1	\N	\N	BETONIUM	بتونيوم	N° 151 Cité El Mouatsa, Local N° 11, Rouiba, w.Alger	024 79 32 53	024 79 32 53		
3240	5	4	\N	GRANU - CENTRE	شركة لإنتاج و تسويق مواد الحصى المفتت - غرانو سنتر	Bp n° 37, Meftah, wilaya de Blida	025 45 53 41	025 45 53 42		
2145	3	4	\N	HIBER ART DES MINES	حـيبر لـفن المنـاجم	59, Rue Halimi Lamtaiche  El Eulma   W.Setif 	070 32 19 65 			
4001	\N	\N	\N							
4081	5	\N	\N	HODNA CEMENT COMPANY / HCC	حضنة إسمنت كومباني	13, rue Mohamed Semani, Hydra - Alger	021 69 43 07 -09  / 021 69 29 05	021 69 43 07 -09  / 021 69 29 05		
2271	3	4	\N	GOLDIM / GOLD INDUSTRIAL MINERALS	قولد أنديستريال منيرالس - قولديم	08, Rue des Aurès - BP 11 - El Harrach - Alger	024 81 77 39	024 81 77 39	goldim@orgm.com.dz	
4545	1	\N	\N	TAN MEKHMOUDEN	تان مخمودن					
2970	8	4	\N	ANBT / AGENCE NATIONALE DES BARRAGES ET TRANSFERTS	الوكالة الوطنية للسدود و التحويلات	03, Rue Mohamed Alilet, Kouba - W.Alger	021 29 94 91			
4556	1	\N	\N	OUHT LITANKIB ANI ZAHAB	أوهت للتنقيب عن الذهب					
4557	1	\N	\N	BEN BATA LITANKIB	بن باطة للتنقيب					
4558	1	\N	\N	ITMAGH KLETOBRA LI ZAHAB	ايتماغ كلتوبرا للذهب					
4559	1	\N	\N	MERTOUTA	مرتوتة					
4560	1	\N	\N	ILLIZI BRAITE	إليزي برايت					
3751	1	4	\N	BANOU MESSAOUD MULTISERVICES	بنو مسعود متعددة الخدمات	Cité des cent logements Appt 8 BTC CAGEL \r\nAOMAR    Bouira	0555 02 95 27	021 84 75 62		
3536	3	4	\N	MATAL MATERIEL ALGERIE	مطال ماتريال الجزائر	Cité 1er Novembre Ouled Moussa, wilaya de Boumerdes	0554 19 19 48			
4060	1	4	\N	SOCIETE OTANE DES ENTREPRISE	مؤسسة اوطان للمقاولات	Cité Aéroport, Bir El Atter, Tébessa	05 61 38 79 49	021 20 51 20		
2194	3	4	\N	EECR	شركة استغلال منجم الكلس رمضاني	N° 47 Route de Chetouane - Tlemcen	043 28 60 45 / 043 28 60 46 / 061 22 05 71			
4727	1	4	\N	CARRIERE ZEDIM	محجرة زديمl	Rue 01 Novembre 54, Commune Ras El Oued, wilaya de Bordj Bou Arreridj	05 58 62 15 51			
3163	3	4	\N	EMARCH TP	اومارش تي بي	74, rue Fttaka Ali Hadjout TIPAZA	0550 34 43 59	017 00 93 96		
3696	12	4	\N	COOPERATIVE ARTISANALE SERSOU	التعاونية الحرفية سرسو	Torriche, Commune de Oued Lili  W. Tairet	0550 093 375			
4215	1	\N	\N	EL INBIHAR	الإنبهار	Djebel BRAOU Commune de Bazer Sakhra Daira d'El Eulma W. Sétif	0771 32 17 20 / 0772 74 44 22			
1565	1	4	\N	EL KARAMA DES GRANDS TRAVAUX	الكرامة للاشغال الكبرى	Place l'Irak El Oued  W/Oued	021 41 60 59/032 24 74 00	021 35 73 85/032 24 78 13		
1901	1	4	\N	PIOD		15, Route de Kanestel Hai Khemisti -Bir El Djir W.Oran	070 93 35 24/\n041 47 02 63	041 47 02 63		
1906	1	4	\N	SAFBIS	صافبيس	Rue du 17 Juin Vieux Biskra W/ Biskra	033 73 64 96	033 73 35 19		
2893	3	4	\N	SABLIERE BEN SI ALI	مرملة بن سي علي	47, Cité Najah - Relizane	070 16 69 68			
2593	3	4	\N	DJADJATI	جاجاتي	15,Rue de la gare Dahmouni - Tiaret				
3190	1	4	\N	BRIQUETERIE EL OUARSENIS	مصنع الأجر الورسنيس	Zone Industrielle, Oued Sly  - Chlef	027.79.88.66	027.79.23.16	girahmoune@yahoo.fr	
177	2	4	\N	BENBAREK FRERES	الاخوة بن بارك	18, Rue Benboulaid Mascara	045 81 33 55	045 81 52 27		
423	1	4	\N	DAMECHE HAKIM & CIE D'EXPLOITATION DE CARRIERE	دعماش حكيم و شركائهم لاستغلال المحجرة	14, Rue Kadid Youcef, Skikda 21000	038 75 12 39 / 061 33 01 55	038 75 12 39		
1064	3	4	\N	DJEBISSA PRODUCTION DE SABLE		47/15 Rue de la république  Boussada  W. M'sila	035 55 12 23			
1957	12	4	\N	EL AMEL	الأمــل	BP 26360 - Boughezoul Centre - Médéa	025 63 51 55			
4093	5	\N	\N	BISKRIA CIMENT / SOCIETE DE FABRICATION INDUSTRIELLE DE CIMENT		Djer Bel Lahreche, Branis, wilaya de BISKRA	0661 374 283	033 70 69 50	Hoggui-laid@yahoo.com	
3495	1	4	\N	EDTRH	أو.دي.تي.أر.أش	32 Cité Si Daddache, Hassi Mameche, BP 77 - Mostaganem	0770 24 01 80	045  22 98 83		
4653	1	\N	\N	TIN TAOUSSISSE LI ZAHAB	تين تاوسيس للذهب					
3993	2	\N	\N	GRADOUL BEN BRAHIM ET CIE	قرادول بن براهيم وشركائه	01, Rue d'Ouslama, Dellys, wilaya de Boumerdes	0770 54 93 16 / 0661 51 65 82	021 77 81 41		
4265	1	4	\N	HADJ ALI HYDRAULIQUE ET ROUTE	حاج علي للري و الطرقات	Hai Nakhil n° 01, Touggourt, wilaya d'Ouargla	029 68 44 54	029 68 27 65		
96	1	4	\N	VERRERIE DE L'EST	زجاج الشرق	03,Rue des Freres Bouras Souk Ahras	037 35 17 17	037 35 17 17		
2431	1	4	\N	SOCIETE EL MOUSTAKBAL	المستقبل	Cité des 137 Logements - W.Adrar	049 96 39 11	049 96 39 11		
972	1	4	\N	BRIQUETERIE KALAA BENI HAMED	بريكاتري قلعة بني حماد	Lieu dit Bled El Aroui, Commune de Metarfa - W. M'Sila	034 21 14 21 / 061 63 06 26 / 061 53 07 58	034 21 14 21		
274	2	4	\N	GYPSE EL HASSI AISSAOUI & ASSOCIES		BP 158 Chelghoum  laid   W Mila	031 52 69 83			
3194	1	4	\N	FRERES RAHMOUNE DISMAC	 الإخوة رحمون ديسماك	Route Nationale n°4 W,Chlef	040 67 10 10	040 67 11 11	sncbriqueterie@yahoo.fr	
2583	5	4	\N	S.CIM.A.T / Société des Ciments de Ain Touta	شركة الاسمنت عين التوتة	73 Bis, Rue Benflis - BP 67 - El Boustène - W.Batna	033 85 13 00	033 86 11 01/ 033 85 12 47		scimatu@erce-dz#http://scimatu@erce-dz#
3470	1	4	\N	NEDJMEDDINE CARRIERE ET ENTREPRISE	نجم الدين المحجرة و المقاولة	Tizi n'Bechar Bouandas Sétif	0661 70 64 35			
199	3	4	\N	CARRIERE DJEMORAH		Farah Md Carriere de Djemorah 				
1202	3	4	\N	TOUALBIA EXTRACTION DE PRODUITS MINERALES	طوالبية للإنتاج المواد المعدنية	Chez Toualbia Boubakeur, Etb Lavage graissage la Roucade - Tebessa.	037 40 34 04			
2994	1	4	\N	STPH TAHRAOUI	شركة الاشغال العمومية و الري طهراوي	08, AVENUE HAKIM SAADANE, BISKRA.	033 53 29 29	033 53 60 39		
2517	1	4	\N	SCAK / CONCASSAGE AOUN KAMEL	شركة محجرة عون كمال "ش.م.ع.ك"	Route de Mascara, Frenda - Tiaret				
3571	1	4	\N	SOCIETE GRANDS TRAVAUX DU SUD	شركة الأشغال الكبرى للجنوب	ZI BP 951Hassi Messaoud    Ouargla	029 73 47 95	029 73 47 94/0660 93 03 26		
2387	5	4	\N	ECPB / ENTREPRISE DE CONSTRUCTION & DE PRESTATION DE SERVICES DE BATNA		BP 66,  Route de Khenchela, Tazoult - Batna.	033 82 16 72	033 82 16 72		
4533	1	\N	\N	CPA / CENTRE DE PRODUCTION D'AGREGATS	مركز إنتاج الملاط	SIDI BAHOUS, COMMUNE AGHLAL, W AIN TEMOUCHENT	0560 09 09 19	041 53 70 42		
3162	1	4	\N	DAHRA FER	ظهرة للحديد	Hai Seddikia  Bt 01 W, ORAN	0661 25 67 37 - 046 97 66 48	046 97 66 46		
2882	11	\N	\N	GOTERA	قوتيرا	Base vie GOTERA/OHL EAC n°5/RN 01 sortie    Bir Touta	017 07 77 56	021 91 40 83		
3695	12	4	\N	COOPERATIVE ARTISANALE ABOU BAKR	التعاونية الحرفية أبو بكر	Cité Mezguida  N° 243  W. Tiaret	0776 343 092			
4285	3	\N	\N	TIGBA	مؤسسة تيقبا	Hai Ei Istiklal     Commune    d' Adrar	0550 16 90 77 / 0665 91 50 92			
2119	5	4	\N	S.C.HS / Société des Ciments de Hadjar Soud	شركة الاسمنت حجر السود	BP 181 AZZABA Wilaya de SKIKDA - Algérie	038 87 88 42 / 43	038 87 88 42 / 41	sect_dg@schs.dz	
3503	12	4	\N	COOPERATIVE ARTISANALE SIDI KACEM	التعاونية الحرفية سيدى قاسم		0661 50 94 04	043 61 32 22		
3854	2	4	\N	ETP ICELMANI et Cie	أو.تي.بي إسلماني و شركائه	Cité les orangers, Rouiba - Alger	0550 79 13 13/0773 40 34 34	024 84 31 97		
1657	3	4	\N	ETU BENHEDDA ABDELMALEK	الاشغال الحظرية بن حدة عبد المالك	BP 40, Nezla - Touggourt - W. Ouargla	029 68 27 85	029 68 27 85		
3256	3	4	\N	MESSOUAF EXPLOITATION DE CARRIERE	مصواف الاستغلال المحجرة	Sidi Abed Bouyemene, Ait Tizi Bouandas, W,  Setif	0771 32 35 42			
290	3	4	\N	CARRIERE BENMESSAOUD MOHAMED KAMEL		Rue Hacene Belaaboudi Souk Ahras				
291	1	4	\N	DERASSA		03,Rue Djebrane Mabrouk				
2979	2	4	\N	MAHDJARET FRERES BENMESSAHEL	محجرة الاخوة بن مساهل	Cité Leguellatni Mohamed Chérif n°177\r\nW.Guelma	070 42 34 12	037 21 67 21		
4543	1	\N	\N	NOUR DJOURA LITANKIB	نور جورا للتنقيب					
1356	5	4	\N	S.CI.T / Société des Ciments de Tebessa	مؤسسة الاسمنت تبسة	Rue Belkacem Youcef BP N°83 RP (12000) W.Tebessa	037 59 27 98 - 29 26	037 59 25 84		
1866	4	75	\N	RAZEL		BP 68 /G -Lakhdaria- W.Bouira (10200). 	026 94 43 92\n026 94 43 95	026 94 43 96	nRedjdal@razel.dz	
3718	1	4	\N	SOCIETE BORDJ EL HAMMAM DE SABLE	شركة برج الحمام للرمل	Commune de ouenza, W, Tébessa,	05 50 48 23 12			
2781	3	4	\N	RAOUABI TRAVAUX PUBLICS	روابي للاشغال العمومية	Cité 72 Logements Bt E Zouaghi A/Bey W.Constantine	031 69 25 42	031 69 25 42		
254	5	4	\N	SO.RE.M / SOCIETE DE REALISATION DE MILA	شركة الإنجاز لميلة	Zone Industrielle "Palma"  BP N° 418 - Constantine	031 66 81 48	031 66 81 48		
3575	1	4	\N	MLAKOU SABLE	ملاكو رمل	Village Akhnak   Seddouk    Bejaia	0550 93 90 80 / 0661 88 19 64	034 35 75 49		
2792	1	4	\N	SOPROCAR	سوبروكار	Cité Khaiata Mohamed AinDefla	0661 40 94 49	027 60 26 37		
255	5	4	\N	HYDRO CANAL / ENTREPRISE NATIONALE DE CANALISATIONS HYDRAULIQUES	المؤسسة الوطنية لقنوات الري	RN 04 Oued Fodda - W.Chlef	027 44 70 06	027 44 77 06		
257	1	4	\N	CCB / CERAMIC RAHMOUNE & FRERES	الشلف خزف و اجر / مؤسسة الخزف رحمون و ابنائه	Zone Industrielle Oued Sly - Chlef	027 71 07 07	027 71 99 00		
4006	1	4	\N	GRANULEX	قرانيلكس	BP 44, Commune de Tixter, W, Bordj Bou Arréridj.	035 64 14 84	035 68 55 47		
2323	5	4	\N	COSIDER TP	كوسيدار أشغال عمومية	98 RN n° 1, Birkhadem - W.Alger	040 61 70 04	049 76 03 02		
2324	2	4	\N	SABLE JAUNE MEKHATRIA MAHMOUDI FRERES	الرمل الأصفر مخاطرية الاخوة محمودي	13, Rue Nadjem - Ain Defla	027 60 13 28		Mahmoudi.belkacem1@caramail.com	
3508	12	4	\N	COOPERATIVE ARTISANALE EL IMANE	تعاونية حرفية الايمان	Rue Abdelkader N° 7, Hami El Gala, W,Ain Temouchent	07 70 98 23 52			
2513	1	4	\N	STELE / SOCIETE DE TRAVAUX & LOCATION D'ENGINS	شركة الأشغال و كراء المعدات ستال	19, Avenue Ouled Sidi Cheikh, Mohammadia - Alger.	021 53 67 73	021 53 67 73		
917	1	4	\N	TUF SAT		Cité 160 logements Bt n° 7 - Thénia - W.Boumerdès	024 83 57 08\n024 83 56 47	024 83 56 47	TUFSAT 02@ hotmail,com	
1463	1	4	\N	INDJAZ PLUS		Hai El Bina - Dely Brahim - W.Alger				
2565	1	4	\N	FIDAH & CIE GRANDS TRAVAUX PUBLICS & HYDRAULIQUES	فيداح و شركائه للأشغال العمومية الكبرى و الري	RN 90/CW 13 Sidi Khettab - W.Relizane	074 34 24 05			
2668	1	4	\N	SFERTAP	سفرتاب	Rue ZENAGUI Okacha-El Bayadh.	0555 40 18 87			
4534	1	\N	\N	WHITE STONE MARMO		Smara groupe propriété 175 Section 12, commune de guidjel, w SETIF	036 63 03 03 / 0770 82 80 50	036 63 02 02		
4691	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
3380	3	4	\N	SACAS	ساكاس	02, rue d'El Mactaa Batiment Paris, Sidi Bel Abbés  W. Sidi Bel Abbés	0770 37 44 00/0661 44 37 00	023 80 75 92		
1806	1	4	\N	CARRIERE EL MAYAMINE	محجرة الميامين	Ain Abid - Djbel Mazla - W.Constantine	061 30 60 39 / \n070 32 26 42	031 97 32 90		
559	2	4	\N	STATION DE CONCASSAGE EL RAHMA MAASKRI ALI & FILS	محطة تكسير الحجر الرحمة معسكري علي و أبنائه	Boulevard  Mohamed Khemesti, Ksar El Boukhari - Médéa	0550 93 07 43	025 67 46 25		
2744	14	44	\N	SINOHYDRO CORPORATION		Barrage Bougous El Taref	038 61 23 23	038 61 23 27	sinohydro@213.net	
4292	5	\N	\N	CONSTRUCT OUEST	البناء للغرب	07, Rue Ali Dziri- Gambetta -Oran 31000	041 82 54 57	041 82 57 20	dgconstructouest@yahoo.fr	
3105	1	4	\N	EBTPH CI MOULAY SOLTANE	او.بي.تي.بي.اش سي مولاي سلطان	CITE CHOURANE   BIRAYA  835  N° 01 \r\nDJELFA	0661 53 17 46	024 40 72 46		
4097	1	4	\N	DAHRI AHMED POUR EXTRACTION ET PREPARATION DE SABLE	ظاهري احمد لاستخراج و تحضير الرمل	Oum Ali, W, Tébessa	06 67 11 46 15			
4082	\N	\N	\N							
1897	3	4	\N	CARRIERE BACHOUCHE EL OUARDI	محجرة بشوش الوردي	07, Boulevard Grine Belgacem - W.Batna	033 85 30 58\n061 58 04 13			
3694	3	4	\N	D.K M'SILA	دي. ك مسيلة	Cité 579  Lots M'sila  BP 25 CEDEX 29   W. M'sila	0550 703 465			
4642	1	\N	\N	TRADANT LI TANKIB	تراندنت للتنقيب					
4063	1	\N	\N	MECHERI CANALISATION HYDRAULIQUES	مشري لقنوات الري	BP 79, ZONE INDUSTRIELLE DE M'SILA\r\nBORDJ BOU ARRERIDJ	035 68 49 38	035 68 48 88		
3874	1	4	\N	SOCIETE NORD AFRICAINE	شركة الأشغال العمومية لبلدان الشمال الافريقي الخمس	Aire urbaine groupe immobilièr N° 01 Division cadastrale 62 magasin N°2 Didouche Mourad W.Constantine	0550 94 27 49	030 33 70 35		
3294	2	4	\N	CHERAITIA ET ASSOCIE	شرايطية و شريكه	Cité administrative Ain El Kebira - Sétif	0771 83 66 28	036 74 30 48		
3668	1	4	\N	CARRIERE SLIGOS	محجرة سليقوس	Cité 48 Lots Pavillon 10 N° 02, W, Saida	07 71 41 77 23	036 84 60 51		
1314	5	4	\N	EBOEB / ENTREPRISE DE BATIMENT D'OUM EL BOUAGHI	مؤسسة البناء لأم البواقي	BP 32, Zone Industrielle Oum El Bouaghi - W. Oum El Bouaghi.	032 42 14 45 / 032 42 38 89	032 42 44 40	epe_eb_oeb@yahoo.fr	
1141	2	4	\N	SOCIETE D'EXPLOITATION DE CARRIERES GROUPE ZOUAOUI, HADJ KHELOUF & ASSOCIES		Carriere Djebel Grouz  Ain-M' Louk  Chelghoum-Laid  W.Mila	031 52 78 78	031 52 78 78		
1072	4	55	\N	INGRA	انقرا	12, Rue Didouche Mourad -Alger- W.Algerie	021 63 32 00	021 63 32 00		
1560	5	4	\N	CARRIERE OULED ALI EL ATTAF	محجرة أولاد علي العطاف	Bp n°30, El Attaf, wilaya d’Ain Defla	025 40 09 59	025 40 09 59		
2225	1	4	\N	SAFCER	صاف سار	ZI.15 BP 90 Setif	036 44 92 90/91/93 /95	036 44 92 88		
3004	3	4	\N	DALA	الدالة	N°26 Logements, Cité El Alia Nord Cne de Biskra - W. Biskra	(033) 74 56 61	(033) 74 56 61		
2628	1	44	\N	SHAOLIN TRAVAUX HYDRAULIQUE	شاولان أشغال الري	Commune Bir El Djir - W.Oran	040 20 60 28	040 20 60 28	xunamiao@yahoo.fr	
2931	1	4	\N	IFRANE GRAVIER & SABLE	إيفران للحصى و الرمل	Douar Oued Bellaguel Mechetat El Medraka Djebel Koudiet Ghar Ben Taga Ain M'lila w/ Oum El Baouaghi	070 27 72 39			
649	1	4	\N	TIZI CERAMIQUE	تيزي الخزف	Zone des dépôts route D'Alger, BP 594 TIZI OUZOU	026 22 43 14	026 28 39 16		
2167	3	4	\N	ENTREPRISE DES TRAVAUX PUBLICS, BATIMENT, HYDRAULIQUE AHMED YOUCEF ACHIRA	مؤسسة الا شغال العمومية البناء و الري احمد يوسف عشيرة	Cité admionistrative Chlef Centre 	027 44 70 13	027 77 89 06		
4468	1	\N	\N	TADLOUK  LITIDJARA ELAAMA	تدلوق للتجارة العامة					
4527	1	\N	\N	SARL FRERES BENABDALLAH INDUSTRIE ET COMMERCE	شركة الاخوة بن عبد الله للصناعة والتجارة	Zaatra, Commune de Zemmouri, Wilaya de Boumerdes.	0661 34 42 55/0660 82 41 94/0561 67 97 98	023 86 76 07		
2370	3	4	\N	NAAMA	نـعـمـة	Cité Emir Abdelkader, Sougueur, W.Tiaret	0557 34 49 35	046 41 31 67		
2371	3	4	\N	IRS DERICHE	IRS DERICHE	Villa Cosider N° 44 Boumerdes	024 81 88 71	024 81 88 70		
4216	3	\N	\N	ETP FILLALI ABDELHAMID MOURAD		Rue de l'indépendance N°62 B Ksar Chellala, Tiaret				
3989	1	\N	\N	BRIQUETERIE TUILERIE IZERKHEF (BTI)	بريكتري تويلري ازرخف (بي تي اي)	Séction cadastrale N° 214    LOT 15   Oued   Aissi Tizi Ouzou	0661 24 32 59 / 0550 67 92 48	026 45 74 33		
4759	\N	\N	\N	15						
3129	3	4	\N	ETTRH	او.تي.تي.ار.اش	08, Lotissemnt Ibn Toumert, Bir Khadem Alger	0771 60 97 21			
4486	1	\N	\N	DJABAL TINAKOUR	جبل تيناقور					
4487	1	\N	\N	HAMNI LI TANKIB ANI ZAHAB	حمنى للتنقيب عن الذهب					
2734	3	4	\N	EGTPH PROMESSE	المؤسسة العمومية للأشغال الكبرى و الري العهد	ZI, Desserte 5, Route de Chetouane - W. Tlemcen	070 61 18 04	043 28 68 71		
4424	\N	\N	\N	E.T.M.B ENTREPRISE DE TRANSFORMATION DU MARBRE BENCHERGUI		02 Rue KEDDOUR  RAHIM HOUCINE DEY ALGER	0661 51 29 34			
4604	1	\N	\N	TIN HADJEN LI ZAHAB	تين هاجن للذهب					
4099	1	\N	\N	CHIKH SAHRAOUI	شيخ الصحراوي	Rue Korichi Mohamed lot N° 1, Guertoufa wilaya de Tiaret	0773 10 29 03			
4053	\N	\N	\N	LAFARGE CIMENT DE M’SILA (LCM)						
4606	1	\N	\N	TIN ADJERDJER LI ZAHAB	تين اجرجر للذهب					
3353	1	4	\N	EAUX KAOUTARIA EL MENIAA	المياه الكوثرية المنيعة	Route de Ghardaia ZA, El Menea	029 81 38 61	029 81 47 67 /029 81 38 61		
3846	5	4	\N	EPC TERGA	مؤسسة أشغال البناء تارقة	Rue Baoucha Boualem, Terga, Ain Témouchent	043 65 43 67	043 65 45 89		
3401	3	4	\N	CHOUKRI CARRIERES	شوكري محاجر	Cité Sennaoua n° 7 - MILA	0661 33 85 43	031 57 79 45		
650	1	4	\N	STATION DE CONCASSAGE TITERI		RN n° 01 - 04 chemins - Berrouaghia - Médéa	025  43 77 77			
3484	3	4	\N	MOKRAM TP BATIMENT ET HYDRAULIQUE	مكرم تي بي البناية و الرى	Lotissement 74, partition n° 70, Grarem Kouka, wilaya de MILA	0560 00 33 68	031 56 56 39		
3275	12	4	\N	COOPERATIVE ARTISANALE EL HIDHAB	التعاونية الحرفية الهضاب	Commune De Oued Lili, W, Tiaret	0770 86 53 52			
2126	2	4	\N	BOULEKZAZ AISSA & FILS	بولقزاز عيسى و أبنائه	Cité des Féres Dembri W de Mila ou Senoua Superieure 	031 57 24 64 - 06 98 96 07 57	031 57 24 64		
1792	8	4	\N	ECC/ANP	المؤسسة المركزية للبناء للجيش الوطني الشعبي	Route de Chebli - Baba Ali, Commune de Bir Touta  - W.Alger	021 30 99 86 / 021 30 92 23	021 30 99 86	dgecc@hotmail.fr	
2214	1	4	\N	EL KANAA METAUX	القناعة للمعادن	Tabainet, Commune de Chebli, Wilaya de Blida	0550 22 10 80  0550 43 86 13			
467	3	4	\N	KAROUM		23, Rue Amar Mansour, Frenda ; Tiret	046 40 66 69			
4268	3	\N	\N	BELBEY EL HADJ ETPHM	بلبـــــاي الحــاج أو تي بي أش أم	Cité 64 villa n°31, Zone Oaic, Mostaganem	040 27 44 09	040 27 43 75		
3398	1	219	\N	STE ONUR TRAVAUX PUBLICS	شركة أونور للأشغال العمومية	Ain Allah Lotissement n° 02 Coopérative	021 91 83 78 /76	021 91 83 78/76		
2874	1	4	\N	CARRIERE BARKAT & BELAZIZIA	محجرة بركات و بلعزيزية	Rue des Frères Boukadi, Ain Fakkroun - W. Oum El Bouaghi	074 17 41 03			
3403	1	4	\N	LUDAR SERVICES	شركة لدار للخدمات	BP 433 Zone industrielle Hassi Messaoud, wilaya d'Ouargla	029 73 63 37	029 73 63 37		
2389	1	4	\N	SOCIETE DJEBEL EL BESBES AGREGATS	شركة جبل البسباس للحصى	Commune El Ogla - Tebessa	07 70 53 42 60			
3083	5	4	\N	GROUPE SIM						
4330	1	\N	\N	EXPLPOITATION DE MARBRE SAHARIE/EMS		Cité Gataa El Oued Commune de Tamanrasset	021 63 14 64	033 88 80 50		
309	1	4	\N	EPAV / ENTREPRISE DE PRODUCTION D'AGREGATS & DE VIABILISATION	شركة إنتاج الحصى و التهيئة بتبسة	BP 43 Ennahda 12004 Tebessa	037 49 27 62	037 49 27 62		
960	3	4	\N	GROUPE LAZREG	مجموعة لزرق	Zone Industrielle, Souk El Lil, BP 514 RP - W.Mostaganem	045434609 - 045434798 - 045434563	045 43 47 48	groupelazreg@yahoo.fr	
3150	1	4	\N	CARRIERE FRERES BENAMARA	محجرة الإخوة بن عمارة	Lemzara, commune de Guedjel, Sétif	0661 706 435	036 74 30 48		
4544	1	\N	\N	SOCIETE GHEDEIR LITANKIB ANI ZAHAB	شركة غدير للتنقيب عن الذهب					
2600	1	4	\N	CARRIERE BOUKHROUFA	محجرة بخروفة	Djebel Loussalit Ain Fekroun Wilaya d’Oum El Bouaghi	0771 81 19 14			
3011	1	4	\N	BETONEX / BETON EXPRESS	بتون السريع - بيتونكس	BP 174 A,ZN,TAHARACHT, Akbou, Béjaia	0770 93 53 38  034 35 98 40	034 35 98 41		
397	1	4	\N	SECSAB		Cité 456 logts bloc n°30 Sidi Djillali; SBA	048 56 32 25			
398	3	4	\N	CARRIERE DERDAR		Village Tarihant, Cne de Boudjima; 15630 TO				
399	5	4	\N	G22 SOUK NAAMANE		Rue bahloul El Hadi n°15 Souk Naamane	032 44 45 09			
101	3	4	\N	SELLAMI AGREGATS		Chennaoura - T'Kout  Batna 				
2957	3	4	\N	EL SENDENE TRANSPORT DE MARCHANDISES	السندان لنقل البضائع	19 Cité 127 Logts Ain Beida es senia w/Oran	070 43 29 47	041 51 49 98		
4681	3	4	\N	EL INSAF REALISATION & SERVICES	الانصاف للإ نجاز و الخد مات م.ش.و.ذ.م .م	Hoba-Reguiba - El Oued	06 60 06 07 40	032 12 61 87		
4682	2	\N	\N	ECOTP MOUHALI & FRERES	اي كوتي بي الاخوة موحالي	VGE LAZINE MOUHALI CNE SEDDOUK.	+213 70 80 92 31	0982401665		
1961	3	4	\N	SBNC / SOCIETE BRIQUETERIE NORD CONSTANTINOIS		El Achouat B.P N°01 Taher W/Jijel	034 44 91 89	034 44 53 53		
93	3	4	\N	SOEXSEL	صوكسل	129, Route de la gare ; Djelfa 17000	021 55 25 20			
94	5	4	\N	ERB / ENTREPRISE DE REALISATION DE BARIKA	مؤسسة الانجاز بريكة	Route de Batna, Barika - W.BATNA\r\nBP 135 Route de Mdoukal, Barika - W.BATNA	033 89 24 79	033 89 14 71		
95	1	4	\N	UNION TRAVAUX PUBLICS		27, Avenue Djellat Habib GEMBETTA ORAN	041 53 03 96/97	041 53 06 01		
1138	1	4	\N	SABIG	صابيق	BP° 45, Bir Ghbalou, wilay de Bouira	0550 15 79 32	026 93 06 06		
4748	\N	\N	\N	04						
1809	3	4	\N	CARRIERE BENBRAHIM	محجرة بن براهيم	BP 35 Ben Badis Constantine	070 35 05 92/\n031 96 54 66	031 96 54 66		
118	3	4	\N	ABDALLAH MOHAMED		Rue Emir AEK Sidi Akkacha -Tenes	027 74 89 67	027 76 87 88		
2910	1	44	\N	CECOMINES / CENTRE'S COALITION OF MINES		N° 80, lotissement "C", Draria - W.Alger	021 35 36 57			
3870	1	4	\N	TEMSA PLATRE	تامسة للجبس	Rue Larbi Tebessi, n° 16/65, Bousaada - M'sila	035 53 56 67	035 53 56 60		
2693	1	4	\N	BRIQUETERIE FERRADJI & CO	مصنع الأجر فراجي أندكو	BP N° 12 Route de Cherchell  Hadjout W. Tipaza				
2290	3	4	\N	EL DJAWADA	الجــوادة	El Dajoua, El Atteuf - W.Ghardaia	029 87 54 53			
3095	3	4	\N	BRIQUETERIE TAGHASTE	مصنع الاجر تاغست	51 Bis Rue 1 Movembre 1954 23000 Annaba	038 40 91 58	038 40 91 59		
4258	1	\N	\N	NOUR	نور	Parc Paradou N° 57, Commune Hydra.	0661 56 02 46	023 45 92 36		
3976	1	\N	\N	ALATRAK	الأتراك	13 CITE EL ANASSER FRENDA W, TIARET	0666 63 78 95			
4020	1	4	\N	CARIMAS	كاري ماص	16, Rue Saadoune Kaddour, Zone 08, Mascara	045 81 15 72	045 81 15 72		
4195	1	\N	\N	BRIQUETERIE AMLASSA		Cité n°36 logement participatif lot n°21 Hamla 02\r\nBatna				
4106	1	4	\N	GROUPE BOUHTIB	مجمع بوحطيب	Boulevard des martyrs N° 106, Frenda, wilaya de Tiaret\r\nHai El Louz, Frenda, wilaya de Tiaret	0555 94 18 67/046 41 56 34	046 41 31 67		
4077	1	\N	\N	MOHAMED EL ADIB DIA ELKOUIF EXTRACTION DU SABLE	محمد الأديب دية الكويف لإستخراج الرمل	ERAMLIA COMMUNE D'ELKOUIF \r\nWILAYA DE TEBESSA				
3700	1	\N	\N	SERFI AL / SOCIETE D'EXPLOITATION ET DES TRAVAUX INDUTRIELS	شركة الاستغلال و الاشغال الصناعية سارفيال	03, Baie des corailleurs, W, Annaba	030 82 17 34	030 82 17 35		
3267	3	4	\N	AMIMER BUILT	عميمر بويلت	49, Lotissement Florence El Biar, W, Alger	0771 31 65 66			
1021	5	4	\N	ETTR OUARGLA / ENTREPRISE DE TERRASSEMENT & DE TRAVAUX ROUTIERS DE OUARGLA	مؤسسة التسوية و أشغال الطرقات ورقلة	Zone Industrielle - BP 401 - W.Ouargla.	029 71 20 64 / 029 71 39 63	029 71 20 64 / 029 71 39 63		
3706	12	4	\N	COOPERATIVE ARTISANALE EL RACHIDIA DES SABLES	التعاونية الحرفية الراشيدية للرمال	Cité El Hidhab N°65/16  Bousaâda W. M'sila	0550 147 064			
4565	1	\N	\N	TIN BETOULT	تين بتولت					
3499	1	4	\N	HOUARA ETPH	هوارة للمقاولات الكبرى الاشغال العمومية و الري	lotissement Houari Boumediene  n° 69      Ouled Hamla         Oum El Bouaghi	0661 34 29 03	032 44 52 35		
4419	1	\N	\N	BRIQUETERIE DJELFA "BRIDJ"		Route de Bousaada vers Faidh El Batma, Commune de Djelfa.	0550976062/0660201350			
4422	1	\N	\N	ARSELAN						
2626	3	4	\N	ENTREPRISE PIVOT ENGENEERING ET GENERAL CONTRACT	مؤسسة المحور الهندسة للمقاولات العامة	Rue BouAamer - El Maamoura - W. Laghouat	029 92 92 53			
2627	3	4	\N	ECBTA	أو.بي.سي.تي.أ	RN 12 CHAIBA, MEKLA - W.TIZI-OUZOU	026 30 20 60/071 84 19 63			
3122	1	4	\N	CARRIERE LOUBNA	محجرة لبنى	05 Cité Belle Vue Lotissement D 116 W, Tiaret	046 41 64 83	046 41 64 83		
4641	1	\N	\N	ASSOUL LI ZAHAB	اسول للذهب					
4598	1	\N	\N	TOUKI LISTIKHRADJ ELMAADIN	توقي لإستخراج المعادن					
4699	1	\N	\N	MAGRA ROCK	ماقرا روك	Cité Amara Lot N°04 Parcelle 663 N°04 Cheraga-Alger.	0770 20 04 22 / 0555 00 94 10	023 80 75 92		
4109	1	4	\N	MOUROUR TRAVAUX ROUTIERS ET FERROVIERS	مرور لأشغال الطرقات والسكك الحديدية	Coopérative El Amel  03     Lot N° 36    Dely  Brahim   Alger	0550 54 29 53 / 0779 09 45 38	023 30 65 30		
4110	1	4	\N	TAOUAB	تواب	Route de Mejdel, commune d'El Hamel, Boussâada, wilaya de M'sila	035 53 32 32	035 53 32 09		
3620	12	4	\N	COOPERATIVE ARTISANALE ERRAHMA	التعاونية الحرفية الرحمة	Commune de Ain Mesbah   N° 30 W. Tiaret	0698 045 324			
131	1	4	\N	SOCIETE D'AGREGATS DE DJELIDA	شركة الحصى جليدة	Groupe Ouagnay  commune d’Ain Defla	0661.17.05.43	023.77.96.59		
2035	1	4	\N	EBTP HIDEB		BP 87 Sidi Amrane -Mekadma - W.Laghouat 	029 71 92 17\n071 28 83 86	029 71 92 17		
1013	1	4	\N	TRAVAUX EL HEDJEL		Rue 20 août 1955 – Djelida – Ain Defla	027 61 21 61	027 61 21 61		
1237	1	4	\N	CHALLA PRODUCTION DE PLATRE		BP  42  Eddis  W.M'sila	035 51 05 65	035 51 05 56		
1775	1	4	\N	EL IKHLASSE	الاخلاص	Oued El Anneb - Daïra de Berrahal - W.Annaba\nCité bon acceuil n° 22 -  W.Guelma	0561 612 805	038 88 21 72		
3977	3	\N	\N	ROCHE EL IZZA TIARET	صخرة العزة تيارت	20 Cité Houari Abed, Tiaret	0778 529 956	046 41 31 67		
4399	1	4	\N	BRIQUETERIE AMOURI LAGHOUAT	شركة الاجر عموري الاغواط	M'Righa Route de Djelfa Laghouat	029 11 18 18	029 11 18 18		
4400	\N	\N	\N							
3572	3	4	\N	DJELLOUL DAOUD HYDRAULIQUE	جلول داود هيدروليك	Coopérative Kessal Abdelkader   n° 12     Batioua \r\noran	041 47 92 89/0790 40 52 57	041 47 92 89		
3062	1	4	\N	SAT DISTRUBUTION	شركة سات للتوزيع	Cité Echorfa Locale N° 03 - Ouargla, Algérie	0552551543	029 71 59 37		
3352	1	4	\N	SOCIETE DES GRANDS TRAVAUX DU GRAND ERG	شركة الأشغال الكبرى العرق الكبير	Route de Ghardaia, Zone d'activité El Menea - W.Ghardaia	029 81 38 61	029 81 47 67		
3614	12	4	\N	COOPERATIVE ARTISANALE EL WOUROUD		CITE HAI SIDI YACOUB W, TLEMCEN	0771 445 053			
3615	12	4	\N	COOPERATIVE ARTISANALE BECHTOUT	التعاونية الحرفية بشطوط	Cité es 700 logements Bt  N° 08  W. Tiaret	0664 854 386			
4038	1	4	\N	CARRIERE ZERRAD	محجرة زراد	Village Ain Arko, N 11, Tamlouka, Guelma	05 53 42 52 16			
3563	12	4	\N	COOPERATIVE ARTISANALE SABLETTE  PRODUITS DE MINE	التعاونية الحرفية سابلات للمواد المنجمية	04 Rue Boualia Mohamed, Hai El Amir W, Oran	0554 557 147			
4643	1	\N	\N	KBIDA LI ZAHAB	كبيدة للذهب					
1756	1	4	\N	SOCIETE EL ADIAF GRAVIER	شركة الأضياف للحصى	Rue Coopérative Kherkhache / W.Msila	061 35 70 24 / 035 55 56 69			
3780	1	84	\N	KNAUF PLATRES	كناوف للجبس	Chemin de Wilaya N° 64, 31063 Benfreha, Gdyel, w. Oran (BP N° 02 31024 Boufatis)	041 76 34 70	041 76 34 75	info@knaufalgerie,com	
2620	1	4	\N	NICHAB EL AZRAK	النشاب الأزرق	Cité des 100 logements, Bloc HN 03, Route de l'hopital - Tissemssilt	0661 48 85 01/0770 69 75 31	046 47 88 51		
529	2	4	\N	SABLATLAS ALLOUANE & FILS	صبلاطلاس علوان و أبنائه	Cité El Atik, Bir E Ater - Tebessa 12200	037 44 88 13 / 0773 60 51 40	037 44 62 04		
3496	3	4	\N	AMENDYL	أمنديل	lot,1,  n° 6 C, Residence,  Chabani,  Val d'hydra,Alger	021 48 35 48 /0661 52 58 15	021 48 35 48		
105	1	4	\N	SEGA / SOUR EL GHOZLANE AGREGATS	سـور الغزلان أقريقا	BP 82 Sour El Ghozlane - Bouira 	0661 62 05 81	026 96 77 77		
4190	1	4	\N	DJEBEL LAZREG TRANSPORT PUBLIC	جبل الأزرق للنقل العمومي	c 28 Cité kamouni   BATNA	0660 34 09 71/ 0661 34 03 01	033 86 55 90		
4466	1	\N	\N	TALEMANAK LITANKIB AN ZAHAB	تالمناك للتنقيب عن الذهب					
4288	1	\N	\N	NOUHOUDH EL DJANOUB	نهوض الجنوب	Cité Ain Essahra , Nezla , W. Ouargla	0661 385 494	02964 18 88		
4775	1	4	\N	BBS ELECTRONIQUE	بي بي أس إلكترونيك	Cooperative Immobiliere n° 43 Les Hauts Plateaux Ouled §Fayet - W Alger	023 33 64 74 / 0663 41 19 94	023 33 64 78		
1877	1	4	\N	CARRIERE OULED KHLOUF	محجرة أولاد خلوف	Cité El Hammadia N° 106  W. Bordj Bou Arreridj	0552 10 08 47	035 86 81 62		
3502	12	4	\N	COOPERATIVE ARTISANALE EL FELLAH	تعاونية حرفية الفلاح	Rahou Kada N° 07, W, Ain Temouchent	07 70 98 23 95	043 60 15 01		
4708	1	\N	\N	MESSAOUDI BRAHIM TRAVAUX CONSTRUCTION ET AEROPORT						
4709	1	\N	\N	AMANTHAF LI DAHAB	امنطاف للذهب					
4698	1	4	\N	OULED DJAMILA SOUBAIA IMPORT EXPORT	أولاد اجميلة السباعية للاستيراد و التصدير	213 ilots 236,237, 2038 Commune El Bayedh	0661 20 99 66			
4434	1	\N	\N	INGHIMLAN	إنغيملان					
1988	3	4	\N	CBY / CARRIERE BOUARROUDJ YOUCEF		N° 4 Cité du vieux Mila 43 000	031 57 31 07	031 57 73 71		
2630	3	4	\N	CARRIERE SIDI SLIMANE	محجرة سيدي سليمان	1 Rue KADDAR EL MATMAR - W. Relizane	070 41 20 48			
2631	3	4	\N	CARRIERE BELHADJ ABDELKADER	محجرة بلحاج عبد القادر	Route de Oued El Djemaa - W.Relizane	070 92 78 33			
1114	2	4	\N	BOUTEHLOULA & ASSOCIES		Cité El Masdjid El Kouif  W.Tebessa	037 40 32 00			
4385	1	\N	\N	CARRIERE SAAD KADRI	محجرة ساعد قادري	Cité Belle vue, Promotion immobilière Kadri, w. BATNA.	0770 71 77 54	033 80 33 90		
26	3	4	\N	TTBH / TOUATI TRAVAUX BATIMENT HYDRAULIQUE	تواتي للأشغال البناية و الري	08 Rue d'Hippodrome Batna	033 81 83 96	033 81 83 96 		
527	3	4	\N	SIDK EL INES		10, Rue 17 Octobre Souk Ahras	037 32 27 36			
2248	1	4	\N	CARRIERE RICHE PLATRE	محجرة ريش للجبس	Ain Yagout - El Madher - Batna 	074 60 23 29			
2799	3	4	\N	ETPBH RAHMOUNI SADDOK	او تي بي اش رحموني صادوق	RN 04 Khemis Miliana w/Ain Defla	027 65 94 00			
1074	1	4	\N	AGREX	اقراكس	SIEGE SOCIALE AGREX. KEBOUBA\r\nCOMMUNE DE OUED LILI WILAYA DE TIARET	0661 353 333			
2292	3	4	\N	BRIQUETERIE EL AMEL	مصنع الأجر الأمل	01, Bicha Youcef - Annaba	038 83 23 66	038 83 23 13		
4127	\N	\N	\N	S.A.A.P.R COMPANY	أس.أ.أ.بي.أر كوماني	Cité des 460 logements, Ouargla W. Ouergla	0770 63 44 50 et 0661 51 07 10	0770 63 44 50 et 0661 51 07 10		
4129	1	\N	\N							
3715	12	4	\N	COOPERATIVE ARTISANALE BOUCHRA	التعاونية الحرفية بشرى	Lot N° 924   Commune de M'sila  W. M'sila	0791 905 192			
3716	3	4	\N	ENTREPRISE TAIBAOUI	طيباوي للمقاولات	Cité de la paix  Aflou W. Laghouat	0776 380 001			
4083	\N	\N	\N							
4199	5	\N	\N	BISKRIA CIMENT	البسكرية للإسمنت	DJAR BELAHRACHE, BRANIS\r\nWILAYA DE BISKRA	0661 37 42 83	033 55 81 22		
3435	3	4	\N	SIDI BOUZID BENALI	سيدي بوزيد بن على	Rue des martyres n°14 Cne de Takhemaret W. TIARET				
4173	3	\N	\N	N'HAIRIA AMINE	نهارية أمين	Mers El Kébir, Ain El Turck, wilaya d'Oran				
3635	1	4	\N	SID BEN SAHNOUN ET ASSOCIE  IMPORT- EXPORT	صيد بن سحنون و شركائه للإ ستراد والتصدير	Cité El Amel   n° 213    Ain Fakrounb   Oum El Bouaghi	032 40 36 93	032 40 36 98		
3378	1	4	\N	SABLETTE PRODUITS DE MINES	صبلات للمواد المنجمية	04, Rue Boudalia Mohamed Cité El Amir, W,Oran				
3379	1	4	\N	CARRIERE SOUIKI	محجرة سويكي	Rue Meghlaoui Ramdane N°114, Mila	031 47 70 86 / 0661 33 81 27	031 47 70 86		
4447	1	\N	\N	ITOUKLANE	ايتوكلان					
4448	1	\N	\N	ELHADJ MOULITEH LITANKIB	الحاج موليته للتنقيب					
3789	1	4	\N	FM  PRODUITS	ف.م. برودوي	Cité 170 logts Bat B 08, n° 03 Said Hamdine, Bir Mourad Rais - Alger\r\nCoopérative El Baraka, Villa 61, Tiksraine - Alger	021 54 49 57/021 40 28 51 /021 40 29 57	021 54 49 58/57		
3793	1	4	\N	FRERES BOUBECHICHE INDUSTRIES	الاخوة بوبشيش صناعي	BP 70, 18 Cité frères Ben Chadi, Fesdis - Batna	033 20 11 43/54	033 20 11 43/54		
754	3	4	\N	OTMANI	عثماني	06, Ain Nedjar    W. Tlemcen (13000)	0770 87 60 10	035 777997	Si - Khelifa@wissal.dz	
2705	1	4	\N	AZROU CONCASSAGE	ازرو لتفتيت	Cité Ain Abdellah, Bloc A, n°134, Boumerdès	024 81 30 43	024 81 30 43	AZROU@AMENHYD.COM	
2649	1	4	\N	SOGEMINE	صوجيمين	20, rue Samai Hocine ( Cité Kouicem) 41 000  W. Souk Ahras				
155	3	4	\N	ENTREPRISE DES TRAVAUX DE CONSTRUCTION RAMLA AMAR	مؤسسة رملة عمر للاشغال البناء	Route Principale El Abadia - Ain Defla	027 63 82 69 			
1896	3	4	\N	CARRIERE BACHOUCHE TAHAR	محجرة بشوش الطاهر	Boulevard Ben Tayeb - Cité Bouakal III - W.Batna	072 32 70 45			
1133	3	4	\N	SABLIERE LA COLLINE D'OR		Cité Patrice Lumumba Nouvelle Bloc C n° 09	038 86 92 80	038 86 92 80		
1662	1	4	\N	CARRIERE EL HADJAR EL MOKHTAR	محجرة الحجر المختار	El Euch centre - Bordj Bou Arreridj- B.P N°77 El Euch centre W.M'Sila.	062 30 70 21	0770 95 69 07/0560 09 57 61/		
2521	12	4	\N	FRERES BELAININE	الاخوة بلعينين	Belainine Mohamed, Boughezoul Centre - X.Medea	073 51 62 13			
324	1	4	\N	KFCA	شركة قاسي محمد أمزيان و أخواته	Azrou Kellal Cne Ath Mansour - Bouira	026 95 83 66			
1674	1	4	\N	CANCATRAV		Cité Essalem N° 31 Route Nationale N° 6 W.Béchar				
1675	1	4	\N	TOUAT DES TRAVAUX GENERAUX	توات للأشغال العامة	Zone Industrielle, BP 98, Adrar, wilaya d'Adrar	049 96 95 90 / 049 96 99 88/ 0661 27 50 66	049 96 95 44		
3031	1	4	\N	CENTRE  DE CONTRÔLE MERIEM	مريم مركز المراقبة	Zone Industrielle w/Tebessa	037 49 32 20	037 49 32 20		
307	2	4	\N	TORCHE	طرش	BP 508  BBA	061 37 04 50	035 68 16 32		
4170	1	\N	\N	OTMANI	عثماني	Djebel M’nit, Ouchba, Tlemcen	07 70 87 60 10	035 77 79 97		
4716	13	4	\N	DJRIDA TRAVAUX DE CONSTRUCTION ET DE ROUTES	جريدة لاشغال البناء والطرقات	Gataa El Oued, Tamanrasset	023 80 75 92	023 80 75 92		
4731	1	\N	\N	AG EMELLAL	أق ملال للتنقيب					
1513	3	4	\N	BRIQUETERIE TAIBA		Zone Industrielle M'Sila	035 55 01 21	035 55 60 55		
894	1	4	\N	EL MANAR	المنار	Rue el kaada, Aflou, laghouat	043 20 31 41 / \n070 31 00 65			
2665	1	4	\N	SOCIETE DE BRIQUETERIE SIBOUSE BESBAS	شركة أجر سيبوس بسباس	Besbes - W.El Tarf	061 32 89 00			
4227	1	\N	\N	AGRE ROC CAR	أقريرمك كار	Lotissement Tali Maamar,n°16 Bt A, Bouira	0550 99 13 68			
4752	\N	\N	\N	08						
4753	\N	\N	\N	09						
4754	\N	\N	\N	10						
4755	\N	\N	\N	11						
3862	1	4	\N	DJERAF HODHNA ROUTE	جراف حضنة الطرق	Route de Bousaada, Local n° 02, M'sila	035 55 07 68	035 54 81 45		
4730	1	\N	\N	ELHADJ MOULITA LITANKIB	الحاج موليته للتنقيب					
4154	\N	\N	\N							
4158	\N	\N	\N							
4160	\N	\N	\N							
3316	1	4	\N	CGMSG	سي.جي.أم.أس.جي	BP 61 E, Sour El Ghozlane, wilaya de Bouira	026 96 62 92 / 96 85 40	026 96 71 64 / 96 87 35		
2629	5	4	\N	EPTP SIDI BEL ABBES / ENTREPRISE PUBLIQUE DE TRAVAUX PUBLICS	المؤسسة العمومية للاشغال العمومية لسيدى بلعباس	Zone Industrielle Sidi Bel Abbes BP 119				
3516	3	4	\N	AICHI B.T.P.H	عيشي ب.تي.بي.اش	Zone Industrielle Hay El K'sab N° 49  Messerghine  W. Oran	0661 509 404			
3733	5	4	\N	SO.CO.BA	شركة بناء العمارات بالجزائر					
4432	\N	\N	\N		ش.ذ.م.م إنغيملان					
3272	3	4	\N	CHAABAT NAKHLA	شعبة نخلة	Rue des frères Mkhanef Djiouia, Relizane	0770 617 053	046 83 33 91		
2633	1	4	\N	EXTRACTION DE SABLE SAADI & DEMANE	استخراج الرمل سعدي و دمان	057 Lot 124 Lots Local N° 03 Magra - W/ M'sila	035 59 23 33 / 035 59 22 00 / 0660 501 319	035 59 23 33	dodokan01@yahoo.fr	
2496	\N	4	\N	BELHADI Ahmed		Cité Mefti -Oulad Moussa - W.Boumerdes.	061 65 04 72			
3066	3	4	\N	AGRIFERT	أقريفارت	ZI EL ALLELIK EL BOUNI - ANNABA	038 52 60 23	038 52 13 70		
2918	3	4	\N	ATTALAH ABDERREZAK CARRIERE PLATRE	عطاء الله عبد الرزاق لانتاج الجبس	Commune Ouled Khlouf Tadjenet w/Mila	077 52 32 50			
1644	1	4	\N	ESMA MAZLA		7, Rue E.M.K El-Khroub W.Constantine	031 96 73 55			
2003	1	4	\N	CARRIERE PIERRE D'OR	محجرة الحجرة الذهبية	Cité Djebel El Ouahch n° 462 - W.Constantine	061 30 51 87 / \n061 37 85 74	031 92 44 61		
618	3	4	\N	ECO / UNITE PRODUCTION INDUSTRIELLE		Route de Tafraoui Arbi BP 110 W.Oran	041 41 87 23			
3052	1	4	\N	BAHA AGREGATS	بحة أقريقا	Cité Ain El Kebir, Local n° 19 Médéa - W.Médea	0661 58 69 01	025 58 05 56		
1122	3	4	\N	SABLIERE YAFRA	مرملة يافرة	N° 348, Cité des Dalia - W. Tlemcen	043 20 31 02 	043 20 77 72		
1123	3	4	\N	CAZAGRAL OTHMANI		Hai El Wouroud, n° 24, Imama - Commune de Mansourah- W.Tlemcen	043 20 22 96	043 21 47 08		
583	3	4	\N	CARRIERE EL MOUHOUBIA		3, Rue de la Haye W.Souk Ahras	037 32 72 62			
4561	1	\N	\N	MAAZOUZA LITENKIB	معزوزة للتنقيب					
4562	1	\N	\N	COOPERATIVE SIKA LI ZAHAB	تعاونية سيكا للذهب					
4563	1	\N	\N	SAHRAA TOURST SOUF	 صحراء تورست سوف					
4564	1	\N	\N	AMAYAS D'OR	اماياس دور					
4692	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
4650	1	\N	\N	IMHERHATEN LITANKIB	إمهرهاتن للتنقيب					
4651	1	\N	\N	AMNILEL LI TANKIB	امنيلال للتنقيب					
4017	3	4	\N	GEDS	مجمع استخراج و توزيع الرمل	Cité Nahdha bloc 23N05 El Khemis Djelfa	05 56 15 12 64	021 38 81 07		
3609	12	4	\N	COOPERATIVE ARTISANALE BENI BARBAR	التعاونية الحرفية بني بربر	10 Bt A Cité 600 Logts, Plaine Ouest II Annaba	037 37 82 56  0554 563 943	037 37 82 56		
4251	1	\N	\N	IMADGHASSEN COMMERCE	إمدغاسن   للتجاارة	KSAR EL MOURABITINE Groupe titré n°086 du lot n°154 commune d'ain Salah wilaya d'ain salah.	029 38 03 37/ 0662 04 00 63	029  38 03 37		
4252	\N	\N	\N							
4526	3	\N	\N	HADDAK IMPORT EXPORT	حداق استيراد و التصدير	Villa N°04 rue Moussa Hamadouche Hassan Dadi Belfort  El Harrach   W-Alger	021 82 95 28	021 82 95 28		
3538	1	4	\N	EL MOUMAYEZ SERVICES	المميز للخدمات	Zone Industrielle     Touggourt    Ouargla	029 68 19 41 /0770 36 59 24	029 68 19 41		
4757	\N	\N	\N	13						
4758	\N	\N	\N	14						
4760	\N	\N	\N	16						
4761	\N	\N	\N	17						
4762	\N	\N	\N	18						
3208	3	4	\N	CARRIERE ZAIDI EL KHEIR	محجرة زايدي الخير	Coop, El Kheir, N° 19 Cité Kaaboub, W, Sétif	05 56 33 84 72 / 07 72 97 95 70 / 05 50 02 00 02	036 62 81 83		
1562	3	4	\N	SOCIETE HOURIA SERVICES	شركة الحرية للخدمات	Cité Houria, El Oued Ville - W.El Oued.	032 24 91 56 / 061 59 28 73	032 24 86 90		
2147	3	4	\N	ENTREPRISE MANAA ALI D'EXTRACTION & PREPARATION DE SABLE	مؤسسة مناع علي لاستخراج و تحضير الرمل	Sedrata - W. Souk Ahras				
2367	5	4	\N	GROUPE ETRHB HADDAD	مجمع أو.تي.أر.أش.بي. حداد	Zone d'Activité Dar El Beida - Alger\r\nZone d'activité Lot N° 20 Bp 63 BIS Said Hamdine  Bir Mourad  Rais           Alger	021 50 51 21/021 50 58 21	021 50 89 69/021 50 89 69	contact@etrhb.com	http//www.etrhb.com#http://http//www.etrhb.com#
3310	3	4	\N	DALANJASSIA LILHASSA		Rue du 20 Aout, n° 10, Hamadia - W.Tiaret	0774 42 38 96			
1176	1	4	\N	FARATP	فـرنـح	Zone d'activité El Kerma Lot 12-13-17 et 18 W/Oran	041 41 78 73 / \n041 41 72 20	041 41 78 73\n041 41 72 20		
4008	1	4	\N	EL MADINA EL DJADIDA	المدينة الجديدة	Cité El Amir Abdelkader, Commune de Takhmaret, w TIARET	0558 05 03 31	046 31 31 75		
3056	3	4	\N	MINES DU TASSILI	مناجم طاسيلي	66 Bvd ALI BOUFELGUED - ALGER	0550 02 81 91	021 94 52 79		
4427	3	\N	\N	LITIM TRAVAUX PUBLIC ET HYDRAULIQUE						
4493	1	\N	\N	AZERZEROU	ازرزرو					
3596	12	4	\N	COOPERATIVE SABLIERE AOURARTORCHE ET BOULEKROUNE	تعاونية مرملة اورار طورش و بولقرون	Cité 238 Logts N°7 El Khroub, W, Constantine	05 50 30 14 08	031 96 55 99		
3213	1	4	\N	CARRIERE BOUTALEB	محجرة بوطالب	Cite  Bouaroua  coop  Immobiliére  Larbi Ben M'hidi   N° 1 W, setif	0661 35 30 30	036 952 41 83		
3216	7	4	\N	ENTREPRISE DES TRAVAUX ROUTIERS SOUK AHRAS	مؤسسة اشغال الطرقات سوق اهراس	zone indusrielle route de Annaba  Bp : 335      Souk Ahras	037 32 59 59	037 32 49 98		
67	3	4	\N	ADJAL MILOUD CONCASSAGE	عجال ميلود لتفتيت الحجارة	Kef Erand, Ain Roua, Sétif	0661 350 372	036 80 84 50		
74	5	4	\N	SOVEST / SOCIETE DE VERRERIE DE L'EST		Sovest El Ma Labiod 	037 48 41 49	037 48 42 12		
76	5	4	\N	ENOR	مؤسسة إستغلال مناجم الذهب	Résidence Chaabani, Bt 8, entrée C1, Val d'Hydra - Alger	021 60 82 65 / 66	021 60 45 62	enor@enor.dz	
1499	1	4	\N	CARRIERE BELAZIZIA & ASSOCIES	محجرة بلعزيزية و شركاؤه	BP 94, Ain Fakroune (04345)  W.OumEl Bouaghi	0770  63 74 14 / 0770 41 12 14			
3396	1	4	\N	ALCONOS	ألكنوس	coop noor  n° 04 Cité   Belkhired Hacéne   Bel air\r\nSETIF	0661 353 437	036 84 97 30		
4713	1	\N	\N	AGHISTEN LITANKIB	إغيستن للتنقيب					
4374	1	\N	\N	BRIQUETERIE CERAMIQUE DE LA REINE DES ZIBANS	 مصنع الاجر والخزف لارين دي زيبون	Villa Elder N°11 Boumerdes	0550902104			
964	5	4	\N	ERGTS / ENTREPRISE DE REALISATION DES GRANDS TRAVAUX DU SUD	مؤسسة الانجاز للأشغال الكبرى للجنوب	BP 11 -  Base Irara - Hassi Messaoud - Ouargla	062 87 48 63 - 021 24 28 60	029 73 04 82		
3000	1	4	\N	LIT-MAG / LITTERIE MAGHREBINE	عدة السرير المغاربية	Zone Industrielle Desserte 05, Chétouane w/ Tlemcen	07 70 95 04 54			
3908	1	4	\N	SAHLI DES TRAVAUX PUBLIC ET CARRIERS	سهلي للاشغال العمومية و المحاجر	Ain El Beida, Cité Saidi Djemoui, W, Oum El Bouaghi	06 64 95 58 73			
4054	\N	\N	\N		لافارج إسمنت مسيلة (أل,سي,أم)					
3907	1	4	\N	SOCIETE DAHMANE TRAVAUX PUBLICS ET HYDRAULIQUES	شركة دحمان للأشغال العمومية و الري	Lotissement coopératif CIA, Ilot 01 et 02, Route d'Oran-Mostaganem - W. Mostaganem	0550 16 22 30/17	045 30 76 93/94		
4354	1	\N	\N	EL ISRAA	الإســــــراء	Route de Belabes, Ouled Mimoun, Tlemcen	07 70 60 08 22			
4325	1	\N	\N	GNMC		Z.A.E Route de Biskra n°03 - Bousaada wilaya de M'sila	035 44 65 50	035 44 65 02		
4308	1	\N	\N	ROAD STAR TERRASSEMENT	رود ستار تسوية	Imama Projet El Bahdja 2, Bt H N° 19, Commune de Mansourah, Tlemcen	05 50 53 83 80			
3974	1	\N	\N	TIMADANINE BRIQUETERIE  EL HAMEL	شركة الياجور تيمادنين الهامل	BP 285 Rue BOUZIDI Abdelkader ,Adrar	049 96 89 19	049 96 78 91		
1157	3	4	\N	AMARA AREZKI		Village de Tirourda Iferhoune W/ Tizi Ouzou	061 26 03 59			
1092	3	4	\N	CARRIERE GUEZLANE SALAH	محجرة قزلان صالح	Cité Gouadjlia rabah n° 15, Ain Mlila - W.Oum El Bouaghi	032 45 15 07			
4301	\N	\N	\N	BELOUFA AGREGATS	بلوافة أقــــرق					
3135	3	4	\N	LAGRAA LAKHDAR TRAVAUX PUBLICS	لقرع لخضر للاشغال العمومية	Mansourah Centre de Mansourah W, Mostaganem	07 70 28 48 21 / 06 61 58 77 97			
3390	3	4	\N	SPEED ROAD	سبيد راود	Centre commercial le Rocher Noir   800 lgts \r\nBoumerdes	0661 70 20 31 / 0661 65 34 00	024 81 53 20		
4437	1	\N	\N	ICHIHEN LITANKIB	إشيهن للتنقيب					
4438	1	\N	\N	ARKHALA	ارخالة					
4439	1	\N	\N	BOUGHSSA LITANKIB	بوغاسا للتنقيب					
4366	3	\N	\N	SEKCERAM	ساك سيرام	Zone d'activité Lot N°48 6ieme Tranche  \r\nW. SETIF	036 831 595	036 449 138	sekceram@yahoo.fr	
4367	3	\N	\N	LUXE TILE	ش ذ ش و م م ليكس تيل	Route Nationale n°3  Fesdis-Batna W-Batna	05 50 50 11 00	033 80 82 10		
3927	5	4	\N	BATTIA	باتتيا	Zone Industrielle, Zaroura, Tiaret	046 41 94 40	040 79 07 84		
3419	3	4	\N	BENEDDINE TRANS	بن الدين ترانس	Cité fréres Sahraoui   Larbaa    Blida	0554 66 60 23			
1117	1	4	\N	SECJ	أس أو سي جي	Cité Abderrahmen Ouled Mimoune w. Tlemcen	0550 82 70 80	043 36 34 90		
2797	1	4	\N	BRIQUETERIE FRERES BOUZID	مصنع الآجر الإخوة بوزيد	La route nationale n°5 Tadjnanet  w/Mila	031 52 27 60/0661 78 26 25	031 52 27 66		
3065	3	4	\N	KARA TRAVAUX	شركة قارة أشغال	Centre Commercial BP n° 382, Commune de Rebaia - W. Médéa	0770 68 81 22	025 57 83 59		
1757	1	4	\N	MEHSAS NATIONAL TUILES & BRIQUES	مهساس الوطنية للقرميد و الاجور	Zone Industrielle Lots 10 et 11 Commune de BBA W. Bordj Bou Arreridj	0770554 971/035873251	035 87 32 55		
3131	12	4	\N	COOPERATIVE SIDI EL ABED	التعاونية الحرفية سيدي العابد	Commune de tiaret - W.Tiaret	0772 82 29 48			
1758	3	4	\N	DHERIETT	DHERIETT	7 Rue des frères Aliliche BP 427, wilaya de Mostaghanem	0772 94 66 43 / 045 23 57 07 / \n045 21 15 53	045 20 26 69		
2877	3	4	\N	ENTREPRISE EL MANAR	م ح المنار	Oued El Anab  w/Annaba	038 84 75 38	038 84 75 38		
1632	3	4	\N	ADRER AZIZA		Ain Abid W.Constantione	071 54 97 56 / \n061 30 60 39	031 97 32 90		
2042	2	4	\N	CARRIERE GUERAICHE LARBI & FILS	محجرة قرعيش العربي و أبناؤه	Rue 18 février Rue de la Gare - Tadjenanet - Mila	031 52 23 95\n070 88 62 95			
216	1	4	\N	PROMAISSE	محجرة أوراس المايدة (الموعد)	BP 127 Hammam Bouhadjar 46200 - W.Ain Temouchent.	043 71 59 20 / 040 96 00 37	043 71 59 20		
3579	3	4	\N	SIDI SLIMANE	سيدي سليمان	Ain Kermes - Tiaret	06 61 34 23 73			
3735	1	4	\N	SMCO / SOCIETE DE MATERIAUX DE CONSTRUCTION OUARGLA	شركة مواد البناء ورقلة	Zone industrielle route de Ghardaia  BP 1239   W. Ouargla	029 71 77 91	029 71 64 27		
3542	3	4	\N	MEDI TP SABLES	مدي تي بي سابل	Local n° 3, Belaiba centre - M'sila	0799 92 07 60	023 80 75 92		
3544	12	4	\N	COOPERATIVE ARTISANALE ENNOUR	التعاونية الحرفية النور	Cité Ennadjah , Communed eTAkhmaret  W. Tiaret	0555 038 751	041 44 38 88		
3290	1	4	\N	ETPB SLIMANA	شركة أشغال العمومية و البناء سليمانة	Village Aghrib, Commune Aghrib, W, Tizi Ouzou	0550 59 43 70 / 0550 59 74 40	026 20 26 72		
4494	1	\N	\N	TADEHOUT LITANKIB	تادهوت للتنقيب					
3853	5	4	\N	BATIMETAL REALISATION	باتيمتال للإنجاز	Zone Industrielle Oued Smar, BP 104 - Alger	021 51 40 00	021 51 40 00		
4028	1	4	\N	SOCIETE SAADOUNI BOUCHETA	شركة سعدوني بوشتة	Cité Mohamed Boudiaf- Commune de Rechaiga, W, Tiaret	05 50 30 72 43			
4238	1	\N	\N	GHERAISSA BRIQUETERIE	غرايسة بريكوتري	Rue Abbane Ramdane BP23 Temacine W. Ouargla.	0660607881	029641104		
4302	1	\N	\N	CHABANI BATIMENT		Residence Chabani, Val h'Hydra lot n°3 bT D6 Alger - wilaya d'Alger	021 69 36 14 / 021 48 35 73 / 021 69 32 64	021 69 36 14 / 021 48 35 73 / 021 69 32 64		
4098	3	\N	\N	BEN YAHIA  TPS	بن يحي  - تي بي أس -	Cité Slimani Slimane Bt 740 N°01 F, Ain Ouassera, wilaya de Djelfa	0550 19 13 49	025 22 43 18		
4031	1	4	\N	SIPED	سبد	ZI Sortie N° 6, Parcelle N° 29, Commune de Chetouane, Tlemcen,	05 60 01 39 11	043 26 60 20		
4043	5	\N	\N	S.C.S / SOCIETE DES CIMENTS DE SIGUS	شركة الإسمنت سيقوس	06, Cité El Moudjahidine Lot N°06, Sigus, wilaya de Oum El Bouaghi	031 66 38 53 / 031 66 46 72	031 66 38 53 / 031 66 46 72	scsigus@yahoo.fr	
4631	1	\N	\N	AZROU ASAOUALEN LITANKIB ANI ZAHAB	ازرو اساوالن للتنقيب عن الذهب		06663998700			
2175	1	4	\N	CARRIERE EL KHENIG	محجرة الخنيق	Saf Saf El- Ouesra, Daira Oum- Ali - W.Tebessa				
4351	5	\N	\N	S.O.BATI	بناء جنوب غرب أس أو باتي	BP 34, Hasnaoui Said, El Bayadh	049 67 86 08	049 67 82 22		
3699	12	4	\N	COOPERATIVE ARTISANALE EL SAADA	التعاونية الحرفية السعادة	Route d'Alger  N 06/297 Bousaâda W. M'sila	0770 235 723			
3880	1	4	\N	CARRIERE EL KAHINA	محجرة الكاهنة	Cité esbaate local N° 11 N° 65 Commune Rouiba Alger				
2520	3	4	\N	ENTREPRISE DES CARRIERES DE BOUIRET LAHDAB	مؤسسة المقالع لبويرة الاحداب	Bab El Charref Bt 82 n° 13 - Djelfa	027 87 70 59	027 87 70 59		
2440	1	4	\N	TRAGASET	تراقسات	Cité Hachemi 1er Tranche D6 N° 47 - Setif	036 91 99 70	036 91 75 63		
4445	1	\N	\N	TEGHEREN	تغرين					
3825	1	4	\N	GROUPE BARA ET ASSOCIE TRAVAUX PUBLICS ET CONSTRUCTIO T.C.E	مجموعة بارة و شريكه للاشغال العمومية و البناء تي.سي.أو	200 Logts LSP Bt B1 N°02, Ain Mousse El Hidhab, wilaya de Sétif.	0661 35 18 09	036 51 29 51 – 036 63 02 02		
3806	5	4	\N	EPMC TAMANRASSET / ENTREPRISE DE PRODUCTION DES MATERIAUX DE CONSTRUCTION DE TAMANRASSET	مؤسسة إنتاج مواد البناء تامنغست	Gataâ El oued BP 1027 - W. Tamanrasset	029 344 146	029 343 160	epmc_tam@yahoo.fr	
4256	1	4	\N	NOUR	النور	Centre commercial et d'affaire Al Qods, Cheraga	0661560246		btpnour@yahoo,fr	
4767	1	4	\N	MOULINS ELHARAM	مطاحن الهرم	Zone d'activité -Commune de M'sila	0560 26 43 54			
2871	5	4	\N	HYDRO TECHNIQUE		Immeuble "M", Rrue Ibnou Ishak El Maoussili - Le Panorama, Kouba - Alger	021 81 15 63	021 81 21 52		
4614	1	\N	\N	IBRAKSSASSEN	ابركساسن		0699617844			
3915	1	\N	\N	ETPHM	أو,تي,بي,أش,أم	Bourdj Zada     Dehamchia    Ain El Kebira	036 95 40 40 / 0661 57 39 15	036 95 40 40	Eurl sekrine@yahoo.fr	
3693	12	4	\N	COOPERATIVE SIDI BAYZID DES SABLIERES	تعاونية سيدي بايزيد للمرامل	Commune de Sidi Baizid  W. Djelfa				
3624	12	4	\N	COOPERATIVE ARTISANALE ENNAHAR	التعاونية الحرفية النهار	CITE CMMUNALE  MAHDIA   W, TIARET	0796845115			
3086	1	4	\N	ISO AGRAGAL	ايزو اقراقال	MAIZIA COMMUNE HANACHA, DAIRA OUAMRI	017 00 93 96 / 0770 95 13 31	021 55 30 39		
2282	3	4	\N	MOHAMED BOUREZZANE CARRIERE BOUDJERAR		Ain Tinn - Commune de Fom Toub - Ichmoul - W.Batna 				
4239	1	\N	\N	SERADJ FABRICATION ET SERVICES		commune de Guemmar				
4591	1	\N	\N	IDHAF LITANKIB ANI ZAHAB	اظاف للتنقيب عن الذهب					
2783	1	4	\N	SAVECOM	\r\nسافيكوم	Route National N° 5 Z I Bir El Arch W.Setif	061 35 00 59			
4583	1	\N	\N	AGHRINE LITANKIB ANI ZAHAB	أغرين للتنقيب عن الذهب					
4411	1	\N	\N	REMILA CARRIERE	ر مــيــلة كــاريار	Zone d'Activité Commerciale lot n°50 \r\nSOUK AHRAS	0661 36 76 68	021 20 51 20		
1087	1	4	\N	BERCUL CONSTRUCTING COMPANY		06, Bd Stiti Ali W/ Tizi Ouzou	026 21 30 70	026 21 89 08		
4153	1	\N	\N	LARBEG	لاربــاق	BP N° : 17 Djebel El Ouahch Constantine	0772 909 226			
4037	3	4	\N	SOUSTARA GRANDS TRAVAUX PUBLICS ET HYDRAULIQUES	سوسطارة للاشغال العمومية الكبرى و الري	Cité El Mefti, Commune de Ouled Moussa, Boumerdes	024 91 72 18	024 91 72 19.		
3887	1	4	\N	EL INTISSAR	الإنتصار	Cité Belair N° 66 Sigus W. Ouml El Bouaghi	06 61 30 29 47	032 45 24 16		
4076	1	\N	\N	REBAA & CHIKH BLED GROUPE	شركة ذات مسؤولية محدودة رباع & شيخ بلاد قروب	12 Rue provence/Ain Turk / Oran	0555 03 87 51			rcgroup@hotmail.com#http://rcgroup@hotmail.com#
2291	3	4	\N	RIMEL EDOUGH	رمال ايدوغ	Cité 192 Logements Salah Boulkaroua - W.Skikda	070 98 28 20	038 72 15 90		
4473	1	\N	\N	IN KERKOUN LI ZAHAB WA TANKIB	ان كركورن للتنقيب عن الذهب					
4101	1	4	\N	S.I.K.A.Y.A  INDUSTRIE	أس.إ.ك.أ.ي.أ   أنديستري	Rue Boudjelel M''Hamed    N° 10      Relizane	0550 51 68 40	046 72 20 19		
3842	1	4	\N	ECG / ENTREPRISE DE CARRIERE ET DE GRAVATS	أو.سي.جي	Zone Industrielle, tranche N°431, Sidi Bel Abbes, wilaya de Sidi Bel Abbes.	048 77 08 30	048 77 08 30		
2530	1	4	\N	INDTRAV	أندتراف	02, Rue Menaceur Chaabane lot Sayhi 2 - Biskra	033 74 16 75 / 070 97 21 95	033 74 16 75	eisc_saker@yahoo.fr	
4262	1	4	\N	LACIDI ET CIE   TRAVAUX  DE CONSTRUCTION ET HYDRAULIQUES	لصيدي و شريكه لأشغال البناء والري	Rue El Zarrouk  Amar       Chiffa     Blida	0660 423 958 / 0782 20 37 64			
4796	1	\N	\N	BRIQUETERIE AKBOU			034 19 60 35	034 19 60 36		
3426	1	4	\N	BOUHERAOUA HAMID FRERES  TPHB	بوهراوة حميد إخوة تي بي آش بي	Local N° 02 Village Bouheraoua Sidi Naâmane  W. Tizi Ouzou	0550 16 75 72  0661 854 476	023 85 00 64		
1053	1	4	\N	BOUKERDA TRANSPORT DE SABLE	بوقردة لنقل الرمل	Rezarza Centre - W. Medéa	0661 62 60 69 / \n025 59 71 60			
4701	1	\N	\N	EL HAFADA		Résidence Mimouza n°29 groupe concessionnaire n°322 Batiment F1 lotissement n°77 C, Rez de chaussée commune de staoueli	0560956836			
4495	1	\N	\N	TADENT LI TANKIB	تادنت للتنقيب					
4015	1	4	\N	EXPLOITATION DE CARRIERE TAAKOUCHT	لاستغلال المحجرة تاعقوشت	Commune de Chemora, Batna.	07 70 12 29 26			
4800	3	\N	\N	CARRIERE BELLAHCENE SLIMANE	محجرة بلحسن سليمان	Les lacs,LOT N°57 Commune Ouled Zouai, Oum El Bouaghi	0773 790 205	031 45 70 88	CARRIEREBATINORD@HOTMAIL.com	
4048	1	4	\N	AMOUDA INGENEERING	امودا للهندسة	Cité Alioua Fodil, lot N° 05, Cheraga, Alger	021 36 96 11	021 36 09 86	dg,secretariat@amoudaciment,com	
1754	3	4	\N	ENTREPRISE EXPLOITATION CARRIERE D'AGREGATS		Bir Saf Saf RN N° 04, Oued Fodda W.Chlef	027 74 87 38	027 74 87 38		
1118	5	4	\N	COMPLEXE MOTEURS TRACTEURS CONSTANTINE		CMT oued Hamimine  El Khroub  BP 396  W. Constantine				
2798	1	4	\N	SOTBAF	سوتباف	Loacl N°08 Promotion Immobiliere N°20D Nouvelle route de djelfa Commune de Bou-Saâda w. M'SILA	035 44 65 50	035 44 65 02	g_direction@yahoo.fr	
1104	3	4	\N	MARBRE DEBAGH		Djebel Debagh Roknia W/Guelma	037 22 91 44			
4613	1	\N	\N	TIN OUAFDEN	تين وفدن					
4314	1	\N	\N	BEMARC TRAVAUX PUBLICS	بمارك للأشغال العمومية	Cité 29 Lots Zone 8, Rue Sour Khiara, Local 02 Mascara	045 93 54 09	0772 03 89 73		
4735	1	4	\N	SAFI SEL		Zone Industrielle Lot 08 Propriété 19 El Hamraia, w EL OUED	0770 295 924 - 032 10 60 75			
4655	1	\N	\N	RADINA GOLD	ردينة قولد					
1892	1	4	\N	AMMARI SERVICES	عماري للخدمات	Cité la mosquée El Atik, Hassi Messaoud, wilaya d’Ouargla	029 74 52 20	029 74 50 81		
3541	1	4	\N	MECHERIA SUD NORD GRAND TRAVAUX	مشرية جنوب شمال للأشغال الكبرى	Rue Abdellaoui Mohamed   Mecheria   Naama	0770 84 27 72 /0661 26 58 58	049 78 52 84		
2708	3	4	\N	CARRIERE ADJAL LAHCENE	محجرة عجال لحسن	Poste Ain Roua 19310 - w/Setif	061 35 03 73	036 91 03 39		
3182	3	4	\N	SMRE / SOCIETE MINIERE DE LA RECHERCHE ET DE L'EXPLOITATION	أس.أم.أر.أو - الشر كة المنجمية للبحث و الإستغلال	35 Bis B , Rue Mustapha   Ben Boulaid  sfisef   Sidi Bel Abbes	0770 36 52 52	048 79 15 42		
4780	3	4	\N	CARRIERE SALMI	محجرة سالمي	n°180, Village agricole, Zeralda, Wilya d'alger.	027 51 53 66	027 51 53 66		
4230	2	\N	\N	CARRIERE GHRIS ET BELLARA	محجرة غريس و بلارة	Bir Brinis, Ouled Arama Oued Seguen Mila				
4078	1	\N	\N	CARRIERE SOUF	محجرة ســــوف	Cité Lavarge, Avenue Hadj Abdel Samed 3ème étage, N° : B06, commune de Batna, w-Batna	0550 95 24 30	033 85 22 38		
3458	5	4	\N	CEVITAL MINERALS	سيفيتال مينرالس	Ilot D N° 6 Zhun Garidi II, Commune Kouba, Alger	021 289 988	021 298 833		
2523	3	4	\N	CARRIERE LE BON CAILLOU	محجرة لو بون كايو	Lot C N°34, Baba-Hassan, wilaya d’Alger.	0661 56 12 00 – 021 29 11 12	021 29 28 16		
4670	1	\N	\N	TEGHERNAEFEST	تغرنفست					
4671	1	\N	\N	GOUGRAM LITANKIB ANI ZAHAB	قوقرام للتنقيب عن الذهب		0770 37 57 00X	X		
4672	1	\N	\N	TAN SELLAN LI ZAHAB	تان سلان للذهب					
4673	1	\N	\N	TIN AKHEM	تين اكهم					
4674	1	\N	\N	SAHARA ISFOUIENE LITANKIB	صحراء اسفاون للتنقيب					
4675	1	\N	\N	TANFARINET LITANKIB	تنفرنت للتنقيب					
4676	1	\N	\N	SOFCONTRA	صوفكونترا	Zone Industrielle, Section 03, Illots 103, 104, et 105, wilaya d'Ain Temouchent.	0553 846 819	043 435 060		
4677	1	\N	\N	AITOUKLAN	 ايتوكلان					
4124	2	4	\N	SIARI PERE ET FILS EXPLOITATION DE CARRIERE	سياري الاب وابناؤه لاستغلال المحجرة	Djebel Akral, Commune de Ain Tin, Wilaya: Mila	06 63 18 31 04	031 45 70 88		
4513	1	\N	\N	TADEKIT	تدقيت					
3683	1	4	\N	ERTROB	أرتروب	Village Draâ Khelifa  Commune de Sidi Naâmane   W. Tizi Ouzou	0661 423 838			
4489	1	\N	\N	TOUFRIK	توفريق					
4490	1	\N	\N	IFAGHLALANE	 افغلالان					
3758	1	4	\N	SPIPTC / SOCIETE DE PRODUCTION INDUSTRIELLE DES PRODUITS DE TERRE CUITE	شركة الإنتاج الصناعي لمنتجات الطين غير المقاوم	69, Route de Relizane - Zemura, wilaya de Relizane	0550 51 68 47	046 92 61 47		
3787	1	4	\N	CONCASSAGE EN NADJAH	محجرة النجاح	Boulvard Medjadji Kaddour n° 18, Tenes - Chlef	0550 56 82 90	027 71 88 74		
4208	2	\N	\N	FRERES NADI AGREGATS	الإخـــوة نـــادي للحـصى	204 lgts bloc L n°07, Bouira	0560 011 755			
4685	3	4	\N	THE BEST IN GOLD	ذو باست إن قولد	Zone d'activité et stockage N° 91 Cité Kechida \r\nBatna	06 61 61 16 66/ 05 50 14 74 83	033 81 28 38		
4686	1	\N	\N	EL GHOYOUM EL MOUGHAYAMA	الغيوم المغيمة					
3606	12	4	\N	COOPERATIVE ARTISANALE EL ABTAL	التعاونية الحرفية الأبطال	Commune de Mellakou  W. Tiaret	0773 331 392			
3935	1	4	\N	PACIFIC ROUTES	الهادئ للطرقات	Cité 20 Aout 1955 Bt A 1, n° 02, Constantine	031 66 56 11	031 66 51 49		
4781	1	\N	\N	EL HIDAB LIL MAHADJIR		329 Cit2 Ain Brider daira de Sebdou Tlemcen	0561 72 86 21			
4040	1	4	\N	SOCIETE FILS MEKDOUD D' ENTREPRISE	شركة ابناء مقدود للمقاولات	Cité des Enseignants Tebesbest, Ouargla.	05 50 30 80 51			
4042	1	4	\N	EL AGHA CARRIERE	الاغا محجرة	16 Cité Fillali Mohamed Tahar, Commune de Ferdjioua, Mila	 036 66 43	036 66 43 5		
4202	1	\N	\N	H.T.M.A.M.M REALISATION	اش.تي.أم.أ.أم.أم.رياليزاسيون	Cité 618 Logts, Bt 41 n°08, Commune de Mohammadia, wilaya d’Alger	0550 58 03 56			
3453	1	4	\N	DJEBEL LABIOD D'EXPLOITATION DE SABLE	جبل لبيض لاستغلال الرمل	Route de khenchela Commune de cheria W, Tebessa	07 70 41 90 90			
4785	1	\N	\N	INMAHARRATEK LITANKIB	اينمهرتك للتنقيب	OUTOUL TAMANRASSET ALGERIE	0666660051			
4786	1	\N	\N	AINIRADIGH	إينيراديغ	IN GUEZZAM TAMANRASSET ALGERIE	0662429880			
4787	1	4	\N	MAGRA ROCK	ماقرا روك	AMMARA N°04 SECTION 663 ILOT 04 CHERAGA,ALGER.	0770 20 04 22	027 51 53 66		
4788	\N	\N	\N	ROYAL CERAM		Ouled Zemmour, commune de Ouled Fadhel wilaya de Batna	033 22 22 22			
4789	\N	\N	\N	ROYAL CERAM		Ouled Zemmour, commune de Ouled Fadhel wilaya de Batna	033 22 22 22			
4122	3	\N	\N	SOTRAMCO	صوترامكو	Cité 32 logts, M'sila	0661 357 639			
4496	1	\N	\N	TISOULAY	تيسولاي					
4236	3	\N	\N	ETPMRYAD	أو,تي,بي,أم رياض	Hai El Mectaa, Boulevard Bendahmane Mohamed n°21, Rez de Chaussée, Oran, wilaya d'Oran	0550 05 78 24	041 53 14 51		
4479	1	\N	\N	ALHADI POUR L'EXPLOITATION D'OR	الهادي لاستغلال الذهب					
4480	1	\N	\N	AMAGOU	اماقو					
4481	1	\N	\N	SOCIETE BOUGLAN	شركة بوقلان					
4482	1	\N	\N	ISAKRASEN ZAHAB	إسقرسن للذهب					
4139	1	4	\N	LA ROSE BLANCHE PRODUCTION INSUSTRIELLE	الوردة البيضاء للانتاج الصناعي	Zone Industrielle   N 49    W  Tebessa	0561 61 09 90 / 0561 61 90 90	037 59 17 99		
3816	11	4	\N	GROUPEMENT AMOUDA INGENEERING	مجمع أمودا للهندسة	Cité Alioua Fodil n° 5, Cheraga - Alger	021 36 96 11	021 36 09 86		
3956	5	4	\N	SOMIPHOS		Cité Ferphos BP 122 ZHUN II,  W. Tébéssa	037 58 51 67	037 585 283		
3957	3	4	\N	BRIQUETERIE MIHOUBI SUD		Z.I Sidi Aissa, M'sila.	036 87 44 95	036 87 59 11		
4059	1	4	\N	GROUPE ABOU ANIS INVESTISSEMENT	مجمع ابو انيس للاسثتمار	Lotissement Kambas, Lot C n° 08, Dar El Beida, Alger	033 82 49 49	033 82 49 49		
4656	1	\N	\N	TINI LI ZAHAB	تيني للذهب					
4657	1	\N	\N	TIN TAKHAOUIT LI ZAHAB	تين تخاويت للذهب					
4658	1	\N	\N	AROCAM LITANKIB AN ZAHAB	اروكام للتنقيب عن الذهب					
4659	1	\N	\N	TADJASSAT LITANKIB	تاجاسات للتنقيب					
4660	1	\N	\N	TADJENTOURT LITENKIB	تاجنتورت للتنقيب					
4661	1	\N	\N	ADOUKAL LI ZAHAB	ادوكال للذهب					
4662	1	\N	\N	TIN AREZGHEN LI ZAHAB	تين ارزغن للذهب					
4663	1	\N	\N	TYOUSSEK LI ZAHAB	تيوسق للذهب					
4269	5	4	\N	SOCIETE SAOURA CIMENT	ساورة إسمنت	11, Rue Slimane Belkhedim app n°10, Béchar, wilaya de Béchar	049 21 69 96	049 21 07 86		
4213	1	\N	\N	SHAKAI	شـــاكي	EL HIDHAB cap Cité des 30 logements LSP Bt 01 entrée 01 RDC commune de Sétif				
3519	12	4	\N	COOPERATIVE ARTISANALE SABLE D'OR	التعاونية الحرفية الرمال الذهبية	Route de Bouchkif, Souguer - W.Tiaret	0778 019 032	0778 019 032		
3933	1	\N	\N	NARA REALISATION ET SERVICES GENERAL	نارة للإنجاز و الخدمات العامة	Tissouras-Commune d’oued Taga- W- Batna.	0660 64 66 81	036 74 30 48		
158	3	4	\N	CHDA	محجرة دحو عبد الله	19, Rue de la Revolution - Oued Fodda	027 74 80 37	027 74 80 37		
2088	5	4	\N	SPDC / Société des Produits Dérivés du Centre	شركة المواد المشتقة للوسط	Meftah BP 37 Blida	025 45 50 30	025 45 56 17		
2094	5	4	\N	UMABT	او ما بي تي	Lot N°48, Senia, wilaya d'Oran 31 000	041 41 29 21	041 40 31 83		
2095	5	4	\N	OASIS PLATRE GHARDAIA	الواحات جبس غرداية	Zone Industrielle BP 011 GT, Bounoura - Ghardaïa	029 87 33 30 / \n029 87 30 82	029 87 33 35		
2049	1	4	\N	GRECO	غريكو	07, Rue Rabah Naimi - Beau séjours -W.Tlemcen	043 26 12 08	043 20 28 87 		
4270	3	\N	\N	BRIQUETERIE HADDAG	بريكاتري حداق	Local n°01, Bâtiment ANGELUS, route de Boubroune, Commune et Daïra d'Azazga, wilaya de Tizi Ouzou	0796 870 017 / 0661 441 395			
1044	5	4	\N	ERCO - GIC / Entreprise des Ciments et Dérivés de l'Ouest - Groupe Industriel et Commercial -	مؤسسة الاسمنت و مشتقاته للغرب - مجمع صناعي و تجاري	Boulevard des Martyrs de la Révolution BP 65 C Es-Senia - W.Oran	041 51 47 20	041 51 47 22		
3967	1	\N	\N	AUMALE AGREGATS	أومال أقريقا	Cite 20 Aout 1956 Local N 79 lot 23 Section 02 Baba Hassan Alger	0550454423/0770589573	027 515 366	omarfateh84@gmail,com	
4626	1	\N	\N	TAMGAG D'OR	تمقق للذهب					
4030	1	4	\N	BRAZA AGRIGA	برازا للحصى	Commune Ain Madhi, Laghouat.	06 61 48 74 64			
3671	1	4	\N	CARRIERE AHL EL KSER	محجرة اهل القصر	Lot N° 35 la cadat les sources bir mourad rais, W, Alger	021 56 55 79	021 44 94 62		
3753	1	4	\N	MESSAOUDI PREST	مسعودي براست	Lots 01 n°05 Sidi Bouaziz Touggourt W.Ouargla	0667 22 18 38 / 0774 76 58 07	032 26 31 75	enaguer52@yahoo.fr	
3834	1	4	\N	LIT-MAG CARRIERE	ليت-ماق كريار	Souk Larabaa, Béni Ouarsous, Rémchi - Tlemcen	0770 95 04 54	043 27 34 93		
3836	1	4	\N	CARRIERE EL WIDAD	محجرة الوداد	Cité Ben Cheghib, N°02, Guelma	0779 00 38 81	037 21 67 21		
3838	5	4	\N	OASIS PLATRE	واحات جبس	Zone Industrielle BP 011 GT, Bounoura - Ghardaïa	029 87 33 30 / \n029 87 30	029 87 33 35		
1150	1	4	\N	DBK MAT	ديبيكمات	17, Bd Stiti Ali W/ Tizi Ouzou	026 21 30 70 / 026 21 49 52	026 21 89 08		
1153	1	4	\N	LES ARGILES D'ALGERIE		Route Nationale N°5 -Tafoudhit-Ahnif 10130 W.Bouira	071 59 19 47			
3653	3	4	\N	ENTREPRISE SIDI MOUSSA TRAVAUX PUBLIQUE ET PROMOTION IMMOBILIERE	مؤسسة سيدي موسى للاشغال العمومية و الترقية العقارية	Rue Bouzidi Abdelkader, W, Adrar	049 96 74 48	049 96 87 30		
3603	3	4	\N	ETRBGTH	مؤسسة اشغال الطرق و العمارات و الري الكبرى - أو.تي.أر.بي.جي.تي.أش	17, Rue Abbabsa Taher, W, Constantine	031 62 49 07	031 63 26 52		
4235	5	\N	\N	A.L.R.E.C.C.	أ.أل.أر.أو.سي.سي الجزائرية للانجازات و البناء للوسط	Route Nationale N° 01, Bir Mourad Rais- Alger	021 51 30 60 – 021 51 30 60	021 51 30 60 – 021 51 30 60		
2964	1	4	\N	FMI	أف أم أي	Cité Zohor Dar El beida BP 9618 w/Oran	041 46 49 70	041 46 48 31		
4485	1	\N	\N	IHGHANE LIZAHAB	ايهغن للذهب					
3658	12	4	\N	COOPERATIVE ARTISANALE DJEBEL MEHARGA	التعاونية الحرفية جبل محارقة	225/3A  Vieille Route de Djelfa  Bousâda W. M'sila	0661667928/0559 290 242			
565	5	4	\N	ENCOTRAB AKBOU		Route Du Piton BP N° 75 A -Akbou - W.Bejaia	034 35 86 00\n034 35 55 58	034 35 86 01		
3459	3	4	\N	HAMOUDI NOUR TGS		El Mehafir, Laghouat W. Laghouat	0661 30 49 90/0770 12 00 51	025 40 74 59		
4669	1	\N	\N	MAMOUKEN LI ZAHAB	ماموكن للذهب					
4723	3	4	\N	MAHDJARET TAOURIRA	محجرة توريرة	Route D'oran prolongée N°82, Sidi Bel Abbes	06 61 24 01 86			
4645	1	\N	\N	INTHABENE LI ZAHAB	انظابن للذهب					
4365	1	\N	\N	ROYAL CERAM	رويــــــال سيـــرام	Ouled Mazwar, Commune Ouled Fadel-Batna.	033 31 86 86	033 31 85 85		
4231	5	\N	\N	CONSTRUB EST	شركة البناء و العمران للشرق - كنستروب	Cité 08 Mars Plaine Ouest, tranche A,  BP 72, ANNABA	038 43 02 85	038 43 03 36		
3802	1	4	\N	ETPB BENFREHA ABDELKADER	مؤسسة الاشغال العمومية للبناء بن فريحة عبد القادر	Route de Slatna FG Sidi Moufok, BP 17 Mascara	045 81 51 50	045 81 51 50		
3632	12	4	\N	COOPERATIVE ARTISANALE EL BARAKA	التعاونية الحرفية مرملة البركة	Cité De 08 Mai  N° 140 Takhemart  W. Tiaret	0772 188 289			
3633	12	4	\N	COOPERATIVE ARTISANALE AYOUB NOUR			0661638770	035533833		
4776	1	\N	\N	MARBRE CARRELAGE AGGLO MARBRE		Zone Industrielle, route de M'sila, w. Bordj Bou Arreridj	035 87 32 36	035 87 32 39		
4345	1	\N	\N	BENBRAHIM EXTRACTION SABLE ET GRAVIERS	بن ابراهيم لاستخراج الرمل و الحصى	30? VILLA Saharienne, Chetti El Ouaker, Ouargla	029 70  06 96	029 70 63 66		
2778	2	4	\N	BOUADJIL & CIE	بوعجيل و رفقائه	Zone Industrielle BP 701 Sétif	036 93 59 25	044 77 14 58		
2526	1	4	\N	INTEGRAL MINIERE INTEMINE	أنتيقرال مينيار أنتمين	Résidence les platanes  Gué de Constantine W Alger	050 09 05 44			
4794	1	\N	\N	MINES PROJETS	مين بروجت	66 Rue Ali Hadad Local 105, El Mouradia, Alger	0770662244		benbouabdellah,md@outlook,fr	
3466	12	4	\N	COOPERATIVE ARTISANALE CHAKER LIL INCHA		Commune de Madena W. TIARET	0772 83 56 23			
4633	1	\N	\N	GOURIDI LI ZAHAB	قوريدي للذهب					
3674	12	4	\N	COOPERATIVE ARTISANALE BAB ERRADJA	التعاونيةالحرفية باب الرجاء	Cité Larbi Ben M'hidi    Commune de Sidi Ameur W. M'sila	0771 100 964			
3839	3	4	\N	BRIQUETERIE EL AFAQ SUD	بريكتوري الافاق جنوب	Cité Bouaroi n° 93 Sétif\r\nw,Sétif	036 62 55 26 / 036 62 52 37	036 62 53 70 / 036 62 52 37		
3998	1	4	\N	SOCIETE OULED EL HADJ KHELIFA TRANSPORT PUBLIC	شركة اولاد الحاج خليفة للنقل العمومي	Cité Jolie Vue, El Oued	05 50 46 88 71	033 78 75 56		
1876	1	4	\N	BRIQUETERIE BOUDIAB REMILA	مصنع الاجر بودياب رميلة	Zone Industrielle Remila - Commune de Fenaia - Ilmarten - W.Bejaia	061 63 08 86\n070 94 50 52	 034 21 14 21	boudiabsaddek@eci.com.dz	
2751	1	4	\N	OULD OUALI	ولد والي	Cité lardjen N° 04 - W.Saida	061 56 48 27 / \n048 50 42 64	048 51 35 44		
4049	5	4	\N	STATION D'AGREGATS AZROU	محطة الحصى ازرو	Commune El Mehir, W, Bordj Bou Arreridj	07 72 59 52 68	020 70 68 39		
4729	1	\N	\N	TADAGUIET	إ تدقيت					
4538	1	\N	\N	GHASSAB MOUSSA ET FILS POUR LE BOIS	غصاب موسى و أبنائه للخشب	RN 05 TADJENENT, W-MILA	0770 94 28 93			
3529	1	4	\N	KTPH	كا تي بي أش	Rue AOURES KHEIREDDINE COMMUNE KHEIREDDINE.W.MOSTAGHANEM	0661 24 70 50	045 37 42 18		
4805	1	4	\N	SIMAC PLUS	سيماك بلوس	Coopérative immobilière Essaada, El Merdja II, Local N° 02, première Etage, Boudouaou, Boumerdes.	0560 78 80 97			
1664	1	4	\N	GRAVISKI / GRAVIERS SKIKDA	حصى سكيكدة	Zone d'activité Hamadi Krouma Wilaya de Skikda	+213(06)59837840			
4337	1	\N	\N	TRAVAUX ET AMENAGEMENT MULTIPLE TAMANRASSET	الأشغال و التهيئة المتعددة لتمنراست	Sersouf, centre ville, Tamanrasset	0661 649 795			
4338	\N	\N	\N							
4634	1	\N	\N	AKZERN LITANKIB ANI DAHAB	اكزرن للتنقيب عن الذهب					
3067	1	4	\N	BELMABROUK ESG	بلمبروك لاستخراج الرمل و الحصي	Lot Hamidi Ziane, lichana - BISKRA	0550 51 18 60/0663 77 48 90	033 65 96 54		
4712	1	\N	\N	ABAMER LI ZAHAB	 ابامر للذهب					
3779	5	4	\N	S.C.H.B / Société des Ciments de Hamma Bouziane	شركة الإسمنت لحامة بوزيان	BP 174 - Hamma Bouziane - Constantine.	031 90 66 80	031 90 68 14	schbdg@gmail.com	
4711	1	\N	\N	AFRA GOLD	 افرا قولد					
4307	3	\N	\N	GAID TRAVAUX PUBLICS ET SERVICES	قعيد للاشغال العمومية و الخدمات	Cité Sehane 01, El Oued	05 40 42 23 78			
2303	2	4	\N	ISSAADI TOUFIK & FRERES	إسعادي توفيق و إخوانه	Parcelle N°46, Ilot Ouest 50 parcelles, Route de Ain Ben Khellil-Nâama, wilaya de Nâama	049 79 66 29/0770 92 84 46	049  79 66 52		
4938	1	\N	\N	CARRIERE EL DJAZAIR	كاريار الجزائر	Zone d'activité, Ilot 1236, n°01, Bureau 01, 1er étage, Commune d'El Achour, Wilaya d'Alger.	0560 95 74 00			
4939	1	\N	\N	CARRIERE DJEBEL EL FATH	كاريار جبل الفتح	Haouche Megnouche n°84, Hai Tixeraine, RC Birkhadem, wilaya d'Alger.	0541 26 87 47			
3573	3	4	\N	LA MEILLEURE PRATIQUE GRANDS TRAVAUX PUBLICS ET HYDRAULIQUE	أحسن براتيك للأشغال العمومية الكبرى و الري	Rue Chebcheb Djaafer, villa n° 04, Ain Taya - Alger	0698 69 57 07			
4171	\N	\N	\N							
4696	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
4002	1	4	\N	CARRIERE OULED LARBI BENBRAHIM HOUCINE	محجرة ولاد العربي بن براهيم حسين	Douar Ouled Kacem, Route Tanefdour , El-Milia Locale N° 01, Wilaya Jijel	0550 80 09 95 – 031 95 43 27/29	031 95 43 32		
3939	1	4	\N	BRIQUETERIE ZENATA	مصنع الأجور زنــاتة	Zenata, Remchi wilaya de Tlemcen	043 23 61 62/63	043 23 61 60	direction@briqueterie tafna.dz	
4430	3	\N	\N	GROUPE TRAVAUX GUERGAR GTG	مجموعة اشغال قرقار جي تي جي	Rue du 1 ére Novembre/Si Haoues/Wilaya de Tiaret	05 61 69 70 68			
4431	1	\N	\N	BRIQUETRIE NOUVELLE DU SERSOU	شركة بريكوتري الجديدة سرسو	Route Djilali Benamer Rahoui W-Tiaret	0661 175 754	023 807 592		
2506	1	4	\N	CAMICO EXPLOITATION DE CARRIERE	كاميكو لاستغلال المحاجر	Rue du 1Novembre 1954 n°04 41000 Souk Ahras	0773 276 450	037 35 24 69		
4379	5	\N	\N	GLOBAL GROUP ALGERIE	قلو بال  قروب الجيري	7 Rue Larbi Alik    Hydra     Alger	021 54 90 61	021 54 90 43		
4381	\N	\N	\N							
4222	1	4	\N	ALGER IRAQ	الجي ايراك	Cité Ain Sfiha, Lot Consort Cheragui, GP 240, Classe 16, N° 21 Sétif	036 82  42 28	036 82 24 28		
3918	1	4	\N	MESLOULA PRODUCTION DE GRAVIER	المسلولة لانتاج الحصى	Station de service El Aouinet, Tébéssa	06 61 30 21 17			
4736	\N	4	\N	T.G.S	تي جي اس	Cité Mkam, Commune de Laghouat, W.Laghouat	029 14 53 49	029 14 53 49		
4497	1	\N	\N	TAGGOURA LI TANKIB	تقورة للتنقيب					
4357	1	\N	\N	GROUPE S.C.S SOCIETE DE CERAMIQUE DE LA SOUMMAM	مجمع أس.سي.أس الشركة الخزفية للصومام	ZONE INDUSTRIELLE IHADDADEN 06000 BEJAIA	034 120 560/65	034 120 608		
4359	1	\N	\N	TIZIRI BRIQUETERIE	تيزيري للآجور	TOUARES LOT N°10 AOMAR WILAYA DE BOUIRA	0770 95 31 07 / 0540 42 11 48			
4205	\N	\N	\N							
3886	3	4	\N	DAR DAMBRI AISSA REALISATION	دار دمبري عيسى للإنجاز	Cité 100 logts, unité de voisinage, n°06 Ali Mendjli, El Khroub, W.Constantine	031 82 26 12/0770 91 66 86	031 82 26 24		
4831	\N	\N	\N	OMNIA SOLARI PRODUCTION INDUSTRIELLE						
4832	\N	\N	\N	QUARTZ STONE		Lot n° 107 Zone industrielle de Chaabet El Leham Ain témouchent,	05 55 27 39 35 & 05 49 93 73 05			
4833	1	\N	\N	CARRIERE ENNADOR		AOURIR N° 112 lot N° 02 groupe MELK, Commune Bouzina	0553 13 55 33	033 30 71 19		
4834	13	\N	\N	SOBRIS	شركة الاجر لسعيدة	Lotissement Bouchaki A N° 31 Bab Ezzouar	0555186226	048 32 71 01	dtcbmsd@gmail,com	
4835	\N	\N	\N	QUARTZ STONE		Lot n° 107 Zone industrielle de Chaabet El Leham Ain témouchent,	05 55 27 39 35 & 05 49 93 73 05			
4836	1	\N	\N	MODERN BRICKS	مودرن بريكس	Lotissement N°58 Lot 4 Sidi Rached wilaya de Tipaza	0770 03 30 30			
3962	1	\N	\N	CARRIERE KERROUCHE BRAHIM	كروش ابراهيم	Cité Alexandrie N° 90, RDC Locale N° 03 - wilaya de Blida	0661 38 86 56	025 39 47 87		
4057	\N	\N	\N			Centre Commercial de Bab-Ezzouar, Tour n°2, \t\t\t5ème et 6ème étages, Bab-Ezzouar, wilaya d’Alger				
4291	\N	\N	\N							
4700	1	4	\N	TUNCH	تونش	Coopérative Immobilière Soldat Inconnu, Parcelle N°540, 3ème étage, commune de Bir El Djir, wilaya d'Oran.	0555 02 25 38 / 0560 22 67 58 / 0555 02 25 30	041 70 80 44		
3611	12	4	\N	COOPERATIVE ARTISANALE SABLIERE EL FETH		Cité Mohamed Boudhiaf   N° 90 W. Ain Temouchent	0771 445 053			
4297	3	\N	\N	CARRIERE HADJ SALAH	محجرة الحاج صالح	Rue Bouzidi n°10 Cne d’Adrar, W.Adrar	0561 67 97 98			
3612	12	4	\N	COOPERATIVE ARTISANALE CHOUCHA DES SABLES	التعاونية الحرفية شوشة للرمل	Cité El Hadhaba N° 65/16  BouSaâda   W. M'sila	0550 147 064	035 52 27 21		
4403	1	\N	\N	SOCIETE CIVILE IMMOBLIERE TRAVAUX PUBLICS NARDJESS	شركة مدنية للعقار و الاشغال العمومية نرجس	06 rue  Mohamed Bouguerfi  Sidi Mhamed    Alger	023373105	023373105	nardjess,tp@gmail,com	
4600	1	\N	\N	ASSEGH LITENKIB	اسغ للتنقيب					
4601	1	\N	\N	TAOURIK LITANKIB	تاوريك للتنقيب					
4602	1	\N	\N	TADHOULT LI ZAHAB	تظولت للذهب					
4603	1	\N	\N	TIAITIT D'EXPLOITATION D'OR	تيعيتيت للتنقيب عن الذهب					
4316	1	\N	\N	BELOUAFA AGREG	بلوافة أقــــرق	15 Rue Oued El Khir, Route de Tiaret, Mascara	06 61 25 00 21			
2873	3	4	\N	ENTREPRISE BOUKHLOUF AHMED POUR TRAVAUX DE CONSTRUCTION T.C.E EXTRACTION DU SABLE	مؤسسة بوخلوف احمد لاشغال البناء تي. سي. او استخراج الرمال	Cité CIMBA N° 30 W/Batna	030 36 14 55			
581	3	4	\N	EL OUARTIA EXTRACTION & PREPARATION DE SABLE	الورتية لإستخراج و تحضير الرمل	Rue Abderrahmane Ben Seddouk - Cité Lalaouia - Souk Ahras	037 35 14 21			
3684	12	4	\N	COOPERATIVE ARTISANALE DJEBEL TOUIL	التعاونية الحرفية جبل طويل	Djebel Touil El Zeibech   Sebdou W. Tlemcen	0770 849 739			
4134	1	4	\N	SETAROUTE	سيتاروت	Route  de Annaba, lot 30, Groupe 10, wilaya de Tébessa	037 59 29 29	037 59 22 22		سيتاروت#http://سيتاروت#
3775	5	4	\N	GREPCO	مجمع المؤسسات للترقية و البناء	Cité 08 mars, plaine ouest, BP N° 72 b, Annaba	038 84 99 83	038 83 37 22		
4378	1	\N	\N	IBLA PIERRES ET MARBRES	إيبلا للحجر والرخام	Zone industrielle N°2 Ain El Hadjar Wilaya de Saida	213 48 40 51 51	213 48 40 50 03		
4889	1	\N	\N	EXPLOITATION ET METALLURGIE	اكسبلواطاسيون اي ميتالوغجي	Lotissement Boushaki D N° 111 Bab Ezzouar-Alger	0557688061	023 83 22 81	sarl,eem@yahou,com	
4856	1	\N	\N	SARL GLOBALES TECHNOLOGIES SERVICES		Cité El houria, Bir El Ater - TEBESSA	0660 34 03 31			
4857	\N	\N	\N	SARL GLOBALES TECHNOLOGIES SERVICES		Cité El Houria, Bir El Ater, Wilaya de Tébessa	0660 34 03 11 - 0661 44 39 27			
4858	\N	\N	\N	SARL GLOBALES TECHNOLOGIES SERVICES		Cité El Houria, Bir El Ater, Wilaya de Tébessa	0660 34 03 11 - 0661 44 39 27			
4859	\N	\N	\N							
4860	\N	\N	\N							
4861	1	\N	\N	SHINING BOUNAB		Rue de la Gare, commune de naciria, w. BOUMERDES	0661 54 00 92 - 0781 00 14 17			
4841	5	\N	\N	EL NOURASI CORPORATION	النوراسي كوربورايشن	ITE Dhrif Mohammed Ilot n 53 Section n 13 Bureau n 01, 1 er étage, commune de Rouiba -Alger	031 43 50 47	031 43 50 46	info@elnourasi-corporation.com	
4842	3	4	\N	PERFECTO IMPORT EXPORT	برفكتو للاستيراد والتصدير	Lotissement El Mouna, N° 607, El Khroub, Constantine.	06 61 30 05 51			
4843	1	\N	\N	BOULEDJOUIDJA KAMEL		40 Rue Youcef Kadid, wilaya de Skikda	0793 01 21 64		impork21@gmail.com	
4845	1	\N	\N	HAKITAL MINES		Lot 08 Propriétaire N° 18 El Hamraia w,EL OUED	032 183 249 / 0770 97 96 95 / 0672 91 46 16	032 18 32 02		
4846	1	\N	\N	ZAL INCER	زال انسير	Groupe de propriétés N° 58 section N°4, Sidi Rached, w-Tipaza	0770033030			
4847	3	\N	\N	FRERES HENKA SERVICES	الاخوة حنكة للخدمات	Rue Chahid HENKA Ali, Magrane, W-El Oued	0770414763	032275229		
4848	1	\N	\N	TAIEB ELAALI		Cité TAHAGARETE local commerciale N° 49 Lot 155 TAMANRASSET	0673 87 64 19			
4849	1	4	\N	PHENIX FARM	فينيكس فارم	Zone D'activité, Commune de Ouargla	06 61 95 31 54			
4850	1	\N	\N	GIGAS LA FLEUR DE MARBRE		Lot 61 Zone des Activités, Ksar El Boukhari, Médéa	0661 98 95 95			
4851	1	\N	\N	INTERNATIONAL COMPANY RENEWABLE SOLAR			023 85 08 41	023 85 08 44		
4408	1	4	\N	GRANULAT EXTRA	قرنيلا إكسترا	Rue de L'indépendance, Classe 136, LAGHOUAT	05 50 58 44 40			
4225	3	4	\N	ENTREPRISE BOUFERADJI MOSTEFA	مؤسسة بوفراجي مصطفى	Cité des Fonctionnaires, Bloc D, N° 02, Chelf	027 77 03 24	027 77 03 77		
4226	1	4	\N	MEDJROUB ALI	مجروب علي	Cité 42 Logts, Bouinan, Blida	025 39 47 92/0558 48 58 59	025 39 47 92		
4166	5	\N	\N	SOCIETE DES CIMENTS DE SIGUS	شركة الإسمنت سيقوس	Sigus, Oum El Bouaghi	031 66 38 56	031 66 38 56		
4167	\N	\N	\N							
1540	5	4	\N	SOMACBA / SOCIETE DE MATERIAUX DE CONSTRUCTION DE BATNA	شركة مواد البناء باتنة	Cité des frères Khezzar - 742 Logements - BP 75 - W.Batna	033 86 61 79	033 86 87 02		
2776	5	4	\N	GHR / GOLD HOURIA RAPHEAL	قولد حورية رافايل	Parc Zoologique Route du Kaddous- Hydra	021 54 99 76	021 54 9979		
4885	1	\N	\N	BRIQUETERIE DES OASIS	مصنع الاجر الواحات	Oued Brique Tranche 09 Lot n°154 Commune Khmiss El Khechna Wilaya de Boumerdes	0792591838			
4886	3	4	\N	HYDRO LOTFI	هيدرو لطفي	Cité de la Gare, Boumedfaa, W, Ain Defla.	05 50 43 13 37			
4887	1	\N	\N	CONCASS ANTAR	محجرة عنتر	Cité des 84 Logts, Mécheria	05 50 32 35 82	049 67 45 44		
4888	1	\N	\N	BENTONITE EL DJAZAIR	بانتونيت الجزائر	Noukha N° 5, Route Nationale N° 28, Route du poid lourd, commune de Barika, Batna	06 76 43 13 45			
4363	1	\N	\N	SAM CERAMICA	سام سيراميكا	Zone Industrielle , commune d'Aris, wilya de Batna	0661 97 81 00			
4721	1	4	\N	MIL AMO INDUSTRIE	ميل.عمو للصناعة	Cité Taksabet, El Oued, W, El Oued	05 55 03 56 41	023 80 75 92		
4722	1	\N	\N	BESMABEL TP	بسمبال تي بي	Local N° 01, Cité Djibril 40 Logement, Illizi, W, Illizi	029 4021 65			
4113	\N	\N	\N							
4114	2	4	\N	FRERES TAALAH	الاخوة طاع الله	Local N°01, Lotissement 93, El Euch, wilaya de Boedj Bou Arreridj	06 61 35 78 72			
3678	3	4	\N	SABLIERE B.M.B.A	مرملة ب.ام.بي.ا	Nouvelle Zone Urbaine , Parcelle 14 N° 06/02 Local N°1 Bou saâda  W. M'sila	0661 282 103			
392	5	4	\N	BCMC	بي.سي.أم.سي	BP 65 A, Zone d'Activité Berriane 47100 - W.Ghardaïa.	029 84 39 69	029 84 54 34		
2540	3	4	\N	SAADADOU CARRIERES	سعدادو للمحاجر	Haï Ech Charki, n° 13 - Route Alger-Chlef	027 77 22 85			
3966	3	\N	\N	AUMALE AGREGATS	اومال اقريقا	N° 11 Rue du 05 Juillet , Commune d'El Melaâb , daira de Lardjem W. Tissemsilt	0556 023 305	027 515 366	babidz4@hotmail.com	
4034	1	4	\N	SOCIETE ARAB DE GRAVIERS	الشركة العربية للحصى	Village Agricole, Ouled Moussa, El Attaf, Ain defla	06 58 64 75 19			
4024	1	\N	\N	OGAYA CARRIERES	أوقايا للحصى	Zone Industriel  n° 28    Bechar	0661 90 14 98 /0770 98 85 11	049 81 58 51		
4025	3	\N	\N	BELHADJ ABDELKADER IKHLASS ETPH	بلحاج عبد القادر إخلاص أو تي بي أش	Route de Ammi Moussa Zemmora\r\nWilaya de Relizane	0550 56 96 68	046 83 92 38		
4026	1	\N	\N	CARRIERE SIDI ARAB	محجرة سيدي عراب	Cité Kef Salah, Constantine	0661 35 61 06 et 07 75 13 97 88			
4801	\N	\N	\N							
4855	3	\N	\N	CITRA TRAVAUX PUBLIQUES ET CONSTRUCTION		20 Rue Marcello  Fabri Les Sources Bir Mourad Rais, ALGER	023 54 40 77	023 54 40 77		
4062	\N	\N	\N	MECHERI CANALISATION HYDRAULIQUES	مشري لــقنوات الــــــري	BP 79 Zone Industrielle, Route de M'sila\r\nBORDJ BOU ARRERIDJ	035 68 49 38	035 68 48 88		
486	1	4	\N	VSI GHOUALMI & ASSOCIES		ZI BP 27; 25210 Didouche Mourad; Constantine	031 90 65 86\n031 90 65 84\n031 90 67 03	031 90 67 29	vsi 2001@caramail.com	
4323	1	\N	\N	EL MANARA GYPSE ET DERIVES		Zone d'activité El foulia N°39 BP N° 16 reguiba W. El oued	032 13 01 71			
4622	1	\N	\N	TINERKENI LI ZAHAB	تيناركني للذهب					
4514	1	\N	\N	TIN GAHAN TAM	تين قهان تام					
3851	1	4	\N	B2L PRO	بي2.أل.بي.أر.أو	23, Cité la Madeleine, Hydra - Alger	021 60 12 09	021 60 12 09		
3559	12	4	\N	COOPERATIVE ARTISANALE LES HAUTS PLATEAUX	التعاونية الحرفية الهضاب العليا	Hai 300 Logements  Bt 25  N°9 W. Boumerdes	0550 542 793			
3829	1	4	\N	NAIL INDUSTRIE	نايل اندوستري	Zone d'entrepôts et d'activité lot n°18-04, Djelfa	027 90 59 63	027 90 56 07		
4523	1	\N	\N	TIKHATRET LITANKIB AN ZAHAB	تيخاترت للتنقيب عن الذهب					
3626	12	4	\N	COOPERATIVE ARTISANALE MAGRA	 التعاونية الحرفية مقرة	Cité Houari Boumedienne N° 516/01 Boussaada\r\nw,M'SILA	0550501370	035522488		
3627	12	4	\N	COOPERATIVE ARTISANALE EL KOUNS	التعاونية الحرفية القنس	rue du 08 mai 1945 sedrata, wilaya de souk ahras	0662085447	037376666		
4425	1	\N	\N	SAHARA STONE	صحراء ستون	Cité Taheggart, Tamanrasset	0561 71 63 21			
4182	5	\N	\N	GRANITTAM	غرانيتام	Pavillon Administratif 02, local N° 02,  Commune Sidi Ali Benyoub, W. Sidi Bel Abbes	048 77 03 17/ 77 01 40	048 70 66 06		
4255	3	4	\N	ESSOUDEISSI  TRAVAUX  ET  SERVICES	السديسي لأشغال & و الخدمات	Cité El Hamadine, El Magrane, wilaya d'El Oued	0660 83 78 32 / 0555 61 90 07	032 27 06 06		
4770	1	4	\N	GREAT BRAND MARBRE ET GRANITE G B M G	قريت برند ماربر قرانيت جي بي أم جي	Local des services n° 01 Bat n° 01 2eme Etage Escalier 01- Ain El Malha (Ain Naadja) -commune de Gue de Constantine - W, Alger	031 92 68 14	031 92 68 14		
4593	1	\N	\N	TIKADHIN NAIR	تكاضين ناير					
4790	\N	\N	\N	ZEROUAL ABDELKRIM	زروال عبد الكريم	Ouled Mazwar, commune Ouled Fadel-Batna	033318686	033318585	royal,ceramalgerie@gmal,com	
4791	\N	\N	\N	ROYAL CERAM		Ouled Zemmour, commune de Ouled Fadhel wilaya de Batna	033 22 22 22			
4356	5	\N	\N	DIVINDUS SERUB		Zone Indutrielle Kechida, Batna	033 22 25 57	033 22 25 57		
4884	1	4	\N	NAFPEC INDUSTRIE	ناف بك اندوستري	Zone des dépots local n°01, wilaya de Tizi Ouzou.	026204980 & 026204981		chabana-batiments-centre@outlook.com	
4333	1	\N	\N	HADJAR EL KANTOUR	حجر الـــــكونتور	Lotissement 111Parts, commune Tleghma, W.Mila	032 44 52 35/0550 81 61 07	032 44 52 35/		
4336	1	\N	\N	TOP GRANULAT	تـــــوب قــــرانـيلا	12 HAI HOUARI BOUMEDIENE CHAABET LHAM\r\nAIN TEMOUCHENT	0550441491			
3999	1	4	\N	ENTREPRISE HAROUNI SALAH PRODUCTION D'AGREGATS	مؤسسة هاروني صالح لانتاج الحصى	Lottissement El Mouna, N° 57, Constantine	06 62 44 93 85	032 40 10 31		
4694	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
4019	3	\N	\N	EXTRA CAVALIER TRANSPORT DE MARCHANDISES	إكسترا كفالي لنقل البضائع	Local  01 Machtras    Tzi Ouzou	02693 87 07    0560 96 00 60	026 93 87 07	etphb.tce.lameri@gmail.com	
3971	3	\N	\N	C.L.A / Carriere Lamara Agrégats	س.أل.أ محجرة لعمارة للحصى	COMMUNE DE BIR HADDADA\r\nWILAYA DE SETIF	0555 61 74 14			
4741	1	\N	\N	TINILAN LIZAHAB	تينيلان للذهب					
3808	1	4	\N	ALTEF	ألتف	Hai Ben Souila  Bouhnifia  W. Mascara / Cité Bel Air 12 rue  frères Hazati Athmane - Mascara	0775 978 648	045 80 44 75		
3817	1	4	\N	ALSOPAS	السوباس	Rue Laifa Ahmed n°17, Local n°03 commune de sétif	0550 46 64 25	036 74 30 48		
3818	1	4	\N	TADJ AGREGATS	تاج أقريقاتس	Rue Ahmed Fathi, Ras El Ma, Sidi Bel Abbès	0771 01 01 10	048 58 66 63		
3867	5	75	\N	LCM / LAFARGE CIMENT DE M'SILA	لافارج إسمنت مسيلة	Bureau N°01,16eme étage,tour Geneva,les Pins maritimes,Mohammadia, wilaya d'Alger	023 92 42 95/96	023 92 42 94	www.lafarge-dz.com	
3868	1	4	\N	TAGA BRIQUES	طاقة للآجر	Rue Habchi Mouloud, Seriana, Batna	06 61 55 71 60	033 80 65 68		
3717	1	4	\N	SARA NOUR LES MINES	سارة نور للمناجم	Touilila2, Commune de Rechaiga2, W, Tiaret	07 70 37 38 06	021 56 35 63		
4115	1	4	\N	RYM DAR	ريم دار	Lottissement Ain El Bey, 408 2 éme tranche, Ali Mendjli, El Khroub, Constantine	031 82 40 28	031 82 40 28		
3869	1	4	\N	TRANS AGREGATS	ترانس اقريقا	Rue El Aifa Ahmed, N°17, Sétif	05 55 98 07 79	021 20 51 20		
3494	3	4	\N	CARRIERE SAIGHI	محجرة سايغي	Cité belle vue   AIN BEIDA   n°  73              OUM EL BOUAGHI	0661 37 95 00	032 48 31 28		
4637	1	\N	\N	TROUSSOUTINE LI ZAHAB	تروسوتين للذهب					
3483	1	4	\N	RACHMADE TRANSPORT	راشماد للنقل	Cité 17 juin, Kais - khenchela	032 37 06 04	032 37 06 04		
4151	1	\N	\N	MODERN CERAMICS	الخزف العصري	02, Rue Route d'Ouled Fayet - Dely Brahim\r\nAlger  wilaya d'Alger	021363269	021365880		
3118	1	4	\N	SGO	شركة الحصي للغرب	Boulevard des 24 mètres, Sidi Sefah, wilaya de Tlemcen	043 27 50 00 / 043 27 81 29	043 27 37 14	dennouni@maildz.com	
4319	1	\N	\N	NOUR ECHEMS PRODUCTION DE BRIQUES	نـــور الشمس للإنتاج الآجر	Lots 06, Section N° 76, Commune de Ghassoul, El Bayadh	041 52 46 12			
4530	5	\N	\N	BRIQUETERIE BRANIS	مصنع الاجر برانيس	BP 68 Frantz Fanon Boumerdes	033727385 & 87	033727359	briqueterie,branis@gmail,com	
4596	1	\N	\N	TIN GHERT LI ZAHAB						
3795	1	4	\N	GMEF / GHESSAB MOUSSA & FILS	غصاب موسى و أبناءه	BP 72, Route nationale n° 5 Tadjenanet - Mila	031 52 33 33	031 52 27 27		
4272	1	\N	\N	FEGHOUL BELDJILALI CONSTRUCTION	فغول بلجيلالي للبناء	Route Nationale n° 04, El H'madna, wilaya de Relizane.	0770 61 70 50	046 83 33 91		
3054	3	4	\N	HYDIPCO	هديبكو	Résidence CHABANI, Bt F1 - Val d'Hydra\r\nAlger\r\nZone des Parcs, Rue Chetma - W.Biskra	021 69 36 14	021 69 32 64		
3578	1	4	\N	CARRIERE EL FETH EL FEDJOUJ	محجرة الفتح الفجوج	Cité Briki Sebti, Commune El Fedjouj W, Guelma	05 50 68 34 26			
3514	12	4	\N	COOPERATIVE ARTISANALE SAMO	التعاونية الحرفية سامو	07, Rue de la Liberation  W. Tiaret	0791 805 285			
4749	\N	\N	\N	05						
3557	12	4	\N	COOPERATIVE ARTISANALE DJEBEL NADHOR	التعاونية الحرفية جبل الناضور	Commune de Nadhora, W, Tiaret	07 74 177 030			
3558	12	4	\N	COOPERATIVE ARTISANALE BOUGHEDOU	التعاونية الحرفية بوغدو	Cité Houari Abed 1700 Logts N° 11, W, Tiaret	07 78 529 956			
4941	1	\N	\N	LES LIONS DE LA ROCHE IZOUMAM	ليليون دولاروش إزومام	12, Rue Ben Bou Laid, wilaya de BEJAIA	0771 98 14 56			
3277	1	4	\N	CARRIERE OUM STAS	محجرة ام ستاس	Oum Stas Ain Abid, W, Constantine	07 70 37 05 89			
3281	1	4	\N	AGIS	أجيس	Douar Amriche, Ain Defla, Cité EL Khalidia, Rue l'expert n°3, 1 er étage commune d'Oran	041 45 48 12 / 0555 88 99 99	041 45 38 30		
4465	1	\N	\N	SOCIETE ETAGHI	مؤسسة أتغي					
4597	1	\N	\N	BOUHEDYAN LI ZAHAB	بوهديان للذهب					
4891	1	4	\N	MAHDJARET TAFTIT EL HASSA EL ABIAD SIDI CHEIKH	محجرة تفتيت الحصى الأبيض سيدي الشيخ	Commune d’El Abaid sidi cheikh, W, El Bayadh.	06 60 85 46 47			
4893	1	4	\N	MAZLA PIERRE	مازلة بيار	Lotissement zebiri N°01, Ain Abid, Constantine.	05 50 30 87 21	037 11 73 46		
4894	3	\N	\N	DARDARA 2	دردارة 2	Lotissement D/116, Cité belle vue, route d’ain guesma, Tiaret	06 65 08 70 95			
4952	1	4	\N	DJAOUHARA TOUAT ENTREPRISE	جوهرة توات للمقاولات	Cité 01 Novembre 400 Logts, N°01, Adrar.	06 71 37 08 93.			
4953	3	4	\N	ARGILE SAHEL	أرجيل ساحل	Zone D’activité, Commune de Koléa, Tipaza.	044 90 98 32	044 90 98 32		
4954	1	\N	\N	SKI BATIMENT				038753535		
4955	1	4	\N	ZROUSEL	زروسال	Bp (03) Ain Daba-Aoumache-Wilaya de Biskra	0550 51 26 70			
4956	1	4	\N	VOIRIE ARMONT	فواري ارمونت	Route Ammi Moussa, Zemoura, Relizane	0550569668			
1990	2	4	\N	ZITI & ISSADI	زيتي و اسعادي	Dj Braou, Bazar Sakhra, El Eulma, Sétif	0770 91 50 98			
3165	1	4	\N	BRIQUE LIVE	بريك لايف	15 Rue M'HARGUA RABAH N°09 Bordj Bou Arreridj	056169801	035873264	briquelive@yahoo.fr	
3293	1	4	\N	STE FRERES BENBORDI CRANES AND TRANSPORT	شركة الأخوة بن بردي للنقل و الرافعات	Rue Rabah Senadjki Ouled Haddadj, W,     \r\nBoumerdes	024 84 85 34	024 84 85 48		
3478	1	4	\N	SOCIETE AMOURI BIG MACHINERY IMPORT EXPORT	شركة عموري للآلات الكبيرة استيراد و تصدير	les orangers lot 212    El Hamiz     Dar El Beida\r\nALGER	0550 18 16 08	023 85 66 40		
3813	3	4	\N	EPTTRS	مؤسسة الأشغال الطرقات و المطارات	58 Hay la caper lotissement N°56, Ouled Fares, wilaya de Chlef.	0550 51 10 94/0550 56 82 90	027 71 88 74/021 20 51 20		
4398	1	\N	\N	EQUIPEMENT TECHNOLOGY AND SERVICES    ETS	تجهيز تقني & خدمات او تي اس	Cité Douzi 01 lot  N° 87  Bab Ezzouar  Alger	0550 99 99 44	023 94 24 16		
3547	\N	4	\N	IBN ROUSTOM						
4298	1	\N	\N	AKADH ENTREPRISE ET SERVICES	عكاظ للمقولات و الخدمات	RN16,BIR ELATER ,TEBESSA	0660 653 049			
4299	\N	\N	\N							
3889	3	4	\N	BELBEL TRAVAUX PUBLICS ET HYDRAULIQUE	بلبال للأشغال العمومية و الري	Cité Zahar, N°29, M'sila	035 55 59 04	035 55 59 04		
3890	2	4	\N	HERITIERS BENFADEL & AGOUNE ABBOUD ET HERITIERS LETLOUT	ورثة بن فاضل و عقون عبود و ورثة لطلوط					
4096	3	4	\N	K.I.V	كــــــايــفي	Zone Industrielle Mebaoudja, Sidi Amar\r\n ANNABA	038 83 04 06	038 83 45 13		
3892	3	4	\N	BRIQUETERIE ET TUILERIE DE MEDEA	مؤسسة الاجر و القرميد للمدية	Draa Essamar, Médéa, BP 127, Médea	025 58 30 68	025 58 30 84		
4012	1	\N	\N	HEMRICHE INDUSTRIES	حمريش للصناعات	Cité Benazouz El Meki, wilaya de Mila	031 45 21 38 / 0550 78 64 57	031 45 21 38		
3672	1	4	\N	CARRIERE NADJAR ET CIE	محجرة نجار و شريكه	Ain Arkou, Tamlouka, W, Guelma	07 72 33 71 20			
4582	1	\N	\N	TIN MANTAT LI ZAHAB	تين منتة للذهب					
3634	12	4	\N	COOPERATIVE ARTISANALE EL MEFTAH	التعاونية الحرفية المفتاح	Commune de Dahmouni  W. Tiaret	0773 245 238			
4739	3	4	\N	MAG EXTRACT						
3763	3	4	\N	BENDAHAH IMPORT EXPORT	بن دحاح استيراد و تصدير	Avenue du Colonnel Amirouche, Draa N'guez, Barika - Batna	033 89 25 02 / 0550 56 09 36	033 89 25 02		
3520	12	4	\N	COOPERATIVE ARTISANALE EZAAMA	التعاونية الحرفية الزعامة	Commune de Rahouia  W. Tiaret	0773 783 343			
3053	3	4	\N	HAISSAM ROUTE ETP	هيصام روت - أو تي بي	Route d'Alger, Médea - W.Médea	0550 99 90 08	025 78 04 94		
1324	3	4	\N	BOUHLAIS BOUBAKEUR	بوحلايس بوبكر	BP 12,  Ain M'Lila  W.Oum El Bouaghi	061 30 29 47			
2897	1	219	\N	NAFCO / NORD AFRICAIN COMPAGNIE	شركة شمال افريقيا "نافكو"	Zone d'activité de Zeralda lot 29 n° 03	021 32 70 87/88	021 32 70 13		
4339	1	\N	\N	BRIQUETERIE EL HOCEINIA	مصنع الأجور الحوسنية	N° 09 Rue Karthage Hydra w. Alger	0550 95 00 15	027 53 74 21		
4733	\N	\N	\N	GLASSTONE ALGERIA	قلاص تون الجيريا	Zone industrielle N° 67, Commune Chelghoum Laid, W-Mila	0555036968/0770948698	031481613		
2519	5	191	\N	ADWAN CHEMICAL COMPANY	شركة عدوان للكيمياويات	N°02 et 03 Z.I. Fornaka-Mostaganem,Algérie	045 37 00 04	045 37 00 05	chabani@adwanchem.com	
3652	1	4	\N	CAROMA	كاروما	293, Route D'ain Guesma, W, Tiaret	024 52 10 21	024 52 10 20/046 41 62 39		
3414	1	4	\N	BMME ENERGIE ET MINES	بي أم أم أو  للطاقة و المناجم	cité Alliguia    villa n° 10   Boumerdes	024 81 88 00	024 81 88 88	contact@bmme-dz.com	
3554	12	4	\N	COOPERATIVE ARTISANALE BOUZIANE	التعاونية الحرفية بوزيان	Commune de Dahmouni  W.Tiaret	0773 783 343			
2669	1	4	\N	NOUR TIMMI TRAVAUX BATIMENTS ET ROUTES	نور تيمي أشغال البناء و الطرق	Zone Industrielle - Adrar - W. Adrar	0661 59 35 64	049 96 52 22		
4779	1	\N	\N	OZMERT ALGERIA		Coopérative ommobilière Soldat Inconnu N° 540, 3 ieme étage, commune Bir El Djir, Wilaya d'Oran	0555 02 25 38 / 0560 22 67 58 / 0555 02 25 30	041 70 80 44	info@ozmertalgeria.com adnan@ozmertalgeria.com	
4009	1	4	\N	EL IKBEL BRIQUETERIE	الاقبال للاجر	Route N° 16, Local N°25,Bir El Ater, Tébessa	05 55 97 98 49			
4198	\N	\N	\N							
4376	3	\N	\N	GROUPE TRAVAUX GUERGUAR GTG	مجموعة أشغال قرقار جي.تي.جي	rue 1e Novembre Si El Haouès - Commune Sebaine - wilaya de Tiaret	0561 69 70 68	046 22 27 18	guerhouari1979@gmail.com	
4377	\N	\N	\N							
3640	1	4	\N	IMC / INDUSTRIE DES MATERIAUX DE CONSTRUCTION	صناعة مواد البناء   ص م ب	Cité Said Hamdine 195/574 logement Bâtiment 44/4f , Bir Mourad Rais	027 80 72 72	027 80 72 75		
3642	1	4	\N	SEBTI CARRIERES	سبتي للمحاجر	Cité Mohamed Boudiaf, 113 Chelghoum Laid\r\nw  de Mila	0661 30 71 35	031 45 70 88		
4876	1	4	\N	EL BARAKATE INDUSTRIE ET CONSTRUCTION	البركات للصناعة والبناء	05 Rue des Tourelles, Hydra 16035, W-Alger.	0550 09 54 78	023 86 76 07		
4877	2	4	\N	MAHDJARET EL IKHOUA BOUADJIL	محجرة الإخوة بوعجيل	Commune Ain Sandal, Guelma	06 76 54 55 29	044 77 14 58		
4303	3	\N	\N	ABADI ABDELATIF DES TRAVAUX ET SERVICES	عبادي عبد اللطيف للأشغال و الخدمات		05 50 52 36 80	038 55 76 54		
3676	1	4	\N	MENTILA	منتيلة	17, Rue Zenasni Ahmed  Eckmül W.Oran	041 36 49 45			
2967	1	4	\N	MEDRAG	ميدراق	25, Rue Larbi Ben M'hidi 31200 Arzew - W. Oran	041 47 65 66 / 072 26 82 96	041 47 65 66		
2968	1	4	\N	AGREGABAT	أقريقابات	Cité 1134 logements El Wiaam bt 29 local n° 1 w/Djelfa	061 56 01 22	021 20 31 44		
2083	2	4	\N	BRAHIMI TORKI & FILS	براهيمي تركي و أبنائه	Oued Arama - Oued Seguin - W.MILA	070 90 29 63			
4704	\N	4	\N	TRAVAUX DE L'EST	اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
4706	1	\N	\N	MANGOUTI D'OR	مانقوتي للذهب					
4707	1	\N	\N	AKZERNE D'EXPLOITATION D'OR	اكزرن للتنقيب عن الذهب					
4266	1	\N	\N	GROUPE FRERES BENMESSAHEL	مجمع الإخوة بن مساهل	Cite Raihana Local N°01 El Fedjoudj, wilaya de Guelma	0561 61 84 20	035 69 61 63		
4132	1	4	\N	SOLTANI SUCCES UNION	سلطاني سكسس يونيون	Cité zone commercial, local N° 01, Ain kerma, wilaya d' El Tarf	0660 39 36 00	038 32 92 53		
3068	3	4	\N	ETC MENDI	مؤسسة الا شغال و البناء مندي	224 lots LSP Bt  N° 3 - REMCHI - TLEMCEN	043 20 27 82 / 0770 65 19 98	043 20  27 34		
4839	1	4	\N	EL BAYANE LIRIMAL	البيان للرمال	Zone urbaine, lot 20+295 AADL, n°51, Boussaâda, M’sila.	06 59 63 95 22.			
4840	1	\N	\N	ILARE TRAVAUX PUBLICS	ايلار للأشغال العامة	Cité 1er novembre, commune Tadjenant-mila	0661338063	031535245		
4714	1	\N	\N	TAMJOG D'OR	تامجوق للذهب					
4509	1	\N	\N	TISSELMATINE	تيسلماتين					
4175	1	\N	\N	AL YOUMNE TRADE	اليمن تراد	48 Rue des freres Bouaddou Bir-Mourad Rais Alger	043 27 50 00 / 0770 27 02 79			
3856	2	4	\N	GRADOUL BENBRAHIM et Cie	قرادول بن براهيم و شركائه	01, Rue Ouslama, dellys - Boumerdès	0770 54 93 16 ou 0661 51 65 82	021 77 81 41		
1629	1	4	\N	EL HOGGAR	الهقار	Cité Caroubier N° 129 1er Etage W/Annaba	038 86 63 56 / 061 32 89 00			
4825	1	\N	\N	RABIA BRIQUETERIE	ربيعة بريكاتري	Cité Ouakda local n°01 section 117 lot 175 Bechar	0664564506			
4826	\N	\N	\N							
4827	1	\N	\N	ALGERIAN QUARTZ						
4828	1	4	\N	NEWTECH CERAM	نيوتاك	05, Rue "H", cité El Moudjahidine route de Biskra, Batna.	0558 82 00 61 & 0770 44 13 22	027 51 53 66		
4830	\N	\N	\N	OMNIA SOLARI PRODUCTION INDUSTRIELLE						
4492	1	\N	\N	ABNAA AHMED ESSEDIK LI TANKIB	ابناء احمد الصديق للتنقيب					
4405	1	4	\N	NAIL ZAKARIA	نايل زكريا	Cité Ciriet Belkacem, El ,Outaya, Biskra	07 70 94 04 10	033 65 95 76		
4726	1	4	\N	EL SERRADJ CARRIERE FRERES YKHLEF	السراج محجرة الإخوة يخلف		05 50 45 10 21			
3465	1	4	\N	SOUMMAM SOUM		68 route ain Guesma cité belle vue Tiaret.	0774 44 32 66			
4819	1	4	\N	OULED EL MOULAT	أولاد المولات	Cité 400 Logts BTS, Groupe de Propriété 248, N01, Adrar	06 63 44 29 39	049 36 55 44		
4821	1	4	\N	CARRIERE SAHARA	محجرة الصحراء	El Alia, Commune El Alia	07 76 60 50 32	: 032 12 45 32		
4822	\N	\N	\N	DJAMILA CERAMIQUE		05 Rue Abdelaziz, Eulma w,SETIF	0550 10 37 17	036 87 65 65		
4823	\N	\N	\N	DJAMILA CERAMIQUE		05 Rue Abdelaziz, Eulma w,SETIF	0550 10 37 17	036 87 65 65		
4824	1	\N	\N	DJAMILA CERAMIQUE		05 Rue Abdelaziz Khaled , Eulma w,SETIF	0550 10 37 17	036 87 65 65		
3673	12	4	\N	COOPERATIVE ARTISANALE ESSALAM BOUSAADA	التعاونية الحرفية السلام بوسعادة	Village Mohamed Seddik Ben Yahia   Commune de Bousaâda  W. M'sila	0661 676 067			
1840	3	4	\N	ROUINA CONCASS	روينة كونكاس	Cité Boudiaf N°6 NAIMA W,TIARET	0673383092	046289055		
3012	5	4	\N	CEVITAL MINERALS	سيفيتال مينيرال	Batiment CEVITAL  Ilot D N°06 Zhun Garidi II, Cne Kouba, W.d'Alger.	770 94 19 85	021 298 833	cevital.minerasl@cevital.com	
3645	1	4	\N	ZELFANA TOUR	زلفانة تور	Tahsis Afak  Bir El Ater       Tebessa	0661 36 73 73	037 44 93 58		
3608	12	4	\N	COOPERATIVE ARTISANALE HEDIA POUR LE CONCASSAGE	التعاونية الحرفية هدية لتكسير الحصى	Cité des 220 logements, Frenda - W.Tiaret				
2542	1	4	\N	ADD BETON	ا دي دي بتون	131, Boulvard Krim Belkacem - Alger.\r\nBP 25 bis, Said Hamdine - Alger.\r\nDirection technique : Chemin Doudou Mokhtar, coopérative des orangers, villa n° 09 Ben Aknoun - Alger.	021 79 68 83 / 021 79 84 87 à 89 / 061 56 41 07	021 79 68 85	add_travomed@yahoo.com	
3113	1	4	\N	CARRIERE MAZMAZA	محجرة مزمازة	DECHERA AIN ZINA  BOUZINA  BATNA	077009 67 86	037 21 18 77		
3115	1	4	\N	NORD AFRQUE ROUTES	شمال إفريقيا للطرقات	Cité El Kouit BT 492 n° 02 W, Djelfa	027 90 01 97 / 0676 31 23 53	027 90 01 97		
4393	1	4	\N	BRIQUETERIE AMOURI LAGHOUAT	شركة الاجر عموري الاغواط	M'Righa Route de Djelfa Laghouat	029 11 18 18	029 11 18 18		
4395	\N	\N	\N							
4163	5	\N	\N	BENLABIOD ET CIE TRAVAUX	بن الابيض و شركائه للاشغال	CITE GUENANI BAT 03 DJELFA	0550859716	027878176		
4164	\N	\N	\N							
4773	1	4	\N	EGTP MAKHLOUFI	أو جي تي بي مخلوفي	Bordj Zada commune Dehamcha - W Sétif	03663 74 59 / 0661 57 39 15	036 63 74 59		
4751	\N	\N	\N	07						
3737	1	4	\N	CARRIERE SERRAB ET ASSOCIES AGREGATS ET SABLE	محجرة صراب و شركاؤه للحصى و الرمل	Ain Arkou, Bt 11 n°13, W.Guelma	0790 33 60 83	021 20 51 20		
4878	3	4	\N	GRANITOB	قرانيتوب	Hai El Hidab, 40 logements LSP+24 locaux, Bt A 01 Coopérative immobiliere Saadna, Commune de sétif, W Sétif	0550 56 06 01			
4880	\N	4	\N	CARRIERE FRERES MOSTFAOUI	كريار الإخوة مصطفاوي	Cité des jardins, mektefi Zouaoui, N° 169 D, Commune de Sétif	05 50 66 27 66			
4389	1	\N	\N	SIDI MANSOUR	سيدي منصور	Boukadma Tient, Tlemcen	05 50 99 19 70			
4925	3	\N	\N	GROUPE VITAL TRAVAUX	قروب فيطال طرافو	Bt B1 C N°12 Ain Smara, Wilaya de Constantine.	0770444348 & 0555 03 69 66	031 97 22 00		
4926	1	\N	\N	DUNE MAKERS	دون ماكرس	Projet 265 Logt promotionnel cité el riah el kobra bt 17 n°13	0540 00 61 01			
4927	1	4	\N	TASSNIM LIL SINAA	تسنيم للصناعة	Sed Rekail Loc n°02 APC Souamaa	0770 879 080 / 0656 374 974			
4928	1	\N	\N	SABLIERE BOUSSELAM		El miel, Commune Tamokra, W BEJAIA	0550 903 771 - 0773 114 102 - 0770 372 900			
4929	1	4	\N	BENMAAMAR TRAVAUX PUBLIQUE ET HYDRAULIQUE	بن معمر للاشغال العمومية والري	Village colonel Amirouche Cone Akbou-w.Béjaia	0542 15 78 44			
4930	1	\N	\N	BENMAAMAR TRAVAUX PUBLIQUE ET HYDRAULIQUE	بن معمر للاشغال العمومية والري	Village Colonel Amirouche Cone Akbou-Wilaya de Béjaia.	0542 15 78 44			
4931	1	\N	\N	BLBS	بي أل بي أس	Cité 500 logements LPP, Bt12, n°06, Rouiba, wilaya d'Alger	0770 35 35 12 / 0792 33 21 13			
4932	1	\N	\N	BELABBES LAKHDAR EXTRACTION	بلعباس الأخضرإكستراسيون	Cité les 03 caves 554 loc, El Harrach, Wilaya d'Alger	0770 35 35 12			
4933	1	\N	\N	MARMALAT AIN SAFRA						
4934	\N	\N	\N	SMART INTERNATIONAL TRADING CAMPANY		77 Plan de partage, la route, Birkhadem Alger-Algérie	0770 94 28 93	213 23 59 77 93		
4935	1	\N	\N	MINERALGERIE	مينيرالجيري	Ain El Bia, Rue 37, Village Sonatrach n°5, Bethioua, wilaya d'Oran.	0552 48 22 22 / 0770 40 19 10			
4936	5	\N	\N	TAM STONES		Bloc Administrif 01, Local N°01, Division N°10, Groupe de Propriété N°10, Commune Sidi Bel Abbes - Algerie	048 77 03 17 - 048 77 01 40	048 77 03 17		
4027	1	4	\N	MITIDJA AGREGATS	متيجة اقريقا	Local N° 04 B, Immeuble Meziane Mahmoud, Bouzeguene Centre, Tizi Ouzou	0661 66 58 900554 12 09 33	036 74 30 48		
3739	1	4	\N	SBS ET SITIFIS BRIQUETERIE	اس بي اس و بريكتري ستيفيس	Z,I, N°17 Bis Sétif	036 91 75 26	036 91 63 70		
4138	1	4	\N	SBTB  SOCIETE BRIQUETERIE  BARIKA	مؤسسة الأجر و القرميد بريكة أس بي تي بي	N 1  zone industrielle    Barika     batna	033 38 20 99   /0550 34 77 08	033 38 20 98		
3397	1	4	\N	CARRIERE DJEBEL IBN BADIS	محجرة جبل ابن باديس	lotissement El Bousténe,  n° 158   Ain Abid    Constantine	0775 57 70 20	031 96 55 99		
2716	1	4	\N	STG / SIDI MOUSSA TRAVAUX GENERAUX ET PROMOTION IMMOBILIERE	سيدي موسى للاشغال العامة و الترقية العقارية	Rue Bouzidi Abdelkader BP 285 W/Adrar	049 96 60 80	049 96 87 30	grelhamel@yahoo,fr	
2903	2	4	\N	CARRIERE BENABDERRAHMANE & CIE CB	محجرة بن عبد الرحمان و شركائه سي بي	Village Bouazza BP N° 04 commune El Chorfa w/Bouira	070 32 08 24/026 95 04 31	026 95 04 41		
512	3	4	\N	PLATRIERE EL GHAZEL	معمل الجبس الغزال	Coop Chahid Naceri, Zone Ouest - Biskra BP 279 Beni Morah	033 74 51 84 / \n021 53 80 34	033 74 48 68 / \n021 53 80 28		
1145	1	4	\N	CSK / CARREAUX DU SAHEL KACI		Zone d'activité n°73 - Koléa - W.Tipaza	024 52 10 19 / 024 52 10 21/22	024 52 10 21/20		
2618	1	4	\N	KHECHIME MADI	خشيم مادي	Zone Industrielle Hassi Messaoud - W.Ourgla	070 98 22 47			
4535	1	\N	\N	SID BEN SAHNOUN ET ASSOCIES IMPORT- EXPORT	سيد بن احمد  شركاؤه استيراد-وتصدير	Cité Amel N° 213 Ain Fekrone Wilaya d'Oum El Bouaghi.	032 40 36 93			
4368	3	\N	\N	EGTR BOUBAYA	أو جي تي أر بوبعاية	Cité 55, El Hadj Aissa, M'sila	035 55 03 03			
3601	1	4	\N	CARRIERE MATOUK	محجرة معتوق	N°9 Route Ain Dehab Cne de Sougueur- W. Tiaret	0771 31 33 55	036 74 30 48		
3577	12	4	\N	COOPERATIVE ARTISANALE SABLIERE SIDI SAADA	التعاونية الحرفية مرملة سيدي سعادة	Selmane Ouled Derradj, W, M'sila	07 74 423 896			
3876	1	4	\N	BEN NACER & ASSOCIES DES TRAVAUX PUBLICS ET SERVICES	بن ناصر و شركائه للأشغال و الخدمات	Lot n° 20, Zone industrielle, Souk Ahras.	0661 39 54 13	037 75 10 10		
3505	1	4	\N	DJIMLI MOHAMED SAID ET FRERES DES TRAVAUX PUBLICS	جيملي محمد السعيد و إخوانه للأشغال العمومية	Hamma Bouziane, Cité Djebli Ahmed - Hamma Bouziane,W.Constantine	0770 37 05 89	031 92 87 15		
3969	1	\N	\N	BRIQUETERIE HEUMIS	مصنع الآجر حميس	BP N°15 HEUMIS, BOUZGHAIA, CHLEF	040 67 10 10	040 67 11 11		
3970	1	\N	\N	OMIA SABLE	امية صابل	09 ,Rue Chikhaoui Mokhtar Frenda W. Tiaret	0555 275 402	046 40 69 49		
4029	2	4	\N	TERICHE ET GOHEMESSE	تريش و قحمص	Cité EL HOUARIA,Cne Nezla Daira Touggourt, W, Ouargla.	06 60 64 29 71			
4627	1	\N	\N	THIOUAT LITANKIB ANI ZAHAB	تهيوات للتنقيب عن الذهب					
4628	1	\N	\N	TAGHERBA LITANKIB	تاغربا للتنقيب					
3412	1	\N	\N	ARM HOLDING	أ.أر.أم. هولدينق	Villa n° 325, Les Dunes, Cheraga - ALGER	0555 99 99 02/021 37 91 02	021 35 41 68/021 38 23 89		
2619	1	4	\N	SOCIETE EL CHETTIA EXPLOITATION DES CARRIERES	شركة الشطية للاستغلال المحاجر	Lala Aouda, Cité Maghraoui n° 39 - W.Chlef	0665 01 49 60			
3271	1	4	\N	KELTOUM MINES	كلثوم للمناجم	Cité 130 Logts N° 100 El Magharia, W, Alger	05 50 13 46 59	031 96 55 99		
2173	1	4	\N	NOSTRAP	الشركة الجديدة للأشغال العمومية - نوسطراب	BP A 44 RP 18000 - Jijel	034 59 62 19	034 59 62 17		
1848	1	4	\N	SABLIERE AZHAR	مرملة أزهار	10,Rue Emir AEK W/ Ain Defla	027 64 35 67 / \n072 35 03 77	027 64 75 67		
4005	3	4	\N	LALLA CARRIERE	لعلي محجرة	Cité 400 Logts, Coop Immobilière Nour El Houda n° 11, Sétif	036 84 44 43	036 84 44 43.		
4923	1	4	\N	CARRIERE SIDI LAHCENE	محجرة سيدي لحسن	Boukdama, Commune de Tient, Ghazaouet, Tlemcen.	07 71 53 51 76.			
4924	1	\N	\N	CARREAUX MODERNES DU CENTRE	البلاط الجديد للوسط	Voie H,lot B54,zone Industrielle Rouiba wilaya d'alger.	023864151&0560506151			
4806	1	4	\N	TIHARINE	تيهرين	Cité Bouameur, Ouargla	06 60 51 31 10	037 73 08 87		
4807	1	4	\N	SIDI BOURZINE	سيدي بورزين	Boukdama, Commune de Tient, Daira de Ghazaouat, Tlemcen	07 70 54 88 43			
4347	1	\N	\N	BEN BRAHIM EXTRACTION SABLE ET GRAVIERS	بن ابراهيم لاستخراج الرمل و الحصى	Lotissement El M'Tal; Sidi El Medjni; Dellys; Dellys; Wilaya de Boumerdes.	029 70 06 96	029 70 63 66		
4638	1	\N	\N	TIN ZOUMITIQUE D'OR	تين زوميتك للذهب					
3864	5	4	\N	GOLDIM / GOLD AND INDUSTRIAL MINERALS	قولد أند أنديستريال مينيرالس - قولديم	08, Rue des Aurès - BP 11 - El Harrach - Alger	024 81 77 39	024 81 77 39	goldim@orgm.com.dz	
3954	1	4	\N	BRIQUETERIE TIDJELABINE	مصنع الأجر تيجلابين	zone Industrielle de Tidjelabine , Usine de Brique\r\nTidjelabine 35000 Wilaya de Boumerdes	0550453444	024792201		
3794	1	4	\N	SANABIL ES-SALEM	سنابل السلام	n° 50 Zone Industrielle, Chelghoum Laid - Mila	031 52 62 92 / 0661 33 86 65	031 52 62 84		
3949	5	\N	\N	FERAAL / SOCIETE NATIONALE DU FER ET DE L'ACIER		07, Rue Ammani Belkacen, Site SIDER, Le Paradou, Hydra Alger.	023 53 42 84	023 53 41 97		
3638	3	4	\N	YMERIS TCE	إمريس تي.سي.أو	Lotissement Sidi Cheikh, n° 96 - Saida	0770 74 92 10 / 0791 051 924	048 47 24 46 / 035 52 41 54		
4318	1	\N	\N	Briqueterie TIMADANINE	مصنع تيمادنين للياجور	BP 285 rue Bouzidi Abdelkader, Adrar	049 96 89 19	049 96 89 19		
4695	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
3938	5	4	\N	AZROU CONCASSAGE	ازرو لتفتيت	Cité Ain Abdellah, Bloc A, n°134, Boumerdès	024 94 39 39	024 94 33 56		
4702	13	4	\N	EL HAFADA	لحفدة	Askrif chemin Romain, Lot n°21, Local A, Bir khadem, Alger.	0778 98 13 25			
4703	1	\N	\N	ALGEMATCO STEEL	اشغال الشرق	Zone Industrielle, Sidi Khattab, W relizane	023 69 62 10 - 0770 92 71 60	023 69 62 07		
3784	5	4	\N	GICA / GROUPE INDUSTRIEL DES CIMENTS D'ALGERIE	المجمع الصناعي لاسمنت الجزائر	BP 38, Route de Dar El Beida, Meftah - Blida	025 45 61 98/45 62 61	025 45 63 28	info@groupe-gica.dz	
4521	1	\N	\N	IN KAZERMEN LITANKIB	ان قزرمن للتنقيب					
4522	1	\N	\N	INIRADIGH	إينيراديغ					
3225	1	4	\N	SOCIETE DE DESAMIANTAGE ET DE GESTION DE L'ENVIRONNEMENT	شركة نزع الاميونت و التسير البيئة	Palm Beach Villa 119, Staouali, wilaya d’Alger	025 45 59 97	025 45 59 97		
2420	3	4	\N	EL KOUDIAT	الكــديــة	Cité Safa Abdelkader Troisieme Tranche Route de Faidja - Sougueur - Tiaret	063 45 43 90			
3590	12	4	\N	COOPERATIVE ARTISANALE BOUDJLIDA	التعاونية الحرفية بوجليدة	66, Rue Boudjlida Bachir  Medroussa  W. Tiaret	0777 910 147			
4232	1	\N	\N	SOCIETE DE FABRICATION DE BRIQUES I.M.J.	شركة صناعة الأجر أ م ج	Commune Djerma wilaya de Batna	033 85 16 22	033 85 16 22		
4594	1	\N	\N	AMILAN LI ZAHAB	أميلن للذهب		0655801107			
4286	1	\N	\N	TEDJ  EL SIDK SIRAM	تاج الصدق سيراميك	cité El Houda n° 46   Bougtob    EL  BAYADH	049 62 33 35 /0661 34 16 05	049 62 33 35		
3799	1	4	\N	BRIQUETERIE NAILI	بريكتري نايلي	Zone d'activité, Section 195, propriété n° 07, commune de Djelfa, wilaya de Djelfa	021 86 08 89	021 87 71 71		
4203	1	\N	\N	GLOBAL GYPSE COMPANY		Hai Essedekia, Coop Immobilière El Akid Otmane, Parcelle n°8 local n°3 - Oran	0661 10 00 91			
4204	1	\N	\N	DRIF SAMIR	ضـــــــريف سميــر	AIN ARKO commune TAMLOUKA\r\nWILAYA DE GUELMA	0790 00 38 8	037 11 73 46		
4264	1	4	\N	El AMIR EL MANADJIM	الامير المناجم	Zone industrielle  de  Sig Section 22  Ilot 29  N°01       Mascara	0550 61 21 33    /    0550 48 49 75	045 94 31 64		
3072	1	4	\N	SOCIETE CARRIERE EL KEHNIK	شركة محجرة الخنيق	Oum Ali W.Tebessa	0770 80 88 51	037 48 30 06		
3073	1	4	\N	TRANSPORT TERRESTRE SANTA CRUZ	النقل البري سنتا كروز	Cité 216 logts bt 21 local n° 431  USTO ORAN\r\nN° 74, Lotissement Zone Industrielle Bir El Djir W.Oran	041 42 00 08 / 0773 34 39 34	041 42 14 88		
4402	1	\N	\N	AL SAHEL EL ABIAD	الساحل الابيض	Cité 250 D logements N° 03 Bâtiments N° 03 A El Oued –W.El Oued	0664 38 38 32 / 0663 165 912			
4179	3	\N	\N	SMAILI ABDELWAHID PRODUCTION D'AGREGATS	سمايلي عبد الوحيد لإنتاج الحصى	Djebel Mazela, Ain Abid, wilaya de Constantine	0662 44 93 85	032 40 10 31		
4529	5	\N	\N	BABAHOUM	باباهم	DAR AROUSSE BRANIS WILAYA DE BISKRA	033 62 73 61/62	033 62 73 59	Hoggui-laid@yahoo.com	
4014	1	\N	\N	MAGHREB STREET ARMADA	مغرب ستريت أرمادة	Local 02, Ain El Khadra, wilaya de M'sila	033 39 12 97 / 0560 06 87 46	033 39 12 97		
4744	1	\N	\N	CERAMIQUE DES BIBANS	سيراميك دي بيبان	Local 06 section 165 lot 34 zone indistrielle BBA	0550475180	035873264		
4315	1	\N	\N	TRAPIF TRAVAUX PUBLICS	ترابيف أشغال عمومية	15 RUE Oued El Khir, Route de Tiaret, Mascara	0550273912-0775292156			
3952	1	\N	\N	TECHNOCERAM	تـــــيكنو سيــــرام	N° 22, rue des Frères Debbabi et Bouakal 03, Batna, wilaya de Batna	033 80 82 05	033 80 82 10	tecnoceram@yahoo,fr	
4444	1	\N	\N	TEFADASST	تفادست					
4396	\N	\N	\N	SEL SIDI TIFOUR	ملح سيدي تيفور	Cité Gorraba rue Bousmaha    Abdel Kader   El Bayadh	0552 17 88 24/0790 77 92 03			
4463	1	\N	\N	TAGHMERT N'AKH	تاغمرت نخ					
4228	5	\N	\N	SIDER EL HADJAR	سيــــدار الحجار	Complexe Sidérurgique d'El Hadjar\r\nBP 2055 ANNABA - ALGERIE				
4229	1	\N	\N	CARRIERE LARBI	محجرة العربي	Cité Fedaoui Salah n°01 Chetaibi Mokhtar El Taref	07 70 12 88 03	038 69 11 98		
4013	1	4	\N	IFKER AGREGATS	افكر للحصي	Cité Mazla, Commune d’Ain Abid, Constantine.	05 53 42 52 16			
4022	3	\N	\N	H.B BOURAS EL RAHMA SERVICE	أش.بي بوراس الرحمة للخدمات	Hay  Zitoune local   N° 01, Bir El Ater, Tébessa	0555 618 362	038 42 71 70		
4512	1	\N	\N	TAZZAYTE LITANKIB AN ZAHAB	تازايت للتنقيب عن الذهب					
3873	1	4	\N	UNITE DE PLATRE BOUCHENGA EL HADJ METLILI	وحدة الجبس بوشنقة الحاج متليلي	Lot n° 584, Metlili, Nouvel Noumerat, Metlili - Ghardaia	0661 50 57 96			
1653	1	4	\N	CTPCMA	مقلعة الأشغال العمومية و التجارة في المواد و الحصى	34, Rue de Bab El Oued - Alger	021 35 30 39	021 35 30 39		
4964	1	\N	\N	CERAM GLASS		Zone Industrielle, Lot n°155, Setif,ALGERIE	036 62 51 52	036 62 51 48		
4965	1	\N	\N	BROYAL INDUSTRIE		Ouled Salah Lot N°34 A commune Amir Abdelkader, w JIJEL,				
4737	1	4	\N	Carrière F BAR		Lotissement 203 N° 171 RDC Mchira Mila	0661918175			
3906	1	\N	\N	EL HADJEB POTERIE	الحاجب للفخار	Village Beni Brahim   El Hadjeb  Biskra	020 96 26 65	 020 96 27 85		
4937	1	4	\N	CARRIERE KHELILI MOHAMED	محجرة خليلي محمد	Oum Etiour, Daira El Mghaier, El Oued	06 74 06 56 00	032 21 94 92		
4567	1	\N	\N	AKHANE LITENKIB AN ZAHAB	اخان للتنقيب عن الذهب					
4364	\N	\N	\N							
4289	\N	\N	\N	COMEP/ COMPLEXE ECH CHLEF DES PRODUITS	مركب الشلف للمواد الحمراء					
2869	1	4	\N	REAL MACAT	ريال مكات	Station des Services El Wafi Lakhder la rue quatre w/Tebessa	099 17 55 05	037 21 18 77		
4440	1	\N	\N	INOUZZALINE	إن اوزالن					
4441	1	\N	\N	TISSARAOUT LI TANKIB	تيسراوت للتنقيب					
4442	1	\N	\N	TAZERZAIT LITANKIB	تزرزايت للتنقيب					
4443	1	\N	\N	IMLOULAOUENE	أملولاون					
4035	1	4	\N	ETPH BEN ATIA	او تي بي اش بن عطية	01, Rue Bouteldja Mahfoud, Berahal Centre, Annaba	0661 31 18 80	038 45 71 59		
3882	3	4	\N	CARRIERE FEDJ LAAMAD	محجرة فج لعماد	Sidi Belkacem, Commune tarf, Wilaya de Tarf	038 60 28 19	038 60 28 19		
4519	1	\N	\N	ABLAMA	أبلما					
4331	1	\N	\N	CARL WORLD CARRIERE	كــارل وورلــد كـــــــاريار	Commune ATH MANSOUR  Wilaya de Bouira				
4332	5	\N	\N	SOCIETE DES CIMENTS DE SIGUS	شركة الإسمنت سيقوس	06, cité El Moudjahidine logt n°6 Sigus\r\nwilaya d'Oum El Bouaghi	031 66 38 53	031 66 38 53		
580	3	4	\N	OUSSIFT CARRIERE	محجرة أوسيفت	Aourir BP n° 66 Commune de Bouzina -  W. Batna	033 85 28 84			
4632	1	\N	\N	TIN TAOUSSIS LI ZAHAB	تين توسيس للذهب					
3691	3	4	\N	HYDROCAR	هيدروكار	07,Rue des frères Djillali , Birkhadem W. Alger	0770 951 478			
3704	12	4	\N	COOPERATIVE DE L'IDUSTRIE TRADITIONNELLE ET ARTISANAT DJEDDI	تعاونية الصناعة التقليدية و الحرف جدي	Zone Industrielle  Hassi Abdellah  Commune de Tindouf W. Tindouf	0772 906 289			
3555	12	4	\N	COOEPRATIVE ARTISANALE EL ATRAK	التعاونية الحرفية الأتراك	Cité El Anasser Frenda   W. Tiaret	0779 225 651			
3481	1	4	\N	FRERES KALKALA	الإخوة قلقالة	cite du  5 juillet  62   Bloc 13      n° 105    ANNABA	0555 01 92 509	038 84 34 81		
2395	1	4	\N	SAST	شركة الحصى و الرمال تلمسان	 Tounane- Souahlia  W. Tlemcen	04560 47 42	043 32 04 70		
4459	1	\N	\N	SOUHOUM LI TANKIB	السهوم للتنقيب					
4234	3	\N	\N	PRO THAZIR	بـــــــروتـــازير	Ilot N°10 Commune Ain Smara wilaya de Constantine				
3058	1	4	\N	SARALCOF		69 Rue Ali Haddad    alger	021 27 21 56	021 27 33 74		
4271	1	\N	\N	YOUGAM REALISATION ET SERVICES	يـــوقــام للإنجاز و الــخدمات	Cité Sidi Boughfala, wilaya d'Ouargla	0666 27 60 24	029 45 71 94		
4476	1	\N	\N	TASSAGHT LITANKIB	 تاساغت للتنقيب					
4477	1	\N	\N	IN ISSEK	اين ايسك					
3801	3	4	\N	BRIQUETERIE DJABRI	مصنع الاجور جابري	Rue 01 Novemebre, cité 01 Mai, Nezla - TOUGGOURT	0555 03 89 65/0661 38 44 81	029 68 39 43/029 67 47 03		
3392	1	4	\N	AL TOUATI STATION DE DISTRIBUTION DE CARBURANTS ET DE SERVICES	شركة ال تواتي محطة توزيع الوقود و الخدمات	Route Nationale n° 16 Bir El Ater - TEBESSA	0550 45 07 39			
2599	1	4	\N	CARRIERE HAMEL	محجرة هامل	Cité Filali Batiment J n° 02 - W.Constantine	061 30 13 32			
4942	1	4	\N	AMOURI BRIQUES	عموري للاجر	Sidi Amrane, Wilaya El M'ghair	0555 02 53 89	023 80 75 92	amouri.brique@yahoo.fr	
4943	1	\N	\N	NIRIA		Hai Khemisti Cité Mezhgana, Batiment I, Etage 8 N°3, Oran	0541 87 41 99			
4944	\N	\N	\N	MESLOULA PRODUCTION DE GRAVIER						
4945	1	\N	\N	BENOUECHEN FAYSAL IMPORT EXPORT	بن وشن فيصل للاستيراد والتصدير	Cité Gasimia Mahmoud route nationale n°5 Tadjenanet, wilaya de Mila.	0550 64 06 45 & 0656 18 15 70	031 45 70 88	benouchenefayssal@gmail.com	
4946	1	4	\N	GEAGTP	جي او ا جي تي بي	Cité 12 logements, 2éme étage bureau N°01 lots 134, Commune de Bordj Bou Arreridj.	0770 93 93 61			
4947	1	4	\N	GEAGTP	جي او جي تي بي	Cité 12 logements, 2éme étage bureau N°01 lots 134, Commune de Bordj Bou Arreridj.	0770 93 93 61			
4948	1	4	\N	SABLIERE SABLE D'OR	صابليار صابل دور	Cité 1200 Logements coopérative El Bahdja Local n°09 Bloc "B" rue de chaussé commune de Bab Ezzouar.	0550 69 61 18			
4044	1	\N	\N	SOCIETE BRIQUETERIE DE FESDIS	شركة آجــر فسـديــس	FESDIS WILAYA DE BATNA	033 80 81 32 / 033 80 82 34	033 80 81 33		
3460	3	4	\N	OMUS		Cité Houari Boumediene N°518/01 Bousaada W. M'SILA	0770 42 60 06			
4340	1	\N	\N	THEVEST CONDITIONNEMENT	ثـفست للتوضيب	HAI SALIBA 74,  OUED SMAR ALGER	02392 03 99	02392 03 99		
4469	1	\N	\N	INTIBEL LITANKIB AN ZAHAB	انطيبل للتنقيب عن الذهب		0658434273			
4478	1	\N	\N	SOCIETE ADNEK	شركة ادنك					
3525	2	4	\N	MAHDJARET FRERES BENMESSAHEL	محجرة الاخوة بن مساهل	Commune El Fedjoudj et Medjaz Amar,W, Guelma	07 70 42 34 12	037 21 67 21		
3922	1	4	\N	BATI JOB	بــاتي جــوب	Cité les Frères BEN ABBAS Batiment B n°138 Constantine	031 93 68 58	031 93 68 58		
3192	1	4	\N	ECO ROUTES	اكو روت	Rue Rouibah Tahar Bt 03 N° 02 Collo W, Skikda	0550 10 23 11&0661 10 32 32			
2098	3	4	\N	EL GHAZI MUSTAPHA	الغازي مصطفى	N° 17, Bd Hamsali Sayah W.Tlemcen	043 26 46 31 / \n043 26 46 32\n071 78 00 27	043 27 66 65 		
3777	2	4	\N	CARRIERE DEBACHE / BENSEGHIR	محجرة دباش / بن صغير	Djebel Timetlas, commune de M'chira - Mila	0665 15 59 46			
3778	5	4	\N	BATI SUD	شركة البناء للجنوب و الجنوب الكبير	Zone Industrielle, Route de Ghardaia BP 31 - Ouargla	029 71 37 84	029 71 37 84		
4253	1	4	\N	MESSAI	مساي	Rue Larbi Ben Mhidi Commune de  Ouarizane  W. Relizane	0550 73 41 95	023 77 96 59		
4577	1	\N	\N	ALOUS NAHGAR	الوس نهقار					
3487	1	4	\N	STE AMOURI POTERIE	شركة عموري للفخار	El Hadjeb   BISKRA	020 97 14 26 - 0555 621 91 03	033 75 41 42		
3489	1	4	\N	SAMSTAR MULTIMEDIA 2	سامستار مولتيميديا 2	Ferme Arbal Touazet, RN 04, Ilot 106, Oued Tlilat, Wilaya d’ORAN.	0550 30 53 23 / 0550 48 13 03	040 23 78 28		
4957	3	4	\N	BENAMER MARKETING ET SERVICES	بن اعمر للتسويق والخدمات	Guetaa El Oued Tamanrasset.	0661649198	023807592		
4959	1	4	\N	EGREB	اغراب	RN 07 Tizghant, commune de Beni Mester, Mansourah, Wilaya de Tlemcen	0556 14 91 83			
4960	1	\N	\N	BATINOL CONSTRUCTION	باتينول بناء	30 CITE BOUMERZOUG,COMMUNE DE CONSTANTINE	0555036964	023807592		
4961	1	4	\N	E.T.P BENZAMIA	م.آ.ع بن زعمية	Chemi de wilaya n°132 Harchou, Chlef.	027 77 52 87	027 77 90 58		
4962	1	\N	\N	ENTREPRISE EL TAMY			069 73 79 80	027 42 32 87		
4206	1	\N	\N	ENTREPRISE MENGOUDA BRIQUETRIE	مؤسسة منقودة للأجر	Commune de Sidi Hadjeres, wilaya de M'sila	0656 08 15 82			
4241	1	4	\N	ROULEB AGREGATS	رولاب للحصى	Rue Baatouche, Ain Touta, Batna	033 85 22 38	033 85 22 38		
4242	5	4	\N	DIVINDUS APMC	ديفندوس الجزائرية لانتاج مواد البناء	Cité des 416 logts, AADL Bt B, Gue de constantine, Alger	032 54 01 88	032 54 01 89		
3963	1	4	\N	TIMASSANIN TRAVAUX ET COMMERCE	تيماسنين للأشغال و التجارة	Bp n° 136, In Salah 11 200, wilaya de Tamanrasset.	029 38 00 08	029 38 00 08		
3964	1	\N	\N	BRIQUETERIE SOUAKRI FRERES	بريكاتري الإخوة سواكري	EL KHEDDRA, MEFTAH, BLIDA	0560 932 790	021 24 96 19		
3965	1	4	\N	I.T.C INDUSTRIE TERRE CUITE	أي,تي,سي اندستري تار كويت	Route de Boumedfaa RN 42, Hammam Righa, W.Ain Defla.	021 20 19 90, 0770 94 10 40	021 20 19 90	itc.briqueterie@gmail.com	
3896	1	4	\N	SOCIETE BELHASROUF GRANDS TRAVAUX ROUTES ET AERODROMES	شركة بالحسروف للأشغال الكبرى للطرق و المطارات	BP 251, Cité Essadikia - Laghouat	0770 571 628/ 029 93 43 81	029 93 43 81		
3712	12	4	\N	COOPERATIVE ARTISANALE EL ITIFAK	التعاونية الحرفية الإتفاق	Commune de Oued Lilli  W. Tiaret	0773 245 238			
963	3	4	\N	CARRIERE AHL ES SOLTANE	محجرة أهل السلطان	Rue Lechehab Cherif -Ain Mellouk- W.Mila				
4283	3	\N	\N	KOUDRI CARRIERE	 محجرة كودري	Cité Tahar  Bouchat coopérative El Baraka  Section 1 Groupe Royale 419  Bir El Khadem	0661 38 33 11			
3134	3	4	\N	KHALFAOUI MOKHTAR OULD EL HAMMAM	خلفاوي مخطار ولد الحمام	Commune de Sidi Ahmed W, Saida	06 61 23 46 68			
3738	1	4	\N	HADJAM ET CIE GRAND TRAVAUX PUBLICS ET HYDRAULIQUES	حجام و شريكه للاشغال الكبرى العمومية و الري	N° 03, Rue Youssefi Hacene, Oum El Bouaghi	0773 15 09 28	032 2 70 44		
3549	12	4	\N	COOPERATIVE ARTISANALE EL RIADH\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nCOOPERATIVE ARTISANALE RIADH						
3405	2	4	\N	DERKI ET CIE GRANDS TRAVAUX	 دركي و شركائه للأ شغال الكبرى	Hai Sidi Mestour    El Oued	0770 60 42 83	032 24 77 61		
4882	1	\N	\N	DIMG GRANDS TRAVAUX	دي. إي. أم. جي للأشغال الكبرى	Cité Sokra Rouisset , w.OURGLA				
4883	1	\N	\N	SARL EL ARZ CONSTRUCTION						
4401	1	\N	\N	CARRIERE ROBI OULED LAMRI	محجرة روبي أولاد العمري	Bir Aissa CNE Ain Tassara wilaya be Bourdj Bou Arreridj	035 83 73 40	035 83 73 39	ouledelamri@yahoo.fr	
5012	1	\N	\N	GM MINERAL	جي ام مينيرال	Khelfoune section 08 groupe n°15, commune de Mezloug, Sétif.		023807592		
4011	3	\N	\N	ENTREPRISE SIF SIDI AHMED	مؤسسة سيف سيدي أحمد	Rue colonnel Amirouche   El Meniaa  W.El Meniaa	029 21 27 27	029 21 27 27		
4524	3	\N	\N	SACAS		02 Rue El Maktaa, batiment Paris, Sidi Bel Abbés.	0550 13 77 47	023 80 75 92		
4852	1	4	\N	BALDATI LIL IEMAR.	بلدتي للإعمار	Cité essalam, local n°04, lot n°12, RDC, Ain Fekroune, Oum El Bouaghi	06 61 42 27 26	032 40 10 31		
4853	\N	\N	\N							
2604	1	4	\N	INTERMAT LOCATION DE MATERIELS & D'EQUIPEMENTS DIVERS	انترمات لكراء العتاد و الأجهزة المختلفة	Rue 1er Novembre n° 240 El Eulma, W.Sétif	036 47 81 81	036 47 83 83		
3490	1	4	\N	IZORANE	إيزوران	Rue Larbi Ben M'hidi, El Hadjar - ANNABA	0661 16 92 95 / 0770 92 74 96	038 89 24 84		
4940	1	\N	\N	HYDRO TRUCKS	هيدرو ترايكس	Rue 03 Draa El Aaz, Commune de Hammadi, wilaya de Boumerdes.	0559 73 36 35	023 80 75 92		
3898	5	\N	\N	EBACOM	إيباكوم	Rue Beggag Bouzid, Barak Afouradj, Cite financiére, 19 000 wilaya de Sétif	036 51 33 79	036 51 32 57	ebacom2002@yahoo.fr	
2598	1	4	\N	SITRAS / SOCIETE INDUSTRIELLE DES TRAVAUX ES SALEM	الشركة الصناعية لأشغال السلام	N° 143, Adrar 4.	072 58 36 94 / 051 03 68 56			
4508	1	\N	\N	AGHISTEN LITANKIB	اغيستن للتنقيب					
3941	11	4	\N	GROUPE SCS / SOCIETE DES CERAMIQUES DE LA SOUMMAM	مجمع أس.سي.أس الشركة الخزفية للصومام	Z.I Ihadaden  Bejaia	034 21 22 46	034 21 27 68		
4590	1	\N	\N	TAGHLAFTIST LI ZAHAB	تغلفتيست للذهب					
2966	5	44	\N	ABED MAADEN	عابد معدن	Résidence Ibn Badis Bt b n° 6 IMAMA Mansourah W, Tlemcen,	040 92 83 00	040 92 83 15		
3860	1	4	\N	ENTREPRISE TRAVAUX DE CONSTRUCTION EL FATIA	مؤسسة أشغال البناء الفتية	Zone industrielle de Oued Sly - Chlef	027 710 957	027 710 966		
3604	12	4	\N	COOPERATIVE ARTISANALE BANOU HILLAL	التعاونية الحرفية بنو هلال	Cité de la paix  N° 430  Aflou  W. Laghouat	0776 380 001			
3605	12	4	\N	COOPERATIVE ARTISANALE MERZOUG	التعاونية الحرفية مرزوق	Cité Maârouf N° 80   W. Tiaret	0770 882 483			
4470	1	\N	\N	AKANBER LITANKIB	اكنبر للتنقيب					
3116	1	4	\N	ALDTS	الجزائرية لأشغال الجنوب	BP,40 METLILI,GHARDAIA	029 82 53 37	029 82 53 37		
4693	\N	\N	\N	SOCIETE TRAVAUX DE L'EST	شركة اشغال الشرق	Centre de oued nini.	05 58 70 40 00			
1101	3	4	\N	BENHADDA ABDELMALEK DES TRAVAUX URBAINS	الأشغال الحضرية بن حدة عبد الماك	Cité El Houria - Touggourt - Ouargla	029 68 27 85			
4895	1	\N	\N	TMCA	تي أم سي أ	HAI I 5000 LGTS EL KERROUCHE BT 121 LOCAL 16KR/1218C, COMMUNE DE REGHAIA, W ALGER	05 52 37 67 83		etp.kadirit2000@gmail.com	
4896	\N	\N	\N	MESLOULA PRODUCTION DE GRAVIER						
4897	\N	\N	\N							
4898	1	\N	\N	LAND SAB	لند صاب	Local N°01, Cité 32 Logts, M’sila	035 35 72 97	035 35 72 97		
4373	3	\N	\N	FERRERO MATERIAUX DE CONSTRUCTION	فيريرو لمواد البناء	Cité El Hadhba n°16/65, Boussaada wilaya de M'sila	0699335252		sarl,tamsa,platre,bousaada@gmail,com	
3461	3	4	\N	SIDI HAMLA ENTREPRISE		Route d'Alger commune de Bousaada W. M'SILA	0770 23 57 23			
2364	11	\N	\N	EVSM & AS KA	EVSM & AS KA	Route de Dar El Beida BP 13, Sidi Moussa W. Alger\r\nBase Vie Oued Djer, El Affroun - Blida	021 76 95 29	025 38 03 69		
2849	5	4	\N	ACT / ALGERIAN CONCRETE TECHNOLOGY	ألجريان كونكرات للتكنولوجيا	ACC, 02 Impasse Ahmed Kara - Hydra W, Alger	021 54 99 69 / 021 54 99 70 / 021 54 99 71	021 54 99 66	contact@accdz.com	
4765	1	\N	\N	GLASSTONE ALGERIA	قلاص تون الجيريا	Z.I n° 67, Chelghoum Laid- Mila	031 48 16 13/0555 03 69 68 /0770 94 86 98	031 48 16 13		
4766	3	4	\N	EL HDJEL EXTRACTION ET PREPARATION DE SABLES	الحجل لاستخراج و تحضير الرمل	Cité El Bader Staih Commune de Bousaada \r\n- W M'sila	0666 93 97 39	035 40 00 79		
4652	1	\N	\N	ABAMER LI ZAHAB	ابامر للذهب					
4728	1	\N	\N	TOUFRIK	توفريق					
4980	3	4	\N	ETRHB BLIKAZ	أو.تي.أر.أش.بي بليكاز	Zone industrielle Palma N°51, B 3éme étage, Constantine.	06 61 30 38 90			
3831	1	4	\N	AKADH IMPORT EXPORT	مؤسسة عكاظ للاستيراد و التصدير	Local N°2 Route nationale n°16  Bir El Ater W,Tebessa	0661 36 62 27	038 86 19 10		
4511	1	\N	\N	AMANSLAN LITANKIB	امنسلان للتنقيب					
3587	12	4	\N	COOPERATIVE ARTISANALE OULED AHMED	التعاونية الحرفية أولاد أحمد	25, Rue Boukadda Abdelkader   Hamadia  W.Tiaret	0796 514 390			
4224	1	4	\N	FAELSA	فائلسا	Hauteurs D'Hydra, Coop 114, Secteur 49, Parcell 69, Bt B, 2éme Etage, Alger	05 55 06 03 45	029 25 55 23		
3533	3	4	\N	LOTFI TB	لطفي تي بي	Groupe de propriété N° 226, Section 04, Rue Ali Bouhedja, commune de Bir Touta, w.Alger	0661 695 428 / 0550 702 546 / 0554 627 046	023 58 42 40		
4814	1	4	\N	PRO CON COM	برو كون كوم	Cité L’hôpital B/164/35- A35B- Classe, 142G/P, 380, Djelfa	06 61 31 14 17			
4244	1	4	\N	CHEIKH LAAMOURI	الشيخ لعموري	Rue Larbi Ben m’hidi, N° 20, W, Adrar	06 62 74 77 48	049 36 30 53		
4630	1	\N	\N	TADANT LITANKIB ANI ZAHAB	تادانت للتنقيب عن الذهب					
4176	3	\N	\N	ERAHMA SABLE D'OR	الرحمة صابل دور	Local 01, Réservation D/150, Teffah 01 CN° 501, wilaya de Tiaret	0770 35 29 28 / anc 0542 92 07 10	045 75 96 72		
4916	1	4	\N	EL SALAM ZOUAOUI	السلام زواوي	Cité Kaaboub Section 07 Grp N° 402 Local n° 01 RDC, commune de Setif	0666 25 97 93		elsalamzououi@gmail.com	
4862	3	4	\N	ETPH ZAITOUT	اوتي بي اش زيطوط	Coopérative et Amel 03 lot n°12, dely brahim	0550 54 29 53 & 0779 09 45 38	/	eurletphzaitout16@gmail.com	
5002	8	4	\N	LES CARRIERES DE L'OUEST	محاجر الغرب	Rue Hagani Hamou-Sidi Lakhdar ,Wilaya de Mostaganem	045 44 72 08	045 44 72 08		
4383	\N	\N	\N							
2215	3	4	\N	ENTREPRISE CHAOUI MOHAMED	مؤسسة شــاوي محمد	Souiguer, commune de Si Abdelghani - Tiaret				
4067	1	4	\N	CARRIERE KADRI	محجرة قادري	Fesdis, Rue de Constantine W. Batna	033 80 33 90			
5011	\N	\N	\N	SARL SANBIL ESSALEM	سنابل السلام	zone industrielle n° 05 chelghoum laid w:mila	0661338665	031526284	briqueteriesss220@gmail.com	
5014	3	\N	\N	E E S NAAMA	أأأس النعامة	Section 15 Groupe n°147 El Horichaia, Commune de Naama, Wilaya de Naama.	0664 34 56 07			
5060	1	\N	\N	PC MACO		N° 24 Cité El Mouna , Constantine	0550 45 10 21	044 77 90 36		
5062	1	\N	\N	EL BADISSIA CARRIERE AIN FAKROUNE		Djeble Loussalit - Ain Fakroune - W.Oum El Bouaghi		032 40 32 76		
4906	1	4	\N	GHARBI ENTREPRISE ET ROUTIAIRES	غربي للمقاولات و الطرقات	Cité 136 logts, M’sila	06 61 34 35 34	035 35 70 14		
4907	3	\N	\N	EL HADJ SALEH POUR LE CARRIERES	الحاج صالح للمقالع	Centre-ville, Section 122, Ilot N° 42, commune de Chéria, Wilaya de Tébessa	0669 17 92 72			
4908	1	4	\N	SAIFI TRAVAUX	صيفي للأشغال	Cité Chalabi Boustil, local n°18, Collo - W, Skikda	0550438613			
4910	1	\N	\N	ENTREPRISE D'AGREGATS CHERGUI MESSAOUD	مؤسسة الحصى شرقي مسعود	Avenu BAARIR MOHAMED ELARBI N°55, commune de BISKRA	(033) 52-01-90	(033) 52-01-90		
5051	\N	\N	\N							
5000	1	4	\N	CARRIERE BENBELAT AHMED	محجرة بن بلاط احمد	Cité LAMBARKIA route de TAZOULT- BATNA	033 92 78 94	033 92 79 74 / 033 92 61 45		
4949	3	\N	\N	AL CHARIKA AL JAZAIRIA LILGHASSOUL		zone el khazen,section 13,ilot 41,ain sefra,NAAMA				
2870	11	111	\N	COJAAL / CONSORTIUM JAPONAIS POUR L'AUTOROUTE ALGERIENNE		15, Rue des Frères Benali (Ex. Parmentier) - Hydra - W.Alger	021 48 29 50	021 48 29 51		
5071	1	\N	\N	CHINA HARBOUR ALGERIE						
4777	1	\N	\N	HOURIA SERVICES		Premier Local Zone Industrielle Chot El Oued	0661 98 88 70			
3610	12	4	\N	COOPERATIVE ARTISANALE EL HANNA						
4911	1	4	\N	NECHMA AGGLOS	نشمة أقلو	Cité Oued Forcha 01, N° 148 ,commune d'Annaba - W. Annaba	0661 322 742			
4464	1	\N	\N	TIRKFINA LI TANKIB	تيركفينا للتنقيب					
2670	3	4	\N	DERKI ABDELLAH GRAND TRAVAUX	دركي عبد الله للأشغال الكبرى	Cité Sidi Mestour - W. El Oued	070 60 42 83			
4072	1	\N	\N	MOHAMED EL ADIB DIA EL KOUIF EXTRACTION DE SABLE	محمد الأديب دية الكويف لإستخراج الرمل	ERAMLIA COMMUNE D'EL KOUIF WILAYA DE TEBESSA	0661 36 18 86			
4075	\N	\N	\N	REBAA & CHIKH BLED GROUP						
4904	1	4	\N	ENTREPRSIE D'AGREGATS CHERGUI MESSAOUD	مؤسسة الحصى شرقي مسعود	Avenu BAARIR MOHAMED ELARBI N°55, commune de Biskra.	(033) 52-01-90	(033) 52-01-90		
5026	3	\N	\N	ELMERMALA ETIDJANIA	المرملة التيجانية	Lot 301, Commune de Mecheria, wilaya de Nâama	0662 87 11 40			
4815	1	4	\N	El Mordjan Marbre et Granite	المرجان للرخام والغرانيت	Mechta Ouled Mernnas 17 GR 33 Local 02 El Ouldja; wilaya de sétif.	05 61 68 44 00/06 99 99 02 02	031 45 70 88		
4816	1	\N	\N	EX SEL PRODUCTION		Cité el hayat, Classe 63, Groupes de propriètè n° 141, commune d'El Bayadh	0790 90 92 67  / 0541 04 31 75	049 71 50 87		
3947	1	4	\N	CARRIERE BENISAAD YAHIA ET ASSOCIES	محجرة بن يسعد يحي و شركاؤه	Djebel Grouz, Commune Ain Melouk, W, Mila	031 52 80 42	031 529690		
4864	1	\N	\N	AMOUDA CIMENT	أمودا للإسمنت	Cité Alioua Foudil, Lot N° 05, Chéraga, Alger.	023 305 516 &17 & 18	023 305 514	dg,secretariat@amoudaciment,com	
4865	\N	\N	\N							
4997	\N	\N	\N	MINOTERIE EL ASSAD	مطحنة الأسد	ROUTE BISKRA N°14 LOT B , COMMUNE DE BARIKA W BATNA	0661582824	036628183		
5003	1	4	\N	FARIK HADAG	شركة فريق حذاق	Cité 05 juillet 01, Ain Fekroun, Oum El Bouaghi	06 71 38 06 08	023 80 75 92		
5004	1	4	\N	MCIRDI TRAVAUX PUBLICS	مسيردي للأشغال العمومية	Cité Ben Komila, Nedroma, Wilaya de Tlemcen	0771 37 51 98			
3528	1	4	\N	INDJAZ 2004 EXPLOITATION DES CARRIERES	انجاز 2004 لاستغلال المحاجر	Rue 1er Novembre 1954, N°240  El Eulma, wilaya de Sétif	036 87 31 31	036 86 48 48		
5005	\N	\N	\N	BOUSSID GADDA IMPORT - EXPORT		Cité El Fedjer N°122 Zmala Batna	071 43 83 11			
5063	3	4	\N	EL HADJAR DAHABI LIL HIDHAB	الحجر الذهبي للهضاب	District urbain 71 Groupe de propriétés - 45 Naama	0665595935	046235092	etszaaim1@gmail.com	
5064	2	4	\N	FRERES LACHEHEB FILS MESSAOUD TRAVAUX PUBLICS HYDRAULIQUE ET CONSTRUCTION		Bouchaoui Centre GP 004, Lot 009, Local 01, Cheraga, Alger.	05 60 02 85 60.			
4869	\N	\N	\N							
1913	3	4	\N	SONNE PLATRE		Zone Industrielle Bouchakeur - Laghouat	029 92 13 14\n029 93 54 45	029 93 23 74		
4905	1	4	\N	GOLD SALMI	قولد سالمي	Cité Hassi Amar Local n° 01 Ilot 52, Section 70 - Tindouf	0661 27 83 22 / 0660 07 88 55		mahdjoubsalmi@gmail.com	
4580	1	\N	\N	TIMCHI LITANKIB ANI ZAHAB	تيمشي للتنقيب عن الذهب					
4969	1	4	\N	KMECA	بوداود سيد احمد	Rue de l’indépendance, theniet el had, Tissemsilt	05 52 50 28 65	046 48 55 06		
4968	3	\N	\N	ETP BELLE VUE	مؤسسة الأشغال العمومية المنظر الجميل	N°16, Bordj, Local 01 commune d’Aimeur, Tlemcen	05 51 49 46 01	043 28 64 82		
4871	1	4	\N	FMCO	مصنع مواد البناء	Ilot, Zone Industrielle Hassi Ameur, Cn Hassi Bounif, Oran.	041 52 46 12	041 52 46 70		
4918	3	4	\N	MABIDI FRUITS	مابيدي فروي	43 Rue El Haj Abdessamad Laverdure Bazar Abd Essalam 4 eme Etage Bureau N° E03- commune de Batna, W. Batna	0540 116 911	033 80 31 85		
4863	1	\N	\N	GLOBALES TECHNOLOGIES SERVICES						
3647	3	4	\N	CHEPSA	سي.اش.او.بي.اس.آ	Cité 76/78 logts, Cité Rym, Bat 02 Local 44 - Annaba	0553 45 93 16	038 83 16 63		
5032	1	4	\N	BOURDIM CONCASS	بورديم كونكاس	Local N°01 Cité Houari Boumediene – Coopérative N° 77 Lot N° 232 Commune de Boussaâda -W. Msila	0673 38 30 92 – 0770 71 65 59	035 44 64 90		
5023	1	4	\N	AL MOTAHIDA DE SEL ALIMENTAIRE ET INDUSTRIEL	المتحدة للملح الغدائي و الصناعي	Cité Mohammed Boudiaf El Hamraia, W, El Oued	0550 45 75 03			
4532	3	\N	\N	GBS ROUTE	جي.بي.أس الطريق	Lotissement TEFAH 03, Route d'Alger, Wilaya de Tiaret.	0661 23 08 76			
4249	1	4	\N	E R T P C	أو.أر.تي.بي.سي	Cité Garidi   II   Bt  84  N° 01  Kouba      Alger	021 54 31 61	021 56 13 01		
4322	1	\N	\N	TOUFIK TRANSFORMATION DE METAUX	توفيق لتحويل المعادن	Lot n° 35 ZONE INDUSTRIELLE KECHIDA    batna	0661 12 97 04	033 22 36 37/45		
3644	1	4	\N	BRIQZEL	بريكزال	Zone industrielle    lot   n° 180    Dar El Beida     ALGER	0555 02 50 91	021 75 37 50		
1956	3	4	\N	CARRIERE BOUSSAID MOHAMED	محجرة بوسعيد محمد	Djebel Tarbent - Commune Ain Yagout - W.Batna				
4867	1	\N	\N	GLOBALES TECHNOLOGIES SERVICES						
4868	1	\N	\N	GLOBALES TECHNOLOGIES SERVICES						
4985	\N	\N	\N	FRERES SALHI PLUS	شركة التضامن الإخوة صالحي بلوس	CENTRE COMMUNE AMOUCHA WILAYA SETIF	0661353998	036743048		
5081	1	4	\N	CARRIERE ALPHA ROCHE	محجرة الفا روش	Ain El Bey -Bt B 01 -Lot N°51 -Rez de chaussé Ali Mendjeli.Constantine.	0661 33 83 28			
5082	1	\N	\N	SOUFIENE PRODUCTION DE SABLE		Cité Oued Enakes route de Constantine local N° 11 TEBESSA	06 69 31 45 32			
5008	\N	\N	\N	SANABIL ESSALEM	سنابل السلام	ZONE INDUSTRIELLE N° 05 CHELGHOUM LAID W, MILA	0661338665	031526284	briqueteriesss220@gmail.COM	
5084	3	\N	\N	MAYS CONSTRUCTION	ميس للبناء	HAI KHATIR ABDELKADER, Batiment 11, porte 04, Commune et Wilaya de SAIDA	0666162511/0550536238			
5085	1	\N	\N	 BEST GRAVEL QUARRY						
5086	3	\N	\N	LFMSK	ال.اف.ام.اس.كا	cité elmodjahidine berriane, ghardaia				
4982	1	\N	\N	GIRE GRARA						
4983	1	\N	\N	GIRE GRARA						
4370	1	\N	\N	BRIQUETERIE OTHMANI ET FRERES	مصنع الأجر عثماني و أخوته	El Hassass El Hissa, n°19 Khems 17, Cne de Treat, Annaba	038 83 23 66	038 83 23 13		
4371	\N	\N	\N							
4372	\N	\N	\N							
4570	1	\N	\N	TOUKMATINE	توكماتين					
5118	1	\N	\N	CARSAB	كرصاب					
5065	2	4	\N	FRERES LECHEHEB FILS MESSAOUD TRAVAUX PUBLICS HYDRAULIQUES ET CONSTRUCTION	الإخوة لشهب أبناء مسعود للأشغال العمومية والري والبناء	Bouchaoui Centre GP 004, Lot 009, Local 01, Cheraga, Alger.	05 60 02 85 60.			
4912	1	4	\N	EL MAZAR ENTREPRISES	المزار للمقاولات	Cité Sahine El Thani (El Horya), commune         d'El Oued - W. EL OUED	0555 803 816		miloudi.laid@gmail.com	
3805	1	4	\N	CARRIERE OUHOD	محجرة أحد	Zone Industrielle, route de constantine, commune de Ain M'lila - Oum El Bouaghi,	0770 97 79 05	031 96 89 57		
4589	1	\N	\N	TISTKA LILBAHT WA TANKIB ANI ZAHAB	تيستكا للبحث و التنقيب عن الذهب					
4491	1	\N	\N	TAGHTEST LI TANKIB	تاغتست للتنقيب					
4382	1	\N	\N	NOUR	النور	Cité 11 Décembre 1960  RDC   n° 40   Dely brAHIM	0661 56 02 46	021 34 12 62		
4999	1	4	\N	HIOUR TRAVAUX PUBLICS	حيور ثرافو بيبليك	Cité des plages Bt 04 Commune de Jijel Wilaya de Jijel	0661 33 24 75	031 42 91 32		
4120	3	\N	\N	KACEM EXPLOITATION DES CARRIERES		Centre ville bloc 05 n° 113 Messaad, Djelfa	0770 538 305			
4499	1	\N	\N	INGAZAN LITANKIB	انقازن لتنقيب					
4500	1	\N	\N	TENFRENT LITAKIB	تنفرنت للتنقيب					
4501	1	\N	\N	TINLALEN LITANKIB	تين لالن للتنقيب					
4502	1	\N	\N	INMHETEK LITANKIB	 اينمهرتك للتنقيب					
4503	1	\N	\N	SOCIETE ITEKAN	شركة ايتقن					
4504	1	\N	\N	ASSAKRAM LITANKIB	اسقمار للتنقيب					
3659	12	4	\N	COOPERATIVE ARTISANALE MARMALETTE SELSABIL	التعاونية الحرفية مرملة سلسبيل	BP 80   28150 MAGRA W,M'SILA	0661694719			
3924	1	4	\N	SAIB ENAFAA AGREGATS	الصيب النافع للحصى	Cité 17 Octobre, Rue AD, N31 Bordj Bou Arreridj	05 60 35 76 12			
4975	3	\N	\N	ANES CARBOCAL		Rue des aures, Quartier stand N°82, w BATNA	0661 34 51 52	033 80 32 52		
4116	3	4	\N	NEDJAH AMMAR	نجاح عمار	Lotissement Centre culturel Lot N°11, Commune de Mechroha, wilaya de Souk Ahras.	0661 39 10 68 / 037 85 62 59	037 85 62 59		
4899	1	4	\N	AIN DALIA MARBRE ET GRANIT	عين الدالية للرخام والقرانيت	Zone Industrielle Oued El Berdi	0555 00 24 01	023807592		
4903	1	4	\N	BRIQUETERIE OULED NAIL	مصنع الآجر أولاد نايل	Kasem 81 Groupement Propriétaires n° 28, El Outaya, Biskra	033 65 95 76	033 65 95 76	zianimed@wissal.dz	
4996	\N	\N	\N	KDC AGREGAT	ك د سي أقريقا	CITE GAOUA 50 LSP 29 LC BT E ENTREE 66 RC SETIF	0550465112	036514261		
4979	3	\N	\N	DOLOMITE SALIM BENHADJ		Zone d'activité Ouled Smain, Telaghma, w MILA	0770 32 13 09			
4172	1	\N	\N	Société Djedei Abdelkader fabrication de briques	شركة جديع عبد القادر لصناعة الاجور	Rue El Remal n°1, Touggourt, Ouargla	0555 072 238			
5072	1	4	\N	SIRAT EL HOUDA	صراط الهدى	6éme étape, ilot 98, section 98, N 107, Commune Adrar, Wilaya Adrar			lagsir0180@gmail,com	
4950	1	4	\N	AGOUN EXTRACTION  GRAVIER ET SABLE	عقون لاستخراج الحصى و الرمل	Djebel Lagroun, Sigus, Oum El Bouaghi,	05 56 716 459	037 765 549		
4917	3	4	\N	CALIBRATION ET METROLOGIE ALGERIE	كاليبراسيون إي ميترولوجي ألجيري	CITE EL REMALE PREMIERE ETAGE SECTION 084 GROUPE DE PROPREIETE N°446 EL OUED	0770864349	023863603	dgcm.metrologie@gmail.com	
5039	1	\N	\N	MS EL ISRAA						
5040	3	\N	\N	EGTPH NOUIS AMOR		Coopérative immobiliere ECHAHID BOUSSETA zone N°12 Commune de BISKRA	0661 37 45 92		nouisamor@gmail.com	
393	3	4	\N	KMECA	كميكا	Rue d'indépendance n°160 commune Theiet Elhad.	0552 50 28 65	046 48 55 06		
4967	3	191	\N	ADWAN CHEMICAL COMPANY	شركة عدوان للكيماويات	Lottissement N°02 et 03, Zone Industrielle, Fernaka	043 60 48 38	043 60 48 38	bouhadjar.bailiche@caramail.com	
4984	\N	\N	\N	GIRE GRARA						
1280	2	4	\N	IDRISS DES ASSOCIES BOUDJEMA MOURAKEB & SALAH BOUTOUTA	الشركاء بوجمعة مراكب و صالح بوتوتة "إدريس"	20, Rue Samai Hocine - Cité Kouicem - (41000) W.Souk -Ahras	061 39 00 26			
5007	\N	\N	\N	SABLE D'ORAN	ش ذ م م رمال وهران	CIHE MOAMED KHMISTI R2SIDENCE ESSALEM N°07 ORAN	0550818914	023807592	Mi-casa31@hotmail.com	
5073	1	\N	\N	GROUPE COMMERCIAL DJEN DJEN		D6,Rue Brighen Amar Ouled Souissi,Tahar-Jijel	0550507787		boukafhocine@gmail.com	
4629	1	\N	\N	AKAKOUS LITENKIB ANI ZAHAB	اكاكوس للتنقيب عن الذهب					
5052	\N	\N	\N	LES MINERAUX D'ALGERIE						
4112	5	\N	\N	ECO S EST		Zone Industrielle Route Ghardaia commune de Ouargla	025 61 01 76	025 61 01 62		
4808	1	\N	\N	SABA GLASS		Zone industrielle N° 48, Commune : Chelghoum Laid, w   Mila	031.45.70.88 / 07.98.19.09.62	031.45.70.88		
4123	1	\N	\N	BRIQUETERIE GUANOUBA		MEGGARINE, COMMUNE DE MEGGARINE, OUARGLA	0770 96 16 27	029 68 88 98		
2636	1	4	\N	AL.CO GAZ	الكو غاز	Cité Mekhadma, Bp° 340, wilaya de Ouragla	029 29 66 66/0550 96 90 15	029 29 65 82		
4901	1	4	\N	SOUIPANEL	سويبنال	Zone Industrielle commune de sidi khattab	046802921&22	046802919	sarl_souipanel@hotmail.fr	
5056	1	\N	\N	GLOBAL SALMI	قلوبال سالمي	LOCAL N° 01 CITE ANNASR SECTION 28 GROUPE PRIVE N° 579 COMMUNE DE TINDOUF	0671 89 86 57		selmmididi@gmail,com	
5057	1	4	\N	AWLAD SALAMA	أولاد سلامة	local N°12 cité el kassabi section 14 groupe privé N°15, Cne de Tindouf				
5058	1	4	\N	TILATOU CARRIERE	تيلاطو كاريار	Cité Stand rue l'Aurés n°82 GR 110 SEC 206 Local 02, W, Batna	0661345152	044779036		
3912	1	\N	\N	BRIQUETERIE KSAL	مصنع الأجر كسال	Rue de l'avocat Ayed, Classe n°13, Groupe de propriété n°137, commue et wilaya d'El Bayadh.	0661 12 95 96/0770 12 95 96	029 67 12 74/029 67 31 67		
3580	12	4	\N	MARMALETTE EL ARCH	مرملة العرش	Route de Djelfa   Bousaâda  W. M'sila	0772 631 727			
1066	1	4	\N	ALGCAAR	ألج كار	Lot C  N° 17 Garidi, Commune de Kouba - W. Alger	021 73 33 91/061560207/061500207	021 73 33 91		
5033	1	4	\N	CARRIERE CASAB SILI		Local n°01 cité Sidi Boughoufalla-Beni Thour, Ouargla.	0660 94 10 45	029 76 78 87		
5017	3	\N	\N	EL HADI CARRIERE	الهادي كريار	HAI FILLE BELKHALEL DES JARDINS N° 139 BT 04/4045 LOT 193, COMMUNE DE DJELFA W DJRLFA	0770 40 64 20 / 0560 97 73 77			
5018	1	\N	\N	ROUA TRAVAUX						
5019	3	\N	\N	TAMOUKAST AYATMA		CITE ANDHADHANE COMMUNE DE TIN ZOUATINE W IN GUEZZAM	0669 18 33 39	029 30 02 56	eurltamoukayatma2023@gmail.com	
5021	3	\N	\N	GROUPE ELSSALAM						
1148	1	4	\N	CARRIERE MOUACI & FRERES		Cité Belbali Ahmed n° 08 - Timimoun - W.Adrar	061 54 63 37			
4668	1	\N	\N	AZENKET LI ZAHAB	ازنكت للذهب					
3732	5	4	\N	ALVER / SOCIETE ALGERIENNE DE VERRES	الشركة الجزائرية للزجاج	Avenue des martyrs de la révolution, Commune d'es-sénia, W, Oran	041 42 96 12	041 42 96 17		
3913	1	4	\N	SIT CERAM	سيت سيرام	Lotissement de la coopérative immobilière n°09, El Binaa n°09, commune d'Eulma, w SETIF	036 87 67 67/036 87 68 68	036 87 65 65		
4007	1	4	\N	BIG ROAD	بيغ راود	Lot N° 01 Cité El Zine El Hadjira Touggourt	05 50 47 15 89.			
3731	1	4	\N	MEZIANE TRAVAUX ROUTIERS	مزيان لأشغال الطرق	Bouzeguene Centre, W. Tizi Ouzou.	0554 120 933	036 74 30 48		
4021	1	\N	\N	GUEBEL BOUGUEFER DES SABLES	قابل بوقافر للرمل	Bouchebka, Commune d'El Houidjebet, wilaya de Tébessa	0669 31 45 32 / 0661 25 20 36	037 48 06 00		
5009	1	\N	\N	SANABIL ESSALEM	سنابل السلام	ZONE INDUSTRIELLE N°05 CHELGHOUM LAID W MILA	0661338665	031526284	briquequeteriesss220@gmailKcom	
5027	1	\N	\N	AZMIL COMPANY	أزميل كومباني	Lot Ennour, Local n°01, RDC Lot n°18, Wilaya d'Oum El Bouaghi	0660 49 12 52		laifaouimed@gmail.com	
5028	5	\N	\N	COSIDER TRAVAUX PUBLICS		Cité Clement ville de Mohammadia Alger	023 75 11 42	023 75 11 41		
5029	1	\N	\N	TROIS S ETUDE ET REALISATION BTPH	ثلاثة س دراسة وانجاز	Said Hamdine, 384 Logements Bt A 12, Bir Mourad Raïs, wilaya d'Alger	0540 59 94 98			
4989	\N	\N	\N	AR SATAFIS	أ ر سيتيفس	CITE MAABOUDA LOTISSEMENT COOP ELDJAZAIR LOT 09 SECTION 197 ILOT 34 SETIF	0550998700	036743048		
4990	\N	\N	\N	CARRIERE DJEBEL EL DEKHLA						
4872	1	4	\N	GRANIOSSAF TFA	قرانيو صاف ت.ف.ع	Coopérative immobilière, Ennadjah, Zone 09, Mascara	045815150 - 045812648	045811572		
4873	1	\N	\N	TINDOUMDA LITANKIB AN ZAHAB						
4874	1	\N	\N	TIN DOUMDA LITANKIB AN ZAHAB						
5010	\N	\N	\N	SANABIL ESSALEM	سنابل السلام	ZONE INDUSTRIELLE N°05,CHELGHOUM LAID W :MILA	0661338685	031526284	briqueteriesss220@gmail.COM	
3951	10	4	\N	ECC/ANP	المؤسسة المركزية للبناء للجيش الوطني الشعبي	Route de Chebli-Baba Ali, Commune de Bir Touta, wilaya d'Alger	0661 59 00 46	021 30 92 23/ 021 30 99 86		
4528	3	\N	\N	HADDAK IMPORT EXPORT	حداق استيراد والتصدير	VILLA N° 04 RUE MOUSSA HAMADOUCHE HASSAN BADI BELFORT ELHARRACH -W-ALGER	021 829 528	021 829 528		
2427	5	4	\N	BATIGEC TRAVAUX PUBLICS	باتيجاك للأشغال العمومية	Zone Industrielle Oued Smar, BP 67 - Alger 16270	021 51 34 57	021 51 34 62	batigec.tp@wissal.dz	www.batigec-tp.dz#http://www.batigec-tp.dz#
5054	3	\N	\N	AID MINE SERVICING	عيد مين سرفيسينغ	CITE SAIDAT, MEKHADMA, OUARGLA ALGERIE	0770 50 50 84			
5055	1	\N	\N	NMTP TRAVAUX	أن أم تي بي للأشغال	Cité Khadra Mekhadma - Ouargla	0660436176			
4854	1	4	\N	NADAGRI	ناداقري	Local 34, nouvelle route de djelfa; zone urbaine 25 lots, lot 22, Bousaada, M'sila	07 70 78 32 38			
4875	1	4	\N	TRANELECT ALGERIE	ترانس الكت الجيري	Cité El Hofra, ville de Tamanrasset Wilya de Tamanrasset	0550528801	023507365		
5025	3	\N	\N	SOTRADIB						
4998	1	4	\N	MIN MAS EL HASSA	مين ماس الحصى	Route de Saida, Local N°02, Ghris, Mascara	07 70 34 51 19			
4803	\N	\N	\N							
3535	1	4	\N	ZAS STATION D'ENROBAGE	زاس محطة تزفيت	Domaine Belbabouche - Bordj Bou Arreridj	035 68 18 76/0661 59 47 81	035 68 18 76		
4981	3	\N	\N	AALI EL BIHAR		Hamraia w El Oued,	0550 46 73 75	032 28 32 42		
5001	\N	\N	\N							
5035	1	4	\N	CARRIERE CASAB SILI	محجرة كساب سيلي	Local n°01 cité Sidi Boughoufalla-Beni Thour, Ouargla.	0660 94 10 45	029 76 78 87		
5036	3	\N	\N	ICHOUL TRAVAUX PUBLICS						
5075	1	\N	\N	LA ROCHE MEZARA	لمزارة للحصى	LOTISEMENT 08 MAI 1945 (65 Lots); partie 286 gr n°06,SETIF	0554505050			
5076	2	\N	\N	NOUARI GUICHICHE ET ASSOCIES						
5077	1	4	\N	BRIQUETERIE HACHACHTA	مصنع الأجر حشاشطة	Hachachta Ammour Section 04 ilot 18-20-23 Sidi Ali mostaganem	0671644925	045202274		
5078	\N	\N	\N	CARRIERE EL HANA		Oued El Aneb -Berrahal-  W.Annaba	061 63 04 24			
5079	1	4	\N	CARRIERE EL HANA	محجرة الهناء	Commune d'Oues El Aneb, Berrahal, ANNABA	0561-32-00-38			
5080	1	4	\N	CARRIERE EL HANA	محجرة الهناء	Commune d'Oued El Aneb, Berrahal ANNABA	0561-32-00-38			
3531	3	4	\N	HEDID ETPH	حديد للأشغال العمومية و الري	Route de Zoui     Khenchela	0661 34 67 95	032 31 24 24		
4678	1	4	\N	ACOSCO	أكوسكو	BP N° 171 Commune Ain Aménas.	029 45 97 22	029 45 97 24		
4818	\N	\N	\N	DJA ET BOU TRAVAUX PUBLIC	جا و بو للأشغال العمومية	Cité 150 lot C2 AS 2B, N°92 Groupe 12 El Eulma, Sétif	036 47 83 96			
3501	12	4	\N	COOPERATIVE ARTISANALE ESSALAM	تعاونية حرفية السلام	Cité El Badr Rue 18 Avril, Ksar Chellala, W, Tiaret	07 71 50 37 51			
3260	1	4	\N	PIERRES ASSAM	حجر الصام	Cité 5 Juillet Ain Melouk wilaya de Mila	0550 37 64 20	031 52 93 27		
4809	1	\N	\N	SARL KOUIDER SEL	شركة قويدر للملح	Projet 1408/2038 Logts RDC N° 616 A Bloc 39 \r\nBab Ezzouar (Alger)	021 24 67 18			
4140	1	\N	\N	EL ACIL PRODUCTION INDUSTRIELLE	الأصيل للإنتاج الصناعي	Local 02, Oum Ali, wilaya de Tébessa	0661 36 79 23			
1051	3	4	\N	SECASAB		52, Cité Nord - Miliana BP 43 - W. Ain Defla	027 64 78 75\n027 64 92 99	027 64 99 75		
4484	1	\N	\N	TIMDJELDJINE LI TANKIB	تيمجلجين للتنقيب					
5030	1	\N	\N	BRIQUETERIE SOUF	بريكتري سوف	Cité Tekssebt, El Oued, Wilaya d'El Oued.	032 10 40 02	032 10 40 02		
5031	3	\N	\N	EL HODIBIYA COMMERCE ET INVESTISSEMENT	الحديبية للتجارة والاستثمار					
4571	1	\N	\N	ELBARIK LIKHEDEMAT ELMENDJAMIA	البريق للخدمات المنجمية					
4804	1	\N	\N	KOTBIA TRAVAUX HYDRAULIQUE et TRAVAUX PUBLICS		08, Rue Cdt Djaber, Commune Tlemcen, W. TLEMCAN	0555 495 423	043 26 45 23		
4991	\N	\N	\N	CARRIERE DJBEL ELDEKHLA	محجرة جبل الدخلة	A7 LOTISSEMENT EL-ABTAL 252 LOT . BEN BADIS-CONSTANTINE	0550475092	031765151		
3994	3	\N	\N	DJELLOUL SAID des travaux de Bâtiments	جلول السعيد لأشغال البناء	Cité El Wafa N°186, Souk Naamane, wilaya de Oum El Bouaghi	0661 37 80 95	032 44 40 18		
4973	1	4	\N	CARRIERE KEROUANI ABDELLAH	محجرة كرواني عبد االله	Rue Rekhaif Ali, Lot 261, Groupe 06, Sétif.	06 60 36 57 35	036 93 98 30		
4052	\N	\N	\N	CARRIERE DE SABLE ETTEBESSI	مقلع التبسي للرمل	Lotissement El Hayet Local n°01 Oum Ali W.Tebessa	0668 93 62 25			
3161	1	4	\N	AMG LOC	أ.أم. جي لوك	02 Rue SETIF, Mohamadia,W, ALGER	021 82 67 91	021 82 67 91		
4525	1	\N	\N	12						
4177	1	\N	\N	TUFEAL		Centre commercial Yennayer 94, Immeuble n°6, Rue des frères Belhadj, Tizi ouzou	0550 58 55 35	026 11 61 05		
5006	\N	\N	\N	BOUSSID GADDA IMPORT-EXPORT	بوصيد قادة للاستيراد و التصدير	N°130 CITE EL-BOUSTENE BATNA	0670151602	033815567		
4245	1	4	\N	EL HADABA EL GHARBIA	الهضبة الغربية	Lotissement N° 40, Bt 01 Entré N°05, Mecheria, Naâma	05 53 85 91 26	043 27 06 27		
5022	1	\N	\N	GAMMA SERVICES		Cit2 chabani N°55	0550 58 18 61		iyadalea@gmail,com	
5024	1	\N	\N	ETRAMC						
4974	1	4	\N	EL DEY CARRIERE	الداي للمحاجر	Cité 221 Lots, Oued Athmania, Mila	05 50 02 60 04	031 43 50 19		
4970	5	\N	\N	CIMET		07 Route de la Zouaoua, Cheraga - Alger	023224200	023224203	info@cimet.dz	
4971	\N	\N	\N							
5041	3	4	\N	CARRIERE AYADI	محجرة عيادي	Lotissement la prmière renaissance, Oum El Bouaghi	06 61 59 86 92	032 47 61 56		
4404	1	\N	\N	CARRIERE EST EL MATINE	محجرة الشرق المـتين	20 logts LSP, Bt 01 Bl 02, N°15, El Fedjoudj, Guelma	05 51 14 82 88			
4866	3	\N	\N	ROULER SABLE	رولي صابل	Cité Errimal-Touggourt, W- Touggourt	0541 64 67 44			
4584	1	\N	\N	ITHARENE LI ZAHAB	ايضارن للذهب					
4585	1	\N	\N	SMEGHMEGH LI ZAHAB	اسمغمغ للذهب					
5066	1	4	\N	KHADRAOUI EQUIPEMENTS INDUSTRIELS	خضراوي للتجهيزات الصناعية	Coopérative Al Nasr, Cité des jardins, Ras El Oued,Wilaya de Bordj Bou Arreridj	0550206822	044779036		
5067	\N	\N	\N	AUMALE AGREGATS		Cite des 142 logements , Sour El Ghozlane\r\nwilaya de Bouira	0556 023 305	027 515 366		
3226	1	4	\N	LAMBARKIA PROMOTION IMMOBILIERE	لمباركية الترقية العقارية	N° 32 LES ALLEES, SALAH NAZAR, W, BATNA	033 86 45 45	033 86 24 24		
4795	1	4	\N	GRANDE TRANSFORMATION CARBONATE GTC	قروند ترونسفورماسيون كاربونات جي تي سي	Zone d'activité la commune de Touggourt Wilaya de Touggourt.	0661 38 00 48			
3698	3	4	\N	MINVEST	مان فاست	06, Rue de Grenoble, 3ème étage - W.Oran	0661 21 06 71			
4569	1	\N	\N	BOURKAN LI ZAHEB	بركان للذهب					
5087	1	\N	\N	NOURSEL		Cité Chouhada, BP 111 , El Oued	032144242	032144243	sarlnoursel@gmail.com	
5091	1	\N	\N	FAHD OTMAN	فهد عثمان	Cité logements Bt n°02, RDC - Douera - Alger	0770 37 57 00X	X	aochettesamir64@gmail,com	
5092	1	\N	\N	SABLIERE ET CARRIERE KOBRA		Hai Bensouna Batiment C 04 , CHLEF	0770185102			
5093	3	\N	\N	MANSOURI LA PIERRE DOR DEBAGH			0770881955			
5094	\N	\N	\N	HORIZON CEMMEX						
5095	3	\N	\N	GROUPE TRAVAUX GUERGAR GTG	مجموعة اشغال قرقار جي تي جي	Rue du 1 ére Novembre/Si Haoues/Wilaya de Tiaret	05 61 69 70 68			
5096	1	4	\N	ESSALAM GUELLOU	السلام قلو					
5097	1	4	\N	CHETHOUNA TRAVAUX PUBLIC	شتحونة للأشغال العمومية	Place El Souk, Commune de l’Oued	0558 17 67 68	023 80 75 92		
5098	1	4	\N	CARRIERE YACINE	محجرة ياسين	Local N°01, Ain Defla, Chetouane, Tlemcen	06 61 44 61 43.			
5099	1	\N	\N	EL KBIR TERAS	الكبير تيراس	Cité Ben Hachlef RDCn Commune de Bouzegza-Keddara wilaya de Boumerdes	0550 39 28 58			
5100	3	\N	\N	PEKYOL						
5101	2	\N	\N	FRERES DIB METAUX		ZI El Tarf N° 113 Local 01 Ouled Rahmoune El Khroub Constantine	0661 30 11 29	023 80 75 92		
5102	1	4	\N	ZED EL WAHA		Cité Ain El Beida, Commune Ain El Beida.\r\n w Ouargla				
5103	\N	\N	\N							
5105	3	4	\N	AFAF TRAVAUX PUBLICS ET HYDRAULIQUE ET TCE	عفاف اشغال العمومية الري وكل هياكل الدولة	Cité dar el beida, bloc n°27, Oran	05 60 98 53 12			
5106	1	4	\N	SASD	الحصى و الرمل دباغ صاسد	Douar beni adi, Commune hammam debagh, Guelma	023 46 80 71	023 46 80 71		
5107	\N	\N	\N	SGA						
5108	5	4	\N	SOCIETE DES GRANULATS D'ALGERIE / SGA	سوسيتي دي قرانيلا دالجيري أس جي أ	Route de Dar El Beida, Meftah- W. Blida.	025 10 02 60	025 10 02 61		
5117	1	\N	\N	AGGREGATES MINE						
5109	1	4	\N	ALGEROCHE	الجزائر صخر	Ben ayad Port N°22 Aougrout, Timimoune.	0660 19 10 24 / 0660 71 52 93	041 46 43 62		
5111	3	4	\N	LABORATOIRE GEOTECHNIQUE DE CONSTRUCTION ET ROUTES		Cié 01 Novembre, El Oued, El Oued				
3389	1	4	\N	FLECHE BLEU	النشاب الأزرق	Cité des 100 logements, Bloc HN 03, Route de l'hopital - Tissemssilt	0661 48 85 01/0770 69 75 31	046 47 88 51		
4117	1	4	\N	SAELFA	ساءلفا	Hauteurs D'hydra, Coop 114, Secteur 49, parcell 69, BT B 2ème étage, Alger	05 55 06 03 45			
4810	1	\N	\N	STE FRERES GANA TPHB	شركة الإخوة قانة للأشغال العمومية و الري	RN N° 24 Alliliguia (BOUMERDES)	024 79 94 86	024 79 94 85		
4811	1	\N	\N	EL HACHIMI ET FILS ROUTES	ش ذ م م الهاشمي و أبنائه للطرقات	Zone d'activité Lot N° 105 (Ouargla)	0 662 170 540/ 0 660 454 570			
4812	2	4	\N	EL IKHWA ALITI WA CHORAKAIHIM	الإخوة عليطي وشركائهم	Boulevard de l’ALN, route nationale N°09, amoucha, sétif	036 71 67 77	036 71 67 15		
3553	12	4	\N	COOPERATIVE ARTISANALE OULED BOUZIANE	التعاونية الحرفية أولاد بوزيان	Commune de Dahmouni  W. Tiaret	0773 783 343			
5083	1	4	\N	SADOUKI		Hai Chahid Malek, Local 01 Tireny, Beni Hediel - W. Tlemcen	050 53 30 53		medseddouki1990@gmail.com	
5016	3	\N	\N	BOUSSEKAR	بوسكار	LOT COLONEL MOHAMED CHABANI (LOTS 28) COMMUNE CHETMA , W-BISKRA	0661372727	033516186	eurl.boussekar@gmail.com	
4922	2	4	\N	GUENDOUZ RABAH ET CIE	قندوز رابح و شركائه	Tizi N'brahem Centre, commune de Tala Ifacene - Setif	0770 19 48 59 / 0670 15 84 27	036 78 12 07		
4111	1	4	\N	El  DJANOUB	الجنوب	BP 51     Brézina         El Bayadh	049 61 15 65	049 61 15 44		
4617	1	\N	\N	AGHOUCHAF LITANKIB ANI ZAHAB	اغوشاف  للتنقيب عن الذهب					
3872	1	4	\N	ENTREPRISE ABROUS	شركة عبروس	Cité Essalam, n° 56 - Chlef	027 72 11 43	027 72 11 43		
4986	\N	\N	\N	SOCOPE CARRIERE	ش ذ م م سكوب كاريار	BP 1083 ,BOULEVARD DES 24 METRES,SIDI BOUSHAK,TLEMCEN	043273939	021205120		
4870	\N	\N	\N	SARL GLOBALES TECHNOLOGIES SERVICES		Cité El Houria, Bir El Ater, Wilaya de Tébessa	0660 34 03 11 - 0661 44 39 27			
5068	\N	\N	\N		أومال أقريقا					
5069	\N	\N	\N	AUMALE AGREGATS		Cite des 142 logements , Sour El Ghozlane\r\nwilaya de Bouira	0556 023 305	027 515 366		
5070	1	\N	\N	PADEN DEUXIEME	بادن الثانية	Rue du 01 Mai Séction 03 , Groupe N 43 Commune de NAAMA	0770 92 84 46	049 59 51 50	sarlissaaditoufikinvest@yahoo,com	
4978	1	4	\N	CAMINS	كامينس	Hai El Amir, Rue Thiers, N°02, 1 er étage, Oran.	0658 54 00 45	041 36 15 92		
4920	3	\N	\N	FREEDOM LILISTITHMAR	فريدوم للاستثمار	Centre-ville Lot 86(07+97) Locale N°01, commune d'Ain Khadra - M'sila	0669 378 310		eurlfreedom@gmail.com	
4913	1	\N	\N	MAK OLIVE DES AGREGATS	ماك أوليف للحصى	Rue El Amir AEK N° 105, Groupement 34, Local N°6, Tébessa	06 61 36 75 09	037 59 17 99		
4914	2	\N	\N	SOLTANI HACHEMI WA CHARIKOUH	سلطاني هشمي و شريكه	Rue Harzoune Mokhtar, Cité Hachemi 1er Tranche, N°134, Ilot 55, Sétif	05 53 27 48 60			
4902	1	\N	\N	SUD MAN	سودمان	Village Thala Khelil, commune de Beni Douala, wilaya de Tizi Ouzou.	0550 45 94 51		mananamohamed78@gmail,com	
3961	1	4	\N	Société de Matériaux de Construction SADJIA	شركة مواد البناء ساجية	Mezaourou, commune de Souahlia, Ghazaouet W. Tlemcen.	0561 61 61 03			
4223	3	4	\N	MEDJROUB ALI	مجروب علي	Cité 42 Logts, Bouinan, Blida		025 39 47 92		
4618	1	\N	\N	TAHBOURT LITANKIB	تهبورت للتنقيب					
5042	1	4	\N	BENYAHIA CARRIERE	شركة بن يحي محجرة	CITE TAMCHIT EN FACE 1272 LOGTS, BATNA	0770 44 68 42	033 28 68 31		
3236	3	4	\N	CARRIERE AOUIS	محجرة أويس	Commune De Ain Dzarit W, Tiaret	0661 55 17 59			
4802	3	4	\N	ELECSAM	إليكسام	Hai el badr, Ilot 51 section 12, Tindouf	06 60 45 99 55		elecsam.9@gmail.com	
5053	1	\N	\N	BBG BRIQUETERIE	بي بي جي بريكتري	Cité Sili- Coopérative Med Boudiaf n° 31 Hydra - Alger	0661 32 18 18			
4247	3	\N	\N	OULED EL HADJ ENTREPRISE SERVICE		Cité EMIR ABDELKADER EL HADJIRA OUARGLA	06600 39 70 07 / 0550 52 68 06	029 61 30 66		
4616	1	\N	\N	AKZAL LI ZAHAB	اقزل للذهب					
4987	\N	\N	\N	LARA AGRIGA	 لرا أقريقا	RUE REHLA TAYEB ,GROUPE DE PROPRIETE N°01 PARCELLE N°116-TIARET COMMUNE DE TIARET	0659639522-0542084433			
4568	1	\N	\N	SIKI AGHRES LI ZAHAB	سيكي اغرس  للذهب					
4069	1	4	\N	ENTREPRISE PIVOT ENGENEERING ET GENERAL CONTRAC	مؤسسة المحور الهندسة للمقاومات العامة	Cité Bouameur Maamourah, Laghouat	05 55 96 45 44	029 92 92 53		
4360	\N	\N	\N							
2637	1	4	\N	EL WATANIA TRANS	الوطنية ترانس	Touidjine , commune de Mnegueur W-Touggourt	0559 05 88 73	024 94 76 51		
4817	1	4	\N	BRIQUETERIE EN NOUR	مصنع الاجر النور	El Kalaa supérieur BP 536 Remchi-Tlemcen.	0661 22 15 28			
4915	1	\N	\N	ETTPMA	أو.تي.تي.بي.أم.أ	21, Rue ben dahmane mohamed, hai el magtaa, Oran	05 50 73 6701	023 26 56 82		
3167	3	4	\N	EKRIC	خالد للانجاز الصناعي و التجارة	Bt N° 4 Hai Sntp Route El Hamiz , Dar El Beida	0661 28 28 05	021 37 22 22		
4813	1	4	\N	ALPHA CRISTO INDUSTRIEL	\tألفا كريستو للصناعة	Route Nationale N°46 A, Ouled Djellal, Biskra	07 70 89 50 02			
4740	3	\N	\N	BELMOKADEM MOURAD BTPH	بلمقدم مراد ب ت ع ر	SIDI ADDA MAZOUNA WILAYA DE RELIZANE	0552111453	046949512	belmokademmourad@gmail,com	
3469	1	4	\N	SEDOUKI	صدوقي	Hai Chahid Malek    Terni   W. Tlemcen	0770 95 06 43			
918	3	4	\N	SEIF SIDI AHMED		Rue, Colonel Amirouche El Menea	029 81 57 57	029 81 39 25		
4921	1	4	\N	KSEL PRODUCTION MATERIAUX DE CONSTRUCTION	اكسال لصناعة مواد البناء	Route El Haoudh Section 209 Ilots n° 17 El Bayadh - Wilaya d'El Bayadh	0541 103 343 / 0661 345 954	049 67 66 64 / 032 73 58 28		
4992	\N	\N	\N	GRAVEB	قرافب	COMMUNE ATH MANSSOUR W.BOUIRA	055530900	023807592	sarlgraveb@gmail.com	
4993	\N	\N	\N	EL QODS ZOUAOUI	القدس زواوي	CITE HIDHAB 60 LSP , BOUSNINA & lemtai N°46 LOT 61N°07 SETIF	0554254427	036514261	mszouaoui@yahoo.fr	
4994	\N	\N	\N	ZOUAOUI QODS						
4976	1	\N	\N	RAM ROCK PRODUCTION		Lot SNTV N°49, Tébessa	0542 24 32 75 / 0557 36 57 70			
4951	\N	\N	\N							
5043	3	4	\N	ABRASIVES WORLD		148 Bocca Zamoul Oued El Fodda, wilaya de Chlef	0671306020	020369499	abrasivesworld.dz@gmail.com	
5044	1	\N	\N	ENERGY FRERES BOUCETTA		75 Cité El-Boustane, Commune de Ain Abid, Constantine,	05 50 50 73 29 / 06 61 43 43 05	020 10 60 57	boucettaenergy.@gmail.com	
5045	3	\N	\N	PATRISS IMPORT EXPORT		Local N° 02, lotissement 124 Lots, Eldjar commune d Magra; Wilaya M'sila	0662 47 48 82	031  45 70 88		
5046	1	\N	\N	TUF RESSOURCES			05 52 33 63 19			
5047	3	\N	\N	ATALLAH ABDERZAK LIINTADJ EL DJABS		N° 177 Plan d'enquete global N°30; commune Ouled Khelouf; Wilaya de Mila	0669 72 15 30	031 45 70 88		
5048	\N	\N	\N							
4919	3	4	\N	KADIMAR KAKA	كاديمار كاكا	Ave Colonnel Amirouche - Barika . W Batna	0660 565 444		kadimaretph@gmail.com	
4056	5	\N	\N	LAFARGE CIMENT DE M’SILA (LCM)	لافارج إسمنت مسيلة	Centre Commercial de Bab Ezzouar, Tour N°02, \r\n5ieme & 6ieme étage - Bab Ezzouar, Alger	023 92 42 95-96 /	023 92 42 94		
4375	1	\N	\N	ENTREPRISE EL FATIHINE D'AFFAIRES	شركة الفاتحين للأعمال	Lot N° 4, Mechtat Mehamid, Commune de Belaiba, W, M'sila	05 50 16 36 13			
3643	3	4	\N	PROMCAR ABBES	برومكار عباس	n° 02, Rue K Mezouarou - Sidi Bel Abbès	0551 48 16 16	048 54 62 53		
4963	3	4	\N	AFAK CONSTRUCTION	افاق للبناء	Zone Industrielle Z.A.D, Ouenza, Wilaya de Tébessa	0671 57 31 33	023 80 75 92		
4966	1	\N	\N	BRIQUETERIE PREMIUM		Mezaourou, commune de Souahlia, Ghazaouet, w TLEMCEN				
4900	3	\N	\N	ELBAHDJA LITAHDHIR GHOBRAT EL MALAT	البهجة لتحضير غبرة الملاط	Cité Lahsabi, route de Ras El Ayoun, commune de N'gaous, wilaya de Batna.	0661 58 58 45	033 39 18 72		
5113	1	4	\N	BENHOUHOU CHELLALA GUEBLIA		Ilot n°32 Groupe de propriété n°07, Commune de Chellala W. EL BAYADH	0557048829		khenefarid@gmail.com	
5114	3	\N	\N	EURL TAFADAK	تفداك	Hai Houari Boumedienne, commune et wilaya de In Guezzam-Algerie	0667 58 78 91/ 0549 81 16 30		etbhhbb@gmail.com	
5115	3	4	\N	OULD ALI HANNO CERAMIQUA IMPORT EXPORT		Rue Mohamed Boudiaf n°A03 Local 3, Tighennif, W. MASCARA	0550974092		secretariathc974@gmail.com	
5116	3	4	\N	DJED	جد	Cité Slimane ilot 359 n° 01 Ain Ouassara wilaya de Djelfa	0661165168			
4988	\N	\N	\N	OZMERT ALGERIA	أوزمارت ألجيريا	COOPERATIVE IMMOBILIERE LE SOLDAT INCONNU , PARCELLE N°540 COMMUNE DE BIR EL DJIR WILAYA D'ORON	041708024	041708044	info@ozmertalgeria.com	
4586	1	\N	\N	TIN KRADHET LITANKIB	تين كراضت للتنقيب					
4587	1	\N	\N	IMRAHENE LI ZAHAB	ايمرهان للذهب					
4588	1	\N	\N	TAKIST LILBAHT WA TANKIB ANI ZAHAB	تاكيست للبحث و التنقيب عن الذهب					
2876	1	4	\N	CARRIERE LEMOUCHI ABDESSELEM	محجرة لموشي عبد السلام	Dhar El Menjel, Commune El Maleh - W.Ain Timouchent	071 45 93 92			
5015	1	\N	\N	SABLIERE DE VALLEE D'OR	صابليار دوفالي دور	Lotissement 505, n°15 concession 12, Commune Eulma.	0770230767			
5049	1	4	\N	BON CAILLOUX ALGERIE	بون كايو الجيري	Local N°197bis 2 Oued Fodda Centre Lotissement RN 4 Cne Oued Fodda W. Chlef.	0550 23 39 45.			
5050	1	\N	\N	RVM INDUSTRIE	ار في ام اندوستري	Cité Beni Aissa Boucherka, Commune Taher,Wilaya de Jijel	0560067707			
3411	1	4	\N	DEBLADJI AGREGAT	دبلاجي للحصى	09 Rue tazghat Djilali  Oued Rhiou RELIZANE	0550 95 99 43	046 97 96 74		
4406	5	\N	\N	EPTRC	المؤسسة العمومية للاشغال الطرق للوسط	AIN DEHEB BP 37 MEDEA	025595408/09	025593119	info@eptrc-dz.com	www.eptrc-dz.com#http://www.eptrc-dz.com#
3754	1	4	\N	SPRA / SOCIETE DES PRODUITS ROUGES D'ARBAL	شركة المواد الحمراء أغبال	Arbal Route de Tafraoui   El Kerma  Oran	0770 26 06 00	041 28 28 72		
4483	1	\N	\N	TALAZAGHAT TANKIB	 تلازغات للتنقيب					
4475	1	\N	\N	SOCIETE ISSASEN	شركة اساسن					
3800	1	4	\N	SOT.P.H.B	سوت.بي.أش.بي	Cité Lardjane n° 4 bis, Cne de Saida,Wilaya de Saida	0770 26 06 00	041 28 28 72		
4972	1	4	\N	PADEN 1	باذن	Lotissement Promotionnel 50, N°48, Nâama.	07 70 92 84 45	049 59 63 26		
5037	1	4	\N	CARRIERE ISSAADI MUSTAPHA	محجرة اسعادي مصطفي	Commune de Bouandas Wilaya de Sétif.	0661 35 07 00 / 036 49 07 51	0773 62 37 96		
5038	3	\N	\N	IDRA SABLE						
3688	12	4	\N	COOPERATIVE ARTISANALE NASSER EDDINE DINET	التعاونية الحرفية ناصر الدين ديني	20Aout  N° 655/03 Bousaâda  W. M'sila	0662 314 248			
5074	1	4	\N	LALLA LIL HASSA	لعلى للحصى	Cité Ain Mousse, El-Hidhab Nord 5 à logements sociaux participatifs, premier étage du bâtiment 05 ilot de propriété N°53 sections 06 n°70, Sétif.	0661 35 09 10	036 84 44 43		
394	3	4	4	BOUSSAMA OUVERTURE & EXPLOITATION DE CARRIERE DE SABLE	العنابر	Cne de Djellal Daira de Chachar  	033 70 12 44	032 32 26 07\n033 70 17 28	jemskedjar@gmail.com	
\.


--
-- Data for Name: dossier_fournis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dossier_fournis ("id_dossierFournis", id_demande, date_depot, recevabilite_doss, statut_dossier, remarques, numero_accuse, date_accuse, numero_recepisse, date_recepisse, mise_en_demeure_envoyee, date_mise_en_demeure, pieces_manquantes, verification_phase, date_preannotation) FROM stdin;
1	1	2025-10-19 21:02:35.429	\N	complet		ACC-XKX9WM-1760907747985	2025-10-19 21:02:27.983	REC-IU6OBH-1760907747985	2025-10-19 21:02:27.983	f	\N	null	RECEVABILITE	2025-10-19 21:02:27.983
\.


--
-- Data for Name: dossier_fournis_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dossier_fournis_document ("id_dossierFournis", id_doc, status, file_url, created_at, updated_at) FROM stdin;
1	1	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	2	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	3	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	19	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	31	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	32	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	33	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	34	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	35	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	36	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	37	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	38	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
1	39	present	\N	2025-10-19 21:02:35.432	2025-10-19 21:02:35.432
\.


--
-- Data for Name: etape_proc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etape_proc (id_etape, lib_etape, duree_etape, ordre_etape, id_phase) FROM stdin;
1	Documents	\N	1	1
2	Identification	\N	2	1
3	Capacités	\N	3	1
4	Substances & Travaux	\N	4	1
5	Cadastre	\N	5	2
6	Avis Wali	\N	6	3
7	Comité de direction	\N	7	4
8	Génération du permis	\N	8	5
9	Paiement	\N	9	6
\.


--
-- Data for Name: expertminier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expertminier (id_expert, nom_expert, num_agrement, date_agrement, etat_agrement, adresse, email, tel_expert, fax_expert, specialisation) FROM stdin;
1	CHERIET Mohamed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
2	BASLIMANE Bahmed	\N	\N	\N	\N	\N	\N	\N	\N
3	MEZOUH Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
4	HENNI Abdelghani	\N	\N	\N	\N	\N	\N	\N	\N
5	BEY Aliouat	\N	\N	\N	\N	\N	\N	\N	\N
6	Cheriet Med Fouzi	\N	\N	\N	\N	\N	\N	\N	\N
7	BOUALEM Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
8	REKIBI Sassi	\N	\N	\N	\N	\N	\N	\N	\N
9	LAGOUNE Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
10	BOUTICHE Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
11	MOSTEFAOUI Lakhdar	\N	\N	\N	\N	\N	\N	\N	\N
12	ORGM	\N	\N	\N	\N	\N	\N	\N	\N
13	DJIRIBI	\N	\N	\N	\N	\N	\N	\N	\N
14	M. SALHI	\N	\N	\N	\N	\N	\N	\N	\N
15	NEDJARI Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
16	YAHIOUCHE Abdeldjalil	\N	\N	\N	\N	\N	\N	\N	\N
17	HIBER AISSA	\N	\N	\N	\N	\N	\N	\N	\N
18	SALHI Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
19	BENSALEM Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
20	BELLELOU Rabah	\N	\N	\N	\N	\N	\N	\N	\N
21	 Mr M. MAZARI	\N	\N	\N	\N	\N	\N	\N	\N
22	AIT TAYEB MOHAND AMEZIANE	\N	\N	\N	\N	\N	\N	\N	\N
23	ENOF	\N	\N	\N	\N	\N	\N	\N	\N
24	HIBER Aissa	\N	\N	\N	\N	\N	\N	\N	\N
25	KEDJEM ABDELLAH	\N	\N	\N	\N	\N	\N	\N	\N
26	CETIM	\N	\N	\N	\N	\N	\N	\N	\N
27	CHERIET MOHAMED FAOUZI	\N	\N	\N	\N	\N	\N	\N	\N
28	DJERIBI Djamel	\N	\N	\N	\N	\N	\N	\N	\N
29	AMIROUCHE Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
30	Mr BOUNAB Khaled	\N	\N	\N	\N	\N	\N	\N	\N
31	REGUIBI Abdelmalek	\N	\N	\N	\N	\N	\N	\N	\N
32	NAKIB Razik	\N	\N	\N	\N	\N	\N	\N	\N
33	ZENAGUI Bounouar	\N	\N	\N	\N	\N	\N	\N	\N
34	A. REGUIBI	\N	\N	\N	\N	\N	\N	\N	\N
35	DEBBACHE Abdallah	\N	\N	\N	\N	\N	\N	\N	\N
36	CGC	\N	\N	\N	\N	\N	\N	\N	\N
37	AIT ALI Moussa	\N	\N	\N	\N	\N	\N	\N	\N
38	SOUALHI Yazid	\N	\N	\N	\N	\N	\N	\N	\N
39	Mezzouh Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
40	YAHIOUCHE	\N	\N	\N	\N	\N	\N	\N	\N
41	CHAOUECHE Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
42	BEY ALIOUET	\N	\N	\N	\N	\N	\N	\N	\N
43	MEFTAH Lamine	\N	\N	\N	\N	\N	\N	\N	\N
44	BEN SAADA Hassen	\N	\N	\N	\N	\N	\N	\N	\N
45	MEZOUH MUSTAPHA	\N	\N	\N	\N	\N	\N	\N	\N
46	DJEBABRA FAIZA	\N	\N	\N	\N	\N	\N	\N	\N
47	BOUFTOUHA Youcef	\N	\N	\N	\N	\N	\N	\N	\N
48	BOUTRID Abdelaziz	\N	\N	\N	\N	\N	\N	\N	\N
49	TALBI Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
50	BELKESSA Kamel	\N	\N	\N	\N	\N	\N	\N	\N
51	BOUSNANE Fouad	\N	\N	\N	\N	\N	\N	\N	\N
52	BENSALEM Youcef	\N	\N	\N	\N	\N	\N	\N	\N
53	LAMRA Chabane	\N	\N	\N	\N	\N	\N	\N	\N
54	BELOUARETH Kamel	\N	\N	\N	\N	\N	\N	\N	\N
55	ZENAGUI BOUNOUAR	\N	\N	\N	\N	\N	\N	\N	\N
56	MAHAMMED OUSAID Belkhir	\N	\N	\N	\N	\N	\N	\N	\N
57	LAMARA Chaabane	\N	\N	\N	\N	\N	\N	\N	\N
58	SEBA Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
59	BENSALEM YOUCEF	\N	\N	\N	\N	\N	\N	\N	\N
60	LAGOUN Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
61	ADJOU MOKHTAR	\N	\N	\N	\N	\N	\N	\N	\N
62	YAHIAOUI Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
63	BEY ALIOUATE	\N	\N	\N	\N	\N	\N	\N	\N
64	ADROUCHE Salah	\N	\N	\N	\N	\N	\N	\N	\N
65	Mr A. BOUTRID	\N	\N	\N	\N	\N	\N	\N	\N
66	GHAMOUD Kamel	\N	\N	\N	\N	\N	\N	\N	\N
67	BELKHEIR Mohamed Oussaid	\N	\N	\N	\N	\N	\N	\N	\N
68	NAKIB Rezik	\N	\N	\N	\N	\N	\N	\N	\N
69	MEZOUH Mustpha	\N	\N	\N	\N	\N	\N	\N	\N
70	HENNI ABDELGHANI	\N	\N	\N	\N	\N	\N	\N	\N
71	Cheriet Mohamed Fouzi	\N	\N	\N	\N	\N	\N	\N	\N
72	NAHNOUH BOUBAKR	\N	\N	\N	\N	\N	\N	\N	\N
73	HADJ SADOUK Sid Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
74	BOUKLIA SMAIN	\N	\N	\N	\N	\N	\N	\N	\N
75	BEY Alliouet	\N	\N	\N	\N	\N	\N	\N	\N
76	BENSALAH Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
77	BELOUARTEH Kamel	\N	\N	\N	\N	\N	\N	\N	\N
78	A, YAHIOUCHE	\N	\N	\N	\N	\N	\N	\N	\N
79	BERKAT Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
80	Mr A. HIBER	\N	\N	\N	\N	\N	\N	\N	\N
81	henni abdelghani	\N	\N	\N	\N	\N	\N	\N	\N
82	LAMARA CHABANE	\N	\N	\N	\N	\N	\N	\N	\N
83	BOUNABI AISSA	\N	\N	\N	\N	\N	\N	\N	\N
84	SAIDANI Slimane	\N	\N	\N	\N	\N	\N	\N	\N
85	ADJOU Mokhtar	\N	\N	\N	\N	\N	\N	\N	\N
86	SAADA Hamid	\N	\N	\N	\N	\N	\N	\N	\N
87	HIADIHINE Djilali	\N	\N	\N	\N	\N	\N	\N	\N
88	AYOUNE Messaoud	\N	\N	\N	\N	\N	\N	\N	\N
89	Reguibi Abdelmalek	\N	\N	\N	\N	\N	\N	\N	\N
90	Mr MESABHIA Abdelhamid	\N	\N	\N	\N	\N	\N	\N	\N
91	MIR ABDERRAHMANE	\N	\N	\N	\N	\N	\N	\N	\N
92	Mme DJEBABRIA Faiza	\N	\N	\N	\N	\N	\N	\N	\N
93	ATMANIA Cherif	\N	\N	\N	\N	\N	\N	\N	\N
94	MOHAMMEDI Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
95	LADJOUZI Wahiba	\N	\N	\N	\N	\N	\N	\N	\N
96	Mr DRAGH Lotfi	\N	\N	\N	\N	\N	\N	\N	\N
97	ABDMEZIEM Akli	\N	\N	\N	\N	\N	\N	\N	\N
98	Ait Tayeb Mohand Meziane	\N	\N	\N	\N	\N	\N	\N	\N
99	BOURAS Zine	\N	\N	\N	\N	\N	\N	\N	\N
100	FERAAL	\N	\N	\N	\N	\N	\N	\N	\N
101	BOUCHEHIT Ali	\N	\N	\N	\N	\N	\N	\N	\N
102	Mezouh Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
103	BOUCHEHIT ALI	\N	\N	\N	\N	\N	\N	\N	\N
104	SPA CEVITAL Minerals et SPA CETIM.	\N	\N	\N	\N	\N	\N	\N	\N
105	ENG	\N	\N	\N	\N	\N	\N	\N	\N
106	LAMARA Chabane	\N	\N	\N	\N	\N	\N	\N	\N
107	Mr A. AMIROUCHE	\N	\N	\N	\N	\N	\N	\N	\N
108	BENSAADA Hassen	\N	\N	\N	\N	\N	\N	\N	\N
109	Mr Y. MOHAMMEDI	\N	\N	\N	\N	\N	\N	\N	\N
110	DJEBABRIA Faiza	\N	\N	\N	\N	\N	\N	\N	\N
111	HASBALLAOUI Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
112	ETRHB	\N	\N	\N	\N	\N	\N	\N	\N
113	M. LAGOUNE	\N	\N	\N	\N	\N	\N	\N	\N
114	BELKESSA KAMEL	\N	\N	\N	\N	\N	\N	\N	\N
115	CHERIET Mohemed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
116	SILHADI Kadidja	\N	\N	\N	\N	\N	\N	\N	\N
117	HAFIDI Toufik	\N	\N	\N	\N	\N	\N	\N	\N
118	Mr GHAMOUD Kamel.	\N	\N	\N	\N	\N	\N	\N	\N
119	GUEDRI Mohamed Oubelaid	\N	\N	\N	\N	\N	\N	\N	\N
120	BENSALAH MUSTAPHA	\N	\N	\N	\N	\N	\N	\N	\N
121	BOUNAB Khaled	\N	\N	\N	\N	\N	\N	\N	\N
122	HAFID Lakhder	\N	\N	\N	\N	\N	\N	\N	\N
123	CHERIET	\N	\N	\N	\N	\N	\N	\N	\N
124	CHRIET Mohamed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
125	BENTIB Hocine	\N	\N	\N	\N	\N	\N	\N	\N
126	BOUTICHE AHMED	\N	\N	\N	\N	\N	\N	\N	\N
127	CHERIET MED FOUZI	\N	\N	\N	\N	\N	\N	\N	\N
128	YAHIOUCHE ABDELDJALIL	\N	\N	\N	\N	\N	\N	\N	\N
129	DJAZIRI Omar	\N	\N	\N	\N	\N	\N	\N	\N
130	NAKIB REZIK	\N	\N	\N	\N	\N	\N	\N	\N
131	ATHMANIA Cherif	\N	\N	\N	\N	\N	\N	\N	\N
132	AIT TAYEB Mohand Ameziane	\N	\N	\N	\N	\N	\N	\N	\N
133	AJOU MOKHTAR	\N	\N	\N	\N	\N	\N	\N	\N
134	M. MEZOUH	\N	\N	\N	\N	\N	\N	\N	\N
135	DEBBACHE ABDELLAH	\N	\N	\N	\N	\N	\N	\N	\N
136	ENAMARBRE	\N	\N	\N	\N	\N	\N	\N	\N
137	Mustapha BENZERGA	\N	\N	\N	\N	\N	\N	\N	\N
138	Mme D. LABCHRI	\N	\N	\N	\N	\N	\N	\N	\N
139	ALIOUAT BEY	\N	\N	\N	\N	\N	\N	\N	\N
140	mahammed ousaid belkhir	\N	\N	\N	\N	\N	\N	\N	\N
141	BEY ALIOUAT	\N	\N	\N	\N	\N	\N	\N	\N
142	GHODBANE	\N	\N	\N	\N	\N	\N	\N	\N
143	Nedjari Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
144	DRAGH Lotfi	\N	\N	\N	\N	\N	\N	\N	\N
145	HAMIDANE Ali	\N	\N	\N	\N	\N	\N	\N	\N
146	SOUALHI YAZID	\N	\N	\N	\N	\N	\N	\N	\N
147	LAGOUNE MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
148	Mr M. MOHAMMEDI	\N	\N	\N	\N	\N	\N	\N	\N
149	HAMRIT Ouakil	\N	\N	\N	\N	\N	\N	\N	\N
150	zenagui bounouar	\N	\N	\N	\N	\N	\N	\N	\N
151	SEBA MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
152	LAGGOUN Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
153	AGGOUNE Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
154	Mr A. BENZOHRA	\N	\N	\N	\N	\N	\N	\N	\N
155	Mr A. YAHIOUCHE	\N	\N	\N	\N	\N	\N	\N	\N
156	MILOUS Kamel	\N	\N	\N	\N	\N	\N	\N	\N
157	HAMRIT Wakil	\N	\N	\N	\N	\N	\N	\N	\N
158	MR BOUTICHE AHMED	\N	\N	\N	\N	\N	\N	\N	\N
159	MIR Abderrahmane	\N	\N	\N	\N	\N	\N	\N	\N
160	Mr B.ALIOUATE	\N	\N	\N	\N	\N	\N	\N	\N
161	CHERIET Mhamed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
162	Mr CHERIET Mohamed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
163	Boualem Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
164	Mr M.A. AIT TAYEB	\N	\N	\N	\N	\N	\N	\N	\N
165	BASLIMANE BAHMED	\N	\N	\N	\N	\N	\N	\N	\N
166	Henni Abdelghani	\N	\N	\N	\N	\N	\N	\N	\N
167	CHERIET MIHAMMED FAOUZI	\N	\N	\N	\N	\N	\N	\N	\N
168	BOUNEB Khaled	\N	\N	\N	\N	\N	\N	\N	\N
169	HARKAT Abdelhak	\N	\N	\N	\N	\N	\N	\N	\N
170	Mr BENSALAH Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
171	Mr C. LAMARA	\N	\N	\N	\N	\N	\N	\N	\N
172	ALGRAN	\N	\N	\N	\N	\N	\N	\N	\N
173	Belkheir Mohamed Oussaid	\N	\N	\N	\N	\N	\N	\N	\N
174	CHERIET Med Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
175	CHAREF Zouaoui	\N	\N	\N	\N	\N	\N	\N	\N
176	LAMARA CHAABANE	\N	\N	\N	\N	\N	\N	\N	\N
177	GUESBAYA Salim	\N	\N	\N	\N	\N	\N	\N	\N
178	CHERIET MOHAMED FOUZI	\N	\N	\N	\N	\N	\N	\N	\N
179	Mr Y. BOUFTOUHA	\N	\N	\N	\N	\N	\N	\N	\N
180	ALBARYTE	\N	\N	\N	\N	\N	\N	\N	\N
181	LADJOUZI OUAHIBA	\N	\N	\N	\N	\N	\N	\N	\N
182	HANNACHE Salah	\N	\N	\N	\N	\N	\N	\N	\N
183	HADJ SADOK SAID Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
184	Sebaa Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
185	R. CHAOUI	\N	\N	\N	\N	\N	\N	\N	\N
186	Mr MEZOUH Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
187	MAZOUH MUSTAPHA	\N	\N	\N	\N	\N	\N	\N	\N
188	BEN SALEM YOUCEF	\N	\N	\N	\N	\N	\N	\N	\N
189	DRAGH LOTFI	\N	\N	\N	\N	\N	\N	\N	\N
190	Djebabria Faiza	\N	\N	\N	\N	\N	\N	\N	\N
191	MIR Abderahmane	\N	\N	\N	\N	\N	\N	\N	\N
192	BENZOHRA Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
193	MOSTEFAOUI Lakhder	\N	\N	\N	\N	\N	\N	\N	\N
194	EPE SPA ORGM	\N	\N	\N	\N	\N	\N	\N	\N
195	K. BOUNAB	\N	\N	\N	\N	\N	\N	\N	\N
196	BOUALEM MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
197	LAGOUN MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
198	BNSALEM YOUCEF	\N	\N	\N	\N	\N	\N	\N	\N
199	CHRIET MOHAMED FAOUZI	\N	\N	\N	\N	\N	\N	\N	\N
200	Reghibi ABDELMALEK	\N	\N	\N	\N	\N	\N	\N	\N
201	KEDJAM Abdellah	\N	\N	\N	\N	\N	\N	\N	\N
202	MEDADHA Nasredine	\N	\N	\N	\N	\N	\N	\N	\N
203	HARKET Abdelhak	\N	\N	\N	\N	\N	\N	\N	\N
204	yahiouche abdeldjalil	\N	\N	\N	\N	\N	\N	\N	\N
205	M.F. CHRIET	\N	\N	\N	\N	\N	\N	\N	\N
206	C. LAMARA	\N	\N	\N	\N	\N	\N	\N	\N
207	BOULNOUAR Amar	\N	\N	\N	\N	\N	\N	\N	\N
208	LAGOUNE Mohamd	\N	\N	\N	\N	\N	\N	\N	\N
209	BOUGARA Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
210	Bounab Khaled	\N	\N	\N	\N	\N	\N	\N	\N
211	HASBELLAOUI Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
212	BEY ALLIOUAT	\N	\N	\N	\N	\N	\N	\N	\N
213	DJEBABRIA FAIZA	\N	\N	\N	\N	\N	\N	\N	\N
214	Mr M.F. CHRIET	\N	\N	\N	\N	\N	\N	\N	\N
215	YAHIAOUI Mostéfa	\N	\N	\N	\N	\N	\N	\N	\N
216	BELKASSA Kamel	\N	\N	\N	\N	\N	\N	\N	\N
217	ALIOUAT Bey	\N	\N	\N	\N	\N	\N	\N	\N
218	SILHADI Khadidja	\N	\N	\N	\N	\N	\N	\N	\N
219	Yahiouche Abdelajdalil	\N	\N	\N	\N	\N	\N	\N	\N
220	Mme LADJOUZI Wahiba	\N	\N	\N	\N	\N	\N	\N	\N
221	Mr K. GHAMOUD	\N	\N	\N	\N	\N	\N	\N	\N
222	SAADOUDI Salah	\N	\N	\N	\N	\N	\N	\N	\N
223	lagoun mohamed	\N	\N	\N	\N	\N	\N	\N	\N
224	C. ATMANIA	\N	\N	\N	\N	\N	\N	\N	\N
225	SALHI MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
226	CILAS	\N	\N	\N	\N	\N	\N	\N	\N
227	ARIF Smail	\N	\N	\N	\N	\N	\N	\N	\N
228	BOUNAB  KHALED	\N	\N	\N	\N	\N	\N	\N	\N
229	CHERIET Med faouzi	\N	\N	\N	\N	\N	\N	\N	\N
230	MIR ABDERRAHMAN	\N	\N	\N	\N	\N	\N	\N	\N
231	MOHAMEDI Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
232	DJEBABRIA Faiza Eps ACHOURI	\N	\N	\N	\N	\N	\N	\N	\N
233	BOUNEB KHALED	\N	\N	\N	\N	\N	\N	\N	\N
234	EPE ORGM SPA	\N	\N	\N	\N	\N	\N	\N	\N
235	A. AMIROUCHE	\N	\N	\N	\N	\N	\N	\N	\N
236	HADJ SADOK SIDAHMED	\N	\N	\N	\N	\N	\N	\N	\N
237	MILOUS KAMEL	\N	\N	\N	\N	\N	\N	\N	\N
238	Amirouche Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
239	B.ALIOUATE	\N	\N	\N	\N	\N	\N	\N	\N
240	EPE SPA CETIM	\N	\N	\N	\N	\N	\N	\N	\N
241	cetim	\N	\N	\N	\N	\N	\N	\N	\N
242	KARIRO, Mario Amberto	\N	\N	\N	\N	\N	\N	\N	\N
243	MEGAACHE Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
244	M. BENSALEM	\N	\N	\N	\N	\N	\N	\N	\N
245	BENSALEM YOUSSEF	\N	\N	\N	\N	\N	\N	\N	\N
246	CHABANE LAMARA	\N	\N	\N	\N	\N	\N	\N	\N
247	B. MAHAMMED OUSAID	\N	\N	\N	\N	\N	\N	\N	\N
248	Mr L. DRAGH	\N	\N	\N	\N	\N	\N	\N	\N
249	KOUILI Abdelbaki	\N	\N	\N	\N	\N	\N	\N	\N
250	BOUCHHIT Ali	\N	\N	\N	\N	\N	\N	\N	\N
251	Mr BOUFTOUHA Youcef	\N	\N	\N	\N	\N	\N	\N	\N
252	CHRIET Med Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
253	DJAFOUR Rachida	\N	\N	\N	\N	\N	\N	\N	\N
254	CHRIET MOHAMED FOUZI	\N	\N	\N	\N	\N	\N	\N	\N
255	TALBI MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
256	CERAD/FERPHOS	\N	\N	\N	\N	\N	\N	\N	\N
257	SAADAOUI Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
258	Cheriet Mohamed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
259	MEZOUH  Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
260	KHEBCHI Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
261	DERAGH Lotfi	\N	\N	\N	\N	\N	\N	\N	\N
262	CHERIET Mohamed Fouzi	\N	\N	\N	\N	\N	\N	\N	\N
263	CHRIET MOHAMMED FAOUZI	\N	\N	\N	\N	\N	\N	\N	\N
264	AIT TAYEB Mohamed Ameziane	\N	\N	\N	\N	\N	\N	\N	\N
265	Mostefaoui,Lakhder	\N	\N	\N	\N	\N	\N	\N	\N
266	DEBBACHE Abdellah	\N	\N	\N	\N	\N	\N	\N	\N
267	MOUSSA Kacem	\N	\N	\N	\N	\N	\N	\N	\N
268	Mr C. ATHMANIA	\N	\N	\N	\N	\N	\N	\N	\N
269	BELKHAIR Mohamed Oussaid	\N	\N	\N	\N	\N	\N	\N	\N
270	Mr A. BOUTICHE	\N	\N	\N	\N	\N	\N	\N	\N
271	NAKIB RAZIK	\N	\N	\N	\N	\N	\N	\N	\N
272	bey aliouet	\N	\N	\N	\N	\N	\N	\N	\N
273	REGUIBI ABDELMALEK	\N	\N	\N	\N	\N	\N	\N	\N
274	MOHAMMED OUSAID Belkhir	\N	\N	\N	\N	\N	\N	\N	\N
275	SHAOLIN MINES	\N	\N	\N	\N	\N	\N	\N	\N
276	BEY ALOUAT	\N	\N	\N	\N	\N	\N	\N	\N
277	Bey Alliouat	\N	\N	\N	\N	\N	\N	\N	\N
278	Djeribi Djamel	\N	\N	\N	\N	\N	\N	\N	\N
279	Belkeir Med Oussaid	\N	\N	\N	\N	\N	\N	\N	\N
280	AGOUNE Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
281	Yahiouche Abdeldjalil	\N	\N	\N	\N	\N	\N	\N	\N
282	ATAMNIA Cherif	\N	\N	\N	\N	\N	\N	\N	\N
283	OUSSALAH Youcef	\N	\N	\N	\N	\N	\N	\N	\N
284	Mr REGUIBI ABDELMALEK	\N	\N	\N	\N	\N	\N	\N	\N
285	DRAA Lotfi	\N	\N	\N	\N	\N	\N	\N	\N
286	CEVITAL Minerals	\N	\N	\N	\N	\N	\N	\N	\N
287	Bey Aliouat	\N	\N	\N	\N	\N	\N	\N	\N
288	LADJOUZI WAHIBA	\N	\N	\N	\N	\N	\N	\N	\N
289	ZENNAGUI Bounouar	\N	\N	\N	\N	\N	\N	\N	\N
290	ABDMEZIZM Akli	\N	\N	\N	\N	\N	\N	\N	\N
291	CERAD	\N	\N	\N	\N	\N	\N	\N	\N
292	yahiaoui mostefa	\N	\N	\N	\N	\N	\N	\N	\N
293	YAHIAOUI Mostefa	\N	\N	\N	\N	\N	\N	\N	\N
294	MR BENSALEM YOUCEF	\N	\N	\N	\N	\N	\N	\N	\N
295	Lagoune Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
296	Mr BOUTHERID Abd El Aziz	\N	\N	\N	\N	\N	\N	\N	\N
297	Mr HIBER AISSA	\N	\N	\N	\N	\N	\N	\N	\N
298	YAHIOUCHE Abdeldjalili	\N	\N	\N	\N	\N	\N	\N	\N
299	Md LAADJOUZI Wahiba	\N	\N	\N	\N	\N	\N	\N	\N
300	Mr M. HASBELAOUI	\N	\N	\N	\N	\N	\N	\N	\N
301	Mir Abderrahmane	\N	\N	\N	\N	\N	\N	\N	\N
302	Berkat Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
303	BOUNAB KHALED	\N	\N	\N	\N	\N	\N	\N	\N
304	Mr, Mostefaoui Lakhder	\N	\N	\N	\N	\N	\N	\N	\N
305	BOUCHEHIT	\N	\N	\N	\N	\N	\N	\N	\N
306	SOUALHI MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
307	YAHIOUCH BDELDJALLIL	\N	\N	\N	\N	\N	\N	\N	\N
308	HIADIHINE Djillali	\N	\N	\N	\N	\N	\N	\N	\N
309	Lamara Chabane	\N	\N	\N	\N	\N	\N	\N	\N
310	LAGOUNE, Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
311	Atamnia Cherif	\N	\N	\N	\N	\N	\N	\N	\N
312	MEZOUH Mustaoha	\N	\N	\N	\N	\N	\N	\N	\N
313	Mohamed TOBBAL SEGHIR	\N	\N	\N	\N	\N	\N	\N	\N
314	DJAFOR Rachida	\N	\N	\N	\N	\N	\N	\N	\N
315	ATHMANIA CHERIF	\N	\N	\N	\N	\N	\N	\N	\N
316	A. BOUTICHE	\N	\N	\N	\N	\N	\N	\N	\N
317	NAHNOUH Boubkeur	\N	\N	\N	\N	\N	\N	\N	\N
318	HASBELAOUI Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
319	DEBACHE ABDELLAH	\N	\N	\N	\N	\N	\N	\N	\N
320	ZENNAKI Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
321	AMIROUCHE	\N	\N	\N	\N	\N	\N	\N	\N
322	EPE/SPA CETIM	\N	\N	\N	\N	\N	\N	\N	\N
323	Mr B. ZINAGUI	\N	\N	\N	\N	\N	\N	\N	\N
324	BENTAYEB Hocine	\N	\N	\N	\N	\N	\N	\N	\N
325	BOUNABE Khaled	\N	\N	\N	\N	\N	\N	\N	\N
326	 CHERIET MOHAMED FAOUZI	\N	\N	\N	\N	\N	\N	\N	\N
327	Boutrid	\N	\N	\N	\N	\N	\N	\N	\N
328	MOHAMMEDI MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
329	Mme W. LADJOUZI	\N	\N	\N	\N	\N	\N	\N	\N
330	BEN ABDELMOUMEN	\N	\N	\N	\N	\N	\N	\N	\N
331	ATAMNIA CHERIF	\N	\N	\N	\N	\N	\N	\N	\N
332	Bensalem Youcef	\N	\N	\N	\N	\N	\N	\N	\N
333	DJIRIBI Djamel	\N	\N	\N	\N	\N	\N	\N	\N
334	MOSTFAOUI LAKHDAR	\N	\N	\N	\N	\N	\N	\N	\N
335	BOUFTOUHA YOUCEF	\N	\N	\N	\N	\N	\N	\N	\N
336	SEBA MOHAMEDS	\N	\N	\N	\N	\N	\N	\N	\N
337	BELOULOU RABAH	\N	\N	\N	\N	\N	\N	\N	\N
338	CHERIFI benyoucef	\N	\N	\N	\N	\N	\N	\N	\N
339	Mr A. REGUIBI	\N	\N	\N	\N	\N	\N	\N	\N
340	H. BENTAYEB	\N	\N	\N	\N	\N	\N	\N	\N
341	Boutiche Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
342	Debbache Abdellah	\N	\N	\N	\N	\N	\N	\N	\N
343	BEN ABDELMOUMAN MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
344	MOSTFAOUI Lakhder	\N	\N	\N	\N	\N	\N	\N	\N
345	Mr ALIOUAT Bey	\N	\N	\N	\N	\N	\N	\N	\N
346	Amirouche AHMED	\N	\N	\N	\N	\N	\N	\N	\N
347	Z BOUGUETTAYA	\N	\N	\N	\N	\N	\N	\N	\N
348	Adjou Mokhtar	\N	\N	\N	\N	\N	\N	\N	\N
349	CABEX	\N	\N	\N	\N	\N	\N	\N	\N
350	B. ALIOUATE	\N	\N	\N	\N	\N	\N	\N	\N
351	Mustapha BENSALAH	\N	\N	\N	\N	\N	\N	\N	\N
352	MOSTEFAOUI,L	\N	\N	\N	\N	\N	\N	\N	\N
353	HAMRIT OUAKIL	\N	\N	\N	\N	\N	\N	\N	\N
354	BENSALELM YOUCEF	\N	\N	\N	\N	\N	\N	\N	\N
355	Mr ADJOU Mokhtar	\N	\N	\N	\N	\N	\N	\N	\N
356	BOUNAB	\N	\N	\N	\N	\N	\N	\N	\N
357	LAMARA CHAABAN	\N	\N	\N	\N	\N	\N	\N	\N
358	BARKAT Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
359	Mr K. BENOUARETH	\N	\N	\N	\N	\N	\N	\N	\N
360	SAIDANI SLIMANE	\N	\N	\N	\N	\N	\N	\N	\N
361	Mr BENOUARETH Kamel	\N	\N	\N	\N	\N	\N	\N	\N
362	Mme BENATALLAH Nora	\N	\N	\N	\N	\N	\N	\N	\N
363	Mr DRAGH lotfi	\N	\N	\N	\N	\N	\N	\N	\N
364	W. LADJOUZI	\N	\N	\N	\N	\N	\N	\N	\N
365	BENSALEM MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
366	CHAOUI Rachid	\N	\N	\N	\N	\N	\N	\N	\N
367	Mr KEDJAM Abdellah	\N	\N	\N	\N	\N	\N	\N	\N
368	B. Aliouat	\N	\N	\N	\N	\N	\N	\N	\N
369	ALLIOUAT Bey	\N	\N	\N	\N	\N	\N	\N	\N
370	Mr S.A. HADJ SADOK	\N	\N	\N	\N	\N	\N	\N	\N
371	Mr M. LAGOUNE	\N	\N	\N	\N	\N	\N	\N	\N
372	AIT ALI MOUSSA	\N	\N	\N	\N	\N	\N	\N	\N
373	Mr M HASBELLAOUI	\N	\N	\N	\N	\N	\N	\N	\N
374	REGHIBI ABDELMALEK	\N	\N	\N	\N	\N	\N	\N	\N
375	Mostefaoui Lakhdar	\N	\N	\N	\N	\N	\N	\N	\N
376	BEY Alliouat	\N	\N	\N	\N	\N	\N	\N	\N
377	Mr H. SAADA	\N	\N	\N	\N	\N	\N	\N	\N
378	BOUGUETTAYA Zohir	\N	\N	\N	\N	\N	\N	\N	\N
379	HADJ SADOUK SID AHMED	\N	\N	\N	\N	\N	\N	\N	\N
380	KEDJEM Abdellah	\N	\N	\N	\N	\N	\N	\N	\N
381	BEN SI HAMDI Salim	\N	\N	\N	\N	\N	\N	\N	\N
382	LADJOUZI	\N	\N	\N	\N	\N	\N	\N	\N
383	Kazi Tani Nacereddine	\N	\N	\N	\N	\N	\N	\N	\N
384	DEBACHE Abdallah	\N	\N	\N	\N	\N	\N	\N	\N
385	BELKESSA	\N	\N	\N	\N	\N	\N	\N	\N
386	AIT TAYEB M Ameziene	\N	\N	\N	\N	\N	\N	\N	\N
387	ENOR	\N	\N	\N	\N	\N	\N	\N	\N
388	REGHIBI Abdelmalek	\N	\N	\N	\N	\N	\N	\N	\N
389	MOSTEFAOUI Khatir	\N	\N	\N	\N	\N	\N	\N	\N
390	Mr DJERIBI Djamel	\N	\N	\N	\N	\N	\N	\N	\N
391	Lamara Chaabane	\N	\N	\N	\N	\N	\N	\N	\N
392	BEN SALEM Youcef	\N	\N	\N	\N	\N	\N	\N	\N
393	Mr LAGOUN Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
394	Mr K. BOUNAB	\N	\N	\N	\N	\N	\N	\N	\N
395	ZENAGUI	\N	\N	\N	\N	\N	\N	\N	\N
396	HASBELLAOUI MUSTAPHA	\N	\N	\N	\N	\N	\N	\N	\N
397	SILHADI KHADIDJA	\N	\N	\N	\N	\N	\N	\N	\N
398	DJADJAFOUR Rachidda	\N	\N	\N	\N	\N	\N	\N	\N
399	HAMIDAN Ali	\N	\N	\N	\N	\N	\N	\N	\N
400	BEN TAYEB Hocine	\N	\N	\N	\N	\N	\N	\N	\N
401	ALMINEX	\N	\N	\N	\N	\N	\N	\N	\N
402	Athmania Cherif	\N	\N	\N	\N	\N	\N	\N	\N
403	BOUTICH Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
404	MAHAMMED OUSAID BELKHIR	\N	\N	\N	\N	\N	\N	\N	\N
405	BEY ALOOUET	\N	\N	\N	\N	\N	\N	\N	\N
406	BOUGUETAYA Z	\N	\N	\N	\N	\N	\N	\N	\N
407	KEDJAM ABDELLAH	\N	\N	\N	\N	\N	\N	\N	\N
408	M. ADJOU	\N	\N	\N	\N	\N	\N	\N	\N
409	K. GHAMOUD	\N	\N	\N	\N	\N	\N	\N	\N
410	MOUFFOK Mohamed El Hadi	\N	\N	\N	\N	\N	\N	\N	\N
411	HAFIDI.T	\N	\N	\N	\N	\N	\N	\N	\N
412	Mr CHERIET Mohamed faouzi	\N	\N	\N	\N	\N	\N	\N	\N
413	GUESBAYA	\N	\N	\N	\N	\N	\N	\N	\N
414	BOUFETOUHA Youcef	\N	\N	\N	\N	\N	\N	\N	\N
415	BELKESSA Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
416	B. ZENAGHI	\N	\N	\N	\N	\N	\N	\N	\N
417	MOHAMMED OUSAID Belkheir	\N	\N	\N	\N	\N	\N	\N	\N
418	SPA ORGM & SPA SOMIFER	\N	\N	\N	\N	\N	\N	\N	\N
419	LAMAR Chabane	\N	\N	\N	\N	\N	\N	\N	\N
420	GHODBANE Ammar	\N	\N	\N	\N	\N	\N	\N	\N
421	KOUILI ABDELBAKI	\N	\N	\N	\N	\N	\N	\N	\N
422	DJERIBI DJAMEL	\N	\N	\N	\N	\N	\N	\N	\N
423	lamara chabane	\N	\N	\N	\N	\N	\N	\N	\N
424	BOUTRID ABDELAZIZ	\N	\N	\N	\N	\N	\N	\N	\N
425	Mr BELKESSA Kamel	\N	\N	\N	\N	\N	\N	\N	\N
426	MAHAMMED OUSAID Belkheir	\N	\N	\N	\N	\N	\N	\N	\N
427	Cheriet Med Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
428	Mr B. ZENAGHI	\N	\N	\N	\N	\N	\N	\N	\N
429	BOUSNANE FOUAD	\N	\N	\N	\N	\N	\N	\N	\N
430	LADJOUZI WAHBA	\N	\N	\N	\N	\N	\N	\N	\N
431	BOUGUETTAYA Zouhir	\N	\N	\N	\N	\N	\N	\N	\N
432	BOUNABI Aissa	\N	\N	\N	\N	\N	\N	\N	\N
433	SAADAOUI Salah	\N	\N	\N	\N	\N	\N	\N	\N
434	BENABDELMOUMEN Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
435	Mr MAHAMMED OUSSAID Belkheir	\N	\N	\N	\N	\N	\N	\N	\N
436	SARL KOU.G.C	\N	\N	\N	\N	\N	\N	\N	\N
437	BENOUARETH Kamel	\N	\N	\N	\N	\N	\N	\N	\N
438	AIT TAYEB Ameziane	\N	\N	\N	\N	\N	\N	\N	\N
439	SAADA HAMID	\N	\N	\N	\N	\N	\N	\N	\N
440	MAHAMMAD OUSAID Belkheir	\N	\N	\N	\N	\N	\N	\N	\N
441	Mr BEY Aliouet	\N	\N	\N	\N	\N	\N	\N	\N
442	HANNI Abdelghani	\N	\N	\N	\N	\N	\N	\N	\N
443	GOLDIM	\N	\N	\N	\N	\N	\N	\N	\N
444	K. BELKESSA	\N	\N	\N	\N	\N	\N	\N	\N
445	HAMRIT WAKIL	\N	\N	\N	\N	\N	\N	\N	\N
446	Mr HARKET Abdelhak	\N	\N	\N	\N	\N	\N	\N	\N
447	M.A. AIT TAYEB	\N	\N	\N	\N	\N	\N	\N	\N
448	GHODBANE AMMAR	\N	\N	\N	\N	\N	\N	\N	\N
449	AMIORUCHE Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
450	H. SAADA	\N	\N	\N	\N	\N	\N	\N	\N
451	BOURAS ZINE	\N	\N	\N	\N	\N	\N	\N	\N
452	LCM	\N	\N	\N	\N	\N	\N	\N	\N
453	MERABET El Djoudi	\N	\N	\N	\N	\N	\N	\N	\N
454	Mr Kamel GHAMOUD	\N	\N	\N	\N	\N	\N	\N	\N
455	DEBBAGE ABDELLAH	\N	\N	\N	\N	\N	\N	\N	\N
456	Bounab khaled	\N	\N	\N	\N	\N	\N	\N	\N
457	ZENNAKI Sid Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
458	Cheriet Mohmed Fouzi	\N	\N	\N	\N	\N	\N	\N	\N
459	Mr M. MOHEMMEDI	\N	\N	\N	\N	\N	\N	\N	\N
460	benouareth kamel	\N	\N	\N	\N	\N	\N	\N	\N
461	Mr M. MEZOUH	\N	\N	\N	\N	\N	\N	\N	\N
462	BOUTOUHA Youcef	\N	\N	\N	\N	\N	\N	\N	\N
463	MAHAMMAD OUSAID Belkhir	\N	\N	\N	\N	\N	\N	\N	\N
464	NAHNOUH Boubaker	\N	\N	\N	\N	\N	\N	\N	\N
465	LABCHRI Dahbia	\N	\N	\N	\N	\N	\N	\N	\N
466	SPA EPE CETIM	\N	\N	\N	\N	\N	\N	\N	\N
467	ARIF smail	\N	\N	\N	\N	\N	\N	\N	\N
468	LAGOUNE MOHAMEDS	\N	\N	\N	\N	\N	\N	\N	\N
469	REGUIBI, Abdelmalek	\N	\N	\N	\N	\N	\N	\N	\N
470	ZENEGUI Bounouar	\N	\N	\N	\N	\N	\N	\N	\N
471	Z. BOUGHEUTTAYA	\N	\N	\N	\N	\N	\N	\N	\N
472	S.A. HADJ SADDOK	\N	\N	\N	\N	\N	\N	\N	\N
473	SPA EPE ENOF & SPA EPE ORGM	\N	\N	\N	\N	\N	\N	\N	\N
474	SABAA Mohamed	\N	\N	\N	\N	\N	\N	\N	\N
475	Mr REGUIBI Abdelmalek	\N	\N	\N	\N	\N	\N	\N	\N
476	Lakhder Mostefaoui	\N	\N	\N	\N	\N	\N	\N	\N
477	Ait Tayeb Mohand Ameziane	\N	\N	\N	\N	\N	\N	\N	\N
478	boutiche ahmed	\N	\N	\N	\N	\N	\N	\N	\N
479	LAAMARA Chabane	\N	\N	\N	\N	\N	\N	\N	\N
480	Shaolin mines	\N	\N	\N	\N	\N	\N	\N	\N
481	Mr MOSTEFAOUI Lakhdar	\N	\N	\N	\N	\N	\N	\N	\N
482	HIBBER Aissa	\N	\N	\N	\N	\N	\N	\N	\N
483	BENSALEH Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
484	DJEBABRIA FAIZA Eps ACHOURI	\N	\N	\N	\N	\N	\N	\N	\N
485	ZAAGANE Mansour	\N	\N	\N	\N	\N	\N	\N	\N
486	 LADJOUZI WAHIBA	\N	\N	\N	\N	\N	\N	\N	\N
487	IZRI Dahbia	\N	\N	\N	\N	\N	\N	\N	\N
488	HIBER, Aissa	\N	\N	\N	\N	\N	\N	\N	\N
489	L. MOSTEFAOUI	\N	\N	\N	\N	\N	\N	\N	\N
490	Mr W. HAMRIT	\N	\N	\N	\N	\N	\N	\N	\N
491	Mr BOUFETTOUHA	\N	\N	\N	\N	\N	\N	\N	\N
492	Ajou Mokhtar	\N	\N	\N	\N	\N	\N	\N	\N
493	HESBELAOUI Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
494	Mr M. ADJOU	\N	\N	\N	\N	\N	\N	\N	\N
495	BEN TAYEB HOCINE	\N	\N	\N	\N	\N	\N	\N	\N
496	NEDJAR Mourad	\N	\N	\N	\N	\N	\N	\N	\N
497	LAMARARA CHABANE	\N	\N	\N	\N	\N	\N	\N	\N
498	ZENNAKI, Ahmed	\N	\N	\N	\N	\N	\N	\N	\N
499	SILHADA Khadidja	\N	\N	\N	\N	\N	\N	\N	\N
500	CHERIET Mohapmed Faouzi	\N	\N	\N	\N	\N	\N	\N	\N
501	CEVITAL MINERALS	\N	\N	\N	\N	\N	\N	\N	\N
502	BOUGUETAYA Zohir	\N	\N	\N	\N	\N	\N	\N	\N
503	BERKAT MOHAMED	\N	\N	\N	\N	\N	\N	\N	\N
504	ladjouzi wahiba	\N	\N	\N	\N	\N	\N	\N	\N
505	Bey ALIOUAT	\N	\N	\N	\N	\N	\N	\N	\N
506	GHODBANE Amar	\N	\N	\N	\N	\N	\N	\N	\N
507	SEBA Mhamed	\N	\N	\N	\N	\N	\N	\N	\N
508	BOUFASSA Azeddine	\N	\N	\N	\N	\N	\N	\N	\N
509	MOSTFAOUI Lakhdar	\N	\N	\N	\N	\N	\N	\N	\N
510	LAADJOUZI WAHIBA	\N	\N	\N	\N	\N	\N	\N	\N
511	SOMIBAR	\N	\N	\N	\N	\N	\N	\N	\N
512	ARIF Ismail	\N	\N	\N	\N	\N	\N	\N	\N
513	mostefaoui Lakhdar	\N	\N	\N	\N	\N	\N	\N	\N
514	DJERIBI, Djamel	\N	\N	\N	\N	\N	\N	\N	\N
515	DJIRIBI DJAMAL	\N	\N	\N	\N	\N	\N	\N	\N
516	Mr DRAGH LOTFI	\N	\N	\N	\N	\N	\N	\N	\N
517	SBAA MOHMED	\N	\N	\N	\N	\N	\N	\N	\N
518	Mr ALIOUAT BEY	\N	\N	\N	\N	\N	\N	\N	\N
519	SPA OFFICE NATIONAL DE RECHERCHE GEOLOGIQUE ET MINIERE	\N	\N	\N	\N	\N	\N	\N	\N
520	MORSI Mustapha	\N	\N	\N	\N	\N	\N	\N	\N
521	LAKHDAR MOSTEFAOUI	\N	\N	\N	\N	\N	\N	\N	\N
522	HAFIDI	\N	\N	\N	\N	\N	\N	\N	\N
523	BOUGUTTAYA Zoheir	\N	\N	\N	\N	\N	\N	\N	\N
524	GHAMOUD KAMEL	\N	\N	\N	\N	\N	\N	\N	\N
525	LAADJOUZI Wahiba	\N	\N	\N	\N	\N	\N	\N	\N
526	CHERIET MED FAOUZI	\N	\N	\N	\N	\N	\N	\N	\N
527	BOUALEM Mohammed	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: fonctionpersonnemoral; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fonctionpersonnemoral (id_detenteur, id_personne, type_fonction, statut_personne, taux_participation) FROM stdin;
394	1	Representant	Actif	50
394	2	Actionnaire	Actif	50
\.


--
-- Data for Name: fusionPermisSource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."fusionPermisSource" (id_permis, id_fusion) FROM stdin;
\.


--
-- Data for Name: inscription_provisoire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscription_provisoire (id, id_proc, id_demande, points, system, zone, hemisphere, superficie_declaree, "createdAt", "updatedAt") FROM stdin;
1	1	1	[{"x": 500145, "y": 400587, "z": 0, "zone": 31, "system": "UTM", "hemisphere": "N"}, {"x": 500685, "y": 401599, "z": 0, "zone": 31, "system": "UTM", "hemisphere": "N"}, {"x": 501148, "y": 400184, "z": 0, "zone": 31, "system": "UTM", "hemisphere": "N"}]	UTM	31	N	65	2025-10-19 21:34:02.538	2025-10-19 22:35:27.608
\.


--
-- Data for Name: nationalite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nationalite (id_nationalite, libelle) FROM stdin;
1	Afghan(e)
2	Albanais(e)
3	Antarctique
4	Algérien(ne)
5	Samoan(e) américain(e)
6	Andorran(e)
7	Angolais(e)
8	Antiguayen(ne) et Barbudan(e)
9	Azerbaïdjanais(e)
10	Argentin(e)
11	Australien(ne)
12	Autrichien(ne)
13	Bahaméen(ne)
14	Bahreïnien(ne)
15	Bangladais(e)
16	Arménien(ne)
17	Barbadien(ne)
18	Belge
19	Bermudien(ne)
20	Bhoutanais(e)
21	Bolivien(ne)
22	Bosnien(ne)
23	Botswanais(e)
24	Bouvetien(ne)
25	Brésilien(ne)
26	Bélizien(ne)
27	Britannique
28	Salomonien(ne)
29	Brunéien(ne)
30	Bulgare
31	Birman(e)
32	Burundais(e)
33	Biélorusse
34	Cambodgien(ne)
35	Camerounais(e)
36	Canadien(ne)
37	Cap-Verdien(ne)
38	Caïmanien(ne)
39	Centrafricain(e)
40	Sri-Lankais(e)
41	Tchadien(ne)
42	Chilien(ne)
43	Chinois(e)
44	Taïwanais(e)
45	Christmasien(ne)
46	Cocosien(ne)
47	Colombien(ne)
48	Comorien(ne)
49	Mahorais(e)
50	Congolais(e)
51	Cookien(ne)
52	Costaricien(ne)
53	Croate
54	Cubain(e)
55	Chypriote
56	Tchèque
57	Béninois(e)
58	Danois(e)
59	Dominiquais(e)
60	Dominicain(e)
61	Équatorien(ne)
62	Salvadorien(ne)
63	Équato-Guinéen(ne)
64	Éthiopien(ne)
65	Érythréen(ne)
66	Estonien(ne)
67	Féroïen(ne)
68	Falklandais(e)
69	Géorgien(ne)
70	Fidjien(ne)
71	Finlandais(e)
72	Ålandais(e)
73	Français(e)
74	Djiboutien(ne)
75	Gabonnais(e)
76	Gambien(ne)
77	Palestinien(ne)
78	Allemand(e)
79	Ghanéen(ne)
80	Gibraltarien(ne)
81	Kiribatien(ne)
82	Grec(que)
83	Groenlandais(e)
84	Grenadien(ne)
85	Guadeloupéen(ne)
86	Guamien(ne)
87	Guatémaltèque
88	Guinéen(ne)
89	Guyanien(ne)
90	Haïtien(ne)
91	Heardien(ne)
92	Vaticanais(e)
93	Hondurien(ne)
94	Hongkongais(e)
95	Hongrois(e)
96	Islandais(e)
97	Indien(ne)
98	Indonésien(ne)
99	Iranien(ne)
100	Irakien(ne)
101	Irlandais(e)
102	Italien(ne)
103	Ivoirien(ne)
104	Jamaïcain(e)
105	Japonais(e)
106	Kazakh(e)
107	Jordanien(ne)
108	Kényan(ne)
109	Nord-Coréen(ne)
110	Sud-Coréen(ne)
111	Koweïtien(ne)
112	Kirghiz(e)
113	Laotien(ne)
114	Libanais(e)
115	Lesothan(e)
116	Letton(ne)
117	Libérien(ne)
118	Libyen(ne)
119	Liechtensteinois(e)
120	Lituanien(ne)
121	Luxembourgeois(e)
122	Macaotais(e)
123	Malagasy
124	Malawien(ne)
125	Malaisien(ne)
126	Maldivien(ne)
127	Malien(ne)
128	Maltais(e)
129	Martiniquais(e)
130	Mauritanien(ne)
131	Mauricien(ne)
132	Mexicain(e)
133	Monégasque
134	Mongol(e)
135	Moldave
136	Montserratien(ne)
137	Marocain(e)
138	Mozambicain(e)
139	Omanais(e)
140	Namibien(ne)
141	Nauruan(ne)
142	Népalais(e)
143	Néerlandais(e)
144	Arubais(e)
145	Calédonien(ne)
146	Vanuatais(e)
147	Néo-Zélandais(e)
148	Nicaraguayen(ne)
149	Nigérien(ne)
150	Nigérian(ne)
151	Niuéen(ne)
152	Norfolkien(ne)
153	Norvégien(ne)
154	Mariannais(e)
155	Américain(e)
156	Micronésien(ne)
157	Marshallais(e)
158	Paluan(e)
159	Pakistanais(e)
160	Panaméen(ne)
161	Papou(nne)
162	Paraguayen(ne)
163	Péruvien(ne)
164	Philippin(e)
165	Pitcairnais(e)
166	Polonais(e)
167	Portugais(e)
168	Guinéo-Bissau
169	Timorais(e)
170	Portoricain(e)
171	Qatarien(ne)
172	Réunionnais(e)
173	Roumain(e)
174	Russe
175	Rwandais(e)
176	Saint-Hélénien(ne)
177	Kittitien(ne)
178	Anguillien(ne)
179	Saint-Lucien(ne)
180	Saint-Pierrais(e)
181	Saint-Vincentais(e)
182	Saint-Marinais(e)
183	Santoméen(ne)
184	Saoudien(ne)
185	Sénégalais(e)
186	Seychellois(e)
187	Sierra-Léonais(e)
188	Singapourien(ne)
189	Slovaque
190	Vietnamien(ne)
191	Slovène
192	Somalien(ne)
193	Sud-Africain(e)
194	Zimbabwéen(ne)
195	Espagnol(e)
196	Sahraoui(e)
197	Soudanais(e)
198	Surinamien(ne)
199	Svalbardien(ne)
200	Swazi(e)
201	Suédois(e)
202	Suisse
203	Syrien(ne)
204	Tadjik(e)
205	Thaïlandais(e)
206	Togolais(e)
207	Tokélais(e)
208	Tongien(ne)
209	Trinidadien(ne)
210	Émirati(e)
211	Tunisien(ne)
212	Turc(que)
213	Turkmène
214	Turks-et-Caiquois(e)
215	Tuvaluan(e)
216	Ougandais(e)
217	Ukrainien(ne)
218	Macédonien(ne)
219	Égyptien(ne)
220	Manx(e)
221	Tanzanien(ne)
222	Burkinabé
223	Uruguayen(ne)
224	Ouzbek(e)
225	Vénézuélien(ne)
226	Wallisien(ne)
227	Samoan(ne)
228	Yéménite
229	Serbe
230	Zambien(ne)
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, title, message, "isRead", "relatedEntityId", "relatedEntityType", "expertId", "createdAt", priority) FROM stdin;
\.


--
-- Data for Name: obligationfiscale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.obligationfiscale (id, "id_typePaiement", id_permis, annee_fiscale, montant_attendu, date_echeance, statut, details_calcul) FROM stdin;
1	1	1	2025	1500000	2025-11-20 23:00:00	A_payer	\N
2	2	1	2025	75000	2025-11-20 23:00:00	A_payer	\N
3	3	1	2025	2232.6	2025-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":2.4,"taxeAnnuelle":11163,"taxeAPayer":2232.6,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
4	3	1	2026	11163	2026-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
5	3	1	2027	11163	2027-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
6	3	1	2028	11163	2028-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
7	3	1	2029	11163	2029-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
8	3	1	2030	11163	2030-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
9	3	1	2031	11163	2031-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
10	3	1	2032	11163	2032-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
11	3	1	2033	11163	2033-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
12	3	1	2034	11163	2034-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
13	3	1	2035	11163	2035-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
14	3	1	2036	11163	2036-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
15	3	1	2037	11163	2037-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
16	3	1	2038	11163	2038-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
17	3	1	2039	11163	2039-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
18	3	1	2040	11163	2040-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
19	3	1	2041	11163	2041-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
20	3	1	2042	11163	2042-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
21	3	1	2043	11163	2043-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
22	3	1	2044	11163	2044-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
23	3	1	2045	11163	2045-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
24	3	1	2046	11163	2046-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
25	3	1	2047	11163	2047-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
26	3	1	2048	11163	2048-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
27	3	1	2049	20186.4	2049-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":21.7,"taxeAnnuelle":11163,"taxeAPayer":20186.425,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
28	1	1	2025	1500000	2025-11-20 23:00:00	A_payer	\N
29	2	1	2025	75000	2025-11-20 23:00:00	A_payer	\N
30	3	1	2025	2232.6	2025-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":2.4,"taxeAnnuelle":11163,"taxeAPayer":2232.6,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
31	3	1	2026	11163	2026-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
32	3	1	2027	11163	2027-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
33	3	1	2028	11163	2028-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
34	3	1	2029	11163	2029-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
35	3	1	2030	11163	2030-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
36	3	1	2031	11163	2031-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
37	3	1	2032	11163	2032-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
38	3	1	2033	11163	2033-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
39	3	1	2034	11163	2034-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
40	3	1	2035	11163	2035-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
41	3	1	2036	11163	2036-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
42	3	1	2037	11163	2037-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
43	3	1	2038	11163	2038-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
44	3	1	2039	11163	2039-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
45	3	1	2040	11163	2040-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
46	3	1	2041	11163	2041-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
47	3	1	2042	11163	2042-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
48	3	1	2043	11163	2043-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
49	3	1	2044	11163	2044-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
50	3	1	2045	11163	2045-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
51	3	1	2046	11163	2046-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
52	3	1	2047	11163	2047-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
53	3	1	2048	11163	2048-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":12,"taxeAnnuelle":11163,"taxeAPayer":11163,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
54	3	1	2049	20186.4	2049-12-30 23:00:00	A_payer	{"droitFixe":5000,"droitProportionnel":100,"superficie":61.63,"mois":21.7,"taxeAnnuelle":11163,"taxeAPayer":20186.425,"periodeType":"initial","isRenewal":false,"renewalDuration":25}
\.


--
-- Data for Name: paiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paiement (id, id_obligation, montant_paye, devise, date_paiement, mode_paiement, num_quittance, etat_paiement, justificatif_url, num_perc, "date_remisOp", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pays (id_pays, code_pays, nom_pays) FROM stdin;
1	AF	Afghanistan
2	AL	Albanie
3	AQ	Antarctique
4	DZ	Algérie
5	AS	Samoa Américaines
6	AD	Andorre
7	AO	Angola
8	AG	Antigua-et-Barbuda
9	AZ	Azerbaïdjan
10	AR	Argentine
11	AU	Australie
12	AT	Autriche
13	BS	Bahamas
14	BH	Bahreïn
15	BD	Bangladesh
16	AM	Arménie
17	BB	Barbade
18	BE	Belgique
19	BM	Bermudes
20	BT	Bhoutan
21	BO	Bolivie
22	BA	Bosnie-Herzégovine
23	BW	Botswana
24	BV	Île Bouvet
25	BR	Brésil
26	BZ	Belize
27	IO	Territoire Britannique de l'Océan Indien
28	SB	Îles Salomon
29	VG	Îles Vierges Britanniques
30	BN	Brunéi Darussalam
31	BG	Bulgarie
32	MM	Myanmar
33	BI	Burundi
34	BY	Biélorussie
35	KH	Cambodge
36	CM	Cameroun
37	CA	Canada
38	CV	Cap-Vert
39	KY	Îles Caïmanes
40	CF	République Centrafricaine
41	LK	Sri Lanka
42	TD	Tchad
43	CL	Chili
44	CN	Chine
45	TW	Taïwan
46	CX	Île Christmas
47	CC	Îles Cocos (Keeling)
48	CO	Colombie
49	KM	Comores
50	YT	Mayotte
51	CG	République du Congo
52	CD	République Démocratique du Congo
53	CK	Îles Cook
54	CR	Costa Rica
55	HR	Croatie
56	CU	Cuba
57	CY	Chypre
58	CZ	République Tchèque
59	BJ	Bénin
60	DK	Danemark
61	DM	Dominique
62	DO	République Dominicaine
63	EC	Équateur
64	SV	El Salvador
65	GQ	Guinée Équatoriale
66	ET	Éthiopie
67	ER	Érythrée
68	EE	Estonie
69	FO	Îles Féroé
70	FK	Îles (Malvinas) Falkland
71	GS	Géorgie du Sud et les Îles Sandwich du Sud
72	FJ	Fidji
73	FI	Finlande
74	AX	Îles Åland
75	FR	France
76	GF	Guyane Française
77	PF	Polynésie Française
78	TF	Terres Australes Françaises
79	DJ	Djibouti
80	GA	Gabon
81	GE	Géorgie
82	GM	Gambie
83	PS	Territoire Palestinien Occupé
84	DE	Allemagne
85	GH	Ghana
86	GI	Gibraltar
87	KI	Kiribati
88	GR	Grèce
89	GL	Groenland
90	GD	Grenade
91	GP	Guadeloupe
92	GU	Guam
93	GT	Guatemala
94	GN	Guinée
95	GY	Guyana
96	HT	Haïti
97	HM	Îles Heard et McDonald
98	VA	Saint-Siège (État de la Cité du Vatican)
99	HN	Honduras
100	HK	Hong-Kong
101	HU	Hongrie
102	IS	Islande
103	IN	Inde
104	ID	Indonésie
105	IR	République Islamique d'Iran
106	IQ	Iraq
107	IE	Irlande
108	IT	Italie
109	CI	Côte d'Ivoire
110	JM	Jamaïque
111	JP	Japon
112	KZ	Kazakhstan
113	JO	Jordanie
114	KE	Kenya
115	KP	République Populaire Démocratique de Corée
116	KR	République de Corée
117	KW	Koweït
118	KG	Kirghizistan
119	LA	République Démocratique Populaire Lao
120	LB	Liban
121	LS	Lesotho
122	LV	Lettonie
123	LR	Libéria
124	LY	Jamahiriya Arabe Libyenne
125	LI	Liechtenstein
126	LT	Lituanie
127	LU	Luxembourg
128	MO	Macao
129	MG	Madagascar
130	MW	Malawi
131	MY	Malaisie
132	MV	Maldives
133	ML	Mali
134	MT	Malte
135	MQ	Martinique
136	MR	Mauritanie
137	MU	Maurice
138	MX	Mexique
139	MC	Monaco
140	MN	Mongolie
141	MD	République de Moldova
142	MS	Montserrat
143	MA	Maroc
144	MZ	Mozambique
145	OM	Oman
146	NA	Namibie
147	NR	Nauru
148	NP	Népal
149	NL	Pays-Bas
150	AN	Antilles Néerlandaises
151	AW	Aruba
152	NC	Nouvelle-Calédonie
153	VU	Vanuatu
154	NZ	Nouvelle-Zélande
155	NI	Nicaragua
156	NE	Niger
157	NG	Nigéria
158	NU	Niué
159	NF	Île Norfolk
160	NO	Norvège
161	MP	Îles Mariannes du Nord
162	UM	Îles Mineures Éloignées des États-Unis
163	FM	États Fédérés de Micronésie
164	MH	Îles Marshall
165	PW	Palaos
166	PK	Pakistan
167	PA	Panama
168	PG	Papouasie-Nouvelle-Guinée
169	PY	Paraguay
170	PE	Pérou
171	PH	Philippines
172	PN	Pitcairn
173	PL	Pologne
174	PT	Portugal
175	GW	Guinée-Bissau
176	TL	Timor-Leste
177	PR	Porto Rico
178	QA	Qatar
179	RE	Réunion
180	RO	Roumanie
181	RU	Fédération de Russie
182	RW	Rwanda
183	SH	Sainte-Hélène
184	KN	Saint-Kitts-et-Nevis
185	AI	Anguilla
186	LC	Sainte-Lucie
187	PM	Saint-Pierre-et-Miquelon
188	VC	Saint-Vincent-et-les Grenadines
189	SM	Saint-Marin
190	ST	Sao Tomé-et-Principe
191	SA	Arabie Saoudite
192	SN	Sénégal
193	SC	Seychelles
194	SL	Sierra Leone
195	SG	Singapour
196	SK	Slovaquie
197	VN	Viet Nam
198	SI	Slovénie
199	SO	Somalie
200	ZA	Afrique du Sud
201	ZW	Zimbabwe
202	ES	Espagne
203	EH	Sahara Occidental
204	SD	Soudan
205	SR	Suriname
206	SJ	Svalbard et Île Jan Mayen
207	SZ	Swaziland
208	SE	Suède
209	CH	Suisse
210	SY	République Arabe Syrienne
211	TJ	Tadjikistan
212	TH	Thaïlande
213	TG	Togo
214	TK	Tokelau
215	TO	Tonga
216	TT	Trinité-et-Tobago
217	AE	Émirats Arabes Unis
218	TN	Tunisie
219	TR	Turquie
220	TM	Turkménistan
221	TC	Îles Turks et Caïques
222	TV	Tuvalu
223	UG	Ouganda
224	UA	Ukraine
225	MK	L'ex-République Yougoslave de Macédoine
226	EG	Égypte
227	GB	Royaume-Uni
228	IM	Île de Man
229	TZ	République-Unie de Tanzanie
230	US	États-Unis
231	VI	Îles Vierges des États-Unis
232	BF	Burkina Faso
233	UY	Uruguay
234	UZ	Ouzbékistan
235	VE	Venezuela
236	WF	Wallis et Futuna
237	WS	Samoa
238	YE	Yémen
239	CS	Serbie-et-Monténégro
240	ZM	Zambie
\.


--
-- Data for Name: permis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permis (id, "id_typePermis", id_commune, id_detenteur, id_statut, code_permis, date_adjudication, date_octroi, date_expiration, date_annulation, date_renonciation, duree_validite, "lieu_ditFR", "lieu_ditAR", mode_attribution, superficie, utilisation, invest_prevu, invest_real, montant_offre, statut_juridique_terrain, duree_prevue_travaux, date_demarrage_travaux, statut_activites, nombre_renouvellements, hypothec, nom_projet, volume_prevu, date_conversion_permis, commentaires) FROM stdin;
1	3	914	394	1	PXM-2025-1	\N	2025-10-21 08:51:37.962	2050-10-21 08:51:37.96	\N	\N	25	uhiu	hiu	\N	61.63		\N	\N	\N	Domaine public	5	2025-10-10 00:00:00	EN_COURS	0	\N	\N	\N	\N	\N
\.


--
-- Data for Name: permis_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permis_templates (id, name, elements, "typePermisId", "permisId", "createdAt", "updatedAt", version) FROM stdin;
\.


--
-- Data for Name: personnephysique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personnephysique (id_personne, id_pays, id_nationalite, "nomFR", "nomAR", "prenomFR", "prenomAR", date_naissance, lieu_naissance, nationalite, adresse_domicile, telephone, fax, email, qualification, num_carte_identite, lieu_juridique_soc, ref_professionnelles) FROM stdin;
1	4	4	mabrouki	mabrouki	aicha	aicha	2025-10-19 21:29:40.47		Algérien(ne)		0797887810	0550540652	moussaazzi00@gmail.com	Gérant	5879888		
2	75	4	VELIZY		APPART		2025-10-19 21:31:49.691	iuhuyg	Algérien(ne)					good	84789		
\.


--
-- Data for Name: phase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phase (id_phase, libelle, ordre, description, "dureeEstimee", "typeProcedureId") FROM stdin;
1	Enregistrement de la demande	1	\N	\N	1
2	Vérification cadastrale	2	\N	\N	1
3	Enquete Wali	3	\N	\N	1
4	Comité de direction	4	\N	\N	1
5	Génération du permis	5	\N	\N	1
6	Finalisation	6	\N	\N	1
7	Soumission	1	\N	\N	2
8	Vérification	2	\N	\N	2
9	Approbation	3	\N	\N	2
\.


--
-- Data for Name: procedure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedure (id_proc, id_seance, num_proc, date_debut_proc, date_fin_proc, statut_proc, resultat, observations, "typeProcedureId") FROM stdin;
1	1	PXM-2025-1	2025-10-19 21:02:12.58	\N	EN_COURS	\N	Superficie mise à jour: 48.13 m²	\N
\.


--
-- Data for Name: procedure_etape; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedure_etape (id_proc, id_etape, statut, date_debut, date_fin, link) FROM stdin;
1	1	TERMINEE	2025-10-19 21:02:13.036	2025-10-19 21:02:27.999	/demande/step1/page1?id=1
1	2	TERMINEE	2025-10-19 21:02:35.971	2025-10-19 21:32:08.822	/demande/step2/page2?id=1
1	3	TERMINEE	2025-10-19 21:32:10.683	2025-10-19 21:32:28.797	/demande/step3/page3?id=1
1	5	EN_COURS	2025-10-19 21:34:31.707	\N	/demande/step5/page5?id=1
1	4	TERMINEE	2025-10-19 21:32:30.222	2025-10-19 22:35:26.757	/demande/step4/page4?id=1
1	6	EN_COURS	2025-10-20 00:34:54.005	\N	/demande/step6/page6?id=1
1	7	EN_COURS	2025-10-20 23:02:01.055	\N	/demande/step7/page7?id=1
1	8	TERMINEE	2025-10-21 08:51:45.765	2025-10-21 08:51:45.765	\N
\.


--
-- Data for Name: procedure_phase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedure_phase (id_proc, id_phase, ordre, statut) FROM stdin;
1	6	6	EN_ATTENTE
1	2	2	EN_COURS
1	1	1	TERMINEE
1	3	3	EN_COURS
1	4	4	EN_COURS
1	5	5	TERMINEE
\.


--
-- Data for Name: rapport_activite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rapport_activite (id_rapport, id_permis, date_remise_reelle, etat_activite, leve_topo_3112, leve_topo_3006, plan_exploitation, date_debut_travaux, vente_exportation, importation, valeur_equipement_acquis, pros_expl_entamee, avancee_travaux, travaux_realises, nbr_ouvrages, volume, resume_activites, investissements_realises, qte_explosifs, "qte_explosifs_DIM", detonateurs, dmr, cordeau_detonant, meche_lente, relais, "DEI", effectif_cadre, effectif_maitrise, effectif_execution, production_toutvenant, production_marchande, production_vendue, production_stocke, "stock_T_V", stock_produit_marchand, production_sable, poussieres, rejets_laverie, fumee_gaz, autres_effluents, nbr_accidents, accidents_mortels, accidents_non_mortels, nbrs_jours_perdues, taux_frequence, taux_gravite, nbrs_incidents, nbrs_malades_pro, remise_etat_realisee, cout_remise_etat, commentaires_generaux, rapport_url) FROM stdin;
\.


--
-- Data for Name: redevance_bareme; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.redevance_bareme (id_redevance, taux_redevance, valeur_marchande, unite, devise, description) FROM stdin;
1	250	20	tonnes	DZD	
\.


--
-- Data for Name: registrecommerce; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrecommerce (id, id_detenteur, numero_rc, date_enregistrement, capital_social, nis, nif, adresse_legale) FROM stdin;
2884	394	54574886	2025-10-17 00:00:00	848	2024	000116239005354	setif
1	4936	22/00 - 0024277 B 16	2023-12-28 00:00:00	\N	\N		\N
2	\N	12/00 0584003 B 12	2012-11-28 00:00:00	\N	\N		\N
3	3390	09 B 725488	\N	\N	\N		\N
4	3155	06 B 0583175	2007-10-24 00:00:00	\N	\N		\N
5	3831	06 B 0583175	2007-10-24 00:00:00	\N	\N		\N
6	564	02/00 0902056 B 98	2021-06-21 00:00:00	\N	\N		\N
7	3647	09 B 0364981	2009-09-15 00:00:00	\N	\N	000923036498178	\N
8	\N	08 B 0942955-08/00	2008-04-14 00:00:00	\N	\N		\N
9	3095	08 B 0364654	2016-04-18 00:00:00	\N	\N	000823036465414	\N
10	2294	00 B 0012818	2007-06-16 00:00:00	\N	\N	097916150010548000	\N
11	\N	06 B 0323026	\N	\N	\N		\N
12	3952	05/00 0224285 B 11	2021-07-07 00:00:00	\N	\N	001105022428513	\N
13	1961	99 B 0442222	2000-09-17 00:00:00	\N	\N		\N
14	3403	98 B 0122214	2004-12-12 00:00:00	\N	\N		\N
15	2242	99 B 007759	1999-05-29 00:00:00	\N	\N	09861626000239	\N
16	\N	98 B 0803033	\N	\N	\N		\N
17	385	00 B 0723153	\N	\N	\N		\N
18	\N	07 B 0242753	2007-10-29 00:00:00	\N	\N		\N
19	4176	14/00 - 0423593 B 16	2020-06-22 00:00:00	\N	\N		\N
20	2414	00 B 0014362-16/00	2018-07-22 00:00:00	\N	\N	099516120536822	\N
21	4099	14/00-0423554 B 16	2016-04-20 00:00:00	\N	\N		\N
22	2244	00 B 222682	2000-08-09 00:00:00	\N	\N		\N
23	4048	12 B 1006084	2015-07-16 00:00:00	\N	\N	001216100608472	\N
24	4182	22/00-0024250 B 16	2016-05-29 00:00:00	\N	\N	001622002425091	\N
25	2804	00 B 0064018	2003-07-14 00:00:00	\N	\N		\N
26	1840	03 B 0422616	2007-05-14 00:00:00	\N	\N		\N
27	\N	98 B 0882115	1998-12-09 00:00:00	\N	\N		\N
28	2604	01 B 0084151	2006-01-24 00:00:00	\N	\N		\N
29	2675	99/B/42999-01/38	2015-03-24 00:00:00	\N	\N		\N
30	4815	19/00-1162073 B20	2020-01-27 00:00:00	\N	\N		\N
31	2797	04B0322833	2004-10-10 00:00:00	\N	\N	000443032283355	\N
32	2414	00 B 0014362	2002-04-07 00:00:00	\N	\N		\N
33	287	99 B 0822073	1999-03-03 00:00:00	\N	\N		\N
34	4825	08/00-0943317 B23	2023-03-07 00:00:00	\N	\N		\N
35	3794	43/00 - 0322367 B 99	2016-08-29 00:00:00	\N	\N		\N
36	2690	99 B 02/0122594	2005-08-09 00:00:00	\N	\N	39057102027	\N
37	2852	07 B 0463535	2007-02-21 00:00:00	\N	\N		\N
38	340	99 B 0083189	\N	\N	\N		\N
39	3410	08 B 0842476	2008-08-27 00:00:00	\N	\N		\N
40	1587	00 B 462572	2000-04-29 00:00:00	\N	\N		\N
41	4049	00 B 462572	2000-04-29 00:00:00	\N	\N		\N
42	2951	06 B 0942852	2006-02-08 00:00:00	\N	\N		\N
43	3962	09/00 - 0808733 B 15	2023-03-22 00:00:00	\N	\N	001509080873388	\N
44	2588	99 B 0006410	2000-12-12 00:00:00	\N	\N		\N
45	1257	02 B 0222940	2014-10-08 00:00:00	\N	\N	0205429016644	\N
46	3286	03 B 0562624	2003-04-23 00:00:00	\N	\N		\N
47	3862	03 B 0562624	2003-04-23 00:00:00	\N	\N		\N
48	428	99 B 0542228	\N	\N	\N		\N
49	1099	07 B 0542989	2019-04-11 00:00:00	\N	\N		\N
50	\N	05 B 0364056	2006-01-17 00:00:00	\N	\N		\N
51	2645	98 B 0662126	2012-05-22 00:00:00	\N	\N	098229300013048	\N
52	3886	05 B 0066637 - 25/00	2019-05-20 00:00:00	\N	\N	000525006663764	\N
53	106	03 B 0106515	2008-12-17 00:00:00	\N	\N		\N
54	436	99 B 43043	1999-04-10 00:00:00	\N	\N		\N
55	797	02 B 462877	2002-06-12 00:00:00	\N	\N		\N
56	2725	00 B 0122920	2000-11-12 00:00:00	\N	\N		\N
57	4875	N°11/00-0764408B13	2021-06-02 00:00:00	\N	\N		\N
58	2379	00 B 0722946	2005-01-05 00:00:00	\N	\N		\N
59	421	01 B 0542362	\N	\N	\N		\N
60	4792	0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
61	4788	0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
62	4789	0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
63	4365	0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
64	4791	0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
65	3063	98/B/0582037	2000-05-16 00:00:00	\N	\N	099712020501543	\N
66	3054	05 B 0242583	2005-02-16 00:00:00	\N	\N		\N
67	\N	07 B 0223692 - 00/15	2015-02-03 00:00:00	\N	\N		\N
68	3223	99 B 0362754	1999-10-26 00:00:00	\N	\N		\N
69	2737	06 B 0882525	2006-10-10 00:00:00	\N	\N		\N
70	3440	28/00-0563130 B 09	2017-07-26 00:00:00	\N	\N	000928209006932	\N
71	\N	98 B 22058	\N	\N	\N		\N
72	4242	16 B 1042847	2018-10-02 00:00:00	\N	\N		\N
73	2116	03 B 0702272	\N	\N	\N		\N
74	4239	39/00-2543926 B 16	2016-03-06 00:00:00	\N	\N		\N
75	2663	04 B 0862764	2004-09-21 00:00:00	\N	\N		\N
76	2966	07 B 0263596	2007-10-23 00:00:00	\N	\N	0007135519007247	\N
77	45	00 B 0662364	\N	\N	\N		\N
78	1159	02 B 0742257	2002-01-02 00:00:00	\N	\N		\N
79	1856	0223063 B03	2012-02-09 00:00:00	\N	\N	000305459011351	\N
80	\N	14/00-0423593 B 16	2016-11-16 00:00:00	\N	\N		\N
81	1999	02 B 0084422	2002-03-12 00:00:00	\N	\N		\N
82	5027	04/00-0406926 B 23	2023-12-11 00:00:00	\N	\N	002304040692623	\N
83	2615	06 B 0542863	2015-06-16 00:00:00	\N	\N		\N
84	4339	16/00 – 0764210 B 09	2022-01-20 00:00:00	\N	\N	000944270003456	\N
85	333	99 B 62751	\N	\N	\N	09992506275195	\N
86	\N	03 B 0862697	2003-10-14 00:00:00	\N	\N		\N
87	3229	09 B 0223952	2009-02-15 00:00:00	\N	\N	96905480003135	\N
88	16	25/00-0070877 B 15	2019-04-23 00:00:00	\N	\N		\N
89	2963	04 B 0724123	2006-01-25 00:00:00	\N	\N		\N
90	4384	16/00-0970946B05	2018-02-26 00:00:00	\N	\N	000516097094649	\N
91	4258	16/00-0970946B05	2018-02-26 00:00:00	\N	\N	000516097094649	\N
92	4256	16/00-0970946B05	2018-02-26 00:00:00	\N	\N	000516097094649	\N
93	4382	16/00-0970946B05	2018-02-26 00:00:00	\N	\N	000516097094649	\N
94	\N	97 B 90976	\N	\N	\N		\N
95	999	00 B 0723061	2007-11-07 00:00:00	\N	\N	035072306136	\N
96	2715	99 B 0342285	1999-12-30 00:00:00	\N	\N		\N
97	4378	20/00-0742384B05	2016-05-16 00:00:00	\N	\N	000520030181363	\N
98	3913	09 B 0088371 - 19/00	2022-07-07 00:00:00	\N	\N	000919008837195	\N
99	2426	99 B 0942299	2005-05-29 00:00:00	\N	\N		\N
100	2412	16/00 – 0009320 B 99	2021-11-14 00:00:00	\N	\N	098909150012635	\N
101	3004	98 B 0242046	2007-03-13 00:00:00	\N	\N		\N
102	\N	06 B 0422863	2006-08-29 00:00:00	\N	\N		\N
103	1565	99 B 0542203	2005-09-17 00:00:00	\N	\N	099539010743033	\N
104	187	02 B 0662616	2012-02-19 00:00:00	\N	\N	000229066261609	\N
105	3139	26/00 – 0342854 B 05	2021-01-27 00:00:00	\N	\N	000526349005639	\N
106	2716	02 B 0882337	2011-11-29 00:00:00	\N	\N	000201010546860	\N
107	3946	04 B 0966047 - 16/00	2021-12-20 00:00:00	\N	\N	000416280981539	\N
108	4780	16/00-1010236 B15	2021-03-24 00:00:00	\N	\N	001516460303848	\N
109	3922	25/00 - 0069652 B 12	2013-12-16 00:00:00	\N	\N	001225006965276	\N
110	3643	03 B 0022819	2020-12-31 00:00:00	\N	\N	0322069013355	\N
111	4934	16/01-1016020 B 20	2021-05-31 00:00:00	\N	\N		\N
112	2576	04 B 0966047	2004-10-17 00:00:00	\N	\N		\N
113	4199	07/00 - 0242836 B 09	2017-02-19 00:00:00	\N	\N	000907010000964	\N
114	2364	6506-3/5113	\N	\N	\N		\N
115	2557	05 B 0108232	\N	\N	\N	000531029020847	\N
116	2010	99 B 0582186	2006-05-29 00:00:00	\N	\N		\N
117	2528	B99 0242190	2005-08-25 00:00:00	\N	\N		\N
118	4932	16/00-1203605 B 23	2023-06-27 00:00:00	\N	\N		\N
119	3500	09 B 0906087	\N	\N	\N		\N
120	2334	98 B 462186	1998-12-20 00:00:00	\N	\N		\N
121	163	04/00-0404221 B 06	2009-02-03 00:00:00	\N	\N		\N
122	3018	04 B 0966406	2007-12-24 00:00:00	\N	\N		\N
123	3230	05/00-0223862 B 08	2016-12-21 00:00:00	\N	\N	805199009440	\N
124	4076	07B0109234-31/00	2016-02-28 00:00:00	\N	\N		\N
125	4109	11 B 1004654 - 00/16	2013-05-27 00:00:00	\N	\N	111116100465442	\N
126	2405	98 B 0142069	2003-08-25 00:00:00	\N	\N		\N
127	\N	98 B 462066	1998-02-03 00:00:00	\N	\N		\N
128	5055	30/00-0125161-B15	2021-10-03 00:00:00	\N	\N		\N
129	4406	26/00-0342159 B 99	2015-05-14 00:00:00	\N	\N		\N
130	4966	13/00 - 0265927 B 23	2024-05-19 00:00:00	\N	\N		\N
131	2418	04 B 0242535	2004-03-17 00:00:00	\N	\N		\N
132	2798	98 B 0922271	2017-07-03 00:00:00	\N	\N	098826519000321	\N
133	4269	08/00-0943062 B 13	2018-09-26 00:00:00	\N	\N	000008019017063	\N
134	4689	19 B1047095-16/00	2019-05-08 00:00:00	\N	\N		\N
135	4424	19 B1047095-16/00	2019-05-08 00:00:00	\N	\N		\N
136	414	15/00-0046597 B 07	2014-12-30 00:00:00	\N	\N		\N
137	992	99 B 0762453	1999-05-23 00:00:00	\N	\N		\N
138	3008	99 B 0006400	2005-01-12 00:00:00	\N	\N		\N
139	500	00 B 0302373	\N	\N	\N		\N
140	3536	08 B 0978954	2019-07-10 00:00:00	\N	\N	00081609789548	\N
141	3849	01 B 0084184	2011-02-23 00:00:00	\N	\N	0119200473748	\N
142	\N	05 B 0663014	2005-01-30 00:00:00	\N	\N		\N
143	4856	12/00 - 0584647 B 18	2020-02-23 00:00:00	\N	\N		\N
144	4857	12/00 - 0584647 B 18	2020-02-23 00:00:00	\N	\N		\N
145	4858	12/00 - 0584647 B 18	2020-02-23 00:00:00	\N	\N		\N
146	4870	12/00 - 0584647 B 18	2020-02-23 00:00:00	\N	\N		\N
147	3049	14/00-0422888	2018-11-12 00:00:00	\N	\N		\N
148	4532	14/00-0422888	2018-11-12 00:00:00	\N	\N		\N
149	3643	03 B 0022819	2010-10-06 00:00:00	\N	\N	0322069013355	\N
150	4855	16/00 - 0975095 B 17	2022-03-09 00:00:00	\N	\N		\N
151	\N	06 B 0108985	2006-12-18 00:00:00	\N	\N		\N
152	1827	05 B 0724339	2015-05-31 00:00:00	\N	\N	00535200148552	\N
153	3418	04 B 0107117	2009-09-17 00:00:00	\N	\N		\N
154	2309	00 B 0763247	2005-03-16 00:00:00	\N	\N		\N
155	3293	07 B 0724943	2009-03-23 00:00:00	\N	\N		\N
156	564	02/00 0902056 B 98	2014-06-15 00:00:00	\N	\N		\N
157	3754	98 B 0102445	\N	\N	\N		\N
158	3539	10 A 0242932	\N	\N	\N		\N
159	4743	30/00-0124323	2019-03-05 00:00:00	\N	\N		\N
160	4184	13 B 0482915 - 00/40	2013-04-11 00:00:00	\N	\N	001340049001455	\N
161	2247	04 B 0422684	2004-04-18 00:00:00	\N	\N		\N
162	\N	08 B 0109873-31/00	\N	\N	\N		\N
163	\N	98 B 0502038	2007-04-01 00:00:00	\N	\N		\N
164	4189	16 B 0584485  00/12	2016-07-11 00:00:00	\N	\N	001612219004648	\N
165	1542	00 B 0142447/01	2005-05-31 00:00:00	\N	\N		\N
166	2533	99B 0722725	2004-10-24 00:00:00	\N	\N		\N
167	2191	00 B 0014030	\N	\N	\N		\N
168	4898	28/00 - 0565193 B 22	2023-11-06 00:00:00	\N	\N		\N
169	4199	07/00 - 0242836 B 09	2021-10-31 00:00:00	\N	\N	000907010000964	\N
170	\N	10 B 0323496	2010-12-02 00:00:00	\N	\N	001043039007744	\N
171	2085	99 B 102279	2000-08-15 00:00:00	\N	\N		\N
172	3799	17/00-0986312 B 10	2015-12-29 00:00:00	\N	\N	0001016209026351	\N
173	808	99 B 0862392	2004-12-01 00:00:00	\N	\N		\N
174	353	98 B 462170	\N	\N	\N		\N
175	4793	16/00-0968770	2019-05-27 00:00:00	\N	\N	000516096877030	\N
176	2527	16/00-0968770	2019-05-27 00:00:00	\N	\N	000516096877030	\N
177	4793	05 B 0968770	2016-04-19 00:00:00	\N	\N	000516096877030	\N
178	2527	05 B 0968770	2016-04-19 00:00:00	\N	\N	000516096877030	\N
179	\N	16/00 0995212 B 14	2014-04-24 00:00:00	\N	\N		\N
180	2115	12/00-0583580 B 09	2009-12-16 00:00:00	\N	\N		\N
181	3751	08 B 0725088	2008-02-27 00:00:00	\N	\N		\N
182	1362	99 B 0103310 31/00	2008-07-01 00:00:00	\N	\N	099931010331015	\N
183	2766	0583216 B 07	2007-01-22 00:00:00	\N	\N		\N
184	3458	16/00 – 0979866 B 08	2017-02-15 00:00:00	\N	\N	000816180063352	\N
185	3012	16/00 – 0979866 B 08	2017-02-15 00:00:00	\N	\N	000816180063352	\N
186	3099	08 B 0976587-16/00	2008-03-16 00:00:00	\N	\N		\N
187	2379	00 B 722946	2005-01-05 00:00:00	\N	\N		\N
188	2242	99 B 007759	2005-04-12 00:00:00	\N	\N	09861626000239	\N
189	856	99 B 0242211 07/00	2012-09-13 00:00:00	\N	\N	098407320024342	\N
190	3800	05 B 0742374	2011-06-01 00:00:00	\N	\N	000520010142661	\N
191	2331	03 B 0723870	2003-05-13 00:00:00	\N	\N		\N
192	297	99 B 0362441	1999-02-07 00:00:00	\N	\N		\N
193	3993	12 B 0726069   35/00	2012-01-19 00:00:00	\N	\N	00123507266938	\N
194	2336	06/00 - 0185230 B 06	2017-05-10 00:00:00	\N	\N		\N
195	4402	17 B 0544116  00/39	2017-04-23 00:00:00	\N	\N	001739019004346	\N
196	2639	28/00 - 0562437 B 01	2014-06-26 00:00:00	\N	\N		\N
197	3993	12 B 0726069   35/00	2019-02-03 00:00:00	\N	\N	001235072606938	\N
198	\N	07/00-0243745 B18	2020-12-03 00:00:00	\N	\N		\N
199	1034	00 B 0242275	2001-08-08 00:00:00	\N	\N		\N
200	3523	N° 22/00 - 0023507 B10	2010-02-25 00:00:00	\N	\N	001022002350787	\N
201	4539	N° 22/00 - 0023507 B10	2010-02-25 00:00:00	\N	\N	001022002350787	\N
202	4986	N° 22/00 - 0023507 B10	2010-02-25 00:00:00	\N	\N	001022002350787	\N
203	4114	01 B 0562445	2011-08-25 00:00:00	\N	\N	000128040286646	\N
204	3424	07 B 0263533	2007-03-11 00:00:00	\N	\N		\N
205	\N	04 B 0022947	\N	\N	\N		\N
206	\N	03 B 0562625	2003-05-18 00:00:00	\N	\N		\N
207	2080	99 B 0282220	2015-12-27 00:00:00	\N	\N	099910028222025	\N
208	3316	99 B 0282220	2015-12-27 00:00:00	\N	\N	099910028222025	\N
209	3816	12 B 1006084	2012-07-11 00:00:00	\N	\N	1216100608472	\N
210	1812	0502266 B 00	2000-02-07 00:00:00	\N	\N		\N
211	1565	99 B 0542203	2005-09-17 00:00:00	\N	\N	09959010748033	\N
212	131	00 B 0763323	2000-12-10 00:00:00	\N	\N		\N
213	1984	99 B 0382173	1999-10-05 00:00:00	\N	\N		\N
214	329	14/00-0423035 B 09	2009-04-04 00:00:00	\N	\N	000914042303554	\N
215	2793	08 B 0806010	2008-01-20 00:00:00	\N	\N	000809010001472	\N
216	4313	23/00 - 0365945 B 14	2014-05-06 00:00:00	\N	\N		\N
217	4340	16/00 0964595 B 04	2016-10-13 00:00:00	\N	\N		\N
218	\N	05 B 0542781	2005-12-12 00:00:00	\N	\N		\N
219	2075	04 B 0263171	\N	\N	\N		\N
220	3173	02 B 0403213	2002-12-22 00:00:00	\N	\N	195204030307941	\N
221	3405	08 B 0543082	2008-05-11 00:00:00	\N	\N		\N
222	\N	05 B 0968770	2005-01-05 00:00:00	\N	\N		\N
223	633	30/00 0122014 B 97	2014-05-19 00:00:00	\N	\N		\N
224	3374	22/00 – 0023559 B 10	2010-08-29 00:00:00	\N	\N		\N
225	2866	38/00 0702354 B 07	2011-05-11 00:00:00	\N	\N	000738070235497	\N
226	\N	94 B 750314	1974-07-24 00:00:00	\N	\N		\N
227	1637	02 B 0562489	2002-02-19 00:00:00	\N	\N	000228209006057	\N
228	3821	05 B 0583061	2005-03-15 00:00:00	\N	\N	000512058306162	\N
229	229	19/00 – 0082728 B 98	2022-01-20 00:00:00	\N	\N		\N
230	1401	98 B 0022103	2001-08-19 00:00:00	\N	\N	9822469091105	\N
231	564	98 B 0902056	2005-09-14 00:00:00	\N	\N		\N
232	2671	00 B 0322487	2006-08-06 00:00:00	\N	\N		\N
233	2538	05 B 0822230	2005-02-22 00:00:00	\N	\N	45020404039	\N
234	\N	07B0223750	2007-12-12 00:00:00	\N	\N	000705429010449	\N
235	3162	02 B 0106420	2002-12-18 00:00:00	\N	\N		\N
236	\N	6506-3/5113	\N	\N	\N		\N
237	3290	97 B 0042001	1997-07-29 00:00:00	\N	\N		\N
238	4262	05 B 0805429 - 00/09	2017-03-07 00:00:00	\N	\N		\N
239	1246	05/00 - 0222100 B 98	2019-03-27 00:00:00	\N	\N		\N
240	2951	06 B 0942852	2006-11-08 00:00:00	\N	\N		\N
241	2366	98 B 0082723	2000-08-22 00:00:00	\N	\N		\N
242	\N	08 B 0862993	2008-03-10 00:00:00	\N	\N		\N
243	\N	05/00-0226839 b23	2023-09-12 00:00:00	\N	\N	00230542500181665	\N
244	4326	08 b 0046988	2019-07-10 00:00:00	\N	\N	000815004698832	\N
245	2535	99 B 9021028	1999-09-01 00:00:00	\N	\N		\N
246	3859	37/00 0642172 B 12	2013-08-15 00:00:00	\N	\N		\N
247	4141	0125365B16	2016-05-05 00:00:00	\N	\N	001630012536594	\N
248	1498	13/00-0263211 B/ 04	2013-06-24 00:00:00	\N	\N	000413239008841	\N
249	\N	02 B 0019504	2007-02-14 00:00:00	\N	\N		\N
250	2894	07 B 0724890	2007-03-11 00:00:00	\N	\N		\N
251	3886	05 B 0066637	2014-02-20 00:00:00	\N	\N	000525006663764	\N
252	\N	01 B 16868	\N	\N	\N		\N
253	1335	98 B 0762114	2001-04-10 00:00:00	\N	\N		\N
254	4102	00 B 0602038  - 00/33	2016-12-09 00:00:00	\N	\N		\N
255	4217	09 B 0923309 -  03/00	2014-07-14 00:00:00	\N	\N		\N
256	3523	10 B 0023 507	2010-02-25 00:00:00	\N	\N		\N
257	4539	10 B 0023 507	2010-02-25 00:00:00	\N	\N		\N
258	4986	10 B 0023 507	2010-02-25 00:00:00	\N	\N		\N
259	184	99 B 0022174	2015-03-22 00:00:00	\N	\N		\N
260	406	00 B 0083602	2000-10-16 00:00:00	\N	\N		\N
261	\N	98 B 07222397	\N	\N	\N		\N
262	2194	02 B 0262959	2002-10-22 00:00:00	\N	\N	000213120920957	\N
263	2811	06/00-0185416 B 07	2012-04-18 00:00:00	\N	\N		\N
264	3398	06 B 0972281	2009-03-03 00:00:00	\N	\N		\N
265	3944	07 B 0123974	2012-07-11 00:00:00	\N	\N		\N
266	3027	07 B 0087003	2007-07-02 00:00:00	\N	\N		\N
267	235	98 B 0322137	1998-08-01 00:00:00	\N	\N		\N
268	4101	48/00 - 0163314 B 16	2020-11-23 00:00:00	\N	\N		\N
269	279	98 B 0502033	1998-05-10 00:00:00	\N	\N		\N
270	4176	14/00-0423593 B 16	2016-11-16 00:00:00	\N	\N		\N
271	1817	99 B 0183167	1999-10-21 00:00:00	\N	\N		\N
272	1519	20/00-0742361B04	2017-10-11 00:00:00	\N	\N	000420141019758	\N
273	4122	00 B 0562293-00/28	2016-05-12 00:00:00	\N	\N	099928010507136	\N
274	\N	12/00-0584911 B 21	2021-04-27 00:00:00	\N	\N	002112058491131	\N
275	1892	99 B 0122651	2020-12-01 00:00:00	\N	\N	099630049001331	\N
276	3766	12 B 0991092	2015-07-01 00:00:00	\N	\N	001216099109235	\N
277	4279	30/00 - 0124496 B 11	2019-07-28 00:00:00	\N	\N		\N
278	4770	16/00-1016949 B 21	2021-06-08 00:00:00	\N	\N		\N
279	3396	19/00-0086912 B 07	2013-10-07 00:00:00	\N	\N		\N
280	1810	99 B 0142356	1999-07-07 00:00:00	\N	\N	098321010010161	\N
281	3046	06 B 0542905	2006-07-03 00:00:00	\N	\N		\N
282	\N	06 B 0562899	2007-11-14 00:00:00	\N	\N		\N
283	2553	05 B 0364133	2005-09-27 00:00:00	\N	\N		\N
284	503	99 B 0562231 - 00/28	2015-12-31 00:00:00	\N	\N	099928056223146	\N
285	4111	98 B 062022 - 01/32	\N	\N	\N		\N
286	4391	35/00 - 0728012 B 18	2018-01-02 00:00:00	\N	\N	001835200008850	\N
287	4397	15 B 0991637  16/00	2018-11-21 00:00:00	\N	\N		\N
288	\N	99 B 0083440	2008-04-20 00:00:00	\N	\N		\N
289	960	0782047 B98	1998-05-18 00:00:00	\N	\N	195027300006937	\N
290	1892	99 B 0122651	2006-04-25 00:00:00	\N	\N	099630049001331	\N
291	2958	07 B 0263541	2007-04-14 00:00:00	\N	\N		\N
292	2614	01 B 0014877	2010-06-10 00:00:00	\N	\N	000116091487707	\N
293	3527	28/00-0562910 B 06	2019-04-09 00:00:00	\N	\N		\N
294	2294	00 B 0012818	2021-11-10 00:00:00	\N	\N	097916150010548000	\N
295	\N	99 B 222473	2003-06-11 00:00:00	\N	\N		\N
296	1163	00 B 0322392	\N	\N	\N		\N
297	\N	05 B 0162676	2005-08-31 00:00:00	\N	\N		\N
298	1981	98 B 0382051	1998-06-02 00:00:00	\N	\N		\N
299	534	01 B 0084096	2001-06-23 00:00:00	\N	\N	000119270257155	\N
300	2433	99 B 0008903	1999-12-15 00:00:00	\N	\N	98316130011447	\N
301	4536	99 B 0008903	1999-12-15 00:00:00	\N	\N	98316130011447	\N
302	1969	01 B 0014225	2005-02-12 00:00:00	\N	\N	0116001422534	\N
303	2583	98 B 222106	\N	\N	\N		\N
304	3495	27/00-0782947 B 08	2014-06-30 00:00:00	\N	\N	0827069005443	\N
305	4127	30/00-0124126 B 08	2014-06-05 00:00:00	\N	\N	000830019013355	\N
306	3224	09 B 0242836	2017-02-19 00:00:00	\N	\N	000907024283698	\N
307	4092	09 B 0242836	2017-02-19 00:00:00	\N	\N	000907024283698	\N
308	4093	09 B 0242836	2017-02-19 00:00:00	\N	\N	000907024283698	\N
309	4337	11/00-0202291 B 10	2017-02-22 00:00:00	\N	\N	00101101900156	\N
310	2946	01 B 0662474	2007-05-30 00:00:00	\N	\N	000129010458552	\N
311	3471	10 B 0023 507	2012-03-26 00:00:00	\N	\N	001022002350787	\N
312	2967	97B 0102047	1997-10-01 00:00:00	\N	\N		\N
313	4181	15 B 0225165  -  00/05	2015-02-11 00:00:00	\N	\N	001505139001749	\N
314	3289	01 B 0016091	2008-06-14 00:00:00	\N	\N		\N
315	\N	00 B 0122824	2012-09-04 00:00:00	\N	\N		\N
316	2334	0462186 B 98	2008-03-31 00:00:00	\N	\N	099234010248237	\N
317	4368	17 B 0564334	2017-05-08 00:00:00	\N	\N		\N
318	2141	98 B 62177	2011-07-07 00:00:00	\N	\N		\N
319	3186	08 B 0981468	2008-09-23 00:00:00	\N	\N	000816539059131	\N
320	\N	99 B 0009858	2006-03-28 00:00:00	\N	\N	099016233300352	\N
321	2636	97 B 0122101 - 00/30	2006-02-22 00:00:00	\N	\N	099730040263234	\N
322	4096	23/00 0363379 B 02	2015-09-22 00:00:00	\N	\N		\N
323	5012	19/00-0095871 B24	2024-06-25 00:00:00	\N	\N		\N
324	2321	01 B 0662511	2001-10-08 00:00:00	\N	\N		\N
325	3101	06 B 0971637	2007-05-16 00:00:00	\N	\N		\N
326	2714	05 B 0842352	2005-05-03 00:00:00	\N	\N		\N
327	\N	05 B 0066619	2005-09-05 00:00:00	\N	\N		\N
328	2379	96 B 750 640	\N	\N	\N		\N
329	3386	19/00 - 0088419 B 09	2019-04-11 00:00:00	\N	\N	000919008841995	\N
330	4107	16 B 0144256 - 00/21	2016-02-02 00:00:00	\N	\N		\N
331	1827	05 B 0724339 -35/00	2023-06-25 00:00:00	\N	\N	00535200148552	\N
332	649	15/00 0042350 B 98	2009-06-22 00:00:00	\N	\N	099815010411441	\N
333	2543	06 B 0742426	2006-08-23 00:00:00	\N	\N		\N
334	2667	05 B 0663014	2005-01-30 00:00:00	\N	\N		\N
335	2299	46/00-0842366 B 05	2023-01-10 00:00:00	\N	\N	00046084236631	\N
336	4144	47/00-0862967 B 07	2016-02-02 00:00:00	\N	\N		\N
337	2615	06 B 0542863	2006-02-13 00:00:00	\N	\N		\N
338	4948	N°16/00-1052420 B24	2024-02-15 00:00:00	\N	\N	002416210052850	\N
339	\N	42/00-0525644 B 22	2022-03-02 00:00:00	\N	\N		\N
340	2299	05 B 0842366	2005-01-02 00:00:00	\N	\N	00046084236631	\N
341	2718	05 B 0968611	2006-03-13 00:00:00	\N	\N		\N
342	3165	08 B 0463797	\N	\N	\N		\N
343	2305	98 A 315957	1998-12-02 00:00:00	\N	\N	193225010006946	\N
344	3999	98 A 315957	1998-12-02 00:00:00	\N	\N	193225010006946	\N
345	4339	16/00 – 0764210 B 09	2014-09-29 00:00:00	\N	\N		\N
346	1199	18/00 - 0442149 B 99	2020-01-20 00:00:00	\N	\N		\N
347	4026	00 B 0063968	2003-07-07 00:00:00	\N	\N		\N
348	106	89 B 004	\N	\N	\N		\N
349	4206	14 B 0563739 - 00/28	2018-01-03 00:00:00	\N	\N	001428179003443	\N
350	3272	48/00-0162868 B 09	2012-09-27 00:00:00	\N	\N		\N
351	2323	99 B 0009368	2002-03-26 00:00:00	\N	\N		\N
352	4917	39/00 - 1009537 B 15	2023-02-12 00:00:00	\N	\N	001516560117646	\N
353	3761	02 B 0782361	2002-04-01 00:00:00	\N	\N		\N
354	3799	10B0986312	\N	\N	\N	001016209026351	\N
355	4251	14 B 0225092  - 00/05	2014-10-19 00:00:00	\N	\N		\N
356	134	02 B 0222996	2007-10-30 00:00:00	\N	\N	000205459018345	\N
357	2676	06 B 0223537	2006-04-05 00:00:00	\N	\N		\N
358	4397	16/00 - 0991637 B 15	2021-01-17 00:00:00	\N	\N		\N
359	474	10/00-0282635 B 01	2012-03-28 00:00:00	\N	\N		\N
360	4878	n°19-02-0087605 B08	2022-02-27 00:00:00	\N	\N	0008190087605491002	\N
361	4848	11/00 - 0202701 B 22	2022-03-31 00:00:00	\N	\N	002211020270102	\N
362	2609	06 B 0702337	2006-04-04 00:00:00	\N	\N		\N
363	2615	06/00 - 0187240 B 11	2021-11-22 00:00:00	\N	\N		\N
364	4132	16 B 0683089  36/00	2016-04-11 00:00:00	\N	\N	001636219000840	\N
365	3299	07 B 0263550	\N	\N	\N		\N
366	2496	98 A 3612029	1998-04-22 00:00:00	\N	\N		\N
367	\N	98 B 0882115  00/01	2015-01-05 00:00:00	\N	\N	099801010482922	\N
368	2793	08 B 0806010	2008-01-20 00:00:00	\N	\N	0809039010157	\N
369	4969	98 B 0702044	\N	\N	\N		\N
370	393	98 B 0702044	\N	\N	\N		\N
371	4699	16/00 - 0725766 B 10	2022-11-23 00:00:00	\N	\N		\N
372	4787	16/00 - 0725766 B 10	2022-11-23 00:00:00	\N	\N		\N
373	3284	04 B 0282992	\N	\N	\N		\N
374	2225	97 B 0082143	2012-12-24 00:00:00	\N	\N		\N
375	\N	0882250 B 00	2012-01-29 00:00:00	\N	\N	00980101077962	\N
376	3471	01 B 262736	\N	\N	\N		\N
377	3851	08 B 0976991-16/01	2014-05-11 00:00:00	\N	\N		\N
378	1404	00 B 0262523	2011-10-16 00:00:00	\N	\N	099113010279530	\N
379	1066	98 B 0005100	2006-03-18 00:00:00	\N	\N		\N
380	4772	39/00-0543804 B 15	2021-06-06 00:00:00	\N	\N		\N
381	2020	28/00 - 0562715 B 04	2015-08-25 00:00:00	\N	\N		\N
382	4540	28/00 - 0562715 B 04	2015-08-25 00:00:00	\N	\N		\N
383	3915	09 B 0088177	2010-09-30 00:00:00	\N	\N	000919159056136	\N
384	4247	30/00-0124012 B 07	2014-11-16 00:00:00	\N	\N	000730149006546	\N
385	4105	14 B 0423388  - 00/14	2016-03-20 00:00:00	\N	\N	001414279000450	\N
386	4106	14 B 0423388  - 00/14	2016-03-20 00:00:00	\N	\N	001414279000450	\N
387	3899	01 B 0123001	2013-05-14 00:00:00	\N	\N	130049005457	\N
388	\N	99 B 0082891	1999-02-22 00:00:00	\N	\N		\N
389	2946	29/00-0662474 B 01	2012-05-09 00:00:00	\N	\N	000129010458552	\N
390	2925	04 B 0804724	2004-03-14 00:00:00	\N	\N	000409180317456	\N
391	2320	99 B 0322372	\N	\N	\N		\N
392	666	00 B 0302339	2000-01-03 00:00:00	\N	\N	099917109004030	\N
393	2716	02 B 0882337	2002-05-22 00:00:00	\N	\N	000201010546860	\N
394	\N	06 B 0562889	2006-09-13 00:00:00	\N	\N		\N
395	520	02 B 0017007	2002-02-17 00:00:00	\N	\N	000516010440857	\N
396	3816	12 B 1006384	2012-07-11 00:00:00	\N	\N		\N
397	4121	17/00-0303102 B 13	2013-06-12 00:00:00	\N	\N		\N
398	4120	17/00-0303102 B 13	2013-06-12 00:00:00	\N	\N		\N
399	3868	12 B 0224457	2012-02-09 00:00:00	\N	\N		\N
400	2641	02 B 0542524	2018-08-30 00:00:00	\N	\N		\N
401	1562	99 B 0542262	2005-05-04 00:00:00	\N	\N		\N
402	2602	05 B 0442688	2005-10-19 00:00:00	\N	\N		\N
403	4699	16/00-0725766B10	2016-11-17 00:00:00	\N	\N		\N
404	4787	16/00-0725766B10	2016-11-17 00:00:00	\N	\N		\N
405	3126	06 B 0724826	2019-04-03 00:00:00	\N	\N	000635010700956	\N
406	\N	03 B 062217	2003-12-28 00:00:00	\N	\N	000332010889054	\N
407	3345	09 B 0423036	\N	\N	\N		\N
408	2983	98 B 0242061 - 00/07	2021-03-10 00:00:00	\N	\N	099707220439621	\N
409	4945	N°43/00-0323971 B15	2024-01-08 00:00:00	\N	\N	001543080000171	\N
410	3332	0771 38 96 59	\N	\N	\N		\N
411	2074	00 B 0482509	\N	\N	\N		\N
412	4011	47/00-4313381 B 98	2015-05-06 00:00:00	\N	\N		\N
413	2294	00 B 0012818	2017-01-08 00:00:00	\N	\N	097916150010548000	\N
414	3499	05 B 0404147	2005-10-05 00:00:00	\N	\N		\N
415	3784	02 B 0017567	2011-07-04 00:00:00	\N	\N	000209189000256000	\N
416	4941	06/00-0189052 B 16	2021-03-17 00:00:00	\N	\N		\N
417	3005	99 B 0722746-35/00	2017-07-09 00:00:00	\N	\N		\N
418	1648	13/00 - 0262217 B 99	2021-10-28 00:00:00	\N	\N	099913026221746	\N
419	2735	06 B 0502565	2006-10-04 00:00:00	\N	\N		\N
420	3227	02 B 0065104	2002-12-01 00:00:00	\N	\N		\N
421	4279	0124496 B11	2012-08-12 00:00:00	\N	\N		\N
422	1975	00 B 0013087	2018-12-02 00:00:00	\N	\N	00016509042837	\N
423	4840	43/00-0324707 B 21	2021-06-29 00:00:00	\N	\N	002143080008753	\N
424	3964	09/00-0804651 B 04	2006-03-12 00:00:00	\N	\N	0009980052704	\N
425	2068	98 B 0462066	2013-01-31 00:00:00	\N	\N	099734120496124	\N
426	3787	98 B 0902173	2008-06-04 00:00:00	\N	\N	99702029060323	\N
427	4021	13 B 0584099 - 12/00	2016-01-03 00:00:00	\N	\N	001312069009645	\N
428	\N	19/00 - 0091932 B 15	2022-01-31 00:00:00	\N	\N	001519010045753	\N
429	2553	05B0364133	2005-09-27 00:00:00	\N	\N		\N
430	3910	10 B 0543249	2011-08-18 00:00:00	\N	\N	001039054324998	\N
431	2997	99 B 0122502	2007-02-24 00:00:00	\N	\N		\N
432	3572	06 B 0108702	2006-05-29 00:00:00	\N	\N		\N
433	4300	04 B 0107108	2004-02-11 00:00:00	\N	\N		\N
434	2094	04 B 0107108	2004-02-11 00:00:00	\N	\N		\N
435	4105	14 B 042 3388  - 00/14	2014-08-20 00:00:00	\N	\N		\N
436	4106	14 B 042 3388  - 00/14	2014-08-20 00:00:00	\N	\N		\N
437	322	99 B 0382216	1999-09-19 00:00:00	\N	\N		\N
438	3403	98 B 0122214-30/00	2011-11-17 00:00:00	\N	\N	099830049178013	\N
439	3813	07 B 0905554	2007-01-28 00:00:00	\N	\N		\N
440	2908	02 B 0018518	2006-04-19 00:00:00	\N	\N		\N
441	1016	99 B 0010456	\N	\N	\N		\N
442	2130	28/00-0562699 B 04	2016-02-21 00:00:00	\N	\N	000428056269992	\N
443	377	43/00- 0322386 B 99	2019-03-28 00:00:00	\N	\N	099943032238667	\N
444	3955	16/00 - 0989309 b 14	2014-05-25 00:00:00	\N	\N		\N
445	4379	17 B 0999383- 00/16	2019-01-31 00:00:00	\N	\N		\N
446	1975	00 B 0013087	2016-07-21 00:00:00	\N	\N	00016509042837	\N
447	3821	05 B 0583061 - 12/00	2022-01-03 00:00:00	\N	\N	000512058306162	\N
448	151	98 B 0622003	2003-09-02 00:00:00	\N	\N		\N
449	4766	28/00-0563134 B 09	2020-12-20 00:00:00	\N	\N		\N
450	2835	07 B 0263518	2007-01-21 00:00:00	\N	\N		\N
451	261	98 B 482121	\N	\N	\N		\N
452	1065	26/00-0342159 B 99	2015-05-14 00:00:00	\N	\N		\N
453	3352	03 B 0862697	2003-10-14 00:00:00	\N	\N		\N
454	1918	99 B 0582309	1999-08-01 00:00:00	\N	\N		\N
455	1567	02 B 0403122	2002-10-07 00:00:00	\N	\N	000204039004656	\N
456	3218	06 B 0502560	2006-09-19 00:00:00	\N	\N		\N
457	314	02 B 462872	2002-06-03 00:00:00	\N	\N		\N
458	2522	99 B 0082892	2014-04-23 00:00:00	\N	\N		\N
459	3642	10 B 0323496	2010-12-02 00:00:00	\N	\N	001043039007744	\N
460	431	99 B 0722760	1999-08-31 00:00:00	\N	\N		\N
461	1785	00 B 0362912	2000-03-27 00:00:00	\N	\N		\N
462	2387	98 B 222269	2000-02-06 00:00:00	\N	\N		\N
463	1304	99 B 222365	\N	\N	\N		\N
464	\N	07 B 0422888	2012-08-22 00:00:00	\N	\N	000714019008745	\N
465	2601	99 B 0009930	2004-10-05 00:00:00	\N	\N		\N
466	2712	02 B 0084585	2007-02-24 00:00:00	\N	\N	0219200275453	\N
467	951	06 B0242651	2006-02-06 00:00:00	\N	\N		\N
468	4910	06 B0242651	2006-02-06 00:00:00	\N	\N		\N
469	\N	28/00 0562757 B 04	2019-10-20 00:00:00	\N	\N	000428039007055	\N
470	\N	04 B 0107108	2004-02-11 00:00:00	\N	\N		\N
471	4325	28/00 0563974 B 15	2016-07-27 00:00:00	\N	\N		\N
472	2273	98 B 0422124	\N	\N	\N		\N
473	\N	01 B 0582618  12/00	2016-02-08 00:00:00	\N	\N		\N
474	3435	10 b 0423104	2015-07-27 00:00:00	\N	\N	0010143790002842	\N
475	1929	00 B 566647	\N	\N	\N		\N
476	\N	07 B 0109385	2010-06-27 00:00:00	\N	\N	000731019023353	\N
477	4139	06 B 0583200	2007-12-05 00:00:00	\N	\N		\N
478	334	00 B 0322424	2000-03-28 00:00:00	\N	\N		\N
479	3965	44/00 - 0764324 B 11	2023-08-07 00:00:00	\N	\N	001144029004256	\N
480	4288	30/00-0124564 B 11	2015-04-05 00:00:00	\N	\N	001130080011079	\N
481	\N	00 B 0402467	2000-02-07 00:00:00	\N	\N		\N
482	4384	05 B 0970946 - 00/16	2017-02-26 00:00:00	\N	\N	000516097094649	\N
483	4258	05 B 0970946 - 00/16	2017-02-26 00:00:00	\N	\N	000516097094649	\N
484	4256	05 B 0970946 - 00/16	2017-02-26 00:00:00	\N	\N	000516097094649	\N
485	4382	05 B 0970946 - 00/16	2017-02-26 00:00:00	\N	\N	000516097094649	\N
486	2007	99 B 032235	\N	\N	\N		\N
487	939	98 B 0282105	1998-05-20 00:00:00	\N	\N		\N
488	4236	31/00-0117016 B 17	2017-04-11 00:00:00	\N	\N	001731011701645	\N
489	2882	06 B 0975392	2006-11-21 00:00:00	\N	\N		\N
490	1247	99 B 0502232	1985-11-23 00:00:00	\N	\N		\N
491	3644	0987302 B 11	2011-03-09 00:00:00	\N	\N	001116098730253	\N
492	3821	05 B 0583061 - 12/00	2019-08-08 00:00:00	\N	\N	000512058306162	\N
493	\N	46/00 - 0842146 B 99	2016-08-23 00:00:00	\N	\N		\N
494	4794	16/00-1242115 B 22	2022-09-06 00:00:00	\N	\N		\N
495	3899	01 B 0123001	2013-05-14 00:00:00	\N	\N	000130049005457	\N
496	3766	12 B 0991092	2012-09-20 00:00:00	\N	\N	12162190028460	\N
497	3763	04 B 0223286	\N	\N	\N		\N
498	4384	16/00-0970946 b 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
499	4258	16/00-0970946 b 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
500	4256	16/00-0970946 b 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
501	4382	16/00-0970946 b 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
502	426	16/00 – 0542384 B 01	2015-05-25 00:00:00	\N	\N	0139054238462	\N
503	4957	11/00-0202369 B14	2017-07-24 00:00:00	\N	\N		\N
504	2449	98 B 0042349	2005-09-03 00:00:00	\N	\N		\N
505	3052	26/00 08 B 0342994	2008-04-14 00:00:00	\N	\N	000826019001257	\N
506	\N	21B1162300-00/19	2021-10-06 00:00:00	\N	\N		\N
507	1975	00 B 0013087	2000-10-04 00:00:00	\N	\N		\N
508	2783	02 B 0084331	2006-07-12 00:00:00	\N	\N		\N
509	2225	97 B 0082143	2012-12-14 00:00:00	\N	\N		\N
510	1065	99 B 5903421	2003-12-20 00:00:00	\N	\N		\N
511	2414	00 B 0014362-16/00	2017-01-29 00:00:00	\N	\N	00016001436218	\N
512	\N	02 B 0882337	2002-05-22 00:00:00	\N	\N	000201010546860	\N
513	2983	98 B 0242061 - 00/07	2020-10-04 00:00:00	\N	\N	099707220439621	\N
514	3868	12 B 0224457	2022-09-01 00:00:00	\N	\N		\N
515	\N	98 B 0003802	1998-05-12 00:00:00	\N	\N		\N
516	173	06 B 0502558	2006-08-30 00:00:00	\N	\N		\N
517	2365	05/00 - 0222473 B 99	2020-07-29 00:00:00	\N	\N		\N
518	4810	06 B 0724700 35/00	2020-12-24 00:00:00	\N	\N	000635010176746	\N
519	4255	39/00-0542719 B 04	2014-05-20 00:00:00	\N	\N	000439180722645	\N
520	\N	08 B 0806171	2008-04-30 00:00:00	\N	\N		\N
521	2118	04 B 0562760	2004-12-05 00:00:00	\N	\N	000428209000943	\N
522	3229	09 B 0223952	2019-03-25 00:00:00	\N	\N	96905480003135	\N
523	2235	03 B 0123259	\N	\N	\N		\N
524	3156	06 B 0422864	2006-08-27 00:00:00	\N	\N		\N
525	2785	01 B 0942527	2012-01-10 00:00:00	\N	\N		\N
526	4804	13/00 - 0263771 B 09	2017-07-17 00:00:00	\N	\N		\N
527	2951	06 B 0942852	2018-01-17 00:00:00	\N	\N		\N
528	2994	06 B 0242687	2007-07-30 00:00:00	\N	\N		\N
529	2748	08 B 0109873-31/00	\N	\N	\N		\N
530	2535	99 B 0903028	1999-09-01 00:00:00	\N	\N		\N
531	4792	05/00-0224281 B11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
532	4788	05/00-0224281 B11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
533	4789	05/00-0224281 B11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
534	4365	05/00-0224281 B11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
535	4791	05/00-0224281 B11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
536	2357	98 B 0582072	1999-03-09 00:00:00	\N	\N		\N
537	\N	98 B 0082710	2001-10-03 00:00:00	\N	\N		\N
538	248	96 B 0090813	\N	\N	\N		\N
539	6	99 B 0282417	1999-10-31 00:00:00	\N	\N		\N
540	3463	16/00 0983594 B 09	\N	\N	\N		\N
541	\N	08 B 0306010	\N	\N	\N		\N
542	4701	16/00-1043757B17	2022-11-22 00:00:00	\N	\N		\N
543	4702	16/00-1043757B17	2022-11-22 00:00:00	\N	\N		\N
544	\N	16/00 0016868 B 01	2013-08-20 00:00:00	\N	\N		\N
545	229	0082728 B 98	2007-09-16 00:00:00	\N	\N		\N
546	\N	98 A 1112624	1998-04-20 00:00:00	\N	\N		\N
547	4199	0242836 B 09	2017-02-19 00:00:00	\N	\N		\N
548	4253	13 B 0163120  00/48	2015-06-11 00:00:00	\N	\N		\N
549	3	03 B 0403240	2003-02-09 00:00:00	\N	\N		\N
550	4058	14/00-0423531 B/15	2015-10-28 00:00:00	\N	\N		\N
551	3784	02 B 0017567	2011-07-04 00:00:00	\N	\N	000216001756761	\N
552	\N	07 B 0223750	2007-12-12 00:00:00	\N	\N	000705429010449	\N
553	2682	01 B 0015682	2004-06-01 00:00:00	\N	\N	000116239005354	\N
554	4173	31/00-0162825 B 08	2015-06-09 00:00:00	\N	\N		\N
555	2976	09 B 0423018	2009-01-04 00:00:00	\N	\N		\N
556	1354	03 B 0184260	2003-05-27 00:00:00	\N	\N		\N
557	\N	03 B 0622117	2003-12-28 00:00:00	\N	\N	000332010889054	\N
558	4270	15/00-0049820 B 15	2015-06-11 00:00:00	\N	\N	001515004982097	\N
559	4889	16/00-1051217 B 22	2023-01-17 00:00:00	\N	\N		\N
560	\N	02 B 0422554	2002-09-25 00:00:00	\N	\N		\N
561	4366	19/00 - 0086359 B 05	2017-11-14 00:00:00	\N	\N	00519008635934	\N
562	1099	07 B 0542989	2007-04-02 00:00:00	\N	\N		\N
563	3055	05 B 0108437	2005-12-18 00:00:00	\N	\N	000531011028268	\N
564	1476	98 B 0122112     30/00	2016-01-11 00:00:00	\N	\N	099830012211258	\N
565	149	03 B 463023	\N	\N	\N		\N
566	4006	03 B 463023	\N	\N	\N		\N
567	2637	05 B 0123755 - 55/00	2022-07-25 00:00:00	\N	\N		\N
568	2915	02 B 0542420	2002-01-09 00:00:00	\N	\N		\N
569	4773	19/00-009341 B 14	2018-07-30 00:00:00	\N	\N		\N
570	\N	N°06/00-0187980 B14	2020-04-28 00:00:00	\N	\N	001406510002662	\N
571	2563	05 B 0970044	2005-04-26 00:00:00	\N	\N		\N
572	1311	01 B 0064292	2013-01-09 00:00:00	\N	\N		\N
573	4905	37/00 0642372 B23	2023-12-10 00:00:00	\N	\N		\N
574	3575	04 B 0184577	\N	\N	\N	000406269019737	\N
575	2580	05 B 0663088	2005-12-26 00:00:00	\N	\N		\N
576	4114	28/00 - 0562445 B 01	2019-02-24 00:00:00	\N	\N		\N
577	3642	10 B 0323496    43/00	2010-12-02 00:00:00	\N	\N	001043039007744	\N
578	3994	04/00-0405420 B 14	2014-06-12 00:00:00	\N	\N	195004170156538	\N
579	4769	39/00-0544023 B 16	2016-08-04 00:00:00	\N	\N		\N
580	4023	07 B 0583235 - 12/00	2009-09-13 00:00:00	\N	\N	000712058323543	\N
581	3742	07 B 0583235 - 12/00	2009-09-13 00:00:00	\N	\N	000712058323543	\N
582	4277	12 B 0124704	2013-08-19 00:00:00	\N	\N		\N
583	4275	12 B 0124704	2013-08-19 00:00:00	\N	\N		\N
584	4375	16 B 0564167	2023-07-26 00:00:00	\N	\N		\N
585	2620	98 B 0702009	2002-07-31 00:00:00	\N	\N		\N
586	3163	05 B 0523240	2005-01-24 00:00:00	\N	\N		\N
587	2689	02 B 0019784	2013-12-13 00:00:00	\N	\N		\N
588	2276	08 B 0242803	2008-07-16 00:00:00	\N	\N		\N
589	212	98 B 0062300	2008-10-13 00:00:00	\N	\N	195725070030931	\N
590	4924	16/00-0009617 B 99	2022-08-04 00:00:00	\N	\N		\N
591	4918	05/00 - 0226506 B 22	2022-05-25 00:00:00	\N	\N	002205022650642	\N
592	1383	06 B 0322962	2006-01-23 00:00:00	\N	\N		\N
593	2556	97 B 122023	1999-08-03 00:00:00	\N	\N	099730040640923	\N
594	\N	01 B 0015669	2010-07-25 00:00:00	\N	\N	000116001566907	\N
595	3116	00 B 0862476	2007-11-28 00:00:00	\N	\N		\N
596	2429	04 B 0882401	2004-01-19 00:00:00	\N	\N		\N
597	4317	04 B 0882401	2004-01-19 00:00:00	\N	\N		\N
598	4018	04 B 0882401	2004-01-19 00:00:00	\N	\N		\N
599	3722	29/00 - 0663246 B 08	2020-10-20 00:00:00	\N	\N		\N
600	\N	37/00-0642229 B 17	2017-09-21 00:00:00	\N	\N		\N
601	1540	98 B 222212	1998-11-09 00:00:00	\N	\N		\N
602	\N	19/00-0562211 B 99	2010-04-12 00:00:00	\N	\N	099128160126334	\N
603	1110	98 B 0102636	2005-07-11 00:00:00	\N	\N		\N
604	2637	05 B 0123755	2006-02-06 00:00:00	\N	\N		\N
605	2948	05 B 0942813	2005-07-16 00:00:00	\N	\N		\N
606	2433	16/00 - 0008903 B 99	2022-06-06 00:00:00	\N	\N		\N
607	4536	16/00 - 0008903 B 99	2022-06-06 00:00:00	\N	\N		\N
608	4182	22/00-0024250 B 16	2020-01-07 00:00:00	\N	\N	001622002425091	\N
609	4098	16 B 0303337 – 17/00	2016-04-25 00:00:00	\N	\N		\N
610	3766	12 B 0991092	2014-12-03 00:00:00	\N	\N	001216099109235	\N
611	98	99 B 222363	1999-03-03 00:00:00	\N	\N		\N
612	3782	06 B 0046311	2008-12-22 00:00:00	\N	\N	0615229008544	\N
613	3035	06 B 0046311	2008-12-22 00:00:00	\N	\N	0615229008544	\N
614	2225	97 B 0082143	2018-08-02 00:00:00	\N	\N		\N
615	785	03 B 0782439	2013-03-10 00:00:00	\N	\N	000327078243953	\N
616	\N	19 B 0093591	2019-02-21 00:00:00	\N	\N		\N
617	3961	0105738 B 02	2014-04-30 00:00:00	\N	\N	000231010573809	\N
618	2101	03 B 0142914	2003-11-09 00:00:00	\N	\N	000321029007750	\N
619	228	98 B 0082621	1998-10-07 00:00:00	\N	\N	099816130001344	\N
620	2445	01 B 0017162 - 19/00	2009-03-22 00:00:00	\N	\N		\N
621	4403	03 B 0021431    16/00	2017-08-24 00:00:00	\N	\N		\N
622	3523	N° 22/00 - 0023507 B10	2019-02-14 00:00:00	\N	\N	001022002350787	\N
623	4539	N° 22/00 - 0023507 B10	2019-02-14 00:00:00	\N	\N	001022002350787	\N
624	4986	N° 22/00 - 0023507 B10	2019-02-14 00:00:00	\N	\N	001022002350787	\N
625	2983	98 B 0242061 - 00/07	2014-04-24 00:00:00	\N	\N	099707220439621	\N
626	2767	00 B 0782245	2006-07-23 00:00:00	\N	\N		\N
627	4324	08B0124165-00/30	2017-11-27 00:00:00	\N	\N		\N
628	2128	01 B 0064114	2001-02-24 00:00:00	\N	\N	25074074011	\N
629	4384	05 B 0970946 - 00/16	2021-02-01 00:00:00	\N	\N	000516230701953	\N
630	4258	05 B 0970946 - 00/16	2021-02-01 00:00:00	\N	\N	000516230701953	\N
631	4256	05 B 0970946 - 00/16	2021-02-01 00:00:00	\N	\N	000516230701953	\N
632	4382	05 B 0970946 - 00/16	2021-02-01 00:00:00	\N	\N	000516230701953	\N
633	\N	08 B 0806010	2008-01-20 00:00:00	\N	\N		\N
634	3164	03 B 0223158	2008-05-26 00:00:00	\N	\N		\N
635	4127	30/00-0124126 B08	2014-06-05 00:00:00	\N	\N		\N
636	4767	28/00-0562410 B 10	2016-04-12 00:00:00	\N	\N	000128010703271	\N
637	2949	03 B 0942674	2003-11-21 00:00:00	\N	\N		\N
638	2644	99 B 0010898	1999-12-13 00:00:00	\N	\N		\N
639	377	99 B 0322386	2008-02-03 00:00:00	\N	\N	099943032238667	\N
640	3281	31/00-0110195 B 08	2014-05-21 00:00:00	\N	\N		\N
641	2955	07 B 0975135	2007-09-09 00:00:00	\N	\N		\N
642	3389	98 B 0702009	2009-07-01 00:00:00	\N	\N		\N
643	\N	05 B 0263305	\N	\N	\N		\N
644	3910	39/00-0543249 B 10	2014-02-13 00:00:00	\N	\N	001039054324998	\N
645	211	99 B 262479	1999-10-26 00:00:00	\N	\N	099913026247990	\N
646	3896	:07 B 0162741	2013-12-30 00:00:00	\N	\N	748016274143	\N
647	\N	98 B 0562063  - 00/28	2015-12-30 00:00:00	\N	\N	099828056206312	\N
648	3898	99 B 0082883 - 19/00	2023-07-27 00:00:00	\N	\N	099919008288302	\N
649	2414	00 B 0014362-16/00	2021-02-16 00:00:00	\N	\N	099516120536822	\N
650	1693	02 B 0123211	2002-08-20 00:00:00	\N	\N	000230129009158	\N
651	2653	00 B 0012999	2000-09-28 00:00:00	\N	\N		\N
652	2715	99 B 0342285	2003-12-30 00:00:00	\N	\N		\N
653	3821	12/00-0583061 B05	2019-08-08 00:00:00	\N	\N	000512058306162	\N
654	3110	97 B 0222008	2004-12-11 00:00:00	\N	\N		\N
655	3496	16/00 - 0978902 B 08	2020-03-15 00:00:00	\N	\N		\N
656	4352	16/00-1011992 B17	2017-05-08 00:00:00	\N	\N		\N
657	1874	02 B 0020137	2002-12-04 00:00:00	\N	\N	000216002013436	\N
658	2433	0008903 B 99	2016-11-08 00:00:00	\N	\N	099916000890340	\N
659	4536	0008903 B 99	2016-11-08 00:00:00	\N	\N	099916000890340	\N
660	85	00 B 222700	2000-09-30 00:00:00	\N	\N		\N
661	2392	05 B 0702310	2005-03-20 00:00:00	\N	\N		\N
662	3432	0403854 B 04	2004-07-26 00:00:00	\N	\N	00040401902894258	\N
663	\N	98 B 62216	2000-12-31 00:00:00	\N	\N		\N
664	1294	99 B 222444	1999-06-01 00:00:00	\N	\N		\N
665	1881		\N	\N	\N	09794710005835	\N
666	4242	16 B 1042847	2016-11-07 00:00:00	\N	\N		\N
667	2295	02 B 462982	2002-12-31 00:00:00	\N	\N	000234139022548	\N
668	349	06 B 0382612	2006-04-26 00:00:00	\N	\N		\N
669	2575	05 B 0971274	2005-12-06 00:00:00	\N	\N		\N
670	2759	05 B 0364079	2005-06-12 00:00:00	\N	\N		\N
671	4700	31/00-1123597B20	2020-12-17 00:00:00	\N	\N	002031112359745	\N
672	2233	98 B 222093	1998-04-21 00:00:00	\N	\N		\N
673	2338	99 B 0282416	1999-10-31 00:00:00	\N	\N		\N
674	\N	08 B 0087684-19/00	2008-08-03 00:00:00	\N	\N	0819019050345	\N
675	\N	04 B 0162583	2004-03-16 00:00:00	\N	\N		\N
676	3043	35/00-0722578 B 99	2020-12-17 00:00:00	\N	\N	99935072257842	\N
677	2853	00 B 0502288	\N	\N	\N		\N
678	2638	99 B 0942308	1999-08-28 00:00:00	\N	\N		\N
679	179	21/00-0142577 B 00	2008-11-16 00:00:00	\N	\N		\N
680	2897	00 B 0012189	2006-12-13 00:00:00	\N	\N		\N
907	2844	05 B 0046078	2007-11-17 00:00:00	\N	\N		\N
681	4384	16/00-0970946b05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
682	4258	16/00-0970946b05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
683	4256	16/00-0970946b05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
684	4382	16/00-0970946b05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
685	2785	01 B 0942527 - 08/00	2019-04-09 00:00:00	\N	\N		\N
686	2003	00 B 63788	\N	\N	\N		\N
687	\N	99 B 0183036	2000-06-17 00:00:00	\N	\N		\N
688	2177	98 B 842033	1998-04-30 00:00:00	\N	\N	099846230110628	\N
689	1350	35/00 - 0723100 B 00	2023-03-26 00:00:00	\N	\N		\N
690	1876	03 B 0184303	2003-07-22 00:00:00	\N	\N		\N
691	3397	08 B 0067997	2008-12-14 00:00:00	\N	\N		\N
692	3859	37/00 0642172 B 12	2021-05-10 00:00:00	\N	\N		\N
693	3965	44/00-0764324 B 11	2014-05-14 00:00:00	\N	\N	001144029004256	\N
694	3267	07 B 0974487	2007-05-30 00:00:00	\N	\N		\N
695	4851	16/00 - 0985842 B 10	2021-05-20 00:00:00	\N	\N		\N
696	2207	01-0302052 B 98	2007-10-10 00:00:00	\N	\N		\N
697	\N	98 B 62232	\N	\N	\N		\N
698	4678	99 B 0602020  33/00	2019-04-29 00:00:00	\N	\N		\N
699	1705	01 B 0242389	2006-11-14 00:00:00	\N	\N	0107024238910	\N
700	4903	01 B 0242389	2006-11-14 00:00:00	\N	\N	0107024238910	\N
701	2242	16/00 - 0007759 B 99	2018-10-28 00:00:00	\N	\N	099916000775940	\N
702	3542	10 B 0563218 - 28/00	2014-11-25 00:00:00	\N	\N		\N
703	3378	07 B 0109364	2007-08-14 00:00:00	\N	\N		\N
704	2294	B00 0012818	2007-06-16 00:00:00	\N	\N		\N
705	2333	00 B 0015094	\N	\N	\N		\N
706	2119	21/00-0362613 B 99	2017-09-12 00:00:00	\N	\N		\N
707	3235	08 B 0905789	2009-02-08 00:00:00	\N	\N		\N
708	3003	03 B 0242497	2008-03-09 00:00:00	\N	\N		\N
709	2712	02 B 0084585	2002-05-13 00:00:00	\N	\N		\N
710	785	03 B 0782439	2006-07-09 00:00:00	\N	\N		\N
711	2427	02 B 0021262	\N	\N	\N	0021615099148	\N
712	\N	99 B 0242211	2012-09-13 00:00:00	\N	\N		\N
713	2241	98 B 0502046	1998-07-08 00:00:00	\N	\N		\N
714	\N	05 B 0724339	2015-05-31 00:00:00	\N	\N	00535200148552	\N
715	2390	04 B 0622125	2004-06-27 00:00:00	\N	\N		\N
716	4850	26/00 - 0343452 B 14	2020-08-02 00:00:00	\N	\N		\N
717	2029	06 B 0805541	2006-04-04 00:00:00	\N	\N		\N
718	5045	28/00 - 0563172 B 10	2024-01-08 00:00:00	\N	\N	001028110002178	\N
719	3827	31/00-0114244 B 13	2019-07-08 00:00:00	\N	\N		\N
720	2188	28/00 0562757 B 04	2019-10-20 00:00:00	\N	\N	000428039007055	\N
721	1654	99 B 0302314	\N	\N	\N		\N
722	2962	04 B 005822	2006-10-30 00:00:00	\N	\N		\N
723	4809	01B 0542384-16/00	2015-05-25 00:00:00	\N	\N		\N
724	2078	03 B 0223124	2007-01-13 00:00:00	\N	\N	000305022312462	\N
725	4285	17 B 0882983    00/01	2017-12-21 00:00:00	\N	\N		\N
726	3740	25/00 0067637 B 06	2012-08-16 00:00:00	\N	\N		\N
727	3534	10 B 0365081	2010-05-09 00:00:00	\N	\N		\N
728	143	98 B 0802158	1998-04-16 00:00:00	\N	\N		\N
729	2432	99 B 43063	2000-09-17 00:00:00	\N	\N		\N
730	1753	09 B 0583468	2009-02-15 00:00:00	\N	\N	000912010003278	\N
731	4191	05 B 0583090 - 00/12	2015-05-28 00:00:00	\N	\N	000512030627364	\N
732	2233	04 B 0223251	1998-04-21 00:00:00	\N	\N		\N
733	4792	05/00 - 0224281 B11	2018-03-19 00:00:00	\N	\N		\N
734	4788	05/00 - 0224281 B11	2018-03-19 00:00:00	\N	\N		\N
735	4789	05/00 - 0224281 B11	2018-03-19 00:00:00	\N	\N		\N
736	4365	05/00 - 0224281 B11	2018-03-19 00:00:00	\N	\N		\N
737	4791	05/00 - 0224281 B11	2018-03-19 00:00:00	\N	\N		\N
738	2894	07 B 0724890-35/00	2015-02-25 00:00:00	\N	\N		\N
739	2380	19/00-0083453 B 99	2013-11-11 00:00:00	\N	\N	099719179257808	\N
740	2088	98 B 0802124	1999-05-15 00:00:00	\N	\N		\N
741	3568	00 B 0662346	2010-04-19 00:00:00	\N	\N	099929010919127	\N
742	3808	00 B 0662346	2010-04-19 00:00:00	\N	\N	099929010919127	\N
743	2142	98 B 162019	1998-03-17 00:00:00	\N	\N		\N
744	3107	08 B 0725145	2008-04-28 00:00:00	\N	\N		\N
745	4429	43/00-0323489-B-10	2015-01-04 00:00:00	\N	\N		\N
746	3412	03 B 0282867	\N	\N	\N		\N
747	\N	93 A 3403095	1998-03-09 00:00:00	\N	\N		\N
748	4526	0986657 B13	2020-03-08 00:00:00	\N	\N		\N
749	4528	0986657 B13	2020-03-08 00:00:00	\N	\N		\N
750	4938	16/00-1019896 B 24	2024-02-04 00:00:00	\N	\N	002416101989663	\N
751	3915	09 B 0088177	2015-08-18 00:00:00	\N	\N	000919159056136	\N
752	1564	98 B 0122276	2003-05-11 00:00:00	\N	\N		\N
753	4048	12 B 1006084	2015-07-16 00:00:00	\N	\N	001216500193643	\N
754	3484	06 B 0323026	2011-10-10 00:00:00	\N	\N	000643032302677	\N
755	2010	99 B 0582186	2001-10-22 00:00:00	\N	\N		\N
756	2949	08/00 - 0942674 B 03	2019-07-29 00:00:00	\N	\N	030801007762	\N
757	\N	09 B 0302897	2009-05-02 00:00:00	\N	\N		\N
758	2949	03 B 0942674	2007-11-21 00:00:00	\N	\N	030801007762	\N
759	4359	10/00-0986632 B 10	2018-02-13 00:00:00	\N	\N		\N
760	4321	99 B 0007705	2002-01-16 00:00:00	\N	\N	099916000770512	\N
761	2057	99 B 0007705	2002-01-16 00:00:00	\N	\N	099916000770512	\N
762	3793	11 B 0224281	2012-05-09 00:00:00	\N	\N	001105239005747	\N
763	4427	31/01 - 0109829 B 08	2020-12-17 00:00:00	\N	\N		\N
764	2628	05 B 0108207	2005-07-11 00:00:00	\N	\N		\N
765	\N	02 B 0542524	2002-07-30 00:00:00	\N	\N		\N
766	2038	03 B 0022856	2003-06-03 00:00:00	\N	\N		\N
767	1797	98 B 0322116	2014-01-06 00:00:00	\N	\N	99843020244625	\N
768	2653	00 B 0012999	2020-06-16 00:00:00	\N	\N		\N
769	4526	0986657 B 13	2020-03-08 00:00:00	\N	\N		\N
770	4528	0986657 B 13	2020-03-08 00:00:00	\N	\N		\N
771	322	24/00 – 0382216 B 99	2023-11-22 00:00:00	\N	\N		\N
772	1648	99 B 0262217	2001-11-17 00:00:00	\N	\N	097213010012750	\N
773	3129	00 B 0011642	2006-06-25 00:00:00	\N	\N	00001629002552	\N
774	\N	05 B 0086266	\N	\N	\N		\N
775	4841	13 B 04642 -34/00	2023-05-07 00:00:00	\N	\N		\N
776	3229	09 B 0223952	2009-02-15 00:00:00	\N	\N	00196905480003135	\N
777	4921	32/04 - 0622217 B 12	2023-11-21 00:00:00	\N	\N	001232010001967	\N
778	655	0103149 B 99	2011-05-18 00:00:00	\N	\N	0999310110314929	\N
779	1110	98 B 0102636	2015-11-11 00:00:00	\N	\N		\N
780	2709	99 B 0430599	\N	\N	\N	09970430060242	\N
781	3158	08 B 0742476	2013-03-25 00:00:00	\N	\N	000820074247695	\N
782	2950	13/00-0263879 B 09	2009-08-20 00:00:00	\N	\N	000913139009337	\N
783	3756	07/00-0242584 B 05	2012-03-14 00:00:00	\N	\N	000507329005938	\N
784	447	98 B 0882037	\N	\N	\N		\N
785	\N	13/00-0264910B15	2022-07-31 00:00:00	\N	\N		\N
786	950	99 B 482221	\N	\N	\N		\N
787	3422	02 B 0562492	2015-02-15 00:00:00	\N	\N		\N
788	2294	00 B 0012818	2009-12-14 00:00:00	\N	\N	00016001281818	\N
789	1362	99 B 0103310	2002-07-13 00:00:00	\N	\N	099931010331015	\N
790	\N	07 B 0422888	2007-01-23 00:00:00	\N	\N		\N
791	2740	03 B 0322734	2006-08-13 00:00:00	\N	\N		\N
792	3907	09 B 0783034	2009-12-07 00:00:00	\N	\N	000927078303433	\N
793	4401	34/00 - 0463608 B 07	2014-09-15 00:00:00	\N	\N	000734300007766	\N
794	2780	08 B 0087187	2009-04-08 00:00:00	\N	\N		\N
795	2957	07 B 0108842	2007-09-11 00:00:00	\N	\N	000631059013156	\N
796	433	98 B 0102543	\N	\N	\N		\N
797	3734	98 B 0022149	2011-02-24 00:00:00	\N	\N	099522010368821	\N
798	3481	04B0363761	2004-03-23 00:00:00	\N	\N		\N
799	3409	04 B 0022938	2008-02-18 00:00:00	\N	\N	000422002293886	\N
800	\N	07/00 0242629 B 05	2013-11-12 00:00:00	\N	\N	000507019003653	\N
801	3483	05/B/0482696	\N	\N	\N		\N
802	533	97 B 0082039	1999-05-12 00:00:00	\N	\N		\N
803	3806	98 B 0202024	2006-07-31 00:00:00	\N	\N	09851101342	\N
804	3491		\N	\N	\N	000306180551162	\N
805	\N	99 B 0302220	\N	\N	\N	099517319030713	\N
806	3111	99 B 222442	1999-05-31 00:00:00	\N	\N		\N
807	3421	08 B 0263726	2008-09-29 00:00:00	\N	\N		\N
808	2435	98 B 62249	1998-05-20 00:00:00	\N	\N		\N
809	\N	01/00-0882675	\N	\N	\N	001101019000664	\N
810	1989	99 B 0062826	2001-01-17 00:00:00	\N	\N		\N
811	627	99 B 0342167	2003-09-30 00:00:00	\N	\N		\N
812	1585	97 B 0102081	\N	\N	\N		\N
813	24	03 B 0223176	2003-12-30 00:00:00	\N	\N		\N
814	3997	14 B 0906644   02/00	2016-02-24 00:00:00	\N	\N		\N
815	\N	99 B 63194	\N	\N	\N		\N
816	325	98 B 0009856	1999-10-18 00:00:00	\N	\N		\N
817	4151	98 B 0009856	1999-10-18 00:00:00	\N	\N		\N
818	\N	06 B 0805652	2006-08-22 00:00:00	\N	\N		\N
819	2123	0085499 B 04	2007-04-02 00:00:00	\N	\N		\N
820	2830	24/02 – 0442869 B 08	2009-02-10 00:00:00	\N	\N		\N
821	2762	06 B 0404217	2006-04-23 00:00:00	\N	\N		\N
822	4131	13 B 0906508   02/00	2016-07-25 00:00:00	\N	\N	001302019005264	\N
823	3800	05 B 0742374   - 00/20	2013-05-16 00:00:00	\N	\N	000520074237480	\N
824	3851	16/00 0976991 B 08	2008-04-16 00:00:00	\N	\N	000816097699159	\N
825	2811	07 B 0185416	2009-12-08 00:00:00	\N	\N		\N
826	2242	99 B 007759	2009-03-24 00:00:00	\N	\N	09861626000239	\N
827	3461	0562412B01	2002-03-25 00:00:00	\N	\N		\N
828	\N	04 B 0966314	2007-11-18 00:00:00	\N	\N	416096631415	\N
829	4284	16 B 0225389   05/00	2016-05-04 00:00:00	\N	\N		\N
830	2148	98 B 1020059	1998-06-22 00:00:00	\N	\N		\N
831	3529	08B0782913	\N	\N	\N		\N
832	4186	12 B 0089833 - 19/00	2016-06-20 00:00:00	\N	\N	001219010026367	\N
833	1199	18/00-0442149 B 99	2020-01-20 00:00:00	\N	\N	09991804421491200000	\N
834	2612	98 B 0542075	1998-05-13 00:00:00	\N	\N		\N
835	4322	99 B 0222381  00/05	1999-03-16 00:00:00	\N	\N	099905022238141	\N
836	2242	99 B 007759	2009-09-25 00:00:00	\N	\N	09861626000239	\N
837	4103	16 B 0584471 - 00/12	2016-05-08 00:00:00	\N	\N	001612030003277	\N
838	3945	13 B 0224883	2014-03-09 00:00:00	\N	\N	001305010025373	\N
839	4132	16 B 0683089   36/00	2016-04-11 00:00:00	\N	\N	001636219000840	\N
840	2078	03 B 0223124-05/00	2016-08-16 00:00:00	\N	\N	305022312462	\N
841	\N	00 B 0122868	2004-11-09 00:00:00	\N	\N		\N
842	3427	03 B 0723902	2007-12-17 00:00:00	\N	\N	000335072390289	\N
843	\N	98 B 0342085	1998-11-12 00:00:00	\N	\N		\N
844	666	00 B 0302339	2000-03-01 00:00:00	\N	\N		\N
845	2294	00 B 0012818	2007-06-16 00:00:00	\N	\N	000416429042049	\N
846	4179	25/00-0068995 B 11	2016-04-20 00:00:00	\N	\N	001125006899572	\N
847	\N	01 B 0542384	2004-08-09 00:00:00	\N	\N		\N
848	4413	16/00 - 0985449 B 12	2021-09-30 00:00:00	\N	\N		\N
849	\N	98 B 4020105	1998-09-23 00:00:00	\N	\N		\N
850	\N	02/00 - 0903675 B 00	2021-02-23 00:00:00	\N	\N	098202010003850	\N
851	3301	06 B 0185348	\N	\N	\N		\N
852	2081	15/00-0045174 b 06	2016-05-23 00:00:00	\N	\N		\N
853	4177	15/00-0045174 b 06	2016-05-23 00:00:00	\N	\N		\N
854	3766	12 B 0991092	2014-12-03 00:00:00	\N	\N	0001216099109235	\N
855	604	04 B 0263131	2015-08-20 00:00:00	\N	\N		\N
856	3533	10 B 0343125	2020-12-24 00:00:00	\N	\N		\N
857	4767	28/00-0562410 B 10	2022-03-07 00:00:00	\N	\N	000128010703271	\N
858	2637	55/00-05 B 0123755	2022-07-25 00:00:00	\N	\N		\N
859	2365	99 B 0222473	2009-11-03 00:00:00	\N	\N		\N
860	5026	45/00-0822545 B 23	2023-12-11 00:00:00	\N	\N	002345082254582	\N
861	4145	0242128 B99	1999-01-26 00:00:00	\N	\N		\N
862	1433	0242128 B99	1999-01-26 00:00:00	\N	\N		\N
863	4529	0242128 B99	1999-01-26 00:00:00	\N	\N		\N
864	4681	39/00 - 0544289 B18	2018-09-30 00:00:00	\N	\N		\N
865	2204	05 B 0724597	2005-12-21 00:00:00	\N	\N		\N
866	3440	28/00 0563130 B 09	2009-09-10 00:00:00	\N	\N		\N
867	4136	01 B 0582618  12/00	2016-02-08 00:00:00	\N	\N		\N
868	3330	0983278 B09	2013-12-11 00:00:00	\N	\N		\N
869	4915	0983278 B09	2013-12-11 00:00:00	\N	\N		\N
870	3186	08 B 0981468	2008-09-23 00:00:00	\N	\N	0816539059131	\N
871	4670		\N	\N	\N		\N
872	3536	35/00 - 0978954 B 08	2019-07-10 00:00:00	\N	\N	00081609789548	\N
873	4426	15/00-0049947 B 15	2015-11-09 00:00:00	\N	\N	001515004994728	\N
874	3782	06 B 0046311	\N	\N	\N	000615229008544	\N
875	3035	06 B 0046311	\N	\N	\N	000615229008544	\N
876	871	02 B 0462856	2016-03-20 00:00:00	\N	\N	000234046285636	\N
877	2943	02 B 462787	2002-02-18 00:00:00	\N	\N		\N
878	4911	23/00-0365952 B 14	2022-01-09 00:00:00	\N	\N	001423010012669	\N
879	2281	98 B 0562063	2015-12-30 00:00:00	\N	\N	089828270504816	\N
880	4110	98 B 0562063	2015-12-30 00:00:00	\N	\N	089828270504816	\N
881	607	04 B 0382508	2004-04-18 00:00:00	\N	\N	000424019002556	\N
882	3042	08 B 0223779	2008-03-02 00:00:00	\N	\N	194805330104445	\N
883	232	98 B 0902049	2001-02-05 00:00:00	\N	\N		\N
884	3401	99 A 1618963	\N	\N	\N		\N
885	3698	10 B 0111547	2010-06-21 00:00:00	\N	\N	001031010030965	\N
886	4122	00 B 0562293-00/28	2015-11-30 00:00:00	\N	\N		\N
887	3841	09 B 0543213	2019-03-10 00:00:00	\N	\N		\N
888	2832	06 B 0263419	2006-02-26 00:00:00	\N	\N		\N
889	\N	00 B 0142562	2000-09-25 00:00:00	\N	\N	00021014256287	\N
890	\N	04 B 0422716	2004-10-03 00:00:00	\N	\N		\N
891	2793	08 B 0806010	2008-01-20 00:00:00	\N	\N	000809039010157	\N
892	3182	08 B 0023374	2008-11-17 00:00:00	\N	\N		\N
893	2191	00 B 0014030	2000-09-26 00:00:00	\N	\N	097016010022061	\N
894	2812	99 B 0006691	2007-04-15 00:00:00	\N	\N		\N
895	1141	99 B 0322359	\N	\N	\N		\N
896	2748	08 B 0109873	2008-05-03 00:00:00	\N	\N		\N
897	430	42/00-0185239 B 06	2015-05-05 00:00:00	\N	\N		\N
898	\N	08 B 0978241	2008-08-24 00:00:00	\N	\N		\N
899	\N	01 B 0142635	2001-04-08 00:00:00	\N	\N		\N
900	3118	07 B 0263524	2007-01-24 00:00:00	\N	\N		\N
901	1757	06 B 0463498	2016-08-23 00:00:00	\N	\N		\N
902	3295	31/00-0110470 B 08	2008-12-27 00:00:00	\N	\N		\N
903	3584	09 B 0725337	\N	\N	\N		\N
904	4793	05 B 0968770	2005-01-05 00:00:00	\N	\N		\N
905	2527	05 B 0968770	2005-01-05 00:00:00	\N	\N		\N
906	1644	99 B 62581	\N	\N	\N		\N
908	4800	04/00 - 0406306 B 21	2021-02-03 00:00:00	\N	\N	002104200003181	\N
909	2379	00 B 0722946	2000-01-31 00:00:00	\N	\N		\N
910	4123	30/00 0124866 B13	2013-09-19 00:00:00	\N	\N	001330012486618	\N
911	3427	03 B 0723902	2007-12-17 00:00:00	\N	\N	0003350723390289	\N
912	337	43/00  0322104 B 98	2019-04-10 00:00:00	\N	\N	099843080238813	\N
913	4808	43/00 - 0323670 B 12	2021-10-31 00:00:00	\N	\N		\N
914	3165	08 B 0463797	2016-03-31 00:00:00	\N	\N	000834046379768	\N
915	456	99 B 0322350	\N	\N	\N		\N
916	2367	98 B 0042349 00/16	2016-08-10 00:00:00	\N	\N		\N
917	4594	56/00-061202B21	\N	\N	\N		\N
918	\N	16/00-1047095 B19	2019-05-08 00:00:00	\N	\N	001915104709564	\N
919	174	00 B 0282510	2000-09-10 00:00:00	\N	\N		\N
920	\N	00 B 0122824	2009-03-24 00:00:00	\N	\N		\N
921	785	98 B 62232	\N	\N	\N		\N
922	3458	08 B 0979866	2009-04-13 00:00:00	\N	\N	000816180063352	\N
923	3012	08 B 0979866	2009-04-13 00:00:00	\N	\N	000816180063352	\N
924	1415	98 B 0922222	2014-09-14 00:00:00	\N	\N		\N
925	1848	06 B 0764042	2006-07-18 00:00:00	\N	\N		\N
926	3949	16/00 – 0995212 B 14	2022-04-28 00:00:00	\N	\N		\N
927	2133		\N	\N	\N	000516019029057	\N
928	3794	99B0322367	2011-08-14 00:00:00	\N	\N		\N
929	2112	00 B 0582547	2000-12-05 00:00:00	\N	\N		\N
930	\N	N°  28/00 - 0563164 B 10	2017-08-15 00:00:00	\N	\N	001028010001475	\N
931	304	98 B 0362243	1998-07-14 00:00:00	\N	\N		\N
932	3932	99 B 0482212	2007-06-20 00:00:00	\N	\N	9990109016811	\N
933	1771	02 B 0084476	2002-03-31 00:00:00	\N	\N	00021300952198	\N
934	2357	23/ 000364045 B05	2013-02-05 00:00:00	\N	\N		\N
935	5046	35/00-0730658 B24	2024-05-28 00:00:00	\N	\N	002435100025853	\N
936	\N	99 B 0242224	2007-07-18 00:00:00	\N	\N		\N
937	2367	98 B 0042349	2005-09-03 00:00:00	\N	\N		\N
938	3471	01 B 262736	2019-02-14 00:00:00	\N	\N	001022290001959	\N
939	3571	98 B 0122291	1998-07-14 00:00:00	\N	\N	099830049183902	\N
940	3967	09 B0702392-38/00	2009-08-02 00:00:00	\N	\N	195338010012938	\N
941	3966	09 B0702392-38/00	2009-08-02 00:00:00	\N	\N	195338010012938	\N
942	5067	09 B0702392-38/00	2009-08-02 00:00:00	\N	\N	195338010012938	\N
943	5069	09 B0702392-38/00	2009-08-02 00:00:00	\N	\N	195338010012938	\N
944	3939	13/00 0264092 B 10	2013-04-16 00:00:00	\N	\N	001013026409289	\N
945	\N	90 B 0004	1993-08-04 00:00:00	\N	\N		\N
946	1689	99 B 0282216 10/00	2023-11-27 00:00:00	\N	\N		\N
947	1861	99 B 0382232	2000-10-07 00:00:00	\N	\N		\N
948	1662	0463482B06	2011-10-13 00:00:00	\N	\N	000234279016050	\N
949	2785	01 B 0942527	2006-11-04 00:00:00	\N	\N		\N
950	4774	30/00-0124156 B 08	2019-10-06 00:00:00	\N	\N		\N
951	2225	97 B 0082143	2005-12-03 00:00:00	\N	\N		\N
952	1893	99 B 0362483/01	2003-01-13 00:00:00	\N	\N		\N
953	\N	99 B 0402360	2004-01-25 00:00:00	\N	\N	099604250149819	\N
954	2427	02B0021262	\N	\N	\N		\N
955	\N	n°10/00-0284573 B19	2020-08-26 00:00:00	\N	\N		\N
956	\N	01 B 482538	2002-09-09 00:00:00	\N	\N		\N
957	\N	07 B 0223692 - 00/15	2007-05-22 00:00:00	\N	\N		\N
958	4195	14 B 0224885 -00/05	2014-01-02 00:00:00	\N	\N		\N
959	3229	09 B 0223952 05/00	2019-03-25 00:00:00	\N	\N	96905480003135	\N
960	3753	08 B 0124072	2013-12-29 00:00:00	\N	\N		\N
961	139	01 B 0084225 - 19/00	2023-03-12 00:00:00	\N	\N		\N
962	1247	99 B 0502232	1999-10-27 00:00:00	\N	\N	098541010010645	\N
963	1683	99 B 0782009	\N	\N	\N		\N
964	2412	99 B 0009320	1999-09-12 00:00:00	\N	\N	098909150012635	\N
965	3847	08 B 0185858	2008-04-14 00:00:00	\N	\N		\N
966	3971	0086174 B 05	2006-04-24 00:00:00	\N	\N		\N
967	\N	98 B 0082481	2006-05-23 00:00:00	\N	\N		\N
968	\N	98 B 0102744	1998-09-02 00:00:00	\N	\N		\N
969	4733	43/00-0323895 B 14	2023-02-13 00:00:00	\N	\N	001443030005662	\N
970	4765	43/00-0323895 B 14	2023-02-13 00:00:00	\N	\N	001443030005662	\N
971	297	99 B 0362441	2010-07-01 00:00:00	\N	\N		\N
972	2379	35/00 0722946 B 00	2023-04-18 00:00:00	\N	\N		\N
973	\N	99 B 63309	\N	\N	\N		\N
974	\N	07 B 0108842	2007-09-11 00:00:00	\N	\N		\N
975	3877	12 B 0187588 - 06/00	2023-10-26 00:00:00	\N	\N		\N
976	4676	00 B 46/02 0262653	2015-09-15 00:00:00	\N	\N	000013026265323	\N
977	3470	04/00-0404738 B10	2016-10-05 00:00:00	\N	\N		\N
978	2436	04 B 0045418	2007-11-04 00:00:00	\N	\N		\N
979	1477	19/00 - 086621 B 06	2019-02-24 00:00:00	\N	\N		\N
980	\N	00 B 0903675	2000-08-20 00:00:00	\N	\N	000002090367534	\N
981	\N	99 B 0702143	\N	\N	\N		\N
982	4907	12/00-0585138 B 23	2023-11-30 00:00:00	\N	\N	198512030108541	\N
983	1680	99 B 842146	2001-11-14 00:00:00	\N	\N		\N
984	4533	99 B 842146	2001-11-14 00:00:00	\N	\N		\N
985	5040	24 B 0244405 - 07/00	2024-09-09 00:00:00	\N	\N		\N
986	2973	04 B 0562761	2006-05-22 00:00:00	\N	\N		\N
987	2615	06 B 0542863 - 16/00	2020-09-13 00:00:00	\N	\N		\N
988	2287	99 B 0083265	1999-07-27 00:00:00	\N	\N		\N
989	3954	35/00 0726616 B 13	2014-04-24 00:00:00	\N	\N		\N
990	3417	00 B 0011276	2008-03-31 00:00:00	\N	\N	000016001127673	\N
991	3953	01/00 - 0882670 B 11	2014-02-10 00:00:00	\N	\N		\N
992	3533	10 B 0343125	2010-04-12 00:00:00	\N	\N		\N
993	4392	03/00-0923129-B-05	2016-09-22 00:00:00	\N	\N	000503092312976	\N
994	4399	03/00-0923129-B-05	2016-09-22 00:00:00	\N	\N	000503092312976	\N
995	4393	03/00-0923129-B-05	2016-09-22 00:00:00	\N	\N	000503092312976	\N
996	3701	09 B 1002870	2009-07-04 00:00:00	\N	\N		\N
997	3190	0903016 B 99	2009-03-15 00:00:00	\N	\N		\N
998	2015	03 B 0862664	2019-05-26 00:00:00	\N	\N	000047100161656	\N
999	4012	43/00-0324058 B 15	2015-11-02 00:00:00	\N	\N		\N
1000	4025	48/00 0163298 B 16	2016-02-21 00:00:00	\N	\N		\N
1001	3051	07 B 0067473	2007-11-27 00:00:00	\N	\N		\N
1002	3731	06 B 0046309	2013-06-25 00:00:00	\N	\N	000615340242064	\N
1003	1715	04 B 0662910	2004-04-27 00:00:00	\N	\N	000420030003842	\N
1004	\N	31/00-07 B 0109435	2013-10-20 00:00:00	\N	\N	000731010943515	\N
1005	4373	28/00 0564590 B 18	2018-12-02 00:00:00	\N	\N		\N
1006	396	03 B 0562625 - 00/28	2017-07-16 00:00:00	\N	\N	000328056262522	\N
1007	2806	06 B 0923162	2006-02-22 00:00:00	\N	\N		\N
1008	4283	17 B 1044653  -  16/00	2017-08-22 00:00:00	\N	\N		\N
1009	411	00 B 0582529	2000-10-18 00:00:00	\N	\N		\N
1010	1625	03 B 0542633	2003-10-19 00:00:00	\N	\N	000339019006154	\N
1011	4077	12/00 0584462	2016-04-17 00:00:00	\N	\N		\N
1012	2433	16/00 - 0008903 B 99	2020-01-16 00:00:00	\N	\N		\N
1013	4536	16/00 - 0008903 B 99	2020-01-16 00:00:00	\N	\N		\N
1014	3380	22/00 – 0023640 B11	2012-10-02 00:00:00	\N	\N		\N
1015	4524	22/00 – 0023640 B11	2012-10-02 00:00:00	\N	\N		\N
1016	\N	03 B 0922961	2003-04-30 00:00:00	\N	\N		\N
1017	2032	99 B 542201	2023-02-23 00:00:00	\N	\N		\N
1018	4678	33/00-0602020B99	2019-04-29 00:00:00	\N	\N		\N
1019	\N	98 B 0322087	2007-01-30 00:00:00	\N	\N		\N
1020	3917	30/00 - 0124456 B 10	2011-10-16 00:00:00	\N	\N	001030130012082	\N
1021	2445	01 B 0017162	2009-03-22 00:00:00	\N	\N		\N
1022	\N	02 B 0462949	2006-05-02 00:00:00	\N	\N		\N
1023	1689	99 B 0282216 10/00	2013-06-19 00:00:00	\N	\N		\N
1024	179	00 B 0142577	2000-10-16 00:00:00	\N	\N		\N
1025	\N	06 B 0974302  16/00	2006-07-04 00:00:00	\N	\N		\N
1026	\N	05 B 0904865	2005-01-19 00:00:00	\N	\N		\N
1027	1840	03 B 0422616	2019-01-09 00:00:00	\N	\N		\N
1028	3795	98 B 0322199	\N	\N	\N		\N
1029	1730	34/00-0463355 B 05	2014-07-16 00:00:00	\N	\N		\N
1030	2818	98 B 0182576	1999-04-10 00:00:00	\N	\N		\N
1031	2617	01 A 45223404	2001-04-01 00:00:00	\N	\N		\N
1032	3490	07 B 0364445	2009-01-13 00:00:00	\N	\N	000723039002454	\N
1033	2569	04 B 0562736	2004-07-07 00:00:00	\N	\N		\N
1034	3028	0842308 B04	2010-12-09 00:00:00	\N	\N		\N
1035	2146	0842308 B04	2010-12-09 00:00:00	\N	\N		\N
1036	\N	99 B 43043	1999-04-10 00:00:00	\N	\N		\N
1037	3879	12 B 0048701	2012-08-28 00:00:00	\N	\N		\N
1038	\N	09 B 0088419	2009-10-20 00:00:00	\N	\N		\N
1039	\N	98 B 0922344	2004-10-13 00:00:00	\N	\N		\N
1040	2284	01 B 0402777	2001-03-20 00:00:00	\N	\N		\N
1041	2416	02 B 0184089	2006-04-23 00:00:00	\N	\N		\N
1042	3469	99 A 1321670	2005-05-09 00:00:00	\N	\N		\N
1043	4407	19/00 - 0092319 B 16	2017-02-08 00:00:00	\N	\N	001619010030759	\N
1044	\N	98 B 0142152	1998-07-13 00:00:00	\N	\N		\N
1045	2633	99 B 0562127	1999-02-28 00:00:00	\N	\N		\N
1046	1877	07 B 0463554	2019-02-06 00:00:00	\N	\N		\N
1047	4361	07B-0975427-16/00	2018-10-09 00:00:00	\N	\N		\N
1048	3975	13/00-0264921 B 15	2015-12-17 00:00:00	\N	\N	00513026486112	\N
1049	\N	01 B 0662491	2003-10-13 00:00:00	\N	\N		\N
1050	311	99 B 9021193	1999-10-30 00:00:00	\N	\N		\N
1051	4367	05/00-0225660B17	2021-07-15 00:00:00	\N	\N	001705022566049	\N
1052	4384	05 B 0970948 - 00/16	2017-02-26 00:00:00	\N	\N		\N
1053	4258	05 B 0970948 - 00/16	2017-02-26 00:00:00	\N	\N		\N
1054	4256	05 B 0970948 - 00/16	2017-02-26 00:00:00	\N	\N		\N
1055	4382	05 B 0970948 - 00/16	2017-02-26 00:00:00	\N	\N		\N
1056	\N	06 B 0242701	2006-10-30 00:00:00	\N	\N		\N
1057	2295	02 B 462982	\N	\N	\N		\N
1058	\N		\N	\N	\N	0001029019005451	\N
1059	2519	27/00-0964647B04	2015-09-15 00:00:00	\N	\N	00427030853350	\N
1060	4967	27/00-0964647B04	2015-09-15 00:00:00	\N	\N	00427030853350	\N
1061	4688	N° 16/00 - 1044215 B15	2018-04-24 00:00:00	\N	\N	001716210123853	\N
1062	3331	31/00-0983568 B 09	2019-03-12 00:00:00	\N	\N	000916098356847	\N
1063	2668	05 B 0108330	2005-09-05 00:00:00	\N	\N		\N
1064	4253	13 B 0163120  00/48	2013-03-19 00:00:00	\N	\N		\N
1065	3541	08 B 0822288	\N	\N	\N		\N
1066	3159	06 B 0086636	2006-05-29 00:00:00	\N	\N		\N
1067	4716	N°  11/00-0202246 B08	2018-07-11 00:00:00	\N	\N	1101012889	\N
1068	\N	31/00-1123597B20	2022-07-25 00:00:00	\N	\N	002031112359745	\N
1069	2836	04 B 0422686	2004-04-20 00:00:00	\N	\N		\N
1070	4181	05/00-0225165 B 15	2015-02-11 00:00:00	\N	\N	001505139001749	\N
1071	4097	15 B 0584356	2015-03-23 00:00:00	\N	\N		\N
1072	4698	32/04-0642145 B 10	2018-02-08 00:00:00	\N	\N		\N
1073	3073	04 B 01/0107065	2006-02-20 00:00:00	\N	\N		\N
1074	4962	02/00 - 0907603 B 23	2023-12-05 00:00:00	\N	\N		\N
1075	4796	06/00-0187240B11	2021-11-22 00:00:00	\N	\N		\N
1076	2524	02B 0020109	2002-12-02 00:00:00	\N	\N		\N
1077	3984	02B 0020109	2002-12-02 00:00:00	\N	\N		\N
1078	4920	28/00-0565102 B 22	2022-01-27 00:00:00	\N	\N	002228130003073	\N
1079	1164	05 B 0422766	2005-03-06 00:00:00	\N	\N	000514019002857	\N
1080	4960	25/00 - 0063515 B 00	2018-07-15 00:00:00	\N	\N	000025010076853	\N
1081	4134	07 B 05832330  12/00	2011-06-20 00:00:00	\N	\N	000712010000381	\N
1082	100	98 B 282162	1999-02-04 00:00:00	\N	\N		\N
1083	1221	03 B 463013	2003-03-30 00:00:00	\N	\N	000334010013080	\N
1084	162	97 B 0282011	1997-08-31 00:00:00	\N	\N		\N
1085	2281	98 B 0562063  - 00/28	2015-12-30 00:00:00	\N	\N	099828270504816	\N
1086	4110	98 B 0562063  - 00/28	2015-12-30 00:00:00	\N	\N	099828270504816	\N
1087	2905	05 B 969448	2008-12-16 00:00:00	\N	\N	000516096944826	\N
1088	3231	03 B 0242490	2003-06-14 00:00:00	\N	\N		\N
1089	3246	04 B 0502479	2004-04-07 00:00:00	\N	\N	000441019001262	\N
1090	1977	00 B 0462579	2000-05-20 00:00:00	\N	\N		\N
1091	955	B99 632449	\N	\N	\N		\N
1092	564	0902056B98	2005-09-14 00:00:00	\N	\N		\N
1093	1097	17/00 -0302266 B 99	2011-07-21 00:00:00	\N	\N		\N
1094	3422	02 B 0562492	2012-05-31 00:00:00	\N	\N		\N
1095	4037	12 B 0726078	2012-01-31 00:00:00	\N	\N		\N
1096	2084	99 B 0082931	1999-03-03 00:00:00	\N	\N		\N
1097	2611	03 B 0522982	2005-08-17 00:00:00	\N	\N		\N
1098	298	99 B 0083132	1999-05-26 00:00:00	\N	\N		\N
1099	3858	39/01 0543229 B 10	2016-07-10 00:00:00	\N	\N		\N
1100	5025	04/00-0406273B20	2020-11-10 00:00:00	\N	\N		\N
1101	144	0902173 B 98	2008-08-04 00:00:00	\N	\N	97020204800433	\N
1102	4140	11 B 0583729  - 12/00	2016-04-13 00:00:00	\N	\N	001112219004849	\N
1103	2332	99 B 0082861	1999-02-13 00:00:00	\N	\N		\N
1104	\N	99 B 9021016	1999-08-22 00:00:00	\N	\N		\N
1105	\N	98 B 0942081	\N	\N	\N		\N
1106	129	00 B 0142457	2000-02-13 00:00:00	\N	\N	098221010004445	\N
1107	\N	07 B 0583290	\N	\N	\N		\N
1108	2583	98 B 0222106	2015-10-11 00:00:00	\N	\N	99805180720724	\N
1109	3761	27/00-0782361 B 02	2017-03-05 00:00:00	\N	\N		\N
1110	2544	97 B 0922004	2003-05-20 00:00:00	\N	\N		\N
1111	3906	10 B 0242943	2010-06-29 00:00:00	\N	\N	707024272108	\N
1112	2905	05 B 969448	2007-01-16 00:00:00	\N	\N		\N
1113	5028	99 B 0009368-16/00	2021-06-10 00:00:00	\N	\N		\N
1114	1676	98 B 0882115	1998-12-09 00:00:00	\N	\N		\N
1115	3081	05 B 0482691	2005-05-24 00:00:00	\N	\N		\N
1116	4286	17 B 0622284    00/32	2017-05-09 00:00:00	\N	\N		\N
1117	3990	27/00-0782439 B 03	2009-08-26 00:00:00	\N	\N		\N
1118	253	99 B 0082794	1999-01-04 00:00:00	\N	\N		\N
1119	102	15/00 - 1082151 B 18	2018-02-06 00:00:00	\N	\N		\N
1120	3730	06 B 0242662	2011-04-05 00:00:00	\N	\N		\N
1121	615	06 B 0242662	2011-04-05 00:00:00	\N	\N		\N
1122	2573	99 B 0822079	1999-04-25 00:00:00	\N	\N		\N
1123	3970	15 B 0423521	2015-09-01 00:00:00	\N	\N	00151404279001154	\N
1124	4312	10 B 0423137	2019-01-08 00:00:00	\N	\N		\N
1125	3540	00 B 0122824	2012-09-04 00:00:00	\N	\N		\N
1126	4285	01/00 - 0882983 B 17	2020-06-29 00:00:00	\N	\N		\N
1127	\N	99 B 0242254	2002-08-06 00:00:00	\N	\N		\N
1128	2761	04 B 0403770	2004-05-10 00:00:00	\N	\N		\N
1129	2443	00 B 0822113	2003-06-08 00:00:00	\N	\N		\N
1130	3896	07 B 0162741	\N	\N	\N		\N
1131	3283	97 B 0922064	2008-04-15 00:00:00	\N	\N		\N
1132	894	97 B 0922064	2008-04-15 00:00:00	\N	\N		\N
1133	2185	99 B 0862356	1999-05-09 00:00:00	\N	\N		\N
1134	5015	n°19/00-1163696 B	2024-05-09 00:00:00	\N	\N		\N
1135	\N	98 B 0082490	1998-07-13 00:00:00	\N	\N		\N
1136	2081	15/00-0045174 b 03	2017-02-19 00:00:00	\N	\N		\N
1137	4177	15/00-0045174 b 03	2017-02-19 00:00:00	\N	\N		\N
1138	144	98 B 9020173	1998-10-17 00:00:00	\N	\N		\N
1139	1907	03 B 0021407	2004-09-11 00:00:00	\N	\N		\N
1140	2637	05 B 0123755	2022-07-25 00:00:00	\N	\N		\N
1141	3350	99 B 0502238	1999-11-09 00:00:00	\N	\N	099941019008125	\N
1142	2683	05 B 0364056 - 23/00	2016-10-27 00:00:00	\N	\N	000523036405666	\N
1143	2383	99 B 0282292	2003-02-24 00:00:00	\N	\N		\N
1144	3766	12 B 0991092	2012-09-20 00:00:00	\N	\N	001216219002846000	\N
1145	1221	34/00-0463013 B 03	2011-06-02 00:00:00	\N	\N	00033404630199	\N
1146	3096	04 B 0502492	2004-07-27 00:00:00	\N	\N		\N
1147	2885	06 B 0502566	2006-11-06 00:00:00	\N	\N	0006410290001749	\N
1148	177	98 B 0662121	\N	\N	\N		\N
1149	289	99 B 0062612	2003-05-31 00:00:00	\N	\N		\N
1150	4138	15 B 0225162 15/00	2015-02-08 00:00:00	\N	\N		\N
1151	4357	06/00-0182304B98	2018-02-11 00:00:00	\N	\N	098506010023251	\N
1152	2032	99 B 542201	2014-05-18 00:00:00	\N	\N		\N
1153	143	98 B 0802158	2014-08-04 00:00:00	\N	\N		\N
1154	3849	01 B 0084184	2001-10-23 00:00:00	\N	\N	000119200473748	\N
1155	2104	01 B 0582600	\N	\N	\N		\N
1156	1792	16/00 0014340 B 00	2013-03-18 00:00:00	\N	\N	000016001434006	\N
1157	3951	16/00 0014340 B 00	2013-03-18 00:00:00	\N	\N	000016001434006	\N
1158	4097	15 B 0584371	2015-04-27 00:00:00	\N	\N		\N
1159	3913	09 B 0088371 - 19/00	2023-11-21 00:00:00	\N	\N	000919008837195	\N
1160	\N	99 B 462251	\N	\N	\N		\N
1161	4216	13/B0423337-14/00	2014-11-13 00:00:00	\N	\N		\N
1162	3432	0403854 B 04	2004-07-26 00:00:00	\N	\N	000404010426958	\N
1163	\N	97 B 0122101	2006-02-22 00:00:00	\N	\N		\N
1164	4792	05/00-0224281 B 11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
1165	4788	05/00-0224281 B 11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
1166	4789	05/00-0224281 B 11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
1167	4365	05/00-0224281 B 11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
1168	4791	05/00-0224281 B 11	2018-03-19 00:00:00	\N	\N	001105230004962	\N
1169	\N	48/00-0162673B05	2019-03-27 00:00:00	\N	\N		\N
1170	2380	99 B 03/0122481	\N	\N	\N		\N
1171	464	06 B 0322975	2006-03-13 00:00:00	\N	\N		\N
1172	2417	99 B 0043428	2000-02-12 00:00:00	\N	\N		\N
1173	3477	08/00/0942984-09	\N	\N	\N		\N
1174	443	26/00 0342550 B 02	2011-07-24 00:00:00	\N	\N	000226019009540	\N
1175	2334	98 B 462186	2005-07-10 00:00:00	\N	\N		\N
1176	4795	30/00-0125406 B16	2016-08-01 00:00:00	\N	\N		\N
1177	324	00 B 0282461	2000-02-29 00:00:00	\N	\N		\N
1178	2368	00/00-0123501 b 04	2014-12-14 00:00:00	\N	\N		\N
1179	4014	11 B 0563276  - 00/28	2013-11-21 00:00:00	\N	\N		\N
1180	3799	10 B 0986312	\N	\N	\N		\N
1181	2533	99 B 0722725	2004-10-24 00:00:00	\N	\N		\N
1182	331	99 B 63060	\N	\N	\N		\N
1183	4965	16/00 - 1043194 B 16	2022-10-03 00:00:00	\N	\N		\N
1184	3849	19/00 - 0084184 B 01	2016-12-21 00:00:00	\N	\N	0119200473748	\N
1185	82	99 B 0007705	\N	\N	\N		\N
1186	1844	08 B 0323219	2008-06-29 00:00:00	\N	\N		\N
1187	2412	99 B 0009320	2017-04-09 00:00:00	\N	\N	098909150012635	\N
1188	\N	01 B 0017162	2001-08-27 00:00:00	\N	\N		\N
1189	666	00 B 0302339 - 00/17	2022-12-27 00:00:00	\N	\N	00017030233908	\N
1190	2996	03 B 0962321	2003-09-21 00:00:00	\N	\N		\N
1191	1237	99 B 0562193	\N	\N	\N		\N
1192	3411	08 B 0162850	\N	\N	\N		\N
1193	2534	04 B 0065798	\N	\N	\N		\N
1194	4182	22/00-0024250 B 16	2019-02-06 00:00:00	\N	\N	001622002425091	\N
1195	3326	0047455 B 09	2014-03-09 00:00:00	\N	\N	000915019008448	\N
1196	4956	48/00 - 0163708 B 23	2023-03-06 00:00:00	\N	\N	002348120000758	\N
1197	\N	98 B 0902234	2006-04-18 00:00:00	\N	\N		\N
1198	1675	98 B 0882099	2000-06-12 00:00:00	\N	\N	97701110015450	\N
1199	1477	06 B 0086621	2006-05-22 00:00:00	\N	\N		\N
1200	4771	25/00-0070187 B 13	2015-06-08 00:00:00	\N	\N		\N
1201	1233	99 B 0402388	1999-10-17 00:00:00	\N	\N		\N
1202	4912	39/00-0543870 B 15	2020-11-10 00:00:00	\N	\N	001539010009851	\N
1203	3860	02/00 0904174 B 02	2012-07-29 00:00:00	\N	\N	00020221035585978106	\N
1204	3847	08 B 0185858	2018-02-15 00:00:00	\N	\N	000806018585831	\N
1205	5019	54/00-0217012B21	2024-03-14 00:00:00	\N	\N		\N
1206	81	19/00-0092720 B 17	2017-06-07 00:00:00	\N	\N	001719009272041	\N
1207	451	00 B 122913	\N	\N	\N		\N
1208	2879	01 B 64265	\N	\N	\N		\N
1209	2599	01 B 64265	\N	\N	\N		\N
1210	1476	30/00 - 0122112 B 98	2016-01-11 00:00:00	\N	\N	099830012211258	\N
1211	4678	33/00-0602020 B99	2019-04-29 00:00:00	\N	\N	099833030726914	\N
1212	53	0223084	2003-04-20 00:00:00	\N	\N	000305019003265	\N
1213	1404	00 B 0262523	2003-05-07 00:00:00	\N	\N	099113010279530	\N
1214	4534	19/00 - 1162258 B 21	2021-01-28 00:00:00	\N	\N		\N
1215	3913	09 B 0088371	2014-02-06 00:00:00	\N	\N	000919008837195	\N
1216	1820	10/00 – 0282974 B 04	2019-02-26 00:00:00	\N	\N		\N
1217	\N	09 B 0242836	2009-02-04 00:00:00	\N	\N	000907024283698	\N
1218	3157	99 B 0302216	1999-04-05 00:00:00	\N	\N		\N
1219	3813	07 B 0905554	2017-11-13 00:00:00	\N	\N		\N
1220	3168	06 B 0971791	2006-05-30 00:00:00	\N	\N	000616509035046	\N
1221	2636	30/00-0122101 B 97	2017-02-09 00:00:00	\N	\N	099730040684127	\N
1222	2271	03 B 0021635	2003-06-16 00:00:00	\N	\N	000316130371163	\N
1223	\N	07B0583235	2007-04-10 00:00:00	\N	\N		\N
1224	3415	99 B 0722789	1999-09-22 00:00:00	\N	\N	09993519035711	\N
1225	3161	08 B 0976903	2008-04-13 00:00:00	\N	\N		\N
1226	\N	07 B 0223665	2007-03-19 00:00:00	\N	\N		\N
1227	2993	04 B 0442528	2006-05-06 00:00:00	\N	\N		\N
1228	3331	n°31/00 - 0983568 B09	2010-02-22 00:00:00	\N	\N		\N
1229	604	04 B 0263131	2017-12-06 00:00:00	\N	\N		\N
1230	367	09 B 0382773	2009-07-25 00:00:00	\N	\N	00924239004249	\N
1231	3465	0422953B07	2007-12-18 00:00:00	\N	\N	000714019006845	\N
1232	2720	98 B 0222257	2004-06-28 00:00:00	\N	\N		\N
1233	188	97 B 0362074	1998-12-09 00:00:00	\N	\N		\N
1234	2579	00 B 0782236	2001-09-09 00:00:00	\N	\N		\N
1235	3740	08 B 0067637	2011-03-24 00:00:00	\N	\N	000825006763783	\N
1236	4277	16/00-0124704 B 12	2023-12-25 00:00:00	\N	\N	001230070010864	\N
1237	4275	16/00-0124704 B 12	2023-12-25 00:00:00	\N	\N	001230070010864	\N
1238	2294	16/00-0012818 B 00	2024-05-29 00:00:00	\N	\N	097916150010540	\N
1239	3643		\N	\N	\N	000322069013355	\N
1240	1912	98 B 0122237	2002-02-18 00:00:00	\N	\N		\N
1241	2556	97 B 122023	1999-08-03 00:00:00	\N	\N	99730040640923	\N
1242	4631	56/00-0612052 B21	\N	\N	\N		\N
1243	3978	01/00-0882749 B 13	2013-02-11 00:00:00	\N	\N	001301019001073	\N
1244	3969	02/00-0906597 B 13	2013-12-26 00:00:00	\N	\N		\N
1245	5030	39/00-0543685 B 14	2024-07-25 00:00:00	\N	\N	001439054368576	\N
1246	\N	43/00-0324134 B 16	2016-06-27 00:00:00	\N	\N	001643030005758	\N
1247	3793	11 B 0224281	2012-02-09 00:00:00	\N	\N	01105239005747	\N
1248	533	97 B 0082039	2017-05-14 00:00:00	\N	\N	099519010194424	\N
1249	2592	05 B 0663060	2005-09-14 00:00:00	\N	\N		\N
1250	1599	98 B 462127	2000-11-22 00:00:00	\N	\N		\N
1251	\N	99 B 0022174	2003-10-11 00:00:00	\N	\N		\N
1252	\N	98 B 402028	1998-04-27 00:00:00	\N	\N		\N
1253	3570	07B0223750	2012-11-07 00:00:00	\N	\N	000705429010449	\N
1254	\N	07 B 0663198	2007-10-31 00:00:00	\N	\N		\N
1255	3060	99 B 0006630	1999-02-21 00:00:00	\N	\N		\N
1256	4109	11 B 1004654 - 00/16	2011-04-13 00:00:00	\N	\N		\N
1257	3495	08/B/0782947	\N	\N	\N		\N
1258	2199	94 B 90352	\N	\N	\N		\N
1259	4978	31/00-0117291 b18	2018-01-09 00:00:00	\N	\N	001831010014271	\N
1260	3210	08 B 0978193	2008-08-18 00:00:00	\N	\N	000816299069619	\N
1261	4202	16/00-1042080 B 15	2015-10-26 00:00:00	\N	\N		\N
1262	3190	0903016 B 99	2010-08-19 00:00:00	\N	\N		\N
1263	2741	06 B 0223564	2006-06-06 00:00:00	\N	\N	000605022356414	\N
1264	5005	06 B 0223564	2006-06-06 00:00:00	\N	\N	000605022356414	\N
1265	3535	07B0463613	\N	\N	\N		\N
1266	3637	06 B 023114	2006-02-20 00:00:00	\N	\N	000622002311490	\N
1267	4425	11/00-0202454 B17	2020-01-28 00:00:00	\N	\N		\N
1268	3740	25/00 0067637 B 08	2015-05-24 00:00:00	\N	\N	000825006763783	\N
1269	5053	16/00-1001757 B 21	2021-11-11 00:00:00	\N	\N	002116100175776	\N
1270	4022	13 B 0584051	2013-04-21 00:00:00	\N	\N		\N
1271	\N	98 B 462191	\N	\N	\N		\N
1272	2083	99 B 0322240	\N	\N	\N		\N
1273	4238	30/00-0124702 B 12	2016-06-23 00:00:00	\N	\N	001230012470243	\N
1274	2915	02 B 0542420	2017-05-03 00:00:00	\N	\N		\N
1275	2792	98 B 0762057	2006-05-15 00:00:00	\N	\N		\N
1276	2738	06 B 0882516	2006-06-07 00:00:00	\N	\N		\N
1277	3144	0084570B02	2005-12-25 00:00:00	\N	\N	0398419430011437	\N
1278	\N	08 B 0223862	2008-08-10 00:00:00	\N	\N		\N
1279	484	34/00-0462619 B 00	2009-12-22 00:00:00	\N	\N		\N
1280	4143	00 B 722946	2000-01-31 00:00:00	\N	\N	098135020004840	\N
1281	2954	05 B 0969633	2005-09-28 00:00:00	\N	\N		\N
1282	3758	99 B 0162208	\N	\N	\N		\N
1283	11	06 B 0404255	2006-11-15 00:00:00	\N	\N	195204020041943	\N
1284	2164	04 B 0662937	2004-07-07 00:00:00	\N	\N		\N
1285	2293	99 B 0302166	1999-01-26 00:00:00	\N	\N		\N
1286	4419	17/00 - 0302978 B 11	2022-05-05 00:00:00	\N	\N		\N
1287	3730	06 B 0242662	2014-03-06 00:00:00	\N	\N		\N
1288	615	06 B 0242662	2014-03-06 00:00:00	\N	\N		\N
1289	\N	06/00-0183636 ب 01	2021-06-22 00:00:00	\N	\N		\N
1290	2119	21/00-0362613 B99	2017-09-12 00:00:00	\N	\N		\N
1291	3068	08 B 0263616	2008-01-15 00:00:00	\N	\N		\N
1292	2189	00 B 63615	\N	\N	\N		\N
1293	3283	03/00-0922064 B 97	2019-10-02 00:00:00	\N	\N		\N
1294	894	03/00-0922064 B 97	2019-10-02 00:00:00	\N	\N		\N
1295	4716	N°  11/00-0202246 B08	2018-07-11 00:00:00	\N	\N	11010121889	\N
1296	3391	0067301 B 07	2007-05-23 00:00:00	\N	\N		\N
1297	27	99 B 0083182	1999-04-01 00:00:00	\N	\N		\N
1298	\N	04 B 0223286	\N	\N	\N	000405022328633	\N
1299	159	97 B 222007	1997-08-24 00:00:00	\N	\N		\N
1300	\N	98 B 0122403	2011-02-21 00:00:00	\N	\N	099830019170122	\N
1301	2078	03 B 0223124-05/00	2019-10-01 00:00:00	\N	\N	305022312462	\N
1302	\N	98 B 9020173	1998-10-17 00:00:00	\N	\N		\N
1303	\N	99 B 0083440	2007-01-13 00:00:00	\N	\N		\N
1304	4834	20/00-0742009 B 98	2020-12-06 00:00:00	\N	\N		\N
1305	3538	09 A 0124260	\N	\N	\N		\N
1306	1544	02  B 0502400  41/00	2016-02-02 00:00:00	\N	\N		\N
1307	\N	99 A 4517461	1999-05-25 00:00:00	\N	\N		\N
1308	221	00 B 0022479	2009-05-10 00:00:00	\N	\N	9722010400936	\N
1309	76	01 B 0015361	2001-07-07 00:00:00	\N	\N		\N
1310	2054	03B 0882365	2003-03-03 00:00:00	\N	\N		\N
1311	\N	0985776 B 10	2018-09-17 00:00:00	\N	\N		\N
1312	3898	99 B 0082883	2011-07-31 00:00:00	\N	\N	099919008288302	\N
1313	2537	04 B 0107348	2004-05-22 00:00:00	\N	\N		\N
1314	2433	16/00 - 0008903 B 99	2020-01-26 00:00:00	\N	\N	099916000890340	\N
1315	4536	16/00 - 0008903 B 99	2020-01-26 00:00:00	\N	\N	099916000890340	\N
1316	3425	98 B 0582173-12/00	2022-03-09 00:00:00	\N	\N	099212010266437	\N
1317	\N	16/00-0968770	2019-05-27 00:00:00	\N	\N		\N
1318	2303	98 B 0322061	1998-12-21 00:00:00	\N	\N	099845082206131	\N
1319	337	98 B 0322104	2006-08-06 00:00:00	\N	\N		\N
1320	4081	00-16 0987909 B 13	2015-12-01 00:00:00	\N	\N	0013116098790984	\N
1321	2774	02 B 0084241	2003-05-05 00:00:00	\N	\N		\N
1322	\N	05 B 0342836	2005-07-12 00:00:00	\N	\N		\N
1323	\N	16/00-1001759B21	2021-11-11 00:00:00	\N	\N		\N
1324	542	01 B 0402818	2001-06-12 00:00:00	\N	\N		\N
1325	4044	05/00 0222528 B 99	2012-06-30 00:00:00	\N	\N		\N
1326	3409	04 B 0022938	2014-02-10 00:00:00	\N	\N		\N
1327	4022	13 B 0584051- 00/12	2013-04-21 00:00:00	\N	\N		\N
1328	5014	n°45/00-0822559 B 24	2024-07-08 00:00:00	\N	\N		\N
1329	1215	00 B 0222718	2000-11-29 00:00:00	\N	\N		\N
1330	2856	03 B 0622117	2003-12-28 00:00:00	\N	\N	000332010889054	\N
1331	5029	16/00-0366035 B 14	2024-04-29 00:00:00	\N	\N	001423036603523	\N
1332	\N	00 B 0011276	2008-03-31 00:00:00	\N	\N		\N
1333	3635	06 B 0404188	2007-06-20 00:00:00	\N	\N	000604040418820	\N
1334	2365	99 B 0222473	2013-04-24 00:00:00	\N	\N		\N
1335	2339	00 B 13258	2006-09-26 00:00:00	\N	\N		\N
1336	2849	07 B 0976642	2007-04-18 00:00:00	\N	\N		\N
1337	3442	0563158	2010-01-11 00:00:00	\N	\N	0001028299006341	\N
1338	4145	99 B 0242128	1999-01-26 00:00:00	\N	\N		\N
1339	1433	99 B 0242128	1999-01-26 00:00:00	\N	\N		\N
1340	4529	99 B 0242128	1999-01-26 00:00:00	\N	\N		\N
1341	\N	04 B 0542650	2019-01-18 00:00:00	\N	\N	000439054265069	\N
1342	2768	97 A 3710207	1998-11-19 00:00:00	\N	\N		\N
1343	2297	00 B 0382248	2000-01-02 00:00:00	\N	\N		\N
1344	2367	98 B 0042349 00/16	2013-12-04 00:00:00	\N	\N		\N
1345	1089	98 B 0242080	\N	\N	\N		\N
1346	2036	98 B 0922346	1998-12-13 00:00:00	\N	\N		\N
1347	4107	16 B 0144256 - 00/21	2018-10-02 00:00:00	\N	\N	001621280001563	\N
1348	3043	35/00-0722578 B 99	2024-01-10 00:00:00	\N	\N	99935072257842	\N
1349	3475	09/B/024 28 53	\N	\N	\N		\N
1350	2843	0723203B00	2007-01-27 00:00:00	\N	\N		\N
1351	501	99 B 182212	\N	\N	\N		\N
1352	2344	00 B 0722917	\N	\N	\N		\N
1353	2048	99 B 04002231-25/00	2022-06-23 00:00:00	\N	\N		\N
1354	\N	08 B 0978193	2008-08-18 00:00:00	\N	\N		\N
1355	1514	02B0422514	2002-05-21 00:00:00	\N	\N		\N
1356	2414	00 B 0014362	2013-05-12 00:00:00	\N	\N	00016001436218	\N
1357	5066	34/00 - 0463936 B 09	2024-09-24 00:00:00	\N	\N	000934020008168	\N
1358	160	05 B 0702320	2005-06-22 00:00:00	\N	\N		\N
1359	4828	05/00 - 0225455 B 16	2021-01-06 00:00:00	\N	\N	001605010011180	\N
1360	2557		\N	\N	\N	000531029020847	\N
1361	\N	01 B 262736	\N	\N	\N		\N
1362	2252	98 B 01223366	\N	\N	\N		\N
1363	3952	05/00 0224285 B 11	2011-04-10 00:00:00	\N	\N	001105022428513	\N
1364	2133		\N	\N	\N	000516019029054	\N
1365	1797	98 B 0322116	2015-11-29 00:00:00	\N	\N	99843020244625	\N
1366	2300	08 B 0323220	2008-06-30 00:00:00	\N	\N		\N
1367	1312	99 B 62762	\N	\N	\N		\N
1368	3963	01/00-0882018 B 98	2014-02-19 00:00:00	\N	\N	099801120478915	\N
1369	3458	98 B 0003802	1998-05-12 00:00:00	\N	\N		\N
1370	3012	98 B 0003802	1998-05-12 00:00:00	\N	\N		\N
1371	4023	07 B 0583235	2009-09-13 00:00:00	\N	\N	000712058323543	\N
1372	3742	07 B 0583235	2009-09-13 00:00:00	\N	\N	000712058323543	\N
1373	4975	05/00 - 0223102 B 03	2018-11-13 00:00:00	\N	\N		\N
1374	3575	04 B 0184577	2011-01-13 00:00:00	\N	\N	0406269018737	\N
1375	\N	02 B 0084476	2002-03-31 00:00:00	\N	\N		\N
1376	2444	99 B 0822084	1999-06-30 00:00:00	\N	\N		\N
1377	3248	01 B 0903971	2007-12-12 00:00:00	\N	\N		\N
1378	4199	0242836 B 09	2015-03-19 00:00:00	\N	\N		\N
1379	4901	n°48/00-0163145 B13	2022-11-03 00:00:00	\N	\N	001348010005464	\N
1380	4367	05/00-0225660B17	2017-08-13 00:00:00	\N	\N	001705022566049	\N
1381	1199	18/00-0442149 B 99	2012-07-02 00:00:00	\N	\N	09991804421491200000	\N
1382	666	00 B 0302339	2011-11-15 00:00:00	\N	\N	00017030233908	\N
1383	4733	14B0323895-00/43	2023-02-13 00:00:00	\N	\N		\N
1384	4765	14B0323895-00/43	2023-02-13 00:00:00	\N	\N		\N
1385	4249	99 B 0009684  00/16	2015-11-10 00:00:00	\N	\N		\N
1386	2114	99 B 0103092	2001-10-06 00:00:00	\N	\N		\N
1387	\N	43/00-0323489 B10	2015-01-04 00:00:00	\N	\N	00104303234890343001	\N
1388	3062	98 B 0122438	2020-06-03 00:00:00	\N	\N	99830012243803	\N
1389	4526	16/00-0986657 B13	2020-03-08 00:00:00	\N	\N	001316130014369	\N
1390	4528	16/00-0986657 B13	2020-03-08 00:00:00	\N	\N	001316130014369	\N
1391	4011	47/00 – 0862993 B 08	2022-08-01 00:00:00	\N	\N		\N
1392	4842	14 B 0070730 - 25/00	2023-03-05 00:00:00	\N	\N		\N
1393	2845	0702357B07	2019-07-31 00:00:00	\N	\N	000738070235704	\N
1394	5109	0702357B07	2019-07-31 00:00:00	\N	\N	000738070235704	\N
1395	3016	98 B 0102796	2005-06-08 00:00:00	\N	\N		\N
1396	2107	21/00-0582681 B 02	2016-01-14 00:00:00	\N	\N		\N
1397	519	10 B 0264047	2011-02-14 00:00:00	\N	\N	00101329901515	\N
1398	981	12/00-0582857 B 03	2013-11-26 00:00:00	\N	\N		\N
1399	\N	05 B 0108232	2010-12-28 00:00:00	\N	\N		\N
1400	3487	00 B 0242692	2009-09-27 00:00:00	\N	\N		\N
1401	2334	34/00 - 0462186 B 98	2021-04-14 00:00:00	\N	\N	099234010248237	\N
1402	3123	05 B 0782680	2005-11-14 00:00:00	\N	\N		\N
1403	\N	05 B 0263312	2005-05-18 00:00:00	\N	\N		\N
1404	3531	05B 0482709	2005-12-25 00:00:00	\N	\N		\N
1405	768	00 B 0013268	2000-07-03 00:00:00	\N	\N	000016531011857	\N
1406	2068	98 B 0462066	1998-02-03 00:00:00	\N	\N		\N
1407	3386	09 B 0088419	2015-10-19 00:00:00	\N	\N	000919008841995	\N
1408	4688	16/00-1044215 B 17	2018-04-24 00:00:00	\N	\N	001716210123853	\N
1409	4271	30/00 0124557 B 11	2015-04-07 00:00:00	\N	\N	001130012455723	\N
1410	4538	43/00-0322199 B 98	2021-04-25 00:00:00	\N	\N	099443080562520001	\N
1411	4836	42/00-0523040 b03	2021-04-25 00:00:00	\N	\N		\N
1412	1757	34/00 - 0463498 B 06	2019-03-13 00:00:00	\N	\N		\N
1413	3213	09B0088105	2016-02-09 00:00:00	\N	\N		\N
1414	2278	07 B 0543038-00/39	2019-04-11 00:00:00	\N	\N		\N
1415	\N	07 B 0923245	2007-11-12 00:00:00	\N	\N		\N
1416	2438	98 B 842037	\N	\N	\N		\N
1417	4768	31/00-0104448 B 00	2017-09-13 00:00:00	\N	\N		\N
1418	2191	00 B 0014030 16/00	2019-06-06 00:00:00	\N	\N	000016001403077	\N
1419	5052	16/00- 1282572 B24	2024-04-02 00:00:00	\N	\N	002416280088439	\N
1420	2777	06 B 0923198	2006-08-01 00:00:00	\N	\N		\N
1421	1699	00 B 0462519 00/34	2012-03-07 00:00:00	\N	\N	000034046251933	\N
1422	2955	07 B 0975135	2018-03-14 00:00:00	\N	\N		\N
1423	2881	07 B  0162756	2007-06-27 00:00:00	\N	\N		\N
1424	4052	12/0060584455 B 16	2016-03-16 00:00:00	\N	\N		\N
1425	272	99 B 63281	2019-02-11 00:00:00	\N	\N	099825060754126	\N
1426	2528	99 B 0242190	2005-08-25 00:00:00	\N	\N		\N
1427	3062	98 B 0122438	1996-01-14 00:00:00	\N	\N	099830012243803	\N
1428	3867	16/00 0016868 B 01	2016-11-10 00:00:00	\N	\N	000116001686837	\N
1429	2952	05 B 0805385	2006-01-29 00:00:00	\N	\N		\N
1430	3756	05 B 0242584	\N	\N	\N		\N
1431	2275	02 B 0422517	\N	\N	\N		\N
1432	242	00 B 0822071	1999-02-21 00:00:00	\N	\N		\N
1433	4970	16/00-0006106 b 99	2018-01-23 00:00:00	\N	\N		\N
1434	\N	00 B 0083870	2000-11-25 00:00:00	\N	\N		\N
1435	3952	05/00 0224285 B 11	2016-10-11 00:00:00	\N	\N	001105022428513	\N
1436	\N	05 B 0223447	2007-07-30 00:00:00	\N	\N		\N
1437	3396	19/00-0086912 B 07	2019-01-09 00:00:00	\N	\N		\N
1438	4913	21 B 0584889	2021-09-20 00:00:00	\N	\N		\N
1439	1480	30/00-0122634B99	2019-02-03 00:00:00	\N	\N		\N
1440	1680	99 B 0842146	2001-11-14 00:00:00	\N	\N		\N
1441	4533	99 B 0842146	2001-11-14 00:00:00	\N	\N		\N
1442	4287	17 B 0050660 03/00	2015-01-15 00:00:00	\N	\N	001715005066053	\N
1443	3640	99 B 0302220	2002-05-12 00:00:00	\N	\N	099517319030713	\N
1444	76	01 B 0015361	2015-03-15 00:00:00	\N	\N		\N
1445	3230	08 B 0223862	2008-08-10 00:00:00	\N	\N	000805199009440	\N
1446	4908	21/00-0144395 B 17	2017-05-10 00:00:00	\N	\N		\N
1447	3646	07 B 0702355	2007-04-16 00:00:00	\N	\N		\N
1448	1969	01 B 0014225	2001-02-12 00:00:00	\N	\N	0116001422534	\N
1449	4398	06 B 0974302  16/00	2006-07-04 00:00:00	\N	\N	000616210256356	\N
1450	2929	01 B 0183836	2007-03-18 00:00:00	\N	\N		\N
1451	1350	35/00 - 0723100 B 00	2021-02-16 00:00:00	\N	\N		\N
1452	3177	98 A 02014247	1998-11-23 00:00:00	\N	\N	194004030196636	\N
1453	\N	08 B 0806171 09/00	2008-04-30 00:00:00	\N	\N		\N
1454	259	98 B 482118	\N	\N	\N		\N
1455	1168	97 B 0322019	1997-10-07 00:00:00	\N	\N		\N
1456	4406	26/00-0342159 B99	2018-08-06 00:00:00	\N	\N	098320010013937	\N
1457	964	98 B 122361	1998-09-19 00:00:00	\N	\N	009730040617040	\N
1458	\N	07 B 0364445	\N	\N	\N		\N
1459	\N	99 B 0502232	1999-10-27 00:00:00	\N	\N		\N
1460	38	99 B 0362518	1999-11-24 00:00:00	\N	\N		\N
1461	1142	98 B 0322152	\N	\N	\N		\N
1462	2683	05 B 0364056 - 23/00	2023-06-19 00:00:00	\N	\N	000523036405666	\N
1463	2130	28/00-0562699 B 04	2010-12-12 00:00:00	\N	\N	000428049000943	\N
1464	432	98 B 0862160	2002-11-12 00:00:00	\N	\N		\N
1465	2668	05 B 0108330	2005-09-28 00:00:00	\N	\N		\N
1466	2066	99 B 0083453	2000-02-14 00:00:00	\N	\N		\N
1467	3766	12 B 0991092	2019-12-04 00:00:00	\N	\N	001216099109235	\N
1468	1564	98 B 0122276	2015-10-06 00:00:00	\N	\N	099830012227698	\N
1469	4735	39/00 - 0543976 B 16	2023-02-28 00:00:00	\N	\N	001639010005168	\N
1470	3780	05 B 0108232- 31/00	2020-07-28 00:00:00	\N	\N		\N
1471	4347	03 B 0723870	2022-05-31 00:00:00	\N	\N		\N
1472	2610	05 B 0404170	2005-12-21 00:00:00	\N	\N		\N
1473	3307	03 B 0542611	2006-06-17 00:00:00	\N	\N		\N
1474	\N	43/00-0322199 B 98	2021-04-25 00:00:00	\N	\N	099443080562520001	\N
1475	2230	99 B 0342174	2003-04-08 00:00:00	\N	\N		\N
1476	2983	98 B 0242061	2003-11-17 00:00:00	\N	\N		\N
1477	251	98 B 0322194	\N	\N	\N		\N
1478	190	07 B 0422887	2007-01-08 00:00:00	\N	\N		\N
1479	2880	99 B 0083440	2007-01-13 00:00:00	\N	\N		\N
1480	1699	00 B 0462519	2006-01-25 00:00:00	\N	\N		\N
1481	4431	0422922 B 07	2018-12-02 00:00:00	\N	\N	00071404229223200000	\N
1482	2018	99 B 842154	1999-09-29 00:00:00	\N	\N		\N
1483	2512	A99 4019357	2001-02-18 00:00:00	\N	\N		\N
1484	4326	08 b 0046988	2011-03-07 00:00:00	\N	\N	000815004698832	\N
1485	\N	31/00 - 0115764 B 15	2022-10-17 00:00:00	\N	\N	001731030008562	\N
1486	322	24/00 – 0382216 B 99	2015-06-03 00:00:00	\N	\N		\N
1487	4323	16 B 0543933	2016-05-02 00:00:00	\N	\N		\N
1488	3734	22/00-0022149 B 98	2020-01-07 00:00:00	\N	\N	99522010368821	\N
1489	2245	04 B 0542650	2019-01-28 00:00:00	\N	\N		\N
1490	2633	99 B 0562127	2012-06-07 00:00:00	\N	\N	099928119094400	\N
1491	1569	00 B 0402459	2000-01-31 00:00:00	\N	\N		\N
1492	2414	00 B 0014362-16/00	2020-06-09 00:00:00	\N	\N	099516120536822	\N
1493	3011	98 B 0182301	2006-02-07 00:00:00	\N	\N	099806018230162	\N
1494	\N	19/00-1162300 B 21	2021-10-06 00:00:00	\N	\N	002119180026357	\N
1495	2413	05 B 0162658 - 48/00	2005-05-11 00:00:00	\N	\N		\N
1496	1272	04/00 - 0406306 B 21	2021-02-03 00:00:00	\N	\N		\N
1497	329	14/00-0423035 B 09	2019-02-23 00:00:00	\N	\N		\N
1498	4374	04B0724149-35/00	2015-02-16 00:00:00	\N	\N	000435072414906	\N
1499	3157	99 B 0302216-00/17	2016-05-08 00:00:00	\N	\N		\N
1500	4290	09 B 0906041 02/00	2013-08-13 00:00:00	\N	\N	000902090604123	\N
1501	4263	16/00-1011889 B 17	2017-04-03 00:00:00	\N	\N	001716101188970	\N
1502	2078	03 B 0223124-05/00	2024-07-03 00:00:00	\N	\N	305022312462	\N
1503	4899	n°10/00-0284573 B19	2020-08-26 00:00:00	\N	\N		\N
1504	4811	05 B 0123733 30/00	2016-03-15 00:00:00	\N	\N		\N
1505	2530	05B 0242591	2005-03-08 00:00:00	\N	\N		\N
1506	\N	98 B 0542138	\N	\N	\N		\N
1507	181	99 B 0362718	1999-09-25 00:00:00	\N	\N		\N
1508	1936	04 B 0162594	2004-05-18 00:00:00	\N	\N		\N
1509	528	02 B 0502419	2002-10-21 00:00:00	\N	\N		\N
1510	3001	07 B 0905740	2007-11-14 00:00:00	\N	\N		\N
1511	2201	99 B 0662230	\N	\N	\N		\N
1512	1821	05 B 0223448	2006-09-03 00:00:00	\N	\N	000505019007357	\N
1513	5042	05 B 0223448	2006-09-03 00:00:00	\N	\N	000505019007357	\N
1514	4739	13/00-0265725 B21	2021-10-21 00:00:00	\N	\N	002113026572747	\N
1515	3965	44/00 - 0764324 B 11	2019-03-26 00:00:00	\N	\N	001144029004256	\N
1516	1541	06 B 0185274	2006-07-09 00:00:00	\N	\N		\N
1517	1606	98 B 0322056	\N	\N	\N		\N
1518	229	98 B 0082728	1998-12-09 00:00:00	\N	\N		\N
1519	2892	06 B 0562889	2006-09-13 00:00:00	\N	\N		\N
1520	343	98 B 0322204	\N	\N	\N		\N
1521	3188	08 B 0283330	2008-12-16 00:00:00	\N	\N		\N
1522	2572	02 B 0723532	2002-03-18 00:00:00	\N	\N		\N
1523	4866	55/00 - 0137137 B 23	2023-05-29 00:00:00	\N	\N		\N
1524	4703	48/00 - 0163110 B 13	2018-12-04 00:00:00	\N	\N		\N
1525	3932	99 B 0482212	2007-06-20 00:00:00	\N	\N	099940109016811	\N
1526	2798	28/00 -  0922271 B 98	2021-08-31 00:00:00	\N	\N	098826519000321	\N
1527	\N		\N	\N	\N	000931011093919	\N
1528	3574	12/00-0583290 B 07	2011-03-02 00:00:00	\N	\N	000712030008175	\N
1529	856	99 B 0242211 07/00	2012-09-13 00:00:00	\N	\N	98407320024342	\N
1530	1820	04 B 0282974	2004-10-27 00:00:00	\N	\N		\N
1531	3989	13 B 0049023 15/00	2015-03-25 00:00:00	\N	\N		\N
1532	1161	99 B 222449	1999-06-08 00:00:00	\N	\N		\N
1533	2203	99 B 0422191	\N	\N	\N		\N
1534	4384	16/00 - 0970946 B 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
1535	4258	16/00 - 0970946 B 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
1536	4256	16/00 - 0970946 B 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
1537	4382	16/00 - 0970946 B 05	2021-02-01 00:00:00	\N	\N	000516230701953	\N
1538	\N	06 B 0562907	2006-12-18 00:00:00	\N	\N		\N
1539	1686	01 B 0222730 - 05/00	2023-08-28 00:00:00	\N	\N		\N
1540	2367	98 B 0042349 00/16	2015-04-26 00:00:00	\N	\N		\N
1541	4269	08/00-0943062 B 13	2016-12-29 00:00:00	\N	\N	001308094306228	\N
1542	430	06 B 0185239	2006-05-29 00:00:00	\N	\N		\N
1543	\N	16/00 - 0989309 b 14	2014-05-25 00:00:00	\N	\N		\N
1544	3240	08 B 0806171	2008-04-30 00:00:00	\N	\N		\N
1545	\N	14 B 0563739 - 00/28	2016-12-26 00:00:00	\N	\N	001428179003443	\N
1546	3513	02/B/0904147	\N	\N	\N		\N
1547	4701	16/00-1043757B17	2021-03-16 00:00:00	\N	\N	001716104375775	\N
1548	4702	16/00-1043757B17	2021-03-16 00:00:00	\N	\N	001716104375775	\N
1549	3645	10 B 0583663	2010-10-17 00:00:00	\N	\N	001012029006655	\N
1550	2440	99 B 0083511	2012-02-28 00:00:00	\N	\N		\N
1551	3952	05/00-0224285 B 11	2016-10-11 00:00:00	\N	\N	001105022428513	\N
1552	3209	98 B 0005474	2005-02-15 00:00:00	\N	\N		\N
1553	2194	02 B 0262959	2002-10-22 00:00:00	\N	\N	00213120920957	\N
1554	2592	05 B 0663060	2014-12-04 00:00:00	\N	\N	000529066306087	\N
1555	1915	03 B 0662774	2013-01-29 00:00:00	\N	\N		\N
1556	333	25/00- 62751B99	2021-05-20 00:00:00	\N	\N	09992506275195	\N
1557	5060	25/00 - 0067303 B 07	2023-08-08 00:00:00	\N	\N	000725010018366	\N
1558	3434	31/00-0111102B09	2009-10-19 00:00:00	\N	\N		\N
1559	3090	99 B 0009731	2013-07-21 00:00:00	\N	\N	099916000973148	\N
1560	3126	35/00 - 0724826 B 06	2019-05-22 00:00:00	\N	\N		\N
1561	4940	35/00-0726976 B 14	2021-12-28 00:00:00	\N	\N	0001435369025631	\N
1562	5101	25/00 - 0065931 B 04	2020-11-09 00:00:00	\N	\N		\N
1563	4964	19/00 - 0088883 B 10	2023-01-22 00:00:00	\N	\N		\N
1564	293	98 B 0182304	2003-08-26 00:00:00	\N	\N	0998018230468	\N
1565	3487	06 B 0242692 00/07	2019-01-16 00:00:00	\N	\N	000607024269295	\N
1566	\N	31/00-0118305 B21	2021-01-06 00:00:00	\N	\N	002131011830542	\N
1567	3233	06 B 0123828	2006-04-09 00:00:00	\N	\N		\N
1568	1792	16/00 - 0014340 B00	2018-11-13 00:00:00	\N	\N		\N
1569	3951	16/00 - 0014340 B00	2018-11-13 00:00:00	\N	\N		\N
1570	316	99 B 0083335	1999-09-12 00:00:00	\N	\N		\N
1571	\N	19/00-0091932B15	2018-03-07 00:00:00	\N	\N	001519010045753	\N
1572	529	01 B 0582599	2001-08-05 00:00:00	\N	\N		\N
1573	1769	99 B 0063098	2005-08-29 00:00:00	\N	\N		\N
1574	3523	10 B 0023 507	2012-03-26 00:00:00	\N	\N	001022002350787	\N
1575	4539	10 B 0023 507	2012-03-26 00:00:00	\N	\N	001022002350787	\N
1576	4986	10 B 0023 507	2012-03-26 00:00:00	\N	\N	001022002350787	\N
1577	3494	10 B 0404824	2010-09-01 00:00:00	\N	\N		\N
1578	2844	05 B 0046078	2005-11-26 00:00:00	\N	\N		\N
1579	94	99 B 222204	1999-02-22 00:00:00	\N	\N		\N
1580	3912	11 B 0622181	2017-10-30 00:00:00	\N	\N	113201500167	\N
1581	3063	98 B 0582037	2000-05-16 00:00:00	\N	\N	099712020501543	\N
1582	362	07 B 0323062	2007-02-18 00:00:00	\N	\N		\N
1583	4413	16/00 - 0985449 B 12	2017-04-13 00:00:00	\N	\N		\N
1584	221	00 B 0022479	2009-05-10 00:00:00	\N	\N	099722010400936	\N
1585	474	01 B 0282635	2001-11-21 00:00:00	\N	\N		\N
1586	3045	08 B 05/00-0223801	2008-04-09 00:00:00	\N	\N		\N
1587	2964	07 B 0109367	2007-08-15 00:00:00	\N	\N		\N
1588	2412	16/00 - 0009320 B99	2021-11-14 00:00:00	\N	\N	098909150012635	\N
1589	\N	98 B 0003421	2000-12-25 00:00:00	\N	\N		\N
1590	2674	98 B 0082481	2006-05-23 00:00:00	\N	\N		\N
1591	1558	98 B 0542110	\N	\N	\N		\N
1592	\N	06 B 0502566	2006-11-06 00:00:00	\N	\N		\N
1593	4744	34/00-0465414 B 16	2016-06-09 00:00:00	\N	\N		\N
1594	4363	05/00-0144319 B16	2018-03-11 00:00:00	\N	\N		\N
1595	3816	12 B 1006084	2012-07-11 00:00:00	\N	\N	001216100608472	\N
1596	4340	16/00 0964595 B 04	2020-12-14 00:00:00	\N	\N		\N
1597	4922	19/00-0094259 B 20	2023-06-15 00:00:00	\N	\N	002019009425991	\N
1598	3929	35/00 - 00722789 B 99	2016-11-02 00:00:00	\N	\N		\N
1599	3782	06 B 0046311	2011-09-21 00:00:00	\N	\N	0615229008544	\N
1600	3035	06 B 0046311	2011-09-21 00:00:00	\N	\N	0615229008544	\N
1601	454	98 B 9020040	1998-03-18 00:00:00	\N	\N		\N
1602	2633	28/00 - 0562127 B 99	2020-08-13 00:00:00	\N	\N	099928119094400	\N
1603	1282	98 B 0322130	\N	\N	\N		\N
1604	2128		\N	\N	\N	25074074011	\N
1605	4961	n°02/01-0906574 B 13	2018-01-07 00:00:00	\N	\N	001302090007272	\N
1606	1698	03 B 0763675 - 44/00	2008-07-16 00:00:00	\N	\N		\N
1607	\N	06 B 0742430	2010-09-21 00:00:00	\N	\N	000620019002460	\N
1608	\N	04 B 0968164	2004-11-03 00:00:00	\N	\N		\N
1609	3722	08 B 0663246629/00	2013-04-30 00:00:00	\N	\N		\N
1610	191	0422854 B 06	2006-07-31 00:00:00	\N	\N		\N
1611	3523	10 B 0023 507	2019-02-14 00:00:00	\N	\N	001022002350787	\N
1612	4539	10 B 0023 507	2019-02-14 00:00:00	\N	\N	001022002350787	\N
1613	4986	10 B 0023 507	2019-02-14 00:00:00	\N	\N	001022002350787	\N
1614	4679	07 B 0046819	2010-04-28 00:00:00	\N	\N	000815599009136	\N
1615	3683	07 B 0046819	2010-04-28 00:00:00	\N	\N	000815599009136	\N
1616	2559	05 B 0972314	2005-12-24 00:00:00	\N	\N		\N
1617	3080	17/00-0302748B05	2019-03-17 00:00:00	\N	\N		\N
1618	4733	43/00-0323895 B 14	2020-02-23 00:00:00	\N	\N	001443030005662	\N
1619	4765	43/00-0323895 B 14	2020-02-23 00:00:00	\N	\N	001443030005662	\N
1620	455	04 B 0322806	2009-09-23 00:00:00	\N	\N		\N
1621	\N	03 B 0022856	2003-06-03 00:00:00	\N	\N		\N
1622	1186	98 B 222132	1998-07-12 00:00:00	\N	\N		\N
1623	3821	05 B 0583061 - 12/00	2022-10-03 00:00:00	\N	\N	000512058306162	\N
1624	1165	99 B 0882205	2000-02-12 00:00:00	\N	\N		\N
1625	1016	16/00-0010456 B 99	2012-06-21 00:00:00	\N	\N		\N
1626	2281	98 B 0562063	2018-12-31 00:00:00	\N	\N	898828270504816	\N
1627	4110	98 B 0562063	2018-12-31 00:00:00	\N	\N	898828270504816	\N
1628	2615	16/00 - 0542863 B 06	2022-05-17 00:00:00	\N	\N		\N
1629	3320	98 B 0382055	1998-06-22 00:00:00	\N	\N		\N
1630	202	98 B 0382055	1998-06-22 00:00:00	\N	\N		\N
1631	436	99 B 43043	2009-08-26 00:00:00	\N	\N		\N
1632	4939	16/00-01204052 B 24	2024-02-12 00:00:00	\N	\N	002416120052557	\N
1633	2097	04 B 0542684	\N	\N	\N		\N
1634	78	99 B 7100	1999-03-24 00:00:00	\N	\N		\N
1635	2970	05 B 0970806	2005-06-28 00:00:00	\N	\N		\N
1636	2983	98 B 0242061 - 00/07	2012-05-20 00:00:00	\N	\N		\N
1637	3125	08 B 0110252	2008-09-17 00:00:00	\N	\N		\N
1638	\N	98 A 0518984	\N	\N	\N		\N
1639	4541	07/00 - 0242894 B 09	2020-02-27 00:00:00	\N	\N		\N
1640	2370	05 B 1515278	2005-04-06 00:00:00	\N	\N		\N
1641	4979	20 B 0324546 - 00/43	2023-10-16 00:00:00	\N	\N		\N
1642	4902	28/00-0563167	2017-12-10 00:00:00	\N	\N	001028209004745	\N
1643	1915	03 B 0662774	2009-02-11 00:00:00	\N	\N		\N
1644	3179	02 A 0092640	2002-07-16 00:00:00	\N	\N		\N
1645	4268	09 B 0162909 48/00	2009-08-25 00:00:00	\N	\N	000948016290928	\N
1646	2779	06 B 0882527	2006-10-22 00:00:00	\N	\N		\N
1647	5073	18/00 - 0443898 B 20	2021-06-23 00:00:00	\N	\N		\N
1648	4777	39/03 - 0542262 B 99	2021-03-14 00:00:00	\N	\N		\N
1649	4384	05 B 0970946 - 00/16	2018-02-06 00:00:00	\N	\N		\N
1650	4258	05 B 0970946 - 00/16	2018-02-06 00:00:00	\N	\N		\N
1651	4256	05 B 0970946 - 00/16	2018-02-06 00:00:00	\N	\N		\N
1652	4382	05 B 0970946 - 00/16	2018-02-06 00:00:00	\N	\N		\N
1653	1110	98 B 0102636	2007-02-11 00:00:00	\N	\N		\N
1654	3991	99 B  0722486   35/00	2014-08-28 00:00:00	\N	\N	099935072248634	\N
1655	3048	05 B 0970380	2006-06-06 00:00:00	\N	\N		\N
1656	3346	09 B 0302910	\N	\N	\N		\N
1657	5083	13/00-0264119B11	2011-01-16 00:00:00	\N	\N	001113239001555	\N
1658	223	98 B 262070	1998-04-22 00:00:00	\N	\N		\N
1659	1821	05 B 0223448	2008-12-02 00:00:00	\N	\N	000505019007357	\N
1660	5042	05 B 0223448	2008-12-02 00:00:00	\N	\N	000505019007357	\N
1661	2666	05 B 0404159	2005-11-28 00:00:00	\N	\N		\N
1662	5091	16/00 - 1017383 B 21	2021-10-28 00:00:00	\N	\N		\N
1663	2939	07 B 0923245	2007-11-12 00:00:00	\N	\N		\N
1664	1675	98 B 0882099	2000-06-12 00:00:00	\N	\N	097701110015450	\N
1665	186	08 B 0047276	2008-12-01 00:00:00	\N	\N		\N
1666	4163	08 B 0302847	2008-02-02 00:00:00	\N	\N		\N
1667	3991	99 B  0722486   35/00	2014-08-28 00:00:00	\N	\N	099935220357516	\N
1668	1401	98 B 0022103	2001-08-19 00:00:00	\N	\N	099822469091105	\N
1669	4112	30/00-0125127 B 15	2015-02-17 00:00:00	\N	\N		\N
1670	4325	28/00 0563974 B 15	2019-11-17 00:00:00	\N	\N	001528056397418	\N
1671	3533	16/00 – 0343125 B 10	2020-12-24 00:00:00	\N	\N	001026460001758	\N
1672	4685	05/00-0224405 B11	2021-12-29 00:00:00	\N	\N		\N
1673	859	00 B 0322400	\N	\N	\N		\N
1674	2712	19/00 - 0084585 B 02	2019-09-16 00:00:00	\N	\N	0219200275453	\N
1675	1021	98 B 0122138	1999-12-12 00:00:00	\N	\N		\N
1676	2703	99 B 0562135	1999-03-14 00:00:00	\N	\N	990562135	\N
1677	1933	98 B 0662048	1998-06-21 00:00:00	\N	\N		\N
1678	3802	98 B 0662048	1998-06-21 00:00:00	\N	\N		\N
1679	4207	05/00-0222471 B 99	2014-03-31 00:00:00	\N	\N	099905421135426	\N
1680	3513	02/B/0904147	2002-06-16 00:00:00	\N	\N	000202090417475	\N
1681	4024	09 B 0942971 - 08/00	2014-12-15 00:00:00	\N	\N		\N
1682	2078	03 B 0223124-05/00	2024-07-03 00:00:00	\N	\N	000305450565644	\N
1683	4266	24/00-0382656 B 07	2017-03-22 00:00:00	\N	\N	000724019001652	\N
1684	3158	08 B 0742476	2008-10-29 00:00:00	\N	\N	000820074247695	\N
1685	367	09 B 0382773	2022-03-08 00:00:00	\N	\N	00924239004249	\N
1686	2716	02 B 0882337	2013-12-19 00:00:00	\N	\N	000201010546860	\N
1687	\N	00 B 0762936	2000-01-26 00:00:00	\N	\N		\N
1688	3113	07 B 0223690	2007-05-16 00:00:00	\N	\N		\N
1689	3314	01 B 0222756	2001-05-06 00:00:00	\N	\N		\N
1690	2200	01 B 0222756	2001-05-06 00:00:00	\N	\N		\N
1691	\N	07 B 0583290	2010-01-10 00:00:00	\N	\N	000712030008175	\N
1692	2967	97 B 0102047	1997-10-01 00:00:00	\N	\N	0997310110204732	\N
1693	3691	10 B 0986608	2010-12-05 00:00:00	\N	\N		\N
1694	3415	00 B 0723153	\N	\N	\N		\N
1809	2672	03 B 0502458	2006-07-18 00:00:00	\N	\N		\N
1695	3396	19/00-0086912 B 07	2020-10-08 00:00:00	\N	\N	000719010009169	\N
1696	4841	16/00-0464642B13	2024-03-26 00:00:00	\N	\N	001334010010571	\N
1697	1269	00 B 0682323	2000-06-27 00:00:00	\N	\N		\N
1698	4139	06 B 0583200	2006-01-28 00:00:00	\N	\N		\N
1699	144	0902173 B 98	2008-08-04 00:00:00	\N	\N	099702020480433	\N
1700	2869	07 B 0583226	2007-02-28 00:00:00	\N	\N		\N
1701	4254	08 B 0563070 00/28	2017-02-01 00:00:00	\N	\N	000828019010450	\N
1702	1982	00 B 0012469	2000-07-17 00:00:00	\N	\N		\N
1703	\N	35/00-0726586B13	2022-03-07 00:00:00	\N	\N		\N
1704	2695	0123906 B 06	2006-09-17 00:00:00	\N	\N		\N
1705	3171	99 B 0542256	1999-10-31 00:00:00	\N	\N		\N
1706	3043	83 B 0722578	1999-04-04 00:00:00	\N	\N	0999350722578442	\N
1707	1313	99 B 63190	\N	\N	\N		\N
1708	\N	04 B 005822	2006-10-30 00:00:00	\N	\N		\N
1709	\N	30/00-0124833 B 13	2019-07-02 00:00:00	\N	\N		\N
1710	1888	98 B 0522212	2003-03-10 00:00:00	\N	\N		\N
1711	4935	31/00 - 0116785 B 16	2016-12-08 00:00:00	\N	\N	0016311011678577	\N
1712	4816	32/00 - 0622242 B 14	2020-11-05 00:00:00	\N	\N		\N
1713	\N	98 B 0822021	2014-10-01 00:00:00	\N	\N	099845020533917	\N
1714	2793	09/00 - 0806010 B 08	2019-03-12 00:00:00	\N	\N	000809010001472	\N
1715	1171	02 B 0582757	2012-08-29 00:00:00	\N	\N	000212010489357	\N
1716	90	99 B 0162208	1999-08-31 00:00:00	\N	\N		\N
1717	4682	N°06/00-0182808 B 99	2017-05-29 00:00:00	\N	\N	099906260052133	\N
1718	1555	99 B 0342138	2004-01-07 00:00:00	\N	\N		\N
1719	4955	n°07/00-0243021B11	2019-10-17 00:00:00	\N	\N		\N
1720	602	98 B 262048	1998-03-04 00:00:00	\N	\N		\N
1721	2675	99 B 42999	1999-03-25 00:00:00	\N	\N		\N
1722	339	99 B 462251 34/00	2021-12-26 00:00:00	\N	\N		\N
1723	309	99 B 0582292	\N	\N	\N		\N
1724	4027	12 B 0048716	2016-10-26 00:00:00	\N	\N	001215340020270	\N
1725	4040	05 B 0123744	2018-12-12 00:00:00	\N	\N		\N
1726	472	00 B 22417	2000-03-08 00:00:00	\N	\N		\N
1727	2105	99 B 0009594	1999-10-02 00:00:00	\N	\N	098335160040240	\N
1728	2533	99 B 0722725	2014-01-09 00:00:00	\N	\N		\N
1729	120	02 B 0763570	2002-05-21 00:00:00	\N	\N		\N
1730	2760	05 B 0364079	2005-06-12 00:00:00	\N	\N		\N
1731	216	92 B 002	1992-02-13 00:00:00	\N	\N		\N
1732	2324	02 B 0763527	2002-04-03 00:00:00	\N	\N		\N
1733	\N	98 B 0582141	2008-06-07 00:00:00	\N	\N		\N
1734	2152	00 B 0083574	2001-03-28 00:00:00	\N	\N		\N
1735	\N	14/00-0423172 B11	2018-02-28 00:00:00	\N	\N	001114259002551	\N
1736	2311	99 B 0402394	2000-03-12 00:00:00	\N	\N		\N
1737	3440	28/00-0563130 B 09	2012-03-13 00:00:00	\N	\N		\N
1738	4699	16-00/0725766 B10	2016-11-17 00:00:00	\N	\N		\N
1739	4787	16-00/0725766 B10	2016-11-17 00:00:00	\N	\N		\N
1740	3175	00 B 0782267	2008-04-27 00:00:00	\N	\N		\N
1741	2414	00 B 0014362-16/00	2023-07-25 00:00:00	\N	\N	099516120536822	\N
1742	\N	22/00-0022661B02	2019-03-25 00:00:00	\N	\N		\N
1743	3005	99 B 0722746	2007-08-01 00:00:00	\N	\N		\N
1744	3066	99 B 0362428	1999-01-31 00:00:00	\N	\N		\N
1745	2087	06 B 0422865	2006-09-13 00:00:00	\N	\N		\N
1746	3125	08 B 0110252 -13/00	2008-09-17 00:00:00	\N	\N		\N
1747	3043	35/00-0722578 B 99	2010-08-26 00:00:00	\N	\N	99935072257842	\N
1748	4396	32/00 - 0622325 B 19	2019-04-10 00:00:00	\N	\N	001932010000471	\N
1749	2602	05 B 0442688	2015-10-19 00:00:00	\N	\N		\N
1750	136	45/00-0822375 B13	2013-12-19 00:00:00	\N	\N	793145030015340	\N
1751	1358	13/00-0263126B04	2019-07-30 00:00:00	\N	\N	000213260139456	\N
1752	4942	N°39/00-0543554 B13	2019-05-23 00:00:00	\N	\N		\N
1753	\N	99 B 0322386	\N	\N	\N		\N
1754	1163	00 B 0322392 43/00	2011-03-29 00:00:00	\N	\N		\N
1755	2281	98 B 0562063  - 00/28	2022-10-17 00:00:00	\N	\N	099828270504816	\N
1756	4110	98 B 0562063  - 00/28	2022-10-17 00:00:00	\N	\N	099828270504816	\N
1757	1990	99 B 0083553	1999-12-28 00:00:00	\N	\N		\N
1758	5082	12/00 - 0585240 B 24	2024-11-25 00:00:00	\N	\N		\N
1759	3172	08 B 0023363	2008-10-11 00:00:00	\N	\N		\N
1760	4035	14 B 0365918	2016-05-09 00:00:00	\N	\N	001423020008370	\N
1761	3495	08/B/0782947	2008-10-12 00:00:00	\N	\N	000827069005443	\N
1762	3898	99 B 0082883	2015-05-15 00:00:00	\N	\N	099919008288302	\N
1763	2001	99 B 0083233	1999-07-01 00:00:00	\N	\N		\N
1764	241	98 B 0662087	\N	\N	\N		\N
1765	2080	99 B 0282220	2006-01-21 00:00:00	\N	\N		\N
1766	3316	99 B 0282220	2006-01-21 00:00:00	\N	\N		\N
1767	508	01 B 482538	\N	\N	\N		\N
1768	4212	22/00 00229847 B 04	2013-02-22 00:00:00	\N	\N		\N
1769	1831	04 B 0964049	2004-03-24 00:00:00	\N	\N		\N
1770	5023	00/39 0544290 B18	2018-10-01 00:00:00	\N	\N		\N
1771	\N	98 B 22056	1998-04-12 00:00:00	\N	\N		\N
1772	1722	99 B 0482244	2000-06-20 00:00:00	\N	\N		\N
1773	1285	98 B 042404	1998-09-14 00:00:00	\N	\N		\N
1774	4847	39/02-0544741 B21	2021-09-07 00:00:00	\N	\N	002139180011556	\N
1775	\N	08 B 0423002-14/00	2008-09-09 00:00:00	\N	\N		\N
1776	2919	03 B 0282867	2006-08-20 00:00:00	\N	\N		\N
1777	220	99 B 0402276	1999-05-17 00:00:00	\N	\N		\N
1778	3740	25/00-0067637 B 08	2015-05-24 00:00:00	\N	\N	000825006763783	\N
1779	2955	16/00-0975135 B 07	2018-03-14 00:00:00	\N	\N		\N
1780	150	97 B 0082044	1997-09-15 00:00:00	\N	\N		\N
1781	2486	00 A 21226434	\N	\N	\N		\N
1782	3916	01/00 0882751 B 13	2013-02-27 00:00:00	\N	\N	0013001019001367	\N
1783	4145	07/00 - 0242128 B 99	2018-11-05 00:00:00	\N	\N		\N
1784	1433	07/00 - 0242128 B 99	2018-11-05 00:00:00	\N	\N		\N
1785	4529	07/00 - 0242128 B 99	2018-11-05 00:00:00	\N	\N		\N
1786	4928	06/00 - 0187571 B 12	2021-09-15 00:00:00	\N	\N		\N
1787	1986	98 B 0342025	\N	\N	\N		\N
1788	1476	98 B 0122112     30/00	2012-09-12 00:00:00	\N	\N	099830012211258	\N
1789	1806	01 B 0064192	\N	\N	\N		\N
1790	\N	99 B 22230	1999-03-25 00:00:00	\N	\N		\N
1791	1699	00 B 0462519 00/34	2019-12-29 00:00:00	\N	\N	000034046251933	\N
1792	2781	06 B 0067018	2006-09-25 00:00:00	\N	\N		\N
1793	\N	00 B 0903674	2000-08-20 00:00:00	\N	\N		\N
1794	3976	14/00 0423533 B 15	2015-11-29 00:00:00	\N	\N		\N
1795	2271	03 B 0021635	2003-06-16 00:00:00	\N	\N	316130371163	\N
1796	2891	07 B 0087035	\N	\N	\N		\N
1797	4925	25/00-0070329 B 14	2021-03-16 00:00:00	\N	\N		\N
1798	\N	0642145B10	2018-02-08 00:00:00	\N	\N		\N
1799	\N	05 B 0805385	2006-01-29 00:00:00	\N	\N		\N
1800	4272	48/00-0162583 B 04	2013-10-19 00:00:00	\N	\N	000448079001739	\N
1801	2386	05 B 0242578	2005-01-17 00:00:00	\N	\N		\N
1802	4895	16/00-1045499B18	2023-05-03 00:00:00	\N	\N		\N
1803	5076	19/00-0094367 B21	2021-03-07 00:00:00	\N	\N		\N
1804	999	00 B 0723061	2007-11-07 00:00:00	\N	\N	099216130232439	\N
1805	854	03 B 0582919	2003-12-22 00:00:00	\N	\N		\N
1806	3453	03 B 0582919	2003-12-22 00:00:00	\N	\N		\N
1807	133	00 B 0104926	2000-12-03 00:00:00	\N	\N		\N
1808	2395	06 B 0263400	2006-01-24 00:00:00	\N	\N		\N
1810	4203	31/00 0116357 B 16	2016-04-28 00:00:00	\N	\N		\N
1811	1257	02 B 022294	2002-07-07 00:00:00	\N	\N	0205429016644	\N
1812	\N	99B 0010204	2003-02-02 00:00:00	\N	\N		\N
1813	\N	98 B 3364	1998-03-18 00:00:00	\N	\N		\N
1814	999	00 B 0723061	2007-11-07 00:00:00	\N	\N	00035072306136	\N
1815	87	02 B 0084454	2002-11-17 00:00:00	\N	\N		\N
1816	3912	11 B 0622181	2011-03-23 00:00:00	\N	\N	001132062218198	\N
1817	2523	16/00-1002542 B 09	2015-05-06 00:00:00	\N	\N		\N
1818	3523	0023507 B 10	2019-02-14 00:00:00	\N	\N	001022002350787	\N
1819	4539	0023507 B 10	2019-02-14 00:00:00	\N	\N	001022002350787	\N
1820	4986	0023507 B 10	2019-02-14 00:00:00	\N	\N	001022002350787	\N
1821	4265	06 B 0123825 - 00/30	2006-03-28 00:00:00	\N	\N	000630012382518	\N
1822	3801	08 B 0124120	2009-01-25 00:00:00	\N	\N		\N
1823	4043	04/00-0405255 B 13	2015-06-02 00:00:00	\N	\N	00130404052559100000	\N
1824	2160	00B 0013569	2000-11-28 00:00:00	\N	\N		\N
1825	\N	16/00-1045370	2019-05-14 00:00:00	\N	\N	001816104537004	\N
1826	2522	19/00 - 0082892 B 99	2019-04-08 00:00:00	\N	\N		\N
1827	1881	99 B 0862359 - 47/00	2021-07-26 00:00:00	\N	\N	96794710005835	\N
1828	\N	87 B 011	1997-02-11 00:00:00	\N	\N		\N
1829	\N	00 B 0903675	2016-04-24 00:00:00	\N	\N	02090367534	\N
1830	3545	10 B 0906249	2010-05-23 00:00:00	\N	\N		\N
1831	3010	08 B 0185789	2008-02-27 00:00:00	\N	\N	19580627001738	\N
1832	1481	03 B 0963234	2005-05-03 00:00:00	\N	\N		\N
1833	4305	03 B 0963234	2005-05-03 00:00:00	\N	\N		\N
1834	\N	30/00 0124386 B 10	2016-01-31 00:00:00	\N	\N	001030012438682	\N
1835	\N		\N	\N	\N	099312020114056	\N
1836	4419	17-0302978B11	2018-03-22 00:00:00	\N	\N		\N
1837	227	98 B 0322131	\N	\N	\N		\N
1838	4796	06/00 - 0187240 B 11	2021-11-22 00:00:00	\N	\N		\N
1839	325	16/00-0009856 B 99	2011-04-03 00:00:00	\N	\N		\N
1840	4151	16/00-0009856 B 99	2011-04-03 00:00:00	\N	\N		\N
1841	1991	98 B 0142070	\N	\N	\N		\N
1842	4862	n°16/00-1007097 B13	2016-11-13 00:00:00	\N	\N		\N
1843	2078	03 B 0223124	2007-01-13 00:00:00	\N	\N	305022312462	\N
1844	1797	98 B 0322116	2007-01-17 00:00:00	\N	\N		\N
1845	1138	01 B 0282547	2013-11-27 00:00:00	\N	\N	000110360017369	\N
1846	4929	n°06/00-0184380B03	2021-06-30 00:00:00	\N	\N	000306250770256	\N
1847	4930	n°06/00-0184380B03	2021-06-30 00:00:00	\N	\N	000306250770256	\N
1848	5071	16/00-0974859 B07	2022-01-09 00:00:00	\N	\N		\N
1849	3240	08 B 0806171 - 09/00	2017-11-09 00:00:00	\N	\N	000809080617154	\N
1850	1303	33/00-0222459 B99	2019-07-07 00:00:00	\N	\N		\N
1851	4537	33/00-0222459 B99	2019-07-07 00:00:00	\N	\N		\N
1852	3867	16/00 0016868 B 01	2013-08-20 00:00:00	\N	\N		\N
1853	4242	16 B 1042847	2021-01-13 00:00:00	\N	\N	001616104284729	\N
1854	4916	19/00-0093873 B 19	2023-11-28 00:00:00	\N	\N	001919010032068	\N
1855	2414	00 B 0014362	2014-07-31 00:00:00	\N	\N	00016001436218	\N
1856	4215	19/00-0083316 B 99	2012-01-18 00:00:00	\N	\N	099919310991115	\N
1857	3028	46/00-0842308 B 04	2019-02-12 00:00:00	\N	\N		\N
1858	2146	46/00-0842308 B 04	2019-02-12 00:00:00	\N	\N		\N
1859	\N	31/00-1123597B20	2020-12-17 00:00:00	\N	\N	002031112359745	\N
1860	3482	09 B 02428 97	\N	\N	\N		\N
1861	\N	30/00   0125753 B 18	2018-07-15 00:00:00	\N	\N		\N
1862	4822	19/00 - 0090356 B 13	2022-11-28 00:00:00	\N	\N		\N
1863	4823	19/00 - 0090356 B 13	2022-11-28 00:00:00	\N	\N		\N
1864	4824	19/00 - 0090356 B 13	2022-11-28 00:00:00	\N	\N		\N
1865	\N	07 B 0562939	2007-07-15 00:00:00	\N	\N		\N
1866	4861	35/00 - 0729781 B 22	2022-10-20 00:00:00	\N	\N		\N
1867	871	02 B 0462856	2014-07-08 00:00:00	\N	\N	000234046285636	\N
1868	214	99 B 5224555	1999-11-14 00:00:00	\N	\N		\N
1869	1266	99 B 222345	1999-02-08 00:00:00	\N	\N		\N
1870	434	01 B 0105340	2005-04-26 00:00:00	\N	\N		\N
1871	3240	08 B 0806171 - 09/00	2014-02-20 00:00:00	\N	\N	000809080617154	\N
1872	1877	07 B 0463554	2007-03-20 00:00:00	\N	\N		\N
1873	3789	03 B 0963492	\N	\N	\N		\N
1874	4781	13/00 - 0265805 B 22	2022-08-04 00:00:00	\N	\N	002213350007266	\N
1875	4312	10 B 0423137	2010-11-11 00:00:00	\N	\N		\N
1876	4610	56/00-0612018 B 21	\N	\N	\N		\N
1877	1394	04 B 0422716	2017-07-06 00:00:00	\N	\N	000414042271617	\N
1878	2778	98 B 0082658	2004-04-20 00:00:00	\N	\N		\N
1879	\N	06 B 0502556	2006-08-09 00:00:00	\N	\N		\N
1880	4526	16/00-0986657 B13	2021-06-17 00:00:00	\N	\N	001316130014369	\N
1881	4528	16/00-0986657 B13	2021-06-17 00:00:00	\N	\N	001316130014369	\N
1882	\N	02 B 0222915	2007-12-01 00:00:00	\N	\N		\N
1883	3160	05 B 0066619	2005-09-05 00:00:00	\N	\N	000525010581356	\N
1884	3535	07 B 0463613	2010-09-28 00:00:00	\N	\N	000734019008545	\N
1885	4212	22/00 0022947 B 04	2013-02-20 00:00:00	\N	\N		\N
1886	4264	0663792 B 16	2016-02-02 00:00:00	\N	\N		\N
1887	\N	98 B 5222229	1998-12-15 00:00:00	\N	\N		\N
1888	2369	02 B 0282704	2008-05-19 00:00:00	\N	\N	000210010784949	\N
1889	\N	30/00 - 0543166 b 09	2020-07-20 00:00:00	\N	\N		\N
1890	871	02 B 462856	2002-05-20 00:00:00	\N	\N		\N
1891	3787	98 B 0902173	2008-08-04 00:00:00	\N	\N	99702029060323	\N
1892	\N	19/00 - 1162258 B 21	2021-01-28 00:00:00	\N	\N		\N
1893	11	0404255 B 06	2006-11-15 00:00:00	\N	\N		\N
1894	3414	09 B 0725316	\N	\N	\N		\N
1895	3219	08 B 0502603	2008-03-19 00:00:00	\N	\N	000841019000847	\N
1896	4265	06 B 0123825 - 00/30	2009-10-28 00:00:00	\N	\N	000630012382518	\N
1897	5063	45/00-0822513B22	2022-03-07 00:00:00	\N	\N		\N
1898	1010	99 B 722574	\N	\N	\N		\N
1899	3859	37/00 - 0642172 B 12	2021-05-10 00:00:00	\N	\N		\N
1900	2785	08/00 - 0942527 B 01	2019-04-09 00:00:00	\N	\N		\N
1901	955	99 B 632449	\N	\N	\N	099819008236319	\N
1902	\N	10/00-0986632 B 10	2018-02-13 00:00:00	\N	\N		\N
1903	3470	04/00 0404738 B 10	2013-07-04 00:00:00	\N	\N	001004250001083	\N
1904	85	00 B 0222700	2000-09-30 00:00:00	\N	\N		\N
1905	1704	98 B 0803033	\N	\N	\N		\N
1906	\N	99 B 62659	\N	\N	\N		\N
1907	3426	09 B 0047333	2009-01-24 00:00:00	\N	\N	947049008731	\N
1908	4209	30/00 0124386 B 10	2016-01-31 00:00:00	\N	\N	001030012438682	\N
1909	2667	05 B 0663014  29/00	2013-12-11 00:00:00	\N	\N	000529066301475	\N
1910	4828	05/00-0225455 B16	2021-01-06 00:00:00	\N	\N		\N
1911	5093	19/00 - 0095905 B24	2024-07-25 00:00:00	\N	\N	002419300063941	\N
1912	3222	06 B 0123936	2006-12-19 00:00:00	\N	\N		\N
1913	2800	99 B 063083	1999-07-26 00:00:00	\N	\N		\N
1914	143	98 B 0802 158	1998-04-16 00:00:00	\N	\N		\N
1915	325	98 B 0009856	2006-03-28 00:00:00	\N	\N		\N
1916	4151	98 B 0009856	2006-03-28 00:00:00	\N	\N		\N
1917	3406	09 B 0381973	2009-08-01 00:00:00	\N	\N		\N
1918	3344	08 B 0977901	2008-07-13 00:00:00	\N	\N	0816097790139	\N
1919	4282	14 B 0995112  16/00	2016-02-01 00:00:00	\N	\N	001416099511244	\N
1920	\N	42/00-0523589B08	2019-04-03 00:00:00	\N	\N	000842279002442	\N
1921	272	99 B 63281	1999-03-09 00:00:00	\N	\N		\N
1922	4943	31/00 - 0119254 B 23	2023-03-15 00:00:00	\N	\N		\N
1923	3540	00 B 0122824 - 30/00	2015-09-22 00:00:00	\N	\N		\N
1924	4954	21/00 - 0143240 B 06	2023-04-27 00:00:00	\N	\N		\N
1925	1138	01 B 0282547 - 10/00	2015-09-14 00:00:00	\N	\N	000110360017369	\N
1926	16	25/00-0070877 B 15	2015-04-01 00:00:00	\N	\N		\N
1927	2242	16/00 - 0007759 B 99	2023-06-06 00:00:00	\N	\N	099916000775940	\N
1928	132	03 B 0065264	2003-04-15 00:00:00	\N	\N		\N
1929	1643	00 B 0322405	\N	\N	\N		\N
1930	4019	07 B 0046607	2011-01-19 00:00:00	\N	\N		\N
1931	4884	n°15/00-0050086 B 16	2019-12-24 00:00:00	\N	\N	001615010008161	\N
1932	1812	0502266 B 00 du	2000-02-07 00:00:00	\N	\N		\N
1933	3225	08 B 0980174	2008-05-12 00:00:00	\N	\N		\N
1934	960	98 B 0782044 27/00	2008-03-26 00:00:00	\N	\N	195027300006937	\N
1935	4871	n°31/00-0109341 B07	2018-12-27 00:00:00	\N	\N	000731040033268	\N
1936	1757	06 B 0463498	2006-10-08 00:00:00	\N	\N		\N
1937	4775	16/00-1006528 B 12	2017-11-16 00:00:00	\N	\N		\N
1938	5087	39/00 - 0543330 B 11	2024-12-30 00:00:00	\N	\N	001139010001765002	\N
1939	892	98 B 222279	1998-12-15 00:00:00	\N	\N		\N
1940	2946	29/00-0662474 B 01	2014-08-28 00:00:00	\N	\N	000129010458552	\N
1941	2977	08 B 0422956	2008-01-14 00:00:00	\N	\N		\N
1942	2639	01 B 0562437	2007-02-18 00:00:00	\N	\N		\N
1943	\N	02 B 0502422	2002-11-05 00:00:00	\N	\N		\N
1944	\N	16/00-1282869 B24	2024-12-03 00:00:00	\N	\N		\N
1945	445	98 B 0102347	\N	\N	\N		\N
1946	4116	41/02 - 0502819 B 13	2023-06-19 00:00:00	\N	\N		\N
1947	4805	35/00-0726586 B13	2022-03-07 00:00:00	\N	\N		\N
1948	\N	04 B 0966314	2007-11-18 00:00:00	\N	\N	0004166096631415	\N
1949	40	04 B 0085624	2004-04-26 00:00:00	\N	\N		\N
1950	1359	99 B 0103310	1999-04-24 00:00:00	\N	\N		\N
1951	2507	00B 0582539	2000-11-11 00:00:00	\N	\N		\N
1952	4845	39/00 - 0544917 B 22	2022-11-02 00:00:00	\N	\N		\N
1953	2691	100183654	2004-09-27 00:00:00	\N	\N		\N
1954	567	98 B 582183	2022-03-01 00:00:00	\N	\N		\N
1955	2785	01 B 0942527 - 08/00	2012-01-10 00:00:00	\N	\N		\N
1956	3949	16/00 0995212 B 14	2014-04-24 00:00:00	\N	\N		\N
1957	1604	99 B 8162	2008-06-14 00:00:00	\N	\N		\N
1958	3534	 02A2720468	\N	\N	\N		\N
1959	4927	28/00 - 0564408 B17	2020-12-13 00:00:00	\N	\N		\N
1960	\N	04 B 0282992	\N	\N	\N		\N
1961	5043	02/00-0907053-B-18	2018-04-18 00:00:00	\N	\N	001802290005951	\N
1962	221	00 B 0022479	2000-08-06 00:00:00	\N	\N		\N
1963	2806	0923162 B 06	2017-01-08 00:00:00	\N	\N	000603092316213	\N
1964	4274	34/00-0463498 B 06	2016-08-23 00:00:00	\N	\N		\N
1965	5057	37/00 - 0642277 B 20	2021-09-01 00:00:00	\N	\N	002037010000277	\N
1966	2013	99 B 462363	\N	\N	\N		\N
1967	4827	13/00 - 0265789 B 22	2022-05-30 00:00:00	\N	\N		\N
1968	1699	00 B 0462519 00/34	2024-05-15 00:00:00	\N	\N	000034046251933	\N
1969	\N	01 B 0903979	2001-10-29 00:00:00	\N	\N		\N
1970	3813	07 B 0905554	2011-11-29 00:00:00	\N	\N	000702090555488	\N
1971	115	00 B 64024	\N	\N	\N		\N
1972	948	99 B 0762480	2000-09-03 00:00:00	\N	\N		\N
1973	4734	31/00-112427 B22	2022-05-23 00:00:00	\N	\N	002231112426793	\N
1974	4175	16/00 1010423 B 16	2016-01-19 00:00:00	\N	\N	001616101042351	\N
1975	\N	08/00-0943062 B 13	2016-12-29 00:00:00	\N	\N	001308094306228	\N
1976	2405	98 B 0142069	2001-07-30 00:00:00	\N	\N		\N
1977	1700	03 B 0020395	2004-03-21 00:00:00	\N	\N		\N
1978	3881	11B 0405017	2019-03-18 00:00:00	\N	\N	001104210015668	\N
1979	\N	47/00 - 0863624 B 17	2017-11-27 00:00:00	\N	\N		\N
1980	3853	04 B  0967366	2004-08-04 00:00:00	\N	\N		\N
1981	1404	 00 B 0262523	2003-05-07 00:00:00	\N	\N	099113010279530	\N
1982	3536	08 B 0978954	2009-11-18 00:00:00	\N	\N	00081609789548	\N
1983	2251	04 B 0463177	2022-02-03 00:00:00	\N	\N		\N
1984	5054	30/00-0126203 B 20	2024-03-06 00:00:00	\N	\N	002030010017765	\N
1985	3470	04/00-0404738 B10	2022-12-05 00:00:00	\N	\N	001004259008156	\N
1986	2078	03 B 0223124-05/00	2029-10-01 00:00:00	\N	\N	305022312462	\N
1987	4976	12/00 - 0585168 B 24	2024-02-21 00:00:00	\N	\N		\N
1988	3782	06 B 0046311	2019-04-10 00:00:00	\N	\N	0615229008544	\N
1989	3035	06 B 0046311	2019-04-10 00:00:00	\N	\N	0615229008544	\N
1990	2603	00 B 0162367	2000-11-08 00:00:00	\N	\N		\N
1991	155	07 B 0764090	2007-05-23 00:00:00	\N	\N		\N
1992	203	99 B 0322352	1999-10-27 00:00:00	\N	\N		\N
1993	4679	15/00-0046819 B 07	2021-07-19 00:00:00	\N	\N		\N
1994	3683	15/00-0046819 B 07	2021-07-19 00:00:00	\N	\N		\N
1995	1680	46/00 - 0842146 B 99	2016-08-23 00:00:00	\N	\N		\N
1996	4533	46/00 - 0842146 B 99	2016-08-23 00:00:00	\N	\N		\N
1997	5017	17/00-0303897B22	2022-08-07 00:00:00	\N	\N		\N
1998	\N	99 B 0082882	2001-02-14 00:00:00	\N	\N		\N
1999	5094	16/00-1018325 B22	2023-02-15 00:00:00	\N	\N		\N
2000	5056	37/00-0642331B22	2024-04-18 00:00:00	\N	\N	002237010000373	\N
2001	3851	08 B 0976991-16/00	2014-07-07 00:00:00	\N	\N		\N
2002	4430	n° 14/00-0423172 B11	2018-02-28 00:00:00	\N	\N	001114259002551	\N
2003	5095	n° 14/00-0423172 B11	2018-02-28 00:00:00	\N	\N	001114259002551	\N
2004	4926	16/00-1019446 B 23	2023-10-01 00:00:00	\N	\N		\N
2005	4832	16/00-0842924 B 17	2017-07-16 00:00:00	\N	\N	001746019006541	\N
2006	4835	16/00-0842924 B 17	2017-07-16 00:00:00	\N	\N	001746019006541	\N
2007	5	98 B 282147	1998-09-09 00:00:00	\N	\N		\N
2008	3666	98 B 282147	1998-09-09 00:00:00	\N	\N		\N
2009	3694	10 B 0563226	2010-10-17 00:00:00	\N	\N		\N
2010	3167	04 B 0302664	2007-11-19 00:00:00	\N	\N		\N
2011	3962	0808733 B 15	2015-03-25 00:00:00	\N	\N	001509080873388	\N
2012	3419	04 B 0804827	2004-04-15 00:00:00	\N	\N	000409190487536	\N
2013	2781	06 B 0067018	2015-02-15 00:00:00	\N	\N		\N
2014	442	00 B 522516	2000-03-14 00:00:00	\N	\N		\N
2015	1510	98 B 0862138	1998-04-30 00:00:00	\N	\N		\N
2016	3732	98 B 0102224	2010-08-11 00:00:00	\N	\N		\N
2017	\N	0422922 B07	2018-12-02 00:00:00	\N	\N	00071404229223200000	\N
2018	4330	11/00-0202426 B 16	2018-07-03 00:00:00	\N	\N		\N
2019	758	23/00-0363200 B 01	2008-09-01 00:00:00	\N	\N		\N
2020	2583	98 B 222106	2007-11-04 00:00:00	\N	\N	099805180720724	\N
2021	3961	31/06-0105738 B 02	2024-01-24 00:00:00	\N	\N	000231010573809	\N
2022	\N	99 B 0542186	\N	\N	\N		\N
2023	184	99 B 0022174	2003-10-11 00:00:00	\N	\N	099322460147033	\N
2024	\N	05 B 0724339	2012-05-09 00:00:00	\N	\N	00535200148552	\N
2025	2020	04 B 0562715	2004-04-11 00:00:00	\N	\N	000428219001059	\N
2026	4540	04 B 0562715	2004-04-11 00:00:00	\N	\N	000428219001059	\N
2027	2784	04 B 0662995	2004-11-22 00:00:00	\N	\N		\N
2028	2281	28/00 - 0562063 B 98	2021-08-31 00:00:00	\N	\N	898828270504816	\N
2029	4110	28/00 - 0562063 B 98	2021-08-31 00:00:00	\N	\N	898828270504816	\N
2030	\N	00 B 0903675	2016-04-24 00:00:00	\N	\N	098202010003850	\N
2031	\N	99 B 102279	\N	\N	\N		\N
2032	3753	08 B 0124072	2008-02-18 00:00:00	\N	\N		\N
2033	3380	22/00-0023640 B 11	2012-10-12 00:00:00	\N	\N		\N
2034	4524	22/00-0023640 B 11	2012-10-12 00:00:00	\N	\N		\N
2035	3821	05 B 0583061	2013-11-27 00:00:00	\N	\N	000512058306162	\N
2036	1340	99 B 262305	1999-03-31 00:00:00	\N	\N		\N
2037	3425	98 B 0582173-12/00	2019-02-04 00:00:00	\N	\N	099212010266437	\N
2038	\N	0986657 B13	2021-05-04 00:00:00	\N	\N		\N
2039	2667	05 B 0663014  29/00	2005-01-30 00:00:00	\N	\N		\N
2040	4264	16 B 0663792	2016-02-02 00:00:00	\N	\N	001619066379263	\N
2041	2294	00 B 0012818	2017-01-08 00:00:00	\N	\N	000016001281818	\N
2042	\N	02B 0105702	2002-03-26 00:00:00	\N	\N		\N
2043	3360	06 B 0562907	2020-10-20 00:00:00	\N	\N	000628056290745	\N
2044	2806	0923162 B 06	2011-08-22 00:00:00	\N	\N	000603092316213	\N
2045	1455	02 B 0106272	2006-02-25 00:00:00	\N	\N		\N
2046	5115	29/00-0663587B13	2024-05-13 00:00:00	\N	\N	001329100006171	\N
2047	4811	05 B 0123733 30/00	2023-01-18 00:00:00	\N	\N	000530012373375	\N
2048	2645	98 B 0662126	2009-05-05 00:00:00	\N	\N	098229300013048	\N
2049	4530	07/00-0242918 B 10	2015-07-20 00:00:00	\N	\N	001007030001184	\N
2050	4209	30/00 0124386 B 10	2020-11-18 00:00:00	\N	\N	001030012438682	\N
2051	\N	30/00 0124364 B 10	2011-06-15 00:00:00	\N	\N	001030089001652	\N
2052	2614	01B 0014877	2010-06-10 00:00:00	\N	\N	000116091487707	\N
2053	4531	N°  28/00 - 0563164 B 10	2017-08-15 00:00:00	\N	\N	001028010001475	\N
2054	1648	13/00 - 0262217 B 99	2023-06-22 00:00:00	\N	\N	099913026221746	\N
2055	\N	98 B 0322199	1994-08-06 00:00:00	\N	\N	099843032219927	\N
2056	205	98 B 0082471	2003-12-31 00:00:00	\N	\N	000319489048035	\N
2057	3848	02 B 0016897	2002-02-09 00:00:00	\N	\N		\N
2058	3306	09 B 0302897	2009-05-02 00:00:00	\N	\N		\N
2059	2731	06 B 0973760	2006-05-13 00:00:00	\N	\N		\N
2060	2439	06 B 0463419	2006-02-08 00:00:00	\N	\N		\N
2061	3411	08 B 0162849	2008-12-24 00:00:00	\N	\N		\N
2062	2130	28/00 - 0562699 B 04	2016-02-21 00:00:00	\N	\N	000428056269992	\N
2063	4792	05/00 - 0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
2064	4788	05/00 - 0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
2065	4789	05/00 - 0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
2066	4365	05/00 - 0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
2067	4791	05/00 - 0224281 B 11	2018-03-19 00:00:00	\N	\N		\N
2068	2880	19/00 – 0083440 B 99	2017-05-15 00:00:00	\N	\N		\N
2069	4278	37/00-0642229 B 17	2023-04-06 00:00:00	\N	\N		\N
2070	4719	19/00 - 0091932 B 15	2022-01-31 00:00:00	\N	\N	001519010045753	\N
2071	5047	43/00 - 0323359 B 09	2023-05-28 00:00:00	\N	\N	000943120012463	\N
2072	\N	05/01-0112906 B 12	2012-04-09 00:00:00	\N	\N	0001231011290661	\N
2073	2413	05 B 0162658	2005-05-11 00:00:00	\N	\N		\N
2074	3011	98 B 0182301 06/00	2014-10-20 00:00:00	\N	\N	99806018230162	\N
2075	4027	12 B 0048716	2014-02-26 00:00:00	\N	\N		\N
2076	3206	06 B 0263505 13/00	2012-09-03 00:00:00	\N	\N	000613049013649	\N
2077	2367	98 B 0042349	2013-12-04 00:00:00	\N	\N		\N
2078	17	90 B 0004	1993-08-04 00:00:00	\N	\N		\N
2079	\N	99 B 222473	2006-09-26 00:00:00	\N	\N		\N
2080	1698	03 B 0763675	2003-03-03 00:00:00	\N	\N		\N
2081	\N	04 B 0107498	2004-08-03 00:00:00	\N	\N		\N
2082	5039	12/05 - 0582618 B 01	2022-02-07 00:00:00	\N	\N		\N
2083	2419	98 B 0582040	1998-02-03 00:00:00	\N	\N		\N
2084	2048	99 B 04002231	1999-03-29 00:00:00	\N	\N		\N
2085	4192	16 B 0906823 - 00/02	2016-03-10 00:00:00	\N	\N		\N
2086	3360	06 B 0562907	2006-12-18 00:00:00	\N	\N		\N
2087	2684	0967327 B 05	2005-02-14 00:00:00	\N	\N		\N
2088	1924	05 B 0066699	2005-12-21 00:00:00	\N	\N		\N
2089	4876	16/00-0020519 b 03	2019-03-30 00:00:00	\N	\N		\N
2090	175	98 B 0382053	1998-06-09 00:00:00	\N	\N		\N
2091	3740	25/00 0067637 B 06	2015-05-24 00:00:00	\N	\N	000825006763783	\N
2092	\N	06 B 0724826	2008-02-20 00:00:00	\N	\N		\N
2093	3906	10 B 0242943	2010-06-29 00:00:00	\N	\N	000707024272108	\N
2094	4864	12 B 1006084	2022-04-12 00:00:00	\N	\N	001216500193643	\N
2095	3800	20/00-0742374B05	2019-01-28 00:00:00	\N	\N	000520010142661	\N
2096	5099	35/00 - 0727510 B 16	2024-11-27 00:00:00	\N	\N	001635220015067	\N
2097	225	98 B 0322123	\N	\N	\N		\N
2098	3858	35/01 0543229 B 10	2010-05-17 00:00:00	\N	\N	001039054322990	\N
2099	4141	30/00 - 0125365 B 16	2016-05-05 00:00:00	\N	\N		\N
2100	4109	11 B 1004654 - 00/16	2022-07-03 00:00:00	\N	\N	111116100465411	\N
2101	3229	09 B 0223952	2019-03-25 00:00:00	\N	\N	000905480003458	\N
2102	3952	05/00 0224285 B 11	2019-12-16 00:00:00	\N	\N	001105022428513	\N
2103	4416	34/00-0465390 B16	2019-12-31 00:00:00	\N	\N		\N
2104	4415	34/00-0465390 B16	2019-12-31 00:00:00	\N	\N		\N
2105	3224	07/00-0242836 B 09	2015-03-19 00:00:00	\N	\N	000907024283698	\N
2106	4092	07/00-0242836 B 09	2015-03-19 00:00:00	\N	\N	000907024283698	\N
2107	4093	07/00-0242836 B 09	2015-03-19 00:00:00	\N	\N	000907024283698	\N
2108	4778	16/00-0013975 B01	2015-10-06 00:00:00	\N	\N	000116420045949	\N
2109	\N	99 B 0302220	2002-05-12 00:00:00	\N	\N	099517319080713	\N
2110	2743	01 B 0782318	2006-04-12 00:00:00	\N	\N		\N
2111	3425	98 B 0582173	2014-11-10 00:00:00	\N	\N	099212010266437	\N
2112	4402	17 B 0544116  00/39	2022-08-03 00:00:00	\N	\N	001739019004346	\N
2113	5113	32/00-0622285B17	2018-10-18 00:00:00	\N	\N		\N
2114	5114	25B0217071-00/54	2025-03-11 00:00:00	\N	\N		\N
2115	2113	99 B 0662288	\N	\N	\N		\N
2116	4822	19/00-0090356 B 13	2019-05-02 00:00:00	\N	\N	001319009035663	\N
2117	4823	19/00-0090356 B 13	2019-05-02 00:00:00	\N	\N	001319009035663	\N
2118	4824	19/00-0090356 B 13	2019-05-02 00:00:00	\N	\N	001319009035663	\N
2119	1820	04 B 0282974	2019-02-26 00:00:00	\N	\N	000410381062651	\N
2120	3072	04 B 0583004	2004-07-11 00:00:00	\N	\N		\N
2121	1213	99 B 62 759	\N	\N	\N		\N
2122	3458	08 B 0979866	2013-09-10 00:00:00	\N	\N	000816180063352	\N
2123	3012	08 B 0979866	2013-09-10 00:00:00	\N	\N	000816180063352	\N
2124	4253	13 B 0163120  00/48	2020-01-06 00:00:00	\N	\N		\N
2125	1908	98 B 0882017	2001-12-18 00:00:00	\N	\N		\N
2126	\N	98 B 422102	1998-08-09 00:00:00	\N	\N		\N
2127	1159	02 B 0742257	2021-12-19 00:00:00	\N	\N	120019003758	\N
2128	503	99 B  056 2231	\N	\N	\N		\N
2129	4527	N°39/00 - 0543229 B 10	2016-07-10 00:00:00	\N	\N	001039054322990	\N
2130	2626	04 B 0923057	2004-10-26 00:00:00	\N	\N		\N
2131	209	98 B 0102950	2004-02-08 00:00:00	\N	\N		\N
2132	429	00 B 0522634	2000-11-29 00:00:00	\N	\N		\N
2133	1965	99 B 0722750	\N	\N	\N		\N
2134	3294	0086846 B 07	2015-03-17 00:00:00	\N	\N		\N
2135	1370	00 B 0011144	\N	\N	\N		\N
2136	\N	98 B 122291	1998-07-14 00:00:00	\N	\N		\N
2137	2379	00 B 0722946	2013-04-14 00:00:00	\N	\N		\N
2138	2534	04 B 0065798	2004-06-07 00:00:00	\N	\N	000425109015745	\N
2139	3105	05 B 0302758	2005-11-02 00:00:00	\N	\N		\N
2140	4735	39/00-0543976 B16	2021-09-05 00:00:00	\N	\N	001639010005168	\N
2141	3528	09 B 0088481	2009-12-14 00:00:00	\N	\N	000919209060731	\N
2142	4776	34/00 - 0462216 B 98	2019-12-29 00:00:00	\N	\N		\N
2143	3360	06 B 0562907	2012-04-03 00:00:00	\N	\N		\N
2144	\N	05 B 0108232 - 31/00	2016-05-11 00:00:00	\N	\N		\N
2145	\N	48/00-0162868 B 09	2018-10-17 00:00:00	\N	\N		\N
2146	1802	98B 0902234	1998-11-22 00:00:00	\N	\N		\N
2147	\N	0402414 B 99	2006-05-27 00:00:00	\N	\N	099904040241433	\N
2148	3353	07 B 0862933	2007-02-04 00:00:00	\N	\N	000647029005641	\N
2149	2850	07 B 0583235	2007-04-10 00:00:00	\N	\N		\N
2150	4919	05/00 - 0224519 B 12	2019-04-03 00:00:00	\N	\N	001205420007073	\N
2151	1280	00 B 0502348	2000-12-12 00:00:00	\N	\N		\N
2152	2015	03 B 0862664	2003-01-07 00:00:00	\N	\N		\N
2153	4779	31/00 - 0109162 B 07	2021-03-10 00:00:00	\N	\N		\N
2154	4988	31/00 - 0109162 B 07	2021-03-10 00:00:00	\N	\N		\N
2155	3090	99 B 0009731	\N	\N	\N		\N
2156	106	03 B 0106515	2003-02-26 00:00:00	\N	\N		\N
2157	96	99 B 0502242	1999-12-13 00:00:00	\N	\N		\N
2158	3542	10 B 0563218	2014-11-25 00:00:00	\N	\N		\N
2159	473	99 B 362692	1999-08-24 00:00:00	\N	\N		\N
2160	3344	08 B 0977901	2008-07-13 00:00:00	\N	\N	000816097790139	\N
2161	3899	30/00-0123001 B 01	2013-05-14 00:00:00	\N	\N	130049005457	\N
2162	3425	98 B 0582173	2009-05-10 00:00:00	\N	\N		\N
2163	401	99 B 9021016	1999-08-22 00:00:00	\N	\N	099602210364628	\N
2164	\N	00 B 0662350	\N	\N	\N		\N
2165	2531	99 B 0802985	\N	\N	\N		\N
2166	2712	02 B 0084585	2007-02-24 00:00:00	\N	\N	000219200275453	\N
2167	1969	01 B 0014225	2001-02-12 00:00:00	\N	\N	000116130631170000	\N
2168	2117	04 B 0263212	2004-09-21 00:00:00	\N	\N	000413026321226	\N
2169	831	05 B 0143093	2005-03-20 00:00:00	\N	\N	000521109003458	\N
2170	2201	29/00-0662230 B 99	2011-03-10 00:00:00	\N	\N		\N
2171	\N	96 B 50209	1997-01-19 00:00:00	\N	\N		\N
2172	5044	25/00 - 0068708 B10	2014-07-13 00:00:00	\N	\N	001025070014467	\N
2173	\N	09 B 0088419	2015-10-19 00:00:00	\N	\N		\N
2174	\N	00 B 0682329	2005-06-21 00:00:00	\N	\N		\N
2175	322	24/00 – 0382216 B 99	2018-06-14 00:00:00	\N	\N	099924038221649	\N
2176	3355	28/00 0563164 B 10	2017-08-15 00:00:00	\N	\N	001028010001475	\N
2177	110	99 B 0322335	1999-10-03 00:00:00	\N	\N		\N
2178	2549	02 B 0342586	2002-11-20 00:00:00	\N	\N		\N
2179	4614	56/00-0612005 B21	\N	\N	\N		\N
2180	4592	56/00-0612087 B23	\N	\N	\N		\N
2181	4624	56/00-0612024 B21	\N	\N	\N		\N
2182	3532	05B0162872	2005-08-24 00:00:00	\N	\N		\N
2183	2960	07 B 0975025	2007-08-15 00:00:00	\N	\N		\N
2184	2204	05 B 0724597 - 35/00	2019-04-08 00:00:00	\N	\N		\N
2185	1462	99 B 22329	1999-09-20 00:00:00	\N	\N		\N
2186	4900	05/00-0226558 B22	2022-09-07 00:00:00	\N	\N	002205022655866	\N
2187	1969	01 B 0014225	2005-02-12 00:00:00	\N	\N	000116001422534	\N
2188	4843	21/00 - 0144835 B 22	2022-04-05 00:00:00	\N	\N		\N
2189	138	96 B 0110859	1995-04-01 00:00:00	\N	\N		\N
2190	1305	96 B 0110859	1995-04-01 00:00:00	\N	\N		\N
2191	3100	06 B 0123909	2006-11-14 00:00:00	\N	\N		\N
2192	3050	99 B 62997	1999-06-16 00:00:00	\N	\N		\N
2193	4251	14 B 0225092  - 00/53	2022-02-20 00:00:00	\N	\N		\N
2194	\N	0362498 B99	2018-05-18 00:00:00	\N	\N		\N
2195	661	99 B 0342265	2004-03-16 00:00:00	\N	\N		\N
2196	3758	99 B 0162208	2008-07-01 00:00:00	\N	\N	099948016220824	\N
2197	1881	99 B 0862359	2012-06-21 00:00:00	\N	\N	96794710005835	\N
2198	\N	98 B 0762196	1998-10-26 00:00:00	\N	\N		\N
2199	1468	96 B 150224	\N	\N	\N		\N
2200	3422	02 B 0562492	2002-02-25 00:00:00	\N	\N	00022049003452	\N
2201	4251	14 B 0225092  - 00/05	2022-02-20 00:00:00	\N	\N		\N
2202	2762	06 B 0404217	2020-01-02 00:00:00	\N	\N	000604030158459	\N
2203	3935	13 B 0069997	2014-06-08 00:00:00	\N	\N	001325006999761	\N
2204	320	01 B 0202123	2007-04-16 00:00:00	\N	\N		\N
2205	\N	99 B 0103401	\N	\N	\N		\N
2206	5058	24B 0227050 - 05/00	2024-07-03 00:00:00	\N	\N	002405010013668	\N
2207	284	07 B 0422954	2007-12-30 00:00:00	\N	\N		\N
2208	2631	05 B 0162685	2005-12-14 00:00:00	\N	\N		\N
2209	3208	05 B 0086324	2005-08-03 00:00:00	\N	\N		\N
2210	3821	05 B 0583061	2016-07-24 00:00:00	\N	\N	000512058306162	\N
2211	\N	99 B 462307	\N	\N	\N		\N
2212	183	06 B 0502557	2006-08-23 00:00:00	\N	\N		\N
2213	5118	31/00-0112072 B11	2019-03-24 00:00:00	\N	\N		\N
2214	3351	02 B 0861638	2002-06-23 00:00:00	\N	\N	000247029003353	\N
2215	2393	98 B 0582104	2000-07-16 00:00:00	\N	\N		\N
2216	3224	09 B 0242836	2015-03-19 00:00:00	\N	\N	0907024283698	\N
2217	4092	09 B 0242836	2015-03-19 00:00:00	\N	\N	0907024283698	\N
2218	4093	09 B 0242836	2015-03-19 00:00:00	\N	\N	0907024283698	\N
2219	3053	26/00 08 B 0342992	2008-04-08 00:00:00	\N	\N		\N
2220	5031	01/08 - 0882515 B 06	2021-04-05 00:00:00	\N	\N		\N
2221	4105	14 B 0423388 - 00/14	2016-03-20 00:00:00	\N	\N	001414279000450	\N
2222	4106	14 B 0423388 - 00/14	2016-03-20 00:00:00	\N	\N	001414279000450	\N
2223	4684	22/00-0024443 B18	2018-11-17 00:00:00	\N	\N		\N
2224	3296	02/00 - 0905956 B 09	2013-08-21 00:00:00	\N	\N		\N
2225	\N	08 B 0323209	2008-05-28 00:00:00	\N	\N		\N
2226	277	22/00-0022760 B 02	2013-04-23 00:00:00	\N	\N	000222459008150	\N
2227	2383	B99 0282292	2003-02-24 00:00:00	\N	\N		\N
2228	2750	98B0742051-20/00	2018-12-11 00:00:00	\N	\N		\N
2229	3049	07 B 0422888	2016-08-23 00:00:00	\N	\N	000714042288860	\N
2230	4532	07 B 0422888	2016-08-23 00:00:00	\N	\N	000714042288860	\N
2231	3854	01 B 0015669	2010-07-25 00:00:00	\N	\N	0116001566907	\N
2232	\N	N°04/00 - 0404188 B06	2018-09-12 00:00:00	\N	\N	000604040418820	\N
2233	78	16/00  0007100 B 99	2016-10-18 00:00:00	\N	\N		\N
2234	4981	39/00 - 0543887 B 15	2019-06-30 00:00:00	\N	\N		\N
2235	4254	08 B 0563070  00/28	2017-02-01 00:00:00	\N	\N	000828019010450	\N
2236	4802	18 B 0642233	2022-06-09 00:00:00	\N	\N		\N
2237	1415	03/00 - 0922222 B 98	2014-09-14 00:00:00	\N	\N		\N
2238	3355	28/00 0563164 B 10	2010-01-25 00:00:00	\N	\N	001028019002064	\N
2239	4871	31/00-0109341 B07	2018-12-27 00:00:00	\N	\N	000731040033268	\N
2240	4885	35/00-0977480 B 07	2023-09-27 00:00:00	\N	\N		\N
2241	4931	16/00-1049983	2021-09-28 00:00:00	\N	\N	002116420240458	\N
2242	3740	25/00 0067637 B 08	2023-07-24 00:00:00	\N	\N	000825006763783	\N
2243	5022	17/00-0304041 b23	2023-08-22 00:00:00	\N	\N		\N
2244	4916	19/00-0093873  19	2023-11-28 00:00:00	\N	\N	001919010032068	\N
2245	4024	09 B 0942971 - 08/00	2018-03-07 00:00:00	\N	\N		\N
2246	\N	99 A 2118111	\N	\N	\N		\N
2247	5116	17/00 - 0303844B22	2024-12-18 00:00:00	\N	\N		\N
2248	5084	21B0943259-00/08	2021-02-09 00:00:00	\N	\N	002108010001378	\N
2249	5117	10/00-0285337 B24	2024-12-22 00:00:00	\N	\N		\N
2250	2188	28/00 0562757 B 04	2014-04-08 00:00:00	\N	\N	000428039007055	\N
2251	3787	98 B 0902173	2008-06-04 00:00:00	\N	\N	099702029060323	\N
2252	3011	98 B 0182301	2006-02-07 00:00:00	\N	\N	99806018230162	\N
2253	5086	47/00-0863552 B16	2017-05-08 00:00:00	\N	\N	001647040001463	\N
2254	5091	21 B 16/00-1017383	2021-10-28 00:00:00	\N	\N	002116101738377	\N
2255	\N	N°11/00-0764408B13	2021-06-02 00:00:00	\N	\N		\N
2256	3855	0003443 B 98	2015-05-18 00:00:00	\N	\N		\N
2257	4802	18 B 0642233-00/37	2022-06-09 00:00:00	\N	\N		\N
2258	5092	02/00-0907047 B 18	2024-08-14 00:00:00	\N	\N		\N
2259	4989	19/00-0094404 B21	2021-04-01 00:00:00	\N	\N	002219009440412	\N
2260	5102	10/00 - 0125753 B 18	2018-07-15 00:00:00	\N	\N		\N
2261	703	09/00-0020257 B 02	2024-12-08 00:00:00	\N	\N		\N
2262	1394	04 B 0422716	2017-07-06 00:00:00	\N	\N		\N
2263	165		\N	\N	\N		\N
2264	166	05 B 0805351	2005-09-18 00:00:00	\N	\N		\N
2265	167	97 A 3010042	\N	\N	\N		\N
2266	1715	04 B 0662910	2020-02-12 00:00:00	\N	\N		\N
2267	1828		\N	\N	\N		\N
2268	561	05/00 - 0223102 B 03	2018-11-13 00:00:00	\N	\N		\N
2269	2661		\N	\N	\N		\N
2270	1368		\N	\N	\N	000923036498178	\N
2271	2864		\N	\N	\N		\N
2272	2482		\N	\N	\N	000823036465414	\N
2273	1920		\N	\N	\N	097916150010548000	\N
2274	1922		\N	\N	\N		\N
2275	2317		\N	\N	\N	001105022428513	\N
2276	854	03 B 0582919	2003-12-22 00:00:00	\N	\N	09861626000239	\N
2277	1814		\N	\N	\N		\N
2278	2991	05 B 0223447	2013-05-30 00:00:00	\N	\N		\N
2279	39	07 B 0086825	2007-01-30 00:00:00	\N	\N		\N
2280	2812	99 B 0006691	2007-04-15 00:00:00	\N	\N	099516120536822	\N
2281	1923		\N	\N	\N		\N
2282	463		\N	\N	\N		\N
2283	2444	99 B 0822084	2014-01-27 00:00:00	\N	\N		\N
2284	61	90 B 0110009	\N	\N	\N		\N
2285	2694	08 B 0806174	2014-10-06 00:00:00	\N	\N	001216100608472	\N
2286	2447		\N	\N	\N	001622002425091	\N
2287	630	00 B 0442276	2000-02-01 00:00:00	\N	\N		\N
2288	2667	29/00 - 0663014 B 05	2020-11-23 00:00:00	\N	\N		\N
2289	248	02 B 0064690	2005-04-24 00:00:00	\N	\N		\N
2290	250	98 B 482115	\N	\N	\N		\N
2291	448		\N	\N	\N		\N
2292	1810	99 B 0142356	1999-07-07 00:00:00	\N	\N		\N
2293	940		\N	\N	\N	000443032283355	\N
2294	1357	00 B 0182559	2000-10-28 00:00:00	\N	\N		\N
2295	2345		\N	\N	\N		\N
2296	1473	05 B 0622140	2005-06-19 00:00:00	\N	\N		\N
2297	1652	99B0462355-00/34	2017-01-04 00:00:00	\N	\N	39057102027	\N
2298	2745	01 B 0022549	2006-03-18 00:00:00	\N	\N		\N
2299	2746	99 B 9020421	1999-02-14 00:00:00	\N	\N		\N
2300	1169		\N	\N	\N		\N
2301	1911		\N	\N	\N		\N
2302	2732	00 B 12469	2005-11-28 00:00:00	\N	\N		\N
2303	2463		\N	\N	\N	001509080873388	\N
2304	2464	07 B 0663198	2007-10-31 00:00:00	\N	\N		\N
2305	1345	98 B 0082263	1998-05-16 00:00:00	\N	\N	0205429016644	\N
2306	2372	30/00 B 0122868	2018-06-20 00:00:00	\N	\N		\N
2307	298	99 B 0083132	2022-12-22 00:00:00	\N	\N		\N
2308	1606	98 B 0322056	1998-03-09 00:00:00	\N	\N		\N
2309	1607		\N	\N	\N		\N
2310	322	24/00 – 0382216 B 99	2023-11-22 00:00:00	\N	\N	098229300013048	\N
2311	852		\N	\N	\N	000525006663764	\N
2312	2047	05/00-0222763 B 01	2015-12-14 00:00:00	\N	\N		\N
2313	2016		\N	\N	\N		\N
2314	1776		\N	\N	\N		\N
2315	4147	09 B 0242894	2015-01-27 00:00:00	\N	\N		\N
2316	3110	05/00-0222008 B 97	2011-12-29 00:00:00	\N	\N		\N
2317	3014		\N	\N	\N		\N
2318	2867		\N	\N	\N		\N
2319	2296	98 B 22058	1998-04-15 00:00:00	\N	\N		\N
2320	2295	02 B 462982	2002-12-31 00:00:00	\N	\N		\N
2321	1165	46/00-0882205 B99	2019-04-15 00:00:00	\N	\N		\N
2322	1797	98 B 0322116	2015-11-29 00:00:00	\N	\N	099712020501543	\N
2323	1802	98 B 0902234	2006-04-18 00:00:00	\N	\N		\N
2324	1693	30/00 - 0123211 B 02	2015-01-06 00:00:00	\N	\N		\N
2325	1694		\N	\N	\N		\N
2326	1695		\N	\N	\N	000928209006932	\N
2327	2040	04 B 0022947	\N	\N	\N		\N
2328	1557		\N	\N	\N		\N
2329	3028	 0842308 B 04	2010-12-09 00:00:00	\N	\N		\N
2330	482	01 B 0903772	\N	\N	\N	0007135519007247	\N
2331	673		\N	\N	\N		\N
2332	2539		\N	\N	\N		\N
2333	946		\N	\N	\N		\N
2334	1980	00 B 382273	2000-03-28 00:00:00	\N	\N		\N
2335	549	02 B 0022749	2002-09-30 00:00:00	\N	\N	000305459011351	\N
2336	383	00 B 0142539	2000-07-30 00:00:00	\N	\N		\N
2337	316	99 B 0083335	2010-11-11 00:00:00	\N	\N		\N
2338	3222	06 B 0123936	2006-12-19 00:00:00	\N	\N	002304040692623	\N
2339	2358		\N	\N	\N		\N
2340	3047	08 B 0942955-08/00	2015-11-10 00:00:00	\N	\N	000944270003456	\N
2341	107	97 B 71006	1997-04-27 00:00:00	\N	\N	09992506275195	\N
2342	2099		\N	\N	\N		\N
2343	524	98 B 175262	1998-11-30 00:00:00	\N	\N	96905480003135	\N
2344	1996		\N	\N	\N		\N
2345	851		\N	\N	\N		\N
2346	2337		\N	\N	\N	000516097094649	\N
2347	1871		\N	\N	\N	000516097094649	\N
2348	1246	05/00 - 0222100 B 98	2019-03-27 00:00:00	\N	\N	000516097094649	\N
2349	632	00 B 0122887-30/00	2013-01-03 00:00:00	\N	\N	000516097094649	\N
2350	2327	04 B 0162617	2004-09-18 00:00:00	\N	\N		\N
2351	4149	99 B 0322350	2016-07-13 00:00:00	\N	\N		\N
2352	941		\N	\N	\N	035072306136	\N
2353	584		\N	\N	\N		\N
2354	301		\N	\N	\N		\N
2355	522	01 A 2516914	\N	\N	\N		\N
2356	2712	19/00 - 0084585 B 02	2019-09-16 00:00:00	\N	\N	000520030181363	\N
2357	2753		\N	\N	\N	000919008837195	\N
2358	2051	02 B 0502428	2015-03-01 00:00:00	\N	\N		\N
2359	1542	21/00-0142447 B 00	2012-12-26 00:00:00	\N	\N		\N
2360	1387	0064973 B 02	2014-12-15 00:00:00	\N	\N		\N
2361	313	98 B 158262	1998-11-12 00:00:00	\N	\N	098909150012635	\N
2362	351	98 B 642029	\N	\N	\N		\N
2363	2976	14/00 – 0423018 B 09	2019-08-26 00:00:00	\N	\N		\N
2364	2334	34/00 - 0462186 B 98	2021-04-14 00:00:00	\N	\N		\N
2365	1343	25/00-0066975 B 06	2016-05-18 00:00:00	\N	\N	099539010743033	\N
2366	1289	05/01-0112906 B 12	2012-04-09 00:00:00	\N	\N		\N
2367	2280	00 B 0882270	2003-10-05 00:00:00	\N	\N		\N
2368	292	98 B 8820118	1998-01-14 00:00:00	\N	\N	000229066261609	\N
2369	429	42/00  0522634B00	2018-07-17 00:00:00	\N	\N	000526349005639	\N
2370	1531	99 B 63036	\N	\N	\N	000201010546860	\N
2371	626	98 B 0682078	2008-03-25 00:00:00	\N	\N	000416280981539	\N
2372	534	01 B 0084096	2001-06-23 00:00:00	\N	\N	001516460303848	\N
2373	2449	98 B 0042349	2005-09-03 00:00:00	\N	\N	001225006965276	\N
2374	1908	01/01-0882017 B 98	2014-01-09 00:00:00	\N	\N	0322069013355	\N
2375	68		\N	\N	\N		\N
2376	2655		\N	\N	\N		\N
2377	2878		\N	\N	\N	000907010000964	\N
2378	3033	02 B 0222907	2002-05-18 00:00:00	\N	\N		\N
2379	2848	42/00 0524521 B 15	2017-02-10 00:00:00	\N	\N	000531029020847	\N
2380	686	97 B 462017	2001-12-10 00:00:00	\N	\N		\N
2381	755		\N	\N	\N		\N
2382	2978		\N	\N	\N		\N
2383	1081		\N	\N	\N		\N
2384	2054	03 B 0882365	2003-03-03 00:00:00	\N	\N		\N
2385	2538	05 B 0822230	2005-02-22 00:00:00	\N	\N		\N
2386	591		\N	\N	\N	805199009440	\N
2387	42	19/05-0366102 B 15	2016-02-23 00:00:00	\N	\N	111116100465442	\N
2388	2344	00 B 0722917	2019-12-18 00:00:00	\N	\N		\N
2389	588	99 B 0183036	2000-06-17 00:00:00	\N	\N		\N
2390	507		\N	\N	\N		\N
2391	655	0103149 B 99	2011-05-18 00:00:00	\N	\N		\N
2392	721		\N	\N	\N		\N
2393	2391	99 B 0009858	2011-06-21 00:00:00	\N	\N	098826519000321	\N
2394	2392	05 B 0702310	2005-03-20 00:00:00	\N	\N	000008019017063	\N
2395	1267		\N	\N	\N		\N
2396	355	99 B 22380	1999-12-21 00:00:00	\N	\N		\N
2397	606		\N	\N	\N		\N
2398	2494	99 A 818085	1999-03-23 00:00:00	\N	\N		\N
2399	1532	25/00 0063903 B 00	2013-05-13 00:00:00	\N	\N		\N
2400	612		\N	\N	\N		\N
2401	2536	98 B 122291	1998-07-14 00:00:00	\N	\N		\N
2402	2082	30/00 0124590 B 12	2019-02-20 00:00:00	\N	\N	00081609789548	\N
2403	221	22/00 – 0022479 B 00	2020-11-10 00:00:00	\N	\N		\N
2404	321	98 A 2712388	2001-07-24 00:00:00	\N	\N	0119200473748	\N
2405	737		\N	\N	\N		\N
2406	80	05 B 0086392	2005-12-11 00:00:00	\N	\N		\N
2407	1514	02 B 0422514	2002-05-21 00:00:00	\N	\N		\N
2408	2084	99 B 0082931	2003-07-07 00:00:00	\N	\N		\N
2409	3330	09 B 0983278 – 31/00	2016-06-16 00:00:00	\N	\N		\N
2410	2070		\N	\N	\N		\N
2411	2072		\N	\N	\N		\N
2412	1794		\N	\N	\N		\N
2413	1049		\N	\N	\N		\N
2414	590	01 B 0582578	2001-05-02 00:00:00	\N	\N	0322069013355	\N
2415	1425		\N	\N	\N		\N
2416	53	05/00-0223084 B 03	2015-08-23 00:00:00	\N	\N		\N
2417	2675	99/B/42999-01/38	2015-03-24 00:00:00	\N	\N	00535200148552	\N
2418	215	00 A 0537152	2000-12-25 00:00:00	\N	\N		\N
2419	341	99 B 0702143	2004-02-09 00:00:00	\N	\N		\N
2420	2299	46/00-0842366 B 05	2023-01-10 00:00:00	\N	\N		\N
2421	2301		\N	\N	\N		\N
2422	2485	99 A 0523039	\N	\N	\N		\N
2423	2486	00 A 21226434	2000-09-26 00:00:00	\N	\N		\N
2424	2488		\N	\N	\N		\N
2425	2489	98 A 2113691	\N	\N	\N		\N
2426	607	04 B 0382508	2004-04-18 00:00:00	\N	\N		\N
2427	462	31/00-0111506 B 10	2010-05-30 00:00:00	\N	\N	001340049001455	\N
2428	1625	03 B 0542633	2020-08-31 00:00:00	\N	\N		\N
2429	2465		\N	\N	\N		\N
2430	3749	04 B 0463221	2020-03-02 00:00:00	\N	\N	001612219004648	\N
2431	3687		\N	\N	\N		\N
2432	520	02 B 0017007	2002-02-17 00:00:00	\N	\N		\N
2433	437	98 B 0942081	2004-05-31 00:00:00	\N	\N		\N
2434	3299	13/00-0263550 B 07	2013-07-23 00:00:00	\N	\N		\N
2435	1388		\N	\N	\N	000907010000964	\N
2436	2690	99 B 0122594	2018-07-18 00:00:00	\N	\N	001043039007744	\N
2437	1939		\N	\N	\N		\N
2438	4		\N	\N	\N		\N
2439	4209	30/00 0124386 B 10	2020-11-18 00:00:00	\N	\N		\N
2440	4211		\N	\N	\N	0001016209026351	\N
2441	2592	05 B 0663060	2014-12-04 00:00:00	\N	\N		\N
2442	2275	02 B 0422517	2002-05-26 00:00:00	\N	\N	000516096877030	\N
2443	2354	12/00-0582926 B 04	2019-06-20 00:00:00	\N	\N	000516096877030	\N
2444	133	00 B 0104926	2000-12-03 00:00:00	\N	\N	000516096877030	\N
2445	723		\N	\N	\N	000516096877030	\N
2446	2133		\N	\N	\N		\N
2447	340	99 B 0083189	2000-05-10 00:00:00	\N	\N		\N
2448	2544	97 B 0922004	2015-07-27 00:00:00	\N	\N		\N
2449	2953	99 B 0762816	2007-01-24 00:00:00	\N	\N	099931010331015	\N
2450	2982	14/00 - 0422922 B 07	2018-12-02 00:00:00	\N	\N		\N
2451	3332		\N	\N	\N	000816180063352	\N
2452	1713	47/00 - 0862220 B 98	2019-11-20 00:00:00	\N	\N	000816180063352	\N
2453	670		\N	\N	\N		\N
2454	638		\N	\N	\N	09861626000239	\N
2455	1944		\N	\N	\N	098407320024342	\N
2456	2602	18/00 - 0442688 B 05	2017-06-06 00:00:00	\N	\N	000520010142661	\N
2457	2793	09/00 - 0806010 B 08	2019-03-12 00:00:00	\N	\N		\N
2458	2866	38/00 0702354 B 07	2011-05-11 00:00:00	\N	\N		\N
2459	2836	04 B 0422686	2004-04-20 00:00:00	\N	\N	00123507266938	\N
2460	2724	06 B 0162718	2006-09-28 00:00:00	\N	\N		\N
2461	635		\N	\N	\N		\N
2462	1482		\N	\N	\N	001739019004346	\N
2463	1489	13/00-0263646 B 08	2008-03-19 00:00:00	\N	\N		\N
2464	1221	34/00-0463013 B 03	2011-06-02 00:00:00	\N	\N	001235072606938	\N
2465	589		\N	\N	\N		\N
2466	2038	03 B 0022856	2012-03-06 00:00:00	\N	\N		\N
2467	87	02 B 0084454	2009-10-28 00:00:00	\N	\N		\N
2468	1745		\N	\N	\N	001022002350787	\N
2469	1883		\N	\N	\N	001022002350787	\N
2470	209	98 B 0102950	2004-02-08 00:00:00	\N	\N	001022002350787	\N
2471	210		\N	\N	\N	000128040286646	\N
2472	1494		\N	\N	\N		\N
2473	2350		\N	\N	\N		\N
2474	2351	06 B 0542931	2006-10-07 00:00:00	\N	\N		\N
2475	613		\N	\N	\N	099910028222025	\N
2476	1315	99 B 0402418	1999-11-10 00:00:00	\N	\N	099910028222025	\N
2477	2383	99 B 0282292	2014-04-16 00:00:00	\N	\N	1216100608472	\N
2478	2384		\N	\N	\N		\N
2479	2977	08 B 0422956	2008-01-14 00:00:00	\N	\N	09959010748033	\N
2480	1409		\N	\N	\N		\N
2481	1412		\N	\N	\N	000914042303554	\N
2482	1200	29/00-0662857 B04	2018-11-13 00:00:00	\N	\N	000809010001472	\N
2483	3152	43/00-0323004 B 06	2011-10-04 00:00:00	\N	\N		\N
2484	3154	02/00-0905804B08	2011-02-13 00:00:00	\N	\N		\N
2485	3156	06 B 0422864	2019-07-31 00:00:00	\N	\N		\N
2486	3157	99 B 0302216-00/17	2016-05-08 00:00:00	\N	\N	195204030307941	\N
2487	2196	13/00 – 0264425 B 12	2019-01-20 00:00:00	\N	\N		\N
2488	497		\N	\N	\N		\N
2489	327	39/00 – 0542186 B 99	2019-01-10 00:00:00	\N	\N		\N
2490	1729		\N	\N	\N		\N
2491	1061		\N	\N	\N		\N
2492	1465		\N	\N	\N		\N
2493	2585		\N	\N	\N		\N
2494	1381		\N	\N	\N		\N
2495	2114	99 B 0103092	2001-10-06 00:00:00	\N	\N	000738070235497	\N
2496	498		\N	\N	\N		\N
2497	1981	98 B 0382051	1998-06-02 00:00:00	\N	\N	000228209006057	\N
2498	3382		\N	\N	\N		\N
2499	3383		\N	\N	\N		\N
2500	641	0262516-B-00	2004-08-04 00:00:00	\N	\N	000512058306162	\N
2501	173	06 B 0502558	2006-08-30 00:00:00	\N	\N	9822469091105	\N
2502	407	99 B 0083413	1999-10-18 00:00:00	\N	\N		\N
2503	2765		\N	\N	\N	45020404039	\N
2504	1924	0066699 B 05	2015-09-16 00:00:00	\N	\N		\N
2505	2958	07 B 0263541 - 13/00	2014-11-13 00:00:00	\N	\N	000705429010449	\N
2506	2251	04 B 0463177	2006-12-20 00:00:00	\N	\N		\N
2507	2868		\N	\N	\N		\N
2508	1791		\N	\N	\N		\N
2509	3314	01 B 0222756	2009-04-14 00:00:00	\N	\N		\N
2510	3468		\N	\N	\N		\N
2511	218	96 B 62256	\N	\N	\N		\N
2512	403	98 B 462100	\N	\N	\N		\N
2513	4148		\N	\N	\N		\N
2514	259	98 B 482118	2008-03-23 00:00:00	\N	\N		\N
2515	169		\N	\N	\N	00230542500181665	\N
2516	3350	99 B 0502238	2014-12-25 00:00:00	\N	\N	000815004698832	\N
2517	3345	09 B 0423036	2019-02-14 00:00:00	\N	\N		\N
2518	2748	08 B 0109873-31/00	2008-05-03 00:00:00	\N	\N		\N
2519	3074		\N	\N	\N		\N
2520	2937	0088114 B 09	2008-04-22 00:00:00	\N	\N	001630012536594	\N
2521	2938	05 B 0542781	2005-12-12 00:00:00	\N	\N		\N
2522	1890		\N	\N	\N		\N
2523	1648	13/00 - 0262217 B 99	2021-10-28 00:00:00	\N	\N	000413239008841	\N
2524	2646		\N	\N	\N		\N
2525	926		\N	\N	\N		\N
2526	1916		\N	\N	\N		\N
2527	1917		\N	\N	\N	000525006663764	\N
2528	1201		\N	\N	\N		\N
2529	1125	N°13/00-0263012 B03	2014-08-06 00:00:00	\N	\N		\N
2530	2319	04 B 0065701	2004-02-18 00:00:00	\N	\N		\N
2531	2980	07 B 0223745	2007-11-21 00:00:00	\N	\N		\N
2532	2446	99 B 0402176	2016-07-12 00:00:00	\N	\N		\N
2533	2614	01 b 0014877	2010-06-10 00:00:00	\N	\N		\N
2534	3327	09/00 1002052 B 08	2017-07-30 00:00:00	\N	\N		\N
2535	4145	99 B 0242128	2018-11-05 00:00:00	\N	\N		\N
2536	171	02 B 0502422	2002-11-05 00:00:00	\N	\N		\N
2537	2467		\N	\N	\N		\N
2538	1535	0422672 B 04	2004-03-22 00:00:00	\N	\N		\N
2539	1536		\N	\N	\N		\N
2540	768	00 B 0013268	2000-07-03 00:00:00	\N	\N		\N
2541	1914		\N	\N	\N	000213120920957	\N
2542	1997	004122545 B 02	2002-08-11 00:00:00	\N	\N		\N
2543	1977	00 B 462579	2000-05-20 00:00:00	\N	\N		\N
2544	624	14/00 0422499 B02	2010-08-08 00:00:00	\N	\N		\N
2545	1270		\N	\N	\N		\N
2546	401	99 B 9021016	1999-08-22 00:00:00	\N	\N		\N
2547	536	09 B 0263853 13/00	2009-06-28 00:00:00	\N	\N		\N
2548	1319		\N	\N	\N		\N
2549	2220	99 B 9020735	1999-05-31 00:00:00	\N	\N	000420141019758	\N
2550	229	19/00 – 0082728 B 98	2022-01-20 00:00:00	\N	\N	099928010507136	\N
2551	2243	43/00 – 0322688 B 03	2019-03-17 00:00:00	\N	\N	002112058491131	\N
2552	2244	00 B 222682	2000-08-09 00:00:00	\N	\N	099630049001331	\N
2553	1851	07 b 0323119	2007-07-24 00:00:00	\N	\N	001216099109235	\N
2554	3007	08 B 0862993	2008-03-10 00:00:00	\N	\N		\N
2555	2483		\N	\N	\N		\N
2556	1010	99 B 722574	\N	\N	\N	098321010010161	\N
2557	1012		\N	\N	\N		\N
2558	487		\N	\N	\N		\N
2559	1498	13/00-0263211 B/ 04	2013-06-24 00:00:00	\N	\N		\N
2560	125	00 B 0142562	2000-09-25 00:00:00	\N	\N	099928056223146	\N
2561	126	98 B 0142069	2001-07-30 00:00:00	\N	\N		\N
2562	2128	01 B 0064114	2007-07-11 00:00:00	\N	\N	001835200008850	\N
2563	2231	04 B 0065902	2014-08-12 00:00:00	\N	\N		\N
2564	1318		\N	\N	\N		\N
2565	332	00 B 0363059	2000-11-11 00:00:00	\N	\N		\N
2566	660	31/00 – 0103850 B 99	2013-12-08 00:00:00	\N	\N		\N
2567	3301	06 B 0185348	\N	\N	\N	195027300006937	\N
2568	484	34/00-0462619 B 00	2009-12-22 00:00:00	\N	\N	099630049001331	\N
2569	138	19/00-0082980 B 99	2015-05-13 00:00:00	\N	\N		\N
2570	2974	07 B 0976630	2007-04-16 00:00:00	\N	\N		\N
2571	1178	01 B 0363197	2007-10-10 00:00:00	\N	\N		\N
2572	2942		\N	\N	\N	000116091487707	\N
2573	3177	98 A 02014247	1998-11-23 00:00:00	\N	\N		\N
2574	3178		\N	\N	\N		\N
2575	3179	02 A 0092640	2002-07-16 00:00:00	\N	\N	097916150010548000	\N
2576	3087		\N	\N	\N		\N
2577	496		\N	\N	\N		\N
2578	2452		\N	\N	\N		\N
2579	2453		\N	\N	\N		\N
2580	2454		\N	\N	\N		\N
2581	3085		\N	\N	\N	000119270257155	\N
2582	1008	02 B 0123159	\N	\N	\N	98316130011447	\N
2583	468		\N	\N	\N	98316130011447	\N
2584	1833		\N	\N	\N	0116001422534	\N
2585	3357		\N	\N	\N		\N
2586	1732		\N	\N	\N	0827069005443	\N
2587	3351	02 B 0861638	2002-06-23 00:00:00	\N	\N	000830019013355	\N
2588	5	98 B 282147	1998-09-09 00:00:00	\N	\N	000907024283698	\N
2589	6	99 B 0282417	1999-10-31 00:00:00	\N	\N	000907024283698	\N
2590	533	97 B 0082039 - 19/00	2017-05-14 00:00:00	\N	\N	000907024283698	\N
2591	2226		\N	\N	\N	00101101900156	\N
2592	1025		\N	\N	\N	000129010458552	\N
2593	333	25/00- 62751B99	2019-01-06 00:00:00	\N	\N	001022002350787	\N
2594	3736	16/00 – 0975778 B 07	2019-02-07 00:00:00	\N	\N		\N
2595	1397		\N	\N	\N	001505139001749	\N
2596	2190	98 B 0122277	2016-07-19 00:00:00	\N	\N		\N
2597	2191	00 B 0014030 16/00	2019-06-06 00:00:00	\N	\N		\N
2598	2192		\N	\N	\N		\N
2599	1998		\N	\N	\N	099234010248237	\N
2600	2284	01 B 0402777	2011-02-20 00:00:00	\N	\N		\N
2601	1548		\N	\N	\N		\N
2602	1546		\N	\N	\N		\N
2603	1120	09 B 0382747	2011-08-01 00:00:00	\N	\N	000816539059131	\N
2604	636		\N	\N	\N		\N
2605	637		\N	\N	\N		\N
2606	1007	97 B 0002291	2008-04-21 00:00:00	\N	\N		\N
2607	2113	99 B 0662288	\N	\N	\N	099016233300352	\N
2608	2085	99 B 102279	2000-08-15 00:00:00	\N	\N	099730040263234	\N
2609	510		\N	\N	\N		\N
2610	2677	05 B 0263312	2005-05-18 00:00:00	\N	\N		\N
2611	1772	07 B 0323066	2016-04-12 00:00:00	\N	\N		\N
2612	957		\N	\N	\N		\N
2613	3255	43/00-0323341 B 09	2012-04-03 00:00:00	\N	\N		\N
2614	3361	07 B 0562939	2007-07-15 00:00:00	\N	\N		\N
2615	4218	98 B 0262072	2016-02-08 00:00:00	\N	\N		\N
2616	3917	30/00 - 0124456 B 10	2011-10-16 00:00:00	\N	\N	000919008841995	\N
2617	1847		\N	\N	\N		\N
2618	3710		\N	\N	\N		\N
2619	4738	06 B 0322962	2022-03-20 00:00:00	\N	\N	00535200148552	\N
2620	2115	12/00-0583580 B 09	2009-12-16 00:00:00	\N	\N	099815010411441	\N
2621	2891	07 B 0087035	2017-02-22 00:00:00	\N	\N		\N
2622	1048		\N	\N	\N		\N
2623	4144	47/00-0862967 B 07	2016-02-02 00:00:00	\N	\N	00046084236631	\N
2624	449	42/00 - 0523589B08	2019-04-03 00:00:00	\N	\N		\N
2625	2774	02 B 0084241	2014-07-03 00:00:00	\N	\N		\N
2626	251	98 B 0322194	1998-12-15 00:00:00	\N	\N	002416210052850	\N
2627	2285	0223590 B 06	2006-08-08 00:00:00	\N	\N		\N
2628	3206	06 B 0263505 13/00	2012-09-03 00:00:00	\N	\N	00046084236631	\N
2629	1317	00 B 0022480	2000-08-09 00:00:00	\N	\N		\N
2630	402	98 B 5222229	2002-03-04 00:00:00	\N	\N		\N
2631	2749	28/00-0562726 B 04	2019-07-30 00:00:00	\N	\N		\N
2632	2557	05 B 0108232	\N	\N	\N		\N
2633	3356		\N	\N	\N		\N
2634	1663		\N	\N	\N	193225010006946	\N
2635	2458		\N	\N	\N	193225010006946	\N
2636	1435		\N	\N	\N		\N
2637	2184	07/00-0972222 B 05	2010-03-30 00:00:00	\N	\N		\N
2638	104		\N	\N	\N		\N
2639	1016	99 B 0010456	\N	\N	\N	001428179003443	\N
2640	3158	08 B 0742476	2013-03-25 00:00:00	\N	\N		\N
2641	3333		\N	\N	\N		\N
2642	1731		\N	\N	\N	001516560117646	\N
2643	1969	01 B 0014225	2001-02-12 00:00:00	\N	\N		\N
2644	2954	30/00 – 0969633 B 05	2014-12-28 00:00:00	\N	\N		\N
2645	452	99 B  0008495	\N	\N	\N		\N
2646	373	98 B 0242068	1998-06-25 00:00:00	\N	\N	001016209026351	\N
2647	375	99 B 0162143	2001-09-05 00:00:00	\N	\N		\N
2648	328	00 B 0362871	2000-02-09 00:00:00	\N	\N	000205459018345	\N
2649	1985		\N	\N	\N		\N
2650	377	43/00- 0322386 B 99	2019-03-28 00:00:00	\N	\N		\N
2651	137	97 B 0822002	1997-11-09 00:00:00	\N	\N		\N
2652	2711		\N	\N	\N		\N
2653	2142	98 B 162019	1998-03-17 00:00:00	\N	\N	0008190087605491002	\N
2654	2012	05/00-022264 B 98	2015-06-02 00:00:00	\N	\N	002211020270102	\N
2655	654	13/00-0263239 B 04	2019-01-10 00:00:00	\N	\N		\N
2656	3467	08 B 0422985	2008-05-12 00:00:00	\N	\N		\N
2657	2305	98 A 315957	1998-12-02 00:00:00	\N	\N		\N
2658	289	99 B 0062612	2003-05-31 00:00:00	\N	\N	001636219000840	\N
2659	2790		\N	\N	\N		\N
2660	2507	00 B 0582539	2000-11-11 00:00:00	\N	\N		\N
2661	2914		\N	\N	\N	099801010482922	\N
2662	361	29/00 0663371 B 10	2016-10-24 00:00:00	\N	\N		\N
2663	922		\N	\N	\N	0809039010157	\N
2664	2916	16/00-0404429B08	2015-12-09 00:00:00	\N	\N		\N
2665	3077		\N	\N	\N		\N
2666	2380	0882143 B 99	1999-03-06 00:00:00	\N	\N		\N
2667	1575		\N	\N	\N		\N
2668	1958		\N	\N	\N		\N
2669	1417		\N	\N	\N		\N
2670	1677		\N	\N	\N	00980101077962	\N
2671	2546	06 B 422655	2014-03-09 00:00:00	\N	\N		\N
2672	2638	99 B 0942308	1999-08-28 00:00:00	\N	\N	099113010279530	\N
2673	3006	28/00-0563033B08	2018-06-13 00:00:00	\N	\N		\N
2674	2861	12/00-0583459 B 09	2011-02-27 00:00:00	\N	\N		\N
2675	1461	22/00-99 B 2002256	2019-10-30 00:00:00	\N	\N		\N
2676	1766	99 B 62 660	\N	\N	\N		\N
2677	4197	21/00 0143015 B 04	2011-05-10 00:00:00	\N	\N		\N
2678	758	23/00-0363200 B 01	2008-09-01 00:00:00	\N	\N	000919159056136	\N
2679	2996	03 B 0962321	2003-09-21 00:00:00	\N	\N	000730149006546	\N
2680	992	99 B 0762453	1999-05-23 00:00:00	\N	\N	001414279000450	\N
2681	2995	0263812 B09	2009-04-14 00:00:00	\N	\N	001414279000450	\N
2682	2148	98 B 1020059	1998-06-22 00:00:00	\N	\N	130049005457	\N
2683	1687		\N	\N	\N	000129010458552	\N
2684	933		\N	\N	\N		\N
2685	934		\N	\N	\N		\N
2686	1220		\N	\N	\N	000409180317456	\N
2687	2382	06 B 0242701	2006-10-30 00:00:00	\N	\N		\N
2688	1992	16/00-0723535 B 02	2015-02-09 00:00:00	\N	\N	099917109004030	\N
2689	143	98 B 0802158	2014-08-04 00:00:00	\N	\N	000201010546860	\N
2690	144	0902173 B 98	2008-08-04 00:00:00	\N	\N		\N
2691	146		\N	\N	\N	000516010440857	\N
2692	1934		\N	\N	\N		\N
2693	1164	14/00 - 422756 B 05	2019-07-31 00:00:00	\N	\N		\N
2694	3108	16/00 - 0966314 B 04	2019-04-10 00:00:00	\N	\N		\N
2695	2997		\N	\N	\N		\N
2696	2414	00 B 0014362-16/00	2023-07-25 00:00:00	\N	\N		\N
2697	3219	08 B 0502603	2008-03-19 00:00:00	\N	\N		\N
2698	3106	21/00-0562636 B 03	2013-09-16 00:00:00	\N	\N		\N
2699	2461		\N	\N	\N		\N
2700	424		\N	\N	\N		\N
2701	1057		\N	\N	\N		\N
2702	2703	99 B 0562135	1999-03-14 00:00:00	\N	\N		\N
2703	2832	06 B 0263419	2006-02-26 00:00:00	\N	\N	000635010700956	\N
2704	2312		\N	\N	\N	000332010889054	\N
2705	1002	19/00-0086129 B 05	2016-01-03 00:00:00	\N	\N		\N
2706	1233	99 B 0402388	1999-10-17 00:00:00	\N	\N	099707220439621	\N
2707	1442		\N	\N	\N	001543080000171	\N
2708	1059		\N	\N	\N		\N
2709	3360	06 B 0562907	2020-10-20 00:00:00	\N	\N		\N
2710	181	23/00 - 0362718 B 99	2021-08-23 00:00:00	\N	\N		\N
2711	1294	99 B 0222444	1999-06-01 00:00:00	\N	\N		\N
2712	1955		\N	\N	\N	097916150010548000	\N
2713	1264	04 B 00885710 - 19/00	2021-06-20 00:00:00	\N	\N		\N
2714	1904		\N	\N	\N	000209189000256000	\N
2715	413	98 B 62216	2000-12-31 00:00:00	\N	\N		\N
2716	1962		\N	\N	\N		\N
2717	1963		\N	\N	\N	099913026221746	\N
2718	2249	02 B 0342553	2006-12-04 00:00:00	\N	\N		\N
2719	2946	29/00-0662474 B 01	2012-05-09 00:00:00	\N	\N		\N
2720	1987		\N	\N	\N	00016509042837	\N
2721	2613	19/00-0083908 B 07	2012-11-07 00:00:00	\N	\N	002143080008753	\N
2722	1370	00 B 0011144	\N	\N	\N	0009980052704	\N
2723	2456		\N	\N	\N	099734120496124	\N
2724	2584		\N	\N	\N		\N
2725	2018	99 B 0842154	2003-04-27 00:00:00	\N	\N		\N
2726	1159	20/00 - 0742257 B 02	2021-12-19 00:00:00	\N	\N	99702029060323	\N
2727	1036		\N	\N	\N	001312069009645	\N
2728	1293		\N	\N	\N		\N
2729	2932	06 B 0862879	2016-11-09 00:00:00	\N	\N	001519010045753	\N
2730	2936	06 B 0973546	2006-04-22 00:00:00	\N	\N		\N
2731	1915	03 B 0662774	2018-12-24 00:00:00	\N	\N	001039054324998	\N
2732	1753	09 B 0583468	2009-02-15 00:00:00	\N	\N		\N
2733	3245		\N	\N	\N		\N
2734	2766	0583216 B / 07	2007-01-22 00:00:00	\N	\N		\N
2735	4615		\N	\N	\N		\N
2736	2015	03 B 0862664	2019-05-26 00:00:00	\N	\N		\N
2737	388	98 B 0422056	1998-04-12 00:00:00	\N	\N		\N
2738	1827	05 B 0724339 -35/00	2023-06-25 00:00:00	\N	\N		\N
2739	3107	35/00-0725145 B 08	2015-03-09 00:00:00	\N	\N		\N
2740	225	98 B 0322123	2013-12-02 00:00:00	\N	\N		\N
2741	1113		\N	\N	\N		\N
2742	2246		\N	\N	\N		\N
2743	2634		\N	\N	\N		\N
2744	2762	06 B 0404217	2020-01-02 00:00:00	\N	\N	099830049178013	\N
2745	2763		\N	\N	\N		\N
2746	666	00 B 0302339 - 00/17	2022-12-27 00:00:00	\N	\N		\N
2747	1874	16/00-0008903 B 99	2016-11-08 00:00:00	\N	\N		\N
2748	667		\N	\N	\N		\N
2749	586		\N	\N	\N		\N
2750	318		\N	\N	\N	000428056269992	\N
2751	856	99 B 0242211 07/00	2012-09-13 00:00:00	\N	\N	099943032238667	\N
2752	859	43/00 – 0322400 B 00	2019-04-09 00:00:00	\N	\N		\N
2753	3311	99 B 0322350	2007-02-05 00:00:00	\N	\N		\N
2754	2750	98B0742051-20/00	2018-12-11 00:00:00	\N	\N	00016509042837	\N
2755	2975	05 B 0364022	2015-09-06 00:00:00	\N	\N	000512058306162	\N
2756	3029	98 B 0422114	2005-04-04 00:00:00	\N	\N		\N
2757	2589	98 B 0802356	2015-03-16 00:00:00	\N	\N		\N
2758	286	99 B 054 2256	\N	\N	\N		\N
2759	1736	98 B 0382102	2014-11-06 00:00:00	\N	\N		\N
2760	244		\N	\N	\N		\N
2761	2678	99 B 0722752	2006-03-14 00:00:00	\N	\N		\N
2762	2130	28/00-0562699 B 04	2016-02-21 00:00:00	\N	\N		\N
2763	489		\N	\N	\N		\N
2764	226	98 B 0322087	2016-12-13 00:00:00	\N	\N		\N
2765	3079		\N	\N	\N		\N
2766	1279		\N	\N	\N		\N
2767	2578		\N	\N	\N		\N
2768	88	06 B 0323030	2006-10-31 00:00:00	\N	\N	000204039004656	\N
2769	2722	99 B 0083265	2004-05-04 00:00:00	\N	\N		\N
2770	3537		\N	\N	\N		\N
2771	3656		\N	\N	\N		\N
2772	400	98 B 4020105	1998-09-23 00:00:00	\N	\N		\N
2773	357	01 B 0022539	2001-01-22 00:00:00	\N	\N		\N
2774	2245	04 B 0542650	2019-01-28 00:00:00	\N	\N	001043039007744	\N
2775	3430		\N	\N	\N		\N
2776	219	98  B 62186	\N	\N	\N		\N
2777	904		\N	\N	\N		\N
2778	864		\N	\N	\N		\N
2779	2854		\N	\N	\N		\N
2780	2477		\N	\N	\N		\N
2781	944		\N	\N	\N		\N
2782	1056		\N	\N	\N	000714019008745	\N
2783	339	99 B 462251- 34/00	2021-12-26 00:00:00	\N	\N		\N
2784	1929	29/00 0663074 B 05	2012-12-26 00:00:00	\N	\N	0219200275453	\N
2785	1637	28/00 - 0562489 B 02	2021-02-14 00:00:00	\N	\N		\N
2786	243	98 B 0822021	2014-10-01 00:00:00	\N	\N		\N
2787	1760	25/00-0066658 B 05	2009-12-23 00:00:00	\N	\N	000428039007055	\N
2788	1761		\N	\N	\N		\N
2789	1763	99 B 0382203	1999-08-25 00:00:00	\N	\N		\N
2790	2983	98 B 0242061 - 00/07	2021-03-10 00:00:00	\N	\N		\N
2791	1273		\N	\N	\N		\N
2792	230	00 B 0083947	2000-12-17 00:00:00	\N	\N		\N
2793	478		\N	\N	\N		\N
2794	3160	05 B 0066619	2005-09-05 00:00:00	\N	\N		\N
2795	3090	99 B 0009731	2013-07-21 00:00:00	\N	\N	0010143790002842	\N
2796	3091		\N	\N	\N		\N
2797	2553	05 B 0364133	2005-09-27 00:00:00	\N	\N	000731019023353	\N
2798	2943	02 B 462787	2012-10-08 00:00:00	\N	\N		\N
2799	2019		\N	\N	\N		\N
2800	2020	28/00 – 0562715 B 04	2015-08-25 00:00:00	\N	\N	001144029004256	\N
2801	2060	0086589 B 06	2009-01-21 00:00:00	\N	\N	001130080011079	\N
2802	2101	03 B 0142914	2003-11-09 00:00:00	\N	\N		\N
2803	759	01/0922825 B 01	2004-01-03 00:00:00	\N	\N		\N
2804	1555	99 B 0342138	2004-01-07 00:00:00	\N	\N	000516097094649	\N
2805	596	06/00 - 0185217 B 06	2019-07-15 00:00:00	\N	\N	000516097094649	\N
2806	706		\N	\N	\N	000516097094649	\N
2807	129	00 B 0142457	2000-02-13 00:00:00	\N	\N	000516097094649	\N
2808	365		\N	\N	\N		\N
2809	2545	2255996	\N	\N	\N		\N
2810	1358		\N	\N	\N		\N
2811	629		\N	\N	\N	001731011701645	\N
2812	2820		\N	\N	\N		\N
2813	1882		\N	\N	\N		\N
2814	4452		\N	\N	\N	001116098730253	\N
2815	4311	13 B 0622227	2013-06-12 00:00:00	\N	\N	000512058306162	\N
2816	238		\N	\N	\N		\N
2817	1529		\N	\N	\N		\N
2818	1476	30/00 - 0122112 B 98	2016-01-11 00:00:00	\N	\N	000130049005457	\N
2819	939	10/00 - 0282105 B 98	2023-06-18 00:00:00	\N	\N		\N
2820	2230	00/26 - 99 B 0342174	2008-06-15 00:00:00	\N	\N	12162190028460	\N
2821	3335		\N	\N	\N	000516230701953	\N
2822	3336		\N	\N	\N	000516230701953	\N
2823	3017	02 B 0462949	2006-05-02 00:00:00	\N	\N	000516230701953	\N
2824	3018	16/00 - 0966406 B 04	2019-06-20 00:00:00	\N	\N	000516230701953	\N
2825	830		\N	\N	\N	0139054238462	\N
2826	241	98 B 0662087	\N	\N	\N	000826019001257	\N
2827	505		\N	\N	\N		\N
2828	1927		\N	\N	\N		\N
2829	92	99 B 32843	1999-08-09 00:00:00	\N	\N		\N
2830	3518		\N	\N	\N		\N
2831	1671	98 B 0402040	2001-03-12 00:00:00	\N	\N		\N
2832	3362		\N	\N	\N		\N
2833	4181	15 B 0225165  -  00/05	2015-02-11 00:00:00	\N	\N		\N
2834	1738	02 B 0382402	2002-07-08 00:00:00	\N	\N		\N
2835	1610		\N	\N	\N		\N
2836	3175	00 B 0782267	2019-07-29 00:00:00	\N	\N	00016001436218	\N
2837	2433	16/00 - 0008903 B 99	2020-01-26 00:00:00	\N	\N	000201010546860	\N
2838	148	99 B 522445	1999-11-02 00:00:00	\N	\N	099707220439621	\N
2839	2779	06 B 0882527	2019-04-11 00:00:00	\N	\N		\N
2840	1567	02 B 0403122	2019-01-27 00:00:00	\N	\N		\N
2841	228	98 B 0082621	1998-10-07 00:00:00	\N	\N		\N
2842	3729	01 B 0582605	2001-09-12 00:00:00	\N	\N		\N
2843	1571	06 B 0067075	2016-02-25 00:00:00	\N	\N	000635010176746	\N
2844	3618		\N	\N	\N		\N
2845	576	31/00 - 0103624 B 99	2019-07-17 00:00:00	\N	\N		\N
2846	2021		\N	\N	\N	000439180722645	\N
2847	4277	12 B 0124704 00/30	2013-08-19 00:00:00	\N	\N		\N
2848	2992		\N	\N	\N	000428209000943	\N
2849	2921		\N	\N	\N	96905480003135	\N
2850	705		\N	\N	\N		\N
2851	1505	02 B 0262934	2002-09-08 00:00:00	\N	\N		\N
2852	1656	99 B 0442149	2012-07-02 00:00:00	\N	\N		\N
2853	1541	34/00-0185274 B 06	2016-01-20 00:00:00	\N	\N		\N
2854	3210	08 B 0978193	2008-08-18 00:00:00	\N	\N		\N
2855	979		\N	\N	\N		\N
2856	951	06 B0242651	2019-04-07 00:00:00	\N	\N	001105230004962	\N
2857	428	99 B 0542228	\N	\N	\N	001105230004962	\N
2858	461	01 B 0282596	2001-07-08 00:00:00	\N	\N	001105230004962	\N
2859	111	99 B 0322252	\N	\N	\N	001105230004962	\N
2860	1704	98 B 0803033	\N	\N	\N	001105230004962	\N
2861	2555		\N	\N	\N		\N
2862	1983		\N	\N	\N		\N
2863	2726		\N	\N	\N		\N
2864	2727		\N	\N	\N		\N
2865	2728	07 B 0523530	2008-01-15 00:00:00	\N	\N		\N
2866	48	29/00 - 0662245 B 99	2018-10-02 00:00:00	\N	\N		\N
2867	192	28/00-0242254 B 99	2018-05-07 00:00:00	\N	\N		\N
2868	2241	98 B 0502046	2013-02-11 00:00:00	\N	\N		\N
2869	4294	07/00-0242275 B 00	2009-10-14 00:00:00	\N	\N		\N
2870	2586	06 B 0583178	2006-07-18 00:00:00	\N	\N		\N
2871	831	05 B 0143093	2005-03-20 00:00:00	\N	\N		\N
2872	836		\N	\N	\N		\N
2873	837		\N	\N	\N		\N
2874	849		\N	\N	\N		\N
2875	390		\N	\N	\N		\N
2876	1869		\N	\N	\N		\N
2877	453	14/00-0422102 B 98	2011-03-03 00:00:00	\N	\N		\N
2878	3202	08 B 0842469	2008-07-12 00:00:00	\N	\N		\N
2879	1259		\N	\N	\N		\N
2880	1262		\N	\N	\N		\N
2881	862		\N	\N	\N		\N
2882	1173		\N	\N	\N	000216001756761	\N
2883	1175	07/00 0242629 B 05	2013-11-12 00:00:00	\N	\N	000705429010449	\N
2885	1728	43/00 0322743 B 03	2009-06-01 00:00:00	\N	\N		\N
2886	2771		\N	\N	\N		\N
2887	4261		\N	\N	\N		\N
2888	3581		\N	\N	\N	000332010889054	\N
2889	3584	09 B 0725337 - 35/00	2022-06-02 00:00:00	\N	\N	001515004982097	\N
2890	2061		\N	\N	\N		\N
2891	134	02 B 0222996	2007-10-30 00:00:00	\N	\N		\N
2892	135	45/00-0822166 B 02	2011-03-16 00:00:00	\N	\N		\N
2893	2818	98 B 0182576	1999-04-10 00:00:00	\N	\N	00519008635934	\N
2894	2298		\N	\N	\N		\N
2895	2654		\N	\N	\N	000531011028268	\N
2896	3205	25/00 - 0067783 B 08	2019-06-26 00:00:00	\N	\N	099830012211258	\N
2897	547		\N	\N	\N		\N
2898	2415	01 B 0662491	2021-12-28 00:00:00	\N	\N		\N
2899	369		\N	\N	\N		\N
2900	1994	99 B 462412	\N	\N	\N		\N
2901	3783	11 B 0988166	2011-07-07 00:00:00	\N	\N		\N
2902	2660		\N	\N	\N		\N
2903	2881	07 B 0162756	2007-06-27 00:00:00	\N	\N	001406510002662	\N
2904	1558	39/00 - 0542110 B 98	2019-01-06 00:00:00	\N	\N		\N
2905	3548		\N	\N	\N		\N
2906	2989		\N	\N	\N		\N
2907	1214	04 B 0107498	2012-08-07 00:00:00	\N	\N		\N
2908	1219		\N	\N	\N		\N
2909	2189	00 B 0063615 25/00	2022-03-03 00:00:00	\N	\N		\N
2910	627	26/00-0342167 B 99	2015-01-15 00:00:00	\N	\N	000406269019737	\N
2911	246	98 A 101126	1999-07-28 00:00:00	\N	\N		\N
2912	2430	37/00-0642009 B 98	2014-12-28 00:00:00	\N	\N		\N
2913	2011	99 B 0402360	2016-04-26 00:00:00	\N	\N		\N
2914	508	01 B 482538	2002-09-09 00:00:00	\N	\N		\N
2915	2962	04 B 0065822 - 25/00	2017-03-20 00:00:00	\N	\N		\N
2916	2740	03 B 0322734	2006-08-13 00:00:00	\N	\N	001043039007744	\N
2917	707		\N	\N	\N		\N
2918	1462	99 B 22329	1999-09-20 00:00:00	\N	\N	195004170156538	\N
2919	3040		\N	\N	\N	000712058323543	\N
2920	455	04 B 0322806	2009-09-23 00:00:00	\N	\N	000712058323543	\N
2921	1859	28/00-0562891 B 06	2011-06-05 00:00:00	\N	\N		\N
2922	416	10/00 – 0282933 B 04	2019-04-07 00:00:00	\N	\N		\N
2923	418		\N	\N	\N		\N
2924	2657		\N	\N	\N		\N
2925	2439	06 B 0463419	\N	\N	\N		\N
2926	1024		\N	\N	\N		\N
2927	1795		\N	\N	\N		\N
2928	1737		\N	\N	\N		\N
2929	414	15/00-0046597 B 07	2014-12-30 00:00:00	\N	\N	195725070030931	\N
2930	1199	18/00-0442149 B 99	2020-01-20 00:00:00	\N	\N		\N
2931	3746	07 B 0404291	2012-03-25 00:00:00	\N	\N	002205022650642	\N
2932	3747	03 B 0263100	2011-10-16 00:00:00	\N	\N		\N
2933	4141	30/00 - 0125365 B 16	2016-05-05 00:00:00	\N	\N	099730040640923	\N
2934	1683	99 B 0782009	\N	\N	\N	000116001566907	\N
2935	1841		\N	\N	\N		\N
2936	112		\N	\N	\N		\N
2937	732		\N	\N	\N		\N
2938	698		\N	\N	\N		\N
2939	2122		\N	\N	\N		\N
2940	1999	02 B 0084422	2006-03-14 00:00:00	\N	\N		\N
2941	1480		\N	\N	\N		\N
2942	1238		\N	\N	\N		\N
2943	753		\N	\N	\N	099128160126334	\N
2944	1332		\N	\N	\N		\N
2945	1299		\N	\N	\N		\N
2946	3064		\N	\N	\N		\N
2947	293	98 B 0182304	2003-08-26 00:00:00	\N	\N		\N
2948	295		\N	\N	\N		\N
2949	7	10/00 0282773 B 03	2009-02-22 00:00:00	\N	\N		\N
2950	516	93 B 750217	1993-11-30 00:00:00	\N	\N		\N
2951	4146		\N	\N	\N	001622002425091	\N
2952	4137	31/00-0109435 B 07	2020-02-20 00:00:00	\N	\N		\N
2953	1149		\N	\N	\N		\N
2954	3348	05 B 0086266	2012-03-19 00:00:00	\N	\N		\N
2955	2381	04 B 0162583	2004-03-16 00:00:00	\N	\N		\N
2956	543	02 B 0402964	2004-04-13 00:00:00	\N	\N	001216099109235	\N
2957	1418		\N	\N	\N		\N
2958	1722	99 B 0482244	2016-03-29 00:00:00	\N	\N	0615229008544	\N
2959	1047	03 B 0142883	\N	\N	\N	0615229008544	\N
2960	1645		\N	\N	\N		\N
2961	2576	04 B 0966047	2004-10-17 00:00:00	\N	\N	000327078243953	\N
2962	2478		\N	\N	\N		\N
2963	3247		\N	\N	\N	000231010573809	\N
2964	2340	18/00-0442954 B 09	2011-09-14 00:00:00	\N	\N		\N
2965	149	03 B 463023	\N	\N	\N	000321029007750	\N
2966	785	03 B 0782439	2013-03-10 00:00:00	\N	\N	099816130001344	\N
2967	789		\N	\N	\N		\N
2968	3386	19/00 - 0088419 B 09	2019-04-11 00:00:00	\N	\N		\N
2969	2067	19/00-0082991 B99	2018-10-15 00:00:00	\N	\N		\N
2970	4016	02 B 0882337	2002-05-22 00:00:00	\N	\N		\N
2971	4595		\N	\N	\N		\N
2972	4384	16/00 - 0970946 B 05	2021-02-01 00:00:00	\N	\N		\N
2973	4102	00 B 0602038  - 00/33	2016-12-09 00:00:00	\N	\N	001022002350787	\N
2974	3055	05 B 0108437	2005-12-18 00:00:00	\N	\N	001022002350787	\N
2975	3953	01/00 - 0882670 B 11	2014-02-10 00:00:00	\N	\N	001022002350787	\N
2976	3286	03 B 0562624	2003-04-23 00:00:00	\N	\N	099707220439621	\N
2977	3723	31/00 - 0102958 B 99	2023-07-31 00:00:00	\N	\N		\N
2978	4654		\N	\N	\N		\N
2979	4050	15 B 0405586	2015-04-28 00:00:00	\N	\N		\N
2980	3708		\N	\N	\N		\N
2981	3630		\N	\N	\N		\N
2982	3372	25/00 – 0067990 B 08	2015-09-14 00:00:00	\N	\N	25074074011	\N
2983	1781		\N	\N	\N	000516230701953	\N
2984	184	99 B 0022174	2015-03-22 00:00:00	\N	\N	000516230701953	\N
2985	150	97 B 0082044	1997-09-15 00:00:00	\N	\N	000516230701953	\N
2986	4130		\N	\N	\N	000516230701953	\N
2987	4453		\N	\N	\N		\N
2988	3427	03 B 0723902	2011-01-18 00:00:00	\N	\N		\N
2989	3428		\N	\N	\N		\N
2990	3048	16/00 – 0970380 B 05	2013-03-19 00:00:00	\N	\N		\N
2991	2700		\N	\N	\N	000128010703271	\N
2992	1796		\N	\N	\N		\N
2993	2294	16/00-0012818 B 00	2024-05-29 00:00:00	\N	\N		\N
2994	621		\N	\N	\N	099943032238667	\N
2995	623		\N	\N	\N		\N
2996	1995	99 B 9021016	1999-08-22 00:00:00	\N	\N		\N
2997	2105	16/00-0009594 B 99	2017-05-16 00:00:00	\N	\N		\N
2998	2108	0263515 B 07	2007-01-02 00:00:00	\N	\N		\N
2999	2111		\N	\N	\N		\N
3000	1949	00 B 0762936	2000-01-26 00:00:00	\N	\N	001039054324998	\N
3001	1209	34/00 - 0464837 B 14	2019-04-07 00:00:00	\N	\N	099913026247990	\N
3002	308	98 A 1011159	1998-08-15 00:00:00	\N	\N		\N
3003	2647	04 B 0804968	\N	\N	\N	748016274143	\N
3004	645		\N	\N	\N		\N
3005	2714	46/00 - 0842352 B 05	2019-04-29 00:00:00	\N	\N	099828056206312	\N
3006	2493	97 A 0810331	\N	\N	\N	099919008288302	\N
3007	37	99 B 5929	\N	\N	\N		\N
3008	2648	0502539 B 06	2006-02-05 00:00:00	\N	\N	099516120536822	\N
3009	45	29/00 - 0662364 B 00	2019-10-21 00:00:00	\N	\N	000230129009158	\N
3010	47		\N	\N	\N		\N
3011	704		\N	\N	\N		\N
3012	3657		\N	\N	\N		\N
3013	4793	16/00-0968770	2019-05-27 00:00:00	\N	\N		\N
3014	2784	04 B 0662995	2004-11-22 00:00:00	\N	\N	000512058306162	\N
3015	2525		\N	\N	\N		\N
3016	2550	05 B 0342836	2005-07-12 00:00:00	\N	\N		\N
3017	302	98 B 0202044	2001-10-03 00:00:00	\N	\N		\N
3018	1574		\N	\N	\N		\N
3019	372	93 B 0730030	\N	\N	\N		\N
3020	1301		\N	\N	\N		\N
3021	1303		\N	\N	\N		\N
3022	1426		\N	\N	\N	000216002013436	\N
3023	1599	98 B 462127	2000-11-22 00:00:00	\N	\N	099916000890340	\N
3024	1771	02 B 0084476	2002-03-31 00:00:00	\N	\N	099916000890340	\N
3025	208		\N	\N	\N		\N
3026	2062	14/00-0422978 B 08	2011-10-25 00:00:00	\N	\N		\N
3027	3545	02/00 - 0906249 B 10	2016-09-05 00:00:00	\N	\N		\N
3028	718		\N	\N	\N	00040401902894258	\N
3029	348	98 B 722 887	\N	\N	\N		\N
3030	2342		\N	\N	\N		\N
3031	3622		\N	\N	\N	09794710005835	\N
3032	774		\N	\N	\N		\N
3033	503	99 B 0562231 - 00/28	2015-12-31 00:00:00	\N	\N		\N
3034	2339	00 B 13258	\N	\N	\N	000234139022548	\N
3035	329	14/00-0423035 B 09	2009-04-04 00:00:00	\N	\N		\N
3036	330	99 B 0755357	1999-10-14 00:00:00	\N	\N		\N
3037	2437	07 B 0742453	2015-09-08 00:00:00	\N	\N		\N
3038	2097	04 B 0542684	\N	\N	\N	002031112359745	\N
3039	3223	99 B 0362754	2018-03-07 00:00:00	\N	\N		\N
3040	1459		\N	\N	\N		\N
3041	1275		\N	\N	\N		\N
3042	1277		\N	\N	\N		\N
3043	2462		\N	\N	\N		\N
3044	2419	12/00-0582040 B 98	2014-07-06 00:00:00	\N	\N	0819019050345	\N
3045	3082		\N	\N	\N		\N
3046	642		\N	\N	\N	99935072257842	\N
3047	1033	00 B 0242303	2005-12-14 00:00:00	\N	\N		\N
3048	1716	06 B- 29/01 0742425	2014-10-16 00:00:00	\N	\N		\N
3049	236		\N	\N	\N		\N
3050	1601		\N	\N	\N		\N
3051	404	07B.0422921	2021-09-21 00:00:00	\N	\N		\N
3052	886	04 B 0223307	2004-09-01 00:00:00	\N	\N		\N
3053	1984	99 B 0382173	2003-06-15 00:00:00	\N	\N	000516230701953	\N
3054	1552	34/00-0463149 B 04	2015-12-30 00:00:00	\N	\N	000516230701953	\N
3055	315	98 B 0702035	\N	\N	\N	000516230701953	\N
3056	955	99 B 632449	\N	\N	\N	000516230701953	\N
3057	4454		\N	\N	\N		\N
3058	205	98 B 0082471	2014-04-06 00:00:00	\N	\N		\N
3059	1342		\N	\N	\N		\N
3060	2645	98 B 0662126	2012-05-22 00:00:00	\N	\N		\N
3061	3565		\N	\N	\N		\N
3062	2608		\N	\N	\N	099846230110628	\N
3063	4391	35/00 - 0728012 B 18	2018-01-02 00:00:00	\N	\N		\N
3064	3139	26/00 – 0342854 B 05	2021-01-27 00:00:00	\N	\N		\N
3065	3369		\N	\N	\N		\N
3066	4612		\N	\N	\N		\N
3067	4023	07 B 0583235 - 12/00	2009-09-13 00:00:00	\N	\N		\N
3068	4094		\N	\N	\N	001144029004256	\N
3069	2514	02 B 0105702	2002-03-26 00:00:00	\N	\N		\N
3070	4782		\N	\N	\N		\N
3071	2472		\N	\N	\N		\N
3072	3268		\N	\N	\N		\N
3073	2118	04 B 0562760	2004-12-05 00:00:00	\N	\N		\N
3074	3692		\N	\N	\N	0107024238910	\N
3075	3363		\N	\N	\N	0107024238910	\N
3076	3550		\N	\N	\N		\N
3077	2034	99 B 0578774	1999-05-12 00:00:00	\N	\N		\N
3078	4772	39/00-0543804 B 15	2021-06-06 00:00:00	\N	\N	099916000775940	\N
3079	3218	41/01 – 0502560 B 06	2019-09-29 00:00:00	\N	\N		\N
3080	966	31/00 - 0103082 B 99	2021-10-25 00:00:00	\N	\N		\N
3081	971		\N	\N	\N		\N
3082	3096	16/00 - 0502492 B 04	2019-03-27 00:00:00	\N	\N		\N
3083	2165	05 B 0263389	2005-12-24 00:00:00	\N	\N		\N
3084	4196	22/00 0022549 B 01	2014-01-23 00:00:00	\N	\N		\N
3085	2865	0842427 B 07	2007-07-18 00:00:00	\N	\N		\N
3086	1830		\N	\N	\N		\N
3087	1508		\N	\N	\N		\N
3088	1252		\N	\N	\N		\N
3089	1979		\N	\N	\N		\N
3090	3566		\N	\N	\N		\N
3091	1925		\N	\N	\N	0021615099148	\N
3092	4456		\N	\N	\N		\N
3093	4355	11 B 0742551	2011-08-23 00:00:00	\N	\N		\N
3094	2205		\N	\N	\N		\N
3095	653		\N	\N	\N		\N
3096	656		\N	\N	\N		\N
3097	2863		\N	\N	\N		\N
3098	525	06 B 0502556	2006-08-09 00:00:00	\N	\N	00535200148552	\N
3099	490		\N	\N	\N		\N
3100	480	00 B 0522594	2000-09-03 00:00:00	\N	\N		\N
3101	3422	02 B 0562492	2002-02-25 00:00:00	\N	\N		\N
3102	3180		\N	\N	\N		\N
3103	2772		\N	\N	\N	001028110002178	\N
3104	2023		\N	\N	\N		\N
3105	2197	99 B 0262291 - 13/00	2021-09-27 00:00:00	\N	\N	000428039007055	\N
3106	2307		\N	\N	\N		\N
3107	1519	20/00-0742361B04	2017-10-11 00:00:00	\N	\N		\N
3108	1520		\N	\N	\N	000305022312462	\N
3109	470		\N	\N	\N		\N
3110	2064	95 B 0430264	1995-03-05 00:00:00	\N	\N		\N
3111	2069	0066712 B 06	2013-12-09 00:00:00	\N	\N		\N
3112	1223		\N	\N	\N		\N
3113	479		\N	\N	\N		\N
3114	2607		\N	\N	\N		\N
3115	2277	00 B 0662350	\N	\N	\N		\N
3116	2671	00 B 0322487	2012-12-30 00:00:00	\N	\N		\N
3117	652		\N	\N	\N		\N
3118	162	97 B 0282011	1997-08-31 00:00:00	\N	\N	000912010003278	\N
3119	2394	00 B 0402467	2000-02-07 00:00:00	\N	\N		\N
3120	1940		\N	\N	\N	000512030627364	\N
3121	669		\N	\N	\N		\N
3122	1257	02 B 0222940	2014-10-08 00:00:00	\N	\N		\N
3123	2426	08/00 - 0942299 B 99	2019-01-29 00:00:00	\N	\N		\N
3124	2308	25/00-0062961 B 99	2019-03-10 00:00:00	\N	\N		\N
3125	2642	0086777 B 06	2006-12-03 00:00:00	\N	\N		\N
3126	2643	19/00 – 0086659 B 06	2012-06-24 00:00:00	\N	\N		\N
3127	1196	31/00 – 0103222 B 99	2015-06-23 00:00:00	\N	\N		\N
3128	2068	98 B 0462066	2013-01-31 00:00:00	\N	\N	099719179257808	\N
3129	703		\N	\N	\N		\N
3130	2331	03 B 0723870	2022-05-31 00:00:00	\N	\N		\N
3131	4103	16 B 0584471 - 00/12	2016-05-08 00:00:00	\N	\N	099929010919127	\N
3132	3740	25/00 0067637 B 08	2015-05-24 00:00:00	\N	\N	099929010919127	\N
3133	3756	07/00-0242584 B 05	2012-03-14 00:00:00	\N	\N		\N
3134	3920	03 B 0085351	2012-03-04 00:00:00	\N	\N		\N
3135	4036	15 B 0225267	2015-09-02 00:00:00	\N	\N		\N
3136	3625		\N	\N	\N		\N
3137	4451		\N	\N	\N		\N
3138	4792		\N	\N	\N		\N
3139	1298	01 B 0282584	2001-07-17 00:00:00	\N	\N		\N
3140	1305	99 B 0082980	2009-10-20 00:00:00	\N	\N		\N
3141	1853		\N	\N	\N		\N
3142	380	0322787 B 04 43/00	2019-06-24 00:00:00	\N	\N	002416101989663	\N
3143	381		\N	\N	\N	000919159056136	\N
3144	1106		\N	\N	\N		\N
3145	1936		\N	\N	\N		\N
3146	1938		\N	\N	\N	001216500193643	\N
3147	3246	41/00 - 0502479 B 04	2019-02-21 00:00:00	\N	\N		\N
3148	2681	04 B 0968164	2004-11-03 00:00:00	\N	\N	000643032302677	\N
3149	2682	01 B 0015682	2004-06-01 00:00:00	\N	\N		\N
3150	2683	05 B 0364056 - 23/00	2023-06-19 00:00:00	\N	\N		\N
3151	231	99 B 0103401	2009-11-30 00:00:00	\N	\N	030801007762	\N
3152	287	99 B 0822073	2010-05-10 00:00:00	\N	\N		\N
3153	2286		\N	\N	\N	030801007762	\N
3154	317	94 B 750314	1974-07-24 00:00:00	\N	\N		\N
3155	2527	05 B 0968770	2016-04-19 00:00:00	\N	\N		\N
3156	2473		\N	\N	\N		\N
3157	1842		\N	\N	\N		\N
3158	1844	43/00-0323219 B 08	2018-02-01 00:00:00	\N	\N	099916000770512	\N
3159	1706	08 B 19/00-0087320	2014-04-21 00:00:00	\N	\N	099916000770512	\N
3160	2659		\N	\N	\N	001105239005747	\N
3161	2556	97 B 122023	1999-08-03 00:00:00	\N	\N		\N
3162	3312	00 B 0222718	2009-05-17 00:00:00	\N	\N		\N
3163	1401	22/00 – 0022103 B 98	2022-11-29 00:00:00	\N	\N		\N
3164	2182		\N	\N	\N		\N
3165	2183		\N	\N	\N	99843020244625	\N
3166	2281	28/00 - 0562063 B 98	2021-08-31 00:00:00	\N	\N		\N
3167	2972	02/00 - 0903675 B 00	2023-01-05 00:00:00	\N	\N		\N
3168	3661		\N	\N	\N		\N
3169	3181	44/00-0764192 B 09	2016-12-25 00:00:00	\N	\N		\N
3170	4446		\N	\N	\N		\N
3171	3690		\N	\N	\N		\N
3172	2562	07/00-0243621B17	2017-04-12 00:00:00	\N	\N		\N
3173	1811		\N	\N	\N	097213010012750	\N
3174	3075	19/00 – 0087909 B 08	2008-12-30 00:00:00	\N	\N	00001629002552	\N
3175	3076		\N	\N	\N		\N
3176	1295		\N	\N	\N		\N
3177	1352	13/00-0263136 B 04	2009-07-06 00:00:00	\N	\N		\N
3178	1353		\N	\N	\N		\N
3179	1313	99 B 63190	\N	\N	\N	00196905480003135	\N
3180	2925	04 B 0804724	2004-03-14 00:00:00	\N	\N	001232010001967	\N
3181	3677		\N	\N	\N	0999310110314929	\N
3182	4121		\N	\N	\N		\N
3183	1272		\N	\N	\N		\N
3184	2288	02/00-0904412 B03	2016-12-05 00:00:00	\N	\N		\N
3185	362	07 B 0323062	2007-02-18 00:00:00	\N	\N	09970430060242	\N
3186	127		\N	\N	\N		\N
3187	820		\N	\N	\N		\N
3188	822		\N	\N	\N		\N
3189	823		\N	\N	\N		\N
3190	1714		\N	\N	\N		\N
3191	1160	040232783 B 01	2005-11-27 00:00:00	\N	\N	000820074247695	\N
3192	2756		\N	\N	\N		\N
3193	443	26/00 - 0342550 B 02	2017-11-07 00:00:00	\N	\N		\N
3194	4189	16 B 0584485  00/12	2016-07-11 00:00:00	\N	\N		\N
3195	1492		\N	\N	\N		\N
3196	1894		\N	\N	\N	000913139009337	\N
3197	1402	99 B 0103521	1999-06-07 00:00:00	\N	\N		\N
3198	1403		\N	\N	\N	000507329005938	\N
3199	1404	00 B 0262523	2011-10-16 00:00:00	\N	\N		\N
3200	983		\N	\N	\N		\N
3201	567	98 B 582183	2002-12-29 00:00:00	\N	\N		\N
3202	2065	19/00 – 0085373 B 03	2008-07-07 00:00:00	\N	\N		\N
3203	557		\N	\N	\N		\N
3204	438		\N	\N	\N		\N
3205	3308	98 B 0942081	2006-08-06 00:00:00	\N	\N	00016001281818	\N
3206	1849	99 B 63194	\N	\N	\N	099931010331015	\N
3207	86	96 B 250408	1996-09-23 00:00:00	\N	\N		\N
3208	1247	41/00 – 0502232 B 99	2019-03-21 00:00:00	\N	\N		\N
3209	1251		\N	\N	\N	000927078303433	\N
3210	775		\N	\N	\N	000734300007766	\N
3211	1139		\N	\N	\N		\N
3212	117	98 B 0082490	2002-12-14 00:00:00	\N	\N	000631059013156	\N
3213	2056		\N	\N	\N		\N
3214	235	98 B 0322137	1998-08-01 00:00:00	\N	\N	099522010368821	\N
3215	1046		\N	\N	\N	000422002293886	\N
3216	2842	08 B 0563005	2017-07-23 00:00:00	\N	\N	000507019003653	\N
3217	2843	00 B 0723203	2007-01-27 00:00:00	\N	\N		\N
3218	3821	05 B 0583061 - 12/00	2022-10-03 00:00:00	\N	\N		\N
3219	3743	10 B 0224085	2010-01-12 00:00:00	\N	\N		\N
3220	3560		\N	\N	\N		\N
3221	3648		\N	\N	\N		\N
3222	2274	02 B 0422518	2002-05-27 00:00:00	\N	\N	09851101342	\N
3223	3667	10 B 0068575	2010-01-31 00:00:00	\N	\N		\N
3224	2590	0422920 B 07	2007-03-10 00:00:00	\N	\N		\N
3225	172	99 B 0482212	\N	\N	\N		\N
3226	296	14/00 - 0422909 B 07	2012-06-28 00:00:00	\N	\N	000306180551162	\N
3227	1705	07/00 - 0242389 B 01	2023-01-09 00:00:00	\N	\N	099517319030713	\N
3228	300		\N	\N	\N		\N
3229	2479		\N	\N	\N		\N
3230	1564	98 B 0122276	2015-10-06 00:00:00	\N	\N		\N
3231	4472		\N	\N	\N		\N
3232	1643	43/00 - 0322405 B 00	2020-12-08 00:00:00	\N	\N		\N
3233	2702	01 B 0017164	2005-08-01 00:00:00	\N	\N		\N
3234	871	02 B 0462856	2016-03-20 00:00:00	\N	\N		\N
3235	874		\N	\N	\N		\N
3236	875		\N	\N	\N	001101019000664	\N
3237	878		\N	\N	\N		\N
3238	77	06 B 0086624	2006-05-24 00:00:00	\N	\N		\N
3239	2242	16/00 - 0007759 B 99	2023-06-06 00:00:00	\N	\N		\N
3240	2198	02 B 0064871	2002-06-29 00:00:00	\N	\N		\N
3241	2795	97 B 0362031	2005-04-24 00:00:00	\N	\N		\N
3242	2441		\N	\N	\N		\N
3243	1020	06 B 0323004	2006-06-12 00:00:00	\N	\N		\N
3244	1739		\N	\N	\N		\N
3245	1612		\N	\N	\N		\N
3246	2651		\N	\N	\N		\N
3247	1821	05 B 0223448	2008-12-02 00:00:00	\N	\N		\N
3248	1709		\N	\N	\N		\N
3249	2597		\N	\N	\N		\N
3250	466		\N	\N	\N		\N
3251	195		\N	\N	\N		\N
3252	469		\N	\N	\N		\N
3253	2680	25/00 - 0063446 B 99	2019-12-08 00:00:00	\N	\N		\N
3254	1451		\N	\N	\N		\N
3255	1452		\N	\N	\N		\N
3256	1382	23/00 363611 B 03	2008-01-27 00:00:00	\N	\N		\N
3257	1140		\N	\N	\N	001302019005264	\N
3258	1210		\N	\N	\N	000520074237480	\N
3259	1573		\N	\N	\N	000816097699159	\N
3260	3212	08 B 0302847 17/00	2009-03-15 00:00:00	\N	\N		\N
3261	2915	02 B 0542420	2017-05-03 00:00:00	\N	\N	09861626000239	\N
3262	2031		\N	\N	\N	416096631415	\N
3263	334	43/00 – 0322424 B 00	2018-04-12 00:00:00	\N	\N		\N
3264	519	10 B 0264047	2011-02-14 00:00:00	\N	\N		\N
3265	2908	02 B 0018518 - 16/00	2012-12-26 00:00:00	\N	\N		\N
3266	552	99 B 222563	2008-06-09 00:00:00	\N	\N		\N
3267	3241	03B0322714 - 19/00	2015-08-23 00:00:00	\N	\N		\N
3268	3173	02 B 0403213	2002-12-22 00:00:00	\N	\N	001219010026367	\N
3269	465	09 B 0323346	2018-03-23 00:00:00	\N	\N	09991804421491200000	\N
3270	28	04 B 463130	2005-01-10 00:00:00	\N	\N		\N
3271	665		\N	\N	\N		\N
3272	3231	07/00 0242490 B 03	2023-06-01 00:00:00	\N	\N	099905022238141	\N
3273	2310		\N	\N	\N	09861626000239	\N
3274	570		\N	\N	\N		\N
3275	227	11/00-0202024B98	2023-07-16 00:00:00	\N	\N	001612030003277	\N
3276	1110	98 B 0102636	2015-11-11 00:00:00	\N	\N	001305010025373	\N
3277	194	99 B 0242224	2007-07-18 00:00:00	\N	\N		\N
3278	1609	06 B 0583181	2006-08-06 00:00:00	\N	\N	001636219000840	\N
3279	1326		\N	\N	\N	305022312462	\N
3280	1327		\N	\N	\N		\N
3281	1329		\N	\N	\N		\N
3282	1816		\N	\N	\N		\N
3283	2063		\N	\N	\N	000335072390289	\N
3284	2157		\N	\N	\N		\N
3285	346		\N	\N	\N		\N
3286	1406	12/00-0582626 B 01	2015-01-18 00:00:00	\N	\N	000416429042049	\N
3287	2406	02/ 0065410 B 03	2008-07-02 00:00:00	\N	\N		\N
3288	500	00 B 0302373	2011-04-03 00:00:00	\N	\N	001125006899572	\N
3289	2949	08/00 - 0942674 B 03	2019-07-29 00:00:00	\N	\N		\N
3290	766	13/00 0262970 B 02	2002-11-11 00:00:00	\N	\N		\N
3291	1320		\N	\N	\N	098202010003850	\N
3292	1839		\N	\N	\N		\N
3293	1759	25/00 - 0063874 B 00	2022-06-20 00:00:00	\N	\N		\N
3294	3782	06 B 0046311	2011-09-21 00:00:00	\N	\N	0001216099109235	\N
3295	3415	99 B 0722789	1999-09-22 00:00:00	\N	\N		\N
3296	4310	11 B 0365274	2016-07-20 00:00:00	\N	\N		\N
3297	1481	03 B 0963234	2013-04-17 00:00:00	\N	\N	000128010703271	\N
3298	495		\N	\N	\N		\N
3299	1699	00 B 0462519 00/34	2019-12-29 00:00:00	\N	\N		\N
3300	2862		\N	\N	\N	002345082254582	\N
3301	2239		\N	\N	\N		\N
3302	152	98 B 0622014	\N	\N	\N		\N
3303	1244		\N	\N	\N		\N
3304	901		\N	\N	\N		\N
3305	331	99 B 63060	1999-07-18 00:00:00	\N	\N		\N
3306	2738	06 B 0882516	2015-07-01 00:00:00	\N	\N		\N
3307	2739		\N	\N	\N		\N
3308	3010	08 B 0185789	2017-08-13 00:00:00	\N	\N		\N
3309	391		\N	\N	\N		\N
3310	1887		\N	\N	\N		\N
3311	14	97 B 462027	\N	\N	\N		\N
3312	17	90 B 0004	1993-08-04 00:00:00	\N	\N	0816539059131	\N
3313	54	0463440 B 06	2006-04-02 00:00:00	\N	\N		\N
3314	139	01 B 0084225 - 19/00	2023-03-12 00:00:00	\N	\N	00081609789548	\N
3315	140	98 B 0882013	1998-01-06 00:00:00	\N	\N		\N
3316	34		\N	\N	\N	001515004994728	\N
3317	197	44/00-0764084B07	2011-11-09 00:00:00	\N	\N	000615229008544	\N
3318	1779	02 B 64781	2011-10-10 00:00:00	\N	\N	000615229008544	\N
3319	179	21/00-0142577 B 00	2008-11-16 00:00:00	\N	\N	000234046285636	\N
3320	1831	04 B 0964049	2023-01-26 00:00:00	\N	\N		\N
3321	121		\N	\N	\N		\N
3322	2474		\N	\N	\N		\N
3323	2475		\N	\N	\N	001423010012669	\N
3324	2476		\N	\N	\N	089828270504816	\N
3325	3655	05 B 0066378	2007-01-24 00:00:00	\N	\N	089828270504816	\N
3326	2952	05 B 0805385	2016-06-23 00:00:00	\N	\N		\N
3327	605		\N	\N	\N		\N
3328	234		\N	\N	\N	000424019002556	\N
3329	1976		\N	\N	\N		\N
3330	1430	0263479 B 06	2006-07-28 00:00:00	\N	\N		\N
3331	433	31/00-0102543 B 98	2014-10-15 00:00:00	\N	\N		\N
3332	434	01 B 0105340	2014-06-15 00:00:00	\N	\N	194805330104445	\N
3333	3063	98 B 0582037	2000-05-16 00:00:00	\N	\N	001031010030965	\N
3334	2610	05 B 0404170	2015-12-15 00:00:00	\N	\N		\N
3335	902		\N	\N	\N		\N
3336	962		\N	\N	\N		\N
3337	1583		\N	\N	\N		\N
3338	35		\N	\N	\N		\N
3339	378		\N	\N	\N		\N
3340	2356		\N	\N	\N		\N
3341	1935		\N	\N	\N		\N
3342	1700	03 B 0020395	2015-04-05 00:00:00	\N	\N	00021014256287	\N
3343	444	00 B 63 968	\N	\N	\N		\N
3344	1786		\N	\N	\N		\N
3345	3159	19/00-0086636 B06	2019-05-28 00:00:00	\N	\N		\N
3346	1551		\N	\N	\N	000809039010157	\N
3347	554	02 B 0742301	2002-12-29 00:00:00	\N	\N		\N
3348	695	02 B 0382387	2002-04-02 00:00:00	\N	\N	097016010022061	\N
3349	360	07 B 0263600 B07	2019-01-16 00:00:00	\N	\N		\N
3350	113		\N	\N	\N		\N
3351	422		\N	\N	\N		\N
3352	3670	09 B 0263826	2009-05-02 00:00:00	\N	\N		\N
3353	2860	05 B 0502528	2006-05-17 00:00:00	\N	\N		\N
3354	2385	06 B 0342879	2006-04-12 00:00:00	\N	\N		\N
3355	734		\N	\N	\N		\N
3356	1628	12 B 0264384	2023-12-19 00:00:00	\N	\N		\N
3357	1817	99 B 0183167	2007-10-16 00:00:00	\N	\N		\N
3358	3355	28/00 0563164 B 10	2017-08-15 00:00:00	\N	\N		\N
3359	2212		\N	\N	\N		\N
3360	3043	35/00-0722578 B 99	2024-01-10 00:00:00	\N	\N		\N
3361	2757	00B0183256-00-06	2012-11-26 00:00:00	\N	\N		\N
3362	2758		\N	\N	\N		\N
3363	1789		\N	\N	\N		\N
3364	598	0105350 B01	2001-10-21 00:00:00	\N	\N		\N
3365	602		\N	\N	\N		\N
3366	353	98 B 000462170	2011-07-12 00:00:00	\N	\N		\N
3367	725		\N	\N	\N		\N
3368	2723		\N	\N	\N		\N
3369	136	45/00-0822375 B13	2013-12-19 00:00:00	\N	\N		\N
3370	3001	07 B 0905740	2009-09-10 00:00:00	\N	\N		\N
3371	3042	08 B 0223779	2012-06-30 00:00:00	\N	\N		\N
3372	3320	98 B 0382055	2008-03-31 00:00:00	\N	\N		\N
3373	3323	07 B 0663164	2016-12-06 00:00:00	\N	\N	002104200003181	\N
3374	1511		\N	\N	\N		\N
3375	1030		\N	\N	\N	001330012486618	\N
3376	572	98 B 0102468	2007-06-11 00:00:00	\N	\N	0003350723390289	\N
3377	420	00 B 0903674	2000-08-20 00:00:00	\N	\N	099843080238813	\N
3378	539	01 B 64285	\N	\N	\N		\N
3379	3093		\N	\N	\N	000834046379768	\N
3380	364	98 B 122383	\N	\N	\N		\N
3381	1991	21/00-0142070 B 98	2013-02-12 00:00:00	\N	\N		\N
3382	702	040384 B02	2010-04-15 00:00:00	\N	\N		\N
3383	2998	99 B 0122502	2008-10-28 00:00:00	\N	\N		\N
3384	3564		\N	\N	\N	001915104709564	\N
3385	427	25/00-0062862 B 99	\N	\N	\N		\N
3386	1912	30/00-0122237 B 98	2024-08-18 00:00:00	\N	\N		\N
3387	1109		\N	\N	\N		\N
3388	1112		\N	\N	\N		\N
3389	2349		\N	\N	\N	000816180063352	\N
3390	1589		\N	\N	\N	000816180063352	\N
3391	2353	01 B 17908	\N	\N	\N		\N
3392	2338	99 B 0282416	2019-04-15 00:00:00	\N	\N		\N
3393	343	98 B 0322204	1998-12-30 00:00:00	\N	\N		\N
3394	344	99 B 0922458	1999-03-30 00:00:00	\N	\N		\N
3395	1373	99 B 63446	\N	\N	\N		\N
3396	2666	05 B 0404159	2014-07-31 00:00:00	\N	\N		\N
3397	1788		\N	\N	\N		\N
3398	4317	01/00-0882675 B 11	2012-06-19 00:00:00	\N	\N	000516019029057	\N
3399	1545		\N	\N	\N		\N
3400	1268	98 B 22149	1998-11-30 00:00:00	\N	\N		\N
3401	3259		\N	\N	\N		\N
3402	3002		\N	\N	\N		\N
3403	1931	31/00 - 0742013 B 98	2019-07-02 00:00:00	\N	\N		\N
3404	1395		\N	\N	\N		\N
3405	2548		\N	\N	\N		\N
3406	4578		\N	\N	\N	001028010001475	\N
3407	1870		\N	\N	\N		\N
3408	1975	00 B 0013087	2018-12-02 00:00:00	\N	\N		\N
3409	1688		\N	\N	\N	9990109016811	\N
3410	52	98 B 0542138	\N	\N	\N		\N
3411	1004		\N	\N	\N	00021300952198	\N
3412	367	09 B 0382773	2022-03-08 00:00:00	\N	\N		\N
3413	2232		\N	\N	\N		\N
3414	1611		\N	\N	\N	002435100025853	\N
3415	658		\N	\N	\N		\N
3416	661	38/01-0342265 B 99	2011-07-20 00:00:00	\N	\N		\N
3417	2443	16/00 – 0822113 B 00	2019-03-04 00:00:00	\N	\N		\N
3418	799		\N	\N	\N		\N
3419	808	99 B 0862392 - 47/00	2022-08-15 00:00:00	\N	\N	001022290001959	\N
3420	809		\N	\N	\N	099830049183902	\N
3421	815		\N	\N	\N	195338010012938	\N
3422	1362	99 B 0103310 31/00	2020-07-09 00:00:00	\N	\N	195338010012938	\N
3423	999	16/00 - 0723061 B 00	2022-03-30 00:00:00	\N	\N	195338010012938	\N
3424	2879		\N	\N	\N	195338010012938	\N
3425	3859	37/00 - 0642172 B 12	2021-05-10 00:00:00	\N	\N	001013026409289	\N
3426	4520		\N	\N	\N		\N
3427	4407	19/00 - 0092319 B 16	2017-02-08 00:00:00	\N	\N		\N
3428	3946	04 B 0966047 - 16/00	2021-12-20 00:00:00	\N	\N		\N
3429	4505		\N	\N	\N		\N
3430	2022		\N	\N	\N	000234279016050	\N
3431	1065	26/00-0342159 B 99	2023-07-26 00:00:00	\N	\N		\N
3432	3748	02 B 0222915	2016-08-15 00:00:00	\N	\N		\N
3433	3617		\N	\N	\N		\N
3434	4455		\N	\N	\N		\N
3435	3552		\N	\N	\N		\N
3436	2078	03 B 0223124-05/00	2024-07-03 00:00:00	\N	\N		\N
3437	2079		\N	\N	\N		\N
3438	4640		\N	\N	\N	099604250149819	\N
3439	4624		\N	\N	\N		\N
3440	3365		\N	\N	\N		\N
3441	3452	19/00-0088510 B 10	2015-05-20 00:00:00	\N	\N		\N
3442	2733	02/00-0905799 B 08	2017-01-05 00:00:00	\N	\N		\N
3443	2188	28/00 0562757 B 04	2019-10-20 00:00:00	\N	\N		\N
3444	3955	16/00 - 0989309 b 14	2018-12-05 00:00:00	\N	\N	96905480003135	\N
3445	3078		\N	\N	\N		\N
3446	2161	08 B.0502609	2008-05-18 00:00:00	\N	\N		\N
3447	3619		\N	\N	\N	098541010010645	\N
3448	3663		\N	\N	\N		\N
3449	2522	99 B 0082892	2014-04-23 00:00:00	\N	\N	098909150012635	\N
3450	2166	06 B 0263453	2006-05-30 00:00:00	\N	\N		\N
3451	1399	43/00-0322796 B 04	2016-02-16 00:00:00	\N	\N		\N
3452	611		\N	\N	\N		\N
3453	2518		\N	\N	\N		\N
3454	359	99 B 482292	\N	\N	\N		\N
3455	2686	43/00 - 0323011 B 06	2017-06-04 00:00:00	\N	\N		\N
3456	1383	06 B 0322962	2022-03-20 00:00:00	\N	\N	001443030005662	\N
3457	1297		\N	\N	\N	001443030005662	\N
3458	560		\N	\N	\N		\N
3459	1826		\N	\N	\N		\N
3460	2922		\N	\N	\N		\N
3461	1517	97 B 0302012	1997-10-12 00:00:00	\N	\N		\N
3462	3230	05/00-0223862 B 08	2016-12-21 00:00:00	\N	\N		\N
3463	1805		\N	\N	\N		\N
3464	2321	01 B 0662511	2010-06-22 00:00:00	\N	\N		\N
3465	271		\N	\N	\N		\N
3466	2596	97 B 0002440	2004-03-15 00:00:00	\N	\N		\N
3467	4051	04/00 - 0405672 B 16	2016-01-12 00:00:00	\N	\N		\N
3468	3682		\N	\N	\N	000013026265323	\N
3469	4799	21 B 0622353	2021-08-02 00:00:00	\N	\N		\N
3470	2582		\N	\N	\N		\N
3471	4033	07/00 - 0242811 B 08	2020-01-30 00:00:00	\N	\N		\N
3472	3567		\N	\N	\N	000002090367534	\N
3473	3130	00 B 0011642	2006-06-25 00:00:00	\N	\N	198512030108541	\N
3474	3899	01 B 0123001	2013-05-14 00:00:00	\N	\N		\N
3475	2621	98 B 0102744	1998-12-02 00:00:00	\N	\N		\N
3476	4433		\N	\N	\N		\N
3477	3441		\N	\N	\N		\N
3478	3442	0563158 B10	2010-01-11 00:00:00	\N	\N		\N
3479	3865	30/00 0124364 B 10	2011-06-15 00:00:00	\N	\N		\N
3480	4280		\N	\N	\N		\N
3481	4625	56/00-061260 21	\N	\N	\N		\N
3482	783		\N	\N	\N		\N
3483	4471		\N	\N	\N		\N
3484	1143		\N	\N	\N		\N
3485	464	06 B 0322975	2006-03-31 00:00:00	\N	\N		\N
3486	1946		\N	\N	\N		\N
3487	185		\N	\N	\N	000016001127673	\N
3488	187	02 B 0662616	2012-02-19 00:00:00	\N	\N		\N
3489	563		\N	\N	\N	000503092312976	\N
3490	1900		\N	\N	\N	000503092312976	\N
3491	1878		\N	\N	\N	000503092312976	\N
3492	708		\N	\N	\N		\N
3493	1873		\N	\N	\N		\N
3494	585		\N	\N	\N		\N
3495	643		\N	\N	\N		\N
3496	3576		\N	\N	\N		\N
3497	409		\N	\N	\N		\N
3498	410		\N	\N	\N		\N
3499	411	00 B 0582529	2005-12-25 00:00:00	\N	\N		\N
3500	25		\N	\N	\N		\N
3501	1592		\N	\N	\N		\N
3502	1598	99 B 43320	1999-08-04 00:00:00	\N	\N	000047100161656	\N
3503	2470		\N	\N	\N		\N
3504	1658		\N	\N	\N		\N
3505	1659		\N	\N	\N		\N
3506	472	00 B 22417	2000-03-08 00:00:00	\N	\N	000615340242064	\N
3507	2293	99 B 0302166	1999-01-26 00:00:00	\N	\N	000420030003842	\N
3508	3595		\N	\N	\N		\N
3509	3665		\N	\N	\N		\N
3510	1723		\N	\N	\N		\N
3511	1726		\N	\N	\N	000731010943515	\N
3512	1330		\N	\N	\N		\N
3513	3568	00 B 0662346	2010-04-19 00:00:00	\N	\N		\N
3514	3841	09 B 0543213	2019-03-10 00:00:00	\N	\N	000328056262522	\N
3515	2777	06 B 0923198	2016-05-12 00:00:00	\N	\N		\N
3516	3283	03/00 – 0922064 B 97	2008-04-15 00:00:00	\N	\N		\N
3517	1642		\N	\N	\N	000339019006154	\N
3518	220	99 B 0402276	2012-11-25 00:00:00	\N	\N		\N
3519	1838		\N	\N	\N		\N
3520	266		\N	\N	\N		\N
3521	268		\N	\N	\N		\N
3522	2405	98 B 0142069 - 21/00	2023-04-05 00:00:00	\N	\N		\N
3523	2007	99 B 032235	2014-09-10 00:00:00	\N	\N		\N
3524	2008		\N	\N	\N		\N
3525	3331		\N	\N	\N		\N
3526	2355	02 B 0422554	2002-09-25 00:00:00	\N	\N		\N
3527	2326	046421B 06	2006-10-30 00:00:00	\N	\N		\N
3528	1168	97 B 0322019 43/00	2017-01-23 00:00:00	\N	\N		\N
3529	1325		\N	\N	\N		\N
3530	776	19/00 - 0084275 B 02	2018-03-05 00:00:00	\N	\N		\N
3531	4143	00 B 722946	2013-04-15 00:00:00	\N	\N	001030130012082	\N
3532	743		\N	\N	\N		\N
3533	647		\N	\N	\N		\N
3534	648		\N	\N	\N		\N
3535	3244		\N	\N	\N		\N
3536	2046	31/00-0104143 B 00	2021-04-01 00:00:00	\N	\N		\N
3537	2845	0702357B07	2019-07-31 00:00:00	\N	\N		\N
3538	2846		\N	\N	\N		\N
3539	2005		\N	\N	\N		\N
3540	735	12/00-0582096 B 98	2019-01-09 00:00:00	\N	\N		\N
3541	189	00 B 00138840	2000-09-13 00:00:00	\N	\N		\N
3542	3991	35/00 - 0722486 B 99	2024-02-25 00:00:00	\N	\N		\N
3543	1156	99 B 0062921	2010-04-15 00:00:00	\N	\N		\N
3544	3423		\N	\N	\N		\N
3545	2605		\N	\N	\N	000723039002454	\N
3546	3978	01/00-0882749 B 13	2013-02-11 00:00:00	\N	\N		\N
3547	3979		\N	\N	\N		\N
3548	4435		\N	\N	\N		\N
3549	4516		\N	\N	\N		\N
3550	3930	00 B 0011276	2012-06-25 00:00:00	\N	\N		\N
3551	312		\N	\N	\N		\N
3552	1389		\N	\N	\N		\N
3553	2311	99 B 0402394	2006-03-05 00:00:00	\N	\N		\N
3554	550		\N	\N	\N		\N
3555	3229	09 B 0223952 05/00	2019-03-25 00:00:00	\N	\N		\N
3556	1392	0682123 B 98	2007-06-19 00:00:00	\N	\N		\N
3557	4287	17 B 0050660 03/00	2015-01-15 00:00:00	\N	\N		\N
3558	3685		\N	\N	\N		\N
3559	1650	03 B 0022890	2003-10-28 00:00:00	\N	\N		\N
3560	4004		\N	\N	\N		\N
3561	3707	25/00 0068877 B 10	2010-12-01 00:00:00	\N	\N		\N
3562	4460		\N	\N	\N		\N
3563	4461		\N	\N	\N		\N
3564	4462		\N	\N	\N		\N
3565	3420		\N	\N	\N		\N
3566	1808		\N	\N	\N	001619010030759	\N
3567	4644		\N	\N	\N		\N
3568	4574		\N	\N	\N		\N
3569	4575		\N	\N	\N		\N
3570	2920	05 B 0263305	\N	\N	\N		\N
3571	2735	06 B 0502565	2014-01-12 00:00:00	\N	\N		\N
3572	4087		\N	\N	\N		\N
3573	4409	18 B 0503066	\N	\N	\N	00513026486112	\N
3574	3804	0997282 B 15	2017-12-20 00:00:00	\N	\N		\N
3575	4417	25/00 0064024	2019-09-18 00:00:00	\N	\N		\N
3576	4689	 N° 16/00-1047095 B19	2019-05-08 00:00:00	\N	\N		\N
3577	4690		\N	\N	\N	001705022566049	\N
3578	4619		\N	\N	\N		\N
3579	3586		\N	\N	\N		\N
3580	3973	11B 0882675 - 00/10	\N	\N	\N		\N
3581	3041		\N	\N	\N		\N
3582	3919	12/00-0582043 B98	2014-11-26 00:00:00	\N	\N		\N
3583	3510		\N	\N	\N		\N
3584	3511		\N	\N	\N		\N
3585	3036	07 B 0242753	2007-10-29 00:00:00	\N	\N	0001029019005451	\N
3586	3431		\N	\N	\N	00427030853350	\N
3587	3432	0403854 B 04	2004-07-26 00:00:00	\N	\N	00427030853350	\N
3588	1504	24/00 - 0382620 B 06	2014-05-04 00:00:00	\N	\N		\N
3589	4725	04/00-0406184 B20	2020-01-20 00:00:00	\N	\N	001716210123853	\N
3590	4410	40/00 0483191 B 19	2019-07-03 00:00:00	\N	\N	000916098356847	\N
3591	4305	16/00-0963234  B/ 03	2013-04-17 00:00:00	\N	\N		\N
3592	3127		\N	\N	\N		\N
3593	2664	16/00-0978241 B 08	2016-06-01 00:00:00	\N	\N		\N
3594	3406	23/00-0364973 B09	2010-03-31 00:00:00	\N	\N		\N
3595	3936	08 B 0087312	2011-04-05 00:00:00	\N	\N		\N
3596	1438		\N	\N	\N		\N
3597	1440		\N	\N	\N		\N
3598	2709	99 B 0430599	\N	\N	\N	1101012889	\N
3599	3046	06 B 0542905	2019-06-10 00:00:00	\N	\N		\N
3600	4184	13 B 0482915 - 00/40	2013-04-11 00:00:00	\N	\N		\N
3601	4186	12 B 0089833 - 19/00	2016-06-20 00:00:00	\N	\N	002031112359745	\N
3602	4187	43/00-0323119 B 07	2016-05-02 00:00:00	\N	\N		\N
3603	4188		\N	\N	\N	001505139001749	\N
3604	2926	99 B 0502209	2005-05-03 00:00:00	\N	\N		\N
3605	2951	06 B 0942852	2014-04-28 00:00:00	\N	\N		\N
3606	1777	99 B 63309	\N	\N	\N		\N
3607	553		\N	\N	\N		\N
3608	1947		\N	\N	\N		\N
3609	275	98 B 0582141	2008-06-07 00:00:00	\N	\N		\N
3610	276		\N	\N	\N		\N
3611	277	02 B 0022760 – 22/00	2019-02-12 00:00:00	\N	\N		\N
3612	282		\N	\N	\N	002228130003073	\N
3613	3050	99 B 62997	1999-06-16 00:00:00	\N	\N	000514019002857	\N
3614	3593		\N	\N	\N	000025010076853	\N
3615	3660	00 B 0662350	2009-06-13 00:00:00	\N	\N		\N
3616	3168	06 B 0971791	2006-05-30 00:00:00	\N	\N	000712010000381	\N
3617	861		\N	\N	\N		\N
3618	1171	02 B 0582757	2018-07-09 00:00:00	\N	\N		\N
3619	3734	22/00-0022149 B 98	2020-01-07 00:00:00	\N	\N	000334010013080	\N
3620	83		\N	\N	\N		\N
3621	2653	00 B 0012999	2020-06-16 00:00:00	\N	\N	099828270504816	\N
3622	2687		\N	\N	\N	099828270504816	\N
3623	1868		\N	\N	\N	000516096944826	\N
3624	13	99 B 462300	\N	\N	\N		\N
3625	204	97 B 0702006	\N	\N	\N		\N
3626	3262		\N	\N	\N		\N
3627	3504		\N	\N	\N		\N
3628	3035	06 B 0046311-11/00	2019-04-10 00:00:00	\N	\N	000441019001262	\N
3629	4719	19/00 - 0091932 B 15	2022-01-31 00:00:00	\N	\N		\N
3630	3551		\N	\N	\N		\N
3631	4620		\N	\N	\N		\N
3632	4531	N°  28/00 - 0563164 B 10	2017-08-15 00:00:00	\N	\N		\N
3633	4506		\N	\N	\N		\N
3634	4507		\N	\N	\N		\N
3635	4621		\N	\N	\N		\N
3636	4515		\N	\N	\N		\N
3637	3637	06 B 023114	2006-02-20 00:00:00	\N	\N		\N
3638	212	98 B 0062300	2008-10-13 00:00:00	\N	\N		\N
3639	4295	0682812 B/ 09	2014-11-12 00:00:00	\N	\N		\N
3640	4688	N° 16/00 - 1044215 B15	2018-04-24 00:00:00	\N	\N		\N
3641	4745		\N	\N	\N		\N
3642	4746		\N	\N	\N		\N
3643	3705	03 B 0065264	2008-07-30 00:00:00	\N	\N	97020204800433	\N
3644	1390		\N	\N	\N		\N
3645	3697		\N	\N	\N		\N
3646	3523	22/00 - 0023507 B 10	2019-02-14 00:00:00	\N	\N	001112219004849	\N
3647	3931	04/00-0404922 b 11	2016-10-24 00:00:00	\N	\N		\N
3648	3613		\N	\N	\N		\N
3649	3597		\N	\N	\N		\N
3650	3686		\N	\N	\N		\N
3651	4361	07B-0975427-16/00	2018-10-09 00:00:00	\N	\N	098221010004445	\N
3652	4275	16/00-0124704 B 12	2023-12-25 00:00:00	\N	\N		\N
3653	3948	14 B 0994552	2014-02-09 00:00:00	\N	\N		\N
3654	3822	13 B 0090266	2013-01-23 00:00:00	\N	\N		\N
3655	2213		\N	\N	\N	99805180720724	\N
3656	2178		\N	\N	\N		\N
3657	2179	98 B 402028	2013-04-07 00:00:00	\N	\N		\N
3658	211	99 B 262479	1999-10-26 00:00:00	\N	\N		\N
3659	3291		\N	\N	\N	707024272108	\N
3660	4276	12 B 0124704	2013-08-19 00:00:00	\N	\N		\N
3661	3562		\N	\N	\N		\N
3662	3959	0105738 B 02	2014-04-30 00:00:00	\N	\N		\N
3663	3849	19/00 - 0084184 B 01	2016-12-21 00:00:00	\N	\N		\N
3664	4783		\N	\N	\N		\N
3665	4784		\N	\N	\N		\N
3666	3742	07 B 0583235	2009-09-13 00:00:00	\N	\N		\N
3667	3517		\N	\N	\N		\N
3668	4300	31/00-0107108 B 04	2014-05-06 00:00:00	\N	\N		\N
3669	3879	34/00 - 048701 B 12	2018-10-11 00:00:00	\N	\N		\N
3670	3866	12/00-0583291 B 07	2014-12-15 00:00:00	\N	\N		\N
3671	4572		\N	\N	\N		\N
3672	4573		\N	\N	\N		\N
3673	3975	13/00-0264921 B 15	2015-12-17 00:00:00	\N	\N		\N
3674	4517		\N	\N	\N	00151404279001154	\N
3675	4518		\N	\N	\N		\N
3676	3827	31/00-0114244 B 13	2017-12-28 00:00:00	\N	\N		\N
3677	4510		\N	\N	\N		\N
3678	3714		\N	\N	\N		\N
3679	224		\N	\N	\N		\N
3680	2306		\N	\N	\N		\N
3681	2416	02 B 0184089	2013-06-18 00:00:00	\N	\N		\N
3682	2417	99 B 0043428	2014-06-02 00:00:00	\N	\N		\N
3683	2973	09/00 – 0562761 B 04	2018-01-14 00:00:00	\N	\N		\N
3684	2335	03 B 0922961	2003-04-30 00:00:00	\N	\N		\N
3685	2325	27/00-0782457B03	2017-07-26 00:00:00	\N	\N		\N
3686	3344	08 B 0977901	2008-07-13 00:00:00	\N	\N		\N
3687	1615	00 B 0662360	\N	\N	\N		\N
3688	3329		\N	\N	\N		\N
3689	2160	16/00-0013569 B 00	2024-09-05 00:00:00	\N	\N		\N
3690	3475	09/B/024 28 53	2019-04-10 00:00:00	\N	\N		\N
3691	3477	08/00/0942984-B09	2016-11-14 00:00:00	\N	\N		\N
3692	919		\N	\N	\N		\N
3693	1824		\N	\N	\N		\N
3694	2796		\N	\N	\N		\N
3695	1855	00 B 0582489	2009-06-02 00:00:00	\N	\N		\N
3696	2164	04 B 0662937	2017-10-21 00:00:00	\N	\N		\N
3697	995		\N	\N	\N		\N
3698	352		\N	\N	\N		\N
3699	1333		\N	\N	\N		\N
3700	1098		\N	\N	\N	099941019008125	\N
3701	920		\N	\N	\N		\N
3702	921		\N	\N	\N		\N
3703	2090		\N	\N	\N	000523036405666	\N
3704	3015	10 B 0464040 - 00/34	2014-10-07 00:00:00	\N	\N		\N
3705	1363		\N	\N	\N	001216219002846000	\N
3706	1366	39/00 0542654 B 04	2018-12-22 00:00:00	\N	\N	00033404630199	\N
3707	1243	0763382 B 01	2006-08-23 00:00:00	\N	\N		\N
3708	2202		\N	\N	\N		\N
3709	2203	99 B 0422191	\N	\N	\N	0006410290001749	\N
3710	2747		\N	\N	\N		\N
3711	2859	08 B 0382699	2016-11-22 00:00:00	\N	\N		\N
3712	3425	98 B 0582173-12/00	2022-03-09 00:00:00	\N	\N		\N
3713	551	00 B 842174	2000-01-16 00:00:00	\N	\N		\N
3714	2574	45/00-0822313 B 11	2016-01-21 00:00:00	\N	\N	098506010023251	\N
3715	2412	16/00 - 0009320 B99	2021-11-14 00:00:00	\N	\N		\N
3716	2892	06 B 0562889	2006-09-13 00:00:00	\N	\N	000119200473748	\N
3717	1971		\N	\N	\N	000016001434006	\N
3718	1608		\N	\N	\N	000016001434006	\N
3719	2658	98 B 0922344	2016-12-19 00:00:00	\N	\N		\N
3720	1569	04/00 - 0402459 B 00	2019-02-03 00:00:00	\N	\N	000919008837195	\N
3721	1680	99 B 0842146	2016-08-23 00:00:00	\N	\N		\N
3722	371	02 B 0363350	2002-04-16 00:00:00	\N	\N		\N
3723	2729	97 B 0102047	1999-02-10 00:00:00	\N	\N		\N
3724	579	48/00 - 0162237 B 99	2017-12-25 00:00:00	\N	\N		\N
3725	2369	10/00 – 0282704 B 02	2019-03-18 00:00:00	\N	\N		\N
3726	3629		\N	\N	\N		\N
3727	2010	12/00 – 0582186 B 99	2015-09-16 00:00:00	\N	\N		\N
3728	1348		\N	\N	\N		\N
3729	2283	25/00 0062303 B 98	2011-10-03 00:00:00	\N	\N		\N
3730	2081	03 B 0045174	2003-10-27 00:00:00	\N	\N		\N
3731	2041		\N	\N	\N		\N
3732	2228	98 B 0062534 - 25/00	2023-04-20 00:00:00	\N	\N	000404010426958	\N
3733	1619		\N	\N	\N		\N
3734	2318	98 B 0342085	1998-11-12 00:00:00	\N	\N		\N
3735	2847	98 B 0502038	2012-06-13 00:00:00	\N	\N		\N
3736	3326	0047455 B 09	2014-03-09 00:00:00	\N	\N		\N
3737	2606		\N	\N	\N	001105230004962	\N
3738	2572	02 B 0723532	2002-03-18 00:00:00	\N	\N	001105230004962	\N
3739	2573	99 B 0822079	2008-03-23 00:00:00	\N	\N	001105230004962	\N
3740	2043	34/00 - 0463144 B 04	2022-05-10 00:00:00	\N	\N	001105230004962	\N
3741	2044		\N	\N	\N	001105230004962	\N
3742	458	00 B 0104792	2000-12-17 00:00:00	\N	\N		\N
3743	459		\N	\N	\N		\N
3744	2759	99 B 0562274	2012-01-12 00:00:00	\N	\N		\N
3745	363		\N	\N	\N		\N
3746	2993	04 B 0442528	2016-04-28 00:00:00	\N	\N		\N
3747	712		\N	\N	\N		\N
3748	713		\N	\N	\N		\N
3749	2764		\N	\N	\N	000226019009540	\N
3750	1829		\N	\N	\N		\N
3751	3761	27/00 - 0782361 B 02	2022-07-13 00:00:00	\N	\N		\N
3752	3680		\N	\N	\N		\N
3753	2685		\N	\N	\N		\N
3754	81	19/00-0092720 B 17	2017-06-07 00:00:00	\N	\N		\N
3755	1457		\N	\N	\N		\N
3756	1458	98 B 0003622 - 26/01	2019-02-03 00:00:00	\N	\N		\N
3757	975		\N	\N	\N		\N
3758	2177	98 B 842033	1998-04-30 00:00:00	\N	\N	0119200473748	\N
3759	1970		\N	\N	\N		\N
3760	2730		\N	\N	\N		\N
3761	744		\N	\N	\N		\N
3762	748		\N	\N	\N		\N
3763	2127	0066191 b 04	2006-04-09 00:00:00	\N	\N		\N
3764	1456		\N	\N	\N		\N
3765	2320	99 B 0322372	2008-06-01 00:00:00	\N	\N		\N
3766	2986	98 B 0222220 – 00/05	2014-10-13 00:00:00	\N	\N		\N
3767	1711	16/00-0984261 B 11	\N	\N	\N		\N
3768	2883	07 B 0976378	2007-03-20 00:00:00	\N	\N		\N
3769	2885	06 B 0502566	2006-11-06 00:00:00	\N	\N	098909150012635	\N
3770	614		\N	\N	\N		\N
3771	615		\N	\N	\N		\N
3772	616	31/00-0108802 B 06	2022-08-14 00:00:00	\N	\N		\N
3773	2741	06 B 0223564	2006-06-06 00:00:00	\N	\N	00017030233908	\N
3774	288	0065472  B/03	2003-10-29 00:00:00	\N	\N		\N
3775	2939	07 B 0923245	2017-12-28 00:00:00	\N	\N		\N
3776	299	99 B 0083131	\N	\N	\N		\N
3777	1496	99 B 0322240	1989-05-22 00:00:00	\N	\N		\N
3778	4436		\N	\N	\N		\N
3779	4764		\N	\N	\N		\N
3780	4003	08 B 0382693	2016-12-18 00:00:00	\N	\N		\N
3781	3343		\N	\N	\N		\N
3782	2688	0000266	2006-02-19 00:00:00	\N	\N		\N
3783	2601	99 B 0009930	2004-10-05 00:00:00	\N	\N	001622002425091	\N
3784	3022		\N	\N	\N		\N
3785	3023		\N	\N	\N	000915019008448	\N
3786	3027	19/00 – 0087003 B 07	2016-12-04 00:00:00	\N	\N	002348120000758	\N
3787	1045		\N	\N	\N		\N
3788	3662		\N	\N	\N		\N
3789	240	99 B 262438	1999-09-06 00:00:00	\N	\N		\N
3790	2635		\N	\N	\N		\N
3791	1027		\N	\N	\N		\N
3792	1029	03 B 0085351	\N	\N	\N		\N
3793	2692	0086779 B 06	2006-12-04 00:00:00	\N	\N		\N
3794	1861	99 B 0382232	2000-10-07 00:00:00	\N	\N	97701110015450	\N
3795	325	98 B 0009856	2011-04-03 00:00:00	\N	\N		\N
3796	3689		\N	\N	\N		\N
3797	4548		\N	\N	\N		\N
3798	1880	41/00-0502553 B 06	2008-04-07 00:00:00	\N	\N	001539010009851	\N
3799	1340	99 B 262305	1999-03-31 00:00:00	\N	\N	00020221035585978106	\N
3800	892	98 B 222279	1998-12-15 00:00:00	\N	\N	000806018585831	\N
3801	261	98 B 482121	2019-08-05 00:00:00	\N	\N		\N
3802	262		\N	\N	\N		\N
3803	3094		\N	\N	\N		\N
3804	1881	99 B 0862359 - 47/00	2021-07-26 00:00:00	\N	\N	001719009272041	\N
3805	866		\N	\N	\N		\N
3806	3144	0084570B02	2005-12-25 00:00:00	\N	\N		\N
3807	3602		\N	\N	\N		\N
3808	4350		\N	\N	\N		\N
3809	4666		\N	\N	\N		\N
3810	4667		\N	\N	\N		\N
3811	3124		\N	\N	\N	099830012211258	\N
3812	4095	04 B 0184489	2015-03-18 00:00:00	\N	\N	099833030726914	\N
3813	2313		\N	\N	\N		\N
3814	2927	06 B 0972725	2006-10-09 00:00:00	\N	\N		\N
3815	2143	0362453 B 99	2003-01-12 00:00:00	\N	\N	000305019003265	\N
3816	3990		\N	\N	\N		\N
3817	4387	16 B 0092198	2018-11-27 00:00:00	\N	\N		\N
3818	4284	16 B 0225389   05/00	2016-05-04 00:00:00	\N	\N	099113010279530	\N
3819	2365	99 B 0222473	2020-07-27 00:00:00	\N	\N		\N
3820	2856	16/00 - 0622117 B 03	2014-04-28 00:00:00	\N	\N		\N
3821	2858		\N	\N	\N		\N
3822	4611		\N	\N	\N		\N
3823	3877	12 B 0187588 - 06/00	2023-10-26 00:00:00	\N	\N	000919008837195	\N
3824	3515		\N	\N	\N		\N
3825	3556		\N	\N	\N	000907024283698	\N
3826	3719	10 B 0423134	2014-02-14 00:00:00	\N	\N		\N
3827	2985		\N	\N	\N		\N
3828	4039	07 B 0223690	2014-10-09 00:00:00	\N	\N		\N
3829	2806	0923162 B 06	2017-01-08 00:00:00	\N	\N		\N
3830	2595		\N	\N	\N		\N
3831	3826	04 B 0403685	2022-03-14 00:00:00	\N	\N		\N
3832	4061	10 B 0323493	2010-10-31 00:00:00	\N	\N		\N
3833	3020		\N	\N	\N		\N
3834	2752	25/00-0067006 B 06	2015-12-31 00:00:00	\N	\N		\N
3835	3910	39/00-0543249 B 10	2014-02-13 00:00:00	\N	\N		\N
3836	1769	99 B 0063098	2007-08-06 00:00:00	\N	\N	000616509035046	\N
3837	3766	16/00 – 0991092 B 12	2022-01-05 00:00:00	\N	\N	099730040684127	\N
3838	4734	31/00-112427 B22	2022-05-23 00:00:00	\N	\N	000316130371163	\N
3839	4605		\N	\N	\N	09993519035711	\N
3840	3847	08 B 0185858	2018-02-15 00:00:00	\N	\N		\N
3841	4201	01 B / 0582605-12/00	2016-09-18 00:00:00	\N	\N		\N
3842	1860		\N	\N	\N		\N
3843	2837	06 B 0805652	2006-08-22 00:00:00	\N	\N		\N
3844	3679		\N	\N	\N		\N
3845	4747		\N	\N	\N		\N
3846	2168		\N	\N	\N		\N
3847	3843	08 B 0087235	2010-12-28 00:00:00	\N	\N		\N
3848	3844	07 B 0682722	2007-02-26 00:00:00	\N	\N		\N
3849	2950	13/00-0263879 B 09	2009-08-20 00:00:00	\N	\N		\N
3850	4732	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
3851	4750		\N	\N	\N	00924239004249	\N
3852	4390	19 B 0093591	2019-02-21 00:00:00	\N	\N	000714019006845	\N
3853	3681		\N	\N	\N		\N
3854	3522		\N	\N	\N		\N
3855	2559	05 B 0972314	2007-12-01 00:00:00	\N	\N		\N
3856	2117	04 B 0263212	2004-09-21 00:00:00	\N	\N		\N
3857	3942	07 B 0123974	2012-07-11 00:00:00	\N	\N	000825006763783	\N
3858	1690		\N	\N	\N		\N
3859	1367		\N	\N	\N		\N
3860	3197	19/00-0083602 B 00	2010-05-16 00:00:00	\N	\N		\N
3861	4599		\N	\N	\N	001230070010864	\N
3862	1899		\N	\N	\N	001230070010864	\N
3863	4000	14 B 0365896	2014-03-06 00:00:00	\N	\N	097916150010540	\N
3864	3713		\N	\N	\N		\N
3865	1158		\N	\N	\N		\N
3866	4798	04/00 - 0403084 B 02	2022-03-23 00:00:00	\N	\N		\N
3867	3417	00 B 0011276	2008-03-31 00:00:00	\N	\N	000322069013355	\N
3868	3049	14/00 – 0422888 B 07	2019-09-11 00:00:00	\N	\N		\N
3869	2158		\N	\N	\N		\N
3870	3628		\N	\N	\N		\N
3871	3364	06 B 0323030	2006-10-31 00:00:00	\N	\N		\N
3872	2955	16/00-0975135 B07	2018-03-14 00:00:00	\N	\N		\N
3873	4457		\N	\N	\N		\N
3874	4458		\N	\N	\N	99730040640923	\N
3875	2782	98 B 0082710	2001-10-03 00:00:00	\N	\N		\N
3876	582		\N	\N	\N	001301019001073	\N
3877	1089	98 B 0242080	2009-10-04 00:00:00	\N	\N		\N
3878	4423		\N	\N	\N		\N
3879	1454		\N	\N	\N		\N
3880	3128		\N	\N	\N		\N
3881	4320	16 B 0092367	2016-10-05 00:00:00	\N	\N		\N
3882	4321	16/00-0007705 B 99	2014-04-23 00:00:00	\N	\N	001439054368576	\N
3883	3591		\N	\N	\N		\N
3884	4309	16 B 0503017	2016-09-28 00:00:00	\N	\N		\N
3885	4254	08 B 0563070 00/28	2017-02-01 00:00:00	\N	\N		\N
3886	4032	25/00 - 0070639 B 14	2020-03-03 00:00:00	\N	\N		\N
3887	3239	19/00 – 0086686 B 06	2008-12-16 00:00:00	\N	\N		\N
3888	3616		\N	\N	\N	001643030005758	\N
3889	4018	01/00-0882401 B 04	2017-07-27 00:00:00	\N	\N	01105239005747	\N
3890	1070		\N	\N	\N	099519010194424	\N
3891	1845		\N	\N	\N		\N
3892	501	0482212 B 99	2019-02-04 00:00:00	\N	\N		\N
3893	4488		\N	\N	\N		\N
3894	2469		\N	\N	\N		\N
3895	1316	06 B 0086712	2006-09-11 00:00:00	\N	\N		\N
3896	337	43/00  0322104 B 98	2019-04-10 00:00:00	\N	\N		\N
3897	23		\N	\N	\N	000705429010449	\N
3898	3003	07/00-0242497 B 03	2008-03-09 00:00:00	\N	\N		\N
3899	4392	03/00-0923129 B05	2016-09-22 00:00:00	\N	\N		\N
3900	3631		\N	\N	\N		\N
3901	1630		\N	\N	\N		\N
3902	3598		\N	\N	\N		\N
3903	1856	0223063 B03	2012-02-09 00:00:00	\N	\N		\N
3904	3084		\N	\N	\N		\N
3905	3526	09 B 0742485	2009-03-22 00:00:00	\N	\N		\N
3906	2309	00 B 0763247	2008-04-16 00:00:00	\N	\N		\N
3907	3664		\N	\N	\N	001831010014271	\N
3908	2495	98 A 0815321	2004-06-15 00:00:00	\N	\N	000816299069619	\N
3909	2563	31/00-0109341 B07	2018-12-27 00:00:00	\N	\N		\N
3910	3881	11B 0405017	2019-03-18 00:00:00	\N	\N		\N
3911	3570	07B0223750	2012-11-07 00:00:00	\N	\N		\N
3912	4647		\N	\N	\N	000605022356414	\N
3913	4546		\N	\N	\N	000605022356414	\N
3914	4547		\N	\N	\N		\N
3915	2116	03 B 0702272	2003-01-29 00:00:00	\N	\N		\N
3916	4191	05 B 0583090 - 00/12	2015-05-28 00:00:00	\N	\N		\N
3917	4192	16 B 0906823 - 00/02	2016-03-10 00:00:00	\N	\N	000622002311490	\N
3918	2594		\N	\N	\N		\N
3919	4474		\N	\N	\N		\N
3920	3409	04 B 0022938	2014-02-10 00:00:00	\N	\N	000825006763783	\N
3921	4207	99 B 0222471-05/00	2014-03-31 00:00:00	\N	\N	002116100175776	\N
3922	4240	09 B 0942984	2016-11-14 00:00:00	\N	\N		\N
3923	3513	02/B/0904147	2002-06-16 00:00:00	\N	\N		\N
3924	426	16/00 – 0542384 B 01	2015-05-25 00:00:00	\N	\N	001230012470243	\N
3925	4551		\N	\N	\N		\N
3926	4552		\N	\N	\N		\N
3927	4553		\N	\N	\N		\N
3928	4554		\N	\N	\N		\N
3929	4555		\N	\N	\N		\N
3930	4763		\N	\N	\N	0398419430011437	\N
3931	3594		\N	\N	\N		\N
3932	4125	16 B 0303316	2016-02-02 00:00:00	\N	\N		\N
3933	4418	98 B 0322204 00/43	2017-04-17 00:00:00	\N	\N		\N
3934	3204		\N	\N	\N		\N
3935	4290	09 B 0906041 02/00	2023-12-20 00:00:00	\N	\N	098135020004840	\N
3936	2929	01 B 0183836	2016-11-09 00:00:00	\N	\N		\N
3937	961		\N	\N	\N		\N
3938	3506	08 B 0863028	2008-10-12 00:00:00	\N	\N	195204020041943	\N
3939	3524	05 B 0108232	2008-04-06 00:00:00	\N	\N		\N
3940	991		\N	\N	\N		\N
3941	2055		\N	\N	\N		\N
3942	3119		\N	\N	\N		\N
3943	1127		\N	\N	\N		\N
3944	2512	99 A 4019357	2001-02-18 00:00:00	\N	\N		\N
3945	4131	13 B 0906508   02/00	2016-07-25 00:00:00	\N	\N		\N
3946	491		\N	\N	\N		\N
3947	493		\N	\N	\N		\N
3948	4756		\N	\N	\N		\N
3949	370		\N	\N	\N		\N
3950	2794	02 B 0019504	2007-02-14 00:00:00	\N	\N		\N
3951	3945	13 B 0224883	2014-03-09 00:00:00	\N	\N		\N
3952	3497		\N	\N	\N		\N
3953	3207	43/00-0323204 B 08	2019-04-09 00:00:00	\N	\N		\N
3954	4263	16/00-1011889 B 17	2017-04-03 00:00:00	\N	\N		\N
3955	4635		\N	\N	\N		\N
3956	4636		\N	\N	\N		\N
3957	2632	05 B 0342834	\N	\N	\N		\N
3958	2144	04 B 0085572	2004-04-03 00:00:00	\N	\N		\N
3959	4778	16/00-0013975 B01	2015-10-06 00:00:00	\N	\N		\N
3960	2803		\N	\N	\N	11010121889	\N
3961	4549		\N	\N	\N		\N
3962	4550		\N	\N	\N		\N
3963	396	03 B 0562625 - 00/28	2017-07-16 00:00:00	\N	\N		\N
3964	3745	10 B 0224141	2010-05-02 00:00:00	\N	\N		\N
3965	4649		\N	\N	\N		\N
3966	3621		\N	\N	\N		\N
3967	3588		\N	\N	\N		\N
3968	2554	47/00-0862188 B 98	2011-11-09 00:00:00	\N	\N		\N
3969	3186	08 B 0981468	2008-09-23 00:00:00	\N	\N	000405022328633	\N
3970	4296		\N	\N	\N		\N
3971	4608		\N	\N	\N		\N
3972	4426	15/00-0049947 B 15	2015-11-09 00:00:00	\N	\N		\N
3973	4326	08 b 0046988	2011-03-07 00:00:00	\N	\N	099830019170122	\N
3974	3848	02 B 0016897	2002-02-09 00:00:00	\N	\N	305022312462	\N
3975	3234		\N	\N	\N		\N
3976	4428	N°06/00-0187980 B14	2020-04-28 00:00:00	\N	\N		\N
3977	3521		\N	\N	\N		\N
3978	4607		\N	\N	\N		\N
3979	3104		\N	\N	\N		\N
3980	3224	09 B 0242836	2017-02-19 00:00:00	\N	\N		\N
3981	4329	11/00-0202426 B 16	2018-07-03 00:00:00	\N	\N		\N
3982	4639		\N	\N	\N		\N
3983	3592		\N	\N	\N		\N
3984	4449		\N	\N	\N		\N
3985	4085		\N	\N	\N		\N
3986	2057	16/00 - 007705 B 99	2014-04-23 00:00:00	\N	\N		\N
3987	3932	99 B 0482212	2007-06-20 00:00:00	\N	\N	9722010400936	\N
3988	4576		\N	\N	\N		\N
3989	3893	10 B 0882665	2011-05-23 00:00:00	\N	\N		\N
3990	4349		\N	\N	\N		\N
3991	3607		\N	\N	\N		\N
3992	4664		\N	\N	\N		\N
3993	1858		\N	\N	\N		\N
3994	1945		\N	\N	\N	099919008288302	\N
3995	663		\N	\N	\N		\N
3996	3709	07 B 0109385	2010-06-27 00:00:00	\N	\N		\N
3997	4415	34/00-0465390 B16	2016-05-09 00:00:00	\N	\N		\N
3998	3263	03 B 0382430	2009-04-19 00:00:00	\N	\N		\N
3999	4742		\N	\N	\N	099916000890340	\N
4000	4581		\N	\N	\N	099916000890340	\N
4001	2050	99 B 0402169	1999-10-12 00:00:00	\N	\N	099212010266437	\N
4002	3675		\N	\N	\N		\N
4003	4646		\N	\N	\N		\N
4004	1968		\N	\N	\N		\N
4005	3599		\N	\N	\N		\N
4006	4090		\N	\N	\N		\N
4007	4092		\N	\N	\N		\N
4008	3916	01/00 0882751 B 13	2013-02-27 00:00:00	\N	\N		\N
4009	4648		\N	\N	\N	099845082206131	\N
4010	100	98 B 0282162	2013-12-02 00:00:00	\N	\N		\N
4011	2100	04 B 08222214	2012-02-13 00:00:00	\N	\N		\N
4012	2252	96 B 0122336	2007-01-22 00:00:00	\N	\N	0013116098790984	\N
4013	900	06 B 0223545	2006-04-23 00:00:00	\N	\N		\N
4014	4194	05/00 0222528 B 99	2012-06-30 00:00:00	\N	\N		\N
4015	180	97 B 142050	1999-10-03 00:00:00	\N	\N		\N
4016	98	05/00-0222363 B 99	2011-10-13 00:00:00	\N	\N		\N
4017	4539	N° 22/00 - 0023507 B10	2010-02-25 00:00:00	\N	\N		\N
4018	4542		\N	\N	\N		\N
4019	2227	0223402  B/05	2005-03-12 00:00:00	\N	\N		\N
4020	2059	99 B 0082965	1999-03-15 00:00:00	\N	\N		\N
4021	4665		\N	\N	\N		\N
4022	2673		\N	\N	\N		\N
4023	914		\N	\N	\N	000332010889054	\N
4024	3984	16/00-0020109 B 02	2016-05-25 00:00:00	\N	\N	001423036603523	\N
4025	4467		\N	\N	\N		\N
4026	3009		\N	\N	\N		\N
4027	4429	43/00-0323489-B-10	2015-01-04 00:00:00	\N	\N	000604040418820	\N
4028	4609		\N	\N	\N		\N
4029	3574	12/00-0583290 B 07	2011-03-02 00:00:00	\N	\N		\N
4030	3651		\N	\N	\N		\N
4031	4579		\N	\N	\N	0001028299006341	\N
4032	3491		\N	\N	\N		\N
4033	4282	14 B 0995112  16/00	2016-02-01 00:00:00	\N	\N		\N
4034	4724	21 B 0094463	2021-05-25 00:00:00	\N	\N		\N
4035	44	00 B 0083870	2002-11-26 00:00:00	\N	\N		\N
4036	273		\N	\N	\N		\N
4037	2273	98 B 0422124	2001-12-18 00:00:00	\N	\N	000439054265069	\N
4038	1741		\N	\N	\N		\N
4039	2138		\N	\N	\N		\N
4040	2002		\N	\N	\N		\N
4041	1755		\N	\N	\N		\N
4042	1888	98 B 0522212	2012-01-03 00:00:00	\N	\N	001621280001563	\N
4043	4293	98 B 0882115  00/01	2015-01-05 00:00:00	\N	\N		\N
4044	2775	05 B 0782642	2009-02-01 00:00:00	\N	\N		\N
4045	1807		\N	\N	\N		\N
4046	124	21/00 - 0142152 B 98	2023-09-24 00:00:00	\N	\N		\N
4047	2887		\N	\N	\N		\N
4048	2535	99 B 0903028	1999-09-01 00:00:00	\N	\N	99935072257842	\N
4049	4450		\N	\N	\N		\N
4050	3781		\N	\N	\N		\N
4051	2924		\N	\N	\N		\N
4052	3623		\N	\N	\N		\N
4053	4412	16/00 0322116 B 98	2018-02-27 00:00:00	\N	\N		\N
4054	3240	08 B 0806171 - 09/00	2014-02-20 00:00:00	\N	\N		\N
4055	2145		\N	\N	\N		\N
4056	4001		\N	\N	\N		\N
4057	4081	00-16 0987909 B 13	2015-12-01 00:00:00	\N	\N		\N
4058	2271	03 B 0021635	2003-06-16 00:00:00	\N	\N		\N
4059	4545		\N	\N	\N		\N
4060	4556		\N	\N	\N		\N
4061	4557		\N	\N	\N		\N
4062	4558		\N	\N	\N	00016001436218	\N
4063	4559		\N	\N	\N	000934020008168	\N
4064	4560		\N	\N	\N		\N
4065	3751	08 B 0725088	2008-02-27 00:00:00	\N	\N	001605010011180	\N
4066	3536	35/00 - 0978954 B 08	2019-07-10 00:00:00	\N	\N	000531029020847	\N
4067	4060	07 B 0583209	2012-09-27 00:00:00	\N	\N		\N
4068	2194	02 B 0262959	2002-10-22 00:00:00	\N	\N		\N
4069	4727	06 B 0463440	2022-01-20 00:00:00	\N	\N		\N
4070	3696		\N	\N	\N	001105022428513	\N
4071	4215	19/00-0083316 B 99	2012-01-18 00:00:00	\N	\N	000516019029054	\N
4072	1565	99 B 0542203	2005-09-17 00:00:00	\N	\N		\N
4073	3429		\N	\N	\N		\N
4074	3711		\N	\N	\N	99843020244625	\N
4075	1901		\N	\N	\N		\N
4076	1906		\N	\N	\N		\N
4077	2893	07 B 0162757	2007-07-09 00:00:00	\N	\N	099801120478915	\N
4078	2593		\N	\N	\N		\N
4079	3190	02/00-0903016 B 99	2017-01-27 00:00:00	\N	\N		\N
4080	177	98 B 0662121	1963-11-05 00:00:00	\N	\N		\N
4081	423	01 B 0142635	2001-04-08 00:00:00	\N	\N		\N
4082	1064		\N	\N	\N	000712058323543	\N
4083	1957		\N	\N	\N	000712058323543	\N
4084	4093		\N	\N	\N		\N
4085	3495	27/00-0782947 B 08	2014-06-30 00:00:00	\N	\N	0406269018737	\N
4086	4653		\N	\N	\N		\N
4087	3993	12 B 0726069   35/00	2012-01-19 00:00:00	\N	\N		\N
4088	4265	06 B 0123825 - 00/30	2009-10-28 00:00:00	\N	\N		\N
4089	96	99 B 0502242	2004-03-30 00:00:00	\N	\N		\N
4090	2431		\N	\N	\N		\N
4091	972	03 B 0562684	2003-12-10 00:00:00	\N	\N		\N
4092	274		\N	\N	\N		\N
4093	3194	04/0902114 B 98	2006-02-14 00:00:00	\N	\N	001348010005464	\N
4094	2583	05/00 – 0222106 B 98	2022-08-09 00:00:00	\N	\N	001705022566049	\N
4095	3470	04/00-0404738 B10	2022-12-05 00:00:00	\N	\N	09991804421491200000	\N
4096	199		\N	\N	\N	00017030233908	\N
4097	1202		\N	\N	\N		\N
4098	2994	06 B 0242687	2012-11-18 00:00:00	\N	\N		\N
4099	2517		\N	\N	\N		\N
4100	3571	98 B 0122291	2015-03-25 00:00:00	\N	\N		\N
4101	4533	46/00 - 0842146 B 99	2016-08-23 00:00:00	\N	\N	00104303234890343001	\N
4102	2882	06 B 0975392	2006-11-21 00:00:00	\N	\N	99830012243803	\N
4103	3695		\N	\N	\N		\N
4104	3503		\N	\N	\N	001316130014369	\N
4105	3854	01 B 0015669 - 16/00	2023-01-17 00:00:00	\N	\N	001316130014369	\N
4106	1657		\N	\N	\N		\N
4107	3256		\N	\N	\N		\N
4108	290		\N	\N	\N		\N
4109	291	99 B 0502196	2001-04-01 00:00:00	\N	\N		\N
4110	2979	07 B 0382656	2007-04-29 00:00:00	\N	\N	000738070235704	\N
4111	4543		\N	\N	\N	000738070235704	\N
4112	1356	12/00 - 0582093 B 98	2019-06-26 00:00:00	\N	\N		\N
4113	1866		\N	\N	\N		\N
4114	3718	12/00 0584003 B 12	2012-11-28 00:00:00	\N	\N		\N
4115	254	98 B 0062232	2009-01-28 00:00:00	\N	\N		\N
4116	3575	04 B 0184577	2011-01-13 00:00:00	\N	\N		\N
4117	2792		2006-05-15 00:00:00	\N	\N		\N
4118	255	98 B 0003421	2000-12-25 00:00:00	\N	\N	00101329901515	\N
4119	257	00 B 0903754	2000-12-31 00:00:00	\N	\N		\N
4120	4006	03 B 0463023	2011-05-05 00:00:00	\N	\N		\N
4121	2324	02 B 0763527	2012-11-06 00:00:00	\N	\N		\N
4122	3508		\N	\N	\N		\N
4123	2513	99 B 0010204	2003-02-02 00:00:00	\N	\N		\N
4124	917		\N	\N	\N		\N
4125	1463		\N	\N	\N	099234010248237	\N
4126	2565	05 B 0162676	2005-08-31 00:00:00	\N	\N		\N
4127	4691	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4128	3380		\N	\N	\N		\N
4129	1806	01 B 0064192	2001-05-05 00:00:00	\N	\N		\N
4130	559	02 B 0342503	2002-05-08 00:00:00	\N	\N	000016531011857	\N
4131	2744		\N	\N	\N		\N
4132	4292	15 B 0115340 31/00	2023-07-26 00:00:00	\N	\N		\N
4133	3105	05 B 0302758	2005-11-02 00:00:00	\N	\N	000919008841995	\N
4134	4082		\N	\N	\N	001716210123853	\N
4135	1897	03 B 0223089	2003-05-13 00:00:00	\N	\N	001130012455723	\N
4136	4642		\N	\N	\N	099443080562520001	\N
4137	4063	07 B 0463575	2008-10-29 00:00:00	\N	\N		\N
4138	3874	25/00-0063036 B99	2023-03-28 00:00:00	\N	\N		\N
4139	3668	07 B 0742453	2010-08-03 00:00:00	\N	\N		\N
4140	1314	00 B 0402479	2000-02-15 00:00:00	\N	\N		\N
4141	1072		\N	\N	\N		\N
4142	1560	98 B 0762196	2006-04-05 00:00:00	\N	\N		\N
4143	3004	98 B 0242046	2011-02-08 00:00:00	\N	\N		\N
4144	2931		\N	\N	\N		\N
4145	649	15/00 0042350 B 98	2009-06-22 00:00:00	\N	\N		\N
4146	2167	0904902 B 05	2005-02-09 00:00:00	\N	\N		\N
4147	4468		\N	\N	\N		\N
4148	4527	N°39/00 - 0543229 B 10	2016-07-10 00:00:00	\N	\N		\N
4149	2370	05 B 1515278	2005-04-06 00:00:00	\N	\N	000016001403077	\N
4150	2371	98 B 07222397	\N	\N	\N	002416280088439	\N
4151	4759		\N	\N	\N		\N
4152	3129	00 B 0011642	2006-06-25 00:00:00	\N	\N	000034046251933	\N
4153	4486		\N	\N	\N		\N
4154	4487		\N	\N	\N		\N
4155	2734		\N	\N	\N		\N
4156	4604		\N	\N	\N		\N
4157	4053		\N	\N	\N		\N
4158	4606		\N	\N	\N		\N
4159	3353	07 B 0862933	2007-02-04 00:00:00	\N	\N		\N
4160	3846	00 B 0842215	2012-06-10 00:00:00	\N	\N		\N
4161	650		\N	\N	\N		\N
4162	3484	06 B 0323026	2011-10-10 00:00:00	\N	\N		\N
4163	3275		\N	\N	\N		\N
4164	2126		\N	\N	\N	099825060754126	\N
4165	1792		\N	\N	\N		\N
4166	2214	0142890B 01	2006-02-18 00:00:00	\N	\N		\N
4167	467		\N	\N	\N		\N
4168	4268	09 B 0162909 48/00	2009-08-25 00:00:00	\N	\N		\N
4169	2874		\N	\N	\N		\N
4170	3403	98 B 0122214-30/00	2011-11-17 00:00:00	\N	\N	099830012243803	\N
4171	2389		\N	\N	\N	000116001686837	\N
4172	3083		\N	\N	\N		\N
4173	309	99 B 0582292	2005-05-21 00:00:00	\N	\N		\N
4174	960	98 B 0782044 27/00	2014-06-19 00:00:00	\N	\N		\N
4175	3150	99 B 0082914	2008-11-23 00:00:00	\N	\N		\N
4176	4544		\N	\N	\N		\N
4177	2600	0402919B02	2007-02-20 00:00:00	\N	\N		\N
4178	3011	98 B 0182301 06/00	2014-10-20 00:00:00	\N	\N		\N
4179	397		\N	\N	\N		\N
4180	398		\N	\N	\N		\N
4181	399	98 B 4020068	1998-07-21 00:00:00	\N	\N	001105022428513	\N
4182	101		\N	\N	\N		\N
4183	2957	07 B 0108842	2007-09-11 00:00:00	\N	\N		\N
4184	4682	N°06/00-0182808 B 99	2017-05-29 00:00:00	\N	\N		\N
4185	93	03 B 0302593	2003-03-15 00:00:00	\N	\N		\N
4186	95		\N	\N	\N		\N
4187	1138	01 B 0282547 - 10/00	2015-09-14 00:00:00	\N	\N		\N
4188	4748		\N	\N	\N	001715005066053	\N
4189	1809		\N	\N	\N	099517319030713	\N
4190	118		\N	\N	\N		\N
4191	2910		\N	\N	\N		\N
4192	2693		\N	\N	\N	000805199009440	\N
4193	2290		\N	\N	\N		\N
4194	3095	08 B 0364654	2016-04-18 00:00:00	\N	\N		\N
4195	4258	05 B 0970946 - 00/16	2021-02-01 00:00:00	\N	\N		\N
4196	4020	12 B 0663450	2012-02-15 00:00:00	\N	\N	0116001422534	\N
4197	4106	14 B 0423388  - 00/14	2016-03-20 00:00:00	\N	\N	000616210256356	\N
4198	3700	05 B 0364079	2005-05-12 00:00:00	\N	\N		\N
4199	1021	98 B 0122138	2014-05-21 00:00:00	\N	\N		\N
4200	3706		\N	\N	\N		\N
4201	4565		\N	\N	\N		\N
4202	4422		\N	\N	\N		\N
4203	2626	04 B 0923057	2004-10-26 00:00:00	\N	\N	194004030196636	\N
4204	2627	05 B 0045685	2005-01-10 00:00:00	\N	\N		\N
4205	3122	08 B 0423002-14/00	2008-09-09 00:00:00	\N	\N		\N
4206	4641		\N	\N	\N		\N
4207	4598		\N	\N	\N		\N
4208	4699	16/00 - 0725766 B 10	2023-06-05 00:00:00	\N	\N		\N
4209	4109	11 B 1004654 - 00/16	2022-07-03 00:00:00	\N	\N		\N
4210	4110	98 B 0562063  - 00/28	2022-10-17 00:00:00	\N	\N	098320010013937	\N
4211	3620		\N	\N	\N		\N
4212	131	00 B 0763323	2017-03-29 00:00:00	\N	\N		\N
4213	2035		\N	\N	\N	009730040617040	\N
4214	1013	44/00 0763630B02	2016-04-25 00:00:00	\N	\N		\N
4215	1775	23/00 – 0363964 B 04 du 17/03/2014	2014-03-17 00:00:00	\N	\N		\N
4216	3977	06 B 0422863	2006-08-29 00:00:00	\N	\N		\N
4217	4399	03/00-0923129-B-05	2016-09-22 00:00:00	\N	\N		\N
4218	4400		\N	\N	\N		\N
4219	3062	98 B 0122438	2020-06-03 00:00:00	\N	\N		\N
4220	3352	03 B 0862697	2003-10-14 00:00:00	\N	\N	000523036405666	\N
4221	3614		\N	\N	\N	000428049000943	\N
4222	3615		\N	\N	\N		\N
4223	4038		\N	\N	\N		\N
4224	3563		\N	\N	\N		\N
4225	4643		\N	\N	\N		\N
4226	1756		\N	\N	\N		\N
4227	3496		\N	\N	\N		\N
4228	105	10/00-0282035 B 97	2016-06-02 00:00:00	\N	\N	001216099109235	\N
4229	4190	07 B 0223692 - 00/15	2015-02-03 00:00:00	\N	\N		\N
4230	4466		\N	\N	\N		\N
4231	4288	30/00-0124564 B 11	2015-04-05 00:00:00	\N	\N	099830012227698	\N
4232	4775	16/00-1006528 B 12	2017-11-16 00:00:00	\N	\N	001639010005168	\N
4233	3502		\N	\N	\N		\N
4234	4708		\N	\N	\N		\N
4235	4709		\N	\N	\N		\N
4236	4434		\N	\N	\N		\N
4237	1988		\N	\N	\N		\N
4238	2630		\N	\N	\N		\N
4239	1114		\N	\N	\N		\N
4240	4385	05/00 – 0225897 B 18	2018-11-14 00:00:00	\N	\N		\N
4241	26		\N	\N	\N		\N
4242	527		\N	\N	\N		\N
4243	2248		\N	\N	\N	099443080562520001	\N
4244	2799		\N	\N	\N		\N
4245	1074	14/00 0422598 B 03	2016-10-11 00:00:00	\N	\N		\N
4246	2292	0363980 B 05	2005-01-12 00:00:00	\N	\N		\N
4247	4129		\N	\N	\N		\N
4248	3715		\N	\N	\N		\N
4249	3716		\N	\N	\N		\N
4250	4083		\N	\N	\N		\N
4251	4199	07/00 - 0242836 B 09	2021-10-31 00:00:00	\N	\N		\N
4252	3435	10 b 0423104	2015-07-27 00:00:00	\N	\N		\N
4253	3635	06 B 0404188	2007-06-20 00:00:00	\N	\N		\N
4254	3379	43/00 – 0323062 B 07	2009-01-18 00:00:00	\N	\N		\N
4255	4447		\N	\N	\N		\N
4256	4448		\N	\N	\N		\N
4257	3793	11 B 0224281	\N	\N	\N		\N
4258	754	07 B 0263553	2007-09-11 00:00:00	\N	\N		\N
4259	2705	99 B 807222754	2000-06-21 00:00:00	\N	\N		\N
4260	2649		\N	\N	\N	00071404229223200000	\N
4261	1896		\N	\N	\N		\N
4262	1133		\N	\N	\N		\N
4263	1662	0463482B06	2011-10-13 00:00:00	\N	\N		\N
4264	2521		\N	\N	\N		\N
4265	1674		\N	\N	\N		\N
4266	1675	0882099 B 98	2007-06-17 00:00:00	\N	\N	000815004698832	\N
4267	3031	02 B0582765	2002-09-01 00:00:00	\N	\N	001731030008562	\N
4268	307	99 B 462307	\N	\N	\N		\N
4269	4716	N°  11/00-0202246 B08	2018-07-11 00:00:00	\N	\N		\N
4270	4731		\N	\N	\N		\N
4271	1513		\N	\N	\N	99522010368821	\N
4272	2665	00 B 0682329	2005-06-21 00:00:00	\N	\N		\N
4273	4227	1042526 B 16	2017-06-04 00:00:00	\N	\N		\N
4274	4752		\N	\N	\N		\N
4275	4753		\N	\N	\N	099928119094400	\N
4276	4754		\N	\N	\N		\N
4277	4755		\N	\N	\N	099516120536822	\N
4278	3862	28/00 – 0562624 B 03	2020-05-19 00:00:00	\N	\N		\N
4279	4730		\N	\N	\N		\N
4280	4154		\N	\N	\N		\N
4281	4158		\N	\N	\N	099806018230162	\N
4282	4160		\N	\N	\N		\N
4283	3316	99 B 0282220	2015-12-27 00:00:00	\N	\N		\N
4284	2629	99 B 22230	1999-03-25 00:00:00	\N	\N	002119180026357	\N
4285	3516	06 B 0108985	2006-12-18 00:00:00	\N	\N		\N
4286	3733		\N	\N	\N		\N
4287	4432		\N	\N	\N		\N
4288	2633	28/00 - 0562127 B 99	2020-08-13 00:00:00	\N	\N		\N
4289	2918		\N	\N	\N		\N
4290	1644	99 B 62581	\N	\N	\N	000435072414906	\N
4291	2003	00 B 63788	2010-07-11 00:00:00	\N	\N		\N
4292	618		\N	\N	\N	000902090604123	\N
4293	3052	26/00 08 B 0342994	2008-04-14 00:00:00	\N	\N	001716101188970	\N
4294	1122		\N	\N	\N		\N
4295	1123		\N	\N	\N	305022312462	\N
4296	583		\N	\N	\N		\N
4297	4561		\N	\N	\N		\N
4298	4562		\N	\N	\N		\N
4299	4563		\N	\N	\N		\N
4300	4564		\N	\N	\N		\N
4301	4692	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4302	4650		\N	\N	\N		\N
4303	4651		\N	\N	\N		\N
4304	4017	13 B 0303090	2015-06-08 00:00:00	\N	\N		\N
4305	3609		\N	\N	\N		\N
4306	4252		\N	\N	\N		\N
4307	4526	16/00-0986657 B13	2021-06-17 00:00:00	\N	\N		\N
4308	4757		\N	\N	\N		\N
4309	4758		\N	\N	\N		\N
4310	4760		\N	\N	\N		\N
4311	4761		\N	\N	\N		\N
4312	4762		\N	\N	\N	000505019007357	\N
4313	3208	05 B 0086324 - 19/00	2009-12-01 00:00:00	\N	\N	000505019007357	\N
4314	2147		\N	\N	\N		\N
4315	2367	98 B 0042349 00/16	2016-08-10 00:00:00	\N	\N	002113026572747	\N
4316	3310		\N	\N	\N	001144029004256	\N
4317	1176		\N	\N	\N		\N
4318	4008	14/00 – 0423050 B 09	2019-04-23 00:00:00	\N	\N		\N
4319	3056		\N	\N	\N		\N
4320	3596		\N	\N	\N		\N
4321	3213	09 B 0088105	2016-02-09 00:00:00	\N	\N		\N
4322	3216		\N	\N	\N		\N
4323	67	04 B 0085776	2004-07-26 00:00:00	\N	\N		\N
4324	74	97 B 0610241	1997-03-02 00:00:00	\N	\N		\N
4325	1499	0403101 B 02	2002-09-09 00:00:00	\N	\N		\N
4326	4713		\N	\N	\N		\N
4327	4374	04B0724149-35/00	2015-02-16 00:00:00	\N	\N		\N
4328	964	98 B 122361	1998-09-19 00:00:00	\N	\N		\N
4329	3000		\N	\N	\N		\N
4330	3908	11 B 0404962 04/00	2014-07-16 00:00:00	\N	\N		\N
4331	4054		\N	\N	\N		\N
4332	3907	09 B 0783034	2009-12-07 00:00:00	\N	\N		\N
4333	4354	09 B 0263878	2016-12-28 00:00:00	\N	\N		\N
4334	4325	28/00 0563974 B 15	2019-11-17 00:00:00	\N	\N		\N
4335	4308	08 B 0263645	2017-04-16 00:00:00	\N	\N		\N
4336	3974	01/00-0882675	2019-02-19 00:00:00	\N	\N		\N
4337	1157		\N	\N	\N		\N
4338	1092		\N	\N	\N		\N
4339	4301		\N	\N	\N	099940109016811	\N
4340	3135		\N	\N	\N	098826519000321	\N
4341	3390	35/00 – 0725488 B 09	2009-10-21 00:00:00	\N	\N		\N
4342	4437		\N	\N	\N		\N
4343	4438		\N	\N	\N		\N
4344	4439		\N	\N	\N		\N
4345	4366	19/00 - 0086359 B 05	2017-11-14 00:00:00	\N	\N		\N
4346	4367	05/00-0225660B17	2021-07-15 00:00:00	\N	\N	000931011093919	\N
4347	3927	12 B 0423272	2012-09-23 00:00:00	\N	\N	000712030008175	\N
4348	3419	04 B 0804827	2004-05-15 00:00:00	\N	\N	98407320024342	\N
4349	1117	13/00 – 0443182 B 11	2019-03-14 00:00:00	\N	\N		\N
4350	2797	04B0322833	2004-10-10 00:00:00	\N	\N		\N
4351	3065	99 B 0342277	1999-12-20 00:00:00	\N	\N		\N
4352	3131		\N	\N	\N		\N
4353	1758	0782585 B/05	2005-01-03 00:00:00	\N	\N		\N
4354	2877	03 B 0363514	2004-11-24 00:00:00	\N	\N		\N
4355	1632		\N	\N	\N	000516230701953	\N
4356	2042		\N	\N	\N	000516230701953	\N
4357	216	05 B 0842373	2005-12-17 00:00:00	\N	\N	000516230701953	\N
4358	3579		\N	\N	\N	000516230701953	\N
4359	3735	98 B 0122403	2011-02-21 00:00:00	\N	\N		\N
4360	3544		\N	\N	\N		\N
4361	4028	15 B 0423504	2015-05-21 00:00:00	\N	\N		\N
4362	4238	30/00-0124702 B 12	2016-06-23 00:00:00	\N	\N	001308094306228	\N
4363	4302	16/00 0967161 B 05	2012-11-05 00:00:00	\N	\N		\N
4364	4098	16 B 0303337 – 17/00	2018-06-20 00:00:00	\N	\N		\N
4365	4031	07 B 0263575	2015-01-13 00:00:00	\N	\N		\N
4366	4043	04/00-0405255 B 13	2015-06-02 00:00:00	\N	\N		\N
4367	2175		\N	\N	\N		\N
4368	4351	15 B 0943123	2018-05-03 00:00:00	\N	\N		\N
4369	3699		\N	\N	\N		\N
4370	3880	16/00 – 0981449 B 10	2019-06-20 00:00:00	\N	\N		\N
4371	2520	05 B 0302748	2005-07-09 00:00:00	\N	\N		\N
4372	2440	99 B 0083511	2012-02-28 00:00:00	\N	\N	001428179003443	\N
4373	4445		\N	\N	\N		\N
4374	3825	19/00-0086924 B 07	2016-11-14 00:00:00	\N	\N		\N
4375	3806	98 B 0202024	2006-07-31 00:00:00	\N	\N		\N
4376	4256	16/00 - 0970946 B 05	2021-02-01 00:00:00	\N	\N		\N
4377	4767	28/00-0562410 B 10	2016-04-12 00:00:00	\N	\N		\N
4378	2871	99 B 0009305	2006-03-29 00:00:00	\N	\N		\N
4379	3915	09 B 0088177	2015-08-18 00:00:00	\N	\N	001716104375775	\N
4380	3693		\N	\N	\N	001716104375775	\N
4381	3624		\N	\N	\N	001012029006655	\N
4382	3086	26/00 0343054 B 09	2018-05-22 00:00:00	\N	\N		\N
4383	2282		\N	\N	\N		\N
4384	4591		\N	\N	\N		\N
4385	2783	02 B 0084331	2006-07-12 00:00:00	\N	\N	001105022428513	\N
4386	4583		\N	\N	\N		\N
4387	4411	41/00 0503102 B 19	2019-07-04 00:00:00	\N	\N	00213120920957	\N
4388	1087		\N	\N	\N		\N
4389	4153	43/00 0322240 B 99	2016-06-21 00:00:00	\N	\N	000529066306087	\N
4390	3887	02 B 0403213	2014-03-12 00:00:00	\N	\N		\N
4391	4076	07B0109234-31/00	2016-02-28 00:00:00	\N	\N	09992506275195	\N
4392	2291	24/00-0143300 B 07	2011-10-12 00:00:00	\N	\N		\N
4393	4473		\N	\N	\N	000725010018366	\N
4394	3842	22/00 - 0023068 B 05	2022-07-21 00:00:00	\N	\N	099916000973148	\N
4395	2530	05 B 0242591	2005-03-08 00:00:00	\N	\N		\N
4396	4262	05 B 0805429 - 00/09	2017-03-07 00:00:00	\N	\N	0001435369025631	\N
4397	4796		\N	\N	\N		\N
4398	3426	09 B 0047333	2010-11-30 00:00:00	\N	\N		\N
4399	1053		\N	\N	\N		\N
4400	4015	11 B 0224360	2011-08-14 00:00:00	\N	\N		\N
4401	4800	04/00 - 0406306 B 21	2021-02-03 00:00:00	\N	\N	0998018230468	\N
4402	4048	12 B 1006084	2015-07-16 00:00:00	\N	\N	000607024269295	\N
4403	1754		\N	\N	\N		\N
4404	1118		\N	\N	\N	002131011830542	\N
4405	2798	28/00 -  0922271 B 98	2021-08-31 00:00:00	\N	\N		\N
4406	1104		\N	\N	\N		\N
4407	4613		\N	\N	\N		\N
4408	4314	13 B 0663597	2023-01-22 00:00:00	\N	\N		\N
4409	4735	39/00 - 0543976 B 16	2023-02-28 00:00:00	\N	\N	001519010045753	\N
4410	4655		\N	\N	\N		\N
4411	1892	33/00 - 0122651 B 99	2020-12-01 00:00:00	\N	\N		\N
4412	2708		\N	\N	\N		\N
4413	3182	08 B 0023374	2019-03-11 00:00:00	\N	\N		\N
4414	4780	16/00-1010236 B15	2021-03-24 00:00:00	\N	\N	001022002350787	\N
4415	4230	03 B 0322743	2009-06-01 00:00:00	\N	\N	001022002350787	\N
4416	4078	05/00-0225184 B 15	2016-11-16 00:00:00	\N	\N	001022002350787	\N
4417	3458	16/00 – 0979866 B 08	2017-02-15 00:00:00	\N	\N		\N
4418	4671		\N	\N	\N		\N
4419	4672		\N	\N	\N		\N
4420	4673		\N	\N	\N		\N
4421	4674		\N	\N	\N		\N
4422	4675		\N	\N	\N		\N
4423	4676	00 B 46/02-0262653	2015-09-15 00:00:00	\N	\N		\N
4424	4677		\N	\N	\N		\N
4425	4124	10 B 0323498	2018-11-21 00:00:00	\N	\N	113201500167	\N
4426	4513		\N	\N	\N	099712020501543	\N
4427	3683	07 B 0046819	2010-04-28 00:00:00	\N	\N		\N
4428	4489		\N	\N	\N		\N
4429	4490		\N	\N	\N		\N
4430	3758	99 B 0162208	2008-07-01 00:00:00	\N	\N	099722010400936	\N
4431	3787	98 B 0902173	2008-08-04 00:00:00	\N	\N		\N
4432	4208	10/00-0283294 B 08	2012-05-02 00:00:00	\N	\N		\N
4433	4686		\N	\N	\N		\N
4434	3606		\N	\N	\N	098909150012635	\N
4435	3935	13 B 0069997 - 25/00	2023-07-10 00:00:00	\N	\N		\N
4436	4781	13/00 - 0265805 B 22	2022-08-04 00:00:00	\N	\N		\N
4437	4042	15 B 0324036	2015-08-03 00:00:00	\N	\N		\N
4438	3453		\N	\N	\N		\N
4439	4785		\N	\N	\N		\N
4440	4786		\N	\N	\N		\N
4441	4787	16/00-0725766B10	2016-11-17 00:00:00	\N	\N	001216100608472	\N
4442	4788		\N	\N	\N		\N
4443	4789		\N	\N	\N		\N
4444	4122	00 B 0562293-00/28	2016-05-12 00:00:00	\N	\N		\N
4445	4236	31/00-0117016 B 17	2017-04-11 00:00:00	\N	\N	002019009425991	\N
4446	4479		\N	\N	\N		\N
4447	4480		\N	\N	\N		\N
4448	4481		\N	\N	\N		\N
4449	4482		\N	\N	\N	0615229008544	\N
4450	4139	06 B 0583200	2007-12-05 00:00:00	\N	\N	0615229008544	\N
4451	3816	12 B 1006084	2012-07-11 00:00:00	\N	\N		\N
4452	3956	05 B 0583062-12/00	2021-11-30 00:00:00	\N	\N		\N
4453	3957	99 B 0562211	2013-10-23 00:00:00	\N	\N		\N
4454	4059	07 B 0223665	2012-10-02 00:00:00	\N	\N		\N
4455	4656		\N	\N	\N		\N
4456	4657		\N	\N	\N		\N
4457	4658		\N	\N	\N	099928119094400	\N
4458	4659		\N	\N	\N		\N
4459	4660		\N	\N	\N		\N
4460	4661		\N	\N	\N		\N
4461	4662		\N	\N	\N		\N
4462	4663		\N	\N	\N		\N
4463	4269	08/00-0943062 B 13	2018-09-26 00:00:00	\N	\N	25074074011	\N
4464	4213	06 B 0086567 19/00	2016-12-13 00:00:00	\N	\N	001302090007272	\N
4465	3519		\N	\N	\N		\N
4466	3933	12 B 0224616	2014-03-11 00:00:00	\N	\N		\N
4467	158	0904556 B 04	2004-01-07 00:00:00	\N	\N		\N
4468	2088	98 B 0802124	1999-05-15 00:00:00	\N	\N	000620019002460	\N
4469	2094	31/00-0107108 B 04	2014-05-06 00:00:00	\N	\N		\N
4470	2095		\N	\N	\N		\N
4471	2049		\N	\N	\N		\N
4472	4270	15/00-0049820 B 15	2015-06-11 00:00:00	\N	\N		\N
4473	1044		\N	\N	\N		\N
4474	3967	09 B0702392-38/00	2024-09-23 00:00:00	\N	\N		\N
4475	4626		\N	\N	\N		\N
4476	4030	15 B 0923613	2015-05-17 00:00:00	\N	\N		\N
4477	3671	10 B 0985240	2010-04-07 00:00:00	\N	\N		\N
4478	3753	08 B 0124072	2008-02-18 00:00:00	\N	\N	001022002350787	\N
4479	3834	00264603 B 13	2014-01-24 00:00:00	\N	\N	001022002350787	\N
4480	3836		\N	\N	\N	001022002350787	\N
4481	3838		\N	\N	\N	000815599009136	\N
4482	1150	15/00 – 00447740 B 02	2019-12-30 00:00:00	\N	\N	000815599009136	\N
4483	1153		\N	\N	\N		\N
4484	3653	02 B 0882337	2002-05-22 00:00:00	\N	\N		\N
4485	3603	03 B 0065298	2003-06-01 00:00:00	\N	\N		\N
4486	4235	15 B 0997282	2017-12-20 00:00:00	\N	\N		\N
4487	4485		\N	\N	\N		\N
4488	3658		\N	\N	\N		\N
4489	565		\N	\N	\N	001443030005662	\N
4490	3459		\N	\N	\N	001443030005662	\N
4491	4669		\N	\N	\N		\N
4492	4723	99  B 0022256	2019-10-30 00:00:00	\N	\N		\N
4493	4645		\N	\N	\N		\N
4494	3870	11 B 0563308	2012-05-30 00:00:00	\N	\N		\N
4495	4231	15 B 0366102	2022-05-22 00:00:00	\N	\N		\N
4496	3802	98 B 0662048 29/00	2010-05-10 00:00:00	\N	\N		\N
4497	3632		\N	\N	\N	000512058306162	\N
4498	3633		\N	\N	\N		\N
4499	4345	03 B 0723870	\N	\N	\N	898828270504816	\N
4500	2778	98 B 0082658	2004-04-20 00:00:00	\N	\N	898828270504816	\N
4501	2526		\N	\N	\N		\N
4502	3466		\N	\N	\N		\N
4503	4633		\N	\N	\N		\N
4504	3674		\N	\N	\N		\N
4505	3839	19/00-0562211 B 99	2010-04-12 00:00:00	\N	\N		\N
4506	3998	08 B 0543090	2008-06-04 00:00:00	\N	\N		\N
4507	2751	05 B 0742373	2005-02-02 00:00:00	\N	\N		\N
4508	4049	00 B 462572	2015-12-06 00:00:00	\N	\N	002416120052557	\N
4509	4729		\N	\N	\N		\N
4510	4538	43/00-0322199 B 98	2021-04-25 00:00:00	\N	\N		\N
4511	3529	08B0782913	2020-03-18 00:00:00	\N	\N		\N
4512	1664	0142220 B989	2017-09-10 00:00:00	\N	\N		\N
4513	4337	11/00-0202291 B 10	2017-02-22 00:00:00	\N	\N		\N
4514	4338		\N	\N	\N		\N
4515	4634		\N	\N	\N		\N
4516	3067	07/00 – 0242730 B 07	2019-04-04 00:00:00	\N	\N		\N
4517	4712		\N	\N	\N		\N
4518	3779	98 B 2500-0062245	2015-09-10 00:00:00	\N	\N		\N
4519	4711		\N	\N	\N		\N
4520	4307	16 B 0544022	2016-08-02 00:00:00	\N	\N		\N
4521	2303	98 B 0822061	2010-04-01 00:00:00	\N	\N		\N
4522	4938	16/00-1019896 B 24	2024-02-04 00:00:00	\N	\N	001028209004745	\N
4523	4939	16/00-01204052 B 24	2024-02-12 00:00:00	\N	\N		\N
4524	3573		\N	\N	\N		\N
4525	4171		\N	\N	\N	000948016290928	\N
4526	4696	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4527	4002	18/00 - 0724726 B 06	2021-05-09 00:00:00	\N	\N		\N
4528	3939	13/00 0264092 B 10	2013-04-16 00:00:00	\N	\N		\N
4529	4430	n° 14/00-0423172 B11	2018-02-28 00:00:00	\N	\N		\N
4530	4431	0422922 B 07	2018-12-02 00:00:00	\N	\N		\N
4531	2506	03 B 0382616	2006-05-09 00:00:00	\N	\N		\N
4532	4379	17B0999383-00/16	2019-01-31 00:00:00	\N	\N		\N
4533	4381		\N	\N	\N		\N
4534	4222	16 B 0092196	2016-04-27 00:00:00	\N	\N		\N
4535	3918		\N	\N	\N		\N
4536	4736	03/00-0923704 B17	2019-06-24 00:00:00	\N	\N		\N
4537	4357	06/00-0182304B98	2018-02-11 00:00:00	\N	\N		\N
4538	4205		\N	\N	\N		\N
4539	3886	05 B 0066637 - 25/00	2019-05-20 00:00:00	\N	\N	099935072248634	\N
4540	4831		\N	\N	\N		\N
4541	4832		\N	\N	\N		\N
4542	4833	05/00 - 0226185 B 20	2020-08-30 00:00:00	\N	\N		\N
4543	4835		\N	\N	\N		\N
4544	4836	42/00-0523040 b03	2021-04-25 00:00:00	\N	\N	001113239001555	\N
4545	3962	09/00 - 0808733 B 15	2023-03-22 00:00:00	\N	\N		\N
4546	4057		\N	\N	\N		\N
4547	4291		\N	\N	\N		\N
4548	4700	31/00-1123597B20	2020-12-17 00:00:00	\N	\N	000505019007357	\N
4549	3611		\N	\N	\N	000505019007357	\N
4550	4297	01/00-0882871 B 15	2015-09-03 00:00:00	\N	\N		\N
4551	3612		\N	\N	\N		\N
4552	4600		\N	\N	\N		\N
4553	4601		\N	\N	\N		\N
4554	4602		\N	\N	\N		\N
4555	4603		\N	\N	\N		\N
4556	4316	16 B 0663811	2016-04-24 00:00:00	\N	\N		\N
4557	2873	07 B 0223665	2007-03-19 00:00:00	\N	\N	097701110015450	\N
4558	581		\N	\N	\N		\N
4559	3684		\N	\N	\N		\N
4560	4134	07 B 05832330  12/00	2011-06-20 00:00:00	\N	\N	099935220357516	\N
4561	3775	05 B 0364003	2008-03-31 00:00:00	\N	\N	099822469091105	\N
4562	4378	20/00-0742384B05	2016-05-16 00:00:00	\N	\N		\N
4563	4857		\N	\N	\N	001528056397418	\N
4564	4858		\N	\N	\N	001026460001758	\N
4565	4859		\N	\N	\N		\N
4566	4860		\N	\N	\N		\N
4567	4841	16/00-0464642B13	2024-03-26 00:00:00	\N	\N		\N
4568	4846	42/00-0525644 B 22	2022-03-02 00:00:00	\N	\N	0219200275453	\N
4569	4847	39/02-0544741 B21	2021-09-07 00:00:00	\N	\N		\N
4570	4848	11/00 - 0202701 B 22	2022-03-31 00:00:00	\N	\N	990562135	\N
4571	4849	30/00-0063309 B99	2023-01-15 00:00:00	\N	\N		\N
4572	4408	17B 0923728	2019-01-09 00:00:00	\N	\N		\N
4573	4225	98 B 0902234	2014-02-27 00:00:00	\N	\N		\N
4574	4226	14 B 0808451	2016-02-29 00:00:00	\N	\N		\N
4575	4166	13 B 0405255	2016-04-05 00:00:00	\N	\N		\N
4576	4167		\N	\N	\N		\N
4577	4170	07 B 0263553	2011-05-08 00:00:00	\N	\N		\N
4578	2776	05 B 0969613	2005-12-13 00:00:00	\N	\N	099905421135426	\N
4579	4885	35/00-0977480 B 07	2023-09-27 00:00:00	\N	\N	000202090417475	\N
4580	4886	11 B 0983757	2020-12-24 00:00:00	\N	\N		\N
4581	4887	98 B 0822021	2023-01-24 00:00:00	\N	\N		\N
4582	4888	05/00-0226839 b23	2023-09-12 00:00:00	\N	\N		\N
4583	4721	19 B 0544377	2019-04-11 00:00:00	\N	\N	000305450565644	\N
4584	4722	14 B 0808565	2022-01-04 00:00:00	\N	\N	000724019001652	\N
4585	4113		\N	\N	\N		\N
4586	3678		\N	\N	\N	000820074247695	\N
4587	392	0862862/ B05	2016-10-17 00:00:00	\N	\N		\N
4588	2540	05 B 0904865	2005-01-19 00:00:00	\N	\N		\N
4589	3966	09 B 0702392	2009-08-02 00:00:00	\N	\N	00924239004249	\N
4590	4034	14 B 0995688	2015-09-20 00:00:00	\N	\N		\N
4591	4024	09 B 0942971 - 08/00	2018-03-07 00:00:00	\N	\N	000201010546860	\N
4592	4026	00 B0063968	2003-07-07 00:00:00	\N	\N		\N
4593	4801		\N	\N	\N		\N
4594	4062	07 B 0463575	2008-10-29 00:00:00	\N	\N		\N
4595	486	99 B 63146	1999-08-23 00:00:00	\N	\N		\N
4596	4622		\N	\N	\N		\N
4597	4514		\N	\N	\N	000712030008175	\N
4598	3851	08 B 0976991-16/001	2014-05-11 00:00:00	\N	\N		\N
4599	3559		\N	\N	\N		\N
4600	3829	11 B 0302970	2011-11-13 00:00:00	\N	\N	0997310110204732	\N
4601	4523		\N	\N	\N		\N
4602	3626		\N	\N	\N		\N
4603	3627		\N	\N	\N		\N
4604	4425	11/00-0202454 B17	2020-01-28 00:00:00	\N	\N	000719010009169	\N
4605	4182	22/00-0024250 B 16	2020-01-07 00:00:00	\N	\N	001334010010571	\N
4606	4255	39/00-0542719 B 04	2014-05-20 00:00:00	\N	\N		\N
4607	4593		\N	\N	\N		\N
4608	4790	05/00-0224281b11	2018-03-19 00:00:00	\N	\N		\N
4609	4791		\N	\N	\N		\N
4610	4356	98 B 0222220	2017-08-02 00:00:00	\N	\N		\N
4611	4884	n°15/00-0050086 B 16	2019-12-24 00:00:00	\N	\N		\N
4612	4333	43/00 0324238 B 17	2097-12-03 00:00:00	\N	\N		\N
4613	4336	16 B 0842847	2016-06-02 00:00:00	\N	\N		\N
4614	3999		\N	\N	\N		\N
4615	4694	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4616	4741		\N	\N	\N		\N
4617	3808	00 B 0662346	2010-04-19 00:00:00	\N	\N	099702020480433	\N
4618	3817	09 B 0088057	2014-06-03 00:00:00	\N	\N		\N
4619	3818		\N	\N	\N		\N
4620	3867	16/00 0016868 B 01	2019-07-21 00:00:00	\N	\N		\N
4621	3717	06 B 0422855	2009-05-25 00:00:00	\N	\N		\N
4622	4115	25/00 - 0070944 B 15	2019-06-13 00:00:00	\N	\N	000828019010450	\N
4623	3869	13 B 0090457	2013-05-02 00:00:00	\N	\N		\N
4624	4637		\N	\N	\N		\N
4625	3118	13/00-0263524 B 07	2018-06-24 00:00:00	\N	\N		\N
4626	4319	32/00 - 0622183 B 11	2013-04-07 00:00:00	\N	\N		\N
4627	4530	07/00-0242918 B 10	2015-07-20 00:00:00	\N	\N		\N
4628	4596		\N	\N	\N		\N
4629	4272	48/00-0162583 B 04	2013-10-19 00:00:00	\N	\N		\N
4630	3578	02 B 0382402	2008-05-17 00:00:00	\N	\N		\N
4631	3514		\N	\N	\N	0999350722578442	\N
4632	4749		\N	\N	\N		\N
4633	3557		\N	\N	\N		\N
4634	3558		\N	\N	\N		\N
4635	3277	03 B 0065454	2007-06-03 00:00:00	\N	\N		\N
4636	4465		\N	\N	\N		\N
4637	4597		\N	\N	\N		\N
4638	4891	23 B 0622370	2023-03-22 00:00:00	\N	\N		\N
4639	4893	22 B 0073855	2022-12-19 00:00:00	\N	\N		\N
4640	4894	09 B 0423054	2019-03-07 00:00:00	\N	\N		\N
4641	4952	19 B 0883053	2019-01-17 00:00:00	\N	\N		\N
4642	4953	22 B 0525681	2022-06-19 00:00:00	\N	\N		\N
4643	4956	48/00 - 0163708 B 23	2023-03-06 00:00:00	\N	\N		\N
4644	3165	08 B 0463797	2016-03-31 00:00:00	\N	\N		\N
4645	3293	07 B 0724943	2009-03-23 00:00:00	\N	\N	0016311011678577	\N
4646	3478	14/01 0983744 – B 09	2011-02-14 00:00:00	\N	\N		\N
4647	3813	07 B 0905554	2011-11-29 00:00:00	\N	\N		\N
4648	4398	06 B 0974302  16/00	2006-07-04 00:00:00	\N	\N		\N
4649	3547		\N	\N	\N		\N
4650	4298	12/00 -0583175 B 06	2017-02-07 00:00:00	\N	\N		\N
4651	4299		\N	\N	\N		\N
4652	3889	08 B 0562978	2008-02-13 00:00:00	\N	\N	099845020533917	\N
4653	3890		\N	\N	\N		\N
4654	3892	98 B 0342025	2010-05-16 00:00:00	\N	\N		\N
4655	3672	0382848 B11	2011-03-31 00:00:00	\N	\N		\N
4656	4582		\N	\N	\N		\N
4657	3634		\N	\N	\N		\N
4658	4739	13/00-0265725 B21	2021-10-21 00:00:00	\N	\N		\N
4659	3520		\N	\N	\N		\N
4660	3053	08 B 0342992-26/00	2022-03-06 00:00:00	\N	\N		\N
4661	1324		\N	\N	\N		\N
4662	4733	14B0323895-00/43	2020-02-23 00:00:00	\N	\N		\N
4663	2519	27/00-0964647B04	2015-09-15 00:00:00	\N	\N	000809010001472	\N
4664	3652	06 B 0422859	2011-08-09 00:00:00	\N	\N	000212010489357	\N
4665	3414	09 B 0725316	2009-02-18 00:00:00	\N	\N		\N
4666	3554		\N	\N	\N	099906260052133	\N
4667	2669	0882250 B 00	2012-01-29 00:00:00	\N	\N		\N
4668	4009	15 B 0584348	2015-03-09 00:00:00	\N	\N		\N
4669	4198		\N	\N	\N		\N
4670	4376	14/00 0423172 B 11	2018-02-28 00:00:00	\N	\N		\N
4671	4377		\N	\N	\N		\N
4672	3640	16/00 – 0302220 B 99	2002-05-12 00:00:00	\N	\N		\N
4673	3642	10 B 0323496    43/00	2010-12-02 00:00:00	\N	\N		\N
4674	4877	23 B 0383590	2023-04-09 00:00:00	\N	\N	001215340020270	\N
4675	4303	12 B 0543499	2013-07-04 00:00:00	\N	\N		\N
4676	3676		\N	\N	\N		\N
4677	2967	97 B 0102047	1997-10-01 00:00:00	\N	\N		\N
4678	2968	07 B 0302825	2007-04-10 00:00:00	\N	\N		\N
4679	4704	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4680	4706		\N	\N	\N		\N
4681	4707		\N	\N	\N		\N
4682	4266	24/00-0382656 B 07	2017-03-22 00:00:00	\N	\N		\N
4683	4132	16 B 0683089   36/00	2016-04-11 00:00:00	\N	\N		\N
4684	4839	23 B 0565282	2023-01-31 00:00:00	\N	\N		\N
4685	4840	43/00-0324707 B 21	2021-06-29 00:00:00	\N	\N	098335160040240	\N
4686	4714		\N	\N	\N		\N
4687	4509		\N	\N	\N		\N
4688	4175	16/00 1010423 B 16	2016-01-19 00:00:00	\N	\N		\N
4689	3856	12 B 0726069	2012-01-19 00:00:00	\N	\N		\N
4690	1629		\N	\N	\N		\N
4691	4826		\N	\N	\N		\N
4692	4828	05/00 - 0225455 B 16	2021-01-06 00:00:00	\N	\N		\N
4693	4830		\N	\N	\N		\N
4694	4492		\N	\N	\N		\N
4695	4493		\N	\N	\N		\N
4696	4494		\N	\N	\N		\N
4697	4495		\N	\N	\N		\N
4698	4496		\N	\N	\N	001114259002551	\N
4699	4497		\N	\N	\N		\N
4700	4498		\N	\N	\N		\N
4701	4566		\N	\N	\N		\N
4702	4405	09 B 0242846	2018-11-06 00:00:00	\N	\N		\N
4703	4726	43/00-0322372B99	2019-03-14 00:00:00	\N	\N		\N
4704	3465	0422953B07	2007-12-18 00:00:00	\N	\N		\N
4705	4819	14 B 0882806	2020-12-10 00:00:00	\N	\N		\N
4706	4821	19 B 0125981	2021-09-24 00:00:00	\N	\N		\N
4707	4822		\N	\N	\N		\N
4708	4823		\N	\N	\N		\N
4709	3673		\N	\N	\N		\N
4710	1840	03 B 0422616 - 14/00	2019-01-09 00:00:00	\N	\N		\N
4711	3012	08 B 0979866	2017-02-15 00:00:00	\N	\N		\N
4712	3645	10 B 0583663	2010-10-17 00:00:00	\N	\N		\N
4713	3608		\N	\N	\N		\N
4714	2542	98 B 3364	1998-03-18 00:00:00	\N	\N		\N
4715	3115	06 B 0562899	2012-10-17 00:00:00	\N	\N	099516120536822	\N
4716	4393	03/00-0923129 B05	2016-09-22 00:00:00	\N	\N		\N
4717	4395		\N	\N	\N		\N
4718	4163	17/00 0302847 B 08	2009-03-15 00:00:00	\N	\N		\N
4719	4164		\N	\N	\N		\N
4720	4751		\N	\N	\N		\N
4721	3737		\N	\N	\N		\N
4722	4878	n°19-02-0087605 B08	2022-02-27 00:00:00	\N	\N		\N
4723	4880	06 B 0086624	2021-02-07 00:00:00	\N	\N		\N
4724	4389	06 B 0263453	2018-12-24 00:00:00	\N	\N		\N
4725	4929	n°06/00-0184380b03	2021-06-30 00:00:00	\N	\N	99935072257842	\N
4726	4930	n°06/00-0184380B03	2021-06-30 00:00:00	\N	\N	001932010000471	\N
4727	4931	16/00-1049983	2021-09-28 00:00:00	\N	\N		\N
4728	4933		\N	\N	\N		\N
4729	4934		\N	\N	\N	793145030015340	\N
4730	4935	31/00 - 0116785 B 16	2016-12-08 00:00:00	\N	\N		\N
4731	4936	22/00 - 0024277 B 16	2023-12-28 00:00:00	\N	\N	000213260139456	\N
4732	4027	12 B 0048716	2016-10-26 00:00:00	\N	\N		\N
4733	3739	98 B 0082396	2018-05-27 00:00:00	\N	\N		\N
4734	3397		\N	\N	\N		\N
4735	2716	02 B 0882337	2013-12-19 00:00:00	\N	\N		\N
4736	2903		\N	\N	\N		\N
4737	512		\N	\N	\N		\N
4738	1145	99 B 0522320	2014-02-17 00:00:00	\N	\N	099828270504816	\N
4739	2618	98 B 122338	1998-08-25 00:00:00	\N	\N	099828270504816	\N
4740	4535	N°04/00 - 0404188 B06	2018-09-12 00:00:00	\N	\N		\N
4741	3601	09 B 0423073	2009-10-08 00:00:00	\N	\N		\N
4742	3577		\N	\N	\N		\N
4743	3876	10 B 0502709	2014-02-19 00:00:00	\N	\N		\N
4744	3505	04 B 0066251	2010-12-12 00:00:00	\N	\N		\N
4745	3970	15 B 0423521	2015-09-01 00:00:00	\N	\N	001423020008370	\N
4746	4029	09 B 0124298	2018-02-26 00:00:00	\N	\N		\N
4747	4627		\N	\N	\N	000827069005443	\N
4748	4628		\N	\N	\N		\N
4749	3412	03 B 0282867	2006-08-20 00:00:00	\N	\N	099919008288302	\N
4750	2619	0905376B06	2006-06-19 00:00:00	\N	\N		\N
4751	3271	08 B 0980536	2011-05-17 00:00:00	\N	\N		\N
4752	2173	00 B 0442303	2010-06-09 00:00:00	\N	\N		\N
4753	4005	10 B 0088990	2014-05-14 00:00:00	\N	\N		\N
4754	4923	05 B 0263389	2023-10-29 00:00:00	\N	\N		\N
4755	4806	14 B 0124967	2014-04-14 00:00:00	\N	\N		\N
4756	4807	07 B 0263515	2022-02-16 00:00:00	\N	\N		\N
4757	4638		\N	\N	\N		\N
4758	3864	03 B 0021635	2007-04-18 00:00:00	\N	\N		\N
4759	3638	06 B 0742430	2010-09-21 00:00:00	\N	\N		\N
4760	4318	01/00-0882675 B 11	2012-06-19 00:00:00	\N	\N		\N
4761	4695	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4762	3938	35/00 - 0722724 B 99	2019-12-18 00:00:00	\N	\N		\N
4763	4702	16/00-1043757B17	2021-03-16 00:00:00	\N	\N		\N
4764	4703	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4765	3784	02 B 0017567	2011-07-04 00:00:00	\N	\N		\N
4766	4521		\N	\N	\N		\N
4767	4522		\N	\N	\N	002139180011556	\N
4768	3225	16/00-0980174 B 08	2013-08-26 00:00:00	\N	\N		\N
4769	2420	05 B 0422760	\N	\N	\N		\N
4770	3590		\N	\N	\N		\N
4771	4232	03 B 0223158	2012-04-12 00:00:00	\N	\N		\N
4772	4594	56/00-0612023B21	\N	\N	\N		\N
4773	3799	17/00-0986312 B 10	2015-12-29 00:00:00	\N	\N	000825006763783	\N
4774	4204	24/00 – 0383343 B 17	2022-01-03 00:00:00	\N	\N		\N
4775	4264	16 B 0663792	2016-02-02 00:00:00	\N	\N		\N
4776	3073	04 B 0107065	2019-03-25 00:00:00	\N	\N		\N
4777	4402	17 B 0544116  00/39	2022-08-03 00:00:00	\N	\N		\N
4778	4179	25/00-0068995 B 11	2016-04-20 00:00:00	\N	\N		\N
4779	4744	34/00-0465414 B 16	2016-06-09 00:00:00	\N	\N	0013001019001367	\N
4780	4315	29/00 0663635 B14	2024-02-04 00:00:00	\N	\N		\N
4781	3952	05/00 0224285 B 11	2021-07-07 00:00:00	\N	\N		\N
4782	4444		\N	\N	\N		\N
4783	4396	32/00 - 0622325 B 19	2019-04-10 00:00:00	\N	\N		\N
4784	4463		\N	\N	\N		\N
4785	4228	23/00 0363197 B 01	\N	\N	\N		\N
4786	4229	06 B 0382612	2014-12-14 00:00:00	\N	\N		\N
4787	4013		\N	\N	\N		\N
4788	4512		\N	\N	\N		\N
4789	3873	06 B 0862908	2013-04-08 00:00:00	\N	\N		\N
4790	1653		\N	\N	\N	099830012211258	\N
4791	4737	06 B 0322962	2022-03-20 00:00:00	\N	\N		\N
4792	3906	10 B 0242943	2010-06-29 00:00:00	\N	\N		\N
4793	4937	57/00 - 0542889 B 06	2022-04-10 00:00:00	\N	\N		\N
4794	4567		\N	\N	\N		\N
4795	4364		\N	\N	\N		\N
4796	4289		\N	\N	\N	000034046251933	\N
4797	4440		\N	\N	\N		\N
4798	4441		\N	\N	\N		\N
4799	4442		\N	\N	\N		\N
4800	4443		\N	\N	\N		\N
4801	4035	14 B 0365918	2016-05-09 00:00:00	\N	\N		\N
4802	3882	36/00-0682901 B11	2019-04-10 00:00:00	\N	\N	316130371163	\N
4803	4519		\N	\N	\N		\N
4804	4331		\N	\N	\N		\N
4805	4332	04/00 0405255 B 13	2016-04-05 00:00:00	\N	\N		\N
4806	580		\N	\N	\N		\N
4807	4632		\N	\N	\N		\N
4808	3704		\N	\N	\N		\N
4809	3555		\N	\N	\N	000448079001739	\N
4810	2395	06 B 0263400	2013-04-23 00:00:00	\N	\N		\N
4811	4459		\N	\N	\N		\N
4812	4234	25/00 0066021 B 04	2016-05-02 00:00:00	\N	\N		\N
4813	3058		\N	\N	\N		\N
4814	4271	30/00 0124557 B 11	2015-04-07 00:00:00	\N	\N		\N
4815	4476		\N	\N	\N	099216130232439	\N
4816	4477		\N	\N	\N		\N
4817	3392		\N	\N	\N		\N
4818	4944		\N	\N	\N		\N
4819	4945	N°43/00-0323971 B15	2024-01-08 00:00:00	\N	\N		\N
4820	4946	23 B 0467172	2023-12-28 00:00:00	\N	\N		\N
4821	4947	23 B 0467172	2023-12-28 00:00:00	\N	\N		\N
4822	4948	N°16/00-1052420 B24	2024-02-15 00:00:00	\N	\N		\N
4823	3460		\N	\N	\N		\N
4824	4340	16/00 0964595 B 04	2020-12-14 00:00:00	\N	\N	0205429016644	\N
4825	4469		\N	\N	\N		\N
4826	4478		\N	\N	\N		\N
4827	3525	07 B 0382656	2007-04-29 00:00:00	\N	\N		\N
4828	3922	25/00 - 0069652 B 12	2013-12-16 00:00:00	\N	\N		\N
4829	3192	21/00-0143565 B09	2020-08-06 00:00:00	\N	\N		\N
4830	2098		\N	\N	\N	00035072306136	\N
4831	3777	10 B 0323493	2010-10-13 00:00:00	\N	\N		\N
4832	3778	98 B 0122173	2010-11-07 00:00:00	\N	\N		\N
4833	4577		\N	\N	\N		\N
4834	3489	31/00 - 0110939 B 09	2009-07-07 00:00:00	\N	\N		\N
4835	4959	12 B 0264384	2023-12-19 00:00:00	\N	\N		\N
4836	4960	25/00 - 0063515 B 00	2018-07-15 00:00:00	\N	\N		\N
4837	4961	n°02/01-0906574 B 13	2018-01-07 00:00:00	\N	\N		\N
4838	4206	14 B 0563739 - 00/28	2018-01-03 00:00:00	\N	\N	001132062218198	\N
4839	4241	16 B 0225385	2016-04-25 00:00:00	\N	\N		\N
4840	4242	16/00 - 1042847 B 16	2021-01-13 00:00:00	\N	\N		\N
4841	3963	01/00-0882018 B 98	2014-02-19 00:00:00	\N	\N		\N
4842	3964	09/00-0804651 B 04	2006-03-12 00:00:00	\N	\N	001022002350787	\N
4843	3965	44/00 - 0764324 B 11	2019-03-26 00:00:00	\N	\N	001022002350787	\N
4844	3896	07 B 0162741	2013-12-30 00:00:00	\N	\N	001022002350787	\N
4845	3712		\N	\N	\N	000630012382518	\N
4846	963		\N	\N	\N		\N
4847	3134		\N	\N	\N		\N
4848	3738	04/00 - 0403134 B 02	2018-11-05 00:00:00	\N	\N	00130404052559100000	\N
4849	3549		\N	\N	\N		\N
4850	4882	30/00 - 0543166 b 09	2020-07-20 00:00:00	\N	\N		\N
4851	4883		\N	\N	\N	001816104537004	\N
4852	4401	34/00 - 0463608 B 07	2014-09-15 00:00:00	\N	\N		\N
4853	4852	19/ B 0406056	2022-12-26 00:00:00	\N	\N	96794710005835	\N
4854	4853		\N	\N	\N		\N
4855	2604	19/00 - 0084151 B 01	2021-12-28 00:00:00	\N	\N		\N
4856	3490	07 B 0364445	2009-01-13 00:00:00	\N	\N		\N
4857	4940	35/00-0726976 B 14	2021-12-28 00:00:00	\N	\N		\N
4858	3898	99 B 0082883 - 19/00	2023-07-27 00:00:00	\N	\N		\N
4859	2598		\N	\N	\N	02090367534	\N
4860	4508		\N	\N	\N		\N
4861	3941		\N	\N	\N		\N
4862	4590		\N	\N	\N		\N
4863	2966	07 B 0263596	2007-10-23 00:00:00	\N	\N		\N
4864	3860	02/00 0904174 B 02	2012-07-29 00:00:00	\N	\N		\N
4865	3604		\N	\N	\N		\N
4866	3605		\N	\N	\N		\N
4867	4470		\N	\N	\N		\N
4868	3116	00 B 0862476	2007-11-28 00:00:00	\N	\N	19580627001738	\N
4869	4693	N° 0402414 B99	2006-05-27 00:00:00	\N	\N		\N
4870	1101		\N	\N	\N		\N
4871	4896		\N	\N	\N		\N
4872	4897		\N	\N	\N		\N
4873	4765	43/00-0323895 B 14	2023-02-13 00:00:00	\N	\N		\N
4874	4652		\N	\N	\N		\N
4875	4728		\N	\N	\N		\N
4876	4980	03 B 0065360	2020-08-09 00:00:00	\N	\N		\N
4877	4511		\N	\N	\N		\N
4878	3587		\N	\N	\N	001030012438682	\N
4879	4224	16/00 0998966 B16	2016-04-25 00:00:00	\N	\N		\N
4880	3533	16/00 – 0343125 B 10	2020-12-24 00:00:00	\N	\N		\N
4881	4814	21 B 0303778	2021-05-23 00:00:00	\N	\N	099312020114056	\N
4882	4244	01/00 - 0882628 B 09	2019-07-22 00:00:00	\N	\N		\N
4883	4630		\N	\N	\N		\N
4884	4916	19/00-0093873 B 19	2023-11-28 00:00:00	\N	\N		\N
4885	5002	0782457 B 03	2023-08-22 00:00:00	\N	\N		\N
4886	4383		\N	\N	\N		\N
4887	2215		\N	\N	\N		\N
4888	4067	09 B 0223967	2009-03-23 00:00:00	\N	\N		\N
4889	5011	43/01-0322367 B 99	2016-08-29 00:00:00	\N	\N		\N
4890	5060	25/00 - 0067303 B 07	2023-08-08 00:00:00	\N	\N	305022312462	\N
4891	5062		\N	\N	\N		\N
4892	4906	13 B 0563686 - 28/00	2019-10-01 00:00:00	\N	\N		\N
4893	4907	12/00-0585138 B 23	2023-11-30 00:00:00	\N	\N		\N
4894	4910	06 B 0242651	2023-04-25 00:00:00	\N	\N		\N
4895	5051		\N	\N	\N	000110360017369	\N
4896	5000	03 B 0223084	2024-03-25 00:00:00	\N	\N		\N
4897	4949	31/00 - 0115764 B 15	2022-10-17 00:00:00	\N	\N	000306250770256	\N
4898	2870		\N	\N	\N	000306250770256	\N
4899	3610		\N	\N	\N		\N
4900	4911	23/00-0365952 B 14	2022-01-09 00:00:00	\N	\N		\N
4901	4464		\N	\N	\N		\N
4902	2670		\N	\N	\N		\N
4903	4072	12/00 0584462 B 16	2016-04-17 00:00:00	\N	\N	000809080617154	\N
4904	4075		\N	\N	\N		\N
4905	4904	06 B 0242651	2023-04-25 00:00:00	\N	\N		\N
4906	5026	45/00-0822545 B 23	2023-12-11 00:00:00	\N	\N		\N
4907	4816		\N	\N	\N		\N
4908	3947	04 B 0322806	2014-04-08 00:00:00	\N	\N		\N
4909	4864	16/00 – 1006084 B 12	2022-04-12 00:00:00	\N	\N		\N
4910	4865		\N	\N	\N		\N
4911	4997	00 B 022261605/01	2016-11-24 00:00:00	\N	\N		\N
4912	5003	22 B 0406517	2022-11-09 00:00:00	\N	\N		\N
4913	5004	05 B 0263305	2024-03-04 00:00:00	\N	\N		\N
4914	3528	09 B 0088481	2009-12-14 00:00:00	\N	\N	001616104284729	\N
4915	5005		\N	\N	\N	001919010032068	\N
4916	5063	45/00-0822513B22	2022-03-07 00:00:00	\N	\N	00016001436218	\N
4917	5064	06 B 0322956	2023-06-27 00:00:00	\N	\N	099919310991115	\N
4918	4869		\N	\N	\N		\N
4919	1913		\N	\N	\N		\N
4920	4580		\N	\N	\N		\N
4921	4969	98 B 0702044	2023-04-25 00:00:00	\N	\N		\N
4922	4968	05 B 0263331	2021-09-16 00:00:00	\N	\N	002031112359745	\N
4923	4871	31/00-0109341 B07	2018-12-27 00:00:00	\N	\N		\N
4924	4918	05/00 - 0226506 B 22	2022-05-25 00:00:00	\N	\N		\N
4925	4863		\N	\N	\N		\N
4926	3647	09 B 0364981	2009-09-15 00:00:00	\N	\N		\N
4927	5032	23 B 0565579	2023-12-26 00:00:00	\N	\N		\N
4928	5023	0544290 B 18	2018-10-01 00:00:00	\N	\N		\N
4929	4322	99 B 0222381  00/05	1999-03-16 00:00:00	\N	\N		\N
4930	3644	0987302 B 11	2011-03-09 00:00:00	\N	\N		\N
4931	1956		\N	\N	\N		\N
4932	4867		\N	\N	\N		\N
4933	4868		\N	\N	\N		\N
4934	4985	19/00-0093655B19	2021-04-26 00:00:00	\N	\N		\N
4935	5081	0071532 B 17	2020-02-23 00:00:00	\N	\N		\N
4936	5008	43/01-0322367 B 99	2016-08-29 00:00:00	\N	\N		\N
4937	5084	21B0943259-00/08	2021-02-09 00:00:00	\N	\N		\N
4938	5085	16/00-1282869 B24	2024-12-03 00:00:00	\N	\N		\N
4939	5086	47/00-0863552 B16	2017-05-08 00:00:00	\N	\N		\N
4940	4982	47/00 - 0863624 B 17	2017-11-27 00:00:00	\N	\N		\N
4941	4983	47/00 - 0863624 B 17	2017-11-27 00:00:00	\N	\N		\N
4942	4370	05 B 0363980	2018-09-02 00:00:00	\N	\N	000234046285636	\N
4943	4371		\N	\N	\N		\N
4944	4372		\N	\N	\N		\N
4945	4570		\N	\N	\N		\N
4946	5065	06 B 0322956	2023-06-27 00:00:00	\N	\N		\N
4947	4912	39/00-0543870 B 15	2020-11-10 00:00:00	\N	\N	000809080617154	\N
4948	3805	04/00-0404546 B 08	\N	\N	\N		\N
4949	4589		\N	\N	\N		\N
4950	4491		\N	\N	\N		\N
4951	4382	05 B 0970946   16/00	2012-04-10 00:00:00	\N	\N		\N
4952	4999	00 B 0442276	2024-03-20 00:00:00	\N	\N		\N
4953	4499		\N	\N	\N	002213350007266	\N
4954	4500		\N	\N	\N		\N
4955	4501		\N	\N	\N		\N
4956	4502		\N	\N	\N		\N
4957	4503		\N	\N	\N		\N
4958	4504		\N	\N	\N		\N
4959	3659		\N	\N	\N		\N
4960	3924	34/00-0464974 B 14	2014-07-22 00:00:00	\N	\N		\N
4961	4903	01 B 0242389	2023-08-01 00:00:00	\N	\N		\N
4962	4996	19/00-0086174 B05	2020-11-15 00:00:00	\N	\N		\N
4963	4172	30/00-0123936 B 06	2015-06-17 00:00:00	\N	\N	000414042271617	\N
4964	5072	16B0882909-00/01	2020-01-29 00:00:00	\N	\N		\N
4965	4950	07 B 0404277 - 04/00	2021-04-11 00:00:00	\N	\N		\N
4966	4917	39/00 - 1009537 B 15	2023-02-12 00:00:00	\N	\N		\N
4967	393	98 B 0702044	2019-08-20 00:00:00	\N	\N		\N
4968	4967	04 B 0964647	2023-08-09 00:00:00	\N	\N	001316130014369	\N
4969	4984	47/00 - 0863624 B 17	2017-11-27 00:00:00	\N	\N	001316130014369	\N
4970	5007	31/00-0116800 B16	2018-03-29 00:00:00	\N	\N		\N
4971	5073		\N	\N	\N		\N
4972	4629		\N	\N	\N	000525010581356	\N
4973	5052	16/00- 1282572 B24	2024-04-02 00:00:00	\N	\N	000734019008545	\N
4974	4123	30/00 0124866 B13	2013-09-19 00:00:00	\N	\N		\N
4975	2636	30/00-0122101 B 97	2017-02-09 00:00:00	\N	\N		\N
4976	4901	n°48/00-0163145 B13	2022-11-03 00:00:00	\N	\N		\N
4977	5056	37/00-0642331 B22	2024-04-18 00:00:00	\N	\N	000210010784949	\N
4978	5057	37/00 - 0642277 B 20	2021-09-01 00:00:00	\N	\N		\N
4979	5058	24B 0227050 - 05/00	2024-07-03 00:00:00	\N	\N		\N
4980	3912	11 B 0622181	2017-10-30 00:00:00	\N	\N		\N
4981	3580		\N	\N	\N		\N
4982	1066	98 B 0005100	2006-03-18 00:00:00	\N	\N	99702029060323	\N
4983	5033	12 B 0124590	2023-09-07 00:00:00	\N	\N		\N
4984	5018		\N	\N	\N		\N
4985	5021		\N	\N	\N		\N
4986	1148		\N	\N	\N		\N
4987	4668		\N	\N	\N	000841019000847	\N
4988	3913	09 B 0088371 - 19/00	2023-11-21 00:00:00	\N	\N	000630012382518	\N
4989	4007	55/00 - 0125014 B 14	2023-07-10 00:00:00	\N	\N		\N
4990	3731	06 B 0046309	2013-06-25 00:00:00	\N	\N		\N
4991	4021	13 B 0584099 - 12/00	2016-01-03 00:00:00	\N	\N		\N
4992	5009	43/01-0322367 B99	2016-08-29 00:00:00	\N	\N		\N
4993	5027	04/00-0406926 B 23	2023-12-11 00:00:00	\N	\N		\N
4994	5029	16/00-0366035 B 14	2024-04-29 00:00:00	\N	\N		\N
4995	4989	19/00-0094404 B21	2021-04-01 00:00:00	\N	\N		\N
4996	4990		\N	\N	\N		\N
4997	4872	19 B 0664054 - 29/00	2022-06-23 00:00:00	\N	\N		\N
4998	4873		\N	\N	\N		\N
4999	4874		\N	\N	\N	099819008236319	\N
5000	5010	43/01-0322367 B99	2016-08-29 00:00:00	\N	\N		\N
5001	3951	16/00 0014340 B 00	2013-03-18 00:00:00	\N	\N		\N
5002	2427	02 B 0021262	\N	\N	\N		\N
5003	5054	30/00-0126203 B 20	2024-03-06 00:00:00	\N	\N		\N
5004	5055	30/00-0125161B15	2021-10-03 00:00:00	\N	\N		\N
5005	4854	08 B 0563005	2023-05-02 00:00:00	\N	\N		\N
5006	5025		\N	\N	\N		\N
5007	4998	23 B 0664349	2023-12-24 00:00:00	\N	\N		\N
5008	4803		\N	\N	\N		\N
5009	3535	07 B 0463613	2010-09-28 00:00:00	\N	\N		\N
5010	5001		\N	\N	\N		\N
5011	5035	12 B 0124590	2023-09-07 00:00:00	\N	\N	001004250001083	\N
5012	5036		\N	\N	\N		\N
5013	5075	19/00-0086777B06	2020-09-03 00:00:00	\N	\N		\N
5014	5077	24B0784379	2024-01-24 00:00:00	\N	\N		\N
5015	5078		\N	\N	\N		\N
5016	5079	03B0363611	2024-09-24 00:00:00	\N	\N		\N
5017	5080	B03-0363611	2024-09-24 00:00:00	\N	\N		\N
5018	4678	33/00-0602020 B99	2019-04-29 00:00:00	\N	\N		\N
5019	4818		\N	\N	\N		\N
5020	3501		\N	\N	\N		\N
5021	3260	43/00-0323209 B 08	2012-07-26 00:00:00	\N	\N	947049008731	\N
5022	4140	11 B 0583729  - 12/00	2016-04-13 00:00:00	\N	\N	001030012438682	\N
5023	1051		\N	\N	\N	000529066301475	\N
5024	4484		\N	\N	\N		\N
5025	5030	39/00-0543685 B 14	2024-07-25 00:00:00	\N	\N		\N
5026	4571		\N	\N	\N	002419300063941	\N
5027	4991	25/00-007775 B08	2021-05-27 00:00:00	\N	\N		\N
5028	3994	04/00-0405420 B 14	2014-06-12 00:00:00	\N	\N		\N
5029	4973	08 B 0087684	2022-03-13 00:00:00	\N	\N		\N
5030	3161	16/00-0976903 B08	2008-04-13 00:00:00	\N	\N		\N
5031	4525		\N	\N	\N		\N
5032	5006	05/00-0225962 B19	2021-03-18 00:00:00	\N	\N		\N
5033	4245		\N	\N	\N	0816097790139	\N
5034	5022		\N	\N	\N	001416099511244	\N
5035	5024		\N	\N	\N		\N
5036	4974	17 B 0324237	2017-08-30 00:00:00	\N	\N	000842279002442	\N
5037	4970		\N	\N	\N		\N
5038	4971		\N	\N	\N		\N
5039	5041	10 B 0404829	2023-10-29 00:00:00	\N	\N		\N
5040	4404	16 B 0383315	2017-11-06 00:00:00	\N	\N		\N
5041	4584		\N	\N	\N		\N
5042	4585		\N	\N	\N		\N
5043	5066	34/00 - 0463936 B 09	2024-09-24 00:00:00	\N	\N		\N
5044	5067		\N	\N	\N		\N
5045	3226	02 B 0222915	2007-12-01 00:00:00	\N	\N		\N
5046	3698	10 B 0111547	2010-06-21 00:00:00	\N	\N		\N
5047	4569		\N	\N	\N		\N
5048	5087	39/00 - 0543330 B 11	2024-12-30 00:00:00	\N	\N		\N
5049	5091	21 B 16/00-1017383	2021-10-28 00:00:00	\N	\N	000110360017369	\N
5050	5093	19/00 - 0095905 B24	2024-07-25 00:00:00	\N	\N		\N
5051	5095	n° 14/00-0423172 B11	2018-02-28 00:00:00	\N	\N		\N
5052	5096		\N	\N	\N	099916000775940	\N
5053	5097	21 B 0544684	2021-04-08 00:00:00	\N	\N		\N
5054	5098	24 B 0266160	2024-10-27 00:00:00	\N	\N		\N
5055	5099	35/00 - 0727510 B 16	2024-11-27 00:00:00	\N	\N		\N
5056	5100		\N	\N	\N		\N
5057	5101		\N	\N	\N		\N
5058	5103		\N	\N	\N		\N
5059	5105	05 B 0782642	2016-05-31 00:00:00	\N	\N		\N
5060	5106	99 B 0382216	2024-08-22 00:00:00	\N	\N		\N
5061	5107		\N	\N	\N		\N
5062	5108	08 B 0806171	2024-12-17 00:00:00	\N	\N	001615010008161	\N
5063	5109	07 B 0702357	2024-10-27 00:00:00	\N	\N		\N
5064	5111	39/00-0542311B00	2021-07-19 00:00:00	\N	\N		\N
5065	4117		\N	\N	\N	195027300006937	\N
5066	4810	06 B 0724700 35/00	2020-12-24 00:00:00	\N	\N		\N
5067	4811	05 B 0123733 30/00	2016-03-15 00:00:00	\N	\N	000731040033268	\N
5068	4812	08 B 0087320	2022-01-27 00:00:00	\N	\N		\N
5069	3553		\N	\N	\N		\N
5070	5083	13/00-0264119B11	2011-01-16 00:00:00	\N	\N		\N
5071	5016	07/00-0243745 B18	2020-12-03 00:00:00	\N	\N		\N
5072	4922	19/00-0094259 B 20	2023-06-15 00:00:00	\N	\N		\N
5073	4111	98 B 062022 - 01/32	2016-05-08 00:00:00	\N	\N		\N
5074	4617		\N	\N	\N		\N
5075	3872	06 B 0905403	2013-03-17 00:00:00	\N	\N	001139010001765002	\N
5076	4986	13/000262736 B01	2019-02-19 00:00:00	\N	\N		\N
5077	4870	12/00 - 0584647 B 18	2020-02-23 00:00:00	\N	\N	000129010458552	\N
5078	5068		\N	\N	\N		\N
5079	5069		\N	\N	\N		\N
5080	5070	45/00-0822512B22	2022-02-27 00:00:00	\N	\N		\N
5081	4978	31/00-0117291 b18	2018-01-09 00:00:00	\N	\N		\N
5082	4920	28/00-0565102 B 22	2022-01-27 00:00:00	\N	\N		\N
5083	4914	23 B 0095194	2023-03-28 00:00:00	\N	\N		\N
5084	4902	28/00-0563167	2017-12-10 00:00:00	\N	\N		\N
5085	3961	0105738 B 02	2014-04-30 00:00:00	\N	\N		\N
5086	4223	14 B 0808451	\N	\N	\N		\N
5087	4618		\N	\N	\N		\N
5088	5042	05 B 0223448	2023-08-06 00:00:00	\N	\N		\N
5089	3236		\N	\N	\N		\N
5090	4802	18 B 0642233-00/37	2022-06-09 00:00:00	\N	\N	0004166096631415	\N
5091	5053	16/00-1001757 B 21	2021-11-11 00:00:00	\N	\N		\N
5092	4247	30/00-0124012 B 07	2014-11-16 00:00:00	\N	\N		\N
5093	4616		\N	\N	\N		\N
5094	4987	14/00-0423737 B18	2018-12-02 00:00:00	\N	\N		\N
5095	4568		\N	\N	\N		\N
5096	4069	04 B 0923057	2014-05-08 00:00:00	\N	\N		\N
5097	4360		\N	\N	\N		\N
5098	4817	13/00-0264910B15	2022-07-31 00:00:00	\N	\N		\N
5099	4915	09 B 0983278	2022-10-04 00:00:00	\N	\N		\N
5100	4813	10 B 0242945	2021-05-30 00:00:00	\N	\N		\N
5101	4740	48/00-0162673B05	2019-03-27 00:00:00	\N	\N		\N
5102	918		\N	\N	\N		\N
5103	4921	32/04 - 0622217 B 12	2023-11-21 00:00:00	\N	\N		\N
5104	4992	10/00-0283186 B06	2020-09-28 00:00:00	\N	\N		\N
5105	4993	0094352 B21	2021-03-02 00:00:00	\N	\N		\N
5106	4994		\N	\N	\N		\N
5107	4951		\N	\N	\N		\N
5108	5043	02/00-0907053-B-18	2018-04-18 00:00:00	\N	\N		\N
5109	5044	25/00 - 0068708 B10	2014-07-13 00:00:00	\N	\N		\N
5110	5045	28/00 - 0563172 B 10	2024-01-08 00:00:00	\N	\N		\N
5111	5046	35/00-0730658 B24	2024-05-28 00:00:00	\N	\N		\N
5112	5047	43/00 - 0323359 B 09	2023-05-28 00:00:00	\N	\N		\N
5113	5048		\N	\N	\N		\N
5114	4919	05/00 - 0224519 B 12	2019-04-03 00:00:00	\N	\N		\N
5115	4056	16/00 – 0016868 B 01	2018-09-10 00:00:00	\N	\N		\N
5116	4375	16 B 0564167	2016-06-08 00:00:00	\N	\N		\N
5117	3643	03 B 0022819	2020-12-31 00:00:00	\N	\N	001802290005951	\N
5118	4963	98 B 0582096	2024-03-17 00:00:00	\N	\N		\N
5119	4900	05/00-0226558 B22	2022-09-07 00:00:00	\N	\N		\N
5120	5113	32/00-0622285B17	2018-10-18 00:00:00	\N	\N	000603092316213	\N
5121	5115	29/00-0663587B13	2024-05-13 00:00:00	\N	\N		\N
5122	5116	17/00 - 0303844B22	2024-12-18 00:00:00	\N	\N	002037010000277	\N
5123	4988	31/00-0109162 B07	2021-03-10 00:00:00	\N	\N		\N
5124	4586		\N	\N	\N		\N
5125	4587		\N	\N	\N		\N
5126	4588		\N	\N	\N		\N
5127	2876		\N	\N	\N		\N
5128	5049	24 B 0907682	2024-05-30 00:00:00	\N	\N		\N
5129	5050	18/00 0443531 B 16	2019-06-30 00:00:00	\N	\N	000034046251933	\N
5130	4406	26/00-0342159 B99	2018-08-06 00:00:00	\N	\N	000702090555488	\N
5131	4483		\N	\N	\N		\N
5132	4475		\N	\N	\N		\N
5133	3800	05 B 0742374   - 00/20	2013-02-16 00:00:00	\N	\N		\N
5134	4972	22 B 0822510	2022-02-06 00:00:00	\N	\N		\N
5135	5037	05 B 0086129	2024-08-19 00:00:00	\N	\N		\N
5136	5038		\N	\N	\N		\N
5137	3688		\N	\N	\N		\N
5138	5074	24 B 0095941	2024-08-21 00:00:00	\N	\N		\N
\.


--
-- Data for Name: statutjuridique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statutjuridique ("id_statutJuridique", code_statut, statut_fr, statut_ar) FROM stdin;
1	SARL	Société à responsabilité limitée	شركة ذات مسؤولية محدودة
2	SPA	Société par actions	شركة مساهمة
3	EURL	Entreprise unipersonnelle à responsabilité limitée	مؤسسة فردية ذات مسؤولية محدودة
4	SNC	Société en nom collectif	شركة التضامن
5	S.P.A.	Société par actions	الشركة ذات أسهم
7	E.P.E.	Établissement public à caractère économique	المؤسسة العمومية الاقتصادية
8	E.P.I.C.	Établissement public à caractère industriel et commercial	المؤسسة العمومية ذات الطابع الصناعي و التجاري
9	E.P.L.	Établissement public local	المؤسسة العمومية المحلية
10	E.M.C.I.C.	Entreprise mixte à caractère industriel et commercial	المؤسسة العسكرية ذات الطابع الصناعي و التجاري
11	G.R.P.	Groupement de regroupement professionnel	المجمع
12	C.O.O.P.	Coopérative	التعاونية الحرفية
13	EURL/EPIC	Entreprise unipersonnelle à responsabilité limitée / Établissement public à caractère industriel et commercial	مؤسسة فردية محدودة المسؤولية / مؤسسة عامة ذات طابع صناعي وتجاري
14	Société de droit étranger	Société étrangère	شركة أجنبية
15	Société en commandite	Société en commandite	شركة التوصية
\.


--
-- Data for Name: substance_associee_demande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.substance_associee_demande (id_assoc, id_proc, id_substance, priorite, date_ajout) FROM stdin;
2	1	4	principale	2025-10-19 21:34:24.122
3	1	5	secondaire	2025-10-19 21:34:25.096
\.


--
-- Data for Name: substances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.substances (id_sub, "nom_subFR", "nom_subAR", categorie_sub, famille_sub, id_redevance) FROM stdin;
1	Fer	الحديد	métalliques		1
2	Cuivre	النحاس	métalliques		1
3	Argile	الطين	non-métalliques		1
4	Sable	الرمل	non-métalliques		1
5	Uranium	اليورانيوم	radioactives		1
\.


--
-- Data for Name: superficiaire_bareme; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.superficiaire_bareme (id, droit_fixe, periode_initiale, premier_renouv, autre_renouv, devise) FROM stdin;
1	5000	100	150	200	DZD
2	10000	200	250	300	DZD
3	5000	100	150	200	DZD
4	10000	200	250	300	DZD
5	5000	150	200	150	DZD
6	10000	250	300	350	DZD
7	5000	100	150	200	DZD
8	5000	150	200	150	DZD
9	0	0	0	0	DZD
10	0	0	0	0	DZD
\.


--
-- Data for Name: transfert_detenteur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transfert_detenteur (id, id_transfert, id_detenteur, type_detenteur, role, date_enregistrement) FROM stdin;
\.


--
-- Data for Name: typepaiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typepaiement (id, libelle, frequence, details_calcul) FROM stdin;
1	Produit d'attribution	Unique	Montant fixe selon le type de permis
2	Droit d'établissement	Unique	Montant fixe selon le type de permis et la procédure
3	Taxe superficiaire	Annuel	(Droit fixe + (Droit proportionnel * superficie)) * 12 / 5
4	Redevance minière	Annuel	Pourcentage de la production
5	Frais de dossier	Unique	Montant fixe
\.


--
-- Data for Name: typepermis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typepermis (id, id_taxe, lib_type, code_type, regime, duree_initiale, nbr_renouv_max, duree_renouv, delai_renouv, superficie_max) FROM stdin;
1	1	Permis de prospection	PPM	mine	3	2	0.5	90	100
2	2	Permis d'exploration	PEM	mine	5	1	2	180	500
5	5	Permis de recherche carrière	PRC	carriere	3	1	10	90	50
6	6	Permis d'exploitation carrière	PEC	carriere	15	2	4	180	100
7	7	Autorisation artisanale mine	ARM	mine	2	3	0	60	5
8	8	Autorisation artisanale carrière	ARC	carriere	2	3	0	60	2
9	9	Permis de ramassage	PRA	mine	1	5	0	30	\N
10	10	Permis de transport	PTM	mine	5	5	0	90	\N
3	1	Permis d'exploitation	PXM	mine	25	3	10	365	1000
\.


--
-- Data for Name: typeprocedure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typeprocedure (id, libelle, description) FROM stdin;
1	demande	Demande initiale de permis
2	renouvellement	Renouvellement de permis
3	extension	Extension de superficie ou durée
4	modification	Modification des conditions
5	fusion	Fusion de permis
6	division	Division de permis
7	transfert	Transfert de droits
8	cession	Cession partielle
9	renonciation	Renonciation au permis
10	retrait	Retrait administratif
11	regularisation	Procédure de régularisation
12	recours	Recours administratif
13	arbitrage	Demande d'arbitrage
14	demande	Demande initiale de permis
15	renouvellement	Renouvellement de permis
16	extension	Extension de superficie ou durée
17	modification	Modification des conditions
18	fusion	Fusion de permis
19	division	Division de permis
20	transfert	Transfert de droits
21	cession	Cession partielle
22	renonciation	Renonciation au permis
23	retrait	Retrait administratif
24	regularisation	Procédure de régularisation
25	recours	Recours administratif
26	arbitrage	Demande d'arbitrage
\.


--
-- Name: AncienTypePermis_id_ancienType_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AncienTypePermis_id_ancienType_seq"', 1, false);


--
-- Name: Antenne_id_antenne_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Antenne_id_antenne_seq"', 1, false);


--
-- Name: AuditLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLog_id_seq"', 1, false);


--
-- Name: ComiteDirection_id_comite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ComiteDirection_id_comite_seq"', 1, false);


--
-- Name: Commune_id_commune_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Commune_id_commune_seq"', 1, false);


--
-- Name: Conversation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Conversation_id_seq"', 1, false);


--
-- Name: Daira_id_daira_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Daira_id_daira_seq"', 1, false);


--
-- Name: DecisionCD_id_decision_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DecisionCD_id_decision_seq"', 1, false);


--
-- Name: Document_id_doc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Document_id_doc_seq"', 69, true);


--
-- Name: DossierAdministratif_id_dossier_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DossierAdministratif_id_dossier_seq"', 10, true);


--
-- Name: Group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Group_id_seq"', 1, false);


--
-- Name: InteractionWali_id_interaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."InteractionWali_id_interaction_seq"', 1, false);


--
-- Name: MembresComite_id_membre_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MembresComite_id_membre_seq"', 1, false);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, false);


--
-- Name: Permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Permission_id_seq"', 22, true);


--
-- Name: PortalApplicationDocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalApplicationDocument_id_seq"', 1, false);


--
-- Name: PortalApplication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalApplication_id_seq"', 1, false);


--
-- Name: PortalCompany_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalCompany_id_seq"', 1, false);


--
-- Name: PortalDocumentDefinition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalDocumentDefinition_id_seq"', 1, false);


--
-- Name: PortalPayment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalPayment_id_seq"', 1, false);


--
-- Name: PortalPermitType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalPermitType_id_seq"', 1, false);


--
-- Name: PortalRepresentative_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalRepresentative_id_seq"', 1, false);


--
-- Name: PortalShareholder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalShareholder_id_seq"', 1, false);


--
-- Name: PortalTypeDocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PortalTypeDocument_id_seq"', 1, false);


--
-- Name: ProcedureCoord_id_procedureCoord_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProcedureCoord_id_procedureCoord_seq"', 24, true);


--
-- Name: ProcedureRenouvellement_id_renouvellement_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProcedureRenouvellement_id_renouvellement_seq"', 1, false);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 9, true);


--
-- Name: SeanceCDPrevue_id_seance_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SeanceCDPrevue_id_seance_seq"', 1, true);


--
-- Name: Session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Session_id_seq"', 1, true);


--
-- Name: StatutPermis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StatutPermis_id_seq"', 5, true);


--
-- Name: TsPaiement_id_tsPaiement_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TsPaiement_id_tsPaiement_seq"', 50, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Wilaya_id_wilaya_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Wilaya_id_wilaya_seq"', 1, false);


--
-- Name: barem_produit_droit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.barem_produit_droit_id_seq', 1, false);


--
-- Name: cahiercharge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cahiercharge_id_seq', 1, false);


--
-- Name: codeAssimilation_id_code_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."codeAssimilation_id_code_seq"', 1, false);


--
-- Name: coordonnee_id_coordonnees_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coordonnee_id_coordonnees_seq', 24, true);


--
-- Name: demAnnulation_id_annulation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demAnnulation_id_annulation_seq"', 1, false);


--
-- Name: demCession_id_cession_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demCession_id_cession_seq"', 1, false);


--
-- Name: demFermeture_id_fermeture_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demFermeture_id_fermeture_seq"', 1, false);


--
-- Name: demFusion_id_fusion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demFusion_id_fusion_seq"', 1, false);


--
-- Name: demModification_id_modification_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demModification_id_modification_seq"', 1, false);


--
-- Name: demRenonciation_id_renonciation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demRenonciation_id_renonciation_seq"', 1, false);


--
-- Name: demSubstitution_id_substitution_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demSubstitution_id_substitution_seq"', 1, false);


--
-- Name: demTransfert_id_transfert_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demTransfert_id_transfert_seq"', 1, false);


--
-- Name: demandeMin_id_demMin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demandeMin_id_demMin_seq"', 1, false);


--
-- Name: demandeObs_id_demandeObs_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demandeObs_id_demandeObs_seq"', 1, false);


--
-- Name: demandeVerificationGeo_id_demVerif_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demandeVerificationGeo_id_demVerif_seq"', 2, true);


--
-- Name: demande_id_demande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demande_id_demande_seq', 1, true);


--
-- Name: detenteurmorale_id_detenteur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detenteurmorale_id_detenteur_seq', 1, false);


--
-- Name: dossier_fournis_id_dossierFournis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."dossier_fournis_id_dossierFournis_seq"', 1, true);


--
-- Name: etape_proc_id_etape_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etape_proc_id_etape_seq', 1, false);


--
-- Name: expertminier_id_expert_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expertminier_id_expert_seq', 1, false);


--
-- Name: inscription_provisoire_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscription_provisoire_id_seq', 3, true);


--
-- Name: nationalite_id_nationalite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nationalite_id_nationalite_seq', 230, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: obligationfiscale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.obligationfiscale_id_seq', 54, true);


--
-- Name: paiement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paiement_id_seq', 1, false);


--
-- Name: pays_id_pays_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pays_id_pays_seq', 240, true);


--
-- Name: permis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permis_id_seq', 1, true);


--
-- Name: permis_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permis_templates_id_seq', 1, false);


--
-- Name: personnephysique_id_personne_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personnephysique_id_personne_seq', 2, true);


--
-- Name: phase_id_phase_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.phase_id_phase_seq', 9, true);


--
-- Name: procedure_id_proc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procedure_id_proc_seq', 1, true);


--
-- Name: rapport_activite_id_rapport_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rapport_activite_id_rapport_seq', 1, false);


--
-- Name: redevance_bareme_id_redevance_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.redevance_bareme_id_redevance_seq', 1, true);


--
-- Name: registrecommerce_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrecommerce_id_seq', 1, false);


--
-- Name: statutjuridique_id_statutJuridique_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."statutjuridique_id_statutJuridique_seq"', 1, false);


--
-- Name: substance_associee_demande_id_assoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.substance_associee_demande_id_assoc_seq', 3, true);


--
-- Name: substances_id_sub_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.substances_id_sub_seq', 5, true);


--
-- Name: superficiaire_bareme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.superficiaire_bareme_id_seq', 1, false);


--
-- Name: transfert_detenteur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transfert_detenteur_id_seq', 1, false);


--
-- Name: typepaiement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.typepaiement_id_seq', 10, true);


--
-- Name: typepermis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.typepermis_id_seq', 20, true);


--
-- Name: typeprocedure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.typeprocedure_id_seq', 26, true);


--
-- Name: AncienTypePermis AncienTypePermis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AncienTypePermis"
    ADD CONSTRAINT "AncienTypePermis_pkey" PRIMARY KEY ("id_ancienType");


--
-- Name: Antenne Antenne_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Antenne"
    ADD CONSTRAINT "Antenne_pkey" PRIMARY KEY (id_antenne);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: ComiteDirection ComiteDirection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComiteDirection"
    ADD CONSTRAINT "ComiteDirection_pkey" PRIMARY KEY (id_comite);


--
-- Name: Commune Commune_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Commune"
    ADD CONSTRAINT "Commune_pkey" PRIMARY KEY (id_commune);


--
-- Name: Conversation Conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY (id);


--
-- Name: Daira Daira_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Daira"
    ADD CONSTRAINT "Daira_pkey" PRIMARY KEY (id_daira);


--
-- Name: DecisionCD DecisionCD_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DecisionCD"
    ADD CONSTRAINT "DecisionCD_pkey" PRIMARY KEY (id_decision);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id_doc);


--
-- Name: DossierAdministratif DossierAdministratif_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierAdministratif"
    ADD CONSTRAINT "DossierAdministratif_pkey" PRIMARY KEY (id_dossier);


--
-- Name: DossierDocument DossierDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierDocument"
    ADD CONSTRAINT "DossierDocument_pkey" PRIMARY KEY (id_dossier, id_doc);


--
-- Name: GroupPermission GroupPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupPermission"
    ADD CONSTRAINT "GroupPermission_pkey" PRIMARY KEY ("groupId", "permissionId");


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: InteractionWali InteractionWali_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionWali"
    ADD CONSTRAINT "InteractionWali_pkey" PRIMARY KEY (id_interaction);


--
-- Name: MembreSeance MembreSeance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembreSeance"
    ADD CONSTRAINT "MembreSeance_pkey" PRIMARY KEY (id_seance, id_membre);


--
-- Name: MembresComite MembresComite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembresComite"
    ADD CONSTRAINT "MembresComite_pkey" PRIMARY KEY (id_membre);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PortalApplicationDocument PortalApplicationDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplicationDocument"
    ADD CONSTRAINT "PortalApplicationDocument_pkey" PRIMARY KEY (id);


--
-- Name: PortalApplication PortalApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplication"
    ADD CONSTRAINT "PortalApplication_pkey" PRIMARY KEY (id);


--
-- Name: PortalCompany PortalCompany_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalCompany"
    ADD CONSTRAINT "PortalCompany_pkey" PRIMARY KEY (id);


--
-- Name: PortalDocumentDefinition PortalDocumentDefinition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalDocumentDefinition"
    ADD CONSTRAINT "PortalDocumentDefinition_pkey" PRIMARY KEY (id);


--
-- Name: PortalPayment PortalPayment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalPayment"
    ADD CONSTRAINT "PortalPayment_pkey" PRIMARY KEY (id);


--
-- Name: PortalPermitType PortalPermitType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalPermitType"
    ADD CONSTRAINT "PortalPermitType_pkey" PRIMARY KEY (id);


--
-- Name: PortalRepresentative PortalRepresentative_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalRepresentative"
    ADD CONSTRAINT "PortalRepresentative_pkey" PRIMARY KEY (id);


--
-- Name: PortalShareholder PortalShareholder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalShareholder"
    ADD CONSTRAINT "PortalShareholder_pkey" PRIMARY KEY (id);


--
-- Name: PortalTypeDocument PortalTypeDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalTypeDocument"
    ADD CONSTRAINT "PortalTypeDocument_pkey" PRIMARY KEY (id);


--
-- Name: ProcedureCoord ProcedureCoord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureCoord"
    ADD CONSTRAINT "ProcedureCoord_pkey" PRIMARY KEY ("id_procedureCoord");


--
-- Name: ProcedureRenouvellement ProcedureRenouvellement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureRenouvellement"
    ADD CONSTRAINT "ProcedureRenouvellement_pkey" PRIMARY KEY (id_renouvellement);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SeanceCDPrevue SeanceCDPrevue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SeanceCDPrevue"
    ADD CONSTRAINT "SeanceCDPrevue_pkey" PRIMARY KEY (id_seance);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: StatutPermis StatutPermis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StatutPermis"
    ADD CONSTRAINT "StatutPermis_pkey" PRIMARY KEY (id);


--
-- Name: TsPaiement TsPaiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TsPaiement"
    ADD CONSTRAINT "TsPaiement_pkey" PRIMARY KEY ("id_tsPaiement");


--
-- Name: UserGroup UserGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserGroup"
    ADD CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId", "groupId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wilaya Wilaya_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilaya"
    ADD CONSTRAINT "Wilaya_pkey" PRIMARY KEY (id_wilaya);


--
-- Name: _PermisProcedure _PermisProcedure_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermisProcedure"
    ADD CONSTRAINT "_PermisProcedure_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _SeanceMembres _SeanceMembres_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_SeanceMembres"
    ADD CONSTRAINT "_SeanceMembres_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: barem_produit_droit barem_produit_droit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barem_produit_droit
    ADD CONSTRAINT barem_produit_droit_pkey PRIMARY KEY (id);


--
-- Name: cahiercharge cahiercharge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cahiercharge
    ADD CONSTRAINT cahiercharge_pkey PRIMARY KEY (id);


--
-- Name: codeAssimilation codeAssimilation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."codeAssimilation"
    ADD CONSTRAINT "codeAssimilation_pkey" PRIMARY KEY (id_code);


--
-- Name: coordonnee coordonnee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordonnee
    ADD CONSTRAINT coordonnee_pkey PRIMARY KEY (id_coordonnees);


--
-- Name: demAnnulation demAnnulation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demAnnulation"
    ADD CONSTRAINT "demAnnulation_pkey" PRIMARY KEY (id_annulation);


--
-- Name: demCession demCession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demCession"
    ADD CONSTRAINT "demCession_pkey" PRIMARY KEY (id_cession);


--
-- Name: demFermeture demFermeture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFermeture"
    ADD CONSTRAINT "demFermeture_pkey" PRIMARY KEY (id_fermeture);


--
-- Name: demFusion demFusion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFusion"
    ADD CONSTRAINT "demFusion_pkey" PRIMARY KEY (id_fusion);


--
-- Name: demModification demModification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demModification"
    ADD CONSTRAINT "demModification_pkey" PRIMARY KEY (id_modification);


--
-- Name: demRenonciation demRenonciation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demRenonciation"
    ADD CONSTRAINT "demRenonciation_pkey" PRIMARY KEY (id_renonciation);


--
-- Name: demSubstitution demSubstitution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demSubstitution"
    ADD CONSTRAINT "demSubstitution_pkey" PRIMARY KEY (id_substitution);


--
-- Name: demTransfert demTransfert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demTransfert"
    ADD CONSTRAINT "demTransfert_pkey" PRIMARY KEY (id_transfert);


--
-- Name: demandeMin demandeMin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeMin"
    ADD CONSTRAINT "demandeMin_pkey" PRIMARY KEY ("id_demMin");


--
-- Name: demandeObs demandeObs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeObs"
    ADD CONSTRAINT "demandeObs_pkey" PRIMARY KEY ("id_demandeObs");


--
-- Name: demandeVerificationGeo demandeVerificationGeo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeVerificationGeo"
    ADD CONSTRAINT "demandeVerificationGeo_pkey" PRIMARY KEY ("id_demVerif");


--
-- Name: demande demande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_pkey PRIMARY KEY (id_demande);


--
-- Name: detenteurmorale detenteurmorale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detenteurmorale
    ADD CONSTRAINT detenteurmorale_pkey PRIMARY KEY (id_detenteur);


--
-- Name: dossier_fournis_document dossier_fournis_document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_fournis_document
    ADD CONSTRAINT dossier_fournis_document_pkey PRIMARY KEY ("id_dossierFournis", id_doc);


--
-- Name: dossier_fournis dossier_fournis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_fournis
    ADD CONSTRAINT dossier_fournis_pkey PRIMARY KEY ("id_dossierFournis");


--
-- Name: etape_proc etape_proc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etape_proc
    ADD CONSTRAINT etape_proc_pkey PRIMARY KEY (id_etape);


--
-- Name: expertminier expertminier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expertminier
    ADD CONSTRAINT expertminier_pkey PRIMARY KEY (id_expert);


--
-- Name: fonctionpersonnemoral fonctionpersonnemoral_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonctionpersonnemoral
    ADD CONSTRAINT fonctionpersonnemoral_pkey PRIMARY KEY (id_detenteur, id_personne);


--
-- Name: fusionPermisSource fusionPermisSource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."fusionPermisSource"
    ADD CONSTRAINT "fusionPermisSource_pkey" PRIMARY KEY (id_permis, id_fusion);


--
-- Name: inscription_provisoire inscription_provisoire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription_provisoire
    ADD CONSTRAINT inscription_provisoire_pkey PRIMARY KEY (id);


--
-- Name: nationalite nationalite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nationalite
    ADD CONSTRAINT nationalite_pkey PRIMARY KEY (id_nationalite);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: obligationfiscale obligationfiscale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obligationfiscale
    ADD CONSTRAINT obligationfiscale_pkey PRIMARY KEY (id);


--
-- Name: paiement paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement
    ADD CONSTRAINT paiement_pkey PRIMARY KEY (id);


--
-- Name: pays pays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pays
    ADD CONSTRAINT pays_pkey PRIMARY KEY (id_pays);


--
-- Name: permis permis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT permis_pkey PRIMARY KEY (id);


--
-- Name: permis_templates permis_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis_templates
    ADD CONSTRAINT permis_templates_pkey PRIMARY KEY (id);


--
-- Name: personnephysique personnephysique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnephysique
    ADD CONSTRAINT personnephysique_pkey PRIMARY KEY (id_personne);


--
-- Name: phase phase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phase
    ADD CONSTRAINT phase_pkey PRIMARY KEY (id_phase);


--
-- Name: procedure_etape procedure_etape_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_etape
    ADD CONSTRAINT procedure_etape_pkey PRIMARY KEY (id_proc, id_etape);


--
-- Name: procedure_phase procedure_phase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_phase
    ADD CONSTRAINT procedure_phase_pkey PRIMARY KEY (id_proc, id_phase);


--
-- Name: procedure procedure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure
    ADD CONSTRAINT procedure_pkey PRIMARY KEY (id_proc);


--
-- Name: rapport_activite rapport_activite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rapport_activite
    ADD CONSTRAINT rapport_activite_pkey PRIMARY KEY (id_rapport);


--
-- Name: redevance_bareme redevance_bareme_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redevance_bareme
    ADD CONSTRAINT redevance_bareme_pkey PRIMARY KEY (id_redevance);


--
-- Name: registrecommerce registrecommerce_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrecommerce
    ADD CONSTRAINT registrecommerce_pkey PRIMARY KEY (id);


--
-- Name: statutjuridique statutjuridique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statutjuridique
    ADD CONSTRAINT statutjuridique_pkey PRIMARY KEY ("id_statutJuridique");


--
-- Name: substance_associee_demande substance_associee_demande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substance_associee_demande
    ADD CONSTRAINT substance_associee_demande_pkey PRIMARY KEY (id_assoc);


--
-- Name: substances substances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances
    ADD CONSTRAINT substances_pkey PRIMARY KEY (id_sub);


--
-- Name: superficiaire_bareme superficiaire_bareme_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superficiaire_bareme
    ADD CONSTRAINT superficiaire_bareme_pkey PRIMARY KEY (id);


--
-- Name: transfert_detenteur transfert_detenteur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfert_detenteur
    ADD CONSTRAINT transfert_detenteur_pkey PRIMARY KEY (id);


--
-- Name: typepaiement typepaiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typepaiement
    ADD CONSTRAINT typepaiement_pkey PRIMARY KEY (id);


--
-- Name: typepermis typepermis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typepermis
    ADD CONSTRAINT typepermis_pkey PRIMARY KEY (id);


--
-- Name: typeprocedure typeprocedure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typeprocedure
    ADD CONSTRAINT typeprocedure_pkey PRIMARY KEY (id);


--
-- Name: AuditLog_contextId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_contextId_idx" ON public."AuditLog" USING btree ("contextId");


--
-- Name: AuditLog_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_entityId_idx" ON public."AuditLog" USING btree ("entityId");


--
-- Name: AuditLog_entityType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_entityType_idx" ON public."AuditLog" USING btree ("entityType");


--
-- Name: AuditLog_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_sessionId_idx" ON public."AuditLog" USING btree ("sessionId");


--
-- Name: AuditLog_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_timestamp_idx" ON public."AuditLog" USING btree ("timestamp");


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: Conversation_user1Id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Conversation_user1Id_idx" ON public."Conversation" USING btree ("user1Id");


--
-- Name: Conversation_user1Id_user2Id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_key" ON public."Conversation" USING btree ("user1Id", "user2Id");


--
-- Name: Conversation_user2Id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Conversation_user2Id_idx" ON public."Conversation" USING btree ("user2Id");


--
-- Name: DossierAdministratif_id_typePermis_id_typeproc_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "DossierAdministratif_id_typePermis_id_typeproc_key" ON public."DossierAdministratif" USING btree ("id_typePermis", id_typeproc);


--
-- Name: Group_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Group_name_key" ON public."Group" USING btree (name);


--
-- Name: Message_conversationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_conversationId_idx" ON public."Message" USING btree ("conversationId");


--
-- Name: Message_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_createdAt_idx" ON public."Message" USING btree ("createdAt");


--
-- Name: Message_receiverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_receiverId_idx" ON public."Message" USING btree ("receiverId");


--
-- Name: Message_senderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_senderId_idx" ON public."Message" USING btree ("senderId");


--
-- Name: Permission_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_name_key" ON public."Permission" USING btree (name);


--
-- Name: PortalApplicationDocument_applicationId_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PortalApplicationDocument_applicationId_documentId_key" ON public."PortalApplicationDocument" USING btree ("applicationId", "documentId");


--
-- Name: PortalApplication_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PortalApplication_code_key" ON public."PortalApplication" USING btree (code);


--
-- Name: PortalDocumentDefinition_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PortalDocumentDefinition_code_key" ON public."PortalDocumentDefinition" USING btree (code);


--
-- Name: PortalPermitType_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PortalPermitType_code_key" ON public."PortalPermitType" USING btree (code);


--
-- Name: PortalTypeDocument_permitTypeId_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PortalTypeDocument_permitTypeId_documentId_key" ON public."PortalTypeDocument" USING btree ("permitTypeId", "documentId");


--
-- Name: ProcedureCoord_id_proc_id_coordonnees_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProcedureCoord_id_proc_id_coordonnees_key" ON public."ProcedureCoord" USING btree (id_proc, id_coordonnees);


--
-- Name: ProcedureRenouvellement_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProcedureRenouvellement_id_demande_key" ON public."ProcedureRenouvellement" USING btree (id_demande);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Session_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_expiresAt_idx" ON public."Session" USING btree ("expiresAt");


--
-- Name: Session_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_token_idx" ON public."Session" USING btree (token);


--
-- Name: Session_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_token_key" ON public."Session" USING btree (token);


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: StatutPermis_lib_statut_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StatutPermis_lib_statut_key" ON public."StatutPermis" USING btree (lib_statut);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Wilaya_code_wilaya_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wilaya_code_wilaya_key" ON public."Wilaya" USING btree (code_wilaya);


--
-- Name: _PermisProcedure_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_PermisProcedure_B_index" ON public."_PermisProcedure" USING btree ("B");


--
-- Name: _SeanceMembres_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_SeanceMembres_B_index" ON public."_SeanceMembres" USING btree ("B");


--
-- Name: demAnnulation_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demAnnulation_id_demande_key" ON public."demAnnulation" USING btree (id_demande);


--
-- Name: demCession_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demCession_id_demande_key" ON public."demCession" USING btree (id_demande);


--
-- Name: demFermeture_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demFermeture_id_demande_key" ON public."demFermeture" USING btree (id_demande);


--
-- Name: demFusion_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demFusion_id_demande_key" ON public."demFusion" USING btree (id_demande);


--
-- Name: demFusion_id_permisResultant_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demFusion_id_permisResultant_key" ON public."demFusion" USING btree ("id_permisResultant");


--
-- Name: demModification_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demModification_id_demande_key" ON public."demModification" USING btree (id_demande);


--
-- Name: demRenonciation_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demRenonciation_id_demande_key" ON public."demRenonciation" USING btree (id_demande);


--
-- Name: demSubstitution_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demSubstitution_id_demande_key" ON public."demSubstitution" USING btree (id_demande);


--
-- Name: demTransfert_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demTransfert_id_demande_key" ON public."demTransfert" USING btree (id_demande);


--
-- Name: demandeMin_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demandeMin_id_demande_key" ON public."demandeMin" USING btree (id_demande);


--
-- Name: demandeObs_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demandeObs_id_demande_key" ON public."demandeObs" USING btree (id_demande);


--
-- Name: demandeVerificationGeo_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "demandeVerificationGeo_id_demande_key" ON public."demandeVerificationGeo" USING btree (id_demande);


--
-- Name: demande_code_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX demande_code_demande_key ON public.demande USING btree (code_demande);


--
-- Name: inscription_provisoire_id_demande_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX inscription_provisoire_id_demande_key ON public.inscription_provisoire USING btree (id_demande);


--
-- Name: inscription_provisoire_id_proc_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX inscription_provisoire_id_proc_key ON public.inscription_provisoire USING btree (id_proc);


--
-- Name: nationalite_libelle_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX nationalite_libelle_key ON public.nationalite USING btree (libelle);


--
-- Name: pays_code_pays_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pays_code_pays_key ON public.pays USING btree (code_pays);


--
-- Name: permis_templates_permisId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "permis_templates_permisId_idx" ON public.permis_templates USING btree ("permisId");


--
-- Name: permis_templates_typePermisId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "permis_templates_typePermisId_idx" ON public.permis_templates USING btree ("typePermisId");


--
-- Name: personnephysique_num_carte_identite_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX personnephysique_num_carte_identite_key ON public.personnephysique USING btree (num_carte_identite);


--
-- Name: procedure_num_proc_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX procedure_num_proc_key ON public.procedure USING btree (num_proc);


--
-- Name: statutjuridique_code_statut_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX statutjuridique_code_statut_key ON public.statutjuridique USING btree (code_statut);


--
-- Name: substance_associee_demande_id_proc_id_substance_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX substance_associee_demande_id_proc_id_substance_key ON public.substance_associee_demande USING btree (id_proc, id_substance);


--
-- Name: typepaiement_libelle_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX typepaiement_libelle_key ON public.typepaiement USING btree (libelle);


--
-- Name: typepermis_code_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX typepermis_code_type_key ON public.typepermis USING btree (code_type);


--
-- Name: typepermis_lib_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX typepermis_lib_type_key ON public.typepermis USING btree (lib_type);


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComiteDirection ComiteDirection_id_seance_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComiteDirection"
    ADD CONSTRAINT "ComiteDirection_id_seance_fkey" FOREIGN KEY (id_seance) REFERENCES public."SeanceCDPrevue"(id_seance) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Commune Commune_id_daira_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Commune"
    ADD CONSTRAINT "Commune_id_daira_fkey" FOREIGN KEY (id_daira) REFERENCES public."Daira"(id_daira) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Conversation Conversation_user1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Conversation Conversation_user2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Daira Daira_id_wilaya_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Daira"
    ADD CONSTRAINT "Daira_id_wilaya_fkey" FOREIGN KEY (id_wilaya) REFERENCES public."Wilaya"(id_wilaya) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DecisionCD DecisionCD_id_comite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DecisionCD"
    ADD CONSTRAINT "DecisionCD_id_comite_fkey" FOREIGN KEY (id_comite) REFERENCES public."ComiteDirection"(id_comite) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DossierAdministratif DossierAdministratif_id_typePermis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierAdministratif"
    ADD CONSTRAINT "DossierAdministratif_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES public.typepermis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DossierAdministratif DossierAdministratif_id_typeproc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierAdministratif"
    ADD CONSTRAINT "DossierAdministratif_id_typeproc_fkey" FOREIGN KEY (id_typeproc) REFERENCES public.typeprocedure(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DossierDocument DossierDocument_id_doc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierDocument"
    ADD CONSTRAINT "DossierDocument_id_doc_fkey" FOREIGN KEY (id_doc) REFERENCES public."Document"(id_doc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DossierDocument DossierDocument_id_dossier_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DossierDocument"
    ADD CONSTRAINT "DossierDocument_id_dossier_fkey" FOREIGN KEY (id_dossier) REFERENCES public."DossierAdministratif"(id_dossier) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupPermission GroupPermission_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupPermission"
    ADD CONSTRAINT "GroupPermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupPermission GroupPermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupPermission"
    ADD CONSTRAINT "GroupPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InteractionWali InteractionWali_id_procedure_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionWali"
    ADD CONSTRAINT "InteractionWali_id_procedure_fkey" FOREIGN KEY (id_procedure) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InteractionWali InteractionWali_id_wilaya_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionWali"
    ADD CONSTRAINT "InteractionWali_id_wilaya_fkey" FOREIGN KEY (id_wilaya) REFERENCES public."Wilaya"(id_wilaya) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MembreSeance MembreSeance_id_membre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembreSeance"
    ADD CONSTRAINT "MembreSeance_id_membre_fkey" FOREIGN KEY (id_membre) REFERENCES public."MembresComite"(id_membre) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MembreSeance MembreSeance_id_seance_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembreSeance"
    ADD CONSTRAINT "MembreSeance_id_seance_fkey" FOREIGN KEY (id_seance) REFERENCES public."SeanceCDPrevue"(id_seance) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PortalApplicationDocument PortalApplicationDocument_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplicationDocument"
    ADD CONSTRAINT "PortalApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."PortalApplication"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalApplicationDocument PortalApplicationDocument_documentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplicationDocument"
    ADD CONSTRAINT "PortalApplicationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES public."PortalDocumentDefinition"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalApplication PortalApplication_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplication"
    ADD CONSTRAINT "PortalApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."PortalCompany"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PortalApplication PortalApplication_permitTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalApplication"
    ADD CONSTRAINT "PortalApplication_permitTypeId_fkey" FOREIGN KEY ("permitTypeId") REFERENCES public."PortalPermitType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalPayment PortalPayment_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalPayment"
    ADD CONSTRAINT "PortalPayment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."PortalApplication"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalRepresentative PortalRepresentative_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalRepresentative"
    ADD CONSTRAINT "PortalRepresentative_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."PortalCompany"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalShareholder PortalShareholder_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalShareholder"
    ADD CONSTRAINT "PortalShareholder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."PortalCompany"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalTypeDocument PortalTypeDocument_documentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalTypeDocument"
    ADD CONSTRAINT "PortalTypeDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES public."PortalDocumentDefinition"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PortalTypeDocument PortalTypeDocument_permitTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortalTypeDocument"
    ADD CONSTRAINT "PortalTypeDocument_permitTypeId_fkey" FOREIGN KEY ("permitTypeId") REFERENCES public."PortalPermitType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProcedureCoord ProcedureCoord_id_coordonnees_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureCoord"
    ADD CONSTRAINT "ProcedureCoord_id_coordonnees_fkey" FOREIGN KEY (id_coordonnees) REFERENCES public.coordonnee(id_coordonnees) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProcedureCoord ProcedureCoord_id_proc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureCoord"
    ADD CONSTRAINT "ProcedureCoord_id_proc_fkey" FOREIGN KEY (id_proc) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProcedureRenouvellement ProcedureRenouvellement_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProcedureRenouvellement"
    ADD CONSTRAINT "ProcedureRenouvellement_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TsPaiement TsPaiement_id_obligation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TsPaiement"
    ADD CONSTRAINT "TsPaiement_id_obligation_fkey" FOREIGN KEY (id_obligation) REFERENCES public.obligationfiscale(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserGroup UserGroup_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserGroup"
    ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserGroup UserGroup_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserGroup"
    ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Wilaya Wilaya_id_antenne_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilaya"
    ADD CONSTRAINT "Wilaya_id_antenne_fkey" FOREIGN KEY (id_antenne) REFERENCES public."Antenne"(id_antenne) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _PermisProcedure _PermisProcedure_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermisProcedure"
    ADD CONSTRAINT "_PermisProcedure_A_fkey" FOREIGN KEY ("A") REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PermisProcedure _PermisProcedure_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermisProcedure"
    ADD CONSTRAINT "_PermisProcedure_B_fkey" FOREIGN KEY ("B") REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SeanceMembres _SeanceMembres_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_SeanceMembres"
    ADD CONSTRAINT "_SeanceMembres_A_fkey" FOREIGN KEY ("A") REFERENCES public."MembresComite"(id_membre) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SeanceMembres _SeanceMembres_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_SeanceMembres"
    ADD CONSTRAINT "_SeanceMembres_B_fkey" FOREIGN KEY ("B") REFERENCES public."SeanceCDPrevue"(id_seance) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: barem_produit_droit barem_produit_droit_typePermisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barem_produit_droit
    ADD CONSTRAINT "barem_produit_droit_typePermisId_fkey" FOREIGN KEY ("typePermisId") REFERENCES public.typepermis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: barem_produit_droit barem_produit_droit_typeProcedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barem_produit_droit
    ADD CONSTRAINT "barem_produit_droit_typeProcedureId_fkey" FOREIGN KEY ("typeProcedureId") REFERENCES public.typeprocedure(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cahiercharge cahiercharge_demandeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cahiercharge
    ADD CONSTRAINT "cahiercharge_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cahiercharge cahiercharge_permisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cahiercharge
    ADD CONSTRAINT "cahiercharge_permisId_fkey" FOREIGN KEY ("permisId") REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: codeAssimilation codeAssimilation_id_ancienType_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."codeAssimilation"
    ADD CONSTRAINT "codeAssimilation_id_ancienType_fkey" FOREIGN KEY ("id_ancienType") REFERENCES public."AncienTypePermis"("id_ancienType") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: codeAssimilation codeAssimilation_id_permis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."codeAssimilation"
    ADD CONSTRAINT "codeAssimilation_id_permis_fkey" FOREIGN KEY (id_permis) REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demAnnulation demAnnulation_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demAnnulation"
    ADD CONSTRAINT "demAnnulation_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demCession demCession_id_ancienCessionnaire_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demCession"
    ADD CONSTRAINT "demCession_id_ancienCessionnaire_fkey" FOREIGN KEY ("id_ancienCessionnaire") REFERENCES public.personnephysique(id_personne) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demCession demCession_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demCession"
    ADD CONSTRAINT "demCession_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demCession demCession_id_nouveauCessionnaire_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demCession"
    ADD CONSTRAINT "demCession_id_nouveauCessionnaire_fkey" FOREIGN KEY ("id_nouveauCessionnaire") REFERENCES public.personnephysique(id_personne) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demFermeture demFermeture_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFermeture"
    ADD CONSTRAINT "demFermeture_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demFusion demFusion_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFusion"
    ADD CONSTRAINT "demFusion_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demFusion demFusion_id_permisResultant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demFusion"
    ADD CONSTRAINT "demFusion_id_permisResultant_fkey" FOREIGN KEY ("id_permisResultant") REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demModification demModification_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demModification"
    ADD CONSTRAINT "demModification_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demRenonciation demRenonciation_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demRenonciation"
    ADD CONSTRAINT "demRenonciation_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demSubstitution demSubstitution_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demSubstitution"
    ADD CONSTRAINT "demSubstitution_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demTransfert demTransfert_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demTransfert"
    ADD CONSTRAINT "demTransfert_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demandeMin demandeMin_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeMin"
    ADD CONSTRAINT "demandeMin_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demandeObs demandeObs_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeObs"
    ADD CONSTRAINT "demandeObs_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demandeVerificationGeo demandeVerificationGeo_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."demandeVerificationGeo"
    ADD CONSTRAINT "demandeVerificationGeo_id_demande_fkey" FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: demande demande_id_commune_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_id_commune_fkey FOREIGN KEY (id_commune) REFERENCES public."Commune"(id_commune) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_daira_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_id_daira_fkey FOREIGN KEY (id_daira) REFERENCES public."Daira"(id_daira) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_detenteur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_id_detenteur_fkey FOREIGN KEY (id_detenteur) REFERENCES public.detenteurmorale(id_detenteur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_expert_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_id_expert_fkey FOREIGN KEY (id_expert) REFERENCES public.expertminier(id_expert) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_proc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_id_proc_fkey FOREIGN KEY (id_proc) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_typePermis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT "demande_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES public.typepermis(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_typeProc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT "demande_id_typeProc_fkey" FOREIGN KEY ("id_typeProc") REFERENCES public.typeprocedure(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: demande demande_id_wilaya_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_id_wilaya_fkey FOREIGN KEY (id_wilaya) REFERENCES public."Wilaya"(id_wilaya) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: detenteurmorale detenteurmorale_id_nationalite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detenteurmorale
    ADD CONSTRAINT detenteurmorale_id_nationalite_fkey FOREIGN KEY (id_nationalite) REFERENCES public.nationalite(id_nationalite) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: detenteurmorale detenteurmorale_id_pays_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detenteurmorale
    ADD CONSTRAINT detenteurmorale_id_pays_fkey FOREIGN KEY (id_pays) REFERENCES public.pays(id_pays) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: detenteurmorale detenteurmorale_id_statutJuridique_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detenteurmorale
    ADD CONSTRAINT "detenteurmorale_id_statutJuridique_fkey" FOREIGN KEY ("id_statutJuridique") REFERENCES public.statutjuridique("id_statutJuridique") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: dossier_fournis_document dossier_fournis_document_id_doc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_fournis_document
    ADD CONSTRAINT dossier_fournis_document_id_doc_fkey FOREIGN KEY (id_doc) REFERENCES public."Document"(id_doc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dossier_fournis_document dossier_fournis_document_id_dossierFournis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_fournis_document
    ADD CONSTRAINT "dossier_fournis_document_id_dossierFournis_fkey" FOREIGN KEY ("id_dossierFournis") REFERENCES public.dossier_fournis("id_dossierFournis") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dossier_fournis dossier_fournis_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_fournis
    ADD CONSTRAINT dossier_fournis_id_demande_fkey FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: etape_proc etape_proc_id_phase_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etape_proc
    ADD CONSTRAINT etape_proc_id_phase_fkey FOREIGN KEY (id_phase) REFERENCES public.phase(id_phase) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fonctionpersonnemoral fonctionpersonnemoral_id_detenteur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonctionpersonnemoral
    ADD CONSTRAINT fonctionpersonnemoral_id_detenteur_fkey FOREIGN KEY (id_detenteur) REFERENCES public.detenteurmorale(id_detenteur) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fonctionpersonnemoral fonctionpersonnemoral_id_personne_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonctionpersonnemoral
    ADD CONSTRAINT fonctionpersonnemoral_id_personne_fkey FOREIGN KEY (id_personne) REFERENCES public.personnephysique(id_personne) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fusionPermisSource fusionPermisSource_id_fusion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."fusionPermisSource"
    ADD CONSTRAINT "fusionPermisSource_id_fusion_fkey" FOREIGN KEY (id_fusion) REFERENCES public."demFusion"(id_fusion) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fusionPermisSource fusionPermisSource_id_permis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."fusionPermisSource"
    ADD CONSTRAINT "fusionPermisSource_id_permis_fkey" FOREIGN KEY (id_permis) REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inscription_provisoire inscription_provisoire_id_demande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription_provisoire
    ADD CONSTRAINT inscription_provisoire_id_demande_fkey FOREIGN KEY (id_demande) REFERENCES public.demande(id_demande) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inscription_provisoire inscription_provisoire_id_proc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription_provisoire
    ADD CONSTRAINT inscription_provisoire_id_proc_fkey FOREIGN KEY (id_proc) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notifications notifications_expertId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES public.expertminier(id_expert) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: obligationfiscale obligationfiscale_id_permis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obligationfiscale
    ADD CONSTRAINT obligationfiscale_id_permis_fkey FOREIGN KEY (id_permis) REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: obligationfiscale obligationfiscale_id_typePaiement_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obligationfiscale
    ADD CONSTRAINT "obligationfiscale_id_typePaiement_fkey" FOREIGN KEY ("id_typePaiement") REFERENCES public.typepaiement(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: paiement paiement_id_obligation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement
    ADD CONSTRAINT paiement_id_obligation_fkey FOREIGN KEY (id_obligation) REFERENCES public.obligationfiscale(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: permis permis_id_commune_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT permis_id_commune_fkey FOREIGN KEY (id_commune) REFERENCES public."Commune"(id_commune) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: permis permis_id_detenteur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT permis_id_detenteur_fkey FOREIGN KEY (id_detenteur) REFERENCES public.detenteurmorale(id_detenteur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: permis permis_id_statut_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT permis_id_statut_fkey FOREIGN KEY (id_statut) REFERENCES public."StatutPermis"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: permis permis_id_typePermis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT "permis_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES public.typepermis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: permis_templates permis_templates_permisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis_templates
    ADD CONSTRAINT "permis_templates_permisId_fkey" FOREIGN KEY ("permisId") REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: permis_templates permis_templates_typePermisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis_templates
    ADD CONSTRAINT "permis_templates_typePermisId_fkey" FOREIGN KEY ("typePermisId") REFERENCES public.typepermis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: personnephysique personnephysique_id_nationalite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnephysique
    ADD CONSTRAINT personnephysique_id_nationalite_fkey FOREIGN KEY (id_nationalite) REFERENCES public.nationalite(id_nationalite) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: personnephysique personnephysique_id_pays_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnephysique
    ADD CONSTRAINT personnephysique_id_pays_fkey FOREIGN KEY (id_pays) REFERENCES public.pays(id_pays) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: phase phase_typeProcedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phase
    ADD CONSTRAINT "phase_typeProcedureId_fkey" FOREIGN KEY ("typeProcedureId") REFERENCES public.typeprocedure(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: procedure_etape procedure_etape_id_etape_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_etape
    ADD CONSTRAINT procedure_etape_id_etape_fkey FOREIGN KEY (id_etape) REFERENCES public.etape_proc(id_etape) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procedure_etape procedure_etape_id_proc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_etape
    ADD CONSTRAINT procedure_etape_id_proc_fkey FOREIGN KEY (id_proc) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procedure procedure_id_seance_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure
    ADD CONSTRAINT procedure_id_seance_fkey FOREIGN KEY (id_seance) REFERENCES public."SeanceCDPrevue"(id_seance) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: procedure_phase procedure_phase_id_phase_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_phase
    ADD CONSTRAINT procedure_phase_id_phase_fkey FOREIGN KEY (id_phase) REFERENCES public.phase(id_phase) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procedure_phase procedure_phase_id_proc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_phase
    ADD CONSTRAINT procedure_phase_id_proc_fkey FOREIGN KEY (id_proc) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rapport_activite rapport_activite_id_permis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rapport_activite
    ADD CONSTRAINT rapport_activite_id_permis_fkey FOREIGN KEY (id_permis) REFERENCES public.permis(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: registrecommerce registrecommerce_id_detenteur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrecommerce
    ADD CONSTRAINT registrecommerce_id_detenteur_fkey FOREIGN KEY (id_detenteur) REFERENCES public.detenteurmorale(id_detenteur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: substance_associee_demande substance_associee_demande_id_proc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substance_associee_demande
    ADD CONSTRAINT substance_associee_demande_id_proc_fkey FOREIGN KEY (id_proc) REFERENCES public.procedure(id_proc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: substance_associee_demande substance_associee_demande_id_substance_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substance_associee_demande
    ADD CONSTRAINT substance_associee_demande_id_substance_fkey FOREIGN KEY (id_substance) REFERENCES public.substances(id_sub) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: substances substances_id_redevance_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances
    ADD CONSTRAINT substances_id_redevance_fkey FOREIGN KEY (id_redevance) REFERENCES public.redevance_bareme(id_redevance) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transfert_detenteur transfert_detenteur_id_detenteur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfert_detenteur
    ADD CONSTRAINT transfert_detenteur_id_detenteur_fkey FOREIGN KEY (id_detenteur) REFERENCES public.detenteurmorale(id_detenteur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transfert_detenteur transfert_detenteur_id_transfert_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfert_detenteur
    ADD CONSTRAINT transfert_detenteur_id_transfert_fkey FOREIGN KEY (id_transfert) REFERENCES public."demTransfert"(id_transfert) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: typepermis typepermis_id_taxe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typepermis
    ADD CONSTRAINT typepermis_id_taxe_fkey FOREIGN KEY (id_taxe) REFERENCES public.superficiaire_bareme(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

