import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { EstadisticasFincas } from '../hooks/useHomeStats';

interface FincasChartProps {
  estadisticas: EstadisticasFincas;
}

export function FincasChart({ estadisticas }: FincasChartProps) {
  const chartData = estadisticas.porGrupo.map((item) => ({
    nombre: item.grupo.length > 15 ? `${item.grupo.substring(0, 15)}...` : item.grupo,
    cantidad: item.cantidad,
    nombreCompleto: item.grupo,
  }));

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#AA0F16]" />
            <CardTitle className="text-lg font-semibold text-neutral-900">
              Fincas por Grupo
            </CardTitle>
          </div>
          <span className="text-sm font-medium text-neutral-600">
            Total: {estadisticas.total}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number) => [value, 'Fincas']}
                  labelFormatter={(label) => `Grupo: ${chartData.find((d) => d.nombre === label)?.nombreCompleto || label}`}
                />
                <Bar
                  dataKey="cantidad"
                  fill="#AA0F16"
                  radius={[4, 4, 0, 0]}
                  name="Cantidad de Fincas"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-neutral-500">
            No hay datos disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
}

