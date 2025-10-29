import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Lote } from '../types/lotes.types';

export const SiglaCell = ({ sigla }: { sigla: string }) => (
  <Badge variant="outline" className="font-mono">
    {sigla}
  </Badge>
);

export const GrupoCell = ({ grupo }: { grupo: string }) => (
  <span className="font-medium text-neutral-700">{grupo}</span>
);

export const KeyValueCell = ({ keyValue }: { keyValue: number }) => (
  <div className="text-center">
    <Badge variant="secondary">{keyValue}</Badge>
  </div>
);

export const FincaIdCell = ({ fincaId }: { fincaId: number }) => (
  <div className="text-center">
    <Badge variant="outline">{fincaId}</Badge>
  </div>
);

export const ActionsCell = ({ 
  lote, 
  onVerCoordenadas 
}: { 
  lote: Lote; 
  onVerCoordenadas: (lote: Lote) => void;
}) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onVerCoordenadas(lote)}
      className="h-8 px-2"
    >
      <MapPin className="h-4 w-4 mr-1" />
      Ver coordenadas
    </Button>
  </div>
);

