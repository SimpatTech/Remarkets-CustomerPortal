import { Alert, AlertTitle, Box, Button, Grid, Typography } from '@mui/material';
import { Stack } from '../components/FlexStack';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UndoIcon from '@mui/icons-material/Undo';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { KpiCard } from '../components/KpiCard';
import { StatusChip } from '../components/StatusChip';
import { statusToneFor } from '../components/statusTone';
import { ROUTES } from '../../router/ROUTES';
import { PORTAL_USER } from '../mocks/portalUser';
import { getBiddableOffers, daysUntilBidEnd } from '../mocks/portalOffers';
import { getMyActiveBids } from '../mocks/myBids';
import { RECENT_ACTIVITY, type ActivityType } from '../mocks/activity';

const ACTIVITY_ICONS: Record<ActivityType, typeof TrendingUpIcon> = {
  'bid-placed': GavelOutlinedIcon,
  'bid-revised': TrendingUpIcon,
  'bid-withdrawn': UndoIcon,
  'bid-capped': Inventory2OutlinedIcon,
  'bid-cancelled': CancelOutlinedIcon,
  'offer-published': CampaignOutlinedIcon,
  'results-posted': CheckCircleOutlineIcon,
};

export function HomePage() {
  const biddable = getBiddableOffers();
  const activeBids = getMyActiveBids();
  const closingSoon = biddable.filter((o) => o.status === 'Closing Soon');
  const cappedBids = activeBids.filter((b) => b.systemCapped);

  return (
    <Box>
      <PageHeader
        title={`Good afternoon, ${PORTAL_USER.fullName.split(' ')[0]}`}
        subtitle={`Here's where things stand for ${PORTAL_USER.companyName} as of May 17, 2026.`}
        actions={
          <Button variant="contained" color="secondary" component={RouterLink} to={ROUTES.OFFERS}>
            Browse offers
          </Button>
        }
      />

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Offers open to you"
            value={String(biddable.length)}
            hint={`${closingSoon.length} closing within 3 days`}
            icon={<LocalOfferOutlinedIcon fontSize="small" />}
            iconColor="info.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Your active bids"
            value={String(activeBids.length)}
            hint="across 4 offers"
            icon={<GavelOutlinedIcon fontSize="small" />}
            iconColor="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Units awarded (May)"
            value="3,500"
            hint="March Storage Closeout"
            icon={<EmojiEventsOutlinedIcon fontSize="small" />}
            iconColor="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Next bid deadline"
            value="May 20"
            hint="Dublin Refurbished CPUs — 3 days"
            icon={<TimerOutlinedIcon fontSize="small" />}
            iconColor="warning.main"
          />
        </Grid>
      </Grid>

      {/* Attention items */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              component={RouterLink}
              to={generatePath(ROUTES.OFFER_DETAIL, { offerId: 'OFF-2026-0147' })}
            >
              Re-bid
            </Button>
          }
        >
          <AlertTitle>A bid needs your attention</AlertTitle>
          Your bid on <strong>Q2 Dallas Memory Liquidation</strong> line 2 (DDR5-4800 ECC RDIMM 32GB) was
          cancelled because the line changed. Place a new bid if you're still interested.
        </Alert>
        {cappedBids.length > 0 && (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                component={RouterLink}
                to={generatePath(ROUTES.OFFER_DETAIL, { offerId: 'OFF-2026-0147' })}
              >
                Review
              </Button>
            }
          >
            <AlertTitle>A bid quantity was adjusted</AlertTitle>
            Available quantity on <strong>Q2 Dallas Memory Liquidation</strong> line 5 was reduced. Your bid
            now stands at $41.00/unit × 12,000 units (was 15,000) — no action needed unless you want to revise.
          </Alert>
        )}
      </Stack>

      <Grid container spacing={2.5}>
        {/* Offers open for bidding */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Offers open for bidding"
            headerRight={
              <Button size="small" component={RouterLink} to={ROUTES.OFFERS}>
                View all
              </Button>
            }
            noPadding
          >
            <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
              {biddable.map((offer) => {
                const days = daysUntilBidEnd(offer);
                return (
                  <Box
                    key={offer.id}
                    component={RouterLink}
                    to={generatePath(ROUTES.OFFER_DETAIL, { offerId: offer.id })}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 2.5,
                      py: 2,
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'grey.900' }}>
                        {offer.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {offer.id} · {offer.lines.length} lines · Ships from {offer.shipsFrom}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' }, flexShrink: 0 }}
                    >
                      {days > 0 ? `Ends ${offer.bidEnd}` : `Ended ${offer.bidEnd}`}
                    </Typography>
                    <StatusChip tone={statusToneFor(offer.status)} label={offer.status} />
                  </Box>
                );
              })}
            </Stack>
          </SectionCard>
        </Grid>

        {/* Recent activity */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard title="Recent activity" noPadding>
            <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
              {RECENT_ACTIVITY.slice(0, 6).map((item) => {
                const Icon = ACTIVITY_ICONS[item.type];
                return (
                  <Stack key={item.id} direction="row" spacing={1.5} sx={{ px: 2.5, py: 1.75 }} alignItems="flex-start">
                    <Icon sx={{ fontSize: 18, color: 'text.secondary', mt: '2px' }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'grey.800' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {item.detail}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                        {item.timestamp}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
