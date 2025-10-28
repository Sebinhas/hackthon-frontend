import { useState, useMemo, useEffect, useRef } from 'react';
import { Lote, COLORES_ESTADO, Finca, EstadoLote } from '@/modules/dashboard/lotes/types/lotes.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGoogleMapsScriptUrl } from '@/config/googleMaps';
import { persistencia } from '@/shared/utils/persistence';
import { ChevronRight, Home } from 'lucide-react';

interface MapaRealProps {
  lotes: Lote[];
  height?: string;
  onLoteClick?: (lote: Lote) => void;
  mostrarLeyenda?: boolean;
  mostrarTrabajadores?: boolean;
  trabajadoresData?: any[];
}

type VistaActual = 'lotes' | 'fincas' | 'plantas';

export const MapaReal = ({
  lotes,
  height = '600px',
  onLoteClick,
  mostrarLeyenda = true,
}: MapaRealProps) => {
  const [tipoMapa, setTipoMapa] = useState<'satellite' | 'roadmap'>('satellite');
  const [mapaListo, setMapaListo] = useState(false);
  const [vistaActual, setVistaActual] = useState<VistaActual>('lotes');
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null);
  const [fincaSeleccionada, setFincaSeleccionada] = useState<Finca | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Obtener fincas del lote seleccionado
  const fincasDelLote = useMemo(() => {
    if (!loteSeleccionado) return [];
    const fincas = persistencia.getFincas();
    return fincas.filter((f) => f.lote_id === loteSeleccionado.id);
  }, [loteSeleccionado]);

  // Obtener plantas del lote (todas las fincas)
  const plantasDelLote = useMemo(() => {
    if (!loteSeleccionado) return [];
    return persistencia.getPlantasPorLote(loteSeleccionado.id);
  }, [loteSeleccionado]);

  // Función para crear hexágono alrededor de un punto
  const crearHexagono = (lat: number, lng: number, radio: number = 0.00005) => {
    const puntos = [];
    for (let i = 0; i < 6; i++) {
      const angulo = (Math.PI / 3) * i;
      const pLat = lat + radio * Math.cos(angulo);
      const pLng = lng + radio * Math.sin(angulo);
      puntos.push({ lat: pLat, lng: pLng });
    }
    return puntos;
  };

  // Calcular escala de grises basado en la cantidad/área
  const obtenerColorGris = (indice: number, total: number) => {
    const intensidad = Math.floor(255 - (indice / total) * 200); // De 255 (blanco) a 55 (gris oscuro)
    return `rgb(${intensidad}, ${intensidad}, ${intensidad})`;
  };

  // Calcular centro del mapa
  const centroMapa = useMemo(() => {
    if (vistaActual === 'plantas' && plantasDelLote.length > 0) {
      const totalLat = plantasDelLote.reduce((sum, p) => sum + p.lat, 0);
      const totalLng = plantasDelLote.reduce((sum, p) => sum + p.lng, 0);
      return { lat: totalLat / plantasDelLote.length, lng: totalLng / plantasDelLote.length };
    }

    if (vistaActual === 'fincas' && loteSeleccionado) {
      const coords = loteSeleccionado.coordenadas;
      const totalLat = coords.reduce((sum, c) => sum + Number(c.lat), 0);
      const totalLng = coords.reduce((sum, c) => sum + Number(c.lng), 0);
      return { lat: totalLat / coords.length, lng: totalLng / coords.length };
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
  }, [lotes, vistaActual, loteSeleccionado, plantasDelLote, fincasDelLote]);

  // Inicializar Google Maps
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

    const initMap = () => {
      if (!mapRef.current) return;

      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: centroMapa,
        zoom: vistaActual === 'plantas' ? 19 : vistaActual === 'fincas' ? 17 : 14,
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
                💡 Click para ver las fincas →
              </p>
          </div>
        `,
        });

      polygon.addListener('click', () => {
          infoWindow.setPosition(paths[0]);
          infoWindow.open(googleMapRef.current);
          
          // Cambiar a vista de fincas
          setLoteSeleccionado(lote);
          setVistaActual('fincas');
          
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

    // VISTA DE FINCAS
    else if (vistaActual === 'fincas' && loteSeleccionado) {
      // Dibujar el lote como referencia (más transparente)
      const lotePaths = loteSeleccionado.coordenadas
        .filter((coord) => coord && coord.lat && coord.lng)
        .map((coord) => ({
          lat: Number(coord.lat),
          lng: Number(coord.lng),
        }));

      if (lotePaths.length >= 3) {
        const lotePolygon = new google.maps.Polygon({
          paths: lotePaths,
          strokeColor: '#666',
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: '#ccc',
          fillOpacity: 0.2,
          map: googleMapRef.current,
          clickable: false,
        });
        polygonsRef.current.push(lotePolygon);
      }

      // Dibujar las fincas como polígonos en escala de grises
      fincasDelLote.forEach((finca, index) => {
        // Calcular área aproximada para la finca dentro del lote
        const areaDelLote = loteSeleccionado.area_hectareas / fincasDelLote.length;
        
        // Crear un polígono ficticio para la finca (subdividir el lote)
        const segmentoInicio = index / fincasDelLote.length;
        const segmentoFin = (index + 1) / fincasDelLote.length;
        
        const fincaPaths = lotePaths.map((punto, idx) => {
          const proporcion = idx / (lotePaths.length - 1);
          if (proporcion >= segmentoInicio && proporcion <= segmentoFin) {
            return punto;
          }
          // Interpolar hacia el centro para crear subdivisiones
          const centro = {
            lat: lotePaths.reduce((sum, p) => sum + p.lat, 0) / lotePaths.length,
            lng: lotePaths.reduce((sum, p) => sum + p.lng, 0) / lotePaths.length,
          };
          return {
            lat: punto.lat + (centro.lat - punto.lat) * 0.3,
            lng: punto.lng + (centro.lng - punto.lng) * 0.3,
          };
        });

        const colorGris = obtenerColorGris(index, fincasDelLote.length);

        const fincaPolygon = new google.maps.Polygon({
          paths: fincaPaths,
          strokeColor: '#333',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: colorGris,
          fillOpacity: 0.6,
          map: googleMapRef.current,
          clickable: true,
        });

        // Agregar etiqueta de finca
        const centroFinca = {
          lat: fincaPaths.reduce((sum, p) => sum + p.lat, 0) / fincaPaths.length,
          lng: fincaPaths.reduce((sum, p) => sum + p.lng, 0) / fincaPaths.length,
        };

        const fincaMarker = new google.maps.Marker({
          position: centroFinca,
          map: googleMapRef.current,
          label: {
            text: finca.nombre,
            color: '#000',
            fontSize: '12px',
            fontWeight: 'bold',
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0,
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${finca.nombre}</h3>
              <p style="color: #666; font-size: 12px; margin-bottom: 10px;">${finca.sigla}</p>
              <div style="font-size: 13px;">
                <div style="display: flex; justify-content: space-between; margin: 3px 0;">
                  <span style="color: #666;">Grupo:</span>
                  <span style="font-weight: 500;">${finca.grupo}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 3px 0;">
                  <span style="color: #666;">Pago/día:</span>
                  <span style="font-weight: 500;">${finca.pago_dia} ${finca.moneda}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 3px 0;">
                  <span style="color: #666;">Área aprox:</span>
                  <span style="font-weight: 500;">${areaDelLote.toFixed(2)} ha</span>
                </div>
              </div>
              <p style="margin-top: 10px; font-size: 12px; color: #2563eb; font-weight: 500;">
                💡 Click para ver las plantas →
              </p>
            </div>
          `,
        });

        fincaPolygon.addListener('click', () => {
          infoWindow.setPosition(centroFinca);
          infoWindow.open(googleMapRef.current);
          
          // Mostrar todas las plantas del lote (no solo de una finca)
          setVistaActual('plantas');
        });

        polygonsRef.current.push(fincaPolygon);
        markersRef.current.push(fincaMarker);
      });

      // Ajustar vista al lote
      if (googleMapRef.current) {
        const bounds = new google.maps.LatLngBounds();
        lotePaths.forEach((punto) => bounds.extend(punto));
        googleMapRef.current.fitBounds(bounds);
      }
    }

    // VISTA DE PLANTAS
    else if (vistaActual === 'plantas' && loteSeleccionado) {
      // Dibujar el perímetro del lote como referencia
      const lotePerimeterPaths = loteSeleccionado.coordenadas
        .filter((coord) => coord && coord.lat && coord.lng)
        .map((coord) => ({
          lat: Number(coord.lat),
          lng: Number(coord.lng),
        }));

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

      // Agrupar plantas por línea para dibujar las líneas
      const plantasPorLinea: Record<number, any[]> = {};
      plantasDelLote.forEach((planta) => {
        if (!plantasPorLinea[planta.linea]) plantasPorLinea[planta.linea] = [];
        plantasPorLinea[planta.linea].push(planta);
      });

      // Dibujar líneas entre plantas de la misma línea
      Object.values(plantasPorLinea).forEach((linea) => {
        if (linea.length > 1) {
          const points = linea.map((p: any) => ({ lat: p.lat, lng: p.lng }));
          const line = new google.maps.Polyline({
            path: points,
            strokeColor: '#888',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            map: googleMapRef.current,
          });
          polygonsRef.current.push(line as any);
        }
      });

      // Dibujar las plantas como hexágonos
      plantasDelLote.forEach((planta) => {
        const hexagono = crearHexagono(planta.lat, planta.lng, 0.00003);
        
        const colors = planta.estado ? COLORES_ESTADO[planta.estado as EstadoLote] : { color: '#999', fillColor: '#ccc', label: 'Sin estado' };

        const plantaPolygon = new google.maps.Polygon({
          paths: hexagono,
          strokeColor: colors.color,
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: colors.fillColor,
          fillOpacity: 0.7,
        map: googleMapRef.current,
          clickable: true,
        });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 180px;">
              <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">🌱 ${planta.nombre_planta}</h3>
              <div style="font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: #666;">Spot:</span>
                  <span style="font-weight: 500;">${planta.nombre_spot}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: #666;">Línea:</span>
                  <span style="font-weight: 500;">${planta.linea}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: #666;">Posición:</span>
                  <span style="font-weight: 500;">${planta.posicion}</span>
              </div>
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: #666;">Estado:</span>
                  <span style="font-weight: 500;">${colors.label}</span>
            </div>
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: #666;">Coordenadas:</span>
                  <span style="font-size: 10px;">${planta.lat.toFixed(6)}, ${planta.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>
        `,
        });

        plantaPolygon.addListener('click', () => {
          infoWindow.setPosition({ lat: planta.lat, lng: planta.lng });
          infoWindow.open(googleMapRef.current);
        });

        polygonsRef.current.push(plantaPolygon);
      });

      // Ajustar vista a las plantas
      if (plantasDelLote.length > 0 && googleMapRef.current) {
        const bounds = new google.maps.LatLngBounds();
        plantasDelLote.forEach((planta) => {
          bounds.extend({ lat: planta.lat, lng: planta.lng });
        });
        googleMapRef.current.fitBounds(bounds);
        // Zoom más cercano para plantas
        setTimeout(() => {
          if (googleMapRef.current) {
            googleMapRef.current.setZoom(19);
          }
        }, 100);
      }
    }
  }, [lotes, vistaActual, loteSeleccionado, fincasDelLote, fincaSeleccionada, plantasDelLote, mapaListo, onLoteClick]);

  // Handlers para navegación
  const volverALotes = () => {
    setVistaActual('lotes');
    setLoteSeleccionado(null);
    setFincaSeleccionada(null);
  };

  const volverAFincas = () => {
    setVistaActual('fincas');
    setFincaSeleccionada(null);
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
            {loteSeleccionado && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {vistaActual === 'fincas' ? (
                  <Badge variant="default">{loteSeleccionado.nombre}</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={volverAFincas}
                    className="h-7 px-2"
                  >
                    {loteSeleccionado.nombre}
                  </Button>
                )}
              </>
            )}
            {fincaSeleccionada && vistaActual === 'plantas' && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Badge variant="default">{fincaSeleccionada.nombre}</Badge>
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
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
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
        </div>

        <div className="text-sm text-gray-600">
          {vistaActual === 'lotes' && `${lotes.length} lote${lotes.length !== 1 ? 's' : ''}`}
          {vistaActual === 'fincas' && `${fincasDelLote.length} finca${fincasDelLote.length !== 1 ? 's' : ''}`}
          {vistaActual === 'plantas' && `${plantasDelLote.length} planta${plantasDelLote.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {/* Mapa */}
      <Card className="overflow-hidden relative">
        <div ref={mapRef} style={{ height, width: '100%' }} className="bg-gray-100" />
        {!mapaListo && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando mapa...</p>
            </div>
          </div>
        )}
      </Card>

      {/* Ayuda contextual */}
      {vistaActual === 'lotes' && lotes.length > 0 && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Consejo:</strong> Haz click en un lote para ver las fincas que contiene
          </p>
        </Card>
      )}
      {vistaActual === 'fincas' && fincasDelLote.length > 0 && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Consejo:</strong> Haz click en una finca (polígonos en escala de grises) para ver las plantas
          </p>
        </Card>
      )}
      {vistaActual === 'plantas' && plantasDelLote.length > 0 && (
        <Card className="p-3 bg-green-50 border-green-200">
          <p className="text-sm text-green-900">
            🌱 <strong>Plantas georeferenciadas:</strong> Cada hexágono representa una planta con su ubicación exacta y estado
          </p>
        </Card>
      )}
    </div>
  );
};

export default MapaReal;
