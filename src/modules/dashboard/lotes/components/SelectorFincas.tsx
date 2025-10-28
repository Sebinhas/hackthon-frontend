import { Select } from '@/components/ui/select';
import { persistencia } from '@/shared/utils/persistence';
import { Finca } from '@/modules/dashboard/lotes/types/lotes.types';

interface SelectorFincasProps {
  fincaSeleccionadaId: number | null;
  onFincaChange: (fincaId: number | null) => void;
}

export const SelectorFincas = ({ fincaSeleccionadaId, onFincaChange }: SelectorFincasProps) => {
  const fincas = persistencia.getFincas();

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="finca-select" className="text-sm font-medium text-gray-700">
        Seleccionar Finca:
      </label>
      <select
        id="finca-select"
        value={fincaSeleccionadaId || ''}
        onChange={(e) => onFincaChange(e.target.value ? Number(e.target.value) : null)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="">Todas las fincas</option>
        {fincas.map((finca) => (
          <option key={finca.key_value} value={finca.key_value}>
            {finca.nombre} ({finca.sigla})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectorFincas;

