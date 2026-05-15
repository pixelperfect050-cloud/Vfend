import { useCallback } from 'react';
import { useLocation } from '../context/LocationContext';
import { generateMapsUrl } from '../utils/storage';

export default function ShareButton({ onShare }) {
  const { selectedLocation, addToRecent } = useLocation();

  const copyToClipboard = useCallback((url, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Location link copied!\n\nOpen WhatsApp and paste to share.');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }, []);

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Location link copied!\n\nOpen WhatsApp and paste to share.');
  };

  const fallbackShare = useCallback((url, text) => {
    if (window.AndroidShare) {
      window.AndroidShare.share(url, text);
    } else if (window.Capacitor && window.Capacitor.isNativePlatform) {
      const lat = selectedLocation?.lat;
      const lng = selectedLocation?.lng;
      if (lat && lng) {
        window.location.href = `geo:${lat},${lng}?q=${encodeURIComponent(url)}`;
      }
      setTimeout(() => {
        copyToClipboard(url, text);
      }, 500);
    } else {
      copyToClipboard(url, text);
    }
  }, [selectedLocation, copyToClipboard]);

  const handleShare = useCallback(async () => {
    if (!selectedLocation) return;

    const url = generateMapsUrl(selectedLocation.lat, selectedLocation.lng);
    const shareText = `📍 Check this location on Google Maps\n${url}`;
    addToRecent(selectedLocation);

    if (navigator.share && navigator.canShare?.({ url })) {
      try {
        await navigator.share({
          title: 'Share Location',
          text: shareText,
          url: url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackShare(url, shareText);
        }
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Location',
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackShare(url, shareText);
        }
      }
    } else {
      fallbackShare(url, shareText);
    }

    onShare?.(url);
  }, [selectedLocation, addToRecent, onShare, fallbackShare]);

  return (
    <button
      className="share-btn"
      onClick={handleShare}
      disabled={!selectedLocation}
    >
      <span>💬</span>
      Share to WhatsApp
    </button>
  );
}