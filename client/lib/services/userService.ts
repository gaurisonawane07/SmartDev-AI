import apiClient from "../api";

export const userService = {
    getProfile: () =>
        apiClient.get("/user/profile") as Promise<any>,
};
