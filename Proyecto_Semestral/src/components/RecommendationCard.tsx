import React from 'react';
import { RecommendationWithScore } from '../services/recommendationService';
import '../styles/RecommendationCard.css';

interface RecommendationCardProps {
  recommendation: RecommendationWithScore;
  showDetails?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  showDetails = false 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personalized': return '🌟';
      case 'base': return '🌤️';
      case 'generic': return '📋';
      default: return '💡';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'outdoor': return '🌳';
      case 'indoor': return '🏠';
      case 'sport': return '⚽';
      case 'general': return '📌';
      default: return '📌';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'score-high';
    if (score >= 6) return 'score-medium';
    return 'score-low';
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'personalized': return 'Personalizada';
      case 'base': return 'Básica';
      case 'generic': return 'General';
      default: return 'Recomendación';
    }
  };

  return (
    <div className={`recommendation-card ${recommendation.type}`}>
      <div className="card-header">
        <div className="card-icons">
          <span className="type-icon" title={getTypeName(recommendation.type)}>
            {getTypeIcon(recommendation.type)}
          </span>
        </div>
      </div>
      
      <div className="card-content">
        <h4 className="recommendation-text">{recommendation.text}</h4>
        
        {showDetails && (
          <div className="card-details">
            <p className="recommendation-reason">
              <strong>¿Por qué?</strong> {recommendation.reason}
            </p>
            
            {recommendation.weatherFactors.length > 0 && (
              <div className="weather-factors">
                <strong>Factores considerados:</strong>
                <div className="factor-tags">
                  {recommendation.weatherFactors.map((factor, index) => (
                    <span key={index} className="factor-tag">
                      {getFactorTranslation(factor)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {recommendation.timeRelevant && (
              <div className="time-relevant">
                <span className="time-badge">⏰ Relevante para este momento</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
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

export default RecommendationCard;