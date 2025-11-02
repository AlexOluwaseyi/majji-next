import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from "next-auth/providers/google"
import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma";
import { generateUsername } from "@/lib/utils";
import type { NextAuthConfig } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    type: "buyer" | "seller";
    isAdmin: boolean;
    rating?: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      verified: boolean;
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
    isAdmin: boolean;
    rating?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
            return null;
          }

          // Fetch user from database by email only
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
              type: credentials.type as "buyer" | "seller",
            },
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            verified: user.verified,
            isAdmin: user.isAdmin,
            type: user.type as "buyer" | "seller",
            rating: user.rating || undefined,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
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
    async jwt({ token, user, trigger, session }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.isAdmin = user.isAdmin;
          token.type = user.type;
          token.rating = user.rating;
        }

        // Handle session updates
        if (trigger === "update" && session) {
          token = { ...token, ...session };
        }

        return token;

      } catch (error) {
        console.error('Error in JWT callback:', error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.isAdmin = token.isAdmin as boolean;
          session.user.type = token.type as "buyer" | "seller";
          session.user.rating = token.rating as number | undefined;
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if user exists, if not create them
        if (profile?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          });

          if (!existingUser) {
            // Create new user with default type as buyer
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || "",
                // verified: profile.verified || false,
                username: generateUsername(profile.email),
                type: "buyer", // Default type for OAuth users
                isAdmin: false,
              }
            });
          }
        }
        return user?.verified === true;
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
    signIn: "/auth",
  },
} satisfies NextAuthConfig);