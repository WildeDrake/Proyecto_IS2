import React from "react";
import '../styles/ForecastGrid.css';

interface ForecastGridProps {
  forecast: ForecastData | null;
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => (
  <div className="forecast-grid">
    {forecast &&
      forecast.list
        .filter((_, idx) => idx % 8 === 0)
        .map((f, idx) => (
          <div key={idx} className="forecast-card">
            <p>{new Date(f.dt_txt).toLocaleDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
              alt=""
              className="mx-auto"
            />
            <p className="capitalize">{f.weather[0].description}</p>
            <p className="font-bold">{f.main.temp}°C</p>
          </div>
        ))}
  </div>
);

export default ForecastGrid;
