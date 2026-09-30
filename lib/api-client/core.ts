/**
 * Bidyapith API Client Core
 * Configuration, token storage management and base request handler
 */

export const API_ENDPOINTS = {
  local: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
  render: process.env.NEXT_PUBLIC_REMOTE_API_URL || "https://bidyapith-backend.onrender.com/api/v1",
};

let currentEndpoint = API_ENDPOINTS.local;

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("bidyapith_api_endpoint");
  if (saved && (saved === API_ENDPOINTS.local || saved === API_ENDPOINTS.render)) {
    currentEndpoint = saved;
  }
}

export function getBaseApiUrl(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bidyapith_api_endpoint") || currentEndpoint;
  }
  return currentEndpoint;
}

export function setBaseApiUrl(url: string): void {
  currentEndpoint = url;
  if (typeof window !== "undefined") {
    localStorage.setItem("bidyapith_api_endpoint", url);
  }
}

export function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bidyapith-auth-change"));
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const token =
    localStorage.getItem("bidyapith_token") ||
    localStorage.getItem("bidyapith_access_token") ||
    sessionStorage.getItem("bidyapith_token")
  return token?.startsWith("bidyapith-session-") ? null : token;
}

export function setStoredToken(token: string, remember = true): void {
  if (typeof window === "undefined") return;
  if (remember) {
    localStorage.setItem("bidyapith_token", token);
    localStorage.setItem("bidyapith_access_token", token);
  } else {
    sessionStorage.setItem("bidyapith_token", token);
  }
  notifyAuthChange();
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  const hadStoredToken = Boolean(
    localStorage.getItem("bidyapith_token") ||
      localStorage.getItem("bidyapith_access_token") ||
      sessionStorage.getItem("bidyapith_token"),
  );
  localStorage.removeItem("bidyapith_token");
  localStorage.removeItem("bidyapith_access_token");
  sessionStorage.removeItem("bidyapith_token");
  localStorage.removeItem("bidyapith_user");
  if (hadStoredToken) notifyAuthChange();
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("bidyapith_user");
  if (!user) return null;
  try {
    return JSON.parse(user) as T;
  } catch {
    return null;
  }
}

export function setStoredUser(user: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("bidyapith_user", JSON.stringify(user));
  notifyAuthChange();
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseApiUrl();
  const token = getStoredToken();

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) removeStoredToken();
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data as ApiResponse<T>;
}
