/**
 * Helper to extract subdomain from current hostname or return null.
 */
export function getSubdomain() {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
}
