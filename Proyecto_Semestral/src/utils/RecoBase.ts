export async function getRecoBase(condicionesUsuario: any): Promise<string> {
  const response = await fetch('/recoBase.csv');
  const csvText = await response.text();

  const reglas = parseCSVBase(csvText);
  const { weather_main, temp } = condicionesUsuario;

  const umbral_min = 5;
  const umbral_frio = 12;
  const umbral_calido = 20;
  const umbral_max = 30;

  for (const regla of reglas) {
    if (regla.weather_main !== weather_main) continue;
    const valor = temp;

    switch (regla.Operador) {
      case '>':
        if (valor > resolverUmbral(regla.Valor, umbral_min, umbral_frio, umbral_calido, umbral_max)) {
          return regla.Recomendación_Base;
        }
        break;
      case '<':
        if (valor < resolverUmbral(regla.Valor, umbral_min, umbral_frio, umbral_calido, umbral_max)) {
          return regla.Recomendación_Base;
        }
        break;
      case 'entre':
        const [minStr, maxStr] = regla.Valor.split(',');
        const min = resolverUmbral(minStr, umbral_min, umbral_frio, umbral_calido, umbral_max);
        const max = resolverUmbral(maxStr, umbral_min, umbral_frio, umbral_calido, umbral_max);
        if (valor >= min && valor <= max) {
          return regla.Recomendación_Base;
        }
        break;
    }
  }

  return 'No hay recomendación disponible para las condiciones actuales.';
}

function parseCSVBase(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(';');
  return lines.slice(1).map(line => {
    const values = line.split(';');
    const obj: any = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
    return obj;
  });
}

function resolverUmbral(texto: string, min: number, frio: number, calido: number, max: number): number {
  switch (texto.trim()) {
    case 'umbral_min': return min;
    case 'umbral_frio': return frio;
    case 'umbral_calido': return calido;
    case 'umbral_max': return max;
    default: return parseFloat(texto);
  }
}
