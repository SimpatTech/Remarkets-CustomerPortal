import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '../components/FlexStack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { SectionCard } from '../components/SectionCard';
import { StatusChip } from '../components/StatusChip';
import { statusToneFor } from '../components/statusTone';
import { ROUTES } from '../../router/ROUTES';
import {
  getPortalOffer,
  daysUntilBidEnd,
  type PortalOfferLine,
} from '../mocks/portalOffers';
import {
  getMyActiveBidForLine,
  getMyBidHistoryForLine,
  type BidAllocationOutcome,
} from '../mocks/myBids';

const fmtQty = (n: number) => n.toLocaleString('en-US');
const fmtPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

/** The customer's standing bid on a line, as mutated locally by the prototype. */
interface LocalBid {
  pricePerUnit: number;
  quantity: number;
  revisionNumber: number;
  systemCapped?: boolean;
  withdrawn?: boolean;
  allocationOutcome?: BidAllocationOutcome;
  allocatedQuantity?: number;
}

function initialBids(offerId: string, lines: PortalOfferLine[]): Record<number, LocalBid> {
  const out: Record<number, LocalBid> = {};
  for (const line of lines) {
    const active = getMyActiveBidForLine(offerId, line.lineNumber);
    if (active) {
      out[line.lineNumber] = {
        pricePerUnit: active.pricePerUnit,
        quantity: active.quantity,
        revisionNumber: active.revisionNumber,
        systemCapped: active.systemCapped,
        allocationOutcome: active.allocationOutcome,
        allocatedQuantity: active.allocatedQuantity,
      };
      continue;
    }
    const history = getMyBidHistoryForLine(offerId, line.lineNumber);
    if (history.length > 0 && history[0].status === 'Withdrawn') {
      out[line.lineNumber] = {
        pricePerUnit: history[0].pricePerUnit,
        quantity: history[0].quantity,
        revisionNumber: history[0].revisionNumber,
        withdrawn: true,
      };
    }
  }
  return out;
}

export function OfferDetailPage() {
  const { offerId = '' } = useParams();
  const offer = getPortalOffer(offerId);

  const [bids, setBids] = useState<Record<number, LocalBid>>(() =>
    offer ? initialBids(offer.id, offer.lines) : {},
  );
  const [dialogLine, setDialogLine] = useState<PortalOfferLine | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [qtyInput, setQtyInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const finished = offer && (offer.status === 'Pending Results' || offer.status === 'Results Posted');
  const days = offer ? daysUntilBidEnd(offer) : 0;

  const dialogErrors = useMemo(() => {
    if (!dialogLine) return { price: undefined, qty: undefined };
    const price = Number(priceInput);
    const qty = Number(qtyInput);
    return {
      price:
        priceInput === ''
          ? undefined
          : !(price > 0)
            ? 'Price must be greater than $0.00'
            : undefined,
      qty:
        qtyInput === ''
          ? undefined
          : !Number.isFinite(qty) || qty <= 0
            ? 'Enter a quantity'
            : qty > dialogLine.availableQuantity
              ? `Only ${fmtQty(dialogLine.availableQuantity)} units are available on this line`
              : undefined,
    };
  }, [dialogLine, priceInput, qtyInput]);

  if (!offer) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Offer not found. It may have been withdrawn.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={RouterLink} to={ROUTES.OFFERS}>
          Back to Browse Offers
        </Button>
      </Box>
    );
  }

  const openDialog = (line: PortalOfferLine) => {
    const existing = bids[line.lineNumber];
    setPriceInput(existing && !existing.withdrawn ? String(existing.pricePerUnit) : line.offerPrice !== undefined ? String(line.offerPrice) : '');
    setQtyInput(existing && !existing.withdrawn ? String(existing.quantity) : '');
    setDialogLine(line);
  };

  const submitBid = () => {
    if (!dialogLine) return;
    const existing = bids[dialogLine.lineNumber];
    const nextRev = existing ? existing.revisionNumber + 1 : 1;
    setBids((prev) => ({
      ...prev,
      [dialogLine.lineNumber]: {
        pricePerUnit: Number(priceInput),
        quantity: Number(qtyInput),
        revisionNumber: nextRev,
      },
    }));
    setToast(
      `Bid ${nextRev > 1 ? `revision ${nextRev}` : ''} submitted — ${fmtPrice(Number(priceInput))}/unit × ${fmtQty(Number(qtyInput))} units on line ${dialogLine.lineNumber}.`,
    );
    setDialogLine(null);
  };

  const withdrawBid = () => {
    if (!dialogLine) return;
    const existing = bids[dialogLine.lineNumber];
    if (!existing) return;
    setBids((prev) => ({
      ...prev,
      [dialogLine.lineNumber]: {
        ...existing,
        revisionNumber: existing.revisionNumber + 1,
        withdrawn: true,
        systemCapped: false,
      },
    }));
    setToast(`Bid withdrawn on line ${dialogLine.lineNumber}.`);
    setDialogLine(null);
  };

  const canSubmit =
    priceInput !== '' && qtyInput !== '' && !dialogErrors.price && !dialogErrors.qty;

  return (
    <Box>
      {/* Back + header */}
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to={ROUTES.OFFERS}
        size="small"
        sx={{ mb: 1.5, color: 'text.secondary' }}
      >
        Browse Offers
      </Button>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Typography variant="h4" sx={{ fontSize: '1.375rem', fontWeight: 700, color: 'grey.900' }}>
              {offer.title}
            </Typography>
            <StatusChip tone={statusToneFor(offer.status)} label={offer.status} />
          </Stack>
          <Stack direction="row" spacing={2.5} sx={{ mt: 0.75 }} flexWrap="wrap" useFlexGap>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {offer.id}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Ships from {offer.shipsFrom}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <EventOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Bid window {offer.bidStart} — {offer.bidEnd}
                {!finished && days > 0 && ` · ${days} day${days === 1 ? '' : 's'} left`}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {/* Status advisories */}
      {offer.status === 'Bid Window Ended' && (
        <Alert severity="warning" sx={{ mb: 2.5 }}>
          The posted bid window has ended. Bids may still be accepted until ReMarkets closes the offer —
          contact your representative if you need to make a late change.
        </Alert>
      )}
      {offer.status === 'Pending Results' && (
        <Alert severity="info" sx={{ mb: 2.5 }}>
          Bidding has closed. ReMarkets is finalizing awards — you'll be notified when results are posted.
        </Alert>
      )}
      {offer.status === 'Results Posted' && (
        <Alert
          severity="success"
          sx={{ mb: 2.5 }}
          action={
            <Button color="inherit" size="small" component={RouterLink} to={ROUTES.MY_BIDS}>
              My Bids
            </Button>
          }
        >
          Results were posted for this offer. Your line-by-line outcomes are shown below.
        </Alert>
      )}

      {/* Attachments */}
      {offer.attachments && offer.attachments.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2.5 }} flexWrap="wrap" useFlexGap>
          {offer.attachments.map((a) => (
            <Chip
              key={a.fileName}
              icon={<AttachFileIcon sx={{ fontSize: 14 }} />}
              deleteIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
              onDelete={() => setToast(`Downloading ${a.fileName}…`)}
              label={`${a.fileName} (${a.sizeLabel})`}
              variant="outlined"
              sx={{ color: 'text.secondary' }}
            />
          ))}
        </Stack>
      )}

      {/* Lines */}
      <SectionCard title={`Offer lines (${offer.lines.length})`} noPadding>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell align="right">Available qty</TableCell>
                <TableCell align="right">Offer price</TableCell>
                <TableCell>Your bid</TableCell>
                {!finished && <TableCell align="right">Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {offer.lines.map((line) => {
                const bid = bids[line.lineNumber];
                return (
                  <TableRow key={line.lineNumber} hover>
                    <TableCell sx={{ color: 'text.secondary' }}>{line.lineNumber}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'grey.900' }}>
                        {line.product}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {line.partNumber} · {line.manufacturer} · {line.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={line.condition} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {fmtQty(line.availableQuantity)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {line.offerPrice !== undefined ? (
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'secondary.dark' }}>
                          {fmtPrice(line.offerPrice)}
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Name your price
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {bid && !bid.withdrawn ? (
                        <Box>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'grey.900' }}>
                            {fmtPrice(bid.pricePerUnit)} × {fmtQty(bid.quantity)}
                          </Typography>
                          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }} flexWrap="wrap" useFlexGap>
                            {bid.allocationOutcome ? (
                              <StatusChip
                                tone={statusToneFor(bid.allocationOutcome)}
                                label={
                                  bid.allocationOutcome === 'Partially Allocated' && bid.allocatedQuantity
                                    ? `Awarded ${fmtQty(bid.allocatedQuantity)} of ${fmtQty(bid.quantity)}`
                                    : bid.allocationOutcome
                                }
                              />
                            ) : (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Rev {bid.revisionNumber}
                              </Typography>
                            )}
                            {bid.systemCapped && (
                              <StatusChip tone="warning" label="Qty adjusted by ReMarkets" />
                            )}
                          </Stack>
                        </Box>
                      ) : bid && bid.withdrawn ? (
                        <StatusChip tone={statusToneFor('Withdrawn')} label="Withdrawn" />
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                    {!finished && (
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant={bid && !bid.withdrawn ? 'outlined' : 'contained'}
                          color="secondary"
                          onClick={() => openDialog(line)}
                        >
                          {bid && !bid.withdrawn ? 'Revise' : 'Place bid'}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </SectionCard>

      {/* Bid entry dialog */}
      <Dialog open={!!dialogLine} onClose={() => setDialogLine(null)} maxWidth="xs" fullWidth>
        {dialogLine && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              {bids[dialogLine.lineNumber] && !bids[dialogLine.lineNumber].withdrawn ? 'Revise bid' : 'Place bid'}
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'grey.900' }}>
                {dialogLine.product}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Line {dialogLine.lineNumber} · {dialogLine.partNumber} · {dialogLine.condition} ·{' '}
                {fmtQty(dialogLine.availableQuantity)} units available
              </Typography>

              {dialogLine.offerPrice !== undefined && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Posted offer price is <strong>{fmtPrice(dialogLine.offerPrice)}/unit</strong>. Bids at or
                  near the posted price are typically awarded fastest.
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  label="Your price per unit"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  error={!!dialogErrors.price}
                  helperText={dialogErrors.price}
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                  }}
                  fullWidth
                  autoFocus
                />
                <TextField
                  label="Quantity"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  error={!!dialogErrors.qty}
                  helperText={dialogErrors.qty ?? `Up to ${fmtQty(dialogLine.availableQuantity)} units`}
                  slotProps={{
                    input: { endAdornment: <InputAdornment position="end">units</InputAdornment> },
                  }}
                  fullWidth
                />
                {canSubmit && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total commitment:{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: 'grey.900' }}>
                      {fmtPrice(Number(priceInput) * Number(qtyInput))}
                    </Box>
                  </Typography>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              {bids[dialogLine.lineNumber] && !bids[dialogLine.lineNumber].withdrawn && (
                <Button color="error" onClick={withdrawBid} sx={{ mr: 'auto' }}>
                  Withdraw bid
                </Button>
              )}
              <Button onClick={() => setDialogLine(null)} color="inherit">
                Cancel
              </Button>
              <Button variant="contained" color="secondary" disabled={!canSubmit} onClick={submitBid}>
                Submit bid
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast(null)} sx={{ boxShadow: 3 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
