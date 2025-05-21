import React, { useState, useEffect } from 'react';
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
import { Geolocalizar } from "../services/Geolocalizar";
import useFavorites from "../hooks/useFavorites";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

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
  const [country, setCountry] = useState(""); // Nuevo estado para el país
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCountry, setSearchCountry] = useState(""); // Nuevo estado para búsqueda en navbar
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Verificar si hay un token guardado
    return !!localStorage.getItem('token');
  });

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
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

useEffect(() => {
  const getCoords = async () => {
    try {
      const ubicacion = await Geolocalizar(); // Tu función personalizada
      setUserCoords([ubicacion.lat, ubicacion.lon]);
    } catch (error) {
      console.error("No se pudo obtener la ubicación del usuario");
    }
  };
  getCoords();
}, []);


  // Efecto para cargar el clima de la ubicación actual al iniciar
  useEffect(() => {
    const loadLocalWeather = async () => {
      try {
        setLoading(true);
        // Obtener ubicación actual
        // Buscar clima por coordenadas (usaremos la ciudad de "Concepción" como valor inicial)
        await handleFetchWeather("Concepción", "");
      } catch (err) {
        console.error("No se pudo cargar el clima local:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadLocalWeather();
  }, []);

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

  // Manejador de búsqueda para el navbar
  const handleNavbarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleFetchWeather(searchQuery, searchCountry);
    }
  };

  // Función para obtener el clima
  const handleFetchWeather = async (cityName: string, countryName: string) => {
    setLoading(true);
    setError("");
    try {
      const weatherData = await fetchWeather(cityName, countryName);
      setWeather(weatherData);
      console.log("Pronóstico desde LandingPage:", forecast);
      const forecastData = await fetchForecast(weatherData.name);
      setForecast(forecastData);
      setShowWeatherDetails(true);
      
      // Actualizar la temperatura en la tarjeta principal
      // Actualizamos el nombre de la ciudad en caso que sea diferente
      
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

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">Nombre página</div>
        <form className="search-container" onSubmit={handleNavbarSearch}>
          <input 
            type="text" 
            placeholder="Buscar ciudad..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="País (ej: CL, US)" 
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            maxLength={2}
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
        <div className="navbar-actions">
          <button 
            className="btn-login" 
            onClick={() => {
              console.log('Botón clickeado'); // Debug
              if (isAuthenticated) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
              } else {
                setShowAuthModal(true);
                setIsLogin(true);
              }
            }}
          >
            {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </button>
        </div>
      </nav>

      {/* Hero Section con información del clima */}
      <div className="hero-section">
        <div className="weather-card">
          <h1>{weather ? weather.name : "Cargando..."}</h1>
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
      </div>
      
      {/* Mostrar error o carga */}
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {/* Ubicación Actual */}
      <div className="location-container">
        <UbicacionActual />
      </div>

      {/* Sección de detalles del clima (visible solo después de buscar) */}
      {weather && (
        <div className="weather-section">
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
            {isLogin ? (
              <LoginForm 
                onSuccess={() => {
                  handleAuthSuccess();
                  setShowAuthModal(false);
                }} 
                onToggleForm={toggleAuthForm} 
              />
            ) : (
              <RegisterForm 
                onSuccess={() => {
                  handleAuthSuccess();
                  setShowAuthModal(false);
                }} 
                onToggleForm={toggleAuthForm} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;