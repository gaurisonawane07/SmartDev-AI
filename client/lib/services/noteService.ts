import apiClient from "../api";

export const noteService = {
    getAll: () =>
        apiClient.get("/notes") as Promise<any[]>,

    create: (note: { title: string; content: string }) =>
        apiClient.post("/notes", note) as Promise<any>,

    update: (id: string, data: { title?: string; content?: string }) =>
        apiClient.put(`/notes/${id}`, data) as Promise<any>,

    delete: (id: string) =>
        apiClient.delete(`/notes/${id}`) as Promise<any>,
};
