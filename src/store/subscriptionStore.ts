/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { endpoints, createAxiosInstance } from '../utils/axiosInstance';

// Interfaces para los tipos de datos
interface Geometry {
  type: string;
  coordinates: number[][][];
}

interface Properties {
  name: string;
  km2: number;
  hectares: number;
  newArea?: {
    km2: number;
    hectares: number;
  };
  description?: string;
}

interface PolygonStatus {
  isSafe: boolean;
  changePercentage: number;
  dailyAlarms: number;
  weeklyChange: number;
  monthlyAlarms: number;
  lastMonthChange: number;
  areaHectares: number;
  averageStatusLabel: string;
  monthlyTotalAlarms: number;
}

interface Polygon {
  id: string;
  name: string;
  type: string;
  properties: Properties;
  geometry: Geometry;
  processedGeometry5km?: Geometry;
  processedGeometry25km?: Geometry;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userEmail: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'PENDING';
  billingCycle: 'MONTHLY' | 'YEARLY';
  price: number;
  startDate: string;
  endDate: string;
  planId: string;
  polygonId: string;
  createdAt: string;
  updatedAt: string;
  polygons?: Polygon;
}

interface CreateSubscriptionParams {
  name: string;
  userEmail?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  billingCycle: 'MONTHLY' | 'YEARLY';
  price: number;
  startDate?: string;
  endDate?: string;
  planId: string;
  polygonId: string;
}

interface UpdateSubscriptionParams {
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'PENDING';
  billingCycle?: 'MONTHLY' | 'YEARLY';
  price?: number;
  startDate?: string;
  endDate?: string;
  planId?: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  selectedSubscription: Subscription | null;
  polygonStatus: PolygonStatus | null;

  // Acciones
  setSelectedSubscription: (subscription: Subscription | null) => void;
  setError: (error: string | null) => void;
  fetchSubscriptions: () => Promise<Subscription[]>;
  fetchSubscriptionById: (id: string) => Promise<Subscription | null>;
  createSubscription: (params: CreateSubscriptionParams) => Promise<Subscription | null>;
  updateSubscription: (
    id: string,
    params: UpdateSubscriptionParams
  ) => Promise<Subscription | null>;
  deleteSubscription: (id: string) => Promise<boolean>;
  findStatus: (polygonId: string) => Promise<PolygonStatus | null>;
}

const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      isLoading: false,
      error: null,
      selectedSubscription: null,
      polygonStatus: null,

      setSelectedSubscription: (subscription: Subscription | null) => {
        set({ selectedSubscription: subscription });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      fetchSubscriptions: async () => {
        set({ isLoading: true, error: null });
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.get(endpoints.subscription.findAll);

          set({
            subscriptions: response.data,
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          console.error('Error al obtener suscripciones:', error);
          set({
            error: error.response?.data?.message || 'Error al obtener suscripciones',
            isLoading: false,
          });
          return [];
        }
      },

      fetchSubscriptionById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.get(endpoints.subscription.findById(id));

          // Actualizar la suscripción seleccionada
          set({
            selectedSubscription: response.data,
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          console.error(`Error al obtener suscripción con ID ${id}:`, error);
          set({
            error: error.response?.data?.message || `Error al obtener suscripción con ID ${id}`,
            isLoading: false,
          });
          return null;
        }
      },

      createSubscription: async (params: CreateSubscriptionParams) => {
        set({ isLoading: true, error: null });
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.post(endpoints.subscription.create, params);

          // Actualizar la lista de suscripciones
          const currentSubscriptions = get().subscriptions;
          set({
            subscriptions: [...currentSubscriptions, response.data],
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          console.error('Error al crear suscripción:', error);
          set({
            error: error.response?.data?.message || 'Error al crear suscripción',
            isLoading: false,
          });
          return null;
        }
      },

      updateSubscription: async (id: string, params: UpdateSubscriptionParams) => {
        set({ isLoading: true, error: null });
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.patch(endpoints.subscription.update(id), params);

          // Actualizar la lista de suscripciones
          const currentSubscriptions = get().subscriptions;
          const updatedSubscriptions = currentSubscriptions.map((subscription) =>
            subscription.id === id ? response.data : subscription
          );

          set({
            subscriptions: updatedSubscriptions,
            selectedSubscription: response.data,
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          console.error(`Error al actualizar suscripción con ID ${id}:`, error);
          set({
            error: error.response?.data?.message || `Error al actualizar suscripción con ID ${id}`,
            isLoading: false,
          });
          return null;
        }
      },

      deleteSubscription: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const axiosInstance = createAxiosInstance();
          await axiosInstance.delete(endpoints.subscription.delete(id));

          // Actualizar la lista de suscripciones
          const currentSubscriptions = get().subscriptions;
          const filteredSubscriptions = currentSubscriptions.filter(
            (subscription) => subscription.id !== id
          );

          set({
            subscriptions: filteredSubscriptions,
            selectedSubscription: null,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          console.error(`Error al eliminar suscripción con ID ${id}:`, error);
          set({
            error: error.response?.data?.message || `Error al eliminar suscripción con ID ${id}`,
            isLoading: false,
          });
          return false;
        }
      },

      findStatus: async (polygonId: string) => {
        set({ isLoading: true, error: null });
        try {
          const axiosInstance = createAxiosInstance();
          const url = endpoints.subscription.findStatus.replace(':polygonId', polygonId);
          const response = await axiosInstance.get(url);

          set({
            polygonStatus: response.data,
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          console.error(`Error al obtener estado del polígono con ID ${polygonId}:`, error);
          set({
            error:
              error.response?.data?.message ||
              `Error al obtener estado del polígono con ID ${polygonId}`,
            isLoading: false,
          });
          return null;
        }
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Solo persistimos algunos datos, no el estado completo
        const { isLoading, error, polygonStatus, ...rest } = state;
        return rest;
      },
    }
  )
);

export default useSubscriptionStore;
