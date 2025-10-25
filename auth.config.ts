import type { NextAuthConfig } from 'next-auth';
import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from "next-auth/providers/google"
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    verified?: boolean;
    type: "buyer" | "seller";
    isAdmin: boolean;
    rating?: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      verified?: boolean
      type: "buyer" | "seller";
      image?: string
      isAdmin: boolean
      rating?: number;
    };
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    type: "buyer" | "seller";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'Type', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.type) {
            return null
          }

          // Fetch user from database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
              type: credentials.type as "buyer" | "seller"
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            emailVerified: user.verified,
            isAdmin: user.isAdmin,
            type: user.type,
            rating: user.rating as number,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          throw new Error("Authorization failed");
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },

  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },

  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.isAdmin = user.isAdmin;
          token.type = user.type;
        }

        return token;

      } catch (error) {
        console.error('Error in JWT callback:', error);
        throw new Error("Token processing error");
      }
    },

    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.isAdmin = token.isAdmin as boolean;
          session.user.type = token.type as "buyer" | "seller";
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        throw new Error("Session processing error");
      }
    },

    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email_verified === true;
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
} satisfies NextAuthConfig);
