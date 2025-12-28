// FILE: src/lib/pdn/types.ts

export type ProblemStatus = "draft" | "published";

export type SolutionStatus = "draft" | "published";

export type SolutionVariant = "direct" | "friendly" | "professional";

export type SolutionLength = "standard" | "short" | "max220";

export type FeedbackType = "tried" | "worked" | "noChange" | "needShorter";

export type ProblemListItem = {
    id: string;
    slug: string;
    title: string;
    scope: string;
    updatedAtIso: string;
    copyTotal: number;
    workedTotal: number;
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

export type CopyResponse = {
    copyCount: number;
};

export type FeedbackResponse = {
    counts: {
        triedCount: number;
        workedCount: number;
        noChangeCount: number;
        needShorterCount: number;
    };
};

export type FeedbackRequest = {
    type: FeedbackType;
};