"use server";

import { Response, error } from "@/lib/response";

import { getUser } from "@/lib/user";
import { prisma } from "@/lib/database";
import { redirect } from "next/navigation";

export async function createGame() {
    const user = await getUser();

    if (!user) {
        redirect("/auth");
    }

    let code: number;

    do {
        code = Math.floor(Math.random() * 1000000);
    } while (await prisma.game.findUnique({ where: { joinCode: code } }));

    const game = await prisma.game.create({
        data: { ownerId: user.id, joinCode: code },
    });

    await prisma.userInGame.create({
        data: { gameId: game.id, userId: user.id },
    });

    redirect(`/game/${game.id}`);
}

export async function joinGame(_: Response, form: FormData) {
    const codeString = form.get("code") as string;
    const code = parseInt(codeString);

    if (Number.isNaN(code) || codeString.length != 6) {
        return error("Felaktigt format på koden");
    }

    const game = await prisma.game.findUnique({ where: { joinCode: code } });

    if (!game) {
        return error("Det finns inget spel med den koden");
    }

    const user = await getUser();

    if (!user) {
        return error("Du är inte inloggad");
    }

    await prisma.userInGame.create({
        data: { gameId: game.id, userId: user.id },
    });

    redirect(`/game/${game.id}`);
}
