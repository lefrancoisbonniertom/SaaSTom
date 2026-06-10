/**
 * Auth.js keeps the session-token cookie alive for `session.maxAge` (30 days)
 * no matter what, so it can't be turned into a true browser-session cookie on
 * its own. This extra marker cookie has no Expires/Max-Age, so browsers drop
 * it when the browser session ends. The proxy treats a valid JWT without this
 * marker as a stale session from a previous browser session and logs it out.
 */
export const SESSION_MARKER_COOKIE = "session-active";

export function markSessionActive() {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_MARKER_COOKIE}=1; path=/; SameSite=Lax${secure}`;
}

export function clearSessionMarker() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_MARKER_COOKIE}=; path=/; Max-Age=0`;
}
