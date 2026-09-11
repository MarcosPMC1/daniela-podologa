/**
 * Generates an absolute canonical URL.
 * Rules:
 * - URL completa com https.
 * - Nunca usar URL relativa.
 * - Nunca incluir parâmetros na URL (utm, ref, etc).
 * - Nunca duplicar barra no final.
 * - Reflete exatamente a URL pública acessível.
 */
export function getCanonicalUrl(host: string, pathname: string = '/'): string {
  // Strip query parameters and hashes just in case they passed through
  const cleanPathname = pathname.split(/[?#]/)[0];

  // Remove trailing slash, but keep it if it's the root
  let normalizedPath = cleanPathname.replace(/\/$/, '');
  if (normalizedPath === '') {
    normalizedPath = ''; // Root should be empty for concatenation with host
  }

  // Ensure host doesn't have a protocol
  let cleanHost = host.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Normalize host: if it's the main domain with www, strip it
  if (cleanHost === 'www.integrano.com.br') {
    cleanHost = 'integrano.com.br';
  }

  // Determine protocol - usually https in production, but handle localhost for dev
  const protocol = cleanHost.includes('localhost') ? 'http' : 'https';

  // Construct full URL
  const fullUrl = `${protocol}://${cleanHost}${normalizedPath || '/'}`;

  // Final check to remove trailing slash if it's not the naked root domain
  // (e.g., https://example.com/ should be https://example.com)
  // Actually, standard practice for root is https://example.com
  // But rule says "Nunca duplicar barra no final" and "A página principal (/) deve apontar para o domínio raiz"

  return fullUrl.replace(/\/$/, '');
}
