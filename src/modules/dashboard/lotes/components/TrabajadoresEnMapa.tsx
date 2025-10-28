import { useEffect, useRef } from 'react';
import { useActividadesDelLote } from '../../planificacion/hooks/usePlanificacionQuery';

interface TrabajadoresEnMapaProps {
  loteId: string;
  googleMap: google.maps.Map | null;
}

/**
 * Componente que muestra marcadores de trabajadores asignados en el mapa
 * Se superpone sobre el mapa del lote para mostrar dónde están trabajando
 */
export const TrabajadoresEnMapa = ({ loteId, googleMap }: TrabajadoresEnMapaProps) => {
  const { data: actividadesLote = [] } = useActividadesDelLote(loteId);
  const marcadoresRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!googleMap || !window.google) return;

    // Limpiar marcadores anteriores
    marcadoresRef.current.forEach(marker => marker.setMap(null));
    marcadoresRef.current = [];

    // Obtener trabajadores únicos de actividades activas
    const trabajadoresMap = new Map();
    actividadesLote
      .filter(act => act.estado === 'EN_PROGRESO' || act.estado === 'PENDIENTE' || act.estado === 'ATRASADA')
      .forEach(act => {
        (act.trabajadores_nombres || []).forEach((nombre, index) => {
          const id = act.trabajadores_asignados?.[index] || `temp-${nombre}`;
          if (!trabajadoresMap.has(id)) {
            trabajadoresMap.set(id, {
              id,
              nombre,
              actividad: act.nombre
            });
          }
        });
      });

    const trabajadores = Array.from(trabajadoresMap.values());

    // Si no hay trabajadores, no hacer nada
    if (trabajadores.length === 0) return;

    // Obtener el centro del lote del mapa actual
    const center = googleMap.getCenter();
    if (!center) return;

    const lat = center.lat();
    const lng = center.lng();

    // Distribuir trabajadores en círculo alrededor del centro del lote
    const radius = 0.001; // Radio pequeño para que estén cerca del lote
    trabajadores.forEach((trabajador, index) => {
      const angle = (360 / trabajadores.length) * index;
      const radian = (angle * Math.PI) / 180;
      
      const workerLat = lat + radius * Math.cos(radian);
      const workerLng = lng + radius * Math.sin(radian);

      // Crear SVG personalizado para el marcador
      const svgMarker = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10,
      };

      const marker = new google.maps.Marker({
        position: { lat: workerLat, lng: workerLng },
        map: googleMap,
        title: trabajador.nombre,
        icon: svgMarker,
        animation: google.maps.Animation.DROP,
      });

      // InfoWindow para el trabajador
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 150px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">
                ${trabajador.nombre.charAt(0)}
              </div>
              <div>
                <div style="font-weight: 600; font-size: 14px; color: #111827;">
                  ${trabajador.nombre}
                </div>
                <div style="font-size: 11px; color: #6B7280;">
                  👷 Trabajador
                </div>
              </div>
            </div>
            <div style="padding: 6px; background: #EFF6FF; border-radius: 4px; border-left: 3px solid #3B82F6;">
              <div style="font-size: 11px; color: #6B7280; margin-bottom: 2px;">Actividad actual:</div>
              <div style="font-size: 12px; color: #1F2937; font-weight: 500;">
                ${trabajador.actividad}
              </div>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(googleMap, marker);
      });

      marcadoresRef.current.push(marker);
    });

    // Cleanup
    return () => {
      marcadoresRef.current.forEach(marker => marker.setMap(null));
      marcadoresRef.current = [];
    };
  }, [googleMap, actividadesLote, loteId]);

  return null; // Este componente no renderiza nada visible por sí mismo
};

export default TrabajadoresEnMapa;

