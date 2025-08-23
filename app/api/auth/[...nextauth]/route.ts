import NextAuth from "next-auth";
import { authConfig } from "@/lib/config/auth";

export async function GET() {
  return new Response("API is reachable");
}

const handler = NextAuth(authConfig);

export { handler as POST };
