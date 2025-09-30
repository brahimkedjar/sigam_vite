'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import styles from './Timeline.module.css';
import { FiClock, FiCalendar, FiAlertTriangle, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import Sidebar from '../../sidebar/Sidebar';
import Navbar from '../../navbar/Navbar';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';

interface TimelineStep {
  id: number;
  name: string;
  order: number;
  plannedDuration: number | null;
  actualDuration: string | null;
  startDate: Date;
  endDate: Date | null;
  status: string;
  delay: string | null;
}

interface ProcedureTimeline {
  procedure: {
    id: number;
    number: string;
    type: string;
    startDate: Date;
    endDate: Date | null;
    status: string;
    totalDuration: string | null;
  };
  steps: TimelineStep[];
  demands: {
    id: number;
    code: string;
    type: string;
    status: string;
    submissionDate: Date;
    processingTime: string | null;
  }[];
}

const Timeline1 = () => {
  const searchParams = useSearchParams();
  const procedureId = searchParams?.get('id');
  const [timeline, setTimeline] = useState<ProcedureTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentView, navigateTo } = useViewNavigator();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiURL}/timeline/${procedureId}`);
        setTimeline(response.data);
      } catch (err) {
        setError('Failed to load timeline data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (procedureId) {
      fetchTimeline();
    }
  }, [procedureId]);

  const formatDurationToDHM = (duration: string | null) => {
    if (!duration) return 'En cours';
    
    // Parse the duration string which might be in ISO 8601 format or similar
    // Example formats: "P2DT3H30M", "PT5H20M", "P1D", "PT45M"
    const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = duration.match(regex);
    
    if (!matches) return duration; // fallback to original if format is unexpected
    
    const days = matches[1] ? parseInt(matches[1]) : 0;
    const hours = matches[2] ? parseInt(matches[2]) : 0;
    const minutes = matches[3] ? parseInt(matches[3]) : 0;
    
    const parts = [];
    if (days > 0) parts.push(`${days} jrs`);
    if (hours > 0) parts.push(`${hours} hrs`);
    if (minutes > 0) parts.push(`${minutes} min`);
    
    return parts.length > 0 ? parts.join(' ') : '0 min';
  };

  const formatHoursToDHM = (duration: string | null) => {
    if (!duration) return 'En cours';
    
    // Handle cases like "2208h 1m"
    if (duration.includes('h') || duration.includes('m')) {
      const hoursMatch = duration.match(/(\d+)h/);
      const minutesMatch = duration.match(/(\d+)m/);
      
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      
      const parts = [];
      if (days > 0) parts.push(`${days} jrs`);
      if (remainingHours > 0) parts.push(`${remainingHours} hrs`);
      if (minutes > 0 || (hours === 0 && minutes === 0)) parts.push(`${minutes} min`);
      
      return parts.join(' ');
    }
    
    // Fallback for other duration formats
    return duration;
  };

  const formatPlannedDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    return `${duration} jrs`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'En cours';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TERMINEE':
        return <FiCheckCircle className={styles.completedIcon} />;
      case 'EN_COURS':
        return <FiClock className={styles.inProgressIcon} />;
      case 'EN_ATTENTE':
        return <FiAlertTriangle className={styles.pendingIcon} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading timeline...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!timeline) {
    return <div className={styles.error}>No timeline data available</div>;
  }

  return (
    <div className={styles['app-container']}>
      <Navbar />
      <div className={styles['app-content']}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles['main-content']}>
          <div className={styles['breadcrumb']}>
            <span>SIGAM</span>
            <FiChevronRight className={styles['breadcrumb-arrow']} />
            <span>Timeline</span>
          </div>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Timeline de la Procédure</h1>
        <div className={styles.procedureSummary}>
          <h2>
            {timeline.procedure.number} - {timeline.procedure.type}
          </h2>
          <div className={styles.dates}>
            <span>
              <FiCalendar /> Début: {formatDate(timeline.procedure.startDate)}
            </span>
            <span>
              <FiCalendar /> Fin: {formatDate(timeline.procedure.endDate)}
            </span>
            {timeline.procedure.totalDuration && (
              <span>
                <FiClock /> Durée: {formatDurationToDHM(timeline.procedure.totalDuration)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        {timeline.steps.map((step) => (
          <div key={step.id} className={styles.timelineItem}>
            <div className={styles.timelineMarker}>
              {getStatusIcon(step.status)}
            </div>
            <div className={styles.timelineContent}>
              <h3>{step.name}</h3>
              <div className={styles.stepDetails}>
                <div className={styles.timeRange}>
                  <span>Début: {formatDate(step.startDate)}</span>
                  <span>Fin: {formatDate(step.endDate)}</span>
                </div>
                <div className={styles.durationInfo}>
                  <span>
                    Durée prévue: {formatPlannedDuration(step.plannedDuration)}
                  </span>
                  <span>
                    Durée réelle: {formatHoursToDHM(step.actualDuration)}
                  </span>
                </div>
                {step.delay && (
                  <div className={styles.delay}>
                    Retard: {formatHoursToDHM(step.delay)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.demandsSection}>
        <h2>Demandes Associées</h2>
        <div className={styles.demandsGrid}>
          {timeline.demands.map((demand) => (
            <div key={demand.id} className={styles.demandCard}>
              <h3>{demand.code}</h3>
              <p>Type: {demand.type}</p>
              <p>
                Statut: <span className={styles[demand.status.toLowerCase()]}>{demand.status}</span>
              </p>
              <p>Soumis le: {formatDate(demand.submissionDate)}</p>
              <p>
                Temps de traitement: {formatDurationToDHM(demand.processingTime)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </main>
    </div>
    </div>
  );
};

export default Timeline1;