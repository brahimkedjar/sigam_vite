import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { AuditLogChange } from '../../src/types/audit-log';

interface ChangeRendererProps {
  changes: AuditLogChange;
}

const ChangeRenderer: React.FC<ChangeRendererProps> = ({ changes }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {Object.entries(changes).map(([field, values]) => {
        const oldValue = typeof values === 'object' ? values.old : undefined;
        const newValue = typeof values === 'object' ? values.new : values;

        return (
          <Box key={field} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {field}
            </Typography>
            {oldValue !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    p: 0.5, 
                    bgcolor: 'error.light', 
                    borderRadius: 1,
                    textDecoration: 'line-through'
                  }}
                >
                  {typeof oldValue === 'object' 
                    ? JSON.stringify(oldValue, null, 2)
                    : String(oldValue)}
                </Typography>
                <Typography variant="body2">→</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    p: 0.5, 
                    bgcolor: 'success.light', 
                    borderRadius: 1,
                    fontWeight: 600
                  }}
                >
                  {typeof newValue === 'object' 
                    ? JSON.stringify(newValue, null, 2)
                    : String(newValue)}
                </Typography>
              </Box>
            )}
            {oldValue === undefined && (
              <Typography 
                variant="body2" 
                sx={{ 
                  p: 0.5, 
                  bgcolor: 'success.light', 
                  borderRadius: 1,
                  fontWeight: 600
                }}
              >
                {typeof newValue === 'object' 
                  ? JSON.stringify(newValue, null, 2)
                  : String(newValue)}
              </Typography>
            )}
            <Divider sx={{ mt: 1 }} />
          </Box>
        );
      })}
    </Paper>
  );
};

export default ChangeRenderer;