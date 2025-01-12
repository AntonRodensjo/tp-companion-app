import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { CodeInput } from "@/components/inputs/code-input";
import { joinGame } from "@/actions/game";

export default function Home() {
    return (
        <div className="h-screen flex flex-col relative">
            <Button className="ml-auto absolute top-8 right-8">
                Skapa spel
            </Button>
            <div className="flex items-center justify-center flex-grow">
                <Card className="w-5/6 max-w-lg">
                    <form
                        action={joinGame}
                        className="flex flex-col gap-4 text-lg"
                    >
                        <div className="text-xl text-center">
                            Skriv in spelkod
                        </div>
                        <CodeInput length={6} />
                        <Button className="font-bold">Gå med</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
