<template>
  <ion-card class="detalle-card">
    <ion-card-header>
      <ion-card-subtitle>{{ evento.category || 'General' }}</ion-card-subtitle>
      <ion-card-title>{{ evento.title }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-chip class="chip-category" :class="evento.category ? `category-${evento.category}` : 'category-default'">
        <ion-label>{{ evento.category || 'Sin categoría' }}</ion-label>
      </ion-chip>
      <ion-chip class="chip-priority" :class="`priority-${evento.priority || 'baja'}`">
        <ion-label>Prioridad: {{ evento.priority || 'baja' }}</ion-label>
      </ion-chip>

      <ion-text class="description">
        {{ evento.description }}
      </ion-text>

      <ion-list lines="full" class="details-list">
        <ion-item>
          <ion-label>
            <h3>Ubicación</h3>
            <p>{{ evento.location || 'Sin ubicación' }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h3>Fecha</h3>
            <p>{{ formatearFecha(evento.date) }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h3>Hora</h3>
            <p>{{ evento.time || 'Sin hora' }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h3>Duración</h3>
            <p>{{ evento.duration }} minutos</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h3>Recordatorio</h3>
            <p>{{ evento.reminder ? 'Activado' : 'Desactivado' }}</p>
          </ion-label>
        </ion-item>

        <ion-item lines="none">
          <ion-label>
            <h3>Creado</h3>
            <p>{{ formatearFechaHora(evento.created) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-buttons class="actions">
        <ion-button color="medium" fill="clear" @click="handleCerrar">
          Cerrar
        </ion-button>
        <ion-button fill="outline" @click="handleEditar">
          Editar
        </ion-button>
        <ion-button color="danger" @click="handleBorrar">
          Borrar
        </ion-button>
      </ion-buttons>
    </ion-card-content>
  </ion-card>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonList,
  IonText,
  IonItem,
} from '@ionic/vue';

export default {
  name: 'DetalleEvento',
  components: {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonLabel,
    IonList,
    IonText,
    IonItem,
  },
  props: {
    evento: {
      type: Object,
      required: true,
    },
  },
  emits: ['editar', 'borrar', 'cerrar'],
  setup(props, { emit }) {
    const formatearFecha = (fecha) => {
      if (!fecha) return 'No disponible';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatearFechaHora = (fecha) => {
      if (!fecha) return 'No disponible';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const handleEditar = () => {
      emit('editar');
    };

    const handleBorrar = () => {
      emit('borrar', props.evento);
    };

    const handleCerrar = () => {
      emit('cerrar');
    };

    return {
      formatearFecha,
      formatearFechaHora,
      handleEditar,
      handleBorrar,
      handleCerrar,
    };
  },
};
</script>

<style scoped>
.detalle-card {
  width: 100%;
}

.chip-category,
.chip-priority {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
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
  --color: #e65100;
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

.priority-baja {
  --background: #e8f5e9;
  --color: #2e7d32;
}

.priority-media {
  --background: #fff3e0;
  --color: #ef6c00;
}

.priority-alta {
  --background: #ffebee;
  --color: #c62828;
}

.description {
  display: block;
  margin: 1rem 0;
  color: var(--ion-color-dark);
  line-height: 1.5;
}

.details-list h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.details-list p {
  margin: 0.35rem 0 0 0;
  color: var(--ion-color-medium);
}

.actions {
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
