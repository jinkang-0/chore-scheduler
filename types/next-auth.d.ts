import type { User as DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User extends DefaultUser {
    whitelist_id: string;
    is_onboarded: boolean;
    email_notifications: boolean;
  }
}
