import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type WeatherData = {
  name: string;
  coord: { lat: number; lon: number };
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
};

type ForecastData = {
  list: {
    dt_txt: string;
    main: { temp: number };
    weather: { icon: string; description: string }[];
  }[];
};

const API_KEY = "TU_API_KEY_AQUI";

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );
      if (!res.ok) throw new Error("Ciudad no encontrada");
      const data = await res.json();
      setWeather(data);
      fetchForecast(data.name);
    } catch (err: any) {
      setError(err.message || "Error al obtener el clima");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (cityName: string) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );
      const data = await res.json();
      setForecast(data);
    } catch {
      setForecast(null);
    }
  };

  const addFavorite = () => {
    if (!weather) return;
    const name = weather.name;
    if (!favorites.includes(name)) {
      const updated = [...favorites, name];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  const removeFavorite = (city: string) => {
    const updated = favorites.filter((c) => c !== city);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-center">🌦️ Clima y Pronóstico</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Buscar ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={() => fetchWeather(city)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>

        {loading && <p className="text-center">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {weather && (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{weather.name}</h2>
              <button onClick={addFavorite} className="text-indigo-600 underline">
                Guardar como favorita ⭐
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Icono del clima"
              />
              <div>
                <p className="capitalize">{weather.weather[0].description}</p>
                <p className="text-2xl font-bold">{weather.main.temp}°C</p>
                <p>Humedad: {weather.main.humidity}%</p>
                <p>Viento: {weather.wind.speed} m/s</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">🌤️ Pronóstico (5 días)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {forecast &&
                  forecast.list
                    .filter((_, idx) => idx % 8 === 0)
                    .map((f, idx) => (
                      <div
                        key={idx}
                        className="bg-indigo-100 rounded p-2 text-center text-sm"
                      >
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
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">🗺️ Ubicación</h3>
              <div className="h-64 rounded overflow-hidden">
                <MapContainer
                  center={[weather.coord.lat, weather.coord.lon]}
                  zoom={10}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[weather.coord.lat, weather.coord.lon]}>
                    <Popup>{weather.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">⭐ Ciudades favoritas</h3>
            <ul className="space-y-1">
              {favorites.map((fav) => (
                <li key={fav} className="flex justify-between">
                  <span
                    className="cursor-pointer text-blue-600 underline"
                    onClick={() => fetchWeather(fav)}
                  >
                    {fav}
                  </span>
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => removeFavorite(fav)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
