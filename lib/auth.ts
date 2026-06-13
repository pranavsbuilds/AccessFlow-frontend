// lib/auth.ts
// ─── Anonymous Session Identity ──────────────────────────────────────────────
// Auth is not yet implemented by the backend (hashlib + session salting planned).
// This is a placeholder: a UUID persisted to localStorage that identifies the
// browser session. When Rohan's auth lands, ONLY this file changes.

const UID_KEY = 'si_uid';

export function getAnonymousUid(): string {
  if (typeof window === 'undefined') {
    // SSR safety — never called server-side, but just in case
    return 'ssr-placeholder';
  }

  let uid = localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(UID_KEY, uid);
  }
  return uid;
}

export function clearUid(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(UID_KEY);
  }
}
