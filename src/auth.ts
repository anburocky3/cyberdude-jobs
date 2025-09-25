import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LinkedIn,
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin || !admin.isActive) return null;

        const ok = await bcrypt.compare(password, admin.passwordHash);

        if (!ok) return null;

        const user: User = {
          id: String(admin.id),
          email: admin.email,
          name: admin.name || "Admin",
        } as unknown as User;
        // Attach marker for jwt callback via a parallel object
        (user as unknown as { isAdmin?: boolean }).isAdmin = true;
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as { isAdmin?: boolean }).isAdmin) {
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin === true;
      }
      return session;
    },
  },
});
