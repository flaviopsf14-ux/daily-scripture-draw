import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "favorite-verses";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
