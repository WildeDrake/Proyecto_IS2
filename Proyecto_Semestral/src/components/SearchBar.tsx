import React from "react";
import '../styles/SearchBar.css';

interface SearchBarProps {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  fetchWeather: (cityName: string, countryName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ city, setCity, country, setCountry, fetchWeather }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Buscar ciudad"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
    <input
      type="text"
      placeholder="Buscar país (código ISO, ej: US, CL)"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
    />
    <button onClick={() => fetchWeather(city, country)}>
      Buscar
    </button>
  </div>
);

export default SearchBar;