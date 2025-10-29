# 🌱 Plantizador - Sistema de Gestión de Fincas y Lotes

Sistema moderno para la gestión de fincas, lotes, plantas y spots con visualización en mapas interactivos usando Google Maps API.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Principales](#-módulos-principales)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Variables de Entorno](#-variables-de-entorno)
- [Recursos](#-recursos)

## ✨ Características

- 🗺️ **Visualización de Mapas** - Integración completa con Google Maps API
- 📊 **Gestión de Fincas y Lotes** - CRUD completo para fincas y lotes
- 🌿 **Gestión de Spots y Plantas** - Visualización y gestión de plantas en lotes
- 📤 **Carga de Archivos CSV** - Validación y procesamiento de archivos CSV
- 🔄 **Integración con Sioma** - Envío automático de datos a Sioma API
- 📈 **Dashboard con Estadísticas** - Gráficos y estadísticas de fincas y lotes
- 🔐 **Autenticación Completa** - Sistema de login/registro con rutas protegidas
- 🎨 **UI Moderna** - Componentes shadcn/ui con diseño responsive
- ⚡ **Rendimiento Optimizado** - React Query para caché y sincronización de datos
- 📱 **Responsive自适应** - Diseño adaptable a dispositivos móviles

## 🛠️ Tecnologías

### Core
- **React 18.2.0** - Biblioteca de UI
- **TypeScript 5.2.2** - Tipado estático
- **Vite 5.1.4** - Build tool y dev server
- **React Router DOM 6.22.0** - Enrutamiento

### Estado y Datos
- **@tanstack/react-query 5.24.1** - Gestión de estado del servidor y caché
- **Zustand 4.5.0** - Estado global cliente
- **Axios 1.6.7** - Cliente HTTP

### UI y Estilos
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI accesibles basados en Radix UI
- **Framer Motion 11.0.5** - Animaciones fluidw
- **Lucide React 0.344.0** - Iconos SVG
- **Recharts 3.3.0** - Gráficos y visualizaciones

### Formularios y Validación
- **React Hook Form 7.65.0** - Gestión de formularios
- **Zod 4.1.12** - Validación de esquemas
- **@hookform/resolvers 5.2.2** - Integración React Hook Form + Zod

### Utilidades
- **PapaParse 5.5.3** - Procesamiento de CSV
- **ExcelJS 4.4.0** - Generación y lectura de Excel
- **Sonner 1.4.0** - Notificaciones toast

### Radix UI (shadcn/ui)
- `@radix-ui/react-dialog` - Modales accesibles
- `@radix-ui/react-dropdown-menu` - Menús desplegables
- `@radix-ui/react-select` - Select personalizado
- `@radix-ui/react-label` - Labels accesibles
- `@radix-ui/react-tabs` - Sistema de pestañas
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-checkbox` - Checkboxes
- `@radix-ui/react-switch` - Switches
- `@radix-ui/react-separator` - Separadores

### DevDependencies
- **TypeScript** - Tipado estático
- **ESLint** - Linter para calidad de código
- **PostCSS & Autoprefixer** - Procesamiento CSS
- **Tailwind CSS Animate** - Animaciones de Tailwind
- **@types/google.maps** - Tipos para Google Maps
- **@types/papaparse** - Tipos para PapaParse

## 📦 Prerrequisitos

- **Node.js** 18 o superior
- **Yarn** (recomendado) o npm
- Cuenta de **Google Cloud Platform** con API de Maps habilitada (opcional, para desarrollo local)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd hackthon-frontend
```

### 2. Instalar dependencias con Yarn

```bash
yarn install
```

> **Nota**: Si prefieres usar npm, ejecuta `npm install` en su lugar.

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Backend
VITE_API_URL=http://localhost:5000/api

# Google Maps API Key (opcional, necesario para mapas)
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui

# Sioma API (opcional, solo si usas integración con Sioma)
VITE_SIOMA_API_URL=https://plantizador.sioma.dev/api/v1
```

### 4. Iniciar el servidor de desarrollo

```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Google Maps API

Para usar la visualización de mapas, necesitas:

1. Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar la API de Maps JavaScript
3. Crear una API Key
4. Agregar la key en `.env` como `VITE_GOOGLE_MAPS_API_KEY`

### API Backend

El proyecto está configurado para conectarse a un backend en `VITE_API_URL`. Asegúrate de que:

- El backend esté corriendo
- Las rutas coincidan con las esperadas
- El sistema de autenticación sea compatible

## 📜 Scripts Disponibles

```bash
# Desarrollo
yarn dev              # Inicia servidor de desarrollo en http://localhost:5173

# Producción
yarn build            # Construye la app para producción
yarn preview          # Preview del build de producción en servidor local

# Calidad de código
yarn lint             # Ejecuta ESLint para verificar calidad del código
```

## 📁 Estructura del Proyecto

```
hackthon-frontend/
├── src/
│   ├── assets/                      # Recursos estáticos (imágenes, fuentes)
│   │   ├── auth/                    # Imágenes de autenticación
│   │   └── landing/                 # Imágenes de landing page
│   │
│   ├── components/                  # Componentes UI reutilizables
│   │   └── ui/                      # Componentes shadcn/ui base
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   │
│   ├── config/                      # Configuraciones
│   │   └── googleMaps.ts            # Configuración de Google Maps
│   │
│   ├── core/                        # Núcleo de la aplicación
│   │   ├── api/                     # Configuración de API
│   │   │   └── useConfigApi.ts      # Cliente Axios configurado
│   │   ├── routes/                  # Configuración de rutas
│   │   │   ├── AppRoutes.tsx        # Definición de rutas
│   │   │   ├── ProtectedRoute.tsx   # Rutas protegidas
│   │   │   └── PublicRoute.tsx      # Rutas públicas
│   │   ├── store/                   # Estado global (Zustand)
│   │   │   └── authStore.ts         # Store de autenticación
│   │   └── types/                   # Tipos globales
│   │       ├── api.types.ts
│   │       └── auth.types.ts
│   │
│   ├── modules/                     # Módulos de funcionalidad
│   │   ├── auth/                    # Módulo de autenticación
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useRegister.ts
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   └── services/
│   │   │       └── authServices.ts
│   │   │
│   │   ├── dashboard/               # Módulos del dashboard
│   │   │   ├── Dashboard.tsx        # Dashboard principal
│   │   │   │
│   │   │   ├── fincas/              # Módulo de fincas
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── types/
│   │   │   │
│   │   │   ├── lotes/               # Módulo de lotes
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── types/
│   │   │   │
│   │   │   ├── mapa/                # Módulo de mapas
│   │   │   │   ├── components/
│   │   │   │   │   ├── MapaReal.tsx         # Componente principal del mapa
│   │   │   │   │   ├── VistaLotesMapa.tsx   # Vista completa de lotes en mapa
│   │   │   │   │   ├── SpotsRenderer.tsx    # Renderizado de spots
│   │   │   │   │   └── ...
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useFincasLotes.ts    # Hooks para fincas y lotes
│   │   │   │   │   └── ...
│   │   │   │   ├── services/
│   │   │   │   │   ├── coordenadas.service.ts  # Servicio de coordenadas
│   │   │   │   │   └── sioma.service.ts        # Servicio de integración Sioma
│   │   │   │   ├── types/
│   │   │   │   │   └── lotes.types.ts
│   │   │   │   └── utils/
│   │   │   │       └── spotGenerator.ts
│   │   │   │
│   │   │   ├── usuarios/            # Módulo de usuarios
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── types/
│   │   │   │
│   │   │   └── home/                # Módulo de home/dashboard
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── pages/
│   │   │
│   │   ├── landing/                 # Landing page
│   │   │   └── pages/
│   │   │       └── Landing.tsx
│   │   │
│   │   └── uploadFile/              # Módulo de carga de CSV
│   │       ├── components/
│   │       │   ├── UploadForm.tsx
│   │       │   ├── CsvPreview.tsx
│   │       │   └── ValidationSummary.tsx
│   │       ├── hooks/
│   │       │   └── useUploadFile.ts
│   │       ├── pages/
│   │       │   └── UploadFile.tsx
│   │       ├── services/
│   │       │   └── uploadFile.service.ts(lotes)
│   │       ├── types/
│   │       │   └── uploadFile.types.ts
│   │       └── utils/
│   │           ├── csvValidator.ts      # Validación de CSV
│   │           └── csvGenerator.ts      # Generación de CSV
│   │
│   └── shared/                      # Recursos compartidos
│       ├── components/
│       │   └── DataTable.tsx           # Tabla de datos reutilizable
│       ├── layout/
│       │   ├── MainLayout.tsx          # Layout principal
│       │   ├── AuthLayout.tsx          # Layout de autenticación
│       │   └── DashboardLayout.tsx     # Layout del dashboard
│       ├── mocks/
│       │   ├── mockData.ts             # Datos mock
│       │   └── mockService.ts          # Servicios mock
│       └── utils/
│           ├── cn.ts                  # Utilidad para clases CSS
│           └── persistence.ts         # Persistencia de datos
│
├── public/                          # Archivos públicos
├── index.html                       # HTML principal
├── package.json                     # Dependencias y scripts
├── vite.config.ts                   # Configuración de Vite
├── tailwind.config.js               # Configuración de Tailwind
├── tsconfig.json                    # Configuración de TypeScript
└── .env                             # Variables de entorno (crear)
```

## 🎯 Módulos Principales

### 🗺️ Módulo de Mapas (`dashboard/mapa`)

Sistema completo de visualización de fincas, lotes y spots en mapas interactivos.

**Funcionalidades:**
- Visualización de lotes como polígonos en Google Maps
- Renderizado de spots (plantas) con marcadores personalizados
- Visualización de líneas conectando spots
- Selección interactiva de lotes y spots
- InfoWindows con información detallada
- Zoom y navegación completa del mapa
- Integración con URL state para compartir enlaces

**Componentes principales:**
- `MapaReal.tsx` - Componente principal del mapa con Google Maps
- `VistaLotesMapa.tsx` - Vista completa con selector de fincas y tabs
- `SpotsRenderer.tsx` - Renderizado optimizado de spots y líneas

**Servicios:**
- `coordenadas.service.ts` - Obtiene coordenadas de lotes desde API
- `sioma.service.ts` - Envía datos procesados a Sioma API

### 📤 Módulo de Carga de CSV (`uploadFile`)

Sistema completo para validación, previsualización y envío de archivos CSV.

**Funcionalidades:**
- Carga de archivos CSV con validación
- Validación de formato, coordenadas y datos duplicados
- Previsualización de datos antes de envío
- Generación de CSV procesado para descarga
- Integración con Sioma para envío automático
- Transformación de datos según formato requerido

**Validaciones:**
- Formato de coordenadas (latitud/longitud)
- Coordenadas duplicadas
- Combinaciones de línea+palma duplicadas
- Lotes válidos para la finca seleccionada

### 🏢 Módulo de Fincas (`dashboard/fincas`)

Gestión CRUD completa de fincas.

**Funcionalidades:**
- Listado de fincas con filtros
- Creación y edición de fincas
- Visualización en tablas interactivas

### 📍 Módulo de Lotes (`dashboard/lotes`)

Gestión CRUD completa de lotes.

**Funcionalidades:**
- Listado de lotes por finca
- Creación y edición de lotes
- Asociación de coordenadas geográficas
- Visualización de información detallada

### 👥 Módulo de Usuarios (`dashboard/usuarios`)

Gestión CRUD completa de usuarios del sistema.

**Funcionalidades:**
- Listado de usuarios
- Creación y edición de usuarios
- Gestión de roles y permisos

## 💻 Uso

### Autenticación

```typescript
// El sistema de autenticación está integrado en toda la aplicación
// Las rutas protegidas requieren login automáticamente
```

### Uso de React Query

```typescript
import { useObtenerFincas } from '@/modules/dashboard/fincas/hooks/useFincas';

function MiComponente() {
  const { data: fincas, isLoading, error } = useObtenerFincas();
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <div>{/* Renderizar fincas */}</div>;
}
```

### Uso de Google Maps

```typescript
import { MapaReal } from '@/modules/dashboard/mapa/components/MapaReal';

function MiComponente() {
  const lotes = [...]; // Tus lotes
  
  return (
    <MapaReal
      lotes={lotes}
      height="600px"
      onLoteClick={(lote) => console.log('Lote seleccionado:', lote)}
      mostrarLeyenda={true}
    />
  );
}
```

### Carga de CSV

```typescript
import UploadFile from '@/modules/uploadFile/pages/UploadFile';

function MiComponente() {
  const [fincaId, setFincaId] = useState<number | null>(null);
  
  return (
    <UploadFile
      fincaId={fincaId}
      onValidationSuccess={(data) => {
        console.log('CSV validado:', data);
      }}
      onClearValidation={() => {
        console.log('Validación limpiada');
      }}
    />
  );
}
```

## 🏗️ Arquitectura

### Patrón de Módulos

Cada módulo sigue esta estructura estándar:

```
modules/[nombre-modulo]/
├── components/       # Componentes específicos del módulo
├── hooks/           # Hooks con lógica del módulo (Siempre .ts)
│   ├── use[Modulo].ts           # Hooks React Query base
│   ├── useCreate[Modulo].ts     # Hook para creación
│   └── useEdit[Modulo].ts       # Hook para edición
├── pages/           # Vistas/páginas (UI solamente)
├── services/        # Servicios de API
└── types/           # Tipos e interfaces del módulo
```

### Estado Global

**Zustand** para estado cliente (autenticación, UI):
```typescript
import { useAuthStore } from '@/core/store/authStore';

const { user, isAuthenticated, setAuth } = useAuthStore();
```

**React Query** para estado del servidor (datos):
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
});
```

### Aliases de Importación

Configurados en `vite.config.ts`:

```typescript
@/           → src/
@components  → src/components
@modules     → src/modules
@core        → src/core
@shared      → src/shared
```

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
# API Backend Principal
VITE_API_URL=http://localhost:5000/api

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui

# Sioma API (opcional)
VITE_SIOMA_API_URL=https://plantizador.sioma.dev/api/v1
```

## 📚 Recursos y Documentación

### Documentación Principal
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Librerías Clave
- [React Query (TanStack Query)](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### APIs Externas
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

¡Feliz codificación! 🚀
