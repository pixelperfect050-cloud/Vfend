import { useState, useCallback } from 'react';
import { useLocation } from '../context/LocationContext';

export default function SearchBar({ onPlaceSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { setLocation, setAddress, setLoading } = useLocation();

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSelectPlace = (place) => {
    setQuery(place.display_name);
    setShowResults(false);
    setLoading(true);

    const coords = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    };
    
    setLocation(coords);
    setAddress(place.display_name);
    setLoading(false);
    onPlaceSelect?.(coords);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search places..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            ✕
          </button>
        )}
      </div>
      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 16,
          right: 16,
          background: 'var(--bg-light)',
          borderRadius: 12,
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          zIndex: 20,
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          {results.map((result) => (
            <div
              key={result.place_id}
              onClick={() => handleSelectPlace(result)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--surface-light)',
                transition: 'background 0.2s',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--surface-light)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {result.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}