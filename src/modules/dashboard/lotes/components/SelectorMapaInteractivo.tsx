import { useState, useEffect, useRef } from 'react';
import { Coordenada, Lote } from '@/types/lotes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Trash2, Undo } from 'lucide-react';
import { calcularArea, calcularPerimetro } from '../services/lotesService';
import { getGoogleMapsScriptUrl } from '@/config/googleMaps';

// ============================================================================
// SELECTOR DE LOTE EN MAPA INTERACTIVO
// ============================================================================

interface SelectorMapaInteractivoProps {
  value?: Coordenada[];
  onChange?: (coordenadas: Coordenada[]) => void;
  onCoordenadasChange?: (coordenadas: { latitud: number; longitud: number }) => void;
  height?: string;
  lotesExistentes?: Lote[];
  loteSeleccionado?: Lote;
}

export const SelectorMapaInteractivo = ({
  value = [],
  onChange,
  onCoordenadasChange,
  height = '500px',
  lotesExistentes = [],
  loteSeleccionado
}: SelectorMapaInteractivoProps) => {
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [mapaListo, setMapaListo] = useState(false);
  const [errorMapa, setErrorMapa] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const lotesExistentesRef = useRef<google.maps.Polygon[]>([]);
  
  // Inicializar Google Maps con Drawing Tools
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;
    
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Verificar que Google Maps y Drawing estén disponibles
      if (typeof google === 'undefined' || !google.maps || !google.maps.drawing) {
        console.error('❌ Google Maps Drawing library no está cargada');
        console.error('Verifica que la API Key sea válida y que Maps JavaScript API esté habilitada');
        setErrorMapa('Google Maps no se pudo cargar. Verifica tu API Key.');
        return;
      }
      
      console.log('✅ Google Maps cargado correctamente');
      
      // Determinar el centro del mapa
      let center = { lat: 4.6097, lng: -74.0817 }; // Bogotá por defecto
      let zoom = 15;
      
      if (loteSeleccionado && loteSeleccionado.coordenadas && loteSeleccionado.coordenadas.length > 0) {
        // Calcular el centro del lote seleccionado
        const bounds = new google.maps.LatLngBounds();
        loteSeleccionado.coordenadas.forEach(coord => {
          bounds.extend({ lat: coord.lat, lng: coord.lng });
        });
        center = bounds.getCenter().toJSON();
        zoom = 18; // Zoom más cercano para el lote específico
      }
      
      // Crear el mapa
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });
      
      // Inicializar Drawing Manager
      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: '#3b82f6',
          fillOpacity: 0.4,
          strokeWeight: 3,
          strokeColor: '#3b82f6',
          clickable: true,
          editable: true,
          draggable: false,
        }
      });
      
      drawingManagerRef.current.setMap(googleMapRef.current);
      
      // Listener cuando se completa el dibujo
      google.maps.event.addListener(
        drawingManagerRef.current,
        'polygoncomplete',
        (polygon: google.maps.Polygon) => {
          handlePolygonComplete(polygon);
        }
      );
      
      // Listener para clics en el mapa (para selección de coordenadas)
      google.maps.event.addListener(googleMapRef.current, 'click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng && onCoordenadasChange) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          onCoordenadasChange({ latitud: lat, longitud: lng });
        }
      });
      
      google.maps.event.addListenerOnce(googleMapRef.current, 'idle', () => {
        setMapaListo(true);
      });
    };
    
    if (existingScript) {
      // Esperar a que el script cargue completamente incluyendo las librerías
      const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps && google.maps.drawing) {
          clearInterval(checkGoogle);
          initMap();
        }
      }, 100);
      
      // Timeout después de 5 segundos
      setTimeout(() => clearInterval(checkGoogle), 5000);
    } else {
      const script = document.createElement('script');
      script.src = getGoogleMapsScriptUrl();
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('📡 Script de Google Maps cargado');
        // Esperar un momento para que las librerías se inicialicen
        setTimeout(initMap, 100);
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando Google Maps:', error);
        console.error('Verifica tu API Key y conexión a internet');
        setErrorMapa('Error cargando Google Maps. Verifica tu API Key y conexión.');
      };
      document.head.appendChild(script);
    }
  }, []);
  
  // Dibujar lotes existentes cuando el mapa esté listo
  useEffect(() => {
    if (!googleMapRef.current || !mapaListo || lotesExistentes.length === 0) return;
    
    // Limpiar lotes existentes anteriores
    lotesExistentesRef.current.forEach(polygon => {
      polygon.setMap(null);
    });
    lotesExistentesRef.current = [];
    
    // Dibujar cada lote existente
    lotesExistentes.forEach((lote, index) => {
      if (lote.coordenadas && lote.coordenadas.length >= 3) {
        const path = lote.coordenadas.map(coord => ({
          lat: coord.lat,
          lng: coord.lng
        }));
        
        const polygon = new google.maps.Polygon({
          paths: path,
          fillColor: '#ef4444', // Rojo para lotes existentes
          fillOpacity: 0.3,
          strokeColor: '#dc2626',
          strokeWeight: 2,
          strokeOpacity: 0.8,
          clickable: false,
          zIndex: 1
        });
        
        polygon.setMap(googleMapRef.current);
        lotesExistentesRef.current.push(polygon);
        
        // Agregar etiqueta con el nombre del lote
        const bounds = new google.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        const center = bounds.getCenter();
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h4 class="font-semibold text-sm">${lote.nombre}</h4>
              <p class="text-xs text-gray-600">${lote.codigo}</p>
              <p class="text-xs text-gray-600">${lote.area_hectareas} ha</p>
            </div>
          `,
          disableAutoPan: true
        });
        
        const marker = new google.maps.Marker({
          position: center,
          map: googleMapRef.current,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="white" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          },
          title: `${lote.nombre} (${lote.codigo})`
        });
        
        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });
      }
    });
  }, [mapaListo, lotesExistentes]);
  
  // Manejar cuando se completa el dibujo de un polígono
  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    // Obtener las coordenadas del polígono
    const path = polygon.getPath();
    const coords: Coordenada[] = [];
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coords.push({ lat: point.lat(), lng: point.lng() });
    }
    
    // Cerrar el polígono agregando el primer punto al final
    if (coords.length > 0) {
      coords.push(coords[0]);
    }
    
    onChange?.(coords);
    
    // Desactivar modo de dibujo
    setModoSeleccion(false);
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    
    // Remover el polígono temporal
    polygon.setMap(null);
  };
  
  // Iniciar modo de dibujo
  const iniciarDibujo = () => {
    if (drawingManagerRef.current) {
      setModoSeleccion(true);
      drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  };
  
  // Actualizar visualización cuando cambian las coordenadas
  useEffect(() => {
    if (!googleMapRef.current || !mapaListo) return;
    
    // Limpiar polígono anterior
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }
    
    if (value.length === 0) return;
    
    // Si hay 3 o más puntos, dibujar polígono editable
    if (value.length >= 3) {
      const paths = value.map(coord => ({ lat: coord.lat, lng: coord.lng }));
      
      polygonRef.current = new google.maps.Polygon({
        paths: paths,
        strokeColor: '#10b981',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#10b98140',
        fillOpacity: 0.5,
        map: googleMapRef.current,
        editable: false,
        draggable: false,
      });
      
      // Ajustar vista para mostrar todo el polígono
      const bounds = new google.maps.LatLngBounds();
      value.forEach(coord => bounds.extend({ lat: coord.lat, lng: coord.lng }));
      googleMapRef.current?.fitBounds(bounds);
    }
  }, [value, mapaListo]);
  
  // Limpiar todo
  const handleClear = () => {
    onChange?.([]);
    setModoSeleccion(false);
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };
  
  // Redibujar
  const handleRedibujar = () => {
    onChange?.([]);
    iniciarDibujo();
  };
  
  
  const area = value.length >= 3 ? calcularArea(value) : 0;
  const perimetro = value.length >= 2 ? calcularPerimetro(value) : 0;
  
  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <Alert className="bg-blue-50 border-blue-200">
        <MapPin className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          {!modoSeleccion && value.length === 0 ? (
            <span><strong>🖊️ Click en "Dibujar Lote"</strong> y luego dibuja el área arrastrando el mouse sobre el mapa</span>
          ) : modoSeleccion ? (
            <span><strong>✏️ Dibuja el área del lote</strong> haciendo clic para marcar puntos. Haz doble clic para terminar</span>
          ) : (
            <span><strong>✓ Lote delimitado</strong> - Área capturada correctamente</span>
          )}
        </AlertDescription>
      </Alert>
      
      {/* Mapa */}
      <Card className="overflow-hidden relative">
        <div 
          ref={mapRef} 
          style={{ height, width: '100%' }}
          className={modoSeleccion ? 'cursor-crosshair' : ''}
        />
        {!mapaListo && !errorMapa && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando mapa...</p>
            </div>
          </div>
        )}
        
        {errorMapa && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10">
            <div className="text-center p-6 max-w-md">
              <div className="text-red-500 text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error del Mapa</h3>
              <p className="text-gray-600 mb-4">{errorMapa}</p>
              <div className="text-sm text-gray-500 space-y-2">
                <p><strong>Posibles soluciones:</strong></p>
                <ul className="text-left space-y-1">
                  <li>• Verifica tu API Key de Google Maps</li>
                  <li>• Asegúrate de que Maps JavaScript API esté habilitada</li>
                  <li>• Revisa las restricciones de la API Key</li>
                  <li>• Verifica tu conexión a internet</li>
                </ul>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}
        
        {/* Panel de información flotante */}
        {mapaListo && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 z-10 max-w-xs">
            <div className="space-y-2">
              {/* Leyenda de colores */}
              {lotesExistentes.length > 0 && (
                <div className="text-xs space-y-1 mb-3 pb-2 border-b border-gray-200">
                  <div className="font-semibold text-gray-700 mb-1">Leyenda:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                    <span className="text-gray-600">Lotes existentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                    <span className="text-gray-600">Nuevo lote</span>
                  </div>
                </div>
              )}
              {value.length === 0 ? (
                <Button
                  size="sm"
                  onClick={iniciarDibujo}
                  className="w-full text-xs bg-blue-600 hover:bg-blue-700"
                >
                  🖊️ Dibujar Lote
                </Button>
              ) : (
                <div className="text-xs space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Puntos:</span>
                    <span className="font-semibold">{value.length}</span>
                  </div>
                  {area > 0 && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Área:</span>
                      <span className="font-semibold text-green-600">{area.toFixed(2)} ha</span>
                    </div>
                  )}
                  {perimetro > 0 && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Perímetro:</span>
                      <span className="font-semibold">{perimetro} m</span>
                    </div>
                  )}
                </div>
              )}
              
              {modoSeleccion && (
                <div className="text-[10px] text-blue-600 bg-blue-50 p-2 rounded">
                  💡 Haz clic para marcar puntos. Doble clic para terminar
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
      
      {/* Controles */}
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2">
          {value.length === 0 ? (
            <Button
              type="button"
              onClick={iniciarDibujo}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Dibujar Lote en el Mapa
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRedibujar}
              >
                <Undo className="h-4 w-4 mr-1" />
                Redibujar
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </>
          )}
        </div>
        
        {value.length >= 3 && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium px-4 py-2 bg-green-50 rounded-lg border border-green-200">
            ✓ Lote delimitado - {area.toFixed(2)} ha
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectorMapaInteractivo;

