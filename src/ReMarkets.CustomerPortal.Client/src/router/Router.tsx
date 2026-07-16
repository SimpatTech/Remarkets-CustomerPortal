import { createBrowserRouter, createHashRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './ROUTES';
import { PortalLayout } from '../prototype/layout/PortalLayout';
import { LoginPage } from '../prototype/pages/LoginPage';
import { HomePage } from '../prototype/pages/HomePage';
import { BrowseOffersPage } from '../prototype/pages/BrowseOffersPage';
import { OfferDetailPage } from '../prototype/pages/OfferDetailPage';
import { MyBidsPage } from '../prototype/pages/MyBidsPage';
import { AccountPage } from '../prototype/pages/AccountPage';

// The single-file demo build (vite.singlefile.config.ts) runs from file://,
// which can't serve /home-style paths — it uses hash routing instead.
const createRouter =
  import.meta.env.VITE_SINGLE_FILE === '1' ? createHashRouter : createBrowserRouter;

export const router = createRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    element: <PortalLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.OFFERS, element: <BrowseOffersPage /> },
      { path: ROUTES.OFFER_DETAIL, element: <OfferDetailPage /> },
      { path: ROUTES.MY_BIDS, element: <MyBidsPage /> },
      { path: ROUTES.ACCOUNT, element: <AccountPage /> },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
]);
