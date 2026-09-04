export async function endClientSession(redirectTo = "/login") {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include", cache: "no-store" });
  } catch {
    // Always leave the authenticated shell, even if the request fails.
  }
  window.location.replace(redirectTo);
}
