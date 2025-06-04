import { obtenerActividades } from '../services/interests';

const CLIMA_IDS: Record<string, number> = {
  Clear: 1,
  Clouds: 2,
  Rain: 3,
  Snow: 4,
  Thunderstorm: 5,
  Drizzle: 6,
  Mist: 7,
  Smoke: 8,
  Haze: 9,
  Dust: 10,
  Fog: 11,
  Sand: 12,
  Ash: 13,
  Squall: 14,
  Tornado: 15
};

export async function actividadesRecomendadas(condiciones: any) {
  const actividades = await obtenerActividades();
  const climaId = CLIMA_IDS[condiciones.weather_main];

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
    recomendacion: `Ideal para un clima como el de hoy: ${condiciones.weather_main.toLowerCase()}`
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


