import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { NumberInput } from "@/components/inputs/number-input";
import { StarIcon } from "@heroicons/react/20/solid";
import { getUser } from "@/lib/user";
import { prisma } from "@/lib/database";
import { redirect } from "next/navigation";
import { startGame } from "@/actions/game";

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

    const isOwner = user.id == game.ownerId;

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
            <div className="text-lg font-bold my-2">Spelare:</div>
            <ul className="flex flex-col gap-2">
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
            {isOwner && (
                <Form
                    action={startGame}
                    className="fixed bottom-0 left-0 w-full p-8 flex flex-col gap-4 bg-zinc-900"
                >
                    <input type="hidden" name="game-id" value={game.id} />
                    <NumberInput
                        label="Antal lag:"
                        defaultValue={Math.min(players.length, 6)}
                        min={1}
                        max={6}
                        name="teams"
                    />
                    <Button className="w-full">Starta spel</Button>
                </Form>
            )}
        </div>
    );
}
