import React, { useEffect, useMemo, useState } from 'react';
import styles from './PhasesEtapes.module.css';

interface Etape {
  id_etape: number;
  lib_etape: string;
  duree_etape: number | null;
  ordre_etape: number;
  id_phase: number | null;
  page_route?: string | null;
}

interface Phase {
  id_phase: number;
  libelle: string;
  ordre: number;
  description?: string | null;
  etapes?: Etape[];
}

interface TypePermisLite {
  id: number;
  code_type: string;
  lib_type: string | null;
}

interface TypeProcedureLite {
  id: number;
  libelle: string | null;
}

interface CombinaisonPermisProc {
  id_combinaison: number;
  id_typePermis: number;
  id_typeProc: number;
  typePermis: TypePermisLite;
  typeProc: TypeProcedureLite;
  duree_regl_proc?: number | null;
}

interface RelationPhaseTypeProc {
  id_relation: number;
  id_phase: number;
  id_combinaison: number;
  ordre: number | null;
  dureeEstimee: number | null;
  phase: Phase;
}

const PhasesEtapes: React.FC = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);

  const [phaseForm, setPhaseForm] = useState({
    id_phase: null as number | null,
    libelle: '',
    ordre: '',
    description: '',
  });
  const [isEditingPhase, setIsEditingPhase] = useState(false);

  const [etapeForm, setEtapeForm] = useState({
    id_etape: null as number | null,
    lib_etape: '',
    duree_etape: '',
    ordre_etape: '',
    page_route: '',
  });
  const [isEditingEtape, setIsEditingEtape] = useState(false);
  const [selectedEtapeTemplateId, setSelectedEtapeTemplateId] = useState('');

  const [combinaisons, setCombinaisons] = useState<CombinaisonPermisProc[]>([]);
  const [selectedCombinaisonId, setSelectedCombinaisonId] = useState<number | null>(null);
  const [combinaisonSearch, setCombinaisonSearch] = useState('');
  const [relations, setRelations] = useState<RelationPhaseTypeProc[]>([]);

  const [relationForm, setRelationForm] = useState({
    id_phase: '',
    ordre: '',
    dureeEstimee: '',
  });

  const selectedPhase = useMemo(
    () => phases.find((p) => p.id_phase === selectedPhaseId) ?? null,
    [phases, selectedPhaseId],
  );

  // Étapes disponibles comme modèles ("Étape existante").
  // On ne les dérive plus seulement des phases, car une étape
  // peut être détachée d'une phase tout en restant réutilisable.
  const [etapesTemplates, setEtapesTemplates] = useState<
    (Etape & { phaseLibelle?: string | null })[]
  >([]);

  const allEtapesTemplates = useMemo(
    () =>
      etapesTemplates.map((etape) => ({
        ...etape,
        phaseLibelle: etape.phaseLibelle ?? 'Non affectée',
      })),
    [etapesTemplates],
  );

  const filteredCombinaisons = useMemo(() => {
    const q = combinaisonSearch.trim().toLowerCase();
    if (!q) return combinaisons;
      return combinaisons.filter((combinaison) => {
      const tp = combinaison.typePermis;
      const tr = combinaison.typeProc;
      const label =
        `${tp.code_type || ''} ${tp.lib_type || ''} ${tr.libelle || ''}`.toLowerCase();
      return label.includes(q);
    });
  }, [combinaisons, combinaisonSearch]);

  const selectedCombinaison = useMemo(
    () =>
      combinaisons.find(
        (c) => c.id_combinaison === selectedCombinaisonId,
      ) ?? null,
    [combinaisons, selectedCombinaisonId],
  );

  const handleTemplateChangeWithRoute = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setSelectedEtapeTemplateId(value);
    if (!value) return;
    const id = Number(value);
    const template = allEtapesTemplates.find(
      (etape) => etape.id_etape === id,
    );
    if (!template) return;
    setEtapeForm({
      // On utilise l'étape existante comme modèle,
      // mais on crée une nouvelle étape pour la phase sélectionnée.
      id_etape: null,
      lib_etape: template.lib_etape || '',
      duree_etape:
        template.duree_etape == null ? '' : String(template.duree_etape ?? ''),
      ordre_etape: String(template.ordre_etape ?? ''),
      page_route: template.page_route || '',
    });
    // On reste en mode création pour ne pas modifier / supprimer
    // l'étape d'origine dans la base.
    setIsEditingEtape(false);
  };

  useEffect(() => {
    if (!apiURL) {
      setError('Configuration API manquante (NEXT_PUBLIC_API_URL).');
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchPhases(), fetchCombinaisons(), fetchEtapesTemplates()]);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des phases et combinaisons.');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiURL]);

  const fetchPhases = async () => {
    if (!apiURL) return;
    const response = await fetch(`${apiURL}/phases-etapes/phases`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to load phases');
    }
    const data = await response.json();
    setPhases(data || []);
  };

  const fetchEtapesTemplates = async () => {
    if (!apiURL) return;
    const response = await fetch(`${apiURL}/phases-etapes/etapes`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to load etapes');
    }
    const data = await response.json();
    // Enrichir avec libellé de phase si présent
    const enriched =
      (data || []).map((e: any) => ({
        ...e,
        phaseLibelle: e.phase?.libelle ?? null,
      })) ?? [];
    setEtapesTemplates(enriched);
  };

  const fetchCombinaisons = async () => {
    if (!apiURL) return;
    const response = await fetch(`${apiURL}/phases-etapes/combinaisons`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to load combinaisons');
    }
    const data = (await response.json()) as CombinaisonPermisProc[];
    setCombinaisons(data || []);
    if (data && data.length > 0 && selectedCombinaisonId == null) {
      const first = data[0];
      setSelectedCombinaisonId(first.id_combinaison);
      fetchRelations(first.id_combinaison).catch((err) => {
        console.error(err);
      });
    }
  };

  const fetchRelations = async (id_combinaison: number) => {
    if (!apiURL) return;
    const response = await fetch(
      `${apiURL}/phases-etapes/relations/${id_combinaison}`,
      { credentials: 'include' },
    );
    if (!response.ok) {
      throw new Error('Failed to load relations');
    }
    const data = (await response.json()) as RelationPhaseTypeProc[];
    setRelations(data || []);
  };

  const resetPhaseForm = () => {
    setPhaseForm({
      id_phase: null,
      libelle: '',
      ordre: '',
      description: '',
    });
    setIsEditingPhase(false);
  };

  const resetEtapeForm = () => {
    setEtapeForm({
      id_etape: null,
      lib_etape: '',
      duree_etape: '',
      ordre_etape: '',
      page_route: '',
    });
    setIsEditingEtape(false);
  };

  const handlePhaseSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiURL) return;
    if (!phaseForm.libelle.trim()) {
      setError('Le libellé de la phase est obligatoire.');
      return;
    }
    const ordreValue = Number(phaseForm.ordre);
    if (Number.isNaN(ordreValue)) {
      setError("L'ordre de la phase doit être un nombre.");
      return;
    }
    try {
      setError(null);
      const payload = {
        libelle: phaseForm.libelle.trim(),
        ordre: ordreValue,
        description: phaseForm.description.trim() || null,
      };
      const isEdit = isEditingPhase && phaseForm.id_phase != null;
      const url = isEdit
        ? `${apiURL}/phases-etapes/phases/${phaseForm.id_phase}`
        : `${apiURL}/phases-etapes/phases`;
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to save phase');
      }
      await fetchPhases();
      resetPhaseForm();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement de la phase.");
    }
  };

  const handleEditPhase = (phase: Phase) => {
    setPhaseForm({
      id_phase: phase.id_phase,
      libelle: phase.libelle || '',
      ordre: String(phase.ordre ?? ''),
      description: phase.description || '',
    });
    setIsEditingPhase(true);
  };

  const handleDeletePhase = async (phase: Phase) => {
    if (!apiURL) return;
    const confirmDelete = window.confirm(
      `Supprimer la phase "${phase.libelle}" ? Cette opération est irréversible.`,
    );
    if (!confirmDelete) return;
    try {
      setError(null);
      const response = await fetch(
        `${apiURL}/phases-etapes/phases/${phase.id_phase}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Delete failed');
      }
      if (selectedPhaseId === phase.id_phase) {
        setSelectedPhaseId(null);
        resetEtapeForm();
      }
      await fetchPhases();
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de supprimer la phase (elle est peut-être utilisée par des procédures).",
      );
    }
  };

  const handleEtapeSubmitWithRoute = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiURL) return;
    if (!selectedPhase) {
      setError("Sélectionnez d'abord une phase.");
      return;
    }
    if (!etapeForm.lib_etape.trim()) {
      setError("Le libellé de l'étape est obligatoire.");
      return;
    }
    const ordreValue = Number(etapeForm.ordre_etape);
    if (Number.isNaN(ordreValue)) {
      setError("L'ordre de l'étape doit être un nombre.");
      return;
    }
    const dureeValue =
      etapeForm.duree_etape.trim() === ''
        ? null
        : Number(etapeForm.duree_etape);
    if (etapeForm.duree_etape && Number.isNaN(dureeValue)) {
      setError("La durée de l'étape doit être un nombre.");
      return;
    }
    const pageRouteRaw = etapeForm.page_route.trim();
    const normalizedPageRoute =
      pageRouteRaw === '' ? null : pageRouteRaw.replace(/^\/+/, '');
    try {
      setError(null);
      const payload = {
        lib_etape: etapeForm.lib_etape.trim(),
        ordre_etape: ordreValue,
        duree_etape: dureeValue,
        id_phase: selectedPhase.id_phase,
        page_route: normalizedPageRoute,
      };
      const isEdit = isEditingEtape && etapeForm.id_etape != null;
      const url = isEdit
        ? `${apiURL}/phases-etapes/etapes/${etapeForm.id_etape}`
        : `${apiURL}/phases-etapes/etapes`;
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to save etape');
      }
      await Promise.all([fetchPhases(), fetchEtapesTemplates()]);
      resetEtapeForm();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement de l'étape.");
    }
  };

  const handleEditEtapeWithRoute = (etape: Etape) => {
    setEtapeForm({
      id_etape: etape.id_etape,
      lib_etape: etape.lib_etape || '',
      duree_etape:
        etape.duree_etape == null ? '' : String(etape.duree_etape ?? ''),
      ordre_etape: String(etape.ordre_etape ?? ''),
      page_route: etape.page_route || '',
    });
    setIsEditingEtape(true);
  };

  const handleDeleteEtape = async (etape: Etape) => {
    if (!apiURL) return;
    const confirmDelete = window.confirm(
      `Supprimer l'étape "${etape.lib_etape}" ? Cette opération est irréversible.`,
    );
    if (!confirmDelete) return;
    try {
      setError(null);
      const response = await fetch(
        `${apiURL}/phases-etapes/etapes/${etape.id_etape}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Delete failed');
      }
      await Promise.all([fetchPhases(), fetchEtapesTemplates()]);
      if (isEditingEtape && etapeForm.id_etape === etape.id_etape) {
        resetEtapeForm();
      }
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de supprimer l'étape (elle est peut-être utilisée par des procédures).",
      );
    }
  };

  const handleCombinaisonChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    if (!value) {
      setSelectedCombinaisonId(null);
      setRelations([]);
      return;
    }
    const id = Number(value);
    setSelectedCombinaisonId(id);
    try {
      await fetchRelations(id);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des relations pour cette combinaison.');
    }
  };

  const handleRelationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiURL) return;
    if (selectedCombinaisonId == null) {
      setError('Sélectionnez une combinaison type permis / type procédure.');
      return;
    }
    if (!relationForm.id_phase) {
      setError('Sélectionnez une phase à affecter.');
      return;
    }
    const dureeValue =
      relationForm.dureeEstimee.trim() === ''
        ? null
        : Number(relationForm.dureeEstimee);
    if (relationForm.dureeEstimee && Number.isNaN(dureeValue)) {
      setError('La durée estimée doit être un nombre.');
      return;
    }
    try {
      setError(null);
      const response = await fetch(`${apiURL}/phases-etapes/relations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id_phase: Number(relationForm.id_phase),
          id_combinaison: selectedCombinaisonId,
          ordre:
            relationForm.ordre.trim() === ''
              ? null
              : Number(relationForm.ordre),
          dureeEstimee: dureeValue,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to create relation');
      }
      setRelationForm({ id_phase: '', ordre: '', dureeEstimee: '' });
      await fetchRelations(selectedCombinaisonId);
    } catch (err) {
      console.error(err);
      setError(
        'Erreur lors de la création de la relation phase / type de procédure.',
      );
    }
  };

  const handleDeleteRelation = async (relation: RelationPhaseTypeProc) => {
    if (!apiURL || selectedCombinaisonId == null) return;
    const confirmDelete = window.confirm(
      `Retirer la phase "${relation.phase.libelle}" de cette combinaison ?`,
    );
    if (!confirmDelete) return;
    try {
      setError(null);
      const response = await fetch(
        `${apiURL}/phases-etapes/relations/${relation.id_relation}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Delete failed');
      }
      await fetchRelations(selectedCombinaisonId);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la relation.");
    }
  };

  const availablePhasesForRelation = useMemo(() => {
    const usedPhaseIds = new Set(relations.map((r) => r.id_phase));
    return phases.filter((phase) => !usedPhaseIds.has(phase.id_phase));
  }, [phases, relations]);

  if (loading) {
    return <div className={styles.loading}>Chargement des phases et étapes...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Configuration des phases et étapes</h2>
        <p>
          Définissez les phases et les étapes, puis affectez-les aux combinaisons
          type de permis / type de procédure. Les procédures de demandes
          utiliseront ces configurations pour générer automatiquement leurs phases et étapes.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.columns}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Phases</h3>
            <span>{phases.length} phases</span>
          </div>

          <form className={styles.form} onSubmit={handlePhaseSubmit}>
            <div className={styles.formGroup}>
              <label>Libellé</label>
              <input
                type="text"
                value={phaseForm.libelle}
                onChange={(event) =>
                  setPhaseForm((prev) => ({
                    ...prev,
                    libelle: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Ordre</label>
              <input
                type="number"
                value={phaseForm.ordre}
                onChange={(event) =>
                  setPhaseForm((prev) => ({
                    ...prev,
                    ordre: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.formFullRow}`}>
              <label>Description</label>
              <textarea
                value={phaseForm.description}
                onChange={(event) =>
                  setPhaseForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div className={styles.formActions}>
              {isEditingPhase && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={resetPhaseForm}
                >
                  Annuler
                </button>
              )}
              <button type="submit" className={styles.primaryButton}>
                {isEditingPhase ? 'Mettre à jour la phase' : 'Ajouter la phase'}
              </button>
            </div>
          </form>

          <div className={styles.list}>
            {phases.length === 0 ? (
              <div className={styles.emptyState}>
                Aucune phase définie pour le moment.
              </div>
            ) : (
              phases.map((phase) => (
                <div
                  key={phase.id_phase}
                  className={`${styles.itemCard} ${
                    selectedPhaseId === phase.id_phase
                      ? styles.itemCardSelected
                      : ''
                  }`}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitle}>
                      {phase.ordre}. {phase.libelle}
                    </div>
                    {phase.description && (
                      <div className={styles.itemSubtitle}>
                        {phase.description}
                      </div>
                    )}
                    <div className={styles.itemMeta}>
                      Étapes : {phase.etapes ? phase.etapes.length : 0}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => setSelectedPhaseId(phase.id_phase)}
                    >
                      Étapes
                    </button>
                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => handleEditPhase(phase)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className={`${styles.smallButton} ${styles.dangerButton}`}
                      onClick={() => handleDeletePhase(phase)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.etapesHeader}>
            <h3>Étapes de la phase sélectionnée</h3>
            {selectedPhase ? (
              <span>
                Phase sélectionnée :{' '}
                <strong>
                  {selectedPhase.ordre}. {selectedPhase.libelle}
                </strong>
              </span>
            ) : (
              <span>Aucune phase sélectionnée.</span>
            )}
          </div>

          {selectedPhase ? (
            <>
              <form className={styles.form} onSubmit={handleEtapeSubmitWithRoute}>
                <div className={styles.formGroup}>
                  <label>Libellé de l'étape</label>
                  <input
                    type="text"
                    value={etapeForm.lib_etape}
                    onChange={(event) =>
                      setEtapeForm((prev) => ({
                        ...prev,
                        lib_etape: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ordre</label>
                  <input
                    type="number"
                    value={etapeForm.ordre_etape}
                    onChange={(event) =>
                      setEtapeForm((prev) => ({
                        ...prev,
                        ordre_etape: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Durée estimée (jours)</label>
                  <input
                    type="number"
                    value={etapeForm.duree_etape}
                    onChange={(event) =>
                      setEtapeForm((prev) => ({
                        ...prev,
                        duree_etape: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Route de la page (frontend)</label>
                  <input
                    type="text"
                    placeholder="ex: demande/step1/page1"
                    value={etapeForm.page_route}
                    onChange={(event) =>
                      setEtapeForm((prev) => ({
                        ...prev,
                        page_route: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.formActions}>
                  {isEditingEtape && (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={resetEtapeForm}
                    >
                      Annuler
                    </button>
                  )}
                  <button type="submit" className={styles.primaryButton}>
                    {isEditingEtape ? "Mettre à jour l'étape" : "Ajouter l'étape"}
                  </button>
                </div>
              </form>

              <div className={styles.formGroup1}>
                <label>Étape existante</label>
                <select
                  value={selectedEtapeTemplateId}
                  onChange={handleTemplateChangeWithRoute}
                >
                  <option value="">-- Sélectionnez une étape --</option>
                  {allEtapesTemplates.map((etape) => (
                    <option key={etape.id_etape} value={etape.id_etape}>
                      {etape.lib_etape} (phase: {etape.phaseLibelle})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.list}>
                {selectedPhase.etapes && selectedPhase.etapes.length > 0 ? (
                  selectedPhase.etapes.map((etape) => (
                    <div key={etape.id_etape} className={styles.itemCard}>
                      <div className={styles.itemMain}>
                        <div className={styles.itemTitle}>
                          {etape.ordre_etape}. {etape.lib_etape}
                        </div>
                        <div className={styles.itemMeta}>
                          Durée estimée :{' '}
                          {etape.duree_etape != null
                            ? `${etape.duree_etape} jours`
                            : 'non définie'}
                        </div>
                        {etape.page_route && (
                          <div className={styles.itemMeta}>
                            Route : {etape.page_route}
                          </div>
                        )}
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={() => handleEditEtapeWithRoute(etape)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className={`${styles.smallButton} ${styles.dangerButton}`}
                          onClick={() => handleDeleteEtape(etape)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    Aucune étape définie pour cette phase.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              Sélectionnez une phase dans la liste de gauche pour gérer ses étapes.
            </div>
          )}
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Affectation aux types de demandes</h3>
          <span>
            Définissez, pour chaque combinaison type de permis / type de
            procédure, quelles phases s'appliquent.
          </span>
        </div>

        <div className={styles.combinaisonSelectRow}>
          <label>Combinaison</label>
          <div className={styles.combinaisonSelectColumn}>
            <input
              type="text"
              className={styles.combinaisonSearchInput}
              placeholder="Rechercher par type permis / procédure..."
              value={combinaisonSearch}
              onChange={(event) => setCombinaisonSearch(event.target.value)}
            />
            <select
              value={selectedCombinaisonId ?? ''}
              onChange={handleCombinaisonChange}
            >
              <option value="">-- Sélectionnez une combinaison --</option>
              {filteredCombinaisons.map((combinaison) => (
                <option
                  key={combinaison.id_combinaison}
                  value={combinaison.id_combinaison}
                >
                  {combinaison.typePermis.code_type} -{' '}
                  {combinaison.typePermis.lib_type} /{' '}
                  {combinaison.typeProc.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCombinaisonId != null && (
          <>
            {selectedCombinaison && (
              <div className={styles.list}>
                <div className={styles.itemCard}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitle}>
                      Durée réglementaire de la procédure
                    </div>
                    <div className={styles.itemMeta}>
                      Type permis : {selectedCombinaison.typePermis.code_type} -{' '}
                      {selectedCombinaison.typePermis.lib_type} / Type procédure :{' '}
                      {selectedCombinaison.typeProc.libelle}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <input
                      key={`${selectedCombinaison.id_combinaison}-${selectedCombinaison.duree_regl_proc ?? ''}`}
                      type="number"
                      className={styles.durationInput}
                      placeholder="Durée (jours)"
                      defaultValue={
                        selectedCombinaison.duree_regl_proc != null
                          ? String(selectedCombinaison.duree_regl_proc)
                          : ''
                      }
                      onBlur={async (event) => {
                        if (!apiURL || selectedCombinaisonId == null) return;
                        const raw = event.target.value.trim();
                        const value =
                          raw === '' ? null : Number(raw);
                        if (raw !== '' && Number.isNaN(value)) {
                          setError('La durée réglementaire doit être un nombre.');
                          return;
                        }
                        try {
                          setError(null);
                          const response = await fetch(
                            `${apiURL}/phases-etapes/combinaisons/${selectedCombinaisonId}`,
                            {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                duree_regl_proc: value,
                              }),
                            },
                          );
                          if (!response.ok) {
                            const text = await response.text();
                            throw new Error(text || 'Failed to update combinaison');
                          }
                          await fetchCombinaisons();
                        } catch (err) {
                          console.error(err);
                          setError(
                            "Erreur lors de la mise à jour de la durée réglementaire.",
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.relationsList}>
              {relations.length === 0 ? (
                <div className={styles.emptyState}>
                  Aucune phase affectée à cette combinaison pour le moment.
                </div>
              ) : (
                relations.map((relation) => (
                  <div key={relation.id_relation} className={styles.itemCard}>
                    <div className={styles.itemMain}>
                      <div className={styles.itemTitle}>
                        {(relation.ordre ?? relation.phase.ordre)}. {relation.phase.libelle}
                      </div>
                      <div className={styles.itemMeta}>
                        Durée estimée totale :{' '}
                        {relation.dureeEstimee != null
                          ? `${relation.dureeEstimee} jours`
                          : 'non définie'}
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <span className={styles.badge}>Phase</span>
                      <input
                        type="number"
                        className={styles.durationInput}
                        defaultValue={
                          relation.ordre != null ? String(relation.ordre) : ''
                        }
                        placeholder="Ordre"
                        onBlur={async (event) => {
                          if (!apiURL) return;
                          const raw = event.target.value.trim();
                          const value = raw === '' ? null : Number(raw);
                          if (raw !== '' && Number.isNaN(value)) {
                            setError("L'ordre doit être un nombre.");
                            return;
                          }
                          try {
                            setError(null);
                            const response = await fetch(
                              `${apiURL}/phases-etapes/relations/${relation.id_relation}`,
                              {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                  ordre: value,
                                }),
                              },
                            );
                            if (!response.ok) {
                              const text = await response.text();
                              throw new Error(text || 'Failed to update relation');
                            }
                            await fetchRelations(relation.id_combinaison);
                          } catch (err) {
                            console.error(err);
                            setError(
                              "Erreur lors de la mise à jour de l'ordre de la phase.",
                            );
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={`${styles.smallButton} ${styles.dangerButton}`}
                        onClick={() => handleDeleteRelation(relation)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className={styles.form} onSubmit={handleRelationSubmit}>
              <div className={styles.formGroup}>
                <label>Phase à ajouter</label>
                <select
                  value={relationForm.id_phase}
                  onChange={(event) =>
                    setRelationForm((prev) => ({
                      ...prev,
                      id_phase: event.target.value,
                    }))
                  }
                >
                  <option value="">-- Sélectionnez une phase --</option>
                  {availablePhasesForRelation.map((phase) => (
                    <option key={phase.id_phase} value={phase.id_phase}>
                      {phase.ordre}. {phase.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup1}>
                <label>Durée estimée totale (jours)</label>
                <input
                  type="number"
                  className={styles.durationInput}
                  value={relationForm.dureeEstimee}
                  onChange={(event) =>
                    setRelationForm((prev) => ({
                      ...prev,
                      dureeEstimee: event.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryButton}>
                  Ajouter la phase à la combinaison
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default PhasesEtapes;
