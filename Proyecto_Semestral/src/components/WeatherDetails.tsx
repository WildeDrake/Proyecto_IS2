import React, { useEffect, useState } from "react";
import { WeatherData } from "../types/weather";
import { recommendationService, UnifiedRecommendations } from "../services/recommendationService";
import RecommendationCard from "./RecommendationCard";
import useFavorites from "../hooks/useFavorites";
import { fetchWeather } from "../services/weatherService";
import '../styles/WeatherDetails.css';

const WeatherDetails: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  const [recommendations, setRecommendations] = useState<UnifiedRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { favorites} = useFavorites();
  const [favoriteRecommendations, setFavoriteRecommendations] = useState<
    { city: string; recommendations: UnifiedRecommendations }[]
  >([]);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const unifiedRecommendations = await recommendationService.getUnifiedRecommendations(weather);
        setRecommendations(unifiedRecommendations);
      } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
        setError("Error al cargar las recomendaciones. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecomendaciones();
  }, [weather]);

  useEffect(() => {
    const cargarRecomendacionesFavoritas = async () => {
      const results = await Promise.all(
        favorites.map(async (city) => {
          try {
            const weatherData = await fetchWeather(city, "");
            const recommendations = await recommendationService.getUnifiedRecommendations(weatherData);
            return { city, recommendations };
          } catch (error) {
            console.error(`Error al obtener recomendaciones para ${city}`, error);
            return null;
          }
        })
      );
      setFavoriteRecommendations(results.filter(Boolean) as typeof favoriteRecommendations);
    };

    if (favorites.length > 0) {
      cargarRecomendacionesFavoritas();
    } else {
      setFavoriteRecommendations([]); // limpiar si se vacía
    }
  }, [favorites]);
    
  if (isLoading) {
    return (
      <div className="flex gap-4 items-start">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Icono del clima"
        />
        <div className="weather-recommendations">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando recomendaciones inteligentes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-4 items-start">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Icono del clima"
        />
        <div className="weather-recommendations">
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start">
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Icono del clima"
      />
      <div className="weather-recommendations">
        <p className="capitalize">{weather.weather[0].description}</p>
        <p className="text-2xl font-bold">
          La temperatura actual es de: {Math.round(weather.main.temp)}°C
        </p>
        <p>La humedad actual es de: {weather.main.humidity}%</p>
        <p>Velocidad del viento: {weather.wind.speed} m/s</p>

        {/* Contexto climático mejorado */}
        {recommendations?.weatherContext && (
          <div className="weather-context">
            <div className="context-indicators">
              <span className="comfort-indicator">
                🌡️ Índice de confort: {(recommendations.weatherContext.comfortIndex * 100).toFixed(0)}%
              </span>
              {recommendations.weatherContext.rainProbability > 0.3 && (
                <span className="rain-indicator">
                  🌧️ Probabilidad de lluvia: {(recommendations.weatherContext.rainProbability * 100).toFixed(0)}%
                </span>
              )}
              <span className="time-indicator">
                ⏰ {getTimeOfDayText(recommendations.weatherContext.timeOfDay)}
              </span>
            </div>
          </div>
        )}

        {/* Actividades Personalizadas (formato anterior) */}
        {recommendations?.isPersonalized && (
          <div className="recommendations-personalized">
            <h3>🌟 Recomendaciones Personalizadas</h3>
            {(() => {
              const personalizedActivities = recommendations.recommendations.filter(r => r.type === 'personalized');
              const baseRecommendation = recommendations.recommendations.find(r => r.type === 'base');
              
              if (personalizedActivities.length > 0) {
                return (
                  <>
                    {baseRecommendation && <h4>{baseRecommendation.text}</h4>}
                    <div className="actividad-grid">
                      {personalizedActivities.map((activity, index) => (
                        <div className="actividad-card" key={activity.id}>
                          <span className="tooltip">
                            <div>Actividad personalizada según tus intereses</div>
                            <div><strong>Razón:</strong> {activity.reason}</div>
                            {activity.weatherFactors.length > 0 && (
                              <div><strong>Factores:</strong> {activity.weatherFactors.map(f => getFactorTranslation(f)).join(', ')}</div>
                            )}
                          </span>
                          <strong>{activity.text.split(' - ')[0]}</strong>
                        </div>
                      ))}
                    </div>
                  </>
                );
              } else {
                return <p><strong>Sin coincidencias:</strong> Ninguna actividad coincide con las condiciones actuales. ¡Pero aún puedes disfrutar tu día! 🌈</p>;
              }
            })()}
          </div>
        )}

        {/* Actividades Personalizadas desde Ubicaciones Favoritas (agrupadas) */}
        {favoriteRecommendations.length > 0 && (
          <div className="recommendations-personalized">
            <h3>🌍 Actividades desde tus Ubicaciones Favoritas</h3>
            {(() => {
              const actividadMap = new Map<string, {
                razones: string[],
                ubicaciones: string[],
                factores: Set<string>
              }>();

              // Recolectar y agrupar actividades por texto base
              favoriteRecommendations.forEach(({ city, recommendations }) => {
                const personalizadas = recommendations.recommendations.filter(r => r.type === 'personalized');

                personalizadas.forEach((activity) => {
                  const nombreBase = activity.text.split(' - ')[0];
                  if (!actividadMap.has(nombreBase)) {
                    actividadMap.set(nombreBase, {
                      razones: [activity.reason],
                      ubicaciones: [city],
                      factores: new Set(activity.weatherFactors)
                    });
                  } else {
                    const entry = actividadMap.get(nombreBase)!;
                    entry.razones.push(activity.reason);
                    entry.ubicaciones.push(city);
                    activity.weatherFactors.forEach(f => entry.factores.add(f));
                  }
                });
              });

              if (actividadMap.size === 0) {
                return <p>No hay actividades personalizadas para tus ubicaciones favoritas.</p>;
              }

              return (
                <div className="actividad-grid">
                  {[...actividadMap.entries()].map(([nombreBase, data]) => (
                    <div key={nombreBase} className="actividad-card">
                      <span className="tooltip">
                        <div><strong>Descripción:</strong> {data.razones.join('; ')}</div>
                        <div><strong>Ubicaciones:</strong> {data.ubicaciones.join(', ')}</div>
                        {data.factores.size > 0 && (
                          <div><strong>Factores:</strong> {[...data.factores].map(getFactorTranslation).join(', ')}</div>
                        )}
                      </span>
                      <strong>{nombreBase}</strong>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}


        {/* Recomendaciones Generales */}
        {(() => {
          const generalRecommendations = recommendations?.recommendations.filter(r => r.type !== 'personalized') || [];
          if (generalRecommendations.length > 0) {
            return (
              <div className="recommendations-general">
                <h3>📋 Recomendaciones Generales</h3>
                <ul>
                  {generalRecommendations.map((reco) => (
                    <li key={reco.id}>{reco.text}</li>
                  ))}
                </ul>
              </div>
            );
          }
          return null;
        })()}

        {/* Mensaje cuando no hay recomendaciones */}
        {recommendations && recommendations.recommendations.length === 0 && (
          <div className="no-recommendations">
            <p>🌈 No hay recomendaciones específicas para las condiciones actuales, ¡pero aún puedes disfrutar tu día!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const getTimeOfDayText = (timeOfDay: string): string => {
  const timeTexts = {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
    night: 'Buenas noches'
  };
  
  return timeTexts[timeOfDay as keyof typeof timeTexts] || 'Buen día';
};

const getFactorTranslation = (factor: string): string => {
  const translations: Record<string, string> = {
    'temperature': 'Temperatura',
    'humidity': 'Humedad',
    'wind': 'Viento',
    'visibility': 'Visibilidad',
    'weather_condition': 'Condición climática',
    'user_interests': 'Intereses personales'
  };
  
  return translations[factor] || factor;
};

export default WeatherDetails;
