'use client';

import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material/styles';
import type { MapProps } from 'react-map-gl/mapbox';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { Box, Alert, Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TableView from './TableView';
import CompareView from './CompareView';
import ImageTimelinePlayer from './ImageTimelinePlayer';

// ----------------------------------------------------------------------

// Esquema de filtros de fecha (similar a MosaicView)
const HistoricalFiltersSchema = zod.object({
  dateStart: zod
    .union([zod.date(), zod.string()])
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  dateEnd: zod
    .union([zod.date(), zod.string()])
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
});

type FilterValues = {
  dateStart: Date | null;
  dateEnd: Date | null;
};

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

export function DashboardHistoricalView() {
  const [currentRole, setCurrentRole] = useState('comparar');

  // Valores predeterminados del formulario
  const defaultValues: FilterValues = {
    dateStart: new Date('2024-10-10'),
    dateEnd: new Date('2024-10-12'),
  };

  const methods = useForm<FilterValues>({
    mode: 'onChange',
    resolver: zodResolver(HistoricalFiltersSchema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;

  const handleChangeRole = useCallback(
    (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
      if (newRole !== null) {
        setCurrentRole(newRole);
      }
    },
    []
  );

  const theme = useTheme();

  // Validar si la fecha final es futura
  const watchedValues = watch();
  const isEndDateFuture = watchedValues.dateEnd && new Date(watchedValues.dateEnd) > new Date();
  const hasDateError = isEndDateFuture;

  // Función para manejar el reset de filtros
  const handleResetFilters = () => {
    reset(defaultValues);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.info('Filtros aplicados:', data);
  });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <CustomBreadcrumbs
          heading="Histórico"
          subheading="Puedes comparar dos imágenes satelitales para notar cambios o acceder al listado de tu historial."
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
                <ToggleButton value="comparar" aria-label="Comparar">
                  Comparar
                </ToggleButton>
                <ToggleButton value="listado" aria-label="Listado">
                  Listado
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          }
        />

        {currentRole === 'comparar' && (
          <>
            <Box sx={{ mt: 2, mb: 3 }}>
              <Form methods={methods} onSubmit={onSubmit}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                  <Field.DatePicker name="dateStart" label="Fecha inicio" />
                  <Field.DatePicker name="dateEnd" label="Fecha fin" />
                  <Button variant="text" color="primary" onClick={handleResetFilters}>
                    Limpiar Filtros
                  </Button>
                </Stack>
              </Form>

              {hasDateError && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    backgroundColor: 'rgba(255, 86, 48, 0.1)',
                    border: '1px solid rgba(255, 86, 48, 0.3)',
                    '& .MuiAlert-message': {
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  No se pudo realizar la comparación porque una de las fechas ingresadas corresponde
                  a un período que aún no ha sucedido
                </Alert>
              )}
            </Box>

            {!hasDateError && (
              <>
                <CompareView
                  leftImage="/assets/background/Img_Cover_M.3.png"
                  rightImage="/assets/background/Img_Cover.png"
                />
                <ImageTimelinePlayer
                  images={[
                    '/assets/background/Img_Cover_M.3.png',
                    '/assets/background/Img_Cover.png',
                    '/assets/background/Img_Cover_M.3.png',
                    '/assets/background/Img_Cover.png',
                    '/assets/background/Img_Cover_M.3.png',
                  ]}
                  title="Timeline de cambios"
                  autoplayDelay={1500}
                />
              </>
            )}
          </>
        )}
        {currentRole === 'listado' && <TableView />}
      </Grid>
    </Grid>
  );
}
