import { cookies } from "next/headers";
import { prisma } from "./database";

export async function getUser() {
    const cookie = await cookies();
    const sessionToken = cookie.get("session")?.value;

    if (!sessionToken) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });

    if (!session) {
        return null;
    }

    return session.user;
}
