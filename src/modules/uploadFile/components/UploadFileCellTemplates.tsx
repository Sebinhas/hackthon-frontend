import { FileText, CheckCircle2, Clock, XCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CsvFile } from '../types/uploadFile.types';

interface StatusCellProps {
  status: CsvFile['status'];
}

interface FileCellProps {
  archivo: CsvFile;
}

interface ActionsCellProps {
  archivo: CsvFile;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FileCell = ({ archivo }: FileCellProps) => {
  const formatearTamaño = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#AA0F16]/10">
        <FileText className="h-5 w-5 text-[#AA0F16]" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{archivo.filename}</p>
        <p className="text-sm text-gray-500">{formatearTamaño(archivo.size)}</p>
      </div>
    </div>
  );
};

export const StatusCell = ({ status }: StatusCellProps) => {
  const estados = {
    pending: { label: 'Pendiente', classes: 'bg-gray-100 text-gray-700', icon: Clock },
    processing: { label: 'Procesando', classes: 'bg-[#AA0F16]/10 text-[#AA0F16]', icon: AlertCircle },
    completed: { label: 'Completado', classes: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    error: { label: 'Error', classes: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const estado = estados[status];
  const Icon = estado.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${estado.classes}`}>
      <Icon className="h-3 w-3" />
      {estado.label}
    </span>
  );
};

export const RowCountCell = ({ archivo }: FileCellProps) => {
  return (
    <div className="text-right">
      <p className="font-medium">{archivo.rowCount || 0}</p>
      <p className="text-sm text-gray-500">filas</p>
    </div>
  );
};

export const ActionsCell = ({ archivo, onView, onDelete }: ActionsCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onView(archivo.id)}
        disabled={archivo.status !== 'completed'}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDelete(archivo.id)}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};

