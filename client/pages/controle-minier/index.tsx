// layouts/MiningControlLayout.tsx
import { useState } from 'react';
import styles from './styles/MiningControlLayout.module.css';
import CahierChargesSection from './CahierCharges';
import RapportActiviteSection from './RapportActivite';

export default function MiningControlLayout() {
  const [activeSection, setActiveSection] = useState('permis-minier');
  
  const sections = [
    { id: 'cahier-charges', title: 'Cahier des Charges' },
    { id: 'rapport-activite', title: 'Rapport d\'Activité' },
    { id: 'documents-reglementaires', title: 'Documents Règlementaires' },
    { id: 'redevance-extraction', title: 'Redevance d\'Extraction' },
    { id: 'redressements-recours', title: 'Redressements & Recours' },
    { id: 'compte-sequestre', title: 'Compte Séquestre' },
    { id: 'accidents-travail', title: 'Accidents de Travail' },
    { id: 'pv-inspection', title: 'PV d\'Inspection' },
    { id: 'interventions-police', title: 'Interventions Police des Mines' },
    { id: 'exploitations-illicites', title: 'Exploitations Illicites' },
    { id: 'sanctions-infractions', title: 'Sanctions/Infractions' },
    { id: 'traitement-dossiers', title: 'Traitement des Dossiers' }
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Contrôle Minier</h2>
        <nav>
          <ul className={styles.navList}>
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeSection === 'cahier-charges' && <CahierChargesSection />}
        {activeSection === 'rapport-activite' && <RapportActiviteSection />}
        
      </main>
    </div>
  );
}