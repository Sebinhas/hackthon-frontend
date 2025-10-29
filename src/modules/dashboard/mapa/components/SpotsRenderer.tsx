import { useEffect, useRef } from 'react';
import { Planta } from '../types/lotes.types';

interface SpotsRendererProps {
  map: google.maps.Map | null;
  spots: Planta[];
  mostrarLineas?: boolean;
  mostrarPoligonos?: boolean;
}

export const SpotsRenderer: React.FC<SpotsRendererProps> = ({
  map,
  spots,
  mostrarLineas = true,
  mostrarPoligonos = true,
}) => {
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const linesRef = useRef<google.maps.Polyline[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);

  useEffect(() => {
    if (!map || spots.length === 0) return;

    // Limpiar polígonos, líneas, markers e infoWindows anteriores
    polygonsRef.current.forEach((polygon) => polygon.setMap(null));
    polygonsRef.current = [];
    linesRef.current.forEach((line) => line.setMap(null));
    linesRef.current = [];
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];

    // Agrupar spots por línea
    const spotsPorLinea = spots.reduce((acc, spot) => {
      if (!acc[spot.linea]) {
        acc[spot.linea] = [];
      }
      acc[spot.linea].push(spot);
      return acc;
    }, {} as Record<number, Planta[]>);

    // Renderizar cada línea
    Object.entries(spotsPorLinea).forEach(([lineaStr, spotsLinea]) => {
      const numeroLinea = parseInt(lineaStr, 10);
      
      // Ordenar spots por posición
      const spotsOrdenados = spotsLinea.sort((a, b) => a.posicion - b.posicion);

      // Crear polígonos hexagonales para cada spot
      if (mostrarPoligonos) {
        spotsOrdenados.forEach((spot) => {
          const hexagon = crearHexagono(spot.lat, spot.lng, spot.cargado || false);
          hexagon.setMap(map);
          polygonsRef.current.push(hexagon);

          // InfoWindow para el spot con nombre correcto
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-size: 13px; text-align: center; min-width: 150px;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; color: #1f2937;">
                  ${spot.nombre_spot || spot.nombre_planta || 'Spot sin nombre'}
                </div>
                ${spot.nombre_planta && spot.nombre_planta !== spot.nombre_spot ? `
                  <div style="color: #666; font-size: 12px; margin-bottom: 6px;">
                    Planta: ${spot.nombre_planta}
                  </div>
                ` : ''}
                <div style="color: ${spot.cargado ? '#16a34a' : '#6b7280'}; font-size: 11px; font-weight: 500; margin-top: 4px;">
                  ${spot.cargado ? '✓ Plantado' : '○ Vacío'}
                </div>
                <div style="color: #9ca3af; font-size: 10px; margin-top: 4px;">
                  Línea ${spot.linea} • Pos ${spot.posicion}
                </div>
              </div>
            `,
          });

          const marker = new google.maps.Marker({
            position: { lat: spot.lat, lng: spot.lng },
            map: null,
            visible: false,
          });

          marker.addListener('click', () => {
            infoWindowsRef.current.forEach((iw) => iw.close());
            infoWindow.open(map, marker);
          });

          hexagon.addListener('click', () => {
            infoWindowsRef.current.forEach((iw) => iw.close());
            infoWindow.open(map, marker);
          });

          markersRef.current.push(marker);
          infoWindowsRef.current.push(infoWindow);
        });
      }

      // Crear línea conectando los spots de esta línea
      if (mostrarLineas && spotsOrdenados.length > 1) {
        const linePath = spotsOrdenados.map(spot => ({
          lat: spot.lat,
          lng: spot.lng,
        }));

        const line = new google.maps.Polyline({
          path: linePath,
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map: map,
          clickable: true,
        });

        // InfoWindow para la línea
        const lineaInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-size: 13px; text-align: center; min-width: 120px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; color: #2563eb;">
                Línea ${numeroLinea}
              </div>
              <div style="color: #666; font-size: 11px;">
                ${spotsOrdenados.length} spot${spotsOrdenados.length !== 1 ? 's' : ''}
              </div>
            </div>
          `,
        });

        // Marca invisible en el medio de la línea para el click
        const middleIndex = Math.floor(linePath.length / 2);
        const middlePoint = linePath[middleIndex];
        const lineaMarker = new google.maps.Marker({
          position: middlePoint,
          map: null,
          visible: false,
        });

        line.addListener('click', (event: google.maps.PolyMouseEvent) => {
          infoWindowsRef.current.forEach((iw) => iw.close());
          if (event.latLng) {
            lineaInfoWindow.setPosition(event.latLng);
            lineaInfoWindow.open(map);
          } else {
            lineaInfoWindow.open(map, lineaMarker);
          }
        });

        linesRef.current.push(line);
        markersRef.current.push(lineaMarker);
        infoWindowsRef.current.push(lineaInfoWindow);
      }
    });

    // Cleanup function
    return () => {
      polygonsRef.current.forEach((polygon) => polygon.setMap(null));
      linesRef.current.forEach((line) => line.setMap(null));
      markersRef.current.forEach((marker) => marker.setMap(null));
      infoWindowsRef.current.forEach((iw) => iw.close());
    };
  }, [map, spots, mostrarLineas, mostrarPoligonos]);

  return null; // Este componente no renderiza nada en el DOM
};

// Función para crear un hexágono
function crearHexagono(lat: number, lng: number, cargado: boolean): google.maps.Polygon {
  const radio = 0.00001; // Radio del hexágono en grados (aproximadamente 1 metro) - MUCHO MÁS PEQUEÑO
  const vertices = [];

  // Crear 6 vértices del hexágono
  for (let i = 0; i < 6; i++) {
    const angulo = (i * 60) * (Math.PI / 180); // Convertir a radianes
    const x = lng + radio * Math.cos(angulo);
    const y = lat + radio * Math.sin(angulo);
    vertices.push({ lat: y, lng: x });
  }

  return new google.maps.Polygon({
    paths: vertices,
    strokeColor: cargado ? '#16a34a' : '#6b7280',
    strokeOpacity: 0.8,
    strokeWeight: 0.5, // Línea más delgada
    fillColor: cargado ? '#22c55e' : '#9ca3af',
    fillOpacity: cargado ? 0.6 : 0.3, // Más transparente
    clickable: true,
  });
}
