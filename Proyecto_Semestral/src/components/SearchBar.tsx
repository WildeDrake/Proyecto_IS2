import React, { useState } from "react";
import '../styles/SearchBar.css';
import useFavorites from "../hooks/useFavorites";

interface SearchBarProps {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  fetchWeather: (cityName: string, countryName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ city, setCity, country, setCountry, fetchWeather }) => {
  const { favorites , reloadFavorites } = useFavorites();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = favorites.filter(fav =>
    fav.toLowerCase().startsWith(city.toLowerCase())
  );

  const handleSuggestionClick = (cityName: string) => {
    setCity(cityName);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar">
      <div className="input-wrapper input-city">
        <input
          type="text"
          placeholder="Buscar ciudad"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            reloadFavorites();
            setShowSuggestions(true)}}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Permite clic en sugerencias
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {filteredSuggestions.map((fav, index) => (
              <li key={index} onMouseDown ={() => handleSuggestionClick(fav)}>
                {fav}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-wrapper input-country">
        <input
          type="text"
          placeholder="Buscar país (código ISO, ej: US, CL)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <button onClick={() => fetchWeather(city, country)}>
        Buscar
      </button>
    </div>
  );
};

export default SearchBar;
