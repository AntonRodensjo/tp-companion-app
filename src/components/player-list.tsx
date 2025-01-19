"use client";

import { ServerEvent } from "@/types/socket";
import { StarIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import { useServerEvent } from "@/hooks/use-server-event";
import { useState } from "react";

export function PlayerList({
    gameId,
    initialPlayers,
    ownerId,
}: {
    gameId: string;
    initialPlayers: User[];
    ownerId: string;
}) {
    const [players, setPlayers] = useState(initialPlayers);
    useServerEvent<{ game: string; user: User }>(
        ServerEvent.PlayerJoin,
        (data) => {
            setPlayers((previousValue) => [...previousValue, data.user]);
        }
    );

    return (
        <ul className="flex flex-col gap-2">
            {players.map((player) => (
                <li
                    key={player.id}
                    className="bg-zinc-900 rounded px-2 py-1 flex items-center gap-1"
                >
                    {player.id == ownerId && (
                        <StarIcon className="size-5 text-yellow-500" />
                    )}{" "}
                    {player.username}
                </li>
            ))}
        </ul>
    );
}
