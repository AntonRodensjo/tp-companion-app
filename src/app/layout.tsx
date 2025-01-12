import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TP Companion App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="bg-zinc-800 text-zinc-50">{children}</body>
    </html>
  );
}
