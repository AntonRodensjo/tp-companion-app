"use client";

import { createGame, joinGame } from "@/actions/game";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { CodeInput } from "@/components/inputs/code-input";
import { useActionState } from "react";

export default function Home() {
    const [joinGameResponse, joinGameAction] = useActionState(joinGame, {});

    return (
        <div className="h-screen flex flex-col relative">
            <Button
                onClick={createGame}
                className="ml-auto absolute top-8 right-8"
            >
                Skapa spel
            </Button>
            <div className="flex items-center justify-center flex-grow">
                <Card className="w-11/12 max-w-lg">
                    <form
                        action={joinGameAction}
                        className="flex flex-col gap-4 text-xl"
                    >
                        <div className="text-center">Skriv in spelkod</div>
                        <CodeInput length={6} name="code" />
                        <Button className="font-black">Gå med</Button>
                        {joinGameResponse.error && (
                            <div>{joinGameResponse.message}</div>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
}
