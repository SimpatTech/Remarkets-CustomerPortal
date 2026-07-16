/**
 * Recent account activity for the Home page feed. Everything here is derived
 * from the bid/offer story in myBids.ts and portalOffers.ts — if you change
 * one, keep the other consistent.
 */

export type ActivityType =
  | 'bid-placed'
  | 'bid-revised'
  | 'bid-withdrawn'
  | 'bid-capped'
  | 'bid-cancelled'
  | 'offer-published'
  | 'results-posted';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  timestamp: string;
  offerId?: string;
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-01',
    type: 'bid-revised',
    title: 'You revised your bid on Dublin Refurbished CPUs',
    detail: 'Intel Xeon Gold 6430 — $105.00/unit × 2,000 units (was $102.00)',
    timestamp: 'May 16, 2026 at 2:48 PM',
    offerId: 'OFF-2026-0148',
  },
  {
    id: 'act-02',
    type: 'bid-withdrawn',
    title: 'You withdrew a bid on Dublin Refurbished CPUs',
    detail: 'Intel Xeon Silver 4514Y — $112.00/unit × 1,500 units',
    timestamp: 'May 15, 2026 at 11:05 AM',
    offerId: 'OFF-2026-0148',
  },
  {
    id: 'act-03',
    type: 'bid-cancelled',
    title: 'A bid was cancelled by ReMarkets',
    detail: 'Q2 Dallas Memory Liquidation, line 2 — the line was changed. Place a new bid if you are still interested.',
    timestamp: 'May 15, 2026 at 10:40 AM',
    offerId: 'OFF-2026-0147',
  },
  {
    id: 'act-04',
    type: 'bid-capped',
    title: 'A bid quantity was adjusted by ReMarkets',
    detail: 'Q2 Dallas Memory Liquidation, line 5 — available quantity was reduced. Your bid stands at $41.00/unit × 12,000 units (was 15,000).',
    timestamp: 'May 15, 2026 at 9:05 AM',
    offerId: 'OFF-2026-0147',
  },
  {
    id: 'act-05',
    type: 'offer-published',
    title: 'New offer available: Enterprise SSD Spring Release',
    detail: '4 lines of new enterprise NVMe and SATA SSDs — all with posted offer prices. Bidding closes May 24.',
    timestamp: 'May 15, 2026 at 8:00 AM',
    offerId: 'OFF-2026-0151',
  },
  {
    id: 'act-06',
    type: 'results-posted',
    title: 'Results posted for March Storage Closeout',
    detail: 'You were awarded 3,500 units of DDR4-3200 RDIMM 16GB at your bid price of $2.95/unit.',
    timestamp: 'May 14, 2026 at 3:20 PM',
    offerId: 'OFF-2026-0144',
  },
  {
    id: 'act-07',
    type: 'bid-placed',
    title: 'Jerry Lee placed a bid on your behalf',
    detail: 'Q2 Dallas Memory Liquidation, line 7 — Kioxia CD8 NVMe 1.92TB, $225.00/unit × 11,200 units',
    timestamp: 'May 12, 2026 at 4:42 PM',
    offerId: 'OFF-2026-0147',
  },
];
