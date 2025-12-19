<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mis Eventos</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="router.push('/about')">
            <ion-icon :icon="informationCircleOutline"></ion-icon>
          </ion-button>
          <ion-button @click="handleLogout">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="eventos-container">
        <ListaEventos :show-header="false" />
      </div>
    </ion-content>
    
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button @click="router.push('/eventos/crear')">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonFab, IonFabButton, IonMenuButton } from '@ionic/vue';
import { logOutOutline, addOutline, informationCircleOutline } from 'ionicons/icons';
import ListaEventos from '@/components/ListaEventos.vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.eventos-container {
  padding: 16px;
}
</style>
