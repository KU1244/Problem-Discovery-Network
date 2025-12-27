// FILE: src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        // Fail fast with a clear message; otherwise Prisma throws a less actionable error.
        throw new Error("DATABASE_URL is missing. Please set it in your .env file.");
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = prisma;
}
