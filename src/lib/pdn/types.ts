// FILE: src/lib/pdn/types.ts

export type ProblemStatus = "draft" | "published";

export type SolutionStatus = "draft" | "published";

export type SolutionVariant = "direct" | "friendly" | "professional";

export type SolutionLength = "standard" | "short" | "max220";

export type ProblemListItem = {
    id: string;
    slug: string;
    title: string;
    scope: string;
    updatedAtIso: string;
};

export type SolutionItem = {
    id: string;
    variant: SolutionVariant;
    length: SolutionLength;
    content: string;
};

export type ProblemDetail = {
    id: string;
    slug: string;
    title: string;
    scope: string;
    solutions: SolutionItem[];
};
