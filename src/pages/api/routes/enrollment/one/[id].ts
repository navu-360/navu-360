import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get one enrollment by id
  try {

    const id = req.query.id as string;
    const enrollment = await prisma.onboardingProgramTalents.findUnique({
      where: {
        id,
      },
      include: {
        OnboardingProgram: {
          include: {
            ProgramSection: true,
            QuizQuestion: true,
          }
        },
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
