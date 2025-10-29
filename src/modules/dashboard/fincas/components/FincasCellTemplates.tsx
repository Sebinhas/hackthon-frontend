import { Badge } from '@/components/ui/badge';

export const SiglaCell = ({ sigla }: { sigla: string }) => (
  <Badge variant="outline" className="font-mono">
    {sigla}
  </Badge>
);

export const MonedaCell = ({ moneda }: { moneda: string }) => (
  <span className="font-medium text-neutral-700">{moneda}</span>
);

export const PagoDiaCell = ({ pagoDia }: { pagoDia: number }) => (
  <div className="text-right">
    <span className="font-semibold">${pagoDia.toLocaleString('es-CO')}</span>
  </div>
);

export const KeyValueCell = ({ keyValue }: { keyValue: number }) => (
  <div className="text-center">
    <Badge variant="secondary">{keyValue}</Badge>
  </div>
);

