import type { AlertItem, AnalysisFilters } from 'src/store/alertsStore';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Stack, Button, MenuItem, Typography, Pagination } from '@mui/material';

// Importar los stores
import useAlertsStore from 'src/store/alertsStore';
import useSubscriptionStore from 'src/store/subscriptionStore';

import { Form, Field } from 'src/components/hook-form';

import AlertsCarousel from './AlertsCarousel';
import { useAlertsStore as useAlertsViewStore } from './store/useAlertsStore';

import type { AlertItemProps } from './AlertCardItem';

// ----------------------------------------------------------------------

export type AlertasSchemaType = zod.infer<typeof AlertasSchema>;

// Esquema actualizado para trabajar con el API
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
  imageUrl: alert.imageUrl || '/assets/background/mockZone.png',
  icon: alert.icon || 'mdi:alert',
});

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
  const [groupedAlerts, setGroupedAlerts] = useState<Record<string, AlertItemProps[]>>({});
  const [currentFilters, setCurrentFilters] = useState<AnalysisFilters | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<{
    data: AlertItemProps[];
    title: string;
    date?: string;
  } | null>(null);

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
  const { showDetailView } = useAlertsViewStore();

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
      perPage: 20, // Configurar items por página
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

  useEffect(() => {
    if (alerts.length > 0) {
      const transformedAlerts = alerts.map(transformAlertItemToProps);
      const grouped = groupAlertsByDate(transformedAlerts);
      setGroupedAlerts(grouped);
    } else {
      setGroupedAlerts({});
    }
  }, [alerts]);

  const onSubmit = handleSubmit(async (data) => {
    console.info('Filtros aplicados:', data);
  });

  const handleResetFilters = async () => {
    cancelPendingRequests();

    clearAlerts();

    reset(defaultValues);
    setCurrentFilters(null);

    if (selectedSubscription?.polygonId) {
      await applyFilters(defaultValues, 1, false); // Sin debounce para reset
    }
  };

  const handleViewAll = (data: AlertItemProps[], title: string, date?: string) => {
    showDetailView(data, title, date);
  };

  if (!selectedSubscription) {
    return (
      <Box sx={{ mt: 2, p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Selecciona una suscripción para ver las alertas
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Field.DatePicker name="dateStart" label="Fecha inicio" />
            <Field.DatePicker name="dateEnd" label="Fecha fin" />
            <Field.Select name="category" label="Categoría">
              <MenuItem value="ALERTA">Alerta</MenuItem>
              <MenuItem value="ADVERTENCIA">Advertencia</MenuItem>
            </Field.Select>
            <Field.Select name="causa" label="Causa">
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

      <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {isLoading ? (
          <Typography variant="h6" align="center" sx={{ py: 5 }}>
            Cargando alertas...
          </Typography>
        ) : error ? (
          <Typography variant="h6" align="center" color="error" sx={{ py: 5 }}>
            Error: {error}
          </Typography>
        ) : Object.keys(groupedAlerts).length > 0 ? (
          <>
            {Object.entries(groupedAlerts)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, alertsGroup]) => (
                <AlertsCarousel
                  key={date}
                  title={`Alertas del ${formatDateInSpanish(date)}`}
                  data={alertsGroup}
                  date={formatDateInSpanish(date)}
                  onViewAll={handleViewAll}
                />
              ))}

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
          <Typography variant="h6" align="center" sx={{ py: 5 }}>
            No se encontraron alertas con los filtros seleccionados
          </Typography>
        )}
      </Box>
    </>
  );
};

export default MosaicView;
