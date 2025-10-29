import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectorFincas } from './SelectorFincas';
import { useObtenerFincas, useObtenerLotesPorFinca, useObtenerPlantasPorLote } from '../hooks/useFincasLotes';
import { Spinner } from '@/components/ui/spinner';
import { MapaReal } from './MapaReal';
import { Lote } from '../types/lotes.types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const VistaLotesMapa: React.FC = () => {
  const [fincaSeleccionada, setFincaSeleccionada] = useState<number | null>(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState<string | null>(null);

  // Hooks para obtener datos
  const { data: fincas = [], isLoading: isLoadingFincas } = useObtenerFincas();
  const { data: lotes = [], isLoading: isLoadingLotes } = useObtenerLotesPorFinca(fincaSeleccionada);
  const { data: plantas = [], isLoading: isLoadingPlantas } = useObtenerPlantasPorLote(loteSeleccionado);

  // Debug logs
  console.log('Debug VistaLotesMapa:', {
    fincaSeleccionada,
    lotes,
    isLoadingLotes,
    lotesLength: lotes.length
  });

  // Resetear lote cuando cambia la finca
  const handleFincaChange = (fincaId: number | null) => {
    setFincaSeleccionada(fincaId);
    setLoteSeleccionado(null); // Resetear lote seleccionado
  };

  // Obtener el lote seleccionado completo
  const loteActual = lotes.find(lote => lote.id === loteSeleccionado);

  // Función para manejar clicks en lotes del mapa
  const handleLoteClick = (lote: Lote | null) => {
    if (lote) {
      setLoteSeleccionado(lote.id);
    } else {
      setLoteSeleccionado(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Header con información */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Lotes y Spots</h1>
          <p className="text-muted-foreground mt-1">
            Paso 1: Selecciona una finca → Paso 2: Haz click en un lote para ver los spots
          </p>
        </div>
      </div>

      {/* Paso 1: Selector de Finca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paso 1: Seleccionar Finca</CardTitle>
        </CardHeader>
        <CardContent>
          <SelectorFincas
            fincas={fincas}
            fincaSeleccionada={fincaSeleccionada}
            onFincaChange={handleFincaChange}
            isLoading={isLoadingFincas}
          />
        </CardContent>
      </Card>

      {/* Mostrar mapa con lotes de la finca si hay finca seleccionada */}
      {fincaSeleccionada && (
        <>
          {/* Mapa con lotes de la finca */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">
                Mapa de Lotes
                {loteSeleccionado && loteActual && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    - Lote seleccionado: {loteActual.nombre}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
               {/* Información del lote seleccionado */}
          {loteSeleccionado && loteActual && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Lote</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{loteActual.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{loteActual.codigo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Área:</span> {loteActual.area_hectareas} ha
                      </div>
                      <div>
                        <span className="font-medium">Estado:</span> {loteActual.estado}
                      </div>
                      <div>
                        <span className="font-medium">Cultivo:</span> {loteActual.cultivo_nombre || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Perímetro:</span> {loteActual.perimetro_metros || 'N/A'} m
                      </div>
                    </div>
                    {loteActual.descripcion && (
                      <div>
                        <span className="font-medium text-sm">Descripción:</span>
                        <p className="text-sm text-muted-foreground mt-1">{loteActual.descripcion}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estadísticas de Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPlantas ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner size="md" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-3xl font-bold text-gray-900">{plantas.length}</div>
                          <div className="text-sm text-gray-600 mt-1">Total Spots</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            {plantas.filter(p => p.cargado).length}
                          </div>
                          <div className="text-sm text-green-700 mt-1">Spots Plantados</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-100 rounded-lg">
                        <div className="text-3xl font-bold text-gray-600">
                          {plantas.filter(p => !p.cargado).length}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">Spots Vacíos</div>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 border border-green-600 opacity-70"></div>
                          <span>Plantados</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-400 border border-gray-500 opacity-40"></div>
                          <span>Vacíos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-0.5 bg-blue-500"></div>
                          <span>Líneas</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
            <CardContent className="p-0 h-[600px]">
              {(() => {
                console.log('Renderizando mapa:', { isLoadingLotes, lotesLength: lotes.length });
                
                if (isLoadingLotes) {
                  return (
                    <div className="flex items-center justify-center h-full">
                      <Spinner size="lg" />
                    </div>
                  );
                }
                
                if (lotes.length === 0) {
                  return (
                    <div className="flex items-center justify-center h-full">
                      <Alert className="max-w-md">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          No hay lotes disponibles para esta finca
                        </AlertDescription>
                      </Alert>
                    </div>
                  );
                }
                
                console.log('Renderizando MapaReal con lotes:', lotes);
                return (
                  <MapaReal
                    lotes={lotes}
                    height="800px"
                    onLoteClick={handleLoteClick}
                    mostrarLeyenda={true}
                    plantasDelLote={plantas}
                    loteSeleccionado={loteActual || null}
                  />
                );
              })()}
            </CardContent>
          </Card>

       

          {/* Mapa de spots: mostrado en el mismo mapa superior (MapaReal) al seleccionar lote */}
        </>
      )}

      {/* Mensaje inicial si no hay finca seleccionada */}
      {!fincaSeleccionada && (
        <Card className="flex-1">
          <CardContent className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Selecciona una finca para comenzar
              </h3>
              <p className="text-sm text-gray-500">
                Primero selecciona una finca para ver sus lotes en el mapa
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};