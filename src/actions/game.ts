"use server";

import { Prisma, User } from "@prisma/client";
import { Response, error } from "@/lib/response";
import { ServerEvent, sendServerEvent } from "@/lib/server-event";
import { getPublicUser, getUser } from "@/lib/user";

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

    const game = await prisma.game.findUnique({
        where: { joinCode: code },
        include: { players: true },
    });

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

    sendServerEvent(ServerEvent.PlayerJoin, {
        targets: game.players.map((player) => player.id),
        body: { game: game.id, user: getPublicUser(user) },
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
        include: { players: true },
    });

    if (!game) {
        return error("Ingen spel hittades med det givna id:t");
    }

    if (game.ownerId != user.id) {
        return error("Du är inte ägare av spelet");
    }

    const gameRound = await prisma.gameRound.create({
        data: {
            gameId: game.id,
        },
    });

    const teamCount = parseInt(form.get("team-count") as string);

    if (
        Number.isNaN(teamCount) ||
        teamCount < 0 ||
        teamCount > Math.min(game.players.length, 6)
    ) {
        return error("Ogiltigt antal spelare");
    }

    const teamSlots = game.players.map((_, index) => index % teamCount);

    const teams: User[][] = new Array(teamCount).fill([]);

    for (const player of game.players) {
        const slotIndex = Math.floor(Math.random() * teamSlots.length);

        const slot = teamSlots[slotIndex];

        teams[slot].push(player);

        teamSlots.splice(slotIndex, 1);
    }

    for (const team of teams) {
        await prisma.team.create({
            data: {
                roundId: gameRound.id,
                color: "#ff0000",
                players: { connect: team },
            },
        });
    }

    sendServerEvent(ServerEvent.StartGameRound, {
        targets: game.players.map((player) => player.id),
        body: { game: game.id, round: gameRound },
    });

    return {};
}
