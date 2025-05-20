import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import AlertCardItem from './AlertCardItem';
import { usePurchaseConfirmDialog } from './hooks/usePurchaseConfirmDialog';

import type { AlertItemProps } from './AlertCardItem';

// ----------------------------------------------------------------------

export default function AlertsDetailView({
  data,
  title,
  date,
  onGoBack,
}: {
  data: AlertItemProps[];
  title: string;
  date?: string;
  onGoBack?: () => void;
}) {
  const [currentTab, setCurrentTab] = useState('all');
  const { open: openPurchaseDialog } = usePurchaseConfirmDialog();

  // Podemos asumir que los datos son válidos porque vienen procesados del store de Zustand
  console.log('AlertsDetailView: Renderizando con', data.length, 'alertas');

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const filteredAlerts = useMemo(() => {
    if (currentTab === 'all') return data;
    return data.filter((alert) => alert.title.toLowerCase() === currentTab.toLowerCase());
  }, [data, currentTab]);

  const handleGoBack = () => {
    console.log('AlertsDetailView: Volviendo atrás');

    // Si se proporciona una función onGoBack, usarla
    if (onGoBack) {
      onGoBack();
      return;
    }

    // Fallback a navegación del navegador si no hay función onGoBack
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/dashboard/alerts';
    }
  };

  const handleHighQualityPhoto = () => {
    openPurchaseDialog(() => {
      // Aquí puedes poner la lógica para procesar la compra de la imagen
      console.log('Compra de imagen de alta calidad confirmada');
    });
  };

  // Calcular contadores de alertas
  const alertsCount = useMemo(() => {
    const alertas = data.filter((item) => item.title.toLowerCase() === 'alerta').length;

    const advertencias = data.filter((item) => item.title.toLowerCase() === 'advertencia').length;

    return {
      all: data.length,
      alertas,
      advertencias,
    };
  }, [data]);

  return (
    <>
      <Stack direction="row" alignItems="center" mb={3}>
        <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
          <Icon icon="mdi:arrow-left" width={24} />
        </IconButton>
        <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1 }}>
          <Typography variant="h3">Alarmas </Typography>
          <Typography sx={{ color: '#919EAB', fontSize: 24 }}>| {alertsCount.all} items</Typography>
        </Stack>
        <Button variant="contained" color="primary" onClick={handleHighQualityPhoto}>
          Foto de alta calidad
        </Button>
      </Stack>

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          px: 2,
        }}
      >
        <Tab
          key="all"
          value="all"
          disableRipple
          disableFocusRipple
          label={`Todos (${alertsCount.all})`}
          sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
        />
        <Tab
          key="alerta"
          value="alerta"
          label={`Alertas (${alertsCount.alertas})`}
          sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
        />
        <Tab
          key="advertencia"
          value="advertencia"
          label={`Advertencias (${alertsCount.advertencias})`}
          sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
        />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {filteredAlerts.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 3 }}>
          {filteredAlerts.map((alert) => (
            <Box key={alert.id} sx={{ width: { xs: '100%' } }}>
              <AlertCardItem {...alert} showFullDetails sx={{ height: 320 }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">
            No se encontraron{' '}
            {currentTab === 'all'
              ? 'alertas'
              : currentTab === 'alerta'
                ? 'alertas'
                : 'advertencias'}
          </Typography>
        </Box>
      )}
    </>
  );
}
