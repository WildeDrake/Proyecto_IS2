import React, { useEffect, useState } from "react";
import { WeatherData, ForecastData } from "./types/weather";
import MapView from "./components/MapView";
import ForecastGrid from "./components/ForecastGrid";
import SearchBar from "./components/SearchBar";
import FavoritesList from "./components/FavoritesList";
import Loading from "./components/Loading";  // Importamos el componente de carga
import ErrorMessage from "./components/ErrorMessage";  // Importamos el componente de error
import WeatherDetails from "./components/WeatherDetails";  // Importamos el componente de detalles del clima
import { fetchWeather, fetchForecast } from "./services/weatherService";
import useFavorites from "./hooks/useFavorites"; // Importamos el hook para favoritos

import UbicacionActual from "./components/ubicacionActual.tsx";

import './styles/App.css';

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Usamos el hook de favoritos

  // Función para obtener el clima y pronóstico
  const handleFetchWeather = async (cityName: string) => {
    setLoading(true);
    setError("");
    try {
      const weatherData = await fetchWeather(cityName);
      setWeather(weatherData);
      const forecastData = await fetchForecast(weatherData.name);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.message || "Error al obtener el clima");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-center">🌦️ Clima y Pronóstico</h1>
        <UbicacionActual /> {/* Componente para mostrar la ubicación actual */}
        
        <SearchBar city={city} setCity={setCity} fetchWeather={handleFetchWeather} />

        {loading && <Loading />}  {/* Usamos el componente Loading */}
        {error && <ErrorMessage message={error} />}  {/* Usamos el componente ErrorMessage */}

        {weather && (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{weather.name}</h2>
              <button onClick={() => addFavorite(weather.name)} className="text-indigo-600 underline">
                Guardar como favorita ⭐
              </button>
            </div>

            {/* Usamos el componente WeatherDetails */}
            <WeatherDetails weather={weather} />

            <ForecastGrid forecast={forecast!} />
            <MapView weather={weather} />
          </div>
        )}
        <FavoritesList
          favorites={favorites}
          fetchWeather={handleFetchWeather}
          removeFavorite={removeFavorite}
        />
      </div>
    </div>
  );
};

export default WeatherApp;
