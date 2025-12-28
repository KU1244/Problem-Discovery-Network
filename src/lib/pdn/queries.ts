// FILE: src/lib/pdn/queries.ts

import { prisma } from "@/lib/prisma";
import type {
    ProblemDetail,
    ProblemListItem,
    SolutionItem,
    FeedbackType,
    CopyResponse,
    FeedbackResponse,
} from "@/lib/pdn/types";

type ProblemRowWithSolutions = {
    id: string;
    slug: string;
    title: string;
    scope: string;
    updatedAt: Date;
    solutions: {
        copyCount: number;
        workedCount: number;
    }[];
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

const LENGTH_ORDER: ReadonlyArray<SolutionItem["length"]> = [
    "standard",
    "short",
    "max220",
];

function sortSolutions(a: SolutionItem, b: SolutionItem): number {
    const va = VARIANT_ORDER.indexOf(a.variant);
    const vb = VARIANT_ORDER.indexOf(b.variant);
    if (va !== vb) return va - vb;

    const la = LENGTH_ORDER.indexOf(a.length);
    const lb = LENGTH_ORDER.indexOf(b.length);
    return la - lb;
}

export async function listPublishedProblems(): Promise<ProblemListItem[]> {
    const rows = await prisma.problem.findMany({
        where: { status: "published" },
        select: {
            id: true,
            slug: true,
            title: true,
            scope: true,
            updatedAt: true,
            solutions: {
                where: { status: "published" },
                select: {
                    copyCount: true,
                    workedCount: true,
                },
            },
        },
    });

    const items: ProblemListItem[] = (rows as unknown as ProblemRowWithSolutions[]).map((p) => {
        const copyTotal = p.solutions.reduce((sum, s) => sum + s.copyCount, 0);
        const workedTotal = p.solutions.reduce((sum, s) => sum + s.workedCount, 0);

        return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            scope: p.scope,
            updatedAtIso: p.updatedAt.toISOString(),
            copyTotal,
            workedTotal,
        };
    });

    items.sort((a, b) => {
        if (b.copyTotal !== a.copyTotal) {
            return b.copyTotal - a.copyTotal;
        }
        return new Date(b.updatedAtIso).getTime() - new Date(a.updatedAtIso).getTime();
    });

    return items;
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
        .map((s) => ({
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

export async function incrementCopyCount(solutionId: string): Promise<CopyResponse | null> {
    try {
        const updated = await prisma.solution.update({
            where: { id: solutionId },
            data: { copyCount: { increment: 1 } },
            select: { copyCount: true },
        });
        return { copyCount: updated.copyCount };
    } catch {
        return null;
    }
}

export async function incrementFeedbackCount(
    solutionId: string,
    feedbackType: FeedbackType
): Promise<FeedbackResponse | null> {
    const fieldMap: Record<FeedbackType, string> = {
        tried: "triedCount",
        worked: "workedCount",
        noChange: "noChangeCount",
        needShorter: "needShorterCount",
    };

    const field = fieldMap[feedbackType];
    if (!field) return null;

    try {
        const updated = await prisma.solution.update({
            where: { id: solutionId },
            data: { [field]: { increment: 1 } },
            select: {
                triedCount: true,
                workedCount: true,
                noChangeCount: true,
                needShorterCount: true,
            },
        });

        return {
            counts: {
                triedCount: updated.triedCount,
                workedCount: updated.workedCount,
                noChangeCount: updated.noChangeCount,
                needShorterCount: updated.needShorterCount,
            },
        };
    } catch {
        return null;
    }
}