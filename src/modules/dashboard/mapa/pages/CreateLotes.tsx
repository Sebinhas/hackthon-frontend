import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateLotesPage } from '../hooks/useCreateLotes';

export default function CreateLotes() {
  const { handleSubmit, handleCancel, isLoading } = useCreateLotesPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Lote</h1>
          <p className="text-muted-foreground mt-1">
            Agrega un nuevo lote agrícola
          </p>
        </div>
      </div>

      <div className="p-8 border rounded-lg text-center">
        <p className="text-muted-foreground">Formulario en construcción</p>
        <p className="text-sm text-muted-foreground mt-2">
          El formulario de creación de lotes se implementará aquí
        </p>
        <Button onClick={handleCancel} className="mt-4">
          Volver
        </Button>
      </div>
    </div>
  );
}

