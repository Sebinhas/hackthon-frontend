import { useState, useMemo, useEffect, useRef } from 'react';
import { Lote, COLORES_ESTADO, Planta } from '@/modules/dashboard/mapa/types/lotes.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGoogleMapsScriptUrl } from '@/config/googleMaps';
import { ChevronRight, Home } from 'lucide-react';
import { SpotsRenderer } from './SpotsRenderer';

interface MapaRealProps {
  lotes: Lote[];
  height?: string;
  onLoteClick?: (lote: Lote) => void;
  mostrarLeyenda?: boolean;
  mostrarTrabajadores?: boolean;
  trabajadoresData?: any[];
  plantasDelLote: Planta[];
  loteSeleccionado: Lote | null;
}

type VistaActual = 'lotes' | 'plantas';

export const MapaReal = ({
  lotes,
  height = '600px',
  onLoteClick,
  mostrarLeyenda = true,
  plantasDelLote,
  loteSeleccionado,
}: MapaRealProps) => {
  const [tipoMapa, setTipoMapa] = useState<'satellite' | 'roadmap'>('satellite');
  const [mapaListo, setMapaListo] = useState(false);
  const [vistaActual, setVistaActual] = useState<VistaActual>('lotes');
  const [mostrarLineas, setMostrarLineas] = useState(true);
  const [mostrarPoligonos, setMostrarPoligonos] = useState(true);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Cambiar automáticamente a vista de plantas cuando hay lote seleccionado
  useEffect(() => {
    if (loteSeleccionado && plantasDelLote.length > 0) {
      setVistaActual('plantas');
    } else {
      setVistaActual('lotes');
    }
  }, [loteSeleccionado, plantasDelLote]);

  // (el render de spots ahora lo maneja SpotsRenderer)

  // Calcular centro del mapa
  const centroMapa = useMemo(() => {
    if (vistaActual === 'plantas' && plantasDelLote.length > 0) {
      const totalLat = plantasDelLote.reduce((sum, p) => sum + p.lat, 0);
      const totalLng = plantasDelLote.reduce((sum, p) => sum + p.lng, 0);
      return { lat: totalLat / plantasDelLote.length, lng: totalLng / plantasDelLote.length };
    }

    if (lotes.length === 0) {
      return { lat: 4.6097, lng: -74.0817 };
    }

    let totalLat = 0;
    let totalLng = 0;
    let totalPuntos = 0;

    lotes.forEach((lote) => {
      lote.coordenadas.forEach((coord) => {
        const lat = Number(coord.lat);
        const lng = Number(coord.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          totalLat += lat;
          totalLng += lng;
          totalPuntos++;
        }
      });
    });

    if (totalPuntos === 0) {
      return { lat: 4.711, lng: -74.0721 };
    }

    return { lat: totalLat / totalPuntos, lng: totalLng / totalPuntos };
  }, [lotes, vistaActual, loteSeleccionado, plantasDelLote]);

  // Inicializar Google Maps
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

    const initMap = () => {
      if (!mapRef.current) return;

      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: centroMapa,
        zoom: vistaActual === 'plantas' ? 16 : 14,
        mapTypeId: tipoMapa,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

      google.maps.event.addListenerOnce(googleMapRef.current, 'idle', () => {
        setMapaListo(true);
      });
    };

    if (existingScript) {
      if (typeof google !== 'undefined' && google.maps) {
        initMap();
      } else {
        existingScript.addEventListener('load', initMap);
      }
    } else {
      const script = document.createElement('script');
      script.src = getGoogleMapsScriptUrl();
      script.setAttribute('loading', 'async');
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  // Cambiar tipo de mapa
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(tipoMapa);
    }
  }, [tipoMapa]);

  // Dibujar en el mapa según la vista actual
  useEffect(() => {
    if (!googleMapRef.current || !mapaListo) return;

    // Limpiar polígonos y markers anteriores
    polygonsRef.current.forEach((polygon) => polygon.setMap(null));
    polygonsRef.current = [];
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // VISTA DE LOTES
    if (vistaActual === 'lotes') {
    lotes.forEach((lote) => {
        const colors = COLORES_ESTADO[lote.estado];

      const paths = lote.coordenadas
        .filter((coord) => coord && coord.lat && coord.lng)
        .map((coord) => ({
          lat: Number(coord.lat),
          lng: Number(coord.lng),
          }));

        if (paths.length < 3) return;

      const polygon = new google.maps.Polygon({
        paths: paths,
          strokeColor: colors.color,
        strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: colors.fillColor,
        fillOpacity: 0.5,
        map: googleMapRef.current,
        clickable: true,
        });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${lote.nombre}</h3>
            <p style="color: #666; font-size: 12px; margin-bottom: 10px;">${lote.codigo}</p>
            <div style="font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin: 3px 0;">
                <span style="color: #666;">Estado:</span>
                <span style="font-weight: 500;">${colors.label}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 3px 0;">
                <span style="color: #666;">Área:</span>
                <span style="font-weight: 500;">${lote.area_hectareas} ha</span>
              </div>
                </div>
              <p style="margin-top: 10px; font-size: 12px; color: #2563eb; font-weight: 500;">
                💡 Click para ver los spots →
              </p>
          </div>
        `,
        });

      polygon.addListener('click', () => {
          infoWindow.setPosition(paths[0]);
          infoWindow.open(googleMapRef.current);
          
          // Notificar al componente padre sobre la selección del lote
          if (onLoteClick) {
            onLoteClick(lote);
          }
        });

        polygonsRef.current.push(polygon);
      });

      // Ajustar vista a todos los lotes
    if (lotes.length > 0 && googleMapRef.current) {
        const bounds = new google.maps.LatLngBounds();
      lotes.forEach((lote) => {
        lote.coordenadas
          .filter((coord) => coord && coord.lat && coord.lng)
          .forEach((coord) => {
              const lat = Number(coord.lat);
              const lng = Number(coord.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                bounds.extend({ lat, lng });
              }
            });
        });
        googleMapRef.current.fitBounds(bounds);
      }
    }

    // VISTA DE PLANTAS/SPOTS
    else if (vistaActual === 'plantas' && loteSeleccionado) {
      // Dibujar perímetro del lote como referencia
      const lotePerimeterPaths = loteSeleccionado.coordenadas
        .filter((coord) => coord && coord.lat && coord.lng)
        .map((coord) => ({ lat: Number(coord.lat), lng: Number(coord.lng) }));

      if (lotePerimeterPaths.length >= 3) {
        const lotePerimeterPolygon = new google.maps.Polygon({
          paths: lotePerimeterPaths,
          strokeColor: '#2563eb',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#2563eb',
          fillOpacity: 0.1,
          map: googleMapRef.current,
          clickable: false,
        });
        polygonsRef.current.push(lotePerimeterPolygon);
      }

      // Ajustar vista a las plantas
      if (plantasDelLote.length > 0 && googleMapRef.current) {
        const bounds = new google.maps.LatLngBounds();
        plantasDelLote.forEach((planta) => bounds.extend({ lat: planta.lat, lng: planta.lng }));
        googleMapRef.current.fitBounds(bounds);
      }
    }
  }, [lotes, vistaActual, loteSeleccionado, plantasDelLote, mapaListo, onLoteClick]);

  // Handlers para navegación
  const volverALotes = () => {
    setVistaActual('lotes');
    if (onLoteClick) {
      onLoteClick(null as any); // Notificar que se deselecciona el lote
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb de navegación */}
      {vistaActual !== 'lotes' && (
        <Card className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={volverALotes}
              className="h-7 px-2"
            >
              <Home className="h-4 w-4 mr-1" />
              Lotes
            </Button>
            {loteSeleccionado && vistaActual === 'plantas' && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Badge variant="default">{loteSeleccionado.nombre}</Badge>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Leyenda */}
      {mostrarLeyenda && vistaActual === 'lotes' && lotes.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-sm mb-3">Leyenda de Estados</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(COLORES_ESTADO).map(([estado, config]) => {
              const count = lotes.filter((l) => l.estado === estado).length;
              if (count === 0) return null;

              return (
                <div key={estado} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-4 h-4 rounded border-2 flex-shrink-0"
                    style={{
                      backgroundColor: config.fillColor,
                      borderColor: config.color,
                    }}
                  />
                  <div className="flex gap-1 min-w-0">
                    <div className="truncate">{config.label}</div>
                    <div className="text-gray-500">({count})</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Controles del mapa */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={tipoMapa === 'satellite' ? 'default' : 'outline'}
            onClick={() => setTipoMapa('satellite')}
          >
            🛰️ Vista Satelital
          </Button>
          <Button
            size="sm"
            variant={tipoMapa === 'roadmap' ? 'default' : 'outline'}
            onClick={() => setTipoMapa('roadmap')}
          >
            🗺️ Vista de Calles
          </Button>
          
          {vistaActual === 'plantas' && (
            <>
              <Button
                size="sm"
                variant={mostrarLineas ? 'default' : 'outline'}
                onClick={() => setMostrarLineas(!mostrarLineas)}
              >
                {mostrarLineas ? '🔗 Ocultar Líneas' : '🔗 Mostrar Líneas'}
              </Button>
              <Button
                size="sm"
                variant={mostrarPoligonos ? 'default' : 'outline'}
                onClick={() => setMostrarPoligonos(!mostrarPoligonos)}
              >
                {mostrarPoligonos ? '⬡ Ocultar Polígonos' : '⬡ Mostrar Polígonos'}
              </Button>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {vistaActual === 'lotes' && `${lotes.length} lote${lotes.length !== 1 ? 's' : ''}`}
          {vistaActual === 'plantas' && `${plantasDelLote.length} spot${plantasDelLote.length !== 1 ? 's' : ''}`}
        </div>
      </div>
            {/* Ayuda contextual */}
            {vistaActual === 'lotes' && lotes.length > 0 && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Consejo:</strong> Haz click en un lote para ver los spots/plantas
          </p>
        </Card>
      )}

      {/* Mapa */}
      <Card className="overflow-hidden relative">
        <div ref={mapRef} style={{ height, width: '100%' }} className="bg-gray-100" />
        {mapaListo && vistaActual === 'plantas' && plantasDelLote.length > 0 && (
          <SpotsRenderer 
            map={googleMapRef.current} 
            spots={plantasDelLote} 
            mostrarLineas={mostrarLineas}
            mostrarPoligonos={mostrarPoligonos}
          />
        )}
        {!mapaListo && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando mapa...</p>
            </div>
          </div>
        )}
      </Card>


      {vistaActual === 'plantas' && plantasDelLote.length > 0 && (
        <Card className="p-3 bg-green-50 border-green-200">
          <p className="text-sm text-green-900">
            🌱 <strong>Spots georeferenciados:</strong> Cada polígono representa un spot con su ubicación exacta. Los verdes están plantados, los grises están vacíos.
          </p>
        </Card>
      )}
    </div>
  );
};

export default MapaReal;
