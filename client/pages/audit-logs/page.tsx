import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './AuditLogs.module.css';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Undo as UndoIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { AuditLog, AuditLogChange } from '../../src/types/audit-log';
import ChangeRenderer from '../../components/audit/ChangeRenderer';
import AuditTimeline from '../../components/audit/AuditTimeline';
import AuditStats from '../../components/audit/AuditStats';
import { Theme } from '@mui/material/styles';
import Navbar from '@/pages/navbar/Navbar';
import Sidebar from '@/pages/sidebar/Sidebar';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import { useAuthStore } from '@/src/store/useAuthStore';
import router from 'next/router';

interface ActionChipProps {
  action: string;
}

const ActionChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'action',
})<ActionChipProps>(({ theme, action }) => ({
  fontWeight: 600,
  backgroundColor:
    action === 'CREATE' ? theme.palette.success.light :
    action === 'UPDATE' ? theme.palette.warning.light :
    action === 'DELETE' ? theme.palette.error.light :
    action === 'LOGIN' || action === 'LOGOUT' ? theme.palette.info.light :
    theme.palette.grey[300],
  color: theme.palette.getContrastText(
    action === 'CREATE' ? theme.palette.success.light :
    action === 'UPDATE' ? theme.palette.warning.light :
    action === 'DELETE' ? theme.palette.error.light :
    action === 'LOGIN' || action === 'LOGOUT' ? theme.palette.info.light :
    theme.palette.grey[300]
  ),
}));

const AuditLogsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    entityType: '',
    entityId: '',
    userId: '',
    action: '',
    search: '',
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);
  const [visualizationDialogOpen, setVisualizationDialogOpen] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState<'timeline' | 'stats'>('timeline');
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const { currentView, navigateTo } = useViewNavigator('Audit_Logs');
  
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.entityId) params.append('entityId', filters.entityId);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.search) params.append('search', filters.search);
      
      params.append('page', (page + 1).toString());
      params.append('limit', rowsPerPage.toString());

      const response = await axios.get(`${apiURL}/audit-logs?${params.toString()}`);
      setLogs(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (err) {
      setError('Failed to fetch audit logs');
      enqueueSnackbar('Failed to fetch audit logs', { variant: 'error' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage, enqueueSnackbar]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      entityType: '',
      entityId: '',
      userId: '',
      action: '',
      search: '',
    });
    setPage(0);
  };

const handleRevert = async (logId: number, reason: string) => {
  try {
    const auth = useAuthStore.getState().auth;
    await axios.post(`${apiURL}/audit-logs/revert`, {
      logId,
      userId: auth?.id,
      reason,
      ipAddress: '::1', // Or get real IP if available
      userAgent: navigator.userAgent,
      sessionId: document.cookie?.match(/auth_token=([^;]+)/)?.[1]
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    enqueueSnackbar('Action reverted successfully', { variant: 'success' });
    fetchLogs();
    setRevertDialogOpen(false);
  
  } catch (error) {
    let errorMessage = 'Failed to revert action';
    
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
      console.error('Revert error:', error.response?.data);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    enqueueSnackbar(errorMessage, { variant: 'error' });
  }
};

  const toggleRowExpand = (logId: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'error';
      case 'LOGIN':
      case 'LOGOUT': return 'info';
      default: return 'default';
    }
  };

  const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'REVERT', label: 'Revert' },
  ];

  return (
    <div className={styles['app-container']}>
          <Navbar />
          <div className={styles['app-content']}>
          <Sidebar currentView={currentView} navigateTo={navigateTo} />
            <main className={styles['main-content']}>
              <div className={styles['container']}>
                <div className={styles['content-wrapper']}></div>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, flexWrap: 'wrap' }}>
    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px', md: '250px' } }}>
      <TextField
        fullWidth
        label="Entity Type"
        name="entityType"
        value={filters.entityType}
        onChange={handleFilterChange}
        placeholder="User, Product, etc."
      />
    </Box>
    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '150px', md: '180px' } }}>
      <TextField
        fullWidth
        label="Entity ID"
        name="entityId"
        value={filters.entityId}
        onChange={handleFilterChange}
        placeholder="123"
      />
    </Box>
    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '150px', md: '180px' } }}>
      <TextField
        fullWidth
        label="User ID"
        name="userId"
        value={filters.userId}
        onChange={handleFilterChange}
        placeholder="456"
      />
    </Box>
    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '150px', md: '180px' } }}>
      <Select
        fullWidth
        value={filters.action}
        onChange={(e: { target: { value: any; }; }) => setFilters(prev => ({ ...prev, action: e.target.value }))}
        displayEmpty
        inputProps={{ 'aria-label': 'Action' }}
      >
        {actionOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
    
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: 2, 
      width: '100%',
      mt: { xs: 2, md: 0 }
    }}>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleResetFilters}
      >
        Reset
      </Button>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={fetchLogs}
      >
        Refresh
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<TimelineIcon />}
        onClick={() => setVisualizationDialogOpen(true)}
      >
        Visualize
      </Button>
    </Box>
  </Box>
</CardContent>
      </Card>

      {loading && <LinearProgress />}
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date/Time</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <TableRow hover>
                    <TableCell>
                      {format(new Date(log.timestamp), 'PPpp', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {log.user?.avatar && (
                          <Avatar 
                            src={log.user.avatar} 
                            sx={{ width: 24, height: 24 }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2">
                            {log.user?.username || 'System'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <ActionChip 
                        label={log.action} 
                        size="small" 
                        action={log.action}
                      />
                    </TableCell>
                    <TableCell>
                      {`Table ${log.entityType}
                      Column  #${log.entityId}`}
                    </TableCell>
                    <TableCell>
  <Tooltip title={log.errorMessage || 
    (log.changes && `${Object.keys(log.changes).length} changes`) ||
    'No details'}>
    <Typography 
      noWrap 
      sx={{ 
        maxWidth: 200, // Adjust this value as needed
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }}
    >
      {log.errorMessage || 
        (log.changes && `${Object.keys(log.changes).length} changes`) ||
        'No details'}
    </Typography>
  </Tooltip>
</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpand(log.id)}
                          >
                            {expandedRows[log.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
                        {log.previousState && (
                          <Tooltip title="Revert this action">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => {
                                setSelectedLog(log);
                                setRevertDialogOpen(true);
                              }}
                            >
                              <UndoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View timeline">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => {
                              setSelectedLog(log);
                              setVisualizationDialogOpen(true);
                              setVisualizationMode('timeline');
                            }}
                          >
                            <TimelineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {expandedRows[log.id] && (
  <TableRow>
    <TableCell colSpan={6} sx={{ p: 0 }}>
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Changes
            </Typography>
            {log.changes ? (
              <ChangeRenderer changes={log.changes} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No changes recorded
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Technical Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {log.ipAddress && (
                <Typography variant="body2">
                  <strong>IP:</strong> {log.ipAddress}
                </Typography>
              )}
              {log.userAgent && (
                <Typography variant="body2">
                  <strong>Device:</strong> {log.userAgent}
                </Typography>
              )}
              {log.status && (
                <Typography variant="body2">
                  <strong>Status:</strong> 
                  <Chip 
                    label={log.status} 
                    size="small" 
                    color={log.status === 'SUCCESS' ? 'success' : 'error'}
                    sx={{ ml: 1 }}
                  />
                </Typography>
              )}
              {log.errorMessage && (
                <Typography variant="body2" color="error">
                  <strong>Error:</strong> {log.errorMessage}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </TableCell>
  </TableRow>
)}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Revert Dialog */}
      <Dialog
        open={revertDialogOpen}
        onClose={() => setRevertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Revert Action</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to revert this action?
          </Typography>
          {selectedLog && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Action Details:</Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {selectedLog.action}
              </Typography>
              <Typography variant="body2">
                <strong>Entity:</strong> {selectedLog.entityType} {selectedLog.entityId && `#${selectedLog.entityId}`}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {format(new Date(selectedLog.timestamp), 'PPpp', { locale: fr })}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Reason for revert"
            margin="normal"
            multiline
            rows={3}
            placeholder="Explain why you're reverting this action..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevertDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="warning"
            startIcon={<UndoIcon />}
            onClick={() => handleRevert(selectedLog?.id || 0, 'Reverted by admin')}
          >
            Confirm Revert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Visualization Dialog */}
      <Dialog
        open={visualizationDialogOpen}
        onClose={() => setVisualizationDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { height: '80vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Audit Log Visualization
              {selectedLog && (
                <Typography variant="subtitle1" color="text.secondary">
                  Table :{selectedLog.entityType} {selectedLog.entityId && `#${selectedLog.entityId}`}
                </Typography>
              )}
            </Typography>
            <Tabs
              value={visualizationMode}
              onChange={(_, newValue: "timeline" | "stats") => setVisualizationMode(newValue)}
              sx={{ mb: -2 }}
            >
              <Tab label="Timeline" value="timeline" icon={<TimelineIcon />} />
              <Tab label="Statistics" value="stats" icon={<BarChartIcon />} />
            </Tabs>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {visualizationMode === 'timeline' ? (
            <AuditTimeline 
              entityType={selectedLog?.entityType || ''}
              entityId={selectedLog?.entityId}
            />
          ) : (
            <AuditStats />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisualizationDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </div>
    </main>
    </div>
    </div>
  );
};

export default AuditLogsPage;