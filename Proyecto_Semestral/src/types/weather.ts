/* Datos accesibles, de querer más se debe modificar y agregar */
export type WeatherData = {
  name: string;
  coord: { lat: number; lon: number };
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  visibility?: number; 
  rain?: {
    '1h'?: number; // OpenWeatherMap puede dar lluvia en 1h o 3h
    '3h'?: number;
  };
};

export type ForecastData = {
  list: {
    dt_txt: string;
    main: { temp: number };
    weather: { icon: string; description: string; main: string }[];
  }[];
};
