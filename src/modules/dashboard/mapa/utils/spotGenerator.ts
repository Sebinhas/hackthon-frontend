import { Coordenada, Planta, SpotConfig, SPOT_CONFIG_DEFAULT } from '../types/lotes.types';

/**
 * Convierte metros a grados (aproximación)
 * 1 grado de latitud ≈ 111,320 metros
 * 1 grado de longitud ≈ 111,320 * cos(latitud) metros
 */
const metrosAGrados = (metros: number, latitud: number): { lat: number; lng: number } => {
  const latGrados = metros / 111320;
  const lngGrados = metros / (111320 * Math.cos(latitud * Math.PI / 180));
  return { lat: latGrados, lng: lngGrados };
};

/**
 * Calcula el centroide de un polígono
 */
const calcularCentroide = (coordenadas: Coordenada[]): Coordenada => {
  const n = coordenadas.length;
  let sumLat = 0;
  let sumLng = 0;
  
  coordenadas.forEach(coord => {
    sumLat += coord.lat;
    sumLng += coord.lng;
  });
  
  return {
    lat: sumLat / n,
    lng: sumLng / n
  };
};

/**
 * Calcula los límites (bounding box) de un polígono
 */
const calcularLimites = (coordenadas: Coordenada[]) => {
  const lats = coordenadas.map(c => c.lat);
  const lngs = coordenadas.map(c => c.lng);
  
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };
};

/**
 * Verifica si un punto está dentro de un polígono (Ray Casting Algorithm)
 */
const puntoEnPoligono = (punto: Coordenada, poligono: Coordenada[]): boolean => {
  let dentro = false;
  const n = poligono.length;
  
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = poligono[i].lng;
    const yi = poligono[i].lat;
    const xj = poligono[j].lng;
    const yj = poligono[j].lat;
    
    const intersecta = ((yi > punto.lat) !== (yj > punto.lat)) &&
      (punto.lng < (xj - xi) * (punto.lat - yi) / (yj - yi) + xi);
    
    if (intersecta) dentro = !dentro;
  }
  
  return dentro;
};

/**
 * Genera las coordenadas de un polígono rectangular para un spot
 */
const generarPoligonoSpot = (
  centro: Coordenada,
  config: SpotConfig
): Coordenada[] => {
  const offset = metrosAGrados(config.ancho_metros / 2, centro.lat);
  
  return [
    { lat: centro.lat - offset.lat, lng: centro.lng - offset.lng },
    { lat: centro.lat - offset.lat, lng: centro.lng + offset.lng },
    { lat: centro.lat + offset.lat, lng: centro.lng + offset.lng },
    { lat: centro.lat + offset.lat, lng: centro.lng - offset.lng },
    { lat: centro.lat - offset.lat, lng: centro.lng - offset.lng }
  ];
};

/**
 * Genera spots uniformemente distribuidos dentro de un lote
 */
export const generarSpotsParaLote = (
  loteId: number,
  fincaId: number,
  coordenadasLote: Coordenada[],
  config: SpotConfig = SPOT_CONFIG_DEFAULT,
  spotsCargados: Planta[] = []
): Planta[] => {
  const spots: Planta[] = [];
  const limites = calcularLimites(coordenadasLote);
  const centroide = calcularCentroide(coordenadasLote);
  
  // Calcular el espaciado total (tamaño del spot + espaciado)
  const espaciadoTotal = config.ancho_metros + config.espaciado_metros;
  const offsetGrados = metrosAGrados(espaciadoTotal, centroide.lat);
  
  // Calcular cuántas filas y columnas caben
  const rangoLat = limites.maxLat - limites.minLat;
  const rangoLng = limites.maxLng - limites.minLng;
  const numFilas = Math.floor(rangoLat / offsetGrados.lat);
  const numColumnas = Math.floor(rangoLng / offsetGrados.lng);
  
  let spotIndex = 1;
  let linea = 1;
  
  // Generar spots en una cuadrícula
  for (let fila = 0; fila < numFilas; fila++) {
    let posicion = 1;
    
    for (let col = 0; col < numColumnas; col++) {
      const lat = limites.minLat + (fila + 0.5) * offsetGrados.lat;
      const lng = limites.minLng + (col + 0.5) * offsetGrados.lng;
      const centro = { lat, lng };
      
      // Verificar si el centro del spot está dentro del polígono del lote
      if (puntoEnPoligono(centro, coordenadasLote)) {
        const nombreSpot = `L${loteId}F${fincaId}S${spotIndex}`;
        
        // Verificar si este spot ya está cargado
        const spotCargado = spotsCargados.find(s => 
          Math.abs(s.lat - lat) < 0.00001 && Math.abs(s.lng - lng) < 0.00001
        );
        
        const spot: Planta = {
          nombre_spot: nombreSpot,
          lat,
          lng,
          lote_id: loteId,
          linea,
          posicion,
          nombre_planta: spotCargado?.nombre_planta || `L${loteId}F${fincaId}P${spotIndex}`,
          finca_id: fincaId,
          estado: spotCargado?.estado,
          cargado: !!spotCargado,
          coordenadas_poligono: generarPoligonoSpot(centro, config)
        };
        
        spots.push(spot);
        spotIndex++;
        posicion++;
      }
    }
    
    if (posicion > 1) {
      linea++;
    }
  }
  
  return spots;
};

/**
 * Genera líneas que conectan los spots en secuencia
 */
export const generarLineasSpots = (spots: Planta[]): Coordenada[][] => {
  const lineas: Coordenada[][] = [];
  
  // Agrupar spots por línea
  const spotsPorLinea = new Map<number, Planta[]>();
  
  spots.forEach(spot => {
    if (!spotsPorLinea.has(spot.linea)) {
      spotsPorLinea.set(spot.linea, []);
    }
    spotsPorLinea.get(spot.linea)!.push(spot);
  });
  
  // Ordenar spots dentro de cada línea por posición
  spotsPorLinea.forEach((spotsLinea, _lineaNum) => {
    const spotsOrdenados = spotsLinea.sort((a, b) => a.posicion - b.posicion);
    
    if (spotsOrdenados.length > 1) {
      const coordenadasLinea = spotsOrdenados.map(spot => ({
        lat: spot.lat,
        lng: spot.lng
      }));
      lineas.push(coordenadasLinea);
    }
  });
  
  return lineas;
};
