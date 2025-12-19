<script setup>
// Componente de dashboard que lista los eventos propios, permite filtrarlos y borra registros.
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from '@/stores/eventStore';
import FormularioEvento from '@/components/FormularioEvento.vue';
import DetalleEvento from '@/components/DetalleEvento.vue';
import '@/css/style.css';
import '@/css/components.css';
import '@/css/responsive.css';

// Props para controlar el comportamiento del componente
const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  }
});

// Número de elementos que se muestran en cada página de la tabla.
const PAGE_SIZE = 5;
// Filtro reactivo por categoría seleccionada en el desplegable.
const categoryFilter = ref('');
// Búsqueda en texto libre que se aplica al título o descripción.
const searchTerm = ref('');
// Controla la vista activa del dashboard (lista o calendario).
const viewMode = ref('list');
// Página actual de la paginación incremental.
const currentPage = ref(1);
// Estado del modal de creación
const mostrandoFormularioCrear = ref(false);
// Evento seleccionado para ver detalles o editar
const eventoSeleccionado = ref(null);
// Indica si se está editando un evento
const editando = ref(false);

const eventStore = useEventStore();
const router = useRouter();

// Calcula los eventos filtrados en función de la categoría y texto introducido.
const filteredEvents = computed(() => {
  const category = categoryFilter.value?.toLowerCase();
  const search = searchTerm.value?.trim().toLowerCase();

  return eventStore.events.filter((event) => {
    const matchesCategory = category
      ? event.category?.toLowerCase() === category
      : true;

    const matchesSearch = search
      ? [event.title, event.description]
          .map((field) => (field ?? '').toLowerCase())
          .some((field) => field.includes(search))
      : true;

    return matchesCategory && matchesSearch;
  });
});

// Total de páginas derivado de los resultados filtrados.
const totalPages = computed(() => {
  const total = filteredEvents.value.length;
  if (total === 0) return 1;
  return Math.ceil(total / PAGE_SIZE);
});

// Subconjunto visible en la página actual.
const paginatedEvents = computed(() => {
  if (!filteredEvents.value.length) return [];
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredEvents.value.slice(start, start + PAGE_SIZE);
});

// Determina el rango de elementos mostrados (ej. 6-10 de 20).
const pageRange = computed(() => {
  if (!filteredEvents.value.length) {
    return { start: 0, end: 0, total: 0 };
  }
  const startIndex = (currentPage.value - 1) * PAGE_SIZE;
  const endIndex = Math.min(currentPage.value * PAGE_SIZE, filteredEvents.value.length);
  return {
    start: startIndex + 1,
    end: endIndex,
    total: filteredEvents.value.length,
  };
});

// Indica si debe mostrarse el estado vacío (sin resultados).
const isEmptyState = computed(
  () => !eventStore.loading && filteredEvents.value.length === 0
);

// Mensaje contextual que detalla el motivo del estado vacío.
const emptyStateMessage = computed(() => {
  if (eventStore.error) {
    return eventStore.error;
  }

  if (!eventStore.events.length) {
    return 'No hay eventos disponibles.';
  }

  return 'Ningún evento coincide con los filtros seleccionados.';
});

// Formatea fechas ISO para mostrar en la tarjeta; controla valores inválidos.
const formatDate = (value) => {
  if (!value) {
    return 'Fecha no disponible';
  }

  try {
    return new Date(value).toLocaleDateString();
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return 'Fecha no disponible';
  }
};

// Dispara la acción de borrado tras confirmación del usuario.
const handleDelete = async (eventId) => {
  if (!eventId) return;
  const confirmed = window.confirm(
    '¿Estás seguro de que quieres borrar este evento?'
  );
  if (!confirmed) return;

  try {
    await eventStore.deleteEvent(eventId);
    // Si se está mostrando el detalle del evento borrado, cerrar el modal
    if (eventoSeleccionado.value?.id === eventId) {
      cerrarDetalle();
    }
  } catch (error) {
    alert('Error al borrar el evento: ' + (error?.message ?? error));
  }
};

// Avanza o retrocede una página mientras respeta los límites.
const goToPage = (direction) => {
  const nextPage = currentPage.value + direction;
  if (nextPage < 1 || nextPage > totalPages.value) return;
  currentPage.value = nextPage;
};

// Recupera los eventos desde el backend usando el eventStore.
const loadEvents = async () => {
  try {
    await eventStore.fetchEvents();
  } catch (error) {
    console.error('Error al cargar los eventos:', error);
  }
};

// Mostrar el formulario de creación de eventos
const mostrarFormularioCrear = () => {
  mostrandoFormularioCrear.value = true;
};

// Cerrar el formulario de creación
const cerrarFormularioCrear = () => {
  mostrandoFormularioCrear.value = false;
};

// Crear un nuevo evento
const crearEvento = async (datosEvento) => {
  try {
    await eventStore.createEvent(datosEvento);
    cerrarFormularioCrear();
    await loadEvents();
  } catch (error) {
    alert('Error al crear el evento: ' + (error?.message ?? error));
  }
};

// Ver detalles de un evento
const verDetalle = (evento) => {
  if (props.showHeader) {
    // Modo modal (Vue puro)
    eventoSeleccionado.value = evento;
    editando.value = false;
  } else {
    // Modo navegación (Ionic)
    router.push(`/eventos/${evento.id}`);
  }
};

// Cerrar modal de detalles
const cerrarDetalle = () => {
  eventoSeleccionado.value = null;
  editando.value = false;
};

// Iniciar edición de un evento
const editarEvento = (evento) => {
  if (props.showHeader) {
    // Modo modal (Vue puro)
    eventoSeleccionado.value = evento;
    editando.value = true;
  } else {
    // Modo navegación (Ionic)
    router.push(`/eventos/${evento.id}/editar`);
  }
};

// Iniciar edición desde el modal de detalles
const iniciarEdicion = () => {
  editando.value = true;
};

// Cerrar modal de edición
const cerrarEdicion = () => {
  editando.value = false;
  eventoSeleccionado.value = null;
};

// Actualizar un evento existente
const actualizarEvento = async (datosEvento) => {
  try {
    await eventStore.updateEvent(eventoSeleccionado.value.id, datosEvento);
    cerrarEdicion();
    await loadEvents();
  } catch (error) {
    alert('Error al actualizar el evento: ' + (error?.message ?? error));
  }
};

// Reinicia la paginación cuando cambian los filtros.
watch([categoryFilter, searchTerm], () => {
  currentPage.value = 1;
});

// Recalcula la página válida cuando cambia el total filtrado o la vista.
watch([filteredEvents, viewMode], ([newEvents]) => {
  if (!newEvents.length) {
    currentPage.value = 1;
    return;
  }

  if ((currentPage.value - 1) * PAGE_SIZE >= newEvents.length) {
    currentPage.value = Math.max(1, Math.ceil(newEvents.length / PAGE_SIZE));
  }
});

// Carga inicial de eventos al montar el componente y activa realtime.
onMounted(() => {
  loadEvents();
  eventStore.startRealtime();
});

onBeforeUnmount(() => {
  eventStore.stopRealtime();
});
</script>

<template>
  <div class="lista-eventos">
    <ion-card class="filters-card">
      <ion-card-header>
        <ion-card-subtitle>Organiza tus eventos</ion-card-subtitle>
        <ion-card-title>Mis eventos</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item lines="none">
          <ion-label position="stacked">Categoría</ion-label>
          <ion-select
            interface="popover"
            placeholder="Todas"
            v-model="categoryFilter"
          >
            <ion-select-option value="">Todas las categorías</ion-select-option>
            <ion-select-option value="trabajo">Trabajo</ion-select-option>
            <ion-select-option value="personal">Personal</ion-select-option>
            <ion-select-option value="ocio">Ocio</ion-select-option>
            <ion-select-option value="salud">Salud</ion-select-option>
            <ion-select-option value="educacion">Educación</ion-select-option>
            <ion-select-option value="familia">Familia</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-searchbar
          v-model="searchTerm"
          placeholder="Buscar eventos..."
          debounce="250"
          class="searchbar"
        />

        <ion-button expand="block" fill="outline" @click="loadEvents">
          Actualizar lista
        </ion-button>

        <ion-button
          v-if="showHeader"
          expand="block"
          class="new-event-button"
          @click="mostrarFormularioCrear"
        >
          + Nuevo evento
        </ion-button>
        <ion-button
          v-else
          expand="block"
          class="new-event-button"
          @click="router.push('/eventos/crear')"
        >
          + Nuevo evento
        </ion-button>
      </ion-card-content>
    </ion-card>

    <ion-card v-if="eventStore.loading" class="empty-card">
      <ion-card-content>Cargando eventos...</ion-card-content>
    </ion-card>

    <ion-card v-else-if="isEmptyState" class="empty-card">
      <ion-card-content>{{ emptyStateMessage }}</ion-card-content>
    </ion-card>

    <ion-list v-else class="events-list">
      <ion-item
        v-for="evento in paginatedEvents"
        :key="evento.id"
        detail="true"
        button
        @click="verDetalle(evento)"
      >
        <ion-label>
          <h2>{{ evento.title || 'Sin título' }}</h2>
          <p class="event-description">
            {{ evento.description || 'Sin descripción' }}
          </p>
          <div class="item-metadata">
            <ion-badge
              class="category-badge"
              :class="evento.category ? `category-${evento.category}` : 'category-default'"
            >
              {{ evento.category || 'General' }}
            </ion-badge>
            <span>{{ formatDate(evento.date) }} · {{ evento.time || 'Sin hora' }}</span>
          </div>
        </ion-label>

        <ion-buttons slot="end">
          <ion-button
            fill="clear"
            size="small"
            @click.stop="editarEvento(evento)"
          >
            Editar
          </ion-button>
          <ion-button
            fill="clear"
            color="danger"
            size="small"
            @click.stop="handleDelete(evento.id)"
          >
            Borrar
          </ion-button>
        </ion-buttons>
      </ion-item>
    </ion-list>

    <div class="pagination-controls" v-if="pageRange.total > 0">
      <p>
        Mostrando eventos {{ pageRange.start }}-{{ pageRange.end }} de
        {{ pageRange.total }}
      </p>
      <div class="pagination-buttons">
        <ion-button
          fill="outline"
          size="small"
          :disabled="currentPage === 1"
          @click="goToPage(-1)"
        >
          Anterior
        </ion-button>
        <span>Página {{ currentPage }} / {{ totalPages }}</span>
        <ion-button
          fill="outline"
          size="small"
          :disabled="currentPage === totalPages"
          @click="goToPage(1)"
        >
          Siguiente
        </ion-button>
      </div>
    </div>

    <ion-modal
      :is-open="mostrandoFormularioCrear"
      @didDismiss="cerrarFormularioCrear"
    >
      <div class="modal-content">
        <FormularioEvento
          :evento="null"
          @guardar="crearEvento"
          @cancelar="cerrarFormularioCrear"
        />
      </div>
    </ion-modal>

    <ion-modal
      :is-open="!!eventoSeleccionado && !editando"
      @didDismiss="cerrarDetalle"
    >
      <div class="modal-content">
        <DetalleEvento
          v-if="eventoSeleccionado"
          :evento="eventoSeleccionado"
          @editar="iniciarEdicion"
          @cerrar="cerrarDetalle"
          @borrar="(evento) => handleDelete(evento.id)"
        />
      </div>
    </ion-modal>

    <ion-modal
      :is-open="!!eventoSeleccionado && editando"
      @didDismiss="cerrarEdicion"
    >
      <div class="modal-content">
        <FormularioEvento
          v-if="eventoSeleccionado"
          :evento="eventoSeleccionado"
          @guardar="actualizarEvento"
          @cancelar="cerrarEdicion"
        />
      </div>
    </ion-modal>
  </div>
</template>

<style scoped>
.lista-eventos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
}

.filters-card ion-item {
  --inner-padding-end: 0;
  --inner-padding-start: 0;
  margin-bottom: 0.5rem;
}

.searchbar {
  margin-bottom: 0.5rem;
}

.new-event-button {
  margin-top: 0.5rem;
}

.view-segment {
  margin: 0 0.5rem;
}

.events-list ion-item {
  --inner-padding-end: 0.5rem;
  --inner-padding-start: 0.5rem;
  --inner-padding-top: 0.75rem;
  --inner-padding-bottom: 0.75rem;
}

.event-description {
  margin-top: 0.35rem;
  color: var(--ion-color-medium);
  font-size: 0.95rem;
}

.item-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  align-items: center;
}

.category-badge {
  text-transform: capitalize;
}

.category-trabajo {
  --background: #e3f2fd;
  --color: #1565c0;
}

.category-personal {
  --background: #f3e5f5;
  --color: #6a1b9a;
}

.category-ocio {
  --background: #fff3e0;
  --color: #ef6c00;
}

.category-salud {
  --background: #fce4ec;
  --color: #c2185b;
}

.category-familia {
  --background: #fffde7;
  --color: #f57f17;
}

.category-educacion {
  --background: #e0f2f1;
  --color: #00695c;
}

.category-default {
  --background: #f5f5f5;
  --color: #616161;
}

.empty-card {
  margin: 0 0.5rem;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0 0.5rem;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-content {
  padding: 1.5rem;
}

:global(ion-modal) {
  --width: 90%;
  --max-width: 520px;
  --border-radius: 16px;
}
</style>
