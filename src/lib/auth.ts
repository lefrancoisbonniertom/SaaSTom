import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/prisma";
import { authConfig } from "@/lib/auth.config";
import { normalizeEmail, verifyOtp } from "@/lib/server/otp";

declare module "next-auth" {
  interface Session {
    user: { id: string; email?: string | null; name?: string | null };
  }
}

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mot de passe", type: "password" },
    },
    async authorize(credentials) {
      if (
        typeof credentials?.email !== "string" ||
        typeof credentials?.password !== "string"
      )
        return null;

      const user = await prisma.user.findUnique({
        where: { email: normalizeEmail(credentials.email) },
      });

      // Comptes sans mot de passe (créés via Google ou OTP) : pas de connexion mdp.
      if (!user?.password) return null;

      const valid = await bcrypt.compare(credentials.password, user.password);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name };
    },
  }),
  Credentials({
    id: "otp",
    name: "Code email",
    credentials: {
      email: { label: "Email", type: "email" },
      code: { label: "Code", type: "text" },
    },
    async authorize(credentials) {
      if (
        typeof credentials?.email !== "string" ||
        typeof credentials?.code !== "string"
      )
        return null;

      const ok = await verifyOtp(credentials.email, credentials.code);
      if (!ok) return null;

      const email = normalizeEmail(credentials.email);
      const user =
        (await prisma.user.findUnique({ where: { email } })) ??
        (await prisma.user.create({ data: { email, name: email } }));

      return { id: user.id, email: user.email, name: user.name };
    },
  }),
];

// Google n'est activé que si les identifiants OAuth sont configurés.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Pour Google : on crée le compte Orfeo à la volée s'il n'existe pas.
      if (account?.provider === "google") {
        const email = user.email ? normalizeEmail(user.email) : null;
        if (!email) return false;
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: user.name ?? email },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      // À la connexion, on résout l'id DB Orfeo à partir de l'email
      // (indispensable pour Google dont l'id provider ≠ id Orfeo).
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: normalizeEmail(user.email) },
        });
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  session: { strategy: "jwt" },
});
