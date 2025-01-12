import { getUser } from "@/lib/user";
import { prisma } from "@/lib/database";
import { redirect } from "next/navigation";

export default async function Game({
    params,
}: {
    params: Promise<{ "game-id": string }>;
}) {
    const gameId = (await params)["game-id"];
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { players: true },
    });
    const user = await getUser();

    if (
        !user ||
        !game ||
        !game.players.find((player) => player.userId == user.id)
    ) {
        redirect("/");
    }

    return (
        <div className="p-8">
            <div className="text-3xl text-zinc-500">Kod:</div>
            <div className="text-7xl">{game?.joinCode}</div>
        </div>
    );
}
