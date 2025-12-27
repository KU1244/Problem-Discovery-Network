// FILE: src/app/problems/[slug]/page.tsx

import { notFound } from "next/navigation";
import ProblemDetail from "@/components/pdn/problem-detail/ProblemDetail";
import { getPublishedProblemBySlug } from "@/lib/pdn/queries";

export const dynamic = "force-dynamic";

type Props = {
    params: { slug: string };
};

export default async function ProblemDetailPage({ params }: Props) {
    const problem = await getPublishedProblemBySlug(params.slug);

    if (!problem) notFound();

    return (
        <ProblemDetail
            title={problem.title}
            scope={problem.scope}
            solutions={problem.solutions}
        />
    );
}
