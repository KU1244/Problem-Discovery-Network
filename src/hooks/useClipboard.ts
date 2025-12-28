// FILE: src/hooks/useClipboard.ts

"use client";

import { useCallback } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CopyResult =
    | { ok: true }
    | { ok: false; errorMessage: string };

type UseClipboardReturn = {
    copyText: (text: string) => Promise<CopyResult>;
    copyAndRecord: (text: string, solutionId: string) => Promise<CopyResult>;
};

// -----------------------------------------------------------------------------
// Clipboard Helpers
// -----------------------------------------------------------------------------

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

async function performCopy(text: string): Promise<CopyResult> {
    try {
        const ok = await copyViaNavigator(text);
        if (ok) return { ok: true };

        const okFallback = copyViaTextarea(text);
        if (okFallback) return { ok: true };

        return { ok: false, errorMessage: "Copy failed on this browser." };
    } catch {
        return { ok: false, errorMessage: "Copy failed on this browser." };
    }
}

// -----------------------------------------------------------------------------
// API Helper
// -----------------------------------------------------------------------------

async function recordCopy(solutionId: string): Promise<void> {
    try {
        await fetch(`/api/solutions/${solutionId}/copy`, {
            method: "POST",
        });
        // Fire-and-forget: we don't block user experience on API success
    } catch (error) {
        console.error("Failed to record copy:", error);
    }
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useClipboard(): UseClipboardReturn {
    /**
     * Copy text to clipboard without recording
     */
    const copyText = useCallback(async (text: string): Promise<CopyResult> => {
        return performCopy(text);
    }, []);

    /**
     * Copy text to clipboard AND record the copy event via API
     * Prioritizes user experience: copy happens first, API call is fire-and-forget
     */
    const copyAndRecord = useCallback(
        async (text: string, solutionId: string): Promise<CopyResult> => {
            const result = await performCopy(text);

            // Record copy only if clipboard copy succeeded
            if (result.ok) {
                // Fire-and-forget: don't await
                recordCopy(solutionId);
            }

            return result;
        },
        []
    );

    return { copyText, copyAndRecord };
}