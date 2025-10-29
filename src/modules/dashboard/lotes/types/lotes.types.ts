export interface Lote {
  id: string;
  key: string;
  grupo: string;
  sigla: string;
  nombre: string;
  fincaId: number;
  keyValue: number;
  tipoSujetoId: number;
  tipoCultivoId: number;
}

export interface LotesResponse {
  status: number;
  message: string;
  data: Lote[];
}

