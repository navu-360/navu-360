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

  try {
    const orgId = req.query.orgId as string;

    if (!orgId && orgId === "undefined")
      return res.status(400).json({ error: "Missing required fields" });

    const invites = await prisma.invites.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        orgId: orgId,
      },
    });

    return res.status(200).json({ message: `Invites found.`, data: invites });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
