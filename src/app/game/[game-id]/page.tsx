import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { NumberInput } from "@/components/inputs/number-input";
import { PlayerList } from "@/components/player-list";
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
        !game.players.find((player) => player.id == user.id)
    ) {
        redirect("/");
    }

    const isOwner = user.id == game.ownerId;

    return (
        <div className="p-8">
            <div className="text-3xl text-zinc-500">Kod:</div>
            <div className="text-7xl">{game.joinCode}</div>
            <div className="text-lg font-bold my-2">Spelare:</div>
            <PlayerList
                gameId={game.id}
                initialPlayers={game.players}
                ownerId={game.ownerId}
            />
            {isOwner && (
                <Form
                    action={startGame}
                    className="fixed bottom-0 left-0 w-full p-8 flex flex-col gap-4 bg-zinc-900"
                >
                    <input type="hidden" name="game-id" value={game.id} />
                    <NumberInput
                        label="Antal lag:"
                        defaultValue={Math.min(game.players.length, 6)}
                        min={1}
                        max={Math.min(game.players.length, 6)}
                        name="team-count"
                    />
                    <Button className="w-full">Starta spel</Button>
                </Form>
            )}
        </div>
    );
}
