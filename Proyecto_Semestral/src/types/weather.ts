export type WeatherData = {
    name: string;
    coord: { lat: number; lon: number };
    main: { temp: number; humidity: number };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
  };
  
  export type ForecastData = {
    list: {
      dt_txt: string;
      main: { temp: number };
      weather: { icon: string; description: string }[];
    }[];
  };