import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db/internal";
import {
  accountsTable,
  sessionsTable,
  userTable,
  whitelistedUsers
} from "../db/schema";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions, getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google Client ID or Secret in environment variables"
  );
}

export const authConfig: AuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: userTable,
    accountsTable: accountsTable,
    sessionsTable: sessionsTable
  }),
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

      user.name = whitelistedUser.name || user.name;
      user.id = whitelistedUser.id || user.id;

      return true;
    },

    async session({ session, user }) {
      if (!session) return session;

      if (user) {
        session.user.id = user.id;
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
  }
};

export const getServerAuthSession = async () => {
  return await getServerSession(authConfig);
};
