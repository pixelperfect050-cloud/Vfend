import { useState, useEffect } from 'react';
import { useLocation } from '../context/LocationContext';
import { generateMapsUrl } from '../utils/storage';

export default function BottomSheet() {
  const { selectedLocation, address, favorites, recent, isBottomSheetOpen, toggleBottomSheet, addFavorite, removeFavoriteById, selectFavorite } = useLocation();
  const [activeTab, setActiveTab] = useState('preview');
  const [localAddress, setLocalAddress] = useState('');

  useEffect(() => {
    if (selectedLocation && !address) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) {
            setLocalAddress(data.display_name);
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    }
  }, [selectedLocation, address]);

  const handleCopyLink = () => {
    if (selectedLocation) {
      const url = generateMapsUrl(selectedLocation.lat, selectedLocation.lng);
      navigator.clipboard.writeText(url);
    }
  };

  const handleOpenInMaps = () => {
    if (selectedLocation) {
      const url = generateMapsUrl(selectedLocation.lat, selectedLocation.lng);
      window.open(url, '_blank');
    }
  };

  const displayAddress = address || localAddress;

  if (!selectedLocation) return null;

  return (
    <div className={`bottom-sheet ${!isBottomSheetOpen ? 'collapsed' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="bottom-sheet-handle" onClick={() => toggleBottomSheet()}></div>
      <div className="tabs">
        <button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
        <button className={`tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>Favorites</button>
        <button className={`tab ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>Recent</button>
      </div>
      {activeTab === 'preview' && (
        <div className="bottom-sheet-content">
          <div className="location-preview">
            <div style={{
              width: 100,
              height: 100,
              borderRadius: 12,
              background: 'var(--surface-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}>
              📍
            </div>
            <div className="location-info">
              <h3>{displayAddress || 'Selected Location'}</h3>
              <p>Lat: {selectedLocation.lat.toFixed(6)}</p>
              <p>Lng: {selectedLocation.lng.toFixed(6)}</p>
            </div>
          </div>
          <div className="location-actions">
            <button className="action-btn primary" onClick={() => addFavorite(selectedLocation)}>
              ⭐ Save to Favorites
            </button>
            <button className="action-btn" onClick={handleCopyLink}>
              📋 Copy Link
            </button>
            <button className="action-btn" onClick={handleOpenInMaps}>
              🗺️ Open in Maps
            </button>
          </div>
        </div>
      )}
      {activeTab === 'favorites' && (
        <div className="locations-list">
          {favorites.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted-light)', padding: 20 }}>No favorites yet</p>
          ) : (
            favorites.map((fav) => (
              <div key={fav.id} className="location-item" onClick={() => selectFavorite(fav)}>
                <div className="location-item-icon">📍</div>
                <div className="location-item-info">
                  <h4>{fav.address || 'Saved Location'}</h4>
                  <p>{fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}</p>
                </div>
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); removeFavoriteById(fav.id); }}>🗑️</button>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === 'recent' && (
        <div className="locations-list">
          {recent.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted-light)', padding: 20 }}>No recent locations</p>
          ) : (
            recent.map((rec, idx) => (
              <div key={idx} className="location-item" onClick={() => selectFavorite(rec)}>
                <div className="location-item-icon">🕐</div>
                <div className="location-item-info">
                  <h4>{rec.address || 'Shared Location'}</h4>
                  <p>{rec.lat.toFixed(4)}, {rec.lng.toFixed(4)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}