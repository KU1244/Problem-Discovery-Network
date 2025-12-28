// FILE: src/app/problems/page.tsx

import ProblemsListView from "@/components/pdn/problems/ProblemsListView";
import { listPublishedProblems } from "@/lib/pdn/queries";

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
    const problems = await listPublishedProblems();

    return <ProblemsListView problems={problems} />;
}