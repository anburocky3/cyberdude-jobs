export async function apiFetch(path: string, init?: RequestInit) {
  // Client: use relative URL (no next/headers dependency)
  if (typeof window !== "undefined") {
    return fetch(path, init);
  }

  // Server: build absolute URL using request headers
  const mod = await import("next/headers");
  const h = await mod.headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol = (h.get("x-forwarded-proto") ?? "http").split(",")[0];
  return fetch(`${protocol}://${host}${path}`, init);
}
