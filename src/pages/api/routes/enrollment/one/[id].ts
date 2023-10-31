import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get one enrollment by id
  try {

    const id = req.query.id as string;
    const enrollment = await prisma.onboardingProgramTalents.findUnique({
      where: {
        id,
      },
      include: {
        OnboardingProgram: {
          include: {
            ProgramSection: true,
            QuizQuestion: true,
            creator: true,
          }
        },
      },
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ message: `Enrollment with ID ${id} not found!` });
    }

    const quizQuestions = enrollment.OnboardingProgram.QuizQuestion.map((question) => {
      const { answer, ...rest } = question;
      console.log(!!answer);
      return rest;
    });

    // @ts-ignore
    enrollment.OnboardingProgram.QuizQuestion = quizQuestions;

    return res
      .status(200)
      .json({ message: `Enrollment found!`, data: enrollment });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
