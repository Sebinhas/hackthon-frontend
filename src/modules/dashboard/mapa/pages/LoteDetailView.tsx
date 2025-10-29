import { useNavigate, useParams } from 'react-router-dom';
import { useLote, useDeleteLote } from '../hooks/useLotesQuery';
// import { useActividadesDelLote } from '../../planificacion/hooks/usePlanificacionQuery';
import { COLORES_ESTADO } from '@/modules/dashboard/lotes/types/lotes.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MapaReal from '../components/MapaReal';
import { ArrowLeft, Edit, Trash2, MapPin, Leaf, Droplet, Users, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const LoteDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lote, isLoading } = useLote(id!);
  // const { data: actividadesLote = [] } = useActividadesDelLote(id || '');
  const actividadesLote: any[] = [];
  const deleteLote = useDeleteLote();

  // Preparar datos de trabajadores para el mapa
  const trabajadoresParaMapa = actividadesLote
    .filter(act => act.estado === 'EN_PROGRESO' || act.estado === 'PENDIENTE' || act.estado === 'ATRASADA')
    .flatMap(act => 
      (act.trabajadores_nombres || []).map((nombre) => ({
        nombre,
        actividad: act.nombre
      }))
    )
    // Eliminar duplicados por nombre
    .filter((trabajador, index, self) => 
      index === self.findIndex((t: { nombre: string; actividad: string }) => t.nombre === trabajador.nombre)
    );

  // Debug: Log para verificar datos
  console.log('🔍 Debug LoteDetailView:', {
    actividadesLote: actividadesLote.length,
    actividadesConTrabajadores: actividadesLote.filter(act => act.trabajadores_nombres?.length > 0),
    trabajadoresParaMapa: trabajadoresParaMapa.length,
    trabajadoresData: trabajadoresParaMapa
  });
  
  const handleDelete = async () => {
    if (!lote || !window.confirm(`¿Estás seguro de eliminar el lote "${lote.nombre}"?`)) {
      return;
    }
    
    try {
      await deleteLote.mutateAsync(lote.id);
      navigate('/dashboard/lotes');
    } catch (error) {
      console.error('Error al eliminar lote:', error);
    }
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
  
  const colors = COLORES_ESTADO[lote.estado];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard/lotes')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lote.nombre}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-600">{lote.codigo}</span>
              <Badge
                style={{
                  backgroundColor: colors.color + '20',
                  color: colors.color,
                  border: `1px solid ${colors.color}`
                }}
              >
                {colors.label}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/lotes/${id}/editar`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteLote.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
      
      {/* Descripción */}
      {lote.descripcion && (
        <Card className="p-4">
          <p className="text-gray-700">{lote.descripcion}</p>
        </Card>
      )}
      
      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold">Ubicación y Medidas</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Área:</span>
              <span className="font-medium">{lote.area_hectareas} ha</span>
            </div>
            {lote.perimetro_metros && (
              <div className="flex justify-between">
                <span className="text-gray-600">Perímetro:</span>
                <span className="font-medium">{lote.perimetro_metros} m</span>
              </div>
            )}
            {lote.altitud_msnm && (
              <div className="flex justify-between">
                <span className="text-gray-600">Altitud:</span>
                <span className="font-medium">{lote.altitud_msnm} msnm</span>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold">Características del Suelo</h3>
          </div>
          <div className="space-y-2 text-sm">
            {lote.tipo_suelo ? (
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de suelo:</span>
                <span className="font-medium">{lote.tipo_suelo}</span>
              </div>
            ) : (
              <div className="text-gray-400">No especificado</div>
            )}
            {lote.ph_suelo && (
              <div className="flex justify-between">
                <span className="text-gray-600">pH:</span>
                <span className="font-medium">{lote.ph_suelo}</span>
              </div>
            )}
            {lote.topografia && (
              <div className="flex justify-between">
                <span className="text-gray-600">Topografía:</span>
                <span className="font-medium">{lote.topografia}</span>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Droplet className="h-5 w-5 text-cyan-600" />
            </div>
            <h3 className="font-semibold">Sistema de Riego</h3>
          </div>
          <div className="space-y-2 text-sm">
            {lote.sistema_riego ? (
              <div className="text-lg font-medium">{lote.sistema_riego}</div>
            ) : (
              <div className="text-gray-400">Sin sistema de riego</div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Infraestructura */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Infraestructura</h3>
        <div className="flex gap-3 flex-wrap">
          {lote.tiene_cerca && (
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Cerca perimetral</span>
            </div>
          )}
          {lote.tiene_sombra && (
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <span>Sombra</span>
            </div>
          )}
          {lote.acceso_vehicular && (
            <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <span>Acceso vehicular</span>
            </div>
          )}
          {!lote.tiene_cerca && !lote.tiene_sombra && !lote.acceso_vehicular && (
            <div className="text-gray-400">Sin infraestructura registrada</div>
          )}
        </div>
      </Card>

      {/* Trabajadores Asignados y Actividades */}
      {actividadesLote.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trabajadores Activos en este Lote */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Trabajadores Asignados</h3>
              <Badge variant="outline" className="ml-auto">
                {(() => {
                  const trabajadoresUnicos = new Set(
                    actividadesLote
                      .filter(act => act.estado === 'EN_PROGRESO' || act.estado === 'PENDIENTE')
                      .flatMap(act => act.trabajadores_nombres || [])
                  );
                  return trabajadoresUnicos.size;
                })()}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {(() => {
                // Obtener trabajadores únicos de actividades activas
                const trabajadoresMap = new Map();
                actividadesLote
                  .filter(act => act.estado === 'EN_PROGRESO' || act.estado === 'PENDIENTE' || act.estado === 'ATRASADA')
                  .forEach(act => {
                    (act.trabajadores_nombres || []).forEach((nombre, index) => {
                      const id = act.trabajadores_asignados?.[index] || `temp-${nombre}`;
                      if (!trabajadoresMap.has(id)) {
                        trabajadoresMap.set(id, {
                          id,
                          nombre,
                          actividades: []
                        });
                      }
                      trabajadoresMap.get(id).actividades.push(act.nombre);
                    });
                  });
                
                const trabajadores = Array.from(trabajadoresMap.values());
                
                if (trabajadores.length === 0) {
                  return (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p>No hay trabajadores asignados actualmente</p>
                    </div>
                  );
                }
                
                return trabajadores.map((trabajador) => (
                  <div key={trabajador.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {trabajador.nombre.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{trabajador.nombre}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {trabajador.actividades.length} actividad{trabajador.actividades.length > 1 ? 'es' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trabajador.actividades.slice(0, 2).map((actNombre: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {actNombre.length > 20 ? actNombre.substring(0, 20) + '...' : actNombre}
                          </Badge>
                        ))}
                        {trabajador.actividades.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{trabajador.actividades.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </Card>

          {/* Actividades Planificadas */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Actividades Planificadas</h3>
              <Badge variant="outline" className="ml-auto">
                {actividadesLote.length}
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {actividadesLote.map((actividad) => (
                <div
                  key={actividad.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => navigate(`/dashboard/planificacion/${actividad.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{actividad.nombre}</h4>
                    <Badge 
                      variant="outline" 
                      className={
                        actividad.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800 border-green-300' :
                        actividad.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        actividad.estado === 'ATRASADA' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-gray-100 text-gray-800 border-gray-300'
                      }
                    >
                      {actividad.estado}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{actividad.tipo}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span>{actividad.trabajadores_asignados?.length || 0} trabajadores</span>
                    <span className="ml-auto">{actividad.progreso_porcentaje}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {/* Mapa */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Ubicación en el Mapa</h3>
          {actividadesLote.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Trabajadores en el lote
            </Badge>
          )}
        </div>
        <MapaReal
          lotes={[lote]}
          height="500px"
          mostrarLeyenda={false}
          mostrarTrabajadores={trabajadoresParaMapa.length > 0}
          trabajadoresData={trabajadoresParaMapa}
        />
        {trabajadoresParaMapa.length > 0 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Los puntos azules en el mapa representan a los {trabajadoresParaMapa.length} trabajador{trabajadoresParaMapa.length > 1 ? 'es' : ''} asignado{trabajadoresParaMapa.length > 1 ? 's' : ''} a actividades en este lote. Haz clic en ellos para ver más información.
          </p>
        )}
      </Card>
      
      {/* Notas */}
      {lote.notas && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Notas Adicionales</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{lote.notas}</p>
        </Card>
      )}
      
      {/* Información del Sistema */}
      <Card className="p-4 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="block text-xs">Fecha de creación</span>
            <span className="font-medium">{new Date(lote.fecha_creacion).toLocaleDateString('es-CO')}</span>
          </div>
          {lote.fecha_ultima_modificacion && (
            <div>
              <span className="block text-xs">Última modificación</span>
              <span className="font-medium">{new Date(lote.fecha_ultima_modificacion).toLocaleDateString('es-CO')}</span>
            </div>
          )}
          {lote.fecha_ultima_actividad && (
            <div>
              <span className="block text-xs">Última actividad</span>
              <span className="font-medium">{new Date(lote.fecha_ultima_actividad).toLocaleDateString('es-CO')}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoteDetailView;

