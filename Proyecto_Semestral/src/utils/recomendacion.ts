// src/utils/recomendacion.ts

import { loadRulesFromCSV } from "./parseCSV";

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
export async function getRecommendation(tipo: string, input: number | string): Promise<string | null> {
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
