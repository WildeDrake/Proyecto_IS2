export type CSVRule = {
  Tipo: string;
  Operador: ">" | "<" | "entre" | "=";
  Valor: string;
  Recomendacion: string;
};

export async function loadRulesFromCSV(): Promise<CSVRule[]> {
  //obtener el archivo CSV 
  const response = await fetch('/Recomendaciones.csv');
  
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
