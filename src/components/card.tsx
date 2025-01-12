import { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-zinc-900 p-8 rounded ${className}`}>{children}</div>
  );
}
