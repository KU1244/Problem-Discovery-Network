// FILE: src/components/pdn/problem-detail/ProblemDetailView.tsx

"use client";

import { useState } from "react";
import type { SolutionItem, FeedbackType } from "@/lib/pdn/types";
import SolutionCardView from "@/components/pdn/problem-detail/SolutionCardView";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
    title: string;
    scope: string;
    solutions: SolutionItem[];
    copyAction: (solutionId: string, content: string) => void;
    feedbackAction: (solutionId: string, type: FeedbackType) => void;
    copiedSolutionId: string | null;
    toastMessage: string | null;
    feedbackStatus: Record<string, FeedbackType | null>;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatVariant(variant: SolutionItem["variant"]): string {
    switch (variant) {
        case "direct":
            return "Direct";
        case "friendly":
            return "Friendly";
        case "professional":
            return "Professional";
        default:
            return "Template";
    }
}

// -----------------------------------------------------------------------------
// Tab Button Component
// -----------------------------------------------------------------------------

type TabButtonProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

function TabButton({ label, isActive, onClick }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-zinc-400
                ${isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }
            `}
        >
            {label}
        </button>
    );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function ProblemDetailView({
                                              title,
                                              solutions,
                                              copyAction,
                                              feedbackAction,
                                              copiedSolutionId,
                                              toastMessage,
                                              feedbackStatus,
                                          }: Props) {
    // Tab state: default to first solution's variant
    const [activeVariant, setActiveVariant] = useState<SolutionItem["variant"]>(
        solutions[0]?.variant ?? "direct"
    );

    // Get unique variants in order
    const variants = solutions
        .map((s) => s.variant)
        .filter((v, i, arr) => arr.indexOf(v) === i);

    // Get active solution
    const activeSolution = solutions.find((s) => s.variant === activeVariant);

    return (
        <main className="min-h-screen px-4 py-8">
            <div className="mx-auto w-full max-w-2xl">
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {title}
                    </h1>

                    {/* Tiny hint - 仕様書準拠 */}
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        No sign-up. Copy and use it.
                    </p>
                </header>

                {/* Toast - Fixed position at bottom */}
                {toastMessage && (
                    <div
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-zinc-50 dark:text-zinc-900"
                        aria-live="polite"
                    >
                        {toastMessage}
                    </div>
                )}

                {/* Variant Tabs */}
                {variants.length > 1 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {variants.map((variant) => (
                            <TabButton
                                key={variant}
                                label={formatVariant(variant)}
                                isActive={activeVariant === variant}
                                onClick={() => setActiveVariant(variant)}
                            />
                        ))}
                    </div>
                )}

                {/* Active Solution Card */}
                {activeSolution && (
                    <SolutionCardView
                        solution={activeSolution}
                        copyAction={copyAction}
                        feedbackAction={feedbackAction}
                        isCopied={copiedSolutionId === activeSolution.id}
                        hasSubmittedFeedback={feedbackStatus[activeSolution.id] !== null && feedbackStatus[activeSolution.id] !== undefined}
                        submittedFeedbackType={feedbackStatus[activeSolution.id] ?? null}
                    />
                )}

                {/* All Solutions (if no tabs or for reference) */}
                {solutions.length === 0 && (
                    <div className="rounded-2xl border border-zinc-200 p-6 text-base text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                        No solutions available yet.
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
                    Any reply counts. Try it and let us know.
                </footer>
            </div>
        </main>
    );
}