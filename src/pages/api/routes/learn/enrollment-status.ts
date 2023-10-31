import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "auth/auth";
import { prisma } from "auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }

    // get events for a talent for certain program. Required fields: userId, programId

    const { programId, userId } = req.body as {
      programId: string;
      userId?: string;
    };

    if (!programId && !userId) {
      res.status(400).json({ message: `Missing required fields.` });
      return;
    }

    if (session?.user?.role === "talent") {
      const events = await prisma.eventEnrollment.findFirst({
        where: {
          programId,
          userId: session.user.id,
        },
      });

      return res.status(200).json({ message: `Events retrieved`, data: events });
    } else {
      const events = await prisma.eventEnrollment.findMany({
        where: {
          userId: userId,
        },
      });

      return res.status(200).json({ message: `Events retrieved`, data: events });
    }

  } catch (error) {
    return (
      res
        .status(500)
        // @ts-ignore
        .json({ message: error.message })
    );
  }
};

export default handler;
