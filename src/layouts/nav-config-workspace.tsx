import { CONFIG } from 'src/global-config';

import type { WorkspacesPopoverProps } from './components/workspaces-popover';

// ----------------------------------------------------------------------

export const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: 'team-1',
    name: 'OrbitWatch- Terreno 1',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
    plan: '6',
  },
  {
    id: 'team-2',
    name: 'OrbitWatch- Terreno 2',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
    plan: '4',
  },
  {
    id: 'team-3',
    name: 'OrbitWatch- Terreno 3',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
    plan: '1',
  },
];
