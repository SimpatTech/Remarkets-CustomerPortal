export const ROUTES = {
  LOGIN: '/',
  HOME: '/home',
  OFFERS: '/offers',
  OFFER_DETAIL: '/offers/:offerId',
  MY_BIDS: '/bids',
  ACCOUNT: '/account',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const getRoutePath = (key: RouteKey): RoutePath => ROUTES[key];
