import { Box, Button, Card, Divider, TextField, Typography } from '@mui/material';
import { Stack } from '../components/FlexStack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/ROUTES';

const VALUE_POINTS = [
  'See every offer curated for your account, the moment it opens',
  'Place and revise bids yourself — no email round-trips',
  'Track results and awarded quantities in one place',
];

/**
 * Customer sign-in. The left brand panel is a fixed dark surface in both color
 * modes (same convention as the internal app's sidebar), so it uses literal
 * brand colors rather than mode-flipping theme tokens.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const goHome = () => navigate(ROUTES.HOME);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      {/* Brand panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
          color: '#e2e8f0',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            RM
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.15, color: '#ffffff' }}>
              REMarkets
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.15 }}>
              Customer Portal
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography sx={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.5px', color: '#ffffff', maxWidth: 440 }}>
            Bid directly on the inventory your business runs on.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 3.5 }}>
            {VALUE_POINTS.map((point) => (
              <Stack key={point} direction="row" spacing={1.25} alignItems="flex-start">
                <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#5BA24A', mt: '1px' }} />
                <Typography sx={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{point}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
          © 2026 REMarkets — Customer Portal v0.1 · Powered by Simpat Consulting
        </Typography>
      </Box>

      {/* Sign-in card */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'grey.900' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 3 }}>
            Sign in with your business account to see your offers.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={goHome}
            startIcon={
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  display: 'inline-grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5px',
                  '& span': { bgcolor: 'currentColor', opacity: 0.9 },
                }}
              >
                <Box component="span" />
                <Box component="span" />
                <Box component="span" />
                <Box component="span" />
              </Box>
            }
          >
            Sign in with Microsoft
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              or use your email
            </Typography>
          </Divider>

          <Stack spacing={2}>
            <TextField label="Work email" placeholder="you@company.com" fullWidth />
            <TextField label="Password" type="password" fullWidth />
            <Button fullWidth variant="outlined" color="primary" onClick={goHome}>
              Sign in
            </Button>
          </Stack>

          <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary', textAlign: 'center' }}>
            Bidding access is by invitation from your ReMarkets representative.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
