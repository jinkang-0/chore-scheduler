import NextAuth from "next-auth";
import { authConfig } from "@/lib/config/auth";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google Client ID or Secret in environment variables"
  );
}

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
