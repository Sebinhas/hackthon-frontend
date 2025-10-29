import { CsvRow } from '../types/uploadFile.types';
import { Lote } from '@/modules/dashboard/lotes/types/lotes.types';

interface CsvRowTransformed {
  nombre_spot: string;
  lat: string;
  lng: string;
  lote_id: string;
  linea: string;
  posicion: string;
  nombre_planta: string;
  finca_id: number;
}

/**
 * Crea un mapeo de nombre de lote -> id de lote desde la lista de lotes
 */
export const crearMapeoLotes = (lotes: Lote[]): Map<string, string> => {
  const mapeo = new Map<string, string>();
  
  lotes.forEach((lote) => {
    // Mapear por nombre (case-insensitive) a id
    mapeo.set(lote.nombre.toLowerCase().trim(), lote.id);
  });
  
  return mapeo;
};

/**
 * Transforma los datos del CSV validado al formato requerido para el backend
 */
export const transformarCsvValidado = (
  csvRows: CsvRow[],
  lotes: Lote[],
  fincaId: number
): CsvRowTransformed[] => {
  const mapeoLotes = crearMapeoLotes(lotes);
  const resultado: CsvRowTransformed[] = [];
  
  csvRows.forEach((row, index) => {
    const nombreLote = String(row.Lote || '').trim();
    const loteId = mapeoLotes.get(nombreLote.toLowerCase()) || '';
    
    const linea = String(row.Linea || '').trim();
    const posicion = String(row.Palma || '').trim();
    const latitud = String(row.Latitud || '').trim();
    const longitud = String(row.Longitud || '').trim();
    
    // iterationSpot es el número de fila (index + 1)
    const iterationSpot = index + 1;
    
    // nombre_spot = L{lote_id}L{linea}S{iterationSpot} (sin espacios)
    const nombreSpot = `L${loteId}L${linea}S${iterationSpot}`;
    
    // nombre_planta = L{lote_id}L{linea}P{posicion} (sin espacios)
    const nombrePlanta = `L${loteId}L${linea}P${posicion}`;
    
    resultado.push({
      nombre_spot: nombreSpot,
      lat: latitud,
      lng: longitud,
      lote_id: loteId,
      linea: linea,
      posicion: posicion,
      nombre_planta: nombrePlanta,
      finca_id: fincaId,
    });
  });
  
  return resultado;
};

/**
 * Genera el contenido CSV en formato string
 */
export const generarCsvString = (datos: CsvRowTransformed[]): string => {
  const headers = ['nombre_spot', 'lat', 'lng', 'lote_id', 'linea', 'posicion', 'nombre_planta', 'finca_id'];
  
  // Crear CSV con BOM para UTF-8 (mejora compatibilidad con Excel)
  let csvContent = '\uFEFF' + headers.join(',') + '\n';
  
  datos.forEach((row) => {
    const fila = [
      `"${row.nombre_spot}"`,
      row.lat,
      row.lng,
      row.lote_id,
      row.linea,
      row.posicion,
      `"${row.nombre_planta}"`,
      row.finca_id.toString(),
    ];
    csvContent += fila.join(',') + '\n';
  });
  
  return csvContent;
};

/**
 * Descarga el CSV generado
 */
export const descargarCsv = (contenido: string, nombreArchivo: string = 'archivo_procesado.csv'): void => {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nombreArchivo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

