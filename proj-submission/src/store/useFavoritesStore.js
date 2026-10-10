import { create } from 'zustand';

// Load from localStorage on first run
const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('favorite_doctors');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (ids) => {
  localStorage.setItem('favorite_doctors', JSON.stringify(ids));
};

const useFavoritesStore = create((set, get) => ({
  favoriteIds: loadFavorites(), // array of doctor IDs

  isFavorite: (id) => get().favoriteIds.includes(id),

  toggleFavorite: (id) => {
    const current = get().favoriteIds;
    const updated = current.includes(id)
      ? current.filter((fId) => fId !== id)
      : [...current, id];
    saveFavorites(updated);
    set({ favoriteIds: updated });
  },
}));

export default useFavoritesStore;
