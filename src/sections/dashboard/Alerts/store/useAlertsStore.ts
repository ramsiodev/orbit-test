import { create } from 'zustand';

import type { AlertItemProps } from '../AlertCardItem';

interface AlertsDetailData {
  data: AlertItemProps[];
  title: string;
  date?: string;
}

interface AlertsState {
  // Estado de visualización
  view: 'mosaic' | 'detail' | 'alert';
  setView: (view: 'mosaic' | 'detail' | 'alert') => void;

  // Datos de la vista detallada
  detailData: AlertsDetailData | null;
  setDetailData: (data: AlertsDetailData | null) => void;

  // Datos del alerta individual
  selectedAlert: AlertItemProps | null;
  setSelectedAlert: (alert: AlertItemProps | null) => void;

  // Estado de carga y errores
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Acciones
  showDetailView: (data: AlertItemProps[], title: string, date?: string) => void;
  showAlertView: (alert: AlertItemProps) => void;
  resetToMosaicView: () => void;
  backToPreviousView: () => void;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  // Estado inicial
  view: 'mosaic',
  detailData: null,
  selectedAlert: null,
  isLoading: false,
  error: null,

  // Setters básicos
  setView: (view) => set({ view }),
  setDetailData: (detailData) => set({ detailData }),
  setSelectedAlert: (selectedAlert) => set({ selectedAlert }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Acción para mostrar la vista detallada
  showDetailView: (data, title, date) => {
    // Marcar como cargando
    set({ isLoading: true, error: null });

    try {
      console.log('AlertsStore: Preparando vista detallada para:', title);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No hay datos válidos para mostrar');
      }

      // Procesar los datos para manejar correctamente las fechas
      const processedData = data.map((item) => {
        // Verificar que el item tiene todos los campos requeridos
        if (!item.id || !item.title || !item.type || item.date === undefined) {
          console.warn('AlertsStore: Item incompleto detectado:', item);
        }

        return {
          ...item,
          // Asegurarnos que las fechas son objetos Date
          date: item.date instanceof Date ? item.date : new Date(item.date),
        };
      });

      // Actualizar el estado con los datos procesados
      set({
        view: 'detail',
        detailData: {
          data: processedData,
          title,
          date,
        },
        isLoading: false,
      });

      console.log('AlertsStore: Vista detallada preparada con', processedData.length, 'alertas');
    } catch (error) {
      console.error('AlertsStore: Error al preparar vista detallada:', error);
      set({
        error: `Error al preparar la vista detallada: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        isLoading: false,
      });
    }
  },

  // Acción para mostrar la vista de alerta individual
  showAlertView: (alert) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      console.log('AlertsStore: Preparando vista de alerta individual:', alert.title);

      if (!alert || !alert.id) {
        throw new Error('Datos de alerta no válidos');
      }

      // Asegurarse que la fecha es un objeto Date
      const processedAlert = {
        ...alert,
        date: alert.date instanceof Date ? alert.date : new Date(alert.date),
      };

      set({
        view: 'alert',
        selectedAlert: processedAlert,
        isLoading: false,
      });

      console.log('AlertsStore: Vista de alerta individual preparada');
    } catch (error) {
      console.error('AlertsStore: Error al preparar vista de alerta:', error);
      set({
        error: `Error al preparar la vista de alerta: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        isLoading: false,
      });
    }
  },

  // Acción para volver a la vista anterior
  backToPreviousView: () => {
    const currentView = get().view;

    if (currentView === 'alert') {
      // Si estamos en la vista de alerta, volvemos a la vista de detalle si hay datos,
      // o a la vista de mosaico si no hay datos de detalle
      if (get().detailData) {
        set({
          view: 'detail',
          selectedAlert: null,
          error: null,
        });
      } else {
        set({
          view: 'mosaic',
          selectedAlert: null,
          error: null,
        });
      }
    } else if (currentView === 'detail') {
      // Si estamos en la vista de detalle, volvemos a la vista de mosaico
      set({
        view: 'mosaic',
        detailData: null,
        error: null,
      });
    }
  },

  // Acción para volver a la vista de mosaico
  resetToMosaicView: () => {
    console.log('AlertsStore: Volviendo a vista mosaico');
    set({
      view: 'mosaic',
      detailData: null,
      selectedAlert: null,
      error: null,
    });
  },
}));
