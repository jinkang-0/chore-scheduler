import NextAuth from "next-auth";
import { User as DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User extends DefaultUser {
    whitelist_id: string;
    is_onboarded: boolean;
  }
}
