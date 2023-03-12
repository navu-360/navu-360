import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    API endpoint to 1) create a new organization. POST request
    */

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  switch (req.method) {
    case "GET":
      // fetch organization created by user
      const { userId } = req.query as { userId: string };

      const organization = await prisma.organization.findFirst({
        where: {
          userId,
        },
      });

      return res.status(200).json({ organization });

    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
