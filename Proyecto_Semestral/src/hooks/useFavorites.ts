import { useState, useEffect } from "react";

const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Recuperar favoritos del almacenamiento local
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Agregar ciudad a favoritos
  const addFavorite = (city: string) => {
    if (!favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Eliminar ciudad de favoritos
  const removeFavorite = (city: string) => {
    const updatedFavorites = favorites.filter((c) => c !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return { favorites, addFavorite, removeFavorite };
};

export default useFavorites;
