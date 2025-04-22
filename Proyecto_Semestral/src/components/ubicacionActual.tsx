import React, { useEffect, useState } from "react";
import Geolocalizar from "../hooks/Geolocalizar";
import { reverseGeocode } from "../services/reverseGeocode";

const UbicacionActual: React.FC = () => {
  const { ubicacion, error } = Geolocalizar();
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    if (ubicacion) {
      reverseGeocode(ubicacion.lat, ubicacion.lon)
        .then(dir => setDireccion(dir))
        .catch(() => setDireccion("No se pudo obtener la dirección"));
    }
  }, [ubicacion]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">📍 Tu ubicación actual</h2>
      {error && <p className="text-red-500">{error}</p>}
      {direccion && <p>Dirección: {direccion}</p>}
      {!ubicacion && !error && <p>Obteniendo ubicación...</p>}
    </div>
  );
};

export default UbicacionActual;