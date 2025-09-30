// services/activityService.ts
import axios from 'axios';
interface RecentActivity {
  id: number;
  type: 'permis' | 'demande' | 'modification' | 'expiration' | 'renouvellement';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'warning' | 'error' | 'info';
  code?: string;
  user?: string;
}

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    // You'll need to create this endpoint in your backend
    const response = await axios.get(`${apiURL}/api/Dashboard/recent`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

// Alternative: Generate activities from existing permis data
export const generateActivitiesFromPermis = (permisList: any[]): RecentActivity[] => {
  const activities: RecentActivity[] = [];

  permisList.slice(0, 10).forEach((permis) => {
    // Recent creation activity
    activities.push({
      id: permis.id,
      type: 'permis',
      title: 'Nouveau permis créé',
      description: `Permis ${permis.typePermis?.lib_type || 'd\'exploitation'} créé`,
      timestamp: new Date(permis.date_octroi || new Date()),
      status: 'success',
      code: permis.code_permis,
      user: permis.detenteur?.nom_societeFR
    });

    // Expiration warning if applicable
    if (permis.date_expiration) {
      const expDate = new Date(permis.date_expiration);
      const now = new Date();
      const diffInDays = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays > 0 && diffInDays <= 30) {
        activities.push({
          id: permis.id + 1000, // Ensure unique ID
          type: 'expiration',
          title: 'Permis expire bientôt',
          description: `Expiration dans ${diffInDays} jours`,
          timestamp: new Date(),
          status: 'warning',
          code: permis.code_permis
        });
      }
    }
  });

  // Sort by timestamp descending
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
};