import React, { useEffect, useMemo, useState } from 'react';
import styles from './TypePermisProcedures.module.css';

interface TypePermis {
  id: number;
  lib_type: string;
  code_type: string;
  regime: string;
}

interface TypeProcedure {
  id: number;
  libelle: string | null;
  description?: string | null;
}

interface CombinaisonPermisProc {
  id_combinaison: number;
  id_typePermis: number;
  id_typeProc: number;
  typePermis?: TypePermis;
  typeProc?: TypeProcedure;
}

const TypePermisProcedures: React.FC = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const [typePermisList, setTypePermisList] = useState<TypePermis[]>([]);
  const [typeProceduresList, setTypeProceduresList] = useState<TypeProcedure[]>(
    [],
  );
  const [combinaisons, setCombinaisons] = useState<CombinaisonPermisProc[]>([]);

  const [selectedPermisId, setSelectedPermisId] = useState<number | null>(null);
  const [searchPermis, setSearchPermis] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedPermis = useMemo(
    () => typePermisList.find((p) => p.id === selectedPermisId) ?? null,
    [typePermisList, selectedPermisId],
  );

  useEffect(() => {
    if (!apiURL) {
      setError('Configuration API manquante (NEXT_PUBLIC_API_URL).');
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchTypePermis(),
          fetchTypeProcedures(),
          fetchCombinaisons(),
        ]);
      } catch (err) {
        console.error(err);
        setError(
          'Erreur lors du chargement des types de permis, types de procédures ou combinaisons.',
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiURL]);

  const fetchTypePermis = async () => {
    if (!apiURL) return;
    const response = await fetch(`${apiURL}/conf/types-permis`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to load type permis');
    }
    const data = await response.json();
    setTypePermisList(data || []);
  };

  const fetchTypeProcedures = async () => {
    if (!apiURL) return;
    const response = await fetch(`${apiURL}/conf/type-procedures`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to load type procedures');
    }
    const data = await response.json();
    setTypeProceduresList(data || []);
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
  };

  const filteredPermis = useMemo(() => {
    const q = searchPermis.trim().toLowerCase();
    if (!q) return typePermisList;
    return typePermisList.filter((p) => {
      return (
        p.code_type.toLowerCase().includes(q) ||
        p.lib_type.toLowerCase().includes(q) ||
        p.regime.toLowerCase().includes(q)
      );
    });
  }, [typePermisList, searchPermis]);

  const assignedProcedureIds = useMemo(() => {
    if (!selectedPermisId) return new Set<number>();
    return new Set(
      combinaisons
        .filter((c) => c.id_typePermis === selectedPermisId)
        .map((c) => c.id_typeProc),
    );
  }, [combinaisons, selectedPermisId]);

  const findCombinaison = (id_typePermis: number, id_typeProc: number) =>
    combinaisons.find(
      (c) =>
        c.id_typePermis === id_typePermis && c.id_typeProc === id_typeProc,
    ) ?? null;

  const handleToggleProcedure = async (
    procedure: TypeProcedure,
    nextChecked: boolean,
  ) => {
    if (!apiURL || !selectedPermisId) return;
    setSaving(true);
    try {
      setError(null);
      if (nextChecked) {
        const response = await fetch(`${apiURL}/phases-etapes/combinaisons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id_typePermis: selectedPermisId,
            id_typeProc: procedure.id,
          }),
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to create combinaison');
        }
      } else {
        const combinaison = findCombinaison(selectedPermisId, procedure.id);
        if (!combinaison) return;
        const response = await fetch(
          `${apiURL}/phases-etapes/combinaisons/${combinaison.id_combinaison}`,
          {
            method: 'DELETE',
            credentials: 'include',
          },
        );
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to delete combinaison');
        }
      }
      await fetchCombinaisons();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "Erreur lors de la mise à jour des combinaisons type permis / type procédure.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Chargement des types de permis et procédures...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Configuration des procédures par type de permis</h2>
        <p>
          Pour chaque type de permis, sélectionnez les types de procédures
          autorisés (demande, renouvellement, extension, etc.). Ces
          combinaisons sont ensuite utilisées pour définir les phases et étapes
          applicables.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.columns}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Types de permis</h3>
            <span>{typePermisList.length} types</span>
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Filtrer par code, libellé ou régime..."
            value={searchPermis}
            onChange={(event) => setSearchPermis(event.target.value)}
          />
          <div className={styles.permisList}>
            {filteredPermis.length === 0 ? (
              <div className={styles.emptyState}>
                Aucun type de permis ne correspond à la recherche.
              </div>
            ) : (
              filteredPermis.map((permis) => {
                const assignedCount = combinaisons.filter(
                  (c) => c.id_typePermis === permis.id,
                ).length;
                return (
                  <button
                    key={permis.id}
                    type="button"
                    className={`${styles.permisItem} ${
                      selectedPermisId === permis.id
                        ? styles.permisItemSelected
                        : ''
                    }`}
                    onClick={() => setSelectedPermisId(permis.id)}
                  >
                    <div className={styles.permisMain}>
                      <div className={styles.permisTitle}>
                        {permis.code_type} — {permis.lib_type}
                      </div>
                      <div className={styles.permisSubtitle}>
                        Régime : {permis.regime}
                      </div>
                      <div className={styles.permisMeta}>
                        Procédures liées : {assignedCount}
                      </div>
                    </div>
                    <span className={styles.badge}>ID {permis.id}</span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.proceduresHeader}>
            <h3>Types de procédures</h3>
            {selectedPermis ? (
              <span>
                Pour le type de permis{' '}
                <strong>
                  {selectedPermis.code_type} — {selectedPermis.lib_type}
                </strong>
              </span>
            ) : (
              <span>Sélectionnez un type de permis pour configurer.</span>
            )}
          </div>

          {selectedPermis ? (
            <div className={styles.procedureList}>
              {typeProceduresList.length === 0 ? (
                <div className={styles.emptyState}>
                  Aucun type de procédure défini.
                </div>
              ) : (
                typeProceduresList.map((proc) => {
                  const isAssigned = assignedProcedureIds.has(proc.id);
                  return (
                    <div key={proc.id} className={styles.procedureItem}>
                      <div className={styles.procedureText}>
                        <div className={styles.procedureTitle}>
                          {proc.libelle || `Procédure #${proc.id}`}
                        </div>
                        <div className={styles.procedureMeta}>
                          ID {proc.id}
                          {isAssigned ? ' • Affectée' : ' • Non affectée'}
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`${styles.toggle} ${
                          isAssigned ? styles.toggleOn : ''
                        }`}
                        disabled={saving}
                        onClick={() =>
                          handleToggleProcedure(proc, !isAssigned)
                        }
                      >
                        <span className={styles.toggleThumb} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              Sélectionnez un type de permis dans la liste de gauche pour
              afficher et modifier ses procédures associées.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TypePermisProcedures;

