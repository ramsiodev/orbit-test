import { create } from 'zustand';

import { endpoints, createAxiosInstance } from '../utils/axiosInstance';

// Interfaces para los tipos de datos
export interface AlarmType {
  id: string;
  key: string;
  name: string;
  description: string;
}

export interface AlertItem {
  id: string;
  title: 'ALERT' | 'WARNING';
  number: string;
  type: string;
  description: string;
  detailedDescription: string;
  date: Date;
  latitude: string;
  longitude: string;
  imageUrl?: string;
  icon?: string;
}

export interface AnalysisFilters {
  polygonId: string;
  createdStartDate?: string;
  createdEndDate?: string;
  alarmTypeId?: string;
  level?: 'ALERT' | 'WARNING';
  page?: number;
  perPage?: number;
}

export interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

// Nuevas interfaces para el chart
export interface ChartData {
  name: string;
  data: number[];
}

export interface ChartSeries {
  name: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  categories: string[];
  data: ChartData[];
}

export interface AlarmChartResponse {
  title: string;
  chart: {
    series: ChartSeries[];
  };
}

export type ChartMode = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface AlertsState {
  // Estados
  alarmTypes: AlarmType[];
  alerts: AlertItem[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  lastRequestId: string | null;
  // Nuevo estado para chart
  chartData: AlarmChartResponse | null;
  isLoadingChart: boolean;

  // Acciones
  setError: (error: string | null) => void;
  fetchAlarmTypes: () => Promise<AlarmType[]>;
  fetchAnalysisImages: (filters: AnalysisFilters) => Promise<AlertItem[]>;
  debouncedFetchAnalysisImages: (filters: AnalysisFilters, delay?: number) => Promise<AlertItem[]>;
  clearAlerts: () => void;
  setPage: (page: number, filters: AnalysisFilters) => Promise<void>;
  cancelPendingRequests: () => void;
  resetAndClear: () => void;
  // Nueva acción para chart
  fetchAlarmChart: (polygonId: string, mode: ChartMode) => Promise<AlarmChartResponse | null>;
}

// Variables globales para manejo de debounce y cancelación
let debounceTimeout: NodeJS.Timeout | null = null;
let currentAbortController: AbortController | null = null;

const useAlertsStore = create<AlertsState>((set, get) => ({
  // Estados iniciales
  alarmTypes: [],
  alerts: [],
  isLoading: false,
  error: null,
  pagination: null,
  lastRequestId: null,
  // Nuevo estado para chart
  chartData: null,
  isLoadingChart: false,

  setError: (error: string | null) => {
    set({ error });
  },

  cancelPendingRequests: () => {
    // Cancelar request pendiente
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }

    // Cancelar debounce pendiente
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      debounceTimeout = null;
    }

    set({ isLoading: false });
  },

  fetchAlarmTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(endpoints.alerts.alarmTypes);

      set({
        alarmTypes: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error al obtener tipos de alarma:', error);
      set({
        error: error.response?.data?.message || 'Error al obtener tipos de alarma',
        isLoading: false,
      });
      return [];
    }
  },

  fetchAnalysisImages: async (filters: AnalysisFilters) => {
    // Cancelar requests pendientes
    get().cancelPendingRequests();

    // Generar ID único para este request
    const requestId = `${Date.now()}-${Math.random()}`;

    set({ isLoading: true, error: null, lastRequestId: requestId });

    try {
      // Crear nuevo AbortController para este request
      currentAbortController = new AbortController();

      const axiosInstance = createAxiosInstance();

      // Construir query params
      const params = new URLSearchParams();
      params.append('polygonId', filters.polygonId);

      if (filters.createdStartDate) {
        params.append('createdStartDate', filters.createdStartDate);
      }
      if (filters.createdEndDate) {
        params.append('createdEndDate', filters.createdEndDate);
      }
      if (filters.alarmTypeId) {
        params.append('alarmTypeId', filters.alarmTypeId);
      }
      if (filters.level) {
        params.append('level', filters.level);
      }
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      if (filters.perPage) {
        params.append('perPage', filters.perPage.toString());
      }

      const url = `${endpoints.alerts.analysisImage}?${params.toString()}`;

      console.log(`🚀 Ejecutando request ${requestId}:`, url);

      const response = await axiosInstance.get(url, {
        signal: currentAbortController.signal,
      });

      // Verificar si este es el request más reciente
      const currentRequestId = get().lastRequestId;
      if (currentRequestId !== requestId) {
        console.log(`⏭️ Request ${requestId} descartado (no es el más reciente)`);
        return [];
      }

      // Extraer datos y meta de la respuesta
      const { data, meta } = response.data;

      // Transformar respuesta del API al formato esperado por la UI
      const transformedAlerts: AlertItem[] = [];

      // Procesar cada análisis en data
      data.forEach((analysis: any) => {
        // Cada análisis puede tener múltiples alarmas en alarmGroup.alarms
        if (analysis.alarmGroup && analysis.alarmGroup.alarms) {
          analysis.alarmGroup.alarms.forEach((alarm: any, index: number) => {
            transformedAlerts.push({
              id: alarm.id,
              title: alarm.level as 'ALERT' | 'WARNING',
              number: `${transformedAlerts.length + 1}`.padStart(2, '0'),
              type: 'Tipo desconocido', // Necesitaremos mapear esto con alarmTypes
              description: alarm.description || 'Sin descripción',
              detailedDescription: alarm.description || 'Sin descripción detallada',
              date: new Date(alarm.createdAt),
              latitude: alarm.latitude,
              longitude: alarm.longitude,
              imageUrl:
                alarm.urlImage || analysis.resultImageUrl || '/assets/background/mockZone.png',
              icon: 'mdi:alert',
            });
          });
        }
      });

      // Mapear tipos de alarma si están disponibles
      const { alarmTypes } = get();
      if (alarmTypes.length > 0) {
        data.forEach((analysis: any) => {
          if (analysis.alarmGroup && analysis.alarmGroup.alarms) {
            analysis.alarmGroup.alarms.forEach((alarm: any) => {
              const alarmType = alarmTypes.find((type) => type.id === alarm.alarmTypeId);
              if (alarmType) {
                const alertIndex = transformedAlerts.findIndex((alert) => alert.id === alarm.id);
                if (alertIndex !== -1) {
                  transformedAlerts[alertIndex].type = alarmType.name;
                  transformedAlerts[alertIndex].description = alarmType.description;
                  transformedAlerts[alertIndex].detailedDescription = alarmType.description;
                }
              }
            });
          }
        });
      }

      console.log(`✅ Request ${requestId} completado exitosamente`);

      set({
        alerts: transformedAlerts,
        pagination: meta,
        isLoading: false,
      });

      // Limpiar el AbortController después del éxito
      currentAbortController = null;

      return transformedAlerts;
    } catch (error: any) {
      // No mostrar error si fue cancelado intencionalmente
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log(`🚫 Request ${requestId} cancelado`);
        return [];
      }

      console.error(`❌ Error en request ${requestId}:`, error);

      // Solo actualizar error si este es el request más reciente
      const currentRequestId = get().lastRequestId;
      if (currentRequestId === requestId) {
        set({
          error: error.response?.data?.message || 'Error al obtener análisis de imágenes',
          isLoading: false,
        });
      }

      return [];
    }
  },

  debouncedFetchAnalysisImages: async (filters: AnalysisFilters, delay: number = 300) =>
    new Promise((resolve) => {
      // Cancelar debounce anterior
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      console.log(`⏱️ Debounce iniciado (${delay}ms)`);

      debounceTimeout = setTimeout(async () => {
        console.log('🎯 Ejecutando fetch después de debounce');
        const result = await get().fetchAnalysisImages(filters);
        resolve(result);
        debounceTimeout = null;
      }, delay);
    }),

  setPage: async (page: number, filters: AnalysisFilters) => {
    const newFilters = { ...filters, page };
    await get().fetchAnalysisImages(newFilters);
  },

  clearAlerts: () => {
    console.log('🧹 Limpiando alertas');

    set({
      alerts: [],
      pagination: null,
      error: null,
    });
  },

  // Método para cancelar todo y limpiar completamente
  resetAndClear: () => {
    // Cancelar cualquier request pendiente
    get().cancelPendingRequests();

    console.log('🧹 Reset completo de alertas y cancelando requests');

    set({
      alerts: [],
      pagination: null,
      error: null,
      lastRequestId: null,
    });
  },

  // Nueva acción para chart
  fetchAlarmChart: async (polygonId: string, mode: ChartMode) => {
    set({ isLoadingChart: true, error: null });
    try {
      const axiosInstance = createAxiosInstance();
      // Reemplazar los parámetros en la URL
      const url = endpoints.alerts.chart.replace(':polygonId', polygonId).replace(':mode', mode);

      const response = await axiosInstance.get(url);

      set({
        chartData: response.data,
        isLoadingChart: false,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error al obtener gráfico de alarmas:', error);
      set({
        error: error.response?.data?.message || 'Error al obtener gráfico de alarmas',
        isLoadingChart: false,
      });
      return null;
    }
  },
}));

export default useAlertsStore;
