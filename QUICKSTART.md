# ⚡ Inicio Rápido - Plant Template

## 🚀 Instalación en 2 Pasos

### 1️⃣ Instalar Dependencias

```bash
yarn install
# o
npm install
```

### 2️⃣ Iniciar Servidor de Desarrollo

```bash
yarn dev
# o
npm run dev
```

🎉 **¡Listo!** Abre [http://localhost:5173](http://localhost:5173)

---

## 🎭 Modo Demo (Sin Backend Necesario)

La plantilla incluye **datos mockeados** listos para usar:

### Login Instantáneo
```
Email: admin@demo.com (o cualquier email)
Password: 123 (o cualquier password)
```

### ✅ Funcionalidades Demo
- ✅ Login/Registro funcional
- ✅ Dashboard completo
- ✅ Módulo de Usuarios con CRUD
- ✅ 5 usuarios de ejemplo precargados
- ✅ Crear, editar, eliminar usuarios
- ✅ Validaciones y notificaciones

📖 **Guía completa**: [MOCK_GUIDE.md](MOCK_GUIDE.md)

---

## 📱 Páginas Disponibles

Una vez iniciado el servidor, puedes acceder a:

- **Landing**: [http://localhost:5173](http://localhost:5173) - Página principal con animaciones
- **Login**: [http://localhost:5173/auth/login](http://localhost:5173/auth/login)
- **Registro**: [http://localhost:5173/auth/register](http://localhost:5173/auth/register)
- **Dashboard**: [http://localhost:5173/dashboard](http://localhost:5173/dashboard) *(requiere autenticación)*

---

## 🎨 Características Principales

### ✅ Landing Page Animada
- Animaciones con Framer Motion
- Diseño minimalista y responsive
- Secciones de características y CTA

### ✅ Sistema de Autenticación
- Login y registro funcionales
- Persistencia de sesión
- Rutas protegidas
- Estado global con Zustand

### ✅ Dashboard Base
- Layout con sidebar
- Componentes reutilizables
- Módulo de ejemplo (Home)
- Estadísticas y cards animados

### ✅ Componentes UI (shadcn/ui)
- Button (6 variantes)
- Input (con validación)
- Card (modular)
- Dialog (Modal accesible)
- Dropdown Menu
- Select
- Spinner (3 tamaños)
- Y más...

---

## 🔧 Próximos Pasos

### Crear tu Primer Módulo

1. **Crea la estructura de carpetas:**
```bash
mkdir -p src/modules/dashboard/mi-modulo/{components,hooks,pages,services,types}
```

2. **Define los tipos** en `types/mi-modulo.types.ts`

3. **Crea los servicios** en `services/mi-modulo.service.ts`

4. **Implementa hooks con React Query** en `hooks/useMiModulo.ts`

5. **Crea las vistas** en `pages/MiModulo.tsx`

6. **Agrega la ruta** en `src/core/routes/AppRoutes.tsx`

📖 **Guía completa**: Ver [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/ui/          # Componentes UI reutilizables
├── core/                   # Configuración y núcleo
│   ├── api/               # Cliente HTTP (Axios)
│   ├── routes/            # Rutas de la app
│   ├── store/             # Estado global (Zustand)
│   └── types/             # Tipos globales
├── modules/               # Módulos de la aplicación
│   ├── auth/              # Autenticación
│   ├── landing/           # Landing page
│   └── dashboard/         # Dashboard y módulos
└── shared/                # Recursos compartidos
    ├── components/        # Componentes compartidos
    ├── hooks/             # Hooks globales
    ├── layout/            # Layouts
    └── utils/             # Utilidades
```

---

## 📦 Tecnologías Incluidas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.2+ | Framework UI |
| TypeScript | 5.2+ | Tipado estático |
| Vite | 5.1+ | Build tool |
| Tailwind CSS | 3.4+ | Estilos |
| shadcn/ui | Latest | Componentes UI |
| Radix UI | Latest | Primitivos accesibles |
| React Query | 5.24+ | Estado del servidor |
| Zustand | 4.5+ | Estado global |
| Framer Motion | 11.0+ | Animaciones |
| React Router | 6.22+ | Navegación |
| Axios | 1.6+ | HTTP client |
| Sonner | 1.4+ | Notificaciones |

---

## 🎓 Recursos de Aprendizaje

### Documentación Oficial
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)

### Guías del Proyecto
- **[README.md](README.md)** - Documentación completa
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía de desarrollo
- **[CLAUDE.md](CLAUDE.md)** - Reglas y convenciones

---

## 💡 Tips Útiles

### Alias de Importación
```typescript
import { Button } from '@/components/ui/button';      // ✅
import { useAuthStore } from '@core/store/authStore'; // ✅
import MainLayout from '@shared/layout/MainLayout';   // ✅
```

### Convenciones de Código
```typescript
// ✅ camelCase para variables/funciones
const nombreUsuario = 'Juan';
const obtenerDatos = () => {};

// ✅ PascalCase para componentes
function MiComponente() {}

// ✅ UPPER_SNAKE_CASE para constantes
const API_BASE_URL = 'http://localhost:3000';
```

### React Query
```typescript
// ✅ Query para GET
const { data, isLoading } = useQuery({
  queryKey: ['usuarios'],
  queryFn: () => usuarioService.obtener(),
});

// ✅ Mutation para POST/PUT/DELETE
const mutation = useMutation({
  mutationFn: (payload) => usuarioService.crear(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['usuarios'] });
  },
});
```

---

## 🐛 Problemas Comunes

### Error: Cannot find module
```bash
# Reinstala las dependencias
rm -rf node_modules
yarn install
```

### Puerto 5173 en uso
```bash
# Vite usará automáticamente el siguiente puerto disponible
# O puedes especificar uno:
vite --port 3000
```

### Errores de TypeScript
```bash
# Los errores de tipos de React/axios son normales antes de instalar
# Ejecuta: yarn install
```

---

## 🚢 Build para Producción

```bash
# Crear build
yarn build

# Preview del build
yarn preview
```

Los archivos estarán en la carpeta `dist/`

---

## 📞 Soporte

¿Necesitas ayuda? 

1. Revisa la [documentación completa](README.md)
2. Consulta los [ejemplos](CONTRIBUTING.md)
3. Revisa las [reglas del proyecto](CLAUDE.md)

---

**¡Feliz desarrollo! 🎉**

