# Views de la Aplicación Ionic

Este documento describe las views creadas para la aplicación Ionic de gestión de eventos.

## Estructura de Views

### 1. **LoginPage.vue** (`/login`)
- **Descripción**: Página de inicio de sesión y registro
- **Componente**: `LoginForm`
- **Características**:
  - Formulario de login
  - Formulario de registro
  - Cambio entre pestañas
  - Protección con `requiresGuest` (redirige a `/eventos` si ya está autenticado)

### 2. **EventosPage.vue** (`/eventos`)
- **Descripción**: Página principal con listado de eventos
- **Componente**: `ListaEventos`
- **Características**:
  - Lista de eventos del usuario
  - Filtros por categoría y búsqueda
  - Vista de lista y calendario
  - Paginación
  - Botón de logout en toolbar
  - Protegida con autenticación

### 3. **CrearEventoPage.vue** (`/eventos/crear`)
- **Descripción**: Página para crear nuevos eventos
- **Componente**: `FormularioEvento`
- **Características**:
  - Formulario de creación
  - Botón de retroceso
  - Validación de campos
  - Protegida con autenticación

### 4. **DetalleEventoPage.vue** (`/eventos/:id`)
- **Descripción**: Página para ver detalles de un evento específico
- **Componente**: `DetalleEvento`
- **Características**:
  - Vista completa del evento
  - Información detallada (categoría, prioridad, ubicación, fecha, etc.)
  - Botón de retroceso
  - Spinner de carga si no hay datos
  - Protegida con autenticación

### 5. **EditarEventoPage.vue** (`/eventos/:id/editar`)
- **Descripción**: Página para editar un evento existente
- **Componente**: `FormularioEvento` (con prop `evento`)
- **Características**:
  - Formulario pre-rellenado con datos del evento
  - Validación
  - Botón de retroceso
  - Spinner de carga si no hay datos
  - Protegida con autenticación

### 6. **AboutPage.vue** (`/about`)
- **Descripción**: Página con información sobre la aplicación
- **Componente**: `About`
- **Características**:
  - Información del proyecto
  - Botón de retroceso
  - Protegida con autenticación

## Rutas y Navegación

```typescript
/ → Redirige a /login
/login → LoginPage (requiresGuest)
/eventos → EventosPage (requiresAuth)
/eventos/crear → CrearEventoPage (requiresAuth)
/eventos/:id → DetalleEventoPage (requiresAuth)
/eventos/:id/editar → EditarEventoPage (requiresAuth)
/about → AboutPage (requiresAuth)
```

## Guards de Navegación

El router incluye guards para:
- **requiresAuth**: Redirige a `/login` si el usuario no está autenticado
- **requiresGuest**: Redirige a `/eventos` si el usuario ya está autenticado

## Componentes Ionic Utilizados

- `IonPage`: Contenedor principal de cada página
- `IonHeader`: Cabecera con toolbar
- `IonToolbar`: Barra de herramientas con título y botones
- `IonContent`: Contenido desplazable de la página
- `IonButtons`: Contenedor para botones en el toolbar
- `IonBackButton`: Botón de navegación hacia atrás
- `IonButton`: Botones de acción
- `IonIcon`: Iconos de Ionic
- `IonSpinner`: Indicador de carga

## Migracion de Vue a Ionic

Cada view encapsula un componente Vue original dentro de la estructura Ionic:
- **Estructura Ionic**: `IonPage`, `IonHeader`, `IonToolbar`, `IonContent`
- **Componente Vue**: El componente original se renderiza dentro de `IonContent`
- **Navegación**: Se utiliza `IonBackButton` y el router de Vue
- **Estilos**: Los estilos originales se mantienen, con ajustes para Ionic

## Próximos Pasos

Para completar la migración a Ionic:
1. Actualizar componentes para usar componentes Ionic donde sea apropiado
2. Adaptar estilos CSS a las variables de tema de Ionic
3. Implementar navegación con tabs o menú lateral si es necesario
4. Configurar Capacitor para compilar como app móvil
5. Probar en dispositivos móviles
