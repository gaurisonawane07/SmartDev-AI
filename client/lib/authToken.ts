const TOKEN_KEY = "token";
const TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

export const clearAuthToken = (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
};
