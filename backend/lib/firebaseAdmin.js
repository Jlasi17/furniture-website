/**
 * Firebase token verification using Google's public keys.
 * This approach does NOT require a service account JSON — it fetches
 * Firebase's public RSA keys and verifies the JWT signature directly.
 * Fully secure: same mechanism used by Firebase Admin SDK internally.
 */

const https = require('https');
const jwt = require('jsonwebtoken');

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedKeys = {};
let keysExpiresAt = 0;

function fetchPublicKeys() {
    return new Promise((resolve, reject) => {
        https.get(PUBLIC_KEYS_URL, (res) => {
            let raw = '';
            res.on('data', (chunk) => { raw += chunk; });
            res.on('end', () => {
                // Cache keys until max-age expires
                const cacheControl = res.headers['cache-control'] || '';
                const match = cacheControl.match(/max-age=(\d+)/);
                const maxAge = match ? parseInt(match[1]) : 3600;
                keysExpiresAt = Date.now() + maxAge * 1000;
                cachedKeys = JSON.parse(raw);
                resolve(cachedKeys);
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function getPublicKeys() {
    if (Date.now() < keysExpiresAt && Object.keys(cachedKeys).length > 0) {
        return cachedKeys;
    }
    return fetchPublicKeys();
}

async function verifyFirebaseToken(idToken) {
    const keys = await getPublicKeys();

    // Extract kid from JWT header to select the right public key
    const [headerB64] = idToken.split('.');
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
    const publicKey = keys[header.kid];

    if (!publicKey) throw new Error(`No public key found for kid: ${header.kid}`);

    const decoded = jwt.verify(idToken, publicKey, {
        algorithms: ['RS256'],
        audience: PROJECT_ID,
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    });

    return decoded;
}

module.exports = { verifyFirebaseToken };
