import { ComponentProps } from "react";

export function TextInput({
    label,
    className,
    ...props
}: ComponentProps<"input"> & { label?: string }) {
    return (
        <label className="flex flex-col">
            <span className="text-sm text-zinc-400">{label}</span>
            <input
                type="text"
                className={`${className} bg-transparent border border-zinc-800 rounded px-2 py-1`}
                {...props}
            />
        </label>
    );
}
