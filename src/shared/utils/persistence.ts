// Sistema de persistencia local para desarrollo
// Almacena datos en localStorage para simular persistencia

const STORAGE_KEY = 'hackathon_mock_data';

// Función de inicialización: carga datos mock iniciales solo la primera vez
let initialized = false;

interface MockData {
  lotes: any[];
  fincas: any[];
  plantas: any[];
}

const getDefaultData = (): MockData => ({
  lotes: [],
  fincas: [],
  plantas: [],
});

export const persistencia = {
  // Inicializar con datos mock si es la primera vez
  init: (initialData?: MockData) => {
    if (initialized) return;
    initialized = true;
    
    const existing = persistencia.getAll();
    // Solo inicializar si no hay datos guardados
    if (existing.lotes.length === 0 && initialData) {
      persistencia.saveAll(initialData);
    }
  },

  // Obtener todos los datos
  getAll: (): MockData => {
    if (typeof window === 'undefined') return getDefaultData();
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return getDefaultData();
      
      const data = JSON.parse(stored);
      return { ...getDefaultData(), ...data };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return getDefaultData();
    }
  },

  // Guardar todos los datos
  saveAll: (data: MockData): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Operaciones para lotes
  getLotes: () => persistencia.getAll().lotes,
  
  saveLote: (lote: any) => {
    const data = persistencia.getAll();
    const existingIndex = data.lotes.findIndex((l) => l.id === lote.id);
    
    if (existingIndex >= 0) {
      data.lotes[existingIndex] = lote;
    } else {
      data.lotes.push(lote);
    }
    
    persistencia.saveAll(data);
    return lote;
  },
  
  deleteLote: (id: string) => {
    const data = persistencia.getAll();
    data.lotes = data.lotes.filter((l) => l.id !== id);
    persistencia.saveAll(data);
  },

  // Operaciones para fincas
  getFincas: () => persistencia.getAll().fincas,
  
  saveFinca: (finca: any) => {
    const data = persistencia.getAll();
    const existingIndex = data.fincas.findIndex((f) => f.key_value === finca.key_value);
    
    if (existingIndex >= 0) {
      data.fincas[existingIndex] = finca;
    } else {
      data.fincas.push(finca);
    }
    
    persistencia.saveAll(data);
    return finca;
  },

  // Operaciones para plantas
  getPlantas: () => persistencia.getAll().plantas,
  
  // Obtener plantas de una finca específica
  getPlantasPorFinca: (fincaId: number) => {
    return persistencia.getPlantas().filter((p) => p.finca_id === fincaId);
  },
  
  // Obtener plantas de un lote (todas las fincas del lote)
  getPlantasPorLote: (loteId: string) => {
    const fincas = persistencia.getFincas().filter((f) => f.lote_id === loteId);
    const fincasIds = fincas.map((f) => f.key_value);
    return persistencia.getPlantas().filter((p) => fincasIds.includes(p.finca_id));
  },
  
  savePlanta: (planta: any) => {
    const data = persistencia.getAll();
    const existingIndex = data.plantas.findIndex(
      (p) => p.nombre_spot === planta.nombre_spot
    );
    
    if (existingIndex >= 0) {
      data.plantas[existingIndex] = planta;
    } else {
      data.plantas.push(planta);
    }
    
    persistencia.saveAll(data);
    return planta;
  },

  // Limpiar todo (útil para desarrollo)
  clearAll: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

