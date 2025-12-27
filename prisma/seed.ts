// FILE: prisma/seed.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient(): PrismaClient {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing. Please set it in your .env file.");
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
    // Delete existing data (for clean seed)
    await prisma.solution.deleteMany();
    await prisma.problem.deleteMany();

    // Create first Problem
    const problem = await prisma.problem.create({
        data: {
            slug: "upwork-proposals-no-replies",
            title: "Upwork proposals get no replies",
            scope: "upwork",
            status: "published",
        },
    });

    // Create 3 Solutions (Direct / Friendly / Professional)
    await prisma.solution.createMany({
        data: [
            {
                problemId: problem.id,
                variant: "direct",
                length: "standard",
                status: "published",
                content: `I read your job post about [specific task]. You need [restate goal in one sentence].

I've done this before — [one concrete proof or example].

Here's what I'd do first: [one specific next step].

Quick question: [one short question about their project]

Let me know if you'd like to discuss.`,
            },
            {
                problemId: problem.id,
                variant: "friendly",
                length: "standard",
                status: "published",
                content: `Hi! Your project caught my eye — [specific thing that stood out].

It sounds like you're looking for [restate their goal]. I've helped clients with similar challenges, like [brief example].

If we work together, I'd start by [one clear first step].

I'm curious: [friendly question about their situation]

Would love to chat if this sounds like a fit!`,
            },
            {
                problemId: problem.id,
                variant: "professional",
                length: "standard",
                status: "published",
                content: `Thank you for posting this opportunity. Based on your requirements for [specific task], I understand you need [restate objective].

My background includes [relevant experience or credential]. A recent example: [brief case or result].

My proposed approach would begin with [concrete first step].

To ensure alignment: [professional clarifying question]

I welcome the opportunity to discuss how I can contribute to your project.`,
            },
        ],
    });

    console.log("✅ Seed completed!");
    console.log(`   Problem: ${problem.title}`);
    console.log(`   Solutions: 3 variants created`);
}

main()
    .catch((e: unknown) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
