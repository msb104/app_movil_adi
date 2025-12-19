<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/eventos"></ion-back-button>
        </ion-buttons>
        <ion-title>Acerca de</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="about-container">
        <About />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue';
import About from '@/components/About.vue';
</script>

<style scoped>
.about-container {
  padding: 16px;
}
</style>
