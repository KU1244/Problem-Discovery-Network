// FILE: src/components/pdn/problem-detail/SolutionCardView.tsx

"use client";

import type { SolutionItem, FeedbackType } from "@/lib/pdn/types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
    solution: SolutionItem;
    copyAction: (solutionId: string, content: string) => void;
    feedbackAction: (solutionId: string, type: FeedbackType) => void;
    isCopied: boolean;
    hasSubmittedFeedback: boolean;
    submittedFeedbackType: FeedbackType | null;
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
// Feedback Button Component
// -----------------------------------------------------------------------------

type FeedbackButtonProps = {
    label: string;
    type: FeedbackType;
    onClick: () => void;
    disabled: boolean;
    isSelected: boolean;
};

function FeedbackButton({ label, onClick, disabled, isSelected }: FeedbackButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                flex-1 min-w-0 px-2 py-2 text-sm font-medium rounded-lg
                transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-zinc-400
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
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

export default function SolutionCardView({
                                             solution,
                                             copyAction,
                                             feedbackAction,
                                             isCopied,
                                             hasSubmittedFeedback,
                                             submittedFeedbackType,
                                         }: Props) {
    const feedbackButtons: { label: string; type: FeedbackType }[] = [
        { label: "Tried it", type: "tried" },
        { label: "Client replied", type: "worked" },
        { label: "No change", type: "noChange" },
        { label: "Need shorter", type: "needShorter" },
    ];

    return (
        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatVariant(solution.variant)}
                </h2>

                <button
                    type="button"
                    onClick={() => copyAction(solution.id, solution.content)}
                    className={`
                        shrink-0 px-5 py-2.5 text-base font-medium rounded-xl
                        shadow-sm transition-all duration-150
                        focus:outline-none focus:ring-2 focus:ring-zinc-400
                        ${isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    }
                    `}
                    aria-label={`Copy ${formatVariant(solution.variant)} template`}
                >
                    {isCopied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* Template Content */}
            <div className="p-4">
                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-900 dark:text-zinc-50">
                        {solution.content}
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="px-4 pb-4">
                <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {hasSubmittedFeedback
                        ? "Thanks for your feedback!"
                        : "How did it go? (once per day)"
                    }
                </p>
                <div className="flex flex-wrap gap-2">
                    {feedbackButtons.map(({ label, type }) => (
                        <FeedbackButton
                            key={type}
                            label={label}
                            type={type}
                            onClick={() => feedbackAction(solution.id, type)}
                            disabled={hasSubmittedFeedback}
                            isSelected={submittedFeedbackType === type}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}