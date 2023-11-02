import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
      API endpoint to 1) add a quiz
      */

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            try {
                // question, choiceA, choiceB, choiceC, choiceD, answer, programId
                const { question, choiceA, choiceB, choiceC, choiceD, answer, programId, explanation } = req.body as {
                    question: string;
                    choiceA: string;
                    choiceB: string;
                    choiceC: string;
                    choiceD: string;
                    answer: string;
                    programId: string;
                    explanation: string;
                };

                const countOfTrueBooleans = (booleansArray: boolean[]) => {
                    return booleansArray.filter((boolean) => boolean).length;
                };

                if (!question || countOfTrueBooleans([!!choiceA, !!choiceB, !!choiceC, !!choiceD]) < 2 || !answer || !programId) return res.status(400).json({ message: `Missing fields.` });

                const createdQuiz = await prisma.quizQuestion.create({
                    data: {
                        question,
                        choiceA,
                        choiceB,
                        choiceC,
                        choiceD,
                        answer,
                        programId,
                        explanation
                    }
                });


                return res
                    .status(200)
                    .json({ message: `Quiz question created!`, data: createdQuiz });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }

        case "PATCH":
            // edit a quiz question given id
            try {
                // mandatory fields: id. optional fields: question, choiceA, choiceB, choiceC, choiceD, answer, programId
                const { id, question, choiceA, choiceB, choiceC, choiceD, answer } = req.body as {
                    id: string;
                    question?: string;
                    choiceA?: string;
                    choiceB?: string;
                    choiceC?: string;
                    choiceD?: string;
                    answer?: string;
                };


                if (!id) return res.status(400).json({ message: `Missing fields.` });

                const quizQuestion = await prisma.quizQuestion.update({
                    where: {
                        id
                    },
                    data: {
                        question,
                        choiceA,
                        choiceB,
                        choiceC,
                        choiceD,
                        answer
                    }
                });

                return res
                    .status(200)
                    .json({ message: `Quiz question updated!`, data: quizQuestion });

            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }

        case "DELETE":
            // delete a question given id
            try {
                const { id } = req.body as {
                    id: string;
                };

                if (!id) return res.status(400).json({ message: `Missing fields.` });

                await prisma.quizQuestion.delete({
                    where: {
                        id
                    }
                });

                return res
                    .status(200)
                    .json({ message: `Quiz question deleted!` });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }
        case "GET":
            // get all quiz questions given programId
            try {
                const { programId } = req.query as {
                    programId: string;
                };

                if (!programId) return res.status(400).json({ message: `Missing fields.` });

                const quizQuestions = await prisma.quizQuestion.findMany({
                    where: {
                        programId
                    }
                });

                return res
                    .status(200)
                    .json({ message: `Quiz questions retrieved!`, data: quizQuestions });
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
