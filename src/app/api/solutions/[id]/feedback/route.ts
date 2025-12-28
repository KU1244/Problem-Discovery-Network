// FILE: src/app/api/solutions/[id]/feedback/route.ts

import { NextResponse } from "next/server";
import { incrementFeedbackCount } from "@/lib/pdn/queries";
import type { FeedbackType } from "@/lib/pdn/types";

type RouteContext = {
    params: Promise<{ id: string }>;
};

type RequestBody = {
    type?: string;
};

const VALID_FEEDBACK_TYPES: FeedbackType[] = [
    "tried",
    "worked",
    "noChange",
    "needShorter",
];

function isValidFeedbackType(value: unknown): value is FeedbackType {
    return typeof value === "string" && VALID_FEEDBACK_TYPES.includes(value as FeedbackType);
}

export async function POST(
    request: Request,
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

        // Parse request body
        let body: RequestBody;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body." },
                { status: 400 }
            );
        }

        // Validate feedback type
        if (!isValidFeedbackType(body.type)) {
            return NextResponse.json(
                { error: `Invalid feedback type. Must be one of: ${VALID_FEEDBACK_TYPES.join(", ")}` },
                { status: 400 }
            );
        }

        const result = await incrementFeedbackCount(id, body.type);

        if (!result) {
            return NextResponse.json(
                { error: "Solution not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: result }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to record feedback." },
            { status: 500 }
        );
    }
}