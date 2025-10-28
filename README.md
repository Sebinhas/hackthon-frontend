# 🌱 Plant Template - React + Vite + TypeScript + Tailwind

Una plantilla moderna, minimalista y lista para producción para construir aplicaciones web con React, TypeScript, Vite y Tailwind CSS.

## ✨ Características

- ⚡ **Vite** - Build tool ultrarrápido
- ⚛️ **React 18** - La última versión de React
- 🔷 **TypeScript** - Tipado estático para mayor seguridad
- 🎨 **Tailwind CSS** - Framework CSS utility-first
- 🎭 **Framer Motion** - Animaciones fluidas y profesionales
- 🔄 **React Query** - Gestión de estado del servidor
- 🐻 **Zustand** - Estado global simple y eficiente
- 🧭 **React Router** - Navegación declarativa
- 📦 **Axios** - Cliente HTTP configurado
- 🎯 **ESLint** - Linter para calidad de código
- 🔐 **Autenticación** - Sistema completo de auth implementado
- ✨ **shadcn/ui** - Componentes UI con Radix UI y accesibilidad

## 📁 Estructura del Proyecto

```
plant-template/
├── src/
│   ├── assets/                 # Recursos estáticos
│   ├── components/             # Componentes reutilizables
│   │   └── ui/                 # Componentes UI base
│   ├── core/                   # Núcleo de la aplicación
│   │   ├── api/                # Configuración de API
│   │   ├── routes/             # Configuración de rutas
│   │   ├── store/              # Estados globales (Zustand)
│   │   └── types/              # Tipos globales
│   ├── modules/                # Módulos de la aplicación
│   │   ├── auth/               # Módulo de autenticación
│   │   ├── landing/            # Landing page
│   │   └── dashboard/          # Dashboard y módulos
│   └── shared/                 # Recursos compartidos
│       ├── components/         # Componentes compartidos
│       ├── hooks/              # Hooks personalizados
│       ├── layout/             # Layouts de la aplicación
│       └── utils/              # Utilidades y constantes
├── public/                     # Archivos públicos
├── index.html                  # HTML principal
├── package.json                # Dependencias
├── vite.config.ts             # Configuración de Vite
├── tailwind.config.js         # Configuración de Tailwind
└── tsconfig.json              # Configuración de TypeScript
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- Yarn (recomendado) o npm

### Instalación

1. **Clonar o descargar el proyecto:**

```bash
git clone <tu-repositorio>
cd plant-template
```

2. **Instalar dependencias:**

```bash
yarn install
# o
npm install
```

3. **Iniciar el servidor de desarrollo:**

```bash
yarn dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 🎭 Modo Demo (Sin Backend)

La plantilla incluye **datos mockeados** para probar sin backend:

```bash
# Login con cualquier credencial
Email: admin@demo.com
Password: cualquier_cosa

# Funcionalidades disponibles:
✅ Login/Registro
✅ Dashboard
✅ Módulo de Usuarios (CRUD completo)
```

📖 Ver [MOCK_GUIDE.md](MOCK_GUIDE.md) para más información

### 🌐 Conectar a Backend Real

1. Desactiva mocks en los servicios (`USE_MOCK = false`)
2. Configura `.env`:

```env
VITE_API_URL=https://tu-backend.com/api
```

### Scripts Disponibles

```bash
# Desarrollo
yarn dev              # Inicia servidor de desarrollo

# Producción
yarn build            # Construye para producción
yarn preview          # Preview del build de producción

# Calidad de código
yarn lint             # Ejecuta ESLint
```

## 🏗️ Arquitectura

### Módulos

La aplicación está organizada en módulos independientes dentro de `src/modules/`. Cada módulo sigue esta estructura:

```
modules/[nombre-modulo]/
├── components/       # Componentes específicos
├── hooks/           # Hooks con lógica del módulo
├── pages/           # Vistas/páginas
├── services/        # Servicios de API
└── types/           # Tipos del módulo
```

### Estado Global (Zustand)

El estado global se gestiona con Zustand en `src/core/store/`:

```typescript
import { useAuthStore } from '@/core/store/authStore';

// En tu componente
const { user, isAuthenticated } = useAuthStore();
```

### Rutas

Las rutas se configuran en `src/core/routes/AppRoutes.tsx`. Las rutas protegidas utilizan el componente `ProtectedRoute`.

### API Client

La configuración de Axios está en `src/core/api/useConfigApi.ts`. Incluye:
- Interceptores para tokens de autenticación
- Manejo automático de errores 401
- Headers configurados

## 🎨 Componentes UI con shadcn/ui

La plantilla incluye componentes de **shadcn/ui** basados en Radix UI en `src/components/ui/`:

### Componentes Disponibles

- **Button** - Botón con 6 variantes (default, destructive, outline, secondary, ghost, link)
- **Input** - Input con label y validación de errores
- **Card** - Tarjeta modular con header, title, description, content y footer
- **Dialog** - Modal accesible con overlay
- **Dropdown Menu** - Menú desplegable con submenús
- **Select** - Select personalizable
- **Label** - Etiqueta accesible para formularios
- **Separator** - Separador horizontal/vertical
- **Spinner** - Indicador de carga

### Ejemplo de uso:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function MiComponente() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Email" type="email" />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Abrir Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar acción</DialogTitle>
            </DialogHeader>
            <p>¿Estás seguro de continuar?</p>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
```

📖 **Para más información:** Ver [SHADCN_GUIDE.md](SHADCN_GUIDE.md)

## 🔐 Autenticación

El sistema de autenticación está implementado con:

- **Login/Registro** - Páginas completas con formularios
- **Estado persistente** - Usa localStorage
- **Rutas protegidas** - Middleware de protección
- **Interceptores** - Manejo automático de tokens

### Flujo de autenticación:

```typescript
import { useAuthStore } from '@/core/store/authStore';

function Login() {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const handleLogin = async (credentials) => {
    const { user, token } = await authServices.login(credentials);
    setAuth(user, token);
  };
}
```

## 🎭 Animaciones con Framer Motion

La landing page incluye ejemplos de animaciones con Framer Motion:

```tsx
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

function Componente() {
  return (
    <motion.div variants={fadeInUp}>
      Contenido animado
    </motion.div>
  );
}
```

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Funciones/Variables**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Archivos**: camelCase para archivos, PascalCase para componentes

### TypeScript

- Siempre usa interfaces para props y tipos
- Evita `any`, usa tipos específicos
- Aprovecha el autocompletado con tipos

### Estilos y Componentes

- Usa componentes de **shadcn/ui** para UI consistente
- Usa clases de Tailwind CSS para estilos personalizados
- Usa la función `cn()` para clases condicionales

```tsx
import { cn } from '@/shared/utils/cn';
import { Button } from '@/components/ui/button';

<Button className={cn(
  'w-full',
  isLoading && 'opacity-50'
)}>
  Guardar
</Button>
```

## 🔧 Configuración

### Aliases de Importación

Los siguientes aliases están configurados:

```typescript
@/           → src/
@components  → src/components
@modules     → src/modules
@core        → src/core
@shared      → src/shared
```

### Tailwind

Personaliza el tema en `tailwind.config.js`. La plantilla incluye:
- Colores primarios configurados
- Animaciones personalizadas
- Utilidades extendidas

## 📚 Recursos

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de shadcn/ui](https://ui.shadcn.com/)
- [Documentación de Framer Motion](https://www.framer.com/motion/)
- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Plant Template - Una plantilla moderna para React

---

¡Feliz codificación! 🚀

