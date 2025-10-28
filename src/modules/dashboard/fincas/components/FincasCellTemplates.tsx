import { Badge } from '@/components/ui/badge';

export const SiglaCell = ({ sigla }: { sigla: string }) => (
  <Badge variant="outline" className="font-mono">
    {sigla}
  </Badge>
);

export const MonedaCell = ({ moneda }: { moneda: string }) => (
  <span className="font-medium text-neutral-700">{moneda}</span>
);

export const PagoDiaCell = ({ pago_dia }: { pago_dia: number }) => (
  <div className="text-right">
    <span className="font-semibold">${pago_dia.toLocaleString('es-CO')}</span>
  </div>
);

export const KeyValueCell = ({ key_value }: { key_value: number }) => (
  <div className="text-center">
    <Badge variant="secondary">{key_value}</Badge>
  </div>
);

