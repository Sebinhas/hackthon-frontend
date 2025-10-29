import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Finca } from '../../fincas/types/fincas.types';
import { Spinner } from '@/components/ui/spinner';

interface SelectorFincasProps {
  fincas: Finca[];
  fincaSeleccionada: number | null;
  onFincaChange: (fincaId: number | null) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SelectorFincas: React.FC<SelectorFincasProps> = ({
  fincas,
  fincaSeleccionada,
  onFincaChange,
  isLoading = false,
  placeholder = "Seleccionar finca..."
}) => {
  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onFincaChange(null);
    } else {
      onFincaChange(parseInt(value));
    }
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Seleccionar Finca
      </label>
      <Select
        value={fincaSeleccionada?.toString() || 'all'}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{isLoading ? <div className="flex items-center gap-2"><span>Espere un momento...</span> <Spinner size="sm" /></div> : 'Seleccionar Finca'}</SelectItem>
          {fincas.map((finca) => (
            <SelectItem key={finca.keyValue} value={finca.keyValue.toString()}>
              <div className="flex flex-col">
                <span className="font-medium">{finca.nombre}</span>
                <span className="text-xs text-gray-500">
                  {finca.grupo} - {finca.sigla}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};