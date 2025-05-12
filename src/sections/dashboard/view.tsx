'use client';

import type React from 'react';

import { useState } from 'react';

import { Box, Button } from '@mui/material';

import { CONFIG } from 'src/global-config';
import useLandStore from 'src/store/landStore';
import { DashboardContent } from 'src/layouts/dashboard';

import { Image } from 'src/components/image';
import { SvgColor } from 'src/components/svg-color';

import { DashboardHomeView } from './Home/view';
import { DashboardAlertsView } from './Alerts/view';
import { DashboardHistoricalView } from './historical/view';

const menuItems = [
  { label: 'Home', Icon: `${CONFIG.assetsDir}/assets/icons/dashboard/ic-home.svg` },
  { label: 'Informacion', Icon: `${CONFIG.assetsDir}/assets/icons/dashboard/ic-info.svg` },
  { label: 'Alertas', Icon: `${CONFIG.assetsDir}/assets/icons/dashboard/ic-alertas.svg` },
  { label: 'Camaras', Icon: `${CONFIG.assetsDir}/assets/icons/dashboard/ic-camaras.svg` },
  { label: 'Reportes', Icon: `${CONFIG.assetsDir}/assets/icons/dashboard/ic-reportes.svg` },
  { label: 'Historial', Icon: `${CONFIG.assetsDir}/assets/icons/dashboard/ic-historico.svg` },
];

const DashboardView: React.FC = () => {
  const [active, setActive] = useState('Home');
  const { isLoading } = useLandStore();

  if (isLoading) return null;

  return (
    <DashboardContent maxWidth="xl">
      <Box
        display="flex"
        gap={2}
        borderRadius={2}
        sx={{ overflowX: 'auto', whiteSpace: 'nowrap', minWidth: '100%', p: '20px 0px' }}
      >
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={active === item.label ? 'soft' : 'text'}
            color={active === item.label ? 'primary' : 'inherit'}
            onClick={() => setActive(item.label)}
            sx={{ height: '44px', pl: 4, pr: 4, minWidth: 'fit-content' }}
            startIcon={<SvgColor src={item.Icon} />}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {active === 'Home' && <DashboardHomeView />}
      {active === 'Alertas' && <DashboardAlertsView />}
      {active === 'Historial' && <DashboardHistoricalView />}
      {(active === 'Camaras' || active === 'Reportes' || active === 'Informacion') && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image src={`${CONFIG.assetsDir}/assets/background/empty.webp`} alt="empty" />
        </Box>
      )}
    </DashboardContent>
  );
};

export default DashboardView;
