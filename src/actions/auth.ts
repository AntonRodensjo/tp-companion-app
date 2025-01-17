"use server";

import { Response, error } from "@/lib/response";

import { cookies } from "next/headers";
import { createHash } from "crypto";
import { prisma } from "@/lib/database";
import { redirect } from "next/navigation";

async function createSession(username: string) {
    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) {
        return;
    }

    // In 30 days
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    try {
        const session = await prisma.session.create({
            data: { userId: user.id, expires },
        });

        const cookie = await cookies();
        cookie.set("session", session.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            expires: expires,
        });
    } catch (_) {
        return false;
    }

    return true;
}

export async function signUp(_: Response, form: FormData) {
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    if (!username || !password) {
        return error("Användarnamn eller lösenord saknas");
    }

    if (await prisma.user.findUnique({ where: { username: username } })) {
        return error("Användare finns redan");
    }
    const saltArray = new Int8Array(32);
    crypto.getRandomValues(saltArray);

    const salt = Buffer.from(saltArray.buffer).toString("base64");

    const hash = createHash("sha256")
        .update(`${salt}${password}`)
        .digest("base64");

    try {
        await prisma.user.create({ data: { username, salt, hash } });
    } catch (_) {
        return error("Misslyckades att skapa användare");
    }

    const session = await createSession(username);

    if (!session) {
        return error("Misslyckades att logga in, försök igen senare");
    }

    redirect("/");
}

export async function signIn(_: Response, form: FormData) {
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    if (!username || !password) {
        return error("Användarnamn eller lösenord saknas");
    }

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) {
        return error("Fel användarnamn eller lösenord");
    }

    const hash = createHash("sha256")
        .update(`${user.salt}${password}`)
        .digest("base64");

    if (hash != user.hash) {
        return error("Fel användarnamn eller lösenord");
    }

    const session = await createSession(username);

    if (!session) {
        return error("Misslyckades att logga in, försök igen senare");
    }

    redirect("/");
}
