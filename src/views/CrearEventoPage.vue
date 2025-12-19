<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/eventos"></ion-back-button>
        </ion-buttons>
        <ion-title>Crear Evento</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="formulario-container">
        <FormularioEvento @guardar="handleGuardar" @cerrar="handleCerrar" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue';
import FormularioEvento from '@/components/FormularioEvento.vue';
import { useRouter } from 'vue-router';
import { useEventStore } from '@/stores/eventStore';

const router = useRouter();
const eventStore = useEventStore();

const handleCerrar = () => {
  router.push('/eventos');
};

const handleGuardar = async (datosEvento: Record<string, any>) => {
  try {
    await eventStore.createEvent(datosEvento);
    router.push('/eventos');
  } catch (error: any) {
    alert(error?.message ?? 'No se pudo crear el evento.');
  }
};
</script>

<style scoped>
.formulario-container {
  padding: 16px;
}
</style>
