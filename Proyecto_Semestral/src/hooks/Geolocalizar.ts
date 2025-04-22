import { useState, useEffect } from 'react';

const Geolocalizar = () => {
  const [ubicacion, setUbicacion] = useState<{ lat: number, lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          setUbicacion({
            lat: posicion.coords.latitude,
            lon: posicion.coords.longitude,
          });
        },
        () => {
          setError('No se pudo obtener la ubicación');
        }
      );
    } else {
      setError('Geolocalización no soportada en este navegador');
    }
  }, []);

  return { ubicacion, error };
};

export default Geolocalizar;
