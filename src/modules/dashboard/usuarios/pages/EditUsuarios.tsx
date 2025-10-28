import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import FormUsuarios from './FormUsuarios';
import { useEditUsuariosPage } from '../hooks/useEditUsuarios';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function EditUsuarios() {
  const { id } = useParams<{ id: string }>();
  const {
    usuario,
    isLoadingUsuario,
    handleSubmit,
    handleCancel,
    isUpdating,
  } = useEditUsuariosPage(id!);

  if (isLoadingUsuario) {
    return <Spinner size="lg" className="h-64" />;
  }

  if (!usuario) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">Editar Usuario</h1>
          <p className="text-muted-foreground mt-1">
            Modifica la información del usuario
          </p>
        </div>
      </div>

      <FormUsuarios
        initialData={usuario}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        isEdit
      />
    </motion.div>
  );
}

