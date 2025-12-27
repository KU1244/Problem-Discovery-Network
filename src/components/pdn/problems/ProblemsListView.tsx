// FILE: src/components/pdn/problems/ProblemsListView.tsx

import Link from "next/link";
import type { ProblemListItem } from "@/lib/pdn/types";

type Props = {
    problems: ProblemListItem[];
};

export default function ProblemsListView({ problems }: Props) {
    return (
        <main className="min-h-screen px-4 py-8">
            <div className="mx-auto w-full max-w-2xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
                    <p className="mt-2 text-base text-zinc-600 dark:text-zinc-300">
                        Copy a template in under 10 seconds.
                    </p>
                </header>

                {problems.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 p-6 text-base text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                        No published problems yet.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {problems.map((p) => (
                            <li key={p.id}>
                                <Link
                                    href={`/problems/${p.slug}`}
                                    className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
                                    aria-label={`Open problem: ${p.title}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-base font-medium leading-6 text-zinc-900 dark:text-zinc-50">
                                                {p.title}
                                            </div>
                                            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                                Scope: {p.scope}
                                            </div>
                                        </div>

                                        <div className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                                            Open
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <footer className="mt-8 text-sm text-zinc-600 dark:text-zinc-300">
                    No sign-up. Copy first.
                </footer>
            </div>
        </main>
    );
}
