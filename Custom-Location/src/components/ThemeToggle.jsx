import { useLocation } from '../context/LocationContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useLocation();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}