export interface Finca {
  finca_id?: number;
  key: string;
  grupo: string;
  sigla: string;
  moneda: string;
  nombre: string;
  pago_dia: number;
  key_value: number;
  tipo_sujeto_id: number;
  tipo_cultivo_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FincaPayload {
  key: string;
  grupo: string;
  sigla: string;
  moneda: string;
  nombre: string;
  pago_dia: number;
  key_value: number;
  tipo_sujeto_id: number;
  tipo_cultivo_id: number;
}

export interface FincasResponse {
  data: Finca[];
  total: number;
}

