import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { links } from "./utils/links";

const envSchema = z.object({
  AUTH_GOOGLE_ID: z.string().optional().default(""),
  AUTH_GOOGLE_SECRET: z.string().optional().default(""),
  NEXTAUTH_SECRET: z.string().optional().default("development_secret"),
});

const { success, data: env } = envSchema.safeParse(process.env);

if (!success) {
  throw new Error("Invalid environment variables");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: links.signin.href,
    newUser: links.signup.href,
  },
  secret: env.NEXTAUTH_SECRET,
});
