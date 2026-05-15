import { createContext, useContext, useReducer, useEffect } from 'react';
import { getFavorites, getRecentLocations, getTheme, saveFavorite, removeFavorite, addRecentLocation, setTheme } from '../utils/storage';

const LocationContext = createContext();

const initialState = {
  selectedLocation: null,
  address: '',
  favorites: [],
  recent: [],
  theme: 'light',
  isLoading: false,
  isBottomSheetOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, selectedLocation: action.payload, isBottomSheetOpen: true };
    case 'SET_ADDRESS':
      return { ...state, address: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [action.payload, ...state.favorites] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(f => f.id !== action.payload) };
    case 'SET_RECENT':
      return { ...state, recent: action.payload };
    case 'ADD_RECENT':
      return { ...state, recent: [action.payload, ...state.recent.filter(r => r.lat !== action.payload.lat || r.lng !== action.payload.lng)] };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_BOTTOM_SHEET':
      return { ...state, isBottomSheetOpen: action.payload ?? !state.isBottomSheetOpen };
    case 'CLEAR_SELECTION':
      return { ...state, selectedLocation: null, address: '', isBottomSheetOpen: false };
    default:
      return state;
  }
}

export function LocationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_FAVORITES', payload: getFavorites() });
    dispatch({ type: 'SET_RECENT', payload: getRecentLocations() });
    const theme = getTheme();
    dispatch({ type: 'SET_THEME', payload: theme });
    document.body.classList.toggle('dark', theme === 'dark');
  }, []);

  const setLocation = (location) => dispatch({ type: 'SET_LOCATION', payload: location });
  const setAddress = (address) => dispatch({ type: 'SET_ADDRESS', payload: address });
  const setLoading = (isLoading) => dispatch({ type: 'SET_LOADING', payload: isLoading });
  const toggleBottomSheet = (isOpen) => dispatch({ type: 'TOGGLE_BOTTOM_SHEET', payload: isOpen });
  const clearSelection = () => dispatch({ type: 'CLEAR_SELECTION' });

  const addFavorite = (location) => {
    saveFavorite(location);
    dispatch({ type: 'ADD_FAVORITE', payload: { ...location, id: Date.now(), savedAt: new Date().toISOString() } });
  };

  const removeFavoriteById = (id) => {
    removeFavorite(id);
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const addToRecent = (location) => {
    addRecentLocation(location);
    dispatch({ type: 'ADD_RECENT', payload: { ...location, sharedAt: new Date().toISOString() } });
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    dispatch({ type: 'SET_THEME', payload: newTheme });
    document.body.classList.toggle('dark', newTheme === 'dark');
  };

  const selectFavorite = (fav) => {
    setLocation({ lat: fav.lat, lng: fav.lng });
  };

  return (
    <LocationContext.Provider value={{
      ...state,
      setLocation,
      setAddress,
      setLoading,
      toggleBottomSheet,
      clearSelection,
      addFavorite,
      removeFavoriteById,
      addToRecent,
      toggleTheme,
      selectFavorite,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);