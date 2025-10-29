import { Badge } from '@/components/ui/badge';

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

