import React, { useState, useEffect } from "react";
import { Geolocalizar } from "../services/Geolocalizar";
import { reverseGeocode } from "../services/reverseGeocode";

const UbicacionActual: React.FC = () => {
  const [ubicacion, setUbicacion] = useState<{ lat: number; lon: number } | null>(null);
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const obtenerUbicacion = async () => {
    setCargando(true);
    setError(null);
    setDireccion("");

    try {
      const nuevaUbicacion = await Geolocalizar();
      setUbicacion(nuevaUbicacion);

      const dir = await reverseGeocode(nuevaUbicacion.lat, nuevaUbicacion.lon);
      setDireccion(dir);
    } catch (err: any) {
      setError(err.toString());
      setUbicacion(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUbicacion(); // Obtener ubicación al cargar
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-gray-800">
      <h2 className="text-lg font-bold mb-2">📍 Tu ubicación actual</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {direccion && <p className="mb-2">Dirección: {direccion}</p>}

      {cargando && <p className="text-blue-500">Obteniendo ubicación...</p>}

      <button
        onClick={obtenerUbicacion}
        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        🔄 Refrescar ubicación
      </button>
    </div>
  );
};

export default UbicacionActual;
