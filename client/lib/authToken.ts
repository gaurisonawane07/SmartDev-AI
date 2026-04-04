const TOKEN_KEY = "token";
const TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function getTokenExpiryEpoch(token: string): number | null {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return null;

        const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        const payload = JSON.parse(atob(padded));

        return typeof payload.exp === "number" ? payload.exp : null;
    } catch {
        return null;
    }
}

function isTokenExpired(token: string): boolean {
    const exp = getTokenExpiryEpoch(token);
    if (!exp) return false;
    return exp <= Math.floor(Date.now() / 1000);
}

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
    if (localToken) {
        if (isTokenExpired(localToken)) {
            clearAuthToken();
            return null;
        }
        return localToken;
    }

    const cookieToken = getCookieToken();
    if (cookieToken) {
        if (isTokenExpired(cookieToken)) {
            clearAuthToken();
            return null;
        }

        // Keep both storage locations synchronized for middleware + client API usage.
        localStorage.setItem(TOKEN_KEY, cookieToken);
        return cookieToken;
    }

    return null;
};

export const setAuthToken = (token: string): void => {
    if (typeof window === "undefined") return;

    const exp = getTokenExpiryEpoch(token);
    const now = Math.floor(Date.now() / 1000);
    const computedMaxAge = exp ? Math.max(0, exp - now) : TOKEN_COOKIE_MAX_AGE_SECONDS;

    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${computedMaxAge}; samesite=lax`;
};

export const clearAuthToken = (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
};
