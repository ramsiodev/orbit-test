'use client';

import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material/styles';
import type { MapProps } from 'react-map-gl/mapbox';

import { useState, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TableView from './TableView';
import MosaicView from './MosaicView';

// ----------------------------------------------------------------------

const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
};

const baseSettings: MapProps = {
  minZoom: 1,
};

const mapStyles: SxProps<Theme> = {
  height: 480,
  borderRadius: 1,
};

export function DashboardAlertsView() {
  const [currentRole, setCurrentRole] = useState('mosaico');

  const handleChangeRole = useCallback(
    (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
      if (newRole !== null) {
        setCurrentRole(newRole);
      }
    },
    []
  );

  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <CustomBreadcrumbs
          heading="Alertas y advertencias"
          subheading="Todas las alarmas que tuviste recientemente están guardadas aquí."
          action={
            <Box
              sx={{
                gap: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ToggleButtonGroup
                exclusive
                value={currentRole}
                size="small"
                onChange={handleChangeRole}
              >
                <ToggleButton value="mosaico" aria-label="Mosaico">
                  Mosaico
                </ToggleButton>
                <ToggleButton value="tabla" aria-label="Tabla">
                  Tabla
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          }
        />

        {currentRole === 'mosaico' && <MosaicView />}
        {currentRole === 'tabla' && <TableView />}
      </Grid>
    </Grid>
  );
}
