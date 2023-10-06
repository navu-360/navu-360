import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../auth/db";

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get one enrollment by id
  try {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }

    const id = req.query.id as string;
    const enrollment = await prisma.onboardingProgramTalents.findUnique({
      where: {
        id,
      },
      include: {
        OnboardingProgram: true,
      },
    });

    return res
      .status(200)
      .json({ message: `Enrollment found!`, data: enrollment });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
