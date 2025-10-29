import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadFileService } from '../services/uploadFile.service';
import { fincasService } from '@/modules/dashboard/fincas/services/fincas.service';
import { CsvFile, CsvPreviewData, ValidationSummary, CsvRow } from '../types/uploadFile.types';
import { FileCell, StatusCell, RowCountCell, ActionsCell } from '../components/UploadFileCellTemplates';
import { transformarCsvValidado, generarCsvString, descargarCsv } from '../utils/csvGenerator';
import { Lote } from '@/modules/dashboard/lotes/types/lotes.types';

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
    queryFn: () => fincasService.obtenerFincas(),
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
  const [validationData, setValidationData] = useState<{ csvRows: CsvRow[]; fincaId: number } | null>(null);

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

  const handleValidationComplete = (
    summary: ValidationSummary,
    data: CsvPreviewData,
    validationDataParam?: { csvRows: CsvRow[]; fincaId: number }
  ) => {
    setValidationSummary(summary);
    setPreviewData(data);
    if (validationDataParam) {
      setValidationData(validationDataParam);
    }
  };

  const clearValidation = () => {
    setValidationSummary(null);
    setPreviewData(null);
    setValidationData(null);
  };

  const handleDownloadCsv = async () => {
    if (!validationData) {
      toast.error('No hay datos validados para descargar');
      return;
    }

    try {
      // Obtener todos los lotes para el mapeo
      const todosLosLotes = await uploadFileService.obtenerLotesCompletos();
      
      // Filtrar lotes por fincaId
      const lotesDeLaFinca = todosLosLotes.filter((lote: Lote) => lote.fincaId === validationData.fincaId);
      
      // Transformar datos
      const datosTransformados = transformarCsvValidado(
        validationData.csvRows,
        lotesDeLaFinca,
        validationData.fincaId
      );
      
      // Generar CSV
      const csvContent = generarCsvString(datosTransformados);
      
      // Descargar
      const nombreArchivo = `Spots.csv`;
      descargarCsv(csvContent, nombreArchivo);
      
      toast.success('CSV generado y descargado exitosamente');
    } catch (error: any) {
      console.error('Error al generar CSV:', error);
      toast.error(`Error al generar el CSV: ${error.message || 'Error desconocido'}`);
    }
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
    handleDownloadCsv,
    validationData,
  };
};
