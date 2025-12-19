<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/eventos"></ion-back-button>
        </ion-buttons>
        <ion-title>Editar Evento</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="evento" class="formulario-container">
        <FormularioEvento :evento="evento" @guardar="handleGuardar" @cerrar="handleCerrar" />
      </div>
      <div v-else class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Cargando evento...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonSpinner } from '@ionic/vue';
import FormularioEvento from '@/components/FormularioEvento.vue';
import { useRouter, useRoute } from 'vue-router';
import { useEventStore } from '@/stores/eventStore';
import { computed, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();
const eventStore = useEventStore();

const eventoId = computed(() => route.params.id as string);
const evento = computed(() => eventStore.events.find((e: any) => e.id === eventoId.value));

onMounted(async () => {
  if (eventStore.events.length === 0) {
    await eventStore.fetchEvents();
  }
});

const handleCerrar = () => {
  router.push('/eventos');
};

const handleGuardar = async (datosEvento: Record<string, any>) => {
  if (!eventoId.value) return;

  try {
    await eventStore.updateEvent(eventoId.value, datosEvento);
    router.push('/eventos');
  } catch (error: any) {
    alert(error?.message ?? 'No se pudo actualizar el evento.');
  }
};
</script>

<style scoped>
.formulario-container {
  padding: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}
</style>
