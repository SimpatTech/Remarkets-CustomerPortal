/**
 * The logged-in portal user. The portal is single-tenant per session: every
 * screen is scoped to this user's customer account. Pinnacle IT Solutions is
 * the same customer that appears throughout the remarkets-bid (internal app)
 * prototype, so the two demos tell one continuous story.
 */
export interface PortalUser {
  customerId: string;
  companyName: string;
  fullName: string;
  initials: string;
  title: string;
  email: string;
  phone: string;
}

export const PORTAL_USER: PortalUser = {
  customerId: 'cust_pinnacle',
  companyName: 'Pinnacle IT Solutions',
  fullName: 'Dana Whitfield',
  initials: 'DW',
  title: 'Purchasing Manager',
  email: 'dana.whitfield@pinnacleit.com',
  phone: '+1 (214) 555-0187',
};

/**
 * The customer's assigned ReMarkets sales rep (Sales Rep Assignment is 1:N in
 * Phase 1; the portal surfaces the primary contact). Bids the rep entered on
 * the customer's behalf show up in My Bids with rep attribution.
 */
export interface AssignedRep {
  fullName: string;
  initials: string;
  email: string;
  phone: string;
}

export const ASSIGNED_REP: AssignedRep = {
  fullName: 'Jerry Lee',
  initials: 'JL',
  email: 'jerry.lee@remarkets.com',
  phone: '+1 (972) 555-0142',
};

export interface CompanyProfile {
  legalName: string;
  accountNumber: string;
  billingAddress: string[];
  shippingAddress: string[];
  memberSince: string;
  contacts: { name: string; title: string; email: string; primary: boolean }[];
}

export const COMPANY_PROFILE: CompanyProfile = {
  legalName: 'Pinnacle IT Solutions, LLC',
  accountNumber: 'CUST-00214',
  billingAddress: ['4200 Commerce Row, Suite 310', 'Plano, TX 75024', 'United States'],
  shippingAddress: ['Dock 4 — Pinnacle Fulfillment Center', '1180 Innovation Blvd', 'Garland, TX 75042', 'United States'],
  memberSince: 'March 2024',
  contacts: [
    { name: 'Dana Whitfield', title: 'Purchasing Manager', email: 'dana.whitfield@pinnacleit.com', primary: true },
    { name: 'Ravi Subramanian', title: 'Procurement Analyst', email: 'ravi.s@pinnacleit.com', primary: false },
    { name: 'Erin Kowalski', title: 'Accounts Payable', email: 'ap@pinnacleit.com', primary: false },
  ],
};
