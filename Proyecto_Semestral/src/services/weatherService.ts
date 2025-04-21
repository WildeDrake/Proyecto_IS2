const API_KEY = "c19be96f696edcd9290ed32ab23e521f";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
import { WeatherData, ForecastData } from "../types/weather";

export const fetchWeather = async (cityName: string): Promise<WeatherData> => {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error("Ciudad no encontrada");

  const data = await res.json();

  // Validación mínima
  if (!data.main || typeof data.main.temp !== "number") {
    throw new Error("Respuesta inesperada del API: no se encontró la temperatura.");
  }

  return {
    name: data.name,
    coord: data.coord,
    main: {
      temp: data.main.temp,
      humidity: data.main.humidity
    },
    weather: data.weather,
    wind: data.wind
  };
};

export const fetchForecast = async (cityName: string): Promise<ForecastData> => {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error("Error al obtener el pronóstico");

  return await res.json();
};
