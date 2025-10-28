# 🤝 Guía de Contribución - Plant Template

## 🎯 Crear un Nuevo Módulo en el Dashboard

Esta guía te mostrará cómo crear un nuevo módulo siguiendo la arquitectura de la plantilla.

### Paso 1: Crear la Estructura de Carpetas

```bash
src/modules/dashboard/[nombre-modulo]/
├── components/       # Componentes específicos del módulo
├── hooks/           # Hooks con lógica del módulo
├── pages/           # Vistas del módulo
├── services/        # Servicios de API
└── types/           # Tipos TypeScript
```

### Paso 2: Definir Tipos

Crea `types/[modulo].types.ts`:

```typescript
export interface MiItem {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'inactivo';
  creadoEn: string;
}

export interface MiItemPayload {
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'inactivo';
}
```

### Paso 3: Crear Servicios

Crea `services/[modulo].service.ts`:

```typescript
import { api } from '@/core/api/useConfigApi';
import { MiItem, MiItemPayload } from '../types/[modulo].types';

export const miModuloService = {
  obtenerItems: async (): Promise<MiItem[]> => {
    try {
      const response = await api.get<MiItem[]>('/mi-ruta');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener items');
    }
  },

  crearItem: async (payload: MiItemPayload): Promise<MiItem> => {
    try {
      const response = await api.post<MiItem>('/mi-ruta', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear item');
    }
  },

  actualizarItem: async (id: string, payload: MiItemPayload): Promise<MiItem> => {
    try {
      const response = await api.patch<MiItem>(`/mi-ruta/${id}`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar item');
    }
  },

  eliminarItem: async (id: string): Promise<void> => {
    try {
      await api.delete(`/mi-ruta/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar item');
    }
  },
};
```

### Paso 4: Crear Hooks con React Query

Crea `hooks/use[Modulo].ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { miModuloService } from '../services/[modulo].service';
import { MiItemPayload } from '../types/[modulo].types';

export const useObtenerItems = () => {
  return useQuery({
    queryKey: ['mi-modulo'],
    queryFn: () => miModuloService.obtenerItems(),
  });
};

export const useCrearItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: MiItemPayload) => miModuloService.crearItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-modulo'] });
      toast.success('Item creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useActualizarItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MiItemPayload }) => 
      miModuloService.actualizarItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-modulo'] });
      toast.success('Item actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useEliminarItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => miModuloService.eliminarItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-modulo'] });
      toast.success('Item eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
```

### Paso 5: Crear Vista Principal

Crea `pages/[Modulo].tsx`:

```typescript
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { useObtenerItems } from '../hooks/use[Modulo]';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function MiModulo() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useObtenerItems();

  if (isLoading) {
    return <Spinner size="lg" className="h-64" />;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mi Módulo</h1>
        <Button onClick={() => navigate('/dashboard/mi-modulo/crear')}>
          <Plus className="w-5 h-5 mr-2" />
          Crear Nuevo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <Card key={item.id} hover>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">{item.nombre}</h3>
              <p className="text-gray-600 mt-2">{item.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
```

### Paso 6: Agregar Rutas

Actualiza `src/core/routes/AppRoutes.tsx`:

```typescript
import MiModulo from '@/modules/dashboard/mi-modulo/pages/MiModulo';

// Dentro de las rutas del Dashboard
<Route path="mi-modulo" element={<MiModulo />} />
```

## 📝 Estándares de Código

### ✅ Convenciones Obligatorias

1. **Punto y coma**: SIEMPRE usar al final de cada declaración
2. **camelCase**: Para variables y funciones
3. **PascalCase**: Para componentes y tipos
4. **Nombres descriptivos**: Evitar abreviaturas y nombres genéricos

### ❌ Qué Evitar

```typescript
// ❌ MAL
const x = getData();
let temp = [];
const n = 0;

// ✅ BIEN
const usuarioAutenticado = obtenerUsuarioActual();
const listaProductos = [];
const contadorIntentos = 0;
```

### 🎨 Estilos con Tailwind

```typescript
// ✅ BIEN - Usar clases de Tailwind
<div className="flex items-center gap-4 p-6 bg-white rounded-lg" />

// ❌ MAL - CSS personalizado innecesario
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} />
```

### 🔄 React Query vs useState

```typescript
// ❌ MAL - useState para datos del servidor
const [usuarios, setUsuarios] = useState([]);
useEffect(() => {
  fetch('/api/usuarios').then(res => setUsuarios(res));
}, []);

// ✅ BIEN - React Query
const { data: usuarios } = useQuery({
  queryKey: ['usuarios'],
  queryFn: () => usuarioService.obtenerUsuarios(),
});
```

## 🧪 Testing (Opcional)

Si decides agregar tests, usa:
- **Vitest** - Framework de testing
- **Testing Library** - Para componentes React

## 📚 Recursos Adicionales

- Revisa `CLAUDE.md` para todas las reglas del proyecto
- Consulta el módulo `example` como referencia
- Mantén la consistencia con el código existente

## 🤝 Pull Requests

1. Crea una rama descriptiva: `feature/nuevo-modulo-usuarios`
2. Sigue las convenciones de commits: `feat: agregar módulo de usuarios`
3. Actualiza la documentación si es necesario
4. Asegúrate de que no hay errores de linter

---

¡Gracias por contribuir a Plant Template! 🚀


