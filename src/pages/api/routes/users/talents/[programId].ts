import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    Get all talents for a program
    */

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  try {
    const { programId } = req.query as { programId: string };

    const talents = await prisma.onboardingProgramTalents.findMany({
      where: {
        programId,
      },
    });

    return res.status(200).json({ message: `Talents found.`, data: talents });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
