# Guía de Inicio - App Móvil ADI

## 🚀 Pasos para ejecutar el proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo (Frontend)
En otra terminal, ejecuta:
```bash
npm run dev
```

Esto iniciará el servidor de Vite, normalmente en `http://localhost:5173`

### 3. Abrir la aplicación
Abre tu navegador y ve a la URL que muestra Vite (generalmente `http://localhost:5173`)

## 📱 Estructura del Proyecto

### Views Ionic
- **LoginPage** (`/login`) - Autenticación
- **EventosPage** (`/eventos`) - Lista de eventos
- **CrearEventoPage** (`/eventos/crear`) - Crear evento
- **DetalleEventoPage** (`/eventos/:id`) - Ver detalles
- **EditarEventoPage** (`/eventos/:id/editar`) - Editar evento
- **AboutPage** (`/about`) - Información

### Componentes Vue
- `LoginForm.vue` - Formulario de login/registro
- `ListaEventos.vue` - Lista con filtros y paginación
- `FormularioEvento.vue` - Crear/editar eventos
- `DetalleEvento.vue` - Vista detallada de evento
- `About.vue` - Información de la app

### Stores (Pinia)
- `authStore.js` - Gestión de autenticación
- `eventStore.js` - Gestión de eventos (CRUD)

### Backend
- PocketBase en una máquina virtual de Azure
- Servicios en `src/backend/services/`

## 🔧 Tecnologías

- **Vue 3** - Framework frontend
- **Ionic Vue** - Componentes móviles
- **Pinia** - Gestión de estado
- **Vue Router** - Navegación
- **PocketBase** - Backend y base de datos
- **Vite** - Build tool

## 📝 Acceso a PocketBase Admin

Una vez iniciado PocketBase, puedes acceder al panel de administración en:
`http://20.240.219.184:8090/_/`

## ⚠️ Solución de Problemas

### Error: "No se pudo iniciar sesión"
- Asegúrate de que la base de datos de PocketBase tenga usuarios creados
- Puedes crear usuarios desde el panel de administración de PocketBase

### Warnings de TypeScript
Los warnings sobre módulos `.js` son normales porque los stores están en JavaScript.
No afectan la funcionalidad de la aplicación.
