"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export function NumberInput({
    defaultValue,
    name,
    min,
    max,
    onChange,
    label,
    className,
}: {
    defaultValue?: number;
    name?: string;
    min?: number;
    max?: number;
    onChange?: (value: number) => unknown;
    label?: string;
    className?: string;
}) {
    const [value, setValue] = useState(defaultValue ?? 0);

    useEffect(() => {
        if (Number.isNaN(value)) {
            return;
        }

        if (onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    function decrement() {
        setValue((previousValue) =>
            min != undefined
                ? Math.max(previousValue - 1, min)
                : previousValue - 1
        );
    }

    function increment() {
        setValue((previousValue) =>
            max != undefined
                ? Math.min(previousValue + 1, max)
                : previousValue + 1
        );
    }

    function set(requestValue: number) {
        if (requestValue == value) {
            return;
        }

        if (Number.isNaN(requestValue)) {
            setValue(requestValue);
        }

        let newValue = requestValue;

        if (min) {
            newValue = Math.max(newValue, min);
        }

        if (max) {
            newValue = Math.min(newValue, max);
        }

        setValue(newValue);
    }

    return (
        <div>
            <div className="text-sm">{label}</div>
            <div
                className={`${className} flex items-center px-2 py-1 rounded border border-zinc-800`}
            >
                <button onClick={decrement} type="button">
                    <MinusIcon className="size-5" />
                </button>
                <input
                    type="number"
                    value={Number.isNaN(value) ? "" : value}
                    name={name}
                    onChange={(event) => set(parseInt(event.target.value))}
                    className="text-center bg-transparent px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                />
                <button onClick={increment} type="button">
                    <PlusIcon className="size-5" />
                </button>
            </div>
        </div>
    );
}
