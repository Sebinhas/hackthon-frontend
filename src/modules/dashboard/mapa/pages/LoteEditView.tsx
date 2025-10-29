import { useNavigate, useParams } from 'react-router-dom';
import { useLote, useUpdateLote } from '../hooks/useLotesQuery';
import { CreateLoteDto } from '@/modules/dashboard/lotes/types/lotes.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoteFormSimple } from '../components/LoteFormSimple';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const LoteEditView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lote, isLoading } = useLote(id!);
  const updateLote = useUpdateLote();
  
  const handleSubmit = async (data: CreateLoteDto) => {
    if (!id) return;
    
    try {
      await updateLote.mutateAsync({ ...data, id });
      navigate(`/dashboard/lotes/${id}`);
    } catch (error) {
      console.error('Error al actualizar lote:', error);
    }
  };
  
  const handleCancel = () => {
    navigate(`/dashboard/lotes/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando lote...</p>
        </div>
      </div>
    );
  }
  
  if (!lote) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Lote no encontrado
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/dashboard/lotes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Lotes
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">✏️ Editar Lote</h1>
          <p className="text-gray-600 mt-1">
            Modifica la información del lote "{lote.nombre}"
          </p>
        </div>
      </div>
      
      {/* Formulario */}
      <LoteFormSimple
        initialData={lote}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateLote.isPending}
      />
    </div>
  );
};

export default LoteEditView;

