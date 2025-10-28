import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/shared/components/DataTable';
import { useFincasPage } from '../hooks/useFincas';
import { Finca } from '../types/fincas.types';
import { SiglaCell, MonedaCell, PagoDiaCell, KeyValueCell } from '../components/FincasCellTemplates';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Fincas() {
  const { fincas, isLoading } = useFincasPage();

  const columns = [
    {
      key: 'key',
      header: 'Key',
      render: (finca: Finca) => <span className="font-mono text-sm">{finca.key}</span>,
    },
    {
      key: 'grupo',
      header: 'Grupo',
      render: (finca: Finca) => <span className="font-medium">{finca.grupo}</span>,
    },
    {
      key: 'sigla',
      header: 'Sigla',
      render: (finca: Finca) => SiglaCell({ sigla: finca.sigla }),
    },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (finca: Finca) => <span className="font-semibold">{finca.nombre}</span>,
    },
    {
      key: 'moneda',
      header: 'Moneda',
      render: (finca: Finca) => MonedaCell({ moneda: finca.moneda }),
    },
    {
      key: 'pago_dia',
      header: 'Pago Día',
      render: (finca: Finca) => PagoDiaCell({ pago_dia: finca.pago_dia }),
    },
    {
      key: 'key_value',
      header: 'Key Value',
      render: (finca: Finca) => KeyValueCell({ key_value: finca.key_value }),
    },
  ];

  if (isLoading) {
    return <Spinner size="lg" className="h-64" />;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3 invånare font-bold">Fincas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las fincas del sistema
          </p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Finca
        </Button>
      </div>

      <DataTable
        data={fincas}
        columns={columns}
        filterPlaceholder="Buscar finca..."
        filterKey="nombre"
        pageSizeOptions={[5, 10, 15]}
        defaultPageSize={10}
      />
    </motion.div>
  );
}

