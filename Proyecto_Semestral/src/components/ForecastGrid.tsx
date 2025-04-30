import React from "react";
import { ForecastData } from "../types/weather";
import "../styles/ForecastGrid.css";

interface ForecastGridProps {
  forecast: ForecastData | null;
}

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
            <img
              src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
              alt={f.weather[0].description}
            />
            <p className="forecast-description">{f.weather[0].description}</p>
            <p className="forecast-temp">{f.main.temp}°C</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ForecastGrid;