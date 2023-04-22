import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const invites = await prisma.invites.findMany();

    return res.status(200).json({ message: `Invites fetched`, data: invites });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Unable to get invites.`, error: error });
  }
};

export default handler;
