import { z as zod } from 'zod';
import { Icon } from '@iconify/react';
// GroupedAlertsTable.tsx
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Chip,
  Card,
  Grid,
  Paper,
  Stack,
  Table,
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

import { AlertasSchema } from '../Alerts/MosaicView';

import type { AlertItemProps } from './AlertCardItem';

const alertasSchema = zod.object({
  date: zod.date().nullable(),
  category: zod.array(zod.string()),
});

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
];

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
            icon={<Icon icon={typeConfig[typeKey].icon} />}
            label={row.type}
            sx={{
              color: `${typeConfig[typeKey].color} !important`,
              border: `1px solid ${typeConfig[typeKey].border}`,
              bgcolor: 'transparent',
              '.MuiChip-icon': { color: typeConfig[typeKey].color },
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
  // agrupar por HOY / AYER / fecha
  const grouped = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86_400_000);
    const fmt = (d: Date) =>
      d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });

    return MOCK_ALERTS.reduce<Record<string, AlertItemProps[]>>((acc, a) => {
      const key =
        fmt(a.date) === fmt(today) ? 'HOY' : fmt(a.date) === fmt(yesterday) ? 'AYER' : fmt(a.date);
      acc[key] ||= [];
      acc[key].push(a);
      return acc;
    }, {});
  }, []);

  /* ——— tema oscuro local (puedes omitir si ya tienes theme global) ——— */
  const dark = createTheme({
    palette: {
      mode: 'dark',
      background: { default: '#0B1324', paper: '#0B1324' },
      text: { primary: '#E6ECF4', secondary: '#9BA4B5' },
    },
    typography: { fontFamily: 'Inter, sans-serif' },
  });

  const defaultValues = {
    date: null,
    category: [],
  };

  const methods = useForm<any>({
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
    <Box sx={{ mt: 3 }}>
      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack direction="row" spacing={2}>
            <Field.DatePicker name="date" />
            <Field.Select name="Estado" label="Estado">
              <MenuItem value="advertencia">Advertencia</MenuItem>
              <MenuItem value="alerta">Alerta</MenuItem>
            </Field.Select>
          </Stack>
        </Form>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="medium">
            <TableBody>
              {Object.entries(grouped).map(([label, alerts]) => (
                <GroupRow key={label} label={label} alerts={alerts} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
