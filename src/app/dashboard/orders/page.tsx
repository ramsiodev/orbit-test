import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import OrdersView from 'src/sections/dashboard/orders/oders-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Ordenes | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrdersView />;
}
