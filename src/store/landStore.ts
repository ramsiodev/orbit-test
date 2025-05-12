/* eslint-disable @typescript-eslint/no-unused-vars */
// import type { ILandItem, ILandStatusOption } from 'src/types/land';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// import { endpoints, createAxiosInstance } from 'src/utils/axios';

interface LandState {
  status_options: any[];
  lands: any[];
  filters: FetchLandsParams;
  error: string | null;
  isLoading: boolean;
  landSelected: any | null;
  setLandSelected: (land: any | null) => void;
  setFilters: (filters: FetchLandsParams) => void;
  setError: (error: string) => void;
  fetchStatusOptions: () => Promise<void>;
  fetchLands: (params?: FetchLandsParams) => Promise<void>;
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  editLand: (params: LandParams) => Promise<void>;
}

interface LandParams {
  avatar?: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  price?: number;
  maxParticipants?: number;
  status?: string;
  leagueId?: string;
  phase?: string;
  isRepechage?: boolean;
}

interface FetchLandsParams {
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
  createdStartDate?: string;
  createdEndDate?: string;
}

const useLandStore = create<LandState>()(
  persist(
    (set) => ({
      status_options: [],
      lands: [],
      landSelected: null,
      filters: {
        search: '',
        status: 'All',
        page: 1,
        perPage: 10,
        createdStartDate: '',
        createdEndDate: '',
      },
      error: null,
      isLoading: false,
      openEditDialog: false,
      setOpenEditDialog: (open: boolean) => set({ openEditDialog: open }),

      setFilters: (filters: FetchLandsParams) => {
        set({ filters });
      },

      setLandSelected: (land: any | null) => {
        set({ landSelected: land });
      },

      fetchStatusOptions: async () => {
        set({ isLoading: true, error: null });
        try {
          // const axiosInstance = createAxiosInstance();
          // const response = await axiosInstance.get(endpoints.lands.count_status);
          // Simulamos una respuesta
          const mockResponse = {
            data: {
              total: 100,
              status: [
                { name: 'Active', total: 50, status: 'active' },
                { name: 'Inactive', total: 50, status: 'inactive' },
              ],
            },
          };
          set({
            status_options: [
              { name: 'All', total: mockResponse.data.total, status: 'All' },
              ...mockResponse.data.status,
            ],
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Error fetching filters',
            isLoading: false,
          });
        }
      },

      fetchLands: async ({
        search,
        status,
        page,
        perPage,
        createdStartDate,
        createdEndDate,
      }: FetchLandsParams = {}) => {
        set({ isLoading: true, error: null });
        try {
          // const axiosInstance = createAxiosInstance();

          const params = new URLSearchParams();

          if (search) params.append('search', search);
          if (status && status !== 'All') params.append('status', status);
          if (page) params.append('page', page.toString());
          if (perPage) params.append('perPage', perPage.toString());
          if (createdStartDate) params.append('createdStartDate', createdStartDate);
          if (createdEndDate) params.append('createdEndDate', createdEndDate);

          set({
            filters: {
              search: search || '',
              status: status || 'All',
              page: page || 1,
              perPage: perPage || 10,
              createdStartDate: createdStartDate || '',
              createdEndDate: createdEndDate || '',
            },
          });

          // const response = await axiosInstance.get(`${endpoints.lands.list}?${params.toString()}`);
          // Simulamos una respuesta
          const mockResponse = {
            data: {
              data: [
                {
                  id: '1',
                  name: 'Land 1',
                  status: 'active',
                  // ... otros campos
                },
              ],
            },
          };
          set({ lands: mockResponse.data.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Error fetching lands',
            isLoading: false,
          });
        }
      },

      setError: (error: string) => {
        set({ error });
      },

      editLand: async (params: LandParams) => {
        set({ isLoading: true, error: null });
        try {
          // const axiosInstance = createAxiosInstance();
          // await axiosInstance.patch(
          //   `${endpoints.lands.edit.replace(':id', useLandStore.getState()?.landSelected?.id || '0')}`,
          //   params
          // );
          // Simulamos una respuesta exitosa
          console.log('Editing land with params:', params);
          set({ isLoading: false });
        } catch (error: any) {
          console.log('error', error);
          set({
            error: error?.response?.data?.message || 'Error editing land',
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'land-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const {
          isLoading,
          error,
          status_options,
          lands,
          filters,
          landSelected,
          openEditDialog,
          ...rest
        } = state;
        return rest;
      },
    }
  )
);

export default useLandStore;
