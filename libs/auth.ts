import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        return checkPassword(credentials.password);
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