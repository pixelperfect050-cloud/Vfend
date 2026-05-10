// Backend root URL (without /api) — used for uploads, socket, etc.
export const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const API_URL = import.meta.env.VITE_API_URL || '/api';