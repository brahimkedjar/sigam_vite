interface TypePermis {
  id: number;
  lib_type: string;
}

interface TypeProcedure {
  id: number;
  libelle: string;
}

interface Document {
  id_doc: number;
  nom_doc: string;
}

interface Dossier {
  id_dossier: number;
  remarques: string;
  typePermis: TypePermis;
  typeProcedure: TypeProcedure;
  dossierDocuments: { document: Document }[];
}
