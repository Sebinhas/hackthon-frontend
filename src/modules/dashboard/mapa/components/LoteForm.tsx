import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Coordenada, CreateLoteDto, EstadoLote, TipoSuelo, Topografia, SistemaRiego } from '@/types/lotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SelectorCoordenadasAlternativo as SelectorCoordenadas } from './SelectorCoordenadasAlternativo';
import { calcularArea, calcularPerimetro } from '../services/lotesService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LoteFormProps {
  initialData?: Partial<CreateLoteDto>;
  onSubmit: (data: CreateLoteDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const LoteForm = ({ initialData, onSubmit, onCancel, isLoading }: LoteFormProps) => {
  const [coordenadas, setCordenadas] = useState<Coordenada[]>(initialData?.coordenadas || []);
  const [tabActiva, setTabActiva] = useState('basico');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateLoteDto>({
    defaultValues: {
      codigo: initialData?.codigo || '',
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      coordenadas: initialData?.coordenadas || [],
      area_hectareas: initialData?.area_hectareas || 0,
      perimetro_metros: initialData?.perimetro_metros || 0,
      altitud_msnm: initialData?.altitud_msnm || 0,
      estado: initialData?.estado || EstadoLote.EN_CRECIMIENTO,
      tipo_suelo: initialData?.tipo_suelo,
      ph_suelo: initialData?.ph_suelo,
      topografia: initialData?.topografia,
      sistema_riego: initialData?.sistema_riego,
      tiene_cerca: initialData?.tiene_cerca || false,
      tiene_sombra: initialData?.tiene_sombra || false,
      acceso_vehicular: initialData?.acceso_vehicular || false,
      notas: initialData?.notas || ''
    }
  });
  
  const handleFormSubmit = (data: CreateLoteDto) => {
    // Calcular automáticamente área y perímetro basado en coordenadas
    const area = coordenadas.length >= 3 ? calcularArea(coordenadas) : 0;
    const perimetro = coordenadas.length >= 2 ? calcularPerimetro(coordenadas) : 0;
    
    onSubmit({
      ...data,
      coordenadas,
      area_hectareas: area,
      perimetro_metros: perimetro
    });
  };
  
  const tieneCerca = watch('tiene_cerca');
  const tieneSombra = watch('tiene_sombra');
  const accesoVehicular = watch('acceso_vehicular');
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basico">Información Básica</TabsTrigger>
          <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
          <TabsTrigger value="caracteristicas">Características</TabsTrigger>
        </TabsList>
        
        {/* TAB 1: INFORMACIÓN BÁSICA */}
        <TabsContent value="basico" className="space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">
                  Código del Lote <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigo"
                  {...register('codigo', { 
                    required: 'El código es obligatorio',
                    pattern: {
                      value: /^LOT-\d{3,}$/,
                      message: 'Formato: LOT-001, LOT-002, etc.'
                    }
                  })}
                  placeholder="LOT-001"
                />
                {errors.codigo && (
                  <p className="text-sm text-red-500">{errors.codigo.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre del Lote <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  placeholder="Lote Norte A"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  {...register('descripcion')}
                  placeholder="Descripción del lote..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">
                  Estado del Lote <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch('estado')}
                  onValueChange={(value) => setValue('estado', value as EstadoLote)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EstadoLote.EN_CRECIMIENTO}>En Crecimiento</SelectItem>
                    <SelectItem value={EstadoLote.EN_COSECHA}>En Cosecha</SelectItem>
                    <SelectItem value={EstadoLote.EN_MANTENIMIENTO}>En Mantenimiento</SelectItem>
                    <SelectItem value={EstadoLote.INACTIVO}>Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area_hectareas">
                  Área (hectáreas) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="area_hectareas"
                  type="number"
                  step="0.01"
                  {...register('area_hectareas', { 
                    required: 'El área es obligatoria',
                    min: { value: 0.01, message: 'El área debe ser mayor a 0' }
                  })}
                  placeholder="5.2"
                />
                {errors.area_hectareas && (
                  <p className="text-sm text-red-500">{errors.area_hectareas.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="perimetro_metros">Perímetro (metros)</Label>
                <Input
                  id="perimetro_metros"
                  type="number"
                  {...register('perimetro_metros')}
                  placeholder="910"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="altitud_msnm">Altitud (msnm)</Label>
                <Input
                  id="altitud_msnm"
                  type="number"
                  {...register('altitud_msnm')}
                  placeholder="1850"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* TAB 2: UBICACIÓN */}
        <TabsContent value="ubicacion" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Delimita el lote haciendo clic en el mapa. Se necesitan mínimo 3 puntos.
            </AlertDescription>
          </Alert>
          
          <SelectorCoordenadas
            value={coordenadas}
            onChange={setCordenadas}
            height="500px"
          />
          
          {coordenadas.length < 3 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Debes agregar al menos 3 puntos para delimitar el lote.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* TAB 3: CARACTERÍSTICAS */}
        <TabsContent value="caracteristicas" className="space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_suelo">Tipo de Suelo</Label>
                <Select
                  value={watch('tipo_suelo')}
                  onValueChange={(value) => setValue('tipo_suelo', value as TipoSuelo)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TipoSuelo.ARCILLOSO}>Arcilloso</SelectItem>
                    <SelectItem value={TipoSuelo.ARENOSO}>Arenoso</SelectItem>
                    <SelectItem value={TipoSuelo.LIMOSO}>Limoso</SelectItem>
                    <SelectItem value={TipoSuelo.FRANCO}>Franco</SelectItem>
                    <SelectItem value={TipoSuelo.HUMIFERO}>Humífero</SelectItem>
                    <SelectItem value={TipoSuelo.PEDREGOSO}>Pedregoso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ph_suelo">pH del Suelo</Label>
                <Input
                  id="ph_suelo"
                  type="number"
                  step="0.1"
                  {...register('ph_suelo', {
                    min: { value: 0, message: 'pH mínimo es 0' },
                    max: { value: 14, message: 'pH máximo es 14' }
                  })}
                  placeholder="6.5"
                />
                {errors.ph_suelo && (
                  <p className="text-sm text-red-500">{errors.ph_suelo.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topografia">Topografía</Label>
                <Select
                  value={watch('topografia')}
                  onValueChange={(value) => setValue('topografia', value as Topografia)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Topografia.PLANO}>Plano</SelectItem>
                    <SelectItem value={Topografia.ONDULADO}>Ondulado</SelectItem>
                    <SelectItem value={Topografia.INCLINADO}>Inclinado</SelectItem>
                    <SelectItem value={Topografia.MONTAÑOSO}>Montañoso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sistema_riego">Sistema de Riego</Label>
                <Select
                  value={watch('sistema_riego')}
                  onValueChange={(value) => setValue('sistema_riego', value as SistemaRiego)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SistemaRiego.GOTEO}>Goteo</SelectItem>
                    <SelectItem value={SistemaRiego.ASPERSION}>Aspersión</SelectItem>
                    <SelectItem value={SistemaRiego.GRAVEDAD}>Gravedad</SelectItem>
                    <SelectItem value={SistemaRiego.MICROASPERSION}>Microaspersión</SelectItem>
                    <SelectItem value={SistemaRiego.NINGUNO}>Ninguno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 md:col-span-2">
                <Label>Infraestructura</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tiene_cerca"
                      checked={tieneCerca}
                      onCheckedChange={(checked) => setValue('tiene_cerca', checked as boolean)}
                    />
                    <Label htmlFor="tiene_cerca" className="font-normal cursor-pointer">
                      Tiene cerca perimetral
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tiene_sombra"
                      checked={tieneSombra}
                      onCheckedChange={(checked) => setValue('tiene_sombra', checked as boolean)}
                    />
                    <Label htmlFor="tiene_sombra" className="font-normal cursor-pointer">
                      Tiene sombra
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceso_vehicular"
                      checked={accesoVehicular}
                      onCheckedChange={(checked) => setValue('acceso_vehicular', checked as boolean)}
                    />
                    <Label htmlFor="acceso_vehicular" className="font-normal cursor-pointer">
                      Acceso vehicular
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea
                  id="notas"
                  {...register('notas')}
                  placeholder="Observaciones, recomendaciones, etc..."
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          {coordenadas.length === 0 && (
            <span className="text-orange-600">⚠️ Falta delimitar el lote en el mapa</span>
          )}
          {coordenadas.length > 0 && coordenadas.length < 3 && (
            <span className="text-orange-600">⚠️ Se necesitan al menos 3 puntos</span>
          )}
          {coordenadas.length >= 3 && (
            <span className="text-green-600">✓ Lote delimitado correctamente</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isLoading || coordenadas.length < 3}
          >
            {isLoading ? 'Guardando...' : 'Guardar Lote'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoteForm;

