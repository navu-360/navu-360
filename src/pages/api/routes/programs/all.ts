import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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
      .json({ message: `Unable to get programs.`, error: error });
  }
};

export default handler;
