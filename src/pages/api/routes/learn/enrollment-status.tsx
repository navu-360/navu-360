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

    const { programId } = req.body as {
      programId: string;
    };

    if (!programId) {
      res.status(400).json({ message: `Missing required fields.` });
      return;
    }

    const events = await prisma.eventEnrollment.findMany({
      where: {
        programId,
        userId: session.user.id,
      },
    });

    return res.status(200).json({ message: `Events retrieved`, data: events });
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
