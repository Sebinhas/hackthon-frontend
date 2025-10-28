import { useState } from 'react';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubirArchivoCsv, useObtenerFincas } from '../hooks/useUploadFile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFincaId, setSelectedFincaId] = useState<number | null>(null);
  const subirArchivo = useSubirArchivoCsv();
  const { data: fincas = [], isLoading: isLoadingFincas } = useObtenerFincas();

  const handleDownloadTemplate = () => {
    const headers = ['Lote', 'Linea', 'Palma', 'Logitud', 'Latitud'];
    // Agregar BOM para compatibilidad con Excel y UTF-8
    const csvContent = '\uFEFF' + headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantilla_carga.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecciona un archivo CSV');
        event.target.value = '';
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (selectedFincaId === null) {
      toast.error('Selecciona una finca antes de subir el archivo.');
      return;
    }

    if (!selectedFile) {
      toast.error('Selecciona un archivo CSV para continuar.');
      return;
    }

    if (selectedFile && selectedFincaId !== null) {
      subirArchivo.mutate({ file: selectedFile, fincaId: selectedFincaId }, {
        onSuccess: () => {
          setSelectedFile(null);
          if (document.querySelector('input[type="file"]')) {
            (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
          }
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Descargar plantilla CSV
        </Button>
      </div>
      <div className="grid gap-4">
        <div className="flex items-end gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Finca</label>
            <Select onValueChange={(v) => setSelectedFincaId(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingFincas ? 'Cargando fincas...' : 'Selecciona una finca'} />
              </SelectTrigger>
              <SelectContent>
                {fincas.map((finca) => (
                  <SelectItem key={finca.keyValue} value={String(finca.keyValue)}>
                    {finca.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#AA0F16] transition-colors">
        <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Selecciona un archivo CSV
              </p>
              <p className="text-sm text-gray-500">
                Arrastra y suelta o haz clic para buscar
              </p>
            </div>
          )}
        </label>
        </div>
      </div>

      {selectedFile && (
        <Button
          type="submit"
          className="w-full bg-[#AA0F16] hover:bg-[#8B0C12] text-white"
          disabled={subirArchivo.isPending}
        >
          <Upload className="mr-2 h-4 w-4" />
          {subirArchivo.isPending ? 'Subiendo...' : 'Subir Archivo'}
        </Button>
      )}
    </form>
  );
};

