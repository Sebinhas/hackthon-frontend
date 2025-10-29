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

export interface Coordenada {
  punto_lote_id: number;
  lote_id: number;
  lat: string;
  lng: string;
  created_at: string;
  updated_at: string;
}

export interface CoordenadasResponse {
  status: number;
  message: string;
  data: Coordenada[];
}

