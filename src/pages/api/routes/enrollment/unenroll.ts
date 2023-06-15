import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  // unenroll a talent from a program

  // receive: enrollmentId


  try {
    const { enrollmentId } = req.body as {

      enrollmentId: string;
    };

    const talentEnrollment = await prisma.onboardingProgramTalents.findUnique({
      where: {
        id: enrollmentId,
      },
    });

    if (!talentEnrollment)
      return res.status(400).json({ error: "Talent not enrolled in program" });

    // delete enrollment
    const enrollment = await prisma.onboardingProgramTalents.delete({
      where: {
        id: enrollmentId,
      },
    });

    return res
      .status(200)
      .json({ message: `Talent unenrolled!`, data: enrollment });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
