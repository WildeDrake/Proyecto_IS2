// src/services/Geolocalizar.ts
export const Geolocalizar = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocalización no soportada en este navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        resolve({
          lat: posicion.coords.latitude,
          lon: posicion.coords.longitude,
        });
      },
      () => {
        reject("No se pudo obtener la ubicación");
      }
    );
  });
};
