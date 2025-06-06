import { obtenerActividades } from '../services/interests';

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
  const actividades = await obtenerActividades();
  const climaId = CLIMA_IDS[condiciones.weather_main] || 0;

  const actividadesValidas = actividades.filter((act: any) =>
    cumpleCondiciones(act, condiciones, climaId)
  );

  if (actividadesValidas.length === 0) {
    return [{
      actividad: "Sin coincidencias",
      recomendacion: "Ninguna actividad coincide con las condiciones actuales. ¡Pero aún puedes disfrutar tu día!"
    }];
  }

  return actividadesValidas.map((act: any) => ({
    actividad: act.name,
    recomendacion: `Ideal para un clima como el de hoy.`
  }));
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


