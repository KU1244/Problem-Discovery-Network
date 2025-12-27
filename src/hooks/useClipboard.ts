// FILE: src/hooks/useClipboard.ts

"use client";

import { useCallback } from "react";

type CopyResult =
    | { ok: true }
    | { ok: false; errorMessage: string };

async function copyViaNavigator(text: string): Promise<boolean> {
    if (typeof navigator === "undefined") return false;
    if (!navigator.clipboard?.writeText) return false;

    await navigator.clipboard.writeText(text);
    return true;
}

function copyViaTextarea(text: string): boolean {
    if (typeof document === "undefined") return false;

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
}

export function useClipboard(): {
    copyText: (text: string) => Promise<CopyResult>;
} {
    const copyText = useCallback(async (text: string): Promise<CopyResult> => {
        try {
            const ok = await copyViaNavigator(text);
            if (ok) return { ok: true };

            const okFallback = copyViaTextarea(text);
            if (okFallback) return { ok: true };

            return { ok: false, errorMessage: "Copy failed on this browser." };
        } catch {
            return { ok: false, errorMessage: "Copy failed on this browser." };
        }
    }, []);

    return { copyText };
}
