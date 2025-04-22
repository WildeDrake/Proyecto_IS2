import { WeatherData } from "../types/weather";

const WeatherDetails: React.FC<{ weather: WeatherData }> = ({ weather }) => {
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
        <p>La humedad actual es de: {weather.main.humidity}%</p>
        <p>Velocidad del viento: {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
};

export default WeatherDetails;
