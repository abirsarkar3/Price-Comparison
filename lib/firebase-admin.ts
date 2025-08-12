// lib/firebase-admin.ts - Server-side only Firebase Admin SDK
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Only run on server side
if (typeof window === "undefined") {
  const serviceAccount: any = {
    type: "service_account",
    project_id: "comparison-application",
    private_key_id: "aee3169fb4bf47859e8e7b3536783058106f5cd3",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCIogFMqOjljUn/\nbQOyaujQCC28K1FevQUTzo3kFEtOe3Fmq0CxfIELMWywuh8YWLMn1b+g4KonzGWc\nCbQdjYldjnK1uKBuvFSWz9E3U6DMLEbgVVSmUr82X+B1LcwZVPoA+sgwRXD59oY3\nKuzJLqnLsCMpowqOXR1LyS0uL9QWRz71JxAJbTIxz/FiSib+YNP41LpY0QXxCPi7\n4G+w25BVc+dSYm+pqnlsCRGAkqvEzbzVPw/rHuVkOAS/6ff3h/cZDOgYlL62XYFG\nbk3W4YtVv56OxMuiQ8fOj4Rg+kUPupublJnkLyKWT4xVLWAfALKZcdbZ4/R8iDWx\nwZooL3qJAgMBAAECgf9B6eW2lcXE9+Q61Nxzth+aPFfT7xHSIl3QsFTDMwchVWvf\nm74Z4XZfb/h/SUq29BN5pCRN+BQeHvzlyciaeS1LdOzhva+nvDMSji7gAfgQh0up\n7YBovIKCOL6PyQgtMFFrJ5BruRRHgiY9dvfEFj7ThKVx8LWm+ESpyuOA5JHsLL4u\nUCQskb+iVAwSyQf9OwTjrgimYDEamxB3QkgTthmppfmDK2sXNalbpD/gQDhqCopx\nDxkGWQXH1D051qWW4vLmUznTsRsrMEY1Sp8crrlZWp+pAfc8yiOow3DQdTYrmS6t\nrXioe8ft7eRfXz8TL4sANUx7b3SBsppjzuJajicCgYEAwDUlRfnjx7BNJNaZ2hnC\nXnN0WY0QBpioPUZ6umMWef4mT8m+9tqS0D2+fINPvGMCmA0d1WehFvYYS9y6Tr3H\nZAwtEIJC5au0S2+bRD7nRfIkOF+7J2FoGOOUHIiIDEOCOAzi4Rxubr02n3dwd4Al\nIFZW1R7a0KxuoMx7+PvTez8CgYEAtfr3yx+u41juNndOqJEpUxHra4NkC9MY3oyQ\nucooN8SmcNo303nW4QIh8CjKgjbB6LQ7Ds9DquzgdWewcWhSogDn35BFjKJoCHMw\nq3pTvpY7ESqeoKLKUb6d60/YxoYi7d3A9TvtZUJgzzhlmfYPJhYEnt/cs/91mNwg\nyUJAADcCgYBj13d8KPlMUmVQPHWA2J6hp4GJvv/THVtPMRwxU6VqSz2ldpvO6O0Y\nZOpdDWzO4/OF/lI/92uzXLR0O70/h89aRgTmrXOIkC/Ae8IAqlhCeiycaAX0x+Fm\nBFl8lONu02aCLRdxbe5jccA9B7MRMCyY5qCGZlety9RPjMjdJhrNywKBgQCTI+9D\nX8TKslc51tHU3jppnm2Zqs0z+mV7XHCQqHJIVUq2qNrGtRcXK+BBDNpg2uGCxGeU\nG+X8yDbc9w/lQpK9xrm1PDPf+FjhrDHIFMqtqU7tHGbSP44S9ms9nnwKWN7ZMZoZ\nL3FNlJQuOM195URuaRMnWp5bM8zj4ejokhaplQKBgGr23WQg+/y9adpAa3FK+a+F\n/1Fls3IbX0MmCIO5yUgWCCOV3VwelgQAU6njCPy+pCVt/eob/jKfj7DFtq0z9LBe\njmJ9CcLudX+j/bDxelHAYAtMnVnrKHWKaar/7CZZ/rBzgP7wmQJsD0vQuHezuNdu\nUxDwoMofS6maLg/6GFG7\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@comparison-application.iam.gserviceaccount.com",
    client_id: "112644027526623859802",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40comparison-application.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
    }
  }
}

// Export a function to get the admin database
export function getAdminDb() {
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin SDK can only be used on the server side");
  }
  return getFirestore();
}

// Export the admin database instance for server-side use
export const adminDb = typeof window === "undefined" ? getFirestore() : null;
