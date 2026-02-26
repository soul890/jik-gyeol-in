/**
 * Firebase ID Token verification utility.
 *
 * Uses the Google Identity Toolkit REST API to verify tokens without
 * requiring the full Firebase Admin SDK (not available in Cloudflare Workers).
 */

const FIREBASE_API_KEY = 'AIzaSyCLMpMAXTBKp7M9NxyVjsepdHlq5xCEYv8';

/**
 * Extracts and verifies a Firebase ID token from the Authorization header.
 * Returns the verified user's uid, or null if invalid.
 *
 * @param {Request} request
 * @returns {Promise<{ uid: string } | null>}
 */
export async function verifyIdToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.slice(7);
  if (!idToken) {
    return null;
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const user = data.users?.[0];
    if (!user?.localId) {
      return null;
    }

    return { uid: user.localId };
  } catch {
    return null;
  }
}
