
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Separate instance: refresh requests bypass api's response interceptor.
const refreshApi = axios.create({
    baseURL,
    withCredentials: true,
});

// Access token exists only in memory.
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token || null;
};

export const clearAccessToken = () => {
    accessToken = null;
};

export const getAccessToken = () => accessToken;

// Attach the current access token to protected requests.
api.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Share one refresh request between simultaneous 401 responses.
let refreshPromise = null;

const excludedRoutes = [
    "/api/user/v1/login",
    "/api/user/v1/signup",
    "/api/user/v1/refresh",
    "/api/user/v1/logout",
];

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url || "";

        const isExcludedRoute = excludedRoutes.some((route) =>
            requestUrl.includes(route)
        );

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            isExcludedRoute
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshApi
                    .post("/api/user/v1/refresh")
                    .then((response) => {
                        const newToken = response.data?.accessToken;

                        if (!newToken) {
                            throw new Error(
                                "Refresh response did not contain accessToken"
                            );
                        }

                        setAccessToken(newToken);

                        return newToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            clearAccessToken();

            return Promise.reject(refreshError);
        }
    }
);

export default api;
