import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { setStorage } from '../../hooks/use-local-storage';
import { endpoints, createAxiosInstance } from '../../utils/axiosInstance';

interface AuthUser {
  sub?: string;
  nickname?: string;
  name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  updated_at?: string;
  displayName?: string; // Alias para name para compatibilidad
  photoURL?: string; // Alias para picture para compatibilidad
}

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  user: AuthUser | null;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  fetchUserProfile: () => Promise<void>;
  getUserInfo: () => Promise<void>;
}

// Crear una instancia de store con funciones memoizadas
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Memoizar las funciones que pueden ser pasadas como dependencias
      const getUserInfoImpl = async () => {
        try {
          // No mostrar loading para actualizaciones silenciosas de perfil
          const isAuthenticated = get().isAuthenticated;

          if (!isAuthenticated) {
            return null;
          }

          set({ loading: true });
          const axiosInstance = createAxiosInstance();

          const response = await axiosInstance.get(endpoints.user.profile);

          if (response.data) {
            const userInfo = response.data;

            // Añadir aliases para compatibilidad con la interfaz existente
            userInfo.displayName = userInfo.name;
            userInfo.photoURL = userInfo.picture;

            set({
              user: userInfo,
              loading: false,
            });

            return userInfo;
          }

          set({ loading: false });
          return null;
        } catch (error: any) {
          console.error('Error al obtener información del usuario:', error);

          // Si hay un error 401 o 403, probablemente el token expiró
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn('Sesión inválida detectada. Cerrando sesión...');
            get().logout();
          }

          set({ loading: false });
          return null;
        }
      };

      return {
        loading: false,
        isAuthenticated: false,
        accessToken: null,
        user: null,
        error: null,

        setLoading: (loading: boolean) => set({ loading }),

        setError: (error: string | null) => set({ error }),

        login: async (email: string, password: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.post(endpoints.auth.login, {
              email,
              password,
            });

            // Extraer información de la respuesta
            const { access_token, id_token } = response.data;

            // Almacenar el token en localStorage
            setStorage('AUTH_TOKEN', access_token);

            // Intentar extraer información del usuario del token
            let userInfo = {};
            if (id_token) {
              userInfo = parseJwt(id_token);
            }

            set({
              isAuthenticated: true,
              accessToken: access_token,
              user: userInfo as AuthUser,
              loading: false,
              error: null,
            });

            // Obtener información completa del usuario
            await getUserInfoImpl();

            console.log('Autenticación exitosa:', { userInfo });

            return response.data;
          } catch (error: any) {
            console.error('Error de autenticación:', error);
            const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
            set({
              loading: false,
              error: errorMessage,
              isAuthenticated: false,
              accessToken: null,
              user: null,
            });
            throw error;
          }
        },

        // Obtener info del usuario del endpoint /auth/userinfo (Auth0)
        // Usar la implementación memoizada
        getUserInfo: getUserInfoImpl,

        fetchUserProfile: async () => {
          try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.get(endpoints.auth.me);

            if (response.data) {
              set({ user: response.data });
            }

            return response.data;
          } catch (error) {
            console.error('Error al obtener perfil de usuario:', error);
            // No cambiamos el estado de autenticación aquí
            return null;
          }
        },

        logout: () => {
          // Eliminar tokens del localStorage
          console.log('Cerrando sesión y limpiando tokens...');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('AUTH_TOKEN');

          set({
            isAuthenticated: false,
            accessToken: null,
            user: null,
            error: null,
          });
          console.log('Sesión cerrada con éxito');
        },

        checkAuth: () => {
          const { isAuthenticated } = get();
          return isAuthenticated;
        },
      };
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Cuando se rehidrata el store (se carga del localStorage)
      onRehydrateStorage:
        () =>
        // Retornamos una función que se ejecutará cuando termine la rehidratación
        (state) => {
          if (state && state.isAuthenticated) {
            console.log('Store rehidratado. Actualizando información de usuario...');
            // Actualizar la información del usuario después de rehidratar
            setTimeout(() => {
              state.getUserInfo();
            }, 1000); // Pequeño retraso para asegurar que todo está inicializado
          }
        },
    }
  )
);

// Función para decodificar el JWT y extraer la información del usuario
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return {};
  }
}

export default useAuthStore;
