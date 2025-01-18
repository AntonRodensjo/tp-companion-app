"use server";

import { Prisma, User } from "@prisma/client";
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

    await prisma.game.update({
        where: { id: game.id },
        data: { players: { connect: { id: user.id } } },
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

    await prisma.game.update({
        where: { id: game.id },
        data: { players: { connect: { id: user.id } } },
    });

    redirect(`/game/${game.id}`);
}

export async function startGame(_: Response, form: FormData) {
    const user = await getUser();

    if (!user) {
        return error("Ej inloggad");
    }

    const gameId = form.get("game-id") as string;

    if (!gameId) {
        return error("Ingen spel-id gavs");
    }

    const game = await prisma.game.findUnique({
        where: { id: gameId },
    });

    if (!game) {
        return error("Ingen spel hittades med det givna id:t");
    }

    if (game.ownerId != user.id) {
        return error("Du är inte ägare av spelet");
    }

    const players = await prisma.user.findMany({
        where: { games: { some: { id: gameId } } },
    });

    const teamCount = parseInt(form.get("team-count") as string);

    if (
        Number.isNaN(teamCount) ||
        teamCount < 0 ||
        teamCount > Math.min(players.length, 6)
    ) {
        return error("Ogiltigt antal spelare");
    }

    const teamSlots = players.map((_, index) => index % teamCount);

    const teams: Prisma.TeamCreateInput[] = new Array(teamCount).fill({
        players: [],
    });

    for (const player of players) {
        const slotIndex = Math.floor(Math.random() * teamSlots.length);

        const slot = teamSlots[slotIndex];

        (teams[slot].players as User[]).push(player);

        teamSlots.splice(slotIndex, 1);
    }

    for (const team of teams) {
        await prisma.team.create({ data: team });
    }

    return {};
}
