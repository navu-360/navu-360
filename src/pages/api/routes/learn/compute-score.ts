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

    // compute score for a talent for certain program. Create record for TalentProgramResults. Required fields: userId, programId
    //  we get all talent answers for this program and compute score. talent answers found in TalentQuizAnswers(userId, programId, questionId, talentAnswer) - we use include to get the answer for each question

    const { programId } = req.body as {
      programId: string;
    };

    if (!programId) {
      res.status(400).json({ message: `Missing required fields.` });
      return;
    }

    // all talent answers for this program's quiz
    const talentAnswers = await prisma.talentQuizAnswers.findMany({
      where: {
        programId,
        userId: session.user.id,
      },
      include: {
        Question: true,
      },
    });

    if (!talentAnswers) {
      res.status(400).json({ message: `Talent answers not found.` });
      return;
    }

    // program quiz: id and answer
    const programQuiz = await prisma.quizQuestion.findMany({
      where: {
        programId,
      },
      select: {
        id: true,
        answer: true,
      },
    });

    if (!programQuiz) {
      res.status(400).json({ message: `Program quiz not found.` });
      return;
    }
    // check if all questions have been answered. compare length of talentAnswers and programQuiz
    if (talentAnswers.length !== programQuiz.length) {
      res.status(400).json({ message: `All questions must be answered.` });
      return;
    }

    // compute score
    let score = 0;
    for (let i = 0; i < talentAnswers.length; i++) {
      // @ts-ignore
      if (talentAnswers[i].talentAnswer === programQuiz[i].answer) {
        score++;
      }
    }

    const percentageScore = (score / programQuiz.length) * 100;

    // record score
    const results = await prisma.talentProgramResults.create({
      data: {
        userId: session.user.id,
        programId,
        score: percentageScore,
      },
    });

    return res.status(200).json({ message: `Results computed`, data: results });
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
