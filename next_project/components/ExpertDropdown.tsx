'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiChevronDown, FiX } from 'react-icons/fi';
import styles from './ExpertDropdown.module.css';
type ExpertMinier = {
  id_expert: number;
  nom_expert: string;
  num_agrement: string;
  date_agrement: string;
  etat_agrement: string;
  adresse: string | null;
  email: string | null;
  tel_expert: string | null;
  fax_expert: string | null;
  specialisation: string | null;
};

type ExpertDropdownProps = {
  onSelect: (expert: ExpertMinier | null) => void;
  disabled?: boolean;
  initialExpert?: ExpertMinier | null;
};

export default function ExpertDropdown({ onSelect, disabled, initialExpert }: ExpertDropdownProps) {
  const [experts, setExperts] = useState<ExpertMinier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertMinier | null>(initialExpert || null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/experts`);
        const data = await response.json();
        console.log('Fetched experts:', data);
        setExperts(data);
      } catch (error) {
        console.error('Error fetching experts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  useEffect(() => {
    if (initialExpert) {
      setSelectedExpert(initialExpert);
    }
  }, [initialExpert]);

  const filteredExperts = experts.filter(expert =>
    expert.nom_expert.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.etat_agrement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (expert: ExpertMinier) => {
    setSelectedExpert(expert);
    onSelect(expert);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSelectedExpert(null);
    onSelect(null);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={() => !disabled && setIsOpen(!isOpen)}>
        {selectedExpert ? (
          <div className={styles.selectedExpert}>
            <span>{selectedExpert.nom_expert}</span>
            {!disabled && (
              <button onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }} className={styles.clearButton}>
                <FiX />
              </button>
            )}
          </div>
        ) : (
          <div className={styles.placeholder}>Sélectionner un expert...</div>
        )}
        <FiChevronDown className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className={styles.dropdownMenu}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Rechercher un expert..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          <div className={styles.expertList}>
            {loading ? (
              <div className={styles.loading}>Chargement...</div>
            ) : filteredExperts.length > 0 ? (
              filteredExperts.map(expert => (
                <div
                  key={expert.id_expert}
                  className={styles.expertItem}
                  onClick={() => handleSelect(expert)}
                >
                  <div className={styles.expertName}>{expert.nom_expert}</div>
                  <div className={styles.expertDetails}>
                    <span>{expert.specialisation}</span>
                    <span>{expert.etat_agrement}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>Aucun expert trouvé</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}