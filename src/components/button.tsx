import { ComponentProps } from "react";

export function Button({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button className={`bg-cyan-700 rounded p-2 ${className}`} {...props}>
      {children}
    </button>
  );
}
