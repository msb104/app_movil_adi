import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import EventosPage from '../views/EventosPage.vue'
import CrearEventoPage from '../views/CrearEventoPage.vue'
import DetalleEventoPage from '../views/DetalleEventoPage.vue'
import EditarEventoPage from '../views/EditarEventoPage.vue'
import AboutPage from '../views/AboutPage.vue'
import UserProfilePage from '../views/UserProfilePage.vue'
import { useAuthStore } from '@/stores/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: UserProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/eventos',
    name: 'Eventos',
    component: EventosPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/eventos/crear',
    name: 'CrearEvento',
    component: CrearEventoPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/eventos/:id',
    name: 'DetalleEvento',
    component: DetalleEventoPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/eventos/:id/editar',
    name: 'EditarEvento',
    component: EditarEventoPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/eventos')
  } else {
    next()
  }
})

export default router
