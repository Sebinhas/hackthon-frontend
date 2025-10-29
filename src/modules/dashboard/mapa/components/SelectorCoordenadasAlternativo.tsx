import { useState, useCallback } from 'react';
import { Coordenada } from '@/types/lotes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Trash2, MapPin, Undo, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calcularArea, calcularPerimetro, validarPoligono } from '../services/lotesService';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface SelectorCoordenadasAlternativoProps {
  value: Coordenada[];
  onChange: (coordenadas: Coordenada[]) => void;
  height?: string;
}

export const SelectorCoordenadasAlternativo = ({
  value,
  onChange,
  height = '500px'
}: SelectorCoordenadasAlternativoProps) => {
  const [nuevaLat, setNuevaLat] = useState('');
  const [nuevaLng, setNuevaLng] = useState('');
  
  // Agregar punto manualmente
  const handleAgregarPunto = useCallback(() => {
    const lat = parseFloat(nuevaLat);
    const lng = parseFloat(nuevaLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Por favor ingresa coordenadas válidas');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      alert('La latitud debe estar entre -90 y 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      alert('La longitud debe estar entre -180 y 180');
      return;
    }
    
    const nuevasCoordenadas = [...value, { lat, lng }];
    onChange(nuevasCoordenadas);
    setNuevaLat('');
    setNuevaLng('');
  }, [value, onChange, nuevaLat, nuevaLng]);
  
  // Eliminar punto
  const handleEliminarPunto = useCallback((index: number) => {
    const nuevasCoordenadas = value.filter((_, i) => i !== index);
    onChange(nuevasCoordenadas);
  }, [value, onChange]);
  
  // Eliminar último punto
  const handleUndo = useCallback(() => {
    if (value.length > 0) {
      const nuevasCoordenadas = value.slice(0, -1);
      onChange(nuevasCoordenadas);
    }
  }, [value, onChange]);
  
  // Limpiar todos los puntos
  const handleClear = useCallback(() => {
    onChange([]);
  }, [onChange]);
  
  // Cerrar polígono (agregar primer punto al final)
  const handleCerrar = useCallback(() => {
    if (value.length >= 3 && !esPoligonoCerrado) {
      onChange([...value, value[0]]);
    }
  }, [value, onChange]);
  
  // Verificar si el polígono está cerrado
  const esPoligonoCerrado = value.length >= 4 && 
    value[0].lat === value[value.length - 1].lat &&
    value[0].lng === value[value.length - 1].lng;
  
  // Validar polígono
  const validacion = value.length >= 3 ? validarPoligono(value) : null;
  
  // Calcular métricas
  const area = value.length >= 3 ? calcularArea(value) : 0;
  const perimetro = value.length >= 2 ? calcularPerimetro(value) : 0;
  
  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          <strong>Cómo usar:</strong> Agrega coordenadas manualmente o usa las coordenadas de ejemplo. 
          Se necesitan mínimo 3 puntos para formar un polígono válido.
        </AlertDescription>
      </Alert>
      
      {/* Agregar coordenadas manualmente */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Agregar Coordenadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="lat">Latitud</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              placeholder="4.6097"
              value={nuevaLat}
              onChange={(e) => setNuevaLat(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lng">Longitud</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              placeholder="-74.0817"
              value={nuevaLng}
              onChange={(e) => setNuevaLng(e.target.value)}
            />
          </div>
          
          <Button onClick={handleAgregarPunto} disabled={!nuevaLat || !nuevaLng}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Punto
          </Button>
        </div>
        
        {/* Coordenadas de ejemplo */}
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium mb-2">Coordenadas de ejemplo (Colombia):</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { lat: 4.6097, lng: -74.0817, name: 'Bogotá' },
              { lat: 6.2442, lng: -75.5812, name: 'Medellín' },
              { lat: 3.4516, lng: -76.5320, name: 'Cali' },
              { lat: 11.2408, lng: -74.2110, name: 'Barranquilla' }
            ].map((coord, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setNuevaLat(coord.lat.toString());
                  setNuevaLng(coord.lng.toString());
                }}
                className="text-xs"
              >
                {coord.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Lista de coordenadas */}
      {value.length > 0 && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-sm">
              Coordenadas ({value.length} punto{value.length !== 1 ? 's' : ''})
            </h4>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={value.length === 0}
              >
                <Undo className="h-4 w-4 mr-1" />
                Deshacer
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={value.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {value.map((coord, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-600 w-8">
                  {index + 1}.
                </span>
                <div className="flex-1 font-mono text-sm">
                  {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEliminarPunto(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Información del polígono */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Información del Polígono</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Puntos:</span>
            <div className="font-medium">{value.length}</div>
          </div>
          
          {area > 0 && (
            <div>
              <span className="text-gray-600">Área estimada:</span>
              <div className="font-medium">{area.toFixed(2)} ha</div>
            </div>
          )}
          
          {perimetro > 0 && (
            <div>
              <span className="text-gray-600">Perímetro:</span>
              <div className="font-medium">{perimetro} m</div>
            </div>
          )}
          
          <div>
            <span className="text-gray-600">Estado:</span>
            <div className={`font-medium ${esPoligonoCerrado ? 'text-green-600' : 'text-blue-600'}`}>
              {esPoligonoCerrado ? 'Cerrado' : 'En proceso'}
            </div>
          </div>
        </div>
        
        {validacion && !validacion.valido && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{validacion.mensaje}</span>
            </div>
          </div>
        )}
        
        {value.length >= 3 && !esPoligonoCerrado && (
          <div className="mt-3 pt-3 border-t">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCerrar}
            >
              Cerrar Polígono
            </Button>
          </div>
        )}
        
        {esPoligonoCerrado && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              ✓ Polígono válido
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SelectorCoordenadasAlternativo;
