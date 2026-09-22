import axios, { AxiosError } from "axios";
import { getToken, clearAuth } from "../features/auth/authStorage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "VITE_API_BASE_URL is not set. Copy .env.example to .env and configure it.",
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export interface NormalizedApiError {
  status: number | undefined;
  fieldErrors: Record<string, string>;
  message: string;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const body = error.response?.data as { errors?: { field: string; message: string }[] } | undefined;
    const fieldErrors: Record<string, string> = {};
    let message = error.message;

    if (body?.errors?.length) {
      message = body.errors.map((e) => e.message).join(", ");
      for (const e of body.errors) {
        if (e.field) fieldErrors[e.field] = e.message;
      }
    }

    return { status, fieldErrors, message };
  }

  return { status: undefined, fieldErrors: {}, message: "An unexpected error occurred." };
}
