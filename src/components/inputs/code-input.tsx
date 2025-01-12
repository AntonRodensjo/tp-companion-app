"use client";

import { useMemo, useRef, useState } from "react";

export function CodeInput({ length }: { length: number }) {
    const [value, setValue] = useState<number | null>(null);
    const digits = useMemo(() => (value ?? []).toString().split(""), [value]);
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    return (
        <label onClick={() => ref.current?.focus()} className="flex flex-col">
            <input
                ref={ref}
                type="text"
                className="h-0 focus:outline-none"
                value={value ?? ""}
                onChange={(event) => {
                    const number = parseInt(
                        event.target.value
                            .replace(/[^\d]/g, "")
                            .slice(0, length)
                    );

                    setValue(Number.isNaN(number) ? null : number);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <div className="text-4xl flex justify-between">
                {[...new Array(length)].map((_, index) => (
                    <div
                        key={index}
                        className={`w-12 text-center border p-2 rounded transition-colors duration-100 ${
                            isFocused
                                ? digits.length == index
                                    ? "border-cyan-600"
                                    : "border-zinc-700"
                                : "border-zinc-800"
                        }`}
                    >
                        {digits[index] ?? (
                            <span className="text-zinc-500">{0}</span>
                        )}
                    </div>
                ))}
            </div>
        </label>
    );
}
