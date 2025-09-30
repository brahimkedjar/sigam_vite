// components/ConfigurationPanel.tsx
import React, { useState } from 'react';
import styles from './ConfigurationPanel.module.css';
import TitresMiniers from './TitresMiniers';
import TaxeSuperficiaireDroit from './TaxeSuperficiaireDroit';
import Substances from './Substances';
import StatutsJuridiques from './StatutsJuridiques';
import AdminLocations from './AdminLocations';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: 'titres-miniers', label: 'Titres miniers' },
  { id: 'substances', label: 'substances / redevances' },
  { id: 'taxe-superficiaire', label: 'Taxe superficiaire / produit' },
  { id: 'zones-exclusion', label: 'Zones d\'exclusion' },
  { id: 'loc-adm', label: 'Locations' },
  { id: 'statuts-juridiques', label: 'Statuts juridiques' },
];

const ConfigurationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const { currentView, navigateTo } = useViewNavigator('Configurations');

  const renderContent = () => {
    switch (activeTab) {
      case 'titres-miniers':
        return <div className={styles.contentPlaceholder}><TitresMiniers/></div>;
      case 'substances':
        return <div className={styles.contentPlaceholder}><Substances/></div>;
      case 'taxe-superficiaire':
        return <div className={styles.contentPlaceholder}><TaxeSuperficiaireDroit/></div>;
      case 'zones-exclusion':
        return <div className={styles.contentPlaceholder}></div>;
      case 'loc-adm':
        return <div className={styles.contentPlaceholder}><AdminLocations/></div>;
      case 'statuts-juridiques':
        return <div className={styles.contentPlaceholder}><StatutsJuridiques/></div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles['app-container']}>
              <Navbar />
              <div className={styles['app-content']}>
              <Sidebar currentView={currentView} navigateTo={navigateTo} />
                <main className={styles['main-content']}>
    <div className={styles.panelContainer}>
      <header className={styles.titleBar}>Configuration</header>
      <nav className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className={styles.contentArea}>
        {renderContent()}
      </main>
      <footer className={styles.footer}>
        <button className={styles.closeButton}>Fermer</button>
      </footer>
    </div>
    </main>
    </div>
</div>
  );
};

export default ConfigurationPanel;