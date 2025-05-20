import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useState, useEffect } from 'react';

import { Box, Stack, Button, MenuItem, Typography } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import AlertsCarousel from './AlertsCarousel';
// Importar el store de Zustand
import { useAlertsStore } from './store/useAlertsStore';

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
  // Nuevos elementos de ejemplo
  {
    id: '5',
    title: 'ALERTA',
    number: '35',
    type: 'Cambio en vegetación',
    description: 'Cambio en la vegetación detectado',
    detailedDescription: 'Se ha detectado un cambio en la vegetación en el sector oeste.',
    date: new Date('2024-01-24T10:00:00'),
    latitude: '-34.0620',
    longitude: '118.2400',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:tree',
  },
  {
    id: '6',
    title: 'ALERTA',
    number: '36',
    type: 'Movimiento inusual',
    description: 'Movimiento inusual detectado',
    detailedDescription: 'Se ha detectado un movimiento inusual en el sector sur.',
    date: new Date('2024-01-25T15:45:00'),
    latitude: '-34.0650',
    longitude: '118.2450',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:run',
  },
  {
    id: '7',
    title: 'ALERTA',
    number: '37',
    type: 'Posible intrusión',
    description: 'Posible intrusión detectada',
    detailedDescription: 'Se ha detectado una posible intrusión en el sector norte.',
    date: new Date('2024-01-26T18:30:00'),
    latitude: '-34.0700',
    longitude: '118.2500',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:alert',
  },
  // Alertas para fechas actuales (ayer, hoy, mañana)
  {
    id: '8',
    title: 'ALERTA',
    number: '38',
    type: 'Detección cambio en camino',
    description: 'Nuevo camino detectado en el límite de la propiedad',
    detailedDescription:
      'Se ha identificado la creación de un nuevo sendero en el límite este de la propiedad. Recomendamos revisión.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // Ayer
    latitude: '-34.0680',
    longitude: '118.2550',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:road-variant',
  },
  {
    id: '9',
    title: 'ALERTA',
    number: '39',
    type: 'Movimiento inusual',
    description: 'Actividad sospechosa cerca del almacén',
    detailedDescription:
      'Movimientos no identificados detectados en las proximidades del almacén principal durante la noche.',
    date: new Date(), // Hoy
    latitude: '-34.0710',
    longitude: '118.2580',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:account-alert',
  },
  {
    id: '10',
    title: 'ALERTA',
    number: '39',
    type: 'Movimiento inusual',
    description: 'Actividad sospechosa cerca del almacén',
    detailedDescription:
      'Movimientos no identificados detectados en las proximidades del almacén principal durante la noche.',
    date: new Date(), // Hoy
    latitude: '-34.0710',
    longitude: '118.2580',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:account-alert',
  },
  {
    id: '11',
    title: 'ALERTA',
    number: '40',
    type: 'Posible intrusión',
    description: 'Alerta programada: mantenimiento de cercos',
    detailedDescription:
      'Recordatorio de revisión programada de cercos en el sector norte. Personal autorizado visitará la propiedad.',
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Mañana
    latitude: '-34.0730',
    longitude: '118.2600',
    imageUrl: '/assets/background/mockZone.png',
    icon: 'mdi:fence',
  },
];

export type AlertasSchemaType = zod.infer<typeof AlertasSchema>;

// Modificar el esquema para permitir strings en dateStart y dateEnd
export const AlertasSchema = zod.object({
  dateStart: zod
    .union([zod.date(), zod.string()])
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  dateEnd: zod
    .union([zod.date(), zod.string()])
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  category: zod
    .union([zod.array(zod.string()), zod.string()])
    .transform((val) => (typeof val === 'string' ? [val] : Array.isArray(val) ? val : [])),
  causa: zod
    .union([zod.array(zod.string()), zod.string()])
    .transform((val) => (typeof val === 'string' ? [val] : Array.isArray(val) ? val : [])),
});

type FilterValues = {
  dateStart: Date | null;
  dateEnd: Date | null;
  category: string[];
  causa: string[];
};

const filterAlerts = (alerts: AlertItemProps[], filters: FilterValues): AlertItemProps[] => {
  const { dateStart, dateEnd, category, causa } = filters;

  return alerts.filter((alert) => {
    // Filtrar por fecha
    const alertDate = new Date(alert.date);
    const isWithinDateRange =
      (!dateStart || alertDate >= dateStart) && (!dateEnd || alertDate <= dateEnd);

    // Filtrar por categoría
    const matchesCategory =
      !category.length ||
      category.some((cat) => alert.type.toLowerCase().includes(cat.toLowerCase()));

    // Filtrar por causa
    const matchesCausa =
      !causa.length || causa.some((c) => alert.type.toLowerCase().includes(c.toLowerCase()));

    return isWithinDateRange && matchesCategory && matchesCausa;
  });
};

// Función para agrupar alertas por fecha
const groupAlertsByDate = (alerts: AlertItemProps[]): Record<string, AlertItemProps[]> => {
  const groups: Record<string, AlertItemProps[]> = {};

  alerts.forEach((alert) => {
    const dateKey = new Date(alert.date).toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(alert);
  });

  return groups;
};

// Función para formatear fecha en español
const formatDateInSpanish = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const MosaicView = () => {
  const alertsData = useMemo(() => MOCK_ALERTS, []);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertItemProps[]>(alertsData);
  const [groupedAlerts, setGroupedAlerts] = useState<Record<string, AlertItemProps[]>>({});
  const [selectedAlerts, setSelectedAlerts] = useState<{
    data: AlertItemProps[];
    title: string;
    date?: string;
  } | null>(null);

  // Obtener la acción showDetailView del store
  const { showDetailView } = useAlertsStore();

  // Valores predeterminados del formulario
  const defaultValues: FilterValues = {
    dateStart: null,
    dateEnd: null,
    category: [],
    causa: [],
  };

  const methods = useForm<FilterValues>({
    mode: 'onChange',
    resolver: zodResolver(AlertasSchema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;

  // Procesar y convertir valores del formulario
  const processFormValues = (formValues: any): FilterValues => {
    // Asegurar que las fechas sean objetos Date
    const dateStart = formValues.dateStart ? new Date(formValues.dateStart) : null;
    const dateEnd = formValues.dateEnd ? new Date(formValues.dateEnd) : null;

    // Asegurar que category y causa sean arrays
    const category = Array.isArray(formValues.category)
      ? (formValues.category.filter(Boolean) as string[])
      : typeof formValues.category === 'string' && formValues.category
        ? [formValues.category]
        : [];

    const causa = Array.isArray(formValues.causa)
      ? (formValues.causa.filter(Boolean) as string[])
      : typeof formValues.causa === 'string' && formValues.causa
        ? [formValues.causa]
        : [];

    return { dateStart, dateEnd, category, causa };
  };

  // Observar cambios en el formulario y actualizar los resultados filtrados
  useEffect(() => {
    // Crear una suscripción para observar cambios en el formulario
    const subscription = watch((formValues) => {
      if (!formValues) return;

      const filters = processFormValues(formValues);

      // Aplicar filtros y actualizar estado
      const filtered = filterAlerts(alertsData, filters);
      setFilteredAlerts(filtered);

      // Agrupar por fecha
      const grouped = groupAlertsByDate(filtered);
      setGroupedAlerts(grouped);
    });

    // Iniciar filtro con valores actuales
    const currentValues = methods.getValues();
    const filters = processFormValues(currentValues);

    const filtered = filterAlerts(alertsData, filters);
    setFilteredAlerts(filtered);

    const grouped = groupAlertsByDate(filtered);
    setGroupedAlerts(grouped);

    // Limpiar suscripción al desmontar
    return () => subscription.unsubscribe();
  }, [watch, alertsData]);

  const onSubmit = handleSubmit(async (data) => {
    console.info('Filtros aplicados:', data);
  });

  const handleResetFilters = () => {
    reset(defaultValues);
  };

  // Manejar el clic en "Ver todo" del carrusel
  const handleViewAll = (data: AlertItemProps[], title: string, date?: string) => {
    console.log('MosaicView: Iniciando vista detallada para:', title);
    console.log('MosaicView: Número de alertas:', data.length);

    showDetailView(data, title, date);
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Field.DatePicker name="dateStart" label="Fecha inicio" />
            <Field.DatePicker name="dateEnd" label="Fecha fin" />
            <Field.Select name="category" label="Categoría">
              <MenuItem value="Detección cambio en camino">Detección cambio en camino</MenuItem>
              <MenuItem value="Movimiento inusual">Movimiento inusual</MenuItem>
              <MenuItem value="Cambio en vegetación">Cambio en vegetación</MenuItem>
              <MenuItem value="Posible intrusión">Posible intrusión</MenuItem>
            </Field.Select>
            <Field.Select name="causa" label="Causa">
              <MenuItem value="Detección cambio en camino">Detección cambio en camino</MenuItem>
              <MenuItem value="Movimiento inusual">Movimiento inusual</MenuItem>
              <MenuItem value="Cambio en vegetación">Cambio en vegetación</MenuItem>
              <MenuItem value="Posible intrusión">Posible intrusión</MenuItem>
            </Field.Select>
            <Button variant="contained" color="error" onClick={handleResetFilters}>
              Limpiar Filtros
            </Button>
          </Stack>
        </Form>
      </Box>

      <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.keys(groupedAlerts).length > 0 ? (
          Object.entries(groupedAlerts)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
            .map(([date, alerts]) => (
              <AlertsCarousel
                key={date}
                title={`Alertas del ${formatDateInSpanish(date)}`}
                data={alerts}
                date={formatDateInSpanish(date)}
                onViewAll={handleViewAll}
              />
            ))
        ) : (
          <Typography variant="h6" align="center" sx={{ py: 5 }}>
            No se encontraron alertas con los filtros seleccionados
          </Typography>
        )}
      </Box>
    </>
  );
};

export default MosaicView;
