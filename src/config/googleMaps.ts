// ============================================================================
// CONFIGURACIÓN DE GOOGLE MAPS
// ============================================================================

/**
 * API Key de Google Maps
 * 
 * IMPORTANTE: Obtén tu propia API Key en:
 * https://console.cloud.google.com/
 * 
 * Pasos:
 * 1. Crear proyecto en Google Cloud Console
 * 2. Habilitar "Maps JavaScript API"
 * 3. Crear credenciales (API Key)
 * 4. Restringir la key a tu dominio
 * 5. Reemplazar la key aquí
 */

// Puedes usar variables de entorno o directamente aquí
export const GOOGLE_MAPS_CONFIG = {
  // Opción 1: Usar variable de entorno (Recomendado)
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCSqesDKMLfeiPIj1AP-67w5aeE_Mfn79s',
  
  // Opción 2: Hardcodear (NO recomendado para producción)
  // apiKey: 'TU_API_KEY_AQUI',
  
  // Librerías que se cargarán
  libraries: ['drawing'] as const,
  
  // Región por defecto
  region: 'CO', // Colombia
  
  // Idioma
  language: 'es',
};

/**
 * Genera la URL completa del script de Google Maps
 */
export const getGoogleMapsScriptUrl = (): string => {
  const params = new URLSearchParams({
    key: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries.join(','),
    region: GOOGLE_MAPS_CONFIG.region,
    language: GOOGLE_MAPS_CONFIG.language,
  });
  
  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
};

export default GOOGLE_MAPS_CONFIG;

