"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function AppToaster() {
    const { resolvedTheme } = useTheme();

    return (
        <Toaster
            richColors
            closeButton
            position="top-right"
            theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
    );
}