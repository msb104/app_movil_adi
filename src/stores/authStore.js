import { defineStore } from 'pinia';
import { login, logout, register } from '@/backend/services/authService';
import { pb } from '@/backend/config/pb';

// Store global de autenticación: gestiona sesión, feedback de formularios y sincronía con PocketBase.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // `user` contiene el modelo completo de PocketBase cuando hay sesión válida.
    user: pb.authStore.isValid ? pb.authStore.model : null,
    // Flags y mensajes específicos del flujo de login.
    loginLoading: false,
    loginError: '',
    // Flags y mensajes específicos del flujo de registro.
    registerLoading: false,
    registerError: '',
    registerSuccess: '',
  }),
  getters: {
    // Getter booleando para comprobar autenticación sin acceder a authStore.user directamente.
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    // Gestiona el envío del formulario de login y actualiza el estado de carga/errores.
    async login(email, password) {
      if (this.loginLoading) {
        return;
      }

      this.loginError = '';
      this.loginLoading = true;

      try {
        await login(email, password);
        this.user = pb.authStore.model;
      } catch (error) {
        this.loginError = error?.message ?? 'No se pudo iniciar sesión.';
        throw error;
      } finally {
        this.loginLoading = false;
      }
    },
    // Registra un nuevo usuario y expone mensajes de éxito o error al componente.
    async register(name, email, password, confirmPassword) {
      if (this.registerLoading) {
        return;
      }

      this.registerError = '';
      this.registerSuccess = '';
      this.registerLoading = true;

      try {
        await register(name, email, password, confirmPassword);
        this.registerSuccess =
          'Cuenta creada correctamente. Ahora puedes iniciar sesión.';
      } catch (error) {
        this.registerError = error?.message ?? 'No se pudo completar el registro.';
        throw error;
      } finally {
        this.registerLoading = false;
      }
    },
    // Limpia la sesión en PocketBase y en el store.
    doLogout() {
      logout();
      this.user = null;
    },
    // Alias para compatibilidad
    logout() {
      this.doLogout();
    },
    // Permite sincronizar el store a partir de la sesión persistida en pb.authStore.
    syncUserFromSession() {
      this.user = pb.authStore.isValid ? pb.authStore.model : null;
    },
  },
});
