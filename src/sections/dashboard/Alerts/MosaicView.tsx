import { z as zod } from 'zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Grid, Stack, MenuItem } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import AlertsCarousel from './AlertsCarousel';

import type { AlertItemProps } from './AlertCardItem';

// ----------------------------------------------------------------------

// Datos de ejemplo para el carrusel
const MOCK_ALERTS: AlertItemProps[] = [
  {
    id: '1',
    title: 'ALERTA',
    number: '31',
    type: 'Detección cambio en camino',
    description: 'Se ha registrado movimientos de personas en la zona',
    detailedDescription:
      'Aunque no se han identificado actividades sospechosas hasta el momento, se recomienda que permanezcan atentos.',
    date: new Date('2024-01-20T11:23:00'),
    latitude: '-34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:bike',
  },
  {
    id: '2',
    title: 'ALERTA',
    number: '32',
    type: 'Movimiento inusual',
    description: 'Detectado movimiento inusual en sector norte',
    detailedDescription:
      'Se ha detectado un patrón de movimiento fuera de lo común en el sector norte de la propiedad. Se recomienda verificar.',
    date: new Date('2024-01-21T09:15:00'),
    latitude: '-34.0580',
    longitude: '118.2500',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:person',
  },
  {
    id: '3',
    title: 'ALERTA',
    number: '33',
    type: 'Cambio en vegetación',
    description: 'Detección de cambio significativo en cultivo',
    detailedDescription:
      'El análisis satelital muestra un cambio abrupto en la coloración del cultivo del sector este que podría indicar problemas sanitarios.',
    date: new Date('2024-01-22T14:30:00'),
    latitude: '-34.0600',
    longitude: '118.2200',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:road',
  },
  {
    id: '4',
    title: 'ALERTA',
    number: '34',
    type: 'Posible intrusión',
    description: 'Detección de vehículo no autorizado',
    detailedDescription:
      'Se ha detectado un vehículo no registrado ingresando al perímetro sureste de la propiedad a las 02:15 am.',
    date: new Date('2024-01-23T02:15:00'),
    latitude: '-34.0510',
    longitude: '118.2350',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:car',
  },
];

export type AlertasSchemaType = Zod.infer<typeof AlertasSchema>;

export const AlertasSchema = zod.object({
  date: zod.date().nullable(),
  category: zod.array(zod.string()).min(1, { message: 'Category is required!' }),
});

const MosaicView = () => {
  const alertsData = useMemo(() => MOCK_ALERTS, []);

  const defaultValues = {
    date: null,
    category: [],
    causa: [],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AlertasSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack direction="row" spacing={2}>
            <Field.DatePicker name="date" />
            <Field.Select name="category" label="Categoría">
              <MenuItem value="advertencia">Advertencia</MenuItem>
              <MenuItem value="alerta">Alerta</MenuItem>
            </Field.Select>
            <Field.Select name="causa" label="Causa">
              <MenuItem value="advertencia">Advertencia</MenuItem>
              <MenuItem value="alerta">Alerta</MenuItem>
            </Field.Select>
          </Stack>
        </Form>
      </Grid>

      <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AlertsCarousel
          title="Histórico de Alertas"
          data={alertsData}
          onViewAll={() => console.log('Ver todas las alertas')}
        />
        <AlertsCarousel
          title="Histórico de Alertas"
          data={alertsData}
          onViewAll={() => console.log('Ver todas las alertas')}
        />
      </Box>
    </>
  );
};

export default MosaicView;
