// FILE: src/lib/pdn/queries.ts

import { prisma } from "@/lib/prisma";
import type { ProblemDetail, ProblemListItem, SolutionItem } from "@/lib/pdn/types";

type ProblemRow = {
    id: string;
    slug: string;
    title: string;
    scope: string;
    updatedAt: Date;
};

type SolutionRow = {
    id: string;
    variant: SolutionItem["variant"];
    length: SolutionItem["length"];
    content: string;
};

const VARIANT_ORDER: ReadonlyArray<SolutionItem["variant"]> = [
    "direct",
    "friendly",
    "professional",
];

function sortSolutions(a: SolutionItem, b: SolutionItem): number {
    const va = VARIANT_ORDER.indexOf(a.variant);
    const vb = VARIANT_ORDER.indexOf(b.variant);
    if (va !== vb) return va - vb;

    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    return 0;
}

export async function listPublishedProblems(): Promise<ProblemListItem[]> {
    const rows = await prisma.problem.findMany({
        where: { status: "published" },
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            slug: true,
            title: true,
            scope: true,
            updatedAt: true,
        },
    });

    return (rows as unknown as ProblemRow[]).map((p: ProblemRow) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        scope: p.scope,
        updatedAtIso: p.updatedAt.toISOString(),
    }));
}

export async function getPublishedProblemBySlug(
    slug: string
): Promise<ProblemDetail | null> {
    const row = await prisma.problem.findFirst({
        where: { slug, status: "published" },
        select: {
            id: true,
            slug: true,
            title: true,
            scope: true,
            solutions: {
                where: { status: "published" },
                select: {
                    id: true,
                    variant: true,
                    length: true,
                    content: true,
                },
            },
        },
    });

    if (!row) return null;

    const solutions = (row.solutions as unknown as SolutionRow[])
        .map((s: SolutionRow) => ({
            id: s.id,
            variant: s.variant,
            length: s.length,
            content: s.content,
        }))
        .sort(sortSolutions);

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        scope: row.scope,
        solutions,
    };
}
