import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    Get organization created by user
    */

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  switch (req.method) {
    case "GET":
      // fetch organization created by user
      const { id } = req.query as { id: string };

      const organization = await prisma.organization.findFirst({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      return res.status(200).json({ organization });

    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
