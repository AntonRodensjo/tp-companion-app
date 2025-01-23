import { ServerSocketEvent } from "@/types/socket";

export enum ServerEvent {
    PlayerJoin = "player-join",
    StartGameRound = "start-game-round",
}

export function sendServerEvent(event: string, options?: ServerSocketEvent) {
    fetch(`http://localhost:3002/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
    });
}
