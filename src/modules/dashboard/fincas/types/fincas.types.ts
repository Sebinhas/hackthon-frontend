export interface Finca {
  id: string;
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

