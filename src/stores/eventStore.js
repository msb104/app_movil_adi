import { defineStore } from 'pinia';
import { listarEventos } from '@/backend/services/listarEventos.js';
import { borrarEvento } from '@/backend/services/borrarEvento.js';
import { crearEvento } from '@/backend/services/crearEvento.js';
import { editarEvento } from '@/backend/services/editarEvento.js';
import { pb } from '@/backend/config/pb.js';

// Store que encapsula la lista de eventos del usuario y expone acciones CRUD básicas.
export const useEventStore = defineStore('eventStore', {
  state: () => ({
    // Arreglo reactivo con los eventos visibles en el dashboard.
    events: [],
    // Bandera usada por la UI para mostrar spinner o bloquear acciones duplicadas.
    loading: false,
    // Texto descriptivo del último error ocurrido al sincronizar con el backend.
    error: '',
    // Marca de tiempo (ms) de la última actualización correcta desde PocketBase.
    lastUpdated: null,
    // Controla si hay una subscripción realtime activa.
    realtimeActive: false,
  }),
  actions: {
    // Recupera los eventos del backend limitando las llamadas simultáneas.
    async fetchEvents() {
      if (this.loading) return;
      this.error = '';
      this.loading = true;

      try {
        const eventos = await listarEventos();
        this.events = eventos ?? [];
        this.lastUpdated = Date.now();
      } catch (error) {
        this.error =
          error?.message ?? 'No se pudo cargar la lista de eventos.';
        this.events = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // Arranca la subscripción realtime a la colección de eventos del usuario autenticado.
    async startRealtime() {
      if (this.realtimeActive || !pb.authStore.isValid) {
        return;
      }

      try {
        await pb.collection('events').subscribe('*', (event) => {
          this.handleRealtimeEvent(event);
        });
        this.realtimeActive = true;
      } catch (error) {
        console.error('No se pudo iniciar la subscripción realtime', error);
      }
    },
    // Finaliza la subscripción en tiempo real si está activa.
    stopRealtime() {
      if (!this.realtimeActive) return;
      pb.collection('events').unsubscribe('*');
      this.realtimeActive = false;
    },
    // Crea un nuevo evento y lo añade a la lista local.
    async createEvent(eventData) {
      if (!eventData) return;

      try {
        const nuevoEvento = await crearEvento(eventData);
        this.events.unshift(nuevoEvento);
        return nuevoEvento;
      } catch (error) {
        this.error =
          error?.message ?? 'No se pudo crear el evento.';
        throw error;
      }
    },
    // Actualiza un evento existente en el backend y en la lista local.
    async updateEvent(eventId, eventData) {
      if (!eventId || !eventData) return;

      try {
        const eventoActualizado = await editarEvento(eventId, eventData);
        const index = this.events.findIndex((event) => event.id === eventId);
        if (index !== -1) {
          this.events[index] = eventoActualizado;
        }
        return eventoActualizado;
      } catch (error) {
        this.error =
          error?.message ?? 'No se pudo actualizar el evento.';
        throw error;
      }
    },
    // Borra un evento específico y actualiza la lista local si el backend responde bien.
    async deleteEvent(eventId) {
      if (!eventId) return;

      try {
        await borrarEvento(eventId);
        this.events = this.events.filter((event) => event.id !== eventId);
      } catch (error) {
        this.error =
          error?.message ?? 'No se pudo borrar el evento seleccionado.';
        throw error;
      }
    },
    // Limpia manualmente el mensaje de error para que la UI lo oculte.
    clearError() {
      this.error = '';
    },
    // Aplica los cambios recibidos a través del realtime API.
    handleRealtimeEvent(event) {
      const ownerId = pb.authStore.model?.id;
      if (!ownerId) return;

      const recordOwner = event.record?.owner;
      if (recordOwner && recordOwner !== ownerId) {
        return;
      }

      switch (event.action) {
        case 'create':
          this.events.unshift(event.record);
          break;
        case 'update': {
          const index = this.events.findIndex((item) => item.id === event.record.id);
          if (index !== -1) {
            this.events[index] = event.record;
          } else {
            this.events.unshift(event.record);
          }
          break;
        }
        case 'delete':
          this.events = this.events.filter((item) => item.id !== event.record.id);
          break;
        default:
          break;
      }

      this.lastUpdated = Date.now();
    },
  },
});
