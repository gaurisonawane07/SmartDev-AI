import apiClient from "../api";

export const userService = {
    getProfile: () =>
        apiClient.get("/user/profile") as Promise<any>,

    updateProfile: (data: { name?: string; email?: string }) =>
        apiClient.put("/user/profile", data) as Promise<any>,
};

