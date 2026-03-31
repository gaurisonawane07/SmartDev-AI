import axios from "axios";
import { getAuthToken } from "./authToken";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

function isPublicRoute(url = "") {
    return PUBLIC_ROUTES.some((route) => url.includes(route));
}

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const requestUrl = config.url || "";
        const token = getAuthToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (!isPublicRoute(requestUrl)) {
            const authError = new Error("Session expired. Please sign in again.") as Error & { status?: number };
            authError.status = 401;
            return Promise.reject(authError);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Extract data from response, normalize errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || "Something went wrong";
        const normalizedError = new Error(message) as Error & { status?: number };
        normalizedError.status = status;
        return Promise.reject(normalizedError);
    }
);

export default apiClient;
