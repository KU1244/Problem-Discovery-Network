// FILE: src/app/api/solutions/[id]/copy/route.ts

import { NextResponse } from "next/server";
import { incrementCopyCount } from "@/lib/pdn/queries";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(
    _request: Request,
    context: RouteContext
): Promise<Response> {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Solution ID is required." },
                { status: 400 }
            );
        }

        const result = await incrementCopyCount(id);

        if (!result) {
            return NextResponse.json(
                { error: "Solution not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: result }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to record copy." },
            { status: 500 }
        );
    }
}