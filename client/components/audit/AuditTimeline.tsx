import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from '@mui/lab';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditTimelineProps {
  entityType: string;
  entityId?: number;
}

interface TimelineItemData {
  id: number;
  date: Date;
  action: string | null;
  user: string;
  changes?: any;
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ entityType, entityId }) => {
  const [timelineData, setTimelineData] = useState<TimelineItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Construct proper query parameters
        const params = new URLSearchParams();
        params.append('entityType', entityType);
        if (entityId) params.append('entityId', entityId.toString());
        
        const response = await axios.get(`${apiURL}/audit-logs/visualize?${params.toString()}`);
        setTimelineData(response.data.timeline.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        })));
      } catch (err) {
        setError('Failed to fetch timeline data');
        console.error('Error fetching timeline:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [entityType, entityId]);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (timelineData.length === 0) return <Typography>No activity found</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activity Timeline
      </Typography>
      <Timeline position="alternate">
        {timelineData.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={
                item.action === 'CREATE' ? 'success' :
                item.action === 'UPDATE' ? 'warning' :
                item.action === 'DELETE' ? 'error' : 'primary'
              } />
              {index < timelineData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.action} by {item.user}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(item.date, 'PPpp', { locale: fr })}
                </Typography>
                {item.changes && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      {Object.keys(item.changes).length} changes made
                    </Typography>
                  </Box>
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default AuditTimeline;