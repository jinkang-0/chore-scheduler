import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/config/auth";
import SessionProviderClient from "@/context/session";

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
