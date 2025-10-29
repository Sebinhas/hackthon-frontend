import { CsvRow, ValidationError, ValidationSummary } from '../types/uploadFile.types';

interface ValidationContext {
  fincaId: number;
  lotesValidos: string[]; // Array de lotes válidos para la finca
}

export const validarCsv = (
  rows: CsvRow[],
  context: ValidationContext
): ValidationSummary => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validación 1: Coordenadas duplicadas
  const coordenadasDuplicadas = validarCoordenadasDuplicadas(rows);
  if (coordenadasDuplicadas.length > 0) {
    errors.push({
      type: 'error',
      message: `Coordenadas duplicadas encontradas`,
      affectedRows: coordenadasDuplicadas,
      detail: `${coordenadasDuplicadas.length} registro(s) con las mismas coordenadas de latitud y longitud`,
    });
  }

  // Validación 2: Inconsistencia dentro del lote
  const lineasDuplicadasEnLote = validarLineasDuplicadasEnLote(rows);
  if (lineasDuplicadasEnLote.length > 0) {
    errors.push({
      type: 'error',
      message: `Líneas duplicadas dentro del mismo lote`,
      affectedRows: lineasDuplicadasEnLote,
      detail: `Se encontraron líneas repetidas dentro de un mismo lote`,
    });
  }

  // Validación 2.2: Posiciones duplicadas en línea
  const posicionesDuplicadasEnLinea = validarPosicionesDuplicadasEnLinea(rows);
  if (posicionesDuplicadasEnLinea.length > 0) {
    errors.push({
      type: 'error',
      message: `Posiciones de palma duplicadas dentro de la misma línea`,
      affectedRows: posicionesDuplicadasEnLinea,
      detail: `Se encontraron posiciones repetidas dentro de una misma línea`,
    });
  }

  // Validación 3: Lotes inválidos
  const lotesInvalidos = validarLotesInvalidos(rows, context.lotesValidos);
  if (lotesInvalidos.length > 0) {
    errors.push({
      type: 'error',
      message: `Lotes inválidos encontrados`,
      affectedRows: lotesInvalidos,
      detail: `Los lotes no coinciden con los lotes válidos de la finca seleccionada`,
    });
  }

  // Validaciones básicas de formato
  const erroresFormato = validarFormatoBasico(rows);
  errors.push(...erroresFormato);

  const totalErrors = errors.length;
  const totalWarnings = warnings.length;

  return {
    isValid: totalErrors === 0,
    totalErrors,
    totalWarnings,
    errors,
    warnings,
  };
};

const validarCoordenadasDuplicadas = (rows: CsvRow[]): number[] => {
  const coordenadasMap = new Map<string, number[]>();
  const filasDuplicadas: number[] = [];

  rows.forEach((row) => {
    const lat = parseFloat(String(row.Latitud || '').trim());
    const lng = parseFloat(String(row.Logitud || '').trim());

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    const key = `${lat.toFixed(6)}_${lng.toFixed(6)}`;

    if (!coordenadasMap.has(key)) {
      coordenadasMap.set(key, []);
    }

    coordenadasMap.get(key)!.push(row.rowNumber);
  });

  coordenadasMap.forEach((filas) => {
    if (filas.length > 1) {
      filasDuplicadas.push(...filas);
    }
  });

  return filasDuplicadas;
};

const validarLineasDuplicadasEnLote = (rows: CsvRow[]): number[] => {
  const mapa = new Map<string, Set<string>>();
  const filasDuplicadas: number[] = [];

  rows.forEach((row) => {
    const lote = String(row.Lote || '').trim();
    const linea = String(row.Linea || '').trim();

    if (!lote || !linea) {
      return;
    }

    const key = `${lote}`;

    if (!mapa.has(key)) {
      mapa.set(key, new Set());
    }

    const lineasDelLote = mapa.get(key)!;

    if (lineasDelLote.has(linea)) {
      filasDuplicadas.push(row.rowNumber);
    } else {
      lineasDelLote.add(linea);
    }
  });

  return filasDuplicadas;
};

const validarPosicionesDuplicadasEnLinea = (rows: CsvRow[]): number[] => {
  const mapa = new Map<string, Set<string>>();
  const filasDuplicadas: number[] = [];

  rows.forEach((row) => {
    const lote = String(row.Lote || '').trim();
    const linea = String(row.Linea || '').trim();
    const palma = String(row.Palma || '').trim();

    if (!lote || !linea || !palma) {
      return;
    }

    const key = `${lote}_${linea}`;

    if (!mapa.has(key)) {
      mapa.set(key, new Set());
    }

    const posicionesDeLinea = mapa.get(key)!;

    if (posicionesDeLinea.has(palma)) {
      filasDuplicadas.push(row.rowNumber);
    } else {
      posicionesDeLinea.add(palma);
    }
  });

  return filasDuplicadas;
};

const validarLotesInvalidos = (rows: CsvRow[], lotesValidos: string[]): number[] => {
  const filasInvalidas: number[] = [];

  rows.forEach((row) => {
    const lote = String(row.Lote || '').trim();

    if (!lote) {
      filasInvalidas.push(row.rowNumber);
      return;
    }

    if (!lotesValidos.includes(lote)) {
      filasInvalidas.push(row.rowNumber);
    }
  });

  return filasInvalidas;
};

const validarFormatoBasico = (rows: CsvRow[]): ValidationError[] => {
  const errores: ValidationError[] = [];
  const filasConCamposVacios: number[] = [];
  const filasConCoordenadasInvalidas: number[] = [];

  rows.forEach((row) => {
    const tieneCamposVacios = !row.Lote || !row.Linea || !row.Palma || !row.Logitud || !row.Latitud;
    if (tieneCamposVacios) {
      filasConCamposVacios.push(row.rowNumber);
    }

    const lat = parseFloat(String(row.Latitud || '').trim());
    const lng = parseFloat(String(row.Logitud || '').trim());

    if (!isNaN(lat) && !isNaN(lng)) {
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        filasConCoordenadasInvalidas.push(row.rowNumber);
      }
    } else if (row.Latitud || row.Logitud) {
      filasConCoordenadasInvalidas.push(row.rowNumber);
    }
  });

  if (filasConCamposVacios.length > 0) {
    errores.push({
      type: 'error',
      message: `Campos vacíos encontrados`,
      affectedRows: filasConCamposVacios,
      detail: `${filasConCamposVacios.length} registro(s) con campos obligatorios vacíos`,
    });
  }

  if (filasConCoordenadasInvalidas.length > 0) {
    errores.push({
      type: 'error',
      message: `Coordenadas inválidas encontradas`,
      affectedRows: filasConCoordenadasInvalidas,
      detail: `Las coordenadas deben ser valores numéricos válidos (Latitud: -90 a 90, Longitud: -180 a 180)`,
    });
  }

  return errores;
};

