export const protocol = import.meta.env.VITE_PROTOCOL || (typeof window !== 'undefined' ? window.location.protocol.replace(':', '') : 'https');
export const appDomain = import.meta.env.VITE_APP_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'localhost:3000');
export const apiDomain = import.meta.env.VITE_API_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'localhost:3000');
export const prefix = import.meta.env.VITE_API_PREFIX || 'api/v1';

