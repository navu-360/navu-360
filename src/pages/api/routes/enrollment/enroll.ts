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

    // enroll a talent to a programs
    // receive: programId[], talentId, organizationId

    const { programId, talentId, organizationId } = req.body as {
      programId: string[];
      talentId: string;
      organizationId: string;
    };

    const talent = await prisma.user.findUnique({
      where: {
        id: talentId,
      },
    });

    if (!talent) return res.status(400).json({ error: "Talent not found" });

    // create enrollments for each program
    const enrollments = programId.map(async (programId) => {
      return await prisma.onboardingProgramTalents.create({
        data: {
          programId,
          userId: talentId,
          organizationId,
        },
      });
    });

    const enrollment = await Promise.all(enrollments);

    return res
      .status(200)
      .json({ message: `Talent enrolled!`, data: enrollment });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
