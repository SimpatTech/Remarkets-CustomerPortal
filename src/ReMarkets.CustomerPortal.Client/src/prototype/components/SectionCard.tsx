import { Box, Card, CardContent, Typography } from '@mui/material';
import { Stack } from './FlexStack';
import type { ReactNode } from 'react';

export interface SectionCardProps {
  title?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
}

export function SectionCard({ title, headerRight, children, noPadding }: SectionCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {(title || headerRight) && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 2.5,
            py: 1.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {title && (
            <Typography variant="subtitle1" sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'grey.800' }}>
              {title}
            </Typography>
          )}
          {headerRight}
        </Stack>
      )}
      {noPadding ? (
        <Box sx={{ flex: 1 }}>{children}</Box>
      ) : (
        <CardContent sx={{ flex: 1 }}>{children}</CardContent>
      )}
    </Card>
  );
}
