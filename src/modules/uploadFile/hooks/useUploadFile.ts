import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadFileService } from '../services/uploadFile.service';
import { CsvFile, CsvPreviewData, ValidationSummary } from '../types/uploadFile.types';
import { FileCell, StatusCell, RowCountCell, ActionsCell } from '../components/UploadFileCellTemplates';

// Hooks React Query Base
export const useObtenerArchivosCsv = () => {
  return useQuery({
    queryKey: ['archivos-csv'],
    queryFn: () => uploadFileService.obtenerArchivosCsv(),
  });
};

export const useObtenerArchivoCsv = (id: string) => {
  return useQuery({
    queryKey: ['archivos-csv', id],
    queryFn: () => uploadFileService.obtenerArchivoCsv(id),
    enabled: !!id,
  });
};

export const useSubirArchivoCsv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, fincaId }: { file: File; fincaId: number }) =>
      uploadFileService.subirArchivoCsv(file, fincaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivos-csv'] });
      toast.success('Archivo subido exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useEliminarArchivoCsv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => uploadFileService.eliminarArchivoCsv(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivos-csv'] });
      toast.success('Archivo eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useObtenerPreviewArchivo = (id: string) => {
  return useQuery({
    queryKey: ['archivos-csv', id, 'preview'],
    queryFn: () => uploadFileService.obtenerPreviewArchivo(id),
    enabled: !!id,
  });
};

export const useObtenerFincas = () => {
  return useQuery({
    queryKey: ['fincas'],
    queryFn: () => uploadFileService.obtenerFincas(),
  });
};

// Hook de Página Principal (Lista)
export const useUploadFilePage = () => {
  const { data: archivos = [], isLoading } = useObtenerArchivosCsv();
  const eliminarArchivo = useEliminarArchivoCsv();
  const [archivoAEliminar, setArchivoAEliminar] = useState<string | null>(null);
  const [archivoAVer, setArchivoAVer] = useState<string | null>(null);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [previewData, setPreviewData] = useState<CsvPreviewData | null>(null);

  const handleDeleteConfirm = () => {
    if (archivoAEliminar) {
      eliminarArchivo.mutate(archivoAEliminar);
      setArchivoAEliminar(null);
    }
  };

  const handleViewFile = (id: string) => {
    setArchivoAVer(id);
  };

  const handleClosePreview = () => {
    setArchivoAVer(null);
  };

  const handleValidationComplete = (summary: ValidationSummary, data: CsvPreviewData) => {
    setValidationSummary(summary);
    setPreviewData(data);
  };

  const clearValidation = () => {
    setValidationSummary(null);
    setPreviewData(null);
  };

  const columns = [
    {
      key: 'file',
      header: 'Archivo',
      render: (archivo: CsvFile) => FileCell({ archivo }),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (archivo: CsvFile) => StatusCell({ status: archivo.status }),
    },
    {
      key: 'rows',
      header: 'Filas',
      render: (archivo: CsvFile) => RowCountCell({ archivo }),
    },
    {
      key: 'uploadDate',
      header: 'Subido',
      render: (archivo: CsvFile) => new Date(archivo.uploadDate).toLocaleString('es-ES'),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (archivo: CsvFile) =>
        ActionsCell({ archivo, onView: handleViewFile, onDelete: setArchivoAEliminar }),
    },
  ];

  return {
    archivos,
    isLoading,
    columns,
    archivoAEliminar,
    setArchivoAEliminar,
    handleDeleteConfirm,
    isDeleting: eliminarArchivo.isPending,
    archivoAVer,
    handleViewFile,
    handleClosePreview,
    validationSummary,
    previewData,
    handleValidationComplete,
    clearValidation,
  };
};
