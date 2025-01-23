"use client";

import { GameRound, Prisma, User } from "@prisma/client";

import { Button } from "./button";
import { Form } from "./form";
import { NumberInput } from "./inputs/number-input";
import { PlayerList } from "./player-list";
import { ServerEvent } from "@/lib/server-event";
import { startGame } from "@/actions/game";
import { useServerEvent } from "@/hooks/use-server-event";
import { useState } from "react";

export function GameView({
    game,
    user,
}: {
    game: Prisma.GameGetPayload<{ include: { players: true; rounds: true } }>;
    user: User;
}) {
    const isOwner = user.id == game.ownerId;

    const [gameRound, setGameRound] = useState<GameRound | null>(
        game.rounds.find((round) => round.active) ?? null
    );

    useServerEvent<{ game: string; round: GameRound }>(
        ServerEvent.StartGameRound,
        (data) => {
            if (game.id != data.game) {
                return;
            }

            setGameRound(data.round);
        }
    );

    if (!gameRound) {
        return (
            <>
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
            </>
        );
    }

    return <>GAME</>;
}
