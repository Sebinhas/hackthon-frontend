// Script temporal para generar CSV con spots dentro del lote 34056
import fs from 'fs';

const coordenadasPerimetro = [
  { lat: 3.721866, lng: -73.197251 },
  { lat: 3.721917, lng: -73.197066 },
  { lat: 3.722057, lng: -73.196485 },
  { lat: 3.722259, lng: -73.195641 },
  { lat: 3.722243, lng: -73.195553 },
  { lat: 3.722128, lng: -73.195441 },
  { lat: 3.722072, lng: -73.195417 },
  { lat: 3.721882, lng: -73.195323 },
  { lat: 3.721637, lng: -73.195210 },
  { lat: 3.721445, lng: -73.195112 },
  { lat: 3.721251, lng: -73.195026 },
  { lat: 3.721106, lng: -73.194950 },
  { lat: 3.720895, lng: -73.194843 },
  { lat: 3.720759, lng: -73.194828 },
  { lat: 3.720673, lng: -73.194769 },
  { lat: 3.720626, lng: -73.194732 },
  { lat: 3.720578, lng: -73.194693 },
  { lat: 3.720499, lng: -73.194647 },
  { lat: 3.720267, lng: -73.194523 },
  { lat: 3.720131, lng: -73.194456 },
  { lat: 3.719966, lng: -73.194435 },
  { lat: 3.719801, lng: -73.194516 },
  { lat: 3.719574, lng: -73.194625 },
  { lat: 3.719430, lng: -73.194699 },
  { lat: 3.719318, lng: -73.194768 },
  { lat: 3.719318, lng: -73.194899 },
  { lat: 3.719261, lng: -73.194977 },
  { lat: 3.719164, lng: -73.195030 },
  { lat: 3.718960, lng: -73.195123 },
  { lat: 3.718805, lng: -73.195203 },
  { lat: 3.718752, lng: -73.195318 },
  { lat: 3.718663, lng: -73.195476 },
  { lat: 3.718563, lng: -73.195528 },
  { lat: 3.718429, lng: -73.195590 },
  { lat: 3.718300, lng: -73.195669 },
  { lat: 3.718133, lng: -73.195746 },
  { lat: 3.717985, lng: -73.195822 },
  { lat: 3.717871, lng: -73.195924 },
  { lat: 3.717703, lng: -73.196056 },
  { lat: 3.717550, lng: -73.196119 },
  { lat: 3.717414, lng: -73.196205 },
  { lat: 3.717343, lng: -73.196290 },
  { lat: 3.717194, lng: -73.196481 },
  { lat: 3.717156, lng: -73.196551 },
  { lat: 3.717162, lng: -73.196660 },
  { lat: 3.717178, lng: -73.196720 },
  { lat: 3.717237, lng: -73.196797 },
  { lat: 3.717293, lng: -73.196792 },
  { lat: 3.717469, lng: -73.196805 },
  { lat: 3.717633, lng: -73.196816 },
  { lat: 3.717754, lng: -73.196891 },
  { lat: 3.717812, lng: -73.196904 },
  { lat: 3.717851, lng: -73.196933 },
  { lat: 3.717898, lng: -73.197006 },
  { lat: 3.717927, lng: -73.197072 },
  { lat: 3.717939, lng: -73.197161 },
  { lat: 3.717912, lng: -73.197231 },
  { lat: 3.717875, lng: -73.197287 },
  { lat: 3.717842, lng: -73.197339 },
  { lat: 3.717765, lng: -73.197442 },
  { lat: 3.717736, lng: -73.197519 },
  { lat: 3.717746, lng: -73.197574 },
  { lat: 3.717727, lng: -73.197639 },
  { lat: 3.717746, lng: -73.197696 },
  { lat: 3.717784, lng: -73.197804 },
  { lat: 3.717790, lng: -73.197931 },
  { lat: 3.717823, lng: -73.198026 },
  { lat: 3.717813, lng: -73.198151 },
  { lat: 3.717790, lng: -73.198293 },
  { lat: 3.717830, lng: -73.198318 },
  { lat: 3.718149, lng: -73.197845 },
  { lat: 3.718488, lng: -73.197352 },
  { lat: 3.718701, lng: -73.197020 },
  { lat: 3.718813, lng: -73.197026 },
  { lat: 3.719567, lng: -73.197078 },
  { lat: 3.720200, lng: -73.197125 },
  { lat: 3.720840, lng: -73.197166 },
  { lat: 3.721866, lng: -73.197251 }
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
const loteNombre = '34056'; // Usar el ID del lote como nombre
const spots = [];
const separacion = 0.0004; // Aproximadamente 45 metros entre puntos

let linea = 1;
let latActual = limites.minLat;

while (latActual < limites.maxLat) {
  let lngActual = limites.minLng;
  let palma = 1; // Posición en la línea (se reinicia por cada línea)
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
  
  // Solo incrementar línea si encontró spots en esta fila
  if (tieneSpotsEnLinea) {
    linea++;
  }
  
  latActual += separacion;
}

// Generar CSV
const csvHeader = 'Lote,Linea,Palma,Longitud,Latitud\n';
const csvRows = spots.map(s => 
  `${s.lote},${s.linea},${s.palma},${s.longitud},${s.latitud}`
).join('\n');

const csvContent = '\uFEFF' + csvHeader + csvRows;

// Escribir archivo
fs.writeFileSync('lote_34056_spots.csv', csvContent, 'utf8');

console.log(`✅ CSV generado con ${spots.length} spots`);
console.log(`📁 Archivo: lote_34056_spots.csv`);

