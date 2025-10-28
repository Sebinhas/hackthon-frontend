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
}

export interface CsvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

