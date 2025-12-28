// FILE: src/hooks/useFeedback.ts

"use client";

import { useCallback, useState, useEffect } from "react";
import type { FeedbackType } from "@/lib/pdn/types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type FeedbackResult =
    | { ok: true }
    | { ok: false; reason: "already_submitted" | "api_error" | "invalid_type" };

type UseFeedbackReturn = {
    submitFeedback: (solutionId: string, type: FeedbackType) => Promise<FeedbackResult>;
    hasSubmittedToday: (solutionId: string) => boolean;
    isSubmitting: boolean;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getUtcDateString(): string {
    const now = new Date();
    return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getStorageKey(solutionId: string): string {
    const date = getUtcDateString();
    return `pdn:fb:${solutionId}:${date}`;
}

function checkAlreadySubmitted(solutionId: string): boolean {
    if (typeof window === "undefined") return false;
    const key = getStorageKey(solutionId);
    return localStorage.getItem(key) === "1";
}

function markAsSubmitted(solutionId: string): void {
    if (typeof window === "undefined") return;
    const key = getStorageKey(solutionId);
    localStorage.setItem(key, "1");
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useFeedback(): UseFeedbackReturn {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, setMounted] = useState(false);

    // Ensure we only access localStorage after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const hasSubmittedToday = useCallback((solutionId: string): boolean => {
        return checkAlreadySubmitted(solutionId);
    }, []);

    const submitFeedback = useCallback(
        async (solutionId: string, type: FeedbackType): Promise<FeedbackResult> => {
            // Check if already submitted today
            if (checkAlreadySubmitted(solutionId)) {
                return { ok: false, reason: "already_submitted" };
            }

            setIsSubmitting(true);

            try {
                const response = await fetch(`/api/solutions/${solutionId}/feedback`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type }),
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    console.error("Feedback API error:", data);
                    return { ok: false, reason: "api_error" };
                }

                // Mark as submitted in localStorage
                markAsSubmitted(solutionId);

                return { ok: true };
            } catch (error) {
                console.error("Feedback submission error:", error);
                return { ok: false, reason: "api_error" };
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    return {
        submitFeedback,
        hasSubmittedToday,
        isSubmitting,
    };
}