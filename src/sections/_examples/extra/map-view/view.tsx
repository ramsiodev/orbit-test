'use client';

import type { MapProps } from 'src/components/map';
import type { Theme, SxProps } from '@mui/material/styles';

import Image from 'next/image';
import { useState } from 'react';

import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { cities as CITIES } from 'src/_mock/_map/cities';
import { countries as COUNTRIES } from 'src/_mock/_map/countries';

import { Map } from 'src/components/map';

import { MapHeatmap } from './heatmap';
import { MapClusters } from './map-clusters';
import { MapInteraction } from './interaction';
import { MapSideBySide } from './side-by-side';
import { MapChangeTheme } from './change-theme';
import { MapMarkersPopups } from './map-markers-popups';
import { MapDraggableMarkers } from './draggable-markers';
import { MapViewportAnimation } from './viewport-animation';
import { MapGeoJSONAnimation } from './map-geo-json-animation';
import { MapHighlightByFilter } from './map-highlight-by-filter';

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

const DEMO_COMPONENTS = [
  {
    name: 'Change theme',
    component: <MapChangeTheme {...baseSettings} themes={THEMES} sx={mapStyles} />,
  },
  {
    name: 'Markers & popups',
    component: (
      <MapMarkersPopups {...baseSettings} data={COUNTRIES} mapStyle={THEMES.light} sx={mapStyles} />
    ),
  },
  {
    name: 'Draggable markers',
    component: <MapDraggableMarkers {...baseSettings} mapStyle={THEMES.light} sx={mapStyles} />,
  },
  {
    name: 'Geojson animation',
    component: (
      <MapGeoJSONAnimation {...baseSettings} mapStyle={THEMES.satelliteStreets} sx={mapStyles} />
    ),
  },
  {
    name: 'Clusters',
    component: <MapClusters {...baseSettings} mapStyle={THEMES.light} sx={mapStyles} />,
  },
  {
    name: 'Interaction',
    component: <MapInteraction {...baseSettings} mapStyle={THEMES.light} sx={mapStyles} />,
  },
  {
    name: 'Viewport animation',
    component: (
      <MapViewportAnimation
        {...baseSettings}
        data={CITIES.filter((city) => city.state === 'Texas')}
        mapStyle={THEMES.light}
        sx={mapStyles}
      />
    ),
  },
  {
    name: 'Highlight by filter',
    component: <MapHighlightByFilter {...baseSettings} mapStyle={THEMES.light} sx={mapStyles} />,
  },
  {
    name: 'Heatmap',
    component: <MapHeatmap {...baseSettings} mapStyle={THEMES.light} sx={mapStyles} />,
  },
  {
    name: 'Side by side',
    component: <MapSideBySide {...baseSettings} sx={mapStyles} />,
  },
];

// ----------------------------------------------------------------------

export function MapView() {
  const [viewMode, setViewMode] = useState<'map' | 'image'>('map');

  // Fecha y hora de ejemplo
  const fechaHora = '20 de Enero 2024, 11:23am';

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 600 }}>
      {/* Fecha y hora en la esquina superior izquierda */}
      <Paper
        elevation={3}
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10, px: 2, py: 0.5, fontSize: 14 }}
      >
        {fechaHora}
      </Paper>

      {/* Controles en la esquina superior derecha */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <button style={{ marginBottom: 4, fontSize: 18, width: 32, height: 32 }}>+</button>
        <button style={{ marginBottom: 4, fontSize: 18, width: 32, height: 32 }}>-</button>
        <button style={{ fontSize: 18, width: 32, height: 32 }}>⤢</button>
      </Box>

      {/* Vista de mapa o imagen */}
      <Box sx={{ width: '100%', height: '100%' }}>
        {viewMode === 'map' ? (
          <Map
            initialViewState={{
              latitude: 19.4326,
              longitude: -99.1332,
              zoom: 15,
            }}
            mapStyle={THEMES.streets}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
              src="/static/mock/mapa_ejemplo.jpg"
              alt="Imagen"
              layout="fill"
              objectFit="cover"
            />
          </Box>
        )}
      </Box>

      {/* Toggle entre mapa e imagen en la parte inferior */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && setViewMode(value)}
          aria-label="toggle entre mapa e imagen"
        >
          <ToggleButton value="map">Mapa</ToggleButton>
          <ToggleButton value="image">Imagen</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
