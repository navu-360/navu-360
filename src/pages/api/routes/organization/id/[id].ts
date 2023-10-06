import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../auth/db";

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

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
      try {
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
      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }
    case "PATCH":
      try {
        const existing = await prisma.organization.findFirst({
          where: {
            userId: session?.user?.id as string,
          },
          select: {
            id: true,
          }
        });
        const { name, industry, website } = req.body;

        const organization = await prisma.organization.update({
          where: {
            id: existing?.id as string,
          },
          data: {
            name,
            industry,
            website,
          },
        });

        return res.status(200).json({ organization });
      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }

    default:
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
