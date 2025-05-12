'use client';

import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material/styles';
import type { MapProps } from 'react-map-gl/mapbox';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { MapHomeDash } from 'src/sections/_examples/extra/map-view/home-dash';
import { FileDataActivity } from 'src/sections/file-manager/file-data-activity';
import { HomeWidgetSummary } from 'src/sections/overview/app/app-widget-summary-home';
import { AnalyticsOrderTimeline } from 'src/sections/overview/analytics/analytics-order-timeline-multiple';

import { useMockedUser } from 'src/auth/hooks';

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

export function DashboardHomeView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  // Datos personalizados para el historial de alarmas
  const alarmData = [
    {
      id: '1',
      type: 'order1',
      title: 'Movimiento de personas',
      time: Date.now(),
      alarmGroup: '1',
    },
    {
      id: '2',
      type: 'order4',
      title: 'Detección de vehículos',
      time: Date.now() - 1000 * 60 * 30, // 30 minutos atrás
      alarmGroup: '1',
    },
    {
      id: '3',
      type: 'order2',
      title: 'Cambios en la zona',
      time: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 días atrás
      alarmGroup: '3',
    },
    {
      id: '4',
      type: 'order3',
      title: 'Movimiento de personas',
      time: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 días atrás
      alarmGroup: '3',
    },
    {
      id: '5',
      type: 'order5',
      title: 'Detección de vehículos',
      time: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 días atrás
      alarmGroup: '3',
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <HomeWidgetSummary
          title="Cambios en la zona"
          colorFigure={theme.vars.palette.primary.main}
          total="8%"
          note="normal"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <HomeWidgetSummary
          title="Promedio mensual del terreno"
          colorFigure={theme.vars.palette.success.main}
          total="Seguro"
          numberDate={{ value: 3, description: 'alarmas totales en el mes' }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <HomeWidgetSummary
          title="Alarmas mensuales"
          colorFigure={theme.vars.palette.secondary.light}
          numberDate={{ value: -0.5, description: '% mes pasado' }}
          total="3"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MapHomeDash {...baseSettings} themes={THEMES} sx={mapStyles} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <HomeWidgetSummary
          title="Estado actual de tu terreno"
          colorFigure={theme.vars.palette.primary.main}
          total="Seguro"
          numberDate={{ value: 2.6, description: '% semana pasada' }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <HomeWidgetSummary
          title="Alarmas diarias"
          colorFigure={theme.vars.palette.success.main}
          numberDate={{ value: 0, description: '% semana pasada' }}
          total="0"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <HomeWidgetSummary
          title="Hectáreas del terreno"
          colorFigure={theme.vars.palette.secondary.light}
          numberDate={{ description: 'Analizadas por IA' }}
          total="2,276 Hectáreas"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FileDataActivity
          title="Alarmas"
          chart={{
            series: [
              {
                name: 'Semanal',
                categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
                data: [
                  { name: 'Advertencias', data: [20, 34, 48, 65, 37] },
                  { name: 'Alertas', data: [10, 34, 13, 26, 27] },
                ],
              },
              {
                name: 'Mensual',
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                data: [
                  { name: 'Advertencias', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34] },
                  { name: 'Alertas', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34] },
                ],
              },
              {
                name: 'Anual',
                categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                data: [
                  { name: 'Advertencias', data: [24, 34, 32, 56, 77, 48] },
                  { name: 'Alertas', data: [24, 34, 32, 56, 77, 48] },
                ],
              },
            ],
          }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <AnalyticsOrderTimeline
          title="Historial de alarmas"
          sections={[
            {
              id: '1',
              title: 'Sección 1',
              items: [
                {
                  id: '1',
                  type: 'Warning',
                  description: 'Movimiento de personas',
                  time: new Date(),
                },
                {
                  id: '2',
                  type: 'Alert',
                  description: 'Detección de vehículos',
                  time: new Date(),
                },
              ],
            },
            {
              id: '2',
              title: 'Sección 2',
              items: [
                {
                  id: '1',
                  type: 'Warning',
                  description: 'Cambios en la zona',
                  time: new Date(),
                },
                {
                  id: '2',
                  type: 'Alert',
                  description: 'Movimiento de personas',
                  time: new Date(),
                },
              ],
            },
            {
              id: '3',
              title: 'Sección 3',
              items: [
                {
                  id: '1',
                  type: 'Warning',
                  description: 'Cambios en la zona',
                  time: new Date(),
                },
                {
                  id: '2',
                  type: 'Alert',
                  description: 'Movimiento de personas',
                  time: new Date(),
                },
              ],
            },
          ]}
        />
      </Grid>
    </Grid>
  );
}
