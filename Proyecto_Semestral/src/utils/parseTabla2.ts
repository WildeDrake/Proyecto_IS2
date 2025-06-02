export async function filtrarActividades(condicionesUsuario: any): Promise<any[]> {
  const response = await fetch('/tablaPersonalizada.csv');
  const csvText = await response.text();

  const actividades = parseCSV(csvText);
  const actividadesValidas = actividades.filter(act => cumpleCondiciones(act, condicionesUsuario));

  return actividadesValidas.map(act => ({
    actividad: act.actividad,
    recomendacion: act.recomendacion
  }));
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
    return obj;
  });
}

function cumpleCondiciones(actividad: any, cond: any): boolean {
  const climaOK = actividad.climas_permitidos.split('|').includes(cond.weather_main);
  const [tMin, tMax] = actividad.temp_range.split('-').map(Number);
  const [vMin, vMax] = actividad.viento_range.split('-').map(Number);
  const [hMin, hMax] = actividad.humedad_range.split('-').map(Number);
  const visMin = Number(actividad.vis_min_km);
  const lluviaOK = !(actividad.requiere_sin_lluvia === 'true' && cond.lluvia);

  return (
    climaOK &&
    cond.temp >= tMin && cond.temp <= tMax &&
    cond.viento >= vMin && cond.viento <= vMax &&
    cond.humedad >= hMin && cond.humedad <= hMax &&
    cond.visibilidad >= visMin &&
    lluviaOK 
  );
}
