import { Button, ButtonLink } from "@/components/button";
import { createGame, joinGame } from "@/actions/game";

import { Card } from "@/components/card";
import { CodeInput } from "@/components/inputs/code-input";
import { Form } from "@/components/form";
import { getUser } from "@/lib/user";
import { prisma } from "@/lib/database";

export default async function Home() {
    const user = await getUser();

    if (!user) {
        return;
    }

    const games = (
        await prisma.userInGame.findMany({
            where: { userId: user.id },
            include: { game: { include: { owner: true } } },
        })
    ).map((userInGame) => userInGame.game);

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
                    <Form
                        action={joinGame}
                        className="flex flex-col gap-4 text-xl"
                    >
                        <div className="text-center">Skriv in spelkod</div>
                        <CodeInput length={6} name="code" />
                        <Button className="font-black">Gå med</Button>
                    </Form>
                    {games.length > 0 && (
                        <div className="mt-4">
                            <div className="text-lg">
                                Eller fortsätt med ett tidigare spel:
                            </div>
                            <ul className="flex flex-col gap-4">
                                {games.map((game) => (
                                    <li
                                        key={game.id}
                                        className="flex justify-between items-center"
                                    >
                                        <div>{game.owner.username}</div>
                                        <div>{game.joinCode}</div>
                                        <ButtonLink href={`/game/${game.id}`}>
                                            Gå med
                                        </ButtonLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
