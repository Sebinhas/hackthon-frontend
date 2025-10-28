import { Spinner } from '@/components/ui/spinner';
import { useObtenerLotes } from '../hooks/useLotes';
import MapaReal from '../components/MapaReal';

export default function Lotes() {
  const { data: lotes = [], isLoading } = useObtenerLotes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Mapa de Lotes</h1>
      
      {lotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay lotes registrados</p>
        </div>
      ) : (
        <MapaReal lotes={lotes} mostrarLeyenda={true} height="calc(100vh - 200px)" />
      )}
    </div>
  );
}

