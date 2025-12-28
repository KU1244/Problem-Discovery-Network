// FILE: src/components/pdn/problems/ProblemsListView.tsx

import Link from "next/link";
import type { ProblemListItem } from "@/lib/pdn/types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
    problems: ProblemListItem[];
};

// -----------------------------------------------------------------------------
// Stats Badge Component
// -----------------------------------------------------------------------------

type StatsBadgeProps = {
    label: string;
    value: number;
};

function StatsBadge({ label, value }: StatsBadgeProps) {
    return (
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">{value}</span>
            <span>{label}</span>
        </span>
    );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function ProblemsListView({ problems }: Props) {
    return (
        <main className="min-h-screen px-4 py-8">
            <div className="mx-auto w-full max-w-2xl">
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Problems
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Copy a template in under 10 seconds. No sign-up required.
                    </p>
                </header>

                {/* Problem List */}
                {problems.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 p-6 text-base text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                        No published problems yet.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {problems.map((problem) => (
                            <li key={problem.id}>
                                <Link
                                    href={`/problems/${problem.slug}`}
                                    className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                                    aria-label={`Open problem: ${problem.title}`}
                                >
                                    {/* Title */}
                                    <div className="text-base font-medium leading-6 text-zinc-900 dark:text-zinc-50">
                                        {problem.title}
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-2 flex flex-wrap items-center gap-4">
                                        <StatsBadge
                                            label="copies"
                                            value={problem.copyTotal}
                                        />
                                        <StatsBadge
                                            label="replies"
                                            value={problem.workedTotal}
                                        />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Footer */}
                <footer className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
                    No sign-up. Copy first.
                </footer>
            </div>
        </main>
    );
}