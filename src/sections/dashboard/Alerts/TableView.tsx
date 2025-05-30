import type { AlertItem, AnalysisFilters } from 'src/store/alertsStore';

import { z as zod } from 'zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
// GroupedAlertsTable.tsx
import { useState, useEffect } from 'react';
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
  Pagination,
  createTheme,
  TableContainer,
} from '@mui/material';

// Importar los stores
import useAlertsStore from 'src/store/alertsStore';
import useSubscriptionStore from 'src/store/subscriptionStore';

import { Image } from 'src/components/image';
import { Form, Field } from 'src/components/hook-form';

import type { AlertItemProps } from './AlertCardItem';

// Esquema de validación para los filtros (actualizado)
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

// Función para transformar AlertItem a AlertItemProps para compatibilidad
const transformAlertItemToProps = (alert: AlertItem): AlertItemProps => ({
  id: alert.id,
  title: alert.title === 'ALERT' ? 'ALERTA' : 'ADVERTENCIA',
  number: alert.number,
  type: alert.type,
  description: alert.description,
  detailedDescription: alert.detailedDescription,
  date: alert.date,
  latitude: alert.latitude,
  longitude: alert.longitude,
  imageUrl: alert.imageUrl || '/assets/images/covers/cover_1.jpg',
  icon: alert.icon || 'mdi:alert',
});

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
  const [groupedAlerts, setGroupedAlerts] = useState<Record<string, AlertItemProps[]>>({});
  const [currentFilters, setCurrentFilters] = useState<AnalysisFilters | null>(null);

  // Stores
  const {
    alerts,
    alarmTypes,
    isLoading,
    error,
    pagination,
    fetchAlarmTypes,
    debouncedFetchAnalysisImages,
    clearAlerts,
    setPage,
    cancelPendingRequests,
  } = useAlertsStore();

  const { selectedSubscription } = useSubscriptionStore();

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

  // Cargar tipos de alarma al montar el componente
  useEffect(() => {
    fetchAlarmTypes();
  }, [fetchAlarmTypes]);

  // Procesar y convertir valores del formulario
  const processFormValues = (formValues: any): FilterValues => {
    const dateStart = formValues.dateStart ? new Date(formValues.dateStart) : null;
    const dateEnd = formValues.dateEnd ? new Date(formValues.dateEnd) : null;

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

  // Función para aplicar filtros y obtener datos del API
  const applyFilters = async (
    filters: FilterValues,
    page: number = 1,
    useDebounce: boolean = true
  ) => {
    if (!selectedSubscription?.polygonId) {
      console.warn('No hay suscripción seleccionada');
      return;
    }

    const apiFilters: AnalysisFilters = {
      polygonId: selectedSubscription.polygonId,
      page,
      perPage: 15, // Menos items por página para tabla
    };

    // Convertir fechas a string ISO si existen
    if (filters.dateStart) {
      apiFilters.createdStartDate = filters.dateStart.toISOString();
    }
    if (filters.dateEnd) {
      apiFilters.createdEndDate = filters.dateEnd.toISOString();
    }

    // Convertir categorías (ALERT/WARNING) al formato del API
    if (filters.category.length > 0) {
      const categoryMapping: Record<string, 'ALERT' | 'WARNING'> = {
        ALERTA: 'ALERT',
        ADVERTENCIA: 'WARNING',
      };
      const mappedCategory = categoryMapping[filters.category[0]];
      if (mappedCategory) {
        apiFilters.level = mappedCategory;
      }
    }

    // Convertir causas a alarmTypeId
    if (filters.causa.length > 0) {
      const selectedAlarmType = alarmTypes.find((type) =>
        filters.causa.some((causa) => type.name === causa)
      );
      if (selectedAlarmType) {
        apiFilters.alarmTypeId = selectedAlarmType.id;
      }
    }

    setCurrentFilters(apiFilters);

    // Usar debounce para cambios de formulario, fetch directo para paginación
    if (useDebounce) {
      await debouncedFetchAnalysisImages(apiFilters);
    } else {
      // Para casos donde no queremos debounce (como paginación)
      const { fetchAnalysisImages } = useAlertsStore.getState();
      await fetchAnalysisImages(apiFilters);
    }
  };

  // Manejar cambio de página (sin debounce)
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    if (currentFilters) {
      setPage(page, currentFilters);
    }
  };

  // Actualizar grupos según filtro
  const updateGroups = (alertsData: AlertItemProps[]) => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86_400_000);
    const fmt = (d: Date) =>
      d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });

    const grouped = alertsData.reduce<Record<string, AlertItemProps[]>>((acc, a) => {
      const key =
        fmt(a.date) === fmt(today) ? 'HOY' : fmt(a.date) === fmt(yesterday) ? 'AYER' : fmt(a.date);
      acc[key] ||= [];
      acc[key].push(a);
      return acc;
    }, {});

    setGroupedAlerts(grouped);
  };

  // Observar cambios en el formulario y actualizar los resultados
  useEffect(() => {
    const subscription = watch((formValues) => {
      if (!formValues) return;

      const filters = processFormValues(formValues);
      applyFilters(filters, 1, true); // Con debounce para cambios de formulario
    });

    // Aplicar filtros iniciales si hay una suscripción seleccionada
    if (selectedSubscription?.polygonId && alarmTypes.length > 0) {
      const currentValues = methods.getValues();
      const filters = processFormValues(currentValues);
      applyFilters(filters, 1, false); // Sin debounce para carga inicial
    }

    return () => subscription.unsubscribe();
  }, [watch, selectedSubscription?.polygonId, alarmTypes]);

  // Actualizar grupos cuando cambian las alertas
  useEffect(() => {
    if (alerts.length > 0) {
      const transformedAlerts = alerts.map(transformAlertItemToProps);
      updateGroups(transformedAlerts);
    } else {
      setGroupedAlerts({});
    }
  }, [alerts]);

  const onSubmit = handleSubmit(async (data) => {
    console.info('Filtros aplicados:', data);
  });

  const handleResetFilters = async () => {
    console.log('🧹 Iniciando reset de filtros en TableView');

    // 1. Cancelar cualquier request pendiente
    cancelPendingRequests();

    // 2. Limpiar estado de alertas
    clearAlerts();

    // 3. Resetear formulario
    reset(defaultValues);
    setCurrentFilters(null);

    // 4. Hacer nueva llamada con filtros limpios si hay una suscripción seleccionada
    if (selectedSubscription?.polygonId) {
      console.log('🔄 Cargando todas las alertas sin filtros');
      await applyFilters(defaultValues, 1, false); // Sin debounce para reset
    }

    console.log('✅ Reset completado en TableView');
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

  if (!selectedSubscription) {
    return (
      <Box sx={{ mt: 3, p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Selecciona una suscripción para ver las alertas
        </Typography>
      </Box>
    );
  }

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
              {alarmTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Field.Select>
            <Button variant="text" color="primary" onClick={handleResetFilters}>
              Limpiar Filtros
            </Button>
          </Stack>
        </Form>
      </Box>

      {isLoading ? (
        <Box sx={{ mt: 3, p: 5, textAlign: 'center' }}>
          <Typography variant="h6">Cargando alertas...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 3, p: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        </Box>
      ) : Object.keys(groupedAlerts).length > 0 ? (
        <>
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
                    .map(([label, alertsGroup]) => (
                      <GroupRow key={label} label={label} alerts={alertsGroup} />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Paginación */}
          {pagination && pagination.lastPage > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Mostrando {alerts.length} de {pagination.total} alertas
                </Typography>
                <Pagination
                  count={pagination.lastPage}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Box>
          )}
        </>
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
