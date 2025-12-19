<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const { registerLoading, registerError, registerSuccess } = storeToRefs(authStore);

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleRegister = async () => {
  if (registerLoading.value) return;

  try {
    await authStore.register(
      registerForm.name,
      registerForm.email,
      registerForm.password,
      registerForm.confirmPassword,
    );

    registerForm.name = '';
    registerForm.email = '';
    registerForm.password = '';
    registerForm.confirmPassword = '';
  } catch (error) {
    console.error(error);
  }
};

const goToLogin = () => {
  router.push('/login');
};

onBeforeUnmount(() => {
  authStore.registerError = '';
  authStore.registerSuccess = '';
});
</script>

<template>
  <div class="register-wrapper">
    <ion-card class="register-card">
      <ion-card-header>
        <ion-card-subtitle>Crear cuenta</ion-card-subtitle>
        <ion-card-title>EventManager</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <form novalidate @submit.prevent="handleRegister">
          <ion-list lines="full">
            <ion-item>
              <ion-label position="stacked">Nombre completo</ion-label>
              <ion-input
                v-model="registerForm.name"
                type="text"
                autocomplete="name"
                required
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input
                v-model="registerForm.email"
                type="email"
                autocomplete="email"
                required
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Contraseña</ion-label>
              <ion-input
                v-model="registerForm.password"
                type="password"
                autocomplete="new-password"
                required
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Confirmar contraseña</ion-label>
              <ion-input
                v-model="registerForm.confirmPassword"
                type="password"
                autocomplete="new-password"
                required
              />
            </ion-item>
          </ion-list>

          <ion-button
            expand="block"
            type="submit"
            :disabled="registerLoading"
            class="register-button"
          >
            <ion-spinner v-if="registerLoading" slot="start" />
            {{ registerLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
          </ion-button>

          <ion-text v-if="registerError" color="danger" class="feedback-text">
            {{ registerError }}
          </ion-text>

          <ion-text v-if="registerSuccess" color="success" class="feedback-text">
            {{ registerSuccess }}
          </ion-text>
        </form>
      </ion-card-content>
    </ion-card>

    <ion-button fill="clear" expand="block" @click="goToLogin">
      ¿Ya tienes cuenta? Inicia sesión
    </ion-button>
  </div>
</template>

<style scoped>
.register-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
}

.register-card {
  box-shadow: var(--ion-card-box-shadow);
}

.register-button {
  margin-top: 1.5rem;
}

.feedback-text {
  display: block;
  margin-top: 1rem;
}
</style>
