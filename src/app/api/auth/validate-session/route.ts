import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/database";

export async function POST(request: NextRequest) {
    const sessionToken = await request.text();

    if (!sessionToken) {
        return NextResponse.json(false);
    }

    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
    });

    if (!session) {
        return NextResponse.json(false);
    }

    if (session.expires < new Date()) {
        await prisma.session.delete({ where: { token: sessionToken } });

        return NextResponse.json(false);
    }

    return NextResponse.json(true);
}
