import type { GetServerSidePropsContext } from "next";
import type {
  User,
  Awaitable
} from "next-auth";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env/server.mjs";
import { prisma } from "./db";

import Auth0 from "next-auth/providers/auth0";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
      hasBeenOnboarded: boolean;
      position: string;
      customerId: string;
      talentOrgId: string;
      seenWelcomeGuide: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role?: string;
    hasBeenOnboarded?: boolean;
    position?: string;
    customerId?: string;
    talentOrgId?: string;
    seenWelcomeGuide?: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session }) {
      const userObj = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (userObj) {
        session.user.id = userObj?.id ?? "";
        session.user.name = userObj?.name ?? "";
        session.user.image = userObj?.image ?? "";
        session.user.role = userObj?.role ?? "";
        session.user.hasBeenOnboarded = userObj?.hasBeenOnboarded ?? false;
        session.user.position = userObj?.position ?? "";
        session.user.customerId = userObj?.customerId ?? "";
        session.user.talentOrgId = userObj?.talentOrgId ?? "";
        session.user.seenWelcomeGuide = userObj?.seenWelcomeGuide ?? false;
      }

      return session;
    },
  },
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_DOMAIN,
      profile(profile): Awaitable<User> {
        return {
          id: profile.sub as string,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      }
    }),
  ],
  debug: process.env.VERCEL_ENV === "development",
  session: {
    strategy: "jwt",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
