import { Box, Container, Typography } from '@mui/material';
import { Stack } from '../components/FlexStack';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

/**
 * Customer-facing shell: top navigation + centered content column + footer.
 * Deliberately different chrome from the internal app's dark sidebar — the
 * portal reads as a storefront, not an admin console — while sharing the same
 * theme (palette, typography, component overrides) with production.
 */
export function PortalLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopNav />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 3.5 }}>
        <Outlet />
      </Container>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          © 2026 REMarkets — Customer Portal v0.1
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Powered by Simpat Consulting
        </Typography>
      </Stack>
    </Box>
  );
}
