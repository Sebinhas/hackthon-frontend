# 🎭 Guía de Datos Mockeados - Plant Template

## ✅ Sistema de Mocks Implementado

La plantilla incluye un sistema completo de datos mockeados para probar la funcionalidad sin necesidad de un backend.

---

## 🎯 ¿Qué está Mockeado?

### ✅ Autenticación
- **Login**: Cualquier email/password funciona
- **Registro**: Crea un usuario simulado
- **Usuario por defecto**: `admin@demo.com`

### ✅ Módulo de Usuarios (CRUD Completo)
- **Listar usuarios**: 5 usuarios de ejemplo
- **Crear usuario**: Persiste en memoria durante la sesión
- **Editar usuario**: Actualiza datos en memoria
- **Eliminar usuario**: Remueve de la lista en memoria
- **Validaciones**: Email duplicado, campos requeridos

---

## 🚀 Uso Inmediato

### 1. **Login**
Accede con **cualquier credencial**:

```
Email: admin@demo.com
Password: cualquier_cosa
```

o

```
Email: test@test.com
Password: 123456
```

✅ **Funcionará con cualquier combinación**

### 2. **Usuarios Precargados**

```typescript
[
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'María García', email: 'maria@example.com', role: 'editor', status: 'active' },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com', role: 'user', status: 'active' },
  { id: '4', name: 'Ana Martínez', email: 'ana@example.com', role: 'user', status: 'inactive' },
  { id: '5', name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'editor', status: 'active' },
]
```

### 3. **Funcionalidades Disponibles**

✅ **Ver lista de usuarios** con tabla interactiva  
✅ **Buscar usuarios** por nombre  
✅ **Crear nuevo usuario** (se guarda en memoria)  
✅ **Editar usuario** existente  
✅ **Eliminar usuario** con confirmación  
✅ **Validación de email duplicado**  
✅ **Badges de rol y estado**  
✅ **Notificaciones toast** (éxito/error)  
✅ **Animaciones** con Framer Motion  

---

## ⚙️ Configuración

### Activar/Desactivar Mocks

#### Auth (Login/Registro)
```typescript
// src/modules/auth/services/authServices.ts
const USE_MOCK = true; // Cambiar a false para usar API real
```

#### Usuarios
```typescript
// src/modules/dashboard/usuarios/services/usuarios.service.ts
const USE_MOCK = true; // Cambiar a false para usar API real
```

### Conectar a Backend Real

1. **Desactivar mocks**:
   ```typescript
   const USE_MOCK = false;
   ```

2. **Configurar URL del backend** en `.env`:
   ```env
   VITE_API_URL=https://tu-backend.com/api
   ```

3. **Endpoints esperados**:
   ```
   POST /auth/login
   POST /auth/register
   POST /auth/logout
   GET /users
   GET /users/:id
   POST /users
   PATCH /users/:id
   DELETE /users/:id
   ```

---

## 📝 Características del Mock

### Persistencia
- ✅ Los datos persisten durante la sesión del navegador
- ✅ Se reinician al recargar la página
- ✅ Los usuarios nuevos se mantienen en memoria

### Validaciones
- ✅ Email duplicado al crear/editar
- ✅ Usuario no encontrado (404)
- ✅ Campos requeridos en formularios

### Delays Realistas
```typescript
obtenerUsuarios: 300ms
obtenerUsuario: 300ms
crearUsuario: 500ms
actualizarUsuario: 500ms
eliminarUsuario: 400ms
login/register: 500ms
```

### Notificaciones
- ✅ Toast de éxito al crear/editar/eliminar
- ✅ Toast de error en validaciones
- ✅ Feedback visual inmediato

---

## 🎨 Personalizar Datos Mock

### Agregar más usuarios

Edita `src/shared/mocks/mockData.ts`:

```typescript
export const mockUsuarios: Usuario[] = [
  // ... usuarios existentes
  {
    id: '6',
    name: 'Tu Nombre',
    email: 'tu@email.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

### Cambiar usuario por defecto

```typescript
export const mockAuthUser: User = {
  id: '1',
  name: 'Tu Nombre',
  email: 'tu@email.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};
```

### Modificar delays

Edita `src/shared/mocks/mockService.ts`:

```typescript
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));
```

---

## 🧪 Escenarios de Prueba

### Crear Usuario
1. Ve a **Usuarios** en el sidebar
2. Click en **"Nuevo Usuario"**
3. Llena el formulario
4. ✅ Verifica que aparece en la tabla

### Editar Usuario
1. Click en **"•••"** en la tabla
2. Selecciona **"Editar"**
3. Modifica campos
4. ✅ Verifica cambios en la tabla

### Eliminar Usuario
1. Click en **"•••"** en la tabla
2. Selecciona **"Eliminar"**
3. Confirma en el modal
4. ✅ Verifica que desaparece

### Validación de Email Duplicado
1. Intenta crear usuario con email existente
2. ✅ Debe mostrar error: "El email ya está en uso"

### Búsqueda
1. Escribe en el campo de filtro
2. ✅ La tabla se filtra en tiempo real

---

## 🔄 Arquitectura del Mock

```
src/shared/mocks/
├── mockData.ts         # Datos iniciales
└── mockService.ts      # Lógica CRUD en memoria
```

### Flujo
```
Componente → Hook (React Query) → Service → Mock Service → Datos en memoria
```

### Ventajas
✅ **No requiere backend**  
✅ **Delays realistas**  
✅ **Validaciones completas**  
✅ **Fácil de cambiar a API real**  
✅ **Perfecto para demos**  
✅ **Desarrollo rápido**  

---

## 🚀 Comandos para Probar

```bash
# Iniciar servidor
yarn dev

# Acceder a la app
http://localhost:5175

# Hacer login con cualquier credencial
Email: admin@demo.com
Password: 123

# Ir a Usuarios
http://localhost:5175/dashboard/usuarios
```

---

## 📚 Próximos Pasos

1. ✅ Prueba toda la funcionalidad con mocks
2. 🔧 Desarrolla tu backend
3. 🔄 Cambia `USE_MOCK = false`
4. 🌐 Configura `VITE_API_URL`
5. 🚀 ¡Listo para producción!

---

**¡Disfruta probando el sistema completo sin necesidad de backend! 🎉**


