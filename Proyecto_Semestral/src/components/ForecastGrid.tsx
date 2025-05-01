import React from "react";
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiStrongWind,
} from 'react-icons/wi';

import { ForecastData } from "../types/weather";
import "../styles/ForecastGrid.css";


interface ForecastGridProps {
  forecast: ForecastData | null;
}
const getWeatherIcon = (main: string, description: string) => {
  const key = `${main.toLowerCase()}-${description.toLowerCase()}`;
  if (key.includes("clear")) return <WiDaySunny size={40} />;
  if (key.includes("clouds") && key.includes("few")) return <WiDayCloudy size={40} />;
  if (key.includes("clouds")) return <WiCloudy size={40} />;
  if (key.includes("rain") && key.includes("light")) return <WiShowers size={40} />;
  if (key.includes("rain")) return <WiRain size={40} />;
  if (key.includes("thunderstorm")) return <WiThunderstorm size={40} />;
  if (key.includes("snow")) return <WiSnow size={40} />;
  if (key.includes("fog") || key.includes("mist") || key.includes("haze")) return <WiFog size={40} />;
  if (key.includes("wind")) return <WiStrongWind size={40} />;

  return <WiCloudy size={40} />;
};


const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return <p>No hay pronóstico disponible.</p>;
  }
  console.log("Pronóstico recibido:", forecast);
  console.log("Cantidad de elementos recibidos:", forecast.list.length);
  console.log("Primeros elementos:", forecast.list.slice(0, 5));

  // Agrupar por fecha (YYYY-MM-DD)
  const groupedByDay = forecast.list.reduce((acc: Record<string, typeof forecast.list>, item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // Tomar el primer registro representativo de cada día
  const onePerDay = Object.values(groupedByDay).map(items => items[0]).slice(0, 5);
 

  return (
    <section className="forecast-section">
      <h2 className="forecast-title">Pronóstico para los próximos días</h2>
      <div className="forecast-grid">
        {onePerDay.map((f, idx) => (
          <div key={idx} className="forecast-card">
            <p className="forecast-date">
              {new Date(f.dt_txt).toLocaleDateString('es-ES', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase())}<br />
              {new Date(f.dt_txt).toLocaleDateString()}</p>
              <div className="weather-icon">
                 {getWeatherIcon(f.weather[0].main, f.weather[0].description)}
                 </div>

            <p className="forecast-description">{f.weather[0].description}</p>
            <p className="forecast-temp">{f.main.temp}°C</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ForecastGrid;