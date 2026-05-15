const FAVORITES_KEY = 'custom_location_favorites';
const RECENT_KEY = 'custom_location_recent';
const THEME_KEY = 'custom_location_theme';

export const getFavorites = () => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFavorite = (location) => {
  const favorites = getFavorites();
  const exists = favorites.find(f => f.lat === location.lat && f.lng === location.lng);
  if (!exists) {
    favorites.unshift({ ...location, id: Date.now(), savedAt: new Date().toISOString() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, 20)));
  }
};

export const removeFavorite = (id) => {
  const favorites = getFavorites().filter(f => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const getRecentLocations = () => {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentLocation = (location) => {
  const recent = getRecentLocations();
  const exists = recent.find(r => r.lat === location.lat && r.lng === location.lng);
  if (exists) {
    recent.splice(recent.indexOf(exists), 1);
  }
  recent.unshift({ ...location, sharedAt: new Date().toISOString() });
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 10)));
};

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const generateMapsUrl = (lat, lng) => {
  return `https://maps.google.com/?q=${lat},${lng}`;
};

export const generateStaticMapUrl = (lat, lng) => {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=200x200&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
};