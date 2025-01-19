import * as cookie from "cookie";

import { ServerSocketEvent, SocketEvent } from "./types/socket";
import { WebSocket, WebSocketServer } from "ws";
import express, { Request, Response } from "express";

import { prisma } from "@/lib/database";

const httpPort = 3002;

const httpServer = express();
httpServer.use(express.json());

const socketPort = 3001;

const socketServer = new WebSocketServer({
    port: socketPort,
});

const connections = new Map<string, WebSocket[]>();

async function authenticate(session: string, socket: WebSocket) {
    const user = (
        await prisma.session.findUnique({
            where: { token: session },
            include: { user: true },
        })
    )?.user;

    if (!user) {
        socket.close();
        return;
    }

    let userConnections = connections.get(user.id);

    if (!userConnections) {
        userConnections = [];
        connections.set(user.id, userConnections);
    }

    userConnections.push(socket);
}

socketServer.on("connection", async (socket, request) => {
    if (!request.headers.cookie) {
        socket.close();
        return;
    }

    const cookies = cookie.parse(request.headers.cookie);

    if (!cookies.session) {
        socket.close();
        return;
    }

    authenticate(cookies.session, socket);
});

httpServer.post("/:event", (req: Request, res: Response) => {
    const event = req.params.event;

    const body = req.body as ServerSocketEvent;

    let targets = connections.entries().toArray();

    if (body.targets) {
        targets = targets.filter(([user]) =>
            body.targets!.find((target) => target == user)
        );
    }

    const targetSockets = targets
        .flatMap(([_, sockets]) => sockets)
        .filter((socket) => socket);

    const socketEvent: SocketEvent = {
        event: event,
        body: req.body.body,
    };

    const socketEventString = JSON.stringify(socketEvent);

    for (const socket of targetSockets) {
        socket.send(socketEventString);
    }

    res.status(200);
});

httpServer.listen(httpPort);
