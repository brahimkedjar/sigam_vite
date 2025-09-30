// components/RecentActivities.tsx
'use client';

import styles from './RecentActivities.module.css';
import { FiClock, FiFileText, FiActivity, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
export interface RecentActivity {
  id: number;
  type: 'permis' | 'demande' | 'modification' | 'expiration' | 'renouvellement';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'warning' | 'error' | 'info';
  code?: string;
  user?: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
  loading?: boolean;
  onRefresh?: () => void;
}

export default function RecentActivities({ activities, loading = false, onRefresh }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'permis': return <FiFileText />;
      case 'demande': return <FiActivity />;
      case 'modification': return <FiTrendingUp />;
      case 'expiration': return <FiAlertTriangle />;
      case 'renouvellement': return <FiRefreshCw />;
      default: return <FiClock />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = differenceInDays(now, date);
    
    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  if (loading) {
    return (
      <div className={styles.recentActivities}>
        <div className={styles.header}>
          <h3>Activités Récentes</h3>
          <div className={styles.loadingSpinner}>
            <FiRefreshCw className={styles.spinner} />
          </div>
        </div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingItem}></div>
          <div className={styles.loadingItem}></div>
          <div className={styles.loadingItem}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recentActivities}>
      <div className={styles.header}>
        <h3>Activités Récentes</h3>
        <div className={styles.headerActions}>
          <span className={styles.badge}>{activities.length}</span>
          {onRefresh && (
            <button onClick={onRefresh} className={styles.refreshButton} title="Actualiser">
              <FiRefreshCw size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.activitiesList}>
        {activities.map((activity, index) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon} style={{ color: getStatusColor(activity.status) }}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className={styles.activityContent}>
              <div className={styles.activityHeader}>
                <h4 className={styles.activityTitle}>{activity.title}</h4>
                <span className={styles.activityTime}>{formatTimeAgo(activity.timestamp)}</span>
              </div>
              
              <p className={styles.activityDescription}>{activity.description}</p>
              
              {activity.code && (
                <div className={styles.activityMeta}>
                  <span className={styles.activityCode}>{activity.code}</span>
                  {activity.user && (
                    <span className={styles.activityUser}>par {activity.user}</span>
                  )}
                </div>
              )}
            </div>
            
            {index < activities.length - 1 && <div className={styles.activityDivider} />}
          </div>
        ))}
      </div>
      
      {activities.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <FiClock size={48} className={styles.emptyIcon} />
          <p>Aucune activité récente</p>
          <span>Les nouvelles activités apparaîtront ici</span>
        </div>
      )}
    </div>
  );
}