<template>
  <ion-app>
    <ion-menu content-id="main-content" type="overlay">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>EventManager</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item router-link="/eventos" router-direction="root">
            Eventos
          </ion-item>
          <ion-item router-link="/perfil" router-direction="root">
            Perfil
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <div id="main-content" class="app-content">
      <ion-router-outlet />
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
</script>

<style scoped>
.app-content {
  min-height: 100vh;
}
</style>
