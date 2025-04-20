const API_KEY = "TU_API_KEY_AQUI";

export const fetchWeather = async (cityName: string) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error("Ciudad no encontrada");
  return await res.json();
};

export const fetchForecast = async (cityName: string) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
  );
  return await res.json();
};
