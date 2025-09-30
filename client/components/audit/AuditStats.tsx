import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper, 
  useTheme, 
  Grid, 
  Container, 
  Stack 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AuditStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiURL}/audit-logs/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [apiURL]);

  if (loading) return <LinearProgress />;
  if (!stats) return <Typography>No statistics available</Typography>;

  const actionData = Object.entries(stats.actionsByType).map(([action, count]) => ({
    name: action,
    count,
  }));

  const userData = stats.topUsers.map((user: any) => ({
    name: `User ${user.userId}`,
    count: user.actionCount,
  }));

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Audit Log Statistics
        </Typography>
        
        {/* Remove the Grid container and use Box instead */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Bar Chart - Actions by Type */}
          <Paper sx={{ 
            p: 3,
            flex: 1,
            minHeight: '400px',
            minWidth: { md: '66%' }
          }}>
            <Typography variant="h6" gutterBottom>
              Actions by Type
            </Typography>
            <Box sx={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} />
                  <YAxis tick={{ fill: theme.palette.text.secondary }} />
                  <Tooltip contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: theme.shape.borderRadius
                  }}/>
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Pie Chart - Top Users */}
          <Paper sx={{ 
            p: 3,
            flex: 1,
            minHeight: '400px',
            minWidth: { md: '33%' }
          }}>
            <Typography variant="h6" gutterBottom>
              Top Users by Activity
            </Typography>
            <Box sx={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                  >
                    {userData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={theme.palette.background.paper}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: theme.shape.borderRadius
                  }}/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
};

export default AuditStats;