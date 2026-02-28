import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || "Something went wrong";
        return Promise.reject(new Error(message));
    }
);

export const api = {
    login: (credentials: any) => apiClient.post("/auth/login", credentials) as Promise<any>,
    register: (userData: any) => apiClient.post("/auth/register", userData) as Promise<any>,

    getProfile: () => apiClient.get("/user/profile") as Promise<any>,

    getNotes: () => apiClient.get("/notes") as Promise<any[]>,
    createNote: (note: any) => apiClient.post("/notes", note) as Promise<any>,

    getAIHistory: () => apiClient.get("/ai/history") as Promise<any>,
};
