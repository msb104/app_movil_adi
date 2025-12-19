<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Perfil de usuario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="profile-container">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Información personal</ion-card-subtitle>
            <ion-card-title>Datos de cuenta</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form @submit.prevent="handleSaveProfile">
              <ion-list lines="none">
                <ion-item>
                  <ion-label position="stacked">Nombre completo</ion-label>
                  <ion-input
                    v-model="profileForm.name"
                    type="text"
                    required
                  />
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Email</ion-label>
                  <ion-input
                    v-model="profileForm.email"
                    type="email"
                    required
                  />
                </ion-item>
              </ion-list>
              <ion-buttons class="card-buttons">
                <ion-button
                  type="submit"
                  :disabled="profileLoading"
                  expand="block"
                >
                  <ion-spinner v-if="profileLoading" slot="start" />
                  Guardar cambios
                </ion-button>
              </ion-buttons>
              <ion-text v-if="profileSuccess" color="success" class="feedback-text">
                {{ profileSuccess }}
              </ion-text>
              <ion-text v-if="profileError" color="danger" class="feedback-text">
                {{ profileError }}
              </ion-text>
            </form>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Seguridad</ion-card-subtitle>
            <ion-card-title>Cambiar contraseña</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form @submit.prevent="handleChangePassword">
              <ion-list lines="none">
                <ion-item>
                  <ion-label position="stacked">Contraseña actual</ion-label>
                  <ion-input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                  />
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Nueva contraseña</ion-label>
                  <ion-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                  />
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Confirmar nueva contraseña</ion-label>
                  <ion-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                  />
                </ion-item>
              </ion-list>
              <ion-buttons class="card-buttons">
                <ion-button
                  type="submit"
                  :disabled="passwordLoading"
                  expand="block"
                >
                  <ion-spinner v-if="passwordLoading" slot="start" />
                  Actualizar contraseña
                </ion-button>
              </ion-buttons>
              <ion-text v-if="passwordSuccess" color="success" class="feedback-text">
                {{ passwordSuccess }}
              </ion-text>
              <ion-text v-if="passwordError" color="danger" class="feedback-text">
                {{ passwordError }}
              </ion-text>
            </form>
          </ion-card-content>
        </ion-card>

        <ion-card color="light">
          <ion-card-header>
            <ion-card-subtitle>Zona peligrosa</ion-card-subtitle>
            <ion-card-title>Eliminar cuenta</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-text color="medium">
              Esta acción borrará tu cuenta y todos tus datos. No podrás recuperarlos.
            </ion-text>
            <ion-button
              expand="block"
              color="danger"
              class="danger-button"
              :disabled="deleteLoading"
              @click="handleDeleteAccount"
            >
              <ion-spinner v-if="deleteLoading" slot="start" />
              Eliminar cuenta
            </ion-button>
            <ion-text v-if="deleteError" color="danger" class="feedback-text">
              {{ deleteError }}
            </ion-text>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { updateUser, updatePassword } from '@/backend/services/userService';
import { deleteUser } from '@/backend/services/authService';

const authStore = useAuthStore();
const router = useRouter();

const profileForm = reactive({
  name: authStore.user?.name ?? '',
  email: authStore.user?.email ?? '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const profileLoading = ref(false);
const passwordLoading = ref(false);
const deleteLoading = ref(false);

const profileSuccess = ref('');
const profileError = ref('');
const passwordSuccess = ref('');
const passwordError = ref('');
const deleteError = ref('');

watch(
  () => authStore.user,
  (user) => {
    profileForm.name = user?.name ?? '';
    profileForm.email = user?.email ?? '';
  },
  { immediate: true },
);

const handleSaveProfile = async () => {
  profileSuccess.value = '';
  profileError.value = '';

  if (!profileForm.name.trim() || !profileForm.email.trim()) {
    profileError.value = 'Nombre y email son obligatorios.';
    return;
  }

  try {
    profileLoading.value = true;
    const updated = await updateUser({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    });
    authStore.user = { ...(authStore.user ?? {}), ...updated };
    profileSuccess.value = 'Perfil actualizado correctamente.';
  } catch (error: any) {
    profileError.value = error?.message ?? 'No se pudo actualizar el perfil.';
  } finally {
    profileLoading.value = false;
  }
};

const handleChangePassword = async () => {
  passwordSuccess.value = '';
  passwordError.value = '';

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Las contraseñas no coinciden.';
    return;
  }

  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    passwordError.value = 'Completa todos los campos.';
    return;
  }

  try {
    passwordLoading.value = true;
    await updatePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
    );
    passwordSuccess.value = 'Contraseña actualizada.';
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error: any) {
    passwordError.value = error?.message ?? 'No se pudo cambiar la contraseña.';
  } finally {
    passwordLoading.value = false;
  }
};

const handleDeleteAccount = async () => {
  deleteError.value = '';
  const confirmed = window.confirm(
    '¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.',
  );
  if (!confirmed) {
    return;
  }

  try {
    deleteLoading.value = true;
    await deleteUser();
    authStore.doLogout();
    router.replace('/login');
  } catch (error: any) {
    deleteError.value = error?.message ?? 'No se pudo eliminar la cuenta.';
  } finally {
    deleteLoading.value = false;
  }
};
</script>

<style scoped>
.profile-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-buttons {
  justify-content: flex-end;
  margin-top: 1rem;
}

.feedback-text {
  display: block;
  margin-top: 0.75rem;
}

.danger-button {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .profile-container {
    max-width: 640px;
    margin: 0 auto;
  }
}
</style>
