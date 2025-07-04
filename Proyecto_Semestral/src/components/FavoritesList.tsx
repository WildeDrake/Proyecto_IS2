import React from "react";
import '../styles/FavoritesList.css';

interface FavoritesListProps {
  favorites: string[];
  removeFavorite: (city: string) => void;
  fetchWeather: (cityName: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, removeFavorite, fetchWeather }) => (
  <div className="favorites-list">
    {favorites.length > 0 ? (
      <div className="mt-6">
        <h3 className="font-semibold mb-2">⭐ Ciudades favoritas</h3>
        <ul className="space-y-2">
          {favorites.map((fav) => (
            <li key={fav} className="flex justify-between items-center">
              <span className="text-gray-800">{fav}</span>
              <div className="space-x-2">
                <button
                  className="bg-blue-500 text-white text-sm px-2 py-1 rounded"
                  onClick={() => fetchWeather(fav)}
                >
                  Buscar
                </button>
                <button
                  className="bg-red-500 text-white text-sm px-2 py-1 rounded"
                  onClick={() => removeFavorite(fav)}
                >
                  Quitar
                </button>
              </div>
            </li>

          ))}
        </ul>
      </div>
    ) : (
      <div className="favorites-list-empty">
        No tiene ciudades favoritas agregadas, cabe recalcar que esta funcionalidad solo estará disponible para usuarios registrados.
      </div>
    )}
  </div>
);

export default FavoritesList;