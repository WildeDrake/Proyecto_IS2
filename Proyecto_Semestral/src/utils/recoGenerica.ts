export type CSVRule = {
  Tipo: string;
  Operador: ">" | "<" | "entre" | "=";
  Valor: string;
  Recomendacion: string;
};

export async function loadRulesFromCSV(): Promise<CSVRule[]> {
  //obtener el archivo CSV 
  const response = await fetch('/recoGenericas.csv');
  
  if (!response.ok) {
    throw new Error('No se pudo cargar el archivo CSV');
  }

  // Obtén el contenido del archivo como texto
  const csvText = await response.text();

  // Parsear el contenido del archivo CSV
  return parseCSV(csvText);
}

/**
 * Parsea el contenido CSV en formato texto y lo convierte en un arreglo de reglas
 * @param csvText El contenido CSV en texto
 * @returns Un arreglo de reglas basadas en el CSV
 */
function parseCSV(csvText: string): CSVRule[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(';').map(h => h.trim()); 

  // Convierte cada línea del CSV a un objeto con las claves del encabezado
  return lines.slice(1).map(line => {
    const values = line.split(';').map(v => v.trim()); 
    const entry: any = {}; 

    // Asigna cada valor a su correspondiente clave según el encabezado
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });

    return entry as CSVRule; 
  });
}



type Operator = ">" | "<" | "entre" | "=";

type Rule = {
  tipo: string;
  operador: Operator;
  valor: number | [number, number] | string;
  recomendacion: string;
};

let rules: Rule[] = [];

// Función para cargar y procesar reglas desde el archivo CSV
export async function initializeRules() {
  const csvRules = await loadRulesFromCSV();

  rules = csvRules.map(rule => {
    let valor: number | [number, number] | string = rule.Valor;

    if (rule.Operador === "entre") {
      const [min, max] = rule.Valor.split(',').map(Number);
      valor = [min, max];
    } else if (rule.Operador === ">" || rule.Operador === "<") {
      valor = Number(rule.Valor);
    } else {
      valor = rule.Valor;
    }

    return {
      tipo: rule.Tipo,
      operador: rule.Operador,
      valor,
      recomendacion: rule.Recomendacion,
    };
  });
}

// Función que obtiene la recomendación basándose en el tipo de dato y valor
export async function getRecoGenerica(tipo: string, input: number | string): Promise<string | null> {
  // Asegúrate de que las reglas estén cargadas antes de hacer la búsqueda
  if (rules.length === 0) {
    await initializeRules(); // Carga las reglas si no están cargadas
  }

  const matches = rules.filter(rule => rule.tipo === tipo);

  for (const rule of matches) {
    if (rule.operador === ">" && typeof input === "number" && input > (rule.valor as number)) {
      return rule.recomendacion;
    }
    if (rule.operador === "<" && typeof input === "number" && input < (rule.valor as number)) {
      return rule.recomendacion;
    }
    if (rule.operador === "entre" && typeof input === "number") {
      const [min, max] = rule.valor as [number, number];
      if (input >= min && input <= max) {
        return rule.recomendacion;
      }
    }
    if (rule.operador === "=" && typeof input === "string" && input === rule.valor) {
      return rule.recomendacion;
    }
  }

  return null; // Si no se encuentra ninguna recomendación
}


