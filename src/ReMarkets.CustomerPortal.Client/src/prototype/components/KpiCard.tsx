import { Box, Card, Typography } from '@mui/material';
import { Stack } from './FlexStack';
import type { ReactNode } from 'react';

export interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  /** Palette token for the icon bubble, e.g. 'secondary.main', 'info.main'. */
  iconColor?: string;
}

export function KpiCard({ label, value, hint, icon, iconColor = 'secondary.main' }: KpiCardProps) {
  return (
    <Card sx={{ p: 2.25, height: '100%' }}>
      <Stack direction="row" spacing={1.75} alignItems="flex-start">
        {icon && (
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', fontSize: '0.6875rem' }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25, color: 'grey.900' }}>
            {value}
          </Typography>
          {hint && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {hint}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
