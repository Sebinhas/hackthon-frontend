# 🌱 AgroSyner - Sistema de Gestión Agrícola de Precisión

Sistema completo y moderno para la gestión de fincas, lotes y plantas con visualización en mapas interactivos, validación avanzada de datos CSV y agricultura de precisión mediante Google Maps API.

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

## ✨ Características Principales

- 🗺️ **Visualización de Mapas Interactivos** - Integración completa con Google Maps API para visualizar fincas, lotes y spots
- 📊 **Gestión Completa de Fincas y Lotes** - Sistema CRUD completo con interfaz intuitiva
- 🌿 **Gestión de Spots y Plantas** - Visualización detallada y gestión de plantas individuales en cada lote
- 📤 **Validación Avanzada de CSV** - Sistema robusto de carga, validación y procesamiento de archivos CSV con:
  - Detección de coordenadas duplicadas
  - Validación de líneas y posiciones por lote
  - Verificación de lotes válidos por finca
  - Generación automática de reportes de errores
  - Descarga de archivos CSV procesados
- 🎯 **Tour Guiado Interactivo** - Sistema de onboarding con Driver.js para nuevos usuarios
- 🔄 **Integración con Sioma API** - Envío automático y sincronización de datos
- 📈 **Dashboard con Estadísticas** - Visualización de métricas y gráficos en tiempo real
- 🔐 **Autenticación Segura** - Sistema completo de login/registro con rutas protegidas y persistencia de sesión
- 🎨 **UI Moderna y Accesible** - Componentes shadcn/ui basados en Radix UI con diseño responsive
- ⚡ **Alto Rendimiento** - React Query para caché inteligente y sincronización optimizada
- 📱 **Diseño Responsive** - Completamente adaptable a dispositivos móviles y tablets
- 🌙 **Experiencia de Usuario Mejorada** - Notificaciones toast, animaciones fluidas y feedback visual

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
- **Framer Motion 11.0.5** - Animaciones fluidas y transiciones
- **Lucide React 0.344.0** - Iconos SVG modernos
- **Recharts 3.3.0** - Gráficos y visualizaciones de datos
- **Driver.js 1.3.6** - Tour guiado interactivo para onboarding

### Formularios y Validación
- **React Hook Form 7.65.0** - Gestión de formularios
- **Zod 4.1.12** - Validación de esquemas
- **@hookform/resolvers 5.2.2** - Integración React Hook Form + Zod

### Utilidades
- **PapaParse 5.5.3** - Procesamiento y parsing de archivos CSV
- **ExcelJS 4.4.0** - Generación y lectura de archivos Excel
- **Sonner 1.4.0** - Sistema de notificaciones toast elegantes
- **class-variance-authority** - Gestión de variantes de componentes
- **clsx & tailwind-merge** - Utilidades para clases CSS condicionales

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

- **Node.js** 18.0.0 o superior
- **Yarn** 1.22.0 o superior (recomendado) o npm 9.0.0+
- **Git** para control de versiones
- Cuenta de **Google Cloud Platform** con Maps JavaScript API habilitada (opcional para mapas)
- Backend API compatible corriendo (ver sección de Configuración)

## 🚀 Instalación Rápida

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd hackthon-frontend
```

### 2. Instalar dependencias

Con Yarn (recomendado):
```bash
yarn install
```

Con npm:
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en el ejemplo:

```env
# API Backend Principal (REQUERIDO)
VITE_API_URL=http://localhost:5000/api

# Google Maps API Key (OPCIONAL - solo para visualización de mapas)
# Obtén tu API key en: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui

# Sioma API (OPCIONAL - solo si usas integración con Sioma)
VITE_SIOMA_API_URL=https://plantizador.sioma.dev/api/v1
```

> **💡 Tip**: El proyecto funcionará sin Google Maps API Key, pero la visualización de mapas estará limitada.

### 4. Iniciar el servidor de desarrollo

```bash
yarn dev
```

🎉 **¡Listo!** La aplicación estará disponible en `http://localhost:5173`

### 5. (Opcional) Construir para producción

```bash
yarn build
yarn preview  # Para previsualizar el build
```

## ⚙️ Configuración

### Configuración de Google Maps API

Para habilitar la visualización de mapas interactivos:

1. **Crear proyecto en Google Cloud**
   - Accede a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Habilitar APIs necesarias**
   - Maps JavaScript API
   - Places API (opcional, para búsquedas)

3. **Crear credenciales**
   - Navega a "APIs & Services" → "Credentials"
   - Crea una API Key
   - (Recomendado) Restringe la key a tu dominio

4. **Configurar en el proyecto**
   - Agrega la key en `.env` como `VITE_GOOGLE_MAPS_API_KEY`

### Configuración del Backend

El frontend se conecta a una API backend REST. Requisitos:

**Endpoints esperados:**
- `POST /auth/login` - Autenticación de usuarios
- `POST /auth/register` - Registro de nuevos usuarios
- `GET /api/v1/fincas` - Listado de fincas
- `GET /api/v1/lotes` - Listado de lotes
- `POST /api/v1/spots` - Creación de spots
- Y más... (ver documentación de cada módulo)

**Configuración:**
- Asegúrate de que el backend esté corriendo en el puerto configurado
- Las rutas deben coincidir con las definidas en los servicios
- El sistema de autenticación debe usar JWT o compatible
- CORS debe estar configurado para permitir requests del frontend

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
│       ├── hooks/
│       │   └── useTour.ts              # Hook para tour guiado
│       ├── layout/
│       │   ├── MainLayout.tsx          # Layout principal
│       │   ├── AuthLayout.tsx          # Layout de autenticación
│       │   └── DashboardLayout.tsx     # Layout del dashboard con tour
│       ├── mocks/
│       │   ├── mockData.ts             # Datos mock para desarrollo
│       │   └── mockService.ts          # Servicios mock
│       └── utils/
│           ├── cn.ts                   # Utilidad para clases CSS condicionales
│           └── persistence.ts          # Persistencia de datos en localStorage
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

**Validaciones implementadas:**
- ✅ Formato correcto de coordenadas (latitud/longitud con punto decimal)
- ✅ Detección de coordenadas duplicadas en todo el archivo
- ✅ Validación de combinaciones únicas línea+palma por lote
- ✅ Verificación de lotes válidos según la finca seleccionada
- ✅ Detección y eliminación automática de filas completamente duplicadas
- ✅ Validación de campos vacíos y rangos de coordenadas
- ✅ Generación de reporte detallado de errores en formato CSV

**Características adicionales:**
- Descarga de plantilla CSV con formato correcto
- Previsualización de datos antes del procesamiento
- Transformación automática de datos al formato requerido
- Generación de nombres únicos para spots y plantas
- Integración con API de Sioma para envío automático

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
- Listado de usuarios con tabla interactiva
- Creación y edición de usuarios con formularios validados
- Gestión de roles y permisos
- Avatares dinámicos con iniciales
- Estados visuales (activo/inactivo)

### 🎯 Tour Guiado Interactivo

Sistema de onboarding automático para nuevos usuarios usando Driver.js.

**Características:**
- Tour automático en el primer ingreso
- Explicación de cada módulo del sistema
- Botón de ayuda flotante para reiniciar el tour
- Navegación paso a paso con progreso visual
- Solo visible en escritorio (≥1024px)
- Persistencia en localStorage para no repetir

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
- [React Query (TanStack Query)](https://tanstack.com/query/latest) - Gestión de estado del servidor
- [Zustand](https://zustand-demo.pmnd.rs/) - Estado global ligero
- [React Router](https://reactrouter.com/) - Enrutamiento declarativo
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI accesibles
- [Framer Motion](https://www.framer.com/motion/) - Animaciones avanzadas
- [React Hook Form](https://react-hook-form.com/) - Formularios performantes
- [Zod](https://zod.dev/) - Validación de esquemas
- [Driver.js](https://driverjs.com/) - Tours guiados interactivos
- [PapaParse](https://www.papaparse.com/) - Procesamiento de CSV

### APIs Externas
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. **Fork** el proyecto
2. **Crea una rama** para tu feature 
   ```bash
   git checkout -b feature/NuevaCaracteristica
   ```
3. **Commit** tus cambios siguiendo las convenciones
   ```bash
   git commit -m 'feat: Agrega nueva característica X'
   ```
4. **Push** a la rama
   ```bash
   git push origin feature/NuevaCaracteristica
   ```
5. **Abre un Pull Request** con descripción detallada

### Convenciones de Código

- Seguir las reglas de ESLint configuradas
- Usar TypeScript para todo el código nuevo
- Nombrar componentes en PascalCase
- Nombrar archivos/funciones en camelCase
- Documentar funciones complejas
- Escribir código legible y mantenible

### Estructura de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autores y Agradecimientos

- **Equipo de Desarrollo** - Desarrollo inicial y mantenimiento
- **Comunidad Open Source** - Por las increíbles herramientas utilizadas

## 📧 Soporte y Contacto

¿Tienes preguntas o necesitas ayuda?

- 📧 Email: soporte@agrosyner.com
- 🐛 Reporta bugs en: [GitHub Issues](https://github.com/tu-repo/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/tu-repo/discussions)

## 🗺️ Roadmap

### Próximas características

- [ ] Módulo de reportes avanzados con exportación PDF
- [ ] Sistema de notificaciones en tiempo real
- [ ] Integración con drones para captura de imágenes
- [ ] App móvil nativa (React Native)
- [ ] Modo offline con sincronización
- [ ] Análisis de suelos con ML
- [ ] Dashboard de analíticas avanzadas

## 📊 Estado del Proyecto

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

**Hecho con ❤️ para la agricultura de precisión**

¡Feliz codificación! 🚀🌱
