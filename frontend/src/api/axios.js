import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
export const REFRESH_URL = "/api/auth/token/refresh/";
export const AUTH_LOGOUT_EVENT = "auth:logout";

export const attachAuthHeader = (config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const clearSession = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use(attachAuthHeader);

// On a 401, try once to refresh the access token and replay the original
// request transparently. `_retry` guards against looping if the retried
// request itself comes back 401 (e.g. the refresh token is also invalid).
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      clearSession();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}${REFRESH_URL}`, {
        refresh: refreshToken,
      });
      localStorage.setItem("access_token", data.access);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearSession();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
