export interface CsvFile {
  id: string;
  filename: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  rowCount?: number;
  errorMessage?: string;
}

export interface CsvUploadResponse {
  id: string;
  filename: string;
  status: string;
  message: string;
}

export interface CsvPreviewData {
  headers: string[];
  rows: Record<string, any>[];
  totalRows: number;
}

export interface CsvUploadPayload {
  file: File;
  fincaId: number;
}

export interface CsvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface Finca {
  id?: string;
  key: string;
  grupo: string;
  sigla: string;
  moneda: string;
  nombre: string;
  pagoDia: number;
  keyValue: number;
  tipoSujetoId: number;
  tipoCultivoId: number;
}

export interface FincasResponse {
  status: number;
  message: string;
  data: Finca[];
}

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  affectedRows: number[];
  detail?: string;
}

export interface ValidationSummary {
  isValid: boolean;
  totalErrors: number;
  totalWarnings: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface CsvRow {
  rowNumber: number;
  Lote: string;
  Linea: string;
  Palma: string;
  Longitud: string;
  Latitud: string;
  [key: string]: string | number;
}

export interface ValidationCompleteData {
  csvRows: CsvRow[];
  fincaId: number;
}
