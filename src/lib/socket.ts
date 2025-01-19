import { ServerSocketEvent } from "@/types/socket";

export function sendSocketEvent(event: string, options?: ServerSocketEvent) {
    fetch(`http://localhost:3002/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
    });
}
