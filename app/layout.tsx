import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import SessionProviderClient from "@/context/session";
import { authConfig } from "@/lib/config/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chore Scheduler",
  description: "A simple chore scheduling app"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className={`antialiased w-full h-svh`}>
        <SessionProviderClient session={session}>
          {children}
        </SessionProviderClient>
      </body>
    </html>
  );
}
