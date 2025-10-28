# Plantilla de Reglas Globales - React + Vite + TypeScript + Tailwind

Lea siempre este archivo al inicio de una nueva conversación para comprender la arquitectura, los objetivos, el estilo y las limitaciones del proyecto. Utilice convenciones de nomenclatura consistentes, estructura de archivos y patrones de arquitectura, y utilice yarn para la gestión de dependencias.

## 🧱 Estructura y modularidad del código

Nunca cree un archivo de más de 500 líneas de código. Si un archivo se acerca a este límite, refactorícelo dividiéndolo en componentes más pequeños o hooks personalizados.

Organice el código en módulos claramente separados, siguiendo esta estructura objetivo:

```
src/
├── assets/                     # Recursos estáticos
│   ├── fonts/                  # Tipografías
│   ├── images/                 # Imágenes
│   ├── icons/                  # Iconos
│   └── videos/                 # Videos
│
├── components/                 # Componentes reutilizables (agnósticos de dominio)
│   └── ui/                     # Componentes básicos de UI
│       ├── Button/
│       ├── Input/
│       └── ...
│
├── core/                       # Núcleo de la aplicación
│   ├── api/                    # Configuración/conexión de la API
│   ├── routes/                 # Configuración de rutas
│   ├── store/                  # Estados globales
│   │   ├── authStore.ts
│   │   └── userStore.ts
│   └── types/                  # Tipado e interfaces del core
│       ├── api.types.ts
│       └── auth.types.ts
│
├── modules/                    # Módulos de dominio (feature folders)
│   ├── auth/                   # Ejemplo: módulo de autenticación
│   │   ├── components/         # Componentes específicos del módulo
│   │   ├── pages/              # Vistas del módulo
│   │   ├── hooks/              # Lógica específica del módulo
│   │   ├── services/           # Servicios del modulo
│   │   └── types/              # Tipado del módulo
│   └── dashboard/              # Módulos del dashboard (backoffice)
│       ├── [ModuloNombre]/     # Ejemplo: modulo de prueba
│       │   ├── components/     # Componentes específicos del módulo
│       │   ├── pages/          # Vistas del módulo
│       │   ├── hooks/          # Hooks con React Query del módulo
│       │   ├── services/       # Servicios del módulo
│       │   └── types/          # Tipado del módulo
│       └── [OtroModulo]/       # Otros módulos del dashboard
│           ├── components/
│           ├── pages/
│           ├── hooks/
│           ├── services/
│           └── types/
│
└── shared/                     # Recursos compartidos globales
    ├── components/             # Componentes compartidos personalizados
    │   ├── Table/
    │   └── Modal/
    ├── hooks/                  # Hooks globales
    ├── layout/                 # Layouts de la aplicación
    │   ├── MainLayout.tsx
    │   ├── AuthLayout.tsx
    └── utils/                  # Utilidades y funciones generales
        ├── formatters.ts
        ├── validators.ts

```

Para componentes complejos, organice así:

- [Module].tsx - Nomenclatura de vistas principales (/pages)
- ComponentName.tsx - Nomenclatura de Componentes (/components)
- [Module]Types.ts - Nomenclatura de los tipados e interfaces del módulo (Un solo feature de tipado por módulo) (/types)
- use[Module]Name.ts - Hook del componente (o use[Module].ts para el hook principal) (/hooks)
- [Module]Services.ts - Nomenclatura de los servicios (/services)

**Estructura de Módulos del Dashboard:**
- Cada módulo dentro de `dashboard/` debe seguir la estructura completa (components, hooks, pages, services, types)
- Ejemplo: `modules/dashboard/plans/` contiene el módulo de planes con toda su estructura
- Los módulos del dashboard son independientes entre sí y comparten solo los recursos en `shared/`

### 📋 Estructura Estándar de Módulos del Dashboard

Todos los módulos del dashboard deben seguir esta estructura base:

```
src/modules/dashboard/[ModuloNombre]/
├── components/                      # Componentes específicos del módulo
│   └── [Modulo]CellTemplates.tsx   # Plantillas de celdas para tablas
├── hooks/                           # Hooks del módulo (siempre .ts)
│   ├── use[Modulo].ts              # Hooks React Query base + lógica de lista
│   ├── useCreate[Modulo].ts        # Hook para página de creación
│   └── useEdit[Modulo].ts          # Hook para página de edición
├── services/                        # Servicios del módulo
│   └── [modulo].service.ts         # Servicios de API del módulo
├── types/                           # Tipado del módulo
│   └── [modulo].types.ts           # Interfaces y tipos del módulo
└── pages/                           # Páginas del módulo
    ├── [Modulo].tsx                # Página principal (lista)
    ├── Create[Modulo].tsx          # Página de creación
    ├── Edit[Modulo].tsx            # Página de edición
    └── Form[Modulo].tsx            # Formulario compartido
```

**Reglas importantes:**
- Los hooks **SIEMPRE** deben ser archivos `.ts` (nunca `.tsx`)
- Si necesitas usar componentes en hooks, llámalos como funciones: `Component({ prop: value })`
- Cada hook de página debe estar en su propio archivo para mejor organización
- El hook principal (`use[Modulo].ts`) contiene los hooks de React Query base y la lógica de la página de lista

### 🎯 Ejemplo Práctico: Módulo de Usuarios

```
src/modules/dashboard/usuarios/
├── components/
│   └── UsuariosCellTemplates.tsx   # Componentes: AvatarCell, StatusCell, RoleCell, ActionsCell
├── hooks/
│   ├── useUsuarios.ts              # Hooks React Query base + lógica de lista
│   │   ├── useObtenerUsuarios()    # Query para obtener todos
│   │   ├── useObtenerUsuario()     # Query para obtener uno
│   │   ├── useCrearUsuario()       # Mutation para crear
│   │   ├── useActualizarUsuario()  # Mutation para actualizar
│   │   ├── useEliminarUsuario()    # Mutation para eliminar
│   │   └── useUsuariosPage()       # Lógica de página de lista
│   ├── useCreateUsuarios.ts        # Hook de página de creación
│   │   └── useCreateUsuariosPage()
│   └── useEditUsuarios.ts          # Hook de página de edición
│       └── useEditUsuariosPage()
├── services/
│   └── usuarios.service.ts         # API: obtenerUsuarios, crearUsuario, etc.
├── types/
│   └── usuarios.types.ts           # Interfaces: Usuario, UsuarioPayload, etc.
└── pages/
    ├── Usuarios.tsx                # Página de lista con DataTable
    ├── CreateUsuarios.tsx          # Página de creación
    ├── EditUsuarios.tsx            # Página de edición
    └── FormUsuarios.tsx            # Formulario compartido
```

### 📝 Convenciones de Nomenclatura para Módulos

- **Carpetas**: `[ModuloNombre]` en camelCase (ej: `usuarios`, `productos`, `pedidos`)
- **Hooks**: 
  - `use[Modulo].ts` - Hook principal con React Query base + lógica de lista
  - `useCreate[Modulo].ts` - Hook de página de creación
  - `useEdit[Modulo].ts` - Hook de página de edición
  - **IMPORTANTE**: Siempre `.ts` nunca `.tsx`
- **Servicios**: `[modulo].service.ts` en camelCase
- **Tipos**: `[modulo].types.ts` en camelCase
- **Páginas**: `[Modulo].tsx` en PascalCase (ej: `Usuarios.tsx`, `CreateUsuarios.tsx`)
- **Componentes**: `[ComponentName].tsx` en PascalCase
- **Componentes de Tabla**: `[Modulo]CellTemplates.tsx` (ej: `UsuariosCellTemplates.tsx`)

### 🔄 Patrones de Implementación para Módulos

#### 1. **Hook Principal (use[Modulo].ts)**
Contiene los hooks de React Query base y la lógica de la página de lista.

```typescript
// Ejemplo: useUsuarios.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usuariosService } from '../services/usuarios.service';
import { Usuario, UsuarioPayload } from '../types/usuarios.types';
import {
  ActionsCell,
  StatusCell,
  AvatarCell,
} from '../components/UsuariosCellTemplates';

// Hooks React Query Base
export const useObtenerUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosService.obtenerUsuarios(),
  });
};

export const useObtenerUsuario = (id: string) => {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosService.obtenerUsuario(id),
    enabled: !!id,
  });
};

export const useCrearUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UsuarioPayload) => usuariosService.crearUsuario(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UsuarioPayload> }) =>
      usuariosService.actualizarUsuario(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useEliminarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosService.eliminarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Hook de Página Principal (Lista)
export const useUsuariosPage = () => {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading } = useObtenerUsuarios();
  const eliminarUsuario = useEliminarUsuario();
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<string | null>(null);

  const handleEdit = (usuario: Usuario) => {
    navigate(`/dashboard/usuarios/edit/${usuario.id}`);
  };

  const handleDeleteConfirm = () => {
    if (usuarioAEliminar) {
      eliminarUsuario.mutate(usuarioAEliminar);
      setUsuarioAEliminar(null);
    }
  };

  // ⚠️ IMPORTANTE: Usar componentes como funciones, NO JSX
  // Esto permite que el hook sea .ts en lugar de .tsx
  const columns = [
    {
      key: 'name',
      header: 'Usuario',
      render: (usuario: Usuario) => AvatarCell({ usuario }),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (usuario: Usuario) => StatusCell({ status: usuario.status }),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (usuario: Usuario) =>
        ActionsCell({
          usuario,
          onEdit: handleEdit,
          onDelete: setUsuarioAEliminar,
        }),
    },
  ];

  return {
    usuarios,
    isLoading,
    columns,
    usuarioAEliminar,
    setUsuarioAEliminar,
    handleDeleteConfirm,
    isDeleting: eliminarUsuario.isPending,
  };
};
```

**Reglas para este hook:**
- ✅ Siempre usar extensión `.ts` (no `.tsx`)
- ✅ Usar componentes como funciones: `Component({ prop: value })`
- ✅ Exportar hooks de React Query para reutilizarlos en otros hooks
- ✅ Incluir hook de página de lista con toda su lógica

#### 2. **Hook de Página de Creación (useCreate[Modulo].ts)**
Lógica específica para la página de creación.

```typescript
// Ejemplo: useCreateUsuarios.ts
import { useNavigate } from 'react-router-dom';
import { useCrearUsuario } from './useUsuarios';

export const useCreateUsuariosPage = () => {
  const navigate = useNavigate();
  const crearUsuario = useCrearUsuario();

  const handleSubmit = (data: any) => {
    const { confirmPassword, ...payload } = data;
    crearUsuario.mutate(payload, {
      onSuccess: () => {
        navigate('/dashboard/usuarios');
      },
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/usuarios');
  };

  return {
    handleSubmit,
    handleCancel,
    isLoading: crearUsuario.isPending,
  };
};
```

#### 3. **Hook de Página de Edición (useEdit[Modulo].ts)**
Lógica específica para la página de edición.

```typescript
// Ejemplo: useEditUsuarios.ts
import { useNavigate } from 'react-router-dom';
import { useObtenerUsuario, useActualizarUsuario } from './useUsuarios';

export const useEditUsuariosPage = (id: string) => {
  const navigate = useNavigate();
  const { data: usuario, isLoading: isLoadingUsuario } = useObtenerUsuario(id);
  const actualizarUsuario = useActualizarUsuario();

  const handleSubmit = (data: any) => {
    const { password, confirmPassword, ...payload } = data;
    
    actualizarUsuario.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate('/dashboard/usuarios');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/dashboard/usuarios');
  };

  return {
    usuario,
    isLoadingUsuario,
    handleSubmit,
    handleCancel,
    isUpdating: actualizarUsuario.isPending,
  };
};
```

#### 4. **Servicios (modulo.service.ts)**
```typescript
// Ejemplo: plans.service.ts
import { api } from '@/core/api/useConfigApi';

export const obtenerPlanes = async () => {
  try {
    const response = await api.get('/plan');
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const crearPlan = async (payload: PlanPayload) => {
  try {
    const response = await api.post('/plan', payload);
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const actualizarPlan = async (id: string, payload: any) => {
  try {
    const response = await api.patch(`/plan/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const eliminarPlan = async (id: string) => {
  try {
    const response = await api.delete(`/plan/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};
```

#### 5. **Página Principal ([Modulo].tsx)**
Las páginas deben ser solo UI, toda la lógica está en los hooks.

```typescript
// Ejemplo: Usuarios.tsx
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/DataTable';
import { useUsuariosPage } from '../hooks/useUsuarios';

export default function Usuarios() {
  const {
    usuarios,
    isLoading,
    columns,
    usuarioAEliminar,
    setUsuarioAEliminar,
    handleDeleteConfirm,
    isDeleting,
  } = useUsuariosPage();

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
        <Button onClick={() => navigate('/dashboard/usuarios/create')}>
          <Plus className="mr-2" />
          Añadir Usuario
        </Button>
      </div>
      
      <DataTable
        data={usuarios}
        columns={columns}
        filterPlaceholder="Filtrar por nombre..."
      />

      {/* Modal de confirmación de eliminación */}
      <Dialog open={!!usuarioAEliminar} onOpenChange={() => setUsuarioAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsuarioAEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

#### 6. **Página de Creación (Create[Modulo].tsx)**
```typescript
// Ejemplo: CreateUsuarios.tsx
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormUsuarios from './FormUsuarios';
import { useCreateUsuariosPage } from '../hooks/useCreateUsuarios';

export default function CreateUsuarios() {
  const { handleSubmit, handleCancel, isLoading } = useCreateUsuariosPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Usuario</h1>
          <p className="text-muted-foreground mt-1">
            Agrega un nuevo usuario al sistema
          </p>
        </div>
      </div>

      <FormUsuarios onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
```

#### 7. **Página de Edición (Edit[Modulo].tsx)**
```typescript
// Ejemplo: EditUsuarios.tsx
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import FormUsuarios from './FormUsuarios';
import { useEditUsuariosPage } from '../hooks/useEditUsuarios';

export default function EditUsuarios() {
  const { id } = useParams<{ id: string }>();
  const {
    usuario,
    isLoadingUsuario,
    handleSubmit,
    handleCancel,
    isUpdating,
  } = useEditUsuariosPage(id!);

  if (isLoadingUsuario) {
    return <Spinner size="lg" className="h-64" />;
  }

  if (!usuario) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Usuario</h1>
          <p className="text-muted-foreground mt-1">
            Modifica la información del usuario
          </p>
        </div>
      </div>

      <FormUsuarios
        initialData={usuario}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        isEdit
      />
    </div>
  );
}
```

#### 8. **Configuración de Rutas**
```typescript
// En routes.tsx - AppRoutes.tsx
<Route path="/dashboard/usuarios" element={<Usuarios />} />
<Route path="/dashboard/usuarios/create" element={<CreateUsuarios />} />
<Route path="/dashboard/usuarios/edit/:id" element={<EditUsuarios />} />
```

---

### ✅ Resumen de Mejores Prácticas para Módulos

#### **Estructura de Archivos:**
1. **Hooks siempre `.ts`** - Nunca `.tsx`, usar componentes como funciones
2. **3 archivos de hooks separados**:
   - `use[Modulo].ts` - Hooks React Query base + lógica de lista
   - `useCreate[Modulo].ts` - Hook de página de creación
   - `useEdit[Modulo].ts` - Hook de página de edición
3. **Páginas solo UI** - Toda la lógica debe estar en hooks
4. **Un solo archivo de tipos** - `[modulo].types.ts` por módulo
5. **Un solo archivo de servicios** - `[modulo].service.ts` por módulo

#### **Código en Hooks:**
```typescript
// ✅ CORRECTO - Componentes como funciones en hooks
render: (usuario: Usuario) => AvatarCell({ usuario })
render: (usuario: Usuario) => StatusCell({ status: usuario.status })

// ❌ INCORRECTO - JSX en hooks
render: (usuario: Usuario) => <AvatarCell usuario={usuario} />
render: (usuario: Usuario) => <StatusCell status={usuario.status} />
```

#### **Imports en Páginas:**
```typescript
// ✅ CORRECTO - Cada página importa su propio hook
import { useUsuariosPage } from '../hooks/useUsuarios';
import { useCreateUsuariosPage } from '../hooks/useCreateUsuarios';
import { useEditUsuariosPage } from '../hooks/useEditUsuarios';

// ❌ INCORRECTO - Todo desde un solo archivo
import { useUsuariosPage, useCreateUsuariosPage, useEditUsuariosPage } from '../hooks/useUsuarios';
```

#### **Reutilización de Hooks:**
```typescript
// Los hooks base se reutilizan en hooks de página
// useCreateUsuarios.ts
import { useCrearUsuario } from './useUsuarios';

// useEditUsuarios.ts
import { useObtenerUsuario, useActualizarUsuario } from './useUsuarios';
```

### 🎨 Componentes Compartidos

Todos los módulos deben usar los componentes compartidos disponibles en `shared/`:

- **DataTable**: Para mostrar listas con filtros y paginación
- **Button**: Botones consistentes con el diseño
- **Input, Textarea, Select**: Formularios estandarizados
- **Dialog, Sheet**: Modales y paneles deslizantes
- **Badge, Progress**: Elementos de estado y progreso

## 📎 Estilo y convenciones

Utilice TypeScript como lenguaje principal.
Siga las reglas de ESLint y Prettier configuradas en el proyecto.
Utilice Tailwind CSS para estilos, evitando CSS personalizado innecesario.

### 🎯 **ESTÁNDARES DE CÓDIGO OBLIGATORIOS**

#### **Punto y Coma (SEMICOLON) - OBLIGATORIO**
- **SIEMPRE** usar punto y coma al final de cada declaración, importación, función, variable, etc.
- **NUNCA** omitir punto y coma, incluso en JavaScript moderno

#### **camelCase - OBLIGATORIO**
- **SIEMPRE** usar camelCase para variables y funciones
- **NUNCA** usar snake_case, kebab-case o PascalCase para variables/funciones
- Ejemplos:
  ```typescript
  // ✅ CORRECTO
  const nombreCompleto = 'Juan Pérez';
  const calcularValorTotal = () => {};
  const listaUsuarios = [];

  // ❌ INCORRECTO
  const nombre_completo = 'Juan Pérez';
  const calcular-valor-total = () => {};
  const ListaUsuarios = [];
  ```

#### **Nombres Descriptivos - OBLIGATORIO**
- **SIEMPRE** usar nombres descriptivos y claros
- **NUNCA** usar letras sueltas, números o caracteres mínimos
- **EVITAR** nombres ambiguos como `x`, `temp`, `data`, `i`, `j`, `n`, `obj`
- Ejemplos:
  ```typescript
  // ✅ CORRECTO
  const usuarioAutenticado = true;
  const listaProductos = [];
  const fechaCreacion = new Date();
  const contadorIntentos = 0;

  // ❌ INCORRECTO
  const x = true;
  const temp = [];
  const data = new Date();
  const n = 0;
  const obj = {};
  ```

#### **Estructura de Funciones - OBLIGATORIO**
- **SIEMPRE** seguir estructura **verbo + objeto** para funciones
- Ejemplos:
  ```typescript
  // ✅ CORRECTO
  const calcularTotal = () => {};
  const enviarNotificacion = () => {};
  const obtenerUsuario = () => {};
  const validarFormulario = () => {};

  // ❌ INCORRECTO
  const total = () => {};
  const notificacion = () => {};
  const usuario = () => {};
  ```

#### **Declaración de Variables - OBLIGATORIO**
- **PRIORIZAR** `const` por defecto
- **USAR** `let` solo cuando sea estrictamente necesario reasignar
- **NUNCA** usar `var`
- Ejemplos:
  ```typescript
  // ✅ CORRECTO
  const nombreUsuario = 'Juan';
  const listaProductos = [];
  let contador = 0; // Solo cuando necesites reasignar
  contador++;

  // ❌ INCORRECTO
  var nombreUsuario = 'Juan';
  let nombreUsuario = 'Juan'; // Cuando no necesitas reasignar
  ```

#### **Comentarios - OBLIGATORIO**
- **EVITAR** comentarios obvios que no aporten valor
- **SOLO** comentar funciones grandes, robustas o lógica compleja no obvia
- **NUNCA** comentar código simple o autoexplicativo
- Ejemplos:
  ```typescript
  // ✅ CORRECTO - Comentario útil
  // Calcular el hash SHA-256 para verificar integridad del archivo
  const calcularHashArchivo = (contenido: string) => {
    // Implementación compleja de hash...
  };

  // ✅ CORRECTO - Sin comentario obvio
  const nombreUsuario = 'Juan';
  const listaProductos = [];

  // ❌ INCORRECTO - Comentario obvio innecesario
  // Asignar nombre de usuario
  const nombreUsuario = 'Juan';
  // Crear lista de productos
  const listaProductos = [];
  // Incrementar contador
  contador++;
  ```

### Convenciones de nomenclatura:

- Componentes: PascalCase (ej: UserProfile.tsx)
- Archivos/funciones: camelCase (ej: fetchUserData.ts)
- Constantes: UPPER_SNAKE_CASE (ej: API_BASE_URL)
- CSS classes: kebab-case (siguiendo Tailwind)

Utilice interfaces TypeScript para props y tipos de datos:

```typescript
interface UserProfileProps {
  user: User;
  onEdit?: () => void;
}
```

## 🔗 Aliases de importación (vite.config.ts)

Están configurados los siguientes aliases para importaciones absolutas:

- `@` → `src/`
- `@components` → `src/components`
- `@modules` → `src/modules`
- `@core` → `src/core`
- `@shared` → `src/shared`

Ejemplos:

```ts
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/shared/layout";
import { createAuthSlice } from "@/core/store/authStore";
import { AuthPage } from "@/modules/auth/pages/AuthPage";
```

## 📚 Documentación y explicabilidad

Actualizar README.md cuando se agregan nuevas funciones, dependencias cambian o se modifican los pasos de configuración.

Comente código no obvio y asegúrese de que todo sea comprensible para un desarrollador de nivel medio.
Al escribir lógica compleja, añadir comentarios `// Reason:` explicando el por qué, no sólo el qué.

## ⚛️ Reglas específicas de React

Utilice hooks personalizados para lógica reutilizable.
Mantenga componentes puros cuando sea posible.
Utilice React.memo() para optimización cuando sea necesario.
Evite prop drilling - use Context API / Zustand estado global para datos compartidos.
Utilice Suspense para carga lazy de componentes.
Prefiera composition sobre inheritance.

## 🔄 React Query (TanStack Query)

React Query se utiliza para manejo de estado del servidor, caché y sincronización de datos.

### Configuración

Configurar el QueryClient en el provider de la aplicación:

```typescript
// En main.tsx o App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});
```

### Convenciones de uso:

- **SIEMPRE** usar React Query para peticiones a APIs y datos del servidor
- **NUNCA** usar useState para datos que provienen del servidor
- **NOMBRAR** queries con prefijo `use` seguido de lo que obtiene: `useGetUsuarios`, `useGetProductos`
- **NOMBRAR** mutations con prefijo `use` seguido de la acción: `useCreateUsuario`, `useUpdateProducto`

### Estructura de hooks con React Query:

Los hooks deben ubicarse dentro del módulo correspondiente: `modules/dashboard/[ModuloNombre]/hooks/`

```typescript
// ✅ CORRECTO - Hook de consulta (query)
export const useGetUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => obtenerUsuarios(),
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ CORRECTO - Hook de mutación (mutation)
export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (nuevoUsuario: UsuarioDto) => crearUsuario(nuevoUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};
```

### Directrices:

- Usar `queryKey` descriptivos y consistentes para facilitar invalidación
- Invalidar queries relacionadas después de mutaciones exitosas
- Usar `select` para transformar datos cuando sea necesario
- Manejar estados de loading y error correctamente en componentes
- Agrupar queries relacionadas por entidad (ej: `['usuarios']`, `['usuarios', usuarioId]`)

### Ejemplo de estructura de servicios:

Los servicios deben ubicarse dentro del módulo correspondiente: `modules/dashboard/[ModuloNombre]/services/`

```typescript
// En modules/dashboard/usuarios/services/UsuarioServices.ts
import { api } from '@/core/api/useConfigApi';

export const UsuarioServices = {
  obtenerUsuarios: async (): Promise<Usuario[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  crearUsuario: async (usuario: UsuarioDto): Promise<Usuario> => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  actualizarUsuario: async (id: string, usuario: UsuarioDto): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  eliminarUsuario: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};
```

## 🎨 Reglas de Tailwind CSS

Utilice clases de Tailwind en lugar de CSS personalizado.
Extraiga componentes cuando las clases se repitan mucho.
Use el archivo tailwind.config.js para personalizar el tema.

## 🔧 Reglas específicas de Vite

Utilice Hot Module Replacement (HMR) para desarrollo eficiente.
Configure aliases en vite.config.ts para importaciones limpias.
Optimice el bundle configurando code splitting cuando sea necesario.

## 🧠 Reglas de comportamiento de la IA

Nunca asuma que falta contexto. Haga preguntas si no está seguro.
Nunca alucine librerías o APIs – utilice únicamente paquetes npm conocidos y verificados.
Confirme siempre las rutas de los archivos y nombres de componentes antes de hacer referencia a ellos.
Nunca elimine ni sobrescriba código existente a menos que se le indique explícitamente
Siempre proporcione tipos TypeScript para nuevas funciones y componentes.
Verifique compatibilidad de dependencias con la versión de React y otras librerías del proyecto.
