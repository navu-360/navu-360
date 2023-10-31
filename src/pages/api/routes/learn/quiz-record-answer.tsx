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

    // record answer for talent. Create a new record in TalentQuizAnswers. Required fields: userId, programId,questionId,talentAnswer

    const { programId, questionId, talentAnswer } = req.body as {
      programId: string;
      questionId: string;
      talentAnswer: string;
    };

    if (!programId || !questionId || !talentAnswer) {
      res.status(400).json({ message: `Missing required fields.` });
      return;
    }

    prisma.talentQuizAnswers.upsert({
      where: {
        userId_programId_questionId: {
          userId: session.user.id,
          programId,
          questionId,
        },
      },
      update: {
        talentAnswer,
      },
      create: {
        userId: session.user.id,
        programId,
        questionId,
        talentAnswer,
      },
    });

    return res.status(200).json({ message: `Answer recorded` });
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
