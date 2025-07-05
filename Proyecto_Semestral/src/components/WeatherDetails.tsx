import React, { useEffect, useState } from "react";
import { WeatherData } from "../types/weather";
import { fetchForecast } from "../services/weatherService";
import { getRecoPersonalizada } from "../utils/recoPersonalizada";
import { getRecoGenerica } from "../utils/recoGenerica";
import '../styles/WeatherDetails.css';

const WeatherDetails: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  const [recoGenericas, setRecoGenericas] = useState<string[]>([]);
  const [actividadRecomendadas, setActividadRecomendadas] = useState<any[] | null>(null);
  const [recomendacionBase, setRecomendacionBase] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calcularProbabilidadLluvia = (forecastData: any): boolean => {
      const bloques = forecastData.list.slice(0, 2); // Primeras 6 horas (2 bloques de 3h)
      const totalPop = bloques.reduce((acc: number, bloque: any) => acc + (bloque.pop ?? 0), 0);
      const promedioPop = totalPop / bloques.length;
      return promedioPop >= 0.4;
    };

    const fetchRecomendaciones = async () => {
      setIsLoading(true);
      try {
        const forecastData = await fetchForecast(weather.name);
        const lluviaa = calcularProbabilidadLluvia(forecastData);
        const condiciones = {
          weather_main: weather.weather[0].main,
          temp: weather.main.temp,
          viento: weather.wind.speed,
          humedad: weather.main.humidity,
          visibilidad: weather.visibility ?? 10000,
          lluvia: lluviaa,
        };

        const token = localStorage.getItem("token");
        setIsLogged(!!token);

        if (token) {
          const recoPersonalizada = await getRecoPersonalizada(condiciones);
          setRecomendacionBase(recoPersonalizada.recomendacionBase);
          setActividadRecomendadas(recoPersonalizada.actividades);
        }

        // Obtener recomendaciones genéricas
        const recoGenericasTemp = [];
        const r1 = await getRecoGenerica('weather_main', condiciones.weather_main);
        if (r1) recoGenericasTemp.push(r1);
        const r2 = await getRecoGenerica('temp', condiciones.temp);
        if (r2) recoGenericasTemp.push(r2);
        const r3 = await getRecoGenerica('humidity', condiciones.humedad);
        if (r3) recoGenericasTemp.push(r3);
        const r5 = await getRecoGenerica('wind_speed', condiciones.viento);
        if (r5) recoGenericasTemp.push(r5);
        const r6 = await getRecoGenerica('visibility', condiciones.visibilidad);
        if (r6) recoGenericasTemp.push(r6);
        const r7 = await getRecoGenerica('rain.pop', 0);
        if (r7) recoGenericasTemp.push(r7);
        setRecoGenericas(recoGenericasTemp);
      } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecomendaciones();
  }, [weather]);

  if (isLoading) {
    return <div>Cargando recomendaciones...</div>;
  }

  return (
    <div className="flex gap-4 items-start">
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Icono del clima"
      />
      <div className="weather-recommendations">
        <p className="capitalize">{weather.weather[0].description}</p>
        <p className="text-2xl font-bold">
          La temperatura actual es de: {Math.round(weather.main.temp)}°C
        </p>
        <p>La humedad actual es de: {weather.main.humidity}%</p>
        <p>Velocidad del viento: {weather.wind.speed} m/s</p>

        {/* Personalizadas (si está logueado) */}
        {isLogged && (
        <div className="recommendations-personalized">
          <h3>🌟 Recomendaciones Personalizadas</h3>
          {actividadRecomendadas && actividadRecomendadas.length > 0 ? (
            <>
              <h4>{recomendacionBase}</h4>
              <div className="actividad-grid">
                {actividadRecomendadas.map((act, index) => (
                  <div className="actividad-card" key={index}>
                    <span className="tooltip">
                      <div>{act.descripcion || "Sin descripción"}</div>
                      <div><strong>Temperatura:</strong> {act.temp_min}°C - {act.temp_max}°C</div>
                      <div><strong>Viento:</strong> {act.viento_min} m/s - {act.viento_max} m/s</div>
                      <div><strong>Humedad:</strong> {act.humedad_min ?? 0}% - {act.humedad_max ?? 100}%</div>
                      <div><strong>Visibilidad mínima:</strong> {act.vis_min_km} km</div>
                    </span>
                    <strong>{act.name}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p><strong>Sin coincidencias:</strong> Ninguna actividad coincide con las condiciones actuales. ¡Pero aún puedes disfrutar tu día! 🌈</p>
          )}
        </div>
      )}

        {/* Generales (siempre visibles) */}
        {recoGenericas.length > 0 && (
          <div className="recommendations-general">
            <h3>📋 Recomendaciones Generales</h3>
            <ul>
              {recoGenericas.map((reco, index) => (
                <li key={index}>{reco}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
