import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lote, EstadoLote, COLORES_ESTADO } from '../types/lotes.types';

interface SelectorLotesProps {
  lotes: Lote[];
  loteSeleccionado: string | null;
  onLoteChange: (loteId: string | null) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SelectorLotes: React.FC<SelectorLotesProps> = ({
  lotes,
  loteSeleccionado,
  onLoteChange,
  isLoading = false,
  placeholder = "Seleccionar lote..."
}) => {
  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onLoteChange(null);
    } else {
      onLoteChange(value);
    }
  };

  const getEstadoBadge = (estado: EstadoLote) => {
    const config = COLORES_ESTADO[estado];
    return (
      <Badge 
        variant="secondary" 
        className="text-xs"
        style={{ 
          backgroundColor: config.fillColor,
          color: config.color,
          borderColor: config.color
        }}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Seleccionar Lote
      </label>
      <Select
        value={loteSeleccionado || 'all'}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los lotes</SelectItem>
          {lotes.map((lote) => (
            <SelectItem key={lote.id} value={lote.id}>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{lote.nombre}</span>
                  {getEstadoBadge(lote.estado)}
                </div>
                <div className="flex items-center justify-between w-full mt-1">
                  <span className="text-xs text-gray-500">
                    {lote.codigo} - {lote.area_hectareas} ha
                  </span>
                  {lote.cultivo_nombre && (
                    <span className="text-xs text-blue-600">
                      {lote.cultivo_nombre}
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
