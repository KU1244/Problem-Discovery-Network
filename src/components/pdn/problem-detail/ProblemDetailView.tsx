// FILE: src/components/pdn/problem-detail/ProblemDetailView.tsx

"use client";

import type { SolutionItem } from "@/lib/pdn/types";
import SolutionCardView from "@/components/pdn/problem-detail/SolutionCardView";

type Props = {
    title: string;
    scope: string;
    solutions: SolutionItem[];
    action: (solutionId: string, content: string) => void;
    copiedSolutionId: string | null;
    toastMessage: string | null;
};

export default function ProblemDetailView({
                                              title,
                                              scope,
                                              solutions,
                                              action,
                                              copiedSolutionId,
                                              toastMessage,
                                          }: Props) {
    return (
        <main className="min-h-screen px-4 py-8">
            <div className="mx-auto w-full max-w-2xl">
                <header className="mb-6">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Scope: {scope}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
                    <p className="mt-2 text-base text-zinc-600 dark:text-zinc-300">
                        Copy first, then send it.
                    </p>
                </header>

                {toastMessage ? (
                    <div
                        className="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        aria-live="polite"
                    >
                        {toastMessage}
                    </div>
                ) : null}

                <div className="space-y-4">
                    {solutions.map((s) => (
                        <SolutionCardView
                            key={s.id}
                            solution={s}
                            action={action}
                            isCopied={copiedSolutionId === s.id}
                        />
                    ))}
                </div>

                <footer className="mt-8 text-sm text-zinc-600 dark:text-zinc-300">
                    No sign-up. Copy first.
                </footer>
            </div>
        </main>
    );
}
