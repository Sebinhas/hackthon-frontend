import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/shared/components/DataTable';
import { useUsuariosPage } from '../hooks/useUsuarios';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Usuarios() {
  const {
    usuarios,
    isLoading,
    columns,
    usuarioAEliminar,
    setUsuarioAEliminar,
    handleDeleteConfirm,
    isDeleting,
    navigate,
  } = useUsuariosPage();

  if (isLoading) {
    return <Spinner size="lg" className="h-64" />;
  }

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/usuarios/create')}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <DataTable
          data={usuarios}
          columns={columns}
          filterPlaceholder="Buscar usuario..."
          filterKey="name"
        />
      </motion.div>

      <Dialog open={!!usuarioAEliminar} onOpenChange={() => setUsuarioAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUsuarioAEliminar(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

