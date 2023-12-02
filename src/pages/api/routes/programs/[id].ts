import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

import * as Sentry from "@sentry/nextjs";

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  if (req.method === "GET") {
    try {
      const program = await prisma.onboardingProgram.findUnique({
        where: {
          id,
        },
        include: {
          QuizQuestion: true,
          ProgramSection: {
            orderBy: {
              createdAt: "asc"
            }
          },
        },
        // cacheStrategy: {
        //   ttl: 60,
        //   swr: 10,
        // },
      });

      let user = null;

      // from field program.createdBy , get user
      if (program?.createdBy) {
        user = await prisma.user.findUnique({
          where: {
            id: program.createdBy,
          },
          // cacheStrategy: {
          //   ttl: 60,
          //   swr: 10,
          // },
          select: {
            name: true,
            id: true
          }
        });
      }


      return res
        .status(200)
        .json({ message: `Program fetched.`, data: { ...program, creator: { name: user?.name, id: user?.id } } });
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }
    try {
      const program = await prisma.onboardingProgram.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: `Program deleted.`, data: program });
    } catch (error) {
      Sentry.captureException(error);
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  if (req.method === "PATCH") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }
    try {
      const { name, description, imageLink, categories } = req.body as {
        name: string;
        description: string;
        imageLink: string;
        categories: string[];
      };

      const program = await prisma.onboardingProgram.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          image: imageLink,
          categories
        },
      });

      return res
        .status(200)
        .json({ message: `Program updated.`, data: program });
    } catch (error) {
      Sentry.captureException(error);
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  res.status(405).json({ message: `Method ${req.method} not allowed.` });
};

export default handler;
