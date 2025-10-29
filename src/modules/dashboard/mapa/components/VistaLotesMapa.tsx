import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SelectorFincas } from './SelectorFincas';
import { useObtenerFincas, useObtenerLotesPorFinca, useObtenerPlantasPorLote, useObtenerLineasPorLote } from '../hooks/useFincasLotes';
import { Spinner } from '@/components/ui/spinner';
import { MapaReal } from './MapaReal';
import { Lote, Planta } from '../types/lotes.types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info, Send, AlertTriangle } from 'lucide-react';
import { mockLotes } from '@/shared/mocks/mockData';
import UploadFile from '@/modules/uploadFile/pages/UploadFile';
import { Finca } from '../../fincas/types/fincas.types';
import { ValidationCompleteData } from '@/modules/uploadFile/types/uploadFile.types';
import { toast } from 'sonner';

export const VistaLotesMapa: React.FC = () => {
  // Usar URL state para persistir selecciones
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Leer parámetros de la URL o usar null como default
  const fincaIdFromUrl = searchParams.get('finca');
  const loteIdFromUrl = searchParams.get('lote');
  
  const [fincaSeleccionada, setFincaSeleccionadaState] = useState<number | null>(
    fincaIdFromUrl ? parseInt(fincaIdFromUrl) : null
  );
  const [loteSeleccionado, setLoteSeleccionadoState] = useState<string | null>(loteIdFromUrl);
  const [tabActual, setTabActual] = useState<string>('previsualizar');
  
  // Estado para datos validados del CSV
  const [datosValidadosCsv, setDatosValidadosCsv] = useState<ValidationCompleteData | null>(null);
  const [enviandoASioma, setEnviandoASioma] = useState(false);
  const [mostrarConfirmacionEnvio, setMostrarConfirmacionEnvio] = useState(false);
  const [respuestaSioma, setRespuestaSioma] = useState<any>(null);

  // Hooks para obtener datos
  const { data: fincas = [], isLoading: isLoadingFincas } = useObtenerFincas();
  const { data: lotes = [], isLoading: isLoadingLotes } = useObtenerLotesPorFinca(fincaSeleccionada);
  
  // Obtener el id_remoto del lote seleccionado para buscar plantas y líneas
  const loteRemotoId = useMemo(() => {
    if (!loteSeleccionado) return null;
    const loteData = mockLotes.find(l => l.id_local === loteSeleccionado);
    return loteData ? loteData.id_remoto.toString() : null;
  }, [loteSeleccionado]);
  
  const { data: plantas = [], isLoading: isLoadingPlantas } = useObtenerPlantasPorLote(loteRemotoId);
  const { data: lineas = [] } = useObtenerLineasPorLote(loteRemotoId);
  
  console.log('Debug loteRemotoId:', { loteSeleccionado, loteRemotoId, plantasLength: plantas.length, lineasLength: lineas.length });

  // Debug logs
  console.log('Debug VistaLotesMapa:', {
    fincaSeleccionada,
    lotes,
    isLoadingLotes,
    lotesLength: lotes.length
  });

  // Sincronizar estado local con URL cuando cambian los parámetros de URL
  useEffect(() => {
    const fincaFromUrl = searchParams.get('finca');
    const loteFromUrl = searchParams.get('lote');
    
    if (fincaFromUrl) {
      setFincaSeleccionadaState(parseInt(fincaFromUrl));
    }
    if (loteFromUrl) {
      setLoteSeleccionadoState(loteFromUrl);
    }
  }, [searchParams]);

  // Función para actualizar finca (actualiza URL)
  const handleFincaChange = (fincaId: number | null) => {
    setFincaSeleccionadaState(fincaId);
    
    // Actualizar URL
    const newParams = new URLSearchParams(searchParams);
    if (fincaId) {
      newParams.set('finca', fincaId.toString());
      newParams.delete('lote'); // Resetear lote al cambiar finca
    } else {
      newParams.delete('finca');
      newParams.delete('lote');
    }
    setSearchParams(newParams);
    
    // Resetear lote seleccionado y datos del CSV
    setLoteSeleccionadoState(null);
    setDatosValidadosCsv(null); // Limpiar datos del CSV al cambiar finca
  };

  // Obtener el lote seleccionado completo
  const loteActual = lotes.find(lote => lote.id === loteSeleccionado);

  // Función para manejar clicks en lotes del mapa (actualiza URL)
  const handleLoteClick = (lote: Lote | null) => {
    const nuevoLoteId = lote ? lote.id : null;
    setLoteSeleccionadoState(nuevoLoteId);
    
    // Actualizar URL
    const newParams = new URLSearchParams(searchParams);
    if (nuevoLoteId) {
      newParams.set('lote', nuevoLoteId);
    } else {
      newParams.delete('lote');
    }
    setSearchParams(newParams);
  };

  // Función para manejar validación exitosa del CSV
  const handleValidationSuccess = (data: ValidationCompleteData) => {
    setDatosValidadosCsv(data);
    toast.success('Archivo validado correctamente. Cambia al tab "Previsualizar" para ver los spots en el mapa.');
  };

  // Función para limpiar validación
  const handleClearValidation = () => {
    setDatosValidadosCsv(null);
  };

  // Función para abrir diálogo de confirmación
  const handleAbrirConfirmacionEnvio = () => {
    if (!datosValidadosCsv) return;
    setMostrarConfirmacionEnvio(true);
  };

  // Función para enviar datos a Sioma (después de confirmación)
  const handleConfirmarEnvioASioma = async () => {
    if (!datosValidadosCsv) return;

    setEnviandoASioma(true);
    setMostrarConfirmacionEnvio(false);
    
    try {
      // Importar dinámicamente el servicio de Sioma
      const { siomaService } = await import('../services/sioma.service');
      
      // Enviar datos a la API de Sioma
      const respuesta = await siomaService.enviarDatosASioma(datosValidadosCsv);
      
      // Guardar respuesta para mostrarla en un diálogo
      setRespuestaSioma(respuesta);
      
      // Mostrar toast de éxito
      const mensajeRespuesta = respuesta.data 
        ? `✅ ${respuesta.message || 'Datos enviados exitosamente a Sioma'}`
        : `✅ Datos enviados exitosamente a Sioma`;
      toast.success(mensajeRespuesta);
      
      // Limpiar datos después de enviar exitosamente
      setDatosValidadosCsv(null);
    } catch (error: any) {
      console.error('Error al enviar datos a Sioma:', error);
      toast.error(`Error al enviar datos: ${error.message || 'Error desconocido'}`);
      setRespuestaSioma(null);
    } finally {
      setEnviandoASioma(false);
    }
  };

  // Convertir datos del CSV a formato Planta para visualización en el mapa
  const spotsDeLoteCsv = useMemo<Planta[]>(() => {
    if (!datosValidadosCsv || !loteSeleccionado) {
      console.log('spotsDeLoteCsv: No hay datos validados o lote seleccionado');
      return [];
    }

    // Obtener el nombre del lote seleccionado
    const loteData = lotes.find(l => l.id === loteSeleccionado);
    if (!loteData) {
      console.log('spotsDeLoteCsv: No se encontró lote con id', loteSeleccionado);
      return [];
    }

    console.log('spotsDeLoteCsv - Filtrando CSV:', {
      loteSeleccionadoId: loteSeleccionado,
      loteDataNombre: loteData.nombre,
      totalCsvRows: datosValidadosCsv.csvRows.length,
      lotesDisponiblesEnCsv: [...new Set(datosValidadosCsv.csvRows.map(r => r.Lote))]
    });

    // Filtrar spots del CSV que pertenecen al lote seleccionado
    const spotsFiltrados = datosValidadosCsv.csvRows
      .filter(row => {
        const loteCsv = String(row.Lote || '').trim();
        const loteNombre = String(loteData.nombre || '').trim();
        // Comparar tanto por nombre como por ID (por si el CSV tiene el ID como string)
        return loteCsv === loteNombre || loteCsv === loteSeleccionado || loteCsv === loteData.id;
      })
      .map(row => ({
        nombre_spot: `${row.Lote}-L${row.Linea}-S${row.Palma}`,
        lat: parseFloat(row.Latitud),
        lng: parseFloat(row.Longitud),
        lote_id: parseInt(loteSeleccionado),
        linea: parseInt(row.Linea),
        posicion: parseInt(row.Palma),
        nombre_planta: `${row.Lote}-L${row.Linea}-P${row.Palma}`,
        finca_id: datosValidadosCsv.fincaId,
        cargado: true,
      }));

    console.log('spotsDeLoteCsv - Spots filtrados:', spotsFiltrados.length);
    return spotsFiltrados;
  }, [datosValidadosCsv, loteSeleccionado, lotes]);

  // Calcular estadísticas de spots (del CSV si está disponible, sino del servicio)
  const spotsParaEstadisticas = useMemo(() => {
    if (spotsDeLoteCsv.length > 0) {
      return spotsDeLoteCsv;
    }
    return plantas;
  }, [spotsDeLoteCsv, plantas]);

  // Calcular número de líneas únicas
  const numeroLineas = useMemo(() => {
    if (spotsParaEstadisticas.length === 0) return 0;
    const lineasUnicas = new Set(spotsParaEstadisticas.map(p => p.linea));
    return lineasUnicas.size;
  }, [spotsParaEstadisticas]);

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

      {/* Paso 1: Selector de Finca y Botón de Envío */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paso 1: Seleccionar Finca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SelectorFincas
            fincas={fincas as Finca[]}
            fincaSeleccionada={fincaSeleccionada}
            onFincaChange={handleFincaChange}
            isLoading={isLoadingFincas}
          />
          
          {/* Botón para enviar datos a Sioma */}
          {datosValidadosCsv && (
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Archivo validado ({datosValidadosCsv.csvRows.length} registros)</span>
              </div>
              <Button
                onClick={handleAbrirConfirmacionEnvio}
                disabled={enviandoASioma}
                className="bg-[#AA0F16] hover:bg-[#8B0C12] text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                {enviandoASioma ? 'Enviando...' : 'Enviar a Sioma'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs de Validación y Previsualización */}
      {fincaSeleccionada ? (
        <Tabs value={tabActual} onValueChange={setTabActual} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="validacion">Validación</TabsTrigger>
            <TabsTrigger value="previsualizar">Previsualizar</TabsTrigger>
          </TabsList>

          {/* Tab de Validación */}
          <TabsContent value="validacion" className="space-y-4">
            <UploadFile 
              fincaId={fincaSeleccionada} 
              onValidationSuccess={handleValidationSuccess}
              onClearValidation={handleClearValidation}
            />
          </TabsContent>

          {/* Tab de Previsualización */}
          <TabsContent value="previsualizar" className="space-y-4">
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
                      <p className="text-sm text-muted-foreground">{loteActual.nombre}</p>
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
                  {isLoadingPlantas && spotsDeLoteCsv.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Spinner size="md" />
                      <p className="text-xs text-gray-500 mt-2">Cargando datos...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-3xl font-bold text-gray-900">{spotsParaEstadisticas.length}</div>
                          <div className="text-sm text-gray-600 mt-1">Total Spots</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            {spotsParaEstadisticas.filter(p => p.cargado).length}
                          </div>
                          <div className="text-sm text-green-700 mt-1">Spots Plantados</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          {numeroLineas}
                        </div>
                        <div className="text-sm text-blue-700 mt-1">Líneas</div>
                      </div>
                      {spotsParaEstadisticas.filter(p => !p.cargado).length > 0 && (
                        <div className="text-center p-4 bg-gray-100 rounded-lg">
                          <div className="text-3xl font-bold text-gray-600">
                            {spotsParaEstadisticas.filter(p => !p.cargado).length}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">Spots Vacíos</div>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 border border-green-600 opacity-70"></div>
                          <span>Plantados</span>
                        </div>
                        {spotsParaEstadisticas.filter(p => !p.cargado).length > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-400 border border-gray-500 opacity-40"></div>
                            <span>Vacíos</span>
                          </div>
                        )}
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
            <CardContent className="p-0 h-[600px] relative">
              {(() => {
                console.log('Renderizando mapa:', { isLoadingLotes, lotesLength: lotes.length });
                
                if (isLoadingLotes) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Spinner size="lg" />
                      <p className="text-sm text-gray-500 mt-4">
                        Cargando lotes y coordenadas de la finca...
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Esto puede tardar unos segundos
                      </p>
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
                  <>
                    <MapaReal
                      lotes={lotes as Lote[]}
                      height="800px"
                      onLoteClick={handleLoteClick}
                      mostrarLeyenda={true}
                      plantasDelLote={spotsDeLoteCsv.length > 0 ? spotsDeLoteCsv : plantas}
                      loteSeleccionado={loteActual || null}
                      lineas={lineas}
                    />
                    {/* Overlay loader para cuando se cargan spots */}
                    {isLoadingPlantas && loteSeleccionado && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
                        <Spinner size="lg" />
                        <p className="text-sm text-gray-600 mt-4">Cargando spots del lote...</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </Card>

       

          {/* Mapa de spots: mostrado en el mismo mapa superior (MapaReal) al seleccionar lote */}
        </>
      )}
          </TabsContent>
        </Tabs>
      ) : (
        /* Mensaje inicial si no hay finca seleccionada */
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

      {/* Dialog de Confirmación de Envío a Sioma */}
      <Dialog open={mostrarConfirmacionEnvio} onOpenChange={setMostrarConfirmacionEnvio}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <DialogTitle className="text-xl">¿Confirmar envío a Sioma?</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Estás a punto de enviar los datos validados a Sioma. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {datosValidadosCsv && (
            <div className="space-y-3 py-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <h4 className="font-semibold text-sm mb-3">Resumen del envío:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de registros:</span>
                    <span className="font-medium">{datosValidadosCsv.csvRows.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finca:</span>
                    <span className="font-medium">
                      {fincas.find(f => Number(f.id) === datosValidadosCsv.fincaId)?.nombre || datosValidadosCsv.fincaId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lotes únicos:</span>
                    <span className="font-medium">
                      {new Set(datosValidadosCsv.csvRows.map(r => r.Lote)).size}
                    </span>
                  </div>
                </div>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Los datos serán procesados y los polígonos se generarán automáticamente en Sioma.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMostrarConfirmacionEnvio(false)}
              disabled={enviandoASioma}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarEnvioASioma}
              disabled={enviandoASioma}
              className="bg-[#AA0F16] hover:bg-[#8B0C12] text-white"
            >
              {enviandoASioma ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirmar y Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Respuesta de Sioma */}
      <Dialog open={!!respuestaSioma} onOpenChange={(open) => !open && setRespuestaSioma(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-green-600 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Send className="h-5 w-5 text-green-600" />
              </div>
              Envío exitoso a Sioma
            </DialogTitle>
            <DialogDescription className="pt-2">
              Los datos se han procesado correctamente en Sioma
            </DialogDescription>
          </DialogHeader>
          
          {respuestaSioma && (
            <div className="space-y-3 py-4">
              <div className="rounded-lg border bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800 mb-3">
                  {respuestaSioma.message || 'Datos enviados exitosamente'}
                </p>
                
                {respuestaSioma.data && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spots insertados:</span>
                      <span className="font-medium">{respuestaSioma.data.spots_inserted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plantas insertadas:</span>
                      <span className="font-medium">{respuestaSioma.data.plantas_inserted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Polígonos generados:</span>
                      <span className="font-medium">{respuestaSioma.data.polygons_generated || 0}</span>
                    </div>
                    {respuestaSioma.data.lotes_updated && respuestaSioma.data.lotes_updated.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Lotes actualizados:</span>
                        <span className="font-medium ml-2">
                          {respuestaSioma.data.lotes_updated.join(', ')}
                        </span>
                      </div>
                    )}
                    {respuestaSioma.data.finca_id && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Finca ID:</span>
                        <span className="font-medium">{respuestaSioma.data.finca_id}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setRespuestaSioma(null)}
              className="bg-[#AA0F16] hover:bg-[#8B0C12] text-white"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};