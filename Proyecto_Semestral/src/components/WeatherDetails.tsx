import React, { useEffect, useState } from "react";
import { WeatherData } from "../types/weather";
import { getRecommendation } from "../utils/recomendacion"; // Importa la función

const WeatherDetails: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  /* Modificar dependiendo de que recomendacion se quiera mostrar */
  const [tempRecommendation, setTempRecommendation] = useState<string | null>(null);
  const [humidityRecommendation, setHumidityRecommendation] = useState<string | null>(null);
  const [windRecommendation, setWindRecommendation] = useState<string | null>(null);
  const [mainRecommendation, setMainRecommendation] = useState<string | null>(null);

  // Función que obtiene las recomendaciones y actualiza el estado
  useEffect(() => {
    const fetchRecommendations = async () => {
      /* Agregar recomendaciones que se quieran */
      const tempRec = await getRecommendation("temp", weather.main.temp);
      const humidityRec = await getRecommendation("humidity", weather.main.humidity);
      const windRec = await getRecommendation("wind_speed", weather.wind.speed);
      const mainRec = await getRecommendation("weather.main", weather.weather[0].main)

      setTempRecommendation(tempRec);
      setHumidityRecommendation(humidityRec);
      setWindRecommendation(windRec);
      setMainRecommendation(mainRec);
    };

    fetchRecommendations(); // Llamada para obtener recomendaciones al montar el componente
  }, [weather]); // Dependencia para que se vuelva a ejecutar si `weather` cambia

  return (
    <div className="flex gap-4 items-center">
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Icono del clima"
      />
      <div>
        <p className="capitalize">{weather.weather[0].description}</p>

        <p className="text-2xl font-bold">
          La temperatura actual es de: {weather.main.temp}°C
        </p>
        <p>{tempRecommendation && `Recomendación: ${tempRecommendation}`}</p> {/* Recomendación de temperatura */}
        <p>{mainRecommendation && `Recomendación: ${mainRecommendation}`}</p> {/* Recomendación basada en el estado del clima */}

        <p>La humedad actual es de: {weather.main.humidity}%</p>
        <p>{humidityRecommendation && `Recomendación: ${humidityRecommendation}`}</p> {/* Recomendación de humedad */}

        <p>Velocidad del viento: {weather.wind.speed} m/s</p>
        <p>{windRecommendation && `Recomendación: ${windRecommendation}`}</p> {/* Recomendación de viento */}
      </div>
    </div>
  );
};

export default WeatherDetails;
