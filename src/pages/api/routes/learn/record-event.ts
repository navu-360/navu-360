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

    // record event: model is EventEnrollment. fields: userId, programId, viewedCourse, courseCompleted, quizCompleted,scoreComputed,viewedChapters(many to one FK) to ProgramSection
    // we use upsert

    const {
      programId,
      viewedCourse,
      courseCompleted,
      quizCompleted,
      scoreComputed,
      viewChapterId,
    } = req.body as {
      programId: string;
      viewedCourse: boolean;
      courseCompleted: boolean;
      quizCompleted: boolean;
      scoreComputed: boolean;
      viewChapterId: string;
    };

    if (!programId) {
      res.status(400).json({ message: `Missing required fields.` });
      return;
    }

    const event = await prisma.eventEnrollment.findFirst({
      where: {
        programId,
        userId: session.user.id,
      },
    });

    if (event?.viewedChapters?.includes(viewChapterId)) {
      return res.status(200).json({ message: `Event recorded` });
    }

    await prisma.eventEnrollment.upsert({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId,
        },
      },
      update: {
        viewedCourse: viewedCourse ?? event?.viewedCourse ?? false,
        courseCompleted: courseCompleted ?? event?.courseCompleted ?? false,
        quizCompleted: quizCompleted ?? event?.quizCompleted ?? false,
        scoreComputed: scoreComputed ?? event?.scoreComputed ?? false,
        viewedChapters: viewChapterId ? {
          push: viewChapterId,
        } : event?.viewedChapters ?? [],
      },
      // create only called when viewing course
      create: {
        userId: session.user.id,
        programId,
        viewedCourse,
      },
    });

    return res.status(200).json({ message: `Event recorded` });
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
