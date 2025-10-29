# Módulo de Gestión de Lotes Agrícolas

## Descripción

El módulo de Lotes permite registrar, visualizar y administrar todos los lotes agrícolas de la finca. Incluye un sistema completo de delimitación geográfica con mapas interactivos y gestión de estados operativos.

## Características Principales

### 📍 Delimitación Geográfica
- **Selector de coordenadas GPS** interactivo
- Creación de polígonos en el mapa haciendo clic
- Cálculo automático de área y perímetro
- Validación de polígonos
- Visualización en tiempo real

### 🗺️ Visualización en Mapa
- Vista de mapa con todos los lotes
- Polígonos coloreados por estado operativo
- Vista satelital y de calles
- Popups informativos al hacer clic
- Leyenda con conteo por estados
- Zoom y navegación

### 📊 Estados de Lote
El sistema soporta 8 estados diferentes:

| Estado | Color | Descripción |
|--------|-------|-------------|
| Operativo | 🟢 Verde | Lote en operación normal |
| En Siembra | 🟣 Violeta | Proceso de siembra en curso |
| En Crecimiento | 🟢 Verde Claro | Cultivo en desarrollo |
| En Cosecha | 🟡 Amarillo | Recolección de producción |
| En Fumigación | 🔴 Rojo | Aplicación de productos |
| En Mantenimiento | 🟠 Naranja | Mantenimiento del lote |
| En Descanso | ⚪ Gris | Rotación de cultivos |
| Inactivo | ⚫ Gris Oscuro | Sin actividad |

### 📝 Información Detallada
Cada lote incluye:

**Básica:**
- Código único
- Nombre descriptivo
- Descripción
- Estado actual
- Área en hectáreas

**Ubicación:**
- Coordenadas GPS (polígono)
- Perímetro en metros
- Altitud sobre el nivel del mar

**Características del Suelo:**
- Tipo de suelo (Arcilloso, Arenoso, Limoso, Franco, Humífero, Pedregoso)
- pH del suelo
- Topografía (Plano, Ondulado, Inclinado, Montañoso)

**Infraestructura:**
- Sistema de riego (Goteo, Aspersión, Gravedad, Microaspersión, Ninguno)
- Cerca perimetral (Sí/No)
- Sombra (Sí/No)
- Acceso vehicular (Sí/No)

**Adicional:**
- Cultivo asociado (opcional)
- Próxima actividad programada
- Notas y observaciones
- Imágenes y documentos

## Estructura de Archivos

```
lotes/
├── components/
│   ├── LoteForm.tsx              # Formulario de creación/edición
│   ├── MapaLotes.tsx             # Visualizador de mapa con polígonos
│   └── SelectorCoordenadas.tsx   # Selector interactivo de coordenadas
├── hooks/
│   └── useLotesQuery.ts          # Hooks de React Query
├── services/
│   └── lotesService.ts           # Lógica de negocio y datos mock
└── views/
    ├── LotesListView.tsx         # Lista y mapa de todos los lotes
    ├── LoteCreateView.tsx        # Crear nuevo lote
    ├── LoteDetailView.tsx        # Detalle completo del lote
    └── LoteEditView.tsx          # Editar lote existente
```

## Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **TanStack Query** - Estado del servidor y cache
- **React Router** - Navegación
- **React Hook Form** - Gestión de formularios
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración de Leaflet con React
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI

## Uso

### Crear un Lote

1. Ir a "Lotes" en el menú
2. Click en "Nuevo Lote"
3. **Pestaña 1 - Información Básica:**
   - Ingresar código (formato LOT-001)
   - Nombre del lote
   - Estado operativo
   - Área en hectáreas
4. **Pestaña 2 - Ubicación:**
   - Hacer clic en el mapa para agregar puntos
   - Delimitar el polígono del lote
   - Verificar área calculada automáticamente
5. **Pestaña 3 - Características:**
   - Tipo de suelo
   - pH
   - Sistema de riego
   - Infraestructura
6. Click en "Guardar Lote"

### Visualizar Lotes

**Vista de Mapa:**
- Todos los lotes se muestran con polígonos coloreados
- Click en un polígono para ver información
- Alternar entre vista satelital y calles
- Leyenda automática con conteo

**Vista de Lista:**
- Cards con información resumida
- Filtros por estado, área, búsqueda
- Click en card para ver detalle

### Editar un Lote

1. Desde el detalle del lote, click en "Editar"
2. Modificar información necesaria
3. Actualizar delimitación si es necesario
4. Guardar cambios

### Filtrar Lotes

- **Búsqueda:** Por código o nombre
- **Estado:** Filtrar por estado operativo
- **Área:** Definir área mínima/máxima
- **Tipo de suelo:** Filtrar por tipo
- **Sistema de riego:** Filtrar por sistema

## Datos Mock

El sistema incluye 8 lotes de ejemplo con:
- Diferentes estados operativos
- Polígonos realistas en Colombia
- Diversos tipos de cultivos
- Características variadas de suelo
- Sistemas de riego diferentes

## Funciones Auxiliares

### Cálculo de Área
```typescript
calcularArea(coordenadas: Coordenada[]): number
```
Calcula el área de un polígono usando la fórmula de Shoelace.

### Cálculo de Perímetro
```typescript
calcularPerimetro(coordenadas: Coordenada[]): number
```
Calcula el perímetro sumando las distancias entre puntos consecutivos.

### Validación de Polígono
```typescript
validarPoligono(coordenadas: Coordenada[]): { valido: boolean; mensaje?: string }
```
Verifica que el polígono sea válido (mínimo 3 puntos, sin duplicados, etc.)

## Próximas Mejoras

- [ ] Importar archivos KML/GeoJSON
- [ ] Exportar delimitaciones
- [ ] Medición de distancias en el mapa
- [ ] Capas adicionales (clima, topografía)
- [ ] Historial de cambios de estado
- [ ] Imágenes del lote
- [ ] Asociación con sensores IoT
- [ ] Análisis NDVI
- [ ] Comparación de lotes
- [ ] Reportes de productividad por lote

## API Endpoints (Futuros)

```
GET    /api/lotes              - Listar lotes
GET    /api/lotes/:id          - Obtener lote
POST   /api/lotes              - Crear lote
PUT    /api/lotes/:id          - Actualizar lote
DELETE /api/lotes/:id          - Eliminar lote
GET    /api/lotes/estadisticas - Estadísticas generales
```

## Notas Técnicas

- Los polígonos se almacenan como arrays de coordenadas
- Las coordenadas usan formato `{ lat: number, lng: number }`
- El cálculo de área es aproximado, basado en proyección plana
- Para áreas precisas en producción, usar cálculos geodésicos
- Los tiles del mapa vienen de OpenStreetMap y Esri ArcGIS

## Soporte

Para dudas o problemas con el módulo de lotes, consultar la documentación general del sistema o contactar al equipo de desarrollo.

