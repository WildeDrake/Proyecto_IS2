import { WeatherData } from '../types/weather';
import { getRecoBase } from '../utils/RecoBase';
import { getRecoGenerica } from '../utils/recoGenerica';
import { getActRecomendadas } from '../utils/recoDb';
import { fetchForecast } from './weatherService';

export interface RecommendationWithScore {
  id: string;
  text: string;
  score: number;
  type: 'base' | 'generic' | 'personalized';
  category: 'outdoor' | 'indoor' | 'sport' | 'general';
  reason: string;
  timeRelevant: boolean;
  weatherFactors: string[];
}

export interface UnifiedRecommendations {
  recommendations: RecommendationWithScore[];
  weatherContext: {
    current: WeatherData;
    forecast: any;
    comfortIndex: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    rainProbability: number;
  };
  isPersonalized: boolean;
}

export class RecommendationService {
  private static instance: RecommendationService;
  private cachedRecommendations: Map<string, { data: UnifiedRecommendations; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  public static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  public async getUnifiedRecommendations(weather: WeatherData): Promise<UnifiedRecommendations> {
    const cacheKey = `${weather.name}_${weather.coord.lat}_${weather.coord.lon}`;
    
    // Verificar cache
    const cached = this.cachedRecommendations.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const forecastData = await fetchForecast(weather.name);
      const weatherContext = this.buildWeatherContext(weather, forecastData);
      const condiciones = this.buildConditions(weather, weatherContext);

      // Almacenar el contexto actual para el filtrado inteligente
      this.currentWeatherData = weather;
      this.currentRainProbability = weatherContext.rainProbability;

      const token = localStorage.getItem("token");
      const isPersonalized = !!token;

      const recommendations: RecommendationWithScore[] = [];

      // Obtener recomendaciones base
      const baseReco = await getRecoBase(condiciones);
      if (baseReco && baseReco !== 'No hay recomendación disponible para las condiciones actuales.') {
        recommendations.push(this.createRecommendation(
          'base-1',
          baseReco,
          'base',
          this.categorizeRecommendation(baseReco),
          'Basado en condiciones climáticas actuales',
          ['temperature', 'weather_condition'],
          weatherContext,
          8.0
        ));
      }

      // Obtener recomendaciones genéricas
      const genericRecos = await this.getGenericRecommendations(condiciones, weatherContext);
      recommendations.push(...genericRecos);

      // Obtener recomendaciones personalizadas (si está logueado)
      if (isPersonalized) {
        const personalizedRecos = await this.getPersonalizedRecommendations(condiciones, weatherContext);
        recommendations.push(...personalizedRecos);
      }

      // Filtrar duplicados y ordenar por puntuación
      const uniqueRecommendations = this.removeDuplicates(recommendations);
      const sortedRecommendations = this.sortAndFilterRecommendations(uniqueRecommendations);

      const result: UnifiedRecommendations = {
        recommendations: sortedRecommendations,
        weatherContext,
        isPersonalized
      };

      // Guardar en cache
      this.cachedRecommendations.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Error al obtener recomendaciones unificadas:', error);
      
      // Retornar estructura básica en caso de error
      return {
        recommendations: [],
        weatherContext: {
          current: weather,
          forecast: null,
          comfortIndex: this.calculateComfortIndex(weather.main.temp, weather.main.humidity),
          timeOfDay: this.getTimeOfDay(),
          rainProbability: 0
        },
        isPersonalized: false
      };
    }
  }

  private buildWeatherContext(weather: WeatherData, forecastData: any) {
    const rainProbability = this.calculateRainProbability(forecastData);
    const comfortIndex = this.calculateComfortIndex(weather.main.temp, weather.main.humidity);
    const timeOfDay = this.getTimeOfDay();

    return {
      current: weather,
      forecast: forecastData,
      comfortIndex,
      timeOfDay,
      rainProbability
    };
  }

  private buildConditions(weather: WeatherData, weatherContext: any) {
    return {
      weather_main: weather.weather[0].main,
      temp: weather.main.temp,
      viento: weather.wind.speed,
      humedad: weather.main.humidity,
      visibilidad: weather.visibility ?? 10000,
      lluvia: weatherContext.rainProbability >= 0.4,
    };
  }

  private async getGenericRecommendations(condiciones: any, weatherContext: any): Promise<RecommendationWithScore[]> {
    const recommendations: RecommendationWithScore[] = [];
    let index = 0;

    const genericTypes = [
      { type: 'weather_main', value: condiciones.weather_main, factor: 'weather_condition' },
      { type: 'temp', value: condiciones.temp, factor: 'temperature' },
      { type: 'humidity', value: condiciones.humedad, factor: 'humidity' },
      { type: 'wind_speed', value: condiciones.viento, factor: 'wind' },
      { type: 'visibility', value: condiciones.visibilidad, factor: 'visibility' }
    ];

    for (const { type, value, factor } of genericTypes) {
      const reco = await getRecoGenerica(type, value);
      if (reco) {
        recommendations.push(this.createRecommendation(
          `generic-${index++}`,
          reco,
          'generic',
          this.categorizeRecommendation(reco),
          `Recomendación basada en ${this.translateFactor(factor)}`,
          [factor],
          weatherContext,
          this.calculateGenericScore(type, value, weatherContext)
        ));
      }
    }

    return recommendations;
  }

  private async getPersonalizedRecommendations(condiciones: any, weatherContext: any): Promise<RecommendationWithScore[]> {
    const recommendations: RecommendationWithScore[] = [];
    
    try {
      const actividades = await getActRecomendadas(condiciones);
      
      actividades.forEach((act: any, index: number) => {
        const score = this.calculatePersonalizedScore(act, condiciones, weatherContext);
        
        recommendations.push(this.createRecommendation(
          `personalized-${index}`,
          act.name,
          'personalized',
          this.categorizeActivity(act),
          `Actividad personalizada que coincide con tus intereses y las condiciones actuales`,
          ['user_interests', 'temperature', 'weather_condition'],
          weatherContext,
          score,
          act
        ));
      });
    } catch (error) {
      console.error('Error al obtener recomendaciones personalizadas:', error);
    }

    return recommendations;
  }

  private createRecommendation(
    id: string,
    text: string,
    type: 'base' | 'generic' | 'personalized',
    category: 'outdoor' | 'indoor' | 'sport' | 'general',
    reason: string,
    weatherFactors: string[],
    weatherContext: any,
    score: number,
    activity?: any
  ): RecommendationWithScore {
    return {
      id,
      text: activity ? `${activity.name}${activity.descripcion ? ` - ${activity.descripcion}` : ''}` : text,
      score,
      type,
      category,
      reason,
      timeRelevant: this.isTimeRelevant(text, weatherContext.timeOfDay),
      weatherFactors
    };
  }

  private calculateRainProbability(forecastData: any): number {
    if (!forecastData?.list) return 0;
    
    const bloques = forecastData.list.slice(0, 2);
    const totalPop = bloques.reduce((acc: number, bloque: any) => acc + (bloque.pop ?? 0), 0);
    return totalPop / bloques.length;
  }

  private calculateComfortIndex(temp: number, humidity: number): number {
    // Índice de confort basado en temperatura y humedad
    const idealTemp = 22; // Temperatura ideal en °C
    const idealHumidity = 50; // Humedad ideal en %
    
    const tempFactor = Math.max(0, 1 - Math.abs(temp - idealTemp) / 20);
    const humidityFactor = Math.max(0, 1 - Math.abs(humidity - idealHumidity) / 50);
    
    return (tempFactor + humidityFactor) / 2;
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  private calculateGenericScore(type: string, value: any, weatherContext: any): number {
    let baseScore = 6.0;
    
    // Ajustar puntuación según relevancia del contexto
    if (type === 'temp') {
      baseScore += weatherContext.comfortIndex * 2;
    }
    
    if (type === 'weather_main' && weatherContext.rainProbability > 0.3) {
      baseScore += 1.0;
    }
    
    return Math.min(baseScore, 10.0);
  }

  private calculatePersonalizedScore(activity: any, condiciones: any, weatherContext: any): number {
    let score = 9.0; // Las recomendaciones personalizadas tienen prioridad alta
    
    // Bonus por condiciones perfectas
    const tempOptimal = (condiciones.temp >= activity.temp_min + 2 && 
                        condiciones.temp <= activity.temp_max - 2);
    if (tempOptimal) score += 0.5;
    
    // Bonus por índice de confort
    score += weatherContext.comfortIndex;
    
    // Penalty por condiciones límite
    if (condiciones.temp === activity.temp_min || condiciones.temp === activity.temp_max) {
      score -= 0.3;
    }
    
    return Math.min(score, 10.0);
  }

  private categorizeRecommendation(text: string): 'outdoor' | 'indoor' | 'sport' | 'general' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('interior') || lowerText.includes('casa') || lowerText.includes('refugio')) {
      return 'indoor';
    }
    
    if (lowerText.includes('deporte') || lowerText.includes('ejercicio') || lowerText.includes('correr')) {
      return 'sport';
    }
    
    if (lowerText.includes('exterior') || lowerText.includes('aire libre') || lowerText.includes('parque')) {
      return 'outdoor';
    }
    
    return 'general';
  }

  private categorizeActivity(activity: any): 'outdoor' | 'indoor' | 'sport' | 'general' {
    const name = activity.name?.toLowerCase() || '';
    
    const sportActivities = ['ciclismo', 'futbol', 'trotar', 'correr', 'gimnasio', 'boxeo', 'natación'];
    const outdoorActivities = ['senderismo', 'escalada', 'surf', 'fotografía', 'jardinería'];
    const indoorActivities = ['yoga', 'bailar'];
    
    if (sportActivities.some(sport => name.includes(sport))) return 'sport';
    if (outdoorActivities.some(outdoor => name.includes(outdoor))) return 'outdoor';
    if (indoorActivities.some(indoor => name.includes(indoor))) return 'indoor';
    
    return 'general';
  }

  private isTimeRelevant(text: string, timeOfDay: string): boolean {
    const lowerText = text.toLowerCase();
    
    const timeKeywords = {
      morning: ['mañana', 'amanecer', 'desayuno'],
      afternoon: ['tarde', 'mediodía', 'almuerzo'],
      evening: ['noche', 'atardecer', 'cena'],
      night: ['noche', 'dormir', 'descanso']
    };
    
    return timeKeywords[timeOfDay as keyof typeof timeKeywords]?.some(keyword => 
      lowerText.includes(keyword)
    ) ?? false;
  }

  private translateFactor(factor: string): string {
    const translations: Record<string, string> = {
      'temperature': 'temperatura',
      'humidity': 'humedad',
      'wind': 'viento',
      'visibility': 'visibilidad',
      'weather_condition': 'condición climática',
      'user_interests': 'intereses del usuario'
    };
    
    return translations[factor] || factor;
  }

  private removeDuplicates(recommendations: RecommendationWithScore[]): RecommendationWithScore[] {
    const seen = new Set<string>();
    const unique: RecommendationWithScore[] = [];
    
    for (const reco of recommendations) {
      const key = reco.text.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(reco);
      }
    }
    
    return unique;
  }

  private sortAndFilterRecommendations(recommendations: RecommendationWithScore[]): RecommendationWithScore[] {
    // Filtrar recomendaciones contradictorias o irrelevantes
    const intelligentFiltered = this.filterContradictoryRecommendations(recommendations);
    
    // Ordenar por puntuación descendente
    const sorted = intelligentFiltered.sort((a, b) => b.score - a.score);
    
    // Limitar a las mejores 10 recomendaciones
    return sorted.slice(0, 10);
  }

  private filterContradictoryRecommendations(recommendations: RecommendationWithScore[]): RecommendationWithScore[] {
    if (!recommendations.length) return [];
    
    // Obtener las condiciones climáticas actuales de la primera recomendación
    const contextualData = this.getContextualData();
    
    return recommendations.filter(reco => {
      const text = reco.text.toLowerCase();
      
      // Filtrar recomendaciones de temperatura contradictorias
      if (this.isTemperatureContradictory(text, contextualData.temp)) {
        return false;
      }
      
      // Filtrar recomendaciones de humedad contradictorias
      if (this.isHumidityContradictory(text, contextualData.humidity)) {
        return false;
      }
      
      // Filtrar recomendaciones de viento contradictorias
      if (this.isWindContradictory(text, contextualData.windSpeed)) {
        return false;
      }
      
      // Filtrar recomendaciones de lluvia contradictorias
      if (this.isRainContradictory(text, contextualData.rainProbability)) {
        return false;
      }
      
      return true;
    });
  }

  private getContextualData() {
    // Esta función obtiene los datos contextuales actuales
    // En una implementación real, esto vendría del estado actual del weather
    return {
      temp: this.currentWeatherData?.main.temp || 20,
      humidity: this.currentWeatherData?.main.humidity || 50,
      windSpeed: this.currentWeatherData?.wind.speed || 5,
      rainProbability: this.currentRainProbability || 0
    };
  }

  private isTemperatureContradictory(text: string, currentTemp: number): boolean {
    // Temperatura actual vs recomendaciones
    if (currentTemp < 10) {
      // Hace frío
      return text.includes('hace mucho calor') || 
             text.includes('usa ropa ligera') ||
             text.includes('calor y humedad');
    } else if (currentTemp > 30) {
      // Hace calor
      return text.includes('hace frío') || 
             text.includes('abrígate bien') ||
             text.includes('medianamente helada') ||
             text.includes('evita ropa ligera');
    } else if (currentTemp >= 10 && currentTemp <= 20) {
      // Temperatura fresca
      return text.includes('hace mucho calor') || 
             text.includes('usa ropa ligera') ||
             (text.includes('hace frío') && !text.includes('medianamente'));
    }
    
    return false;
  }

  private isHumidityContradictory(text: string, currentHumidity: number): boolean {
    if (currentHumidity < 40) {
      // Aire seco
      return text.includes('hace mucho calor y humedad') ||
             text.includes('evita estar fuera mucho tiempo') && text.includes('humedad');
    } else if (currentHumidity > 60) {
      // Aire húmedo
      return text.includes('aire está seco') ||
             text.includes('hidrátate bien') && text.includes('seco');
    }
    
    return false;
  }

  private isWindContradictory(text: string, currentWindSpeed: number): boolean {
    if (currentWindSpeed < 3) {
      // Viento suave
      return text.includes('viento está muy fuerte') ||
             text.includes('viento es extremadamente fuerte') ||
             text.includes('cuidado! el viento');
    } else if (currentWindSpeed > 12) {
      // Viento muy fuerte
      return text.includes('viento está casi calmado') ||
             text.includes('brisa ligera') ||
             text.includes('ideal para caminar');
    }
    
    return false;
  }

  private isRainContradictory(text: string, currentRainProbability: number): boolean {
    if (currentRainProbability < 0.3) {
      // Baja probabilidad de lluvia
      return text.includes('va a llover') ||
             text.includes('lluvia es casi segura') ||
             text.includes('bastante probable que llueva');
    } else if (currentRainProbability > 0.7) {
      // Alta probabilidad de lluvia
      return text.includes('clima está mayormente despejado') ||
             text.includes('excelente día para salir') ||
             text.includes('día soleado');
    }
    
    return false;
  }

  // Variables para almacenar el contexto actual
  private currentWeatherData: any = null;
  private currentRainProbability: number = 0;

  public clearCache(): void {
    this.cachedRecommendations.clear();
  }
}

export const recommendationService = RecommendationService.getInstance();