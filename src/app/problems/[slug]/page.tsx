// FILE: src/app/problems/[slug]/page.tsx

import { notFound } from "next/navigation";
import ProblemDetail from "@/components/pdn/problem-detail/ProblemDetail";
import { getPublishedProblemBySlug } from "@/lib/pdn/queries";

export const dynamic = "force-dynamic";

type Props = {
    // Next.js 16+ で Promise 扱いになるケースがあるため await で吸収します
    params: { slug: string } | Promise<{ slug: string }>;
};

export default async function ProblemDetailPage({ params }: Props) {
    const { slug } = await params;

    const problem = await getPublishedProblemBySlug(slug);

    if (!problem) notFound();

    return (
        <ProblemDetail
            title={problem.title}
            scope={problem.scope}
            solutions={problem.solutions}
        />
    );
}
