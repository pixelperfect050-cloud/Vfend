import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useLocation } from '../context/LocationContext';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [28.6139, 77.209];
const defaultZoom = 12;

function MapEvents({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapCenterUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ onMapClick, mapRef, onError }) {
  const { selectedLocation, theme } = useLocation();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [debugInfo, setDebugInfo] = useState('Initializing...');

  useEffect(() => {
    setDebugInfo('OpenStreetMap loaded - Ready!');
  }, []);

  const handleMapClick = useCallback((coords) => {
    setMarkerPosition(coords);
    onMapClick(coords);
  }, [onMapClick]);

  const center = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : defaultCenter;
  
  const zoom = selectedLocation ? 15 : defaultZoom;

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="map-container" style={{ zIndex: 1 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
        <MapEvents onMapClick={handleMapClick} />
        <MapCenterUpdater center={selectedLocation} zoom={zoom} />
        {(markerPosition || selectedLocation) && (
          <Marker
            position={[markerPosition?.lat || selectedLocation.lat, markerPosition?.lng || selectedLocation.lng]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onMapClick({ lat, lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}