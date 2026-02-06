// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
console.log("BASE_URL     =", BASE_URL);



export async function api<T = any>(
  path: string,
  opts: RequestInit & { method?: Method } = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });

  // Si la API devuelve error con JSON, lo mostramos bonito
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.error || body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  // Algunas rutas pueden devolver 204 sin body
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

// Helpers específicos
export function login(email: string, password: string) {
  return api<{ token: string; user: any }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(payload: {
  name: string;
  email: string;
  password: string;
  contactInfo?: string;
  clinicalInfo?: string;
}) {
  return api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
