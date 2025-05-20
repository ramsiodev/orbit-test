import { z as zod } from 'zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
// GroupedAlertsTable.tsx
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Chip,
  Card,
  Paper,
  Stack,
  Table,
  Button,
  Checkbox,
  Collapse,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  createTheme,
  TableContainer,
} from '@mui/material';

import { Image } from 'src/components/image';
import { Form, Field } from 'src/components/hook-form';

import type { AlertItemProps } from './AlertCardItem';

// Datos de ejemplo para la tabla
const MOCK_ALERTS: AlertItemProps[] = [
  {
    id: '1',
    title: 'ADVERTENCIA',
    number: '30',
    type: 'Detección de vehículo',
    description: 'Se ha registrado movimientos de vehículos en la zona',
    detailedDescription:
      'Aunque no se han identificado actividades sospechosas hasta el momento, se recomienda que permanezcan atentos.',
    date: new Date('2024-11-06'),
    latitude: '34.0522',
    longitude: '118.2437',
    icon: 'mdi:car',
    imageUrl: '/assets/images/covers/cover_1.jpg',
  },
  {
    id: '2',
    title: 'ADVERTENCIA',
    number: '31',
    type: 'Detección de construcción',
    description: 'Detectado actividad de construcción',
    detailedDescription: 'Se ha detectado un patrón de actividad de construcción en la propiedad.',
    date: new Date('2024-11-06'),
    latitude: '34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/images/covers/cover_2.jpg',
    icon: 'mdi:home',
  },
  {
    id: '3',
    title: 'ALERTA',
    number: '32',
    type: 'Detección cambio en camino',
    description: 'Cambio significativo detectado en caminos',
    detailedDescription: 'El análisis satelital muestra un cambio en los caminos de la propiedad.',
    date: new Date('2024-11-06'),
    latitude: '34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/images/covers/cover_3.jpg',
    icon: 'mdi:bike',
  },
  {
    id: '4',
    title: 'ALERTA',
    number: '33',
    type: 'Detección de intruso',
    description: 'Posible intruso detectado',
    detailedDescription: 'Se ha detectado movimiento no autorizado en el perímetro.',
    date: new Date('2024-11-05'),
    latitude: '34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/images/covers/cover_4.jpg',
    icon: 'mdi:person',
  },
  {
    id: '5',
    title: 'ALERTA',
    number: '34',
    type: 'Detección de camino',
    description: 'Nuevo camino detectado',
    detailedDescription: 'Se ha detectado un nuevo camino en la propiedad.',
    date: new Date('2024-11-05'),
    latitude: '34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/images/covers/cover_5.jpg',
    icon: 'mdi:road',
  },
  {
    id: '6',
    title: 'ADVERTENCIA',
    number: '35',
    type: 'Detección de vehículo',
    description: 'Vehículo desconocido',
    detailedDescription: 'Se ha detectado un vehículo desconocido en el área.',
    date: new Date('2024-11-05'),
    latitude: '34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/images/covers/cover_6.jpg',
    icon: 'mdi:car',
  },
  {
    id: '7',
    title: 'ADVERTENCIA',
    number: '36',
    type: 'Detección de construcción',
    description: 'Nueva estructura',
    detailedDescription: 'Se ha detectado una nueva estructura en desarrollo.',
    date: new Date('2024-11-05'),
    latitude: '34.0522',
    longitude: '118.2437',
    imageUrl: '/assets/images/covers/cover_7.jpg',
    icon: 'mdi:home',
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
    latitude: '34.0680',
    longitude: '118.2550',
    imageUrl: '/assets/images/covers/cover_8.jpg',
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
    latitude: '34.0710',
    longitude: '118.2580',
    imageUrl: '/assets/images/covers/cover_9.jpg',
    icon: 'mdi:account-alert',
  },
  {
    id: '10',
    title: 'ALERTA',
    number: '40',
    type: 'Posible intrusión',
    description: 'Alerta programada: mantenimiento de cercos',
    detailedDescription:
      'Recordatorio de revisión programada de cercos en el sector norte. Personal autorizado visitará la propiedad.',
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Mañana
    latitude: '34.0730',
    longitude: '118.2600',
    imageUrl: '/assets/images/covers/cover_10.jpg',
    icon: 'mdi:fence',
  },
];

// Schema de validación para los filtros (definido aquí para evitar posibles conflictos)
export const TableAlertasSchema = zod.object({
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

    // Filtrar por categoría (title: ALERTA o ADVERTENCIA)
    const matchesCategory =
      !category.length ||
      category.some((cat) => alert.title.toLowerCase().includes(cat.toLowerCase()));

    // Filtrar por causa (type)
    const matchesCausa =
      !causa.length || causa.some((c) => alert.type.toLowerCase().includes(c.toLowerCase()));

    return isWithinDateRange && matchesCategory && matchesCausa;
  });
};

/* ---------- utilidades de estilo ---------- */

const getStatusColor = (title: string) => (title === 'ALERTA' ? '#FF6F5A' : '#F5B73F');

const typeConfig: Record<string, { border: string; icon: string; color: string }> = {
  camino: {
    border: '#D59BFF',
    color: '#D59BFF',
    icon: 'mdi:bike',
  },
  construcción: {
    border: '#FFC25D',
    color: '#FFC25D',
    icon: 'mdi:home',
  },
  vehículo: {
    border: '#4CD5ED',
    color: '#4CD5ED',
    icon: 'mdi:car',
  },
  intruso: {
    border: '#FF6F5A',
    color: '#FF6F5A',
    icon: 'mdi:person',
  },
};

/* ---------- componentes ---------- */

function AlertRow({ row }: { row: AlertItemProps }) {
  const [open, setOpen] = useState(false);

  // encuentra la config del chip por palabra clave
  const typeKey = Object.keys(typeConfig).find((k) =>
    row.type.toLowerCase().includes(k)
  ) as keyof typeof typeConfig;

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          '&:not(:last-child)': { borderBottom: '2px solid #0E1A2F' },
        }}
      >
        {/* avatar + título */}
        <TableCell sx={{ border: 0, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image src={row.imageUrl} sx={{ width: 48, height: 48, borderRadius: 1, mr: 2 }} />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">{`#${row.number}`}</Typography>
              <Typography variant="caption" color="text.secondary">
                {`${row.latitude}° N, ${row.longitude}° W`}
              </Typography>
            </Stack>
          </Box>
        </TableCell>

        {/* status chip */}
        <TableCell sx={{ border: 0, width: 160 }}>
          <Chip
            size="small"
            label={row.title}
            sx={{
              bgcolor: getStatusColor(row.title),
              color: '#1C252E !important',
              textTransform: 'capitalize !important',
              fontWeight: 600,
              pointerEvents: 'none', // Deshabilitar hover
            }}
          />
        </TableCell>

        {/* tipo chip */}
        <TableCell sx={{ border: 0 }}>
          <Chip
            size="small"
            icon={<Icon icon={typeConfig[typeKey]?.icon || 'mdi:alert'} />}
            label={row.type}
            sx={{
              color: `${typeConfig[typeKey]?.color || '#9BA4B5'} !important`,
              border: `1px solid ${typeConfig[typeKey]?.border || '#9BA4B5'}`,
              bgcolor: 'transparent',
              '.MuiChip-icon': { color: typeConfig[typeKey]?.color || '#9BA4B5' },
              pointerEvents: 'none', // Deshabilitar hover
            }}
          />
        </TableCell>

        {/* desplegable de detalle */}
        <TableCell align="right" sx={{ border: 0, pr: 3 }}>
          <IconButton size="small" onClick={() => setOpen((p) => !p)}>
            <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* detalle */}
      <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <TableCell colSpan={4} sx={{ border: 0, py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Detalles
              </Typography>
              <Typography variant="body2">{row.detailedDescription}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function GroupRow({ label, alerts }: { label: string; alerts: AlertItemProps[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: '#0E1A2F',
          '&:not(:first-of-type)': {
            borderTop: '1px dashed rgba(255,255,255,0.08)',
          },
        }}
      >
        <TableCell padding="checkbox" sx={{ border: 0 }}>
          <Checkbox sx={{ p: 0.5 }} />
        </TableCell>

        {/* fecha / hoy / ayer */}
        <TableCell sx={{ border: 0, fontWeight: 600 }}>{label}</TableCell>

        {/* contador */}
        <TableCell sx={{ border: 0, fontWeight: 600, width: 60 }}>
          {alerts.length.toString().padStart(2, '0')}
        </TableCell>

        {/* acciones */}
        <TableCell align="right" sx={{ border: 0 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton
              sx={{
                bgcolor: '#4478FF',
                width: 48,
                height: 36,
                borderRadius: 1,
                '&:hover': { bgcolor: '#4C80FF' },
              }}
            >
              <Icon icon="mdi:cart" color="#fff" />
            </IconButton>
            <IconButton onClick={() => setOpen((p) => !p)}>
              <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} color="#9BA4B5" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* lista de alertas */}
      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="medium">
              <TableBody>
                {alerts.map((a) => (
                  <AlertRow key={a.id} row={a} />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* ---------- tabla principal ---------- */

export default function GroupedAlertsTable() {
  const alertsData = useMemo(() => MOCK_ALERTS, []);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertItemProps[]>(alertsData);
  const [groupedAlerts, setGroupedAlerts] = useState<Record<string, AlertItemProps[]>>({});

  // Valores predeterminados del formulario
  const defaultValues: FilterValues = {
    dateStart: null,
    dateEnd: null,
    category: [],
    causa: [],
  };

  const methods = useForm<FilterValues>({
    mode: 'onChange',
    resolver: zodResolver(TableAlertasSchema),
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

  // Actualizar grupos según filtro
  const updateGroups = (alerts: AlertItemProps[]) => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86_400_000);
    const fmt = (d: Date) =>
      d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });

    const grouped = alerts.reduce<Record<string, AlertItemProps[]>>((acc, a) => {
      const key =
        fmt(a.date) === fmt(today) ? 'HOY' : fmt(a.date) === fmt(yesterday) ? 'AYER' : fmt(a.date);
      acc[key] ||= [];
      acc[key].push(a);
      return acc;
    }, {});

    setGroupedAlerts(grouped);
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

      // Actualizar grupos
      updateGroups(filtered);
    });

    // Iniciar filtro con valores actuales
    const currentValues = methods.getValues();
    const filters = processFormValues(currentValues);

    const filtered = filterAlerts(alertsData, filters);
    setFilteredAlerts(filtered);

    // Inicializar grupos
    updateGroups(filtered);

    // Limpiar suscripción al desmontar
    return () => subscription.unsubscribe();
  }, [watch, alertsData]);

  const onSubmit = handleSubmit(async (data) => {
    console.info('Filtros aplicados:', data);
  });

  const handleResetFilters = () => {
    reset(defaultValues);
  };

  /* ——— tema oscuro local (puedes omitir si ya tienes theme global) ——— */
  const dark = createTheme({
    palette: {
      mode: 'dark',
      background: { default: '#0B1324', paper: '#0B1324' },
      text: { primary: '#E6ECF4', secondary: '#9BA4B5' },
    },
    typography: { fontFamily: 'Inter, sans-serif' },
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mt: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Field.DatePicker name="dateStart" label="Fecha inicio" />
            <Field.DatePicker name="dateEnd" label="Fecha fin" />
            <Field.Select name="category" label="Estado">
              <MenuItem value="ALERTA">Alerta</MenuItem>
              <MenuItem value="ADVERTENCIA">Advertencia</MenuItem>
            </Field.Select>
            <Field.Select name="causa" label="Tipo">
              <MenuItem value="Detección cambio en camino">Detección cambio en camino</MenuItem>
              <MenuItem value="Movimiento inusual">Movimiento inusual</MenuItem>
              <MenuItem value="Detección de vehículo">Detección de vehículo</MenuItem>
              <MenuItem value="Detección de construcción">Detección de construcción</MenuItem>
              <MenuItem value="Detección de intruso">Detección de intruso</MenuItem>
              <MenuItem value="Posible intrusión">Posible intrusión</MenuItem>
            </Field.Select>
            <Button variant="contained" color="error" onClick={handleResetFilters}>
              Limpiar Filtros
            </Button>
          </Stack>
        </Form>
      </Box>

      {Object.keys(groupedAlerts).length > 0 ? (
        <Card sx={{ mt: 3 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="medium">
              <TableBody>
                {Object.entries(groupedAlerts)
                  .sort(([a, _], [b, __]) => {
                    // Ordenar con HOY y AYER primero
                    if (a === 'HOY') return -1;
                    if (b === 'HOY') return 1;
                    if (a === 'AYER') return -1;
                    if (b === 'AYER') return 1;
                    // Luego ordenar por fecha descendente
                    return (
                      new Date(b.split('/').reverse().join('-')).getTime() -
                      new Date(a.split('/').reverse().join('-')).getTime()
                    );
                  })
                  .map(([label, alerts]) => (
                    <GroupRow key={label} label={label} alerts={alerts} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Box sx={{ mt: 3, p: 5, textAlign: 'center' }}>
          <Typography variant="h6">
            No se encontraron alertas con los filtros seleccionados
          </Typography>
        </Box>
      )}
    </Box>
  );
}
