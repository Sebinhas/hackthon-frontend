// Script para generar CSV con spots dentro del lote 34055
// INCLUYE ERRORES INTENCIONALES para probar la validación
import fs from 'fs';

const coordenadasPerimetro = [
  { lat: 3.717828, lng: -73.198359 },
  { lat: 3.717829, lng: -73.198363 },
  { lat: 3.717828, lng: -73.198463 },
  { lat: 3.717732, lng: -73.198622 },
  { lat: 3.717580, lng: -73.198811 },
  { lat: 3.717501, lng: -73.198860 },
  { lat: 3.717307, lng: -73.199094 },
  { lat: 3.717240, lng: -73.199218 },
  { lat: 3.717165, lng: -73.199442 },
  { lat: 3.717057, lng: -73.199650 },
  { lat: 3.717374, lng: -73.199679 },
  { lat: 3.717847, lng: -73.199710 },
  { lat: 3.718177, lng: -73.199749 },
  { lat: 3.718675, lng: -73.199776 },
  { lat: 3.718788, lng: -73.199837 },
  { lat: 3.718949, lng: -73.199854 },
  { lat: 3.719373, lng: -73.199873 },
  { lat: 3.719866, lng: -73.199912 },
  { lat: 3.720352, lng: -73.199958 },
  { lat: 3.721158, lng: -73.200019 },
  { lat: 3.721186, lng: -73.199916 },
  { lat: 3.721271, lng: -73.199581 },
  { lat: 3.721330, lng: -73.199321 },
  { lat: 3.721383, lng: -73.199116 },
  { lat: 3.721434, lng: -73.198910 },
  { lat: 3.721485, lng: -73.198738 },
  { lat: 3.721557, lng: -73.198471 },
  { lat: 3.721612, lng: -73.198259 },
  { lat: 3.721680, lng: -73.197921 },
  { lat: 3.721772, lng: -73.197533 },
  { lat: 3.721860, lng: -73.197271 },
  { lat: 3.721424, lng: -73.197234 },
  { lat: 3.720809, lng: -73.197183 },
  { lat: 3.720147, lng: -73.197144 },
  { lat: 3.719416, lng: -73.197089 },
  { lat: 3.718731, lng: -73.197049 },
  { lat: 3.717828, lng: -73.198359 }
];

// Función para verificar si un punto está dentro del polígono (Ray Casting Algorithm)
function puntoEnPoligono(punto, poligono) {
  let dentro = false;
  const n = poligono.length;
  
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = poligono[i].lng;
    const yi = poligono[i].lat;
    const xj = poligono[j].lng;
    const yj = poligono[j].lat;
    
    const intersecta = ((yi > punto.lat) !== (yj > punto.lat)) &&
                       (punto.lng < (xj - xi) * (punto.lat - yi) / (yj - yi) + xi);
    
    if (intersecta) dentro = !dentro;
  }
  
  return dentro;
}

// Calcular límites del polígono
function calcularLimites(coordenadas) {
  const lats = coordenadas.map(c => c.lat);
  const lngs = coordenadas.map(c => c.lng);
  
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };
}

// Generar spots dentro del polígono
const limites = calcularLimites(coordenadasPerimetro);
const loteNombre = '34055';
const spots = [];
const separacion = 0.00025; // Aproximadamente 28 metros entre puntos (más denso)

let linea = 1;
let latActual = limites.minLat;

while (latActual < limites.maxLat) {
  let lngActual = limites.minLng;
  let palma = 1;
  let tieneSpotsEnLinea = false;
  
  // Recorrer horizontalmente (por longitud)
  while (lngActual < limites.maxLng) {
    const punto = { lat: latActual, lng: lngActual };
    
    if (puntoEnPoligono(punto, coordenadasPerimetro)) {
      spots.push({
        lote: loteNombre,
        linea: linea.toString(),
        palma: palma.toString(),
        longitud: lngActual.toFixed(12),
        latitud: latActual.toFixed(12)
      });
      palma++;
      tieneSpotsEnLinea = true;
    }
    
    lngActual += separacion;
  }
  
  if (tieneSpotsEnLinea) {
    linea++;
  }
  
  latActual += separacion;
}

console.log(`Generados ${spots.length} spots válidos`);

// ===== AGREGAR ERRORES INTENCIONALES PARA PROBAR VALIDACIÓN =====

// 1. Coordenadas duplicadas (mismo lat/lng exacto)
if (spots.length > 2) {
  // Duplicar el spot en índice 5
  const spotDuplicado = { ...spots[5] };
  spots.push(spotDuplicado);
  console.log('✅ Error agregado: Coordenada duplicada');
}

// 2. Combinación Línea+Palma duplicada dentro del mismo lote
if (spots.length > 3) {
  // Crear un spot con la misma línea y palma que el primero
  const primerSpot = spots[0];
  const spotDuplicadoLineaPalma = {
    lote: primerSpot.lote,
    linea: primerSpot.linea,
    palma: primerSpot.palma,
    longitud: (parseFloat(primerSpot.longitud) + 0.0001).toFixed(12),
    latitud: (parseFloat(primerSpot.latitud) + 0.0001).toFixed(12)
  };
  spots.push(spotDuplicadoLineaPalma);
  console.log('✅ Error agregado: Línea+Palma duplicada en el mismo lote');
}

// 3. Formato de coordenadas incorrecto (usar coma en lugar de punto)
if (spots.length > 5) {
  const spotFormatoIncorrecto = {
    lote: loteNombre,
    linea: '99',
    palma: '99',
    longitud: '-73,198359', // Error: coma en lugar de punto
    latitud: '3,717828'     // Error: coma en lugar de punto
  };
  spots.push(spotFormatoIncorrecto);
  console.log('✅ Error agregado: Formato de coordenadas incorrecto (coma en lugar de punto)');
}

// 4. Coordenadas fuera del polígono (pero con formato válido)
const coordenadaFuera = {
  lote: loteNombre,
  linea: '100',
  palma: '1',
  longitud: (limites.minLng - 0.01).toFixed(12), // Fuera del polígono
  latitud: (limites.minLat - 0.01).toFixed(12)   // Fuera del polígono
};
spots.push(coordenadaFuera);
console.log('✅ Error agregado: Coordenada fuera del polígono (pero formato válido)');

// 5. Otro lote inválido (lote que no pertenece a la finca)
const spotLoteInvalido = {
  lote: '99999', // Lote que no existe
  linea: '1',
  palma: '1',
  longitud: (limites.minLng + 0.001).toFixed(12),
  latitud: (limites.minLat + 0.001).toFixed(12)
};
spots.push(spotLoteInvalido);
console.log('✅ Error agregado: Lote inválido (no pertenece a la finca)');

// 6. Más coordenadas duplicadas (múltiples)
if (spots.length > 8) {
  const spotOriginal = spots[10];
  for (let i = 0; i < 2; i++) {
    spots.push({ ...spotOriginal });
  }
  console.log('✅ Error agregado: Múltiples coordenadas duplicadas');
}

// 7. Valores vacíos o inválidos
spots.push({
  lote: loteNombre,
  linea: '',
  palma: '1',
  longitud: (limites.minLng + 0.001).toFixed(12),
  latitud: (limites.minLat + 0.001).toFixed(12)
});
console.log('✅ Error agregado: Valor vacío (línea vacía)');

// 8. Coordenadas con formato muy largo (más decimales de los esperados)
spots.push({
  lote: loteNombre,
  linea: '101',
  palma: '1',
  longitud: (limites.minLng + 0.002).toFixed(20), // Muchos decimales
  latitud: (limites.minLat + 0.002).toFixed(20)
});
console.log('✅ Spot agregado: Coordenadas con muchos decimales (debería ser válido)');

console.log(`\n📊 Total de spots generados: ${spots.length}`);
console.log(`   - Spots válidos: ~${spots.length - 10}`);
console.log(`   - Spots con errores: ~10\n`);

// Generar CSV
const csvHeader = 'Lote,Linea,Palma,Longitud,Latitud\n';
const csvRows = spots.map(s => 
  `${s.lote},${s.linea},${s.palma},${s.longitud},${s.latitud}`
).join('\n');

const csvContent = '\uFEFF' + csvHeader + csvRows;

// Escribir archivo
fs.writeFileSync('lote_34055_spots_con_errores.csv', csvContent, 'utf8');

console.log('✅ CSV generado con errores de prueba');
console.log('📁 Archivo: lote_34055_spots_con_errores.csv');
console.log('\n⚠️  Este archivo contiene errores intencionales para probar la validación:');
console.log('   1. Coordenadas duplicadas');
console.log('   2. Línea+Palma duplicada en mismo lote');
console.log('   3. Formato incorrecto (coma en lugar de punto)');
console.log('   4. Coordenadas fuera del polígono');
console.log('   5. Lote inválido');
console.log('   6. Valores vacíos');
console.log('   7. Múltiples duplicados');
