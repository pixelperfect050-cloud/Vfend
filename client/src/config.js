// API base URL — used for direct references outside of axios
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// Backend root URL (without /api) — used for uploads, socket, etc.
export const BACKEND_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '') || '';