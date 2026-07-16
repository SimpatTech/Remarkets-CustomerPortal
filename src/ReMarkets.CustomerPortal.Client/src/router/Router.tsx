import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './ROUTES';
import { PortalLayout } from '../prototype/layout/PortalLayout';
import { LoginPage } from '../prototype/pages/LoginPage';
import { HomePage } from '../prototype/pages/HomePage';
import { BrowseOffersPage } from '../prototype/pages/BrowseOffersPage';
import { OfferDetailPage } from '../prototype/pages/OfferDetailPage';
import { MyBidsPage } from '../prototype/pages/MyBidsPage';
import { AccountPage } from '../prototype/pages/AccountPage';

export const router = createBrowserRouter([
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
