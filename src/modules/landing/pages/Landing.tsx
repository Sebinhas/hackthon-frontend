import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Layers, MapPin, Users, Upload, Shield, Zap, BarChart3 } from 'lucide-react';
import MainLayout from '@/shared/layout/MainLayout';
import { Button } from '@/components/ui/button';
import logo from '@/assets/landing/Logo.png';
import { Card, CardContent } from '@/components/ui/card';

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

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Building2,
      title: 'Gestión de Fincas',
      description: 'Visualiza y administra todas tus fincas agrícolas de manera centralizada',
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: Layers,
      title: 'Control de Lotes',
      description: 'Gestiona tus lotes con información detallada de cultivos y estados',
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: MapPin,
      title: 'Mapas Interactivos',
      description: 'Delimitación geográfica precisa con polígonos GPS y visualización en tiempo real',
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: Users,
      title: 'Gestión de Usuarios',
      description: 'Control de acceso y permisos para tu equipo de trabajo',
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: Upload,
      title: 'Importación de Datos',
      description: 'Carga información masiva mediante archivos CSV de forma rápida y sencilla',
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
    {
      icon: BarChart3,
      title: 'Análisis y Reportes',
      description: 'Monitorea el rendimiento y toma decisiones basadas en datos',
      color: 'text-[#AA0F16]',
      bgColor: 'bg-[#AA0F16]/10',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Rápido y Eficiente',
      description: 'Plataforma optimizada para máxima productividad',
    },
    {
      icon: Shield,
      title: 'Seguro y Confiable',
      description: 'Protección de datos con autenticación robusta',
    },
  ];

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight">
                Gestión Agrícola
                <br />
                <span className="text-[#AA0F16]">Inteligente</span>
              </h1>
              <p className="text-xl sm:text-2xl text-neutral-600 max-w-3xl mx-auto font-light">
                Administra fincas, lotes y cultivos con precisión geográfica
                <br />
                y herramientas profesionales de gestión
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Button
                size="lg"
                onClick={() => navigate('/auth/register')}
                className="bg-[#AA0F16] hover:bg-[#8B0C12] text-white px-8 py-6 text-base font-medium"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth/login')}
                className="border-2 border-neutral-300 hover:border-[#AA0F16] hover:text-[#AA0F16] px-8 py-6 text-base font-medium"
              >
                Iniciar Sesión
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900">
                Todo lo que necesitas
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Funcionalidades diseñadas para optimizar tu gestión agrícola
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full border border-neutral-200 hover:border-[#AA0F16]/30 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-8 space-y-4">
                      <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                        <feature.icon className={`w-7 h-7 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900">
                Visualización en
                <br />
                <span className="text-[#AA0F16]">Mapas Interactivos</span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Delimita tus lotes con precisión GPS, visualiza polígonos geográficos
                y gestiona estados operativos directamente desde el mapa. Herramientas
                profesionales para el control territorial de tus cultivos.
              </p>
              <ul className="space-y-3">
                {[
                  'Delimitación geográfica con polígonos GPS',
                  'Estados operativos en tiempo real',
                  'Cálculo automático de área y perímetro',
                  'Vista satelital y de calles',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#AA0F16]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#AA0F16]" />
                    </div>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300 shadow-xl flex items-center justify-center">
                <MapPin className="w-24 h-24 text-[#AA0F16]/20" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="border border-neutral-200 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-[#AA0F16]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-7 h-7 text-[#AA0F16]" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {benefit.title}
                        </h3>
                        <p className="text-neutral-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#AA0F16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              ¿Listo para optimizar tu gestión agrícola?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Únete a una plataforma diseñada para productores agrícolas
              que buscan eficiencia y control total de sus operaciones
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/auth/register')}
              className="bg-white text-[#AA0F16] hover:bg-neutral-100 px-8 py-6 text-base font-medium"
            >
              Crear Cuenta Gratuita
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
