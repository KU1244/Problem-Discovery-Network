// FILE: src/components/pdn/problem-detail/ProblemDetail.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import type { SolutionItem } from "@/lib/pdn/types";
import { useClipboard } from "@/hooks/useClipboard";
import ProblemDetailView from "@/components/pdn/problem-detail/ProblemDetailView";

type Props = {
    title: string;
    scope: string;
    solutions: SolutionItem[];
};

export default function ProblemDetail({ title, scope, solutions }: Props) {
    const { copyText } = useClipboard();
    const [copiedSolutionId, setCopiedSolutionId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const action = useCallback(
        async (solutionId: string, content: string) => {
            const res = await copyText(content);
            if (res.ok) {
                setCopiedSolutionId(solutionId);
                setToastMessage("Copied to clipboard.");
            } else {
                setCopiedSolutionId(null);
                setToastMessage(res.errorMessage);
            }
        },
        [copyText]
    );

    useEffect(() => {
        if (!toastMessage) return;

        const t = window.setTimeout(() => {
            setToastMessage(null);
            setCopiedSolutionId(null);
        }, 1500);

        return () => window.clearTimeout(t);
    }, [toastMessage]);

    return (
        <ProblemDetailView
            title={title}
            scope={scope}
            solutions={solutions}
            action={action}
            copiedSolutionId={copiedSolutionId}
            toastMessage={toastMessage}
        />
    );
}
