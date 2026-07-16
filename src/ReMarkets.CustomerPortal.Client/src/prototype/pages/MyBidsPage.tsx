import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { Stack } from '../components/FlexStack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { KpiCard } from '../components/KpiCard';
import { StatusChip } from '../components/StatusChip';
import { statusToneFor } from '../components/statusTone';
import { ROUTES } from '../../router/ROUTES';
import { getPortalOffer, getOfferLine } from '../mocks/portalOffers';
import { getMyBidLines, getMyBidHistoryForLine, type MyBid } from '../mocks/myBids';

const fmtQty = (n: number) => n.toLocaleString('en-US');
const fmtPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

interface BidLineRow {
  offerId: string;
  lineNumber: number;
  latest: MyBid;
  history: MyBid[];
}

function needsAttention(row: BidLineRow): boolean {
  return row.latest.status === 'Cancelled' || !!row.latest.systemCapped;
}

function BidRow({ row }: { row: BidLineRow }) {
  const [open, setOpen] = useState(false);
  const offer = getPortalOffer(row.offerId);
  const line = getOfferLine(row.offerId, row.lineNumber);
  const { latest, history } = row;
  const hasHistory = history.length > 1;

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 36, pr: 0 }}>
          {hasHistory && (
            <IconButton size="small" onClick={() => setOpen((o) => !o)}>
              {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Typography
            component={RouterLink}
            to={generatePath(ROUTES.OFFER_DETAIL, { offerId: row.offerId })}
            sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'grey.900', '&:hover': { color: 'secondary.dark' } }}
          >
            {offer?.title ?? row.offerId}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {row.offerId} · line {row.lineNumber}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: '0.8125rem', color: 'grey.800' }}>{line?.product ?? '—'}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {line ? `${line.partNumber} · ${line.condition}` : ''}
          </Typography>
        </TableCell>
        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {fmtPrice(latest.pricePerUnit)}
        </TableCell>
        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>{fmtQty(latest.quantity)}</TableCell>
        <TableCell>
          <Typography sx={{ fontSize: '0.8125rem', color: latest.placedBy === 'you' ? 'grey.800' : 'text.secondary' }}>
            {latest.placedByName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {latest.placedAt}
          </Typography>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <StatusChip tone={statusToneFor(latest.status)} label={latest.status} />
            {latest.systemCapped && <StatusChip tone="warning" label="Qty adjusted" />}
          </Stack>
        </TableCell>
        <TableCell>
          {latest.allocationOutcome ? (
            <StatusChip
              tone={statusToneFor(latest.allocationOutcome)}
              label={
                latest.allocationOutcome === 'Partially Allocated' && latest.allocatedQuantity
                  ? `Awarded ${fmtQty(latest.allocatedQuantity)} of ${fmtQty(latest.quantity)}`
                  : latest.allocationOutcome
              }
            />
          ) : latest.status === 'Cancelled' ? (
            <Button
              size="small"
              variant="outlined"
              color="error"
              component={RouterLink}
              to={generatePath(ROUTES.OFFER_DETAIL, { offerId: row.offerId })}
            >
              Re-bid
            </Button>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {offer?.status === 'Pending Results' ? 'Awaiting results' : '—'}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {hasHistory && (
        <TableRow>
          <TableCell colSpan={8} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ py: 1.5, pl: 5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Revision history
                </Typography>
                <Table size="small" sx={{ mt: 0.5, maxWidth: 720 }}>
                  <TableBody>
                    {history.map((rev) => (
                      <TableRow key={rev.revisionNumber}>
                        <TableCell sx={{ color: 'text.secondary', width: 70 }}>Rev {rev.revisionNumber}</TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', width: 110 }}>
                          {fmtPrice(rev.pricePerUnit)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', width: 110 }}>
                          {fmtQty(rev.quantity)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{rev.placedByName}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{rev.placedAt}</TableCell>
                        <TableCell>
                          <StatusChip tone={statusToneFor(rev.status)} label={rev.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function MyBidsPage() {
  const [tab, setTab] = useState(0);

  const rows: BidLineRow[] = getMyBidLines().map(({ offerId, lineNumber }) => {
    const history = getMyBidHistoryForLine(offerId, lineNumber);
    return { offerId, lineNumber, latest: history[0], history };
  });

  const active = rows.filter((r) => r.latest.status === 'Active');
  const attention = rows.filter(needsAttention);
  const resulted = rows.filter((r) => r.latest.allocationOutcome);
  const awardedUnits = resulted.reduce((sum, r) => sum + (r.latest.allocatedQuantity ?? 0), 0);

  const shown =
    tab === 1 ? active : tab === 2 ? attention : tab === 3 ? resulted : rows;

  return (
    <Box>
      <PageHeader
        title="My Bids"
        subtitle="Every bid on your account — placed by you through the portal or by your ReMarkets representative on your behalf."
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard label="Active bids" value={String(active.length)} icon={<GavelOutlinedIcon fontSize="small" />} iconColor="secondary.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Awaiting results"
            value={String(active.filter((r) => getPortalOffer(r.offerId)?.status === 'Pending Results').length)}
            icon={<HourglassEmptyIcon fontSize="small" />}
            iconColor="info.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard label="Units awarded" value={fmtQty(awardedUnits)} hint="last 30 days" icon={<EmojiEventsOutlinedIcon fontSize="small" />} iconColor="success.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard label="Needs attention" value={String(attention.length)} hint="cancelled or adjusted" icon={<ErrorOutlineIcon fontSize="small" />} iconColor="warning.main" />
        </Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab label={`All (${rows.length})`} />
        <Tab label={`Active (${active.length})`} />
        <Tab label={`Needs attention (${attention.length})`} />
        <Tab label={`Results (${resulted.length})`} />
      </Tabs>

      <SectionCard noPadding>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 36 }} />
                <TableCell>Offer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Your price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell>Placed by</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Outcome</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shown.map((row) => (
                <BidRow key={`${row.offerId}-${row.lineNumber}`} row={row} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </SectionCard>
    </Box>
  );
}
