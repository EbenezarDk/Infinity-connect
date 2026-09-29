import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AppShell } from '../components/layout/AppShell';
import { InboxPage } from '../pages/Inbox/InboxPage';

const ContactsPage = lazy(() => import('../pages/Contacts/ContactsPage').then((m) => ({ default: m.ContactsPage })));
const ContactProfilePage = lazy(() =>
  import('../pages/Contacts/ContactProfilePage').then((m) => ({ default: m.ContactProfilePage })),
);
const CampaignsPage = lazy(() => import('../pages/Campaigns/CampaignsPage').then((m) => ({ default: m.CampaignsPage })));
const CampaignDetailPage = lazy(() =>
  import('../pages/Campaigns/CampaignDetailPage').then((m) => ({ default: m.CampaignDetailPage })),
);
const AutomationsPage = lazy(() =>
  import('../pages/Automations/AutomationsPage').then((m) => ({ default: m.AutomationsPage })),
);
const AnalyticsPage = lazy(() => import('../pages/Analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const ChannelsPage = lazy(() => import('../pages/Channels/ChannelsPage').then((m) => ({ default: m.ChannelsPage })));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

function PageFallback() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <CircularProgress size={28} />
    </Box>
  );
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/inbox" replace /> },
      { path: 'inbox', element: <InboxPage /> },
      { path: 'contacts', element: withSuspense(<ContactsPage />) },
      { path: 'contacts/:contactId', element: withSuspense(<ContactProfilePage />) },
      { path: 'campaigns', element: withSuspense(<CampaignsPage />) },
      { path: 'campaigns/:campaignId', element: withSuspense(<CampaignDetailPage />) },
      { path: 'automations', element: withSuspense(<AutomationsPage />) },
      { path: 'analytics', element: withSuspense(<AnalyticsPage />) },
      { path: 'channels', element: withSuspense(<ChannelsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: '*', element: <Navigate to="/inbox" replace /> },
    ],
  },
]);
