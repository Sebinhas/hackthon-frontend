import { useState, useMemo } from 'react';
import { Lote, COLORES_ESTADO, EstadoLote } from '@/types/lotes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ============================================================================
// COMPONENTE DE MAPA ALTERNATIVO (SIN LEAFLET)
// ============================================================================

interface MapaAlternativoProps {
  lotes: Lote[];
  height?: string;
  onLoteClick?: (lote: Lote) => void;
  loteSeleccionado?: string;
  mostrarLeyenda?: boolean;
}

export const MapaAlternativo = ({ 
  lotes, 
  height = '600px',
  onLoteClick,
  loteSeleccionado,
  mostrarLeyenda = true
}: MapaAlternativoProps) => {
  const [tipoMapa, setTipoMapa] = useState<'satellite' | 'streets'>('satellite');
  
  // Calcular el centro del mapa basado en todos los lotes
  const centroMapa = useMemo(() => {
    if (lotes.length === 0) {
      return { lat: 4.6097, lng: -74.0817 }; // Centro por defecto (Bogotá)
    }
    
    let totalLat = 0;
    let totalLng = 0;
    let totalPuntos = 0;
    
    lotes.forEach(lote => {
      lote.coordenadas.forEach(coord => {
        totalLat += coord.lat;
        totalLng += coord.lng;
        totalPuntos++;
      });
    });
    
    return { lat: totalLat / totalPuntos, lng: totalLng / totalPuntos };
  }, [lotes]);
  
  return (
    <div className="space-y-4">
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
            variant={tipoMapa === 'streets' ? 'default' : 'outline'}
            onClick={() => setTipoMapa('streets')}
          >
            🗺️ Vista de Calles
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          Centro: {centroMapa.lat.toFixed(4)}, {centroMapa.lng.toFixed(4)}
        </div>
      </div>
      
      {/* Mapa simulado */}
      <Card className="p-4" style={{ height }}>
        <div className={`w-full h-full rounded-lg relative overflow-hidden ${
          tipoMapa === 'satellite' 
            ? 'bg-gradient-to-br from-green-800 via-green-600 to-yellow-700' 
            : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
        }`}>
          {/* Simulación de terreno */}
          <div className="absolute inset-0 opacity-30">
            {tipoMapa === 'satellite' ? (
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-emerald-600 to-green-800"></div>
            ) : (
              <div className="w-full h-full">
                {/* Simulación de calles */}
                <svg className="w-full h-full">
                  <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#999" strokeWidth="2" />
                  <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#999" strokeWidth="2" />
                  <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#999" strokeWidth="2" />
                  <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#999" strokeWidth="2" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Lotes distribuidos en grid */}
          {lotes.map((lote, index) => {
            const colors = COLORES_ESTADO[lote.estado];
            const esSeleccionado = loteSeleccionado === lote.id;
            
            // Distribuir en grid para que todos sean visibles
            const columns = Math.ceil(Math.sqrt(lotes.length));
            const row = Math.floor(index / columns);
            const col = index % columns;
            
            const spacingX = 85 / (columns + 1);
            const spacingY = 85 / (Math.ceil(lotes.length / columns) + 1);
            
            const posX = 10 + spacingX * (col + 1);
            const posY = 10 + spacingY * (row + 1);
            
            // Tamaño proporcional al área
            const size = Math.max(60, Math.min(120, lote.area_hectareas * 15));
            
            return (
              <div
                key={lote.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  width: `${size}px`,
                  height: `${size * 0.75}px`,
                  backgroundColor: esSeleccionado ? '#3b82f680' : colors.fillColor,
                  border: `3px solid ${esSeleccionado ? '#3b82f6' : colors.color}`,
                  borderRadius: '12px',
                  zIndex: esSeleccionado ? 10 : 5,
                  boxShadow: esSeleccionado ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
                }}
                onClick={() => onLoteClick?.(lote)}
              >
                <div className="p-1 text-xs h-full flex flex-col justify-center items-center text-center">
                  <div className="font-bold truncate w-full" title={lote.nombre}>
                    {lote.nombre}
                  </div>
                  <div className="text-[10px] opacity-75">
                    {lote.codigo}
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {lote.area_hectareas} ha
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Mensaje si no hay lotes */}
          {lotes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📍</div>
                <p>No hay lotes para mostrar</p>
              </div>
            </div>
          )}
          
          {/* Overlay de información */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
            <div className="font-semibold text-sm mb-2 flex items-center gap-2">
              {tipoMapa === 'satellite' ? '🛰️' : '🗺️'} Vista {tipoMapa === 'satellite' ? 'Satelital' : 'de Calles'}
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Lotes visibles:</span>
                <span className="font-semibold">{lotes.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Área total:</span>
                <span className="font-semibold">{lotes.reduce((sum, l) => sum + (Number(l.area_hectareas) || 0), 0).toFixed(1)} ha</span>
              </div>
              {lotes.length > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Área promedio:</span>
                  <span className="font-semibold">
                    {(lotes.reduce((sum, l) => sum + (Number(l.area_hectareas) || 0), 0) / lotes.length).toFixed(1)} ha
                  </span>
                </div>
              )}
            </div>
            {lotes.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-300 text-[10px] text-gray-500 italic">
                💡 Click en un lote para ver detalles
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Leyenda */}
      {mostrarLeyenda && (
        <Card className="p-4">
          <h4 className="font-semibold text-sm mb-3">Leyenda de Estados</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(COLORES_ESTADO).map(([estado, config]) => {
              const count = lotes.filter(l => l.estado === estado).length;
              if (count === 0) return null;
              
              return (
                <div key={estado} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-4 h-4 rounded border-2 flex-shrink-0"
                    style={{
                      backgroundColor: config.fillColor,
                      borderColor: config.color
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{config.label}</div>
                    <div className="text-gray-500">({count})</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {/* Lista de lotes */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Lista de Lotes</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {lotes.map((lote) => {
            const colors = COLORES_ESTADO[lote.estado];
            
            return (
              <div
                key={lote.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onLoteClick?.(lote)}
              >
                <div
                  className="w-4 h-4 rounded border-2 flex-shrink-0"
                  style={{
                    backgroundColor: colors.fillColor,
                    borderColor: colors.color
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{lote.nombre}</div>
                  <div className="text-xs text-gray-500">
                    {lote.codigo} • {lote.area_hectareas} ha
                    {lote.cultivo_nombre && ` • ${lote.cultivo_nombre}`}
                  </div>
                </div>
                <Badge
                  style={{
                    backgroundColor: colors.color + '20',
                    color: colors.color,
                    border: `1px solid ${colors.color}`
                  }}
                >
                  {colors.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default MapaAlternativo;
