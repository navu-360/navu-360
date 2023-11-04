import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";
import { getServerSession } from "next-auth";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {

      const id = req.query.id as string;

      const invite = await prisma.invites.findUnique({
        where: {
          id,
        },
      });

      // from invite.orgId, get organization details. From organization.userId get user details
      if (!invite) return res.status(404).json({ message: `Invite not found.` });

      const organization = await prisma.organization.findUnique({
        where: {
          id: invite.orgId!,
        },
        include: {
          user: true,
        },
      });

      return res.status(200).json({ message: `Invite fetched.`, data: { ...invite, ...organization } });
    } catch (error) {
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }
    try {
      const id = req.query.id as string;

      const invite = await prisma.invites.findUnique({
        where: {
          email: id.toLowerCase(),
        },
      });

      if (!invite) return res.status(404).json({ message: `Invite not found.` });

      await prisma.invites.delete({
        where: {
          email: id,
        },
      });

      return res.status(200).json({ message: `Invite deleted.` });
    } catch (error) {
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  res.status(405).json({ message: `Method ${req.method} not allowed.` });

};

export default handler;
