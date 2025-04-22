export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
  
      if (!res.ok) throw new Error("Error al consultar la API de geolocalización");
  
      const data = await res.json();
      return data.display_name || "Dirección no encontrada";
    } catch (error) {
      console.error(error);
      return "No se pudo obtener la dirección";
    }
  };
  