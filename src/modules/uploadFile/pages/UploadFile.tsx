import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/shared/components/DataTable';
import { UploadForm } from '../components/UploadForm';
import { CsvPreview } from '../components/CsvPreview';
import { CsvInlinePreview } from '../components/CsvInlinePreview';
import { useUploadFilePage } from '../hooks/useUploadFile';

export default function UploadFile() {
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
    localPreviewData,
    openLocalPreview,
    closeLocalPreview,
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

      <UploadForm onPreviewReady={openLocalPreview} />

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

      <Dialog open={!!localPreviewData} onOpenChange={closeLocalPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Previsualización (validación local)</DialogTitle>
            <DialogDescription>
              Vista previa básica del archivo seleccionado
            </DialogDescription>
          </DialogHeader>
          {localPreviewData && <CsvInlinePreview data={localPreviewData} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}


