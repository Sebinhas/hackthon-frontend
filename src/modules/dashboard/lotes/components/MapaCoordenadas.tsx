import { useState, useMemo, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getGoogleMapsScriptUrl } from '@/config/googleMaps';
import { Coordenada } from '../types/lotes.types';

interface MapaCoordenadasProps {
  coordenadas: Coordenada[];
  nombreLote: string;
}

export const MapaCoordenadas = ({ coordenadas, nombreLote }: MapaCoordenadasProps) => {
  const [tipoMapa, setTipoMapa] = useState<'satellite' | 'roadmap'>('satellite');
  const [mapaListo, setMapaListo] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  const centroMapa = useMemo(() => {
    if (coordenadas.length === 0) {
      return { lat: 4.6097, lng: -74.0817 };
    }

    let totalLat = 0;
    let totalLng = 0;

    coordenadas.forEach((coord) => {
      const lat = Number(coord.lat);
      const lng = Number(coord.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        totalLat += lat;
        totalLng += lng;
      }
    });

    return { 
      lat: totalLat / coordenadas.length, 
      lng: totalLng / coordenadas.length 
    };
  }, [coordenadas]);

  // Inicializar Google Maps
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

    const initMap = () => {
      if (!mapRef.current) return;

      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: centroMapa,
        zoom: 16,
        mapTypeId: tipoMapa,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
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
  }, [centroMapa]);

  // Cambiar tipo de mapa
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(tipoMapa);
    }
  }, [tipoMapa]);

  // Dibujar polígono del lote
  useEffect(() => {
    if (!googleMapRef.current || !mapaListo) return;

    // Limpiar polígono anterior
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    if (coordenadas.length < 3) return;

    const paths = coordenadas
      .filter((coord) => coord && coord.lat && coord.lng)
      .map((coord) => ({
        lat: Number(coord.lat),
        lng: Number(coord.lng),
      }));

    if (paths.length < 3) return;

    const polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: '#AA0F16',
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: '#AA0F16',
      fillOpacity: 0.3,
      map: googleMapRef.current,
      clickable: true,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #AA0F16;">${nombreLote}</h3>
          <div style="font-size: 13px; color: #666;">
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Puntos de coordenadas:</span>
              <span style="font-weight: 600; color: #AA0F16;">${coordenadas.length}</span>
            </div>
          </div>
        </div>
      `,
    });

    polygon.addListener('click', () => {
      infoWindow.setPosition(paths[0]);
      infoWindow.open(googleMapRef.current);
    });

    polygonRef.current = polygon;

    // Ajustar vista al polígono
    if (googleMapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      paths.forEach((coord) => {
        if (!isNaN(coord.lat) && !isNaN(coord.lng)) {
          bounds.extend(coord);
        }
      });
      googleMapRef.current.fitBounds(bounds);
    }
  }, [coordenadas, mapaListo, nombreLote]);

  if (coordenadas.length === 0) {
    return (
      <div className="flex items-center justify-center h-[450px] bg-neutral-100 rounded-lg border border-neutral-200">
        <div className="text-center">
          <p className="text-neutral-600 font-medium">No hay coordenadas disponibles</p>
          <p className="text-neutral-500 text-sm mt-1">
            Este lote no tiene coordenadas registradas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-700">
            Total de puntos: <span className="font-bold text-[#AA0F16]">{coordenadas.length}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={tipoMapa === 'satellite' ? 'default' : 'outline'}
            onClick={() => setTipoMapa('satellite')}
            className={tipoMapa === 'satellite' ? 'bg-[#AA0F16] hover:bg-[#8B0C12]' : ''}
          >
            🛰️ Satélite
          </Button>
          <Button
            size="sm"
            variant={tipoMapa === 'roadmap' ? 'default' : 'outline'}
            onClick={() => setTipoMapa('roadmap')}
            className={tipoMapa === 'roadmap' ? 'bg-[#AA0F16] hover:bg-[#8B0C12]' : ''}
          >
            🗺️ Calles
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden relative">
        <div ref={mapRef} style={{ height: '450px', width: '100%' }} className="bg-gray-100" />
        {!mapaListo && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA0F16] mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando mapa...</p>
            </div>
          </div>
        )}
      </Card>

      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
        <p className="text-xs font-medium text-neutral-700 mb-2">Información del mapa</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-neutral-500">Latitud Centro:</span>
            <span className="ml-2 font-mono text-neutral-700">
              {centroMapa.lat.toFixed(6)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500">Longitud Centro:</span>
            <span className="ml-2 font-mono text-neutral-700">
              {centroMapa.lng.toFixed(6)}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-[#AA0F16] bg-[#AA0F16] opacity-50"></div>
          <span className="text-xs text-neutral-600">Área del lote</span>
        </div>
      </div>

      <Card className="p-3 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          💡 <strong>Consejo:</strong> Haz click en el polígono para ver más información
        </p>
      </Card>
    </div>
  );
};

