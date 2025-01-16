import { StarIcon } from "@heroicons/react/20/solid";
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

    const players = (
        await prisma.userInGame.findMany({
            where: { gameId: game.id },
            include: { user: true },
        })
    ).map((userInGame) => userInGame.user);

    return (
        <div className="p-8">
            <div className="text-3xl text-zinc-500">Kod:</div>
            <div className="text-7xl">{game.joinCode}</div>
            <div className="text-lg font-bold mb-2">Spelare:</div>
            <ul className="flex flex-col gap-2 max-h-64 overflow-auto">
                {players.map((player) => (
                    <li
                        key={player.id}
                        className="bg-zinc-900 rounded px-2 py-1 flex items-center gap-1"
                    >
                        {player.id == game.ownerId && (
                            <StarIcon className="size-5 text-yellow-500" />
                        )}{" "}
                        {player.username}
                    </li>
                ))}
            </ul>
        </div>
    );
}
