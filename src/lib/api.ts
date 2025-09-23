import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol = (h.get("x-forwarded-proto") ?? "http").split(",")[0];
  return `${protocol}://${host}`;
}

export async function apiFetch(path: string, init?: RequestInit) {
  const baseUrl = await getBaseUrl();
  return fetch(`${baseUrl}${path}`, init);
}
