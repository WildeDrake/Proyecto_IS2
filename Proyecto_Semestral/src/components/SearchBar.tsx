import React from "react";
import '../styles/SearchBar.css';

interface SearchBarProps {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  fetchWeather: (cityName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ city, setCity, fetchWeather }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Buscar ciudad"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
    <button onClick={() => fetchWeather(city)}>
      Buscar
    </button>
  </div>
);

export default SearchBar;