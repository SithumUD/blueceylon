import { useAuthStore } from "@/store/auth-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  _isRetry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      useAuthStore.getState().logout();
      return null;
    }

    const data = await res.json();
    if (data.accessToken) {
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken || refreshToken);
      return data.accessToken;
    }
  } catch {
    useAuthStore.getState().logout();
  }
  return null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, _isRetry, ...restOptions } = options;

  // Build URL with query params
  let url = `${BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Set headers
  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type") && !(restOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach auth token if available (client-side only since useAuthStore uses localStorage)
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  // Handle 401 Unauthorized - Automatic Refresh Token Retry
  if (response.status === 401 && !_isRetry && typeof window !== "undefined" && path !== "/api/v1/auth/refresh") {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          return apiFetch<T>(path, { ...options, _isRetry: true });
        });
      }

      isRefreshing = true;
      const newAccessToken = await tryRefreshToken();
      isRefreshing = false;

      if (newAccessToken) {
        processQueue(null, newAccessToken);
        return apiFetch<T>(path, { ...options, _isRetry: true });
      } else {
        processQueue(new Error("Session expired"), null);
      }
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSON parsing failed or no body
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content or empty body
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return {} as T;
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}
