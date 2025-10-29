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

  // Filtrar filas completamente vacías antes de validar (por si acaso alguna se pasó)
  const filasValidas = rows.filter((row) => {
    const lote = String(row.Lote || '').trim();
    const linea = String(row.Linea || '').trim();
    const palma = String(row.Palma || '').trim();
    const longitud = String(row.Longitud || '').trim();
    const latitud = String(row.Latitud || '').trim();
    
    // Retornar true solo si al menos un campo tiene contenido
    return !!(lote || linea || palma || longitud || latitud);
  });

  // Si después de filtrar no hay filas válidas, retornar error
  if (filasValidas.length === 0) {
    errors.push({
      type: 'error',
      message: `Archivo sin datos válidos`,
      affectedRows: [],
      detail: `El archivo CSV no contiene registros válidos. Todas las filas están vacías.`,
    });

    return {
      isValid: false,
      totalErrors: 1,
      totalWarnings: 0,
      errors,
      warnings,
    };
  }

  // Usar solo las filas válidas para las validaciones
  const rowsToValidate = filasValidas;

  // Validación 1: Formato de coordenadas (punto vs coma)
  const erroresFormatoCoordenadas = validarFormatoCoordenadas(rowsToValidate);
  errors.push(...erroresFormatoCoordenadas);

  // Validación 2: Coordenadas duplicadas GLOBALMENTE (sin redondear, considerando todos los decimales)
  const coordenadasDuplicadas = validarCoordenadasDuplicadas(rowsToValidate);
  if (coordenadasDuplicadas.length > 0) {
    errors.push({
      type: 'error',
      message: `Coordenadas duplicadas encontradas en el archivo completo`,
      affectedRows: coordenadasDuplicadas,
      detail: `Se encontraron ${coordenadasDuplicadas.length} registro(s) con las mismas coordenadas de latitud y longitud. Las coordenadas deben ser únicas en todo el archivo, independientemente del lote.`,
    });
  }

  // Validación 3: Combinación Línea + Palma duplicada dentro del mismo lote
  const lineasPalmasDuplicadas = validarLineaPalmaDuplicadaEnLote(rowsToValidate);
  if (lineasPalmasDuplicadas.length > 0) {
    errors.push({
      type: 'error',
      message: `Combinación de Línea y Palma duplicada dentro del mismo lote`,
      affectedRows: lineasPalmasDuplicadas,
      detail: `Se encontraron registros con la misma combinación de línea y palma dentro de un mismo lote. Cada combinación de línea+palma debe ser única por lote.`,
    });
  }

  // Validación 4: Lotes inválidos
  const resultadoValidacionLotes = validarLotesInvalidosConDetalle(rowsToValidate, context.lotesValidos);
  if (resultadoValidacionLotes.filasInvalidas.length > 0) {
    const lotesInvalidosLista = Array.from(resultadoValidacionLotes.lotesInvalidosUnicos).join(', ');
    
    errors.push({
      type: 'error',
      message: `Lotes inválidos encontrados`,
      affectedRows: resultadoValidacionLotes.filasInvalidas,
      detail: `Los siguientes lotes no pertenecen a la finca seleccionada: ${lotesInvalidosLista}. Verifica que los nombres de la columna "Lote" coincidan exactamente con los nombres de los lotes válidos de la finca.`,
    });
  }

  // Validaciones básicas de formato
  const erroresFormatoBasico = validarFormatoBasico(rowsToValidate);
  errors.push(...erroresFormatoBasico);

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

// Validación 1: Formato de coordenadas (debe usar punto como separador decimal)
const validarFormatoCoordenadas = (rows: CsvRow[]): ValidationError[] => {
  const errores: ValidationError[] = [];
  const filasConFormatoIncorrecto: number[] = [];
  const coordenadasConComa: string[] = [];

  rows.forEach((row) => {
    const latitudStr = String(row.Latitud || '').trim();
    const longitudStr = String(row.Longitud || '').trim();

    let tieneError = false;
    const erroresEnFila: string[] = [];

    if (latitudStr && latitudStr.includes(',')) {
      tieneError = true;
      erroresEnFila.push('Latitud');
      if (!coordenadasConComa.includes('Latitud')) {
        coordenadasConComa.push('Latitud');
      }
    }

    if (longitudStr && longitudStr.includes(',')) {
      tieneError = true;
      erroresEnFila.push('Longitud');
      if (!coordenadasConComa.includes('Longitud')) {
        coordenadasConComa.push('Longitud');
      }
    }

    if (tieneError) {
      filasConFormatoIncorrecto.push(row.rowNumber);
    }
  });

  if (filasConFormatoIncorrecto.length > 0) {
    errores.push({
      type: 'error',
      message: `Formato de coordenadas incorrecto`,
      affectedRows: filasConFormatoIncorrecto,
      detail: `Las coordenadas deben usar punto (.) como separador decimal, no coma (,). Ejemplo correcto: 4.6098, -74.08175. Se encontraron ${filasConFormatoIncorrecto.length} registro(s) con formato incorrecto.`,
    });
  }

  return errores;
};

// Validación 2: Coordenadas duplicadas GLOBALMENTE (sin redondear)
const validarCoordenadasDuplicadas = (rows: CsvRow[]): number[] => {
  const coordenadasMap = new Map<string, number[]>();
  const filasDuplicadas: number[] = [];

  rows.forEach((row) => {
    const latitudStr = String(row.Latitud || '').trim();
    const longitudStr = String(row.Longitud || '').trim();

    // Si tiene coma, no validamos duplicados porque ya hay error de formato
    if (latitudStr.includes(',') || longitudStr.includes(',')) {
      return;
    }

    const lat = parseFloat(latitudStr);
    const lng = parseFloat(longitudStr);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    // Usar la cadena original SIN redondear para comparar todos los decimales
    // Si viene con muchos decimales, los comparamos todos
    const key = `${latitudStr}_${longitudStr}`;

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

// Validación 3: Combinación Línea + Palma duplicada dentro del mismo lote
const validarLineaPalmaDuplicadaEnLote = (rows: CsvRow[]): number[] => {
  const mapa = new Map<string, Set<string>>();
  const filasDuplicadas: number[] = [];

  rows.forEach((row) => {
    const lote = String(row.Lote || '').trim();
    const linea = String(row.Linea || '').trim();
    const palma = String(row.Palma || '').trim();

    if (!lote || !linea || !palma) {
      return;
    }

    // Clave: lote
    // Valor: Set de combinaciones "linea_palma"
    const key = `${lote}`;

    if (!mapa.has(key)) {
      mapa.set(key, new Set());
    }

    const combinacionesDelLote = mapa.get(key)!;
    const combinacion = `${linea}_${palma}`;

    if (combinacionesDelLote.has(combinacion)) {
      filasDuplicadas.push(row.rowNumber);
    } else {
      combinacionesDelLote.add(combinacion);
    }
  });

  return filasDuplicadas;
};

// Validación 4: Lotes inválidos
// Compara el campo "Lote" del CSV con el campo "nombre" de los lotes válidos de la finca
interface ResultadoValidacionLotes {
  filasInvalidas: number[];
  lotesInvalidosUnicos: Set<string>;
}

const validarLotesInvalidosConDetalle = (rows: CsvRow[], lotesValidos: string[]): ResultadoValidacionLotes => {
  const filasInvalidas: number[] = [];
  const lotesInvalidosUnicos = new Set<string>();

  // Crear un Set de lotes válidos en minúsculas para comparación case-insensitive
  const lotesValidosLower = new Set(lotesValidos.map(l => l.toLowerCase().trim()));

  rows.forEach((row) => {
    const loteCsv = String(row.Lote || '').trim();

    if (!loteCsv) {
      filasInvalidas.push(row.rowNumber);
      return;
    }

    // Comparar el lote del CSV (case-insensitive) con los nombres de los lotes válidos
    const loteCsvLower = loteCsv.toLowerCase();
    
    if (!lotesValidosLower.has(loteCsvLower)) {
      // Guardar el lote inválido (manteniendo el formato original del CSV)
      lotesInvalidosUnicos.add(loteCsv);
      filasInvalidas.push(row.rowNumber);
    }
  });

  return {
    filasInvalidas,
    lotesInvalidosUnicos,
  };
};

// Validaciones básicas de formato
const validarFormatoBasico = (rows: CsvRow[]): ValidationError[] => {
  const errores: ValidationError[] = [];
  const filasConCamposVacios: number[] = [];
  const filasConCoordenadasInvalidas: number[] = [];

  rows.forEach((row) => {
    // Validar campos vacíos
    const camposRequeridos = {
      Lote: String(row.Lote || '').trim(),
      Linea: String(row.Linea || '').trim(),
      Palma: String(row.Palma || '').trim(),
      Longitud: String(row.Longitud || '').trim(),
      Latitud: String(row.Latitud || '').trim(),
    };

    const camposVacios = Object.entries(camposRequeridos)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposVacios.length > 0) {
      filasConCamposVacios.push(row.rowNumber);
    }

    // Validar coordenadas (solo si no tienen coma)
    const latitudStr = camposRequeridos.Latitud.replace(',', '.');
    const longitudStr = camposRequeridos.Longitud.replace(',', '.');

    const lat = parseFloat(latitudStr);
    const lng = parseFloat(longitudStr);

    if (camposRequeridos.Latitud || camposRequeridos.Longitud) {
      if (isNaN(lat) || isNaN(lng)) {
        filasConCoordenadasInvalidas.push(row.rowNumber);
      } else {
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          filasConCoordenadasInvalidas.push(row.rowNumber);
        }
      }
    }
  });

  if (filasConCamposVacios.length > 0) {
    errores.push({
      type: 'error',
      message: `Campos obligatorios vacíos`,
      affectedRows: filasConCamposVacios,
      detail: `Se encontraron ${filasConCamposVacios.length} registro(s) con campos obligatorios vacíos. Todos los campos (Lote, Linea, Palma, Longitud, Latitud) son requeridos.`,
    });
  }

  if (filasConCoordenadasInvalidas.length > 0) {
    errores.push({
      type: 'error',
      message: `Coordenadas con valores fuera de rango`,
      affectedRows: filasConCoordenadasInvalidas,
      detail: `Las coordenadas deben ser valores numéricos válidos: Latitud entre -90 y 90, Longitud entre -180 y 180. Se encontraron ${filasConCoordenadasInvalidas.length} registro(s) con valores inválidos.`,
    });
  }

  return errores;
};
