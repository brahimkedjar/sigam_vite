// components/Dashboard.tsx
'use client';

import Link from 'next/link';
import styles from './Dashboard.module.css';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';

export default function Dashboard() {
      const { currentView, navigateTo } = useViewNavigator('Gestion_seances');
    
  const modules = [
    {
      id: 1,
      title: "Programmation des Séances",
      description: "Créer et gérer les séances de comité",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      link: "/seances/seances",
      buttonClass: styles.buttonSeance,
      iconClass: styles.iconSeance
    },
    {
      id: 2,
      title: "Saisie des Décisions",
      description: "Enregistrer les décisions du comité",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      link: "/seances/DecisionEntry",
      buttonClass: styles.buttonDecision,
      iconClass: styles.iconDecision
    },
    {
      id: 3,
      title: "Suivi des Décisions",
      description: "Consulter les décisions du comité",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      link: "/seances/suivi_decision",
      buttonClass: styles.buttonTracking,
      iconClass: styles.iconTracking
    },
    {
      id: 4,
      title: "Mon Planning",
      description: "Planning personnel des séances",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      link: "/seances/PersonalPlanning",
      buttonClass: styles.buttonPlanning,
      iconClass: styles.iconPlanning
    }
  ];

  return (
    <div className={styles.appContainer}>
          <Navbar />
          <div className={styles.appContent}>
            <Sidebar currentView={currentView} navigateTo={navigateTo} />
            <main className={styles.mainContent}>
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tableau de Bord</h1>
        <p className={styles.subtitle}>Gestion des comités et décisions ministérielles</p>
      </header>

      <div className={styles.modulesGrid}>
        {modules.map((module) => (
          <div key={module.id} className={styles.moduleCard}>
            <div className={styles.moduleHeader}>
              <div className={`${styles.moduleIcon} ${module.iconClass}`}>
                {module.icon}
              </div>
              <h2 className={styles.moduleTitle}>{module.title}</h2>
              <p className={styles.moduleDescription}>{module.description}</p>
            </div>
            <div className={styles.moduleContent}>
              <Link href={module.link} className={`${styles.accessButton} ${module.buttonClass}`}>
                Accéder
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
    </div>
    </main>
    </div>
    </div>
    
  );
}