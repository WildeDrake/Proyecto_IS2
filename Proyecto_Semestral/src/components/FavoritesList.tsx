import React from "react";
import '../styles/FavoritesList.css';

interface FavoritesListProps {
  favorites: string[];
  removeFavorite: (city: string) => void;
  fetchWeather: (cityName: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, removeFavorite, fetchWeather }) => (
  <div className="favorites-list">
    {favorites.length > 0 && (
      <div className="mt-6">
        <h3 className="font-semibold mb-2">⭐ Ciudades favoritas</h3>
        <ul className="space-y-1">
          {favorites.map((fav) => (
            <li key={fav} className="flex justify-between">
              <span
                className="cursor-pointer text-blue-600 underline"
                onClick={() => fetchWeather(fav)}
              >
                {fav}
              </span>
              <button
                className="text-red-500 text-sm"
                onClick={() => removeFavorite(fav)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default FavoritesList;