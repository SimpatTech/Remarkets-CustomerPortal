import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Stack } from '../components/FlexStack';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/ROUTES';
import { useColorMode } from '../../themes/ColorModeContext';
import { PORTAL_USER } from '../mocks/portalUser';
import { getMyActiveBids } from '../mocks/myBids';

const NAV_ITEMS: { label: string; to: string; end?: boolean }[] = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Browse Offers', to: ROUTES.OFFERS, end: false },
  { label: 'My Bids', to: ROUTES.MY_BIDS },
  { label: 'Account', to: ROUTES.ACCOUNT },
];

export function TopNav() {
  const navigate = useNavigate();
  const { mode, toggleMode } = useColorMode();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
  const activeBidCount = getMyActiveBids().length;

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ minHeight: 60, height: 60, px: { xs: 2, md: 4 }, gap: 3 }}>
        {/* Brand */}
        <Box
          component={RouterLink}
          to={ROUTES.HOME}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            flexShrink: 0,
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '-0.5px',
            }}
          >
            RM
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.1, color: 'text.primary' }}>
              REMarkets
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.1 }}>
              Customer Portal
            </Typography>
          </Box>
        </Box>

        {/* Primary nav */}
        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {NAV_ITEMS.map((item) => (
            <Box
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: 'grey.50' },
                '&.active': {
                  color: 'secondary.dark',
                  bgcolor: 'rgba(72, 139, 55, 0.12)',
                },
              }}
            >
              {item.label === 'My Bids' && activeBidCount > 0
                ? `${item.label} (${activeBidCount})`
                : item.label}
            </Box>
          ))}
        </Stack>

        <Box sx={{ flex: 1 }} />

        {/* Right cluster */}
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton size="small" onClick={toggleMode} sx={{ color: 'text.secondary' }}>
              {mode === 'light' ? (
                <DarkModeOutlinedIcon fontSize="small" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge color="warning" variant="dot">
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{ cursor: 'pointer', borderRadius: 1, px: 1, py: 0.5, '&:hover': { bgcolor: 'grey.50' } }}
          >
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 600 }}>
              {PORTAL_USER.initials}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>
                {PORTAL_USER.fullName}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.2 }}>
                {PORTAL_USER.companyName}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Menu
          anchorEl={userMenuAnchor}
          open={!!userMenuAnchor}
          onClose={() => setUserMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              navigate(ROUTES.ACCOUNT);
            }}
          >
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            My account
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              navigate(ROUTES.LOGIN);
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
