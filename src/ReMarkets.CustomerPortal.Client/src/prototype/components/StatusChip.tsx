import { Box, Chip, type ChipProps } from '@mui/material';

export type StatusTone = 'success' | 'info' | 'warning' | 'error' | 'neutral' | 'floor' | 'tie' | 'reversed';

const TONE_MAP: Record<
  StatusTone,
  { bg: string; fg: string; dot: string }
> = {
  success: { bg: '#ecfdf5', fg: '#059669', dot: '#10b981' },
  info: { bg: 'rgba(8, 145, 178, 0.08)', fg: '#0e7490', dot: '#0891b2' },
  warning: { bg: '#fffbeb', fg: '#b45309', dot: '#f59e0b' },
  error: { bg: '#fef2f2', fg: '#b91c1c', dot: '#ef4444' },
  neutral: { bg: '#f1f5f9', fg: '#475569', dot: '#94a3b8' },
  floor: { bg: 'rgba(99, 102, 241, 0.1)', fg: '#4338ca', dot: '#6366f1' },
  tie: { bg: 'rgba(236, 72, 153, 0.1)', fg: '#be185d', dot: '#ec4899' },
  reversed: { bg: '#f1f5f9', fg: '#64748b', dot: '#94a3b8' },
};

export interface StatusChipProps extends Omit<ChipProps, 'color' | 'icon' | 'label'> {
  tone: StatusTone;
  label: string;
}

export function StatusChip({ tone, label, sx, ...rest }: StatusChipProps) {
  const t = TONE_MAP[tone];
  return (
    <Chip
      size="small"
      label={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: t.dot,
              display: 'inline-block',
            }}
          />
          {label}
        </Box>
      }
      sx={{
        bgcolor: t.bg,
        color: t.fg,
        fontWeight: 600,
        height: 22,
        px: 0.5,
        '& .MuiChip-label': { px: 0.75 },
        ...sx,
      }}
      {...rest}
    />
  );
}

