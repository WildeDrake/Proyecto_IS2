import { obtenerActividades, getUserInterests } from '../services/interests';

const CLIMA_IDS: Record<string, number> = { // 
  Clear: 0,
  Clouds: 1,
  Rain: 2,
  Snow: 3,
  Thunderstorm: 4,
  Drizzle: 5,
  Mist: 6,
  Haze: 7,
  Dust: 8,
  Fog: 9,
  Ash: 10,
  Squall: 11,
};

export async function getActRecomendadas(condiciones: any) {
  try {
    // Obtener las actividades y los intereses del usuario
    const actividades = await obtenerActividades();
    const userInterests = await getUserInterests();
    const userInterestNames = userInterests.map((interest: any) => interest.name);
    
    const climaId = CLIMA_IDS[condiciones.weather_main] || 999;

    // Filtrar primero por intereses del usuario y luego por condiciones climáticas
    const actividadesValidas = actividades
      .filter((act: any) => userInterestNames.includes(act.name))
      .filter((act: any) => cumpleCondiciones(act, condiciones, climaId));

    if (actividadesValidas.length === 0) {
      return [{
        actividad: "Sin coincidencias",
        recomendacion: "No hay actividades de tu interés que coincidan con el clima actual."
      }];
    }

    // Obtener recomendaciones personalizadas del CSV
    const response = await fetch('/tablaPersonalizada.csv?cache_burst=${Date.now()}');
    const csvText = await response.text();
    const recomendaciones = parseCSVPersonalizado(csvText);

    return actividadesValidas.map((act: any) => ({
      actividad: act.name,
      recomendacion: obtenerRecomendacionPersonalizada(act.name, recomendaciones)
    }));
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    return [{
      actividad: "Error",
      recomendacion: "No se pudieron cargar las recomendaciones personalizadas."
    }];
  }
}

function parseCSVPersonalizado(csv: string) {
  const lines = csv.split('\n').slice(1); // Ignorar encabezado
  const recomendaciones: Record<string, string> = {};
  
  lines.forEach(line => {
    const [actividad, , , , , , , recomendacion] = line.split(',');
    if (actividad && recomendacion) {
      recomendaciones[actividad.trim()] = recomendacion.trim();
    }
  });
  
  return recomendaciones;
}

function obtenerRecomendacionPersonalizada(actividad: string, recomendaciones: Record<string, string>): string {
  return recomendaciones[actividad] || 'Ideal para un clima como el de hoy.';
}

function cumpleCondiciones(actividad: any, cond: any, climaId: number): boolean {
  const climaOK = actividad.climas_permitidos.includes(climaId);
  const lluviaOK = !(actividad.requiere_sin_lluvia && cond.lluvia);

  return (
    climaOK &&
    cond.temp >= actividad.temp_min && cond.temp <= actividad.temp_max &&
    cond.viento >= actividad.viento_min && cond.viento <= actividad.viento_max &&
    cond.humedad >= actividad.humedad_min && cond.humedad <= actividad.humedad_max &&
    cond.visibilidad >= actividad.vis_min_km &&
    lluviaOK
  );
}


