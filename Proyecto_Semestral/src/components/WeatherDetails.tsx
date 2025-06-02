import React, { useEffect, useState } from "react";
import { WeatherData } from "../types/weather";
import { getResultado } from "../utils/combinar";

const WeatherDetails: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  const [tempRecommendation, setTempRecommendation] = useState<string | null>(null);
  const [actividadRecomendadas, setActividadRecomendadas] = useState<{ actividad: string; recomendacion: string }[] | null>(null);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      const condiciones = {
        weather_main: "Clouds", // weather.weather[0].main
        temp: 20, // weather.main.temp
        viento: 2, // weather.wind.speed
        humedad: 20, // weather.main.humidity
        visibilidad: 7, // weather.visibility
        lluvia: false, // weather.rain
      };

      const resultado = await getResultado(condiciones);
      setTempRecommendation(resultado.recomendacionBase);
      setActividadRecomendadas(resultado.actividades);
    };

    fetchRecomendaciones();
  }, [weather]);

  return (
    <div className="flex gap-4 items-center">
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Icono del clima"
      />
      <div>
        <p className="capitalize">{weather.weather[0].description}</p>

        <p className="text-2xl font-bold">
          La temperatura actual es de: {Math.round(weather.main.temp)}°C
        </p>

        <p>La humedad actual es de: {weather.main.humidity}%</p>
        <p>Velocidad del viento: {weather.wind.speed} m/s</p>

        <p>{tempRecommendation && `Recomendación base: ${tempRecommendation}`}</p>
        {actividadRecomendadas && actividadRecomendadas.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Actividades sugeridas:</h3>
            <ul className="list-disc list-inside">
              {actividadRecomendadas.map((act, index) => (
                <li key={index}>
                  <strong>{act.actividad}:</strong> {act.recomendacion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
