/**
 * Offers as the CUSTOMER sees them. This is the bid-sheet surface from the
 * Phase 1 ubiquitous language: Line #, Part/Product, Manufacturer, Condition,
 * Available Qty, Offer Price — plus the customer's own bid entry. Internal
 * pricing (Spot / Cost / Floor / Target), supplier identities, and SourceIds
 * NEVER appear here; that is a hard privacy rule, not a styling choice.
 *
 * Offer IDs and line data stay consistent with the remarkets-bid internal
 * prototype so the two demos walk the same story from both sides.
 */

export type ProductCategory = 'Memory' | 'SSD/Storage' | 'CPUs' | 'Networking';
export type ItemCondition = 'New' | 'Refurbished' | 'Used';

/**
 * The prototype's fixed "today" — same date as the internal prototype so both
 * demos agree on which offers are closing.
 */
export const PROTOTYPE_TODAY_ISO = '2026-05-17';

/**
 * Customer-facing offer lifecycle. Derived from the internal status + dates:
 * customers never see `Potential` offers, and the allocation machinery is
 * summarized as Pending Results / Results Posted.
 */
export type PortalOfferStatus =
  | 'Open for Bids'
  | 'Closing Soon'
  | 'Bid Window Ended'
  | 'Pending Results'
  | 'Results Posted';

export interface PortalOfferLine {
  lineNumber: number;
  partNumber: string;
  product: string;
  manufacturer: string;
  category: ProductCategory;
  condition: ItemCondition;
  unit: string;
  availableQuantity: number;
  /**
   * The price the company sent to the customer. Populated ⇒ Priced Offer mode
   * (buy-at-price guidance); empty ⇒ Soliciting Bids mode (name your price).
   * Mixed-mode offers are allowed.
   */
  offerPrice?: number;
}

export interface PortalAttachment {
  fileName: string;
  sizeLabel: string;
  uploadedAt: string;
}

export interface PortalOffer {
  id: string;
  title: string;
  shipsFrom: string; // warehouse city — customers see origin, not internal location codes
  bidStart: string;
  bidEnd: string;
  bidEndIso: string; // machine-readable, drives closing-soon countdown
  status: PortalOfferStatus;
  lines: PortalOfferLine[];
  attachments?: PortalAttachment[];
  /** Short marketing-style blurb shown on the Browse card. */
  summary: string;
}

export const PORTAL_OFFERS: PortalOffer[] = [
  {
    id: 'OFF-2026-0147',
    title: 'Q2 Dallas Memory Liquidation',
    shipsFrom: 'Dallas, Texas',
    bidStart: 'May 12, 2026',
    bidEnd: 'May 16, 2026',
    bidEndIso: '2026-05-16',
    status: 'Bid Window Ended',
    summary: 'Server memory and enterprise storage from a single-owner data center refresh. Mixed DDR5 RDIMM/UDIMM plus NVMe and 10GbE NICs.',
    attachments: [
      { fileName: 'DDR5-lot-test-report-Q2.pdf', sizeLabel: '1.2 MB', uploadedAt: 'May 12, 2026' },
      { fileName: 'dallas-memory-lot-photos.zip', sizeLabel: '8.4 MB', uploadedAt: 'May 12, 2026' },
    ],
    lines: [
      { lineNumber: 1, partNumber: 'DDR5-32G-4800E', product: 'DDR5-4800 ECC RDIMM 32GB', manufacturer: 'SK hynix', category: 'Memory', condition: 'Refurbished', unit: 'units', availableQuantity: 10_000, offerPrice: 3.45 },
      { lineNumber: 2, partNumber: 'DDR5-32G-4800E', product: 'DDR5-4800 ECC RDIMM 32GB', manufacturer: 'Samsung', category: 'Memory', condition: 'New', unit: 'units', availableQuantity: 12_000 },
      { lineNumber: 3, partNumber: 'DDR5-16G-5600U', product: 'DDR5-5600 UDIMM 16GB', manufacturer: 'Micron', category: 'Memory', condition: 'New', unit: 'units', availableQuantity: 9_600 },
      { lineNumber: 4, partNumber: 'PM9A3-NVMe-2T', product: 'Samsung PM9A3 NVMe 1.92TB', manufacturer: 'Samsung', category: 'SSD/Storage', condition: 'Used', unit: 'units', availableQuantity: 4_200 },
      { lineNumber: 5, partNumber: 'BCM-57416-10G', product: 'Broadcom 57416 Dual 10GbE NIC', manufacturer: 'Broadcom', category: 'Networking', condition: 'New', unit: 'units', availableQuantity: 15_000, offerPrice: 40 },
      { lineNumber: 6, partNumber: 'XEON-4410Y', product: 'Intel Xeon Bronze 4410Y', manufacturer: 'Intel', category: 'CPUs', condition: 'Refurbished', unit: 'units', availableQuantity: 6_750 },
      { lineNumber: 7, partNumber: 'KIOXIA-CD8-2T', product: 'Kioxia CD8 NVMe 1.92TB', manufacturer: 'Kioxia', category: 'SSD/Storage', condition: 'New', unit: 'units', availableQuantity: 11_200, offerPrice: 235 },
      { lineNumber: 8, partNumber: 'KIOXIA-CD8-2T', product: 'Kioxia CD8 NVMe 1.92TB', manufacturer: 'Kioxia', category: 'SSD/Storage', condition: 'Refurbished', unit: 'units', availableQuantity: 4_500 },
    ],
  },
  {
    id: 'OFF-2026-0148',
    title: 'Dublin Refurbished CPUs',
    shipsFrom: 'Dublin, Ireland',
    bidStart: 'May 13, 2026',
    bidEnd: 'May 20, 2026',
    bidEndIso: '2026-05-20',
    status: 'Closing Soon',
    summary: 'Data-center pull refurbished Xeon and EPYC processors, tested and graded. EU stock — ships from our Dublin warehouse.',
    attachments: [
      { fileName: 'dublin-cpu-grading-summary.pdf', sizeLabel: '640 KB', uploadedAt: 'May 13, 2026' },
    ],
    lines: [
      { lineNumber: 1, partNumber: 'XEON-6430', product: 'Intel Xeon Gold 6430', manufacturer: 'Intel', category: 'CPUs', condition: 'Refurbished', unit: 'units', availableQuantity: 4_800 },
      { lineNumber: 2, partNumber: 'XEON-4514Y', product: 'Intel Xeon Silver 4514Y', manufacturer: 'Intel', category: 'CPUs', condition: 'Refurbished', unit: 'units', availableQuantity: 5_200, offerPrice: 118 },
      { lineNumber: 3, partNumber: 'EPYC-9354P', product: 'AMD EPYC 9354P', manufacturer: 'AMD', category: 'CPUs', condition: 'Refurbished', unit: 'units', availableQuantity: 4_200 },
    ],
  },
  {
    id: 'OFF-2026-0151',
    title: 'Enterprise SSD Spring Release',
    shipsFrom: 'Greencastle, Pennsylvania',
    bidStart: 'May 15, 2026',
    bidEnd: 'May 24, 2026',
    bidEndIso: '2026-05-24',
    status: 'Open for Bids',
    summary: 'Fresh consignment of enterprise NVMe and SATA SSDs. All lines carry a posted offer price — bid at or near list for fastest award.',
    lines: [
      { lineNumber: 1, partNumber: 'PM893-960G', product: 'Samsung PM893 SATA 960GB', manufacturer: 'Samsung', category: 'SSD/Storage', condition: 'New', unit: 'units', availableQuantity: 18_000, offerPrice: 62 },
      { lineNumber: 2, partNumber: 'P5520-3T84', product: 'Solidigm P5520 NVMe 3.84TB', manufacturer: 'Solidigm', category: 'SSD/Storage', condition: 'New', unit: 'units', availableQuantity: 7_400, offerPrice: 289 },
      { lineNumber: 3, partNumber: 'MX500-1TB-SATA', product: 'Crucial MX500 1TB SATA SSD', manufacturer: 'Crucial', category: 'SSD/Storage', condition: 'New', unit: 'units', availableQuantity: 12_500, offerPrice: 41 },
      { lineNumber: 4, partNumber: 'CD8-NVMe-1T', product: 'Kioxia CD8 NVMe 960GB', manufacturer: 'Kioxia', category: 'SSD/Storage', condition: 'New', unit: 'units', availableQuantity: 9_800, offerPrice: 128 },
    ],
  },
  {
    id: 'OFF-2026-0146',
    title: 'April Memory Block',
    shipsFrom: 'Dublin, Ireland',
    bidStart: 'May 01, 2026',
    bidEnd: 'May 08, 2026',
    bidEndIso: '2026-05-08',
    status: 'Pending Results',
    summary: 'Bulk DDR5 memory, enterprise NVMe, Xeon Gold CPUs, and 10GbE networking. Bidding has closed — awards are being finalized.',
    lines: [
      { lineNumber: 1, partNumber: 'DDR5-32G-4800E', product: 'DDR5-4800 ECC RDIMM 32GB', manufacturer: 'SK hynix', category: 'Memory', condition: 'Refurbished', unit: 'units', availableQuantity: 12_000, offerPrice: 3.95 },
      { lineNumber: 2, partNumber: 'DDR5-16G-5600U', product: 'DDR5-5600 UDIMM 16GB', manufacturer: 'Micron', category: 'Memory', condition: 'Refurbished', unit: 'units', availableQuantity: 10_000 },
      { lineNumber: 3, partNumber: 'PM9A3-NVMe-2T', product: 'Samsung PM9A3 NVMe 1.92TB', manufacturer: 'Samsung', category: 'SSD/Storage', condition: 'Used', unit: 'units', availableQuantity: 8_000 },
      { lineNumber: 4, partNumber: 'XEON-6448Y', product: 'Intel Xeon Gold 6448Y', manufacturer: 'Intel', category: 'CPUs', condition: 'Refurbished', unit: 'units', availableQuantity: 6_000 },
      { lineNumber: 5, partNumber: 'BCM-57416-10G', product: 'Broadcom 57416 Dual 10GbE NIC', manufacturer: 'Broadcom', category: 'Networking', condition: 'New', unit: 'units', availableQuantity: 22_000 },
    ],
  },
  {
    id: 'OFF-2026-0144',
    title: 'March Storage Closeout',
    shipsFrom: 'Greencastle, Pennsylvania',
    bidStart: 'May 05, 2026',
    bidEnd: 'May 12, 2026',
    bidEndIso: '2026-05-12',
    status: 'Results Posted',
    summary: 'SATA SSDs, DDR4 RDIMMs, NVMe drives, and Xeon Bronze CPUs. Awards were finalized on May 14 — see My Bids for your results.',
    lines: [
      { lineNumber: 1, partNumber: 'MX500-1TB-SATA', product: 'Crucial MX500 1TB SATA SSD', manufacturer: 'Crucial', category: 'SSD/Storage', condition: 'Used', unit: 'units', availableQuantity: 10_000 },
      { lineNumber: 2, partNumber: 'DDR4-16G-3200R', product: 'DDR4-3200 RDIMM 16GB', manufacturer: 'Samsung', category: 'Memory', condition: 'Refurbished', unit: 'units', availableQuantity: 8_500 },
      { lineNumber: 3, partNumber: 'CD8-NVMe-1T', product: 'Kioxia CD8 NVMe 960GB', manufacturer: 'Kioxia', category: 'SSD/Storage', condition: 'New', unit: 'units', availableQuantity: 9_000, offerPrice: 3.85 },
      { lineNumber: 4, partNumber: 'XEON-4410Y', product: 'Intel Xeon Bronze 4410Y', manufacturer: 'Intel', category: 'CPUs', condition: 'Refurbished', unit: 'units', availableQuantity: 6_000 },
    ],
  },
];

export function getPortalOffer(id: string): PortalOffer | undefined {
  return PORTAL_OFFERS.find((o) => o.id === id);
}

/** Offers the customer can still bid on (advisory Bid End does not block entry). */
export function getBiddableOffers(): PortalOffer[] {
  return PORTAL_OFFERS.filter(
    (o) => o.status === 'Open for Bids' || o.status === 'Closing Soon' || o.status === 'Bid Window Ended',
  );
}

/** Offers whose bidding has finished (closed pending results, or resulted). */
export function getFinishedOffers(): PortalOffer[] {
  return PORTAL_OFFERS.filter((o) => o.status === 'Pending Results' || o.status === 'Results Posted');
}

export function daysUntilBidEnd(offer: PortalOffer): number {
  const ms = Date.parse(offer.bidEndIso) - Date.parse(PROTOTYPE_TODAY_ISO);
  return Math.ceil(ms / 86_400_000);
}

export function getOfferLine(offerId: string, lineNumber: number): PortalOfferLine | undefined {
  return getPortalOffer(offerId)?.lines.find((l) => l.lineNumber === lineNumber);
}
