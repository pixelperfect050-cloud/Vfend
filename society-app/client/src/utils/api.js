// ============================================
// Utility functions (formerly in api.js)
// These are kept for backward compatibility
// ============================================

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Legacy API wrapper - redirects to Supabase or serverless functions
// This file exists ONLY for backward compatibility during migration
// Pages should gradually move to importing from lib/database.js directly

const SERVERLESS_BASE = '/api';

const api = {
  get: async (url) => {
    // For serverless endpoints only (sheets, AI, etc.)
    const res = await fetch(`${SERVERLESS_BASE}${url}`);
    if (!res.ok) throw new Error(`Server error (status ${res.status})`);
    return res.json();
  },
  post: async (url, body) => {
    const res = await fetch(`${SERVERLESS_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Server error (status ${res.status})`);
    return res.json();
  },
  put: async (url, body) => {
    const res = await fetch(`${SERVERLESS_BASE}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Server error (status ${res.status})`);
    return res.json();
  },
  delete: async (url) => {
    const res = await fetch(`${SERVERLESS_BASE}${url}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Server error (status ${res.status})`);
    return res.json();
  },
  download: async (url, filename) => {
    const res = await fetch(`${SERVERLESS_BASE}${url}`);
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
};

export default api;
