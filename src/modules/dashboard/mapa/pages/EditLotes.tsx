import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useEditLotesPage } from '../hooks/useEditLotes';

export default function EditLotes() {
  const { id } = useParams<{ id: string }>();
  const {
    lote,
    isLoadingLote,
    handleSubmit,
    handleCancel,
    isUpdating,
  } = useEditLotesPage(id!);

  if (isLoadingLote) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lote no encontrado</p>
        <Button onClick={handleCancel} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Lote</h1>
          <p className="text-muted-foreground mt-1">
            Modifica la información del lote
          </p>
        </div>
      </div>

      <div className="p-8 border rounded-lg">
        <h3 className="font-bold">{lote.nombre}</h3>
        <p className="text-muted-foreground">{lote.codigo}</p>
        <p className="mt-4">{lote.descripcion}</p>
        
        <div className="p-8 border rounded-lg text-center mt-8">
          <p className="text-muted-foreground">Formulario en construcción</p>
          <p className="text-sm text-muted-foreground mt-2">
            El formulario de edición de lotes se implementará aquí
          </p>
          <Button onClick={handleCancel} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}

