import { Spinner } from '@/components/ui/spinner';
import { CsvPreviewData } from '../types/uploadFile.types';

interface CsvInlinePreviewProps {
  data: CsvPreviewData;
}

export const CsvInlinePreview = ({ data }: CsvInlinePreviewProps) => {
  if (!data) {
    return <div className="text-sm text-muted-foreground">Sin datos para mostrar</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {data.headers.map((header) => (
                <th key={header} className="px-4 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.slice(0, 20).map((row, idx) => (
              <tr key={idx} className="border-b">
                {data.headers.map((header) => (
                  <td key={header} className="px-4 py-2">
                    {String(row[header] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground">
        Mostrando {Math.min(20, data.rows.length)} de {data.totalRows} filas
      </div>
    </div>
  );
};


