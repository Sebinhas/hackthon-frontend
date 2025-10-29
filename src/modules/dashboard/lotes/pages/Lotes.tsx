import { useState } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/shared/components/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLotesPage, useObtenerCoordenadas } from '../hooks/useLotes';
import { Lote } from '../types/lotes.types';
import { SiglaCell, GrupoCell, KeyValueCell, FincaIdCell, ActionsCell } from '../components/LotesCellTemplates';
import { MapaCoordenadas } from '../components/MapaCoordenadas';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Lotes() {
  const { lotes, isLoading } = useLotesPage();
  const [loteParaVerCoordenadas, setLoteParaVerCoordenadas] = useState<Lote | null>(null);

  const { 
    data: coordenadas = [], 
    isLoading: isLoadingCoordenadas 
  } = useObtenerCoordenadas(loteParaVerCoordenadas ? parseInt(loteParaVerCoordenadas.id) : null);

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
        filterPlaceholder="Buscar en todas las columnas..."
        pageSizeOptions={[5, 10, 15, 20]}
        defaultPageSize={10}
      />

      {/* Dialog para ver coordenadas */}
      <Dialog open={!!loteParaVerCoordenadas} onOpenChange={handleCloseCoordenadas}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#AA0F16]">
              Coordenadas del Lote
            </DialogTitle>
            <DialogDescription>
              Visualización del mapa de coordenadas para: {loteParaVerCoordenadas?.nombre}
            </DialogDescription>
          </DialogHeader>
          
          {loteParaVerCoordenadas && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    ID del Lote
                  </p>
                  <p className="text-sm font-mono font-semibold mt-1">{loteParaVerCoordenadas.id}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Key Value
                  </p>
                  <p className="text-sm font-mono font-semibold mt-1">{loteParaVerCoordenadas.keyValue}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Finca ID
                  </p>
                  <p className="text-sm font-semibold mt-1">{loteParaVerCoordenadas.fincaId}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Grupo
                  </p>
                  <p className="text-sm font-semibold mt-1">{loteParaVerCoordenadas.grupo}</p>
                </div>
              </div>
              
              {isLoadingCoordenadas ? (
                <div className="flex items-center justify-center h-[400px] bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="text-sm text-neutral-600 mt-4">Cargando coordenadas...</p>
                  </div>
                </div>
              ) : (
                <MapaCoordenadas 
                  coordenadas={coordenadas} 
                  nombreLote={loteParaVerCoordenadas.nombre}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

