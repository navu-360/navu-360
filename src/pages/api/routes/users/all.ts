import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    Get all talents for an organization
   */
  try {

    // find all users with role of talent
    const users = await prisma.user.findMany({
      where: {
        role: "talent",
      },
      select: {
        id: true,
      }
    });

    return res.status(200).json({ message: `Users found.`, data: users });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
