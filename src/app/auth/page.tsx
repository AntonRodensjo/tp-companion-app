"use client";

import { ComponentProps, ReactNode, useActionState, useState } from "react";
import { signIn, signUp } from "@/actions/auth";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TextInput } from "@/components/inputs/text-input";

enum AuthPageState {
    SignUp,
    SignIn,
}

function AuthStateButton({
    children,
    active,
    ...props
}: ComponentProps<"button"> & {
    children?: ReactNode;
    active?: boolean;
}) {
    return (
        <button
            className={`${active ? "text-zinc-50" : "text-zinc-500"} relative`}
            {...props}
        >
            {children}
            <div
                className={`${
                    active ? "w-full" : "w-0"
                } transition-[width] h-0.5 absolute top-full left-0 bg-cyan-700`}
            />
        </button>
    );
}

export default function Auth() {
    const [pageState, setPageState] = useState<AuthPageState>(
        AuthPageState.SignUp
    );
    const [signUpResponse, signUpAction] = useActionState(signUp, {});
    const [signInResponse, signInAction] = useActionState(signIn, {});

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="flex flex-col gap-8 p-16">
                <div className="text-xl flex gap-8">
                    <AuthStateButton
                        active={pageState == AuthPageState.SignUp}
                        onClick={() => setPageState(AuthPageState.SignUp)}
                    >
                        Skapa konto
                    </AuthStateButton>
                    <AuthStateButton
                        active={pageState == AuthPageState.SignIn}
                        onClick={() => setPageState(AuthPageState.SignIn)}
                    >
                        Logga in
                    </AuthStateButton>
                </div>
                <form
                    action={
                        pageState == AuthPageState.SignUp
                            ? signUpAction
                            : signInAction
                    }
                    className="flex flex-col gap-4"
                >
                    <TextInput label="Användarnamn" name="username" required />
                    <TextInput
                        type="password"
                        label="Lösenord"
                        name="password"
                        required
                    />
                    <Button type="submit">
                        {pageState == AuthPageState.SignUp
                            ? "Skapa konto"
                            : "Logga in"}
                    </Button>
                    <div>
                        {pageState == AuthPageState.SignUp
                            ? signUpResponse.message
                            : signInResponse.message}
                    </div>
                </form>
            </Card>
        </div>
    );
}
