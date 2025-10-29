import { motion } from 'framer-motion';
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
      key: 'id',
      header: 'ID',
      render: (finca: Finca) => <span className="font-mono text-sm">{finca.id}</span>,
    },
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
      key: 'pagoDia',
      header: 'Pago Día',
      render: (finca: Finca) => PagoDiaCell({ pagoDia: finca.pagoDia }),
    },
    {
      key: 'keyValue',
      header: 'Key Value',
      render: (finca: Finca) => KeyValueCell({ keyValue: finca.keyValue }),
    },
    {
      key: 'tipoSujetoId',
      header: 'Tipo Sujeto',
      render: (finca: Finca) => <span className="text-muted-foreground">{finca.tipoSujetoId}</span>,
    },
    {
      key: 'tipoCultivoId',
      header: 'Tipo Cultivo',
      render: (finca: Finca) => <span className="text-muted-foreground">{finca.tipoCultivoId}</span>,
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
          <h1 className="text-3xl font-bold">Fincas</h1>
          <p className="text-muted-foreground mt-1">
            Visualiza las fincas del sistema
          </p>
        </div>
      </div>

      <DataTable
        data={fincas}
        columns={columns}
        filterPlaceholder="Buscar finca por nombre..."
        filterKey="nombre"
        pageSizeOptions={[5, 10, 15, 20]}
        defaultPageSize={10}
      />
    </motion.div>
  );
}
