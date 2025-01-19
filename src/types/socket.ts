export interface ServerSocketEvent {
    targets?: string[];
    body?: unknown;
}

export interface SocketEvent {
    event: string;
    body?: string;
}

export enum ServerEvent {
    PlayerJoin = "player-join",
}
