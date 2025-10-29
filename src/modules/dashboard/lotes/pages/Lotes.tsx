import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/shared/components/DataTable';
import { useLotesPage } from '../hooks/useLotes';
import { Lote } from '../types/lotes.types';
import { SiglaCell, GrupoCell, KeyValueCell, FincaIdCell } from '../components/LotesCellTemplates';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Lotes() {
  const { lotes, isLoading } = useLotesPage();

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (lote: Lote) => <span className="font-mono text-sm">{lote.id}</span>,
    },
    {
      key: 'key',
      header: 'Key',
      render: (lote: Lote) => <span className="font-mono text-sm">{lote.key}</span>,
    },
    {
      key: 'grupo',
      header: 'Grupo',
      render: (lote: Lote) => GrupoCell({ grupo: lote.grupo }),
    },
    {
      key: 'sigla',
      header: 'Sigla',
      render: (lote: Lote) => SiglaCell({ sigla: lote.sigla }),
    },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (lote: Lote) => <span className="font-semibold">{lote.nombre}</span>,
    },
    {
      key: 'fincaId',
      header: 'Finca ID',
      render: (lote: Lote) => FincaIdCell({ fincaId: lote.fincaId }),
    },
    {
      key: 'keyValue',
      header: 'Key Value',
      render: (lote: Lote) => KeyValueCell({ keyValue: lote.keyValue }),
    },
    {
      key: 'tipoSujetoId',
      header: 'Tipo Sujeto',
      render: (lote: Lote) => <span className="text-muted-foreground">{lote.tipoSujetoId}</span>,
    },
    {
      key: 'tipoCultivoId',
      header: 'Tipo Cultivo',
      render: (lote: Lote) => <span className="text-muted-foreground">{lote.tipoCultivoId}</span>,
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
          <h1 className="text-3xl font-bold">Lotes</h1>
          <p className="text-muted-foreground mt-1">
            Visualiza los lotes del sistema
          </p>
        </div>
      </div>

      <DataTable
        data={lotes}
        columns={columns}
        filterPlaceholder="Buscar en todas las columnas..."
        pageSizeOptions={[5, 10, 15, 20]}
        defaultPageSize={10}
      />
    </motion.div>
  );
}

