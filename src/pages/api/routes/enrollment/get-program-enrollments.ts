import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }

    // get all enrollments for a program
    // receive: programId

    // validations: 1) programId exists

    const { programId } = req.query as { programId: string };

    const program = await prisma.onboardingProgram.findUnique({
      where: {
        id: programId,
      },
    });

    if (!program) return res.status(400).json({ error: "Program not found" });

    const programEnrollments = await prisma.onboardingProgramTalents.findMany({
      where: {
        programId: programId,
      },
      include: {
        User: true,
      },
    });

    return res
      .status(200)
      .json({
        message: `Program enrollments found!`,
        data: programEnrollments,
      });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
