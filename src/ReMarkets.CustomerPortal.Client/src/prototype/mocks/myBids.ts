/**
 * The logged-in customer's bids. One active bid per (customer, offer line,
 * offer); every change creates a new revision with full history retained —
 * the same revision pipeline as the internal app, seen from the customer side.
 *
 * `placedBy` attribution is the portal's mirror of Phase 1 masquerade: bids a
 * ReMarkets rep entered on the customer's behalf are visible here and clearly
 * attributed, alongside bids the customer placed themselves through the portal.
 */

export type BidStatus = 'Active' | 'Superseded' | 'Withdrawn' | 'Cancelled';
export type BidAllocationOutcome = 'Awarded' | 'Partially Allocated' | 'Not Awarded';
export type BidPlacedBy = 'you' | 'rep';

export interface MyBid {
  offerId: string;
  lineNumber: number;
  revisionNumber: number;
  status: BidStatus;
  pricePerUnit: number;
  quantity: number;
  placedBy: BidPlacedBy;
  placedByName: string; // "You" for portal entries; the rep's name otherwise
  placedAt: string;
  /**
   * True when this Active revision was produced by a company-initiated Cap
   * cascade — the offer line shrank below the prior bid quantity, so ReMarkets
   * re-issued the bid at the original price and the reduced quantity. The
   * portal surfaces it as a "quantity adjusted" notice to acknowledge.
   */
  systemCapped?: boolean;
  /** Populated on the live Active revision once the offer's results are posted. */
  allocationOutcome?: BidAllocationOutcome;
  allocatedQuantity?: number;
}

export const MY_BIDS: MyBid[] = [
  // ── OFF-2026-0147 · Q2 Dallas Memory Liquidation (bid window ended) ──────
  // L1 — placed by the assigned rep at the posted offer price.
  { offerId: 'OFF-2026-0147', lineNumber: 1, revisionNumber: 1, status: 'Active', pricePerUnit: 3.45, quantity: 10_000, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 12, 2026 at 10:14 AM' },
  // L2 — cancelled company-initiated (offer line was removed in an Edit Offer
  // cascade). The customer must re-bid; feeds the Home attention item.
  { offerId: 'OFF-2026-0147', lineNumber: 2, revisionNumber: 1, status: 'Cancelled', pricePerUnit: 4.05, quantity: 6_000, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 15, 2026 at 10:40 AM' },
  // L3 — single revision, rep-entered.
  { offerId: 'OFF-2026-0147', lineNumber: 3, revisionNumber: 1, status: 'Active', pricePerUnit: 2.75, quantity: 9_600, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 12, 2026 at 10:30 AM' },
  // L5 — system-capped: the offer line was reduced, so rev 1 was superseded by
  // a company-issued rev 2 at the original price and the smaller quantity.
  { offerId: 'OFF-2026-0147', lineNumber: 5, revisionNumber: 1, status: 'Superseded', pricePerUnit: 41, quantity: 15_000, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 13, 2026 at 11:30 AM' },
  { offerId: 'OFF-2026-0147', lineNumber: 5, revisionNumber: 2, status: 'Active', pricePerUnit: 41, quantity: 12_000, placedBy: 'rep', placedByName: 'System (ReMarkets)', placedAt: 'May 15, 2026 at 9:05 AM', systemCapped: true },
  // L7 — rep-entered.
  { offerId: 'OFF-2026-0147', lineNumber: 7, revisionNumber: 1, status: 'Active', pricePerUnit: 225, quantity: 11_200, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 12, 2026 at 4:42 PM' },

  // ── OFF-2026-0148 · Dublin Refurbished CPUs (closing soon) ───────────────
  // L1 — placed and then revised upward BY THE CUSTOMER through the portal.
  { offerId: 'OFF-2026-0148', lineNumber: 1, revisionNumber: 1, status: 'Superseded', pricePerUnit: 102, quantity: 2_000, placedBy: 'you', placedByName: 'You', placedAt: 'May 14, 2026 at 9:12 AM' },
  { offerId: 'OFF-2026-0148', lineNumber: 1, revisionNumber: 2, status: 'Active', pricePerUnit: 105, quantity: 2_000, placedBy: 'you', placedByName: 'You', placedAt: 'May 16, 2026 at 2:48 PM' },
  // L2 — customer bid then withdrew (customer-initiated).
  { offerId: 'OFF-2026-0148', lineNumber: 2, revisionNumber: 1, status: 'Withdrawn', pricePerUnit: 112, quantity: 1_500, placedBy: 'you', placedByName: 'You', placedAt: 'May 15, 2026 at 11:05 AM' },

  // ── OFF-2026-0146 · April Memory Block (pending results) ─────────────────
  { offerId: 'OFF-2026-0146', lineNumber: 2, revisionNumber: 1, status: 'Active', pricePerUnit: 4.75, quantity: 10_000, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 05, 2026 at 11:20 AM' },
  { offerId: 'OFF-2026-0146', lineNumber: 5, revisionNumber: 1, status: 'Active', pricePerUnit: 2.75, quantity: 8_000, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 06, 2026 at 11:50 AM' },

  // ── OFF-2026-0144 · March Storage Closeout (results posted) ──────────────
  // L2 — split award: 3,500 of the 8,500 bid units were allocated.
  { offerId: 'OFF-2026-0144', lineNumber: 2, revisionNumber: 1, status: 'Active', pricePerUnit: 2.95, quantity: 8_500, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 09, 2026 at 9:45 AM', allocationOutcome: 'Partially Allocated', allocatedQuantity: 3_500 },
  // L3 — outbid; nothing awarded.
  { offerId: 'OFF-2026-0144', lineNumber: 3, revisionNumber: 1, status: 'Active', pricePerUnit: 3.55, quantity: 9_000, placedBy: 'rep', placedByName: 'Jerry Lee', placedAt: 'May 08, 2026 at 3:10 PM', allocationOutcome: 'Not Awarded' },
];

/** Live Active revisions only — the bids that currently stand. */
export function getMyActiveBids(): MyBid[] {
  return MY_BIDS.filter((b) => b.status === 'Active');
}

/** The customer's live bid on one line, if any. */
export function getMyActiveBidForLine(offerId: string, lineNumber: number): MyBid | undefined {
  return MY_BIDS.find(
    (b) => b.offerId === offerId && b.lineNumber === lineNumber && b.status === 'Active',
  );
}

/** Full revision history for one line, newest revision first. */
export function getMyBidHistoryForLine(offerId: string, lineNumber: number): MyBid[] {
  return MY_BIDS.filter((b) => b.offerId === offerId && b.lineNumber === lineNumber).sort(
    (a, b) => b.revisionNumber - a.revisionNumber,
  );
}

export function getMyActiveBidsCountForOffer(offerId: string): number {
  return MY_BIDS.filter((b) => b.offerId === offerId && b.status === 'Active').length;
}

export function getMyBidsForOffer(offerId: string): MyBid[] {
  return MY_BIDS.filter((b) => b.offerId === offerId);
}

/** Distinct lines the customer has ever bid on, for grouping in My Bids. */
export function getMyBidLines(): { offerId: string; lineNumber: number }[] {
  const seen = new Set<string>();
  const out: { offerId: string; lineNumber: number }[] = [];
  for (const b of MY_BIDS) {
    const key = `${b.offerId}|${b.lineNumber}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ offerId: b.offerId, lineNumber: b.lineNumber });
    }
  }
  return out;
}
