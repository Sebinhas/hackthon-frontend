import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Coordenada } from '@/types/lotes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Trash2, MapPin, Undo } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calcularArea, calcularPerimetro, validarPoligono } from '../services/lotesService';

// ============================================================================
// COMPONENTE PARA MANEJAR CLICKS EN EL MAPA
// ============================================================================

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
  modoSeleccion: boolean;
}

const MapClickHandler = ({ onMapClick, modoSeleccion }: MapClickHandlerProps) => {
  useMapEvents({
    click: (e) => {
      if (modoSeleccion) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  
  return null;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface SelectorCoordenadasSimpleProps {
  value: Coordenada[];
  onChange: (coordenadas: Coordenada[]) => void;
  height?: string;
  centroInicial?: LatLngExpression;
  zoomInicial?: number;
}

export const SelectorCoordenadasSimple = ({
  value,
  onChange,
  height = '500px',
  centroInicial = [4.6097, -74.0817],
  zoomInicial = 15
}: SelectorCoordenadasSimpleProps) => {
  const [modoSeleccion, setModoSeleccion] = useState(true);
  const [tipoMapa, setTipoMapa] = useState<'satellite' | 'streets'>('satellite');
  
  // Agregar punto
  const handleMapClick = useCallback((lat: number, lng: number) => {
    const nuevasCoordenadas = [...value, { lat, lng }];
    onChange(nuevasCoordenadas);
  }, [value, onChange]);
  
  // Eliminar último punto
  const handleUndo = useCallback(() => {
    if (value.length > 0) {
      const nuevasCoordenadas = value.slice(0, -1);
      onChange(nuevasCoordenadas);
    }
  }, [value, onChange]);
  
  // Limpiar todos los puntos
  const handleClear = useCallback(() => {
    onChange([]);
  }, [onChange]);
  
  // Cerrar polígono (agregar primer punto al final)
  const handleCerrar = useCallback(() => {
    if (value.length >= 3 && !esPoligonoCerrado) {
      onChange([...value, value[0]]);
    }
  }, [value, onChange]);
  
  // Verificar si el polígono está cerrado
  const esPoligonoCerrado = value.length >= 4 && 
    value[0].lat === value[value.length - 1].lat &&
    value[0].lng === value[value.length - 1].lng;
  
  // Validar polígono
  const validacion = value.length >= 3 ? validarPoligono(value) : null;
  
  // Calcular métricas
  const area = value.length >= 3 ? calcularArea(value) : 0;
  const perimetro = value.length >= 2 ? calcularPerimetro(value) : 0;
  
  // Convertir coordenadas para Leaflet
  const coordsArray: LatLngExpression[] = value.map(
    coord => [coord.lat, coord.lng] as LatLngExpression
  );
  
  const tileUrls = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };
  
  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          <strong>Cómo usar:</strong> Haz clic en el mapa para agregar puntos y delimitar el lote. 
          Se necesitan mínimo 3 puntos para formar un polígono válido.
        </AlertDescription>
      </Alert>
      
      {/* Mapa */}
      <div className="relative">
        <MapContainer
          center={centroInicial}
          zoom={zoomInicial}
          style={{ height, width: '100%', borderRadius: '8px' }}
          className={modoSeleccion ? 'cursor-crosshair' : ''}
        >
          <TileLayer
            url={tileUrls[tipoMapa]}
            attribution={tipoMapa === 'satellite' 
              ? '&copy; Esri' 
              : '&copy; OpenStreetMap contributors'
            }
          />
          
          <MapClickHandler 
            onMapClick={handleMapClick} 
            modoSeleccion={modoSeleccion}
          />
          
          {value.length >= 2 && (
            <Polygon
              positions={coordsArray}
              pathOptions={{
                color: esPoligonoCerrado ? '#10b981' : '#3b82f6',
                fillColor: esPoligonoCerrado ? '#10b98140' : '#3b82f640',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.4
              }}
            />
          )}
        </MapContainer>
        
        {/* Controles superiores */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <Card className="p-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={tipoMapa === 'satellite' ? 'default' : 'outline'}
                onClick={() => setTipoMapa('satellite')}
                className="text-xs"
              >
                🛰️ Satélite
              </Button>
              <Button
                size="sm"
                variant={tipoMapa === 'streets' ? 'default' : 'outline'}
                onClick={() => setTipoMapa('streets')}
                className="text-xs"
              >
                🗺️ Calles
              </Button>
            </div>
          </Card>
          
          <Card className="p-2">
            <Button
              size="sm"
              variant={modoSeleccion ? 'default' : 'outline'}
              onClick={() => setModoSeleccion(!modoSeleccion)}
              className="text-xs w-full"
            >
              {modoSeleccion ? '✓ Selección Activa' : 'Activar Selección'}
            </Button>
          </Card>
        </div>
        
        {/* Panel de información */}
        <Card className="absolute bottom-4 left-4 z-[1000] p-3 min-w-[200px]">
          <h4 className="font-semibold text-sm mb-2">Información del Polígono</h4>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Puntos:</span>
              <span className="font-medium">{value.length}</span>
            </div>
            
            {area > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Área estimada:</span>
                <span className="font-medium">{area.toFixed(2)} ha</span>
              </div>
            )}
            
            {perimetro > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Perímetro:</span>
                <span className="font-medium">{perimetro} m</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={`font-medium ${esPoligonoCerrado ? 'text-green-600' : 'text-blue-600'}`}>
                {esPoligonoCerrado ? 'Cerrado' : 'En proceso'}
              </span>
            </div>
          </div>
          
          {validacion && !validacion.valido && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-red-600 flex items-start gap-1">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                {validacion.mensaje}
              </p>
            </div>
          )}
        </Card>
      </div>
      
      {/* Controles inferiores */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={value.length === 0}
        >
          <Undo className="h-4 w-4 mr-1" />
          Deshacer
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={value.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Limpiar Todo
        </Button>
        
        {value.length >= 3 && !esPoligonoCerrado && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCerrar}
          >
            Cerrar Polígono
          </Button>
        )}
        
        {esPoligonoCerrado && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            ✓ Polígono válido
          </div>
        )}
      </div>
      
      {/* Lista de coordenadas */}
      {value.length > 0 && (
        <Card className="p-3">
          <h4 className="font-semibold text-sm mb-2">
            Coordenadas ({value.length} punto{value.length !== 1 ? 's' : ''})
          </h4>
          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {value.map((coord, index) => (
              <div key={index} className="flex justify-between items-center hover:bg-gray-50 px-2 py-1 rounded">
                <span className="text-gray-600">Punto {index + 1}:</span>
                <span className="font-mono">
                  {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SelectorCoordenadasSimple;
