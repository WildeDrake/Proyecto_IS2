import React, { useState, useEffect } from 'react';
import '../styles/LandingPage.css';
import { WeatherData, ForecastData } from "../types/weather";
import MapView from "../components/MapView";
import ForecastGrid from "../components/ForecastGrid";
import SearchBar from "../components/SearchBar";
import WeatherDetails from "../components/WeatherDetails";
import FavoritesList from "../components/FavoritesList";
import { useNavigate } from 'react-router-dom';
import { fetchWeather, fetchForecast } from "../services/weatherService";
import { Geolocalizar } from "../services/Geolocalizar";
import useFavorites from "../hooks/useFavorites";
import LoginForm from './LoginForm';
import { useLocation } from 'react-router-dom';
import { reverseGeocode } from "../services/reverseGeocode";
import { authService } from '../services/authService';

interface LandingPageProps {
  onWeatherSearch?: (city: string) => void;
}

const DEFAULT_CITY = "Concepción";

const LandingPage: React.FC<LandingPageProps> = ({ onWeatherSearch }) => {
  const navigate = useNavigate();
  
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    checkAuth();
        window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const today = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = dayNames[today.getDay()];
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const dateString = `${day}/${month}`;
  
  const activities = [
    { id: 1, image: '/activities/leer.jpg', alt: 'Persona leyendo' },
    { id: 2, image: '/activities/cocinar.jpg', alt: 'Cocinando' },
    { id: 3, image: '/activities/surf.jpg', alt: 'Surf en la playa' },
    { id: 4, image: '/activities/ciclismo.jpg', alt: 'Ciclismo' },
    { id: 5, image: '/activities/ski.jpg', alt: 'Esquí' },
  ];
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  const location = useLocation();

  useEffect(() => {
    const getLocationAndWeather = async () => {
      setLoading(true);
      try {
        const ubicacion = await Geolocalizar();
        setUserCoords([ubicacion.lat, ubicacion.lon]);
        const direccion = await reverseGeocode(ubicacion.lat, ubicacion.lon);
        const ciudad = direccion.split(",")[0].trim();
        await handleFetchWeather(ciudad, "");
      } catch (error) {
        await handleFetchWeather(DEFAULT_CITY, "");
      } finally {
        setLoading(false);
      }
    };
    getLocationAndWeather();
  }, []);


  useEffect(() => {
    if (location.state?.showLogin) {
      setShowAuthModal(true);
      setIsLogin(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.showLogin]);

  
  
  const handleFetchWeather = async (cityName: string, countryName: string) => {
    setLoading(true);
    setError("");
    try {
      const weatherData = await fetchWeather(cityName, countryName);
      setWeather(weatherData);
      const forecastData = await fetchForecast(weatherData.name);
      setForecast(forecastData);
      
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

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
  };

  const refrescarUbicacion = async () => {
    try {
      setLoading(true);
      setError("");
      const ubicacion = await Geolocalizar();
      setUserCoords([ubicacion.lat, ubicacion.lon]);

      const direccionCompleta = await reverseGeocode(ubicacion.lat, ubicacion.lon);
      const ciudad = direccionCompleta.split(",")[0].trim();

      await handleFetchWeather(ciudad, "");
    } catch (err) {
      setError("No se pudo obtener la ubicación");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <img 
            src="/images/logo.png" 
            alt="Weather App Logo" 
            className="navbar-logo"
          />
        </div>
        
        <div className="navbar-actions">
          <button 
            className="btn-login" 
            onClick={() => {
              if (isAuthenticated) {
                authService.logout();
                setIsAuthenticated(false);
                window.location.reload();
              } else {
                setShowAuthModal(true);
                setIsLogin(true);
              }
            }}
          >
            {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </button>
          {isAuthenticated && (
            <button 
              className="btn-profile"
              onClick={() => {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                  const user = JSON.parse(userStr);
                  window.location.href = `/user/${user.id}`;
                } else {
                  window.location.href = '/dashboard';
                }
              }}
            >
              Mi Perfil
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section con información del clima */}
      <div className="hero-section">
        <div className="weather-card">
          <h1>
            {weather ? weather.name : "Cargando..."}
          </h1>
          <div className="weather-info">
            <div>
              <p className="day">{dayName}</p>
              <p className="temperature">{weather ? `${Math.round(weather.main.temp)}°C` : "18°C"}</p>
              <p className="date">{dateString}</p>
              {weather && weather.weather && weather.weather[0] && (
                <p className="weather-description">{weather.weather[0].description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SearchBar para clima (siempre visible pero con estilo diferente) */}
      <div className="weather-search-container">
        <SearchBar 
          city={city} 
          setCity={setCity}
          country={country}
          setCountry={setCountry} 
          fetchWeather={handleFetchWeather}
        />
        
        {/* Mostrar carga dentro del mismo bloque */}
        {loading && (
          <div className="loading-message-inline">
            Cargando...
          </div>
        )}
      </div>

      <div className="weather-section weather-section-refresh" style={{ marginTop: '0' }}>
        <div className="center-button" style={{ marginBottom: weather ? '20px' : '0' }}>
          <button
            onClick={refrescarUbicacion}
            className="refresh-location-btn">
            🔄 Refrescar ubicación
          </button>
        </div>
        {error && (
          <p style={{ marginTop: '5px', color: '#e74c3c', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>{error}</p>
        )}
        
        {/* Sección de detalles del clima (visible solo después de buscar) */}
        {weather && (
          <>
            <div className="weather-details-header">
            <h2>{weather.name}</h2>
            <button onClick={() => addFavorite(weather.name)} className="favorite-button">
              Guardar como favorita ⭐
            </button>
          </div>

         <WeatherDetails weather={weather} />

         <div className="panorama-section">
          <div className="panorama-grid">
            <div className="panorama-card">
              <img src="/panorama/futbol.jpg" alt="Fútbol" />
            </div>
            <div className="panorama-card">
              <img src="/panorama/trote.jpg" alt="Trote" />
            </div>
            <div>

              <h2 className="panorama-title">¡Planifica tus días según el clima!</h2>

            </div>
            <div className="panorama-card">
              <img src="/panorama/auto.jpg" alt="Auto" />
            </div>
            <div className="panorama-card">
              <img src="/panorama/caafe.jpg" alt="Café" />
            </div>
          </div>
        </div>

          {forecast && <ForecastGrid forecast={forecast} />}
          
          <MapView weather={weather} userCoords={userCoords} />


          <div className="weather-favorites-container">
          <FavoritesList
              favorites={favorites}
              fetchWeather={(cityName) => handleFetchWeather(cityName, "")}
              removeFavorite={removeFavorite}
           />
          </div>
          </>
        )}
      </div>



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

      <div className="registration-section">
        <h2>¿Aún no tienes una cuenta?</h2>
        <button 
          className="register-cta-button"
          onClick={() => {
            if (isAuthenticated) {
              navigate('/');
            } else {
              navigate('/register');
            }
          }}
        >
          {isAuthenticated ? 'Volver al Inicio' : '¡Regístrate Aquí!'}
        </button>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-brand">¿Quieres saber quiénes somos y más sobre nosotros?.... ¡Contáctanos!</div>
          <div className="footer-links">
            <div className="footer-column">
              <p className="footer-title">Telefono(s)</p>
              <p>(41) 64536...</p>
              <p>(+56) 967584...</p>
              <p>(+56) 965745...</p>
            </div>
            <div className="footer-column">
              <p className="footer-title">Correos y contactos</p>
              <p>correoConsultas@...</p>
              <p>correoTrabajo@...</p>
              <p>Whatsaap 98464..</p>
            </div>
            <div className="footer-column">
              <p className="footer-title">Visita nuestras redes sociales</p>
              <p>@instragram...</p>
              <p>@facebook...</p>
              <p>@twitter...</p>
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

      {showAuthModal && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAuthModal(false);
            }
          }}
        >
          <div className="modal-content">
            <button 
              className="modal-close" 
              onClick={() => setShowAuthModal(false)}
            >
              ×
            </button>
            <LoginForm 
              onSuccess={(userId) => {
                setShowAuthModal(false);
                setIsAuthenticated(true);
                window.location.href = `/user/${userId}`;
              }}
              onToggleForm={toggleAuthForm} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;