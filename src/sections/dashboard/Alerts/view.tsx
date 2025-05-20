'use client';

import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material/styles';
import type { MapProps } from 'react-map-gl/mapbox';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import AlertsContainer from './AlertsContainer';

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
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }} mt={3}>
        <AlertsContainer />
      </Grid>
    </Grid>
  );
}
