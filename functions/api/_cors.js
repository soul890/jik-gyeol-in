/**
 * CORS utility – restricts allowed origins.
 */

const ALLOWED_ORIGINS = [
  'https://openinterior.pages.dev',
  'http://localhost:5173',
  'http://localhost:4173',
];

/**
 * Returns the Access-Control-Allow-Origin value if the request origin is
 * allowed, or null otherwise.
 */
export function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return null;
}

/**
 * Builds standard CORS headers for a given request.
 * Returns null if the origin is not allowed.
 */
export function corsHeaders(request) {
  const origin = getAllowedOrigin(request);
  if (!origin) {
    return {
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Returns a preflight (OPTIONS) response with proper CORS headers.
 */
export function handleOptions(request) {
  const origin = getAllowedOrigin(request);
  if (!origin) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}
