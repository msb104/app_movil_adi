<template>
  <ion-card class="form-card">
    <ion-card-header>
      <ion-card-title>{{ evento ? 'Editar evento' : 'Crear nuevo evento' }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <form @submit.prevent="handleSubmit">
        <ion-list lines="none">
          <ion-item>
            <ion-label position="stacked">Título *</ion-label>
            <ion-input
              v-model="form.title"
              type="text"
              maxlength="100"
              required
            />
          </ion-item>
          <ion-text v-if="errors.title" color="danger" class="error-text">
            {{ errors.title }}
          </ion-text>

          <ion-item>
            <ion-label position="stacked">Descripción *</ion-label>
            <ion-textarea
              v-model="form.description"
              rows="4"
              maxlength="500"
              auto-grow
              required
            />
          </ion-item>
          <ion-text v-if="errors.description" color="danger" class="error-text">
            {{ errors.description }}
          </ion-text>

          <ion-item>
            <ion-label position="stacked">Ubicación *</ion-label>
            <ion-input
              v-model="form.location"
              type="text"
              maxlength="200"
              required
            />
          </ion-item>
          <ion-text v-if="errors.location" color="danger" class="error-text">
            {{ errors.location }}
          </ion-text>

          <ion-grid class="spacing-grid">
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-item>
                  <ion-label position="stacked">Fecha *</ion-label>
                  <ion-input
                    v-model="form.date"
                    type="date"
                    :min="fechaMinima"
                    required
                  />
                </ion-item>
                <ion-text v-if="errors.date" color="danger" class="error-text">
                  {{ errors.date }}
                </ion-text>
              </ion-col>
              <ion-col size="12" size-md="6">
                <ion-item>
                  <ion-label position="stacked">Hora *</ion-label>
                  <ion-input
                    v-model="form.time"
                    type="time"
                    required
                  />
                </ion-item>
                <ion-text v-if="errors.time" color="danger" class="error-text">
                  {{ errors.time }}
                </ion-text>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-item>
            <ion-label position="stacked">Duración (min) *</ion-label>
            <ion-input
              v-model.number="form.duration"
              type="number"
              min="1"
              max="1440"
              required
            />
          </ion-item>
          <ion-text v-if="errors.duration" color="danger" class="error-text">
            {{ errors.duration }}
          </ion-text>

          <ion-item>
            <ion-label position="stacked">Categoría *</ion-label>
            <ion-select v-model="form.category" placeholder="Seleccionar" required>
              <ion-select-option value="trabajo">Trabajo</ion-select-option>
              <ion-select-option value="personal">Personal</ion-select-option>
              <ion-select-option value="ocio">Ocio</ion-select-option>
              <ion-select-option value="salud">Salud</ion-select-option>
              <ion-select-option value="educacion">Educación</ion-select-option>
              <ion-select-option value="familia">Familia</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-text v-if="errors.category" color="danger" class="error-text">
            {{ errors.category }}
          </ion-text>

          <ion-item>
            <ion-label position="stacked">Prioridad *</ion-label>
            <ion-segment v-model="form.priority">
              <ion-segment-button value="baja">
                <ion-label>Baja</ion-label>
              </ion-segment-button>
              <ion-segment-button value="media">
                <ion-label>Media</ion-label>
              </ion-segment-button>
              <ion-segment-button value="alta">
                <ion-label>Alta</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-item>
          <ion-text v-if="errors.priority" color="danger" class="error-text">
            {{ errors.priority }}
          </ion-text>

          <ion-item lines="full">
            <ion-label>Activar recordatorio</ion-label>
            <ion-toggle slot="end" v-model="form.reminder" />
          </ion-item>
        </ion-list>

        <ion-buttons class="form-buttons">
          <ion-button type="button" @click="handleCancel">
            Cancelar
          </ion-button>
          <ion-button type="button" @click="handleSubmit">
            <ion-spinner v-if="loading" slot="start" />
            {{ loading ? 'Guardando...' : (evento ? 'Guardar cambios' : 'Crear evento') }}
          </ion-button>
        </ion-buttons>
      </form>
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
  IonCardTitle,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTextarea,
  IonToggle,
} from '@ionic/vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';

export default {
  name: 'FormularioEvento',
  components: {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTextarea,
    IonToggle,
  },
  props: {
    evento: {
      type: Object,
      default: null,
    },
  },
  emits: ['guardar', 'cancelar', 'cerrar'],
  setup(props, { emit }) {
    const loading = ref(false);

    const form = reactive({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      duration: 60,
      category: '',
      priority: '',
      reminder: false,
    });

    const errors = reactive({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      duration: '',
      category: '',
      priority: '',
    });

    const fechaMinima = computed(() => {
      const hoy = new Date();
      return hoy.toISOString().split('T')[0];
    });

    const limpiarErrores = () => {
      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });
    };

    const validarFormulario = () => {
      limpiarErrores();
      let valido = true;

      if (!form.title.trim()) {
        errors.title = 'El título es obligatorio';
        valido = false;
      } else if (form.title.trim().length < 3) {
        errors.title = 'El título debe tener al menos 3 caracteres';
        valido = false;
      }

      if (!form.description.trim()) {
        errors.description = 'La descripción es obligatoria';
        valido = false;
      } else if (form.description.trim().length < 10) {
        errors.description = 'La descripción debe tener al menos 10 caracteres';
        valido = false;
      }

      if (!form.location.trim()) {
        errors.location = 'La ubicación es obligatoria';
        valido = false;
      }

      if (!form.date) {
        errors.date = 'La fecha es obligatoria';
        valido = false;
      } else {
        const fechaSeleccionada = new Date(form.date);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaSeleccionada < hoy) {
          errors.date = 'La fecha no puede ser anterior a hoy';
          valido = false;
        }
      }

      if (!form.time) {
        errors.time = 'La hora es obligatoria';
        valido = false;
      }

      if (!form.duration || form.duration < 1) {
        errors.duration = 'La duración debe ser al menos 1 minuto';
        valido = false;
      } else if (form.duration > 1440) {
        errors.duration = 'La duración no puede superar 1440 minutos';
        valido = false;
      }

      if (!form.category) {
        errors.category = 'La categoría es obligatoria';
        valido = false;
      }

      if (!form.priority) {
        errors.priority = 'La prioridad es obligatoria';
        valido = false;
      }

      return valido;
    };

    const handleSubmit = async () => {
      if (!validarFormulario()) {
        return;
      }

      loading.value = true;

      const datosEvento = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        date: form.date,
        time: form.time,
        duration: parseInt(form.duration, 10),
        category: form.category,
        priority: form.priority,
        reminder: form.reminder,
      };

      try {
        emit('guardar', datosEvento);
      } finally {
        loading.value = false;
      }
    };

    const handleCancel = () => {
      emit('cancelar');
      emit('cerrar');
    };

    const cargarDatosEvento = () => {
      if (props.evento) {
        form.title = props.evento.title || '';
        form.description = props.evento.description || '';
        form.location = props.evento.location || '';
        form.date = props.evento.date || '';
        form.time = props.evento.time || '';
        form.duration = props.evento.duration || 60;
        form.category = props.evento.category || '';
        form.priority = props.evento.priority || '';
        form.reminder = props.evento.reminder || false;
      } else {
        form.title = '';
        form.description = '';
        form.location = '';
        form.date = '';
        form.time = '';
        form.duration = 60;
        form.category = '';
        form.priority = '';
        form.reminder = false;
      }
    };

    watch(
      () => props.evento,
      () => {
        cargarDatosEvento();
      },
      { immediate: true },
    );

    onMounted(() => {
      cargarDatosEvento();
    });

    return {
      form,
      errors,
      loading,
      fechaMinima,
      handleSubmit,
      handleCancel,
    };
  },
};
</script>

<style scoped>
.form-card {
  width: 100%;
}

.error-text {
  display: block;
  margin: 0.25rem 0 0.75rem 0.75rem;
  font-size: 0.85rem;
}

.spacing-grid {
  padding: 0;
}

.form-buttons {
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

@media (max-width: 600px) {
  .form-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
