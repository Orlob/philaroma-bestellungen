import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import CredentialsProvider from "next-auth/providers/credentials";

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

interface Customer {
  name: string;
  password: string;
  gln: string;
}

// Hilfsfunktion zum Überprüfen des Passworts
function checkPassword(password: string): { id: string; name: string; gln: string } | null {
  try {
    const decodedPassword = decodeURIComponent(password);
    
    // Versuche zuerst das alte Format
    const customerPasswords = process.env.CUSTOMER_PASSWORDS?.split(',') || [];
    
    for (const entry of customerPasswords) {
      const [name, validPassword] = entry.split(':');
      if (decodedPassword === validPassword) {
        return {
          id: name,
          name: name,
          gln: "4063451000012" // Fallback GLN für altes Format
        };
      }
    }
    
    // Wenn altes Format nicht erfolgreich, versuche neues JSON Format
    const customersRaw = process.env.CUSTOMERS || '[]';
    const customers: Customer[] = JSON.parse(customersRaw);
    
    // Suche nach Kunde mit passendem Passwort
    const customer = customers.find(c => c.password === decodedPassword);
    
    if (customer) {
      return {
        id: customer.name,
        name: customer.name,
        gln: customer.gln
      };
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen des Passworts:', error);
  }
  
  return null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Passwort", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;
        const user = checkPassword(credentials.password);
        if (user) {
          return {
            id: user.id,
            name: user.name,
            gln: user.gln,
            email: null,
            image: null
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.gln = user.gln;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.gln = token.gln as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
