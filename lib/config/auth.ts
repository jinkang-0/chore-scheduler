import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import {
  accountsTable,
  sessionsTable,
  userTable,
  whitelistedUsers
} from "../schema";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { eq } from "drizzle-orm";
import { Adapter } from "next-auth/adapters";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google Client ID or Secret in environment variables"
  );
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET in environment variables");
}

export const authConfig: AuthOptions = {
  adapter: DrizzleAdapter(db, {
    // typecasting to avoid type complaints on RLS
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    usersTable: userTable as any,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    accountsTable: accountsTable as any,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    sessionsTable: sessionsTable as any
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // check if the user's email is whitelisted
      const [whitelistedUser] = await db
        .select()
        .from(whitelistedUsers)
        .where(eq(whitelistedUsers.email, user.email));

      if (!whitelistedUser) {
        return false;
      }

      return true;
    },

    async session({ session, user }) {
      if (!session) return session;

      if (user) {
        session.user = user;
      }

      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET
};
