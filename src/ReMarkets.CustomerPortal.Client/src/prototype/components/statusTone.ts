import type { StatusTone } from './StatusChip';

/**
 * Customer-portal status vocabulary. Customers never see internal offer
 * states (Potential) or allocation machinery — they see whether an offer is
 * open for bids, closing soon, closed pending results, or resulted.
 */
export function statusToneFor(
  status:
    | 'Open for Bids'
    | 'Closing Soon'
    | 'Bid Window Ended'
    | 'Closed'
    | 'Results Posted'
    | 'Active'
    | 'Superseded'
    | 'Withdrawn'
    | 'Cancelled'
    | 'Awarded'
    | 'Partially Allocated'
    | 'Not Awarded'
    | 'Pending Results',
): StatusTone {
  switch (status) {
    case 'Open for Bids':
    case 'Active':
      return 'info';
    case 'Closing Soon':
    case 'Bid Window Ended':
    case 'Pending Results':
      return 'warning';
    case 'Awarded':
    case 'Results Posted':
      return 'success';
    case 'Partially Allocated':
      return 'floor';
    case 'Cancelled':
    case 'Not Awarded':
      return 'error';
    case 'Withdrawn':
    case 'Superseded':
    case 'Closed':
    default:
      return 'neutral';
  }
}
