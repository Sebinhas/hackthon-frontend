import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/shared/components/DataTable';
import { UploadForm } from '../components/UploadForm';
import { CsvPreview } from '../components/CsvPreview';
import { CsvInlinePreview } from '../components/CsvInlinePreview';
import { ValidationSummary } from '../components/ValidationSummary';
import { useUploadFilePage } from '../hooks/useUploadFile';
import { Download } from 'lucide-react';
import { ValidationCompleteData } from '../types/uploadFile.types';

interface UploadFileProps {
  fincaId?: number | null;
  onValidationSuccess?: (data: ValidationCompleteData) => void;
  onClearValidation?: () => void;
}

export default function UploadFile({ fincaId = null, onValidationSuccess, onClearValidation }: UploadFileProps) {
  const {
    archivos,
    isLoading,
    columns,
    archivoAEliminar,
    setArchivoAEliminar,
    handleDeleteConfirm,
    isDeleting,
    archivoAVer,
    handleClosePreview,
    validationSummary,
    previewData,
    handleValidationComplete,
    clearValidation,
    handleDownloadCsv,
  } = useUploadFilePage();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Subir Archivo CSV</h1>
        <p className="text-muted-foreground">Carga archivos CSV y visualiza una previsualización de sus datos.</p>
      </div>

      <UploadForm 
        fincaId={fincaId} 
        onValidationComplete={(summary, preview, validationData) => {
          handleValidationComplete(summary, preview, validationData);
          // Si la validación es exitosa, notificar al padre
          if (summary.isValid && validationData && onValidationSuccess) {
            onValidationSuccess(validationData);
          }
        }} 
      />

      {/* Mostrar resumen de validación si existe */}
      {validationSummary && previewData && (
        <Dialog open={!!validationSummary} onOpenChange={clearValidation}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Resultado de Validación</DialogTitle>
              <DialogDescription>
                Revisa el resumen de validación del archivo CSV
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <ValidationSummary summary={validationSummary} onClose={clearValidation} />
              
              {previewData && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Previsualización del archivo</h3>
                  <CsvInlinePreview data={previewData} />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  clearValidation();
                  if (onClearValidation) {
                    onClearValidation();
                  }
                }}
              >
                Cerrar
              </Button>
              {validationSummary.isValid && (
                <Button 
                  className="bg-[#AA0F16] hover:bg-[#8B0C12] text-white"
                  onClick={handleDownloadCsv}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar CSV
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <DataTable
        data={archivos}
        columns={columns}
        filterPlaceholder="Filtrar por nombre de archivo..."
        filterKey="filename"
      />

      <Dialog open={!!archivoAEliminar} onOpenChange={() => setArchivoAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar archivo?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará el archivo seleccionado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchivoAEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!archivoAVer} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Previsualización del CSV</DialogTitle>
            <DialogDescription>
              Vista previa de las primeras filas del archivo
            </DialogDescription>
          </DialogHeader>
          {archivoAVer && <CsvPreview fileId={archivoAVer} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
