import { useState } from 'react';
import { CheckCircle2, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useObtenerFincas } from '../hooks/useUploadFile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { uploadFileService } from '../services/uploadFile.service';
import { validarCsv } from '../utils/csvValidator';
import { CsvRow, ValidationSummary } from '../types/uploadFile.types';

interface UploadFormProps {
  onValidationComplete: (summary: ValidationSummary, previewData: { headers: string[]; rows: Record<string, any>[]; totalRows: number }) => void;
}

export const UploadForm = ({ onValidationComplete }: UploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFincaId, setSelectedFincaId] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { data: fincas = [], isLoading: isLoadingFincas } = useObtenerFincas();

  const handleDownloadTemplate = () => {
    const headers = ['Lote', 'Linea', 'Palma', 'Logitud', 'Latitud'];
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
        toast.error('Por favor, selecciona un archivo CSV');
        event.target.value = '';
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (selectedFincaId === null) {
      toast.error('Selecciona una finca antes de validar el archivo.');
      return;
    }

    if (!selectedFile) {
      toast.error('Selecciona un archivo CSV para continuar.');
      return;
    }

    setIsValidating(true);

    try {
      // Obtener lotes válidos para la finca
      //const lotesValidos = await uploadFileService.obtenerLotesValidosPorFinca(selectedFincaId);

      // Parsear CSV con papaparse usando FileReader
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || '');
        
        const parseResult = Papa.parse<any>(text, {
          header: true,
          skipEmptyLines: true,
        });
        
        if (parseResult.errors.length > 0) {
          toast.error(`Error al parsear CSV: ${parseResult.errors[0].message}`);
          setIsValidating(false);
          return;
        }
        
        const data = parseResult.data;
        
        if (data.length === 0) {
          toast.error('El archivo CSV está vacío o no contiene datos válidos.');
          setIsValidating(false);
          return;
        }

        // Validar headers requeridos
        const headersEsperados = ['Lote', 'Linea', 'Palma', 'Logitud', 'Latitud'];
        const headersReales = Object.keys(data[0] || {});
        const headersFaltantes = headersEsperados.filter(h => !headersReales.includes(h));
        
        if (headersFaltantes.length > 0) {
          toast.error(`Columnas faltantes: ${headersFaltantes.join(', ')}`);
          setIsValidating(false);
          return;
        }

        // Convertir a formato CsvRow con número de fila
        const csvRows: CsvRow[] = data.map((row, index) => ({
          rowNumber: index + 2, // +2 porque la fila 1 son headers
          Lote: String(row.Lote || '').trim(),
          Linea: String(row.Linea || '').trim(),
          Palma: String(row.Palma || '').trim(),
          Logitud: String(row.Logitud || '').trim(),
          Latitud: String(row.Latitud || '').trim(),
        }));

        // Ejecutar validaciones
        const validationSummary = validarCsv(csvRows, {
          fincaId: selectedFincaId,
          lotesValidos,
        });

        // Preparar datos para preview
        const previewData = {
          headers: headersEsperados,
          rows: data.slice(0, 20).map((row) => ({
            Lote: row.Lote,
            Linea: row.Linea,
            Palma: row.Palma,
            Logitud: row.Logitud,
            Latitud: row.Latitud,
          })),
          totalRows: data.length,
        };

        // Llamar callback con resumen de validación y preview
        onValidationComplete(validationSummary, previewData);

        if (validationSummary.isValid) {
          toast.success('✅ Validación exitosa. El archivo está listo para ser subido.');
        } else {
          toast.error(`Se encontraron ${validationSummary.totalErrors} error(es) en el archivo.`);
        }

        setIsValidating(false);
      };
      
      reader.onerror = () => {
        toast.error('Error leyendo el archivo');
        setIsValidating(false);
      };
      
      reader.readAsText(selectedFile);
    } catch (error: any) {
      toast.error(`Error al obtener lotes válidos: ${error.message}`);
      setIsValidating(false);
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
          disabled={isValidating}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isValidating ? 'Validando...' : 'Validar archivo'}
        </Button>
      )}
    </form>
  );
};
