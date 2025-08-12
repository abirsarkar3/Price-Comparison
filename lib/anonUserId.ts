// lib/anonUserId.ts

// Generates a random UUID (v4)
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Returns the anon user ID, generating and storing it if not present
export function getAnonUserId(): string {
  if (typeof window === "undefined") {
    // SSR fallback: return a dummy value (should not be used for writes)
    return "ssr-anon";
  }
  let id = localStorage.getItem("anon_user_id");
  if (!id) {
    id = generateUUID();
    localStorage.setItem("anon_user_id", id);
  }
  return id;
}