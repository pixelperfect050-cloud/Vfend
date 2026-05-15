import { useRef, useCallback, useState, useEffect } from 'react';
import { LocationProvider, useLocation } from './context/LocationContext';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import BottomSheet from './components/BottomSheet';
import ShareButton from './components/ShareButton';
import ZoomControls from './components/ZoomControls';
import ThemeToggle from './components/ThemeToggle';
import './index.css';

function AppContent() {
  const mapRef = useRef(null);
  const { setLocation, setAddress, setLoading } = useLocation();
  const [mapError, setMapError] = useState(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setAppReady(true), 100);
  }, []);

  const handleMapClick = useCallback((coords) => {
    setLocation(coords);
    setAddress('');
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, [setLocation, setAddress, setLoading]);

  const handlePlaceSelect = useCallback((coords) => {
    setLocation(coords);
  }, [setLocation]);

  const handleShare = useCallback((url) => {
    console.log('Shared:', url);
  }, []);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  }, []);

  const handleMapError = (error) => {
    setMapError(error);
  };

  if (mapError) {
    return (
      <div className="app-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        height: '100%',
        padding: 20,
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: 20, 
          padding: 30, 
          textAlign: 'center',
          maxWidth: 320,
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ color: '#333', marginBottom: 16 }}>Map Loading Issue</h2>
          <p style={{ color: '#666', marginBottom: 16 }}>
            {mapError}
          </p>
          <p style={{ color: '#888', fontSize: 14 }}>
            Please ensure:<br/>
            1. Internet is connected<br/>
            2. Google Maps API is enabled<br/>
            3. Wait 2-3 mins after enabling API
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: '12px 24px',
              background: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <MapComponent onMapClick={handleMapClick} mapRef={mapRef} onError={handleMapError} />
      <SearchBar onPlaceSelect={handlePlaceSelect} />
      <ThemeToggle />
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      <ShareButton onShare={handleShare} />
      <BottomSheet />
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <AppContent />
    </LocationProvider>
  );
}