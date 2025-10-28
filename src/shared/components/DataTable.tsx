import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filterPlaceholder?: string;
  filterKey?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filterPlaceholder = 'Filtrar...',
  filterKey = 'name',
  pageSizeOptions = [5, 10, 15, 20],
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filteredData = data.filter((item) =>
    item[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValue]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Input
          placeholder={filterPlaceholder}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-sm font-semibold"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No se encontraron resultados
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4">
                          {column.render
                            ? column.render(item)
                            : item[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

