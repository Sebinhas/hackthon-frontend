# 🎨 Guía de shadcn/ui - Plant Template

## ✅ Implementación Completada

shadcn/ui ha sido completamente integrado en la plantilla. Todos los componentes están listos para usar.

---

## 📦 Componentes Disponibles

### Componentes Base

#### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamaños
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Variantes:**
- `default` - Botón primario (azul)
- `destructive` - Botón de destrucción (rojo)
- `outline` - Botón con borde
- `secondary` - Botón secundario (gris)
- `ghost` - Botón transparente
- `link` - Estilo de enlace

#### Input
```tsx
import { Input } from '@/components/ui/input';

<Input 
  label="Email" 
  type="email" 
  placeholder="tu@email.com" 
/>

<Input 
  label="Password" 
  type="password" 
  error="Contraseña incorrecta" 
/>
```

**Props especiales:**
- `label` - Etiqueta del input
- `error` - Mensaje de error (muestra borde rojo)

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card hover>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido de la tarjeta
  </CardContent>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

**Props especiales:**
- `hover` - Añade efecto hover con sombra

#### Label
```tsx
import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

### Componentes Avanzados

#### Dialog (Modal)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>¿Estás seguro?</DialogTitle>
      <DialogDescription>
        Esta acción no se puede deshacer.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button variant="destructive">Eliminar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Uso con estado:**
```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  {/* ... */}
</Dialog>
```

#### Dropdown Menu
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Abrir</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Perfil</DropdownMenuItem>
    <DropdownMenuItem>Configuración</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Con acciones:**
```tsx
<DropdownMenuItem onClick={() => console.log('Click')}>
  <User className="mr-2 h-4 w-4" />
  Perfil
</DropdownMenuItem>
```

#### Select
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
    <SelectItem value="option2">Opción 2</SelectItem>
    <SelectItem value="option3">Opción 3</SelectItem>
  </SelectContent>
</Select>
```

**Con estado controlado:**
```tsx
const [value, setValue] = useState('');

<Select value={value} onValueChange={setValue}>
  {/* ... */}
</Select>
```

#### Separator
```tsx
import { Separator } from '@/components/ui/separator';

<div>
  <p>Sección 1</p>
  <Separator className="my-4" />
  <p>Sección 2</p>
</div>

// Vertical
<div className="flex h-5 items-center">
  <span>Inicio</span>
  <Separator orientation="vertical" className="mx-2" />
  <span>Acerca de</span>
</div>
```

#### Spinner (Custom)
```tsx
import { Spinner } from '@/components/ui/spinner';

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

---

## 🎨 Sistema de Temas

### Variables CSS

El sistema de colores de shadcn/ui usa variables CSS personalizables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 199.43 89.13% 48.04%;
  --primary-foreground: 210 40% 98%;
  /* ... más variables */
}
```

### Modo Oscuro

Para habilitar el modo oscuro, agrega la clase `dark` al elemento `<html>`:

```tsx
// Ejemplo con botón toggle
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  document.documentElement.classList.toggle('dark', isDark);
}, [isDark]);

<Button onClick={() => setIsDark(!isDark)}>
  {isDark ? '☀️' : '🌙'}
</Button>
```

---

## 🛠️ Personalización

### Modificar Colores

Edita `src/index.css`:

```css
:root {
  --primary: 199.43 89.13% 48.04%; /* Cambiar color primario */
  --radius: 0.5rem; /* Cambiar radio de bordes */
}
```

### Crear Variantes Personalizadas

```tsx
// En tu componente
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/shared/utils/cn';

<Link
  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
  href="/login"
>
  Iniciar Sesión
</Link>
```

---

## 📝 Patrones Comunes

### Formulario Completo
```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full">Entrar</Button>
      </CardContent>
    </Card>
  );
}
```

### Modal de Confirmación
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function DeleteConfirmation({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar elemento?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El elemento será eliminado permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Menú de Usuario
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut } from 'lucide-react';

function UserMenu({ user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🎯 Tips y Buenas Prácticas

### 1. Usa `asChild` para Composición
```tsx
// ✅ Bueno - Button como Link
<Button asChild>
  <Link to="/dashboard">Dashboard</Link>
</Button>

// ❌ Malo - Button dentro de Link
<Link to="/dashboard">
  <Button>Dashboard</Button>
</Link>
```

### 2. Combina con Framer Motion
```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <Button>Animado</Button>
</motion.div>
```

### 3. Usa `cn()` para Clases Condicionales
```tsx
import { cn } from '@/shared/utils/cn';
import { Button } from '@/components/ui/button';

<Button 
  className={cn(
    "w-full",
    isLoading && "opacity-50 cursor-not-allowed"
  )}
>
  Guardar
</Button>
```

---

## 📚 Recursos

- [Documentación oficial de shadcn/ui](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Próximos Pasos

Para agregar más componentes de shadcn/ui:

```bash
# Instalar manualmente copiando desde:
# https://ui.shadcn.com/docs/components/

# Componentes recomendados:
# - Accordion
# - Alert
# - Badge
# - Checkbox
# - Tabs
# - Toast
# - Tooltip
```

---

**¡Disfruta construyendo con shadcn/ui! 🎨**


