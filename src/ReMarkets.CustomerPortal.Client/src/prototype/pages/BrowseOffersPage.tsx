import { useState } from 'react';
import { Box, Button, Card, Chip, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Stack } from '../components/FlexStack';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusChip } from '../components/StatusChip';
import { statusToneFor } from '../components/statusTone';
import { ROUTES } from '../../router/ROUTES';
import {
  getBiddableOffers,
  getFinishedOffers,
  daysUntilBidEnd,
  type PortalOffer,
} from '../mocks/portalOffers';
import { getMyActiveBidsCountForOffer } from '../mocks/myBids';

function OfferCard({ offer }: { offer: PortalOffer }) {
  const days = daysUntilBidEnd(offer);
  const categories = [...new Set(offer.lines.map((l) => l.category))];
  const pricedCount = offer.lines.filter((l) => l.offerPrice !== undefined).length;
  const myBidCount = getMyActiveBidsCountForOffer(offer.id);
  const finished = offer.status === 'Pending Results' || offer.status === 'Results Posted';

  return (
    <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'grey.900' }}>
            {offer.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {offer.id}
          </Typography>
        </Box>
        <StatusChip tone={statusToneFor(offer.status)} label={offer.status} sx={{ flexShrink: 0 }} />
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.25, mb: 1.75 }}>
        {offer.summary}
      </Typography>

      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1.75 }}>
        {categories.map((c) => (
          <Chip key={c} label={c} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
        ))}
        {pricedCount > 0 && (
          <Chip
            label={`${pricedCount} of ${offer.lines.length} lines priced`}
            size="small"
            variant="outlined"
            color="secondary"
          />
        )}
      </Stack>

      <Box sx={{ flex: 1 }} />

      <Stack spacing={0.75} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ships from {offer.shipsFrom}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <EventOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Bid window {offer.bidStart} — {offer.bidEnd}
            {!finished && days > 0 && ` · ${days} day${days === 1 ? '' : 's'} left`}
          </Typography>
        </Stack>
        {offer.attachments && offer.attachments.length > 0 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <AttachFileIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {offer.attachments.length} supporting document{offer.attachments.length === 1 ? '' : 's'}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button
          variant={finished ? 'outlined' : 'contained'}
          color={finished ? 'primary' : 'secondary'}
          size="small"
          component={RouterLink}
          to={generatePath(ROUTES.OFFER_DETAIL, { offerId: offer.id })}
        >
          {finished ? 'View results' : 'View & bid'}
        </Button>
        {myBidCount > 0 && (
          <Typography variant="caption" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
            {myBidCount} active bid{myBidCount === 1 ? '' : 's'} on this offer
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

export function BrowseOffersPage() {
  const [tab, setTab] = useState(0);
  const biddable = getBiddableOffers();
  const finished = getFinishedOffers();
  const shown = tab === 0 ? biddable : finished;

  return (
    <Box>
      <PageHeader
        title="Browse Offers"
        subtitle="Offers curated for Pinnacle IT Solutions. Bid on any open line — you'll be notified when awards are finalized."
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab label={`Open for bidding (${biddable.length})`} />
        <Tab label={`Closed & results (${finished.length})`} />
      </Tabs>

      <Grid container spacing={2.5}>
        {shown.map((offer) => (
          <Grid key={offer.id} size={{ xs: 12, md: 6 }}>
            <OfferCard offer={offer} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
