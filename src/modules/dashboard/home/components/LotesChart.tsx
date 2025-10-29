import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { EstadisticasLotes } from '../hooks/useHomeStats';

interface LotesChartProps {
  estadisticas: EstadisticasLotes;
}

const COLORS = ['#AA0F16', '#8B0C12', '#6D0910', '#E02424', '#F87171', '#FCA5A5', '#FEE2E2'];

export function LotesChart({ estadisticas }: LotesChartProps) {
  const chartData = estadisticas.porFinca.map((item) => ({
    name: item.nombreFinca || `Finca ${item.fincaId}`,
    value: item.cantidad,
    fincaId: item.fincaId,
  }));

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#AA0F16]" />
            <CardTitle className="text-lg font-semibold text-neutral-900">
              Lotes por Finca
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const name = props.name || 'Sin nombre';
                    const percent = props.percent || 0;
                    const truncatedName = name.length > 15 ? `${name.substring(0, 15)}...` : name;
                    return `${truncatedName} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number) => [value, 'Lotes']}
                />
              </PieChart>
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

