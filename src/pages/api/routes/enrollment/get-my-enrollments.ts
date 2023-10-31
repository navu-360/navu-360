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

    // get all enrollments for a talent
    // receive: talentId

    // validations: 1) talentId exists

    const { talentId } = req.query as { talentId: string };

    const talent = await prisma.user.findUnique({
      where: {
        id: talentId,
      },
      include: {
        onboardingProgs: true,
      },
    });

    if (!talent) return res.status(400).json({ error: "Talent not found" });

    const talentEnrollments = await prisma.onboardingProgramTalents.findMany({
      where: {
        userId: talentId,
      },
      include: {
        OnboardingProgram: {
          include: {
            ProgramSection: true
          }
        },
      },
      orderBy: {
        enrollmentStatus: "desc",
      },
    });

    return res
      .status(200)
      .json({ message: `Talent enrollments found!`, data: talentEnrollments });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
