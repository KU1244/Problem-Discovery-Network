// FILE: src/app/api/problems/route.ts

import { NextResponse } from "next/server";
import { listPublishedProblems } from "@/lib/pdn/queries";

export async function GET(): Promise<Response> {
    try {
        const problems = await listPublishedProblems();
        return NextResponse.json({ data: { problems } }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to load problems." },
            { status: 500 }
        );
    }
}
