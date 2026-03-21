import apiClient from "../api";

export const aiService = {
    sendMessage: (message: string, conversationId?: string) =>
        apiClient.post("/ai/generate", { message, conversationId }) as Promise<any>,

    getHistory: () =>
        apiClient.get("/ai/history") as Promise<any>,

    getConversation: (id: string) =>
        apiClient.get(`/ai/conversation/${id}`) as Promise<any>,

    saveResponseToNote: (title: string, content: string) =>
        apiClient.post("/ai/save-note", { title, content }) as Promise<any>,

    deleteConversation: (id: string) =>
        apiClient.delete(`/ai/conversation/${id}`) as Promise<any>,
};
