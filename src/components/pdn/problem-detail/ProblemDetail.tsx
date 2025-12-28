// FILE: src/components/pdn/problem-detail/ProblemDetail.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import type { SolutionItem, FeedbackType } from "@/lib/pdn/types";
import { useClipboard } from "@/hooks/useClipboard";
import { useFeedback } from "@/hooks/useFeedback";
import ProblemDetailView from "@/components/pdn/problem-detail/ProblemDetailView";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
    title: string;
    scope: string;
    solutions: SolutionItem[];
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function ProblemDetail({ title, scope, solutions }: Props) {
    const { copyAndRecord } = useClipboard();
    const { submitFeedback, hasSubmittedToday } = useFeedback();

    // UI State
    const [copiedSolutionId, setCopiedSolutionId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Track feedback status for each solution
    // null = not submitted, FeedbackType = submitted with that type
    const [feedbackStatus, setFeedbackStatus] = useState<Record<string, FeedbackType | null>>({});

    // Initialize feedback status from localStorage on mount
    useEffect(() => {
        const initialStatus: Record<string, FeedbackType | null> = {};
        solutions.forEach((s) => {
            // Check if already submitted today
            if (hasSubmittedToday(s.id)) {
                // We don't know the exact type, but mark as submitted
                // Using "tried" as a placeholder since we can't retrieve the actual type
                initialStatus[s.id] = "tried";
            } else {
                initialStatus[s.id] = null;
            }
        });
        setFeedbackStatus(initialStatus);
    }, [solutions, hasSubmittedToday]);

    // Copy action - renamed to end with "Action" for Next.js 15+ TS71007
    const copyAction = useCallback(
        async (solutionId: string, content: string) => {
            const res = await copyAndRecord(content, solutionId);
            if (res.ok) {
                setCopiedSolutionId(solutionId);
                setToastMessage("Copied to clipboard!");
            } else {
                setCopiedSolutionId(null);
                setToastMessage(res.errorMessage);
            }
        },
        [copyAndRecord]
    );

    // Feedback action - renamed to end with "Action" for Next.js 15+ TS71007
    const feedbackAction = useCallback(
        async (solutionId: string, type: FeedbackType) => {
            // Check if already submitted
            if (feedbackStatus[solutionId] !== null && feedbackStatus[solutionId] !== undefined) {
                setToastMessage("Already submitted today.");
                return;
            }

            const res = await submitFeedback(solutionId, type);

            if (res.ok) {
                setFeedbackStatus((prev) => ({
                    ...prev,
                    [solutionId]: type,
                }));
                setToastMessage("Thanks for your feedback!");
            } else if (res.reason === "already_submitted") {
                setToastMessage("Already submitted today.");
                setFeedbackStatus((prev) => ({
                    ...prev,
                    [solutionId]: type,
                }));
            } else {
                setToastMessage("Failed to submit feedback.");
            }
        },
        [submitFeedback, feedbackStatus]
    );

    // Clear toast after delay
    useEffect(() => {
        if (!toastMessage) return;

        const timer = window.setTimeout(() => {
            setToastMessage(null);
            // Keep copiedSolutionId for visual feedback
        }, 2500);

        return () => window.clearTimeout(timer);
    }, [toastMessage]);

    // Clear copied state after longer delay
    useEffect(() => {
        if (!copiedSolutionId) return;

        const timer = window.setTimeout(() => {
            setCopiedSolutionId(null);
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [copiedSolutionId]);

    return (
        <ProblemDetailView
            title={title}
            scope={scope}
            solutions={solutions}
            copyAction={copyAction}
            feedbackAction={feedbackAction}
            copiedSolutionId={copiedSolutionId}
            toastMessage={toastMessage}
            feedbackStatus={feedbackStatus}
        />
    );
}