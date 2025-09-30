import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import styles from './SelectDetenteurModal.module.css';
import DetenteurCard from './DetenteurCard';
import { useAuthReady } from '@/src/hooks/useAuthReady';

const apiURL = process.env.NEXT_PUBLIC_API_URL || '';

export default function SelectDetenteurModal({ onClose, onSelect }) {
  const isAuthReady = useAuthReady();
  const [query, setQuery] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(
    async (value = '') => {
      if (!isAuthReady) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiURL}/transfert/detenteurs`, {
          params: { q: value },
          withCredentials: true,
        });
        setList(response.data);
      } catch (err) {
        console.error('Error fetching detenteurs:', err);
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Impossible de recuperer les detenteurs';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isAuthReady],
  );

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchList(query);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Selectionner un detenteur existant</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">x</button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Recherche par nom, societe, email..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                Go
              </button>
            </div>
          </form>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.results}>
            {loading ? (
              <div className={styles.loading}>Chargement...</div>
            ) : list.length > 0 ? (
              list.map((detenteur) => (
                <div key={detenteur.id_detenteur} className={styles.detenteurItem}>
                  <DetenteurCard detenteur={detenteur} />
                  <button
                    onClick={() => onSelect(detenteur)}
                    className={styles.selectButton}
                  >
                    Selectionner
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <p>Aucun detenteur trouve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
