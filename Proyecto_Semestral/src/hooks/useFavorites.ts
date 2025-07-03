import { useState, useEffect } from "react";
import { getFavorites, addFavorite as apiAdd, removeFavorite as apiRemove } from "../services/favorites";

const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await getFavorites();
        setFavorites(favs);
      } catch {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, []);

  const addFavorite = async (city: string) => {
    if (!favorites.includes(city)) {
      await apiAdd(city);
      setFavorites([...favorites, city]);
    }
  };

  const removeFavorite = async (city: string) => {
    await apiRemove(city);
    setFavorites(favorites.filter((c) => c !== city));
  };

  return { favorites, addFavorite, removeFavorite };
};

export default useFavorites;
