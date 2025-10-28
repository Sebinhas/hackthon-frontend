import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormUsuarios from './FormUsuarios';
import { useCreateUsuariosPage } from '../hooks/useCreateUsuarios';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function CreateUsuarios() {
  const { handleSubmit, handleCancel, isLoading } = useCreateUsuariosPage();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Usuario</h1>
          <p className="text-muted-foreground mt-1">
            Agrega un nuevo usuario al sistema
          </p>
        </div>
      </div>

      <FormUsuarios
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </motion.div>
  );
}

