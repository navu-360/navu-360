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

  switch (req.method) {
    case "GET":
      try {
        // fetch template by id
        const { template: id } = req.query as { template: string };

        const template = await prisma.template.findFirst({
          where: {
            id,
          },
        });

        return res.status(200).json({
          data: template,
          message: `Template fetched successfully.`,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: `Unable to get template.`, error: error });
      }

    default:
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
