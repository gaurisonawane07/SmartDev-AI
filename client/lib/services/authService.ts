import apiClient from "../api";

export const authService = {
    login: (credentials: { email: string; password: string }) =>
        apiClient.post("/auth/login", credentials) as Promise<any>,

    register: (userData: { name: string; email: string; password: string }) =>
        apiClient.post("/auth/register", userData) as Promise<any>,
};
