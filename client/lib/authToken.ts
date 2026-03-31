const TOKEN_KEY = "token";
const TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getCookieToken(): string | null {
    if (typeof document === "undefined") return null;

    const tokenPair = document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${TOKEN_KEY}=`));

    if (!tokenPair) return null;

    const value = tokenPair.slice(TOKEN_KEY.length + 1);
    return value ? decodeURIComponent(value) : null;
}

export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;

    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) return localToken;

    const cookieToken = getCookieToken();
    if (cookieToken) {
        // Keep both storage locations synchronized for middleware + client API usage.
        localStorage.setItem(TOKEN_KEY, cookieToken);
        return cookieToken;
    }

    return null;
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
