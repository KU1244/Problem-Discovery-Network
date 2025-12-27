// FILE: src/components/pdn/problem-detail/SolutionCardView.tsx

"use client";

import type { SolutionItem } from "@/lib/pdn/types";

type Props = {
    solution: SolutionItem;
    action: (solutionId: string, content: string) => void;
    isCopied: boolean;
};

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

export default function SolutionCardView({ solution, action, isCopied }: Props) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatVariant(solution.variant)}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        Length: {solution.length}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => action(solution.id, solution.content)}
                    className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2 text-base font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-50 dark:text-zinc-900"
                    aria-label={`Copy ${formatVariant(solution.variant)} template`}
                >
                    {isCopied ? "Copied" : "Copy"}
                </button>
            </div>

            <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
                <div className="whitespace-pre-wrap break-words">{solution.content}</div>
            </div>
        </section>
    );
}
