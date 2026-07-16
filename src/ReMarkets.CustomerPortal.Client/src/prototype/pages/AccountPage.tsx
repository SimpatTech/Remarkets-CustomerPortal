import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Stack } from '../components/FlexStack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { StatusChip } from '../components/StatusChip';
import { PORTAL_USER, ASSIGNED_REP, COMPANY_PROFILE } from '../mocks/portalUser';

function AddressBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {title}
      </Typography>
      {lines.map((l) => (
        <Typography key={l} variant="body2" sx={{ color: 'grey.800' }}>
          {l}
        </Typography>
      ))}
    </Box>
  );
}

export function AccountPage() {
  const [prefs, setPrefs] = useState({
    newOffers: true,
    closingReminders: true,
    results: true,
    bidChanges: true,
    weeklyDigest: false,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <Box>
      <PageHeader
        title="Account"
        subtitle={`${COMPANY_PROFILE.legalName} · Account ${COMPANY_PROFILE.accountNumber} · Member since ${COMPANY_PROFILE.memberSince}`}
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={2.5}>
            {/* Company profile */}
            <SectionCard title="Company profile">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AddressBlock title="Billing address" lines={COMPANY_PROFILE.billingAddress} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AddressBlock title="Shipping address" lines={COMPANY_PROFILE.shippingAddress} />
                </Grid>
              </Grid>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
                To change company details or addresses, contact your ReMarkets representative — changes are
                verified before they apply to open bids.
              </Typography>
            </SectionCard>

            {/* Contacts */}
            <SectionCard title="Authorized contacts" noPadding>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {COMPANY_PROFILE.contacts.map((c) => (
                    <TableRow key={c.email} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'grey.900' }}>{c.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{c.title}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{c.email}</TableCell>
                      <TableCell align="right">
                        {c.primary && <StatusChip tone="success" label="Primary" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>

            {/* Notifications */}
            <SectionCard title="Email notifications">
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={<Switch checked={prefs.newOffers} onChange={() => toggle('newOffers')} color="secondary" />}
                  label={<Typography variant="body2">New offers available to my account</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={prefs.closingReminders} onChange={() => toggle('closingReminders')} color="secondary" />}
                  label={<Typography variant="body2">Bid-window closing reminders (48h and 24h)</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={prefs.results} onChange={() => toggle('results')} color="secondary" />}
                  label={<Typography variant="body2">Results posted for offers I bid on</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={prefs.bidChanges} onChange={() => toggle('bidChanges')} color="secondary" />}
                  label={<Typography variant="body2">Changes to my bids (cancellations, quantity adjustments)</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={prefs.weeklyDigest} onChange={() => toggle('weeklyDigest')} color="secondary" />}
                  label={<Typography variant="body2">Weekly digest of marketplace activity</Typography>}
                />
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2.5}>
            {/* Signed-in user */}
            <SectionCard title="Your sign-in">
              <Stack direction="row" spacing={1.75} alignItems="center">
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'primary.main', fontWeight: 600 }}>
                  {PORTAL_USER.initials}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: 'grey.900' }}>{PORTAL_USER.fullName}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {PORTAL_USER.title} · {PORTAL_USER.email}
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} alignItems="center">
                <VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Signed in with Microsoft Entra External ID
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                Password and multi-factor settings are managed by your organization's Microsoft account.
              </Typography>
            </SectionCard>

            {/* Assigned rep */}
            <SectionCard title="Your ReMarkets representative">
              <Stack direction="row" spacing={1.75} alignItems="center">
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'secondary.main', fontWeight: 600 }}>
                  {ASSIGNED_REP.initials}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: 'grey.900' }}>{ASSIGNED_REP.fullName}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Sales Representative
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button size="small" variant="outlined" startIcon={<EmailOutlinedIcon />}>
                  {ASSIGNED_REP.email}
                </Button>
                <Button size="small" variant="outlined" startIcon={<PhoneOutlinedIcon />}>
                  {ASSIGNED_REP.phone}
                </Button>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
                Your representative can still place and revise bids on your behalf — anything they enter shows
                up in My Bids with their name on it.
              </Typography>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
