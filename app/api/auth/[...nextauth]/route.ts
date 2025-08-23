import NextAuth from "next-auth";
import { authConfig } from "@/lib/config/auth";

export const runtime = "nodejs";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
