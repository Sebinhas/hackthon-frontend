import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { EstadisticasLotes } from '../hooks/useHomeStats';

interface TipoCultivoChartProps {
  estadisticas: EstadisticasLotes;
}

export function TipoCultivoChart({ estadisticas }: TipoCultivoChartProps) {
  const chartData = estadisticas.porTipoCultivo.map((item) => ({
    tipo: `Tipo ${item.tipoCultivoId}`,
    cantidad: item.cantidad,
    tipoId: item.tipoCultivoId,
  }));

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#AA0F16]" />
            <CardTitle className="text-lg font-semibold text-neutral-900">
              Lotes por Tipo de Cultivo
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="tipo"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number) => [value, 'Lotes']}
                  labelFormatter={(label) => `Tipo de Cultivo: ${label}`}
                />
                <Bar
                  dataKey="cantidad"
                  fill="#AA0F16"
                  radius={[4, 4, 0, 0]}
                  name="Cantidad de Lotes"
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

