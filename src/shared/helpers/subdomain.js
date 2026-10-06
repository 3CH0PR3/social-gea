/**
 * Helper to extract subdomain from current hostname or return null.
 */
export function getSubdomain() {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;
  // Ignore localhost, IP addresses and cloud preview domains
  if (hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return null;
  if (hostname.includes('.run.app') || hostname.includes('.web.app')) return null;

  const appDomain = import.meta.env.VITE_APP_DOMAIN;
  if (appDomain && hostname.endsWith(appDomain) && hostname !== appDomain) {
    return hostname.replace(`.${appDomain}`, '');
  }

  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
}

