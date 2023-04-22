import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get one enrollment by id
  try {
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
      .json({ message: `Unable to get enrollment.`, error: error });
  }
};

export default handler;
