import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    gln: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      gln: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    gln: string;
  }
}
