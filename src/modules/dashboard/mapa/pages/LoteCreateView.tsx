import { useNavigate } from 'react-router-dom';
import { useCreateLote, useLotes } from '../hooks/useLotesQuery';
import { CreateLoteDto } from '@/types/lotes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoteFormSimple } from '../components/LoteFormSimple';
import { ArrowLeft, MapPin, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export const LoteCreateView = () => {
  const navigate = useNavigate();
  const createLote = useCreateLote();
  const { data: lotesExistentes = [], isLoading, error } = useLotes();
  const [mostrarLotesExistentes, setMostrarLotesExistentes] = useState(true);
  
  // Debug logs
  console.log('🔍 Debug LoteCreateView:');
  console.log('- lotesExistentes:', lotesExistentes);
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  
  const handleSubmit = async (data: CreateLoteDto) => {
    try {
      await createLote.mutateAsync(data);
      navigate('/dashboard/lotes');
    } catch (error) {
      console.error('Error al crear lote:', error);
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard/lotes');
  };
  
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
          <h1 className="text-3xl font-bold">🌾 Registrar Nuevo Lote</h1>
          <p className="text-gray-600 mt-1">
            Delimita el lote en el mapa y completa la información
          </p>
        </div>
      </div>

      {/* Lotes Existentes */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              Lotes Existentes 
              {isLoading ? ' (Cargando...)' : ` (${lotesExistentes.length})`}
            </h3>
          </div>
          {!isLoading && !error && lotesExistentes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarLotesExistentes(!mostrarLotesExistentes)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {mostrarLotesExistentes ? 'Ocultar' : 'Ver'} Lotes
            </Button>
          )}
        </div>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando lotes existentes...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h4 className="text-lg font-semibold text-red-600 mb-2">Error al cargar lotes</h4>
            <p className="text-gray-600 mb-4">
              {error.message || 'No se pudieron cargar los lotes existentes'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        )}
        
        {!isLoading && !error && lotesExistentes.length > 0 && mostrarLotesExistentes && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lotesExistentes.map((lote) => (
                <Card
                  key={lote.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                  onClick={() => navigate(`/dashboard/lotes/${lote.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{lote.nombre}</h4>
                      <p className="text-xs text-gray-500">{lote.codigo}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {lote.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Área:</span>
                      <span className="font-medium">{lote.area_hectareas} ha</span>
                    </div>
                    {lote.cultivo_nombre && (
                      <div className="flex justify-between">
                        <span>Cultivo:</span>
                        <span className="font-medium">{lote.cultivo_nombre}</span>
                      </div>
                    )}
                    {lote.sistema_riego && (
                      <div className="flex justify-between">
                        <span>Riego:</span>
                        <span className="font-medium">{lote.sistema_riego}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    {lote.tiene_cerca && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        ✓ Cerca
                      </span>
                    )}
                    {lote.tiene_sombra && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        ☀️ Sombra
                      </span>
                    )}
                    {lote.acceso_vehicular && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        🚗 Acceso
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        
        {!isLoading && !error && lotesExistentes.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📍</div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No hay lotes registrados</h4>
            <p className="text-gray-500">Este será tu primer lote en el sistema</p>
          </div>
        )}
        </Card>
      
      {/* Formulario */}
      <LoteFormSimple
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createLote.isPending}
        lotesExistentes={lotesExistentes}
      />
    </div>
  );
};

export default LoteCreateView;

