import { useState } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/shared/components/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLotesPage } from '../hooks/useLotes';
import { Lote } from '../types/lotes.types';
import { SiglaCell, GrupoCell, KeyValueCell, FincaIdCell, ActionsCell } from '../components/LotesCellTemplates';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Lotes() {
  const { lotes, isLoading } = useLotesPage();
  const [loteParaVerCoordenadas, setLoteParaVerCoordenadas] = useState<Lote | null>(null);

  const handleVerCoordenadas = (lote: Lote) => {
    setLoteParaVerCoordenadas(lote);
  };

  const handleCloseCoordenadas = () => {
    setLoteParaVerCoordenadas(null);
  };

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
    {
      key: 'actions',
      header: 'Acciones',
      render: (lote: Lote) => ActionsCell({ lote, onVerCoordenadas: handleVerCoordenadas }),
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
        filterPlaceholder="Buscar lote por nombre..."
        filterKey="nombre"
        pageSizeOptions={[5, 10, 15, 20]}
        defaultPageSize={10}
      />

      {/* Dialog para ver coordenadas */}
      <Dialog open={!!loteParaVerCoordenadas} onOpenChange={handleCloseCoordenadas}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Coordenadas del Lote</DialogTitle>
            <DialogDescription>
              Información de coordenadas para el lote: {loteParaVerCoordenadas?.nombre}
            </DialogDescription>
          </DialogHeader>
          
          {loteParaVerCoordenadas && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID del Lote</p>
                  <p className="text-sm font-mono">{loteParaVerCoordenadas.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Key Value</p>
                  <p className="text-sm font-mono">{loteParaVerCoordenadas.keyValue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Finca ID</p>
                  <p className="text-sm">{loteParaVerCoordenadas.fincaId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-sm font-semibold">{loteParaVerCoordenadas.nombre}</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Las coordenadas del lote se obtendrán desde el servicio de mapas.
                </p>
                <p className="text-xs text-muted-foreground">
                  Nota: Esta funcionalidad requiere conectarse al endpoint de coordenadas del lote.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

