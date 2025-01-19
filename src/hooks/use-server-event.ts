"use client";

import { ServerEvent, SocketEvent } from "@/types/socket";

import { useEffect } from "react";

let socket: WebSocket | null = null;

export function useServerEvent<T = undefined>(
    event: ServerEvent,
    callback: (message: T) => unknown
) {
    useEffect(() => {
        if (!socket) {
            socket = new WebSocket(
                `${location.protocol == "https:" ? "wss" : "ws"}://${
                    location.hostname
                }:3001`
            );
        }

        function handleMessage(message: MessageEvent) {
            const data = JSON.parse(message.data) as SocketEvent;

            if (data.event != event) {
                return;
            }

            callback(data.body as T);
        }

        socket.addEventListener("message", handleMessage);

        return () => socket!.removeEventListener("message", handleMessage);
    }, []);
}
