import React, { useState } from 'react';
import '../styles/LandingPage.css';
import { WeatherData, ForecastData } from "../types/weather";
import MapView from "../components/MapView";
import ForecastGrid from "../components/ForecastGrid";
import SearchBar from "../components/SearchBar";
import WeatherDetails from "../components/WeatherDetails";
import FavoritesList from "../components/FavoritesList";
import UbicacionActual from "./ubicacionActual";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import { fetchWeather, fetchForecast } from "../services/weatherService";
import useFavorites from "../hooks/useFavorites";

interface LandingPageProps {
  onWeatherSearch?: (city: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onWeatherSearch }) => {
  // Estados para el formulario de registro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Estados para la funcionalidad del clima
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Obtener fecha actual
  const today = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = dayNames[today.getDay()];
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const dateString = `${day}/${month}`;
  
  // Actividades disponibles
  const activities = [
    { id: 1, image: '/activities/leer.jpg', alt: 'Persona leyendo' },
    { id: 2, image: '/activities/cocinar.jpg', alt: 'Cocinando' },
    { id: 3, image: '/activities/surf.jpg', alt: 'Surf en la playa' },
    { id: 4, image: '/activities/ciclismo.jpg', alt: 'Ciclismo' },
    { id: 5, image: '/activities/ski.jpg', alt: 'Esquí' },
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', { name, email, selectedInterests });
    alert('¡Gracias por registrarte! Recibirás recomendaciones personalizadas pronto.');
  };

  // Función para obtener el clima
  const handleFetchWeather = async (cityName: string) => {
    setLoading(true);
    setError("");
    try {
      const weatherData = await fetchWeather(cityName);
      setWeather(weatherData);
      const forecastData = await fetchForecast(weatherData.name);
      setForecast(forecastData);
      setShowWeatherDetails(true);
      
      // Si existe el callback del componente padre, también lo llamamos
      if (onWeatherSearch) {
        onWeatherSearch(cityName);
      }
    } catch (err: any) {
      setError(err.message || "Error al obtener el clima");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">Nombre página</div>
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <button className="search-button">🔍</button>
        </div>
        <div className="navbar-actions">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-account">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section con información del clima */}
      <div className="hero-section">
        <div className="weather-card">
          <h1>Concepción</h1>
          <div className="weather-info">
            <div>
              <p className="day">{dayName}</p>
              <p className="temperature">18°C</p>
              <p className="date">{dateString}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SearchBar para clima (puede estar oculto inicialmente) */}
      <div className={`weather-search-container ${showWeatherDetails ? '' : 'hidden'}`}>
        <SearchBar city={city} setCity={setCity} fetchWeather={handleFetchWeather} />
      </div>
      
      {/* Mostrar error o carga */}
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {/* Sección de detalles del clima (visible solo después de buscar) */}
      {showWeatherDetails && weather && (
        <div className="weather-details-container">
          <div className="weather-details-header">
            <h2>{weather.name}</h2>
            <button onClick={() => addFavorite(weather.name)} className="favorite-button">
              Guardar como favorita ⭐
            </button>
          </div>
          
          <WeatherDetails weather={weather} />
          {forecast && <ForecastGrid forecast={forecast} />}
          <MapView weather={weather} />
          
          <div className="weather-favorites-container">
            <FavoritesList
              favorites={favorites}
              fetchWeather={handleFetchWeather}
              removeFavorite={removeFavorite}
            />
          </div>
        </div>
      )}

      {/* Sección de actividades recomendadas */}
      <div className="activities-section">
        <h2>Ideas de panoramas según tus gustos</h2>
        <div className="activities-grid">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card">
              <img src={activity.image} alt={activity.alt} />
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de registro */}
      <div className="registration-section">
        <h2>¡Regístrate para recibir recomendaciones personalizadas!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="form-interests">
            <label>Intereses</label>
            <div className="interests-options">
              <button 
                type="button" 
                className={selectedInterests.includes('Playa') ? 'selected' : ''}
                onClick={() => handleInterestToggle('Playa')}
              >
                Playa
              </button>
              <button 
                type="button" 
                className={selectedInterests.includes('Montaña') ? 'selected' : ''}
                onClick={() => handleInterestToggle('Montaña')}
              >
                Montaña
              </button>
              <button 
                type="button" 
                className={selectedInterests.includes('Indoor') ? 'selected' : ''}
                onClick={() => handleInterestToggle('Indoor')}
              >
                Indoor
              </button>
            </div>
          </div>
          
          <button type="submit" className="submit-button">Crear cuenta</button>
        </form>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-brand">Nombre página</div>
          <div className="footer-links">
            <div className="footer-column">
              <p className="footer-title">Topic</p>
              <p>Page</p>
              <p>Page</p>
              <p>Page</p>
            </div>
            <div className="footer-column">
              <p className="footer-title">Topic</p>
              <p>Page</p>
              <p>Page</p>
              <p>Page</p>
            </div>
            <div className="footer-column">
              <p className="footer-title">Topic</p>
              <p>Page</p>
              <p>Page</p>
              <p>Page</p>
            </div>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">tw</a>
            <a href="#" className="social-icon">in</a>
            <a href="#" className="social-icon">ig</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;