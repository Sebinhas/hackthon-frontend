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

