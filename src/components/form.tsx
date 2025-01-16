"use client";

import { ComponentProps, useActionState } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Response } from "@/lib/response";

export function Form({
    children,
    action,
    ...props
}: Omit<ComponentProps<"form">, "action"> & {
    action: (_: Response, form: FormData) => Promise<Response>;
}) {
    const [response, formAction] = useActionState(action, {});

    return (
        <form {...props} action={formAction}>
            {children}

            {response.error && (
                <div className="text-red-500 flex items-center gap-2">
                    <ExclamationCircleIcon className="size-5" />{" "}
                    {response.message}
                </div>
            )}
        </form>
    );
}
