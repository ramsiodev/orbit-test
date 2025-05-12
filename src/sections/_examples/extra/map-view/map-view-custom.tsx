'use client';

import type { MapProps } from 'src/components/map';

import Image from 'next/image';
import { useState } from 'react';

import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { Map, MapControls } from 'src/components/map';

// Temas/estilos del mapa
const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
};

export function MapViewCustom() {
  const [viewMode, setViewMode] = useState<'map' | 'image'>('map');

  // Fecha y hora actual formateada
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fechaHora = formatDate();

  // Configuración base del mapa
  const baseSettings: MapProps = {
    minZoom: 1,
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 600 }}>
      {/* Fecha y hora en la esquina superior izquierda */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          px: 2,
          py: 0.5,
          fontSize: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        {fechaHora}
      </Paper>

      {/* Vista de mapa o imagen */}
      <Box sx={{ width: '100%', height: '100%', borderRadius: 1, overflow: 'hidden' }}>
        {viewMode === 'map' ? (
          <Map
            {...baseSettings}
            initialViewState={{
              latitude: 19.4326,
              longitude: -99.1332,
              zoom: 15,
            }}
            mapStyle={THEMES.streets}
          >
            {/* Controles de zoom y pantalla completa en la esquina superior derecha */}
            <MapControls
              slotProps={{
                navigation: { position: 'top-right' },
                fullscreen: { position: 'top-right' },
              }}
              hideScale
              hideGeolocate
            />
          </Map>
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
          width: { xs: '80%', sm: '60%', md: '40%', lg: '30%' },
          maxWidth: '300px',
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && setViewMode(value)}
          aria-label="toggle entre mapa e imagen"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            width: '100%',
            '& .MuiToggleButtonGroup-grouped': {
              flex: 1,
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <ToggleButton value="map">Mapa</ToggleButton>
          <ToggleButton value="image">Imagen</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

export default MapViewCustom;
