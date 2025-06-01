import React from "react";
import LandingPage from "./components/LandingPage";
import './styles/App.css';
import 'leaflet/dist/leaflet.css';

/* 
CÓDIGO DE MAIN ANTES DE HACER MERGE


  const WeatherApp: React.FC = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(""); 
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const handleFetchWeather = async (cityName: string, countryName: string) => {
    setLoading(true);
    setError("");
    try {
      const weatherData = await fetchWeather(cityName, countryName);
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
        <UbicacionActual />
        <SearchBar
          city={city}
          setCity={setCity}
          country={country}
          setCountry={setCountry}
          fetchWeather={handleFetchWeather}
        />
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {weather && (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{weather.name}</h2>
              <button onClick={() => addFavorite(weather.name)} className="text-indigo-600 underline">
                Guardar como favorita ⭐
              </button>
            </div>
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
*/

const App: React.FC = () => {
  return (
    <div>
      <LandingPage />
    </div>
  );
};

export default App;