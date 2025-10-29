import { motion } from 'framer-motion';
import { Building2, Layers, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/core/store/authStore';
import { Spinner } from '@/components/ui/spinner';
import { useHomeStats } from '../hooks/useHomeStats';
import { FincasChart } from '../components/FincasChart';
import { LotesChart } from '../components/LotesChart';
import { TipoCultivoChart } from '../components/TipoCultivoChart';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const { estadisticasFincas, estadisticasLotes, isLoading } = useHomeStats();

  const stats = [
    {
      icon: Building2,
      label: 'Total Fincas',
      value: estadisticasFincas.total.toString(),
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: Layers,
      label: 'Total Lotes',
      value: estadisticasLotes.total.toString(),
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: TrendingUp,
      label: 'Grupos de Fincas',
      value: estadisticasFincas.porGrupo.length.toString(),
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: BarChart3,
      label: 'Fincas con Lotes',
      value: estadisticasLotes.porFinca.length.toString(),
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-neutral-900">
          Bienvenido, {user?.firstName || user?.email}
        </h1>
        <p className="text-neutral-600 mt-2">
          Resumen general de fincas y lotes
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-600 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FincasChart estadisticas={estadisticasFincas} />
        <LotesChart estadisticas={estadisticasLotes} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <TipoCultivoChart estadisticas={estadisticasLotes} />
      </motion.div>
    </motion.div>
  );
}
