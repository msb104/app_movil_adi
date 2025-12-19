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
const { loginLoading, loginError } = storeToRefs(authStore);

const loginForm = reactive({
  email: '',
  password: '',
});

const handleLogin = async () => {
  if (loginLoading.value) return;

  try {
    await authStore.login(loginForm.email, loginForm.password);
    router.push('/eventos');
  } catch (error) {
    console.error(error);
  }
};

const goToRegister = () => {
  router.push('/register');
};

onBeforeUnmount(() => {
  authStore.loginError = '';
});
</script>

<template>
  <div class="login-wrapper">
    <ion-card class="login-card">
      <ion-card-header>
        <ion-card-subtitle>Bienvenido</ion-card-subtitle>
        <ion-card-title>EventManager</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <form novalidate @submit.prevent="handleLogin">
          <ion-list lines="full">
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input
                v-model="loginForm.email"
                type="email"
                autocomplete="email"
                required
              />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Contraseña</ion-label>
              <ion-input
                v-model="loginForm.password"
                type="password"
                autocomplete="current-password"
                required
              />
            </ion-item>
          </ion-list>

          <ion-button
            class="login-button"
            expand="block"
            type="submit"
            :disabled="loginLoading"
          >
            <ion-spinner v-if="loginLoading" slot="start" />
            {{ loginLoading ? 'Entrando...' : 'Entrar' }}
          </ion-button>

          <ion-text v-if="loginError" color="danger" class="feedback-text">
            {{ loginError }}
          </ion-text>
        </form>
      </ion-card-content>
    </ion-card>

    <ion-button fill="clear" expand="block" @click="goToRegister">
      ¿No tienes cuenta? Regístrate
    </ion-button>
  </div>
</template>

<style scoped>
.login-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
}

.login-card {
  box-shadow: var(--ion-card-box-shadow);
}

.login-button {
  margin-top: 1.5rem;
}

.feedback-text {
  display: block;
  margin-top: 1rem;
}
</style>
