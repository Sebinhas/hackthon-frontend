import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filterPlaceholder = 'Filtrar...',
  filterKey = 'name',
}: DataTableProps<T>) {
  const [filterValue, setFilterValue] = useState('');

  const filteredData = data.filter((item) =>
    item[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder={filterPlaceholder}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-sm font-medium"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No se encontraron resultados
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
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

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredData.length} de {data.length} resultados
      </div>
    </div>
  );
}


