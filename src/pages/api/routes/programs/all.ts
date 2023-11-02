import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }
    const programs = await prisma.onboardingProgram.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .json({ message: `Programs fetched.`, data: programs });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
