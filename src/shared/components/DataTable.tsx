import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  searchable?: boolean; // Permite excluir columnas del filtro si es necesario
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filterPlaceholder?: string;
  filterKey?: string; // Deprecated: mantenido para retrocompatibilidad, pero no se usa
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  excludeFromFilter?: string[]; // Claves de columnas a excluir del filtro
}

/**
 * Extrae el texto buscable de un valor (número, string, ReactNode, etc.)
 */
const extractSearchableText = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Si es un número o booleano, convertir a string
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  
  // Si es un string, devolverlo directamente
  if (typeof value === 'string') {
    return value;
  }
  
  // Si es un array, procesar cada elemento recursivamente
  if (Array.isArray(value)) {
    return value.map((item) => extractSearchableText(item)).join(' ').trim();
  }
  
  // Si es un objeto ReactNode (JSX element), intentar extraer texto
  if (typeof value === 'object') {
    // Si tiene props.children, extraer texto recursivamente
    if (value.props?.children !== undefined) {
      return extractSearchableText(value.props.children);
    }
    
    // Si tiene textContent (elementos DOM nativos)
    if ('textContent' in value && value.textContent) {
      return value.textContent;
    }
    
    // Si tiene innerText (elementos DOM nativos)
    if ('innerText' in value && value.innerText) {
      return value.innerText;
    }
  }
  
  return '';
};

/**
 * Obtiene todos los valores buscables de un item basándose en las columnas
 */
const getSearchableValues = <T extends Record<string, any>>(
  item: T,
  columns: Column<T>[],
  excludeKeys?: string[]
): string[] => {
  const searchableValues: string[] = [];
  
  columns.forEach((column) => {
    // Excluir columnas que no son buscables o están en la lista de exclusión
    if (column.searchable === false || excludeKeys?.includes(column.key)) {
      return;
    }
    
    let value: any;
    
    // Si tiene función render, obtener el valor renderizado
    if (column.render) {
      const rendered = column.render(item);
      value = rendered;
    } else {
      // Usar el valor directo de la propiedad
      value = item[column.key];
    }
    
    const text = extractSearchableText(value);
    if (text) {
      searchableValues.push(text.toLowerCase());
    }
  });
  
  return searchableValues;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filterPlaceholder = 'Buscar en todas las columnas...',
  filterKey: _filterKey, // Deprecated: no se usa, mantenido para retrocompatibilidad
  pageSizeOptions = [5, 10, 15, 20],
  defaultPageSize = 10,
  excludeFromFilter = [],
}: DataTableProps<T>) {
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filtrar datos basándose en todas las columnas
  const filteredData = useMemo(() => {
    if (!filterValue.trim()) {
      return data;
    }

    const searchTerm = filterValue.toLowerCase().trim();
    
    return data.filter((item) => {
      const searchableValues = getSearchableValues(item, columns, excludeFromFilter);
      
      // Buscar si alguno de los valores contiene el término de búsqueda
      return searchableValues.some((value) => value.includes(searchTerm));
    });
  }, [data, columns, filterValue, excludeFromFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = useMemo(
    () => filteredData.slice(startIndex, endIndex),
    [filteredData, startIndex, endIndex]
  );

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
    <div className="space-y-6">
      {/* Barra de búsqueda y control de página */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[320px]">
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full sm:max-w-sm h-10 shadow-sm focus:shadow-md transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-600 whitespace-nowrap">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium cursor-pointer hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#AA0F16]/20 focus:border-[#AA0F16] transition-all shadow-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <Card className="border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <CardContent className="p-0">
          <style>{`
            .data-table-scroll::-webkit-scrollbar {
              height: 8px;
            }
            .data-table-scroll::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 4px;
            }
            .data-table-scroll::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 4px;
            }
            .data-table-scroll::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <div 
            className="overflow-x-auto w-full data-table-scroll" 
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}
          >
            <table className="w-full min-w-max table-auto divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100/50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap border-b border-neutral-200"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-neutral-400 text-lg mb-2">📭</div>
                        <p className="text-sm font-medium text-neutral-500">
                          No se encontraron resultados
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Intenta con otros términos de búsqueda
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-neutral-50/80 transition-colors duration-150 border-b border-neutral-100 last:border-b-0"
                    >
                      {columns.map((column) => (
                        <td 
                          key={column.key} 
                          className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700"
                        >
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-neutral-200">
          <div className="text-sm font-medium text-neutral-600">
            Mostrando <span className="text-neutral-900">{startIndex + 1}</span> -{' '}
            <span className="text-neutral-900">{Math.min(endIndex, filteredData.length)}</span> de{' '}
            <span className="text-neutral-900 font-semibold">{filteredData.length}</span> resultados
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            
            <div className="text-sm font-medium text-neutral-600 min-w-[100px] text-center">
              Página <span className="text-neutral-900">{currentPage}</span> de{' '}
              <span className="text-neutral-900">{totalPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

