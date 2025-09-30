'use client';

import { useEffect, useState, useCallback } from 'react';
import { format, isToday, isAfter, isThisMonth, parseISO, isValid, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './PersonalPlanning.module.css';
import Link from 'next/link';
interface Member {
  id_membre: number;
  nom_membre: string;
  prenom_membre: string;
}

interface Procedure {
  id_proc: number;
  num_proc: string;
  demandes: Array<{
    detenteur: { nom_societeFR: string };
    typeProcedure: { // 🔑 Moved typeProcedure inside demande
      libelle: string;
    };
  }>;
  // 🔑 Removed typeProcedure from Procedure level
}

interface Seance {
  id_seance: number;
  num_seance: string;
  date_seance: string;
  duree?: number;
  statut: 'programmee' | 'terminee';
  membres: Member[];
  procedures: Procedure[];
}



const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => new Date(0, 0, 1), // Monday as first day
  getDay,
  locales: { fr },
});

export default function PersonalPlanning() {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'month' | 'all'>('today');
  const [calendarView, setCalendarView] = useState<boolean>(false);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const response = await fetch(`${apiURL}/api/seances/member/1`); // Replace with actual member ID
        const data = await response.json();
        const validSeances = data.filter((s: Seance) => isValid(parseISO(s.date_seance)));
        setSeances(validSeances);
      } catch (error) {
        console.error('Erreur lors de la récupération des séances :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeances();
  }, [apiURL]);

  const todaySeances = seances
    .filter(s => isToday(parseISO(s.date_seance)))
    .sort((a, b) => a.date_seance.localeCompare(b.date_seance));

  const upcomingSeances = seances
    .filter(s => isAfter(parseISO(s.date_seance), new Date()) && !isToday(parseISO(s.date_seance)))
    .sort((a, b) => a.date_seance.localeCompare(b.date_seance));

  const thisMonthSeances = seances.filter(s => isThisMonth(parseISO(s.date_seance)));

  const filteredSeances = useCallback(() => {
    switch (activeFilter) {
      case 'today': return todaySeances;
      case 'upcoming': return upcomingSeances;
      case 'month': return thisMonthSeances;
      default: return seances;
    }
  }, [activeFilter, seances, todaySeances, upcomingSeances, thisMonthSeances]);

  const calendarEvents = seances.map(seance => ({
    id: seance.id_seance,
    title: seance.num_seance,
    start: new Date(seance.date_seance),
    end: new Date(new Date(seance.date_seance).getTime() + (seance.duree || 1) * 60 * 60 * 1000),
    allDay: false,
    resource: seance
  }));

  const handleNavigate = (newDate: Date) => {
    // Handle calendar navigation if needed
  };

  const handleSelectEvent = (event: any) => {
    // Handle event selection if needed
    console.log('Selected event:', event.resource);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement du planning...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
            
          <h1 className={styles.title}>Mon Planning Personnel</h1>
          <p className={styles.subtitle}>Séances de comité programmées</p>
          <Link href="/seances/Dashboard_seances" className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
               viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour au menu
        </Link>
        </div>
        
        <button 
          onClick={() => setCalendarView(!calendarView)}
          className={styles.viewToggle}
        >
          {calendarView ? 'Vue Liste' : 'Vue Calendrier'}
        </button>
      </header>

      <div className={styles.statsGrid}>
        <div 
          className={`${styles.statCard} ${activeFilter === 'today' ? styles.activeStat : ''}`}
          onClick={() => setActiveFilter('today')}
        >
          <div className={styles.statValue}>{todaySeances.length}</div>
          <div className={styles.statLabel}>Aujourd'hui</div>
        </div>

        <div 
          className={`${styles.statCard} ${activeFilter === 'upcoming' ? styles.activeStat : ''}`}
          onClick={() => setActiveFilter('upcoming')}
        >
          <div className={styles.statValue}>{upcomingSeances.length}</div>
          <div className={styles.statLabel}>À venir</div>
        </div>

        <div 
          className={`${styles.statCard} ${activeFilter === 'month' ? styles.activeStat : ''}`}
          onClick={() => setActiveFilter('month')}
        >
          <div className={styles.statValue}>{thisMonthSeances.length}</div>
          <div className={styles.statLabel}>Ce mois</div>
        </div>
      </div>

      {calendarView ? (
        <div className={styles.calendarContainer}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            culture="fr"
            messages={{
              today: "Aujourd'hui",
              previous: 'Précédent',
              next: 'Suivant',
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
              agenda: 'Agenda',
              date: 'Date',
              time: 'Heure',
              event: 'Événement',
              noEventsInRange: 'Aucune séance dans cette période',
            }}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          />
        </div>
      ) : (
        <>
          {filteredSeances().length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.seanceTable}>
                <thead>
                  <tr>
                    <th>Séance</th>
                    <th>Date & Heure</th>
                    <th>Durée</th>
                    <th>Participants</th>
                    <th>Procédures</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSeances().map(seance => (
                    <SeanceRow key={seance.id_seance} seance={seance} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <CalendarIcon />
              <h3>Aucune séance programmée</h3>
              <p>Vous n'avez pas de séances correspondant à ce filtre</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SeanceRow({ seance }: { seance: Seance }) {
  const date = parseISO(seance.date_seance);
  if (!isValid(date)) return null;
// Helper function to get procedure type
const getProcedureType = (procedure: Procedure): string => {
  return procedure.demandes[0]?.typeProcedure?.libelle || 'N/A';
};

// Helper function to get company name
const getSocieteName = (procedure: Procedure): string => {
  return procedure.demandes[0]?.detenteur?.nom_societeFR || 'N/A';
};
  const startTime = format(date, "HH:mm");
  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr });

  return (
    <tr className={styles.seanceRow}>
      <td>
        <div className={styles.seanceNumber}>{seance.num_seance}</div>
      </td>
      <td>
        <div className={styles.dateCell}>
          <div>{formattedDate}</div>
          <div className={styles.time}>{startTime}</div>
        </div>
      </td>
      <td>{seance.duree || 1}h</td>
      <td>
        <div className={styles.membersList}>
          {seance.membres.slice(0, 2).map(m => (
            <span key={m.id_membre} className={styles.memberTag}>
              {m.prenom_membre.charAt(0)}. {m.nom_membre}
            </span>
          ))}
          {seance.membres.length > 2 && (
            <span className={styles.moreMembers}>+{seance.membres.length - 2}</span>
          )}
        </div>
      </td>
      <td>
        <div className={styles.proceduresCell}>
          {seance.procedures.length > 0 ? (
            <>
              <span className={styles.procedureCount}>{seance.procedures.length} procédures</span>
              <div className={styles.procedureTooltip}>
                {seance.procedures.map(proc => {
                  const societe = proc.demandes?.[0]?.detenteur?.nom_societeFR || 'N/A';
                  return (
                   <div key={proc.id_proc} className={styles.procedureItem}>
  <strong>{proc.num_proc}</strong> - {getSocieteName(proc)} ({getProcedureType(proc)})
</div>
                  );
                })}
              </div>
            </>
          ) : (
            <span className={styles.noProcedures}>Aucune</span>
          )}
        </div>
      </td>
      <td>
        <span className={`${styles.statusBadge} ${seance.statut === 'programmee' ? styles.planned : styles.completed}`}>
          {seance.statut === 'programmee' ? 'Programmée' : 'Terminée'}
        </span>
      </td>
      <td>
        <button className={styles.actionButton}>
          <DetailsIcon />
        </button>
      </td>
    </tr>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width={48} height={48}>
      <path d="M8 2v4m8-4v4m-11 3h14M5 10h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
    </svg>
  );
}

function DetailsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M12 18v-6M9 15h6" />
    </svg>
  );
}