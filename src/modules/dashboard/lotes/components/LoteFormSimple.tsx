import { useForm } from 'react-hook-form';
import { CreateLoteDto, EstadoLote, Lote } from '@/modules/dashboard/lotes/types/lotes.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import SelectorMapaInteractivo from './SelectorMapaInteractivo';
import { calcularArea, calcularPerimetro } from '../services/lotesService';
import { AlertCircle } from 'lucide-react';

// ============================================================================
// FORMULARIO SIMPLE DE LOTE (1 PASO)
// ============================================================================

interface LoteFormSimpleProps {
  initialData?: Partial<CreateLoteDto>;
  onSubmit: (data: CreateLoteDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  lotesExistentes?: Lote[];
}

export const LoteFormSimple = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  lotesExistentes = []
}: LoteFormSimpleProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateLoteDto>({
    defaultValues: {
      nombre: initialData?.nombre || '',
      codigo: initialData?.codigo || `LOT-${Date.now()}`,
      area_hectareas: initialData?.area_hectareas || 0,
      estado: initialData?.estado || EstadoLote.EN_CRECIMIENTO,
      coordenadas: initialData?.coordenadas || [],
      cultivo_id: initialData?.cultivo_id || '',
      descripcion: initialData?.descripcion || '',
      notas: initialData?.notas || '',
    }
  });
  
  const coordenadas = watch('coordenadas');
  
  const handleFormSubmit = (data: CreateLoteDto) => {
    if (data.coordenadas.length < 3) {
      alert('Debes marcar al menos 3 puntos en el mapa para delimitar el lote');
      return;
    }
    
    // Calcular automáticamente área y perímetro basado en coordenadas
    const area = calcularArea(data.coordenadas);
    const perimetro = calcularPerimetro(data.coordenadas);
    
    // Enviar con los valores calculados
    onSubmit({
      ...data,
      area_hectareas: area,
      perimetro_metros: perimetro
    });
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información Básica */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📝 Información del Lote
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Lote *</Label>
            <Input
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              placeholder="Ej: Lote Norte"
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              {...register('codigo')}
              placeholder="Ej: LOT-001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado">Estado Operativo *</Label>
            <Select
              value={watch('estado')}
              onValueChange={(value) => setValue('estado', value as EstadoLote)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EstadoLote.EN_CRECIMIENTO}>🟢 En Crecimiento</SelectItem>
                <SelectItem value={EstadoLote.EN_COSECHA}>🟡 En Cosecha</SelectItem>
                <SelectItem value={EstadoLote.EN_MANTENIMIENTO}>🟠 En Mantenimiento</SelectItem>
                <SelectItem value={EstadoLote.INACTIVO}>⚫ Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Cultivo - Deshabilitado temporalmente hasta que se implemente el módulo de cultivos */}
          {/*
          <div className="space-y-2">
            <Label htmlFor="cultivo_id">Cultivo (Opcional)</Label>
            <Input
              id="cultivo_id"
              {...register('cultivo_id')}
              placeholder="Sin cultivo asignado"
              disabled
            />
          </div>
          */}
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Descripción del lote..."
              rows={2}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </Card>
      
      {/* Delimitación en Mapa */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🗺️ Delimitación del Lote
        </h3>
        
        <SelectorMapaInteractivo
          value={coordenadas}
          onChange={(coords) => setValue('coordenadas', coords)}
          height="450px"
          lotesExistentes={lotesExistentes}
        />
        
        {coordenadas.length > 0 && coordenadas.length < 3 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-900">
              <strong>Atención:</strong> Necesitas marcar al menos 3 puntos para crear un lote válido.
              Actualmente tienes {coordenadas.length} punto{coordenadas.length !== 1 ? 's' : ''}.
            </div>
          </div>
        )}
      </Card>
      
      {/* Notas Adicionales */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Notas Adicionales (Opcional)</h3>
        
        <textarea
          {...register('notas')}
          placeholder="Notas, observaciones o comentarios adicionales sobre el lote..."
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </Card>
      
      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || coordenadas.length < 3}
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Lote' : 'Crear Lote'}
        </Button>
      </div>
    </form>
  );
};

export default LoteFormSimple;

